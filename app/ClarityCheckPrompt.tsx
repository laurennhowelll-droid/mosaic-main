"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const excludedPaths = ["/admin", "/start", "/clarity", "/clarity-check"];

function hiddenUntil(key: string) {
  const value = localStorage.getItem(key);
  return value ? Number(value) : 0;
}

export default function ClarityCheckPrompt() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (excludedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      return;
    }

    if (sessionStorage.getItem("mosaic_clarity_dismissed") === "true") {
      return;
    }

    if (
      hiddenUntil("mosaic_clarity_dismissed_until") > Date.now() ||
      hiddenUntil("mosaic_clarity_completed_until") > Date.now()
    ) {
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  function dismiss() {
    sessionStorage.setItem("mosaic_clarity_dismissed", "true");
    localStorage.setItem("mosaic_clarity_dismissed_until", String(Date.now() + 3 * 24 * 60 * 60 * 1000));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="clarity-prompt" aria-label="Business Clarity Check">
      <button type="button" onClick={dismiss} aria-label="Dismiss Clarity Check prompt">
        ×
      </button>
      <h2>Where is your business getting disconnected?</h2>
      <p>Answer 10 quick questions to see where clarity could create the most momentum.</p>
          <Link href="/clarity-check" onClick={dismiss}>
            Take the 2-Minute Clarity Check →
          </Link>
    </aside>
  );
}
