import { BOOKING_URL } from "./site-links";
import { resultsLink } from "./systems-score-access";
import { sectionLabels, sectionOrder, type StoredSystemsScoreV2 } from "./systems-score-v2";

export const systemsScoreFollowUpEmailsEnabled = false;

export function systemsScoreReportEmailEnabled() {
  return process.env.SYSTEMS_SCORE_V2_EMAIL_ENABLED === "true" && Boolean(process.env.RESEND_API_KEY);
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function buildSystemsScoreReportEmail(stored: StoredSystemsScoreV2, firstName: string, token: string) {
  const safeName = escapeHtml(firstName);
  const sections = sectionOrder.map((section) => `<p>${sectionLabels[section]}: ${stored.sections[section].score}/25</p>`).join("");
  const leaks = stored.leaks.map((leak, index) => {
    const href = resultsLink(token, leak.id);
    return `<p>${index + 1}. <a href="${href}">${escapeHtml(leak.name)}</a></p>`;
  }).join("");
  const savedHref = resultsLink(token);

  return {
    from: "Mosaic <reports@buildwithmosaic.co>",
    subject: `Your Mosaic Systems Score: ${stored.overall}/100`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f4f0e9;color:#202124;padding:32px;">
        <div style="max-width:680px;margin:auto;background:#f8f7f3;border:1px solid #ded6ca;padding:32px;">
          <p style="text-transform:uppercase;letter-spacing:2px;color:#555b44;font-size:11px;font-weight:bold;">Mosaic Systems Score</p>
          <p>Hi ${safeName},</p>
          <p>Your Mosaic Systems Score is:</p>
          <h1 style="font-family:Georgia,serif;font-size:42px;">${stored.overall}/100 — ${escapeHtml(stored.tierName)}</h1>
          <p>${escapeHtml(stored.tierDescription)}</p>
          <p>Here's your breakdown:</p>
          ${sections}
          <p><strong>Your three biggest time leaks:</strong></p>
          ${leaks}
          <p>Each link opens the written fix for that leak, along with your saved results.</p>
          <p><a href="${savedHref}" style="display:inline-block;background:#555b44;color:white;padding:13px 18px;text-decoration:none;">SEE YOUR SAVED RESULTS AND FIXES</a></p>
          <p>Want to talk it through instead? Book a free 15-minute Systems Call and I'll walk through your score with you.</p>
          <p><a href="${BOOKING_URL}">Book a free 15-minute Systems Call</a></p>
          <p>Lauren<br />Mosaic</p>
        </div>
      </div>
    `,
  };
}
