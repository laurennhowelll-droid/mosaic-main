"use client";

import { FormEvent, useState } from "react";

const budgetOptions = [
  ["$2,500–$5,000", "$2,500–5,000"],
  ["$5,000–$10,000", "$5,000–10,000"],
  ["$10,000–$20,000", "$10,000–20,000"],
  ["$20,000+", "$20,000+"],
  ["Not sure yet", "Not sure yet"],
];

const timelineOptions = [
  "Immediately",
  "Within 30 days",
  "1–3 months",
  "Just exploring",
];

const initialState = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  businessDescription: "",
  problems: "",
  success: "",
  budget: "",
  timeline: "",
};

export default function StartVisionForm() {
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
        <p>We&apos;ve received your Discovery Call request.</p>
        <p>Every submission is personally reviewed.</p>
        <p>
          If we believe Mosaic may be a good fit, we&apos;ll reach out with the next step for a complimentary Discovery Call.
        </p>
        <p>We&apos;re excited to learn more about what you&apos;re building.</p>
      </div>
    );
  }

  return (
    <form className="start-form" onSubmit={handleSubmit} noValidate>
      <div className="start-form-grid">
        <label>
          Company Name <span>*</span>
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
          What does your business do? <span>*</span>
          <textarea
            required
            name="businessDescription"
            value={form.businessDescription}
            onChange={(event) => updateField("businessDescription", event.target.value)}
            rows={4}
          />
        </label>

        <label className="start-form-wide">
          What feels disconnected? <span>*</span>
          <textarea
            required
            name="problems"
            value={form.problems}
            onChange={(event) => updateField("problems", event.target.value)}
            placeholder={"What's taking too much time?\n\nWhere are things getting messy?\n\nWhat's frustrating you?\n\nWhere do you think your business could work better?"}
            rows={9}
          />
        </label>

        <label className="start-form-wide">
          What would success look like six months from now? <span>*</span>
          <textarea
            required
            name="success"
            value={form.success}
            onChange={(event) => updateField("success", event.target.value)}
            rows={7}
          />
        </label>

        <label className="start-form-wide">
          Budget <span>*</span>
          <select
            required
            name="budget"
            value={form.budget}
            onChange={(event) => updateField("budget", event.target.value)}
          >
            <option value="">Choose a range</option>
            {budgetOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="start-form-wide">
          Timeline <span>Optional</span>
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
        {status === "loading" ? "Sending..." : "Send Request →"}
      </button>

      {message && (
        <p className={`start-form-message start-form-message-${status}`} role="status">
          {message}
        </p>
      )}
    </form>
  );
}
