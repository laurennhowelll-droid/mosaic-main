import Link from "next/link";
import { Shell } from "../../components";
import {
  getGrowthDashboardData,
  type ContentTrackerItem,
  type GrowthActivity,
  type GrowthTarget,
  type Lead,
} from "../../../lib/supabase/admin";
import {
  addContentTrackerItem,
  addGrowthActivity,
  updateGrowthCampaign,
  updateGrowthTargets,
} from "../actions";

const activityTypes = [
  ["linkedin_connection", "LinkedIn Connections Sent"],
  ["outreach_message", "Personalized Outreach Messages"],
  ["linkedin_comment", "Meaningful LinkedIn Comments"],
  ["personal_linkedin_post", "Personal LinkedIn Posts"],
  ["company_linkedin_post", "Mosaic Company Posts"],
  ["partnership_conversation", "Partnership Conversations"],
  ["discovery_call", "Discovery Calls"],
  ["playbook_article", "Playbook Articles"],
  ["proposal_sent", "Proposals Sent"],
  ["networking_event", "Networking Event"],
  ["referral_request", "Referral Request"],
  ["reply", "Replies"],
] as const;

const contentTypes = [
  ["personal_linkedin", "Personal LinkedIn"],
  ["mosaic_linkedin", "Mosaic LinkedIn"],
  ["playbook", "Playbook"],
  ["case_study", "Case Study"],
  ["founder_story", "Founder Story"],
] as const;

const statuses = ["idea", "draft", "scheduled", "published"] as const;
const openExcludedStages = new Set(["ghosted", "not_a_fit", "lost", "closed"]);
const wonStages = new Set(["project_active", "retainer_active", "closed"]);

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function date(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function metricLabel(metric: string) {
  return activityTypes.find(([value]) => value === metric)?.[1] ?? metric.replaceAll("_", " ");
}

function sumActivity(activity: GrowthActivity[], type: string, start: Date, end: Date) {
  return activity
    .filter((item) => item.activity_type === type)
    .filter((item) => {
      const current = new Date(`${item.activity_date}T00:00:00`);
      return current >= start && current <= end;
    })
    .reduce((sum, item) => sum + item.count, 0);
}

function countContent(content: ContentTrackerItem[], type: string, status: string, start: Date, end: Date) {
  return content
    .filter((item) => item.post_type === type && item.status === status && item.publish_date)
    .filter((item) => {
      const current = new Date(`${item.publish_date}T00:00:00`);
      return current >= start && current <= end;
    }).length;
}

function percent(current: number, target: number) {
  if (!target) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

function ratio(part: number, whole: number) {
  if (!whole) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}

function startOfWeek(dateValue: Date) {
  const date = new Date(dateValue);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(dateValue: Date, days: number) {
  const date = new Date(dateValue);
  date.setDate(date.getDate() + days);
  return date;
}

function stage(lead: Lead) {
  return lead.pipeline_stage ?? "new_inquiry";
}

function crmMetrics(leads: Lead[]) {
  const discovery = leads.filter((lead) => ["first_call_scheduled", "first_call_complete", "working_on_plan"].includes(stage(lead))).length;
  const proposals = leads.filter((lead) => ["proposal_sent", "waiting_on_client", "plan_selected"].includes(stage(lead))).length;
  const clients = leads.filter((lead) => wonStages.has(stage(lead))).length;
  const open = leads.filter((lead) => !openExcludedStages.has(stage(lead)));
  const pipeline = open.reduce((sum, lead) => sum + Number(lead.projected_revenue ?? 0), 0);
  const revenue = leads.filter((lead) => wonStages.has(stage(lead))).reduce((sum, lead) => sum + Number(lead.projected_revenue ?? 0), 0);
  const mrr = leads.filter((lead) => stage(lead) === "retainer_active").reduce((sum, lead) => sum + Number(lead.projected_revenue ?? 0), 0);
  return { discovery, proposals, clients, open: open.length, pipeline, revenue, mrr };
}

export default async function GrowthDashboard({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const [{ week }, data] = await Promise.all([searchParams, getGrowthDashboardData()]);
  const weekOffset = Number(week ?? "0") || 0;
  const today = new Date();
  const weekStart = addDays(startOfWeek(today), weekOffset * 7);
  const weekEnd = addDays(weekStart, 6);
  const last30Start = addDays(today, -30);
  const campaignStart = new Date(`${data.campaign.start_date}T00:00:00`);
  const campaignEnd = new Date(`${data.campaign.end_date}T00:00:00`);
  const dayOfCampaign = Math.min(90, Math.max(1, Math.floor((today.getTime() - campaignStart.getTime()) / 86400000) + 1));
  const daysRemaining = Math.max(0, Math.ceil((campaignEnd.getTime() - today.getTime()) / 86400000));
  const crm = crmMetrics(data.leads);
  const clarityChecks = data.assessments.length;
  const targetMap = new Map(data.targets.map((target) => [target.metric, target]));
  const activityFor = (type: string, start: Date, end: Date) => sumActivity(data.activity, type, start, end);
  const campaignActivityFor = (type: string) => activityFor(type, campaignStart, campaignEnd);
  const weeklyRows = activityTypes.slice(0, 9).map(([type, label]) => {
    const target = targetMap.get(type)?.weekly_target ?? 0;
    const current = activityFor(type, weekStart, weekEnd);
    return { type, label, current, target, progress: percent(current, target) };
  });
  const weeklyCompletion = weeklyRows.length
    ? Math.round(weeklyRows.reduce((sum, row) => sum + row.progress, 0) / weeklyRows.length)
    : 0;
  const outreach = campaignActivityFor("outreach_message");
  const replies = campaignActivityFor("reply");
  const contentByStatus = statuses.map((status) => [status, data.content.filter((item) => item.status === status)] as const);
  const updateCampaign = updateGrowthCampaign.bind(null, data.campaign.id);
  const addActivity = addGrowthActivity.bind(null, data.campaign.id);
  const addContent = addContentTrackerItem.bind(null, data.campaign.id);
  const updateTargets = updateGrowthTargets.bind(null, data.campaign.id);

  const summary = [
    ["Day of Campaign", `${dayOfCampaign} / 90`],
    ["Discovery Calls Booked", crm.discovery.toString()],
    ["Clients Won", crm.clients.toString()],
    ["Pipeline Value", currency(crm.pipeline)],
    ["Revenue Closed", currency(crm.revenue)],
    ["MRR", currency(crm.mrr)],
    ["This Week Complete", `${weeklyCompletion}%`],
  ];

  const pipeline = [
    ["Website Leads", data.leads.length.toString()],
    ["Clarity Checks", clarityChecks.toString()],
    ["Discovery Calls", crm.discovery.toString()],
    ["Proposals Sent", crm.proposals.toString()],
    ["Clients Won", crm.clients.toString()],
    ["Open Opportunities", crm.open.toString()],
    ["Pipeline Value", currency(crm.pipeline)],
    ["Closed Revenue", currency(crm.revenue)],
    ["Monthly Recurring Revenue", currency(crm.mrr)],
  ];

  return (
    <Shell>
      <section className="admin-page growth-page">
        <div className="admin-head">
          <div>
            <p className="kicker">Mosaic Admin</p>
            <h1>Growth Dashboard.</h1>
          </div>
          <div className="growth-nav">
            <Link className="text-link" href="/admin">Leads →</Link>
            <Link className="text-link" href="/admin/clarity">Clarity Checks →</Link>
          </div>
        </div>

        <div className="admin-metrics growth-summary">
          {summary.map(([label, value]) => (
            <article key={label}><span>{label}</span><strong>{value}</strong></article>
          ))}
        </div>

        <section className="growth-campaign">
          <div>
            <p className="kicker">{data.campaign.campaign_name}</p>
            <h2>Day {dayOfCampaign} / 90</h2>
            <p>{daysRemaining} days remaining</p>
          </div>
          <form action={updateCampaign}>
            <label>Campaign Name<input name="campaign_name" defaultValue={data.campaign.campaign_name} /></label>
            <label>Start Date<input type="date" name="start_date" defaultValue={data.campaign.start_date} /></label>
            <label>End Date<input type="date" name="end_date" defaultValue={data.campaign.end_date} /></label>
            <label className="wide">Notes<textarea name="notes" rows={3} defaultValue={data.campaign.notes ?? ""} /></label>
            <button className="button" type="submit">Save Campaign</button>
          </form>
        </section>

        <section className="growth-grid">
          <form className="growth-panel" action={addActivity}>
            <p className="kicker">Quick Add Activity</p>
            <label>Activity Type<select name="activity_type">{activityTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label>Date<input type="date" name="activity_date" defaultValue={today.toISOString().slice(0, 10)} /></label>
            <label>Count<input type="number" min="1" name="count" defaultValue="1" /></label>
            <label>Optional Link<input name="url" /></label>
            <label className="wide">Optional Note<textarea name="notes" rows={3} /></label>
            <button className="button" type="submit">Save Activity</button>
          </form>

          <form className="growth-panel" action={addContent}>
            <p className="kicker">Content Tracker</p>
            <label>Title<input name="title" required /></label>
            <label>Post Type<select name="post_type">{contentTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label>Status<select name="status">{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></label>
            <label>Publish Date<input type="date" name="publish_date" /></label>
            <label>URL<input name="url" /></label>
            <label className="wide">Notes<textarea name="notes" rows={3} /></label>
            <button className="button" type="submit">Add Content</button>
          </form>
        </section>

        <section className="growth-section">
          <div className="growth-section-head">
            <div><p className="kicker">This Week</p><h2>{date(weekStart.toISOString().slice(0, 10))} – {date(weekEnd.toISOString().slice(0, 10))}</h2></div>
            <div className="growth-nav">
              <Link href={`/admin/growth?week=${weekOffset - 1}`}>Previous Week</Link>
              <Link href="/admin/growth">Current Week</Link>
              <Link href={`/admin/growth?week=${weekOffset + 1}`}>Next Week</Link>
            </div>
          </div>
          <div className="growth-scorecard">
            {weeklyRows.map((row) => (
              <article key={row.type}>
                <span>{row.label}</span>
                <strong>{row.current} / {row.target}</strong>
                <i><b style={{ width: `${row.progress}%` }} /></i>
                {row.target > 0 && row.current >= row.target && <em>Target met</em>}
              </article>
            ))}
          </div>
        </section>

        <section className="growth-section">
          <p className="kicker">Pipeline</p>
          <div className="admin-metrics growth-pipeline">
            {pipeline.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}
          </div>
          <div className="growth-funnel">
            {[
              ["Outreach", outreach],
              ["Replies", replies],
              ["Discovery Calls", crm.discovery],
              ["Proposals", crm.proposals],
              ["Clients Won", crm.clients],
            ].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}
          </div>
          <p className="growth-note">Reply Rate {ratio(replies, outreach)} · Call Booking Rate {ratio(crm.discovery, replies)} · Proposal Rate {ratio(crm.proposals, crm.discovery)} · Close Rate {ratio(crm.clients, crm.proposals)}</p>
        </section>

        <section className="growth-section">
          <p className="kicker">60-Day Targets</p>
          <form action={updateTargets} className="growth-targets">
            {data.targets.map((target: GrowthTarget) => {
              const current = target.metric === "client_won" ? crm.clients : target.metric === "signed_revenue" ? crm.revenue : target.metric === "retainer" ? data.leads.filter((lead) => stage(lead) === "retainer_active").length : target.metric === "case_study" ? countContent(data.content, "case_study", "published", campaignStart, campaignEnd) : campaignActivityFor(target.metric);
              return (
                <article key={target.id}>
                  <input type="hidden" name="target_id" value={target.id} />
                  <span>{metricLabel(target.metric)}</span>
                  <strong>{target.metric === "signed_revenue" ? currency(current) : current} / {target.metric === "signed_revenue" ? currency(target.campaign_target ?? 0) : target.campaign_target ?? "—"}</strong>
                  <i><b style={{ width: `${percent(current, target.campaign_target ?? 0)}%` }} /></i>
                  <label>Weekly<input type="number" step="0.5" name={`weekly_target_${target.id}`} defaultValue={target.weekly_target ?? ""} /></label>
                  <label>Campaign<input type="number" step="0.5" name={`campaign_target_${target.id}`} defaultValue={target.campaign_target ?? ""} /></label>
                </article>
              );
            })}
            <button className="button" type="submit">Save Targets</button>
          </form>
        </section>

        <section className="growth-grid">
          <div className="growth-panel">
            <p className="kicker">Content</p>
            {contentByStatus.map(([status, items]) => (
              <div className="growth-content-group" key={status}>
                <h3>{status}</h3>
                {items.slice(0, 5).map((item) => <p key={item.id}>{item.title}{item.url && <> · <a href={item.url}>Open</a></>}</p>)}
              </div>
            ))}
          </div>
          <div className="growth-panel">
            <p className="kicker">Recent Activity</p>
            {data.activity.slice(0, 12).map((item) => <p key={item.id}>{date(item.activity_date)} · {metricLabel(item.activity_type)} · {item.count}</p>)}
          </div>
        </section>

        <section className="growth-section">
          <p className="kicker">Last 30 Days / Campaign Total</p>
          <div className="growth-funnel">
            {["linkedin_connection", "outreach_message", "linkedin_comment", "personal_linkedin_post", "discovery_call", "proposal_sent"].map((type) => (
              <article key={type}><span>{metricLabel(type)}</span><strong>{activityFor(type, last30Start, today)} / {campaignActivityFor(type)}</strong></article>
            ))}
            <article><span>Clients</span><strong>{crm.clients}</strong></article>
            <article><span>Revenue</span><strong>{currency(crm.revenue)}</strong></article>
          </div>
        </section>
      </section>
    </Shell>
  );
}
