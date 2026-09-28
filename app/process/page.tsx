import Link from "next/link";
import type { Metadata } from "next";
import { SystemsSteps, Invitation } from "../studio";
import styles from "../studio.module.css";

export const metadata: Metadata = { title: "How the Mosaic Client System Works | Mosaic", description: "Start with a free Systems Score, talk through the friction, then map and build the right client system for your business." };
import { Shell } from "../components";

const methodBlocks = [
  {
    number: "01",
    title: "Tell me what's not working",
    lead: "We start with the friction you already feel.",
    copy: "We learn the business, the customer journey, the tools involved, and where leads, customers, or team members are feeling friction.",
    deliverables: [
      "Interviews",
      "Business review",
      "Current workflow mapping",
      "Goals",
    ],
  },
  {
    number: "02",
    title: "Find the real problem",
    lead: "The visible issue is not always the real issue.",
    copy: "In the Systems Audit, we map the client journey and identify bottlenecks, manual work, and disconnected information before deciding what should change.",
    deliverables: [
      "Priorities",
      "Opportunities",
      "Strategic roadmap",
    ],
  },
  {
    number: "03",
    title: "Build the fix",
    lead: "The solution follows the problem.",
    copy: "CRM, dashboard, workflow, website, lead capture path, automation, campaign structure, or reporting layer: whatever actually solves the problem.",
    deliverables: [
      "Website strategy",
      "Process design",
      "System architecture",
      "Customer journey",
    ],
  },
  {
    number: "04",
    title: "Connect the pieces",
    lead: "No more isolated fixes.",
    copy: "We make sure the fix works with the rest of the business instead of creating another disconnected tool.",
    deliverables: [
      "Websites",
      "Automations",
      "Dashboards",
      "Documentation",
      "Integrations",
    ],
  },
  {
    number: "05",
    title: "Hand you the keys",
    lead: "The business should be able to own what was built.",
    copy: "Documentation, training, ownership, and a system your team can actually use.",
    deliverables: [
      "SOPs",
      "Team training",
      "Documentation",
      "Future roadmap",
    ],
  },
];

const timeline = [
  ["01", "Free Systems Score"],
  ["02", "Free 20-minute Systems Call"],
  ["03", "$300 Systems Audit"],
  ["04", "Mosaic Client System build"],
];

const principles = [
  "Less software.",
  "Better systems.",
  "People before technology.",
  "Build for the future.",
  "Documentation matters.",
];

const faqs = [
  {
    question: "Do I need a whole new system?",
    answer:
      "No. We begin by understanding what your business needs now, then recommend only the work that supports your goals.",
  },
  {
    question: "Can you work with our existing software?",
    answer:
      "Yes. Existing tools are part of the discovery process. We look for what should stay, what should connect, and what may be creating friction.",
  },
  {
    question: "Will you replace our team?",
    answer:
      "No. Mosaic is designed to strengthen the people already inside the business with clearer systems, documentation, and direction.",
  },
  {
    question: "Who is this built for?",
    answer:
      "Mosaic is built for growing service businesses whose systems have not caught up with their growth.",
  },
  {
    question: "What if I don't know what I need yet?",
    answer:
      "Start with the free Systems Score. Then, on a free 20-minute Systems Call, we can talk through what is happening behind your score and identify the first place to investigate.",
  },
  {
    question: "How involved do I need to be?",
    answer:
      "You will be involved most at the beginning, when context matters most. After that, the process becomes focused, structured, and easier to carry.",
  },
];

export default function ProcessPage() {
  return (
    <Shell>
      <section className="process-hero">
        <p className="kicker">How it works</p>
        <h1>You don’t have to know what you need.</h1>
        <div className="process-hero-copy">
          <p>
            Bring me what&apos;s not working.
          </p>
          <p>
            I&apos;ll help you figure out why — and build the fix.
          </p>
          <p>
            The process is designed to keep the work clear, connected, and usable.
          </p>
        </div>
        <Link className="button" href="/systems-score">
          Get your free Systems Score <b>↗</b>
        </Link>
      </section>

      <div className={styles.studio}><section className={styles.section}><p className={styles.eyebrow}>Score → Call → Audit → Build</p><SystemsSteps /></section></div>
      <section className="process-vision">
        <div>
          <p className="kicker">Before We Build</p>
          <h2>
            We don&apos;t start with software.
            <br />
            We start with questions.
          </h2>
        </div>
        <div className="process-vision-copy">
          <p>Technology is never the first recommendation.</p>
          <p>Before changing anything, we learn how your business works today.</p>
          <div className="process-question-list">
            <span>Your leads.</span>
            <span>Your customers.</span>
            <span>Your team.</span>
            <span>Your tools.</span>
            <span>Your reporting.</span>
          </div>
          <p>
            Because the right solution only becomes obvious after understanding the whole picture.
          </p>
          <div className="process-clarity-path" aria-label="Problem leads to understanding, then clarity">
            <span>Problem</span>
            <i>↓</i>
            <span>Understanding</span>
            <i>↓</i>
            <span>Clarity</span>
          </div>
        </div>
      </section>

      <section className="process-method">
        <div className="section-intro">
          <p className="kicker">The Process</p>
          <h2>Simple on the surface. Sophisticated underneath.</h2>
        </div>
        <div className="process-method-list">
          {methodBlocks.map((block) => (
            <article className="process-method-block" key={block.title}>
              <div className="process-method-heading">
                <span>{block.number}</span>
                <h3>{block.title}</h3>
              </div>
              <div className="process-method-body">
                <p className="process-method-lead">{block.lead}</p>
                <p>{block.copy}</p>
                <div>
                  <p className="kicker">Deliverables</p>
                  <ul>
                    {block.deliverables.map((deliverable) => (
                      <li key={deliverable}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="process-expect">
        <div className="section-intro">
          <p className="kicker">What To Expect</p>
          <h2>Every project is different. The process stays intentional.</h2>
        </div>
        <div className="process-timeline" aria-label="Typical project timeline">
          {timeline.map(([timeframe, event]) => (
            <div className="process-timeline-step" key={timeframe}>
              <span>{timeframe}</span>
              <strong>{event}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="process-decisions">
        <p className="kicker">How We Make Decisions</p>
        <h2>Every recommendation passes one test.</h2>
        <blockquote>
          &ldquo;If it doesn&apos;t create clarity, it doesn&apos;t belong.&rdquo;
        </blockquote>
        <div className="process-principles">
          {principles.map((principle) => (
            <span key={principle}>{principle}</span>
          ))}
        </div>
      </section>

      <section className="process-feeling">
        <div>
          <p className="kicker">What It Feels Like</p>
          <h2>Calm is a business advantage.</h2>
        </div>
        <div className="process-feeling-copy">
          <p>The goal isn&apos;t simply to improve efficiency.</p>
          <p>It&apos;s to reduce the mental load of running a business.</p>
          <p>
            When information is easier to find...
            <br />
            When systems talk to one another...
            <br />
            When everyone understands how the business works...
          </p>
          <p>Leaders gain something more valuable than time.</p>
          <p>They gain confidence.</p>
        </div>
      </section>

      <section className="process-faq">
        <div className="section-intro">
          <p className="kicker">Frequently Asked Questions</p>
          <h2>Clear answers before the work begins.</h2>
        </div>
        <div className="process-faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className={styles.studio}><Invitation /></div>
    </Shell>
  );
}
