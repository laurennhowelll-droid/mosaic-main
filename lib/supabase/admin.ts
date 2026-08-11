import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "./server";
export {
  getPlanLabel,
  getPlanStartingRevenue,
  getStageLabel,
  pipelineStages,
  planOptions,
  stageLabel,
  planLabel,
  planStartingRevenue,
} from "../admin-config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const adminEmail = process.env.MOSAIC_ADMIN_EMAIL;

export const adminSessionCookie = "mosaic_admin_access_token";
export const adminRefreshCookie = "mosaic_admin_refresh_token";

export type Lead = {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  website: string | null;
  problems: string;
  budget: string;
  status: string;
  source: string;
  notes: string | null;
  pipeline_stage: string | null;
  selected_plan: string | null;
  projected_revenue: number | null;
  internal_notes: string | null;
  last_updated: string | null;
};

export async function requireAdmin() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(adminSessionCookie)?.value;

  if (!accessToken) {
    redirect("/admin/login");
  }

  const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/admin/login");
  }

  if (adminEmail && data.user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    redirect("/admin/login");
  }

  return data.user;
}

export async function getAdminLeads() {
  await requireAdmin();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Lead[];
}

export async function getAdminLead(id: string) {
  await requireAdmin();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Lead;
}
