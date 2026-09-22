import Image from "next/image";
import Link from "next/link";
import { Shell } from "../components";
import { Arrow, ExampleCards, EXAMPLES_URL, Invitation, SectionHeading } from "../studio";
import styles from "../studio.module.css";
import { getPublishedWorkContent, getWorkTypeLabel, getWorkTypePluralLabel, orderPublicWork, type WorkListItem, workContentTypes } from "../../lib/work-content";

export const dynamic = "force-dynamic";

function WorkCard({ item }: { item: WorkListItem }) {
  return <Link className={styles.exampleCard} href={`/work/${item.slug}`}>
    {item.featured_image_url ? <Image className={styles.workImage} src={item.featured_image_url} alt="" width={900} height={620} sizes="(max-width: 760px) 90vw, 45vw" /> : <div className={styles.workImage} aria-hidden="true" />}
    <div className={styles.cardCopy}><span className={styles.sageBadge}>{getWorkTypeLabel(item.content_type)}</span><h3 style={{ marginTop: 22 }}>{item.title}<Arrow /></h3>{item.excerpt && <p>{item.excerpt}</p>}<span className={styles.cardMeta}>Read the story →</span></div>
  </Link>;
}

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [params, items] = await Promise.all([searchParams, getPublishedWorkContent()]);
  const type = workContentTypes.some(value => value === params.type) ? params.type : "all";
  const filteredItems = type === "all" ? items : items.filter(item => item.content_type === type);
  const { top, newest } = orderPublicWork(filteredItems);

  return <Shell><div className={styles.studio}>
    <section className={styles.pageIntro}><p className={styles.eyebrow}>Selected work & possibilities</p><h1>Thoughtful systems.<br /><em>Real room to grow.</em></h1><p>The businesses, decisions, and connected pieces behind the work. Explore a client story, or step inside a working concept.</p></section>
    <section className={styles.section}>
      <SectionHeading eyebrow="From the studio" title="The stories behind the systems." />
      <nav className={styles.filters} aria-label="Filter work"><Link aria-current={type === "all" ? "page" : undefined} href="/work">All work</Link>{workContentTypes.map(contentType => <Link aria-current={type === contentType ? "page" : undefined} href={`/work?type=${contentType}`} key={contentType}>{getWorkTypePluralLabel(contentType)}</Link>)}</nav>
      <div className={styles.workGrid}>{[...top, ...newest].map(item => <WorkCard item={item} key={item.id} />)}</div>
      {top.length === 0 && <div className={styles.empty}><p>No published stories in this category yet. <Link href="/work">Explore all work</Link> or try a concept below.</p></div>}
    </section>
    <section className={styles.section}><SectionHeading eyebrow="The Mosaic library" title="Imagine what’s possible." copy="These interactive concepts show how a more connected business could work. Click around and make yourself at home." href={EXAMPLES_URL} link="Explore the library" /><ExampleCards /><p className={styles.smallNote}>Concept demos use fictional data. Client stories above describe real work.</p></section>
    <Invitation />
  </div></Shell>;
}
