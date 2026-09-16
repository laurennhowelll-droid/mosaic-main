import Link from "next/link";
import { Shell } from "../components";

const CLARITY_CALL_URL = "https://calendar.app.google/JxAn6pJFxwyu1FJq6";

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

const projectExamples = [
  "CRM Foundation",
  "Business Visibility Dashboard",
  "Lead Capture and Follow-Up System",
  "Customer Journey Automation",
  "Lead Generation System",
  "Service-Business Website",
  "Email and SMS Lifecycle System",
  "Meta or Google Ads Management",
  "SEO Foundation",
  "Fractional Systems Support",
];

const journeySteps = [
  ["Demand", "Ads, SEO, referrals, content, and campaigns create interest."],
  ["Capture", "The website, landing pages, forms, and booking paths collect the right context."],
  ["Organize", "The CRM gives every lead, customer, owner, stage, and next step a clear home."],
  ["Nurture", "Email, SMS, follow-up, and retention workflows keep the relationship moving."],
  ["Measure", "Dashboards show what became booked work, revenue, or lost opportunity."],
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

const workModes = [
  {
    title: "Consulting",
    copy:
      "Mosaic can advise your team, audit your systems, map the customer journey, recommend tools, define requirements, and help you decide what should happen next.",
  },
  {
    title: "Direct Implementation",
    copy:
      "Mosaic can also build the CRM, dashboard, website, automation, campaign structure, reporting layer, or connected workflow directly.",
  },
];

const flexibleCapacity = [
  ["5-hour Discovery Block", "$625"],
  ["10-hour Project Block", "$1,250"],
  ["20-hour Project Block", "$2,400"],
  ["40-hour Project Block", "$4,600"],
];

export default function ServicesPage() {
  return (
    <Shell>
      <section className="services-hero services-simple-hero">
        <div>
          <p className="kicker">Services</p>
          <h1>CRMs, dashboards, websites, and growth systems for service businesses.</h1>
          <p className="services-hero-copy">
            Mosaic helps service businesses create a clearer path from first click to repeat customer. That may mean advising your team, building a CRM, creating a dashboard, improving a website, automating follow-up, or managing the marketing that brings people into the system.
          </p>
          <p className="services-brand-line">You can hire Mosaic to improve one part or connect the entire journey.</p>
          <div className="actions">
            <Link className="button" href={CLARITY_CALL_URL}>
              Book a FREE Clarity Call <b>↗</b>
            </Link>
            <Link className="text-link" href="/clarity-check">
              Take the Free Clarity Check →
            </Link>
          </div>
        </div>
      </section>

      <section className="services-growth services-architecture" id="categories">
        <div className="section-intro">
          <p className="kicker">Four Ways In</p>
          <h2>Start with the piece that needs attention most.</h2>
          <p>
            A business interested only in Google Ads, SEO, email, or a website does not need to buy a CRM first. Mosaic will still assess whether lead capture, follow-up, tracking, and the customer journey can support the work.
          </p>
        </div>
        <div className="services-category-grid">
          {serviceCategories.map((category) => (
            <Link href={category.href} className={category.featured ? "services-category-card featured" : "services-category-card"} key={category.name}>
              <div className="services-category-head">
                <span>{category.number}</span>
                {category.featured ? <strong>Core specialty</strong> : null}
              </div>
              <div className="services-category-title">
                <h3>{category.name}</h3>
                <p className="services-category-headline">{category.headline}</p>
              </div>
              <p className="services-category-copy">{category.copy}</p>
              <ul>
                {category.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
              <div className="services-investment-card">
                <span>Investment</span>
                <strong>{category.investment}</strong>
                <p>{category.pricingCopy}</p>
                <div>
                  {category.scope.map((item) => (
                    <small key={item}>{item}</small>
                  ))}
                </div>
              </div>
              <span className="services-category-cta">{category.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="services-customer-system">
        <div className="section-intro">
          <p className="kicker">Connected Journey</p>
          <h2>Marketing works better when the system around it works too.</h2>
          <p>
            Mosaic connects the full path from demand to revenue visibility, while still allowing focused work on one part when that is the responsible scope.
          </p>
        </div>
        <div className="services-flow" aria-label="Demand to revenue visibility">
          {journeySteps.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services-a-la-carte" id="common-projects">
        <div className="section-intro">
          <p className="kicker">Common Projects</p>
          <h2>Concrete work, scoped around the business in front of us.</h2>
          <p>
            Project pricing depends on complexity, existing systems, data quality, integrations, and engagement model. Mosaic will recommend the most responsible scope after discovery.
          </p>
        </div>
        <div className="services-project-reel" aria-label="Common Mosaic project examples">
          <div className="services-project-track">
            {[...projectExamples, ...projectExamples].map((project, index) => (
              <article className="services-a-la-carte-item" key={`${project}-${index}`} aria-hidden={index >= projectExamples.length}>
                <h3>{project}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services-bigger-problem services-work-modes">
        <div className="section-intro">
          <p className="kicker">Consulting + Implementation</p>
          <h2>Advice, direct build work, or both.</h2>
        </div>
        <div className="services-mode-grid">
          {workModes.map((mode) => (
            <article key={mode.title}>
              <h3>{mode.title}</h3>
              <p>{mode.copy}</p>
            </article>
          ))}
        </div>
        <div className="services-guidance-cta">
          <div>
            <p className="kicker">Start Here</p>
            <h3>Before any consulting or implementation begins, we talk through what is actually needed.</h3>
            <p>
              The free discovery call comes first. We will use that conversation to understand the problem, clarify whether Mosaic is the right fit, and recommend advisory, implementation, or a responsible blend of both.
            </p>
          </div>
          <Link className="button" href={CLARITY_CALL_URL}>
            Chat With Me on a FREE Discovery Call <b>↗</b>
          </Link>
        </div>
      </section>

      <section className="services-growth services-engagements">
        <div className="section-intro">
          <p className="kicker">Engagement Models</p>
          <h2>Clear scope when we know the path. Flexible capacity when the work needs room to evolve.</h2>
          <p>
            Dynamic work is not unlimited or undefined. Clients receive reserved capacity, a prioritized backlog, clear communication, progress visibility, regular recommendations, and the ability to adjust priorities as more is learned.
          </p>
        </div>
        <div className="services-engagement-grid">
          {engagementModels.map((model) => (
            <article key={model.title}>
              <h3>{model.title}</h3>
              <p>{model.copy}</p>
              <ul>
                {model.bestFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="services-guidance-cta">
          <div>
            <p className="kicker">First Step</p>
            <h3>A free discovery call happens before choosing an engagement model.</h3>
            <p>
              We will talk through the work, constraints, timing, and budget first. After that, Mosaic can recommend whether the right next step is a fixed scope, a flexible partnership, or something smaller.
            </p>
          </div>
          <Link className="button" href={CLARITY_CALL_URL}>
            Chat With Me on a FREE Discovery Call <b>↗</b>
          </Link>
        </div>
      </section>

      <section className="services-flexible-capacity">
        <div className="section-intro">
          <p className="kicker">Flexible Capacity</p>
          <h2>Need room to figure it out as we build?</h2>
          <p>
            Some projects can be clearly scoped before work begins. Others reveal new requirements as we inspect the process, data, and existing technology. Flexible Partnerships provide reserved Mosaic capacity applied to a shared, prioritized backlog.
          </p>
        </div>
        <div className="services-capacity-grid">
          {flexibleCapacity.map(([label, price]) => (
            <article key={label}>
              <h3>{label}</h3>
              <strong>{price}</strong>
            </article>
          ))}
        </div>
        <p className="services-pricing-note">
          Capacity is prepaid. Scope, communication, expiration, and progress reporting are defined before work begins.
        </p>
      </section>

      <section className="services-pricing-disclaimer">
        <div>
          <p className="kicker">Pricing Notes</p>
          <h2>Starting prices are intended to provide useful guidance.</h2>
        </div>
        <div>
          <p>
            Final investment depends on scope, complexity, existing systems, data readiness, integrations, required content, and ongoing support needs.
          </p>
          <p>
            Ad spend is separate from Mosaic&apos;s management fee. Software subscriptions, SMS usage, media spend, stock assets, and outside vendor costs are not included unless explicitly stated.
          </p>
          <p>
            Final proposals define included campaigns, platforms, deliverables, revisions, reporting, communication, and timelines. Larger advertising accounts may be priced using a custom monthly fee or percentage of ad spend with a minimum fee.
          </p>
        </div>
      </section>

      <section className="systems-clarity">
        <div>
          <p className="kicker">Free vs Paid Clarity</p>
          <h2>The Clarity Check is a starting point, not a full audit.</h2>
          <p>
            The free Clarity Check gives you a preliminary self-assessment. A paid Systems Clarity Audit is a deeper review of your actual process, tools, data, and team requirements.
          </p>
        </div>
        <div className="systems-clarity-panel">
          <span>Best next step</span>
          <strong>Start with the free check or book a call.</strong>
          <ul>
            <li>Use the Clarity Check if you want a quick self-diagnosis.</li>
            <li>Book a FREE Clarity Call if you already know the work is a priority.</li>
            <li>Mosaic will recommend advisory, implementation, or a responsible blend of both.</li>
          </ul>
          <div className="actions">
            <Link className="button" href={CLARITY_CALL_URL}>
              Book a FREE Clarity Call <b>↗</b>
            </Link>
            <Link className="text-link" href="/clarity-check">
              Take the Free Clarity Check →
            </Link>
          </div>
        </div>
      </section>

      <section className="services-final-cta">
        <p className="kicker">Not Sure Where You Fit?</p>
        <h2>You do not need to know whether this is a CRM, website, automation, dashboard, or marketing problem yet.</h2>
        <p>
          Tell me where leads, information, or responsibilities are getting lost. I will help you determine what needs to be clarified, connected, or improved.
        </p>
        <div className="actions">
          <Link className="button" href={CLARITY_CALL_URL}>
            Book a FREE Clarity Call <b>↗</b>
          </Link>
          <Link className="text-link" href="/clarity-check">
            Take the Free Clarity Check →
          </Link>
        </div>
      </section>
    </Shell>
  );
}
