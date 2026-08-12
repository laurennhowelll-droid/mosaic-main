import { Shell } from "../../components";
import { assessmentSections } from "../../../lib/business-health-assessment";
import { getPortalAssessment, requireClient } from "../../../lib/supabase/client-portal";
import AssessmentForm from "./AssessmentForm";

export default async function ClientAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const [{ section }, { client, accessToken }] = await Promise.all([searchParams, requireClient()]);
  const assessment = await getPortalAssessment(client.id, accessToken);
  const requestedSection = Number(section ?? "0");
  const sectionIndex = Number.isInteger(requestedSection)
    ? Math.min(Math.max(requestedSection, 0), assessmentSections.length - 1)
    : 0;

  return (
    <Shell>
      <section className="client-page client-assessment-page">
        <AssessmentForm answers={assessment?.answers ?? {}} sectionIndex={sectionIndex} />
      </section>
    </Shell>
  );
}
