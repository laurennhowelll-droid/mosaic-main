"use client";

import { FormEvent, useState } from "react";

const budgetOptions = [
  "$2,500–$5,000",
  "$5,000–$10,000",
  "$10,000–$20,000",
  "$20,000+",
  "Not sure yet",
];

const initialState = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  problems: "",
  budget: "",
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
      setMessage(
        "Thank you. We’ll review what you shared and reach out with the clearest next step.",
      );
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form className="start-form" onSubmit={handleSubmit} noValidate>
      <div className="start-form-grid">
        <label>
          Company <span>Required</span>
          <input
            required
            name="companyName"
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            autoComplete="organization"
          />
        </label>

        <label>
          Your Name <span>Required</span>
          <input
            required
            name="contactName"
            value={form.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
            autoComplete="name"
          />
        </label>

        <label>
          Email <span>Required</span>
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
          What feels disconnected? <span>Required</span>
          <textarea
            required
            name="problems"
            value={form.problems}
            onChange={(event) => updateField("problems", event.target.value)}
            placeholder="Tell us what feels messy, manual, unclear, or harder than it should be."
            rows={7}
          />
        </label>

        <label className="start-form-wide">
          Approximate Budget <span>Required</span>
          <select
            required
            name="budget"
            value={form.budget}
            onChange={(event) => updateField("budget", event.target.value)}
          >
            <option value="">Choose a range</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button className="button" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Start With Vision →"}
      </button>

      {message && (
        <p className={`start-form-message start-form-message-${status}`} role="status">
          {message}
        </p>
      )}
    </form>
  );
}
