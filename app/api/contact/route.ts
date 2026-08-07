import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email");

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  // Connect your CRM or email provider here. This keeps the browser API surface small.
  console.info("New Mosaic interest", { email, receivedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
