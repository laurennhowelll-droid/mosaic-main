import Link from "next/link";
import { Shell } from "../../components";
import { categoryLabel, type ClarityCategory } from "../../../lib/clarity-check";
import { getAdminClarityAssessments, type ClarityAssessment } from "../../../lib/supabase/admin";

const bandFilters = ["Connected", "Growing Friction", "Disconnected", "Reactive"] as const;
const serviceFilters = ["Clarity Session", "Vision", "Experience", "Connect", "Grow"] as const;
const gapFilters = ["Vision", "Experience", "Systems", "Operations", "Growth"] as const;

function date(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function statusLabel(value: string) {
  if (value === "follow_up_needed") return "Follow Up Needed";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalize(value: string) {
  return value.toLowerCase().replaceAll(" ", "_");
}

function primaryGapCategory(assessment: ClarityAssessment) {
  return assessment.weakest_category;
}

function mostCommon(values: string[]) {
  if (!values.length) return "None yet";
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export default async function AdminClarityPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; service?: string; gap?: string; sort?: string }>;
}) {
  const [{ filter = "all", service = "all", gap = "all", sort = "newest" }, assessments] = await Promise.all([
    searchParams,
    getAdminClarityAssessments(),
  ]);

  const filtered = assessments
    .filter((assessment) => filter === "all" || normalize(assessment.result_band) === filter)
    .filter((assessment) => service === "all" || normalize(assessment.recommended_service) === service)
    .filter((assessment) => gap === "all" || assessment.weakest_category === gap)
    .sort((a, b) => {
      if (sort === "lowest") return a.total_score - b.total_score;
      if (sort === "highest") return b.total_score - a.total_score;
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return sort === "oldest" ? aTime - bTime : bTime - aTime;
    });

  const averageScore = assessments.length
    ? Math.round(assessments.reduce((sum, assessment) => sum + assessment.total_score, 0) / assessments.length)
    : 0;
  const metrics = [
    ["Total Assessments", assessments.length.toString()],
    ["Average Clarity Score", assessments.length ? `${averageScore} / 50` : "None yet"],
    ["New / Unreviewed", assessments.filter((assessment) => assessment.review_status === "unreviewed").length.toString()],
    ["Most Common Primary Gap", mostCommon(assessments.map((assessment) => assessment.primary_gap))],
    ["Most Common Recommended Service", mostCommon(assessments.map((assessment) => assessment.recommended_service))],
  ];

  return (
    <Shell>
      <section className="admin-page admin-clarity-page">
        <div className="admin-head">
          <div>
            <p className="kicker">Mosaic Admin</p>
            <h1>Clarity Checks.</h1>
          </div>
          <Link className="text-link" href="/admin">Back to Leads →</Link>
        </div>

        <div className="admin-metrics">
          {metrics.map(([label, value]) => (
            <article key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>

        <div className="admin-controls admin-clarity-controls">
          <div>
            <Link className={filter === "all" ? "active" : ""} href={`/admin/clarity?filter=all&service=${service}&gap=${gap}&sort=${sort}`}>All</Link>
            {bandFilters.map((band) => (
              <Link className={filter === normalize(band) ? "active" : ""} href={`/admin/clarity?filter=${normalize(band)}&service=${service}&gap=${gap}&sort=${sort}`} key={band}>
                {band}
              </Link>
            ))}
          </div>
          <div>
            <Link className={service === "all" ? "active" : ""} href={`/admin/clarity?filter=${filter}&service=all&gap=${gap}&sort=${sort}`}>All Services</Link>
            {serviceFilters.map((item) => (
              <Link className={service === normalize(item) ? "active" : ""} href={`/admin/clarity?filter=${filter}&service=${normalize(item)}&gap=${gap}&sort=${sort}`} key={item}>
                {item}
              </Link>
            ))}
          </div>
          <div>
            <Link className={gap === "all" ? "active" : ""} href={`/admin/clarity?filter=${filter}&service=${service}&gap=all&sort=${sort}`}>All Gaps</Link>
            {gapFilters.map((item) => (
              <Link className={gap === item.toLowerCase() ? "active" : ""} href={`/admin/clarity?filter=${filter}&service=${service}&gap=${item.toLowerCase()}&sort=${sort}`} key={item}>
                {item}
              </Link>
            ))}
          </div>
          <div>
            {["newest", "oldest", "lowest", "highest"].map((item) => (
              <Link className={sort === item ? "active" : ""} href={`/admin/clarity?filter=${filter}&service=${service}&gap=${gap}&sort=${item}`} key={item}>
                {item === "lowest" ? "Lowest Score" : item === "highest" ? "Highest Score" : item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-table admin-clarity-table" role="table" aria-label="Clarity Check responses">
          <div className="admin-table-head" role="row">
            <span>Name</span>
            <span>Company</span>
            <span>Email</span>
            <span>Score</span>
            <span>Result Band</span>
            <span>Strongest Area</span>
            <span>Primary Gap</span>
            <span>Recommended Service</span>
            <span>Submitted</span>
            <span>Status</span>
            <span>Open</span>
          </div>
          {filtered.map((assessment) => (
            <div className="admin-table-row" role="row" key={assessment.id}>
              <span data-label="Name">{assessment.first_name}</span>
              <span data-label="Company">{assessment.company_name ?? "Not provided"}</span>
              <span data-label="Email">{assessment.email}</span>
              <span data-label="Score">{assessment.total_score} / 50</span>
              <span data-label="Result Band">{assessment.result_band}</span>
              <span data-label="Strongest Area">{categoryLabel(assessment.strongest_category as ClarityCategory)}</span>
              <span data-label="Primary Gap">{categoryLabel(primaryGapCategory(assessment) as ClarityCategory)}</span>
              <span data-label="Recommended Service">{assessment.recommended_service}</span>
              <span data-label="Submitted">{date(assessment.created_at)}</span>
              <span data-label="Status">{statusLabel(assessment.review_status)}</span>
              <Link href={`/admin/clarity/${assessment.id}`}>Open →</Link>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
