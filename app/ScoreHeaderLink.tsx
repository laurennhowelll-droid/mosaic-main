"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ScoreHeaderLink({ className, onNavigate }: { className: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const onQuiz = pathname === "/systems-score";

  return <Link
    className={className}
    href={onQuiz ? "#systems-assessment" : "/systems-score"}
    onClick={(event) => {
      onNavigate?.();
      if (!onQuiz) return;
      const target = document.getElementById("systems-assessment");
      if (!target) return;
      event.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" });
      const focusTarget = target.querySelector<HTMLElement>("[data-step-focus]") ?? target;
      if (focusTarget !== target) focusTarget.tabIndex = -1;
      focusTarget.focus({ preventScroll: true });
    }}
  >
    Get your score <b aria-hidden="true">{onQuiz ? "↓" : "↗"}</b>
  </Link>;
}
