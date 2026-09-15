import Image from "next/image";
import Link from "next/link";
import { Mark, Shell } from "./components";

const SERVICES_PATH = "/services";
const WHITE_POPPY_PATH = "/work/white-poppy-preservation";
const CLARITY_CALL_URL = "https://calendar.app.google/JxAn6pJFxwyu1FJq6";

const customerJourney = [
  ["Ads + SEO", "create demand."],
  ["Your website", "captures it."],
  ["Your CRM", "organizes it."],
  ["Email + SMS", "nurture it."],
  ["Your dashboard", "shows what became revenue."],
];

const problemEntryPoints = [
  {
    label: "Inquiries",
    problem: "Inquiries arrive through forms, email, DMs, ads, and referrals, but there is no central place to track them.",
  },
  {
    label: "Follow-Up",
    problem: "Follow-up depends on someone remembering what happens next.",
  },
  {
    label: "Pipeline",
    problem: "You cannot easily see which leads booked, which went cold, or why.",
  },
  {
    label: "Tools",
    problem: "Your booking platform, inbox, CRM, and email marketing do not communicate.",
  },
  {
    label: "Attribution",
    problem: "Ads are producing interest, but you cannot connect that activity to actual revenue.",
  },
  {
    label: "Ownership",
    problem: "Your team asks you questions the system should already answer.",
  },
  {
    label: "Reporting",
    problem: "You rebuild the same report whenever you need information.",
  },
  {
    label: "Records",
    problem: "Important customer details live across spreadsheets, inboxes, and people's heads.",
  },
];

const philosophyCards = [
  {
    title: "Vision",
    accent: "home-card-vision",
    copy: [
      "Everything begins with clarity.",
      "Without vision, businesses slowly become collections of disconnected decisions.",
      "Vision gives every future decision direction.",
    ],
  },
  {
    title: "Structure",
    accent: "home-card-structure",
    copy: [
      "Systems create consistency.",
      "Good processes remove friction and give people confidence.",
      "Technology should support the business, not complicate it.",
    ],
  },
  {
    title: "Connection",
    accent: "home-card-connection",
    copy: [
      "Departments should never operate independently.",
      "Marketing. Operations. Sales. Customer experience. Technology.",
      "Everything affects everything else. Connection is where momentum happens.",
    ],
  },
  {
    title: "Craft",
    accent: "home-card-craft",
    copy: [
      "Details matter.",
      "Beautiful execution builds trust.",
      "Small improvements repeated across every part of a business create extraordinary outcomes.",
    ],
  },
];

const systemOutcomes = [
  {
    title: "Custom CRM Systems",
    copy: "A central place to manage leads, customers, bookings, follow-up, responsibilities, and next steps.",
  },
  {
    title: "Business Dashboards",
    copy: "Clear reporting that shows where leads come from, what converts, what creates revenue, and where opportunities are being lost.",
  },
  {
    title: "Connected Customer Workflows",
    copy: "Automated handoffs between your website, inquiry forms, booking platform, CRM, email, SMS, and team.",
  },
  {
    title: "Marketing and Customer Experience",
    copy: "Websites, Meta Ads, Google Ads, SEO, email, and SMS connected to the systems tracking what happens next.",
  },
];

const homeServices = [
  {
    number: "01",
    service: "Advisory",
    title: "Figure out what needs to change before investing in the wrong solution.",
    description:
      "Map the customer journey, audit the systems, and decide what deserves attention first.",
    outcome:
      "You leave with clearer priorities, practical recommendations, and a responsible next step.",
    href: "/services",
  },
  {
    number: "02",
    service: "Systems",
    title: "Build the foundation that captures, organizes, and measures growth.",
    description:
      "Create CRMs, dashboards, lead workflows, automations, integrations, portals, and internal tools.",
    outcome:
      "You leave with one clearer operating layer for leads, customers, responsibilities, and reporting.",
    href: "/services",
  },
  {
    number: "03",
    service: "Experience",
    title: "Create a clear path from interest to inquiry.",
    description:
      "Improve service-business websites, landing pages, forms, booking experiences, and customer journeys.",
    outcome:
      "You leave with a public experience that captures better information and connects to what happens next.",
    href: "/services",
  },
  {
    number: "04",
    service: "Growth",
    title: "Bring the right people into a system built to convert them.",
    description:
      "Support Meta Ads, Google Ads, SEO, email, SMS, lead nurturing, conversion tracking, and attribution.",
    outcome:
      "You leave with marketing connected to lead capture, follow-up, and the numbers that matter.",
    href: "/services",
  },
];

const proofResults = [
  ["3×", "business growth supported during the engagement"],
  ["Airtable", "operational infrastructure and reporting"],
  ["Shopify", "connected ecommerce workflows"],
  ["Executive", "dashboards and cross-department visibility"],
  ["Automation", "less repetitive operational work"],
  ["Inventory", "clearer visibility and handoffs"],
];

const transformationSteps = [
  {
    title: "Clear",
    copy: "Understand how leads, customers, information, and responsibilities currently move through the business.",
  },
  {
    title: "Connect",
    copy: "Build the CRM, dashboards, workflows, and automations that bring the journey together.",
  },
  {
    title: "Grow",
    copy: "Improve the website, marketing, retention, and customer experience around a reliable foundation.",
  },
];

const dashboardRows = [
  ["Maya Chen", "Google Ads", "Booked", "Today", "Jules", "$4,800"],
  ["Brightline Dental", "Referral", "Proposal", "Tomorrow", "Lauren", "$9,200"],
  ["North Peak Studio", "Website", "New Lead", "Overdue", "Sam", "$3,400"],
  ["Harbor Wellness", "Meta Ads", "Nurture", "Friday", "Jules", "$6,100"],
];

const dashboardMetrics = [
  ["42%", "Lead-to-booking conversion"],
  ["$86K", "Revenue by tracked source"],
  ["11", "Overdue actions"],
  ["SEO", "Top converting source"],
];

const engagementModels = [
  {
    title: "Defined Project",
    copy: "Best for a clearly understood outcome with agreed deliverables, timeline, and investment.",
    examples: ["Documented requirements", "Confirmed tools", "Clear finish line"],
  },
  {
    title: "Flexible Partnership",
    copy: "Best for complicated systems, evolving priorities, ongoing optimization, or work that requires discovery as we build.",
    examples: ["Reserved capacity", "Prioritized backlog", "Progress visibility"],
  },
];

export default function Home() {
  return (
    <Shell>
      <section className="hero">
        <div>
          <p className="kicker">Business Systems Studio</p>
          <h1>
            Your business has grown.
            <br />
            The way it runs hasn&apos;t caught up.
          </h1>
          <p className="lede">
            Mosaic builds custom CRMs and dashboards for service businesses that have outgrown spreadsheets, manual follow-up, and disconnected tools. We organize your leads, connect booking and communication, automate repetitive work, and give you a clear view of what is driving growth.
          </p>
          <p className="home-service-line">
            CRM · Dashboards · Automation · Websites · Marketing
          </p>
          <div className="actions">
            <Link className="button" href={CLARITY_CALL_URL}>
              Book a FREE Clarity Call <b>↗</b>
            </Link>
            <Link className="text-link" href={SERVICES_PATH}>
              See What We Build →
            </Link>
          </div>
        </div>
        <div className="hero-mark" aria-label="Connected business illustration">
          <span className="hero-art-watermark" aria-hidden="true" />
          <span className="hero-art-line hero-art-line-vision" aria-hidden="true" />
          <span className="hero-art-line hero-art-line-structure" aria-hidden="true" />
          <span className="hero-art-line hero-art-line-connection" aria-hidden="true" />
          <span className="hero-art-line hero-art-line-craft" aria-hidden="true" />
          <span className="hero-art-label hero-art-label-vision">Vision</span>
          <span className="hero-art-label hero-art-label-structure">Structure</span>
          <span className="hero-art-label hero-art-label-connection">Connection</span>
          <span className="hero-art-label hero-art-label-craft">Craft</span>
          <Image
            className="hero-mark-image"
            src="/brand/mosaic-hero.svg"
            alt="Mosaic tile mark showing connected parts of a business"
            width={738}
            height={700}
            priority
          />
        </div>
      </section>

      <section className="home-journey">
        <div className="section-intro">
          <p className="kicker">Connected Growth</p>
          <h2>Growth works better when every step is connected.</h2>
          <p>
            Mosaic can improve one part of this journey or connect the entire experience. You do not need to hire us for every piece.
          </p>
        </div>
        <div className="home-journey-flow" aria-label="Connected customer journey">
          {customerJourney.map(([step, copy], index) => (
            <article key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-recognition">
        <div className="section-intro">
          <p className="kicker">Recognizable Problems</p>
          <h2>Your business may have outgrown its systems if...</h2>
          <p>Service businesses rarely become messy all at once. The warning signs usually show up in lead tracking, follow-up, handoffs, and reporting first.</p>
        </div>
        <div className="home-recognition-grid">
          {problemEntryPoints.map((item, index) => (
            <article key={item.label}>
              <span>0{index + 1} / {item.label}</span>
              <h3>{item.problem}</h3>
            </article>
          ))}
        </div>
        <p className="home-section-closing">
          Mosaic brings those pieces into one system your team can understand and your business can grow with.
        </p>
      </section>

      <section className="home-builds">
        <div className="section-intro">
          <p className="kicker">What Mosaic Builds</p>
          <h2>Build the system behind your growth.</h2>
          <p>
            Mosaic builds practical operating layers that help leads, customers, responsibilities, communication, and reporting move through the business with less friction.
          </p>
        </div>
        <div className="home-build-grid">
          {systemOutcomes.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-services">
        <div className="section-intro">
          <p className="kicker">Services</p>
          <h2>One studio for the pieces that shape the customer journey.</h2>
          <p>Mosaic can help with one component or connect the entire path from demand to revenue visibility.</p>
        </div>
        <div className="home-service-grid">
          {homeServices.map((service) => (
            <Link href={service.href} className="home-service-card" key={service.service}>
              <span>{service.number}</span>
              <p>{service.service}</p>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <strong>{service.outcome}</strong>
              <b>↗</b>
            </Link>
          ))}
        </div>
        <div className="home-service-note">
          <p>You can hire Mosaic for advice, implementation, or both. A website, CRM, dashboard, email program, SEO project, or ad account may be fixed or flexible depending on scope certainty.</p>
          <Link className="button" href={SERVICES_PATH}>
            Explore Services <b>↗</b>
          </Link>
        </div>
      </section>

      <section className="home-transform">
        <div className="section-intro">
          <p className="kicker">Clear / Connect / Grow</p>
          <h2>Clear up the mess. Connect the pieces. Grow with confidence.</h2>
        </div>
        <div className="home-transform-grid">
          {transformationSteps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-system-demo">
        <div className="section-intro">
          <p className="kicker">System Example</p>
          <h2>See your entire customer journey in one place.</h2>
          <p>This representative mockup uses fictional data to show the kind of visibility a Mosaic CRM or dashboard can create.</p>
        </div>
        <div className="home-dashboard" aria-label="Representative fictional CRM and dashboard mockup">
          <div className="home-dashboard-header">
            <div>
              <span>Pipeline Dashboard</span>
              <strong>Service Growth System</strong>
            </div>
            <p>Fictional demo data</p>
          </div>
          <div className="home-dashboard-metrics">
            {dashboardMetrics.map(([metric, label]) => (
              <article key={label}>
                <strong>{metric}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
          <div className="home-dashboard-table" role="table" aria-label="Lead pipeline">
            <div role="row">
              <span role="columnheader">Lead</span>
              <span role="columnheader">Source</span>
              <span role="columnheader">Stage</span>
              <span role="columnheader">Next Follow-Up</span>
              <span role="columnheader">Owner</span>
              <span role="columnheader">Value</span>
            </div>
            {dashboardRows.map(([lead, source, stage, followUp, owner, value]) => (
              <div role="row" key={lead}>
                <span role="cell">{lead}</span>
                <span role="cell">{source}</span>
                <span role="cell">{stage}</span>
                <span role="cell">{followUp}</span>
                <span role="cell">{owner}</span>
                <span role="cell">{value}</span>
              </div>
            ))}
          </div>
          <div className="home-dashboard-foot">
            <span>Lost-lead reasons</span>
            <span>Booking status</span>
            <span>Revenue by source</span>
            <span>Overdue actions</span>
          </div>
        </div>
      </section>

      <section className="home-work">
        <div className="section-intro">
          <p className="kicker">Proof</p>
          <h2>How connected systems and reporting supported 3× business growth.</h2>
          <p>
            White Poppy&apos;s growth had outpaced the systems behind it. Lauren&apos;s work helped centralize operational information, strengthen Airtable infrastructure, connect Shopify workflows, build dashboards, improve inventory visibility, and reduce repetitive work.
          </p>
        </div>
        <article className="home-work-feature">
          <div className="home-work-summary">
            <p className="kicker">White Poppy Preservation</p>
            <h3>Growth supported by clearer infrastructure.</h3>
            <p>
              Mosaic does not claim one system caused every outcome. The point is that better infrastructure made growth easier to understand, support, and continue improving.
            </p>
            <Link href={WHITE_POPPY_PATH}>View the Case Study →</Link>
          </div>
          <div className="home-work-metrics">
            {proofResults.map(([metric, label]) => (
              <div key={`${metric}-${label}`}>
                <span>{label}</span>
                <strong>{metric}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="home-engagements">
        <div className="section-intro">
          <p className="kicker">Engagement Models</p>
          <h2>Clear scope when we know the path. Flexible capacity when the work needs room to evolve.</h2>
          <p>You do not need to determine which model you need. Mosaic will recommend the most responsible fit after learning about your business.</p>
        </div>
        <div className="home-engagement-grid">
          {engagementModels.map((model) => (
            <article key={model.title}>
              <h3>{model.title}</h3>
              <p>{model.copy}</p>
              <ul>
                {model.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="home-engagement-cta">
          <p>Not sure which model fits yet?</p>
          <Link className="button" href={CLARITY_CALL_URL}>
            Book a FREE Discovery Call <b>↗</b>
          </Link>
        </div>
      </section>

      <section className="home-meaning">
        <div className="home-meaning-intro">
          <p className="kicker">Mosaic Philosophy</p>
          <h2>Every tool should earn its place.</h2>
          <p>
            Technology should reduce complexity. The whole picture matters. You should never be more confused after working with Mosaic than you were before.
          </p>
        </div>
        <div className="home-meaning-layout">
          <div className="home-museum-mark" aria-label="Mosaic icon">
            <Mark />
          </div>
          <div className="home-philosophy-cards">
            {philosophyCards.map((card, index) => (
              <article className={`home-philosophy-card ${card.accent}`} key={card.title}>
                <span>0{index + 1}</span>
                <h3>{card.title}</h3>
                {card.copy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <p className="kicker">Start Where The Pieces Feel Loose</p>
        <h2>
          Your business already has the pieces. Let&apos;s make them work together.
        </h2>
        <div className="home-clarity-prompt">
          <h3>Tell me where leads, information, or responsibilities are getting lost.</h3>
          <p>
            I&apos;ll help you determine what needs to be clarified, connected, or improved.
          </p>
          <div className="actions">
            <Link className="button" href={CLARITY_CALL_URL}>
              Book a FREE Clarity Call <b>↗</b>
            </Link>
            <Link className="secondary-button" href="/clarity-check">
              Take the Free Clarity Check
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
