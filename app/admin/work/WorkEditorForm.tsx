"use client";

import { useActionState, useMemo, useState } from "react";
import type { WorkContent } from "../../../lib/work-content";
import { createWorkContent, updateWorkContent } from "./editor-actions";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 96);
}

export default function WorkEditorForm({ item }: { item?: WorkContent }) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(item));
  const [contentType, setContentType] = useState<string>(item?.content_type ?? "article");
  const [ctaType, setCtaType] = useState<string>(item?.cta_type ?? "none");
  const action = useMemo(() => (item ? updateWorkContent.bind(null, item.id) : createWorkContent), [item]);
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form className="work-editor-form" action={formAction}>
      {state.error ? <p className="admin-form-error">{state.error}</p> : null}
      <div className="work-editor-grid">
        <label className="wide">Title<input name="title" value={title} onChange={(event) => {
          setTitle(event.target.value);
          if (!slugTouched) setSlug(slugify(event.target.value));
        }} required /></label>
        <label>Slug<input name="slug" value={slug} onChange={(event) => {
          setSlugTouched(true);
          setSlug(slugify(event.target.value));
        }} required /></label>
        <label>Content Type<select name="content_type" value={contentType} onChange={(event) => setContentType(event.target.value)}>
          <option value="case_study">Case Study</option>
          <option value="article">Article</option>
          <option value="tips">Tips</option>
          <option value="field_note">Field Note</option>
          <option value="guide">Guide</option>
        </select></label>
        <label>Status<select name="status" defaultValue={item?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select></label>
        <label>Publish Date<input name="publish_date" type="datetime-local" defaultValue={item?.publish_date ? item.publish_date.slice(0, 16) : ""} /></label>
        <label className="work-check"><input name="is_featured" type="checkbox" defaultChecked={item?.is_featured ?? false} /> Featured / Favorite</label>
        <label className="wide">Subtitle / Excerpt<textarea name="excerpt" rows={3} defaultValue={item?.excerpt ?? ""} /></label>
        <label className="wide">Hero / Featured Image<input name="featured_image" type="file" accept="image/*" /></label>
        {item?.featured_image_url ? <label className="work-check wide"><input name="remove_featured_image" type="checkbox" /> Remove current featured image</label> : null}
        <label className="wide">Body Content<textarea name="body" rows={18} defaultValue={item?.body ?? ""} required placeholder="Paste Markdown here..." /></label>
        <label>SEO Title<input name="seo_title" defaultValue={item?.seo_title ?? ""} /></label>
        <label>Meta Description<textarea name="meta_description" rows={3} defaultValue={item?.meta_description ?? ""} /></label>
        <label>CTA Type<select name="cta_type" value={ctaType} onChange={(event) => setCtaType(event.target.value)}>
          <option value="none">None</option>
          <option value="clarity_check">Clarity Check</option>
          <option value="discovery_call">Book a Discovery Call</option>
          <option value="email">Email Mosaic</option>
          <option value="custom">Custom</option>
        </select></label>
        {ctaType === "custom" ? (
          <>
            <label>CTA Label<input name="cta_label" defaultValue={item?.cta_label ?? ""} /></label>
            <label>CTA URL<input name="cta_url" defaultValue={item?.cta_url ?? ""} /></label>
          </>
        ) : null}
        {contentType === "case_study" ? (
          <>
            <label>Client Name<input name="client_name" defaultValue={item?.client_name ?? ""} /></label>
            <label>Industry<input name="industry" defaultValue={item?.industry ?? ""} /></label>
            <label>Services<input name="services" defaultValue={item?.services?.join(", ") ?? ""} placeholder="Vision, Experience, Connect" /></label>
            <label className="wide">Results / Key Outcomes<textarea name="results" rows={3} defaultValue={item?.results ?? ""} /></label>
          </>
        ) : null}
      </div>
      <button className="button" type="submit" disabled={isPending}>{isPending ? "Saving..." : item ? "Save Work" : "Create Work"} <b>↗</b></button>
    </form>
  );
}
