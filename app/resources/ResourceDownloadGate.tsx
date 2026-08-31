"use client";

import { FormEvent, useState } from "react";
import type { Resource } from "./resources";

type DownloadGateProps = {
  resource: Resource;
};

export default function ResourceDownloadGate({ resource }: DownloadGateProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/resource-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          resourceSlug: resource.slug,
          pageUrl: window.location.href,
          referrer: document.referrer,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; filePath?: string; error?: string };

      if (!response.ok || !data.ok || !data.filePath) {
        setStatus("error");
        setMessage(data.error ?? "We couldn't unlock the download. Please try again.");
        return;
      }

      setStatus("success");
      window.open(data.filePath, "_blank", "noopener,noreferrer");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="resource-download-card">
      <p className="kicker">Instant Download</p>
      <h2>Send me the resource.</h2>
      <p>
        Enter your email and the download will open right away. No long form, no extra hoops.
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Name <span>*</span>
          <input
            required
            name="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
          />
        </label>
        <label>
          Email <span>*</span>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
          />
        </label>
        <label>
          Company <span>Optional</span>
          <input
            name="companyName"
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            autoComplete="organization"
          />
        </label>
        <button className="button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Opening..." : `${resource.ctaLabel} →`}
        </button>
      </form>
      {status === "success" && (
        <p className="resource-download-success">
          Download opened. If your browser blocked the new tab,{" "}
          <a href={resource.filePath} target="_blank" rel="noreferrer">
            open it here
          </a>
          .
        </p>
      )}
      {status === "error" && message && <p className="admin-form-error">{message}</p>}
    </div>
  );
}
