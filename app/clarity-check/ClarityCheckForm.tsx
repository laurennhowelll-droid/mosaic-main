"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  calculateClarityResult,
  categoryLabel,
  clarityCategories,
  clarityQuestions,
  interpretCategory,
  maxScoreForCategory,
  primaryGapCopy,
  resultBandLabel,
  scoreForCategory,
  strongestAreaCopy,
} from "../../lib/clarity-check";

const scoreLabels = ["Not true yet", "Rarely true", "Somewhat true", "Mostly true", "Very true"];
const clarityCallUrl = "https://calendar.app.google/JxAn6pJFxwyu1FJq6";

const contextFields = [
  ["businessType", "What type of business do you run?", "text"],
  ["servicesProvided", "What services do you provide?", "textarea"],
  ["monthlyLeads", "Approximately how many inquiries or leads do you receive in a typical month?", "text"],
  ["teamAccess", "How many team members use or need access to customer information?", "text"],
  ["currentTools", "What tools are currently involved in your process?", "textarea"],
  ["leadTracking", "How are leads currently tracked?", "textarea"],
  ["hardestPart", "Which part feels hardest right now?", "textarea"],
  ["improvementGoal", "What would you most like to understand or improve?", "textarea"],
] as const;

const supportOptions = ["Advice", "Implementation", "Both", "Not sure yet"];
const timelineOptions = ["Immediate priority", "Within three months", "Exploring"];

type ContextKey =
  | "businessType"
  | "servicesProvided"
  | "monthlyLeads"
  | "teamAccess"
  | "currentTools"
  | "leadTracking"
  | "hardestPart"
  | "improvementGoal"
  | "supportType"
  | "priorityTimeline"
  | "firstName"
  | "businessName"
  | "email"
  | "website";

const initialContext: Record<ContextKey, string> = {
  businessType: "",
  servicesProvided: "",
  monthlyLeads: "",
  teamAccess: "",
  currentTools: "",
  leadTracking: "",
  hardestPart: "",
  improvementGoal: "",
  supportType: "",
  priorityTimeline: "",
  firstName: "",
  businessName: "",
  email: "",
  website: "",
};

function track(eventName: string, params?: Record<string, string | number | boolean>) {
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", eventName, params ?? {});
}

export default function ClarityCheckForm() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [context, setContext] = useState(initialContext);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [startedTracked, setStartedTracked] = useState(false);
  const resultsTracked = useRef(false);

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

  useEffect(() => {
    if (!result || resultsTracked.current) return;
    track("clarity_check_results_viewed", {
      result_band: result.resultBand,
      primary_gap: result.primaryGap,
      recommended_service: result.recommendedService,
    });
    resultsTracked.current = true;
  }, [result]);

  function updateContext(name: ContextKey, value: string) {
    setContext((current) => ({ ...current, [name]: value }));
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
        body: JSON.stringify({ ...context, consent, answers }),
      });
      const data = (await response.json()) as { success?: boolean; error?: string; emailSent?: boolean };

      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.error ?? "We couldn't save your results. Please try again.");
        return;
      }

      localStorage.setItem("mosaic_clarity_completed_until", String(Date.now() + 60 * 24 * 60 * 60 * 1000));
      setEmailSent(data.emailSent ?? false);
      track("clarity_check_completed", {
        result_band: result.resultBand,
        primary_gap: result.primaryGap,
        recommended_service: result.recommendedService,
        email_sent: data.emailSent ?? false,
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form className="clarity-check-form" onSubmit={handleSubmit}>
      <section className="clarity-check-questions">
        {clarityCategories.map((category) => (
          <div className="clarity-question-category" key={category}>
            <div className="section-intro">
              <p className="kicker">{categoryLabel(category)}</p>
              <h2>{categoryLabel(category)}</h2>
            </div>
            {clarityQuestions.filter((question) => question.category === category).map((question, index) => (
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
                        onChange={() => {
                          if (!startedTracked) {
                            track("clarity_check_started");
                            setStartedTracked(true);
                          }
                          setScores((current) => ({ ...current, [question.id]: score }));
                        }}
                      />
                      <strong>{score}</strong>
                      <small>{scoreLabels[score - 1]}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        ))}
      </section>

      {result && (
        <section className="clarity-check-preview">
          <div className="clarity-result-hero clarity-result-hero-simple">
            <p className="kicker">Your Preliminary Result</p>
            <h2>{result.totalScore} / {result.maxScore}</h2>
            <strong>{resultBandLabel(result.resultBand)}</strong>
            <p>This is a preliminary self-assessment, not a full systems audit.</p>
          </div>

          <div className="clarity-category-grid">
            {clarityCategories.map((category) => {
              const score = scoreForCategory(result, category);
              const max = maxScoreForCategory(category);
              return (
                <article className={`clarity-category-card clarity-category-${category}`} key={category}>
                  <span>{categoryLabel(category)}</span>
                  <strong>{score} / {max}</strong>
                  <i aria-hidden="true"><b style={{ width: `${(score / max) * 100}%` }} /></i>
                  <p>{interpretCategory(category, score)}</p>
                </article>
              );
            })}
          </div>

          <div className="clarity-result-insights">
            <article>
              <p className="kicker">Strongest Category</p>
              <h3>{categoryLabel(result.strongestCategory)}</h3>
              <p>{strongestAreaCopy(result.strongestCategory)}</p>
            </article>
            <article>
              <p className="kicker">Greatest Opportunity</p>
              <h3>{result.primaryGap}</h3>
              <p>{primaryGapCopy(result.weakestCategory)}</p>
            </article>
          </div>

          <div className="clarity-priority-grid">
            <p className="kicker">Recommended Next Steps</p>
            {result.priorities.map((priority, index) => (
              <article key={priority.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{priority.title}</h3>
                <p>{priority.copy}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {result && (
        <section className="clarity-check-gate">
          <div>
            <p className="kicker">Save + Email Results</p>
            <h2>Email me my results.</h2>
            <p>
              Add enough context for a useful follow-up. If email delivery is not configured, your result will still save and stay visible here.
            </p>
          </div>
          <div className="clarity-gate-card">
            <div className="start-form-grid">
              {contextFields.map(([name, label, type]) => (
                <label className="start-form-wide" key={name}>
                  {label}
                  {type === "textarea" ? (
                    <textarea value={context[name]} onChange={(event) => updateContext(name, event.target.value)} rows={4} />
                  ) : (
                    <input value={context[name]} onChange={(event) => updateContext(name, event.target.value)} />
                  )}
                </label>
              ))}
              <label>
                Are you primarily looking for advice, implementation, or both?
                <select value={context.supportType} onChange={(event) => updateContext("supportType", event.target.value)}>
                  <option value="">Choose one</option>
                  {supportOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label>
                Priority timeline
                <select value={context.priorityTimeline} onChange={(event) => updateContext("priorityTimeline", event.target.value)}>
                  <option value="">Choose one</option>
                  {timelineOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label>
                Name <span>*</span>
                <input required value={context.firstName} onChange={(event) => updateContext("firstName", event.target.value)} autoComplete="given-name" />
              </label>
              <label>
                Business name
                <input value={context.businessName} onChange={(event) => updateContext("businessName", event.target.value)} autoComplete="organization" />
              </label>
              <label>
                Email <span>*</span>
                <input required type="email" value={context.email} onChange={(event) => updateContext("email", event.target.value)} autoComplete="email" />
              </label>
              <label>
                Website <span>Optional</span>
                <input type="url" value={context.website} onChange={(event) => updateContext("website", event.target.value)} autoComplete="url" />
              </label>
              <label className="clarity-consent start-form-wide">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                <span>Send me occasional Mosaic insights.</span>
              </label>
            </div>
            <button className="button" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Saving..." : "Email Me My Results →"}
            </button>
            {status === "success" && (
              <p className="start-form-message start-form-message-success" role="status">
                Your results were saved. {emailSent ? "An email was sent." : "Email delivery is not configured yet, so nothing was sent."}
              </p>
            )}
            {message && <p className="admin-form-error" role="status">{message}</p>}
            <div className="actions">
              <Link className="button" href={clarityCallUrl}>Book a FREE Clarity Call <b>↗</b></Link>
              <Link className="text-link" href="/services">Explore Services →</Link>
            </div>
          </div>
        </section>
      )}
    </form>
  );
}
