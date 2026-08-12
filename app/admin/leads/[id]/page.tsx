import Link from "next/link";
import { Shell } from "../../../components";
import { getAdminLead, getClientAssessment, getLeadClient, getLeadClarityAssessments, getPlanLabel, getStageLabel } from "../../../../lib/supabase/admin";
import { categoryLabel, clarityQuestions, type ClarityCategory } from "../../../../lib/clarity-check";
import { acceptLeadAfterDiscovery, declineLeadAfterDiscovery, updateLead } from "../../actions";
import LeadEditForm from "./LeadEditForm";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function leadType(source: string | null | undefined) {
  if (source === "clarity_session") return "Clarity Session";
  if (source === "website_start_with_vision" || source === "start_with_vision") return "Vision";
  return source ?? "Lead";
}

function submittedTimeline(notes: string | null | undefined) {
  if (!notes) return "Not provided";

  const timelineLine = notes
    .split("\n")
    .find((line) => line.startsWith("Timeline:") || line.startsWith("Preferred timeline:"));

  return timelineLine?.split(":").slice(1).join(":").trim() || "Not provided";
}

export default async function AdminLeadDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, assessments, client] = await Promise.all([getAdminLead(id), getLeadClarityAssessments(id), getLeadClient(id)]);
  const clientAssessment = client ? await getClientAssessment(client.id) : null;
  const currentStage = lead.pipeline_stage ?? "new_inquiry";
  const currentPlan = lead.selected_plan ?? "not_selected";
  const updateLeadWithId = updateLead.bind(null, lead.id);
  const latestAssessment = assessments[0];

  return (
    <Shell>
      <section className="admin-detail-page">
        <Link className="text-link" href="/admin">← Back to dashboard</Link>
        <div className="admin-detail-head">
          <div>
            <p className="kicker">Lead Detail</p>
            <h1>{lead.company_name}</h1>
            <p>{lead.contact_name} · {lead.email}</p>
          </div>
          <div>
            <span>{getStageLabel(currentStage)}</span>
            <strong>{getPlanLabel(currentPlan)}</strong>
          </div>
        </div>

        <div className="admin-detail-grid">
          <section className="admin-lead-info">
            <p className="kicker">Inquiry</p>
            <dl>
              <div><dt>Company</dt><dd>{lead.company_name}</dd></div>
              <div><dt>Contact Name</dt><dd>{lead.contact_name}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd></div>
              <div><dt>Phone</dt><dd>{lead.phone || "Not provided"}</dd></div>
              <div><dt>Website</dt><dd>{lead.website ? <a href={lead.website}>{lead.website}</a> : "Not provided"}</dd></div>
              <div><dt>Lead Type</dt><dd>{leadType(lead.source)}</dd></div>
              <div><dt>Budget</dt><dd>{lead.budget}</dd></div>
              <div><dt>Timeline</dt><dd>{submittedTimeline(lead.notes)}</dd></div>
              <div><dt>Created Date</dt><dd>{formatDate(lead.created_at)}</dd></div>
              <div><dt>Last Updated</dt><dd>{formatDate(lead.last_updated ?? lead.created_at)}</dd></div>
              <div className="wide"><dt>Original Problems / Inquiry</dt><dd>{lead.problems}</dd></div>
              {lead.notes && <div className="wide"><dt>Submission Notes</dt><dd>{lead.notes}</dd></div>}
            </dl>

            {latestAssessment && (
              <div className="admin-assessment">
                <p className="kicker">Clarity Check</p>
                <dl>
                  <div><dt>Clarity Score</dt><dd>{latestAssessment.total_score} / 50</dd></div>
                  <div><dt>Result Band</dt><dd>{latestAssessment.result_band}</dd></div>
                  <div><dt>Primary Gap</dt><dd>{latestAssessment.primary_gap}</dd></div>
                  <div><dt>Recommended Service</dt><dd>{latestAssessment.recommended_service}</dd></div>
                  <div><dt>Email Sent</dt><dd>{latestAssessment.email_sent_at ? formatDate(latestAssessment.email_sent_at) : "Not sent"}</dd></div>
                  <div><dt>Created Date</dt><dd>{formatDate(latestAssessment.created_at)}</dd></div>
                  <div className="wide"><dt>Category Scores</dt><dd>Vision: {latestAssessment.vision_score} · Experience: {latestAssessment.experience_score} · Systems: {latestAssessment.systems_score} · Operations: {latestAssessment.operations_score} · Growth: {latestAssessment.growth_score}</dd></div>
                  <div className="wide"><dt>Linked Lead</dt><dd>{latestAssessment.lead_id}</dd></div>
                </dl>
                <div className="admin-answer-list">
                  {latestAssessment.answers.map((answer) => {
                    const question = clarityQuestions.find((item) => item.id === answer.id);

                    return (
                      <article key={answer.id}>
                        <span>{categoryLabel(answer.category as ClarityCategory)} · {answer.score}/5</span>
                        <p>{question?.question ?? answer.id}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {(currentStage === "discovery_call_complete" || lead.discovery_decision !== "pending" || client) && (
              <div className="admin-discovery-decision">
                <p className="kicker">Discovery Decision</p>
                <h2>Would you like to move forward with this client?</h2>
                <dl>
                  <div><dt>Decision</dt><dd>{lead.discovery_decision ?? "pending"}</dd></div>
                  <div><dt>Decision Date</dt><dd>{formatDate(lead.discovery_decision_at)}</dd></div>
                  <div><dt>Email Sent</dt><dd>{formatDate(lead.discovery_email_sent_at)}</dd></div>
                  {lead.discovery_decision_notes && <div className="wide"><dt>Decision Notes</dt><dd>{lead.discovery_decision_notes}</dd></div>}
                </dl>

                {client && (
                  <div className="admin-client-summary">
                    <p className="kicker">Client Record</p>
                    <h3>{client.company_name}</h3>
                    <p>{client.primary_contact_name} · {client.email}</p>
                    <div className="admin-client-journey">
                      {[
                        ["Discovery", "complete"],
                        ["Decision", "complete"],
                        ["Accepted", "complete"],
                        ["Client Account Created", "complete"],
                        ["Business Health Assessment", clientAssessment?.status === "complete" ? "complete" : "current"],
                        ["Vision", clientAssessment?.status === "complete" ? "current" : "upcoming"],
                        ["Roadmap", "upcoming"],
                        ["Implementation", "upcoming"],
                        ["Ongoing Partnership", "upcoming"],
                      ].map(([label, status]) => (
                        <span className={`admin-client-journey-${status}`} key={label}>{label}</span>
                      ))}
                    </div>
                    <p>Business Health Assessment: {clientAssessment?.status ?? "not_started"}</p>
                    {clientAssessment?.status === "complete" && (
                      <Link className="text-link" href={`/admin/clients/${client.id}/assessment`}>Open Assessment →</Link>
                    )}
                  </div>
                )}

                {lead.discovery_decision === "pending" && !client && (
                  <div className="admin-decision-grid">
                    <form className="admin-decision-panel" action={acceptLeadAfterDiscovery.bind(null, lead.id)}>
                      <h3>YES — INVITE TO MOSAIC</h3>
                      <label>Client Email<input name="client_email" type="email" defaultValue={lead.email} required /></label>
                      <label>Preferred Client Name<input name="client_name" defaultValue={lead.contact_name} required /></label>
                      <label>Company Name<input name="company_name" defaultValue={lead.company_name} required /></label>
                      <p>No password will be created. The client will log in with a secure Supabase magic link.</p>
                      <button className="button" type="submit">Create Client & Send Invite →</button>
                    </form>

                    <form className="admin-decision-panel admin-decline-panel" action={declineLeadAfterDiscovery.bind(null, lead.id)}>
                      <h3>NO — DECLINE / REFER</h3>
                      <label>Internal Reason<textarea name="internal_reason" rows={4} placeholder="Not sent to the client." /></label>
                      <label>Client-Facing Note<textarea name="client_note" rows={5} placeholder="Optional note to include in the email." /></label>
                      <label>
                        Recommended Next Step
                        <select name="recommended_next_step" defaultValue="">
                          <option value="">No specific recommendation</option>
                          <option>Another consultant may be a better fit</option>
                          <option>Internal solution may be enough</option>
                          <option>Revisit later</option>
                          <option>Not currently within Mosaic&apos;s scope</option>
                          <option>Budget/timing mismatch</option>
                          <option>Other</option>
                        </select>
                      </label>
                      <div className="admin-email-preview">
                        <p className="kicker">Email Preview</p>
                        <p>Hi {lead.contact_name.split(" ")[0]},</p>
                        <p>Thank you again for taking the time to talk with me about {lead.company_name}.</p>
                        <p>After looking at everything we discussed, I don&apos;t think Mosaic is the best partner for this particular next step right now.</p>
                        <p>I&apos;d rather be clear about fit than recommend an engagement that isn&apos;t the right use of your time or investment.</p>
                        <p>Lauren<br />Mosaic</p>
                      </div>
                      <button className="button" type="submit">Send Thoughtful Decline →</button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </section>

          <LeadEditForm
            action={updateLeadWithId}
            currentStage={currentStage}
            currentPlan={currentPlan}
            projectedRevenue={lead.projected_revenue}
            internalNotes={lead.internal_notes}
          />
        </div>
      </section>
    </Shell>
  );
}
