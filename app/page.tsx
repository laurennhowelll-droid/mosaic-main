"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submitInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", { method: "POST", body: form });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <main>
      <nav className="nav">
        <a className="wordmark" href="#top" aria-label="Mosaic home">MOSAIC<span>®</span></a>
        <a className="nav-cta" href="#contact">Let’s talk <span>↗</span></a>
      </nav>

      <section className="hero" id="top">
        <p className="eyebrow">A new point of view</p>
        <h1>Make your<br /><em>next move</em><br />matter.</h1>
        <div className="hero-foot">
          <p>We’re building something thoughtful, energetic, and unmistakably ours. A new standard starts here.</p>
          <a href="#contact" className="round-link" aria-label="Get in touch">↓</a>
        </div>
        <div className="orb orb-one" /><div className="orb orb-two" /><div className="grid" />
      </section>

      <section className="statement">
        <p className="eyebrow">The beginning</p>
        <h2>Big ideas deserve a <em>beautiful</em> home.</h2>
        <p className="body-copy">Mosaic is taking shape. We’re creating an experience with equal parts clarity, character, and momentum—designed for people who want more from what comes next.</p>
      </section>

      <section className="values" aria-label="What guides us">
        {[['01', 'Human first'], ['02', 'Make it matter'], ['03', 'Keep moving']].map(([number, title]) => (
          <article className="value" key={number}>
            <span>{number}</span><h3>{title}</h3><p>Intentional details. Clear thinking. The kind of work people remember.</p>
          </article>
        ))}
      </section>

      <section className="contact" id="contact">
        <p className="eyebrow">Be first to know</p>
        <h2>Let’s make<br /><em>something real.</em></h2>
        <form onSubmit={submitInterest}>
          <label htmlFor="email">Your email</label>
          <div className="form-row">
            <input id="email" name="email" type="email" required placeholder="you@company.com" />
            <button disabled={status === "sending"} type="submit">{status === "sending" ? "Sending…" : "Keep me posted"} <span>↗</span></button>
          </div>
          <p className={`form-note ${status}`}>{status === "success" ? "You’re on the list. We’ll be in touch." : status === "error" ? "Something went wrong. Please try again." : "No noise. Just the good stuff."}</p>
        </form>
      </section>

      <footer><a className="wordmark" href="#top">MOSAIC<span>®</span></a><p>© {new Date().getFullYear()} Mosaic. Built with intention.</p></footer>
    </main>
  );
}
