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
          Book a Discovery Call <b>↗</b>
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}

export function Footer() { return <footer><div><Link className="brand" href="/"><Mark /></Link><p>Business Systems Studio</p><p>Businesses that work beautifully.</p></div><div className="footer-links"><Link href="/services">Services</Link><Link href="/work">Work</Link><Link href="/process">Process</Link><Link href="/about">About</Link><Link href="/client/login">Client Portal</Link></div><div className="footer-links"><a href="mailto:lauren@buildwithmosaic.co">Email</a><a href="https://www.instagram.com/buildwithmosaic">Instagram</a></div><p>© 2026 Mosaic Studio LLC<br/>Making messy businesses make sense.</p></footer>; }

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
  ["01", "Vision", "Rediscover where you’re going.", "https://buildwithmosaic.co/services/vision"], ["02", "Experience", "Bring your vision to life.", "https://buildwithmosaic.co/services/experience"], ["03", "Connect", "Make your business work beautifully.", "https://buildwithmosaic.co/services/connect"], ["04", "Grow", "Keep moving forward.", "https://buildwithmosaic.co/services/grow"],
];
