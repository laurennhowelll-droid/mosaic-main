import Image from "next/image";
import Link from "next/link";
import { Shell } from "../components";
import { getPublishedWorkContent, getWorkTypeLabel, getWorkTypePluralLabel, orderPublicWork, type WorkListItem, workContentTypes } from "../../lib/work-content";

export const dynamic = "force-dynamic";

const proofHighlights = [
  ["Growth", "≈3× indexed business growth"],
  ["Ecommerce", "BigCommerce → Shopify"],
  ["Systems", "Manual workflows → connected automation"],
  ["Visibility", "Fragmented information → clearer reporting"],
];

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
        <h1>Proof that connected work changes how a business runs.</h1>
        <p className="lede">
          Start with the outcomes. Then see the systems, decisions, and customer experience work underneath them.
        </p>
<Link
  className="button"
  href="https://examples.buildwithmosaic.co/examples"
>
  Explore Interactive Examples <b>↗</b>
</Link>
      </section>

      <section className="work-proof">
        <div>
          <p className="kicker">Primary Case Study</p>
          <h2>White Poppy Preservation</h2>
          <p>
            Lauren helped support major growth while the business rebuilt ecommerce, operations, reporting, automation, and customer experience infrastructure.
          </p>
          <Link className="button" href="/work/white-poppy-preservation">
            View the Case Study <b>↗</b>
          </Link>
        </div>
        <div className="work-proof-grid">
          {proofHighlights.map(([label, result]) => (
            <article key={label}>
              <span>{label}</span>
              <strong>{result}</strong>
            </article>
          ))}
        </div>
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
