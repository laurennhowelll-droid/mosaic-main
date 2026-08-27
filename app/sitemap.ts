import type { MetadataRoute } from "next";
import { getPublishedWorkContent } from "../lib/work-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithmosaic.co";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/brand", "/clarity", "/clarity-check", "/playbook", "/process", "/services", "/start", "/work"];
  const workItems = await getPublishedWorkContent();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
    })),
    ...workItems.map((item) => ({
      url: `${siteUrl}/work/${item.slug}`,
      lastModified: new Date(item.updated_at),
    })),
  ];
}
