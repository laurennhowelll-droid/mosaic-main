import { NextResponse } from "next/server";
import { createAccessToken, hashAccessToken } from "../../../lib/systems-score-access";
import { buildSystemsScoreReportEmail, systemsScoreReportEmailEnabled } from "../../../lib/systems-score-email";
import { fixesForLeaks } from "../../../lib/systems-score-fixes";
import { logLeadNotificationFailure, sendLeadNotification } from "../../../lib/lead-notifications";
import { getSupabaseServerClient } from "../../../lib/supabase/server";
import {
  adminHourOptions,
  buildStoredSystemsScore,
  clientValueOptions,
  emailDeliveryPlan,
  readStoredSystemsScore,
  sectionLabels,
  type StoredSystemsScoreV2,
} from "../../../lib/systems-score-v2";

const emailPattern = /^\S+@\S+\.\S+$/;
const submissionPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function noStore(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function publicResult(stored: StoredSystemsScoreV2) {
  const fixes = fixesForLeaks(stored.leaks.map((leak) => leak.id)).map((fix) => {
    const leak = stored.leaks.find((item) => item.id === fix.id);
    return { id: fix.id, name: leak?.name ?? fix.title, kind: leak?.kind ?? "leak", title: fix.title, steps: [...fix.steps] };
  });
  return { fixes };
}

function validClientValue(value: unknown) {
  if (value === null) return true;
  return typeof value === "number" && clientValueOptions.some((option) => option.value === value);
}

export async function POST(request: Request) {
  let payload: {
    submissionId?: unknown;
    firstName?: unknown;
    email?: unknown;
    answers?: unknown;
    adminHours?: unknown;
    clientValue?: unknown;
  };

  try {
    payload = await request.json();
  } catch {
    return noStore({ success: false, error: "Please check the form and try again." }, 400);
  }

  const submissionId = clean(payload.submissionId);
  const firstName = clean(payload.firstName);
  const email = clean(payload.email).toLowerCase();
  const answers = Array.isArray(payload.answers) ? payload.answers.map(Number) : [];
  const adminHours = Number(payload.adminHours);
  const clientValue = payload.clientValue === null ? null : Number(payload.clientValue);

  if (!submissionPattern.test(submissionId) || !firstName || firstName.length > 100 || email.length > 254 || !emailPattern.test(email)) {
    return noStore({ success: false, error: "Please enter your first name and a valid email address." }, 400);
  }
  if (answers.length !== 12 || answers.some((answer) => !Number.isInteger(answer) || answer < 1 || answer > 4) || !adminHourOptions.some((option) => option.value === adminHours) || !validClientValue(clientValue)) {
    return noStore({ success: false, error: "Please check the form and try again." }, 400);
  }

  const supabase = getSupabaseServerClient();
  const { data: existing, error: lookupError } = await supabase
    .from("clarity_assessments")
    .select("id, email, email_sent_at, lead_id, first_name, answers")
    .eq("submission_id", submissionId)
    .maybeSingle();

  if (lookupError) {
    console.error("Systems Score lookup failed", lookupError.message);
    return noStore({ success: false, error: "We couldn't save your fixes. Your results are still here. Please try again." }, 500);
  }

  if (existing && existing.email !== email) {
    return noStore({ success: false, error: "Please check the form and try again." }, 400);
  }

  let assessmentId = existing?.id as string | undefined;
  let leadId = existing?.lead_id as string | null | undefined;
  let emailSentAt = existing?.email_sent_at as string | null | undefined;
  let stored = existing ? readStoredSystemsScore(existing.answers) : null;

  if (!existing) {
    stored = buildStoredSystemsScore({ submissionId, answers, adminHours, clientValue });
    const saved = await saveSubmission({ supabase, firstName, email, stored });
    if (!saved.ok) return noStore({ success: false, error: saved.error }, saved.status);
    assessmentId = saved.assessmentId;
    leadId = saved.leadId;
    emailSentAt = null;
  }

  if (!assessmentId || !stored) {
    return noStore({ success: false, error: "We couldn't save your fixes. Your results are still here. Please try again." }, 500);
  }

  const delivery = await deliverReport({
    supabase,
    assessmentId,
    leadId: leadId ?? null,
    firstName: existing?.first_name || firstName,
    email,
    stored,
    emailSentAt: emailSentAt ?? null,
  });

  return noStore({ success: true, assessmentId, emailSent: delivery.emailSent, emailStatus: delivery.emailStatus, ...publicResult(stored) });
}

async function saveSubmission({
  supabase,
  firstName,
  email,
  stored,
}: {
  supabase: ReturnType<typeof getSupabaseServerClient>;
  firstName: string;
  email: string;
  stored: StoredSystemsScoreV2;
}) {
  const { data: existingLead, error: leadLookupError } = await supabase
    .from("leads")
    .select("id, company_name, notes, source, problems, contact_name")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (leadLookupError) {
    console.error("Systems Score lead lookup failed", leadLookupError.message);
    return { ok: false as const, status: 500, error: "We couldn't save your fixes. Your results are still here. Please try again." };
  }

  const companyName = existingLead?.company_name && existingLead.company_name !== "Systems Score" ? existingLead.company_name : "Systems Score";
  const noteBlock = [
    "Source: Systems Score v2",
    `Submission: ${stored.submissionId}`,
    `Systems Score: ${stored.overall} / 100`,
    `Tier: ${stored.tierName}`,
    `Weakest section: ${sectionLabels[stored.weakestSection]}`,
    `Top leak: ${stored.leaks[0]?.name ?? "None"}`,
    `Leak 2: ${stored.leaks[1]?.name ?? "None"}`,
    `Leak 3: ${stored.leaks[2]?.name ?? "None"}`,
    `Section scores: ${stored.sections.capture.score}, ${stored.sections.follow_up.score}, ${stored.sections.connection.score}, ${stored.sections.visibility.score}`,
    `Admin hours band: ${stored.adminHoursBand}`,
    `Client value band: ${stored.clientValueBand}`,
    `Date taken: ${new Date().toISOString()}`,
  ].join("\n");
  const notes = existingLead?.notes?.includes(stored.submissionId) ? existingLead.notes : [existingLead?.notes, noteBlock].filter(Boolean).join("\n\n");
  const sharedFields = {
    contact_name: firstName,
    email,
    problems: `Systems Score v2: ${stored.overall}/100, ${stored.tierName}. Top leak: ${stored.leaks[0]?.name ?? "None"}.`,
    source: "Systems Score v2",
    notes,
    last_updated: new Date().toISOString(),
  };

  const leadResult = existingLead
    ? await supabase.from("leads").update({
      ...sharedFields,
      ...(!existingLead.company_name || existingLead.company_name === "Systems Score" ? { company_name: "Systems Score" } : {}),
    }).eq("id", existingLead.id).select("id").single()
    : await supabase.from("leads").insert({
      ...sharedFields,
      company_name: "Systems Score",
      budget: "Not sure yet",
      status: "new",
    }).select("id").single();

  if (leadResult.error || !leadResult.data) {
    console.error("Systems Score lead save failed", leadResult.error?.message);
    return { ok: false as const, status: 500, error: "We couldn't save your fixes. Your results are still here. Please try again." };
  }

  const assessmentResult = await supabase.from("clarity_assessments").insert({
    submission_id: stored.submissionId,
    first_name: firstName,
    email,
    company_name: companyName === "Systems Score" ? null : companyName,
    total_score: stored.overall,
    result_band: stored.tierName,
    vision_score: stored.sections.capture.score,
    experience_score: stored.sections.follow_up.score,
    systems_score: stored.sections.connection.score,
    operations_score: stored.sections.visibility.score,
    growth_score: 0,
    strongest_category: stored.strongestSection,
    weakest_category: stored.weakestSection,
    primary_gap: stored.leaks[0]?.name ?? stored.weakestSection,
    recommended_service: "CRM & Systems",
    answers: { version: 2, submissionId: stored.submissionId, systemsScoreV2: stored, consent: true },
    lead_id: leadResult.data.id,
  }).select("id").single();

  if (assessmentResult.error?.code === "23505") {
    const again = await supabase
      .from("clarity_assessments")
      .select("id, lead_id, email")
      .eq("submission_id", stored.submissionId)
      .maybeSingle();
    if (again.data && again.data.email === email) {
      return { ok: true as const, assessmentId: again.data.id as string, leadId: (again.data.lead_id as string | null) ?? leadResult.data.id as string };
    }
  }

  if (assessmentResult.error || !assessmentResult.data) {
    console.error("Systems Score assessment save failed", assessmentResult.error?.message);
    if (existingLead) {
      await supabase.from("leads").update({
        company_name: existingLead.company_name,
        notes: existingLead.notes,
        source: existingLead.source,
        problems: existingLead.problems,
        contact_name: existingLead.contact_name,
      }).eq("id", existingLead.id);
    } else if (leadResult.data?.id) {
      await supabase.from("leads").delete().eq("id", leadResult.data.id);
    }
    return { ok: false as const, status: 500, error: "We couldn't save your fixes. Your results are still here. Please try again." };
  }

  return { ok: true as const, assessmentId: assessmentResult.data.id as string, leadId: leadResult.data.id as string };
}

async function deliverReport({
  supabase,
  assessmentId,
  leadId,
  firstName,
  email,
  stored,
  emailSentAt,
}: {
  supabase: ReturnType<typeof getSupabaseServerClient>;
  assessmentId: string;
  leadId: string | null;
  firstName: string;
  email: string;
  stored: StoredSystemsScoreV2;
  emailSentAt: string | null;
}) {
  const plan = emailDeliveryPlan(emailSentAt, systemsScoreReportEmailEnabled());
  if (plan === "already_sent") return { emailSent: true, emailStatus: "sent" as const };
  if (plan === "disabled") return { emailSent: false, emailStatus: "disabled" as const };

  const token = createAccessToken();
  await supabase.from("systems_score_access_tokens").update({ revoked_at: new Date().toISOString() }).eq("assessment_id", assessmentId).is("revoked_at", null);
  const tokenInsert = await supabase.from("systems_score_access_tokens").insert({
    assessment_id: assessmentId,
    token_hash: hashAccessToken(token),
  }).select("id").single();

  if (tokenInsert.error || !tokenInsert.data) {
    console.error("Systems Score access link failed", tokenInsert.error?.message);
    return { emailSent: false, emailStatus: "failed" as const };
  }

  const message = buildSystemsScoreReportEmail(stored, firstName, token);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: message.from, to: [email], subject: message.subject, html: message.html }),
  });

  if (!response.ok) {
    console.error("Systems Score email failed", await response.text());
    await supabase.from("systems_score_access_tokens").update({ revoked_at: new Date().toISOString() }).eq("id", tokenInsert.data.id);
    return { emailSent: false, emailStatus: "failed" as const };
  }

  await supabase.from("clarity_assessments").update({ email_sent_at: new Date().toISOString() }).eq("id", assessmentId);

  try {
    const notification = await sendLeadNotification({
      type: "clarity_check",
      name: firstName,
      email,
      primaryChallenge: stored.leaks[0]?.name,
      clarityScores: {
        total: stored.overall,
        max: 100,
        result: stored.tierName,
        strongest: sectionLabels[stored.strongestSection],
        gap: stored.leaks[0]?.name ?? "None",
        recommendedService: "Systems Score v2",
      },
      openResponses: [
        `Top leaks: ${stored.leaks.map((leak) => leak.name).join(", ")}`,
        `Sections: Capture ${stored.sections.capture.score}, Follow-Up ${stored.sections.follow_up.score}, Connection ${stored.sections.connection.score}, Visibility ${stored.sections.visibility.score}`,
        `Admin hours: ${stored.adminHoursBand}`,
        `Client value: ${stored.clientValueBand}`,
      ],
      leadId,
      assessmentId,
    });
    if (notification.attempted && !notification.accepted) {
      await logLeadNotificationFailure("systems score notification rejected", notification.reason);
    }
  } catch (error) {
    await logLeadNotificationFailure("systems score notification exception", error);
  }

  return { emailSent: true, emailStatus: "sent" as const };
}
