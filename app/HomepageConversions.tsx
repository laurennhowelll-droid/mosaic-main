"use client";

import { useEffect } from "react";
import { BOOKING_URL, EXAMPLES_URL, SYSTEMS_SCORE_URL } from "../lib/site-links";

// Event delegation keeps the homepage and its reusable sections server-rendered.
export default function HomepageConversions() {
  useEffect(() => {
    function trackClick(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const name = href === SYSTEMS_SCORE_URL ? "homepage_systems_score_clicked"
        : href === "#examples" || href.startsWith(EXAMPLES_URL) ? "homepage_examples_clicked"
        : href === BOOKING_URL ? "homepage_systems_call_clicked" : null;
      if (!name) return;
      const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
      gtag?.("event", name, { location: link.closest("section")?.id || (link.closest("header") ? "header" : link.closest("footer") ? "footer" : "navigation") });
    }
    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, []);
  return null;
}
