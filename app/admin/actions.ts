"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminRefreshCookie,
  adminSessionCookie,
  getAdminProfile,
  getAuthClient,
  getPlanStartingRevenue,
  pipelineStages,
  planOptions,
  requireAdmin,
} from "../../lib/supabase/admin";
import { getSupabaseServerClient } from "../../lib/supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithmosaic.co";

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isPipelineStage(value: string) {
  return pipelineStages.some(([stage]) => stage === value);
}

function isPlanOption(value: string): value is (typeof planOptions)[number][0] {
  return planOptions.some(([plan]) => plan === value);
}

function isReviewStatus(value: string) {
  return ["unreviewed", "reviewed", "follow_up_needed"].includes(value);
}

function optionalNumber(value: string) {
  if (value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error("Target values must be positive numbers.");
  }
  return number;
}

async function sendMosaicEmail({ to, subject, eyebrow, heading, body, ctaHref, ctaLabel }: { to: string; subject: string; eyebrow: string; heading: string; body: string; ctaHref?: string; ctaLabel?: string }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const paragraphs = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 16px;color:#42433f;font-size:16px;line-height:1.7;">${line}</p>`)
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mosaic <reports@buildwithmosaic.co>",
      to: [to],
      subject,
      html: `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f0e9;margin:0;padding:0;font-family:Arial,sans-serif;color:#202124;">
          <tr>
            <td align="center" style="padding:36px 18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#f8f7f3;border:1px solid #ded6ca;">
                <tr>
                  <td style="padding:34px;">
                    <img src="${siteUrl}/brand-reference/main-logo.svg" width="170" alt="Mosaic" style="display:block;border:0;margin-bottom:34px;">
                    <p style="margin:0 0 14px;color:#555b44;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">${eyebrow}</p>
                    <h1 style="margin:0 0 28px;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:.98;font-weight:500;letter-spacing:-1px;color:#202124;">${heading}</h1>
                    ${paragraphs}
                    ${ctaHref && ctaLabel ? `<p style="margin:28px 0 0;"><a href="${ctaHref}" style="display:inline-block;background:#7a8266;color:#ffffff;text-decoration:none;padding:13px 18px;font-size:12px;letter-spacing:1px;text-transform:uppercase;">${ctaLabel}</a></p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export async function signInAdmin(_: unknown, formData: FormData) {
  if (!supabaseUrl || !supabasePublishableKey) {
    return { error: "Supabase environment variables are not configured." };
  }

  const email = clean(formData.get("email")).toLowerCase();
  const password = clean(formData.get("password"));

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = getAuthClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return { error: "Invalid email or password." };
  }

  const employee = await getAdminProfile(data.session.access_token);

  if (!employee) {
    return { error: "This account is not authorized for Mosaic admin." };
  }

  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookie, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: data.session.expires_in,
  });
  cookieStore.set(adminRefreshCookie, data.session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookie);
  cookieStore.delete(adminRefreshCookie);
  redirect("/admin/login");
}

export async function updateLead(leadId: string, formData: FormData) {
  await requireAdmin();

  const pipelineStage = clean(formData.get("pipeline_stage"));
  const selectedPlan = clean(formData.get("selected_plan")) || "not_selected";
  const projectedRevenueValue = clean(formData.get("projected_revenue"));
  const internalNotes = clean(formData.get("internal_notes")) || null;

  if (!isPipelineStage(pipelineStage)) {
    throw new Error("Invalid pipeline stage.");
  }

  if (!isPlanOption(selectedPlan)) {
    throw new Error("Invalid selected plan.");
  }

  const projectedRevenue =
    projectedRevenueValue === "" ? getPlanStartingRevenue(selectedPlan) : Number(projectedRevenueValue);

  if (projectedRevenue !== null && (!Number.isFinite(projectedRevenue) || projectedRevenue < 0)) {
    throw new Error("Projected revenue must be a positive number.");
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("leads")
    .update({
      pipeline_stage: pipelineStage,
      selected_plan: selectedPlan,
      projected_revenue: projectedRevenue,
      internal_notes: internalNotes,
      last_updated: new Date().toISOString(),
    })
    .eq("id", leadId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${leadId}`);
  redirect(`/admin/leads/${leadId}`);
}

export async function declineLeadAfterDiscovery(leadId: string, formData: FormData) {
  await requireAdmin();

  const internalReason = clean(formData.get("internal_reason"));
  const clientNote = clean(formData.get("client_note"));
  const recommendedNextStep = clean(formData.get("recommended_next_step"));
  const supabase = getSupabaseServerClient();
  const { data: lead, error: leadError } = await supabase.from("leads").select("*").eq("id", leadId).single();

  if (leadError || !lead) {
    throw new Error(leadError?.message ?? "Lead not found.");
  }

  const firstName = String(lead.contact_name ?? "there").split(" ")[0];
  const body = [
    `Hi ${firstName},`,
    `Thank you again for taking the time to talk with me about ${lead.company_name}.`,
    "I appreciated getting a clearer picture of what you're building and where things are feeling complicated.",
    "After looking at everything we discussed, I don't think Mosaic is the best partner for this particular next step right now.",
    clientNote,
    "That doesn't mean there isn't a good path forward.",
    recommendedNextStep ? `Based on our conversation, I'd consider starting with: ${recommendedNextStep}.` : "",
    "I'd rather be clear about fit than recommend an engagement that isn't the right use of your time or investment.",
    "Thank you for considering Mosaic, and I hope our paths cross again.",
    "Lauren",
    "Mosaic",
    "When every piece has purpose, everything works beautifully.",
  ].filter(Boolean).join("\n\n");

  await sendMosaicEmail({
    to: lead.email,
    subject: "A note from Mosaic",
    eyebrow: "A Note From Mosaic",
    heading: "Thank you for the conversation.",
    body,
  });

  const decisionNotes = [
    internalReason ? `Internal reason: ${internalReason}` : "",
    clientNote ? `Client-facing note: ${clientNote}` : "",
    recommendedNextStep ? `Recommended next step: ${recommendedNextStep}` : "",
  ].filter(Boolean).join("\n");

  const { error } = await supabase
    .from("leads")
    .update({
      discovery_decision: "declined",
      discovery_decision_at: new Date().toISOString(),
      discovery_decision_notes: decisionNotes || null,
      discovery_email_sent_at: new Date().toISOString(),
      pipeline_stage: "not_a_fit",
      status: "not_a_fit",
      last_updated: new Date().toISOString(),
    })
    .eq("id", leadId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function acceptLeadAfterDiscovery(leadId: string, formData: FormData) {
  await requireAdmin();

  const email = clean(formData.get("client_email")).toLowerCase();
  const primaryContactName = clean(formData.get("client_name"));
  const companyName = clean(formData.get("company_name"));

  if (!email || !primaryContactName || !companyName) {
    throw new Error("Client email, name, and company are required.");
  }

  const supabase = getSupabaseServerClient();
  const { data: lead, error: leadError } = await supabase.from("leads").select("*").eq("id", leadId).single();

  if (leadError || !lead) {
    throw new Error(leadError?.message ?? "Lead not found.");
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .upsert(
      {
        lead_id: leadId,
        company_name: companyName,
        primary_contact_name: primaryContactName,
        email,
        status: "onboarding",
        current_engagement: "Vision",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .select("*")
    .single();

  if (clientError || !client) {
    throw new Error(clientError?.message ?? "Could not create client.");
  }

  const { error: assessmentError } = await supabase
    .from("business_health_assessments")
    .upsert(
      {
        client_id: client.id,
        status: "not_started",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "client_id" },
    );

  if (assessmentError) throw new Error(assessmentError.message);

  const firstName = primaryContactName.split(" ")[0];
  await sendMosaicEmail({
    to: email,
    subject: "Welcome to Mosaic",
    eyebrow: "Welcome To Mosaic",
    heading: "Your private Mosaic workspace is ready.",
    ctaHref: `${siteUrl}/client/login`,
    ctaLabel: "Enter Your Mosaic Workspace →",
    body: [
      `Hi ${firstName},`,
      "I'm excited to continue the conversation.",
      "Based on what we discussed during Discovery, I think there's a meaningful opportunity for us to work together.",
      "I've created your private Mosaic workspace.",
      "This will become the home for the work ahead — beginning with a deeper look at your business.",
      "Your first step is the Business Health Assessment.",
      "It takes about 15-20 minutes and gives me the context I need before we begin the Vision process.",
      "Inside your workspace you'll be able to complete your Business Health Assessment, see what's coming next, access important project information, and follow your engagement as it progresses.",
      "Use the same email address this invitation was sent to.",
      "Looking forward to building this with you.",
      "Lauren",
      "Mosaic",
    ].join("\n\n"),
  });

  const { error: leadUpdateError } = await supabase
    .from("leads")
    .update({
      discovery_decision: "accepted",
      discovery_decision_at: new Date().toISOString(),
      discovery_decision_notes: "Accepted after Discovery. Client record created and welcome email sent.",
      discovery_email_sent_at: new Date().toISOString(),
      pipeline_stage: "working_on_plan",
      status: "qualified",
      selected_plan: "vision",
      last_updated: new Date().toISOString(),
    })
    .eq("id", leadId);

  if (leadUpdateError) throw new Error(leadUpdateError.message);

  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${leadId}`);
  redirect(`/admin/leads/${leadId}`);
}

export async function updateClarityAssessmentStatus(assessmentId: string, formData: FormData) {
  await requireAdmin();

  const reviewStatus = clean(formData.get("review_status"));

  if (!isReviewStatus(reviewStatus)) {
    throw new Error("Invalid review status.");
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("clarity_assessments")
    .update({ review_status: reviewStatus })
    .eq("id", assessmentId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/clarity");
  revalidatePath(`/admin/clarity/${assessmentId}`);
}

export async function updateGrowthCampaign(campaignId: string, formData: FormData) {
  await requireAdmin();

  const campaignName = clean(formData.get("campaign_name")) || "Mosaic Launch — 90 Days";
  const startDate = clean(formData.get("start_date"));
  const endDate = clean(formData.get("end_date"));
  const notes = clean(formData.get("notes")) || null;

  if (!startDate || !endDate) {
    throw new Error("Campaign dates are required.");
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("growth_campaigns")
    .update({ campaign_name: campaignName, start_date: startDate, end_date: endDate, notes })
    .eq("id", campaignId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/growth");
}

export async function addGrowthActivity(campaignId: string, formData: FormData) {
  await requireAdmin();

  const activityType = clean(formData.get("activity_type"));
  const activityDate = clean(formData.get("activity_date")) || new Date().toISOString().slice(0, 10);
  const count = Number(clean(formData.get("count")) || "1");
  const url = clean(formData.get("url")) || null;
  const notes = clean(formData.get("notes")) || null;

  if (!activityType || !Number.isInteger(count) || count < 1) {
    throw new Error("Activity type and a positive count are required.");
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("growth_activity").insert({
    campaign_id: campaignId,
    activity_date: activityDate,
    activity_type: activityType,
    count,
    url,
    notes,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/growth");
}

export async function addContentTrackerItem(campaignId: string, formData: FormData) {
  await requireAdmin();

  const title = clean(formData.get("title"));
  const postType = clean(formData.get("post_type"));
  const status = clean(formData.get("status")) || "idea";
  const publishDate = clean(formData.get("publish_date")) || null;
  const url = clean(formData.get("url")) || null;
  const notes = clean(formData.get("notes")) || null;

  if (!title || !postType) {
    throw new Error("Title and post type are required.");
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("content_tracker").insert({
    campaign_id: campaignId,
    title,
    post_type: postType,
    status,
    publish_date: publishDate,
    url,
    notes,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/growth");
}

export async function updateGrowthTargets(campaignId: string, formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseServerClient();
  const targetIds = formData.getAll("target_id").map((value) => clean(value));

  for (const id of targetIds) {
    const weeklyTarget = optionalNumber(clean(formData.get(`weekly_target_${id}`)));
    const campaignTarget = optionalNumber(clean(formData.get(`campaign_target_${id}`)));
    const { error } = await supabase
      .from("growth_targets")
      .update({
        weekly_target: weeklyTarget,
        campaign_target: campaignTarget,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("campaign_id", campaignId);

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/admin/growth");
}
