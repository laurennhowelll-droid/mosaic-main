import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shell } from "./components";
import { Arrow, BOOKING_URL, EXAMPLES_URL, ExampleCards, Invitation, SectionHeading, ClientJourney, SystemsSteps } from "./studio";
import HomepageConversions from "./HomepageConversions";
import styles from "./studio.module.css";

export const metadata: Metadata = {
  title: "Custom CRM & Client Systems for Service Businesses | Mosaic",
  description: "Mosaic builds custom client systems that connect leads, follow-up, booking, payments, and reporting for growing service businesses.",
  openGraph: {
    title: "Custom CRM & Client Systems for Service Businesses | Mosaic",
    description: "One connected client journey, built around how your service business actually works.",
    url: "https://buildwithmosaic.co", siteName: "Mosaic", type: "website",
  },
};

const investmentLevels = [
  {
    scope: "One core workflow",
    title: "Focused Build",
    price: "Starting at $700",
    description: "For fixing one specific part of your client journey without rebuilding everything.",
    examples: ["Lead capture + CRM setup", "Booking + automated follow-up", "Custom dashboard", "One core workflow + automation", "Connecting a few existing tools"],
    note: "Best for businesses with one clear bottleneck they already know they want to solve.",
  },
  {
    scope: "Connected client journey",
    label: "Core Mosaic Build",
    title: "Connected Client System",
    price: "$1,000–$5,000",
    description: "For businesses that need multiple parts of the client journey working together as one connected system.",
    examples: ["Custom CRM + lead pipeline", "Lead source tracking", "Booking", "Automated follow-up", "Estimates or proposals", "Payments", "Integrations", "Dashboard + reporting"],
    note: "Best for growing businesses whose current tools and processes are starting to feel patched together.",
    featured: true,
  },
  {
    scope: "More complex operations",
    title: "Full Custom System",
    price: "$5,000+",
    description: "For more complex businesses, teams, or workflows that need deeper customization.",
    examples: ["Multiple pipelines or workflows", "Custom internal tools", "Client portals", "Advanced automations", "Multiple integrations", "Custom reporting", "More complex operational logic"],
    note: "Best for businesses that need Mosaic to connect or rebuild a larger portion of how work moves through the company.",
  },
] as const;

export default function Home() {
  return <Shell><HomepageConversions /><div className={styles.studio}>
    <section className={styles.hero} id="home-hero">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.greenDot} /> Custom client systems for growing service businesses</p>
        <h1>Your business has outgrown <em>the systems that got it here.</em></h1>
        <p>Mosaic builds custom client systems that connect your leads, follow-up, booking, payments, and reporting — so your business is easier to run as it grows.</p>
        <div className={styles.actions}><Link className="button" href="/systems-score">Get your free Systems Score <Arrow /></Link><Link className={styles.textLink} href="#examples">See what I build <Arrow /></Link></div>
        <span className={styles.heroNote}>21 questions. About 5 minutes. See your score instantly.</span>
      </div>
      <div className={styles.heroJourney}><p className={styles.eyebrow}>The Mosaic Client System</p><ClientJourney /><p>One connected journey.<br /><em>More room to run your business.</em></p></div>
    </section>

    <section className={`${styles.section} ${styles.recognition}`} id="the-problem">
      <div><p className={styles.eyebrow}>Sound familiar?</p><h2>Your business shouldn’t need you to hold it together.</h2><p>None of these problems necessarily mean you need another tool. Sometimes you need the pieces you already have to work like one system.</p></div>
      <ul>{["Leads live in your inbox.", "Follow-up depends on someone remembering.", "Customer information gets copied between tools.", "Your CRM isn’t really being used.", "You’re paying for software that barely talks.", "You can’t easily see which leads became revenue."].map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section className={styles.section} id="client-system">
      <SectionHeading eyebrow="Meet the Mosaic Client System" title="One system built around how your business actually works." copy="A Mosaic Client System connects the parts of your client journey that are currently scattered across inboxes, spreadsheets, calendars, forms, payment platforms, CRMs, and disconnected software." />
      <div className={styles.systemLayout}><ClientJourney detailed /><div className={styles.systemExplanation}><p className={styles.eyebrow}>Growing businesses need better systems</p><h3>The exact tools aren’t the product.<br /><em>The connected client journey is.</em></h3><p>Your system might include a CRM, automations, booking, payments, client portals, dashboards, email/SMS, or integrations. Each piece has a job in the same journey.</p><Link className={styles.textLink} href="/services">What a client system can include <Arrow /></Link></div></div>
    </section>

    <section className={styles.section} id="examples">
      <SectionHeading eyebrow="Step inside a system" title="See what your system could look like." copy="Every business works differently. That’s why Mosaic systems aren’t built from one generic template." href={EXAMPLES_URL} link="Explore interactive examples" />
      <ExampleCards />
      <p className={styles.smallNote}>Screenshots of working interactive concept demos. All demo names, records, and numbers are fictional.</p>
    </section>

    <section className={styles.scoreFeature} id="systems-score">
      <div><p className={styles.eyebrow}>Free · 21 questions · About 5 minutes</p><h2>Not sure what’s actually broken?</h2><p>You don’t need to know whether you need a CRM, automation, dashboard, new booking flow, or something else.</p><p>Start by finding out where your client journey is strongest — and where your systems haven’t caught up with your growth.</p><Link className="button" href="/systems-score">Get my Systems Score <Arrow /></Link><p className={styles.smallNote}>See your overall score instantly.</p></div>
      <ol className={styles.scoreCategories}>{[["Capture", "How inquiries enter your business"], ["Follow-Up", "What happens after the first hello"], ["Connection", "How your tools and people work together"], ["Visibility", "What you can see from lead to revenue"]].map(([title, copy], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
    </section>

    <section className={`${styles.section} ${styles.investment}`} id="investment">
      <div className={styles.investmentIntro}>
        <div><p className={styles.eyebrow}>Investment</p><h2>What should I expect to invest?</h2></div>
        <div><p>Every Mosaic system is custom. The price shouldn’t be a mystery.</p><p>Your final project cost depends on how much of your client journey we’re connecting, what you’re already using, and how much custom functionality needs to be built.</p></div>
      </div>
      <div className={styles.investmentScale} aria-hidden="true"><span>Focused</span><i /><span>Connected</span><i /><span>Custom</span></div>
      <div className={styles.investmentGrid}>
        {investmentLevels.map(level => <article className={`${styles.investmentLevel} ${"featured" in level && level.featured ? styles.investmentFeatured : ""}`} key={level.title}>
          <div className={styles.investmentTop}><span>{level.scope}</span>{"label" in level && <strong>{level.label}</strong>}</div>
          <h3>{level.title}</h3>
          <p className={styles.investmentPrice}>{level.price}</p>
          <p className={styles.investmentDescription}>{level.description}</p>
          <ul>{level.examples.map(item => <li key={item}>{item}</li>)}</ul>
          <p className={styles.investmentNote}>{level.note}</p>
        </article>)}
      </div>
      <div className={styles.investmentNext}>
        <div><p className={styles.eyebrow}>A clear place to start</p><h3>Not sure which one you need?</h3><p><strong>Good. You don’t have to know yet.</strong></p><p>Start with the free Systems Score to see where the friction is.</p><p>If we need to dig deeper, the $300 Systems Audit maps what’s happening, what should change, and what I’d recommend building — with a clear project scope and price before any build begins.</p><Link className="button" href="/systems-score">Get your free Systems Score <Arrow /></Link><p className={styles.investmentCallLink}>Already know you want help? <Link className={styles.textLink} href={BOOKING_URL}>Book a free 20-minute Systems Call <Arrow /></Link></p></div>
        <aside><span>$300 Systems Audit</span><p>If you move forward with a qualifying Mosaic build within 30 days, your $300 audit fee is credited toward the project.</p></aside>
      </div>
    </section>

    <section className={styles.section} id="how-it-works">
      <SectionHeading eyebrow="How it works" title="You don’t have to know what you need." copy="Start with the problem. We’ll figure out the tools later." />
      <SystemsSteps />
    </section>

    <section className={styles.section} id="real-work">
      <SectionHeading eyebrow="Connected work, in practice" title="The work behind a more connected business." />
      <div className={styles.feature}>
        <Link className={styles.featureArt} href="/work/white-poppy-preservation" aria-label="Read the White Poppy Preservation case study"><Image src="/brand/white_poppy.png" alt="White Poppy Preservation" width={800} height={650} sizes="(max-width: 760px) 90vw, 45vw" /><span>White Poppy Preservation · Real client work</span></Link>
        <div className={styles.featureCopy}><p className={styles.eyebrow}>Ecommerce · Operations · Reporting</p><h3>A growing business.<br />A stronger foundation.</h3><p>At White Poppy Preservation, Lauren’s work connected Shopify, Airtable, reporting, inventory, and the everyday workflows behind the business.</p><p>See how the customer experience and the operation behind it came together.</p><Link className={styles.textLink} href="/work/white-poppy-preservation">See the connected work <Arrow /></Link></div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.moment}`} id="who-its-for">
      <div><p className={styles.eyebrow}>Who Mosaic is for</p><h2>Mosaic isn’t really built for an industry.<br /><em>It’s built for a moment.</em></h2><blockquote>“We’re doing well. Why does it feel this messy?”</blockquote></div>
      <div><p>Your business is growing. The clients are there. But somewhere along the way, your systems stopped keeping up.</p><p>The spreadsheet got bigger. The inbox became a task manager. More software subscriptions appeared. Follow-up started depending on someone remembering.</p><p>And the owner became the only person who really knows how everything connects.</p><p><strong>That’s when Mosaic makes sense.</strong></p><p>Mosaic is built for growing service businesses whose systems haven’t caught up with their growth yet.</p><ul className={styles.industryLabels}>{["Wedding venues", "Photographers", "Wellness", "Home services", "Other service businesses"].map(item => <li key={item}>{item}</li>)}</ul></div>
    </section>

    <section className={`${styles.section} ${styles.founder}`} id="meet-lauren">
      <Image src="/brand-reference/founder-photo-web.jpg" alt="Lauren Howell Christensen, founder of Mosaic" width={1066} height={1600} sizes="(max-width: 760px) 80vw, 25vw" />
      <div><p className={styles.eyebrow}>Hi, I’m Lauren.</p><h2>I like messy businesses.</h2><p>Not messy because they’re poorly run. Messy because they’ve grown faster than the systems behind them.</p><p>I started Mosaic to help business owners untangle that mess — simplify what’s there, connect what matters, and build systems that make growth easier to manage.</p><p><strong>Bring me the messy version.</strong></p><Link className={styles.textLink} href="/about">Meet the person behind Mosaic <Arrow /></Link></div>
    </section>
    <Invitation />
  </div></Shell>;
}
