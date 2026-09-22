import { NextResponse } from "next/server";
import {
  calculateClarityResult,
  categoryLabel,
  clarityQuestions,
  resultBandLabel,
  type ClarityAnswer,
} from "../../../lib/clarity-check";
import { logLeadNotificationFailure, sendLeadNotification } from "../../../lib/lead-notifications";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

const emailPattern = /^\S+@\S+\.\S+$/;
const discoveryCallUrl = "https://calendar.app.google/JxAn6pJFxwyu1FJq6";

type QualifyingPayload = {
  businessType?: unknown;
  servicesProvided?: unknown;
  monthlyLeads?: unknown;
  teamAccess?: unknown;
  currentTools?: unknown;
  leadTracking?: unknown;
  hardestPart?: unknown;
  improvementGoal?: unknown;
  supportType?: unknown;
  priorityTimeline?: unknown;
  firstName?: unknown;
  businessName?: unknown;
  email?: unknown;
  website?: unknown;
  consent?: unknown;
  answers?: unknown;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validAnswers(value: unknown): ClarityAnswer[] | null {
  if (!Array.isArray(value)) return null;

  const expected = new Map<string, string>(clarityQuestions.map((question) => [question.id, question.category]));
  const answers = value.map((answer) => ({
    id: clean(answer?.id),
    category: clean(answer?.category),
    score: Number(answer?.score),
  }));

  if (answers.length !== clarityQuestions.length) return null;

  for (const answer of answers) {
    if (expected.get(answer.id) !== answer.category || !Number.isInteger(answer.score) || answer.score < 1 || answer.score > 5) {
      return null;
    }
  }

  return answers as ClarityAnswer[];
}

async function sendReportEmail({
  firstName,
  email,
  result,
}: {
  firstName: string;
  email: string;
  result: ReturnType<typeof calculateClarityResult>;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mosaic <reports@buildwithmosaic.co>",
      to: [email],
      subject: "Your Mosaic Clarity Check Results",
      html: `
        <div style="font-family:Arial,sans-serif;background:#f4f0e9;color:#202124;padding:32px;">
          <div style="max-width:680px;margin:auto;background:#f8f7f3;border:1px solid #ded6ca;padding:32px;">
            <p style="text-transform:uppercase;letter-spacing:2px;color:#555b44;font-size:11px;font-weight:bold;">Mosaic Clarity Check</p>
            <h1 style="font-family:Georgia,serif;font-size:42px;line-height:1;margin:0 0 20px;">Here is what your answers revealed.</h1>
            <p>Hi ${firstName},</p>
            <p>This is a preliminary self-assessment, not a full systems audit.</p>
            <div style="background:#ece5da;border:1px solid #d7cfc2;padding:24px;margin:24px 0;">
              <p style="margin:0;text-transform:uppercase;letter-spacing:2px;font-size:11px;color:#555b44;">Your Result</p>
              <p style="font-family:Georgia,serif;font-size:52px;margin:12px 0 4px;">${result.totalScore} / ${result.maxScore}</p>
              <p style="font-family:Georgia,serif;font-size:26px;margin:0;color:#7a8266;">${resultBandLabel(result.resultBand)}</p>
            </div>
            <p><strong>Strongest category:</strong> ${categoryLabel(result.strongestCategory)}</p>
            <p><strong>Greatest opportunity:</strong> ${result.primaryGap}</p>
            <p><strong>Recommended starting point:</strong> ${result.recommendedService}</p>
            <p>${result.recommendation}</p>
            <p><a href="${discoveryCallUrl}" style="display:inline-block;background:#7a8266;color:white;padding:13px 18px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;font-size:12px;">Explore What We Could Build</a></p>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) throw new Error(await response.text());
  return true;
}

export async function POST(request: Request) {
  let payload: QualifyingPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const firstName = clean(payload.firstName);
  const email = clean(payload.email).toLowerCase();
  const businessName = clean(payload.businessName) || null;
  const website = clean(payload.website) || null;
  const answers = validAnswers(payload.answers);

  if (!firstName || !email || !answers) {
    return NextResponse.json({ success: false, error: "Please complete the required fields." }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const result = calculateClarityResult(answers);
  const supabase = getSupabaseServerClient();

  const context = [
    `Business type: ${clean(payload.businessType) || "Not provided"}`,
    `Services: ${clean(payload.servicesProvided) || "Not provided"}`,
    `Typical monthly leads: ${clean(payload.monthlyLeads) || "Not provided"}`,
    `Team access needs: ${clean(payload.teamAccess) || "Not provided"}`,
    `Current tools: ${clean(payload.currentTools) || "Not provided"}`,
    `Lead tracking: ${clean(payload.leadTracking) || "Not provided"}`,
    `Hardest part: ${clean(payload.hardestPart) || "Not provided"}`,
    `Improve next: ${clean(payload.improvementGoal) || "Not provided"}`,
    `Looking for: ${clean(payload.supportType) || "Not provided"}`,
    `Priority timeline: ${clean(payload.priorityTimeline) || "Not provided"}`,
    website ? `Website: ${website}` : null,
    `Consent to insights: ${payload.consent === true ? "Yes" : "No"}`,
  ].filter((item): item is string => Boolean(item));

  const leadPayload = {
    company_name: businessName ?? "Clarity Check",
    contact_name: firstName,
    email,
    website,
    problems: `Clarity Check result: ${resultBandLabel(result.resultBand)}. Primary gap: ${result.primaryGap}.`,
    budget: "Not sure yet",
    source: "clarity_check",
    status: "new",
    notes: [
      `Clarity Score: ${result.totalScore} / ${result.maxScore}`,
      `Result Band: ${resultBandLabel(result.resultBand)}`,
      `Strongest Category: ${categoryLabel(result.strongestCategory)}`,
      `Primary Gap: ${result.primaryGap}`,
      `Recommended Service: ${result.recommendedService}`,
      "",
      ...context,
    ].join("\n"),
  };

  const { data: existingLead } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const leadResult = existingLead
    ? await supabase.from("leads").update({ ...leadPayload, last_updated: new Date().toISOString() }).eq("id", existingLead.id).select("id").single()
    : await supabase.from("leads").insert(leadPayload).select("id").single();

  if (leadResult.error || !leadResult.data) {
    return NextResponse.json({ success: false, error: leadResult.error?.message ?? "Lead save failed." }, { status: 500 });
  }

  const assessmentInsert = await supabase
    .from("clarity_assessments")
    .insert({
      first_name: firstName,
      email,
      company_name: businessName,
      total_score: result.totalScore,
      result_band: result.resultBand,
      vision_score: result.captureScore,
      experience_score: result.followUpScore,
      systems_score: result.connectionScore,
      operations_score: result.visibilityScore,
      growth_score: 0,
      strongest_category: result.strongestCategory,
      weakest_category: result.weakestCategory,
      primary_gap: result.primaryGap,
      recommended_service: result.recommendedService,
      answers: { scored: answers, context },
      lead_id: leadResult.data.id,
    })
    .select("id")
    .single();

  if (assessmentInsert.error || !assessmentInsert.data) {
    return NextResponse.json({ success: false, error: assessmentInsert.error?.message ?? "Assessment save failed." }, { status: 500 });
  }

  let emailSent = false;
  try {
    emailSent = await sendReportEmail({ firstName, email, result });
  } catch (error) {
    console.error("Clarity result email failed", error);
  }

  if (emailSent) {
    await supabase.from("clarity_assessments").update({ email_sent_at: new Date().toISOString() }).eq("id", assessmentInsert.data.id);
  }

  try {
    const notification = await sendLeadNotification({
      type: "clarity_check",
      name: firstName,
      businessName,
      email,
      website,
      selectedService: result.recommendedService,
      supportType: clean(payload.supportType),
      timeline: clean(payload.priorityTimeline),
      primaryChallenge: result.primaryGap,
      clarityScores: {
        total: result.totalScore,
        max: result.maxScore,
        result: resultBandLabel(result.resultBand),
        strongest: categoryLabel(result.strongestCategory),
        gap: result.primaryGap,
        recommendedService: result.recommendedService,
      },
      openResponses: context,
      leadId: leadResult.data.id,
      assessmentId: assessmentInsert.data.id,
    });

    if (notification.attempted && !notification.accepted) {
      await logLeadNotificationFailure("clarity check notification rejected", notification.reason);
    }
  } catch (error) {
    await logLeadNotificationFailure("clarity check notification exception", error);
  }

  return NextResponse.json({ success: true, emailSent });
}
