import Link from "next/link";
import { Shell } from "../components";
import { completionPercentage } from "../../lib/business-health-assessment";
import { getPortalAssessment, requireClient } from "../../lib/supabase/client-portal";
import { signOutClient } from "./actions";

function firstName(name: string) {
  return name.split(" ")[0] || name;
}

function statusLabel(status: string | undefined) {
  if (status === "complete") return "Complete";
  if (status === "in_progress") return "In Progress";
  return "Not Started";
}

export default async function ClientPortalPage() {
  const { client, accessToken } = await requireClient();
  const assessment = await getPortalAssessment(client.id, accessToken);
  const percent = completionPercentage(assessment?.answers ?? {});
  const assessmentComplete = assessment?.status === "complete";
  const journey = [
    ["Discovery", "complete"],
    ["Business Health Assessment", assessmentComplete ? "complete" : "current"],
    ["Vision", assessmentComplete ? "current" : "upcoming"],
    ["Roadmap", "upcoming"],
    ["Implementation", "upcoming"],
  ];

  return (
    <Shell>
      <section className="client-page">
        <div className="client-head">
          <div>
            <p className="kicker">Private Workspace</p>
            <h1>Welcome, {firstName(client.primary_contact_name)}.</h1>
            <p>We&apos;re glad you&apos;re here.</p>
          </div>
          <form action={signOutClient}>
            <button className="text-link" type="submit">Sign Out</button>
          </form>
        </div>

        <section className="client-assessment-card">
          <div>
            <p className="kicker">Your First Step</p>
            <h2>Business Health Assessment</h2>
            <p>
              Before we begin your Vision Engagement, we&apos;d like to understand your business more deeply.
            </p>
          </div>
          <div className="client-assessment-meta">
            <span>Status</span>
            <strong>{statusLabel(assessment?.status)}</strong>
            <span>Estimated Time</span>
            <strong>15-20 minutes</strong>
            <i><b style={{ width: `${percent}%` }} /></i>
            <Link className="button" href="/client/assessment">
              {assessment?.status === "in_progress" ? "Continue Assessment →" : assessmentComplete ? "Review Assessment →" : "Begin Assessment →"}
            </Link>
          </div>
        </section>

        <section className="client-journey">
          {journey.map(([label, status]) => (
            <article className={`client-journey-${status}`} key={label}>
              <span>{status === "complete" ? "Complete" : status === "current" ? "Current" : "Upcoming"}</span>
              <strong>{label}</strong>
            </article>
          ))}
        </section>
      </section>
    </Shell>
  );
}
