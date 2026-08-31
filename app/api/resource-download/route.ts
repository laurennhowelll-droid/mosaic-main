import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { getResource } from "../../resources/resources";

const emailPattern = /^\S+@\S+\.\S+$/;

type ResourceDownloadPayload = {
  name?: unknown;
  email?: unknown;
  companyName?: unknown;
  resourceSlug?: unknown;
  pageUrl?: unknown;
  referrer?: unknown;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: ResourceDownloadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const name = clean(payload.name);
  const email = clean(payload.email).toLowerCase();
  const companyName = clean(payload.companyName) || "Resource Download";
  const resourceSlug = clean(payload.resourceSlug);
  const pageUrl = clean(payload.pageUrl);
  const referrer = clean(payload.referrer);
  const resource = getResource(resourceSlug);

  if (!name || !email || !resource) {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("leads").insert({
      company_name: companyName,
      contact_name: name,
      email,
      phone: null,
      website: null,
      problems: `Requested resource: ${resource.title}`,
      budget: "Not sure yet",
      source: "resource_download",
      status: "new",
      notes: [
        `Resource: ${resource.title}`,
        `Resource URL: /resources/${resource.slug}`,
        pageUrl ? `Page URL: ${pageUrl}` : null,
        referrer ? `Referrer: ${referrer}` : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
    });

    if (error) {
      console.error("Resource download lead insert failed", error);
      return NextResponse.json({ error: "We couldn't save your email. Please try again." }, { status: 500 });
    }
  } catch (error) {
    console.error("Resource download submission failed", error);
    return NextResponse.json({ error: "We couldn't save your email. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, filePath: resource.filePath });
}
