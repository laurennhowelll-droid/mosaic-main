import Link from "next/link";
import { Shell } from "../components";
import ClarityForm from "./ClarityForm";

const questions = [
  "Should we change CRMs?",
  "What should we automate first?",
  "Is Airtable the right solution?",
  "Do we actually need custom software?",
  "Why does this workflow feel so complicated?",
  "How should these systems connect?",
];

const included = [
  "Short questionnaire",
  "Focused strategy session",
  "Practical recommendations",
  "Written action summary",
  "Clear next steps",
];

const leaveWith = [
  "A clearer understanding of the decision in front of you.",
  "A practical recommendation you can act on.",
  "A calmer sense of what should happen next.",
];

const faqs = [
  {
    question: "Is this the same as Vision?",
    answer: "No. Vision looks at the whole business. The Clarity Session focuses on one defined question.",
  },
  {
    question: "What happens after the session?",
    answer: "You receive a written action summary with practical recommendations and next steps.",
  },
  {
    question: "Can this lead into a larger engagement?",
    answer: "Yes. If you move into Vision within 30 days, your Clarity Session investment is credited toward your Vision project.",
  },
];

export default function ClarityPage() {
  return (
    <Shell>
      <section className="clarity-hero">
        <div>
          <p className="kicker">Clarity Session</p>
          <h1>Solve one important question.</h1>
          <p className="service-detail-promise">
            Sometimes the biggest obstacle isn&apos;t doing the work.
          </p>
          <p className="service-detail-intro">
            It&apos;s knowing what the right next step should be. The Clarity Session is a focused 90-minute strategy session designed to help you confidently move forward.
          </p>
          <Link className="button" href="#book">
            Book a Clarity Session <b>↗</b>
          </Link>
        </div>
        <aside className="service-detail-meta">
          <span>Investment</span>
          <strong>$500</strong>
          <span>Length</span>
          <strong>90 minutes</strong>
          <span>Goal</span>
          <p>Leave with clarity around one important decision.</p>
        </aside>
      </section>

      <section className="service-detail-problem">
        <div>
          <p className="kicker">Who It&apos;s For</p>
          <h2>For one question that needs experienced perspective.</h2>
        </div>
        <ul>
          <li>Business owners facing a systems decision.</li>
          <li>Teams unsure what to automate first.</li>
          <li>Founders choosing between tools or workflows.</li>
          <li>Operators who need a clearer next step.</li>
        </ul>
      </section>

      <section className="service-detail-work">
        <div className="section-intro">
          <p className="kicker">Good Questions</p>
          <h2>Bring the thing that feels stuck.</h2>
        </div>
        <div className="service-detail-work-grid">
          {questions.map((question) => (
            <article key={question}>
              <span>Question</span>
              <h3>{question}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="service-detail-receive">
        <div>
          <p className="kicker">What&apos;s Included</p>
          <h2>A focused working session with clear outputs.</h2>
        </div>
        <ul>
          {included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="service-detail-copy">
        <div>
          <p className="kicker">What You Leave With</p>
          <h2>Clarity should become movement.</h2>
        </div>
        <div>
          {leaveWith.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="service-detail-investment">
        <div>
          <p className="kicker">Investment</p>
          <h2>$500 for 90 minutes.</h2>
        </div>
        <div>
          <p className="service-detail-intro">
            If you move into a Vision engagement within 30 days, your Clarity Session investment is credited toward your Vision project.
          </p>
        </div>
      </section>

      <section className="service-detail-faq">
        <div className="section-intro">
          <p className="kicker">FAQ</p>
          <h2>Questions worth answering first.</h2>
        </div>
        <div className="services-faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="start-page clarity-booking" id="book">
        <div className="start-main">
          <section className="start-form-section">
            <p className="kicker">Book a Clarity Session</p>
            <h2>Tell us the question you&apos;re holding.</h2>
            <ClarityForm />
          </section>
        </div>
        <aside className="start-expect">
          <h2>What to expect</h2>
          <ul>
            <li>A focused 90-minute working session.</li>
            <li>Practical recommendations.</li>
            <li>A written action summary.</li>
            <li>Clear next steps.</li>
          </ul>
        </aside>
      </section>
    </Shell>
  );
}
