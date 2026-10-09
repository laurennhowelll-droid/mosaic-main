import Link from "next/link";
import { Shell } from "../../../components";
import {
  calculateClarityResult, assessmentDisplay,
  categoryLabel,
  clarityQuestions,
  interpretCategory,
  primaryGapCopy,
  strongestAreaCopy,
  type ClarityAnswer,
  type ClarityCategory,
} from "../../../../lib/clarity-check";
import { getAdminClarityAssessment, getPlanLabel, getStageLabel, getSystemsScoreAccessLinks, type ClarityAssessment } from "../../../../lib/supabase/admin";
import { scoredQuestions, sectionLabels, sectionOrder, type SectionId } from "../../../../lib/systems-score-v2";
import { revokeSystemsScoreAccess, updateClarityAssessmentStatus } from "../../actions";

const categories: ClarityCategory[] = ["capture", "follow_up", "connection", "visibility"];

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
  const display = assessmentDisplay(assessment);
  if (display.version === 2) return <SystemsScoreV2Detail assessment={assessment} display={display} />;
  const answerPayload = assessment.answers as ClarityAnswer[] | { scored?: ClarityAnswer[] };
  const answers = Array.isArray(answerPayload) ? answerPayload : answerPayload.scored ?? [];
  const result = calculateClarityResult(answers);
  const updateStatus = updateClarityAssessmentStatus.bind(null, assessment.id);

  return (
    <Shell>
      <section className="admin-detail-page admin-clarity-detail">
        <Link className="text-link" href="/admin/clarity">← Back to Systems Scores</Link>
        <div className="admin-detail-head">
          <div>
            <p className="kicker">Systems Score Detail</p>
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
            <span>Overall Systems Score</span>
            <strong>{display.overall} / {display.max}</strong>
          </article>
          <article>
            <span>Result Band</span>
            <strong>{display.band}</strong>
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
              {(display.categories ? categories : ["vision", "experience", "systems", "operations", "growth"]).map((key) => {
                const category = key as ClarityCategory;
                const score = display.categories ? display.categories[category] : Number(assessment[`${key}_score` as keyof typeof assessment]);
                const maxScore = display.categories ? 100 : 10;

                return (
                  <article className={`clarity-category-card clarity-category-${category}`} key={category}>
                    <span>{categoryLabel(category)}</span>
                    <strong>{score} / {maxScore}</strong>
                    <i aria-hidden="true">
                      <b style={{ width: `${(score / maxScore) * 100}%` }} />
                    </i>
                    {display.categories && <p>{interpretCategory(category, result[({ capture: "captureScore", follow_up: "followUpScore", connection: "connectionScore", visibility: "visibilityScore" } as const)[category]])}</p>}
                  </article>
                );
              })}
            </div>

            {display.categories && <><div className="clarity-result-insights admin-clarity-insights">
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

            </>}
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

function readV2(answers: unknown) {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) return null;
  const stored = (answers as { systemsScoreV2?: {
    tierDescription: string;
    hoursLost: number;
    hoursLostMonth: number;
    adminHoursBand: string;
    clientValueBand: string;
    answers: number[];
    sections: Record<SectionId, { score: number; status: string }>;
    leaks: Array<{ id: string; name: string; kind: string; resultsDescription: string }>;
  } }).systemsScoreV2;
  if (!stored?.sections || !Array.isArray(stored.leaks) || !Array.isArray(stored.answers)) return null;
  return stored;
}

async function SystemsScoreV2Detail({
  assessment,
  display,
}: {
  assessment: ClarityAssessment;
  display: ReturnType<typeof assessmentDisplay>;
}) {
  const stored = readV2(assessment.answers);
  const links = await getSystemsScoreAccessLinks(assessment.id);
  const updateStatus = updateClarityAssessmentStatus.bind(null, assessment.id);
  const revokeLinks = revokeSystemsScoreAccess.bind(null, assessment.id);
  const activeLinks = links.links.filter((link) => !link.revoked_at);

  return (
    <Shell>
      <section className="admin-detail-page admin-clarity-detail">
        <Link className="text-link" href="/admin/clarity">← Back to Systems Scores</Link>
        <div className="admin-detail-head">
          <div>
            <p className="kicker">Systems Score v2</p>
            <h1>{assessment.first_name}</h1>
            <p>{assessment.company_name || "Company not provided"} · {assessment.email}</p>
            <p>Submitted {date(assessment.created_at)}</p>
          </div>
          <div>
            <span>Report email</span>
            <strong>{assessment.email_sent_at ? `Sent ${date(assessment.email_sent_at)}` : "Not sent"}</strong>
            {assessment.lead_id && <Link className="text-link" href={`/admin/leads/${assessment.lead_id}`}>View Lead →</Link>}
          </div>
        </div>

        <div className="admin-clarity-score-grid">
          <article>
            <span>Overall Systems Score</span>
            <strong>{display.overall} / {display.max}</strong>
          </article>
          <article>
            <span>Tier</span>
            <strong>{display.band}</strong>
          </article>
          <article>
            <span>Top Leak</span>
            <strong>{display.topLeak ?? assessment.primary_gap}</strong>
          </article>
          <article>
            <span>Weakest Section</span>
            <strong>{categoryLabel(display.lowest as ClarityCategory)}</strong>
          </article>
          <article>
            <span>Strongest Section</span>
            <strong>{categoryLabel(display.strongest as ClarityCategory)}</strong>
          </article>
        </div>

        <div className="admin-detail-grid">
          <section className="admin-lead-info">
            <p className="kicker">Section Scores</p>
            <div className="clarity-category-grid admin-category-grid">
              {sectionOrder.map((section) => {
                const score = stored?.sections[section].score ?? display.categories?.[section] ?? 0;
                return (
                  <article className={`clarity-category-card clarity-category-${section}`} key={section}>
                    <span>{sectionLabels[section]}</span>
                    <strong>{score} / 25</strong>
                    <i aria-hidden="true"><b style={{ width: `${(score / 25) * 100}%` }} /></i>
                    {stored && <p>{stored.sections[section].status}</p>}
                  </article>
                );
              })}
            </div>

            {stored && (
              <>
                <p>{stored.tierDescription}</p>
                <div className="admin-response-list">
                  <p className="kicker">Top Leaks</p>
                  {stored.leaks.map((leak, index) => (
                    <article key={leak.id}>
                      <span>{index + 1}. {leak.kind === "tune-up" ? "Tune-up" : "Leak"}</span>
                      <p><strong>{leak.name}.</strong> {leak.resultsDescription}</p>
                    </article>
                  ))}
                </div>
                <p>Hypothetical hours: {stored.hoursLost} a week, {stored.hoursLostMonth} a month. Admin hours: {stored.adminHoursBand}. Client value: {stored.clientValueBand}.</p>
                <div className="admin-response-list">
                  <p className="kicker">How They Answered</p>
                  {stored.answers.map((score, index) => (
                    <article className={score <= 2 ? "low-score" : ""} key={scoredQuestions[index]?.id ?? index}>
                      <span>{sectionLabels[scoredQuestions[index].section]} · {score} / 4</span>
                      <p>{scoredQuestions[index].prompt}</p>
                    </article>
                  ))}
                </div>
              </>
            )}
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
              <p className="kicker">Private Links</p>
              {links.available ? (
                <>
                  {links.links.length === 0 && <p>No private links yet. A link is created when the report email is sent.</p>}
                  {links.links.map((link) => (
                    <p key={link.id}>{link.revoked_at ? "Revoked" : "Active"} · created {date(link.created_at)}{link.last_used_at ? ` · last opened ${date(link.last_used_at)}` : ""}</p>
                  ))}
                  {activeLinks.length > 0 && (
                    <form action={revokeLinks}>
                      <button className="secondary-button" type="submit">Revoke access links</button>
                    </form>
                  )}
                </>
              ) : (
                <p>Private links appear after the SQL update in supabase/systems-score-v2.sql.</p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
