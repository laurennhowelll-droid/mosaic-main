import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "../components";
import { Arrow, BOOKING_URL, Invitation, SectionHeading } from "../studio";
import ClarityForm from "./ClarityForm";
import styles from "../studio.module.css";
export const metadata: Metadata = { title: "$300 Systems Audit | Mosaic", description: "Map your client journey, identify bottlenecks, and understand the system Mosaic would build. Start with a free Systems Score and Systems Call." };
export default function SystemsAuditPage() {
  return <Shell><div className={styles.studio}>
    <section className={styles.pageIntro}><p className={styles.eyebrow}>The next step after your Systems Call</p><h1>Systems Audit.<br /><em>Know what should change.</em></h1><p>For $300, I’ll map your current client journey, identify bottlenecks, manual work and disconnected tools, and recommend the system I’d build.</p><div className={styles.actions}><Link className="button" href="/systems-score">Get your free Systems Score <Arrow /></Link><Link className={styles.textLink} href={BOOKING_URL}>Book a free 20-minute Systems Call <Arrow /></Link></div></section>
    <section className={styles.section}><SectionHeading eyebrow="Understand before you build" title="A clear recommendation for your client system." /><div className={styles.twoColumns}><article className={styles.panel}><h3>What we look at</h3><ul><li>How inquiries enter the business and become clients.</li><li>Where follow-up relies on memory or manual work.</li><li>How tools, people and information connect.</li><li>What you can see from lead to revenue.</li></ul></article><article className={styles.panel}><h3>What you leave with</h3><p>A map of the current journey, the changes that matter, and a recommendation for the Mosaic Client System I would build.</p><p className={styles.smallNote}>The free Systems Call explores the friction. The paid audit determines what should change and how the system should be designed.</p></article></div></section>
    <section className={styles.libraryStrip}><div><p className={styles.eyebrow}>Investment · $300</p><h2>Your audit can count toward your build.</h2><p>If you move forward with a qualifying Mosaic build within 30 days, your $300 audit fee is credited toward the project.</p></div></section>
    <section className={styles.section} id="book"><SectionHeading eyebrow="Already talked with Lauren?" title="Share the context for your audit." copy="This is a request, not a checkout. Lauren will confirm the scope and next steps before you commit." /><ClarityForm /></section>
    <Invitation />
  </div></Shell>;
}
