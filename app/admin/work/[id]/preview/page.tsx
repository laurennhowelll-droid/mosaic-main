import Image from "next/image";
import Link from "next/link";
import { Shell } from "../../../../components";
import { requireAdmin } from "../../../../../lib/supabase/admin";
import { formatWorkDate, getAdminWorkItem, getCta, getWorkTypeLabel } from "../../../../../lib/work-content";
import { MarkdownContent } from "../../../../work/[slug]/markdown";

export const dynamic = "force-dynamic";

export default async function WorkPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const item = await getAdminWorkItem(id);
  const cta = getCta(item);

  return (
    <Shell>
      <div className="admin-preview-bar">
        <span>Draft preview</span>
        <Link href={`/admin/work/${item.id}`}>Edit →</Link>
      </div>
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
