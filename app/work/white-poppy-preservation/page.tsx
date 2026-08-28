import Image from "next/image";
import Link from "next/link";
import { Shell } from "../../components";

type ComparisonColumn = [string, string[]];

const heroMetrics = [
  ["≈3×", "Business Growth"],
  ["<1 Year", "Social Media → Director"],
  ["2024 → 2026", "Business Transformation"],
];

const transformation: ComparisonColumn[] = [
  [
    "2024",
    [
      "Social media-focused role",
      "BigCommerce ecommerce platform",
      "More manual operational workflows",
      "Less centralized reporting",
      "Disconnected information across functions",
      "Growing operational complexity",
      "Customer experience + operations managed more independently",
    ],
  ],
  [
    "2026",
    [
      "Director-level marketing + operations scope",
      "Shopify ecommerce foundation",
      "Connected operational workflows",
      "Greater automation",
      "More centralized data",
      "Reporting + leadership visibility",
      "More structured customer recovery",
      "Integrated view of marketing, ecommerce, operations, and customer experience",
    ],
  ],
];

const roleTimeline = [
  ["2024", "Social Media Manager"],
  ["", "Marketing Strategy"],
  ["", "Ecommerce"],
  ["", "Website + Customer Journey"],
  ["", "Reporting"],
  ["", "Operations"],
  ["", "Automation + Internal Systems"],
  ["2026", "Director of Marketing & Operations"],
];

const migrationSteps = [
  "BigCommerce",
  "Migration Strategy",
  "Product + Site Architecture",
  "Customer Journey",
  "Checkout + Accounts",
  "Analytics + Tracking",
  "Operational Integrations",
  "Shopify",
];

const visibilityBefore = [
  "Information spread across workflows",
  "More reactive reporting",
  "Harder to see the complete customer/order picture",
  "Greater reliance on manual review",
];

const visibilityAfter = [
  "Centralized operational data",
  "Connected ecommerce information",
  "Dashboards + reporting",
  "Customer issue tracking",
  "Refund / recovery reporting",
  "Inventory visibility",
  "Leadership-level performance visibility",
];

const automationBefore = [
  "Repeated data entry",
  "Manual handoffs",
  "Checking multiple sources",
  "Reactive follow-up",
];

const automationAfter = [
  "Automated triggers",
  "Connected records",
  "Structured workflows",
  "Centralized information",
  "Proactive visibility",
];

const digitalMetrics = [
  ["≈7.9M", "Instagram Views"],
  ["≈1.5M", "Reach"],
  ["≈120K", "Profile / Account Visits"],
  ["≈76K", "Link Clicks"],
  ["≈53K", "Content Interactions"],
  ["≈8.7K", "Follows"],
];

const funnel = [
  ["≈228K", "Sessions"],
  ["≈13.3K", "Added to Cart"],
  ["≈7.3K", "Reached Checkout"],
  ["≈3.2K", "Completed Checkout"],
];

const deviceMetrics = [
  ["Mobile", "≈198K", "87"],
  ["Desktop", "≈30K", "13"],
  ["Tablet / Other", "<1K", "1"],
];

const recovery = [
  ["31", "Recovery Cases"],
  ["17", "Potential Cancellations Prevented"],
  ["$6.5K+", "Revenue Retained"],
  ["≈2 Months", "Measurement Period"],
];

const resultChanges = [
  "≈3× indexed business growth",
  "BigCommerce → Shopify",
  "Social media → measurable acquisition channel",
  "Marketing role → cross-functional leadership",
  "Manual workflows → connected automation",
  "Fragmented information → greater operational visibility",
  "Reactive customer recovery → structured retention strategy",
  "Reporting → clearer leadership decision-making",
];

export default function WhitePoppyCaseStudy() {
  return (
    <Shell>
      <section className="case-hero">
        <p className="kicker">White Poppy Preservation · 2024 → 2026</p>
        <h1>What happens when growth and infrastructure evolve together?</h1>
        <p>Lauren joined White Poppy in 2024 to manage social media.</p>
        <p>
          Less than a year later, her role had expanded into Director of
          Marketing & Operations as the work moved across ecommerce,
          customer experience, operations, reporting, automation, and
          internal systems.
        </p>
        <p>
          Over the two-year engagement, the company grew to roughly three
          times its earlier size while the infrastructure behind it
          evolved alongside that growth.
        </p>
        <div className="case-hero-image">
          <Image
            src="/brand/white_poppy.png"
            alt="Framed floral preservation pieces by White Poppy Preservation"
            width={1866}
            height={593}
            priority
          />
        </div>
        <div className="case-hero-metrics" aria-label="White Poppy transformation highlights">
          {heroMetrics.map(([metric, label]) => (
            <div key={label}>
              <strong>{metric}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="case-transform">
        <div className="section-intro">
          <p className="kicker">The Transformation at a Glance</p>
          <h2>A clearer business, two years later.</h2>
        </div>
        <div className="case-transform-grid">
          {transformation.map(([year, items]) => (
            <article key={year}>
              <span>{year}</span>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="case-role-evolution case-warm">
        <div>
          <p className="kicker">Role Expansion Timeline</p>
          <h2>The work kept revealing the next connected problem.</h2>
          <p>
            Promoted from Social Media Manager to Director of Marketing &
            Operations in less than one year.
          </p>
          <p>
            As the business grew, solving one part of the operation
            repeatedly required understanding another.
          </p>
        </div>
        <div className="case-role-timeline">
          {roleTimeline.map(([year, role], index) => (
            <div key={`${role}-${index}`}>
              <span>{year || String(index + 1).padStart(2, "0")}</span>
              <strong>{role}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="case-growth-visual">
        <div>
          <p className="kicker">Indexed Business Growth</p>
          <h2>Building underneath the growth.</h2>
          <p>
            The important challenge wasn&apos;t simply generating growth. It
            was making sure ecommerce, operations, reporting, customer
            experience, and internal systems could continue evolving with it.
          </p>
        </div>
        <div className="case-growth-index" aria-label="Indexed business growth, 2024 to 2026">
          <div>
            <span>2024</span>
            <strong>1.0×</strong>
          </div>
          <i aria-hidden="true">↓</i>
          <div className="case-growth-end">
            <span>2026</span>
            <strong>≈3.0×</strong>
          </div>
        </div>
      </section>

      <section className="case-migration">
        <div>
          <p className="kicker">BigCommerce → Shopify</p>
          <h2>Rebuilding the ecommerce foundation.</h2>
          <p>
            The migration was more than a platform change. It was a chance
            to improve product architecture, customer experience, ecommerce
            UX, checkout, analytics, integrations, internal workflows,
            reporting, customer communication, and operational continuity.
          </p>
        </div>
        <div className="case-migration-flow">
          {migrationSteps.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
        <div className="case-outcomes">
          <span>More flexible ecommerce infrastructure</span>
          <span>Better integration with operations</span>
          <span>Greater reporting visibility</span>
          <span>A stronger foundation for continued growth</span>
        </div>
      </section>

      <section className="case-visibility">
        <div>
          <p className="kicker">From Activity to Visibility</p>
          <h2>You can&apos;t improve what you can&apos;t see.</h2>
          <p>
            Reporting wasn&apos;t built simply to create more dashboards. It
            was built to make better decisions possible.
          </p>
        </div>
        <div className="case-before-after-panels">
          <article>
            <span>Before</span>
            {visibilityBefore.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </article>
          <article>
            <span>After</span>
            {visibilityAfter.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </article>
        </div>
      </section>

      <section className="case-system-map">
        <div className="section-intro">
          <p className="kicker">Connected Business Architecture</p>
          <h2>Connecting the business behind the storefront.</h2>
        </div>
        <div className="case-system-flow" aria-label="Connected business architecture flow">
          <div className="case-system-node">Customer</div>
          <i aria-hidden="true">↓</i>
          <div className="case-system-node case-system-shopify">Shopify</div>
          <i aria-hidden="true">↓</i>
          <div className="case-system-node case-system-airtable">
            Airtable <span>Operational Source of Truth</span>
          </div>
          <div className="case-system-branches">
            <div className="case-system-node">Stripe <span>Payments</span></div>
            <div className="case-system-node">Zapier <span>Automation</span></div>
            <div className="case-system-node">Inventory + Order Flow</div>
            <div className="case-system-node">Customer Experience</div>
            <div className="case-system-node">Reporting + Dashboards</div>
            <div className="case-system-node">Leadership Visibility</div>
          </div>
        </div>
      </section>

      <section className="case-automation">
        <div>
          <p className="kicker">Automation</p>
          <h2>Automate the repetition. Keep the judgment.</h2>
          <p>
            The work was not about making the business fully automated. It
            was about reducing repeated manual effort where the process was
            stable enough to connect.
          </p>
        </div>
        <div className="case-before-after-panels">
          <article>
            <span>More Manual</span>
            {automationBefore.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </article>
          <article>
            <span>More Connected</span>
            {automationAfter.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </article>
        </div>
      </section>

      <section className="case-digital">
        <div className="section-intro">
          <p className="kicker">Digital Growth · Jul 2024 → Aug 2026</p>
          <h2>Social media became part of the acquisition ecosystem.</h2>
          <p>
            Social media evolved from content creation into a measurable
            part of the customer acquisition ecosystem during the engagement.
          </p>
        </div>
        <div className="case-digital-visual">
          <strong>≈7.9M</strong>
          <span>Instagram Views</span>
        </div>
        <div className="case-supporting-stats">
          {digitalMetrics.slice(1).map(([metric, label]) => (
            <div key={label}>
              <strong>{metric}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="case-funnel-section">
        <div>
          <p className="kicker">Ecommerce Performance Without Revenue</p>
          <h2>Customer behavior became easier to understand.</h2>
          <p>
            The ecommerce funnel uses counts and rates only. Conversion
            performance strengthened over the reporting period without
            exposing private sales figures.
          </p>
          <strong className="case-conversion">≈1.4% Conversion Rate</strong>
        </div>
        <div className="case-funnel" aria-label="Ecommerce funnel">
          {funnel.map(([metric, label]) => (
            <div key={label}>
              <strong>{metric}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="case-device">
        <div>
          <p className="kicker">Customer Experience Insight</p>
          <h2>Mobile-first behavior shaped the experience.</h2>
          <p>
            The customer experience increasingly had to be designed around
            how customers were actually shopping, not how the business
            assumed they were shopping.
          </p>
        </div>
        <div className="case-device-bars">
          {deviceMetrics.map(([label, metric, width]) => (
            <div key={label}>
              <span>{label}</span>
              <i><b style={{ width: `${width}%` }} /></i>
              <strong>{metric}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="case-recovery">
        <div className="section-intro">
          <p className="kicker">Turning Recovery Into Retention</p>
          <h2>Recovery became a structured retention system.</h2>
          <p>
            Within roughly two months of implementing the complimentary
            recovery approach, 31 recovery cases were completed. 17
            involved customers who otherwise intended to cancel.
          </p>
        </div>
        <div className="case-recovery-path">
          {recovery.map(([metric, label]) => (
            <div key={label}>
              <strong>{metric}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="case-transform case-final-transform">
        <div className="section-intro">
          <p className="kicker">2024 → 2026 Systems Comparison</p>
          <h2>What actually changed while Lauren was there?</h2>
        </div>
        <div className="case-transform-grid">
          <article>
            <span>2024</span>
            <ul>
              <li>Social-focused scope</li>
              <li>BigCommerce</li>
              <li>Growing manual processes</li>
              <li>More fragmented visibility</li>
              <li>Fewer connected operational systems</li>
            </ul>
          </article>
          <article>
            <span>2026</span>
            <ul>
              <li>Marketing + Operations leadership</li>
              <li>Shopify</li>
              <li>Connected workflows</li>
              <li>Automation</li>
              <li>Centralized reporting</li>
              <li>Greater inventory visibility</li>
              <li>Structured recovery strategy</li>
              <li>More transparent business operations</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="case-result">
        <p className="kicker">The Result</p>
        <h2>A very different business two years later.</h2>
        <div className="case-result-grid">
          {resultChanges.map((change) => (
            <span key={change}>{change}</span>
          ))}
        </div>
        <p>
          The transformation wasn&apos;t one website, one automation, or one
          campaign.
        </p>
        <p>
          It was the cumulative effect of making more of the business work
          together.
        </p>
      </section>

      <section className="case-final-cta">
        <h2>
          Let&apos;s build a business that works as beautifully behind the
          scenes as it does in front of customers.
        </h2>
        <Link className="button" href="https://calendar.app.google/JxAn6pJFxwyu1FJq6">
          Book a Discovery Call <b>↗</b>
        </Link>
      </section>
    </Shell>
  );
}
