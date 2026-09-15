import { NextResponse } from "next/server";
import { logLeadNotificationFailure, sendLeadNotification } from "../../../lib/lead-notifications";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const email = formData.get("email");

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const supabase = getSupabaseServerClient();
    const leadInsert = await supabase.from("leads").insert({
      company_name: "Legacy Contact Form",
      contact_name: "Contact Form Subscriber",
      email: cleanEmail,
      phone: null,
      website: null,
      problems: "Legacy contact form submission.",
      budget: "Not sure yet",
      source: "legacy_contact",
      status: "new",
      notes: "Submitted through older public contact form route.",
    }).select("id").single();

    if (leadInsert.error || !leadInsert.data) {
      console.error("Contact lead insert failed", leadInsert.error);
      return NextResponse.json({ error: "We couldn't save your submission. Please try again." }, { status: 500 });
    }

    try {
      const notification = await sendLeadNotification({
        type: "contact",
        name: "Contact Form Subscriber",
        businessName: "Legacy Contact Form",
        email: cleanEmail,
        selectedService: "General contact",
        primaryChallenge: "Legacy contact form submission.",
        openResponses: ["Submitted through older public contact form route."],
        leadId: leadInsert.data.id,
      });

      if (notification.attempted && !notification.accepted) {
        await logLeadNotificationFailure("contact notification rejected", notification.reason);
      }
    } catch (error) {
      await logLeadNotificationFailure("contact notification exception", error);
    }
  } catch (error) {
    console.error("Contact submission failed", error);
    return NextResponse.json({ error: "We couldn't save your submission. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
