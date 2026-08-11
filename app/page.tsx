import Link from "next/link";
import { Mark, Shell, services } from "./components";

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

const processSteps = ["Discover", "Clarify", "Create", "Connect", "Empower"];

export default function Home() {
  return (
    <Shell>
      <section className="hero">
        <div>
          <p className="kicker">Business Systems Studio</p>
          <h1>
            Bring every
            <br />
            <em>piece</em> together.
          </h1>
          <p className="lede">
            Businesses grow one decision at a time. Eventually those
            decisions become disconnected—marketing, operations,
            technology, people, and processes. We reconnect every piece
            into one business that works beautifully.
          </p>
          <div className="actions">
            <Link className="button" href="/start">
              Start With Vision <b>↗</b>
            </Link>
            <Link className="text-link" href="/services">
              Explore How We Help →
            </Link>
          </div>
        </div>
        <div className="hero-mark">
          <Mark />
        </div>
      </section>

      <section className="home-meaning">
        <div className="home-meaning-intro">
          <p className="kicker">What does Mosaic mean?</p>
          <h2>The logo isn&apos;t just a logo.</h2>
          <p>
            Every tile represents something every business needs. On
            their own they&apos;re valuable. Together they create something
            stronger. This is the philosophy behind every engagement.
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
        <p className="home-piece-statement">
          Individually every piece has value.
          <br />
          Together they become something greater.
        </p>
      </section>

      <section className="home-manifesto">
        <h2>
          When every piece has purpose,
          <br />
          <em>everything works beautifully.</em>
        </h2>
        <p>
          Businesses don&apos;t become extraordinary because they own more
          software. They become extraordinary because every decision
          supports a larger vision.
        </p>
        <p>
          Mosaic helps businesses reconnect every system, every process,
          every customer interaction, and every decision back to that
          original purpose.
        </p>
        <p>
          When every piece belongs...
          <br />
          everything works beautifully.
        </p>
        <div className="home-manifesto-points">
          <span>Clarity over complexity.</span>
          <span>Systems that empower people.</span>
          <span>Growth with intention.</span>
        </div>
        <Link className="button" href="/start">
          Start With Vision <b>↗</b>
        </Link>
      </section>

      <section className="home-services">
        <div className="section-intro">
          <p className="kicker">How we help</p>
          <h2>
            Once the vision is clear,
            <br />
            we help bring it to life.
          </h2>
        </div>
        {services.map(([number, title, copy, href]) => (
          <Link href={href} className="service-row" key={title}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
            <b>↗</b>
          </Link>
        ))}
      </section>

      <section className="home-process">
        <div>
          <p className="kicker">The Mosaic Method</p>
          <h2>Make room for what&apos;s next.</h2>
        </div>
        <div>
          <p>
            Every project begins by understanding what matters, then
            turning that clarity into the systems, experiences, and
            decisions that move the business forward.
          </p>
          <div className="method-list">
            {processSteps.map((step, index) => (
              <span key={step}>
                <i>0{index + 1}</i>
                {step}
              </span>
            ))}
          </div>
          <Link className="text-link" href="/process">
            Explore our process →
          </Link>
        </div>
      </section>

      <section className="home-work">
        <div className="section-intro">
          <p className="kicker">Featured Work</p>
          <h2>White Poppy Preservation</h2>
          <p>
            A more connected order flow, inventory system, and customer
            experience for a growing preservation studio.
          </p>
        </div>
        <article className="home-work-feature">
          <div className="home-work-summary">
            <p className="kicker">Primary Case Study</p>
            <h3>One clear business.</h3>
            <p>
              Order flow, inventory visibility, automation, and a calmer
              customer journey, designed to work as one.
            </p>
            <Link href="/work/white-poppy-preservation">
              View case study →
            </Link>
          </div>
          <div className="home-work-metrics">
            <div>
              <span>Order flow</span>
              <strong>Connected</strong>
            </div>
            <div>
              <span>Manual work</span>
              <strong>Reduced</strong>
            </div>
            <div>
              <span>Inventory</span>
              <strong>Visible</strong>
            </div>
            <div>
              <span>Customer experience</span>
              <strong>Clearer</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="final-cta">
        <p className="kicker">Start with vision</p>
        <h2>
          Your vision is still there.
          <br />
          <em>Let&apos;s make it clear again.</em>
        </h2>
        <div className="home-clarity-prompt">
          <h3>Not sure where to start?</h3>
          <p>
            If you&apos;re looking at the whole business, we&apos;ll begin with Vision. If you&apos;re trying to solve one specific question, begin with a Clarity Session.
          </p>
          <div className="actions">
            <Link className="secondary-button" href="/start">
              Start With Vision
            </Link>
            <Link className="text-link" href="/clarity">
              Clarity Session →
            </Link>
          </div>
        </div>
        <Link className="button" href="/start">
          Start With Vision <b>↗</b>
        </Link>
      </section>
    </Shell>
  );
}
