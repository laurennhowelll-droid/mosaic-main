"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { assessmentQuestionMap } from "../../lib/business-health-assessment";
import {
  clientRefreshCookie,
  clientSessionCookie,
  getClientAuthClient,
  requireClient,
} from "../../lib/supabase/client-portal";
import { getSupabaseServerClient } from "../../lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithmosaic.co";

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

async function sendBrandedLoginEmail(email: string, actionLink: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mosaic <reports@buildwithmosaic.co>",
      to: [email],
      subject: "Your Mosaic login link",
      html: `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f0e9;margin:0;padding:0;font-family:Arial,sans-serif;color:#202124;">
          <tr>
            <td align="center" style="padding:36px 18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#f8f7f3;border:1px solid #ded6ca;">
                <tr>
                  <td style="padding:34px;">
                    <img src="${siteUrl}/brand-reference/main-logo.svg" width="170" alt="Mosaic" style="display:block;border:0;margin-bottom:34px;">
                    <p style="margin:0 0 14px;color:#555b44;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Client Workspace</p>
                    <h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:.98;font-weight:500;letter-spacing:-1px;color:#202124;">Your secure Mosaic login link.</h1>
                    <p style="margin:0 0 16px;color:#42433f;font-size:16px;line-height:1.7;">Use this secure link to enter your private Mosaic workspace.</p>
                    <p style="margin:0 0 26px;color:#42433f;font-size:16px;line-height:1.7;">For your security, this link expires automatically. If it expires, you can request a fresh link from the client login page.</p>
                    <a href="${actionLink}" style="display:inline-block;background:#7a8266;color:#ffffff;text-decoration:none;padding:13px 18px;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Enter Your Mosaic Workspace →</a>
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

function answersFromForm(formData: FormData) {
  const answers: Record<string, string | string[]> = {};

  for (const [id, question] of assessmentQuestionMap) {
    if (question.type === "multiselect") {
      const selected = formData.getAll(id).map((value) => clean(value)).filter(Boolean);
      answers[id] = question.maxSelected ? selected.slice(0, question.maxSelected) : selected;
    } else {
      answers[id] = clean(formData.get(id));
    }
  }

  return answers;
}

export async function sendClientLoginLink(_: unknown, formData: FormData) {
  const email = clean(formData.get("email")).toLowerCase();

  if (!email) {
    return { error: "Email is required." };
  }

  const adminSupabase = getSupabaseServerClient();
  const { data: client, error: clientError } = await adminSupabase
    .from("clients")
    .select("id,email")
    .eq("email", email)
    .maybeSingle();

  if (clientError) {
    return { error: clientError.message };
  }

  if (!client) {
    return { error: "This email does not have access to a Mosaic client workspace yet." };
  }

  const redirectTo = `${siteUrl}/client/auth/callback`;
  let { data, error } = await adminSupabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error || !data.properties?.action_link) {
    const invite = await adminSupabase.auth.admin.generateLink({
      type: "invite",
      email,
      options: { redirectTo },
    });
    data = invite.data;
    error = invite.error;
  }

  if (error || !data.properties?.action_link) {
    return { error: error?.message ?? "Could not create a secure login link." };
  }

  const tokenHash = data.properties.hashed_token;
  const verificationType = data.properties.verification_type ?? "magiclink";
  const actionLink = tokenHash
    ? `${siteUrl}/client/auth/verify?token_hash=${encodeURIComponent(tokenHash)}&type=${encodeURIComponent(verificationType)}`
    : data.properties.action_link;

  try {
    await sendBrandedLoginEmail(email, actionLink);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not send login email." };
  }

  return { success: "Check your email for your secure Mosaic login link." };
}

export async function signOutClient() {
  const cookieStore = await cookies();
  cookieStore.delete(clientSessionCookie);
  cookieStore.delete(clientRefreshCookie);
  redirect("/client/login");
}

export async function saveAssessmentProgress(sectionIndex: number, formData: FormData) {
  const { client, accessToken } = await requireClient();
  const supabase = getClientAuthClient(accessToken);
  const answers = answersFromForm(formData);

  const { data: existing, error: existingError } = await supabase
    .from("business_health_assessments")
    .select("answers")
    .eq("client_id", client.id)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);

  const mergedAnswers = {
    ...((existing?.answers as Record<string, unknown> | null) ?? {}),
    ...answers,
  };

  const { error } = await supabase
    .from("business_health_assessments")
    .upsert(
      {
        client_id: client.id,
        status: "in_progress",
        started_at: new Date().toISOString(),
        answers: mergedAnswers,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "client_id" },
    );

  if (error) throw new Error(error.message);

  revalidatePath("/client");
  redirect(`/client/assessment?section=${sectionIndex + 1}`);
}

export async function completeAssessment(formData: FormData) {
  const { client, accessToken } = await requireClient();
  const supabase = getClientAuthClient(accessToken);
  const answers = answersFromForm(formData);

  const { data: existing, error: existingError } = await supabase
    .from("business_health_assessments")
    .select("answers")
    .eq("client_id", client.id)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);

  const mergedAnswers = {
    ...((existing?.answers as Record<string, unknown> | null) ?? {}),
    ...answers,
  };

  const now = new Date().toISOString();
  const { error: assessmentError } = await supabase
    .from("business_health_assessments")
    .upsert(
      {
        client_id: client.id,
        status: "complete",
        started_at: now,
        completed_at: now,
        answers: mergedAnswers,
        updated_at: now,
      },
      { onConflict: "client_id" },
    );

  if (assessmentError) throw new Error(assessmentError.message);

  const adminSupabase = getSupabaseServerClient();
  const { error: clientError } = await adminSupabase
    .from("clients")
    .update({ status: "assessment_complete", updated_at: now })
    .eq("id", client.id);

  if (clientError) throw new Error(clientError.message);

  revalidatePath("/client");
  redirect("/client");
}
