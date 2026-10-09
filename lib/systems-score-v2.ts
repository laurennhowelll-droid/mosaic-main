export type SectionId = "capture" | "follow_up" | "connection" | "visibility";

export type LeakId =
  | "scattered-inquiries"
  | "slow-first-response"
  | "unknown-lead-sources"
  | "memory-based-follow-up"
  | "no-nurture"
  | "copy-paste-data"
  | "owner-as-glue"
  | "tool-sprawl"
  | "blind-spot-reporting"
  | "cant-scale-leads";

export type SectionStatus = "Leaking" | "Shaky" | "Solid";

export type TierName = "Running on You" | "Patched Together" | "Mostly Connected" | "Running Like a System";

export const sectionOrder: SectionId[] = ["capture", "follow_up", "connection", "visibility"];

export const sectionLabels: Record<SectionId, string> = {
  capture: "Capture",
  follow_up: "Follow-Up",
  connection: "Connection",
  visibility: "Visibility",
};

export const sectionDescriptions: Record<SectionId, string> = {
  capture: "how inquiries come in and get answered",
  follow_up: "how leads move toward a yes",
  connection: "how your tools and people pass work along",
  visibility: "how you know what's working",
};

const weakestSectionOrder: SectionId[] = ["follow_up", "capture", "connection", "visibility"];

export const scoredQuestions = [
  {
    id: "q1",
    section: "capture",
    leakId: "scattered-inquiries",
    prompt: "When a new inquiry comes in, where does it land?",
    options: [
      "All over the place: email, DMs, texts, voicemail, my personal phone",
      "A few different places, and I try to check them all",
      "Mostly one place, with a few strays",
      "One place, every time",
    ],
  },
  {
    id: "q2",
    section: "capture",
    leakId: "slow-first-response",
    prompt: "How fast does a new inquiry usually hear back from you?",
    options: [
      "Whenever I get to it, sometimes a few days",
      "Same day, if it's a good day",
      "Within a few hours",
      "Within minutes, even if it's an automatic reply that tells them what's next",
    ],
  },
  {
    id: "q3",
    section: "capture",
    leakId: "unknown-lead-sources",
    prompt: "Do you know how most of your best clients found you?",
    options: [
      "Not really",
      "I have a hunch",
      "I ask, but it isn't written down anywhere",
      "Yes, it's captured on every inquiry",
    ],
  },
  {
    id: "q4",
    section: "follow_up",
    leakId: "memory-based-follow-up",
    prompt: "If you took a week off, would follow-ups still happen?",
    options: [
      "No, they'd stop until I got back",
      "Some would, if someone remembered",
      "Mostly, because someone covers for me",
      "Yes, the system sends them or reminds the right person",
    ],
  },
  {
    id: "q5",
    section: "follow_up",
    leakId: "memory-based-follow-up",
    prompt: "Right now, could you say where every open lead stands and what happens next?",
    options: [
      "I'd have to dig through my email and my head",
      "Roughly, for the big ones",
      "Mostly. There's a list, but it's not always current",
      "Yes. Every lead has a stage and a next step in one place",
    ],
  },
  {
    id: "q6",
    section: "follow_up",
    leakId: "no-nurture",
    prompt: "What happens to people who say \"not yet\" or go quiet?",
    options: [
      "Honestly, they're gone",
      "I mean to check back in, but I rarely do",
      "I reach out once or twice by hand",
      "They get helpful, planned check-ins without me having to remember",
    ],
  },
  {
    id: "q7",
    section: "connection",
    leakId: "copy-paste-data",
    prompt: "How often do you type the same information into more than one place (names, dates, prices, addresses)?",
    options: [
      "Constantly",
      "Several times a week",
      "Now and then",
      "Almost never. It flows through on its own",
    ],
  },
  {
    id: "q8",
    section: "connection",
    leakId: "owner-as-glue",
    prompt: "When work moves to the next step or person (inquiry → booked → in progress → done), how do they know?",
    options: [
      "They ask me",
      "I send a message when I remember",
      "There's a checklist, but I still nudge people",
      "The system tells them, with what they need",
    ],
  },
  {
    id: "q9",
    section: "connection",
    leakId: "tool-sprawl",
    prompt: "When you need a client's full story (emails, payments, notes, files), how many places do you check?",
    options: [
      "Four or more, or I'm not sure",
      "Three",
      "Two",
      "One",
    ],
  },
  {
    id: "q10",
    section: "visibility",
    leakId: "blind-spot-reporting",
    prompt: "Do you know roughly what share of inquiries turn into paying clients?",
    options: [
      "No idea",
      "A gut guess",
      "I could work it out with an afternoon of digging",
      "Yes, I see it regularly",
    ],
  },
  {
    id: "q11",
    section: "visibility",
    leakId: "blind-spot-reporting",
    prompt: "How do you check how the business is doing this month?",
    options: [
      "I look at my bank balance",
      "I pull numbers by hand when I have to",
      "A spreadsheet I update myself",
      "A dashboard that updates on its own, and I trust it",
    ],
  },
  {
    id: "q12",
    section: "visibility",
    leakId: "cant-scale-leads",
    prompt: "If inquiries doubled next month, what would happen?",
    options: [
      "Things would break and balls would drop",
      "I'd be working nights and weekends",
      "It'd be tight, but we'd manage",
      "The system would handle it. I'd just need more hands for the actual work",
    ],
  },
] as const;

export const adminHourOptions = [
  { id: "under-2", label: "Under 2 hours", value: 1.5 },
  { id: "2-5", label: "2–5 hours", value: 3.5 },
  { id: "5-10", label: "5–10 hours", value: 7.5 },
  { id: "10-20", label: "10–20 hours", value: 15 },
  { id: "over-20", label: "More than 20 hours", value: 20 },
] as const;

export const clientValueOptions = [
  { id: "under-500", label: "Under $500", value: 250 },
  { id: "500-2000", label: "$500–$2,000", value: 1000 },
  { id: "2000-5000", label: "$2,000–$5,000", value: 3000 },
  { id: "5000-10000", label: "$5,000–$10,000", value: 7500 },
  { id: "over-10000", label: "More than $10,000", value: 10000 },
  { id: "unsure", label: "I'm not sure", value: null },
] as const;

export const leaks = [
  {
    id: "scattered-inquiries",
    name: "Scattered Inquiries",
    section: "capture",
    questionIndexes: [0],
    tieBreak: 2,
    resultsDescription: "New inquiries land in too many places: email, DMs, texts. So some wait, and a few slip through without anyone noticing.",
  },
  {
    id: "slow-first-response",
    name: "Slow First Response",
    section: "capture",
    questionIndexes: [1],
    tieBreak: 1,
    resultsDescription: "New inquiries wait on you to reply. While they wait, they're still shopping, and the business that answers first often gets the conversation.",
  },
  {
    id: "unknown-lead-sources",
    name: "Unknown Lead Sources",
    section: "capture",
    questionIndexes: [2],
    tieBreak: 9,
    resultsDescription: "You're not sure which channels bring your best clients, so time and money get spread across everything instead of what's working.",
  },
  {
    id: "memory-based-follow-up",
    name: "Memory-Based Follow-Up",
    section: "follow_up",
    questionIndexes: [3, 4],
    tieBreak: 0,
    resultsDescription: "Follow-up happens when you remember. If you're busy, sick, or on vacation, leads quietly stall, and it's hard to see which ones.",
  },
  {
    id: "no-nurture",
    name: "No Nurture for Not-Ready Leads",
    section: "follow_up",
    questionIndexes: [5],
    tieBreak: 5,
    resultsDescription: "People who say \"not yet\" or go quiet mostly disappear. Some of them were good fits who just weren't ready yet.",
  },
  {
    id: "copy-paste-data",
    name: "Copy-Paste Data",
    section: "connection",
    questionIndexes: [6],
    tieBreak: 4,
    resultsDescription: "You're re-typing the same names, dates, and numbers into more than one tool. It's slow, it's boring, and it's where small mistakes sneak in.",
  },
  {
    id: "owner-as-glue",
    name: "Owner-as-Glue Handoffs",
    section: "connection",
    questionIndexes: [7],
    tieBreak: 3,
    resultsDescription: "When work moves from one step or person to the next, it moves through you. You're the glue, so when you're busy, everything waits.",
  },
  {
    id: "tool-sprawl",
    name: "Tool Sprawl",
    section: "connection",
    questionIndexes: [8],
    tieBreak: 6,
    resultsDescription: "Client information is spread across too many tools, so answering one simple question means opening three tabs and hoping it's all up to date.",
  },
  {
    id: "blind-spot-reporting",
    name: "Blind Spot Reporting",
    section: "visibility",
    questionIndexes: [9, 10],
    tieBreak: 7,
    resultsDescription: "You don't have a quick, trustworthy view of how the business is doing, so decisions get made on gut feel and bank balance.",
  },
  {
    id: "cant-scale-leads",
    name: "Can't Scale Leads",
    section: "visibility",
    questionIndexes: [11],
    tieBreak: 8,
    resultsDescription: "Your current setup works at today's volume, but more leads would mean more hours from you, not more room to grow.",
  },
] as const satisfies ReadonlyArray<{
  id: LeakId;
  name: string;
  section: SectionId;
  questionIndexes: readonly number[];
  tieBreak: number;
  resultsDescription: string;
}>;

const tiers: Array<{ min: number; name: TierName; description: string }> = [
  {
    min: 85,
    name: "Running Like a System",
    description: "Your business mostly runs without you in the middle. Now it's about fine-tuning and room to grow.",
  },
  {
    min: 65,
    name: "Mostly Connected",
    description: "Your foundation is solid. A few leaks are quietly costing you time and leads.",
  },
  {
    min: 40,
    name: "Patched Together",
    description: "Some good pieces are in place, but the gaps between them still land on you.",
  },
  {
    min: 0,
    name: "Running on You",
    description: "Your business works because you hold it together. That's impressive, and it's also why it's exhausting.",
  },
];

export type RankedLeak = {
  id: LeakId;
  name: string;
  section: SectionId;
  score: number;
  kind: "leak" | "tune-up";
  resultsDescription: string;
};

export type SystemsScoreV2 = {
  overall: number;
  tierName: TierName;
  tierDescription: string;
  sections: Record<SectionId, { score: number; status: SectionStatus }>;
  weakestSection: SectionId;
  leaks: RankedLeak[];
  hasTrueLeak: boolean;
  hoursLost: number;
  hoursLostMonth: number;
  clientValue: number | null;
  yearlyRisk: number | null;
};

export function sectionScore(rawPoints: number) {
  if (!Number.isInteger(rawPoints) || rawPoints < 3 || rawPoints > 12) {
    throw new Error("Section raw points must be an integer from 3 to 12.");
  }
  return Math.round(((rawPoints - 3) / 9) * 25);
}

export function sectionStatus(score: number): SectionStatus {
  if (score <= 10) return "Leaking";
  if (score <= 18) return "Shaky";
  return "Solid";
}

export function tierFor(score: number) {
  const tier = tiers.find((item) => score >= item.min);
  if (!tier || score < 0 || score > 100) throw new Error("Overall score must be from 0 to 100.");
  return tier;
}

export function roundToHalfHour(value: number) {
  return Math.round((value + Number.EPSILON) * 2) / 2;
}

export function estimateHours(adminHours: number, overall: number, hasTrueLeak: boolean) {
  const hoursLost = roundToHalfHour((adminHours * (100 - overall)) / 100);
  const floored = hasTrueLeak && hoursLost < 1 ? 1 : hoursLost;
  return { hoursLost: floored, hoursLostMonth: Math.round(floored * 4) };
}

function leakScore(indexes: readonly number[], answers: number[]) {
  const values = indexes.map((index) => answers[index]);
  return Math.min(...values);
}

function compareLeaks(a: { score: number; tieBreak: number }, b: { score: number; tieBreak: number }) {
  return a.score - b.score || a.tieBreak - b.tieBreak;
}

export function rankLeaks(answers: number[]): RankedLeak[] {
  const scored = leaks.map((leak) => ({
    id: leak.id,
    name: leak.name,
    section: leak.section,
    score: leakScore(leak.questionIndexes, answers),
    tieBreak: leak.tieBreak,
    resultsDescription: leak.resultsDescription,
  }));
  const trueLeaks = scored.filter((leak) => leak.score >= 1 && leak.score <= 3).sort(compareLeaks);
  const tuneUps = scored.filter((leak) => leak.score === 4).sort(compareLeaks);
  const ranked = [
    ...trueLeaks.map((leak) => ({ ...leak, kind: "leak" as const })),
    ...tuneUps.map((leak) => ({ ...leak, kind: "tune-up" as const })),
  ];
  return ranked.slice(0, 3).map((leak) => ({
    id: leak.id,
    name: leak.name,
    section: leak.section,
    score: leak.score,
    kind: leak.kind,
    resultsDescription: leak.resultsDescription,
  }));
}

export function scoreSystemsScore(input: {
  answers: number[];
  adminHours: number;
  clientValue: number | null;
}): SystemsScoreV2 {
  const { answers, adminHours, clientValue } = input;
  if (answers.length !== 12 || answers.some((answer) => !Number.isInteger(answer) || answer < 1 || answer > 4)) {
    throw new Error("Systems Score v2 requires 12 answers from 1 to 4.");
  }
  if (!adminHourOptions.some((option) => option.value === adminHours)) {
    throw new Error("Admin hours must use a listed estimate value.");
  }
  if (clientValue !== null && !clientValueOptions.some((option) => option.value === clientValue)) {
    throw new Error("Client value must use a listed estimate value or be omitted.");
  }

  const sections = Object.fromEntries(sectionOrder.map((section) => {
    const raw = answers.reduce((sum, answer, index) => scoredQuestions[index].section === section ? sum + answer : sum, 0);
    const score = sectionScore(raw);
    return [section, { score, status: sectionStatus(score) }];
  })) as SystemsScoreV2["sections"];

  const overall = sectionOrder.reduce((sum, section) => sum + sections[section].score, 0);
  const lowest = Math.min(...sectionOrder.map((section) => sections[section].score));
  const weakestSection = weakestSectionOrder.find((section) => sections[section].score === lowest);
  if (!weakestSection) throw new Error("Unable to resolve the weakest section.");

  const ranked = rankLeaks(answers);
  const hasTrueLeak = ranked.some((leak) => leak.kind === "leak") || leaks.some((leak) => {
    const score = leakScore(leak.questionIndexes, answers);
    return score >= 1 && score <= 3;
  });
  const hours = estimateHours(adminHours, overall, hasTrueLeak);
  const tier = tierFor(overall);

  return {
    overall,
    tierName: tier.name,
    tierDescription: tier.description,
    sections,
    weakestSection,
    leaks: ranked,
    hasTrueLeak,
    hoursLost: hours.hoursLost,
    hoursLostMonth: hours.hoursLostMonth,
    clientValue,
    yearlyRisk: clientValue === null ? null : clientValue * 4,
  };
}

export function formatHours(value: number) {
  const amount = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${amount} ${value === 1 ? "hour" : "hours"}`;
}

export function formatDollars(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

const strongestSectionOrder: SectionId[] = ["visibility", "connection", "capture", "follow_up"];

export function strongestSection(sections: Record<SectionId, { score: number }>): SectionId {
  const highest = Math.max(...sectionOrder.map((section) => sections[section].score));
  const strongest = strongestSectionOrder.find((section) => sections[section].score === highest);
  if (!strongest) throw new Error("Unable to resolve the strongest section.");
  return strongest;
}

export type StoredSystemsScoreV2 = {
  version: 2;
  submissionId: string;
  overall: number;
  tierName: TierName;
  tierDescription: string;
  sections: SystemsScoreV2["sections"];
  weakestSection: SectionId;
  strongestSection: SectionId;
  leaks: RankedLeak[];
  hoursLost: number;
  hoursLostMonth: number;
  clientValue: number | null;
  yearlyRisk: number | null;
  adminHoursBand: string;
  clientValueBand: string;
  answers: number[];
};

export function bandLabelForAdminHours(value: number) {
  return adminHourOptions.find((option) => option.value === value)?.label ?? "";
}

export function bandLabelForClientValue(value: number | null) {
  return clientValueOptions.find((option) => option.value === value)?.label ?? "";
}

export function buildStoredSystemsScore(input: {
  submissionId: string;
  answers: number[];
  adminHours: number;
  clientValue: number | null;
}): StoredSystemsScoreV2 {
  const result = scoreSystemsScore(input);
  return {
    version: 2,
    submissionId: input.submissionId,
    overall: result.overall,
    tierName: result.tierName,
    tierDescription: result.tierDescription,
    sections: result.sections,
    weakestSection: result.weakestSection,
    strongestSection: strongestSection(result.sections),
    leaks: result.leaks,
    hoursLost: result.hoursLost,
    hoursLostMonth: result.hoursLostMonth,
    clientValue: result.clientValue,
    yearlyRisk: result.yearlyRisk,
    adminHoursBand: bandLabelForAdminHours(input.adminHours),
    clientValueBand: bandLabelForClientValue(input.clientValue),
    answers: input.answers,
  };
}

export function readStoredSystemsScore(answers: unknown): StoredSystemsScoreV2 | null {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) return null;
  const record = answers as { version?: unknown; systemsScoreV2?: StoredSystemsScoreV2 };
  const stored = record.systemsScoreV2;
  if (record.version !== 2 || !stored || stored.version !== 2 || typeof stored.overall !== "number" || typeof stored.tierName !== "string" || !stored.sections || !Array.isArray(stored.leaks)) {
    return null;
  }
  return stored;
}

export function emailDeliveryPlan(emailSentAt: string | null, enabled: boolean) {
  if (emailSentAt) return "already_sent" as const;
  if (!enabled) return "disabled" as const;
  return "send" as const;
}
