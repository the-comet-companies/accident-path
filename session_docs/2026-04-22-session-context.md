# Session Context — April 22, 2026

## Summary

Yesterday's session (April 21) completed a full UI/UX pass across the home page and the accidents hub — redesigning the hero, trust row, how-it-works, accident grid, featured tools, educational guides, state selector, and accidents hub listing page. All 15 accident type hubs are now in CMS. Today's session (April 22) focused on the `/guides` section — fixing breadcrumb contrast, building out all 10 missing guide CMS files, and redesigning the guides listing page to match the two-tone filter layout from `/accidents`.

---

## What Was Accomplished Yesterday (April 21)

### Home Page — Full UI/UX Pass

| Section | What Changed |
|---------|-------------|
| **HeroVisual** | CSS 3D floating shield + canvas particle network (110 particles, GSAP float/pulse/orbit rings) — no Three.js |
| **Trust Row** | Split-layout: dark left panel (eyebrow + heading + CTA) + 4 amber-icon columns with partial-height dividers |
| **How It Works** | Dark gradient bg, amber eyebrow, 3 centered columns with frosted icon tiles, GSAP spring animations |
| **Accident Grid** | Dramatic dark→light gradient bridge, lifted white card panel, `react-icons` FA icons (car/truck silhouette distinction) |
| **Featured Tools** | Full-width rows on `bg-surface-info`, teal icon tiles, plain "Try It Free →" text CTA — no ToolCard wrapper |
| **Educational Guides** | Article-preview cards on `bg-surface-page`, teal accent bar, attorney-reviewed badge, serif italic excerpt |
| **State Selector** | Seamless `bg-surface-page` continuation from guides, amber eyebrow, pills + dropdown; pills later removed (redundant) |
| **Header Dropdowns** | Accident Types + State Guides open on hover (180ms grace period timer), click + Escape still work |

### Accidents Hub Redesign

- **Layout:** F2 — two-tone sidebar filter. Dark left rail (vertical text tabs on desktop, horizontal scroll on mobile) + right card grid panel.
- **`components/content/AccidentsHubClient.tsx`** (new `'use client'` component) — 6 category tabs (All/Vehicle/Premises/Workplace/Injury Type/Other), fixed `h-[520px]` card, `overflow-y-auto` right panel, "Most Common" amber badge for car + slip-and-fall.
- **`app/accidents/page.tsx`** — removed icon map/Lucide imports, added amber eyebrow, white rounded card wrapper (`max-w-6xl mx-auto`).
- **2 missing CMS files added:** `content/accidents/traumatic-brain.json` + `content/accidents/spinal.json` — **all 15 accident hubs now covered.**

---

## Today's Work — April 22

### Breadcrumb Dark Variant (commit `eaac95d`)

- **Problem:** Breadcrumb text (`text-neutral-500` / `text-neutral-950`) was nearly invisible on `bg-primary-900` hero sections.
- **Fix:** Added `variant?: 'light' | 'dark'` prop to `components/layout/Breadcrumb.tsx`.
  - Dark variant: separators + "Home" link → `text-white/50`, current page → `text-white/90 font-medium`, hover → `hover:text-white`
  - Default (`light`) unchanged — all other pages unaffected.
- **Applied to:** `app/accidents/page.tsx` and `app/accidents/[slug]/page.tsx`.

---

### Guides Content — 10 New CMS Files (commit `a09f029`)

Guides library grew from **3 → 13**. All files are Zod-compliant (5 sections each, metaTitle ≤70, metaDescription 120–160 chars, compliance-safe language throughout).

| Slug | Category | Target Keyword |
|------|----------|---------------|
| `after-car-accident` | After an Accident | "what to do after a car accident" |
| `after-truck-accident` | After an Accident | "truck accident what to do" |
| `after-motorcycle-crash` | After an Accident | "motorcycle accident steps" |
| `dealing-with-insurance-adjusters` | Insurance & Claims | "how to talk to insurance adjuster" |
| `protecting-your-claim` | Insurance & Claims | "mistakes after car accident" |
| `understanding-medical-bills` | Medical & Bills | "accident medical bills explained" |
| `getting-your-police-report` | Evidence & Docs | "how to get accident police report" |
| `am-i-at-fault` | Legal Decisions | "am I at fault car accident" |
| `settlement-vs-lawsuit` | Legal Decisions | "settlement vs lawsuit personal injury" |
| `should-i-talk-to-a-lawyer` | Legal Decisions | "do I need a lawyer after accident" |

`am-i-at-fault` and `settlement-vs-lawsuit` are flagged as **Phase 1 cornerstone** in `CONTENT-PLAN.md`.

---

### Guides Page Redesign (commit `a00e040`)

- **`app/guides/page.tsx`** fully replaced — now matches `/accidents` hero pattern exactly:
  - `Breadcrumb variant="dark"`
  - Amber eyebrow "Educational Guides" with flanking `<span>` lines
  - Bold h1, serif italic subtext
  - Attorney-reviewed badge (`text-success-500 ✓`) + disclaimer
  - White rounded card wrapper (`max-w-6xl mx-auto`, `bg-surface-card rounded-2xl shadow-sm border`)
- **`components/content/GuidesHubClient.tsx`** (new `'use client'` component):
  - 6 category tabs: All (13) · After an Accident (3) · Insurance & Claims (3) · Evidence & Docs (2) · Legal Decisions (4) · Medical & Bills (1)
  - Fixed `sm:h-[520px]` wrapper + `overflow-y-auto` right panel (same as AccidentsHubClient)
  - Amber "★ Cornerstone Guide" badge on `am-i-at-fault` + `settlement-vs-lawsuit`
  - Card footer: section count + estimated read time (`sections.length * 3` min)

---

## Today's Work (continued) — Bug Fix + Static Pages

### Home Page Tool Nav Fix (commit `9657dd9`)

- **Problem:** "Try It Free" buttons in the Featured Tools section on the home page were 404ing — the `FEATURED_TOOLS` array in `app/page.tsx` had stale slugs from before DEV-12 was built (`statute-of-limitations`, `medical-cost-estimator`, `insurance-claim-tracker`).
- **Fix:** Updated all 5 slugs to match actual `content/tools/*.json` files:
  - `statute-of-limitations` → `statute-countdown`
  - `medical-cost-estimator` → `lost-wages-estimator`
  - `insurance-claim-tracker` → `insurance-call-prep`
  - `evidence-checklist` + `injury-journal` were already correct

---

### DEV-12 Static Pages (commits `426aac6` → `733d3bd`, 8 commits total)

7 static pages built — all server components, no CMS required. All follow the established hub hero pattern (dark `bg-primary-900`, `Breadcrumb variant="dark"`, amber eyebrow, h1, serif italic subtext).

| Route | File | Notes |
|-------|------|-------|
| `/about` | `app/about/page.tsx` | Mission, approach, who we serve, important notice disclaimer |
| `/about/how-it-works` | `app/about/how-it-works/page.tsx` | 4 step cards (01–04) each with dark numbered badge, body, CTA |
| `/privacy` | `app/privacy/page.tsx` | `noIndex: true`, 10 sections, amber "Pending Legal Review" boxes for counsel |
| `/terms` | `app/terms/page.tsx` | `noIndex: true`, 12 sections, amber "Pending Legal Review" boxes for counsel |
| `/disclaimers` | `app/disclaimers/page.tsx` | Real legal copy (7 disclaimers), indexable, ToC with anchor links |
| `/for-attorneys` | `app/for-attorneys/page.tsx` | 5 BENEFITS bullets, 11 PRACTICE_AREAS pills, dark `bg-primary-900` CTA block |
| `/contact` | `app/contact/page.tsx` | 4 email contacts in 2-col grid, "What to Expect" bullets, callout to /guides + /tools |

**A11y fixes caught and corrected during review loop:**
- `app/about/how-it-works/page.tsx` — `aria-hidden="true"` on step number bubble div; `→` arrows wrapped in `<span aria-hidden="true">`
- `app/about/page.tsx` — same `→` arrow fix (caught in final review)
- `app/contact/page.tsx` — replaced raw `<a href="/guides">` / `<a href="/tools">` with Next.js `<Link>` (caught in final review)
- `app/disclaimers/page.tsx` — ToC changed from `<ol>` to `<ul>` since headings are unnumbered prose (caught in final review)

**Build:** 60 → 68 static pages after adding all 7 routes.

---

## Today's Work (continued) — DEV-12: Tools Section

### What Was Built (commits `c879a90` → `a9c02f2`, merged to `main` as `37de657`)

Full tools section built and shipped — 17 files, 10 tasks via subagent-driven development.

**Schema + CMS infrastructure:**
- `types/tool.ts` — `ToolConfigSchema` + `ToolStepSchema` Zod schemas (metaTitle ≤70, metaDescription 120–160, description ≥100, ≥2 steps, ≥4 supportingContent sections each ≥150 chars, ≥3 FAQ items each ≥50 chars)
- `lib/cms.ts` — added `getTool` / `getAllTools`
- `lib/seo.ts` — added `softwareApplicationSchema` (returns `SoftwareApplication` JSON-LD with `offers` + `provider` blocks)

**11 CMS content files** in `content/tools/` (all Zod-validated, compliance-safe throughout):

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

**Pages:**
- `app/tools/page.tsx` — featured 2-col dark cards (`bg-primary-900`, amber ★ badge) + 9-card teal-icon grid, both inside one white card wrapper. No client hub component — static layout.
- `app/tools/[slug]/page.tsx` — detail page: dual `SchemaOrg` (SoftwareApplication + FAQPage), dark hero, 2-col layout (`lg:grid-cols-[1fr_300px]`), `ToolEngine` → supporting content sections → FAQ `<details>`/`<summary>` accordion → relatedAccidents pills → CTAButton. Sidebar: step nav, CTA card, related tools + related guides. `DisclaimerBanner` footer.
- `components/tools/ToolEngine.tsx` — `'use client'` placeholder: amber disclaimer banner, numbered step list with type labels, greyed-out `opacity-50` "Start Tool →" + "Launching soon" badge.

**One bug caught at build time:** `evidence-checklist.json` metaDescription was 164 chars (max 160). Trimmed to 141.

**Merge note:** `staging` → `main` had a conflict on `Breadcrumb.tsx` — main already had a cleaner computed-variable implementation of `variant="dark"`. Kept main's version, discarded staging's inline ternaries.

---

## Current Build State

| Item | Status |
|------|--------|
| Next.js 14 App Router | ✓ |
| TypeScript strict | ✓ |
| Tailwind v4 + design tokens | ✓ |
| Inter + Merriweather fonts | ✓ |
| zod / lucide-react / react-icons / supabase / gsap | ✓ |
| Supabase (intake_sessions, tool_submissions, journal_entries + RLS) | ✓ |
| Core UI components (CTAButton, TrustBadge, DisclaimerBanner, EmergencyBanner, Breadcrumb) | ✓ |
| Breadcrumb `variant="dark"` for dark hero sections | ✓ |
| Header (hover dropdowns, desktop mega-menu) + MobileNav | ✓ |
| Footer (4-col, compliance disclaimers) | ✓ |
| SEO primitives (SchemaOrg, MetaTags, CanonicalUrl, lib/seo.ts — incl. softwareApplicationSchema) | ✓ |
| StateSelector (CA/AZ) | ✓ |
| ComplianceWrapper + withCompliance HOC | ✓ |
| AccidentCard, ToolCard, ChecklistBlock, TimelineBlock, AccidentsHubClient, GuidesHubClient | ✓ |
| Home page (all 8 sections, GSAP animations, HeroVisual) | ✓ |
| `/accidents` hub (F2 two-tone filter, 15 cards) | ✓ |
| `/accidents/[slug]` detail pages (15 pages) | ✓ |
| `/injuries` index + `/injuries/[slug]` (7 pages) | ✓ |
| `/guides` hub (two-tone filter, 13 guides, 6 categories) | ✓ |
| `/guides/[slug]` detail pages (13 pages) | ✓ |
| `/states` index + `/states/[state]` (CA + AZ) | ✓ |
| `/states/[state]/[city]` (LA, San Diego, Phoenix, Tucson) | ✓ |
| `/tools` hub (featured 2-col + 9-card grid) | ✓ |
| `/tools/[slug]` detail pages (11 pages, ToolEngine placeholder) | ✓ |
| `/about` (mission, approach, who we serve) | ✓ |
| `/about/how-it-works` (4-step process) | ✓ |
| `/privacy` (structured placeholder, `noIndex`, 10 sections) | ✓ |
| `/terms` (structured placeholder, `noIndex`, 12 sections) | ✓ |
| `/disclaimers` (real legal copy, 7 sections, indexable) | ✓ |
| `/for-attorneys` (partnership pitch, benefits, practice areas) | ✓ |
| `/contact` (4 contact topics by email, response expectations) | ✓ |
| All 68 pages statically generated | ✓ |
| **DEV-15: Tool interactivity (ToolEngine live)** | ✗ Not started |
| **Phase 3: IntakeWizard** | ✗ Not started |
| **Phase 3: State rules engine** | ✗ Not started |
| **Phase 3: Find Help flow** | ✗ Not started |

---

## Architecture Reminders (Key Decisions)

- **CMS = JSON files, not DB.** `cms.get*()` reads `content/**/*.json` at build time. Supabase is for runtime user data only (intake sessions, tool submissions, journal entries).
- **`generateStaticParams`** pre-builds all slugs at build time → static HTML.
- **Tailwind v4** — no `tailwind.config.ts`. All tokens live in `app/globals.css` via `@theme`.
- **GSAP animations** — always use `fromTo` + `immediateRender: false` to prevent invisible-on-scroll bug.
- **Compliance HOC routes:** `/tools/*` → `tool`, `/find-help/*` → `intake`, `/states/*` → `state`, everything else → `default`.
- **HeroVisual is purely decorative** — all content (h1, CTAs, copy) stays in `app/page.tsx`.
- **No Three.js** — CSS 3D + SVG + GSAP only. Keeps Lighthouse 90+ target intact.
- **react-icons FA Solid** for accident-type icons (car/truck silhouette distinction). lucide-react for all other UI icons.
- **Trust Row + How It Works dividers** — use absolutely-positioned `<span>` (not `border-r`) so dividers don't span full grid cell height.
- **Hub page pattern** — all index pages (`/accidents`, `/guides`) share the same hero structure: Breadcrumb dark, amber eyebrow, h1, serif italic subtext, attorney-reviewed badge, disclaimer, white rounded card with two-tone filter client component inside.
- **Attorney review pending** on all state and content JSON files before go-live.

---

## Content Gaps (Lower Priority)

- More city pages: San Jose, San Francisco, Fresno, Sacramento, Long Beach, Oakland, Bakersfield, Anaheim (CA) + Mesa, Chandler, Scottsdale, Gilbert (AZ) — 12 more
- All content pending attorney review before go-live

---

## What's Next — Phase 3: Intake + State Rules Engine

Per `docs/strategy/MASTER-PLAN.md` Phase 3 (~20h):

| Task | Est. Hours |
|------|-----------|
| IntakeWizard — 9-step multi-step form | 8 |
| State routing rules engine (CA/AZ logic) | 4 |
| Lead scoring / urgency detection | 4 |
| Find Help flow (wizard, results, thank-you pages) | 4 |

**Key routes to build:**
- `app/find-help/page.tsx` — intake wizard entry point
- `app/find-help/results/page.tsx` — match results
- `app/find-help/thank-you/page.tsx` — confirmation

**Key lib to build:**
- `lib/intake.ts` — state routing rules, urgency scoring, form state management
- Supabase write: `intake_sessions` table insert on wizard completion

**Compliance requirements for intake flow:**
- Every step must show intake-variant DisclaimerBanner
- Step asking about legal representation: must not imply endorsement
- Matching results: use safe language ("lawyers who typically handle matters like this include...")
- No "you have a case" language anywhere in the flow

---

## Active Branch

`main` — all work pushed to `origin/main`. No open PRs.
