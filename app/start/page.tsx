import { Shell } from "../components";
import Link from "next/link";
import StartVisionForm from "./StartVisionForm";

const nextSteps = [
  {
    number: "1",
    title: "Share your business.",
    copy: "Tell us where you are today and what feels disconnected.",
  },
  {
    number: "2",
    title: "We'll review everything.",
    copy: "We'll personally review your submission to determine whether we're the right partner.",
  },
  {
    number: "3",
    title: "Book a Discovery Call.",
    copy: "If Mosaic may be the right fit, we'll use the conversation to understand what type of help your business needs and whether a paid Vision engagement makes sense.",
  },
];

const expectations = [
  "Every submission is personally reviewed.",
  "You'll hear directly from Lauren.",
  "No sales pressure.",
  "We'll tell you honestly if we're not the right fit.",
  "Every engagement begins with understanding-not software.",
];

export default function StartPage() {
  return (
    <Shell>
      <section className="start-page">
        <div className="start-main">
          <section className="start-intro">
            <p className="kicker">Book a Discovery Call</p>
            <h1>Every great business begins with clarity.</h1>
            <div className="start-clarity-callout">
              <h2>Only have one specific question?</h2>
              <p>
                If you&apos;re trying to solve a single systems, operations, or technology challenge, the Clarity Session may be the better place to begin.
              </p>
              <Link className="text-link" href="/clarity">
                Learn about the Clarity Session →
              </Link>
            </div>
            <p>
              You don&apos;t need to know exactly what needs to change.
            </p>
            <p>
              You simply need to know something isn&apos;t working the way it should.
            </p>
            <p>
              Whether your challenge is branding, operations, technology, customer experience, or internal systems, we&apos;ll begin with a complimentary conversation to understand whether Mosaic is the right fit.
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
