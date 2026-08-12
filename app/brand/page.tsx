import Link from "next/link";
import { Mark, Shell } from "../components";

const tiles = [
  {
    position: "Top Left",
    title: "Vision",
    className: "brand-tile-vision",
    copy: [
      "Vision is where every business begins.",
      "Before strategy. Before software. Before branding.",
      "Every meaningful decision begins with understanding where you're trying to go.",
      "Without vision, everything else becomes reaction.",
    ],
  },
  {
    position: "Top Right",
    title: "Structure",
    className: "brand-tile-structure",
    copy: [
      "Structure turns good ideas into repeatable ways of working.",
      "Processes. Systems. Documentation. Expectations. Consistency.",
      "Growth becomes possible because structure makes success repeatable.",
    ],
  },
  {
    position: "Bottom Left",
    title: "Connection",
    className: "brand-tile-connection",
    copy: [
      "No department works in isolation.",
      "Marketing affects operations. Operations affect customer experience. Technology affects leadership.",
      "Connection reminds us that every decision influences another.",
      "Great businesses understand those relationships.",
    ],
  },
  {
    position: "Bottom Right",
    title: "Craft",
    className: "brand-tile-craft",
    copy: [
      "Craft is thoughtful execution.",
      "Not perfection. Not decoration.",
      "Intentional choices made with care.",
      "The experience people have with a business is shaped by hundreds of small details. Craft is respecting those details.",
    ],
  },
];

const colors = [
  {
    name: "Olive",
    className: "brand-color-olive",
    copy: "Olive represents growth, clarity, and calm decision making. It gives the identity a grounded quality and reflects the kind of steadiness businesses need when decisions feel tangled.",
  },
  {
    name: "Terracotta",
    className: "brand-color-terra",
    copy: "Terracotta represents creativity, momentum, and human connection. It keeps the system warm and reminds us that businesses are built by people, not only processes.",
  },
  {
    name: "Slate",
    className: "brand-color-slate",
    copy: "Slate represents thoughtful systems, stability, and confidence. It brings structure to the palette without making the brand feel cold or mechanical.",
  },
  {
    name: "Plaster",
    className: "brand-color-plaster",
    copy: "Plaster represents openness, simplicity, and room to think. It creates the quiet space around the work so the important pieces can be seen clearly.",
  },
];

const practice = [
  ["Vision", "Every engagement begins by understanding the business."],
  ["Structure", "Systems become simpler."],
  ["Connection", "Departments work together instead of independently."],
  ["Craft", "The final experience feels thoughtful from beginning to end."],
];

export default function BrandPage() {
  return (
    <Shell>
      <section className="brand-hero-page">
        <p className="kicker">The Mosaic Identity</p>
        <h1>Every piece has a purpose.</h1>
        <div className="brand-hero-copy">
          <p>The Mosaic identity wasn&apos;t designed to look interesting.</p>
          <p>It was designed to explain how we believe businesses work.</p>
          <p>Every shape. Every color. Every decision.</p>
          <p>Each represents a principle that guides the way we think.</p>
        </div>
      </section>

      <section className="brand-why">
        <div>
          <p className="kicker">Why Mosaic?</p>
          <h2>Why &quot;Mosaic&quot;?</h2>
        </div>
        <div>
          <p>A mosaic is created from individual pieces that become more meaningful together than they ever could apart.</p>
          <p>Businesses work the same way.</p>
          <div className="brand-word-list">
            <span>Brand.</span>
            <span>Operations.</span>
            <span>Technology.</span>
            <span>Customer experience.</span>
            <span>Leadership.</span>
            <span>Marketing.</span>
            <span>Reporting.</span>
            <span>People.</span>
          </div>
          <p>None of these create a great business by themselves.</p>
          <p>The real value appears when they support one another.</p>
          <p>That idea became the foundation for everything Mosaic represents.</p>
          <blockquote>&quot;The whole is always greater than the individual pieces.&quot;</blockquote>
        </div>
      </section>

      <section className="brand-four-tiles">
        <div className="brand-mark-showcase" aria-label="Large Mosaic mark">
          <Mark />
        </div>
        <div className="brand-tile-story">
          {tiles.map((tile) => (
            <article className={tile.className} key={tile.title}>
              <p className="kicker">{tile.position}</p>
              <h2>{tile.title}</h2>
              {tile.copy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="brand-colors">
        <div className="section-intro">
          <p className="kicker">The Colors</p>
          <h2>Color with purpose.</h2>
        </div>
        <div className="brand-color-grid">
          {colors.map((color) => (
            <article className={color.className} key={color.name}>
              <span>{color.name}</span>
              <p>{color.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-type">
        <div>
          <p className="kicker">Typography</p>
          <h2>How we speak visually.</h2>
        </div>
        <div>
          <p>Businesses are both emotional and practical.</p>
          <div className="brand-type-pair">
            <span>Classic serif</span>
            <span>Modern sans-serif</span>
          </div>
          <p>The serif reflects thoughtfulness, permanence, and humanity.</p>
          <p>The sans-serif reflects clarity, precision, and modern execution.</p>
          <p>Neither works as well without the other.</p>
        </div>
      </section>

      <section className="brand-principle">
        <blockquote>&quot;When every piece has purpose, everything works beautifully.&quot;</blockquote>
        <div>
          <p>This is more than a tagline.</p>
          <p>It is the standard every recommendation should meet.</p>
          <p>If a process doesn&apos;t create clarity, it probably shouldn&apos;t exist.</p>
          <p>If software creates more confusion, it probably isn&apos;t solving the right problem.</p>
          <p>If a decision doesn&apos;t support the larger vision, it deserves another conversation.</p>
          <p>Every engagement returns to the same question:</p>
          <p>Does this have a purpose?</p>
        </div>
      </section>

      <section className="brand-designed">
        <p className="kicker">Designing A Business</p>
        <h2>Businesses are designed. Whether intentionally or accidentally.</h2>
        <div className="brand-designed-list">
          <span>Every workflow.</span>
          <span>Every customer interaction.</span>
          <span>Every website.</span>
          <span>Every email.</span>
          <span>Every automation.</span>
          <span>Every meeting.</span>
          <span>Every expectation.</span>
        </div>
        <p>Someone designed it.</p>
        <p>Sometimes that design happened consciously.</p>
        <p>Sometimes it accumulated over years.</p>
        <p>Mosaic exists to make those decisions intentional again.</p>
      </section>

      <section className="brand-not-logo">
        <div>
          <p className="kicker">Not Just A Logo</p>
          <h2>An identity should become a way of thinking.</h2>
        </div>
        <div>
          <p>The logo is only the visible reminder.</p>
          <p>The real identity lives in the decisions behind it.</p>
          <ul>
            <li>How we solve problems.</li>
            <li>How we prioritize.</li>
            <li>How we communicate.</li>
            <li>How we simplify.</li>
            <li>How we build.</li>
          </ul>
          <p>Those choices matter far more than a symbol ever could.</p>
        </div>
      </section>

      <section className="brand-practice">
        <div className="section-intro">
          <p className="kicker">Brand In Practice</p>
          <h2>What this looks like in real work.</h2>
        </div>
        <div className="brand-practice-grid">
          {practice.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-final-cta">
        <h2>Let&apos;s build something where every piece belongs.</h2>
        <p>Great businesses rarely need more. They usually need greater clarity about what already exists.</p>
        <div className="actions">
          <Link className="button" href="https://calendar.app.google/JxAn6pJFxwyu1FJq6">
            Book a Discovery Call <b>↗</b>
          </Link>
          <Link className="text-link" href="/process">
            Explore The Mosaic Method →
          </Link>
        </div>
      </section>
    </Shell>
  );
}
