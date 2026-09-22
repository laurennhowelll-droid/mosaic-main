import Link from "next/link";
import styles from "./studio.module.css";

export const BOOKING_URL = "https://calendar.app.google/JxAn6pJFxwyu1FJq6";
export const EXAMPLES_URL = "https://examples.buildwithmosaic.co/examples";

export function Arrow() {
  return <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 18 18 6M6 6h12v12" /></svg>;
}

export function Invitation() {
  return <section className={styles.invitation}>
    <p className={styles.eyebrow}>Let’s connect the pieces</p>
    <h2>Your business has its own story.</h2>
    <p>Let’s make the systems behind it feel just as considered.</p>
    <div className={styles.actions}><Link className="button" href={BOOKING_URL}>Explore What We Could Build <Arrow /></Link><Link className={styles.textLink} href="/clarity-check">Take the free Clarity Check <span aria-hidden="true">→</span></Link></div>
    <small>A free introductory conversation. A clearer next step.</small>
  </section>;
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
  { title: "Photographer", industry: "Photography", copy: "More space for the creative work. Less time keeping track of the details.", system: "Client & workflow management", slug: "photographer", variant: "lavender" },
  { title: "Everfield Services", industry: "Home & property services", copy: "A clearer view of the leads, appointments, and people moving a business forward.", system: "Business operations dashboard", slug: "everfield-services", variant: "sand" },
] as const;

export function ExampleCards() {
  return <div className={styles.exampleGrid}>{examples.map(example => <Link className={styles.exampleCard} href={`${EXAMPLES_URL}/${example.slug}`} key={example.slug}>
    <SystemPreview compact variant={example.variant} />
    <div className={styles.cardCopy}><span className={styles.badge}>Concept demo</span><p className={styles.eyebrow}>{example.industry}</p><h3>{example.title}<Arrow /></h3><p>{example.copy}</p><span className={styles.cardMeta}>{example.system}</span></div>
  </Link>)}</div>;
}
