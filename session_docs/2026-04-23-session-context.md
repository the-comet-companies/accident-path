# Session Context — April 23, 2026

## Where We Left Off (read this first in a new session)

**Last completed task: DEV-13 — IntakeWizard** ✅
- 9-step intake wizard live at `/find-help`
- Saves to Supabase `intake_sessions` — confirmed working in production
- Flow: `/find-help` → 9 steps → `/find-help/thank-you` → `/find-help/results`

**Next task: DEV-14 — State rules engine (CA+AZ) + find-help flow + Server Actions**, ~6h, P0
- Defined in `scripts/create-master-pipeline-db.py` line 278
- Depends on DEV-03 (Supabase schema ✅) + DEV-13 (IntakeWizard ✅)
- Scope: CA/AZ routing logic, urgency-based next steps per state, Server Actions for form submission

**Task reference file:** `scripts/create-master-pipeline-db.py` — all 28 DEV tasks defined here as Python dicts (DEV-01 through DEV-28). This is the canonical task list.

**Active branch:** `main` — all work on main, no open PRs. Last commit: `4473b83`.

**Build state:** 71 static pages. TypeScript strict, lint clean.

---

## No New Code Today (April 23)

Today's session had only documentation commits:
- `4473b83` — docs: add superpowers plans + specs; gitignore .superpowers/ temp data
- `e72a015` — docs: add session handoff header — DEV-13 done, DEV-14 next
- `967507a` — docs: correct next task to DEV-14 (state rules engine)
- `20e7baa` — docs: update session context — DEV-13 IntakeWizard complete, Supabase confirmed

Code state is identical to end-of-day April 22.

---

## Completed Work (Cumulative — April 20–22)

### DEV-12: Tools Section (April 22)

11 CMS tool content files in `content/tools/` (all Zod-validated, compliance-safe):

| Slug | Title | Featured? |
|------|-------|-----------|
| `statute-countdown` | Statute of Limitations Countdown | ★ Featured |
| `accident-case-quiz` | What Kind of Accident Case Do I Have? | ★ Featured |
| `urgency-checker` | Do I Need Medical Care Now? | Grid |
| `evidence-checklist` | Evidence Collection Checklist | Grid |
| `injury-journal` | Injury & Treatment Journal | Grid |
| `lost-wages-estimator` | Lost Wages Estimator | Grid |
| `insurance-call-prep` | Insurance Call Prep Tool | Grid |
| `record-request` | Record Request Checklist | Grid |
| `settlement-readiness` | Settlement Readiness Checklist | Grid |
| `lawyer-type-matcher` | Lawyer Type Matcher | Grid |
| `state-next-steps` | State-Specific Next Steps | Grid |

- `app/tools/page.tsx` — featured 2-col dark cards + 9-card teal-icon grid, white card wrapper
- `app/tools/[slug]/page.tsx` — detail page with ToolEngine placeholder, FAQ accordion, dual SchemaOrg
- `components/tools/ToolEngine.tsx` — `'use client'` placeholder with step list + "Launching soon" badge

### DEV-13: IntakeWizard (April 22)

Full intake wizard built and confirmed writing to Supabase.

**`lib/intake.ts`** — `computeUrgency`, `suggestLawyerType`, `computeUrgencyFactors`, `suggestResources`, `trackEvent`

**Step components** in `components/intake/steps/`:

| File | Step | UX Pattern |
|------|------|-----------|
| `StepAccidentType.tsx` | 1 | 9-option grid, auto-advances |
| `StepWhen.tsx` | 2 | Date input + statute-risk warning if > 18 months |
| `StepWhere.tsx` | 3 | CA/AZ toggle + city text input |
| `StepInjuries.tsx` | 4 | Multi-select with `aria-pressed` |
| `StepMedical.tsx` | 5 | 5-option single-select, auto-advances |
| `StepPoliceReport.tsx` | 6 | Yes/No cards, tip box if No |
| `StepInsurance.tsx` | 7 | 3-option single-select, auto-advances |
| `StepWorkImpact.tsx` | 8 | 4-option single-select, auto-advances |
| `StepContact.tsx` | 9 | ConsentCheckbox (unchecked default) + gated contact + Submit |

**`components/intake/IntakeWizard.tsx`** — localStorage, Supabase insert, GA4 events, navigate to thank-you/results

**Supabase column names (actual schema):**
- `medical` (not `medical_treatment`)
- `insurance` (not `insurance_status`)
- no `submitted_at` — table uses `created_at` with `now()` default

### DEV-12: Static Pages (April 22)

7 static pages built — all follow dark `bg-primary-900` hub hero pattern:
- `/about`, `/about/how-it-works`, `/privacy`, `/terms`, `/disclaimers`, `/for-attorneys`, `/contact`

### Guides Section (April 22)

13 guides total (grew from 3). `GuidesHubClient.tsx` with 6 category tabs, cornerstone badge on `am-i-at-fault` + `settlement-vs-lawsuit`.

### Accidents Hub + Home Page (April 21)

`AccidentsHubClient.tsx` with 6 category tabs + all 15 accident hub CMS files. Full home page redesign with GSAP animations, CSS 3D HeroVisual, header hover dropdowns.

---

## Current Build State

| Item | Status |
|------|--------|
| Next.js 14 App Router | ✓ |
| TypeScript strict | ✓ |
| Tailwind v4 + design tokens | ✓ |
| zod / lucide-react / react-icons / supabase / gsap | ✓ |
| Supabase (intake_sessions, tool_submissions, journal_entries + RLS) | ✓ |
| Core UI components (CTAButton, TrustBadge, DisclaimerBanner, EmergencyBanner, Breadcrumb dark variant) | ✓ |
| Header (hover dropdowns) + MobileNav + Footer | ✓ |
| SEO primitives (SchemaOrg, MetaTags, CanonicalUrl, lib/seo.ts) | ✓ |
| Home page (all 8 sections, GSAP, HeroVisual) | ✓ |
| `/accidents` hub (15 cards, two-tone filter) | ✓ |
| `/accidents/[slug]` (15 pages) | ✓ |
| `/injuries` + `/injuries/[slug]` (7 pages) | ✓ |
| `/guides` hub (13 guides, 6 categories) | ✓ |
| `/guides/[slug]` (13 pages) | ✓ |
| `/states` + `/states/[state]` (CA + AZ) | ✓ |
| `/states/[state]/[city]` (LA, San Diego, Phoenix, Tucson) | ✓ |
| `/tools` hub + `/tools/[slug]` (11 pages, ToolEngine placeholder) | ✓ |
| `/about`, `/about/how-it-works`, `/privacy`, `/terms`, `/disclaimers`, `/for-attorneys`, `/contact` | ✓ |
| `/find-help` (9-step IntakeWizard, localStorage + Supabase) | ✓ |
| `/find-help/results`, `/find-help/thank-you` | ✓ |
| All 71 pages statically generated | ✓ |
| **DEV-14: State rules engine** | ✗ Not started |
| **DEV-15: ToolEngine live** | ✗ Not started |

---

## Architecture Reminders (Key Decisions)

- **CMS = JSON files, not DB.** `cms.get*()` reads `content/**/*.json` at build time. Supabase is runtime user data only.
- **`generateStaticParams`** pre-builds all slugs → static HTML.
- **Tailwind v4** — no `tailwind.config.ts`. All tokens in `app/globals.css` via `@theme`.
- **GSAP animations** — always use `fromTo` + `immediateRender: false` to prevent invisible-on-scroll bug.
- **Compliance HOC routes:** `/tools/*` → `tool`, `/find-help/*` → `intake`, `/states/*` → `state`, everything else → `default`.
- **No Three.js** — CSS 3D + SVG + GSAP only.
- **react-icons FA Solid** for accident-type icons. lucide-react for all other UI icons.
- **Hub page pattern** — all index pages share: Breadcrumb dark, amber eyebrow, h1, serif italic subtext, attorney-reviewed badge, disclaimer, white rounded card with two-tone filter client component.
- **Attorney review pending** on all state and content JSON files before go-live.

---

## Content Gaps (Lower Priority)

- More city pages: San Jose, San Francisco, Fresno, Sacramento, Long Beach, Oakland, Bakersfield, Anaheim (CA) + Mesa, Chandler, Scottsdale, Gilbert (AZ) — 12 more
- All content pending attorney review before go-live

---

## What's Next

| Task | Est. Hours | Status |
|------|-----------|--------|
| **DEV-14:** State rules engine (CA+AZ) + find-help flow refinement + Server Actions | 6 | Not started |
| DEV-15: Tool interactivity (ToolEngine live — step inputs, results, Supabase `tool_submissions`) | 8 | Not started |
| More city pages (12 additional CA/AZ cities) | 3 | Not started |
| Attorney review of all content before go-live | — | Pending |

---

## Active Branch

`main` — all work pushed to `origin/main`. No open PRs.
