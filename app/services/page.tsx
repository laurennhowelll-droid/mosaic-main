import Link from "next/link";
import { Shell } from "../components";

const serviceCards = [
  {
    number: "01",
    title: "Vision",
    price: "Starting at $2,500",
    purpose: "Find clarity before building.",
    label: "Deliverables",
    items: [
      "Vision Workshop",
      "Business Audit",
      "Brand Positioning",
      "Customer Journey",
      "Systems Audit",
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
    label: "Deliverables",
    items: [
      "Website Strategy",
      "UX Architecture",
      "Custom Website",
      "Copywriting",
      "CRM Integration",
      "SEO Foundation",
    ],
    timeline: "4-8 weeks",
    href: "/services/experience",
  },
  {
    number: "03",
    title: "Connect",
    price: "Starting at $5,000",
    purpose: "Build internal systems that remove friction.",
    label: "Deliverables",
    items: [
      "Airtable",
      "CRM",
      "Dashboards",
      "AI Workflows",
      "Automations",
      "Documentation",
      "SOPs",
    ],
    timeline: "4-10 weeks",
    href: "/services/connect",
  },
  {
    number: "04",
    title: "Grow",
    price: "Starting at $750/mo",
    purpose: "Long-term strategic partnership.",
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

const faqs = [
  {
    question: "Do I have to do every phase?",
    answer:
      "No. Every engagement starts with Vision, then we recommend only the phases that match your business, timing, and goals.",
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
            <Link className="button" href="/start">
              Start With Vision <b>↗</b>
            </Link>
            <Link className="text-link" href="/process">
              Learn About Our Process →
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
          <p className="kicker">How Projects Grow</p>
          <h2>Every engagement begins with Vision.</h2>
        </div>
        <div className="services-timeline" aria-label="Project phases">
          {serviceCards.map((service) => (
            <div className="services-phase" key={service.title}>
              <span>{service.number}</span>
              <strong>{service.title}</strong>
            </div>
          ))}
        </div>
        <div className="services-growth-copy">
          <p>Every engagement begins with Vision.</p>
          <p>
            Most clients continue into Experience or Connect.
          </p>
          <p>
            Larger engagements combine multiple phases into one
            cohesive project.
          </p>
          <p>Bundled engagements receive custom pricing.</p>
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
        <p className="kicker">Start With Vision</p>
        <h2>
          Let&apos;s build the business you&apos;ve been trying to run.
        </h2>
        <p>
          Start with a paid Vision Session. Every engagement begins
          by understanding your business before recommending
          technology.
        </p>
        <Link className="button" href="/start">
          Start With Vision <b>↗</b>
        </Link>
      </section>
    </Shell>
  );
}
