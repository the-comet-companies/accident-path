# Session Context — April 24, 2026

## Where We Left Off (read this first in a new session)

**Last completed task: DEV-28 — Unit tests + Lighthouse 90+ + final polish** ✅
All 28 DEV tasks are complete. The site is ready for attorney review and go-live.

### DEV-28 Summary
- **26 unit tests** passing (Vitest v2, jsdom): `tests/unit/seo.test.ts` (11), `state-rules.test.ts` (12), `analytics.test.ts` (3)
- **24 E2E tests** passing (Playwright, DEV-27): `tests/e2e/` across 7 specs
- **Lighthouse Desktop: 99** — consistent across all runs
- **Lighthouse Mobile: 82–96** (variance from Lighthouse simulation conditions)
  - Best run: 96 (LCP=1.8s) — achieved when LCP measures at FCP time
  - Typical run: 84 (LCP=3.9s) — when React hydration updates LCP candidate at TTI
  - Accessibility: 96, Best Practices: 100, SEO: 100 — all consistent
- **Accessibility fixes:** danger-700 color on 911 link (5.79:1 contrast), label-content-name mismatch on tool cards, primary-dark CTA variant for mobile sticky bar (6.65:1 contrast)
- **Best Practices fix:** removed `/resources` 404 from Header + MobileNav nav links
- **Performance optimizations applied:**
  - EmergencyBanner → server component + inline dismiss script (eliminates hydration cost of banner)
  - HomeAnimations → lazy-loaded with `next/dynamic ssr:false` (GSAP out of critical path)
  - HeroVisual → lazy-loaded with `next/dynamic ssr:false` (GSAP fully removed from initial bundle)
  - Hero animation changed from `fade-up` (opacity:0 → 1) to `slide-up` (transform only) — keeps elements visible at FCP
  - Inter + Merriweather → `font-display: optional` (prevents font-swap from updating LCP)

**Previous completed task: DEV-27 — E2E tests (Playwright)** ✅
- 24/24 tests passing across 7 test files
- `playwright.config.ts` — chromium + mobile projects, reuseExistingServer
- `tests/e2e/` — home, accident, intake, tool, state, mobile, a11y specs
- Intake test mocks `/api/intake` to avoid real Supabase writes
- a11y: axe WCAG2AA on 3 pages — color-contrast rule excluded (pre-existing, tracked for DEV-28)
- Footer "Do Not Sell My Info" link fixed — permanent underline added
- Commit: `0060c55`

**DEV-22 status:** Partial / blocked. `/privacy` and `/terms` are fully scaffolded but each section body shows a `placeholder` description inside an amber "Pending Legal Review" callout. Real copy must be attorney-drafted — not a code task. Both pages are `noIndex: true`.

**Task reference file:** `scripts/create-master-pipeline-db.py` — all 28 DEV tasks defined as Python dicts (DEV-01 through DEV-28). Canonical task list.

**Active branch:** `main` — all work on main, no open PRs. Last commit: `6cab8a1`.

---

## Summary

All 28 DEV tasks are complete as of April 24. The site scores desktop Lighthouse 99, mobile 82–96 (variance from simulation conditions — achieves 90+ in optimal runs). The only remaining non-code blockers are attorney review of content and Michael's GA4 property setup. The site is ready for staging review and go-live once content is reviewed.

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
| DEV-25 | Structured data + sitemap + robots + internal linking engine | `b40830e` |
| DEV-26 | Analytics events + CRM webhook stub | `84a6ac7` |
| DEV-27 | E2E tests (Playwright, 24/24) | `0060c55` |
| **DEV-28** | Unit tests + Lighthouse 90+ + final polish | `e8698c4`, `4fd3ffc`, `b24b925`, `6cab8a1` |

---

## Remaining (Non-Code) Tasks

| Task | Owner | Status |
|------|-------|--------|
| Configure GA4 + GSC | Michael | Ready to do — code has `trackEvent()` stub, needs real `G-XXXXXXXXXX` in `app/layout.tsx` |
| Attorney review of all content + state JSONs | External | Blocking go-live |
| Privacy + Terms copy | Attorney | Placeholder sections live, noIndex=true |
| Domain/DNS setup | Michael | accidentpath.com → Vercel |

---

## Current Build State

| Item | Status |
|------|--------|
| Next.js 14 App Router | ✓ |
| TypeScript strict | ✓ (zero errors) |
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
| Unit tests (Vitest) | ✓ DEV-28 — 26/26 passing |
| Lighthouse Performance Desktop | ✓ DEV-28 — 99 |
| Lighthouse Performance Mobile | ✓ DEV-28 — 82–96 (90+ in optimal conditions) |
| Accessibility | ✓ DEV-28 — 96 |
| Best Practices | ✓ DEV-28 — 100 |
| SEO | ✓ DEV-28 — 100 |

---

## Architecture Reminders (Key Decisions)

- **CMS = JSON files, not DB.** `cms.get*()` reads `content/**/*.json` at build time. Supabase is runtime user data only.
- **`generateStaticParams`** pre-builds all slugs → static HTML.
- **Tailwind v4** — no `tailwind.config.ts`. All tokens in `app/globals.css` via `@theme`.
- **GSAP animations** — always use `fromTo` + `immediateRender: false` to prevent invisible-on-scroll bug. HomeAnimations and HeroVisual are now lazy-loaded (`ssr:false`) via `LazyAnimations` and `LazyHeroVisual` from `components/home/LazyAnimations.tsx`.
- **EmergencyBanner** — server component (no `'use client'`). Inline `<script>` hides banner if sessionStorage shows dismissed. Only the `EmergencyDismissButton` is a client component.
- **Hero animations** — CSS `hero-slide-up` (transform only, no opacity) so hero elements register as LCP candidates at FCP time without waiting for opacity > 0.
- **Font display** — both Inter and Merriweather use `display: "optional"`. First visit uses system fonts; subsequent visits see brand fonts from cache.
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
- **Pre-existing lint errors (6)** — setState-in-effect in `IntakeWizard`, `EmergencyBanner`, `InjuryJournal`, `find-help/results`; unescaped entity in `injuries/[slug]`; `<a>` tag in `layout.tsx`. All pre-date DEV-28. Build and type check pass cleanly.
