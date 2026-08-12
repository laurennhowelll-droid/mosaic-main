export type AssessmentQuestionType = "text" | "textarea" | "select" | "multiselect" | "scale";

export type AssessmentQuestion = {
  id: string;
  label: string;
  type: AssessmentQuestionType;
  options?: string[];
  maxSelected?: number;
  final?: boolean;
};

export type AssessmentSection = {
  id: string;
  title: string;
  questions: AssessmentQuestion[];
};

export const assessmentSections: AssessmentSection[] = [
  {
    id: "business",
    title: "Your Business",
    questions: [
      { id: "business_name", label: "Business name", type: "text" },
      { id: "website", label: "Website", type: "text" },
      { id: "industry", label: "Industry", type: "text" },
      { id: "team_size", label: "Team size", type: "select", options: ["Just me", "2-5", "6-15", "16-50", "50+"] },
      { id: "business_description", label: "In a few sentences, what does your business do and who do you serve?", type: "textarea" },
    ],
  },
  {
    id: "today",
    title: "Where You Are Today",
    questions: [
      { id: "revenue_drivers", label: "What products or services currently drive the business?", type: "textarea" },
      {
        id: "goals",
        label: "What are the three biggest goals for the next 12 months?",
        type: "multiselect",
        maxSelected: 3,
        options: [
          "Increase revenue",
          "Improve profitability",
          "Save time",
          "Grow the team",
          "Improve customer experience",
          "Launch a new product/service",
          "Scale operations",
          "Reduce manual work",
          "Improve reporting",
          "Improve internal communication",
          "Other",
        ],
      },
      { id: "six_month_success", label: "If this engagement is successful, what will be noticeably different six months from now?", type: "textarea" },
    ],
  },
  {
    id: "friction",
    title: "Friction",
    questions: [
      {
        id: "friction_areas",
        label: "Where do you currently feel the most friction?",
        type: "multiselect",
        options: [
          "Marketing",
          "Website",
          "Sales",
          "Customer Experience",
          "Operations",
          "Inventory",
          "Automation",
          "Reporting",
          "Hiring",
          "Internal Communication",
          "Documentation",
          "Leadership",
          "Technology",
          "Other",
        ],
      },
      { id: "time_sink", label: "What takes more time than it should?", type: "textarea" },
      { id: "recurring_problem", label: "What recurring problem are you tired of solving?", type: "textarea" },
      { id: "meaning_to_improve", label: "What have you been meaning to improve but haven't had the time, clarity, or expertise to address?", type: "textarea" },
    ],
  },
  {
    id: "systems",
    title: "Systems + Technology",
    questions: [
      {
        id: "tools",
        label: "Which platforms/tools are important to your business today?",
        type: "multiselect",
        options: [
          "Shopify",
          "WordPress",
          "Squarespace",
          "HubSpot",
          "Salesforce",
          "Airtable",
          "Google Workspace",
          "Microsoft 365",
          "QuickBooks",
          "Stripe",
          "Klaviyo",
          "Mailchimp",
          "Zapier",
          "Make",
          "Notion",
          "ClickUp",
          "Asana",
          "Slack",
          "Other",
        ],
      },
      { id: "systems_connection", label: "How well do your systems work together?", type: "select", options: ["Very well", "Mostly well", "Somewhat", "Not very well", "Not at all"] },
      { id: "system_to_improve", label: "If you could replace, improve, or simplify one system tomorrow, what would it be and why?", type: "textarea" },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    questions: [
      { id: "documentation", label: "How documented are your internal processes?", type: "select", options: ["Very documented", "Partially documented", "Very little documentation", "Not documented"] },
      { id: "reporting_confidence", label: "How confident are you in your reporting and business data?", type: "scale", options: ["1", "2", "3", "4", "5"] },
      { id: "missing_information_frequency", label: "How often do you make decisions without having the information you wish you had?", type: "select", options: ["Never", "Occasionally", "Often", "Almost daily"] },
      {
        id: "operations_statement",
        label: "Which statement best describes your current operations?",
        type: "select",
        options: [
          "Things run smoothly.",
          "There are some recurring friction points.",
          "Growth is exposing bottlenecks.",
          "Things work because specific people know how to hold everything together.",
          "We're actively rebuilding how the business operates.",
        ],
      },
    ],
  },
  {
    id: "leadership",
    title: "People + Leadership",
    questions: [
      { id: "single_person_dependency", label: "Where is the business most dependent on one person knowing how something works?", type: "textarea" },
      { id: "attention_drains", label: "What decisions or responsibilities currently take too much of your attention?", type: "textarea" },
      { id: "what_breaks_first", label: "If your business grew significantly over the next year, what do you think would break first?", type: "textarea" },
    ],
  },
  {
    id: "working_together",
    title: "Working Together",
    questions: [
      { id: "why_mosaic", label: "Why did you choose Mosaic?", type: "textarea" },
      { id: "helpful_context", label: "Is there anything about your business, team, or history that would help us understand where you are today?", type: "textarea" },
      { id: "one_thing", label: "If your business could improve only one thing this year, what would make the biggest difference?", type: "textarea", final: true },
    ],
  },
];

export const assessmentQuestionMap = new Map(
  assessmentSections.flatMap((section) => section.questions.map((question) => [question.id, { ...question, section: section.title }])),
);

export function completionPercentage(answers: Record<string, unknown>) {
  const total = assessmentSections.reduce((sum, section) => sum + section.questions.length, 0);
  const complete = assessmentSections.reduce(
    (sum, section) =>
      sum +
      section.questions.filter((question) => {
        const value = answers[question.id];
        return Array.isArray(value) ? value.length > 0 : typeof value === "string" ? value.trim().length > 0 : Boolean(value);
      }).length,
    0,
  );

  return Math.round((complete / total) * 100);
}
