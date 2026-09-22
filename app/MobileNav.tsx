"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  ["Services", "/services"],
  ["Work", "/work"],
  ["Process", "/process"],
  ["About", "/about"],
  ["Resources", "/resources"],
] as const;

const secondaryLinks = [
  ["What Mosaic Means", "/brand"],
  ["Client Portal", "/client/login"],
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab") {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
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
        ref={triggerRef}
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
        <div ref={dialogRef} className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="mobile-menu-head">
            <span>Mosaic</span>
            <button ref={closeButtonRef} type="button" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}>
              Close
            </button>
          </div>

          <nav className="mobile-menu-links" aria-label="Mobile primary">
            {navLinks.map(([label, href]) => (
              <Link
                aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}
                href={href}
                key={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link className="button mobile-menu-cta" href="https://calendar.app.google/JxAn6pJFxwyu1FJq6" onClick={() => setOpen(false)}>
            Explore What We Could Build <b>↗</b>
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
