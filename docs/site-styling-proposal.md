# Mosaic site styling proposal

Prepared September 22, 2026. Implementation started following approval; all changes remain uncommitted pending review.

## First preview

Local preview: http://localhost:3010 (development server on this machine).

- Home, Services, and Work now use the new shared components and scoped layouts.
- The shared header, footer, controls, and theme have been updated. Other public pages receive the initial theme pass; their full content/layout migrations remain future work.
- Booking labels are consistent, pricing is preserved in accessible disclosures, and the mobile menu supports keyboard focus wrapping and Escape.
- Removed the automatic Clarity Check popup from the shared shell; contextual links remain.
- Existing public work fetching, filters, service redirects, form handlers, and authentication are retained.
- Authenticated client/admin screens have not been visually reviewed with a signed-in session.
- Legacy CSS removal remains part of the remaining page migrations; new layout styles use CSS Modules to avoid adding page-specific overrides to the legacy stylesheet.

Review this first pass before expanding the layout migration. No production deployment or commit has been made.

## Direction

Bring the calm, considered library aesthetic from https://examples.buildwithmosaic.co/examples across buildwithmosaic.co: warm ivory, deep green, restrained lavender, simple typography, subtle borders, useful previews, and generous but controlled spacing. Make the content easier to scan and the next step easier to understand.

## Inspection and findings

Reviewed the reference page's delivered HTML and stylesheet, the live homepage HTML, and local route templates, shared components, and CSS. This was a source inspection, not a rendered browser or interaction audit. The live homepage's headings match the local homepage structure. Other route recommendations are based on local source, not authenticated production access.

The reference uses an ivory library background (#faf9f5), deep green primary color (#344c3e), white cards, thin pale borders (#e0e4d8), muted green supporting text, and a lavender closing panel (#eee8f2). Its index heading scales from 35–54px, its cards have a 13px radius, and its desktop grid has two columns with 28px gaps. Sans-serif page headings are paired with selective Georgia card titles. The page has a short introduction, filters, three examples, and one closing CTA.

The current homepage has 12 sections. Recognition, builds, services, transformation, and journey sections repeatedly explain adjacent ideas before the visitor reaches much proof. The source also mixes Clarity Call and Discovery Call labels for the same booking destination. Existing styles contain many page-specific rules and successive overrides; a cleanup needs shared components and deliberate removal of superseded rules.

## Proposed visual system

| Element | Proposal |
| --- | --- |
| Main canvas | Reference ivory #faf9f5; white for cards and fields |
| Primary color | Deep green #344c3e for headings, buttons, active states |
| Supporting text | Muted green #63705b; verify contrast on each surface |
| Accent | Lavender #eee8f2 for selected calls to action; sage for quiet supporting panels |
| Other brand colors | Retain terracotta and slate in appropriate artwork, rather than alternating large page backgrounds |
| Typography | Sans-serif for navigation, page titles, body, and UI; restrained serif accents in project titles or quotations |
| Type scale | Home hero 48–72px desktop / 36–44px mobile; inner-page titles 36–54px; section headings 28–40px; body 16–18px |
| Layout | Shared 1200–1280px maximum outer width; consistent 24–64px responsive side gutters; reading columns around 65 characters |
| Spacing | 64–88px major section spacing on desktop, 40–56px mobile; 24–28px grid gaps |
| Cards | 12–14px radius, 1px border, 24–28px padding; minimal shadows |
| Controls | Sentence case; solid green primary action, outlined secondary action, quiet text links; target 44px minimum touch height |
| Motion | Subtle color/border feedback and optional short fades; respect reduced motion |

These are proposed adaptations. Body text and touch targets should be larger than some of the reference's compact UI.

Keep the existing Mosaic identity recognizable. Use the existing mark at a controlled scale, with a consistent wordmark treatment. A replacement logo is outside this styling proposal.

## Navigation and conversion

Recommended desktop navigation: Services, Work, Process, About, Resources, plus “Book a clarity call.” Include Examples prominently within Work and as a secondary homepage action linking to the existing examples site. Put Playbook, Brand, and Client Portal in the footer. Use a fully usable mobile menu with a visible booking action.

Use “Book a clarity call” consistently for the free booking destination, with “Free introductory call” as supporting copy where useful. Clearly distinguish the paid 90-minute Clarity Session and the free Clarity Check. Keep existing commercial terms and booking destinations unless separately revised. Replace repeated promotional interruptions with contextual links and a clear closing CTA.

## Homepage proposal

Reduce the homepage from 12 sections to approximately seven, ordered around understanding, proof, and action:

1. **Hero.** Suggested heading: “A more connected business. More room to grow.” Supporting copy: “Custom CRMs, dashboards, websites, and workflows for service businesses ready to bring the pieces together.” Primary action: Book a clarity call. Secondary: Explore examples. Pair with a focused system preview rather than an oversized decorative mark.
2. **Selected examples.** Three concise preview cards linking to the existing interactive examples. Label each Concept Demo and retain the fictional-data distinction.
3. **What we help with.** Four compact cards: Advisory, Systems, Websites & Experience, Marketing & Growth. One clear outcome and one link per card. Absorb the repeated problem/builds explanations here.
4. **Featured client work.** White Poppy: one substantial preview, concise challenge and intervention, and verified outcomes with their existing qualification. Link to the full case study.
5. **How it works.** A concise process overview aligned with the Process page. Show what the client does and receives at each stage.
6. **Meet Mosaic.** A short founder introduction and an About link. Move the longer philosophy content to About/Playbook.
7. **Closing invitation.** One lavender panel with a short headline, booking CTA, and quieter Clarity Check link.

Move detailed engagement model comparisons to Services. Avoid repeating the entire service catalog or case study on the homepage.

## Coverage across all page families

| Page / route family | Proposed cleanup |
| --- | --- |
| `/` | Seven-section structure above; shorter copy, earlier proof, consistent cards |
| `/services` | Brief hero; four clear service cards; examples of deliverables; compact engagement model comparison; pricing guidance; concise FAQ; one closing CTA |
| `/services/[slug]` | Inspect the existing redirect behavior before changing presentation; preserve destinations and use one detail template wherever content is actually rendered |
| `/services/inquire/[pillar]` | Matching service introduction and one focused form panel; brief expectations; clear labels, errors, and success states |
| `/process` | Short introduction, scannable stages, deliverables and responsibilities, compact FAQ; consolidate repeated philosophy sections |
| `/work` | Reference-inspired project grid; feature White Poppy; distinguish real work from concept demos; add filters only if the collection warrants them |
| `/work/[slug]`, White Poppy | Consistent case-study shell with summary, role/scope, challenge, solution, evidence, and outcome; use an anchor contents list for long stories; preserve claim qualifications |
| `/about` | Founder-led opening, relevant experience, working approach, concise values, invitation; reduce repeated philosophy blocks |
| `/playbook` | Readable editorial layout, short summaries, useful links into frameworks and resources |
| `/resources`, `/resources/[slug]` | Consistent library cards and resource landing pages; clear descriptions; shared download-form treatment |
| `/start` | Simple entry options followed by a focused inquiry form; reduce competing messages around the form |
| `/clarity` | Explain the paid session, deliverables, price, and duration early; concise FAQ and form |
| `/clarity-check` | Calm assessment shell with clear progress, readable questions, validation, and actionable results |
| `/brand` | Reusable visual-system reference showing approved colors, typography, controls, and assets |
| Catch-all routes | Review `/frameworks`, `/learn-more`, `/portal`, `/privacy`, `/terms` and legacy entries; use appropriate document/contact templates and preserve legitimate URLs; resolve placeholder and unknown-route behavior explicitly |
| `/client/login`, `/client`, `/client/assessment` | Same palette and controls with compact workspace typography; clear task status, progress, and form states |
| `/admin/**` | Consistent dense workspace shell for lead, clarity, outreach, growth, work/editor/preview, and assessment pages; retain readable tables, filters, status badges, and existing actions |
| Not-found and system states | Matching empty, loading, error, success, and 404 treatments; clear recovery actions |

“All pages” includes public, client, and admin page families, while preserving their different purposes. Inventory generated service, resource, and work URLs during implementation so dynamic pages are included in verification.

## Implementation sequence

1. Establish shared color, typography, spacing, border, radius, and focus tokens. Create shared header/footer, page intro, card, CTA panel, form control, and reading-layout patterns. Scope public and workspace styles deliberately.
2. Apply the system to Home and Services as the representative marketing templates; add Work as the representative collection template.
3. Roll those patterns through the remaining public pages, case studies, resources, and inquiry/assessment flows. Consolidate copy where it repeats without silently changing offerings or claims.
4. Apply the same identity to client and admin workspaces while preserving density and behavior.
5. Remove superseded CSS after each page migration. Read the installed Next.js guides before code changes, per AGENTS.md.
6. Verify desktop, tablet, and mobile layouts; keyboard navigation; contrast and focus; reduced motion; long headings; forms and their error/success states; downloads; redirects; booking links; authenticated states; and dynamic content. Run lint and build, then relevant behavior checks.

## Completion criteria

Every route uses the same intentional design vocabulary. The homepage introduces the offer and shows useful proof early. There is a clear primary action on each marketing page. Mobile cards and forms fit without page overflow, and workspace tables remain usable. Existing submissions, authentication, assessment flows, downloads, editor actions, published content, and booking destinations continue to work. Final review includes rendered before/after captures of representative public and workspace pages.

## First-preview verification

- Production build and TypeScript check pass.
- ESLint passes with one pre-existing Google Tag Manager recommendation in the root layout.
- Desktop and mobile smoke checks passed on Home, Services, Work, About, Process, Resources, Start, Clarity Check, and Client Login, without page overflow or browser runtime errors.
- Home, Services, and Work fit at 360, 390, 768, and 1024px viewport widths.
- Automated WCAG A/AA checks passed on Home, Services, Work, About, Process, Playbook, Brand, Resources, Clarity, Start, Systems Inquiry, and White Poppy after contrast fixes. These checks supplement, rather than replace, manual accessibility review.
- Pricing/capacity disclosures, work filtering, and mobile menu focus wrapping, Escape dismissal, and focus return passed browser checks.
- Form submissions and signed-in write operations were not exercised against live data.
