# Session Context — April 23, 2026

## Where We Left Off (read this first in a new session)

**Last completed task: DEV-24 — 16 city page JSONs** ✅
- Created 12 new city JSON files with real hospitals, courts, corridors, and unique descriptions
  - CA (8 new): `san-jose`, `san-francisco`, `fresno`, `sacramento`, `long-beach`, `oakland`, `bakersfield`, `anaheim`
  - AZ (4 new): `mesa`, `chandler`, `scottsdale`, `gilbert`
- Updated `reviewedBy` → `"Pending Legal Review"` on 4 existing cities: `los-angeles`, `san-diego`, `phoenix`, `tucson`
- CMS auto-discovers all 16 via `fs.readdirSync` — no registry change needed
- Commit: `d647a60`
- **Bug fix:** State and city detail page breadcrumbs were missing `variant="dark"` — fixed in `app/states/[state]/page.tsx` and `app/states/[state]/[city]/page.tsx` — commit `4dc2347`

**Previous task: DEV-23 — CA + AZ state page JSONs** ✅
- Both `content/states/california.json` and `content/states/arizona.json` were already fully implemented in a prior session
- All DEV-23 spec requirements already present: CA (2yr PI SOL, 3yr property, pure comparative, SR-1 10 days, 15/30/5, Prop 213), AZ (2yr all, pure comparative, 25/50/15, no no-fault)
- Only change: updated `reviewedBy` from `"Pending Attorney Review"` → `"Pending Legal Review"` per spec — commit `9830e0c`

**Previous task: DEV-21 — Guide content expansion** ✅
- All 13 guides now at 1400–1660 words with 8–9 sections each
- DEV-21 spec covered 5 guides: `after-car-accident`, `evidence-checklist`, `insurance-claims`, `hiring-a-lawyer`, `common-mistakes` (new)
- Additional follow-up: all 9 DEV-11 guides (created April 22 at ~700 words) expanded to match same quality bar
- **Bug fix:** Guide detail page breadcrumb was missing `variant="dark"` — current page label rendered `text-neutral-950` (near-black) against dark hero; fixed in `app/guides/[slug]/page.tsx`

**DEV-20 status:** Already complete before this session — all 5 accident hub JSONs (car, truck, motorcycle, slip-and-fall, workplace) were fully implemented in a prior session.

**Previous task: DEV-19 — Injury Journal + Lawyer Type Matcher** ✅
- Injury Journal: new `InjuryJournal.tsx` component — localStorage (`ap-injury-journal`), list view, calendar view, print, add-entry form (date, pain 1-10, symptoms, treatments, medications, limitations, notes)
- Lawyer Type Matcher: steps 3-4 replaced — `special-circumstances` (multiselect: commercial vehicle, government property, workplace, product-defect, rideshare, none) + `state` (CA/AZ select)
- `lawyerTypeMatcher` output generator updated to use new step IDs; government entity flag produces critical item with state-specific deadline note
- `app/tools/[slug]/page.tsx` conditionally renders `InjuryJournal` for `injury-journal` slug, `ToolEngine` for all others
- AZ government claim copy softened to "Arizona deadlines vary by entity type and may be shorter" (was imprecise "60-180 days")
- **Post-DEV-19 fix:** Print was showing 4 pages — added `print-hide` CSS class to `globals.css`; applied to hero, tab bar, print button, supporting content/FAQ/related/CTA block, sidebar (`aside`). Journal entries now print alone.
- **Post-DEV-19 fix:** Only one entry could expand at a time — changed `expandedId: string | null` to `expandedIds: Set<string>` so multiple entries can be open simultaneously.

**Next task: DEV-25** — Structured data + sitemap + internal linking engine. This is the natural next unblocked task.

**DEV-22 status:** Partial. All page templates are built and rendering. `/privacy` and `/terms` have full structure (TOC, section headings, layout) but each section body shows a `placeholder` description inside an amber "Pending Legal Review" callout — no real legal copy yet. That copy is attorney-drafted, not Claude's to write. Both pages are `noIndex: true`. Consider DEV-22 blocked on legal team, not a code task.

**Remaining pending tasks (5 total):**
| Task | Description | Hours | Notes |
|------|-------------|-------|-------|
| DEV-22 | Home + About + static page content | 4h | Blocked on attorney-drafted Privacy/Terms copy |
| DEV-25 | Structured data + sitemap + internal linking | 8h | Ready — natural next task |
| DEV-26 | Analytics events + CRM webhook stub | 4h | Ready after DEV-25 |
| DEV-27 | E2E tests (Playwright) | 6h | Depends on DEV-14, 19, 24 (all done) |
| DEV-28 | Unit tests + Lighthouse 90+ + final polish | 6h | Depends on DEV-27 |

**Task reference file:** `scripts/create-master-pipeline-db.py` — all 28 DEV tasks defined here as Python dicts (DEV-01 through DEV-28). Canonical task list.

**Active branch:** `main` — all work on main, no open PRs. Last commit: `1bcf139`.

---

## DEV-21 Completed This Session

### What Was Done
- **`content/guides/common-mistakes.json`** — new file, 8 sections, ~1660 words. Covers: admitting fault, skipping medical care, recorded statements, quick settlement, social media, stopping treatment early, ignoring deadlines, not keeping records.
- **4 existing DEV-21 guides expanded** from ~650 words to 1500+ words (added 3 sections each):
  - `after-car-accident`: added what-not-to-do, comparative fault explainer, when-to-consult-attorney sections
  - `evidence-checklist`: added dashcam/digital evidence, couldn't-collect-at-scene, insurer investigation, organizing-file sections
  - `insurance-claims`: added insurer tactics, demand letter process, claim denial, when-claim-becomes-lawsuit sections
  - `hiring-a-lawyer`: added where-to-find, attorney-client relationship, case timeline, settlement-vs-lawsuit sections
- **9 DEV-11 guides expanded** from ~700–810 words to 1400–1500+ words (added 4 sections each):
  - `after-motorcycle-crash`, `after-truck-accident`, `am-i-at-fault`, `dealing-with-insurance-adjusters`, `getting-your-police-report`, `protecting-your-claim`, `settlement-vs-lawsuit`, `should-i-talk-to-a-lawyer`, `understanding-medical-bills`

### Commits
```
83dfb81 feat(content): expand 5 guide JSONs to 1500+ words — DEV-21
2610257 feat(content): expand 9 DEV-11 guide JSONs to 1400-1500+ words
8ec6d79 fix(guides): add variant="dark" to breadcrumb on guide detail pages
```

---

## DEV-15 Completed (April 23, 2026)

### Files Changed

| File | Action | What It Does |
|------|--------|-------------|
| `types/tool.ts` | Edit | Added `ToolOption`, `ToolAnswers`, `OutputItem`, `CTAConfig`, `ToolOutput` types; added `options?: ToolOption[]` to `ToolStepSchema` |
| `components/tools/ToolProgressBar.tsx` | New | Light-mode progress bar (neutral-200 track, primary-600 fill, ARIA compliant) |
| `components/tools/ToolStep.tsx` | New | Renders one step by type: select (tappable radio cards), multiselect/checklist (checkbox cards), number, text, date |
| `components/tools/ToolResults.tsx` | New | Priority-badged output items (critical/important/helpful), CTA link, window.print() export, Start Over |
| `components/tools/ToolEngine.tsx` | Rewrite | Full interactive wizard: disclaimer before → progress bar → steps → results → disclaimer after; saves to Supabase `tool_submissions` on completion |
| `lib/tools/output-generators.ts` | New | `outputGenerators` registry with 11 functions, one per tool slug |
| `content/tools/*.json` (all 11) | Edit | Added `options` arrays to all select/multiselect/checklist steps |
| `app/globals.css` | Edit | Added missing `danger-700` and `warning-700` Tailwind tokens |

### Architecture Decisions

- `ToolEngine` imports `outputGenerators` registry internally — no prop threading from server page
- If a tool has no registered generator (future tool), shows "coming soon" fallback gracefully
- `canAdvance()` enforces each step must be answered before proceeding
- Supabase `tool_submissions` insert on final step — errors silently swallowed so user flow isn't blocked
- `window.print()` guarded with `typeof window !== 'undefined'` check

### Step ID Corrections (actual JSON vs. spec)

The JSON files had different step IDs than the TOOLS-SPEC.md spec. Actual IDs (what the output generators use):

| Tool | Actual step IDs |
|------|----------------|
| insurance-call-prep | `caller-type`, `call-purpose`, `info-available` |
| settlement-readiness | `medical-status`, `records-gathered` (checklist), `wages-documented`, `attorney-consulted` |
| lawyer-type-matcher | `accident-type`, `injuries` (checklist), `employment-status`, `at-fault` |
| statute-countdown | `accident-date` (date), `accident-type`, `state` |
| state-next-steps | `state`, `accident-type`, `accident-date` (date) |

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
| **DEV-14: State rules engine** | ✓ Complete |
| **DEV-15: ToolEngine live (all 11 tools)** | ✓ Complete |
| **DEV-16: Accident Case Quiz — witnesses step + output fix** | ✓ Complete |
| **DEV-17: Urgency Checker — Red/Yellow/Green tiers** | ✓ Complete |
| **DEV-18: Evidence Checklist — category grouping + print CSS** | ✓ Complete |
| **DEV-19: Injury Journal + Lawyer Type Matcher** | ✓ Complete |
| **DEV-20: Accident hub content JSONs (5 files)** | ✓ Complete (pre-session) |
| **DEV-21: Guide content JSONs (13 guides, all 1400–1660 words)** | ✓ Complete |
| **DEV-23: CA + AZ state page JSONs** | ✓ Complete (pre-existing + reviewedBy fix) |
| **DEV-24: 16 city page JSONs (10 CA + 6 AZ)** | ✓ Complete |

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
- **Breadcrumb variant rule** — ALL detail pages inside a dark hero (`bg-primary-900`) must pass `variant="dark"` to `Breadcrumb`. Default is `light` (dark text). Fixed in: `app/guides/[slug]/page.tsx` (`8ec6d79`), `app/states/[state]/page.tsx` + `app/states/[state]/[city]/page.tsx` (`4dc2347`).
- **Attorney review pending** on all state and content JSON files before go-live.
- **Supabase lazy init** — `getSupabase()` factory pattern (not module-level) to prevent Next.js prerender crash.
- **Step animation** — `key={step}` on step container + `animate-step-in` CSS class (`@keyframes step-in` in `globals.css`).
- **Output item priorities** — `critical` / `important` / `helpful` labels are hardcoded per-item inside each output generator function in `lib/tools/output-generators.ts`. No dynamic scoring.
- **`OutputItem.category?`** — optional `string` field on `OutputItem`. When any item has `category` set, `ToolResults` groups items under bold uppercase category headers. Only `evidenceChecklist` uses categories currently.
- **Priority badge styles** — `critical`: `bg-danger-500 text-white`; `important`: `bg-warning-500 text-white`; `helpful`: `bg-success-50 text-success-700 border-success-500`. Only tokens defined in `globals.css` (`-50`, `-500`, `-700`) — no `-100`/`-200`/`-300` tokens exist.
- **`tool_submissions` schema** — columns: `id` (uuid), `tool_slug` (text), `answers` (jsonb), `output` (jsonb, added DEV-17), `result_summary` (text, legacy/unused), `created_at` (timestamptz). Insert fires on final step completion; errors swallowed silently.
- **ToolEngine output generators** — each tool's logic in `lib/tools/output-generators.ts`. Step IDs must match actual JSON files — TOOLS-SPEC.md step IDs differed from the implemented JSON.
- **InjuryJournal component** — `components/tools/InjuryJournal.tsx` is a `'use client'` persistent journal (NOT ToolEngine). `app/tools/[slug]/page.tsx` uses `tool.slug === 'injury-journal'` to conditionally render it. localStorage key: `ap-injury-journal`. Data shape: `JournalEntry { id, date, painLevel, symptoms[], treatments[], medications, limitations, notes }`. **Storage is device/browser-local — no account required but entries don't sync across devices. Optional future task: Supabase sync using existing `journal_entries` table for logged-in users.**
- **Lawyer Type Matcher steps** — step 3 id: `special-circumstances` (multiselect), step 4 id: `state` (select CA/AZ). Output generator uses these IDs. Previous steps (`employment-status`, `at-fault`) are gone.
- **Guide content standard** — all 13 guides at 1400–1660 words, 8–9 sections each. Compliance-safe language throughout. Created in two batches: DEV-11 (April 22, initial scaffolding) + DEV-21 (April 23, expansion to spec).

---

## Content Gaps (Lower Priority)

- All 16 city pages now live — no more city gaps
- All content pending attorney review before go-live
- **`/privacy` and `/terms`** — page templates fully built (layout, TOC, section structure), but each section renders a `placeholder` description inside an amber "Pending Legal Review" callout instead of real legal copy. Actual Privacy Policy and Terms of Service text needs to be written (likely attorney-drafted). Both pages are `noIndex: true` so they won't appear in search until finalized.

---

## What's Next

| Task | Est. Hours | Status |
|------|-----------|--------|
| **DEV-25** | **8h** | **Ready — start here** |
| DEV-26 | 4h | Ready (after DEV-25) |
| DEV-27 | 6h | Ready |
| DEV-28 | 6h | After DEV-27 |
| DEV-22 | 4h | Blocked — Privacy/Terms copy needs attorney drafting |
| DEV-23 | — | ✓ Complete |
| DEV-24 | — | ✓ Complete |
| Attorney review of all content before go-live | — | Pending |

---

## Active Branch

`main` — all work pushed to `origin/main`. No open PRs. Last commit: `4dc2347`.
