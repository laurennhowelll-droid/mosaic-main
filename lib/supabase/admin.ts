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

export type EmployeeProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "employee";
  active: boolean;
};

export type ClarityAssessment = {
  id: string;
  first_name: string;
  email: string;
  company_name: string | null;
  total_score: number;
  result_band: string;
  vision_score: number;
  experience_score: number;
  systems_score: number;
  operations_score: number;
  growth_score: number;
  strongest_category: string;
  weakest_category: string;
  primary_gap: string;
  recommended_service: string;
  answers: Array<{ id: string; category: string; score: number }>;
  email_sent_at: string | null;
  lead_id: string | null;
  review_status: "unreviewed" | "reviewed" | "follow_up_needed";
  created_at: string;
  lead?: Lead | null;
};

export type GrowthCampaign = {
  id: string;
  campaign_name: string;
  start_date: string;
  end_date: string;
  notes: string | null;
  created_at: string;
};

export type GrowthTarget = {
  id: string;
  campaign_id: string;
  metric: string;
  weekly_target: number | null;
  campaign_target: number | null;
  created_at: string;
  updated_at: string;
};

export type GrowthActivity = {
  id: string;
  campaign_id: string;
  activity_date: string;
  activity_type: string;
  count: number;
  url: string | null;
  notes: string | null;
  created_at: string;
};

export type ContentTrackerItem = {
  id: string;
  campaign_id: string;
  title: string;
  post_type: string;
  status: "idea" | "draft" | "scheduled" | "published";
  publish_date: string | null;
  url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export function getAuthClient(accessToken?: string) {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined,
  });
}

export async function getAdminProfile(accessToken: string) {
  const supabase = getAuthClient(accessToken);
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("id,email,full_name,role,active")
    .eq("id", userData.user.id)
    .eq("active", true)
    .eq("role", "admin")
    .single();

  if (employeeError || !employee) {
    return null;
  }

  return employee as EmployeeProfile;
}

export async function requireAdmin() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(adminSessionCookie)?.value;

  if (!accessToken) {
    redirect("/admin/login");
  }

  const employee = await getAdminProfile(accessToken);
  if (!employee) {
    redirect("/admin/login");
  }

  return employee;
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

export async function getLeadClarityAssessments(leadId: string) {
  await requireAdmin();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("clarity_assessments")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClarityAssessment[];
}

export async function getAdminClarityAssessments() {
  await requireAdmin();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("clarity_assessments")
    .select("*, lead:leads(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClarityAssessment[];
}

export async function getAdminClarityAssessment(id: string) {
  await requireAdmin();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("clarity_assessments")
    .select("*, lead:leads(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const assessment = data as ClarityAssessment;

  if (!assessment.lead_id) {
    const { data: matchingLead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("email", assessment.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (leadError) {
      throw new Error(leadError.message);
    }

    if (matchingLead) {
      const { error: linkError } = await supabase
        .from("clarity_assessments")
        .update({ lead_id: matchingLead.id })
        .eq("id", assessment.id);

      if (linkError) {
        throw new Error(linkError.message);
      }

      assessment.lead_id = matchingLead.id;
      assessment.lead = matchingLead as Lead;
    }
  }

  return assessment;
}

const defaultTargets = [
  ["linkedin_connection", 50, 200],
  ["outreach_message", 25, 100],
  ["linkedin_comment", 25, null],
  ["personal_linkedin_post", 3, 24],
  ["company_linkedin_post", 1, 8],
  ["partnership_conversation", 2, null],
  ["discovery_call", 2, 25],
  ["playbook_article", 0.5, 4],
  ["proposal_sent", 2, 10],
  ["client_won", null, 5],
  ["case_study", null, 2],
  ["retainer", null, 2],
  ["signed_revenue", null, 25000],
] as const;

export async function getGrowthDashboardData() {
  await requireAdmin();
  const supabase = getSupabaseServerClient();

  let { data: campaign, error: campaignError } = await supabase
    .from("growth_campaigns")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (campaignError) {
    throw new Error(campaignError.message);
  }

  if (!campaign) {
    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() + 89);
    const { data: created, error: createError } = await supabase
      .from("growth_campaigns")
      .insert({
        campaign_name: "Mosaic Launch — 90 Days",
        start_date: today.toISOString().slice(0, 10),
        end_date: end.toISOString().slice(0, 10),
      })
      .select("*")
      .single();

    if (createError) {
      throw new Error(createError.message);
    }

    campaign = created;
  }

  const typedCampaign = campaign as GrowthCampaign;

  const { data: existingTargets, error: targetError } = await supabase
    .from("growth_targets")
    .select("*")
    .eq("campaign_id", typedCampaign.id)
    .order("metric", { ascending: true });

  if (targetError) {
    throw new Error(targetError.message);
  }

  if (!existingTargets?.length) {
    const { error: seedError } = await supabase.from("growth_targets").insert(
      defaultTargets.map(([metric, weekly_target, campaign_target]) => ({
        campaign_id: typedCampaign.id,
        metric,
        weekly_target,
        campaign_target,
      })),
    );

    if (seedError) {
      throw new Error(seedError.message);
    }
  }

  const [{ data: targets, error: targetsError }, { data: activity, error: activityError }, { data: content, error: contentError }, leads, assessments] =
    await Promise.all([
      supabase.from("growth_targets").select("*").eq("campaign_id", typedCampaign.id).order("metric", { ascending: true }),
      supabase.from("growth_activity").select("*").eq("campaign_id", typedCampaign.id).order("activity_date", { ascending: false }).limit(40),
      supabase.from("content_tracker").select("*").eq("campaign_id", typedCampaign.id).order("created_at", { ascending: false }).limit(40),
      getAdminLeads(),
      getAdminClarityAssessments(),
    ]);

  if (targetsError) throw new Error(targetsError.message);
  if (activityError) throw new Error(activityError.message);
  if (contentError) throw new Error(contentError.message);

  return {
    campaign: typedCampaign,
    targets: (targets ?? []) as GrowthTarget[],
    activity: (activity ?? []) as GrowthActivity[],
    content: (content ?? []) as ContentTrackerItem[],
    leads,
    assessments,
  };
}
