const adminEmail = "admin@buildwithmosaic.co";
const fromEmail = "Mosaic <notifications@buildwithmosaic.co>";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithmosaic.co";

export type LeadNotificationInput = {
  type: "clarity_check" | "lead" | "service_inquiry" | "clarity_call" | "resource_download" | "contact";
  name?: string | null;
  businessName?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  selectedService?: string | null;
  supportType?: string | null;
  timeline?: string | null;
  primaryChallenge?: string | null;
  openResponses?: string[];
  clarityScores?: {
    total: number;
    max: number;
    result: string;
    strongest: string;
    gap: string;
    recommendedService: string;
  };
  leadId?: string | null;
  assessmentId?: string | null;
  submittedAt?: Date;
};

function esc(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function text(value?: string | null) {
  return value?.trim() ? value.trim() : "Not provided";
}

function subjectFor(input: LeadNotificationInput) {
  const label = input.businessName || input.name || "Unknown";

  if (input.type === "clarity_check") return `New Mosaic Clarity Check — ${label}`;
  if (input.type === "service_inquiry") return `New Mosaic Service Inquiry — ${input.selectedService || "Service Inquiry"}`;
  if (input.type === "clarity_call") return `New Mosaic Clarity Call Request — ${label}`;
  return `New Mosaic Lead — ${label}`;
}

function row(label: string, value?: string | null) {
  return `<p style="margin:0 0 12px;"><strong>${esc(label)}:</strong> ${esc(text(value))}</p>`;
}

function adminHref(input: LeadNotificationInput) {
  if (input.assessmentId) return `${siteUrl}/admin/clarity/${input.assessmentId}`;
  if (input.leadId) return `${siteUrl}/admin/leads/${input.leadId}`;
  return null;
}

export async function sendLeadNotification(input: LeadNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { attempted: false, accepted: false, reason: "RESEND_API_KEY is not configured." };

  const submittedAt = input.submittedAt ?? new Date();
  const href = adminHref(input);
  const openResponses = input.openResponses?.filter(Boolean) ?? [];
  const clarityScores = input.clarityScores;

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f4f0e9;color:#202124;padding:32px;">
      <div style="max-width:720px;margin:auto;background:#f8f7f3;border:1px solid #ded6ca;padding:32px;">
        <p style="text-transform:uppercase;letter-spacing:2px;color:#555b44;font-size:11px;font-weight:bold;">Mosaic Lead Notification</p>
        <h1 style="font-family:Georgia,serif;font-size:34px;line-height:1.05;margin:0 0 24px;">${esc(subjectFor(input))}</h1>
        ${row("Submission type", input.type.replaceAll("_", " "))}
        ${row("Name", input.name)}
        ${row("Business name", input.businessName)}
        ${row("Email", input.email)}
        ${row("Phone", input.phone)}
        ${row("Website", input.website)}
        ${row("Selected service", input.selectedService)}
        ${row("Consulting, implementation, or both", input.supportType)}
        ${row("Timeline", input.timeline)}
        ${row("Primary challenge", input.primaryChallenge)}
        ${row("Submission date", submittedAt.toISOString())}
        ${clarityScores ? `
          <div style="background:#ece5da;border:1px solid #d7cfc2;padding:18px;margin:24px 0;">
            ${row("Clarity score", `${clarityScores.total} / ${clarityScores.max}`)}
            ${row("Result", clarityScores.result)}
            ${row("Strongest category", clarityScores.strongest)}
            ${row("Primary gap", clarityScores.gap)}
            ${row("Recommended service", clarityScores.recommendedService)}
          </div>
        ` : ""}
        ${openResponses.length ? `
          <div style="margin-top:24px;">
            <h2 style="font-family:Georgia,serif;font-size:24px;margin:0 0 14px;">Open responses</h2>
            ${openResponses.map((item) => `<p style="white-space:pre-line;border-top:1px solid #ded6ca;padding-top:12px;">${esc(item)}</p>`).join("")}
          </div>
        ` : ""}
        ${href ? `<p style="margin-top:28px;"><a href="${esc(href)}" style="display:inline-block;background:#7a8266;color:white;padding:13px 18px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;font-size:12px;">Open admin record</a></p>` : ""}
      </div>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [adminEmail],
      reply_to: input.email ? input.email : undefined,
      subject: subjectFor(input),
      html,
    }),
  });

  if (!response.ok) {
    return { attempted: true, accepted: false, reason: await response.text() };
  }

  const data = (await response.json().catch(() => null)) as { id?: string } | null;
  console.info("Lead notification accepted", {
    type: input.type,
    providerId: data?.id,
    recipient: adminEmail,
  });
  return { attempted: true, accepted: true, providerId: data?.id };
}

export async function logLeadNotificationFailure(context: string, error: unknown) {
  console.error("Lead notification failed", {
    context,
    error: error instanceof Error ? error.message : String(error),
  });
}
