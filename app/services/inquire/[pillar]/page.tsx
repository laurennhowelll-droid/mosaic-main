import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "../../../components";
import PillarLeadForm from "./PillarLeadForm";

type Pillar = {
  label: string;
  headline: string;
  intro: string;
  formPrompt: string;
  expectFromMosaic: string[];
  expectFromClient: string[];
};

const pillars: Record<string, Pillar> = {
  clarity: {
    label: "Clarity",
    headline: "Tell me what feels messy.",
    intro:
      "You do not need to know which service you need. Share the question, decision, or friction point, and Mosaic will help identify the next useful step.",
    formPrompt: "What are you trying to figure out?",
    expectFromMosaic: [
      "Lauren will personally review your submission.",
      "If Mosaic can help, you will hear back with a recommended next step.",
      "That may be a Clarity Session, a focused build, or a larger engagement later.",
    ],
    expectFromClient: [
      "Share the honest, messy version of the problem.",
      "Include the decision you are trying to make.",
      "Send any context that would help Mosaic understand what is at stake.",
    ],
  },
  website: {
    label: "Website",
    headline: "Tell me what your website is not doing.",
    intro:
      "Whether the issue is messaging, structure, conversion, lead capture, Shopify, or a full rebuild, start with what feels broken.",
    formPrompt: "What is not working about the website right now?",
    expectFromMosaic: [
      "Lauren will review the site and your notes.",
      "You will hear whether the best next step is an audit, focused fix, landing page, or larger Experience engagement.",
      "Mosaic will look at the customer journey around the website, not only the pages.",
    ],
    expectFromClient: [
      "Include the website URL if you have one.",
      "Share what visitors should understand or do.",
      "Mention any platform, lead capture, or e-commerce issues you already know about.",
    ],
  },
  systems: {
    label: "Systems",
    headline: "Tell me where the manual work is piling up.",
    intro:
      "If the team is repeating steps, copying information, chasing updates, or working around tools, describe what is happening now.",
    formPrompt: "What are you doing manually that should feel simpler?",
    expectFromMosaic: [
      "Lauren will review the workflow and look for the simplest useful starting point.",
      "You will hear whether Mosaic recommends an automation sprint, workflow build, database, or larger Connect engagement.",
      "Mosaic will clarify the process before recommending tools.",
    ],
    expectFromClient: [
      "Describe the current process in plain language.",
      "Name the tools involved if you know them.",
      "Share where mistakes, delays, duplicate work, or confusion happen most often.",
    ],
  },
  visibility: {
    label: "Visibility",
    headline: "Tell me what you cannot see clearly.",
    intro:
      "If reporting takes too long, numbers are hard to trust, or information lives in too many places, start with the decision you wish you could make faster.",
    formPrompt: "What do you wish you could see or understand more easily?",
    expectFromMosaic: [
      "Lauren will review what information you need and where it currently lives.",
      "You will hear whether the next step is a dashboard, reporting workflow, data cleanup, or broader systems work.",
      "Mosaic will focus on useful visibility, not vanity metrics.",
    ],
    expectFromClient: [
      "Share what you are currently tracking, if anything.",
      "Name the tools or spreadsheets where the data lives.",
      "Describe the decisions better reporting should support.",
    ],
  },
  generate: {
    label: "Generate",
    headline: "Tell me where the right customers are getting lost.",
    intro:
      "If you need more qualified attention, leads, or customers, Mosaic will look at the path from first click through conversion.",
    formPrompt: "What are you trying to generate, and what have you already tried?",
    expectFromMosaic: [
      "Lauren will review the offer, audience, website path, lead capture, and measurement context.",
      "You will hear whether Mosaic recommends a campaign setup, landing page, tracking fix, or connected Generate + Keep conversation.",
      "Mosaic will not promise lead volume, revenue, ROAS, or ad outcomes.",
    ],
    expectFromClient: [
      "Share what kind of customer you want more of.",
      "Mention any current ads, campaigns, landing pages, or lead magnets.",
      "Include what happens after someone shows interest.",
    ],
  },
  keep: {
    label: "Keep",
    headline: "Tell me where customers stop coming back.",
    intro:
      "If you are not doing enough with existing leads, buyers, or customers, Mosaic will look at the journey after the first interaction.",
    formPrompt: "What should happen after someone joins, buys, or inquires?",
    expectFromMosaic: [
      "Lauren will review the current retention path and follow-up touchpoints.",
      "You will hear whether Mosaic recommends email/SMS setup, Klaviyo flows, lead capture, reporting, or a connected Generate + Keep conversation.",
      "Mosaic will not promise retention, revenue, or performance outcomes.",
    ],
    expectFromClient: [
      "Share what currently happens after someone becomes a lead or customer.",
      "Mention email, SMS, Klaviyo, pop-ups, or post-purchase flows if you use them.",
      "Describe the repeat action or relationship you want to build.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pillars).map((pillar) => ({ pillar }));
}

export default async function PillarInquiryPage({
  params,
}: {
  params: Promise<{ pillar: string }>;
}) {
  const { pillar } = await params;
  const details = pillars[pillar];

  if (!details) {
    notFound();
  }

  return (
    <Shell>
      <section className="pillar-inquiry-page">
        <div className="pillar-inquiry-main">
          <section className="pillar-inquiry-intro">
            <Link className="text-link" href="/services">
              Back to Services
            </Link>
            <p className="kicker">{details.label}</p>
            <h1>{details.headline}</h1>
            <p>{details.intro}</p>
          </section>

          <section className="pillar-expectations" aria-label="What to expect">
            <article>
              <h2>What you can expect from Mosaic</h2>
              <ul>
                {details.expectFromMosaic.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article>
              <h2>What Mosaic needs from you</h2>
              <ul>
                {details.expectFromClient.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="pillar-form-section">
            <h2>Send the problem.</h2>
            <p>
              This is not a checkout or a commitment. It gives Mosaic enough context to review what is happening and reach out with the most useful next step.
            </p>
            <PillarLeadForm pillar={pillar} prompt={details.formPrompt} />
          </section>
        </div>

        <aside className="start-expect pillar-aside">
          <h2>Simple entry point.</h2>
          <ul>
            <li>Start with one visible problem.</li>
            <li>Let Mosaic look at the business around it.</li>
            <li>Receive a practical recommendation before anything bigger is scoped.</li>
            <li>If the issue points to Vision, Experience, Connect, or Grow later, we will say so clearly.</li>
          </ul>
        </aside>
      </section>
    </Shell>
  );
}
