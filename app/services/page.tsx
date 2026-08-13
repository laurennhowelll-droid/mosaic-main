import Link from "next/link";
import { Shell } from "../components";

const serviceCards = [
  {
    number: "01",
    title: "Vision",
    price: "Starting at $2,500",
    purpose: "Find clarity before building.",
    description:
      "A focused strategic engagement for businesses that know something needs to change but need a clearer roadmap before investing in a website, system, or technology decision.",
    label: "Key inclusions",
    items: [
      "Vision Workshop",
      "Business Audit",
      "Customer Journey",
      "Systems Audit",
      "Opportunity Mapping",
      "90-Day Roadmap",
    ],
    timeline: "1-2 weeks",
    href: "/services/vision",
  },
  {
    number: "02",
    title: "Experience",
    price: "Starting at $4,500",
    purpose:
      "Create a customer experience that reflects the vision.",
    description:
      "A custom website and customer journey engagement that brings messaging, structure, design, lead capture, and launch details into alignment.",
    label: "Key inclusions",
    items: [
      "Website Strategy",
      "UX Architecture",
      "Custom Website",
      "Messaging Direction",
      "CRM Integration",
      "Launch Support",
    ],
    timeline: "4-8 weeks",
    href: "/services/experience",
  },
  {
    number: "03",
    title: "Connect",
    price: "Starting at $5,000",
    purpose: "Build internal systems that remove friction.",
    description:
      "A systems engagement for teams outgrowing manual work, scattered data, repeated entry, or workflows that only one person understands.",
    label: "Key inclusions",
    items: [
      "Process Architecture",
      "CRM + Databases",
      "Workflow Automation",
      "Dashboards + Reporting",
      "Documentation",
      "Team Training",
    ],
    timeline: "4-10 weeks",
    href: "/services/connect",
  },
  {
    number: "04",
    title: "Grow",
    price: "Starting at $750/mo",
    purpose: "Long-term strategic partnership.",
    description:
      "Ongoing support for businesses that want their website, systems, reporting, automations, and operational decisions to keep improving with context.",
    label: "Includes",
    items: [
      "Monthly Strategy",
      "Website Updates",
      "Automation Improvements",
      "Reporting",
      "Team Consulting",
      "Priority Support",
    ],
    timeline: "Ongoing",
    href: "/services/grow",
  },
];

const aLaCarteServices = [
  ["Clarity Call", "Starting at $500"],
  ["Business Systems Audit", "Starting at $750"],
  ["Brand Refresh", "Starting at $750"],
  ["Website / UX Audit", "Starting at $500"],
  ["Landing Page", "Starting at $750"],
  ["Website", "Starting at $1,500"],
  ["Website Migration", "Starting at $750"],
  ["Automation Sprint", "Starting at $750"],
  ["Workflow Build", "Starting at $1,000"],
  ["Dashboard", "Starting at $1,000"],
  ["CRM Setup / Cleanup", "Starting at $1,000"],
  ["Airtable / Database Build", "Starting at $1,500"],
  ["Client / Team Portal", "Starting at $1,500"],
  ["AI Workflow Setup", "Starting at $750"],
  ["Documentation / SOP Package", "Starting at $1,000"],
  ["Team Training", "Starting at $500"],
];

const faqs = [
  {
    question: "Do I have to do every phase?",
    answer:
      "No. Each engagement can stand on its own. After your Discovery Call, we recommend only the engagement—or combination of engagements—that matches your business, timing, and goals.",
  },
  {
    question: "Can Mosaic work with my existing team?",
    answer:
      "Yes. We often partner with founders, operators, marketers, designers, developers, and internal teams already doing good work.",
  },
  {
    question: "Do you replace employees?",
    answer:
      "No. Mosaic creates clarity, systems, and structure so your people can work with less friction and better direction.",
  },
  {
    question: "Can you work with our current software?",
    answer:
      "Yes. We begin by understanding what you already use, then improve, connect, or simplify the tools around the way your business actually works.",
  },
  {
    question: "How long do projects take?",
    answer:
      "Vision usually takes 1-2 weeks. Experience and Connect engagements commonly take 4-10 weeks depending on scope.",
  },
  {
    question: "Can we retain Mosaic after launch?",
    answer:
      "Yes. Grow retainers keep strategy, websites, automations, reporting, and systems improving after the first project is live.",
  },
];

export default function ServicesPage() {
  return (
    <Shell>
      <section className="services-hero">
        <div>
          <p className="kicker">How We Help</p>
          <h1>
            Every business has the pieces.
            <br />
            We help them work together.
          </h1>
          <p className="services-hero-lede">
            Most businesses don&apos;t need more software.
            <br />
            They need more clarity.
          </p>
          <p className="services-hero-copy">
            Mosaic helps founders align their vision, brand,
            website, operations, systems, and technology into one
            connected business.
          </p>
          <div className="actions">
            <Link className="button" href="https://calendar.app.google/JxAn6pJFxwyu1FJq6">
              Book a Discovery Call <b>↗</b>
            </Link>
            <Link className="text-link" href="/process">
              Learn About Our Process →
            </Link>
            <Link className="text-link" href="#a-la-carte">
              Explore À La Carte →
            </Link>
          </div>
        </div>
      </section>

      <section className="services-philosophy">
        <div>
          <p className="kicker">Our Philosophy</p>
          <h2>Technology should create clarity.</h2>
        </div>
        <div className="services-philosophy-copy">
          <p>Most businesses grow by adding tools.</p>
          <p>
            Another platform.
            <br />
            Another spreadsheet.
            <br />
            Another automation.
          </p>
          <p>Eventually every department works differently.</p>
          <p>
            Marketing.
            <br />
            Operations.
            <br />
            Sales.
            <br />
            Customer experience.
          </p>
          <p>
            The business grows, but complexity grows faster.
          </p>
          <p>
            Mosaic exists to reconnect every part of the business
            back to one clear vision.
          </p>
          <p>
            We don&apos;t sell software.
            <br />
            We build businesses that work beautifully.
          </p>
        </div>
      </section>

      <section className="services-offerings">
        <div className="section-intro">
          <p className="kicker">Four Services</p>
          <h2>Choose the right level of clarity.</h2>
          <p className="services-supporting-copy">
            Standalone by design. Stackable when it makes sense.
          </p>
        </div>
        <div className="services-card-grid">
          {serviceCards.map((service) => (
            <article className="services-card" key={service.title}>
              <div className="services-card-head">
                <span>{service.number}</span>
                <p>{service.price}</p>
              </div>
              <h3>{service.title}</h3>
              <p className="services-purpose">{service.purpose}</p>
              <p className="services-card-description">{service.description}</p>
              <div className="services-list-block">
                <p className="kicker">{service.label}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="services-card-foot">
                <div>
                  <span>Timeline</span>
                  <strong>{service.timeline}</strong>
                </div>
                <Link href={service.href}>Learn More →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="services-growth">
        <div className="section-intro">
          <p className="kicker">How Projects Work Together</p>
          <h2>Built to work together.</h2>
        </div>
        <div className="services-timeline" aria-label="Mosaic engagements can build on each other when needed">
          {serviceCards.map((service) => (
            <div className="services-phase" key={service.title}>
              <span>{service.number}</span>
              <strong>{service.title}</strong>
            </div>
          ))}
        </div>
        <div className="services-growth-copy">
          <p>
            Each Mosaic engagement stands on its own. One does not automatically include the services or deliverables of another.
          </p>
          <p>
            But businesses rarely fit neatly into one box. Vision, Experience, Connect, and Grow are designed to work together when your needs cross multiple parts of the business.
          </p>
          <p>
            After your Discovery Call, we&apos;ll recommend the engagement—or combination of engagements—that makes the most sense for you.
          </p>
        </div>
      </section>

      <section className="services-growth">
        <div className="section-intro">
          <p className="kicker">Full Mosaic</p>
          <h2>I need to rethink the whole thing.</h2>
        </div>
        <div className="services-full-mosaic">
          <div>
            <span>Full Mosaic</span>
            <strong>Starting at $11,500</strong>
          </div>
          <p>
            When the disconnect crosses multiple parts of the business, Full Mosaic brings the right engagements together into one coordinated transformation.
          </p>
          <p>
            Full Mosaic is custom-scoped based on what your business actually needs—not a preset package containing every service or deliverable.
          </p>
        </div>
      </section>

      <section className="systems-clarity">
        <div>
          <p className="kicker">Focused Entry Point</p>
          <h2>Not every project starts with a full engagement.</h2>
          <p>
            Sometimes you don&apos;t need a complete business roadmap.
          </p>
          <p>
            Sometimes you simply need an experienced partner to help untangle one important question. The Clarity Session is designed for exactly that.
          </p>
          <ul className="clarity-question-list">
            <li>Should we change CRMs?</li>
            <li>What should we automate first?</li>
            <li>Is Airtable the right solution?</li>
            <li>Do we actually need custom software?</li>
            <li>Why does this workflow feel so complicated?</li>
            <li>How should these systems connect?</li>
          </ul>
        </div>
        <div className="systems-clarity-panel">
          <span>Investment</span>
          <strong>$500</strong>
          <span>Length</span>
          <strong>90 minutes</strong>
          <span>Includes</span>
          <ul>
            <li>Short questionnaire</li>
            <li>Focused strategy session</li>
            <li>Practical recommendations</li>
            <li>Written action summary</li>
            <li>Clear next steps</li>
          </ul>
          <p>
            If you move into a Vision engagement within 30 days, your Clarity Session investment is credited toward your Vision project.
          </p>
          <Link className="secondary-button" href="/clarity">
            Book a Clarity Session →
          </Link>
        </div>
      </section>

      <section className="services-a-la-carte" id="a-la-carte">
        <div className="section-intro">
          <p className="kicker">À La Carte</p>
          <h2>Sometimes you don&apos;t need the whole transformation. You just need one piece.</h2>
          <p className="services-supporting-copy">
            For focused needs, Mosaic offers smaller standalone engagements that can solve a specific problem, strengthen an existing system, or give us a place to start.
          </p>
          <p className="services-supporting-copy">
            These engagements can stand alone or become part of something bigger later.
          </p>
        </div>
        <div className="services-a-la-carte-grid">
          {aLaCarteServices.map(([name, price]) => (
            <article className="services-a-la-carte-item" key={name}>
              <h3>{name}</h3>
              <p>{price}</p>
            </article>
          ))}
        </div>
        <p className="services-a-la-carte-note">
          À la carte pricing reflects starting investments. Final scope and pricing may vary based on complexity and project requirements.
        </p>
        <div className="services-a-la-carte-bridge">
          <h3>Need more than one piece?</h3>
          <p>
            À la carte work can stand alone, or we can connect multiple needs through a larger Mosaic engagement.
          </p>
        </div>
        <div className="services-a-la-carte-custom">
          <h3>Don&apos;t see exactly what you need?</h3>
          <p>
            Custom builds, integrations, and one-off projects are scoped individually. Tell me what you&apos;re trying to solve and we&apos;ll see if Mosaic is the right fit.
          </p>
          <Link className="button" href="mailto:lauren@buildwithmosaic.co?subject=Mosaic%20%E2%80%94%20Custom%20Project%20Inquiry">
            Tell me what you need →
          </Link>
        </div>
      </section>

      <section className="services-investment">
        <div>
          <p className="kicker">Investment</p>
          <h2>Investment should create momentum.</h2>
          <p>
            We intentionally price our work around outcomes instead
            of hours.
          </p>
          <p className="services-supporting-copy">
            Starting prices reflect individual engagements. Combined engagements are scoped and priced based on the work involved.
          </p>
        </div>
        <div className="services-investment-grid">
          <div>
            <span>Clients typically invest between</span>
            <strong>$2,500</strong>
            <span>and</span>
            <strong>$20,000+</strong>
            <span>depending on scope.</span>
          </div>
          <div>
            <span>Retainers begin at</span>
            <strong>$750/month</strong>
            <span>Most long-term clients invest</span>
            <strong>$1,500-3,000/month.</strong>
          </div>
        </div>
      </section>

      <section className="services-faq">
        <div className="section-intro">
          <p className="kicker">FAQ</p>
          <h2>Questions worth asking early.</h2>
        </div>
        <div className="services-faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="services-final-cta">
        <p className="kicker">Not sure where you fit?</p>
        <h2>
          You don&apos;t need to diagnose the problem before we talk.
        </h2>
        <p>
          During your Discovery Call, we&apos;ll determine which engagement—or combination—makes the most sense for where you are.
        </p>
        <Link className="button" href="https://calendar.app.google/JxAn6pJFxwyu1FJq6">
          Book a Discovery Call <b>↗</b>
        </Link>
      </section>
    </Shell>
  );
}
