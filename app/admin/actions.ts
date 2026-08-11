"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  adminRefreshCookie,
  adminSessionCookie,
  getPlanStartingRevenue,
  pipelineStages,
  planOptions,
  requireAdmin,
} from "../../lib/supabase/admin";
import { getSupabaseServerClient } from "../../lib/supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const adminEmail = process.env.MOSAIC_ADMIN_EMAIL;

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isPipelineStage(value: string) {
  return pipelineStages.some(([stage]) => stage === value);
}

function isPlanOption(value: string): value is (typeof planOptions)[number][0] {
  return planOptions.some(([plan]) => plan === value);
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

  if (adminEmail && email !== adminEmail.toLowerCase()) {
    return { error: "This account is not authorized for Mosaic admin." };
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return { error: "Invalid email or password." };
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
