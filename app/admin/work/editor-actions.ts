"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { ctaTypes, slugifyTitle, workContentTypes, workStatuses } from "../../../lib/work-content";
import { requireAdmin } from "../../../lib/supabase/admin";

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function nullable(value: string) {
  return value || null;
}

function dateOrNow(value: string) {
  return value ? new Date(value).toISOString() : new Date().toISOString();
}

async function uploadFeaturedImage(file: File | null) {
  if (!file || file.size === 0) return null;

  const supabase = getSupabaseServerClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `featured/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("work-images").upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("work-images").getPublicUrl(path);
  return data.publicUrl;
}

async function assertCanFeature(id: string | null, requested: boolean, status: string) {
  if (!requested || status !== "published") return;

  const supabase = getSupabaseServerClient();
  const query = supabase.from("work_content").select("id", { count: "exact", head: true }).eq("is_featured", true).eq("status", "published");
  if (id) query.neq("id", id);
  const { count, error } = await query;

  if (error) throw new Error(error.message);
  if ((count ?? 0) >= 3) {
    throw new Error("Only 3 published work pieces can be featured at once. Unfeature one first, then try again.");
  }
}

function readPayload(formData: FormData, existingImageUrl?: string | null) {
  const title = clean(formData.get("title"));
  const slug = slugifyTitle(clean(formData.get("slug")) || title);
  const contentType = clean(formData.get("content_type"));
  const status = clean(formData.get("status")) || "draft";
  const ctaType = clean(formData.get("cta_type")) || "none";
  const publishDate = clean(formData.get("publish_date"));

  if (!title) throw new Error("Title is required.");
  if (!slug) throw new Error("Slug is required.");
  if (!workContentTypes.includes(contentType as never)) throw new Error("Invalid content type.");
  if (!workStatuses.includes(status as never)) throw new Error("Invalid status.");
  if (!ctaTypes.includes(ctaType as never)) throw new Error("Invalid CTA type.");

  return {
    title,
    slug,
    content_type: contentType,
    excerpt: nullable(clean(formData.get("excerpt"))),
    featured_image_url: formData.get("remove_featured_image") === "on" ? null : existingImageUrl ?? null,
    body: clean(formData.get("body")),
    seo_title: nullable(clean(formData.get("seo_title"))),
    meta_description: nullable(clean(formData.get("meta_description"))),
    cta_type: ctaType,
    cta_label: ctaType === "custom" ? nullable(clean(formData.get("cta_label"))) : null,
    cta_url: ctaType === "custom" ? nullable(clean(formData.get("cta_url"))) : null,
    status,
    publish_date: status === "published" ? dateOrNow(publishDate) : nullable(publishDate),
    is_featured: formData.get("is_featured") === "on",
    client_name: nullable(clean(formData.get("client_name"))),
    industry: nullable(clean(formData.get("industry"))),
    services: clean(formData.get("services")).split(",").map((item) => item.trim()).filter(Boolean),
    results: nullable(clean(formData.get("results"))),
    updated_at: new Date().toISOString(),
  };
}

export async function createWorkContent(formData: FormData) {
  await requireAdmin();
  const imageUrl = await uploadFeaturedImage(formData.get("featured_image") as File | null);
  const payload = readPayload(formData, imageUrl);
  await assertCanFeature(null, payload.is_featured, payload.status);

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("work_content").insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  revalidatePath("/work");
  redirect(`/admin/work/${data.id}`);
}

export async function updateWorkContent(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseServerClient();
  const { data: existing, error: existingError } = await supabase.from("work_content").select("featured_image_url").eq("id", id).single();
  if (existingError) throw new Error(existingError.message);

  const imageUrl = await uploadFeaturedImage(formData.get("featured_image") as File | null);
  const payload = readPayload(formData, imageUrl ?? existing.featured_image_url);
  await assertCanFeature(id, payload.is_featured, payload.status);

  const { error } = await supabase.from("work_content").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/work");
  revalidatePath(`/admin/work/${id}`);
  redirect(`/admin/work/${id}`);
}

export async function setWorkPublishState(id: string, publish: boolean) {
  await requireAdmin();
  const supabase = getSupabaseServerClient();
  const patch = publish
    ? { status: "published", publish_date: new Date().toISOString(), updated_at: new Date().toISOString() }
    : { status: "draft", is_featured: false, updated_at: new Date().toISOString() };

  if (publish) {
    const { data: item, error: itemError } = await supabase.from("work_content").select("is_featured").eq("id", id).single();
    if (itemError) throw new Error(itemError.message);
    await assertCanFeature(id, Boolean(item.is_featured), "published");
  }

  const { error } = await supabase.from("work_content").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/work");
  revalidatePath("/admin/work");
}
