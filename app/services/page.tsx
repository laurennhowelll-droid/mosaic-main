import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "../components";
import { Arrow, EXAMPLES_URL, Invitation, SectionHeading } from "../studio";
import styles from "../studio.module.css";

export const metadata: Metadata = {
  title: "Client System Capabilities | Mosaic",
  description: "Explore the CRM, follow-up, booking, payments, dashboards and integrations that can make up a Mosaic Client System.",
};
const capabilities = [
  ["CRM + lead management", "Give every inquiry a place and every relationship context.", ["Lead capture", "CRM", "Pipelines", "Lead source tracking"]],
  ["Automation + follow-up", "Keep the next step moving without relying on memory.", ["Automated responses", "Lead nurture", "Internal automation", "Email/SMS", "Team handoffs"]],
  ["Booking + client experience", "Make the path from first interest to working together easier.", ["Booking flows", "Forms", "Client portals", "Onboarding", "Websites and landing pages where relevant"]],
  ["Payments + operations", "Connect the agreement, the work, and the payment.", ["Estimates", "Proposals", "Contracts", "Invoices", "Payment-triggered workflows"]],
  ["Dashboards + reporting", "See what is happening without rebuilding the report every week.", ["Conversion reporting", "Revenue visibility", "Operational KPIs", "Custom dashboards"]],
  ["Marketing attribution + retention", "Connect the first click to the client relationship that follows.", ["Lead source tracking", "Campaign attribution", "Email/SMS retention", "Marketing integrations"]],
] as const;

export default function ServicesPage() {
  return <Shell><div className={styles.studio}>
    <section className={styles.pageIntro}><p className={styles.eyebrow}>The Mosaic Client System · Capabilities</p><h1>What can a Mosaic Client System include?</h1><p>One connected client journey, built around your business. These are the pieces we can connect — you don’t need to choose a package or diagnose the right tool.</p><div className={styles.actions}><Link className="button" href="/systems-score">Get your Systems Score <Arrow /></Link><Link className={styles.textLink} href={EXAMPLES_URL}>See examples <Arrow /></Link></div></section>
    <section className={styles.section} id="capabilities"><SectionHeading eyebrow="The pieces, working together" title="Different capabilities. One client system." copy="The right mix depends on how inquiries become clients in your business, where work gets repeated, and what your team needs to see." /><div className={styles.offeringGrid}>{capabilities.map(([title,copy,items],index)=><article className={styles.offering} key={title}><div className={styles.cardTop}><span>0{index+1}</span></div><h2>{title}</h2><p>{copy}</p><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div><p className={styles.capabilityNote}>The exact tools aren’t the product. The connected client journey is.</p></section>
    <section className={styles.section}><SectionHeading eyebrow="Start with the problem" title="Keep what works. Connect what matters." /><div className={styles.faq}>
      <details><summary>Do I need to replace all my software?</summary><p>No. We start with what already works and look at where information or follow-up gets lost. Your existing tools may be part of the system.</p></details>
      <details><summary>How do we decide what to build?</summary><p>Start with the free Systems Score, then a free 20-minute Systems Call. If a deeper review makes sense, the $300 Systems Audit maps your current client journey and recommends what should change before a build is scoped.</p></details>
      <details><summary>What happens to the audit fee?</summary><p>If you move forward with a qualifying Mosaic build within 30 days, your $300 audit fee is credited toward the project.</p></details>
      <details><summary>Where do websites and marketing fit?</summary><p>A website helps capture the right inquiry. Marketing brings people into that journey. Follow-up, booking, payment and reporting connect what happens next. We look at them together.</p><Link className={styles.textLink} href="/services/inquire/website">Website and booking capabilities <Arrow /></Link><br /><Link className={styles.textLink} href="/services/inquire/generate">Marketing attribution capabilities <Arrow /></Link></details>
      <details><summary>Can I read more about CRM work or systems planning?</summary><p>Yes. These supporting pages explain individual parts of a Mosaic Client System.</p><Link className={styles.textLink} href="/services/inquire/systems">CRM and systems capabilities <Arrow /></Link><br /><Link className={styles.textLink} href="/services/inquire/clarity">Systems planning and advisory <Arrow /></Link></details>
    </div></section>
    <Invitation />
  </div></Shell>;
}
