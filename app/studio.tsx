import Link from "next/link";
import Image from "next/image";
import { BOOKING_URL, EXAMPLES_URL } from "../lib/site-links";
export { BOOKING_URL, EXAMPLES_URL } from "../lib/site-links";
import styles from "./studio.module.css";

export function Arrow() {
  return <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 18 18 6M6 6h12v12" /></svg>;
}

export function Invitation() {
  return <section className={styles.invitation} id="next-step">
    <p className={styles.eyebrow}>Start with understanding</p>
    <h2>You don’t need to know what you need yet.</h2>
    <p>Start by finding out where the friction is.</p>
    <div className={styles.actions}><Link className="button" href="/systems-score">Get your free Systems Score <Arrow /></Link></div>
    <p className={styles.smallNote}>Already know you want help?</p>
    <Link className={styles.textLink} href={BOOKING_URL}>Book a free 20-minute Systems Call <Arrow /></Link>
  </section>;
}

export function ClientJourney({ detailed = false }: { detailed?: boolean }) {
  const steps = detailed ? ["Lead comes in", "Source + information captured", "Follow-up begins", "Client books", "Estimate / proposal / next step", "Payment", "Dashboard updates"] : ["Inquiry", "Follow-up", "Booked", "Paid", "Reported"];
  return <ol className={detailed ? styles.systemDiagram : styles.journey} aria-label="The connected client journey">{steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < steps.length - 1 && <i aria-hidden="true">↓</i>}</li>)}</ol>;
}

export function SystemsSteps() {
  return <div className={styles.funnelSteps}>
    <article><span>01 · FREE</span><h3>Systems Score</h3><p>Find out where the friction is.</p><Link className={styles.textLink} href="/systems-score">Get your score <Arrow /></Link></article>
    <article><span>02 · FREE · 20 MINUTES</span><h3>Systems Call</h3><p>We’ll look at your score together and talk through what’s happening behind it.</p><Link className={styles.textLink} href={BOOKING_URL}>Book a Systems Call <Arrow /></Link></article>
    <article><span>03 · $300</span><h3>Systems Audit</h3><p>I’ll map what’s happening, identify what should change, and recommend the system I’d build.</p><p className={styles.smallNote}>If you move forward with a qualifying Mosaic build within 30 days, your $300 audit fee is credited toward the project.</p></article>
    <article><span>04 · CUSTOM BUILD</span><h3>Mosaic Client System</h3><p>I design and build the connected system around the way your business actually works.</p></article>
  </div>;
}

export function SectionHeading({ eyebrow, title, copy, href, link }: { eyebrow: string; title: string; copy?: string; href?: string; link?: string }) {
  return <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{href && <Link className={styles.textLink} href={href}>{link} <Arrow /></Link>}</div>;
}

export function SystemPreview({ compact = false, variant = "sage" }: { compact?: boolean; variant?: "sage" | "lavender" | "sand" }) {
  return <div className={`${styles.preview} ${styles[variant]} ${compact ? styles.compact : ""}`} aria-hidden="true">
    <div className={styles.previewOrbit} />
    <div className={styles.previewWindow}>
      <div className={styles.previewSidebar}><span className={styles.previewBrand}>m<span>✳</span></span><i /><i /><i /><i /><i /></div>
      <div className={styles.previewContent}>
        <div className={styles.previewTop}><span>Your business, connected</span><span className={styles.previewAvatar}>M</span></div>
        <div className={styles.previewTitle}>A little more clarity.</div>
        <div className={styles.previewStats}><div><span>New inquiries</span><strong>24</strong><small>All in one place</small></div><div><span>Projects in motion</span><strong>12</strong><small>Every next step, clear</small></div><div><span>Follow-ups</span><strong>08</strong><small>Nothing slips through</small></div></div>
        <div className={styles.previewTable}><span>THE NEXT RIGHT THING</span>{[["Willow & Stone", "Proposal sent"], ["North Peak Studio", "Discovery call"], ["Harbor Wellness", "Ready to begin"]].map(([name, status], i) => <div key={name}><span className={styles.previewDot}>{name[0]}</span><strong>{name}</strong><span className={styles.previewStatus}>{status}</span><span>0{i + 1}</span></div>)}</div>
        <div className={styles.previewFoot}><span className={styles.greenDot} /> Connected, from first hello to what’s next.</div>
      </div>
    </div>
    {!compact && <div className={styles.previewNote}><span>✓</span><div><strong>A place for every piece.</strong><small>Leads, projects, people. Together.</small></div></div>}
  </div>;
}

const examples = [
  { title: "Willow & Stone", industry: "Weddings & events", copy: "From the first hello to the final yes. A more connected wedding venue.", system: "Inquiry & booking management", slug: "wedding-venue", variant: "sage" },
  { title: "Juniper Lane Photography", industry: "Photography", copy: "More space for the creative work. Less time keeping track of the details.", system: "Client & workflow management", slug: "photographer", variant: "lavender" },
  { title: "Everfield Services", industry: "Home & property services", copy: "A clearer view of the leads, appointments, and people moving a business forward.", system: "Business operations dashboard", slug: "everfield-services", variant: "sand" },
] as const;

export function ExampleCards() {
  return <div className={styles.exampleGrid}>{examples.map(example => <Link className={styles.exampleCard} href={`${EXAMPLES_URL}/${example.slug}`} key={example.slug}>
    <Image className={styles.exampleScreenshot} src={`/examples/${example.slug}.webp`} alt={`${example.title} interactive demo dashboard with fictional records`} width={1100} height={example.slug === "wedding-venue" ? 512 : 626} sizes="(max-width: 760px) 90vw, 30vw" />
    <div className={styles.cardCopy}><span className={styles.badge}>Concept demo</span><p className={styles.eyebrow}>{example.industry}</p><h3>{example.title}<Arrow /></h3><p>{example.copy}</p><span className={styles.cardMeta}>{example.system}</span></div>
  </Link>)}</div>;
}
