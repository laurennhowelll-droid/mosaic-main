"use client";

import { FormEvent, useState } from "react";

type PillarLeadFormProps = {
  pillar: string;
  prompt: string;
};

const timelineOptions = [
  "As soon as possible",
  "Within 30 days",
  "1-3 months",
  "Just exploring",
];

function initialState(pillar: string) {
  return {
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    businessDescription: "",
    problems: "",
    success: "",
    timeline: "",
    source: `service_entry_${pillar}`,
  };
}

export default function PillarLeadForm({ pillar, prompt }: PillarLeadFormProps) {
  const [form, setForm] = useState(initialState(pillar));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateField(name: keyof ReturnType<typeof initialState>, value: string) {
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
      setForm(initialState(pillar));
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="start-form start-form-success" role="status">
        <h3>Thank you.</h3>
        <p>We&apos;ve received your request.</p>
        <p>Lauren will review the problem and reach out if Mosaic can help with a clear next step.</p>
      </div>
    );
  }

  return (
    <form className="start-form pillar-lead-form" onSubmit={handleSubmit} noValidate>
      <div className="start-form-grid">
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
          Your Name <span>*</span>
          <input
            required
            name="contactName"
            value={form.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
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
          Phone
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
          />
        </label>

        <label className="start-form-wide">
          Website
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={(event) => updateField("website", event.target.value)}
            autoComplete="url"
          />
        </label>

        <label className="start-form-wide">
          What does your business do?
          <textarea
            name="businessDescription"
            value={form.businessDescription}
            onChange={(event) => updateField("businessDescription", event.target.value)}
            rows={4}
          />
        </label>

        <label className="start-form-wide">
          {prompt} <span>*</span>
          <textarea
            required
            name="problems"
            value={form.problems}
            onChange={(event) => updateField("problems", event.target.value)}
            rows={7}
          />
        </label>

        <label className="start-form-wide">
          What would feel lighter or better after this is fixed?
          <textarea
            name="success"
            value={form.success}
            onChange={(event) => updateField("success", event.target.value)}
            rows={5}
          />
        </label>

        <label className="start-form-wide">
          Timeline
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
        {status === "loading" ? "Sending..." : "Send My Problem ->"}
      </button>

      {message && (
        <p className={`start-form-message start-form-message-${status}`} role="status">
          {message}
        </p>
      )}
    </form>
  );
}
