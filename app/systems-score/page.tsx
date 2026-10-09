import type { Metadata } from "next";
import { Shell } from "../components";
import SystemsScoreQuiz from "./SystemsScoreQuiz";

const title = "Find the 3 places your business is leaking time | Mosaic";
const description = "12 quick questions about how leads, follow-up, tools, and numbers really work in your business. About 3 minutes. Your results show up right away, and you don't need an email to see them.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://buildwithmosaic.co/systems-score" },
  openGraph: { title, description, url: "https://buildwithmosaic.co/systems-score", siteName: "Mosaic", type: "website" },
};

export default function SystemsScorePage() {
  return <Shell>
    <section className="clarity-check-hero ss-landing">
      <p className="kicker">Free Systems Score</p>
      <h1>Find the 3 places your business is leaking time.</h1>
      <p>{description}</p>
      <a className="button" href="#systems-assessment">Find my leaks <span aria-hidden="true">→</span></a>
      <p className="ss-reassure">Free. No email needed to see your score. Built for service businesses: venues, photographers, wellness, home services, agencies.</p>
    </section>
    <section className="ss-included">
      <div>
        <h2>What you&apos;ll get</h2>
        <ul>
          <li>Your Systems Score out of 100, plus a score for each area: Capture, Follow-Up, Connection, Visibility</li>
          <li>Your top 3 time leaks, in plain English</li>
          <li>A rough, hypothetical estimate of the hours those leaks may cost you each week</li>
          <li>If you want them: an easy fix for each leak you can do with the tools you already have</li>
        </ul>
      </div>
      <blockquote>
        <p>Hi, I&apos;m Lauren. I build custom systems for growing service businesses. I connect the tools you already use so the business doesn&apos;t depend on you holding it all in your head. This score is the same first look I do on a call. Be honest with your answers. I like messy businesses. Bring me the messy version.</p>
        <p className="ss-signoff">— Lauren, Mosaic</p>
      </blockquote>
    </section>
    <SystemsScoreQuiz />
  </Shell>;
}
