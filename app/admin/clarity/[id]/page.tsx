import Link from "next/link";
import { Shell } from "../../../components";
import {
  calculateClarityResult,
  categoryLabel,
  clarityQuestions,
  interpretCategory,
  primaryGapCopy,
  scoreForCategory,
  strongestAreaCopy,
  type ClarityAnswer,
  type ClarityCategory,
} from "../../../../lib/clarity-check";
import { getAdminClarityAssessment, getPlanLabel, getStageLabel } from "../../../../lib/supabase/admin";
import { updateClarityAssessmentStatus } from "../../actions";

const categories: ClarityCategory[] = ["vision", "experience", "systems", "operations", "growth"];

function date(value: string | null | undefined) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function currency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function statusLabel(value: string) {
  if (value === "follow_up_needed") return "Follow Up Needed";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function AdminClarityDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assessment = await getAdminClarityAssessment(id);
  const answers = assessment.answers as ClarityAnswer[];
  const result = calculateClarityResult(answers);
  const updateStatus = updateClarityAssessmentStatus.bind(null, assessment.id);

  return (
    <Shell>
      <section className="admin-detail-page admin-clarity-detail">
        <Link className="text-link" href="/admin/clarity">← Back to Clarity Checks</Link>
        <div className="admin-detail-head">
          <div>
            <p className="kicker">Clarity Check Detail</p>
            <h1>{assessment.first_name}</h1>
            <p>{assessment.company_name || "Company not provided"} · {assessment.email}</p>
            <p>Submitted {date(assessment.created_at)}</p>
          </div>
          <div>
            <span>Review Status</span>
            <strong>{statusLabel(assessment.review_status)}</strong>
            {assessment.lead_id && <Link className="text-link" href={`/admin/leads/${assessment.lead_id}`}>View Lead →</Link>}
          </div>
        </div>

        <div className="admin-clarity-score-grid">
          <article>
            <span>Overall Clarity Score</span>
            <strong>{assessment.total_score} / 50</strong>
          </article>
          <article>
            <span>Result Band</span>
            <strong>{assessment.result_band}</strong>
          </article>
          <article>
            <span>Recommended Service</span>
            <strong>{assessment.recommended_service}</strong>
          </article>
          <article>
            <span>Primary Gap</span>
            <strong>{assessment.primary_gap}</strong>
          </article>
          <article>
            <span>Strongest Area</span>
            <strong>{categoryLabel(assessment.strongest_category as ClarityCategory)}</strong>
          </article>
        </div>

        <div className="admin-detail-grid">
          <section className="admin-lead-info">
            <p className="kicker">Category Breakdown</p>
            <div className="clarity-category-grid admin-category-grid">
              {categories.map((category) => {
                const score = scoreForCategory(result, category);

                return (
                  <article className={`clarity-category-card clarity-category-${category}`} key={category}>
                    <span>{categoryLabel(category)}</span>
                    <strong>{score} / 10</strong>
                    <i aria-hidden="true">
                      <b style={{ width: `${score * 10}%` }} />
                    </i>
                    <p>{interpretCategory(category, score)}</p>
                  </article>
                );
              })}
            </div>

            <div className="clarity-result-insights admin-clarity-insights">
              <article>
                <p className="kicker">What&apos;s Working</p>
                <h3>{categoryLabel(result.strongestCategory)}</h3>
                <p>{strongestAreaCopy(result.strongestCategory)}</p>
              </article>
              <article>
                <p className="kicker">Where I&apos;d Look First</p>
                <h3>{assessment.primary_gap}</h3>
                <p>{primaryGapCopy(result.weakestCategory)}</p>
              </article>
            </div>

            <div className="clarity-starting-point admin-starting-point">
              <p className="kicker">Recommended Starting Point</p>
              <h3>{assessment.recommended_service}</h3>
              <p>{result.recommendation}</p>
            </div>

            <div className="clarity-priority-grid admin-priority-grid">
              <p className="kicker">Three Priority Recommendations</p>
              {result.priorities.map((priority, index) => (
                <article key={priority.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{priority.title}</h3>
                  <p>{priority.copy}</p>
                </article>
              ))}
            </div>

            <div className="admin-response-list">
              <p className="kicker">How They Answered</p>
              {answers.map((answer) => {
                const question = clarityQuestions.find((item) => item.id === answer.id);

                return (
                  <article className={answer.score <= 2 ? "low-score" : ""} key={answer.id}>
                    <span>{categoryLabel(answer.category)} · {answer.score} / 5</span>
                    <p>{question?.question ?? answer.id}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="admin-edit-form admin-clarity-sidebar">
            <p className="kicker">Review</p>
            <form action={updateStatus}>
              <label>
                Review Status
                <select name="review_status" defaultValue={assessment.review_status}>
                  <option value="unreviewed">Unreviewed</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="follow_up_needed">Follow Up Needed</option>
                </select>
              </label>
              <button className="button" type="submit">Save Status</button>
            </form>

            <div className="admin-crm-connection">
              <p className="kicker">CRM Connection</p>
              {assessment.lead ? (
                <dl>
                  <div><dt>Pipeline Stage</dt><dd>{getStageLabel(assessment.lead.pipeline_stage)}</dd></div>
                  <div><dt>Selected Plan</dt><dd>{getPlanLabel(assessment.lead.selected_plan)}</dd></div>
                  <div><dt>Projected Revenue</dt><dd>{currency(assessment.lead.projected_revenue)}</dd></div>
                  <div><dt>Internal Notes</dt><dd>{assessment.lead.internal_notes || "None yet"}</dd></div>
                </dl>
              ) : (
                <p>No linked CRM lead yet.</p>
              )}
              {assessment.lead_id && <Link className="text-link" href={`/admin/leads/${assessment.lead_id}`}>Open CRM Lead →</Link>}
            </div>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
