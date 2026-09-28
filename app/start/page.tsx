import { Shell } from "../components";
import Link from "next/link";
import { BOOKING_URL } from "../studio";
import StartVisionForm from "./StartVisionForm";

const nextSteps = [
  {
    number: "1",
    title: "Start with your Systems Score.",
    copy: "See where the friction may be across Capture, Follow-Up, Connection, and Visibility.",
  },
  {
    number: "2",
    title: "Lauren reviews the problem.",
    copy: "Mosaic looks at what is happening and what the business around the problem may need.",
  },
  {
    number: "3",
    title: "You get a clearer next step.",
    copy: "A free Systems Call helps us decide whether a $300 Systems Audit and a Mosaic Client System build make sense.",
  },
];

const expectations = [
  "Every submission is personally reviewed.",
  "You'll hear directly from Lauren.",
  "No sales pressure.",
  "We'll tell you honestly if we're not the right fit.",
  "Every engagement begins with understanding, not software.",
];

export default function StartPage() {
  return (
    <Shell>
      <section className="start-page">
        <div className="start-main">
          <section className="start-intro">
            <p className="kicker">Start Here</p>
            <h1>You don&apos;t need to know what you need yet.</h1>
            <div className="start-clarity-callout">
              <h2>Find out where the friction is.</h2>
              <p>
                Start with the free Systems Score. Already know you want help? Bring the messy version to a free 20-minute Systems Call.
              </p>
              <div className="actions">
                <Link className="button" href="/systems-score">Take the Free Systems Score →</Link>
                <Link className="text-link" href={BOOKING_URL}>Book a free 20-minute Systems Call →</Link>
              </div>
            </div>
            <p>
              Bring me what&apos;s not working.
            </p>
            <p>
              I&apos;ll help you figure out why — and build the fix.
            </p>
            <p>
              Whether the issue is your website, marketing, customer experience, workflows, reporting, or internal systems, we&apos;ll begin by understanding the friction before prescribing the engagement.
            </p>
          </section>

          <section className="start-next" aria-label="What happens next">
            <p className="kicker">What Happens Next</p>
            <div className="start-next-grid">
              {nextSteps.map((step) => (
                <article className="start-next-step" key={step.number}>
                  <span>{step.number}</span>
                  <h2>{step.title}</h2>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="start-form-section">
            <h2>Tell us about your business.</h2>
            <StartVisionForm />
          </section>
        </div>

        <aside className="start-expect">
          <h2>What to expect</h2>
          <ul>
            {expectations.map((expectation) => (
              <li key={expectation}>{expectation}</li>
            ))}
          </ul>
        </aside>
      </section>
    </Shell>
  );
}
