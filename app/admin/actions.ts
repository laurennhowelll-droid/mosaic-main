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
