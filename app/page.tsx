import Image from "next/image";
import Link from "next/link";
import { Shell } from "./components";
import { Arrow, BOOKING_URL, EXAMPLES_URL, ExampleCards, Invitation, SectionHeading, SystemPreview } from "./studio";
import styles from "./studio.module.css";

const services = [
  ["01", "Advisory", "A clearer place to start.", "Understand what’s getting in the way and make a practical plan for what comes next.", "/services/inquire/clarity"],
  ["02", "CRM & systems", "Bring the moving parts together.", "Custom CRMs, dashboards, and automations that give your business a connected foundation.", "/services/inquire/systems"],
  ["03", "Websites & experience", "Make the next step feel easy.", "Thoughtful websites, forms, and booking journeys that turn interest into connection.", "/services/inquire/website"],
  ["04", "Marketing & growth", "Give good work room to grow.", "Ads, SEO, email, and SMS connected to the journey that turns new leads into customers.", "/services/inquire/generate"],
];

export default function Home() {
  return <Shell>
    <div className={styles.studio}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span className={styles.greenDot} /> Business systems, thoughtfully connected</p>
          <h1>A more connected business.<br /><em>More room to grow.</em></h1>
          <p>Custom CRMs, dashboards, websites, and workflows for service businesses ready to bring the pieces together.</p>
          <div className={styles.actions}><Link className="button" href={BOOKING_URL}>Explore What We Could Build <Arrow /></Link><Link className={styles.textLink} href={EXAMPLES_URL}>Explore examples <Arrow /></Link></div>
          <span className={styles.heroNote}>Less busywork. A clearer view. A business that feels like yours.</span>
        </div>
        <div className={styles.heroVisual}><SystemPreview /><span className={styles.visualCaption}>A glimpse of what connected can feel like. <span>Fictional demo data</span></span></div>
      </section>

      <section className={styles.section}>
        <SectionHeading eyebrow="The Mosaic library" title="See what’s possible." copy="Step inside a working concept. Imagine what a little more connection could do for your business." href={EXAMPLES_URL} link="Explore the library" />
        <ExampleCards />
        <p className={styles.smallNote}>Interactive concept demos use fictional data.</p>
      </section>

      <section className={styles.section}>
        <SectionHeading eyebrow="Four ways in" title="Start with the piece that needs attention." copy="One focused improvement or a more connected business. We’ll find the right place to begin." href="/services" link="Explore services" />
        <div className={styles.serviceGrid}>{services.map(([number, title, headline, copy, href]) => <Link className={styles.serviceCard} href={href} key={number}><div className={styles.cardTop}><span>{number}</span><Arrow /></div><h3>{title}</h3><strong>{headline}</strong><p>{copy}</p></Link>)}</div>
      </section>

      <section className={styles.section}>
        <SectionHeading eyebrow="Connected work, in practice" title="Good systems make room for what’s next." href="/work" link="Selected work" />
        <div className={styles.feature}>
          <Link className={styles.featureArt} href="/work/white-poppy-preservation" aria-label="Read the White Poppy Preservation case study"><Image src="/brand/white_poppy.png" alt="White Poppy Preservation" width={800} height={650} sizes="(max-width: 760px) 90vw, 45vw" /><span>White Poppy Preservation · Case study</span></Link>
          <div className={styles.featureCopy}><p className={styles.eyebrow}>Ecommerce · Operations · Reporting</p><h3>A growing business.<br />A stronger foundation.</h3><p>As White Poppy grew, Lauren helped connect the systems behind it: Shopify, Airtable, reporting, inventory, and everyday workflows.</p><div className={styles.result}><strong>≈3×</strong><span>business growth supported<br />during the engagement</span></div><p className={styles.smallNote}>Better infrastructure supported the growth. No single system is credited with every outcome.</p><Link className={styles.textLink} href="/work/white-poppy-preservation">Read the story <Arrow /></Link></div>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading eyebrow="The way we work" title="From “this feels complicated” to a clear next step." href="/process" link="Our process" />
        <div className={styles.steps}>{[["01", "Understand the business.", "We listen, map the moving parts, and find what’s really getting in the way."], ["02", "Build what belongs.", "We create the right solution and connect it to the tools and people around it."], ["03", "Make it yours.", "Documentation, training, and a clear handoff give your team the confidence to keep going."]].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className={`${styles.section} ${styles.founder}`}>
        <Image src="/brand-reference/founder-photo-web.jpg" alt="Lauren Howell Christensen, founder of Mosaic" width={1066} height={1600} sizes="(max-width: 760px) 80vw, 25vw" />
        <div><p className={styles.eyebrow}>A person behind the pieces</p><h2>Hi, I’m Lauren.<br /><em>I see how it all connects.</em></h2><p>I built Mosaic for the work that lives between strategy, systems, and the customer experience. I help you see the whole picture, then build the pieces that make your business easier to run.</p><Link className={styles.textLink} href="/about">A little more about Mosaic <Arrow /></Link></div>
      </section>
      <Invitation />
    </div>
  </Shell>;
}
