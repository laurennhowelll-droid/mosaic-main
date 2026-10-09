// Server-only copy. Do not import this file from a client component.
import type { LeakId } from "./systems-score-v2";

export type LeakFix = {
  id: LeakId;
  title: string;
  steps: readonly string[];
};

export const leakFixes: Record<LeakId, LeakFix> = {
  "scattered-inquiries": {
    id: "scattered-inquiries",
    title: "Pick one front door.",
    steps: [
      "Choose the one place every inquiry should end up. Usually that's the form on your website or your main business email.",
      "Point everything there: update the contact link on your website, Instagram bio, Facebook page, Google Business Profile, and email signature.",
      "Save a short reply for DMs and texts: \"Thanks so much for reaching out! The fastest way to get a full answer is here: [form link]. It comes straight to me.\"",
      "Once a day, at the same time, move any strays into the front door so nothing lives only in a DM.",
    ],
  },
  "slow-first-response": {
    id: "slow-first-response",
    title: "Set up an instant \"got it\" reply.",
    steps: [
      "Open your form tool or email and find the confirmation/auto-response setting (most form tools have one; in Gmail you can use a template plus a filter for your inquiry address or form notifications).",
      "Write a short reply with three parts: (a) \"Got it, thank you!\" (b) when they'll hear from you personally, like \"by the end of the next business day,\" and (c) one useful next step: your pricing guide, availability link, or FAQ.",
      "Send yourself a test inquiry and read it like a client would.",
      "Block 15 minutes on your calendar once a day to send the personal replies you promised.",
    ],
  },
  "unknown-lead-sources": {
    id: "unknown-lead-sources",
    title: "Ask every inquiry the same question.",
    steps: [
      "Add a required \"How did you hear about us?\" dropdown to your inquiry form. Keep it to 5–7 options (Google, Instagram, referral from a past client, referral from a vendor/partner, directory or listing site, [your other channel], Other).",
      "Add a \"Source\" column to wherever you track clients (spreadsheet, CRM, booking tool).",
      "Backfill your last 10 booked clients from memory or email. It's a rough start, and that's fine.",
      "Look at the column once a month. That's it.",
    ],
  },
  "memory-based-follow-up": {
    id: "memory-based-follow-up",
    title: "Build a one-page follow-up list.",
    steps: [
      "Make one list in the tool you already use: a spreadsheet, your CRM, or a project board. Columns: Name, Date inquired, Stage (New / Talking / Proposal sent / Booked / Not now), Next step, Next step date.",
      "Spend 20 minutes adding every open lead from your inbox and DMs.",
      "Write three saved follow-up messages: a 2-day check-in, a 5-day \"any questions?\", and a 10-day \"should I close your file?\"",
      "Every morning, sort by Next step date and work the top of the list. Every lead always gets a next step date before you move on.",
    ],
  },
  "no-nurture": {
    id: "no-nurture",
    title: "Start a \"Not yet\" list with two scheduled check-ins.",
    steps: [
      "Create a \"Not yet\" label, tag, or tab in the tool you already use (Gmail label, CRM tag, spreadsheet tab).",
      "Go through the last 3–6 months and add anyone who said \"not yet,\" \"maybe later,\" or went quiet after a real conversation.",
      "Write one helpful, no-pressure check-in, something genuinely useful like a tip, a seasonal reminder, or an updated availability note.",
      "Use scheduled send (or a calendar reminder) to send it at about 30 days and again at about 90 days after they went quiet.",
    ],
  },
  "copy-paste-data": {
    id: "copy-paste-data",
    title: "Do a one-week copy-paste audit.",
    steps: [
      "For one week, keep a sticky note or note on your phone. Every time you type client info that already exists somewhere else, jot down: from where → to where.",
      "At the end of the week, circle the one you did most often.",
      "Check whether those two tools already connect: look in each tool's Settings → Integrations (or Apps/Connections). Many common tools have a built-in connection you're already paying for.",
      "If there's no built-in connection, decide which tool is the \"source of truth\" for that info and stop updating it in two places.",
    ],
  },
  "owner-as-glue": {
    id: "owner-as-glue",
    title: "Write down your 3 most common handoffs.",
    steps: [
      "List the three handoffs that happen most often, for example \"booked → kickoff,\" \"deposit paid → scheduling,\" \"job done → invoice + review request.\"",
      "For each one, write: the trigger (what event starts it), who's next, and exactly what they need (info, files, links).",
      "Turn each into a checklist or template in the tool your team already uses (a project template, a shared doc, a task list).",
      "Next time that handoff happens, send the checklist instead of a message from memory, and ask your team to use it without waiting for you.",
    ],
  },
  "tool-sprawl": {
    id: "tool-sprawl",
    title: "Take a 30-minute tool inventory.",
    steps: [
      "Make a simple list of every tool the business uses: name, what it's for, monthly cost, who uses it.",
      "Mark each one: Keep (it does its job), Overlap (another tool does the same thing), or Unsure.",
      "Decide which one tool is the home for client history, the place you'd look first.",
      "Pick one \"Overlap\" tool and stop using it this month (export anything you need first).",
    ],
  },
  "blind-spot-reporting": {
    id: "blind-spot-reporting",
    title: "Start a 5-number Friday check.",
    steps: [
      "Make a sheet with one row per week and five columns: New inquiries, New clients booked, Revenue booked, Outstanding invoices, Top lead source this week.",
      "Every Friday, take 15 minutes and fill in the row from your email, booking tool, and invoicing tool.",
      "Add one formula: Booked ÷ Inquiries = your conversion rate.",
      "After 4 weeks, look at the trend. That's your first real dashboard.",
    ],
  },
  "cant-scale-leads": {
    id: "cant-scale-leads",
    title: "Do the \"double day\" exercise.",
    steps: [
      "Write every step from \"new inquiry\" to \"paid client,\" in order. Aim for 10–20 steps.",
      "Next to each step, mark who does it. Put a star on every step that only you can do right now.",
      "For each starred step, ask: could this be a template, an automation, or someone else's job?",
      "Pick one starred step and make it a template or hand it off this month.",
    ],
  },
};

export function fixesForLeaks(leakIds: readonly string[]) {
  return leakIds.flatMap((id) => {
    const fix = leakFixes[id as LeakId];
    return fix ? [fix] : [];
  });
}
