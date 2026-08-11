import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "../../components";

type ServiceDetail = {
  number: string;
  name: string;
  promise: string;
  headline: string;
  investment: string;
  typical?: string;
  timeline: string;
  description: string[];
  problem: string[];
  engagement: string[];
  work: { title: string; copy: string }[];
  receives: string[];
  process: { step: string; title: string; copy: string }[];
  bestFor: string[];
  changes: { before: string; after: string }[];
  nextStep: string;
  faqs: { question: string; answer: string }[];
  tools?: string[];
  retainers?: {
    name: string;
    price: string;
    bestFor: string;
    includes: string[];
    featured?: boolean;
  }[];
};

const serviceDetails: Record<string, ServiceDetail> = {
  vision: {
    number: "01",
    name: "Vision",
    promise: "Find clarity before building.",
    headline: "Rediscover where you're going.",
    investment: "$2,500",
    timeline: "1-2 weeks",
    description: [
      "Vision is for businesses that know something needs to change but aren't yet sure what the right answer is.",
      "Instead of beginning with a website, automation, new software, or another strategy initiative, we step back and understand the whole business.",
      "We look at where you're going, what is currently getting in the way, what already works, and which opportunities actually deserve attention.",
      "Vision creates the roadmap everything else can follow.",
    ],
    problem: [
      "The business feels more complicated than it used to.",
      "Leadership has too many competing priorities.",
      "Tools and processes have accumulated over time.",
      "The website or brand no longer reflects the company.",
      "Employees rely on workarounds.",
      "The founder knows something needs to change but doesn't know where to begin.",
      "Growth has created operational friction.",
    ],
    engagement: [
      "Vision is a focused strategic engagement that turns scattered context into clear direction.",
      "We study the business from multiple angles: customer experience, brand, operations, systems, and technology.",
      "The goal is not to invent more work. The goal is to identify what matters, what can wait, and what should happen next.",
    ],
    work: [
      { title: "Vision Workshop", copy: "Understand where the business is trying to go and what success should look like." },
      { title: "Business Audit", copy: "Review how the company currently operates across customer experience, brand, operations, and technology." },
      { title: "Brand Positioning", copy: "Evaluate whether the way the business presents itself still reflects what it has become." },
      { title: "Customer Journey", copy: "Understand what customers experience from first interaction through delivery and follow-up." },
      { title: "Systems Audit", copy: "Identify disconnected tools, manual workflows, duplicate work, and unnecessary complexity." },
      { title: "Opportunity Mapping", copy: "Identify where clarity or better systems could create the most momentum." },
      { title: "90-Day Roadmap", copy: "Turn the findings into a prioritized plan." },
    ],
    receives: [
      "Vision Session",
      "Business findings",
      "Priority map",
      "Systems recommendations",
      "Customer journey observations",
      "Technology recommendations",
      "90-day roadmap",
      "Clear recommended next steps",
    ],
    process: [
      { step: "01", title: "Understand", copy: "Learn the business." },
      { step: "02", title: "Observe", copy: "Find friction and patterns." },
      { step: "03", title: "Clarify", copy: "Separate symptoms from root problems." },
      { step: "04", title: "Prioritize", copy: "Determine what matters most." },
      { step: "05", title: "Map", copy: "Create the roadmap forward." },
    ],
    bestFor: [
      "Founder-led businesses preparing for a next stage.",
      "Teams with too many possible priorities.",
      "Companies unsure whether they need brand, website, systems, or operational work first.",
    ],
    changes: [
      { before: "Too many possible next steps.", after: "A clear order of operations." },
      { before: "Symptoms and root problems blurred together.", after: "A practical diagnosis of what matters." },
      { before: "Ideas scattered across conversations and tools.", after: "A roadmap the team can act on." },
    ],
    nextStep: "Vision often leads into Experience, Connect, or a combined engagement once the right priorities are clear.",
    faqs: [
      { question: "Do I need to know what I want before Vision?", answer: "No. Vision exists because most businesses need clarity before deciding what to build." },
      { question: "Is this a full business audit?", answer: "It is a focused strategic audit designed to identify priorities, not a months-long operational assessment." },
      { question: "Can Vision stand alone?", answer: "Yes. You receive a roadmap whether or not you continue into another Mosaic phase." },
      { question: "What should I leave with?", answer: "You should leave saying, 'I finally know what we actually need to do.'" },
    ],
  },
  experience: {
    number: "02",
    name: "Experience",
    promise: "Create an experience that reflects the business you've built.",
    headline: "Bring your vision to life.",
    investment: "$4,500",
    typical: "$5,500-$7,500",
    timeline: "4-8 weeks",
    description: [
      "Experience focuses on what customers see, feel, and interact with.",
      "A business can evolve dramatically while its website, messaging, customer journey, and digital experience remain stuck in an earlier stage.",
      "We bring those pieces back into alignment through strategy, structure, design, development, lead journeys, analytics, launch support, documentation, and training.",
      "The goal isn't simply a prettier website. It's an experience that makes the business easier to understand, trust, and choose.",
    ],
    problem: [
      "The website no longer reflects the quality of the business.",
      "Prospects need too much explanation before they understand the offer.",
      "Messaging, forms, and follow-up are disconnected.",
      "The customer journey has grown without a clear structure.",
      "The brand feels behind the business it represents.",
    ],
    engagement: [
      "Experience turns a clear business direction into the public-facing touchpoints customers use to understand and choose you.",
      "We structure the journey first, then shape the design, copy direction, website, forms, integrations, and launch details around that journey.",
      "Every visible piece should reduce uncertainty and increase trust.",
    ],
    work: [
      { title: "Website Strategy", copy: "Define what the site must communicate, support, and make easier for customers." },
      { title: "Information Architecture", copy: "Create a clear sitemap and page structure before designing screens." },
      { title: "UX Design", copy: "Shape the path customers take from interest to action." },
      { title: "Custom Website Design", copy: "Create a visual experience that feels aligned with the business." },
      { title: "Custom Development", copy: "Build the approved direction into a responsive, maintainable website." },
      { title: "Brand Refinement", copy: "Tune the visual and verbal expression where the current brand needs more clarity." },
      { title: "Messaging + Copy Direction", copy: "Clarify what needs to be said and how each page should move." },
      { title: "Forms + Lead Journeys", copy: "Connect inquiry moments to a clearer next step." },
      { title: "CRM Integration", copy: "Route leads into the right place for follow-up." },
      { title: "Analytics + SEO Foundation", copy: "Set a practical foundation for visibility and measurement." },
      { title: "Launch + Training", copy: "Test, document, launch, and make sure the team can own the result." },
    ],
    receives: [
      "Custom responsive website",
      "Clear sitemap",
      "Defined customer journey",
      "Refined messaging",
      "Lead capture system",
      "Analytics setup",
      "SEO foundation",
      "Launch support",
      "Documentation",
      "Training",
    ],
    process: [
      { step: "01", title: "Understand", copy: "Business and customer goals." },
      { step: "02", title: "Structure", copy: "Create site architecture and journey." },
      { step: "03", title: "Design", copy: "Build the visual and messaging experience." },
      { step: "04", title: "Develop", copy: "Turn the approved direction into a working site." },
      { step: "05", title: "Launch", copy: "Test, connect, document, and hand off." },
    ],
    bestFor: [
      "Businesses whose website no longer matches their maturity.",
      "Companies ready to improve trust, clarity, and lead quality.",
      "Teams that need the customer journey and digital experience to work together.",
    ],
    changes: [
      { before: "The business needs too much explanation.", after: "The experience communicates clearly." },
      { before: "Leads arrive without context.", after: "Inquiry paths collect better information." },
      { before: "The site feels behind the company.", after: "The digital experience finally reflects the business." },
    ],
    nextStep: "Experience often connects naturally into Connect when the customer journey reveals internal follow-up, CRM, or workflow needs.",
    faqs: [
      { question: "Is this only website design?", answer: "No. The website is part of a broader customer experience that includes messaging, structure, forms, integrations, and handoff." },
      { question: "Can you work with our current brand?", answer: "Yes. We refine only what needs more clarity or alignment." },
      { question: "Will the site be custom?", answer: "Yes. The structure, design, and development are shaped around the business and scope." },
      { question: "What should I leave with?", answer: "You should leave saying, 'This finally feels like our business.'" },
    ],
  },
  connect: {
    number: "03",
    name: "Connect",
    promise: "Build the systems behind the business.",
    headline: "Make your business work beautifully.",
    investment: "$5,000",
    typical: "$6,000-$9,000+",
    timeline: "4-10 weeks",
    description: [
      "Connect is for businesses that have outgrown manual processes, disconnected tools, spreadsheets, repeated data entry, or systems that only one person understands.",
      "We map how information and work move through the company, then redesign the architecture behind it.",
      "Technology is used selectively. Sometimes that means improving what already exists. Sometimes it means connecting systems. Sometimes it means building something custom.",
      "The goal is always the same: make the business easier to operate.",
    ],
    problem: [
      "Work depends on memory, manual handoffs, or duplicate entry.",
      "Important information lives in too many places.",
      "Reports are difficult to trust or assemble.",
      "Customers feel the friction of internal systems.",
      "One person understands the workflow and everyone else works around it.",
    ],
    engagement: [
      "Connect turns operational friction into a clearer system of work.",
      "We focus on the way the business actually runs: what triggers action, where information should live, who owns each step, and what can be simplified before automation.",
      "The final system may include databases, workflows, dashboards, portals, documentation, or team tools, but the technology follows the business architecture.",
    ],
    work: [
      { title: "Process Architecture", copy: "Design how work should move through the business." },
      { title: "CRM Design", copy: "Structure relationships, pipeline stages, and follow-up around how the team actually sells and serves." },
      { title: "Airtable + Custom Databases", copy: "Create central sources of truth when spreadsheets and scattered records are no longer enough." },
      { title: "Workflow Automation", copy: "Reduce repeated manual work where the process is stable enough to automate." },
      { title: "Integrations", copy: "Connect the tools that need to share information." },
      { title: "AI-Assisted Workflows", copy: "Use AI where it reduces effort without removing judgment." },
      { title: "Dashboards + Reporting", copy: "Make important business information easier to see and act on." },
      { title: "Customer Portals + Employee Tools", copy: "Create focused working surfaces for the people who need them." },
      { title: "Inventory Systems", copy: "Bring clarity to stock, production, or fulfillment flows where needed." },
      { title: "SOPs, Documentation + Training", copy: "Make sure the system can be understood, owned, and improved." },
    ],
    receives: [
      "Connected operating system",
      "Automated workflows",
      "Dashboards",
      "Central sources of truth",
      "Internal tools",
      "Documentation",
      "SOPs",
      "Training",
      "System architecture map",
    ],
    process: [
      { step: "01", title: "Map", copy: "Understand how work happens now." },
      { step: "02", title: "Simplify", copy: "Remove unnecessary steps." },
      { step: "03", title: "Architect", copy: "Design the future system." },
      { step: "04", title: "Build", copy: "Connect and automate." },
      { step: "05", title: "Empower", copy: "Document and train." },
    ],
    bestFor: [
      "Businesses buried in manual workflows.",
      "Teams using spreadsheets as an operating system.",
      "Companies ready for clearer reporting, handoffs, and ownership.",
    ],
    changes: [
      { before: "The team repeats the same manual work.", after: "Stable workflows happen with less effort." },
      { before: "Data is scattered and hard to trust.", after: "Important information has a clear home." },
      { before: "Only one person knows how things work.", after: "The system is documented and teachable." },
    ],
    nextStep: "Connect can follow Vision or Experience, and often becomes the operational foundation that Grow continues to improve.",
    faqs: [
      { question: "Do you choose the tools first?", answer: "No. Tools are chosen after the problem, ownership, and process are clear." },
      { question: "Can you improve what we already use?", answer: "Yes. Many Connect engagements simplify and connect existing tools before adding anything new." },
      { question: "Is implementation included?", answer: "Yes, within the agreed scope. The engagement is designed to move from architecture into usable systems." },
      { question: "What should I leave with?", answer: "You should leave saying, 'I can't believe we used to do this manually.'" },
    ],
    tools: ["Airtable", "Supabase", "Shopify", "Stripe", "n8n", "Zapier", "Vercel", "AI tools", "CRM platforms"],
  },
  grow: {
    number: "04",
    name: "Grow",
    promise: "A strategic partner for what comes next.",
    headline: "Keep moving forward.",
    investment: "$750/month",
    timeline: "Ongoing",
    description: [
      "Businesses never stop evolving.",
      "New employees arrive. New opportunities appear. New problems emerge. Technology changes.",
      "Grow allows the systems behind the business to evolve without starting a new consulting engagement every time something changes.",
      "It is ongoing strategic support for the business you are actively becoming.",
    ],
    problem: [
      "The business needs ongoing support, but not another full-time director.",
      "The website, automations, reporting, and systems need steady improvement.",
      "New opportunities create operational decisions the team wants help thinking through.",
      "Leadership wants a partner who understands how the pieces fit together.",
    ],
    engagement: [
      "Grow is a retained partnership for businesses that want Mosaic close to the ongoing evolution of their systems, website, customer experience, and operations.",
      "It is not an unlimited task subscription. Each level defines the amount and type of support included.",
      "The value is continuity: someone who understands the business well enough to help it keep improving without starting over every time.",
    ],
    work: [
      { title: "Strategy", copy: "Keep the next priorities visible and grounded in the whole business." },
      { title: "Website + Customer Experience", copy: "Refine the public experience as offers, audiences, and needs change." },
      { title: "Automation + Systems", copy: "Maintain and improve the workflows that support the team." },
      { title: "Reporting", copy: "Review what the business needs to see and what decisions the data should support." },
      { title: "Team Consulting", copy: "Help people understand and use the systems around them." },
      { title: "Technology Decisions", copy: "Evaluate new tools and opportunities with a clear point of view." },
    ],
    receives: [
      "Ongoing strategic support",
      "Website and systems improvements",
      "Automation maintenance or new automation work depending on level",
      "Reporting review",
      "Documentation updates",
      "Team consulting",
      "Quarterly or monthly planning depending on level",
    ],
    process: [
      { step: "01", title: "Review", copy: "Understand what changed and what needs attention." },
      { step: "02", title: "Prioritize", copy: "Choose the work that creates the most momentum." },
      { step: "03", title: "Improve", copy: "Refine systems, website, reporting, or workflows." },
      { step: "04", title: "Support", copy: "Keep decisions and documentation moving with the business." },
    ],
    bestFor: [
      "Businesses that already have a foundation and want it maintained.",
      "Teams actively improving systems, pages, dashboards, or processes.",
      "Leadership teams that need senior systems and operations perspective without another full-time hire.",
    ],
    changes: [
      { before: "Every new need becomes a new project.", after: "The business has a steady partner for ongoing evolution." },
      { before: "Systems decay between major initiatives.", after: "The operating layer keeps improving." },
      { before: "Leadership thinks through systems alone.", after: "There is a partner who understands how everything fits together." },
    ],
    nextStep: "Grow usually follows Vision, Experience, or Connect once Mosaic understands the business and can support its next stage with context.",
    faqs: [
      { question: "Is Grow unlimited implementation?", answer: "No. Grow is scoped ongoing support. The level determines the type and amount of work included." },
      { question: "Can we start with Grow?", answer: "Usually Grow works best after Vision or another engagement, but it depends on how much context already exists." },
      { question: "Which level should I choose?", answer: "Essentials is maintenance and light strategy. Growth Partner is active improvement. Fractional Systems Director is embedded senior systems leadership." },
      { question: "What should I feel?", answer: "You should feel, 'We have someone who understands how everything fits together.'" },
    ],
    retainers: [
      {
        name: "Essentials",
        price: "$750/month",
        bestFor: "Businesses that already have strong systems but want ongoing support.",
        includes: ["Monthly strategy call", "Minor website updates", "Automation maintenance", "Reporting review", "Email support"],
      },
      {
        name: "Growth Partner",
        price: "$1,250/month",
        bestFor: "Businesses actively improving and evolving.",
        includes: ["Everything in Essentials", "New automations", "Process improvements", "Landing pages", "Dashboard enhancements", "Quarterly planning", "Team consulting"],
        featured: true,
      },
      {
        name: "Fractional Systems Director",
        price: "Starting at $2,500/month",
        bestFor: "Businesses that need senior strategic systems or operations leadership without hiring another full-time director.",
        includes: ["Strategic planning", "Systems strategy", "AI strategy", "Operations consulting", "Technology decisions", "Website/customer experience improvements", "Vendor coordination", "Leadership support", "Team training", "Ongoing optimization"],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(serviceDetails).map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceDetails[slug];

  if (!service) {
    notFound();
  }

  return (
    <Shell>
      <section className="service-detail-hero">
        <div>
          <p className="kicker">{service.number} / {service.name}</p>
          <h1>{service.headline}</h1>
          <p className="service-detail-promise">{service.promise}</p>
          <p className="service-detail-intro">{service.description[0]}</p>
          <Link className="button" href="/start">Start With Vision <b>↗</b></Link>
        </div>
        <aside className="service-detail-meta">
          <span>Starting investment</span>
          <strong>{service.investment}</strong>
          {service.typical && (
            <>
              <span>Typical investment</span>
              <strong>{service.typical}</strong>
            </>
          )}
          <span>Timeline</span>
          <strong>{service.timeline}</strong>
        </aside>
      </section>

      <section className="service-detail-problem">
        <div>
          <p className="kicker">The Problem</p>
          <h2>The situation that usually brings this work into focus.</h2>
        </div>
        <ul>
          {service.problem.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="service-detail-copy">
        <div>
          <p className="kicker">What This Engagement Is</p>
          <h2>{service.promise}</h2>
        </div>
        <div>
          {service.description.slice(1).concat(service.engagement).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {service.retainers ? (
        <section className="service-retainers">
          <div className="section-intro">
            <p className="kicker">Three Levels</p>
            <h2>Choose the right level of ongoing partnership.</h2>
          </div>
          <div className="service-retainer-grid">
            {service.retainers.map((retainer) => (
              <article className={retainer.featured ? "service-retainer featured" : "service-retainer"} key={retainer.name}>
                <p className="kicker">{retainer.featured ? "Recommended" : "Retainer"}</p>
                <h3>{retainer.name}</h3>
                <strong>{retainer.price}</strong>
                <p>{retainer.bestFor}</p>
                <ul>
                  {retainer.includes.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="service-detail-work">
        <div className="section-intro">
          <p className="kicker">What We&apos;ll Do Together</p>
          <h2>Specific work with a clear purpose.</h2>
        </div>
        <div className="service-detail-work-grid">
          {service.work.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-detail-receive">
        <div>
          <p className="kicker">What You Receive</p>
          <h2>Tangible pieces your business can use.</h2>
        </div>
        <ul>
          {service.receives.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="service-detail-process">
        <div className="section-intro">
          <p className="kicker">Process</p>
          <h2>What the engagement looks like.</h2>
        </div>
        <div className="service-detail-timeline">
          {service.process.map((step) => (
            <article key={step.step}>
              <span>{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-detail-fit">
        <div>
          <p className="kicker">Who It&apos;s For</p>
          <h2>Best fit when the business is ready for this kind of clarity.</h2>
        </div>
        <ul>
          {service.bestFor.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="service-detail-change">
        <p className="kicker">What Changes</p>
        <h2>The before and after should be felt inside the business.</h2>
        <div>
          {service.changes.map((change) => (
            <article key={change.before}>
              <p>{change.before}</p>
              <strong>{change.after}</strong>
            </article>
          ))}
        </div>
      </section>

      {service.tools && (
        <section className="service-tools">
          <p className="kicker">Tools</p>
          <h2>Tools are chosen after the problem.</h2>
          <div>
            {service.tools.map((tool) => <span key={tool}>{tool}</span>)}
          </div>
        </section>
      )}

      <section className="service-detail-investment">
        <div>
          <p className="kicker">Investment + Timeline</p>
          <h2>Clear expectations before the work begins.</h2>
        </div>
        <div className="service-detail-investment-grid">
          <span>Starting investment</span>
          <strong>{service.investment}</strong>
          {service.typical && (
            <>
              <span>Typical investment</span>
              <strong>{service.typical}</strong>
            </>
          )}
          <span>Timeline</span>
          <strong>{service.timeline}</strong>
        </div>
      </section>

      <section className="service-detail-next">
        <p className="kicker">Related Next Step</p>
        <h2>{service.nextStep}</h2>
      </section>

      <section className="services-faq">
        <div className="section-intro">
          <p className="kicker">FAQ</p>
          <h2>Questions specific to {service.name}.</h2>
        </div>
        <div className="services-faq-list">
          {service.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="service-detail-final">
        <p className="kicker">Start With Vision</p>
        <h2>Ready to make the next decision clearer?</h2>
        <Link className="button" href="/start">Start With Vision <b>↗</b></Link>
      </section>
    </Shell>
  );
}
