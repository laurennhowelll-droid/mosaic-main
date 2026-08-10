import { Shell } from "../components";
import StartVisionForm from "./StartVisionForm";

export default function StartPage() {
  return (
    <Shell>
      <section className="start-page">
        <div className="start-intro">
          <p className="kicker">Start With Vision</p>
          <h1>Start With Vision.</h1>
          <p>
            Tell us what’s happening in your business, what feels
            disconnected, and what you’re trying to build.
          </p>
          <p>
            You don’t need to know the solution yet.
            <br />
            That’s where we begin.
          </p>
        </div>
        <StartVisionForm />
      </section>
    </Shell>
  );
}
