import Link from "next/link";

export function Mark({ small = false }: { small?: boolean }) {
  return <img className={`mark ${small ? "mark-small" : ""}`} src="/brand-reference/main-icon.svg" alt="Mosaic icon" />;
}

export function Logo() { return <img className="logo" src="/brand-reference/main-logo.svg" alt="Mosaic — Businesses That Work Beautifully" />; }

export function Header() {
  return <header className="site-header"><Link className="brand" href="/"><Logo /></Link><nav aria-label="Primary"><Link href="/">Home</Link><Link href="/services">How We Help</Link><Link href="/process">Our Process</Link><Link href="/work">Work</Link><Link href="/playbook">Playbook</Link><Link href="/about">About</Link></nav><Link className="header-cta" href="/start">Start With Vision <b>↗</b></Link></header>;
}

export function Footer() { return <footer><div><Link className="brand" href="/"><Logo /></Link><p>Business Systems Studio</p></div><div className="footer-links"><Link href="/services">How We Help</Link><Link href="/process">The Mosaic Method</Link><Link href="/playbook">Playbook</Link><Link href="/portal">Client Portal</Link></div><p>© {new Date().getFullYear()} Mosaic<br/>Businesses that work beautifully.</p></footer>; }

export function Shell({ children }: { children: React.ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }

export const services = [
  ["01", "Vision", "Rediscover where you’re going.", "/services/vision"], ["02", "Experience", "Bring your vision to life.", "/services/experience"], ["03", "Connect", "Make your business work beautifully.", "/services/connect"], ["04", "Grow", "Keep moving forward.", "/services/grow"],
];
