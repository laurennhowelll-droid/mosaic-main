import Image from "next/image";
import Link from "next/link";
import ActiveNav from "./ActiveNav";
import MobileNav from "./MobileNav";

export function Mark({ small = false }: { small?: boolean }) {
  return <Image className={`mark ${small ? "mark-small" : ""}`} src="/brand-reference/main-icon.svg" alt="Mosaic icon" width={210} height={210} />;
}

export function Logo() {
  return <span className="header-logo-lockup"><Image className="header-logo-icon" src="/brand-reference/main-icon.svg" alt="" width={44} height={44} priority unoptimized /><span className="header-logo-wordmark">Mosaic</span></span>;
}

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" href="/" aria-label="Mosaic home">
          <Logo />
          <span className="mobile-wordmark">Mosaic</span>
        </Link>
        <ActiveNav />
        <Link className="header-cta" href="https://calendar.app.google/JxAn6pJFxwyu1FJq6">
          Explore What We Could Build <b>↗</b>
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}

export function Footer() {
  return <footer className="mosaic-footer">
    <div className="mosaic-footer-main"><div><Link className="brand" href="/" aria-label="Mosaic home"><Logo /></Link><p>Thoughtful systems.<br />More room for what matters.</p></div>
    <div className="mosaic-footer-links"><Link href="/services">Services</Link><Link href="/work">Work</Link><Link href="/process">Process</Link><Link href="/about">About</Link></div>
    <div className="mosaic-footer-links"><Link href="/resources">Resources</Link><Link href="/playbook">Playbook</Link><Link href="/brand">The Mosaic identity</Link><Link href="/client/login">Client portal</Link></div>
    <div className="mosaic-footer-links"><a href="mailto:lauren@buildwithmosaic.co">Say hello ↗</a><a href="https://www.instagram.com/buildwithmosaic">Instagram ↗</a><a href="https://examples.buildwithmosaic.co/examples">Explore examples ↗</a></div></div>
    <div className="mosaic-footer-bottom"><span>© 2026 Mosaic Studio LLC</span><span>Business systems, thoughtfully connected.</span></div>
  </footer>;
}

export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mosaic-site"><a className="mosaic-skip" href="#main-content">Skip to content</a><Header /><main id="main-content" tabIndex={-1}>{children}</main><Footer /></div>;
}

export const services = [
  ["01", "Advisory", "Find the right order of operations.", "/services/inquire/clarity"],
  ["02", "CRM & Systems", "Connect the operating layer behind the business.", "/services/inquire/systems"],
  ["03", "Websites & Customer Experience", "Improve the path from interest to inquiry.", "/services/inquire/website"],
  ["04", "Marketing & Growth", "Build demand on top of a stronger journey.", "/services/inquire/generate"],
];
