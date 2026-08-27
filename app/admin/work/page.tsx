import Link from "next/link";
import { Shell } from "../../components";
import { requireAdmin } from "../../../lib/supabase/admin";
import { formatWorkDate, getAdminWorkContent, getWorkTypeLabel } from "../../../lib/work-content";
import { setWorkPublishState } from "./editor-actions";

export const dynamic = "force-dynamic";

function shortDate(value: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function AdminWorkPage() {
  await requireAdmin();
  const items = await getAdminWorkContent();

  return (
    <Shell>
      <section className="admin-page admin-work-page">
        <div className="admin-head">
          <div>
            <p className="kicker">Mosaic Admin</p>
            <h1>Work.</h1>
          </div>
          <Link className="button" href="/admin/work/new">+ New Work</Link>
        </div>
        <div className="admin-top-nav">
          <Link href="/admin">Leads →</Link>
          <Link href="/admin/growth">Growth Dashboard →</Link>
          <Link href="/admin/clarity">Clarity Checks →</Link>
        </div>

        <div className="admin-table admin-work-table" role="table" aria-label="Mosaic work content">
          <div className="admin-table-head" role="row">
            <span>Title</span>
            <span>Type</span>
            <span>Status</span>
            <span>Featured</span>
            <span>Publish Date</span>
            <span>Updated</span>
            <span>Edit</span>
            <span>Preview</span>
            <span>Publish</span>
          </div>
          {items.map((item) => (
            <div className="admin-table-row" role="row" key={item.id}>
              <span data-label="Title">{item.title}</span>
              <span data-label="Type">{getWorkTypeLabel(item.content_type)}</span>
              <span data-label="Status">{item.status}</span>
              <span data-label="Featured">{item.is_featured ? "Yes" : "No"}</span>
              <span data-label="Publish Date">{formatWorkDate(item.publish_date)}</span>
              <span data-label="Updated">{shortDate(item.updated_at)}</span>
              <Link href={`/admin/work/${item.id}`}>Edit →</Link>
              <Link href={`/admin/work/${item.id}/preview`}>Preview →</Link>
              <form action={setWorkPublishState.bind(null, item.id, item.status !== "published")}>
                <button className="text-link" type="submit">{item.status === "published" ? "Unpublish" : "Publish"}</button>
              </form>
            </div>
          ))}
        </div>

        {items.length === 0 ? <p className="admin-empty">No CMS work has been created yet.</p> : null}
      </section>
    </Shell>
  );
}
