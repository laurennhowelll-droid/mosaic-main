import Image from "next/image";
import Link from "next/link";
import { Shell } from "../components";
import { getPublishedWorkContent, getWorkTypeLabel, getWorkTypePluralLabel, orderPublicWork, type WorkListItem, workContentTypes } from "../../lib/work-content";

export const dynamic = "force-dynamic";

function WorkCard({ item, index }: { item: WorkListItem; index: number }) {
  return (
    <article className={`work-card work-${(index % 3) + 1}`}>
      <div className="work-art">
        {item.featured_image_url ? (
          <Image src={item.featured_image_url} alt="" width={900} height={620} sizes="(max-width: 800px) 86vw, 28vw" />
        ) : null}
      </div>
      <p className="kicker">{getWorkTypeLabel(item.content_type)}</p>
      <h3>{item.title}</h3>
      {item.excerpt ? <p>{item.excerpt}</p> : null}
      <Link href={`/work/${item.slug}`}>Read more →</Link>
    </article>
  );
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const [{ type = "all" }, items] = await Promise.all([searchParams, getPublishedWorkContent()]);
  const filteredItems = type === "all" ? items : items.filter((item) => item.content_type === type);
  const { top, newest } = orderPublicWork(filteredItems);
  const hasMore = newest.length > 0;

  return (
    <Shell>
      <section className="page-hero">
        <p className="kicker">Selected Work</p>
        <h1>Thoughtful work, built to last.</h1>
        <p className="lede">
          A collection of businesses made clearer through thoughtful strategy, design, systems, and technology.
        </p>
      </section>

      <section className="work-grid">
        <div className="work-filters" aria-label="Filter work">
          <Link className={type === "all" ? "active" : ""} href="/work">All</Link>
          {workContentTypes.map((contentType) => (
            <Link className={type === contentType ? "active" : ""} href={`/work?type=${contentType}`} key={contentType}>
              {getWorkTypePluralLabel(contentType)}
            </Link>
          ))}
        </div>

        {top.map((item, index) => (
          <WorkCard item={item} index={index} key={item.id} />
        ))}

        {top.length === 0 ? (
          <p className="work-empty">No published work is available yet.</p>
        ) : null}
      </section>

      {hasMore ? (
        <section className="work-grid work-grid-secondary">
          <div className="section-intro">
            <p className="kicker">Newest First</p>
            <h2>More from Mosaic.</h2>
          </div>
          {newest.map((item, index) => (
            <WorkCard item={item} index={index} key={item.id} />
          ))}
        </section>
      ) : null}
    </Shell>
  );
}
