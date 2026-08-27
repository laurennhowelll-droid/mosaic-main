import Link from "next/link";
import { Shell } from "../../../components";
import { requireAdmin } from "../../../../lib/supabase/admin";
import { getAdminWorkItem } from "../../../../lib/work-content";
import WorkEditorForm from "../WorkEditorForm";

export const dynamic = "force-dynamic";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const item = await getAdminWorkItem(id);

  return (
    <Shell>
      <section className="admin-detail-page">
        <div className="admin-detail-head">
          <div>
            <p className="kicker">Edit Work</p>
            <h1>{item.title}</h1>
          </div>
          <div className="growth-nav">
            <Link href={`/admin/work/${item.id}/preview`}>Preview →</Link>
            <Link href="/admin/work">Back to Work →</Link>
          </div>
        </div>
        <WorkEditorForm item={item} />
      </section>
    </Shell>
  );
}
