import Link from "next/link";
import { Shell } from "../components";
import { getAdminClarityAssessments, getAdminLeads, getPlanLabel, getStageLabel, type Lead } from "../../lib/supabase/admin";
import { signOutAdmin } from "./actions";

const filters = [
  ["all", "All"],
  ["new", "New"],
  ["scheduling", "Scheduling"],
  ["working", "Working on Plan"],
  ["proposal", "Proposal Sent"],
  ["active", "Active"],
  ["retainers", "Retainers"],
  ["ghosted", "Ghosted"],
  ["lost", "Lost"],
] as const;

const openExcludedStages = new Set(["ghosted", "not_a_fit", "lost", "closed"]);
const activeStages = new Set(["project_active", "retainer_active"]);

function currency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function date(value: string | null | undefined) {
  if (!value) return "Not updated";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function stage(lead: Lead) {
  return lead.pipeline_stage ?? "new_inquiry";
}

function leadType(source: string | null | undefined) {
  if (source === "clarity_session") return "Clarity Session";
  if (source === "website_start_with_vision" || source === "start_with_vision") return "Vision";
  return source ?? "Lead";
}

function matchesFilter(lead: Lead, filter: string) {
  const current = stage(lead);

  if (filter === "all") return true;
  if (filter === "new") return current === "new_inquiry";
  if (filter === "scheduling") return current === "scheduling_first_call" || current === "first_call_scheduled";
  if (filter === "working") return current === "working_on_plan" || current === "first_call_complete";
  if (filter === "proposal") return current === "proposal_sent" || current === "waiting_on_client";
  if (filter === "active") return current === "project_active";
  if (filter === "retainers") return current === "retainer_active";
  if (filter === "ghosted") return current === "ghosted";
  if (filter === "lost") return current === "lost";

  return true;
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const [{ filter = "all", sort = "newest" }, leads] = await Promise.all([
    searchParams,
    getAdminLeads(),
  ]);
  const assessments = await getAdminClarityAssessments();
  const recentAssessments = assessments.slice(0, 5);

  const filteredLeads = leads
    .filter((lead) => matchesFilter(lead, filter))
    .sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return sort === "oldest" ? aTime - bTime : bTime - aTime;
    });

  const openLeads = leads.filter((lead) => !openExcludedStages.has(stage(lead)));
  const metrics = [
    ["Total Open Leads", openLeads.length.toString()],
    ["New Inquiries", leads.filter((lead) => stage(lead) === "new_inquiry").length.toString()],
    ["Active Opportunities", leads.filter((lead) => !openExcludedStages.has(stage(lead)) && !activeStages.has(stage(lead))).length.toString()],
    ["Projected Revenue", currency(openLeads.reduce((sum, lead) => sum + Number(lead.projected_revenue ?? 0), 0))],
    ["New Clarity Checks", assessments.filter((assessment) => assessment.review_status === "unreviewed").length.toString()],
    ["Active Projects", leads.filter((lead) => stage(lead) === "project_active").length.toString()],
    ["Active Retainers", leads.filter((lead) => stage(lead) === "retainer_active").length.toString()],
  ];

  return (
    <Shell>
      <section className="admin-page">
        <div className="admin-head">
          <div>
            <p className="kicker">Mosaic Admin</p>
            <h1>Lead dashboard.</h1>
          </div>
          <form action={signOutAdmin}>
            <button className="text-link" type="submit">Sign out</button>
          </form>
        </div>
        <div className="admin-top-nav">
          <Link href="/admin/outreach">Outreach →</Link>
          <Link href="/admin/work">Work →</Link>
          <Link href="/admin/growth">Growth Dashboard →</Link>
          <Link href="/admin/clarity">Clarity Checks →</Link>
        </div>

        <div className="admin-metrics">
          {metrics.map(([label, value]) => (
            <article key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>

        <section className="admin-clarity-preview">
          <div>
            <p className="kicker">Clarity Checks</p>
            <h2>Recent Clarity Checks</h2>
          </div>
          <div className="admin-clarity-preview-list">
            {recentAssessments.map((assessment) => (
              <Link href={`/admin/clarity/${assessment.id}`} key={assessment.id}>
                <span>{assessment.first_name}</span>
                <strong>{assessment.total_score} / 50</strong>
                <span>{assessment.primary_gap}</span>
                <span>{assessment.recommended_service}</span>
              </Link>
            ))}
          </div>
          <Link className="text-link" href="/admin/clarity">
            View All Clarity Checks →
          </Link>
        </section>

        <div className="admin-controls">
          <div>
            {filters.map(([value, label]) => (
              <Link className={filter === value ? "active" : ""} href={`/admin?filter=${value}&sort=${sort}`} key={value}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <Link className={sort === "newest" ? "active" : ""} href={`/admin?filter=${filter}&sort=newest`}>Newest</Link>
            <Link className={sort === "oldest" ? "active" : ""} href={`/admin?filter=${filter}&sort=oldest`}>Oldest</Link>
          </div>
        </div>

        <div className="admin-table" role="table" aria-label="Mosaic leads">
          <div className="admin-table-head" role="row">
            <span>Company</span>
            <span>Contact</span>
            <span>Email</span>
            <span>Submitted</span>
            <span>Lead Type</span>
            <span>Pipeline Stage</span>
            <span>Selected Plan</span>
            <span>Projected Revenue</span>
            <span>Last Updated</span>
            <span>Open</span>
          </div>
          {filteredLeads.map((lead) => (
            <div className="admin-table-row" role="row" key={lead.id}>
              <span data-label="Company">{lead.company_name}</span>
              <span data-label="Contact">{lead.contact_name}</span>
              <span data-label="Email">{lead.email}</span>
              <span data-label="Submitted">{date(lead.created_at)}</span>
              <span data-label="Lead Type">{leadType(lead.source)}</span>
              <span data-label="Pipeline Stage">{getStageLabel(stage(lead))}</span>
              <span data-label="Selected Plan">{getPlanLabel(lead.selected_plan)}</span>
              <span data-label="Projected Revenue">{currency(lead.projected_revenue)}</span>
              <span data-label="Last Updated">{date(lead.last_updated ?? lead.created_at)}</span>
              <Link href={`/admin/leads/${lead.id}`}>Open →</Link>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
