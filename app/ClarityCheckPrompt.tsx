"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const excludedPaths = ["/admin", "/start", "/clarity", "/clarity-check", "/systems-score"];

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

    function showAfterHero() {
      const hero = document.querySelector(".hero");
      const heroBottom = hero instanceof HTMLElement ? hero.offsetTop + hero.offsetHeight : window.innerHeight;

      if (window.scrollY > heroBottom - 80) {
        setVisible(true);
        window.removeEventListener("scroll", showAfterHero);
      }
    }

    showAfterHero();
    window.addEventListener("scroll", showAfterHero, { passive: true });

    return () => window.removeEventListener("scroll", showAfterHero);
  }, [pathname]);

  function dismiss() {
    sessionStorage.setItem("mosaic_clarity_dismissed", "true");
    localStorage.setItem("mosaic_clarity_dismissed_until", String(Date.now() + 3 * 24 * 60 * 60 * 1000));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="clarity-prompt" aria-label="Business Systems Score">
      <button type="button" onClick={dismiss} aria-label="Dismiss Systems Score prompt">
        ×
      </button>
      <h2>Where is your business getting disconnected?</h2>
      <p>12 questions. About 3 minutes. See how connected your client journey really is.</p>
          <Link href="/systems-score" onClick={dismiss}>
            Take the 3-minute Systems Score →
          </Link>
    </aside>
  );
}
