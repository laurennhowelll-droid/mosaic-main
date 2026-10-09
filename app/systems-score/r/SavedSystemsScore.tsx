"use client";

import { useEffect, useState } from "react";
import { EXAMPLES_URL, SYSTEMS_SCORE_URL } from "../../../lib/site-links";
import { formatDollars, formatHours, sectionLabels, sectionOrder, type SectionId } from "../../../lib/systems-score-v2";

type SavedFix = { id: string; name: string; kind: "leak" | "tune-up"; title: string; steps: string[] };
type SavedResult = {
  overall: number;
  tierName: string;
  tierDescription: string;
  sections: Record<SectionId, { score: number; status: string }>;
  leaks: Array<{ id: string; name: string; kind: "leak" | "tune-up"; resultsDescription: string }>;
  hoursLost: number;
  hoursLostMonth: number;
  clientValue: number | null;
  yearlyRisk: number | null;
};

function readHash() {
  const raw = window.location.hash.replace(/^#/, "").trim();
  const [token, leakId] = raw.split("/");
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  return { token, leakId: leakId || null };
}

export default function SavedSystemsScore() {
  const [state, setState] = useState<"loading" | "missing" | "ready">("loading");
  const [firstName, setFirstName] = useState("");
  const [result, setResult] = useState<SavedResult | null>(null);
  const [fixes, setFixes] = useState<SavedFix[]>([]);
  const [leakId, setLeakId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const parsed = readHash();
    if (!parsed) {
      queueMicrotask(() => {
        if (!cancelled) setState("missing");
      });
      return () => {
        cancelled = true;
      };
    }

    fetch("/api/systems-score/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: parsed.token }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("inactive");
        return response.json() as Promise<{ success?: boolean; firstName?: string; result?: SavedResult; fixes?: SavedFix[] }>;
      })
      .then((payload) => {
        if (cancelled || !payload.success || !payload.result || !payload.fixes) {
          if (!cancelled) setState("missing");
          return;
        }
        setLeakId(parsed.leakId);
        setFirstName(payload.firstName ?? "");
        setResult(payload.result);
        setFixes(payload.fixes);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("missing");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state !== "ready" || !leakId) return;
    document.getElementById(`fix-${leakId}`)?.scrollIntoView({ block: "start" });
  }, [state, leakId]);

  if (state === "loading") {
    return <section className="ss-saved"><h1>Opening your saved results…</h1></section>;
  }

  if (state === "missing" || !result) {
    return <section className="ss-saved">
      <h1>This link isn&apos;t active.</h1>
      <p>You can take the Systems Score again whenever you want a fresh look.</p>
      <a className="button" href={SYSTEMS_SCORE_URL}>Take the Systems Score <span aria-hidden="true">→</span></a>
    </section>;
  }

  return <section className="ss-saved ss-results">
    <p className="kicker">Saved Systems Score</p>
    <h1>{firstName ? `${firstName}, your score is ` : "Your score is "}{result.overall}<span>/100</span></h1>
    <p className="ss-tier">{result.tierName}</p>
    <p>{result.tierDescription}</p>
    <div className="ss-bars">
      {sectionOrder.map((section) => <article key={section}>
        <div><strong>{sectionLabels[section]}</strong><span>{result.sections[section].score}/25 · {result.sections[section].status}</span></div>
      </article>)}
    </div>
    <div className="ss-estimate">
      <p>Hypothetical estimate: these leaks may be costing you about {formatHours(result.hoursLost)} a week, or roughly {formatHours(result.hoursLostMonth)} a month.</p>
      {result.clientValue !== null && result.yearlyRisk !== null && <p>And in your business, one client is worth around {formatDollars(result.clientValue)}. If these leaks cost you just one client a quarter, that&apos;s about {formatDollars(result.yearlyRisk)} a year.</p>}
    </div>
    <div className="ss-fixes">
      <h2>Your three fixes</h2>
      <ol>
        {fixes.map((fix) => <li id={`fix-${fix.id}`} key={fix.id}>
          {fix.kind === "tune-up" && <span>Tune-up</span>}
          <strong>{fix.name}</strong>
          <p>{fix.title}</p>
          <ol>{fix.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </li>)}
      </ol>
    </div>
    <p className="ss-demos">Want to see what a connected system looks like? <a href={EXAMPLES_URL}>Explore the concept demos →</a></p>
  </section>;
}
