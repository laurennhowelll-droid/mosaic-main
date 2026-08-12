import { NextResponse } from "next/server";
import {
  calculateClarityResult,
  categoryLabel,
  clarityQuestions,
  interpretCategory,
  primaryGapCopy,
  resultBandLabel,
  scoreForCategory,
  strongestAreaCopy,
  type ClarityAnswer,
  type ClarityCategory,
} from "../../../lib/clarity-check";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

const emailPattern = /^\S+@\S+\.\S+$/;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithmosaic.co";
const discoveryCallUrl = "https://calendar.app.google/JxAn6pJFxwyu1FJq6";
const categories: ClarityCategory[] = ["vision", "experience", "systems", "operations", "growth"];

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

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const categoryRows = categories
    .map((category) => {
      const score = scoreForCategory(result, category);

      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #ded6ca;">
            <strong style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#202124;">${categoryLabel(category)}</strong>
            <p style="margin:6px 0 0;color:#555852;font-size:14px;line-height:1.5;">${interpretCategory(category, score)}</p>
          </td>
          <td align="right" style="padding:14px 0;border-bottom:1px solid #ded6ca;color:#202124;font-size:18px;font-weight:bold;">${score} / 10</td>
        </tr>
      `;
    })
    .join("");

  const priorityItems = result.priorities
    .map(
      (priority, index) => `
        <tr>
          <td valign="top" style="width:34px;padding:0 0 16px;color:#7a8266;font-size:12px;letter-spacing:1px;">${index + 1}.</td>
          <td style="padding:0 0 16px;">
            <strong style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#202124;">${priority.title}</strong>
            <span style="display:block;margin-top:6px;color:#42433f;font-size:15px;line-height:1.6;">${priority.copy}</span>
          </td>
        </tr>
      `,
    )
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mosaic <reports@buildwithmosaic.co>",
      to: [email],
      subject: "Your Mosaic Clarity Report",
      headers: {
        "X-Entity-Ref-ID": `clarity-${Date.now()}`,
      },
      html: `
        <div style="display:none;max-height:0;overflow:hidden;">A snapshot of what’s working, what feels disconnected, and where I’d look first.</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f0e9;margin:0;padding:0;font-family:Arial,sans-serif;color:#202124;">
          <tr>
            <td align="center" style="padding:36px 18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#f8f7f3;border:1px solid #ded6ca;">
                <tr>
                  <td style="padding:34px 34px 22px;">
                    <img src="${siteUrl}/brand-reference/main-logo.svg" width="170" alt="Mosaic" style="display:block;border:0;margin-bottom:34px;">
                    <p style="margin:0 0 14px;color:#555b44;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Business Clarity Report</p>
                    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:.98;font-weight:500;letter-spacing:-1px;color:#202124;">Here’s what your answers revealed.</h1>
                    <p style="margin:28px 0 0;color:#42433f;font-size:16px;line-height:1.7;">Hi ${firstName},</p>
                    <p style="margin:14px 0 0;color:#42433f;font-size:16px;line-height:1.7;">Thanks for taking the Business Clarity Check.</p>
                    <p style="margin:14px 0 0;color:#42433f;font-size:16px;line-height:1.7;">This isn’t meant to diagnose your entire business from ten questions. It’s a quick way to identify where friction may be building and where a closer look could create the most momentum.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 34px 28px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ece5da;border:1px solid #d7cfc2;">
                      <tr>
                        <td style="padding:28px;">
                          <p style="margin:0;color:#555b44;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Your Clarity Score</p>
                          <p style="margin:14px 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:58px;line-height:1;color:#202124;">${result.totalScore} / 50</p>
                          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#7a8266;">${resultBandLabel(result.resultBand)}</p>
                          <p style="margin:18px 0 0;color:#42433f;font-size:15px;line-height:1.65;">This is not a grade. It is a snapshot of where your business may be carrying unnecessary friction.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 34px 30px;">
                    <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:500;color:#202124;">Category breakdown</h2>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${categoryRows}</table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 34px 30px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:24px;background:#eef0e8;border:1px solid #d7cfc2;">
                          <p style="margin:0 0 10px;color:#555b44;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">What’s Working</p>
                          <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:500;color:#202124;">${categoryLabel(result.strongestCategory)}</h2>
                          <p style="margin:14px 0 0;color:#42433f;font-size:15px;line-height:1.65;">${strongestAreaCopy(result.strongestCategory)}</p>
                        </td>
                      </tr>
                      <tr><td style="height:14px;"></td></tr>
                      <tr>
                        <td style="padding:24px;background:#f3e1d6;border:1px solid #d7cfc2;">
                          <p style="margin:0 0 10px;color:#8f563e;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Where I’d Look First</p>
                          <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:500;color:#202124;">${result.primaryGap}</h2>
                          <p style="margin:14px 0 0;color:#42433f;font-size:15px;line-height:1.65;">${primaryGapCopy(result.weakestCategory)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 34px 30px;">
                    <h2 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:500;color:#202124;">Three priorities</h2>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${priorityItems}</table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 34px 38px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#5f6973;color:#f8f2e8;">
                      <tr>
                        <td style="padding:28px;">
                          <p style="margin:0 0 10px;color:#e4dccd;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Recommended Starting Point</p>
                          <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:500;color:#f8f2e8;">${result.recommendedService}</h2>
                          <p style="margin:14px 0 24px;color:#f8f2e8;font-size:15px;line-height:1.65;">Based on your answers, this is where I’d look first. ${result.recommendation}</p>
                          <p style="margin:18px 0 24px;color:#f8f2e8;font-size:15px;line-height:1.65;">The next step is a complimentary 20-minute Discovery Call to understand your business, what&apos;s feeling disconnected, and whether Mosaic is the right fit.</p>
                          <a href="${discoveryCallUrl}" style="display:inline-block;background:#7a8266;color:#ffffff;text-decoration:none;padding:13px 18px;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Book a Discovery Call →</a>
                        </td>
                      </tr>
                    </table>
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

export async function POST(request: Request) {
  let payload: { firstName?: unknown; email?: unknown; companyName?: unknown; answers?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const firstName = clean(payload.firstName);
  const email = clean(payload.email).toLowerCase();
  const companyName = clean(payload.companyName) || null;
  const answers = validAnswers(payload.answers);

  if (!firstName || !email || !answers) {
    return NextResponse.json({ success: false, error: "Please complete the required fields." }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const result = calculateClarityResult(answers);
  const supabase = getSupabaseServerClient();

  const { data: existingLead, error: existingLeadError } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingLeadError) {
    return NextResponse.json({ success: false, error: existingLeadError.message }, { status: 500 });
  }

  const leadPayload = {
    company_name: companyName ?? "Clarity Check",
    contact_name: firstName,
    email,
    problems: `Clarity Check result: ${result.resultBand}. Primary gap: ${result.primaryGap}.`,
    budget: "Not sure yet",
    source: "clarity_check",
    status: "new",
    notes: [
      `Clarity Score: ${result.totalScore} / 50`,
      `Result Band: ${result.resultBand}`,
      `Primary Gap: ${result.primaryGap}`,
      `Recommended Service: ${result.recommendedService}`,
    ].join("\n"),
  };

  const leadResult = existingLead
    ? await supabase.from("leads").update({ ...leadPayload, last_updated: new Date().toISOString() }).eq("id", existingLead.id).select("id").single()
    : await supabase.from("leads").insert(leadPayload).select("id").single();

  if (leadResult.error || !leadResult.data) {
    return NextResponse.json({ success: false, error: leadResult.error?.message ?? "Lead save failed." }, { status: 500 });
  }

  const { data: assessment, error: assessmentError } = await supabase
    .from("clarity_assessments")
    .insert({
      first_name: firstName,
      email,
      company_name: companyName,
      total_score: result.totalScore,
      result_band: result.resultBand,
      vision_score: result.visionScore,
      experience_score: result.experienceScore,
      systems_score: result.systemsScore,
      operations_score: result.operationsScore,
      growth_score: result.growthScore,
      strongest_category: result.strongestCategory,
      weakest_category: result.weakestCategory,
      primary_gap: result.primaryGap,
      recommended_service: result.recommendedService,
      answers,
      lead_id: leadResult.data.id,
    })
    .select("id")
    .single();

  if (assessmentError || !assessment) {
    return NextResponse.json({ success: false, error: assessmentError?.message ?? "Assessment save failed." }, { status: 500 });
  }

  try {
    await sendReportEmail({ firstName, email, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Email send failed." },
      { status: 500 },
    );
  }

  const emailSentAt = new Date().toISOString();
  const { error: emailUpdateError } = await supabase
    .from("clarity_assessments")
    .update({ email_sent_at: emailSentAt })
    .eq("id", assessment.id);

  if (emailUpdateError) {
    return NextResponse.json({ success: false, error: emailUpdateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
