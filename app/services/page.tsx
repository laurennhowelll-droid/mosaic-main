import Link from "next/link";
import { Shell } from "../components";

const DISCOVERY_CALL_URL = "https://calendar.app.google/JxAn6pJFxwyu1FJq6";
const CUSTOM_INQUIRY_URL =
  "mailto:lauren@buildwithmosaic.co?subject=Mosaic%20%E2%80%94%20Custom%20Project%20Inquiry";

const entryPoints = [
  {
    label: "Clarity",
    problem: "I know something needs to change. I'm just not sure what.",
    copy:
      "Bring Mosaic the messy question. We'll help you untangle the problem, understand your options, and decide what deserves attention first.",
    examples: [
      "Should we change CRMs?",
      "What should we automate first?",
      "Why does this workflow feel so complicated?",
      "Do we actually need custom software?",
      "What should we fix before we grow?",
    ],
    price: "Starting at $500",
    cta: "Get Clarity ->",
    href: "/services/inquire/clarity",
  },
  {
    label: "Website",
    problem: "My website isn't doing its job.",
    copy:
      "Make it easier for the right people to understand what you do, trust you, and take the next step.",
    examples: [
      "Website / UX audits",
      "Landing pages",
      "Custom websites",
      "Messaging direction",
      "Lead capture",
      "E-commerce / Shopify improvements",
    ],
    price: "Starting at $500",
    cta: "Fix My Website ->",
    href: "/services/inquire/website",
  },
  {
    label: "Systems",
    problem: "We're doing too much manually.",
    copy:
      "Simplify the work behind the business by connecting information, tools, and processes that shouldn't require constant human intervention.",
    examples: [
      "Automation",
      "Workflow builds",
      "CRM setup / cleanup",
      "Airtable / database builds",
      "AI workflows",
      "Documentation / SOPs",
    ],
    price: "Starting at $750",
    cta: "Simplify My Systems ->",
    href: "/services/inquire/systems",
  },
  {
    label: "Visibility",
    problem: "I can't easily tell what's happening in my business.",
    copy:
      "Turn scattered information into reporting you can actually use without rebuilding the same spreadsheet every week.",
    examples: [
      "Dashboards",
      "KPI reporting",
      "Data cleanup",
      "Reporting workflows",
      "Connected data",
      "Operational visibility",
    ],
    price: "Starting at $1,000",
    cta: "See My Business Clearly ->",
    href: "/services/inquire/visibility",
  },
  {
    label: "Generate",
    problem: "We need more of the right customers.",
    copy:
      "Build a clearer system for turning attention into leads and customers, from the ad or first click through conversion.",
    examples: [
      "Digital marketing strategy",
      "Paid social / Meta Ads",
      "Lead generation",
      "Landing pages",
      "Lead capture",
      "Conversion tracking",
    ],
    price: "Starting at $1,500",
    cta: "Generate Demand ->",
    href: "/services/inquire/generate",
  },
  {
    label: "Keep",
    problem: "We're not doing enough with the customers we already have.",
    copy:
      "Turn more first-time visitors, leads, and customers into repeat business through a stronger retention system.",
    examples: [
      "Email marketing",
      "SMS marketing",
      "Klaviyo",
      "Welcome flows",
      "Abandoned cart",
      "Retention reporting",
    ],
    price: "Starting at $1,500",
    cta: "Keep More Customers ->",
    href: "/services/inquire/keep",
  },
];

const growthFlow = [
  ["Generate", "Bring the right people in.", "Ads • Lead Generation • Traffic"],
  ["Convert", "Give them a clear reason to act.", "Website • Landing Pages • Lead Capture • E-commerce"],
  ["Keep", "Give them a reason to come back.", "Email • SMS • Retention • Post-Purchase"],
  ["Measure", "Know what's actually working.", "Analytics • Dashboards • Reporting"],
];

const coreEngagements = [
  {
    number: "01",
    name: "Vision",
    price: "Starting at $2,500",
    headline: "Figure out what should change before you start building.",
    copy:
      "For businesses that need strategy, alignment, and a clear roadmap before making bigger investments.",
    areas: ["Business strategy", "Customer journey", "Systems", "Opportunity mapping", "90-day roadmap"],
    href: "/services/vision",
  },
  {
    number: "02",
    name: "Experience",
    price: "Starting at $4,500",
    headline: "Build the experience your customers actually interact with.",
    copy:
      "For businesses that need their website, messaging, lead capture, and customer journey to work together.",
    areas: ["Website strategy", "UX", "Custom website", "Messaging", "Lead capture", "CRM integration", "Launch"],
    href: "/services/experience",
  },
  {
    number: "03",
    name: "Connect",
    price: "Starting at $5,000",
    headline: "Build the systems behind the business.",
    copy:
      "For businesses outgrowing manual work, disconnected information, scattered tools, and processes that only one person understands.",
    areas: ["Process architecture", "CRM", "Databases", "Automation", "Dashboards", "Documentation", "Training"],
    href: "/services/connect",
  },
  {
    number: "04",
    name: "Grow",
    price: "Starting at $750/month",
    headline: "Keep making the business better.",
    copy:
      "Ongoing strategic and implementation support after we've built the foundation. Scope depends on your needs and engagement level.",
    areas: [
      "Website improvements",
      "Automation improvements",
      "Reporting",
      "Digital marketing",
      "Email / SMS",
      "Retention",
      "Team consulting",
      "Strategy",
    ],
    href: "/services/grow",
  },
];

const aLaCarteServices = [
  ["Clarity Session", "Starting at $500"],
  ["Website / UX Audit", "Starting at $500"],
  ["Website Build", "Starting at $1,500"],
  ["Automation Sprint", "Starting at $750"],
  ["Systems / Workflow Build", "Starting at $1,000"],
  ["Dashboard Build", "Starting at $1,000"],
  ["Retention Setup", "Starting at $1,500"],
];

export default function ServicesPage() {
  return (
    <Shell>
      <section className="services-hero services-simple-hero">
        <div>
          <p className="kicker">How Mosaic Can Help</p>
          <h1>Find what&apos;s making your business harder than it needs to be.</h1>
          <p className="services-hero-copy">
            Mosaic helps growing businesses fix the websites, marketing, systems, workflows, and customer experiences creating unnecessary friction.
          </p>
          <p className="services-hero-copy">
            From one frustrating process to a business-wide transformation, we can start with the piece that needs attention most.
          </p>
          <p className="services-brand-line">Every business has the pieces. We help them work together.</p>
          <div className="actions">
            <Link className="button" href="#starting-points">
              Find Your Starting Point ↓
            </Link>
            <Link className="text-link" href={DISCOVERY_CALL_URL}>
              Book a Discovery Call →
            </Link>
          </div>
        </div>
      </section>

      <section className="services-start" id="starting-points">
        <div className="section-intro">
          <p className="kicker">Start Here</p>
          <h2>What&apos;s making your business harder than it should be?</h2>
          <p>You don&apos;t need to know which Mosaic service you need. Start with the problem you already know you have.</p>
        </div>
        <div className="services-entry-grid">
          {entryPoints.map((entry) => (
            <article className="services-entry-card" key={entry.label}>
              <div className="services-entry-head">
                <span>{entry.label}</span>
                <p>{entry.price}</p>
              </div>
              <h3>{entry.problem}</h3>
              <p>{entry.copy}</p>
              <details>
                <summary>Can include</summary>
                <ul>
                  {entry.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              </details>
              <Link href={entry.href}>{entry.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="services-customer-system">
        <div className="section-intro">
          <p className="kicker">From First Click to Next Purchase</p>
          <h2>Getting the customer is only half the job.</h2>
          <p>
            Marketing works better when the pieces around it work too. Mosaic can connect how people discover your business, what happens when they land on your website, how leads are captured, how customers buy, and what brings them back.
          </p>
        </div>
        <div className="services-flow" aria-label="Generate, convert, keep, and measure">
          {growthFlow.map(([title, copy, examples]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span>{examples}</span>
            </article>
          ))}
        </div>
        <div className="services-generate-keep">
          <div>
            <p className="kicker">Need the whole customer growth system?</p>
            <h3>Generate + Keep</h3>
          </div>
          <p>
            A connected growth engagement for businesses that want to improve how they attract, convert, and retain customers instead of treating ads, websites, email, and reporting as separate projects.
          </p>
          <Link className="secondary-button" href={DISCOVERY_CALL_URL}>
            Ask About Generate + Keep →
          </Link>
        </div>
      </section>

      <section className="services-bigger-problem">
        <div className="section-intro">
          <p className="kicker">When One Piece Isn&apos;t the Whole Problem</p>
          <h2>Sometimes the pieces reveal something bigger.</h2>
        </div>
        <div className="services-bigger-copy">
          <p>A website problem might actually be a positioning problem.</p>
          <p>A marketing problem might actually be a customer journey problem.</p>
          <p>An automation problem might actually be a broken process.</p>
          <p>
            When the problem crosses multiple parts of the business, Mosaic can step back and work on the bigger picture.
          </p>
        </div>
      </section>

      <section className="services-growth">
        <div className="section-intro">
          <p className="kicker">Vision / Experience / Connect / Grow</p>
          <h2>Built to work together.</h2>
          <p>
            Each Mosaic engagement stands on its own. One does not automatically include the services or deliverables of another. But businesses rarely fit neatly into one box.
          </p>
          <p>
            Vision, Experience, Connect, and Grow are designed to work together when your needs cross multiple parts of the business. After your Discovery Call, we&apos;ll recommend the engagement or combination of engagements that makes the most sense.
          </p>
        </div>
        <div className="services-core-list">
          {coreEngagements.map((service) => (
            <article key={service.name}>
              <div className="services-core-meta">
                <span>{service.number}</span>
                <strong>{service.name}</strong>
                <p>{service.price}</p>
              </div>
              <div>
                <h3>{service.headline}</h3>
                <p>{service.copy}</p>
                <ul>
                  {service.areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
              <Link href={service.href}>Explore {service.name} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="services-a-la-carte" id="a-la-carte">
        <div className="section-intro">
          <p className="kicker">Focused Work</p>
          <h2>Need one specific thing?</h2>
          <p>
            Not every problem needs a full engagement. Mosaic also takes on focused builds, audits, and one-off projects.
          </p>
        </div>
        <div className="services-a-la-carte-grid services-simple-list">
          {aLaCarteServices.map(([name, price]) => (
            <article className="services-a-la-carte-item" key={name}>
              <h3>{name}</h3>
              <p>{price}</p>
            </article>
          ))}
        </div>
        <div className="services-also-available">
          <p className="kicker">Also Available</p>
          <p>
            CRM setup + cleanup • Airtable/database builds • landing pages • website migrations • client/team portals • AI workflows • documentation/SOPs • team training • integrations • email/SMS • e-commerce improvements • custom builds
          </p>
        </div>
        <div className="services-a-la-carte-custom">
          <h3>Don&apos;t see exactly what you need?</h3>
          <p>Tell me what&apos;s creating friction and we&apos;ll figure out the right scope.</p>
          <Link className="button" href={CUSTOM_INQUIRY_URL}>
            Tell Me What You Need →
          </Link>
        </div>
      </section>

      <section className="services-philosophy services-why">
        <div>
          <p className="kicker">Why Mosaic</p>
          <h2>The problem is rarely just one tool.</h2>
        </div>
        <div className="services-philosophy-copy">
          <p>Most businesses grow by adding things.</p>
          <p>Another platform. Another spreadsheet. Another campaign. Another automation.</p>
          <p>Eventually the pieces stop working together.</p>
          <p>
            Mosaic looks at the business around the problem, so we don&apos;t build a beautiful website around a confusing customer journey, automate a process that shouldn&apos;t exist, or run ads into a funnel that doesn&apos;t convert.
          </p>
          <p className="services-philosophy-statement">Technology should create clarity.</p>
          <p>
            We don&apos;t sell software.
            <br />
            We build businesses that work beautifully.
          </p>
        </div>
      </section>

      <section className="services-final-cta">
        <p className="kicker">Not Sure Where You Fit?</p>
        <h2>You don&apos;t need to diagnose the whole business before talking to Mosaic.</h2>
        <p>
          Tell me what&apos;s frustrating you, what&apos;s taking too much time, or what isn&apos;t working the way you think it should. We&apos;ll figure out whether it&apos;s one piece or something bigger.
        </p>
        <p className="services-final-note">Bring me the messy version.</p>
        <div className="actions">
          <Link className="button" href={DISCOVERY_CALL_URL}>
            Book a Discovery Call <b>↗</b>
          </Link>
          <Link className="text-link" href="/clarity-check">
            Take the Free Clarity Check →
          </Link>
        </div>
      </section>
    </Shell>
  );
}
