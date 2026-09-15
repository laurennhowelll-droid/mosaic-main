import { Shell } from "../components";
import ClarityCheckForm from "./ClarityCheckForm";

export default function ClarityCheckPage() {
  return (
    <Shell>
      <section className="clarity-check-hero">
        <p className="kicker">Free Clarity Check</p>
        <h1>How connected is your customer journey?</h1>
        <p>
          This five-minute Clarity Check will help you see where leads, follow-up, customer information, and reporting may be falling through the cracks. You do not need to know which service you need.
        </p>
      </section>
      <ClarityCheckForm />
    </Shell>
  );
}
