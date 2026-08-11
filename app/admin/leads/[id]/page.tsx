import Link from "next/link";
import { Shell } from "../../../components";
import { getAdminLead, getPlanLabel, getStageLabel } from "../../../../lib/supabase/admin";
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

export default async function AdminLeadDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getAdminLead(id);
  const currentStage = lead.pipeline_stage ?? "new_inquiry";
  const currentPlan = lead.selected_plan ?? "not_selected";
  const updateLeadWithId = updateLead.bind(null, lead.id);

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
              <div><dt>Budget</dt><dd>{lead.budget}</dd></div>
              <div><dt>Created Date</dt><dd>{formatDate(lead.created_at)}</dd></div>
              <div><dt>Last Updated</dt><dd>{formatDate(lead.last_updated ?? lead.created_at)}</dd></div>
              <div className="wide"><dt>Original Problems / Inquiry</dt><dd>{lead.problems}</dd></div>
              {lead.notes && <div className="wide"><dt>Submission Notes</dt><dd>{lead.notes}</dd></div>}
            </dl>
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
