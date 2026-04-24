# Session Context — April 24, 2026

## Where We Left Off (read this first in a new session)

**Last completed task: DEV-27 — E2E tests (Playwright)** ✅
- 24/24 tests passing across 7 test files
- `playwright.config.ts` — chromium + mobile projects, reuseExistingServer
- `tests/e2e/` — home, accident, intake, tool, state, mobile, a11y specs
- Intake test mocks `/api/intake` to avoid real Supabase writes
- a11y: axe WCAG2AA on 3 pages — color-contrast rule excluded (pre-existing, tracked for DEV-28)
- Footer "Do Not Sell My Info" link fixed — permanent underline added (was hover-only, failed axe link-in-text-block)
- Commit: `0060c55`

**Previous completed task: DEV-26 — Analytics events + CRM webhook stub** ✅
- `lib/analytics.ts` — `trackEvent(name, params)` wrapping `window.gtag`, graceful no-op if not loaded
- `components/intake/IntakeWizard.tsx` — fires `intake_started`, `step_completed`, `intake_submitted`
- `components/tools/ToolEngine.tsx` — fires `tool_started` on mount, `tool_completed` after output
- `components/ui/CTAButton.tsx` — added `'use client'`, fires `cta_clicked` on all link + button variants
- `app/api/webhook/route.ts` — POST stub, logs payload + returns 200 (no real CRM connected yet)
- **GA4 script not yet added to layout** — `trackEvent` calls no-op until GA4 property is created and `G-XXXXXXXXXX` measurement ID is added to `app/layout.tsx`. This is **Michael's task** ("Configure GA4 + GSC", 2h in MASTER-PLAN.md) — not a Claude code task.
- Build: zero TS errors. Commit: `84a6ac7`. QA verified: all intake events fire correctly, webhook returns 200.

**Previous completed task: DEV-25 — Structured data + sitemap + internal linking engine** ✅
- `app/robots.ts` — allow all, disallow `/find-help/results`, `/find-help/thank-you`, `/api/`
- `app/sitemap.ts` — 75 URLs, dynamic, partitioned by section, correct priorities
- `lib/related.ts` — internal linking engine: `getAccidentRelated`, `getInjuryRelated`, `getGuideRelated`, `getToolRelated`, `getCityRelated`, `getStateRelated`
- BreadcrumbList JSON-LD added to all 5 hub pages + embedded in existing Article/SoftwareApplication schemas on all 6 detail page types
- generateMetadata audit: fixed `/find-help` description (167→157 chars) and `/find-help/thank-you` (80→137 chars)
- Build: 87 static pages, zero TS errors. Commit: `b40830e`

**Next task: DEV-28** — Unit tests + Lighthouse 90+ + final polish. 6h estimate. Ready to start.

**DEV-22 status:** Partial / blocked. `/privacy` and `/terms` are fully scaffolded (layout, TOC, section structure) but each section body shows a `placeholder` description inside an amber "Pending Legal Review" callout. Real copy must be attorney-drafted — not a code task. Both pages are `noIndex: true`.

**Task reference file:** `scripts/create-master-pipeline-db.py` — all 28 DEV tasks defined as Python dicts (DEV-01 through DEV-28). Canonical task list.

**Active branch:** `main` — all work on main, no open PRs. Last commit: `b40830e`.

---

## Summary

DEV-25 completed April 24. SEO infrastructure now fully in place — sitemap, robots, JSON-LD structured data on every page type, and the internal linking engine ready for pages to consume. Next is DEV-26 (analytics + CRM webhook).

---

## All Completed Tasks (as of April 24)

| Task | Description | Commit(s) |
|------|-------------|-----------|
| DEV-01 through DEV-12 | Project scaffold, design system, pages, CMS | Various |
| DEV-13 | IntakeWizard (9-step, `/find-help`) | `967507a` |
| DEV-14 | State rules engine (CA + AZ, urgency routing) | — |
| DEV-15 | ToolEngine live (all 11 tools, output generators) | — |
| DEV-16 | Accident Case Quiz — witnesses step + output fix | — |
| DEV-17 | Urgency Checker — Red/Yellow/Green tiers | — |
| DEV-18 | Evidence Checklist — category grouping + print CSS | — |
| DEV-19 | Injury Journal + Lawyer Type Matcher (new steps 3-4) | — |
| DEV-20 | 5 accident hub content JSONs | Pre-session |
| DEV-21 | 13 guide JSONs — all 1400–1660 words | `83dfb81`, `2610257` |
| DEV-23 | CA + AZ state page JSONs (pre-existing + reviewedBy fix) | `9830e0c` |
| DEV-24 | 16 city page JSONs (10 CA + 6 AZ) | `d647a60` |
| Breadcrumb fixes | `variant="dark"` on guides, state, city detail pages | `8ec6d79`, `4dc2347` |
| **DEV-25** | Structured data + sitemap + robots + internal linking engine | `b40830e` |
| **DEV-26** | Analytics events + CRM webhook stub | TBD |

---

## Remaining Tasks

| Task | Description | Est. Hours | Status |
|------|-------------|------------|--------|
| DEV-26 | Analytics events + CRM webhook stub | 4h | ✅ Complete |
| DEV-27 | E2E tests (Playwright) | 6h | ✅ Complete |
| **DEV-28** | Unit tests + Lighthouse 90+ + final polish | **6h** | **Ready — start here** |
| DEV-27 | E2E tests (Playwright) | 6h | Ready |
| DEV-28 | Unit tests + Lighthouse 90+ + final polish | 6h | After DEV-27 |
| DEV-22 | Home + About + static page content | 4h | Blocked — Privacy/Terms needs attorney copy |
| Attorney review | All content + state JSONs | — | Pending before go-live |

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
| `/guides/[slug]` (13 pages, all 1400–1660 words) | ✓ |
| `/states` + `/states/[state]` (CA + AZ) | ✓ |
| `/states/[state]/[city]` (all 16 cities — 10 CA + 6 AZ) | ✓ |
| `/tools` hub + `/tools/[slug]` (11 pages, ToolEngine live) | ✓ |
| `/about`, `/about/how-it-works`, `/privacy`, `/terms`, `/disclaimers`, `/for-attorneys`, `/contact` | ✓ |
| `/find-help` (9-step IntakeWizard, localStorage + Supabase via API route) | ✓ |
| `/find-help/results` (urgency + state rules card + lawyer type + resources) | ✓ |
| `/find-help/thank-you` | ✓ |
| Structured data / JSON-LD (all pages) | ✓ DEV-25 |
| XML sitemap (`/sitemap.xml`) | ✓ DEV-25 |
| robots.txt (`/robots.txt`) | ✓ DEV-25 |
| Internal linking engine (`lib/related.ts`) | ✓ DEV-25 |
| Analytics events + CRM webhook | ✓ DEV-26 (GA4 script pending Michael) |
| E2E tests (Playwright) | ✓ DEV-27 — 24/24 passing |
| Lighthouse 90+ verified | ✗ DEV-28 |

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
- **Breadcrumb variant rule** — ALL detail pages inside a dark hero (`bg-primary-900`) must pass `variant="dark"` to `Breadcrumb`. Default is `light` (dark text). Fixed in: `app/guides/[slug]/page.tsx`, `app/states/[state]/page.tsx`, `app/states/[state]/[city]/page.tsx`.
- **Attorney review pending** on all state and content JSON files before go-live.
- **Supabase lazy init** — `getSupabase()` factory pattern (not module-level) to prevent Next.js prerender crash.
- **Step animation** — `key={step}` on step container + `animate-step-in` CSS class (`@keyframes step-in` in `globals.css`).
- **Output item priorities** — `critical` / `important` / `helpful` labels are hardcoded per-item inside each output generator function in `lib/tools/output-generators.ts`. No dynamic scoring.
- **`OutputItem.category?`** — optional `string` field on `OutputItem`. When any item has `category` set, `ToolResults` groups items under bold uppercase category headers. Only `evidenceChecklist` uses categories currently.
- **Priority badge styles** — `critical`: `bg-danger-500 text-white`; `important`: `bg-warning-500 text-white`; `helpful`: `bg-success-50 text-success-700 border-success-500`. Only tokens defined in `globals.css` (`-50`, `-500`, `-700`) — no `-100`/`-200`/`-300` tokens exist.
- **`tool_submissions` schema** — columns: `id` (uuid), `tool_slug` (text), `answers` (jsonb), `output` (jsonb), `result_summary` (text, legacy/unused), `created_at` (timestamptz). Insert fires on final step completion; errors swallowed silently.
- **ToolEngine output generators** — each tool's logic in `lib/tools/output-generators.ts`. Step IDs must match actual JSON files — TOOLS-SPEC.md step IDs differed from the implemented JSON.
- **InjuryJournal component** — `components/tools/InjuryJournal.tsx` is a `'use client'` persistent journal (NOT ToolEngine). `app/tools/[slug]/page.tsx` uses `tool.slug === 'injury-journal'` to conditionally render it. localStorage key: `ap-injury-journal`. **Storage is device/browser-local — no account required but entries don't sync across devices. Optional future: Supabase sync via `journal_entries` table.**
- **Lawyer Type Matcher steps** — step 3 id: `special-circumstances` (multiselect), step 4 id: `state` (select CA/AZ). Previous steps (`employment-status`, `at-fault`) are gone.
- **Guide content standard** — all 13 guides at 1400–1660 words, 8–9 sections each. Compliance-safe language throughout.
- **print-hide CSS class** — defined in `app/globals.css`. Applied to hero, tab bar, print button, supporting content/FAQ/related/CTA block, sidebar. Journal entries print alone.
- **lib/related.ts** — pure data utility, no UI. Call per-page: `getAccidentRelated(slug)` returns `{injuries, guides, tools}` as `RelatedLink[]`. Each function is error-safe (bad slug → empty arrays). Pages are responsible for rendering the links — engine is not wired into any page UI yet.
- **Sitemap** — 75 entries. Excludes `/privacy`, `/terms`, `/find-help/results`, `/find-help/thank-you`. All priorities set per section type.
- **JSON-LD pattern** — hub pages: single `BreadcrumbList`. Detail pages: array `[primarySchema, breadcrumbSchema]` passed to single `<SchemaOrg>`. Root layout has `Organization` schema site-wide.

---

## Content Gaps (Lower Priority)

- All 16 city pages live — no city gaps remaining
- All content pending attorney review before go-live
- **`/privacy` and `/terms`** — page templates built but each section is a `placeholder` inside an amber "Pending Legal Review" callout. Both are `noIndex: true`.
- **Pre-existing lint errors (6)** — setState-in-effect in `IntakeWizard`, `EmergencyBanner`, `InjuryJournal`, `find-help/results`; unescaped entity in `injuries/[slug]`; `<a>` tag in `layout.tsx`. All pre-date DEV-25. Build and type check pass cleanly.
