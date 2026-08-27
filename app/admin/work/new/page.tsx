import Link from "next/link";
import { Shell } from "../../../components";
import { requireAdmin } from "../../../../lib/supabase/admin";
import WorkEditorForm from "../WorkEditorForm";

export default async function NewWorkPage() {
  await requireAdmin();

  return (
    <Shell>
      <section className="admin-detail-page">
        <div className="admin-detail-head">
          <div>
            <p className="kicker">New Work</p>
            <h1>Create a piece.</h1>
          </div>
          <Link className="text-link" href="/admin/work">Back to Work</Link>
        </div>
        <WorkEditorForm />
      </section>
    </Shell>
  );
}
