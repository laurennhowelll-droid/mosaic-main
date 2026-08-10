import { NextResponse } from "next/server";
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
  problems?: unknown;
  budget?: unknown;
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
  const problems = clean(payload.problems);
  const budget = clean(payload.budget);

  if (!companyName || !contactName || !email || !problems || !budget) {
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

  if (!budgets.has(budget)) {
    return NextResponse.json(
      { error: "Please choose an approximate budget." },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("leads").insert({
      company_name: companyName,
      contact_name: contactName,
      email,
      phone,
      website,
      problems,
      budget,
      source: "start_with_vision",
      status: "new",
    });

    if (error) {
      console.error("Lead insert failed", error);
      return NextResponse.json(
        { error: "We couldn't save your submission. Please try again." },
        { status: 500 },
      );
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
