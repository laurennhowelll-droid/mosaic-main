import Image from "next/image";
import Link from "next/link";
import ActiveNav from "./ActiveNav";
import ClarityCheckPrompt from "./ClarityCheckPrompt";
import MobileNav from "./MobileNav";
import PublicMotion from "./PublicMotion";

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
          Book a FREE Clarity Call <b>↗</b>
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}

export function Footer() { return <footer><div><Link className="brand" href="/"><Mark /></Link><p>Business Systems Studio</p><p>Clear up the mess. Connect the pieces. Grow with confidence.</p></div><div className="footer-links"><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/process">How It Works</Link><Link href="/work">Work</Link><Link href="/about">About</Link><Link href="/playbook">Playbook</Link><Link href="/client/login">Client Portal</Link></div><div className="footer-links"><a href="mailto:lauren@buildwithmosaic.co">Email</a><a href="https://www.instagram.com/buildwithmosaic">Instagram</a></div><p>© 2026 Mosaic Studio LLC<br/>Business systems for growing service businesses.</p></footer>; }

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <ClarityCheckPrompt />
      <Footer />
      <PublicMotion />
    </>
  );
}

export const services = [
  ["01", "Advisory", "Find the right order of operations.", "/services/inquire/clarity"],
  ["02", "CRM & Systems", "Connect the operating layer behind the business.", "/services/inquire/systems"],
  ["03", "Websites & Customer Experience", "Improve the path from interest to inquiry.", "/services/inquire/website"],
  ["04", "Marketing & Growth", "Build demand on top of a stronger journey.", "/services/inquire/generate"],
];
