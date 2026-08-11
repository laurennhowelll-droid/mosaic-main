export type ClarityCategory = "vision" | "experience" | "systems" | "operations" | "growth";

export type ClarityAnswer = {
  id: string;
  category: ClarityCategory;
  score: number;
};

export type ClarityResult = {
  totalScore: number;
  resultBand: "CONNECTED" | "GROWING FRICTION" | "DISCONNECTED" | "REACTIVE";
  visionScore: number;
  experienceScore: number;
  systemsScore: number;
  operationsScore: number;
  growthScore: number;
  strongestCategory: ClarityCategory;
  weakestCategory: ClarityCategory;
  primaryGap: string;
  recommendedService: "Vision" | "Experience" | "Connect" | "Grow" | "Clarity Session";
  recommendation: string;
  priorities: Array<{ title: string; copy: string; category: ClarityCategory }>;
  nextStepHref: string;
};

export const clarityQuestions = [
  {
    id: "vision_direction",
    category: "vision",
    question: "We have a clear direction for where the business is going next.",
  },
  {
    id: "vision_decisions",
    category: "vision",
    question: "Our decisions connect back to a larger business vision.",
  },
  {
    id: "experience_message",
    category: "experience",
    question: "Our website and messaging clearly explain what we do and who we help.",
  },
  {
    id: "experience_journey",
    category: "experience",
    question: "The customer journey feels clear, thoughtful, and easy to move through.",
  },
  {
    id: "systems_tools",
    category: "systems",
    question: "Our tools and platforms work together instead of creating extra work.",
  },
  {
    id: "systems_data",
    category: "systems",
    question: "Important information lives in reliable places and is easy to find.",
  },
  {
    id: "operations_process",
    category: "operations",
    question: "Our internal workflows are documented, repeatable, and not dependent on memory.",
  },
  {
    id: "operations_capacity",
    category: "operations",
    question: "Our team has enough operational clarity to work without constant re-explaining.",
  },
  {
    id: "growth_measurement",
    category: "growth",
    question: "We can see what is working and make improvements with confidence.",
  },
  {
    id: "growth_momentum",
    category: "growth",
    question: "Our website, systems, and operations can support the next stage of growth.",
  },
] as const;

const categoryLabels: Record<ClarityCategory, string> = {
  vision: "Vision",
  experience: "Experience",
  systems: "Systems",
  operations: "Operations",
  growth: "Growth",
};

const gapByCategory: Record<ClarityCategory, string> = {
  vision: "Business direction and decision clarity",
  experience: "Customer experience and website clarity",
  systems: "Connected systems and reliable information",
  operations: "Internal workflow and process clarity",
  growth: "Sustainable growth rhythm and visibility",
};

const serviceByCategory: Record<ClarityCategory, ClarityResult["recommendedService"]> = {
  vision: "Vision",
  experience: "Experience",
  systems: "Connect",
  operations: "Connect",
  growth: "Grow",
};

const hrefByService: Record<ClarityResult["recommendedService"], string> = {
  Vision: "/services/vision",
  Experience: "/services/experience",
  Connect: "/services/connect",
  Grow: "/services/grow",
  "Clarity Session": "/clarity",
};

const recommendationByService: Record<ClarityResult["recommendedService"], string> = {
  Vision:
    "I would start by clarifying the business direction before making another design, software, or operations decision. When the vision is clear, the next investment becomes much easier to choose.",
  Experience:
    "I would look first at how customers understand, trust, and move through the business. A clearer website and customer journey can turn scattered interest into more confident action.",
  Connect:
    "I would look first at the systems and workflows behind the scenes. When information, tools, and process are connected, the business gets calmer and easier to operate.",
  Grow:
    "I would look first at the rhythm of ongoing improvement. The foundation is there, but the business needs consistent attention so momentum does not create new complexity.",
  "Clarity Session":
    "I would start with one focused question rather than a full engagement. A Clarity Session can help you untangle the decision in front of you and leave with practical next steps.",
};

const priorityByCategory: Record<ClarityCategory, string> = {
  vision: "Clarify priorities",
  experience: "Review customer journey",
  systems: "Reduce manual handoffs",
  operations: "Define clear sources of truth",
  growth: "Identify what will break first at higher volume",
};

const priorityCopyByCategory: Record<ClarityCategory, string> = {
  vision: "Your answers suggest it may be worth defining what should happen next before investing in more execution.",
  experience: "One useful next step may be reviewing how clearly people understand, trust, and move through the business.",
  systems: "This may indicate that software overlap, repeated entry, or high-friction workflows deserve a closer look.",
  operations: "One area worth examining is where ownership, documentation, or reporting visibility could be clearer.",
  growth: "Based on this snapshot, it may be useful to look at the processes or bottlenecks most likely to strain under more volume.",
};

const categoryInterpretation: Record<ClarityCategory, (score: number) => string> = {
  vision: (score) =>
    score >= 8 ? "Direction appears relatively clear." : score >= 5 ? "Direction may be present, but some decisions may still feel harder than they should." : "This may be where decisions are carrying the most uncertainty.",
  experience: (score) =>
    score >= 8 ? "The customer-facing experience appears to have useful clarity." : score >= 5 ? "The customer journey may be working, but there may still be places where trust or movement slows down." : "This may suggest the outside experience no longer fully reflects the business.",
  systems: (score) =>
    score >= 8 ? "Your tools and information flow may be supporting the business well." : score >= 5 ? "Some systems may be helping, while others may still create extra effort." : "This may indicate friction around tools, handoffs, or reliable information.",
  operations: (score) =>
    score >= 8 ? "Internal workflows may be relatively steady and repeatable." : score >= 5 ? "Operations may be functioning, but still relying on explanation, memory, or informal process." : "This may suggest internal clarity is where the business is carrying extra weight.",
  growth: (score) =>
    score >= 8 ? "The business may have a strong foundation for continued improvement." : score >= 5 ? "Growth may be possible, but some parts may need more structure before momentum increases." : "This may point to capacity, visibility, or bottlenecks that could limit the next stage.",
};

const strongestInterpretation: Record<ClarityCategory, string> = {
  vision: "Based on your answers, direction may be one of the steadier parts of the business. That clarity can become an anchor for future decisions.",
  experience: "Based on your answers, the customer-facing experience may already have meaningful clarity. That gives the business something solid to build from.",
  systems: "Based on your answers, some of the behind-the-scenes systems may already be supporting the business well. That foundation can make future improvements easier to prioritize.",
  operations: "Based on your answers, internal operations may have more structure than other areas. That steadiness can help the business absorb change with less friction.",
  growth: "Based on your answers, growth readiness may be one of the stronger signals. That suggests there may already be useful momentum to protect and refine.",
};

const gapInterpretation: Record<ClarityCategory, string> = {
  vision: "Your answers suggest the next layer of clarity may be strategic. One place I’d look first is whether priorities, decisions, and investments are all pointing in the same direction.",
  experience: "Your answers suggest the customer-facing experience may deserve a closer look. This may indicate that messaging, website structure, or the path to inquiry could be creating small moments of hesitation.",
  systems: "Your answers suggest systems may be carrying unnecessary friction. One place I’d look first is where information moves manually, tools overlap, or the team has to recreate context.",
  operations: "Your answers suggest operational clarity may be the biggest opportunity. This may indicate that ownership, documentation, reporting, or repeatable process could create more calm inside the business.",
  growth: "Your answers suggest growth may need more support before the next stage. One place I’d look first is what might become fragile if volume, complexity, or team demands increase.",
};

export function categoryLabel(category: ClarityCategory) {
  return categoryLabels[category];
}

export function resultBandLabel(resultBand: ClarityResult["resultBand"]) {
  return resultBand
    .toLowerCase()
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function scoreForCategory(result: ClarityResult, category: ClarityCategory) {
  return {
    vision: result.visionScore,
    experience: result.experienceScore,
    systems: result.systemsScore,
    operations: result.operationsScore,
    growth: result.growthScore,
  }[category];
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
  const scores = {
    vision: 0,
    experience: 0,
    systems: 0,
    operations: 0,
    growth: 0,
  };

  for (const answer of answers) {
    scores[answer.category] += answer.score;
  }

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const sortedCategories = (Object.keys(scores) as ClarityCategory[]).sort((a, b) => scores[a] - scores[b]);
  const weakestCategory = sortedCategories[0];
  const strongestCategory = sortedCategories[sortedCategories.length - 1];
  const recommendedService =
    totalScore >= 40 && scores[weakestCategory] >= 8 ? "Clarity Session" : serviceByCategory[weakestCategory];

  return {
    totalScore,
    resultBand: totalScore >= 40 ? "CONNECTED" : totalScore >= 30 ? "GROWING FRICTION" : totalScore >= 20 ? "DISCONNECTED" : "REACTIVE",
    visionScore: scores.vision,
    experienceScore: scores.experience,
    systemsScore: scores.systems,
    operationsScore: scores.operations,
    growthScore: scores.growth,
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
