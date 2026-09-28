import type { Metadata } from "next";
import { Shell } from "../components";
import ClarityCheckForm from "../clarity-check/ClarityCheckForm";

const title = "Free Systems Score | Mosaic";
const description = "See how connected your leads, follow-up, tools, and reporting really are with Mosaic's free 5-minute Systems Score for growing service businesses.";
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "https://buildwithmosaic.co/systems-score" },
  openGraph: { title, description, url: "https://buildwithmosaic.co/systems-score", siteName: "Mosaic", type: "website" },
};
export default function SystemsScorePage() {
  return <Shell>
    <section className="clarity-check-hero">
      <p className="kicker">Free 5-minute assessment</p>
      <h1>How connected is your business, really?</h1>
      <p>Your business can be growing and still feel harder to run than it should.</p>
      <p>The Mosaic Systems Score shows you where your client journey is working — and where manual follow-up, disconnected tools, or missing visibility may be slowing you down.</p>
      <p>21 questions. About 5 minutes. See your score instantly.</p>
      <a className="button" href="#systems-assessment">Get my Systems Score <span aria-hidden="true">↓</span></a>
    </section>
    <ClarityCheckForm />
  </Shell>;
}
