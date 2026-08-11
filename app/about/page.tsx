import Image from "next/image";
import Link from "next/link";
import { Shell } from "../components";

const beliefs = [
  {
    title: "Businesses should feel personal.",
    copy: "Growth should never make a company lose the reason people connected with it in the first place.",
  },
  {
    title: "Technology should feel manageable.",
    copy: "Good technology should reduce complexity, not require a business to organize itself around the software.",
  },
  {
    title: "Growth should feel empowering and clear.",
    copy: "Growth is valuable when leadership understands what is changing, why it is changing, and what should happen next.",
  },
  {
    title: "Leadership should feel confident.",
    copy: "Better systems create better information. Better information creates better decisions.",
  },
  {
    title: "A good partner should feel like a weight off your shoulders.",
    copy: "The goal of outside support is not to create more meetings, more tools, or more confusion. It should make the business feel lighter.",
  },
];

const thinking = [
  {
    title: "Clarity",
    copy: "Understand what matters before deciding what to build.",
  },
  {
    title: "Structure",
    copy: "Create systems that turn good ideas into repeatable ways of working.",
  },
  {
    title: "Creativity",
    copy: "Find better ways forward without adding unnecessary complexity.",
  },
];

const mission = [
  {
    title: "Mission",
    copy: "Help leaders rediscover a clear vision for the business they always wanted to build.",
  },
  {
    title: "Vision",
    copy: "Businesses that work beautifully because every piece has a purpose.",
  },
  {
    title: "Promise",
    copy: "Leave every business clearer than we found it.",
  },
];

export default function AboutPage() {
  return (
    <Shell>
      <section className="about-hero">
        <div>
          <p className="kicker">About Mosaic</p>
          <h1>Clarity creates momentum.</h1>
          <p>
            Mosaic is a Business Systems Studio for growing companies whose ideas, technology, customer experience, and operations no longer feel as connected as they once did.
          </p>
          <p>
            We step back, understand the whole picture, and bring every piece back together with purpose.
          </p>
          <Link className="button" href="/start">
            Start With Vision <b>↗</b>
          </Link>
        </div>
      </section>

      <section className="about-exists">
        <div>
          <p className="kicker">Why Mosaic Exists</p>
          <h2>Businesses rarely become complicated all at once.</h2>
        </div>
        <div className="about-editorial-copy">
          <p>It happens slowly.</p>
          <p>A new tool solves one problem.</p>
          <p>A spreadsheet fills another gap.</p>
          <p>A workaround becomes a process.</p>
          <p>Another employee creates another way of doing things.</p>
          <p>The website evolves separately from operations.</p>
          <p>Marketing makes decisions that affect fulfillment.</p>
          <p>Technology gets added faster than it gets simplified.</p>
          <p>Eventually, everything technically works-but nothing feels like it belongs to the same business.</p>
          <p>That is the space Mosaic was created to work in.</p>
          <p>Mosaic exists to understand the whole business, organize the confusion, and make sure every part has a reason for being there.</p>
          <blockquote>“Simplicity is power.”</blockquote>
        </div>
      </section>

      <section className="about-whole">
        <p className="kicker">The Idea Behind Mosaic</p>
        <h2>The whole picture matters.</h2>
        <div className="about-columns-copy">
          <p>Most specialists are hired to improve one part of a business.</p>
          <p>And often, they are very good at it.</p>
          <p>But a new website affects customer service. Marketing affects operations. Operations affect the customer experience.</p>
          <p>Technology affects the way employees work. Pricing affects fulfillment. Every decision creates another decision somewhere else.</p>
          <p>Mosaic approaches the business as one connected system.</p>
          <p>The goal is not simply to improve individual pieces. It is to make sure the pieces make sense together.</p>
        </div>
      </section>

      <section className="about-beliefs">
        <div className="section-intro">
          <p className="kicker">What We Believe</p>
          <h2>The beliefs behind a business that works beautifully.</h2>
        </div>
        <div className="about-belief-list">
          {beliefs.map((belief, index) => (
            <article key={belief.title}>
              <span>0{index + 1}</span>
              <h3>{belief.title}</h3>
              <p>{belief.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-nonnegotiable">
        <p className="kicker">Our Non-Negotiable</p>
        <h2>You should never be more confused after working with us than you were before.</h2>
        <p>Every recommendation should create clarity.</p>
        <p>Every system should have a purpose.</p>
        <p>Every tool should earn its place.</p>
        <p>Every engagement should leave the business easier to understand than we found it.</p>
      </section>

      <section className="about-thinking">
        <div className="section-intro">
          <p className="kicker">How Mosaic Thinks</p>
          <h2>
            Clarity.
            <br />
            Structure.
            <br />
            Creativity.
          </h2>
        </div>
        <div className="about-thinking-grid">
          {thinking.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
        <p className="about-thinking-line">The strongest businesses need all three.</p>
      </section>

      <section className="about-personal">
        <div>
          <p className="kicker">Built To Stay Personal</p>
          <h2>Small by design.</h2>
        </div>
        <div className="about-editorial-copy">
          <p>Mosaic is not being built to become a large traditional agency.</p>
          <p>The intention is to remain small, deeply involved, and personal.</p>
          <p>That means fewer layers between the client and the person doing the thinking.</p>
          <p>It means understanding the business instead of simply receiving a task list.</p>
          <p>And it means being able to stay close enough to see how one decision affects everything else.</p>
          <p>As Mosaic grows, the goal is not to lose that feeling.</p>
          <p>It is to protect it.</p>
        </div>
      </section>

      <section className="about-founder">
        <div className="about-founder-portrait">
          <Image
            src="/brand-reference/founder-portrait.jpg"
            alt="Lauren Howell Christensen, founder of Mosaic"
            width={3370}
            height={5712}
            sizes="(max-width: 1000px) 84vw, 36vw"
            quality={100}
            unoptimized
          />
        </div>
        <div>
          <p className="kicker">Founder</p>
          <h2>Meet Lauren.</h2>
          <div className="about-founder-copy">
            <p>Lauren Howell Christensen is the founder of Mosaic.</p>
            <p>Her background sits at the intersection of marketing, operations, ecommerce, customer experience, automation, and business systems.</p>
            <p>She began her career in marketing but repeatedly found herself moving beyond the boundaries of the role-into websites, reporting, fulfillment, inventory, technology, automation, pricing, and internal operations.</p>
            <p>At White Poppy Preservation, what began as a Social Media Manager role expanded into Director of Marketing & Operations in less than a year as she took on increasingly connected parts of the business.</p>
            <p>Over the course of that work, the company tripled in size while its ecommerce platform, operational infrastructure, reporting, automation, and customer experience evolved alongside the growth.</p>
            <p>That experience revealed an opportunity:</p>
            <p>Most businesses don&apos;t need another specialist looking at one isolated problem.</p>
            <p>They need someone willing to see how all the pieces affect one another.</p>
            <p>That realization became Mosaic.</p>
          </div>
        </div>
      </section>

      <section className="about-perspective">
        <h2>I tend to see businesses as a collection of connected pieces.</h2>
        <div>
          <p>When someone tells me about a problem in their business, I rarely see just that problem.</p>
          <p>I see what caused it.</p>
          <p>What it affects.</p>
          <p>What information is missing.</p>
          <p>What process sits behind it.</p>
          <p>And what could become possible if those pieces worked together differently.</p>
          <p>That is the work I love.</p>
          <p>Not adding complexity.</p>
          <p>Making the whole picture make sense.</p>
          <p className="about-signature">Lauren<br /><span>Founder, Mosaic</span></p>
        </div>
      </section>

      <section className="about-name">
        <div>
          <p className="kicker">Why The Name Mosaic</p>
          <h2>Why Mosaic?</h2>
        </div>
        <div>
          <p>A mosaic is made from individual pieces that become more meaningful when viewed together.</p>
          <p>That idea reflects how we see businesses.</p>
          <div className="about-piece-list">
            <span>Vision.</span>
            <span>Structure.</span>
            <span>Connection.</span>
            <span>Craft.</span>
          </div>
          <p>Each piece matters.</p>
          <p>But the real value appears when they work together.</p>
          <Link className="text-link" href="/brand">
            Explore the Mosaic identity →
          </Link>
        </div>
      </section>

      <section className="about-mission">
        {mission.map((item) => (
          <article key={item.title}>
            <p className="kicker">{item.title}</p>
            <h3>{item.copy}</h3>
          </article>
        ))}
      </section>

      <section className="about-final-cta">
        <h2>Your business already has the pieces.</h2>
        <p>Let&apos;s make them work together.</p>
        <div className="actions">
          <Link className="button" href="/start">
            Start With Vision <b>↗</b>
          </Link>
          <Link className="text-link" href="/services">
            Explore How We Help →
          </Link>
        </div>
      </section>
    </Shell>
  );
}
