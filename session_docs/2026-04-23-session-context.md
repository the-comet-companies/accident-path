# Session Context — April 23, 2026

## Where We Left Off (read this first in a new session)

**Last completed task: DEV-19 — Injury Journal + Lawyer Type Matcher** ✅
- Injury Journal: new `InjuryJournal.tsx` component — localStorage (`ap-injury-journal`), list view, calendar view, print, add-entry form (date, pain 1-10, symptoms, treatments, medications, limitations, notes)
- Lawyer Type Matcher: steps 3-4 replaced — `special-circumstances` (multiselect: commercial vehicle, government property, workplace, product-defect, rideshare, none) + `state` (CA/AZ select)
- `lawyerTypeMatcher` output generator updated to use new step IDs; government entity flag produces critical item with state-specific deadline note
- `app/tools/[slug]/page.tsx` conditionally renders `InjuryJournal` for `injury-journal` slug, `ToolEngine` for all others
- AZ government claim copy softened to "Arizona deadlines vary by entity type and may be shorter" (was imprecise "60-180 days")
- Layout polish for evidence checklist deferred (was pending since DEV-18)

**Previous task: DEV-18 — Evidence Checklist Generator (category grouping + print CSS)** ✅
- Output now renders under 6 category headers: Documents, Scene, Witnesses, Digital, Medical, Financial
- `OutputItem.category?` optional field added to type — backward compatible, all other tools unaffected
- `ItemCard` extracted as local component in `ToolResults.tsx`; keys use `${i}-${item.label}` for uniqueness
- `@media print` added to `globals.css` — hides header/footer/nav, forces white background

**Previous task: DEV-17 — Urgency Checker tool (Red/Yellow/Green tiers)** ✅
- Red flags updated: numbness-tingling + neck-back-pain moved to red; severe-bleeding added to JSON + red flags
- Output tiers: Red (seek attention immediately) / Yellow (24–48h) / Green (within week / follow provider)
- `tool_submissions` Supabase table fixed: added missing `output jsonb` column via migration
- Priority badge visibility fixed: Critical + Important now use solid fill (bg-*-500 text-white)

**Next task: DEV-20** — check `scripts/create-master-pipeline-db.py` for definition. Wait for user to authorize.

**Task reference file:** `scripts/create-master-pipeline-db.py` — all 28 DEV tasks defined here as Python dicts (DEV-01 through DEV-28). Canonical task list.

**Active branch:** `main` — all work on main, no open PRs. Last commit: `98386aa`.

---

## DEV-15 Completed Today (April 23, 2026)

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

### Key Technical Details

- `ToolStep.tsx`: `select` div has no `role="radiogroup"` (ARIA violation if children are `button+aria-pressed`) — removed per code review
- `ToolProgressBar.tsx`: `aria-valuemin={0}` (not 1), `w-full` on root div
- `ToolResults.tsx`: items keyed by `item.label`, `window.print()` guarded, disclaimer at `text-neutral-500` for WCAG AA contrast
- `output-generators.ts`: `str()` helper for safe scalar answer reads, `computeSolDeadline()` shared between `stateNextSteps` and `statuteCountdown`; government claim deadline uses timestamp arithmetic (no day-overflow bug)

### DEV-15 Git Commits (in order)

```
22d5034 feat(tools): extend ToolStep with options + add ToolOutput types — DEV-15
8cd1244 feat(tools): add ToolProgressBar and ToolStep sub-components — DEV-15
e124c09 feat(tools): add ToolResults component — DEV-15
a9e8da0 feat(tools): rewrite ToolEngine as live interactive wizard — DEV-15
c67b82f fix(tools): ARIA violations and quality fixes — DEV-15
d0ffdbe feat(tools): add step options to all 11 tool JSON files — DEV-15
32281b1 feat(tools): implement output generators for all 11 tools — DEV-15
e9ce85e fix(tools): type-safe helpers and SOL date arithmetic refactor — DEV-15
```

---

## DEV-14 Summary (April 23, 2026)

### Files Changed

| File | Action | What It Does |
|------|--------|-------------|
| `types/state-rules.ts` | New | `ReportingDeadline` + `StateRules` interfaces |
| `lib/state-rules.ts` | New | `STATE_RULES: Record<'CA' \| 'AZ', StateRules>` + `getRelevantDeadlines()` |
| `app/api/intake/route.ts` | New | POST-only route handler: Zod validates → inserts to `intake_sessions` |
| `components/intake/IntakeWizard.tsx` | Edit | Submits via `/api/intake` (no client-side Supabase import) |
| `app/find-help/results/page.tsx` | Edit | State rules card between urgency banner and lawyer type card |

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
- **Output item priorities** — `critical` / `important` / `helpful` labels are hardcoded per-item inside each output generator function in `lib/tools/output-generators.ts`. No dynamic scoring. Labels sourced from TOOLS-SPEC.md Tool 3 line; applied globally during DEV-15.
- **`OutputItem.category?`** — optional `string` field on `OutputItem`. When any item in a tool's output has `category` set, `ToolResults` groups items under bold uppercase category headers (using `Map` for insertion-order preservation). Tools without categories render the existing flat list. Only `evidenceChecklist` uses categories currently.
- **Priority badge styles** — `critical`: `bg-danger-500 text-white`; `important`: `bg-warning-500 text-white`; `helpful`: `bg-success-50 text-success-700 border-success-500`. Only tokens defined in `globals.css` (`-50`, `-500`, `-700`) — no `-100`/`-200`/`-300` tokens exist.
- **`tool_submissions` schema** — columns: `id` (uuid), `tool_slug` (text), `answers` (jsonb), `output` (jsonb, added DEV-17), `result_summary` (text, legacy/unused), `created_at` (timestamptz). Insert fires on final step completion; errors swallowed silently so user flow isn't blocked.
- **ToolEngine output generators** — each tool's logic in `lib/tools/output-generators.ts`. Step IDs must match actual JSON files (see table above) — TOOLS-SPEC.md step IDs differed from the implemented JSON.
- **InjuryJournal component** — `components/tools/InjuryJournal.tsx` is a `'use client'` persistent journal (NOT ToolEngine). `app/tools/[slug]/page.tsx` uses `tool.slug === 'injury-journal'` to conditionally render it. localStorage key: `ap-injury-journal`. Data shape: `JournalEntry { id, date, painLevel, symptoms[], treatments[], medications, limitations, notes }`.
- **Lawyer Type Matcher steps** — step 3 id: `special-circumstances` (multiselect), step 4 id: `state` (select CA/AZ). Output generator uses these IDs. Previous steps (`employment-status`, `at-fault`) are gone.

---

## Content Gaps (Lower Priority)

- More city pages: San Jose, San Francisco, Fresno, Sacramento, Long Beach, Oakland, Bakersfield, Anaheim (CA) + Mesa, Chandler, Scottsdale, Gilbert (AZ) — 12 more
- All content pending attorney review before go-live

---

## What's Next

| Task | Est. Hours | Status |
|------|-----------|--------|
| More city pages (12 additional CA/AZ cities) | 3 | Not started |
| Attorney review of all content before go-live | — | Pending |
| Check MASTER-PLAN.md for remaining DEV tasks | — | — |

---

## Active Branch

`main` — all work pushed to `origin/main`. No open PRs. Last commit: `e9ce85e`.
