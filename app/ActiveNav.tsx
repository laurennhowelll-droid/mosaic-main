"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  ["Home", "/"],
  ["Services", "/services"],
  ["How It Works", "/process"],
  ["Work", "/work"],
  ["About", "/about"],
  ["Playbook", "/playbook"],
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function toneFor(href: string) {
  if (href === "/services") return "olive";
  if (href === "/process") return "slate";
  if (href === "/work") return "terra";
  if (href === "/playbook") return "slate";
  if (href === "/about") return "olive";
  return "neutral";
}

export default function ActiveNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      {navLinks.map(([label, href]) => (
        <Link
          aria-current={isActive(pathname, href) ? "page" : undefined}
          className={`nav-link nav-${toneFor(href)}`}
          href={href}
          key={href}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
