import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  clientRefreshCookie,
  clientSessionCookie,
  getClientAuthClient,
} from "../../../../lib/supabase/client-portal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/client/login?error=missing-code", url.origin));
  }

  const supabase = getClientAuthClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

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
