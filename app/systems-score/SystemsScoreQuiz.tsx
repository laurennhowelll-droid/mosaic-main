"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { BOOKING_URL, EXAMPLES_URL } from "../../lib/site-links";
import {
  adminHourOptions,
  clientValueOptions,
  formatDollars,
  formatHours,
  scoredQuestions,
  scoreSystemsScore,
  sectionDescriptions,
  sectionLabels,
  sectionOrder,
  type SectionId,
} from "../../lib/systems-score-v2";

type Step =
  | { type: "intro" }
  | { type: "question"; index: number }
  | { type: "transition" }
  | { type: "loading" }
  | { type: "results" };

const introCopy = "There are no wrong answers. Pick the one that's true most weeks, not your best week.";
const transitionCopy = "Last two. These help me estimate what the leaks are costing you.";

function questionNumber(index: number) {
  return index + 1;
}

export default function SystemsScoreQuiz() {
  const [step, setStep] = useState<Step>({ type: "intro" });
  const [answers, setAnswers] = useState<Array<number | null>>(Array(12).fill(null));
  const [adminHours, setAdminHours] = useState<number | null>(null);
  const [clientValue, setClientValue] = useState<number | null | undefined>(undefined);
  const screenRef = useRef<HTMLElement>(null);
  const mounted = useRef(false);
  const advanceTimer = useRef<number | null>(null);
  const radioName = useId();

  function cancelAdvance() {
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }

  function queueAdvance(index: number) {
    cancelAdvance();
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      goNextFromQuestion(index);
    }, 180);
  }

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return () => cancelAdvance();
    }
    const heading = screenRef.current?.querySelector<HTMLElement>("[data-step-focus]");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    return () => cancelAdvance();
  }, [step]);

  useEffect(() => {
    if (step.type !== "loading") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setStep({ type: "results" }), reduce ? 0 : 1100);
    return () => window.clearTimeout(timeout);
  }, [step]);

  function saveScored(index: number, value: number) {
    setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? value : answer));
  }

  function goNextFromQuestion(index: number) {
    if (index < 11) setStep({ type: "question", index: index + 1 });
    else if (index === 11) setStep({ type: "transition" });
    else setStep({ type: "question", index: 13 });
  }

  function goBackFromQuestion(index: number) {
    if (index === 0) setStep({ type: "intro" });
    else if (index === 12) setStep({ type: "transition" });
    else setStep({ type: "question", index: index - 1 });
  }

  const ready = answers.every((answer) => answer !== null) && adminHours !== null && clientValue !== undefined;
  const result = step.type === "results" && ready
    ? scoreSystemsScore({ answers: answers as number[], adminHours, clientValue: clientValue ?? null })
    : null;

  return <div className="systems-score-flow ss-v2" id="systems-assessment" tabIndex={-1}>
    <section ref={screenRef}>
      {step.type === "intro" && <div className="ss-screen">
        <h2 data-step-focus>{introCopy}</h2>
        <div className="ss-nav">
          <span />
          <button className="button" type="button" onClick={() => setStep({ type: "question", index: 0 })}>Next</button>
        </div>
      </div>}

      {step.type === "transition" && <div className="ss-screen">
        <h2 data-step-focus>{transitionCopy}</h2>
        <div className="ss-nav">
          <button className="ss-back" type="button" onClick={() => setStep({ type: "question", index: 11 })}>Back</button>
          <button className="button" type="button" onClick={() => setStep({ type: "question", index: 12 })}>Next</button>
        </div>
      </div>}

      {step.type === "question" && <QuestionScreen
        index={step.index}
        radioName={radioName}
        scoredValue={step.index < 12 ? answers[step.index] : null}
        adminHours={adminHours}
        clientValue={clientValue}
        onScored={(value, advance) => {
          saveScored(step.index, value);
          if (advance) queueAdvance(step.index);
        }}
        onAdminHours={(value, advance) => {
          setAdminHours(value);
          if (advance) queueAdvance(step.index);
        }}
        onClientValue={setClientValue}
        onBack={() => goBackFromQuestion(step.index)}
        onNext={() => {
          cancelAdvance();
          if (step.index === 13) setStep({ type: "loading" });
          else goNextFromQuestion(step.index);
        }}
      />}

      {step.type === "loading" && <div className="ss-screen">
        <p className="kicker">Systems Score</p>
        <h2 data-step-focus>Finding your leaks…</h2>
      </div>}

      {result && adminHours !== null && clientValue !== undefined && <Results
        result={result}
        answers={answers as number[]}
        adminHours={adminHours}
        clientValue={clientValue}
        onReview={() => setStep({ type: "question", index: 13 })}
      />}
    </section>
  </div>;
}

function QuestionScreen({
  index,
  radioName,
  scoredValue,
  adminHours,
  clientValue,
  onScored,
  onAdminHours,
  onClientValue,
  onBack,
  onNext,
}: {
  index: number;
  radioName: string;
  scoredValue: number | null;
  adminHours: number | null;
  clientValue: number | null | undefined;
  onScored: (value: number, advance: boolean) => void;
  onAdminHours: (value: number, advance: boolean) => void;
  onClientValue: (value: number | null) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const number = questionNumber(index);
  const scored = index < 12 ? scoredQuestions[index] : null;
  const selected = scored
    ? scoredValue
    : index === 12
      ? adminHours
      : clientValue === undefined ? null : clientValue;
  const options = scored
    ? scored.options.map((label, optionIndex) => ({ label, value: optionIndex + 1 }))
    : index === 12
      ? adminHourOptions.map((option) => ({ label: option.label, value: option.value }))
      : clientValueOptions.map((option) => ({ label: option.label, value: option.value }));
  const canContinue = index === 13 ? clientValue !== undefined : selected !== null;

  return <div className="ss-screen">
    <div className="ss-progress" aria-hidden="true">
      <span style={{ width: `${(number / 14) * 100}%` }} />
    </div>
    <p className="ss-progress-label">Question {number} of 14</p>
    {scored && <p className="kicker">{sectionLabels[scored.section]}</p>}
    <fieldset data-step-focus>
      <legend>{scored ? scored.prompt : index === 12
        ? "In a typical week, how many hours do you (or your team) spend on admin: chasing follow-ups, copying info between tools, hunting for details, updating spreadsheets?"
        : "Roughly what is one new client worth to your business?"}</legend>
      <div className="ss-options">
        {options.map((option) => {
          const checked = option.value === selected;
          return <label className="ss-option" key={option.label}>
            <input
              type="radio"
              name={`${radioName}-${index}`}
              checked={checked}
              onChange={() => {
                if (scored) onScored(option.value as number, false);
                else if (index === 12) onAdminHours(option.value as number, false);
                else onClientValue(option.value as number | null);
              }}
              onClick={() => {
                if (index === 13) onClientValue(option.value as number | null);
                else if (scored) onScored(option.value as number, true);
                else onAdminHours(option.value as number, true);
              }}
            />
            <span>{option.label}</span>
          </label>;
        })}
      </div>
    </fieldset>
    <div className="ss-nav">
      <button className="ss-back" type="button" onClick={onBack}>Back</button>
      <button className="button" type="button" disabled={!canContinue} onClick={onNext}>
        {index === 13 ? "See my results →" : "Next"}
      </button>
    </div>
  </div>;
}

type SavedFix = { id: string; name: string; kind: "leak" | "tune-up"; title: string; steps: string[] };
type EmailStatus = "sent" | "failed" | "disabled";

function Results({
  result,
  answers,
  adminHours,
  clientValue,
  onReview,
}: {
  result: ReturnType<typeof scoreSystemsScore>;
  answers: number[];
  adminHours: number;
  clientValue: number | null;
  onReview: () => void;
}) {
  const [submissionId] = useState(() => crypto.randomUUID());
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"form" | "ready">("form");
  const [saving, setSaving] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [fixes, setFixes] = useState<SavedFix[] | null>(null);
  const [error, setError] = useState("");

  async function unlockFixes(event?: FormEvent) {
    event?.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/systems-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, firstName, email, answers, adminHours, clientValue }),
      });
      const payload = await response.json() as { success?: boolean; error?: string; emailStatus?: EmailStatus; fixes?: SavedFix[] };
      if (!response.ok || !payload.success || !payload.fixes) {
        setError(payload.error || "We couldn't save your fixes. Your results are still here. Please try again.");
        return;
      }
      setFixes(payload.fixes);
      setEmailStatus(payload.emailStatus ?? "failed");
      setPhase("ready");
    } catch {
      setError("We couldn't save your fixes. Your results are still here. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const emailCopy = emailStatus === "sent"
    ? `Done, ${firstName.trim()}. Your fixes are on the way. Check your inbox in the next few minutes. While you wait, your fixes are right here.`
    : emailStatus === "failed"
      ? "Your fixes are unlocked on this page, but the email didn't go out. Nothing was duplicated. You can try sending it again."
      : "Your fixes are unlocked on this page. The report email is turned off, so nothing was sent.";

  return <div className="ss-results">
    <p className="kicker">Your Systems Score</p>
    <h2 data-step-focus aria-label={`Your Systems Score: ${result.overall} out of 100. ${result.tierName}.`}>{result.overall}<span>/100</span></h2>
    <p className="ss-tier">{result.tierName}</p>
    <p className="ss-tier-copy">{result.tierDescription}</p>

    <div className="ss-bars">
      {sectionOrder.map((section) => <SectionBar section={section} key={section} score={result.sections[section].score} status={result.sections[section].status} />)}
    </div>

    <div className="ss-leaks">
      <p className="kicker">Your 3 biggest time leaks</p>
      <h3>These are the spots where your business leans on you the most right now.</h3>
      <ol>
        {result.leaks.map((leak) => <li key={leak.id}>
          {leak.kind === "tune-up" && <span>Tune-up</span>}
          <strong>{leak.name}</strong>
          <p>{leak.resultsDescription}</p>
        </li>)}
      </ol>
    </div>

    <div className="ss-estimate">
      <p>Hypothetical estimate: these leaks may be costing you about {formatHours(result.hoursLost)} a week, or roughly {formatHours(result.hoursLostMonth)} a month.</p>
      {result.clientValue !== null && result.yearlyRisk !== null && <p>And in your business, one client is worth around {formatDollars(result.clientValue)}. If these leaks cost you just one client a quarter, that&apos;s about {formatDollars(result.yearlyRisk)} a year.</p>}
      <p>This is a hypothetical estimate based on your answers, not a measured loss or a guaranteed savings. It&apos;s here to show where to look, not to be an exact number.</p>
    </div>

    <div className="ss-fixes">
      {phase !== "ready" && (
        <form onSubmit={unlockFixes}>
          <h3>Get the fixes for your 3 leaks</h3>
          <p>I&apos;ll send you 3 quick fixes, one for each of your leaks. You can do them this week with the tools you already have. No new software.</p>
          <label>
            First name
            <input name="firstName" autoComplete="given-name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="button" type="submit" disabled={saving} aria-busy={saving}>
            {saving ? "Saving…" : "Send me my fixes →"}
          </button>
          <p>Just your Systems Score and your three fixes. I won&apos;t share your email.</p>
        </form>
      )}
      {phase === "ready" && fixes && (
        <div>
          <h3>Your three fixes</h3>
          <p role="status">{emailCopy}</p>
          {error && <p role="alert">{error}</p>}
          <ol>
            {fixes.map((fix) => <li id={`fix-${fix.id}`} key={fix.id}>
              {fix.kind === "tune-up" && <span>Tune-up</span>}
              <strong>{fix.name}</strong>
              <p>{fix.title}</p>
              <ol>
                {fix.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </li>)}
          </ol>
          {emailStatus !== "sent" && (
            <button className="button" type="button" disabled={saving} onClick={() => unlockFixes()}>
              {saving ? "Sending…" : emailStatus === "failed" ? "Try sending again" : "Send my report"}
            </button>
          )}
        </div>
      )}
    </div>

    <div className="ss-call">
      <h3>Want to talk it through instead?</h3>
      <p>I&apos;ll walk through your score with you, look at what&apos;s actually going on, and tell you honestly where I&apos;d start. No pitch, no pressure.</p>
      <a className="button" href={BOOKING_URL}>Book a free 15-minute Systems Call to walk through your score <span aria-hidden="true">→</span></a>
    </div>

    <p className="ss-demos">Want to see what a connected system looks like? <a href={EXAMPLES_URL}>Explore the concept demos →</a></p>
    <button className="ss-back" type="button" onClick={onReview}>Review my answers</button>
  </div>;
}

function SectionBar({ section, score, status }: { section: SectionId; score: number; status: string }) {
  const label = sectionLabels[section];
  return <article>
    <div>
      <strong>{label}</strong>
      <span>{score}/25 · {status}</span>
    </div>
    <i role="meter" aria-label={`${label}, ${score} out of 25, ${status}`} aria-valuemin={0} aria-valuemax={25} aria-valuenow={score} aria-valuetext={`${score} out of 25, ${status}`}>
      <b style={{ width: `${(score / 25) * 100}%` }} />
    </i>
    <p>{sectionDescriptions[section]}</p>
  </article>;
}
