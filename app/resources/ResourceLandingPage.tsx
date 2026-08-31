import Link from "next/link";
import ResourceDownloadGate from "./ResourceDownloadGate";
import type { Resource } from "./resources";

const clarityCheckHref = "/clarity-check";

export default function ResourceLandingPage({ resource }: { resource: Resource }) {
  return (
    <>
      <section className="free-resource-hero">
        <div>
          <p className="kicker">{resource.eyebrow}</p>
          <h1>{resource.title}</h1>
          <p className="free-resource-subtitle">{resource.shortDescription}</p>
          <p className="free-resource-intro">{resource.longDescription}</p>
          <div className="actions">
            <a className="button" href="#download">
              {resource.ctaLabel} <b>↓</b>
            </a>
            {resource.secondaryCta && (
              <Link className="text-link" href={resource.secondaryCta.href}>
                {resource.secondaryCta.label} →
              </Link>
            )}
          </div>
        </div>
        <aside className="free-resource-meta" aria-label="Resource details">
          <span>Estimated Time</span>
          <strong>{resource.estimatedTime}</strong>
          <span>Category</span>
          <strong>{resource.category}</strong>
        </aside>
      </section>

      <section className="resource-download-section" id="download">
        <ResourceDownloadGate resource={resource} />
      </section>

      <section className="free-resource-focus">
        <div>
          <p className="kicker">{resource.focusLabel}</p>
          <h2>Start with what you can see.</h2>
        </div>
        <div>
          <ul>
            {resource.focusItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {resource.callout && (
            <aside className="free-resource-callout">
              {resource.callout.eyebrow && <p className="kicker">{resource.callout.eyebrow}</p>}
              {resource.callout.title && <h3>{resource.callout.title}</h3>}
              {resource.callout.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </aside>
          )}
        </div>
      </section>

      <section className="free-resource-context">
        <p className="kicker">A Mosaic Note</p>
        <h2>Useful first. Beautiful because it works.</h2>
        <p>
          Mosaic helps business owners reconnect their vision, customer experience, operations,
          systems, and growth decisions so the whole business becomes easier to understand and
          easier to move.
        </p>
      </section>

      <section className="free-resource-clarity">
        <p className="kicker">Want the bigger picture?</p>
        <h2>This is only one piece.</h2>
        <p>
          The free Mosaic Clarity Check looks across your vision, customer experience, systems,
          operations, and growth to help you see where the pieces may not be connecting.
        </p>
        <Link className="button" href={clarityCheckHref}>
          Take the Free Clarity Check <b>↗</b>
        </Link>
        <small>Businesses that work beautifully.</small>
      </section>
    </>
  );
}
