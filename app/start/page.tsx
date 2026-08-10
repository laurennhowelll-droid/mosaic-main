import { Shell } from "../components";
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
    title: "Begin with Vision.",
    copy: "If we're a good fit, we'll schedule a paid Vision Session and build a roadmap together.",
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
            <p className="kicker">Start With Vision</p>
            <h1>Every great business begins with clarity.</h1>
            <p>
              You don&apos;t need to know exactly what needs to change.
            </p>
            <p>
              You simply need to know something isn&apos;t working the way it should.
            </p>
            <p>
              Whether your challenge is branding, operations, technology, customer experience, or internal systems, we&apos;ll begin by understanding your business before recommending a solution.
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
