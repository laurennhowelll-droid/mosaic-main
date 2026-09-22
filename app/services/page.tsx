import Link from "next/link";
import { Shell } from "../components";
import { Arrow, BOOKING_URL, EXAMPLES_URL, Invitation, SectionHeading } from "../studio";
import styles from "../studio.module.css";

const serviceCategories = [
  {
    number: "01",
    name: "Advisory",
    headline: "Figure out what needs to change before investing in the wrong solution.",
    copy:
      "Use Mosaic as a strategic systems partner before you commit to a CRM, dashboard, website, automation, marketing project, or larger implementation.",
    services: [
      "Systems Clarity Audits",
      "Marketing and funnel audits",
      "CRM and dashboard strategy",
      "Customer-journey mapping",
      "Technology recommendations",
      "Automation planning",
      "Fractional systems consulting",
    ],
    investment: "Starting at $750",
    scope: [
      "Focused consulting: $250 per session",
      "Systems Clarity Audits: $750-$1,500",
      "Strategy Sprints: $1,500-$3,000",
      "Fractional advisory: starting at $1,250/month",
    ],
    pricingCopy:
      "Choose a defined audit or strategy engagement when the question is clear, or reserve ongoing advisory capacity when priorities need room to evolve.",
    href: "/services/inquire/clarity",
    cta: "Start With Advisory",
  },
  {
    number: "02",
    name: "CRM & Systems",
    headline: "Build the foundation that captures, organizes, and measures growth.",
    copy:
      "Design and build the operating layer behind the business: the CRM, dashboards, workflows, automations, and internal tools your team uses every day.",
    services: [
      "Custom CRMs",
      "Dashboards and reporting",
      "Lead capture and booking workflows",
      "Follow-up systems",
      "Automation and integrations",
      "Client portals",
      "Internal tools",
      "AI-enabled workflows",
    ],
    investment: "Projects starting at $2,000",
    scope: [
      "Dashboard builds: $2,000-$5,000",
      "CRM foundations: $3,000-$6,000",
      "Connected CRM and dashboard systems: $5,000-$10,000",
      "Advanced systems, portals, migrations, and custom builds: scoped after discovery",
      "Flexible implementation capacity: starting at $1,250",
    ],
    pricingCopy:
      "Defined builds work best when requirements are clear. Complicated systems, migrations, custom tools, and evolving workflows may begin with discovery and continue through flexible capacity.",
    href: "/services/inquire/systems",
    cta: "Discuss CRM & Systems",
    featured: true,
  },
  {
    number: "03",
    name: "Websites & Customer Experience",
    headline: "Create a clear path from interest to inquiry.",
    copy:
      "Improve the public-facing journey so the right people understand what you do, take the next step, and enter a follow-up system that can support them.",
    services: [
      "Service-business websites",
      "Landing pages",
      "Conversion improvements",
      "Inquiry forms",
      "Booking experiences",
      "Customer journeys",
      "Website messaging and structure",
    ],
    investment: "Projects starting at $1,500",
    scope: [
      "Landing pages and lead flows: $1,500-$3,500",
      "Service-business websites: $3,500-$8,000",
      "Larger websites, copy, custom integrations, and complete customer journeys: custom scope",
      "Ongoing website improvement: available through flexible capacity",
    ],
    pricingCopy:
      "A focused landing page can be a defined project. A larger website or customer journey may be fixed after discovery or developed through an evolving partnership.",
    href: "/services/inquire/website",
    cta: "Improve the Experience",
  },
  {
    number: "04",
    name: "Marketing & Growth",
    headline: "Bring the right people into a system built to convert them.",
    copy:
      "Support demand generation, nurturing, retention, and measurement without treating marketing as separate from what happens after the lead arrives.",
    services: [
      "Meta Ads",
      "Google Ads",
      "SEO",
      "Email marketing",
      "SMS marketing",
      "Lead nurturing",
      "Retention campaigns",
      "Conversion tracking",
      "Marketing attribution",
    ],
    investment: "Engagements starting at $750/month",
    scope: [
      "Paid advertising setup or audit: $1,000-$2,500",
      "Meta Ads management: starting at $850/month",
      "Google Ads management: starting at $1,000/month",
      "Email and SMS setup: $1,500-$4,000",
      "Email and SMS management: starting at $1,250/month",
      "SEO foundations: $1,500-$3,000",
      "Ongoing local SEO: starting at $1,000/month",
      "Lead Generation System: setup starting at $3,500 and ongoing management starting at $1,500/month",
    ],
    pricingCopy:
      "Mosaic can manage an individual growth channel or connect advertising, SEO, website conversion, CRM tracking, email, SMS, and reporting into one measurable lead-generation system.",
    href: "/services/inquire/generate",
    cta: "Talk About Growth",
  },
];

const engagementModels = [
  {
    title: "Defined Project",
    copy: "A fixed scope, timeline, investment, and set of deliverables.",
    bestFor: [
      "The workflow is understood",
      "Requirements are documented",
      "Tools and integrations are confirmed",
      "The outcome can be clearly defined",
      "Mosaic can confidently define what done means",
    ],
  },
  {
    title: "Flexible Partnership",
    copy: "Prepaid or recurring capacity applied to an agreed, prioritized backlog.",
    bestFor: [
      "The process is complicated or undocumented",
      "Multiple tools or departments are involved",
      "Requirements will evolve through discovery",
      "Data quality is unknown",
      "The work involves continuous optimization",
    ],
  },
];

const flexibleCapacity = [
  ["5-hour Discovery Block", "$625"],
  ["10-hour Project Block", "$1,250"],
  ["20-hour Project Block", "$2,400"],
  ["40-hour Project Block", "$4,600"],
];

export default function ServicesPage() {
  return <Shell><div className={styles.studio}>
    <section className={styles.pageIntro}>
      <p className={styles.eyebrow}>The right pieces, working together</p>
      <h1>A little more clarity.<br /><em>A lot more possibility.</em></h1>
      <p>CRMs, dashboards, websites, and growth systems for service businesses. Start with one piece, or let’s connect the whole journey.</p>
      <div className={styles.actions}><Link className="button" href={BOOKING_URL}>Explore What We Could Build <Arrow /></Link><Link className={styles.textLink} href="#services">Find your starting point <span aria-hidden="true">↓</span></Link></div>
    </section>
    <section className={styles.section} id="services">
      <SectionHeading eyebrow="Services" title="What needs a little attention?" copy="You can hire Mosaic for advice, direct implementation, or both. Each engagement starts with the business in front of us." />
      <div className={styles.offeringGrid}>{serviceCategories.map(category => <article className={styles.offering} key={category.number}>
        <div className={styles.cardTop}><span>{category.number}</span>{category.featured && <span className={styles.sageBadge}>Core specialty</span>}</div>
        <h2>{category.name}</h2><p>{category.headline}</p>
        <ul>{category.services.map(service => <li key={service}>{service}</li>)}</ul>
        <div className={styles.offeringBottom}><strong>{category.investment}</strong><details className={styles.pricingDetail}><summary>Scope & pricing details</summary><p>{category.copy}</p><p>{category.pricingCopy}</p><ul>{category.scope.map(item => <li key={item}>{item}</li>)}</ul></details><Link className={styles.textLink} href={category.href}>{category.cta} <Arrow /></Link></div>
      </article>)}</div>
    </section>
    <section className={styles.libraryStrip}><div><p className={styles.eyebrow}>Make it tangible</p><h2>Wondering what that could look like?</h2><p>Explore working concepts for venues, photographers, and service businesses.</p></div><Link className="secondary-button" href={EXAMPLES_URL}>Step inside an example <Arrow /></Link></section>
    <section className={styles.section}>
      <SectionHeading eyebrow="A way of working that fits" title="Clear scope. Or room to discover." copy="We’ll recommend the right engagement after a free clarity call. You don’t need to figure it out alone." />
      <div className={styles.twoColumns}>{engagementModels.map(model => <article className={styles.panel} key={model.title}><h3>{model.title}</h3><p>{model.copy}</p><ul>{model.bestFor.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
      <details className={styles.capacity}><summary>Explore flexible capacity & rates <span aria-hidden="true">+</span></summary><div className={styles.capacityGrid}>{flexibleCapacity.map(([label,price]) => <div key={label}><span>{label}</span><strong>{price}</strong></div>)}</div><p>Capacity is prepaid. Scope, communication, expiration, and progress reporting are defined before work begins.</p></details>
    </section>
    <section className={styles.section}>
      <SectionHeading eyebrow="Good questions" title="A few things to know before we begin." />
      <div className={styles.faq}>
        <details><summary>Do I need a whole new system?</summary><p>No. A website, Google Ads, SEO, email, or a focused workflow can be the entire engagement. We’ll check that the surrounding lead capture, follow-up, and tracking can support the work.</p></details>
        <details><summary>What’s included in the investment?</summary><p>Starting prices are guidance. Final investment depends on scope, complexity, existing systems, data readiness, integrations, content, and support. Proposals define platforms, deliverables, revisions, reporting, communication, and timelines.</p><p>Ad spend, software subscriptions, SMS usage, stock assets, and outside vendor costs are separate unless explicitly included. Larger advertising accounts may use a custom monthly fee or percentage of ad spend with a minimum fee.</p></details>
        <details><summary>How is a clarity call different from a paid session?</summary><p>The introductory clarity call is free. It helps us understand the problem and recommend a next step. The <Link href="/clarity">90-minute Clarity Session</Link> is a paid working session for one important question. Systems Clarity Audits are deeper reviews of your process, tools, data, and team requirements.</p></details>
        <details><summary>Where should I start if I’m not sure?</summary><p>Book a free clarity call, or take the <Link href="/clarity-check">free Clarity Check</Link> for a preliminary self-assessment. We’ll help you work out what needs to be clarified, connected, or improved.</p></details>
      </div>
    </section>
    <Invitation />
  </div></Shell>;
}
