import Link from "next/link";
import type { Metadata } from "next";
import { BOOKING_URL } from "../../../studio";
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
    label: "Systems planning + advisory",
    headline: "Tell me what feels messy.",
    intro:
      "You do not need to know which service you need. Share the question, decision, or friction point, and Mosaic will help identify the next useful step.",
    formPrompt: "What are you trying to figure out?",
    expectFromMosaic: [
      "Lauren will personally review your submission.",
      "If Mosaic can help, you will hear back with a recommended next step.",
      "Start with a free Systems Call, then a $300 Systems Audit if a deeper review makes sense.",
    ],
    expectFromClient: [
      "Share the honest, messy version of the problem.",
      "Include the decision you are trying to make.",
      "Send any context that would help Mosaic understand what is at stake.",
    ],
  },
  website: {
    label: "Websites + client experience",
    headline: "Tell me what your website is not doing.",
    intro:
      "Your website is the beginning of the client journey. Mosaic connects the inquiry and booking experience to the follow-up, CRM, and reporting behind it.",
    formPrompt: "What is not working about the website right now?",
    expectFromMosaic: [
      "Lauren will review the site and your notes.",
      "We look at the website as one part of a Mosaic Client System, from the first inquiry to booked work.",
      "Mosaic will look at the customer journey, lead capture, handoff, and reporting around the website, not only the pages.",
    ],
    expectFromClient: [
      "Include the website URL if you have one.",
      "Share what visitors should understand or do.",
      "Mention any platform, lead capture, or e-commerce issues you already know about.",
    ],
  },
  systems: {
    label: "CRM + connected systems",
    headline: "Tell me where the manual work is piling up.",
    intro:
      "If the team is repeating steps, copying information, chasing updates, or working around tools, describe what is happening now.",
    formPrompt: "What are you doing manually that should feel simpler?",
    expectFromMosaic: [
      "Lauren will review the workflow and look for the simplest useful starting point.",
      "We look at how your CRM, follow-up, booking, payments, and reporting can work as one Mosaic Client System.",
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
      "We look at dashboards and reporting as the visibility layer of your Mosaic Client System.",
      "Mosaic will focus on useful visibility, not vanity metrics.",
    ],
    expectFromClient: [
      "Share what you are currently tracking, if anything.",
      "Name the tools or spreadsheets where the data lives.",
      "Describe the decisions better reporting should support.",
    ],
  },
  generate: {
    label: "Marketing attribution + lead capture",
    headline: "Tell me where the right customers are getting lost.",
    intro:
      "Traffic only tells part of the story. Mosaic connects marketing sources to inquiries, follow-up, booked work, and revenue inside the client system.",
    formPrompt: "What are you trying to generate, and what have you already tried?",
    expectFromMosaic: [
      "Lauren will review the offer, audience, website path, lead capture, and measurement context.",
      "We look at traffic → lead → follow-up → booked revenue, so marketing decisions connect to what happens after the click.",
      "Mosaic will not promise lead volume, revenue, ROAS, or ad outcomes.",
    ],
    expectFromClient: [
      "Share what kind of customer you want more of.",
      "Mention any current ads, campaigns, landing pages, or lead magnets.",
      "Include what happens after someone shows interest.",
    ],
  },
  keep: {
    label: "Email/SMS + retention",
    headline: "Tell me where customers stop coming back.",
    intro:
      "If you are not doing enough with existing leads, buyers, or customers, Mosaic will look at the journey after the first interaction.",
    formPrompt: "What should happen after someone joins, buys, or inquires?",
    expectFromMosaic: [
      "Lauren will review the current retention path and follow-up touchpoints.",
      "We look at email/SMS, customer follow-up, and retention as connected parts of the same client journey.",
      "Mosaic will not promise retention, revenue, or performance outcomes.",
    ],
    expectFromClient: [
      "Share what currently happens after someone becomes a lead or customer.",
      "Mention email, SMS, Klaviyo, pop-ups, or post-purchase flows if you use them.",
      "Describe the repeat action or relationship you want to build.",
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ pillar: string }> }): Promise<Metadata> {
  const { pillar } = await params;
  const details = pillars[pillar];
  return details ? { title: `${details.label} | Mosaic Client System`, description: details.intro } : {};
}

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
              Explore client system capabilities
            </Link>
            <p className="kicker">{details.label}</p>
            <h1>{details.headline}</h1>
            <p>{details.intro}</p>
            <p>One capability within the Mosaic Client System. You don’t need to choose a service before we talk.</p>
            <div className="actions"><Link className="button" href="/systems-score">Get your Systems Score →</Link><Link className="text-link" href={BOOKING_URL}>Book a free 20-minute Systems Call →</Link></div>
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
            <li>The $300 Systems Audit maps what should change before a Mosaic Client System build is scoped.</li>
          </ul>
        </aside>
      </section>
    </Shell>
  );
}
