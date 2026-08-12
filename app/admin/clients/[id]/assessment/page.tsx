import Link from "next/link";
import { Shell } from "../../../../components";
import { assessmentSections } from "../../../../../lib/business-health-assessment";
import { getAdminClient, getClientAssessment } from "../../../../../lib/supabase/admin";

function formatAnswer(value: unknown) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not answered";
  if (typeof value === "string" && value.trim()) return value;
  return "Not answered";
}

export default async function AdminClientAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, assessment] = await Promise.all([getAdminClient(id), getClientAssessment(id)]);
  const answers = assessment?.answers ?? {};

  return (
    <Shell>
      <section className="admin-detail-page admin-client-assessment-page">
        <Link className="text-link" href={client.lead_id ? `/admin/leads/${client.lead_id}` : "/admin"}>
          ← Back to client
        </Link>
        <div className="admin-detail-head">
          <div>
            <p className="kicker">Business Health Assessment</p>
            <h1>{client.company_name}</h1>
            <p>{client.primary_contact_name} · {client.email}</p>
          </div>
          <div>
            <span>Status</span>
            <strong>{assessment?.status ?? "not_started"}</strong>
          </div>
        </div>

        <section className="admin-assessment-summary">
          <p className="kicker">Internal Summary</p>
          <div className="admin-summary-grid">
            <article><span>Top Goals</span><p>{formatAnswer(answers.goals)}</p></article>
            <article><span>Primary Friction</span><p>{formatAnswer(answers.friction_areas)}</p></article>
            <article><span>Current Systems</span><p>{formatAnswer(answers.tools)}</p></article>
            <article><span>Operational Maturity</span><p>{formatAnswer(answers.operations_statement)}</p></article>
            <article><span>Leadership Bottleneck</span><p>{formatAnswer(answers.single_person_dependency)}</p></article>
            <article><span>Final Question</span><p>{formatAnswer(answers.one_thing)}</p></article>
          </div>
        </section>

        <section className="admin-assessment-sections">
          {assessmentSections.map((section) => (
            <article key={section.id}>
              <h2>{section.title}</h2>
              <div className="admin-response-list">
                {section.questions.map((question) => (
                  <div key={question.id}>
                    <span>{question.label}</span>
                    <p>{formatAnswer(answers[question.id])}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </section>
    </Shell>
  );
}
