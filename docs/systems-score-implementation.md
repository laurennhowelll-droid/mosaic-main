# Mosaic Systems Score implementation report

Implemented locally; not deployed.

## Audit and architecture

The original assessment contained 21 questions in four categories (5 Capture, 5 Follow-Up, 5 Connection, 6 Visibility), a 1–5 scale, raw 21–105 total scores, immediate detailed results, and an extensive optional qualifying form. The client posted to `/api/clarity-check`. That route matched a lead by email, inserted or updated `leads`, inserted `clarity_assessments`, sent a results email via Resend, and sent the existing admin notification. Admin access is still protected through `requireAdmin`. Existing Google Analytics uses `gtag`; no additional analytics platform or automation was found in this submission path.

The original admin views mixed /50 and /105 denominators and the lead view assumed answers were always an array, although the current API stores an object. Those compatibility issues were corrected in the affected views.

## Routing and questions

`/systems-score` serves the updated assessment. `/clarity-check` returns a permanent 308 redirect and retains repeated query parameters. Canonical, Open Graph and sitemap use the new route. All 21 existing question IDs, wording, categories and scale labels are preserved without wording changes.

## Scoring

Each response maps via `(answer - 1) × 25`. The overall score is the rounded mean across all 21 answers: `round((rawTotal - 21) / 84 × 100)`. Each category uses its own rounded mean: `round((rawCategoryTotal - questionCount) / (questionCount × 4) × 100)`. Thus Visibility's six questions have equal individual weight with every other question; the overall score is not an unweighted average of the four rounded category scores.

Displayed integer bands: 0–39 FOUNDATION; 40–59 PATCHED TOGETHER; 60–79 CONNECTED; 80–100 BUILT TO SCALE. Strongest and lowest use unrounded category averages. Existing deterministic tie ordering is retained (first tied category is lowest, last is strongest).

## Email gate and results

All questions and the overall score are available without contact information. Category scores, strongest area, biggest opportunity and diagnostic copy render only after a successful save. The gate collects required first name and email, optional business name, and a separate unchecked insights-consent checkbox. No detailed implementation recommendations or competing service offers appear in the assessment results. The existing global navigation/footer remain intact.

Failed saves retain answers, score and entered contact information in React state and offer retry without repeating the assessment. State is retained while the page stays open, not across reloads. A failed results email does not relock successfully saved results or claim that email was delivered.

## Database and compatibility

No schema migration is required by this change. `leads`, `clarity_assessments`, foreign keys, internal source identifiers, raw score fields and internal bands remain unchanged. The existing `answers` JSON also stores `systems_score: { version: 1, overall, categories, strongest, lowest, band }` and explicit consent. Submission time remains the existing `created_at` default. Historical assessment rows are not rewritten. Valid historical 21-question records receive a normalized admin display; older five-category records retain their original scores and bands.

## Email and booking

Successful assessment save triggers the existing Resend flow from `Mosaic <reports@buildwithmosaic.co>`. The subject is `Your Mosaic Systems Score: [XX]/100`; the existing ivory/olive HTML styling contains the overall score and band, all four categories, strongest and lowest areas, the same brief diagnostic copy, and a single Systems Call link. User names are HTML-escaped. Existing admin notifications and `email_sent_at` remain supported.

The results and email share the Mosaic Systems Call destination: https://calendar.app.google/RL8WWoW6Td5tdUbV9 .

## Admin and analytics

Admin list, detail, linked lead and recent assessment displays now use Systems Score labels and appropriate denominators. Current detail includes category scores, strongest category, biggest opportunity, contact/business details and submission date. Historical admin URLs, review actions and CRM associations remain unchanged.

Added through the existing gtag pattern: `systems_score_started`, `systems_score_completed`, `systems_score_email_unlocked`, `systems_call_clicked`. Unlock and booking events include the saved assessment ID. Existing clarity event names are also emitted at their original conceptual stages. Booking clicks live in the existing analytics platform; no separate admin booking-tracking store was added.

## Configuration and validation

No new environment variables or runtime dependencies. Deployment needs the existing `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `RESEND_API_KEY`, plus authorized Mosaic sender domains. The pre-existing `supabase/clarity-check-2026-rebuild.sql` constraints must already be applied for the current raw scoring architecture; this change adds no further migration. Live database writes, actual email delivery, authenticated admin browser access and calendar availability were not tested. No real leads or emails were created during tests.

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with one pre-existing Google Analytics warning in `app/layout.tsx`.
- `npm run build`: passed, including `/systems-score`.
- `node --test tests/systems-score.test.cjs`: 7 passed.
- Local production browser tests at 1440, 390 and 320 pixels: redirect/query preservation, all 21 responses, pre-email gate, failed-save retry, category unlock, email-success/failure messages and overflow checks.

## Files changed

- `app/ClarityCheckPrompt.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/admin/clarity/[id]/page.tsx` — Normalized current scores and preserved original five-category historical detail.
- `app/admin/clarity/page.tsx` — Updated labels, bands, filters, normalized sorting and score display.
- `app/admin/growth/page.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/admin/leads/[id]/page.tsx` — Correct score display and support for both answer payload formats.
- `app/admin/outreach/[id]/page.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/admin/outreach/page.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/admin/page.tsx` — Systems Score labels and correct recent-assessment denominators.
- `app/admin/work/WorkEditorForm.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/admin/work/page.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/api/clarity-check/route.ts` — Preserved submission path; validated unique answers; added normalized JSON scores, revised Resend email and assessment ID response.
- `app/clarity-check/ClarityCheckForm.tsx` — Progressive score reveal, email gate, retry states, accessible focus, category results and personalized Systems Call CTA.
- `app/clarity-check/page.tsx` — Legacy route fallback preserves query parameters and permanently redirects.
- `app/clarity/page.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/globals.css` — Responsive assessment controls, score typography, four category cards and focus styles.
- `app/process/page.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/resources/ResourceLandingPage.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/services/page.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/sitemap.ts` — Indexes the new canonical route.
- `app/start/page.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `app/studio.tsx` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `lib/clarity-check.ts` — Shared normalization, bands, diagnostic copy, booking destination and backward-compatible admin presentation.
- `lib/lead-notifications.ts` — Updated notification labels; existing sender and notification integration preserved.
- `lib/supabase/admin.ts` — Types support both historical answer arrays and existing scored-answer objects.
- `lib/work-content.ts` — Updated assessment display names and/or public links to Systems Score; internal identifiers preserved.
- `next.config.ts` — 308 redirect from /clarity-check to /systems-score, preserving query parameters.
- `app/systems-score/page.tsx` — New public route, requested hero, canonical and Open Graph metadata.
- `tests/systems-score.test.cjs` — Seven scoring, compatibility, validation, save and email-failure regression tests.
- `docs/systems-score-implementation.md` — Audit, implementation details, configuration and validation report.
