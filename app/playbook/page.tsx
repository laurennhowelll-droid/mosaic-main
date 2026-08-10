import Link from "next/link";
import { Shell, Mark } from "../components";

const principles = [
  {
    number: "01",
    title: "Start With Vision",
    copy: "Before software, process, or design, understand what the business is actually trying to become.",
  },
  {
    number: "02",
    title: "Clarity Over Complexity",
    copy: "More tools do not automatically create a better business. The clearest solution usually wins.",
  },
  {
    number: "03",
    title: "Every Piece Has Purpose",
    copy: "Brand, operations, technology, customer experience, and reporting should support the same vision.",
  },
  {
    number: "04",
    title: "Systems Should Empower People",
    copy: "Good systems reduce mental load. They should help people do better work, not make them serve the software.",
  },
  {
    number: "05",
    title: "Technology Follows Strategy",
    copy: "Never implement technology simply because it exists. Choose technology after understanding the problem.",
  },
  {
    number: "06",
    title: "Build for Tomorrow",
    copy: "Solve today's problem without creating tomorrow's bottleneck.",
  },
];

const frameworks = [
  {
    label: "Framework",
    title: "The Connected Business Framework",
    steps: [
      "Vision",
      "Brand",
      "Customer Experience",
      "Operations",
      "Systems",
      "Reporting",
      "Growth",
    ],
    copy: "A business becomes easier to lead when every layer supports the one above it.",
  },
  {
    label: "Framework",
    title: "The Clarity Pyramid",
    steps: ["Vision", "Strategy", "Process", "Technology", "Automation"],
    copy: "Many businesses build from the bottom. They automate first, choose software second, and clarify the strategy later. We believe the order should be reversed.",
  },
  {
    label: "Model",
    title: "The Four Tiles",
    tiles: [
      ["Vision", "Vision gives direction."],
      ["Structure", "Structure creates consistency."],
      ["Connection", "Connection creates momentum."],
      ["Craft", "Craft makes the experience intentional."],
    ],
    copy: "The Mosaic identity is also a working model for how the strongest businesses hold together.",
  },
  {
    label: "Audit",
    title: "The Systems Audit",
    questions: [
      "What problem does it solve?",
      "Who owns it?",
      "What does it connect to?",
      "Does it make the business simpler?",
    ],
    copy: "Every system should earn its place inside the business.",
  },
];

const guides = [
  ["Software", "Why Most Businesses Don't Need More Software", "A closer look at why new tools often create more noise unless the business problem is clear."],
  ["Automation", "When to Automate - and When Not To", "A practical distinction between work that should be automated and work that still needs human judgment."],
  ["Operations", "How to Know When You've Outgrown Spreadsheets", "Signs that a spreadsheet has become an operating risk instead of a useful working surface."],
  ["Systems", "The Real Cost of Disconnected Systems", "How small gaps between tools quietly become delays, rework, and poor customer experiences."],
  ["Vision", "Why We Start With Vision", "Why the first move is understanding direction before recommending design, software, or systems."],
  ["Technology", "Choosing Technology Without Creating More Complexity", "A way to evaluate tools by the clarity they create, not the features they advertise."],
  ["Team", "Signs You Need Better Systems - Not More Employees", "A guide to identifying when friction is structural rather than a staffing problem."],
  ["Experience", "Operations Is Part of the Customer Experience", "Why internal handoffs, visibility, and workflows shape how customers feel about the business."],
  ["AI", "AI Isn't the Strategy", "How to use AI thoughtfully without mistaking capability for direction."],
  ["Growth", "Build for the Business You're Becoming", "How to solve today's constraints without hardcoding tomorrow's bottlenecks."],
];

const practiceStatements = [
  "See the whole picture.",
  "Simplify before adding.",
  "Build with intention.",
];

type Framework = (typeof frameworks)[number];
type TileFramework = Framework & {
  tiles: [string, string][];
};
type QuestionFramework = Framework & {
  questions: string[];
};
type SequenceFramework = Framework & {
  steps: string[];
};

function hasTiles(framework: Framework): framework is TileFramework {
  return "tiles" in framework && Array.isArray(framework.tiles);
}

function hasQuestions(framework: Framework): framework is QuestionFramework {
  return "questions" in framework && Array.isArray(framework.questions);
}

function hasSteps(framework: Framework): framework is SequenceFramework {
  return "steps" in framework && Array.isArray(framework.steps);
}

function FrameworkVisual({
  framework,
}: {
  framework: Framework;
}) {
  if (hasTiles(framework)) {
    return (
      <div className="playbook-tile-model" aria-label="The Four Tiles">
        <Mark small />
        {framework.tiles.map(([title, copy]) => (
          <div key={title}>
            <strong>{title}</strong>
            <span>{copy}</span>
          </div>
        ))}
      </div>
    );
  }

  if (hasQuestions(framework)) {
    return (
      <ol className="playbook-question-list">
        {framework.questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
    );
  }

  if (hasSteps(framework)) {
    return (
      <div className="playbook-sequence">
        {framework.steps.map((step) => (
          <span key={step}>{step}</span>
        ))}
      </div>
    );
  }

  return null;
}

export default function PlaybookPage() {
  return (
    <Shell>
      <section className="playbook-hero">
        <p className="kicker">The Mosaic Playbook</p>
        <h1>Better businesses aren&apos;t built by accident.</h1>
        <div className="playbook-hero-copy">
          <p>They&apos;re built by repeatedly making thoughtful decisions.</p>
          <p>
            The Mosaic Playbook is a growing collection of the principles, frameworks, and practical ideas behind businesses that work beautifully.
          </p>
          <p>Some are simple.</p>
          <p>Some were learned through years of solving real operational problems.</p>
          <p>
            Together, they represent how we think about clarity, technology, systems, customer experience, and sustainable growth.
          </p>
        </div>
      </section>

      <section className="playbook-principles">
        <div className="playbook-section-head">
          <p className="kicker">Principles</p>
          <h2>The beliefs behind the work.</h2>
          <p>These are the ideas we return to when a business feels complicated.</p>
        </div>
        <div className="playbook-principle-grid">
          {principles.map((principle) => (
            <article className="playbook-principle-card" key={principle.title}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="playbook-frameworks">
        <div className="playbook-section-head">
          <p className="kicker">Frameworks</p>
          <h2>Thinking made useful.</h2>
          <p>
            Frameworks turn complicated problems into something easier to understand, discuss, and act on.
          </p>
        </div>
        <div className="playbook-framework-grid">
          {frameworks.map((framework) => (
            <article className="playbook-framework-card" key={framework.title}>
              <div>
                <p className="kicker">{framework.label}</p>
                <h3>{framework.title}</h3>
                <p>{framework.copy}</p>
              </div>
              <FrameworkVisual framework={framework} />
            </article>
          ))}
        </div>
      </section>

      <section className="playbook-guides">
        <div className="playbook-section-head">
          <p className="kicker">Guides</p>
          <h2>Practical thinking for growing businesses.</h2>
        </div>
        <div className="playbook-guide-list">
          {guides.map(([category, title, teaser]) => (
            <article className="playbook-guide-card" key={title}>
              <span>{category}</span>
              <h3>{title}</h3>
              <p>{teaser}</p>
              <strong>Coming soon</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="playbook-practice">
        <div>
          <p className="kicker">The Playbook In Practice</p>
          <h2>Ideas are only useful when they change the way you work.</h2>
        </div>
        <div>
          <p>The Playbook isn&apos;t theory for theory&apos;s sake.</p>
          <p>These ideas are meant to help businesses make better decisions:</p>
          <ul>
            <li>What deserves to exist.</li>
            <li>What can be removed.</li>
            <li>What should be automated.</li>
            <li>Where people need more clarity.</li>
            <li>And what the next stage of growth actually requires.</li>
          </ul>
          <div className="playbook-practice-statements">
            {practiceStatements.map((statement) => (
              <span key={statement}>{statement}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="playbook-why">
        <p className="kicker">Why This Exists</p>
        <h2>Every project teaches us something.</h2>
        <div className="playbook-why-copy">
          <p>The Playbook is designed to grow.</p>
          <p>New frameworks come from solving real problems.</p>
          <p>New principles come from seeing the same patterns repeat across different businesses.</p>
          <p>And the best ideas become tools that make future decisions clearer.</p>
          <p>The goal is simple:</p>
          <p>Leave every business clearer than we found it.</p>
        </div>
      </section>

      <section className="playbook-final-cta">
        <h2>See something you recognize in your own business?</h2>
        <p>
          Start with Vision and we&apos;ll figure out which problems deserve attention first.
        </p>
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
