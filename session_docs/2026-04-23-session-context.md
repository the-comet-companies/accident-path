# Session Context — April 23, 2026

## Where We Left Off (read this first in a new session)

**Last completed task: DEV-14 — State Rules Engine (CA+AZ) + Server Actions** ✅
- State rules card live on `/find-help/results` — shows SOL deadline, reporting deadlines, fault rule
- Intake submissions now go through `/api/intake` route handler (server-side Zod validation + Supabase insert)
- Confirmed working in production: Supabase row created, state card renders correctly for AZ motorcycle crash test

**Next task: DEV-15 — ToolEngine live (step inputs, results, Supabase `tool_submissions`)**
- ~8h, all 11 tool slugs currently show a "Launching soon" placeholder via `components/tools/ToolEngine.tsx`
- Depends on DEV-12 (Tools CMS ✅) + DEV-14 (Supabase patterns ✅)

**Task reference file:** `scripts/create-master-pipeline-db.py` — all 28 DEV tasks defined here as Python dicts (DEV-01 through DEV-28). Canonical task list.

**Active branch:** `main` — all work on main, no open PRs. Last commit: `88544d5`.

---

## DEV-14 Completed Today (April 23, 2026)

### Files Changed

| File | Action | What It Does |
|------|--------|-------------|
| `types/state-rules.ts` | New | `ReportingDeadline` + `StateRules` interfaces. `faultRule.type` is a union (`pure_comparative \| modified_comparative \| contributory \| no_fault`) to support future states. |
| `lib/state-rules.ts` | New | `STATE_RULES: Record<'CA' \| 'AZ', StateRules>` + `getRelevantDeadlines(state, accidentType)` — filters by empty accidentTypes (all) or exact match, capped at 3 |
| `app/api/intake/route.ts` | New | POST-only route handler. Parses JSON → Zod validates via `IntakeFormSchema` → inserts to `intake_sessions`. Returns generic 400/500 (no schema details exposed). |
| `components/intake/IntakeWizard.tsx` | Edit | Swapped direct Supabase call → `fetch('/api/intake')`. Added `response.ok` check + `finally { setSubmitting(false) }`. No more Supabase import client-side. |
| `app/find-help/results/page.tsx` | Edit | State rules card between urgency banner and lawyer type card. Guards on CA/AZ only. |

### CA Rules
- SOL: personalInjury 24mo, propertyDamage 36mo, wrongfulDeath 24mo
- Fault: pure comparative (Li v. Yellow Cab Co., 1975)
- Insurance minimums: **$30,000 / $60,000 / $15,000** (SB 1107, effective Jan 1 2025)
- Reporting deadlines: SR-1 (10d, vehicle accidents), Gov Entity (180d, all), Workers' Comp (30d notice), UM/UIM (null)

### AZ Rules
- SOL: all 24mo
- Fault: pure comparative (no threshold bar)
- Insurance minimums: $25,000 / $50,000 / $15,000
- Reporting deadlines: Gov Entity (180d, all), Workers' Comp (365d), UM/UIM (null)

### Key Implementation Details
- `accidentDate` from `<input type="date">` produces `YYYY-MM-DD` — parsed as **local time** (`new Date(y, m-1, d)`) to avoid off-by-one-day UTC bug
- SOL deadline prose and date calculation both derived from `stateRules.sol.personalInjury / 12` (not hardcoded)
- `getRelevantDeadlines` filter: `accidentTypes.length === 0 || accidentTypes.includes(accidentType)`
- Zod version is **4.3.6** — uses `.issues` not `.errors` on `ZodError`
- Supabase singleton (`getSupabase()`) uses `NEXT_PUBLIC_*` anon key + RLS — intentional per spec

### Results Page — State Card Structure
1. Amber eyebrow "State-Specific Information" + state abbreviation badge
2. SOL deadline block (only if `accidentDate` present) — date + disclaimer
3. Reporting deadlines list — label, days badge or "Per policy terms", details text
4. Fault rule one-liner
5. Footer disclaimer: "general educational information only, not legal advice"

### User Flow
- Wizard → `/find-help/thank-you` → "View My Results →" → `/find-help/results`
- Results page reads from `localStorage` — persists across sessions until user clicks "Start Over"
- "Start Over" links back to `/find-help`

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
| `/find-help` (9-step IntakeWizard, localStorage + Supabase via API route) | ✓ |
| `/find-help/results` (urgency + state rules card + lawyer type + resources) | ✓ |
| `/find-help/thank-you` | ✓ |
| **DEV-14: State rules engine** | ✓ Complete |
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
- **Supabase lazy init** — `getSupabase()` factory pattern (not module-level) to prevent Next.js prerender crash.
- **Step animation** — `key={step}` on step container + `animate-step-in` CSS class (`@keyframes step-in` in `globals.css`).

---

## Content Gaps (Lower Priority)

- More city pages: San Jose, San Francisco, Fresno, Sacramento, Long Beach, Oakland, Bakersfield, Anaheim (CA) + Mesa, Chandler, Scottsdale, Gilbert (AZ) — 12 more
- All content pending attorney review before go-live

---

## What's Next

| Task | Est. Hours | Status |
|------|-----------|--------|
| **DEV-15:** ToolEngine live (step inputs, results, Supabase `tool_submissions`) | 8 | Not started |
| More city pages (12 additional CA/AZ cities) | 3 | Not started |
| Attorney review of all content before go-live | — | Pending |

---

## Active Branch

`main` — all work pushed to `origin/main`. No open PRs. Last commit: `88544d5`.
