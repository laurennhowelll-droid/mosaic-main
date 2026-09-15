export type ClarityCategory = "capture" | "follow_up" | "connection" | "visibility";

export type ClarityAnswer = {
  id: string;
  category: ClarityCategory;
  score: number;
};

export type ClarityResultBand = "FOUNDATION" | "WORKAROUNDS" | "PARTIALLY_CONNECTED" | "OPTIMIZE";

export type RecommendedService = "Advisory" | "CRM & Systems" | "Websites & Customer Experience" | "Marketing & Growth";

export type ClarityResult = {
  totalScore: number;
  maxScore: number;
  resultBand: ClarityResultBand;
  captureScore: number;
  followUpScore: number;
  connectionScore: number;
  visibilityScore: number;
  strongestCategory: ClarityCategory;
  weakestCategory: ClarityCategory;
  primaryGap: string;
  recommendedService: RecommendedService;
  recommendation: string;
  priorities: Array<{ title: string; copy: string; category: ClarityCategory }>;
  nextStepHref: string;
};

export const clarityCategories: ClarityCategory[] = ["capture", "follow_up", "connection", "visibility"];

export const clarityQuestions = [
  { id: "capture_central_system", category: "capture", question: "Every new inquiry enters one central system." },
  { id: "capture_lead_source", category: "capture", question: "We can see where each lead came from." },
  { id: "capture_form_context", category: "capture", question: "Our inquiry forms collect the information our team actually needs." },
  { id: "capture_immediate_response", category: "capture", question: "New leads receive an immediate and intentional response." },
  { id: "capture_source_distinction", category: "capture", question: "Leads from ads, organic search, referrals, email, and social media can be distinguished." },
  { id: "follow_stage", category: "follow_up", question: "Every lead has a clear stage and next step." },
  { id: "follow_memory", category: "follow_up", question: "Follow-up does not depend on someone remembering." },
  { id: "follow_owner", category: "follow_up", question: "Our team can see who owns each lead." },
  { id: "follow_nurture", category: "follow_up", question: "We have a process for leads who are not ready to book immediately." },
  { id: "follow_lost_reason", category: "follow_up", question: "We know why leads do not move forward." },
  { id: "connection_tool_sharing", category: "connection", question: "Our website, forms, CRM, booking platform, email, and SMS share information reliably." },
  { id: "connection_no_copying", category: "connection", question: "Customer information does not need to be copied manually between several places." },
  { id: "connection_history", category: "connection", question: "Our team can see a customer's history without checking multiple systems." },
  { id: "connection_handoffs", category: "connection", question: "Internal handoffs are clear and consistent." },
  { id: "connection_automation", category: "connection", question: "Our automations reduce work without making the process harder to understand." },
  { id: "visibility_booked", category: "visibility", question: "We can see how many leads become booked customers." },
  { id: "visibility_revenue_source", category: "visibility", question: "We can connect marketing sources to revenue." },
  { id: "visibility_dashboard", category: "visibility", question: "We have a dashboard showing the numbers that matter." },
  { id: "visibility_reports", category: "visibility", question: "Our reports are updated without repeatedly rebuilding them by hand." },
  { id: "visibility_trust", category: "visibility", question: "We trust the data used to make business decisions." },
  { id: "visibility_capacity", category: "visibility", question: "We know whether our current process could reliably handle more leads." },
] as const;

const categoryLabels: Record<ClarityCategory, string> = {
  capture: "Capture",
  follow_up: "Follow-Up",
  connection: "Connection",
  visibility: "Visibility",
};

const gapByCategory: Record<ClarityCategory, string> = {
  capture: "Lead capture and source tracking",
  follow_up: "Lead follow-up and ownership",
  connection: "Tool connection and customer handoffs",
  visibility: "Reporting, attribution, and growth visibility",
};

const serviceByCategory: Record<ClarityCategory, RecommendedService> = {
  capture: "Websites & Customer Experience",
  follow_up: "CRM & Systems",
  connection: "CRM & Systems",
  visibility: "CRM & Systems",
};

const hrefByService: Record<RecommendedService, string> = {
  Advisory: "/services/inquire/clarity",
  "CRM & Systems": "/services/inquire/systems",
  "Websites & Customer Experience": "/services/inquire/website",
  "Marketing & Growth": "/services/inquire/generate",
};

const recommendationByService: Record<RecommendedService, string> = {
  Advisory: "Start by clarifying the customer journey, systems, and priorities before committing to a build.",
  "CRM & Systems": "Start with the operating layer: CRM structure, follow-up, dashboards, workflows, and integrations.",
  "Websites & Customer Experience": "Start with the path from first interest to inquiry so better leads enter the system cleanly.",
  "Marketing & Growth": "Start with growth only after confirming the capture, follow-up, and visibility path can support more demand.",
};

const priorityByCategory: Record<ClarityCategory, string> = {
  capture: "Create one reliable lead entry point",
  follow_up: "Define stages, owners, and next steps",
  connection: "Reduce manual handoffs between tools",
  visibility: "Build reporting leaders can trust",
};

const priorityCopyByCategory: Record<ClarityCategory, string> = {
  capture: "Look at where inquiries enter the business, what context is collected, and whether lead sources are preserved.",
  follow_up: "Clarify the process that moves a lead from inquiry to booked work, including ownership and stalled-lead recovery.",
  connection: "Identify where customer information is copied, recreated, or lost between website, CRM, booking, email, SMS, and team tools.",
  visibility: "Focus on the numbers needed to connect marketing activity, lead movement, booked work, and revenue.",
};

const categoryInterpretation: Record<ClarityCategory, (score: number) => string> = {
  capture: (score) => score >= 20 ? "Lead capture appears consistent." : score >= 13 ? "Lead capture may work in places, but source context or intake quality may still be uneven." : "Lead capture may be one of the first places to stabilize.",
  follow_up: (score) => score >= 20 ? "Follow-up appears structured and visible." : score >= 13 ? "Follow-up may be happening, but ownership or next steps may still depend on people remembering." : "Follow-up may be carrying too much manual effort and memory.",
  connection: (score) => score >= 20 ? "Tools and handoffs appear relatively connected." : score >= 13 ? "Some systems may be connected while other handoffs still create repeated work." : "Disconnected tools may be creating avoidable friction.",
  visibility: (score) => score >= 24 ? "Reporting may already support confident decisions." : score >= 15 ? "Visibility may exist, but attribution, trust, or reporting speed may still need work." : "Visibility may be the clearest opportunity for better decisions.",
};

const strongestInterpretation: Record<ClarityCategory, string> = {
  capture: "Your answers suggest inquiry capture may be one of the steadier parts of the journey.",
  follow_up: "Your answers suggest the sales or booking process may already have useful structure.",
  connection: "Your answers suggest some of the tools and handoffs may already be supporting the team.",
  visibility: "Your answers suggest the business may already have useful reporting signals to build from.",
};

const gapInterpretation: Record<ClarityCategory, string> = {
  capture: "I would look first at whether every inquiry lands in one place with the right source and context attached.",
  follow_up: "I would look first at stages, ownership, next follow-up, and how leads are handled when they are not ready yet.",
  connection: "I would look first at where tools fail to share information and where the team has to recreate context manually.",
  visibility: "I would look first at whether leadership can connect sources, activity, bookings, revenue, and lost opportunities.",
};

export function categoryLabel(category: ClarityCategory) {
  return categoryLabels[category];
}

export function resultBandLabel(resultBand: ClarityResultBand) {
  return {
    FOUNDATION: "Building the Foundation",
    WORKAROUNDS: "Growing Through Workarounds",
    PARTIALLY_CONNECTED: "Partially Connected",
    OPTIMIZE: "Ready to Optimize",
  }[resultBand];
}

export function scoreForCategory(result: ClarityResult, category: ClarityCategory) {
  return {
    capture: result.captureScore,
    follow_up: result.followUpScore,
    connection: result.connectionScore,
    visibility: result.visibilityScore,
  }[category];
}

export function maxScoreForCategory(category: ClarityCategory) {
  return category === "visibility" ? 30 : 25;
}

export function interpretCategory(category: ClarityCategory, score: number) {
  return categoryInterpretation[category](score);
}

export function strongestAreaCopy(category: ClarityCategory) {
  return strongestInterpretation[category];
}

export function primaryGapCopy(category: ClarityCategory) {
  return gapInterpretation[category];
}

export function calculateClarityResult(answers: ClarityAnswer[]): ClarityResult {
  const scores = { capture: 0, follow_up: 0, connection: 0, visibility: 0 };

  for (const answer of answers) {
    if (answer.category in scores) {
      scores[answer.category] += answer.score;
    }
  }

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const sortedCategories = (Object.keys(scores) as ClarityCategory[]).sort((a, b) => {
    const aRatio = scores[a] / maxScoreForCategory(a);
    const bRatio = scores[b] / maxScoreForCategory(b);
    return aRatio - bRatio;
  });
  const weakestCategory = sortedCategories[0];
  const strongestCategory = sortedCategories[sortedCategories.length - 1];
  const recommendedService = totalScore >= 88 ? "Advisory" : serviceByCategory[weakestCategory];

  return {
    totalScore,
    maxScore: 105,
    resultBand: totalScore >= 88 ? "OPTIMIZE" : totalScore >= 68 ? "PARTIALLY_CONNECTED" : totalScore >= 45 ? "WORKAROUNDS" : "FOUNDATION",
    captureScore: scores.capture,
    followUpScore: scores.follow_up,
    connectionScore: scores.connection,
    visibilityScore: scores.visibility,
    strongestCategory,
    weakestCategory,
    primaryGap: gapByCategory[weakestCategory],
    recommendedService,
    recommendation: recommendationByService[recommendedService],
    priorities: sortedCategories.slice(0, 3).map((category) => ({
      title: priorityByCategory[category],
      copy: priorityCopyByCategory[category],
      category,
    })),
    nextStepHref: hrefByService[recommendedService],
  };
}
