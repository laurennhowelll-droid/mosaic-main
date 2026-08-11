import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";

export function Mark({ small = false }: { small?: boolean }) {
  return <Image className={`mark ${small ? "mark-small" : ""}`} src="/brand-reference/main-icon.svg" alt="Mosaic icon" width={210} height={210} />;
}

export function Logo() { return <Image className="logo" src="/brand-reference/main-logo.svg" alt="Mosaic — Businesses That Work Beautifully" width={172} height={172} priority unoptimized />; }

export function Header() {
  return <header className="site-header"><Link className="brand" href="/"><Logo /></Link><nav aria-label="Primary"><Link href="/">Home</Link><Link href="/services">How We Help</Link><Link href="/process">Our Process</Link><Link href="/work">Work</Link><Link href="/playbook">Playbook</Link><Link href="/about">About</Link></nav><Link className="header-cta" href="/start">Start With Vision <b>↗</b></Link><MobileNav /></header>;
}

export function Footer() { return <footer><div><Link className="brand" href="/"><Mark /></Link><p>Business Systems Studio</p><Link className="footer-admin-link" href="/admin/login">Admin Sign In →</Link></div><div className="footer-links"><Link href="/services">How We Help</Link><Link href="/process">The Mosaic Method</Link><Link href="/playbook">Playbook</Link><Link href="/portal">Client Portal</Link></div><p>© 2026 Mosaic Studio LLC<br/>Businesses that work beautifully.</p></footer>; }

export function Shell({ children }: { children: React.ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }

export const services = [
  ["01", "Vision", "Rediscover where you’re going.", "https://buildwithmosaic.co/services/vision"], ["02", "Experience", "Bring your vision to life.", "https://buildwithmosaic.co/services/experience"], ["03", "Connect", "Make your business work beautifully.", "https://buildwithmosaic.co/services/connect"], ["04", "Grow", "Keep moving forward.", "https://buildwithmosaic.co/services/grow"],
];
