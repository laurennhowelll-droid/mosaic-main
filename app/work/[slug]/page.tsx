import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "../../components";
import { formatWorkDate, getCta, getPublishedWorkBySlug, getPublishedWorkContent, getWorkTypeLabel } from "../../../lib/work-content";
import { MarkdownContent } from "./markdown";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithmosaic.co";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedWorkBySlug(slug);
  if (!item) return {};

  const title = item.seo_title || item.title;
  const description = item.meta_description || item.excerpt || undefined;
  const url = `${siteUrl}/work/${item.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: item.publish_date ?? undefined,
      images: item.featured_image_url ? [{ url: item.featured_image_url }] : undefined,
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPublishedWorkBySlug(slug);
  if (!item) notFound();

  const cta = getCta(item);
  const schemaType = item.content_type === "case_study" ? "CreativeWork" : "BlogPosting";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: item.title,
    description: item.meta_description || item.excerpt || undefined,
    datePublished: item.publish_date,
    image: item.featured_image_url || undefined,
    url: `${siteUrl}/work/${item.slug}`,
  };

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="work-article">
        <header className="work-article-hero">
          <p className="kicker">{getWorkTypeLabel(item.content_type)}</p>
          <h1>{item.title}</h1>
          {item.excerpt ? <p className="lede">{item.excerpt}</p> : null}
          <time>{formatWorkDate(item.publish_date)}</time>
          {item.featured_image_url ? (
            <Image src={item.featured_image_url} alt="" width={1400} height={840} sizes="(max-width: 900px) 84vw, 76vw" priority />
          ) : null}
        </header>

        {(item.client_name || item.industry || item.services?.length || item.results) && (
          <section className="work-case-meta">
            {item.client_name ? <div><span>Client</span><strong>{item.client_name}</strong></div> : null}
            {item.industry ? <div><span>Industry</span><strong>{item.industry}</strong></div> : null}
            {item.services?.length ? <div><span>Services</span><strong>{item.services.join(", ")}</strong></div> : null}
            {item.results ? <div><span>Results</span><strong>{item.results}</strong></div> : null}
          </section>
        )}

        <MarkdownContent content={item.body} />

        {cta ? (
          <section className="work-article-cta">
            <p className="kicker">Next Step</p>
            <h2>Ready for the next clear piece?</h2>
            <Link className="button" href={cta.href}>{cta.label} <b>↗</b></Link>
          </section>
        ) : null}
      </article>
    </Shell>
  );
}
