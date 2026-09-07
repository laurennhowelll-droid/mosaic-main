import { Shell } from "../components";
import Link from "next/link";
import StartVisionForm from "./StartVisionForm";

const nextSteps = [
  {
    number: "1",
    title: "Choose the closest starting point.",
    copy: "Free check, Clarity Session, or Discovery Call. You do not need to diagnose the final engagement.",
  },
  {
    number: "2",
    title: "Lauren reviews the problem.",
    copy: "Mosaic looks at what is happening and what the business around the problem may need.",
  },
  {
    number: "3",
    title: "You get a clearer next step.",
    copy: "That may be a focused build, Clarity Session, larger Mosaic engagement, or an honest no-fit recommendation.",
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
            <h1>You don&apos;t need to know what service you need.</h1>
            <div className="start-clarity-callout">
              <h2>Three simple ways to begin.</h2>
              <p>
                Free Clarity Check if you want to see the gaps. Clarity Session if you have a specific problem. Discovery Call if you think you may want to hire Mosaic.
              </p>
              <div className="actions">
                <Link className="text-link" href="/clarity-check">Take the Free Clarity Check →</Link>
                <Link className="text-link" href="/clarity">Book a Clarity Session →</Link>
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
