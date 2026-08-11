"use client";

import { FormEvent, useState } from "react";

const timelineOptions = [
  "Immediately",
  "Within 30 days",
  "1-3 months",
  "Just exploring",
];

const initialState = {
  contactName: "",
  companyName: "",
  email: "",
  website: "",
  problems: "",
  timeline: "",
  source: "clarity_session",
};

export default function ClarityForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateField(name: keyof typeof initialState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Please check the form and try again.");
        return;
      }

      setStatus("success");
      setForm(initialState);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="start-form start-form-success" role="status">
        <h3>Thank you.</h3>
        <p>We&apos;ve received your Clarity Session request.</p>
        <p>Every submission is personally reviewed.</p>
        <p>We&apos;ll reach out with next steps if the session is the right fit.</p>
      </div>
    );
  }

  return (
    <form className="start-form" onSubmit={handleSubmit} noValidate>
      <div className="start-form-grid">
        <label>
          Name <span>*</span>
          <input
            required
            name="contactName"
            value={form.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
            autoComplete="name"
          />
        </label>

        <label>
          Company <span>*</span>
          <input
            required
            name="companyName"
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            autoComplete="organization"
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
          Website <span>Optional</span>
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={(event) => updateField("website", event.target.value)}
            autoComplete="url"
          />
        </label>

        <label className="start-form-wide">
          Describe your question <span>*</span>
          <textarea
            required
            name="problems"
            value={form.problems}
            onChange={(event) => updateField("problems", event.target.value)}
            rows={7}
          />
        </label>

        <label className="start-form-wide">
          Preferred timeline
          <select
            name="timeline"
            value={form.timeline}
            onChange={(event) => updateField("timeline", event.target.value)}
          >
            <option value="">Choose a timeline</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button className="button" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Book a Clarity Session →"}
      </button>

      {message && (
        <p className={`start-form-message start-form-message-${status}`} role="status">
          {message}
        </p>
      )}
    </form>
  );
}
