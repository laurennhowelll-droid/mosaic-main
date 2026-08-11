"use client";

import { useEffect } from "react";

const selector = [
  ".services-card",
  ".services-phase",
  ".process-method-block",
  ".process-timeline-step",
  ".home-philosophy-card",
  ".home-work-metrics div",
  ".work-card",
  ".case-chapters article",
  ".case-metrics div",
  ".case-comparison-row",
  ".brand-tile-story article",
  ".brand-color-grid article",
  ".playbook-principle-card",
  ".playbook-framework-card",
  ".playbook-guide-card",
  ".about-belief-list article",
  ".about-thinking-grid article",
].join(",");

export default function PublicMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>(selector));
    items.forEach((item) => item.classList.add("reveal-item"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return null;
}
