import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "../components";
import { resources } from "./resources";

export const metadata: Metadata = {
  title: "Resources | Mosaic",
  description:
    "A Mosaic resource library with practical audits and checklists for spotting business friction, systems gaps, and website clarity issues.",
};

export default function FreeResourcesPage() {
  return (
    <Shell>
      <section className="free-hero">
        <p className="kicker">Resources</p>
        <h1>A few things to make your business make more sense.</h1>
        <p className="free-hero-copy">
          Practical audits and checklists to help you spot the friction, find the gaps, and figure
          out what to fix first.
        </p>
        <p className="free-hero-note">A growing library of useful things you can actually use.</p>
      </section>

      <section className="free-library" aria-label="Resource library">
        {resources.map((resource, index) => (
          <Link className="free-card" href={`/resources/${resource.slug}`} key={resource.slug}>
            <article>
              <div className="free-card-head">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{resource.estimatedTime}</span>
              </div>
              <p className="kicker">{resource.eyebrow}</p>
              <h2>{resource.title}</h2>
              <p className="free-card-description">{resource.shortDescription}</p>
              <p className="free-card-support">{resource.librarySupportingCopy}</p>
              <div className="free-card-foot">
                <span className="free-card-cta">View Resource</span>
                <b>↗</b>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </Shell>
  );
}
