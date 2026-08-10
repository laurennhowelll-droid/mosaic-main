import Link from "next/link";
import { Shell } from "../../components";

const overview = [
  ["Client", "White Poppy Preservation"],
  ["Industry", "Wedding & Floral Preservation"],
  ["Timeline", "September 2024 - September 2026"],
  ["Final Role", "Director of Marketing & Operations"],
];

const before = [
  "Manual order tracking",
  "Disconnected reporting",
  "Multiple sources of truth",
  "Limited inventory visibility",
  "Reactive operational decisions",
  "Heavy manual processes",
  "Growing software complexity",
];

const chapters = [
  {
    title: "Understand",
    copy: "Understand how every department affected the next.",
    items: [
      "Audit the customer journey.",
      "Review operational workflows.",
      "Identify bottlenecks.",
      "Clarify priorities.",
    ],
  },
  {
    title: "Design",
    copy: "Create a stronger customer and operational foundation.",
    items: [
      "Lead the migration from BigCommerce to Shopify.",
      "Improve customer experience.",
      "Improve website architecture.",
      "Improve ecommerce operations.",
      "Create stronger customer communication.",
    ],
  },
  {
    title: "Connect",
    copy: "Build the infrastructure needed for visibility and coordination.",
    items: [
      "Design Airtable infrastructure.",
      "Connect Shopify, Airtable, Stripe, n8n, Zapier, and supporting systems.",
      "Build reporting dashboards.",
      "Create automations.",
      "Improve inventory visibility.",
      "Create SOPs.",
      "Reduce repetitive work.",
    ],
  },
  {
    title: "Scale",
    copy: "Continue refining the business so growth could become more sustainable.",
    items: [
      "Improve operational policies.",
      "Develop reporting.",
      "Improve pricing strategy.",
      "Improve profitability analysis.",
      "Create systems that could support future growth.",
    ],
  },
];

const results = [
  ["3x", "Business growth during engagement"],
  ["<1 Year", "Social Media Manager to Director of Marketing & Operations"],
  ["Complete", "Shopify migration"],
  ["Connected", "Business systems"],
  ["Company-wide", "Automation"],
  ["Executive", "Reporting"],
  ["Operational", "Infrastructure"],
  ["Cross-department", "Visibility"],
];

const comparisons = [
  ["Departments operated independently", "Connected workflows"],
  ["Manual processes", "Automated repetitive work"],
  ["Limited reporting", "Executive dashboards"],
  ["Disconnected systems", "Improved inventory visibility"],
  ["Operational bottlenecks", "Scalable operational systems"],
  ["Growing complexity", "Clearer decision making"],
];

const impactAreas = [
  "Shopify migration",
  "Operational reporting",
  "Inventory systems",
  "Automation",
  "Executive dashboards",
  "Customer experience improvements",
  "Refund and warranty policies",
  "Pricing strategy",
  "Fulfillment improvements",
  "Internal documentation",
  "Business intelligence",
  "Cross-functional leadership",
];

export default function WhitePoppyCaseStudy() {
  return (
    <Shell>
      <section className="case-hero">
        <p className="kicker">Case Study</p>
        <h1>Building the systems behind the growth.</h1>
        <p>
          Over a two-year period, White Poppy Preservation evolved from
          a rapidly growing ecommerce business into a significantly more
          connected operation.
        </p>
        <p>
          As the company expanded, responsibilities naturally expanded
          alongside it, from managing social media to leading marketing,
          ecommerce, operations, reporting, automation, systems, and
          strategic business initiatives.
        </p>
        <p>
          The experience revealed that sustainable growth wasn&apos;t created
          by adding more software. It came from connecting every part of
          the business so they worked together.
        </p>
      </section>

      <section className="case-overview" aria-label="Project overview">
        {overview.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="case-editorial case-warm">
        <div>
          <p className="kicker">Leadership Evolution</p>
          <h2>Growing alongside the business.</h2>
        </div>
        <div className="case-copy">
          <p>I joined White Poppy Preservation as a Social Media Manager.</p>
          <p>As the business grew, so did the scope of the work.</p>
          <p>Marketing quickly expanded into ecommerce.</p>
          <p>Ecommerce expanded into operations.</p>
          <p>
            Operations expanded into systems, reporting, automation,
            customer experience, inventory, and executive decision
            support.
          </p>
          <p>
            Within the first year, I was promoted to Director of
            Marketing & Operations.
          </p>
          <p>
            The promotion wasn&apos;t the goal. It was simply the natural
            result of continuing to solve the next problem the business
            encountered as it grew.
          </p>
        </div>
      </section>

      <section className="case-challenge">
        <div className="case-challenge-copy">
          <p className="kicker">The Challenge</p>
          <h2>Growth exposed operational complexity.</h2>
          <p>
            White Poppy was experiencing rapid growth, but many of the
            systems supporting the business had not evolved at the same
            pace.
          </p>
          <p>
            Marketing. Customer service. Inventory. Fulfillment.
            Reporting. Finance. Ecommerce.
          </p>
          <p>
            Each function affected another, yet much of the work remained
            disconnected. The challenge wasn&apos;t finding more software. It
            was creating alignment between every moving piece.
          </p>
        </div>
        <div className="case-before">
          <p className="kicker">Before</p>
          <ul>
            {before.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="case-approach">
        <div className="section-intro">
          <p className="kicker">The Approach</p>
          <h2>Four chapters of operational work.</h2>
        </div>
        <div className="case-chapters">
          {chapters.map((chapter, index) => (
            <article key={chapter.title}>
              <span>0{index + 1}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.copy}</p>
              <ul>
                {chapter.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="case-results">
        <div className="section-intro">
          <p className="kicker">Results</p>
          <h2>Progress that showed up across the business.</h2>
        </div>
        <div className="case-metrics">
          {results.map(([metric, label]) => (
            <div key={`${metric}-${label}`}>
              <strong>{metric}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="case-before-after">
        <div>
          <p className="kicker">Before / After</p>
          <h2>From disconnected work to clearer operations.</h2>
        </div>
        <div className="case-comparison-list">
          {comparisons.map(([beforeItem, afterItem]) => (
            <div className="case-comparison-row" key={beforeItem}>
              <p>{beforeItem}</p>
              <p>{afterItem}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="case-impact">
        <p className="kicker">Business Impact</p>
        <h2>The work became less about isolated projects and more about how the business operated as a whole.</h2>
        <div className="case-impact-copy">
          <p>
            The Shopify migration was one of the clearest examples. It
            was not simply a platform change. It created an opportunity
            to improve the customer experience, simplify ecommerce
            operations, strengthen communication, and create a more
            stable foundation for future growth.
          </p>
          <p>
            Operational reporting gave leadership better visibility into
            what was happening across the business. Inventory systems and
            dashboards made it easier to see constraints before they
            became larger problems. Automation reduced repetitive work and
            helped information move between departments with less manual
            effort.
          </p>
          <p>
            Customer-facing improvements were connected to internal
            operational decisions. Refund and warranty policies,
            fulfillment workflows, pricing strategy, internal
            documentation, and reporting all influenced one another. Each
            improvement mattered on its own, but the larger value came
            from making those improvements work together.
          </p>
          <p>
            The role required cross-functional leadership: understanding
            marketing, ecommerce, customer service, fulfillment,
            inventory, finance, and executive needs at the same time.
            That broader view helped turn scattered operational work into
            a clearer business infrastructure.
          </p>
        </div>
        <div className="case-impact-grid">
          {impactAreas.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      </section>

      <section className="case-editorial case-reflection">
        <div>
          <p className="kicker">Reflection</p>
          <h2>What this experience taught me.</h2>
        </div>
        <div className="case-copy">
          <p>The biggest lesson wasn&apos;t about marketing.</p>
          <p>It wasn&apos;t about ecommerce.</p>
          <p>It wasn&apos;t about automation.</p>
          <p>It was that every business is made up of connected systems.</p>
          <p>
            The strongest improvements rarely came from solving one
            isolated problem. They came from understanding how every
            decision influenced another part of the business.
          </p>
          <p>
            That perspective ultimately shaped the philosophy behind the
            work I do today.
          </p>
        </div>
      </section>

      <section className="case-final-cta">
        <h2>
          Let&apos;s build a business that works as beautifully behind the
          scenes as it does in front of customers.
        </h2>
        <Link className="button" href="/start">
          Start With Vision <b>↗</b>
        </Link>
      </section>
    </Shell>
  );
}
