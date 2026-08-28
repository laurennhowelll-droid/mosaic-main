import { cache } from "react";
import { getSupabaseServerClient } from "./supabase/server";

export const workContentTypes = ["case_study", "article", "tips", "field_note", "guide"] as const;
export const workStatuses = ["draft", "published", "archived"] as const;
export const ctaTypes = ["clarity_check", "discovery_call", "email", "custom", "none"] as const;

export type WorkContentType = (typeof workContentTypes)[number];
export type WorkStatus = (typeof workStatuses)[number];
export type WorkCtaType = (typeof ctaTypes)[number];

export type WorkContent = {
  id: string;
  title: string;
  slug: string;
  content_type: WorkContentType;
  excerpt: string | null;
  featured_image_url: string | null;
  body: string;
  seo_title: string | null;
  meta_description: string | null;
  cta_type: WorkCtaType | null;
  cta_label: string | null;
  cta_url: string | null;
  status: WorkStatus;
  publish_date: string | null;
  is_featured: boolean;
  client_name: string | null;
  industry: string | null;
  services: string[] | null;
  results: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkListItem = Pick<
  WorkContent,
  "id" | "title" | "slug" | "content_type" | "excerpt" | "featured_image_url" | "status" | "publish_date" | "is_featured" | "created_at" | "updated_at"
> & { isStatic?: boolean };

export const staticWhitePoppyWork: WorkListItem = {
  id: "white-poppy-preservation",
  title: "White Poppy Preservation",
  slug: "white-poppy-preservation",
  content_type: "case_study",
  excerpt:
    "A business transformation case study documenting the systems, operations, reporting, and ecommerce work behind a growing preservation studio.",
  featured_image_url: "/brand/white_poppy.png",
  status: "published",
  publish_date: "2026-08-01T12:00:00.000Z",
  is_featured: true,
  created_at: "2026-08-01T12:00:00.000Z",
  updated_at: "2026-08-01T12:00:00.000Z",
  isStatic: true,
};

export function getWorkTypeLabel(type: string) {
  const labels: Record<string, string> = {
    case_study: "Case Study",
    article: "Article",
    tips: "Tips",
    field_note: "Field Note",
    guide: "Guide",
  };
  return labels[type] ?? "Article";
}

export function getWorkTypePluralLabel(type: string) {
  const labels: Record<string, string> = {
    case_study: "Case Studies",
    article: "Articles",
    tips: "Tips",
    field_note: "Field Notes",
    guide: "Guides",
  };
  return labels[type] ?? "Articles";
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function formatWorkDate(value: string | null | undefined) {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function sortByPublishDate(items: WorkListItem[]) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.publish_date ?? a.created_at).getTime();
    const bTime = new Date(b.publish_date ?? b.created_at).getTime();
    return bTime - aTime;
  });
}

export function orderPublicWork(items: WorkListItem[]) {
  const byDate = sortByPublishDate(items);
  const featured = byDate.filter((item) => item.is_featured).slice(0, 3);
  const fill = byDate.filter((item) => !featured.some((featuredItem) => featuredItem.id === item.id)).slice(0, 3 - featured.length);
  const top = [...featured, ...fill];
  const topIds = new Set(top.map((item) => item.id));
  const newest = byDate.filter((item) => !topIds.has(item.id));

  return { top, newest };
}

export const getPublishedWorkContent = cache(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("work_content")
    .select("id,title,slug,content_type,excerpt,featured_image_url,status,publish_date,is_featured,created_at,updated_at")
    .eq("status", "published")
    .lte("publish_date", new Date().toISOString())
    .order("publish_date", { ascending: false });

  if (error) {
    if (isMissingWorkTableError(error)) return [staticWhitePoppyWork];
    throw new Error(error.message);
  }

  const dynamicItems = ((data ?? []) as WorkListItem[]).filter((item) => item.slug !== staticWhitePoppyWork.slug);
  return [staticWhitePoppyWork, ...dynamicItems];
});

export async function getPublishedWorkBySlug(slug: string) {
  if (slug === staticWhitePoppyWork.slug) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("work_content")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("publish_date", new Date().toISOString())
    .maybeSingle();

  if (error) {
    if (isMissingWorkTableError(error)) return null;
    throw new Error(error.message);
  }

  return data as WorkContent | null;
}

export async function getAdminWorkContent() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("work_content").select("*").order("updated_at", { ascending: false });

  if (error) {
    if (isMissingWorkTableError(error)) return [];
    throw new Error(error.message);
  }

  return (data ?? []) as WorkContent[];
}

export async function getAdminWorkItem(id: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("work_content").select("*").eq("id", id).single();

  if (error) throw new Error(error.message);
  return data as WorkContent;
}

export function getCta(item: Pick<WorkContent, "cta_type" | "cta_label" | "cta_url">) {
  if (item.cta_type === "clarity_check") return { label: "Take the Clarity Check", href: "/clarity-check" };
  if (item.cta_type === "discovery_call") return { label: "Book a Discovery Call", href: "https://calendar.app.google/JxAn6pJFxwyu1FJq6" };
  if (item.cta_type === "email") return { label: "Email Mosaic", href: "mailto:lauren@buildwithmosaic.co" };
  if (item.cta_type === "custom" && item.cta_label && item.cta_url) return { label: item.cta_label, href: item.cta_url };
  return null;
}

function isMissingWorkTableError(error: { code?: string; message?: string }) {
  return error.code === "42P01" || error.code === "PGRST205" || error.message?.includes("work_content");
}
