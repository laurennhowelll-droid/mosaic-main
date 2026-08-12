import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  clientRefreshCookie,
  clientSessionCookie,
  getClientAuthClient,
} from "../../../../lib/supabase/client-portal";

type VerifyType = "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email";

function verifyType(value: string | null): VerifyType {
  if (value === "signup" || value === "invite" || value === "magiclink" || value === "recovery" || value === "email_change" || value === "email") {
    return value;
  }

  return "magiclink";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");

  if (!tokenHash) {
    return NextResponse.redirect(new URL("/client/login?error=missing-token", url.origin));
  }

  const supabase = getClientAuthClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: verifyType(url.searchParams.get("type")),
  });

  if (error || !data.session) {
    return NextResponse.redirect(new URL("/client/login?error=invalid-link", url.origin));
  }

  const cookieStore = await cookies();
  cookieStore.set(clientSessionCookie, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: data.session.expires_in,
  });
  cookieStore.set(clientRefreshCookie, data.session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(new URL("/client", url.origin));
}
