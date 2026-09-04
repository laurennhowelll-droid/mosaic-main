import Image from "next/image";
import Link from "next/link";
import { Mark, Shell } from "./components";

const START_PATH = "/start";
const SERVICES_PATH = "/services";
const CLARITY_PATH = "/clarity";
const PROCESS_PATH = "/process";
const WHITE_POPPY_PATH = "/work/white-poppy-preservation";

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

const recognitionItems = [
  "You’re copying the same information between Shopify, Airtable, spreadsheets, Slack, and email.",
  "Your team asks you questions the system should already answer.",
  "Customers receive one experience online and another after they purchase.",
  "You’ve added tools and automations, but the business somehow feels more complicated.",
  "You know something needs to change, but every problem seems connected to three others.",
  "Important decisions still depend on information only you know.",
];

const comparisonColumns = [
  {
    title: "Typical fixes",
    items: [
      "Fix one visible problem",
      "Add another tool",
      "Automate an unclear process",
      "Improve departments separately",
      "Hand over a deliverable",
    ],
  },
  {
    title: "The Mosaic approach",
    items: [
      "Find the problem underneath it",
      "Simplify what already exists",
      "Clarify, then automate",
      "Connect the complete customer and operational journey",
      "Build something the team can confidently use",
    ],
  },
];

const leaveBehindItems = [
  "Rebuilding the same report every time someone needs an answer.",
  "Checking three systems to figure out what happened with one customer.",
  "Following up with your team to make sure every step was completed.",
  "Paying for software nobody fully understands or consistently uses.",
  "Discovering operational problems only after they affect a customer.",
  "Being the only person who understands how the business actually works.",
  "Wondering whether you need a new website, a new system, another employee—or simply a clearer plan.",
];

const homeServices = [
  {
    number: "01",
    service: "Vision",
    title: "Know what deserves your attention next.",
    description:
      "Turn scattered ideas, competing priorities, and recurring problems into a clear direction for the business.",
    outcome:
      "You leave with a shared vision, prioritized opportunities, and a practical roadmap—so you can stop reacting to every problem as if it carries equal weight.",
    href: "/services/vision",
  },
  {
    number: "02",
    service: "Experience",
    title: "Make the outside match the business you’ve built.",
    description:
      "Create a website, customer journey, and brand experience that make it easier for the right people to understand, trust, and buy from you.",
    outcome:
      "You leave with an experience that looks intentional, communicates clearly, and guides customers toward the next step.",
    href: "/services/experience",
  },
  {
    number: "03",
    service: "Connect",
    title: "Build systems your team doesn’t have to work around.",
    description:
      "Simplify workflows, connect information, automate repetitive work, and make responsibilities visible.",
    outcome:
      "You leave with fewer manual handoffs, clearer ownership, and systems that help your team operate without constantly relying on you.",
    href: "/services/connect",
  },
  {
    number: "04",
    service: "Grow",
    title: "Make better decisions with clearer information.",
    description:
      "Improve reporting, retention, operational visibility, and the systems supporting your next stage of growth.",
    outcome:
      "You leave knowing what is working, what is costing you, and where your next opportunity actually is.",
    href: "/services/grow",
  },
];

const proofResults = [
  ["3×", "business growth during the engagement"],
  ["Under 1 year", "from Social Media Manager to Director of Marketing & Operations"],
  ["Complete", "BigCommerce-to-Shopify migration"],
  ["Company-wide", "systems, automation, and clearer handoffs"],
  ["Executive", "reporting and cross-department visibility"],
  ["Less", "repetitive work across customer and operations workflows"],
];

const processSteps = [
  ["01", "Discover", "Bring the messy version of the problem. We learn how the business is actually operating."],
  ["02", "Clarify", "Separate what matters now from what can wait and identify the source of the friction."],
  ["03", "Create", "Shape the right experience, workflow, system, or roadmap around the business you’re building."],
  ["04", "Connect", "Bring information, responsibilities, tools, and customer touchpoints together."],
  ["05", "Empower", "Document the work, train the team, and make the solution usable without constant outside help."],
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
            <em>The way it runs hasn’t caught up.</em>
          </h1>
          <p className="lede">
            Your website, marketing, customer experience, and internal systems were built one decision at a time. Now information lives in too many places, manual work keeps piling up, and you’re holding together processes your team should be able to trust.
          </p>
          <p className="lede">
            Mosaic helps growing businesses clarify what matters, fix what isn’t working, and build a business that runs as beautifully as it looks.
          </p>
          <div className="actions">
            <Link className="button" href={START_PATH}>
              Show Me Where to Start <b>↗</b>
            </Link>
            <Link className="text-link" href={SERVICES_PATH}>
              Explore How Mosaic Helps →
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

      <section className="home-recognition">
        <div className="section-intro">
          <p className="kicker">Behind the Growth</p>
          <h2>Maybe your business looks successful from the outside—but behind the scenes…</h2>
        </div>
        <div className="home-recognition-grid">
          {recognitionItems.map((item, index) => (
            <article key={item}>
              <span>0{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
        <p className="home-section-closing">
          You don’t need another disconnected fix. You need someone to step back, understand the whole business, and decide what should happen next.
        </p>
      </section>

      <section className="home-problem">
        <div>
          <p className="kicker">The Real Problem</p>
          <h2>The problem probably isn’t the tool.</h2>
        </div>
        <div>
          <div className="home-problem-copy">
            <p>
              You’ve tried a new platform. Rebuilt a spreadsheet. Added an automation. Delegated pieces of the process. Maybe you’ve even redesigned the website.
            </p>
            <p>Each change solved something—but only in isolation.</p>
            <p>
              When the website, marketing, operations, customer experience, and reporting are treated as separate projects, every improvement can create another gap somewhere else.
            </p>
            <p>
              Mosaic looks at the entire business before recommending what to change, because the clearest solution is rarely found inside one department.
            </p>
          </div>
          <div className="home-comparison">
            {comparisonColumns.map((column) => (
              <article key={column.title}>
                <h3>{column.title}</h3>
                <ul>
                  {column.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-leave-behind">
        <div className="section-intro">
          <p className="kicker">Make Room for What’s Next</p>
          <h2>What gets lighter when the pieces finally work together?</h2>
          <p>You get to leave behind:</p>
        </div>
        <div className="home-leave-list">
          {leaveBehindItems.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <p className="home-piece-statement">
          The goal isn’t to make your business more sophisticated. It’s to make it easier to understand, easier to operate, and easier to grow.
        </p>
      </section>

      <section className="home-services">
        <div className="section-intro">
          <p className="kicker">How Mosaic Helps</p>
          <h2>Start with the part that needs clarity. Build toward the business you’re ready to run.</h2>
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
          <p>You don’t need to know which service you need. Bring me the messy version of the problem, and we’ll figure out where to begin.</p>
          <Link className="button" href={START_PATH}>
            Show Me Where to Start <b>↗</b>
          </Link>
        </div>
      </section>

      <section className="home-meaning">
        <div className="home-meaning-intro">
          <p className="kicker">Mosaic Philosophy</p>
          <h2>When every piece has purpose, everything works beautifully.</h2>
          <p>
            The Mosaic mark is a reminder that businesses that work beautifully are built from connected decisions: clear vision, useful structure, thoughtful connection, and careful craft.
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

      <section className="home-work">
        <div className="section-intro">
          <p className="kicker">Featured Work</p>
          <h2>What happens when the systems catch up to the growth?</h2>
          <p>
            At White Poppy Preservation, rapid growth had created manual work, disconnected reporting, limited inventory visibility, and operational decisions that depended on information scattered across the company.
          </p>
          <p>
            Over two years, Lauren helped connect ecommerce, marketing, customer service, inventory, reporting, and operations into a clearer business infrastructure.
          </p>
        </div>
        <article className="home-work-feature">
          <div className="home-work-summary">
            <p className="kicker">White Poppy Preservation</p>
            <h3>3× business growth during the engagement.</h3>
            <p>
              A connected order flow, clearer inventory visibility, company-wide systems, and calmer customer handoffs helped support a business ready for its next stage.
            </p>
            <Link href={WHITE_POPPY_PATH}>See How the Business Changed →</Link>
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

      <section className="home-process">
        <div>
          <p className="kicker">The Mosaic Method</p>
          <h2>A clear way forward—even when the problem isn’t clear yet.</h2>
        </div>
        <div>
          <p>
            Every engagement begins with understanding what matters, then turns that clarity into the systems, experiences, and decisions that make the business easier to operate.
          </p>
          <div className="method-list">
            {processSteps.map(([number, step, copy]) => (
              <span key={step}>
                <i>{number}</i>
                <strong>{step}</strong>
                <small>{copy}</small>
              </span>
            ))}
          </div>
          <Link className="text-link" href={PROCESS_PATH}>
            Explore our process →
          </Link>
        </div>
      </section>

      <section className="final-cta">
        <p className="kicker">Start Where You Are</p>
        <h2>
          Your vision is still there.
          <br />
          <em>Let’s make it clear again.</em>
        </h2>
        <div className="home-clarity-prompt">
          <h3>You don’t need to diagnose the business before reaching out.</h3>
          <p>
            Tell me what feels heavier, slower, or more complicated than it should. I’ll help you understand what is actually causing it—and whether Mosaic is the right fit to solve it.
          </p>
          <div className="actions">
            <Link className="button" href={START_PATH}>
              Tell Me What’s Not Working <b>↗</b>
            </Link>
            <Link className="secondary-button" href={CLARITY_PATH}>
              Book a Clarity Session
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
