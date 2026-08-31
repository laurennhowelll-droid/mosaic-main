import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "../../../components";
import { quickUpdateOutreachProspect, signOutAdmin, updateOutreachProspect } from "../../actions";
import { getOutreachProspect } from "../../../../lib/supabase/admin";
import {
  optionLabel,
  outreachChannels,
  outreachLostReasons,
  outreachMessageAngles,
  outreachOpportunities,
  outreachOutcomes,
  outreachProblemCategories,
  outreachReplySentiments,
  outreachStatuses,
  outreachTiers,
} from "../../../../lib/outreach-config";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function inputDate(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

function followUpDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(9, 0, 0, 0);
  return date.toISOString().slice(0, 16);
}

function instagramHref(value: string | null) {
  if (!value) return null;
  if (value.startsWith("https://instagram.com/") || value.startsWith("https://www.instagram.com/")) return value;
  if (/^@?[A-Za-z0-9._]+$/.test(value)) return `https://instagram.com/${value.replace("@", "")}`;
  return null;
}

function SelectField({ name, label, options, value }: { name: string; label: string; options: readonly (readonly [string, string])[]; value?: string | null }) {
  return (
    <label>
      {label}
      <select name={name} defaultValue={value ?? ""}>
        <option value="">Not set</option>
        {options.map(([option, optionLabelText]) => <option value={option} key={option}>{optionLabelText}</option>)}
      </select>
    </label>
  );
}

export default async function OutreachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data;
  try {
    data = await getOutreachProspect(id);
  } catch {
    notFound();
  }
  const { prospect, activities } = data;
  const updateProspect = updateOutreachProspect.bind(null, prospect.id);
  const quickAction = quickUpdateOutreachProspect.bind(null, prospect.id);
  const igHref = instagramHref(prospect.instagram);

  return (
    <Shell>
      <section className="admin-detail-page outreach-detail-page">
        <div className="admin-detail-head">
          <div>
            <p className="kicker">Outreach Prospect</p>
            <h1>{prospect.business_name}</h1>
            <p>{prospect.contact_name ?? "Contact not set"} · {optionLabel(outreachStatuses, prospect.status)}</p>
          </div>
          <div>
            <span>Next Action</span>
            <strong>{formatDate(prospect.next_follow_up_at)}</strong>
            <Link className="text-link" href="/admin/outreach">All Outreach →</Link>
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

        <div className="admin-detail-grid">
          <div>
            <section className="admin-lead-info outreach-problem-panel">
              <p className="kicker">Problem I Spotted</p>
              <h2>{prospect.problem_observed}</h2>
              <p>{prospect.observation_notes}</p>
            </section>

            <section className="admin-lead-info">
              <p className="kicker">Business</p>
              <dl>
                <div><dt>Business</dt><dd>{prospect.business_name}</dd></div>
                <div><dt>Contact</dt><dd>{prospect.contact_name ?? "Not set"}</dd></div>
                <div><dt>Title</dt><dd>{prospect.contact_title ?? "Not set"}</dd></div>
                <div><dt>Industry</dt><dd>{prospect.industry ?? "Not set"}</dd></div>
                <div><dt>Location</dt><dd>{prospect.location ?? "Not set"}</dd></div>
                <div><dt>Email</dt><dd>{prospect.email ? <a href={`mailto:${prospect.email}`}>{prospect.email}</a> : "Not set"}</dd></div>
                <div><dt>Website</dt><dd>{prospect.website ? <a href={prospect.website}>{prospect.website}</a> : "Not set"}</dd></div>
                <div><dt>Instagram</dt><dd>{igHref ? <a href={igHref}>{prospect.instagram}</a> : prospect.instagram ?? "Not set"}</dd></div>
                <div><dt>Opportunity</dt><dd>{optionLabel(outreachOpportunities, prospect.mosaic_opportunity)}</dd></div>
                <div><dt>Problem Category</dt><dd>{optionLabel(outreachProblemCategories, prospect.problem_category)}</dd></div>
                <div><dt>Tier</dt><dd>{optionLabel(outreachTiers, prospect.prospect_tier)}</dd></div>
                <div><dt>Channel</dt><dd>{optionLabel(outreachChannels, prospect.channel)}</dd></div>
                <div><dt>Last Contact</dt><dd>{formatDate(prospect.last_contacted_at)}</dd></div>
                <div><dt>Reply</dt><dd>{formatDate(prospect.replied_at)} · {optionLabel(outreachReplySentiments, prospect.reply_sentiment)}</dd></div>
                <div><dt>Discovery Booked</dt><dd>{formatDate(prospect.discovery_booked_at)}</dd></div>
                <div><dt>Discovery Complete</dt><dd>{formatDate(prospect.discovery_completed_at)}</dd></div>
                <div><dt>Outcome</dt><dd>{optionLabel(outreachOutcomes, prospect.outcome)}</dd></div>
                <div><dt>Lost Reason</dt><dd>{optionLabel(outreachLostReasons, prospect.lost_reason)}</dd></div>
                <div className="wide"><dt>Research Notes</dt><dd>{prospect.research_notes ?? "None yet"}</dd></div>
                <div className="wide"><dt>Outreach Message</dt><dd>{prospect.outreach_message ?? "None yet"}</dd></div>
                <div className="wide"><dt>Notes</dt><dd>{prospect.notes ?? "None yet"}</dd></div>
              </dl>
            </section>

            <section className="admin-lead-info outreach-activity">
              <p className="kicker">Outreach History</p>
              {activities.length ? activities.map((activity) => (
                <article key={activity.id}>
                  <span>{formatDate(activity.created_at)} · {activity.activity_type}</span>
                  {activity.scheduled_for && <strong>Scheduled for {formatDate(activity.scheduled_for)}</strong>}
                  {activity.message && <p>{activity.message}</p>}
                  {activity.notes && <p>{activity.notes}</p>}
                </article>
              )) : <p>No activity yet.</p>}
            </section>
          </div>

          <aside className="outreach-sidebar">
            <section className="admin-edit-form">
              <h2>Quick Actions</h2>
              <form action={quickAction}>
                <input type="hidden" name="action" value="mark_contacted" />
                <SelectField name="channel" label="Channel" options={outreachChannels} value={prospect.channel} />
                <label>Message<textarea name="message" rows={3} defaultValue={prospect.outreach_message ?? ""} /></label>
                <label>Follow-Up<input name="next_follow_up_at" type="datetime-local" defaultValue={followUpDate(3)} /></label>
                <button className="button" type="submit">Mark Contacted →</button>
              </form>
              <form action={quickAction}>
                <input type="hidden" name="action" value="schedule_follow_up" />
                <label>Next Follow-Up<input name="next_follow_up_at" type="datetime-local" defaultValue={followUpDate(3)} required /></label>
                <label>Notes<textarea name="notes" rows={2} /></label>
                <div className="quick-followups">
                  {[2, 3, 5, 7].map((days) => <button className="secondary-button" name="next_follow_up_at" value={followUpDate(days)} key={days}>+{days} Days</button>)}
                </div>
                <button className="button" type="submit">Schedule Follow-Up →</button>
              </form>
              <form action={quickAction}>
                <input type="hidden" name="action" value="mark_replied" />
                <SelectField name="reply_sentiment" label="Reply Sentiment" options={outreachReplySentiments} value="positive" />
                <SelectField name="status" label="Move To" options={[["replied", "Replied"], ["interested", "Interested"]]} value="replied" />
                <label>Notes<textarea name="notes" rows={2} /></label>
                <button className="button" type="submit">Mark Replied →</button>
              </form>
              <form action={quickAction}><input type="hidden" name="action" value="mark_interested" /><button className="secondary-button">Mark Interested</button></form>
              <form action={quickAction}><input type="hidden" name="action" value="book_discovery" /><label>Discovery Date<input name="discovery_booked_at" type="datetime-local" required /></label><button className="button">Book Discovery →</button></form>
              <form action={quickAction}><input type="hidden" name="action" value="complete_discovery" /><label>Completed Date<input name="discovery_completed_at" type="datetime-local" defaultValue={inputDate(new Date().toISOString())} /></label><button className="secondary-button">Mark Discovery Complete</button></form>
              <form action={quickAction}><input type="hidden" name="action" value="mark_won" /><button className="button">Mark Won →</button></form>
              <form action={quickAction}><input type="hidden" name="action" value="mark_lost" /><SelectField name="lost_reason" label="Lost Reason" options={outreachLostReasons} value="no_response" /><label>Notes<textarea name="notes" rows={2} /></label><button className="secondary-button">Mark Lost</button></form>
              <form action={quickAction}><input type="hidden" name="action" value="delete" /><button className="text-link">Delete Prospect</button></form>
            </section>

            <form action={updateProspect} className="admin-edit-form outreach-form">
              <h2>Edit Prospect</h2>
              <label>Business Name *<input name="business_name" required defaultValue={prospect.business_name} /></label>
              <label>Contact Name<input name="contact_name" defaultValue={prospect.contact_name ?? ""} /></label>
              <label>Contact Title<input name="contact_title" defaultValue={prospect.contact_title ?? ""} /></label>
              <label>Industry<input name="industry" defaultValue={prospect.industry ?? ""} /></label>
              <label>Location<input name="location" defaultValue={prospect.location ?? ""} /></label>
              <label>Website<input name="website" defaultValue={prospect.website ?? ""} /></label>
              <label>Email<input name="email" type="email" defaultValue={prospect.email ?? ""} /></label>
              <label>Instagram<input name="instagram" defaultValue={prospect.instagram ?? ""} /></label>
              <SelectField name="problem_category" label="Problem Category" options={outreachProblemCategories} value={prospect.problem_category} />
              <label className="wide">Problem Observed *<textarea name="problem_observed" rows={4} required defaultValue={prospect.problem_observed} /></label>
              <label className="wide">Observation Notes<textarea name="observation_notes" rows={3} defaultValue={prospect.observation_notes ?? ""} /></label>
              <SelectField name="mosaic_opportunity" label="Mosaic Opportunity" options={outreachOpportunities} value={prospect.mosaic_opportunity} />
              <SelectField name="prospect_tier" label="Prospect Tier" options={outreachTiers} value={prospect.prospect_tier} />
              <SelectField name="channel" label="Channel" options={outreachChannels} value={prospect.channel} />
              <SelectField name="message_angle" label="Message Angle" options={outreachMessageAngles} value={prospect.message_angle} />
              <SelectField name="status" label="Status" options={outreachStatuses} value={prospect.status} />
              <SelectField name="outcome" label="Outcome" options={outreachOutcomes} value={prospect.outcome} />
              <label>Next Follow-Up<input name="next_follow_up_at" type="datetime-local" defaultValue={inputDate(prospect.next_follow_up_at)} /></label>
              <label>Replied At<input name="replied_at" type="datetime-local" defaultValue={inputDate(prospect.replied_at)} /></label>
              <SelectField name="reply_sentiment" label="Reply Sentiment" options={outreachReplySentiments} value={prospect.reply_sentiment} />
              <label>Discovery Booked<input name="discovery_booked_at" type="datetime-local" defaultValue={inputDate(prospect.discovery_booked_at)} /></label>
              <label>Discovery Complete<input name="discovery_completed_at" type="datetime-local" defaultValue={inputDate(prospect.discovery_completed_at)} /></label>
              <SelectField name="lost_reason" label="Lost Reason" options={outreachLostReasons} value={prospect.lost_reason} />
              <label>Estimated Value<input name="estimated_project_value" type="number" min="0" step="100" defaultValue={prospect.estimated_project_value ?? ""} /></label>
              <label className="wide">Research Notes<textarea name="research_notes" rows={3} defaultValue={prospect.research_notes ?? ""} /></label>
              <label className="wide">Outreach Message<textarea name="outreach_message" rows={4} defaultValue={prospect.outreach_message ?? ""} /></label>
              <label className="wide">Notes<textarea name="notes" rows={4} defaultValue={prospect.notes ?? ""} /></label>
              <button className="button" type="submit">Save Prospect →</button>
            </form>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
