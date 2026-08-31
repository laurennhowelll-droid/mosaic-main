import Link from "next/link";
import { Shell } from "../../components";
import { createOutreachProspect, quickUpdateOutreachProspect, signOutAdmin } from "../actions";
import { getOutreachProspects, type OutreachProspect } from "../../../lib/supabase/admin";
import {
  optionLabel,
  outreachChannels,
  outreachMessageAngles,
  outreachOpportunities,
  outreachProblemCategories,
  outreachStatuses,
  outreachTiers,
  weeklyOutreachTarget,
} from "../../../lib/outreach-config";

type SearchParams = {
  status?: string;
  industry?: string;
  channel?: string;
  opportunity?: string;
  problem?: string;
  tier?: string;
  outcome?: string;
  view?: string;
  q?: string;
  sort?: string;
};

const terminalStatuses = new Set(["won", "lost", "not_a_fit"]);

function date(value: string | null | undefined) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function dateTimeLocal(daysFromNow = 0) {
  const dateValue = new Date();
  dateValue.setDate(dateValue.getDate() + daysFromNow);
  dateValue.setHours(9, 0, 0, 0);
  return dateValue.toISOString().slice(0, 16);
}

function currency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value ?? 0);
}

function percent(numerator: number, denominator: number) {
  if (!denominator) return "0%";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

function isDue(prospect: OutreachProspect) {
  return Boolean(prospect.next_follow_up_at && new Date(prospect.next_follow_up_at) <= new Date() && !terminalStatuses.has(prospect.status));
}

function isUpcomingDiscovery(prospect: OutreachProspect) {
  return Boolean(prospect.discovery_booked_at && new Date(prospect.discovery_booked_at) >= new Date() && prospect.status !== "won" && prospect.status !== "lost");
}

function actionScore(prospect: OutreachProspect) {
  if (isDue(prospect)) return 0;
  if (["replied", "interested"].includes(prospect.status)) return 1;
  if (["dream", "high_potential"].includes(prospect.prospect_tier)) return 2;
  return 3;
}

function matches(prospect: OutreachProspect, params: SearchParams) {
  const q = params.q?.trim().toLowerCase();
  if (params.status && params.status !== "all" && prospect.status !== params.status) return false;
  if (params.channel && params.channel !== "all" && prospect.channel !== params.channel) return false;
  if (params.opportunity && params.opportunity !== "all" && prospect.mosaic_opportunity !== params.opportunity) return false;
  if (params.problem && params.problem !== "all" && prospect.problem_category !== params.problem) return false;
  if (params.tier && params.tier !== "all" && prospect.prospect_tier !== params.tier) return false;
  if (params.outcome && params.outcome !== "all" && prospect.outcome !== params.outcome) return false;
  if (params.industry && params.industry !== "all" && prospect.industry !== params.industry) return false;
  if (params.view === "follow_up" && !isDue(prospect)) return false;
  if (params.view === "positive" && prospect.reply_sentiment !== "positive") return false;
  if (params.view === "discovery" && !prospect.discovery_booked_at) return false;
  if (params.view === "won" && prospect.outcome !== "won") return false;
  if (params.view === "lost" && prospect.outcome !== "lost") return false;
  if (q) {
    const haystack = [prospect.business_name, prospect.contact_name, prospect.email, prospect.website].filter(Boolean).join(" ").toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

function sortProspects(prospects: OutreachProspect[], sort: string) {
  return [...prospects].sort((a, b) => {
    if (sort === "created") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === "last_contact") return new Date(b.last_contacted_at ?? 0).getTime() - new Date(a.last_contacted_at ?? 0).getTime();
    if (sort === "next_follow_up") return new Date(a.next_follow_up_at ?? "9999-12-31").getTime() - new Date(b.next_follow_up_at ?? "9999-12-31").getTime();
    if (sort === "business") return a.business_name.localeCompare(b.business_name);
    if (sort === "status") return a.status.localeCompare(b.status);
    if (sort === "value") return Number(b.estimated_project_value ?? 0) - Number(a.estimated_project_value ?? 0);
    return actionScore(a) - actionScore(b) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function breakdown(prospects: OutreachProspect[], key: keyof OutreachProspect) {
  const rows = new Map<string, OutreachProspect[]>();
  prospects.forEach((prospect) => {
    const value = String(prospect[key] ?? "Not set");
    rows.set(value, [...(rows.get(value) ?? []), prospect]);
  });
  return [...rows.entries()].map(([label, items]) => ({
    label,
    contacted: items.filter((item) => item.last_contacted_at).length,
    replies: items.filter((item) => item.replied_at).length,
    discovery: items.filter((item) => item.discovery_booked_at).length,
    won: items.filter((item) => item.outcome === "won").length,
  })).filter((row) => row.contacted > 0).sort((a, b) => b.contacted - a.contacted).slice(0, 6);
}

function SelectField({ name, label, options, value }: { name: string; label: string; options: readonly (readonly [string, string])[]; value?: string }) {
  return (
    <label>
      {label}
      <select name={name} defaultValue={value ?? ""}>
        <option value="">Any</option>
        {options.map(([option, optionLabelText]) => (
          <option value={option} key={option}>{optionLabelText}</option>
        ))}
      </select>
    </label>
  );
}

export default async function OutreachPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const prospects = await getOutreachProspects();
  const filtered = sortProspects(prospects.filter((prospect) => matches(prospect, params)), params.sort ?? "action");
  const contacted = prospects.filter((prospect) => prospect.last_contacted_at);
  const replied = prospects.filter((prospect) => prospect.replied_at);
  const positive = prospects.filter((prospect) => prospect.reply_sentiment === "positive");
  const discovery = prospects.filter((prospect) => prospect.discovery_booked_at);
  const won = prospects.filter((prospect) => prospect.outcome === "won");
  const pipelineValue = prospects.filter((prospect) => ["interested", "discovery_booked", "discovery_complete"].includes(prospect.status)).reduce((sum, prospect) => sum + Number(prospect.estimated_project_value ?? 0), 0);
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const thisWeek = contacted.filter((prospect) => new Date(prospect.last_contacted_at ?? 0) >= startOfWeek);
  const followUpsDue = prospects.filter(isDue).sort((a, b) => new Date(a.next_follow_up_at ?? 0).getTime() - new Date(b.next_follow_up_at ?? 0).getTime()).slice(0, 6);
  const newToContact = prospects.filter((prospect) => ["lead", "researched"].includes(prospect.status) && !prospect.last_contacted_at).slice(0, 6);
  const activeConversations = prospects.filter((prospect) => ["replied", "interested"].includes(prospect.status)).slice(0, 6);
  const upcomingDiscovery = prospects.filter(isUpcomingDiscovery).slice(0, 6);
  const industries = [...new Set(prospects.map((prospect) => prospect.industry).filter(Boolean))].sort() as string[];

  return (
    <Shell>
      <section className="admin-page outreach-page">
        <div className="admin-head">
          <div>
            <p className="kicker">Mosaic Admin</p>
            <h1>Outreach command center.</h1>
          </div>
          <form action={signOutAdmin}><button className="text-link" type="submit">Sign out</button></form>
        </div>
        <div className="admin-top-nav">
          <Link href="/admin">Leads →</Link>
          <Link href="/admin/outreach">Outreach →</Link>
          <Link href="/admin/growth">Growth Dashboard →</Link>
          <Link href="/admin/clarity">Clarity Checks →</Link>
          <Link href="/admin/work">Work →</Link>
        </div>

        <div className="admin-metrics outreach-metrics">
          {[["Total Prospects", prospects.length.toString()], ["Contacted", contacted.length.toString()], ["Replies", replied.length.toString()], ["Positive", positive.length.toString()], ["Discovery Calls", discovery.length.toString()], ["Won", won.length.toString()], ["Pipeline Value", currency(pipelineValue)]].map(([label, value]) => (
            <article key={label}><span>{label}</span><strong>{value}</strong></article>
          ))}
        </div>

        <section className="outreach-week">
          <div><p className="kicker">This Week</p><h2>Contacted: {thisWeek.length} / {weeklyOutreachTarget}</h2></div>
          <span>Replies: {thisWeek.filter((p) => p.replied_at).length}</span>
          <span>Positive: {thisWeek.filter((p) => p.reply_sentiment === "positive").length}</span>
          <span>Discovery Calls: {thisWeek.filter((p) => p.discovery_booked_at).length}</span>
        </section>

        <section className="outreach-today">
          <p className="kicker">Today</p>
          <div>
            <ActionList title="Follow Ups Due" prospects={followUpsDue} />
            <ActionList title="New Prospects To Contact" prospects={newToContact} />
            <ActionList title="Active Conversations" prospects={activeConversations} />
            <ActionList title="Upcoming Discovery Calls" prospects={upcomingDiscovery} />
          </div>
        </section>

        <section className="outreach-add">
          <details open={prospects.length === 0}>
            <summary>+ Add Prospect</summary>
            <form action={createOutreachProspect} className="admin-edit-form outreach-form">
              <h2>Business</h2>
              <label>Business Name *<input name="business_name" required /></label>
              <label>Contact Name<input name="contact_name" /></label>
              <label>Contact Title<input name="contact_title" /></label>
              <label>Industry<input name="industry" /></label>
              <label>Location<input name="location" /></label>
              <label>Website<input name="website" /></label>
              <label>Email<input name="email" type="email" /></label>
              <label>Instagram<input name="instagram" /></label>
              <h2>What I Noticed</h2>
              <SelectField name="problem_category" label="Problem Category" options={outreachProblemCategories} />
              <label className="wide">Problem Observed *<textarea name="problem_observed" rows={4} required /></label>
              <SelectField name="mosaic_opportunity" label="Mosaic Opportunity" options={outreachOpportunities} value="unsure" />
              <SelectField name="prospect_tier" label="Prospect Tier" options={outreachTiers} value="standard" />
              <label className="wide">Research Notes<textarea name="research_notes" rows={3} /></label>
              <h2>Outreach</h2>
              <SelectField name="channel" label="Channel" options={outreachChannels} />
              <SelectField name="message_angle" label="Message Angle" options={outreachMessageAngles} />
              <label className="wide">Outreach Message<textarea name="outreach_message" rows={4} /></label>
              <SelectField name="status" label="Status" options={outreachStatuses} value="lead" />
              <h2>Follow-Up</h2>
              <label>Next Follow-Up<input name="next_follow_up_at" type="datetime-local" /></label>
              <label>Estimated Value<input name="estimated_project_value" type="number" min="0" step="100" /></label>
              <label className="wide">Notes<textarea name="notes" rows={3} /></label>
              <button className="button" type="submit">Add Prospect →</button>
            </form>
          </details>
        </section>

        {prospects.length === 0 ? (
          <section className="outreach-empty">
            <h2>Your next client might be hiding in plain sight.</h2>
            <p>Start with businesses that are already doing something well. Look for the piece making the customer experience or the business itself harder than it needs to be.</p>
            <p>Good business. Messy pieces.</p>
          </section>
        ) : (
          <>
            <FilterForm params={params} industries={industries} />
            <section className="outreach-performance">
              {[["Reply Rate", percent(replied.length, contacted.length)], ["Positive Reply Rate", percent(positive.length, contacted.length)], ["Discovery Rate", percent(discovery.length, contacted.length)], ["Interested → Discovery", percent(discovery.length, prospects.filter((p) => p.status === "interested").length)], ["Close Rate", percent(won.length, prospects.filter((p) => p.discovery_completed_at).length)], ["Outreach → Client", percent(won.length, contacted.length)]].map(([label, value]) => (
                <article key={label}><span>{label}</span><strong>{value}</strong></article>
              ))}
            </section>
            <Pipeline prospects={prospects} />
            <ProspectTable prospects={filtered} />
            <Insights prospects={prospects} />
          </>
        )}
      </section>
    </Shell>
  );
}

function ActionList({ title, prospects }: { title: string; prospects: OutreachProspect[] }) {
  return (
    <article>
      <h2>{title}</h2>
      {prospects.length ? prospects.map((prospect) => (
        <Link href={`/admin/outreach/${prospect.id}`} key={prospect.id}>
          <strong>{prospect.business_name}</strong>
          <span>{prospect.next_follow_up_at ? date(prospect.next_follow_up_at) : optionLabel(outreachStatuses, prospect.status)}</span>
        </Link>
      )) : <p>Nothing here right now.</p>}
    </article>
  );
}

function FilterForm({ params, industries }: { params: SearchParams; industries: string[] }) {
  return (
    <form className="outreach-filters">
      <label>Search<input name="q" defaultValue={params.q ?? ""} placeholder="Business, contact, email, website" /></label>
      <label>Status<select name="status" defaultValue={params.status ?? "all"}><option value="all">All</option>{outreachStatuses.map(([v, l]) => <option value={v} key={v}>{l}</option>)}</select></label>
      <label>Industry<select name="industry" defaultValue={params.industry ?? "all"}><option value="all">All</option>{industries.map((industry) => <option value={industry} key={industry}>{industry}</option>)}</select></label>
      <label>Channel<select name="channel" defaultValue={params.channel ?? "all"}><option value="all">All</option>{outreachChannels.map(([v, l]) => <option value={v} key={v}>{l}</option>)}</select></label>
      <label>Opportunity<select name="opportunity" defaultValue={params.opportunity ?? "all"}><option value="all">All</option>{outreachOpportunities.map(([v, l]) => <option value={v} key={v}>{l}</option>)}</select></label>
      <label>Problem<select name="problem" defaultValue={params.problem ?? "all"}><option value="all">All</option>{outreachProblemCategories.map(([v, l]) => <option value={v} key={v}>{l}</option>)}</select></label>
      <label>Tier<select name="tier" defaultValue={params.tier ?? "all"}><option value="all">All</option>{outreachTiers.map(([v, l]) => <option value={v} key={v}>{l}</option>)}</select></label>
      <label>View<select name="view" defaultValue={params.view ?? "all"}><option value="all">All</option><option value="follow_up">Needs Follow-Up</option><option value="positive">Positive Replies</option><option value="discovery">Discovery Booked</option><option value="won">Won</option><option value="lost">Lost</option></select></label>
      <label>Sort<select name="sort" defaultValue={params.sort ?? "action"}><option value="action">Action</option><option value="created">Created</option><option value="last_contact">Last Contact</option><option value="next_follow_up">Next Follow-Up</option><option value="business">Business Name</option><option value="status">Status</option><option value="value">Estimated Value</option></select></label>
      <button className="button" type="submit">Filter →</button>
    </form>
  );
}

function ProspectTable({ prospects }: { prospects: OutreachProspect[] }) {
  return (
    <div className="admin-table outreach-table" role="table" aria-label="Outreach prospects">
      <div className="admin-table-head" role="row"><span>Business</span><span>Contact</span><span>Industry</span><span>Problem</span><span>Opportunity</span><span>Tier</span><span>Channel</span><span>Status</span><span>Last Contact</span><span>Next Follow-Up</span><span>Outcome</span><span>Open</span></div>
      {prospects.map((prospect) => (
        <div className="admin-table-row" role="row" key={prospect.id}>
          <span data-label="Business">{prospect.business_name}</span>
          <span data-label="Contact">{prospect.contact_name ?? "Not set"}</span>
          <span data-label="Industry">{prospect.industry ?? "Not set"}</span>
          <span data-label="Problem">{optionLabel(outreachProblemCategories, prospect.problem_category)}</span>
          <span data-label="Opportunity">{optionLabel(outreachOpportunities, prospect.mosaic_opportunity)}</span>
          <span data-label="Tier">{optionLabel(outreachTiers, prospect.prospect_tier)}</span>
          <span data-label="Channel">{optionLabel(outreachChannels, prospect.channel)}</span>
          <span data-label="Status">{optionLabel(outreachStatuses, prospect.status)}</span>
          <span data-label="Last Contact">{date(prospect.last_contacted_at)}</span>
          <span data-label="Next Follow-Up">{date(prospect.next_follow_up_at)}</span>
          <span data-label="Outcome">{prospect.outcome}</span>
          <Link href={`/admin/outreach/${prospect.id}`}>Open →</Link>
        </div>
      ))}
    </div>
  );
}

function Pipeline({ prospects }: { prospects: OutreachProspect[] }) {
  const stages = [["lead", "Lead"], ["contacted", "Contacted"], ["replied", "Replied"], ["interested", "Interested"], ["discovery_booked", "Discovery"], ["won", "Won"]];
  return <section className="outreach-pipeline">{stages.map(([key, label]) => <article key={key}><span>{label}</span><strong>{prospects.filter((p) => p.status === key || (key === "discovery_booked" && p.status === "discovery_complete")).length}</strong></article>)}</section>;
}

function Insights({ prospects }: { prospects: OutreachProspect[] }) {
  const contacted = prospects.filter((prospect) => prospect.last_contacted_at);
  if (contacted.length < 5) {
    return <section className="outreach-insights"><h2>What&apos;s working?</h2><p>Not enough data yet. Once you&apos;ve contacted a few prospects, you&apos;ll start seeing which industries, problems, and messages are getting responses.</p></section>;
  }
  return (
    <section className="outreach-insights">
      <h2>What&apos;s working?</h2>
      <InsightTable title="Reply Rate By Industry" rows={breakdown(prospects, "industry")} />
      <InsightTable title="Reply Rate By Channel" rows={breakdown(prospects, "channel")} />
      <InsightTable title="Reply Rate By Message Angle" rows={breakdown(prospects, "message_angle")} />
      <InsightTable title="Performance By Problem" rows={breakdown(prospects, "problem_category")} />
      <InsightTable title="Performance By Opportunity" rows={breakdown(prospects, "mosaic_opportunity")} />
    </section>
  );
}

function InsightTable({ title, rows }: { title: string; rows: { label: string; contacted: number; replies: number; discovery: number; won: number }[] }) {
  return <article><h3>{title}</h3>{rows.length ? rows.map((row) => <p key={row.label}><strong>{row.label}</strong><span>{row.contacted} contacted · {row.replies} replies · {percent(row.replies, row.contacted)} · {row.discovery} discovery · {row.won} won</span></p>) : <p>Not enough data yet.</p>}</article>;
}
