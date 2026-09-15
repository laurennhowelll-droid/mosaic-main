import { NextResponse } from "next/server";
import { logLeadNotificationFailure, sendLeadNotification } from "../../../lib/lead-notifications";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

const budgets = new Set([
  "$2,500–$5,000",
  "$5,000–$10,000",
  "$10,000–$20,000",
  "$20,000+",
  "Not sure yet",
]);

const emailPattern = /^\S+@\S+\.\S+$/;

type LeadPayload = {
  companyName?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  website?: unknown;
  businessDescription?: unknown;
  problems?: unknown;
  success?: unknown;
  budget?: unknown;
  timeline?: unknown;
  source?: unknown;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const companyName = clean(payload.companyName);
  const contactName = clean(payload.contactName);
  const email = clean(payload.email).toLowerCase();
  const phone = clean(payload.phone) || null;
  const website = clean(payload.website) || null;
  const businessDescription = clean(payload.businessDescription);
  const problems = clean(payload.problems);
  const success = clean(payload.success);
  const budget = clean(payload.budget);
  const timeline = clean(payload.timeline);
  const source = clean(payload.source);
  const isClaritySession = source === "clarity_session";
  const isServiceEntry = source.startsWith("service_entry_");

  if (!companyName || !contactName || !email || !problems) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  if (!isClaritySession && !isServiceEntry && (!businessDescription || !success || !budget)) {
    return NextResponse.json(
      { error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!isClaritySession && !isServiceEntry && !budgets.has(budget)) {
    return NextResponse.json(
      { error: "Please choose an approximate budget." },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    const leadInsert = await supabase.from("leads").insert({
      company_name: companyName,
      contact_name: contactName,
      email,
      phone,
      website,
      problems,
      budget: isClaritySession || isServiceEntry ? "Not sure yet" : budget,
      source: isClaritySession ? "clarity_session" : isServiceEntry ? source : "website_start_with_vision",
      status: "new",
      notes: isServiceEntry
        ? [
            `Lead type: ${source.replace("service_entry_", "").replaceAll("_", " ")}`,
            businessDescription ? `What the business does: ${businessDescription}` : null,
            success ? `What they want help with: ${success}` : null,
            timeline ? `Preferred timeline: ${timeline}` : null,
          ]
            .filter(Boolean)
            .join("\n\n")
        : isClaritySession
        ? [
            "Lead type: Clarity Session",
            timeline ? `Preferred timeline: ${timeline}` : null,
          ]
            .filter(Boolean)
            .join("\n\n")
        : [
            `What the business does: ${businessDescription}`,
            `Six-month success: ${success}`,
            timeline ? `Timeline: ${timeline}` : null,
          ]
            .filter(Boolean)
            .join("\n\n"),
    }).select("id").single();

    if (leadInsert.error || !leadInsert.data) {
      console.error("Lead insert failed", leadInsert.error);
      return NextResponse.json(
        { error: "We couldn't save your submission. Please try again." },
        { status: 500 },
      );
    }

    try {
      const service = isServiceEntry ? source.replace("service_entry_", "").replaceAll("_", " ") : null;
      const notification = await sendLeadNotification({
        type: isClaritySession ? "clarity_call" : isServiceEntry ? "service_inquiry" : "lead",
        name: contactName,
        businessName: companyName,
        email,
        phone,
        website,
        selectedService: service,
        timeline,
        primaryChallenge: problems,
        openResponses: [
          businessDescription ? `What the business does: ${businessDescription}` : "",
          problems ? `Primary challenge: ${problems}` : "",
          success ? `Desired outcome: ${success}` : "",
          timeline ? `Timeline: ${timeline}` : "",
          budget ? `Budget: ${budget}` : "",
        ],
        leadId: leadInsert.data.id,
      });

      if (notification.attempted && !notification.accepted) {
        await logLeadNotificationFailure("lead notification rejected", notification.reason);
      }
    } catch (error) {
      await logLeadNotificationFailure("lead notification exception", error);
    }
  } catch (error) {
    console.error("Lead submission failed", error);
    return NextResponse.json(
      { error: "We couldn't save your submission. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
