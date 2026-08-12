import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "./server";
import type { BusinessHealthAssessment, Client } from "./admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const clientSessionCookie = "mosaic_client_access_token";
export const clientRefreshCookie = "mosaic_client_refresh_token";

export function getClientAuthClient(accessToken?: string) {
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

export async function requireClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(clientSessionCookie)?.value;

  if (!accessToken) {
    redirect("/client/login");
  }

  const authClient = getClientAuthClient(accessToken);
  const { data: userData, error: userError } = await authClient.auth.getUser();

  if (userError || !userData.user?.email) {
    redirect("/client/login");
  }

  const adminClient = getSupabaseServerClient();
  const email = userData.user.email.toLowerCase();

  const { data: existingClient, error: clientError } = await adminClient
    .from("clients")
    .select("*")
    .or(`auth_user_id.eq.${userData.user.id},email.eq.${email}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (clientError || !existingClient) {
    redirect("/client/login?error=not-authorized");
  }

  if (!existingClient.auth_user_id) {
    const { data: linked, error: linkError } = await adminClient
      .from("clients")
      .update({ auth_user_id: userData.user.id, updated_at: new Date().toISOString() })
      .eq("id", existingClient.id)
      .select("*")
      .single();

    if (linkError) {
      throw new Error(linkError.message);
    }

    return { user: userData.user, client: linked as Client, accessToken };
  }

  if (existingClient.auth_user_id !== userData.user.id) {
    redirect("/client/login?error=not-authorized");
  }

  return { user: userData.user, client: existingClient as Client, accessToken };
}

export async function getPortalAssessment(clientId: string, accessToken: string) {
  const supabase = getClientAuthClient(accessToken);
  const { data, error } = await supabase
    .from("business_health_assessments")
    .select("*")
    .eq("client_id", clientId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as BusinessHealthAssessment | null;
}
