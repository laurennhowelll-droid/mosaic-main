"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  calculateClarityResult, categoryLabel, clarityCategories, clarityQuestions,
  systemsScore, systemsBand, systemsBandCopy, opportunityCopy, systemsCallCopy, systemsCallUrl,
} from "../../lib/clarity-check";

const scoreLabels = ["Not true yet", "Rarely true", "Somewhat true", "Mostly true", "Very true"];
function track(name: string, params: Record<string, string | number | boolean> = {}) {
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", name, params);
}
function focusResult(element: HTMLElement | null) {
  element?.focus({ preventScroll: true });
  element?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}

export default function ClarityCheckForm() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [context, setContext] = useState({ firstName: "", email: "", businessName: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [assessmentId, setAssessmentId] = useState("");
  const started = useRef(false);
  const completed = useRef(false);
  const resultRef = useRef<HTMLElement>(null);
  const breakdownRef = useRef<HTMLElement>(null);
  const complete = clarityQuestions.every(q => scores[q.id]);
  const answers = useMemo(() => clarityQuestions.map(q => ({ id: q.id, category: q.category, score: scores[q.id] ?? 0 })), [scores]);
  const result = useMemo(() => complete ? systemsScore(calculateClarityResult(answers)) : null, [answers, complete]);

  useEffect(() => {
    if (!result || completed.current) return;
    completed.current = true;
    track("systems_score_completed", { score: result.overall, result_band: systemsBand(result.overall) });
    track("clarity_check_results_viewed");
    focusResult(resultRef.current);
  }, [result]);

  useEffect(() => {
    if (status === "success") focusResult(breakdownRef.current);
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result || status === "loading" || status === "success") return;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/clarity-check", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...context, consent, answers }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error("save failed");
      setEmailSent(data.emailSent === true);
      setAssessmentId(data.assessmentId ?? "");
      setStatus("success");
      try { localStorage.setItem("mosaic_clarity_completed_until", String(Date.now() + 60 * 86400000)); } catch { /* Storage is optional. */ }
      track("systems_score_email_unlocked", { assessment_id: data.assessmentId ?? "", score: result.overall });
      track("clarity_check_completed", { email_sent: data.emailSent === true });
    } catch {
      setStatus("error");
      setMessage("We couldn't unlock your breakdown just yet. Your answers and score are still here. Please try again.");
    }
  }

  return <div className="clarity-check-form systems-score-flow">
    {!complete && <section id="systems-assessment" className="clarity-check-questions">
      <div className="systems-progress" role="status">{Object.keys(scores).length} of 21 answered · Choose what is true today.</div>
      {clarityCategories.map(category => <div className="clarity-question-category" key={category}>
        <div className="section-intro"><p className="kicker">Your client journey</p><h2>{categoryLabel(category)}</h2></div>
        {clarityQuestions.filter(q => q.category === category).map(question => <fieldset key={question.id}>
          <legend><span>{String(clarityQuestions.findIndex(q => q.id === question.id) + 1).padStart(2, "0")} / 21</span>{question.question}</legend>
          <div>
            {[1, 2, 3, 4, 5].map(score => <label key={score}>
              <input type="radio" name={question.id} value={score} checked={scores[question.id] === score}
                onChange={() => {
                  if (!started.current) { track("systems_score_started"); track("clarity_check_started"); started.current = true; }
                  setScores(current => ({ ...current, [question.id]: score }));
                }} />
              <strong>{score}</strong><small>{scoreLabels[score - 1]}</small>
            </label>)}
          </div>
        </fieldset>)}
      </div>)}
    </section>}

    {result && <>
      <section id="systems-assessment" className="clarity-check-preview systems-overall" ref={resultRef} tabIndex={-1} aria-label="Your Mosaic Systems Score">
        <div className="clarity-result-hero clarity-result-hero-simple">
          <p className="kicker">Your Mosaic Systems Score</p>
          <h2>{result.overall}<span> /100</span></h2>
          <strong>{systemsBand(result.overall)}</strong>
          <p>{systemsBandCopy(result.overall)}</p>
        </div>
      </section>
      {status !== "success" ? <section className="clarity-check-gate">
        <div><p className="kicker">A closer look</p><h2>Want to see what&apos;s behind your score?</h2><p>Unlock your breakdown across Capture, Follow-Up, Connection, and Visibility.</p></div>
        <form className="clarity-gate-card" onSubmit={handleSubmit} aria-busy={status === "loading"}>
          <div className="start-form-grid">
            <label>First name <span>*</span><input required maxLength={100} autoComplete="given-name" value={context.firstName} onChange={e => setContext({ ...context, firstName: e.target.value })} /></label>
            <label>Email <span>*</span><input required type="email" maxLength={254} autoComplete="email" value={context.email} onChange={e => setContext({ ...context, email: e.target.value })} /></label>
            <label className="start-form-wide">Business name <span>Optional</span><input maxLength={200} autoComplete="organization" value={context.businessName} onChange={e => setContext({ ...context, businessName: e.target.value })} /></label>
            <label className="clarity-consent start-form-wide"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /><span>Send me occasional useful Mosaic insights.</span></label>
          </div>
          <button className="button" type="submit" disabled={status === "loading"}>{status === "loading" ? "Unlocking your breakdown…" : status === "error" ? "Try again — show me my breakdown" : "Show me my breakdown"}</button>
          <p className="systems-gate-note">No spam. Just your results + occasional useful Mosaic insights if you opt in.</p>
          {message && <p className="admin-form-error" role="alert">{message}</p>}
        </form>
      </section> : <section className="clarity-check-preview systems-breakdown" ref={breakdownRef} tabIndex={-1} aria-label="Your system breakdown">
        <p className="kicker">Your system breakdown</p>
        <h2>Overall Systems Score: {result.overall}/100</h2>
        <div className="clarity-category-grid">
          {clarityCategories.map(category => <article className={`clarity-category-card clarity-category-${category}`} key={category}>
            <span>{categoryLabel(category)}</span><strong>{result.categories[category]}/100</strong>
            <i role="meter" aria-label={categoryLabel(category)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.categories[category]}><b style={{ width: `${result.categories[category]}%` }} /></i>
          </article>)}
        </div>
        <div className="clarity-result-insights">
          <article><p className="kicker">Strongest area</p><h3>{categoryLabel(result.strongest)}</h3></article>
          <article><p className="kicker">Biggest opportunity</p><h3>{categoryLabel(result.lowest)}</h3><p>{opportunityCopy[result.lowest]}</p></article>
        </div>
        <div className="clarity-starting-point systems-call">
          <p className="kicker">Your next step</p><h3>Want me to take a look with you?</h3>
          <p>Your score tells us where the friction may be.</p>
          <p>In a free 20-minute Systems Call, we&apos;ll look at your results together, talk through what&apos;s actually happening behind the score, and identify the first place I&apos;d investigate.</p>
          <p>{systemsCallCopy[result.lowest]}</p>
          <p>You don&apos;t need to know what software you need.<br />You don&apos;t need to organize everything beforehand.<br /><strong>Bring the messy version.</strong></p>
          <a className="button" href={systemsCallUrl} onClick={() => track("systems_call_clicked", { assessment_id: assessmentId, lowest_category: result.lowest })}>Book my free 20-minute Systems Call <span aria-hidden="true">↗</span></a>
          <p>20 minutes · Free · No obligation</p>
        </div>
        <p className="systems-email-status" role="status">{emailSent ? "Not ready to chat? Your results are on their way to your inbox." : "Your results are saved and your breakdown is available here. We couldn't send the email right now."}</p>
      </section>}
    </>}
  </div>;
}
