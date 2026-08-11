import { Shell } from "../components";
import ClarityCheckForm from "./ClarityCheckForm";

export default function ClarityCheckPage() {
  return (
    <Shell>
      <section className="clarity-check-hero">
        <p className="kicker">Business Clarity Check</p>
        <h1>Where is your business getting disconnected?</h1>
        <p>
          Answer 10 quick questions to see where clarity could create the most momentum. You&apos;ll see your score first, then choose whether to receive the full report by email.
        </p>
      </section>
      <ClarityCheckForm />
    </Shell>
  );
}
