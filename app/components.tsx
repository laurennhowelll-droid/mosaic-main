import Link from "next/link";

export function Mark({ small = false }: { small?: boolean }) {
  return <span className={`mark ${small ? "mark-small" : ""}`} aria-label="Mosaic">
    <i className="tile star">✦</i><i className="tile lines"/><i className="tile waves">〰</i><i className="tile plaster"/>
  </span>;
}

export function Header() {
  return <header className="site-header"><Link className="brand" href="/"><Mark small /><span>MOSAIC</span></Link><nav aria-label="Primary"><Link href="/services">How We Help</Link><Link href="/process">Our Process</Link><Link href="/work">Work</Link><Link href="/about">About</Link><Link href="/playbook">Playbook</Link></nav><Link className="header-cta" href="/start">Start With Vision <b>↗</b></Link></header>;
}

export function Footer() { return <footer><div><Link className="brand" href="/"><Mark small /><span>MOSAIC</span></Link><p>Business Systems Studio</p></div><div className="footer-links"><Link href="/services">How We Help</Link><Link href="/process">The Mosaic Method</Link><Link href="/playbook">Playbook</Link><Link href="/portal">Client Portal</Link></div><p>© {new Date().getFullYear()} Mosaic<br/>Businesses that work beautifully.</p></footer>; }

export function Shell({ children }: { children: React.ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }

export const services = [
  ["01", "Vision", "Rediscover where you’re going.", "/services/vision"], ["02", "Experience", "Bring your vision to life.", "/services/experience"], ["03", "Connect", "Make your business work beautifully.", "/services/connect"], ["04", "Grow", "Keep moving forward.", "/services/grow"],
];
