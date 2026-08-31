export type Resource = {
  title: string;
  slug: string;
  eyebrow: string;
  shortDescription: string;
  longDescription: string;
  estimatedTime: string;
  category: string;
  filePath: string;
  ctaLabel: string;
  secondaryCta?: {
    label: string;
    href: string;
  };
  featured: boolean;
  librarySupportingCopy: string;
  focusLabel: string;
  focusItems: string[];
  callout?: {
    eyebrow?: string;
    title?: string;
    body: string[];
  };
  metaDescription: string;
};

export const RESOURCE_FILE_BASE_PATH = "/brand";

export const resources = [
  {
    title: "The 10-Minute Business Friction Audit",
    slug: "friction",
    eyebrow: "Business Clarity",
    shortDescription: "Find the things making your business harder than it needs to be.",
    longDescription:
      "Little workarounds, repeated tasks, unanswered questions, and \"that's just how we do it\" moments add up. This audit helps you step back and see where friction is hiding in the business.",
    estimatedTime: "10 minutes",
    category: "Business Clarity",
    filePath: `${RESOURCE_FILE_BASE_PATH}/The 10-Minute Business Friction Audit.pdf`,
    ctaLabel: "Open the Audit",
    secondaryCta: {
      label: "All resources",
      href: "/resources",
    },
    featured: true,
    librarySupportingCopy:
      "A quick diagnostic for spotting repeated manual work, customer confusion, owner dependency, disconnected tools, reporting blind spots, undocumented processes, and bottlenecks.",
    focusLabel: "What you'll look at",
    focusItems: [
      "Repeated manual work",
      "Duplicate data entry",
      "Customer confusion",
      "Owner dependency",
      "Reporting blind spots",
      "Disconnected tools",
      "Undocumented processes",
      "Bottlenecks",
    ],
    callout: {
      body: ["Circle the three creating the most friction.", "Don't fix everything. Start there."],
    },
    metaDescription:
      "A practical 10-minute audit from Mosaic to help you spot business friction, manual work, disconnected tools, and bottlenecks.",
  },
  {
    title: "Do My Systems Actually Work?",
    slug: "systems",
    eyebrow: "Systems + Operations",
    shortDescription:
      "A quick check for whether your systems are actually removing work - or quietly creating more of it.",
    longDescription:
      "Having software doesn't mean you have a system. A good system should make work easier to complete, information easier to find, and your business less dependent on people remembering what happens next.",
    estimatedTime: "5 minutes",
    category: "Systems + Operations",
    filePath: `${RESOURCE_FILE_BASE_PATH}/DO MY SYSTEMS ACTUALLY WORK.pdf`,
    ctaLabel: "Open the Checklist",
    secondaryCta: {
      label: "All resources",
      href: "/resources",
    },
    featured: true,
    librarySupportingCopy:
      "Look at how information moves through your business, whether your tools actually connect, how easy information is to find, and how dependent your processes are on individual people.",
    focusLabel: "What you'll look at",
    focusItems: [
      "Whether information only needs to be entered once",
      "Whether your tools actually talk to each other",
      "Whether your team can find answers without asking someone",
      "Whether important processes are documented",
      "Whether your data helps you make decisions",
      "Whether a major process depends on one person",
    ],
    callout: {
      body: [
        "People should run the business.",
        "They shouldn't have to hold the business together.",
      ],
    },
    metaDescription:
      "A 5-minute systems checklist from Mosaic for checking whether your tools, documentation, data, and processes are actually reducing work.",
  },
  {
    title: "The 5-Minute Website Clarity Audit",
    slug: "website",
    eyebrow: "Website + Experience",
    shortDescription: "See your website the way a potential customer does.",
    longDescription:
      "Open your homepage and try to forget everything you already know about your business. For five minutes, you're the customer.",
    estimatedTime: "5 minutes",
    category: "Website + Experience",
    filePath: `${RESOURCE_FILE_BASE_PATH}/THE 5-MINUTE WEBSITE CLARITY AUDIT.pdf`,
    ctaLabel: "Open the Audit",
    secondaryCta: {
      label: "All resources",
      href: "/resources",
    },
    featured: true,
    librarySupportingCopy:
      "Test your homepage, messaging, customer path, mobile experience, calls to action, and the five-second question every business owner should ask.",
    focusLabel: "What you'll test",
    focusItems: [
      "What someone understands without scrolling",
      "Whether your primary service is easy to find",
      "Whether you've created enough trust",
      "Whether the next step is obvious",
      "How the experience feels on mobile",
      "Whether your calls to action are clear",
      "The five-second stranger test",
    ],
    callout: {
      eyebrow: "The Stranger Test",
      body: [
        "Send your homepage to someone who doesn't know your business.",
        "Give them five seconds.",
        "Then ask: \"What do you think we do?\"",
        "And: \"What do you think I wanted you to do next?\"",
        "Don't correct them. Their confusion is the result.",
      ],
    },
    metaDescription:
      "A 5-minute website clarity audit from Mosaic to help you test your homepage, message, mobile experience, and calls to action.",
  },
] satisfies Resource[];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
