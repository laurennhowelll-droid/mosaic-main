"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateClarityResult,
  clarityQuestions,
  resultBandLabel,
} from "../../lib/clarity-check";

const scoreLabels = [
  "Not true yet",
  "Rarely true",
  "Somewhat true",
  "Mostly true",
  "Very true",
];

export default function ClarityCheckForm() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [gate, setGate] = useState({
    firstName: "",
    email: "",
    companyName: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const complete = clarityQuestions.every((question) => scores[question.id]);
  const answers = useMemo(
    () =>
      clarityQuestions.map((question) => ({
        id: question.id,
        category: question.category,
        score: scores[question.id] ?? 0,
      })),
    [scores],
  );
  const result = complete ? calculateClarityResult(answers) : null;

  function updateGate(name: keyof typeof gate, value: string | boolean) {
    setGate((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!result || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/clarity-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...gate,
          answers,
        }),
      });
      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.error ?? "We couldn't send your report. Please try again.");
        return;
      }

      localStorage.setItem("mosaic_clarity_completed_until", String(Date.now() + 60 * 24 * 60 * 60 * 1000));
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success" && result) {
    return (
      <section className="clarity-check-success" role="status">
        <p className="kicker">Report Sent</p>
        <h2>Your Mosaic Clarity Report is on its way.</h2>
        <p>
          We sent your full report to {gate.email}. Your score was {result.totalScore} / 50, with{" "}
          {result.primaryGap.toLowerCase()} as the biggest opportunity.
        </p>
        <Link className="button" href={result.nextStepHref}>
          Explore Your Next Step <b>↗</b>
        </Link>
      </section>
    );
  }

  return (
    <form className="clarity-check-form" onSubmit={handleSubmit}>
      <section className="clarity-check-questions">
        {clarityQuestions.map((question, index) => (
          <fieldset key={question.id}>
            <legend>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {question.question}
            </legend>
            <div role="radiogroup" aria-label={question.question}>
              {[1, 2, 3, 4, 5].map((score) => (
                <label key={score}>
                  <input
                    required
                    type="radio"
                    name={question.id}
                    value={score}
                    checked={scores[question.id] === score}
                    onChange={() => setScores((current) => ({ ...current, [question.id]: score }))}
                  />
                  <strong>{score}</strong>
                  <small>{scoreLabels[score - 1]}</small>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </section>

      {result && (
        <section className="clarity-check-preview">
          <div className="clarity-result-hero clarity-result-hero-simple">
            <p className="kicker">Your Preview Result</p>
            <h2>{result.totalScore} / 50</h2>
            <strong>{resultBandLabel(result.resultBand)}</strong>
            <p>
              This is not a grade. It is a snapshot of where your business may be carrying unnecessary friction.
            </p>
          </div>
        </section>
      )}

      {result && (
        <section className="clarity-check-gate">
          <div>
            <p className="kicker">Full Report</p>
            <h2>Send my full report.</h2>
            <p>
              Your full report includes your category scores, what appears to be working, where I&apos;d look first, and three practical priorities based on your answers.
            </p>
          </div>
          <div className="clarity-gate-card">
            <div className="start-form-grid">
              <label>
                First Name <span>*</span>
                <input
                  required
                  name="firstName"
                  value={gate.firstName}
                  onChange={(event) => updateGate("firstName", event.target.value)}
                  autoComplete="given-name"
                />
              </label>
              <label>
                Email <span>*</span>
                <input
                  required
                  type="email"
                  name="email"
                  value={gate.email}
                  onChange={(event) => updateGate("email", event.target.value)}
                  autoComplete="email"
                />
              </label>
              <label className="start-form-wide">
                Company Name <span>Optional</span>
                <input
                  name="companyName"
                  value={gate.companyName}
                  onChange={(event) => updateGate("companyName", event.target.value)}
                  autoComplete="organization"
                />
              </label>
              <label className="clarity-consent start-form-wide">
                <input
                  type="checkbox"
                  checked={gate.consent}
                  onChange={(event) => updateGate("consent", event.target.checked)}
                />
                <span>Send me occasional Mosaic insights.</span>
              </label>
            </div>
            <button className="button" type="submit" disabled={!complete || status === "loading"}>
              {status === "loading" ? "Sending..." : "Send My Full Report →"}
            </button>
            {message && <p className="admin-form-error">{message}</p>}
          </div>
        </section>
      )}
    </form>
  );
}
