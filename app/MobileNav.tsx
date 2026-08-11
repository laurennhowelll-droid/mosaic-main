"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  ["Home", "/"],
  ["How We Help", "/services"],
  ["Our Process", "/process"],
  ["Work", "/work"],
  ["Playbook", "/playbook"],
  ["About", "/about"],
];

const secondaryLinks = [
  ["What Mosaic Means", "/brand"],
  ["Client Portal", "/portal"],
  ["Admin Sign In", "/admin/login"],
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="mobile-nav">
      <button
        className="mobile-menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <span>Menu</span>
        <i aria-hidden="true" />
      </button>

      {open && (
        <div className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="mobile-menu-head">
            <span>Mosaic</span>
            <button ref={closeButtonRef} type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <nav className="mobile-menu-links" aria-label="Mobile primary">
            {navLinks.map(([label, href]) => (
              <Link href={href} key={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>

          <Link className="button mobile-menu-cta" href="/start" onClick={() => setOpen(false)}>
            Start With Vision <b>↗</b>
          </Link>

          <div className="mobile-menu-secondary">
            {secondaryLinks.map(([label, href]) => (
              <Link href={href} key={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
