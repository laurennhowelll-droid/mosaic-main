import Link from "next/link";
import { Shell } from "../../../components";
import { getAdminLead, getLeadClarityAssessments, getPlanLabel, getStageLabel } from "../../../../lib/supabase/admin";
import { categoryLabel, clarityQuestions, type ClarityCategory } from "../../../../lib/clarity-check";
import { updateLead } from "../../actions";
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
  const [lead, assessments] = await Promise.all([getAdminLead(id), getLeadClarityAssessments(id)]);
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
