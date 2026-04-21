# Session Context — April 21, 2026

## Summary

Yesterday's session (April 20) completed DEV-10 and DEV-11 — a full sweep of all CMS-driven page templates and content files. The site now has 37+ statically generated pages across accidents, injuries, guides, states, and cities. Today's session (April 21) focused on hero section UI/UX improvements — a CSS 3D animated shield over a dense particle network canvas replaced the static "What You'll Get" card.

---

## What Was Accomplished Yesterday

### DEV-10: Accident Hub Pages + CMS Content

**New Components:**
- `components/content/ChecklistBlock.tsx` — interactive checklist with progress bar, priority-colored categories (critical/important/helpful), React state for checking items
- `components/content/TimelineBlock.tsx` — server component visual timeline with numbered dots, period labels, risk warnings (amber icon), and action items

**New Routes:**
- `app/accidents/page.tsx` — index listing all 13 accident types from CMS, slug→lucide icon map, responsive grid
- `app/accidents/[slug]/page.tsx` — full hub template with 9 sections: Hero (stats card), Common Causes, Likely Injuries, Immediate Steps, Evidence Checklist, Timeline Risks, Insurance Issues, When to See a Lawyer, State-Specific Notes (CA + AZ). Sticky sidebar on desktop with anchor nav + CTA card.

**CMS Content — All 13 Accident JSON Files** (`content/accidents/`):
`car`, `truck`, `motorcycle`, `uber-lyft`, `pedestrian`, `bicycle`, `slip-and-fall`, `dog-bite`, `construction`, `workplace`, `wrongful-death`, `premises`, `product`

**Bug Fix:** Home page `FEATURED_ACCIDENTS` slugs were `car-accidents`, `truck-accidents`, etc. — corrected to match CMS file names: `car`, `truck`, `motorcycle`, `workplace`.

---

### DEV-11: Guide, Injury, State, and City Page Templates + CMS Content

**New Routes (8 templates + index pages):**

| Route | Template | Notes |
|-------|----------|-------|
| `/guides` | Guide index | Grid of all guides |
| `/guides/[slug]` | Guide detail | Sections, author, compliance footer |
| `/injuries` | Injury index | Grid of all injuries |
| `/injuries/[slug]` | Injury detail | Medical info, treatment, legal tie-in |
| `/states` | States index | CA + AZ cards with city links |
| `/states/[state]` | State hub | Statute of limitations, laws, city grid |
| `/states/[state]/[city]` | City page | Local hospitals, courts, unique local data |

**CMS Content Created:**

*Guides (3 files)*: `evidence-checklist`, `insurance-claims`, `hiring-a-lawyer`

*Injuries (7 files)*: `soft-tissue`, `broken-bones`, `traumatic-brain`, `spinal`, `whiplash`, `burns`, `internal`

*States (2 files)*: `california`, `arizona` (attorney review pending)

*Cities (4 files)*: `los-angeles`, `san-diego`, `phoenix`, `tucson` (unique local data per city)

**Build Verification:** All 37 pages build clean with `generateStaticParams` SSG. `npx tsc --noEmit` clean.

---

## Architecture Reminders (Key Decisions)

- **CMS = JSON files, not DB.** `cms.get*()` reads `content/**/*.json` at build time. Supabase is reserved for runtime user data (intake sessions, tool submissions, journal entries).
- **`generateStaticParams`** pre-builds all slugs at build time → static HTML, no server processing at request time.
- **Tailwind v4** — no `tailwind.config.ts`, all tokens in `app/globals.css` via `@theme`.
- **GSAP animations** — use `fromTo` + `immediateRender: false` to prevent invisible-on-scroll bug.
- **Compliance HOC routes:** `/tools/*` → `tool`, `/find-help/*` → `intake`, `/states/*` → `state`, everything else → `default`.
- **Attorney review pending** on all state and content JSON files before publish.

---

## Current Build State

| Item | Status |
|------|--------|
| Next.js 16 App Router | ✓ |
| TypeScript strict | ✓ |
| Tailwind v4 + design tokens | ✓ |
| Inter + Merriweather fonts | ✓ |
| zod / lucide-react / supabase / gsap | ✓ |
| Supabase (intake_sessions, tool_submissions, journal_entries + RLS) | ✓ |
| Core UI components (CTAButton, TrustBadge, DisclaimerBanner, EmergencyBanner, Breadcrumb) | ✓ |
| Header (desktop mega-menu) + MobileNav (focus trap, bottom CTA bar) | ✓ |
| Footer (4-col, compliance disclaimers) | ✓ |
| SEO primitives (SchemaOrg, MetaTags, CanonicalUrl, lib/seo.ts) | ✓ |
| StateSelector (CA/AZ two-step) | ✓ |
| ComplianceWrapper + withCompliance HOC | ✓ |
| AccidentCard + ToolCard + ChecklistBlock + TimelineBlock | ✓ |
| Home page (all 8 sections, GSAP animations) | ✓ |
| HeroVisual — particle canvas + CSS 3D floating shield | ✓ |
| `/accidents` index + `/accidents/[slug]` hub (13 pages) | ✓ |
| `/injuries` index + `/injuries/[slug]` (7 pages) | ✓ |
| `/guides` index + `/guides/[slug]` (3 pages) | ✓ |
| `/states` index + `/states/[state]` (CA + AZ) | ✓ |
| `/states/[state]/[city]` (LA, San Diego, Phoenix, Tucson) | ✓ |
| All 37 pages statically generated | ✓ |

---

## Today's Work — UI/UX Pass (April 21)

### Hero Motion Graphic
- **Brainstormed** 3 directions (aurora gradient mesh, particle network, 3D shield) using visual companion
- **Approved direction:** CSS 3D shield + dense particle network — no Three.js (Lighthouse constraint)
- **`components/home/HeroVisual.tsx`** (new, `'use client'`):
  - Canvas particle network: 110 particles, teal `rgba(75,168,212)`, connections within 100px
  - GSAP float on shield: `y -14px`, `rotateY 7deg`, `rotateX -2deg`, 5s sine.inOut yoyo
  - GSAP halo pulse: scale 0.9→1.2, 4s alternate
  - Two orbit rings: 270px teal (20s CW) + 370px amber (32s CCW), each with glowing dot
  - SVG shield: teal gradient body, glass sheen overlay, amber→green checkmark glow
  - `prefers-reduced-motion`: particles freeze, GSAP skips entirely
  - `aria-hidden="true"` on canvas + SVG — purely decorative
- **`app/page.tsx`** — section gains `relative overflow-hidden`, `<HeroVisual />` mounted, right column replaced with empty spacer
- **`components/home/HomeAnimations.tsx`** — removed dead `hero-card` / `hero-card-item` GSAP selectors
- **Hero button polish:** primary gets `shadow-[0_4px_20px_rgba(40,145,199,0.4)]` glow, secondary `border-white/25 text-white/80`, disclaimer `italic`
- **Shield sizing:** bumped SVG from 148×178 → 200×240 with proportional halo/ring scale-up

**Commits pushed:** `565d694` → `e2ee89e` (6 commits on main)

---

### Trust Row Redesign

- **Brainstormed** via visual companion — approved split-layout (dark left panel 28% + 4 amber-icon columns 72%)
- **Spec:** `docs/superpowers/specs/2026-04-21-trust-row-redesign.md`
- **Plan:** `docs/superpowers/plans/2026-04-21-trust-row-redesign.md`
- **`app/page.tsx`** — Trust Row section fully replaced:
  - `bg-primary-900` throughout, seamless continuation of the hero dark zone
  - `border-t border-white/[0.08]` divider between hero and trust row
  - Left panel: amber eyebrow with leading line, Inter 700 heading (`<h2>`), Merriweather italic subtext, text-link CTA → `/find-help` with `ArrowRight` + hover translate
  - Right panel: 4 columns, amber rounded-square icon tiles (52px, `rounded-[14px]`, `bg-amber-500/12`, `border-amber-500/25`), white title, `text-white/40` subtext
  - Partial-height vertical dividers: absolutely-positioned `<span>` (top 20%, height 60%) instead of full `border-r` — `max-lg:hidden` on item index 1 to prevent bleed in 2-col mobile grid
  - Mobile: left panel stacks above, right grid becomes 2×2 (`grid-cols-2 lg:grid-cols-4`), `border-b` on top row items
- **`components/home/HomeAnimations.tsx`** — swapped `trust-badge` selector for `trust-left` + `trust-item`
- **New lucide-react imports added:** `Shield`, `Lock`, `Clock`, `BadgeCheck`, `ArrowRight`

**Commits pushed:** `f3af971` (trust row redesign) → `9a8f36a` (partial-height dividers)

---

### Header Hover Dropdowns

- **`components/layout/Header.tsx`** — Accident Types and State Guides dropdowns now open on hover (not click-only)
- `openOnHover(menu)` / `scheduleClose()` / `cancelClose()` pattern with 180ms grace period timer
- `onMouseEnter` on each trigger button + each dropdown panel; `onMouseLeave` schedules close
- Click + Escape still work (accessibility preserved)
- Timer cleaned up on unmount

**Commit:** `b2d73dd`

---

### How It Works Redesign

- **Brainstormed** via visual companion — approved: layout B (icon-centered dark columns) + gradient bridge bg + white/frosted icon tiles
- **Spec:** `docs/superpowers/specs/2026-04-21-how-it-works-redesign.md`
- **Plan:** `docs/superpowers/plans/2026-04-21-how-it-works-redesign.md`
- **Executed** via subagent-driven development (2 tasks, 2-stage review each)
- **`app/page.tsx`** — How It Works section fully replaced:
  - Background: `linear-gradient(180deg, #0C2D3E 0%, #0f3d55 50%, #1a5470 100%)` — starts at primary-900 (seamless from trust row), gentle lift downward
  - Amber eyebrow "How It Works" with flanking `<span>` lines
  - New heading: "From Accident to Clarity in 3 Steps"
  - 3 centered columns: amber step badge → frosted white icon tile (`bg-white/[0.08]`, `border-white/[0.18]`, `rounded-[16px]`) → title → Merriweather italic description
  - Partial-height dividers `bg-white/10`, `max-md:hidden`
  - CTA: ghost button matching hero secondary style (`border-white/25 text-white/80 hover:bg-white/10 hover:border-white/40`)
  - `HOW_IT_WORKS` data array removed (inlined)
  - `data-animate="hiw-heading"` on heading block
- **`components/home/HomeAnimations.tsx`** — replaced old `reveal()` calls with explicit `gsap.fromTo` blocks for `hiw-heading` (fade up) and `step-item` (spring up with scale, stagger 0.12)

**Commits pushed:** `109908a` → `d37b8fd` (5 commits on main)

---

### Accident Type Grid Redesign

- **Brainstormed** via visual companion — approved: Option C "Dramatic Reveal" gradient bridge, compact icon+title cards in a lifted white panel
- **Key decisions:**
  - Eyebrow: "What Happened?" (conversational, user-first)
  - Icons: `react-icons` Font Awesome Solid (`FaCar`, `FaTruck`, `FaMotorcycle`, `FaPersonFalling`, `FaHardHat`) — distinct car vs truck silhouettes
  - Cards: compact `<Link>` (icon tile + title + hover arrow `→`) — no description, no `AccidentCard` component
- **Spec:** `docs/superpowers/specs/2026-04-21-accident-grid-redesign.md`
- **Plan:** `docs/superpowers/plans/2026-04-21-accident-grid-redesign.md`
- **Executed** via subagent-driven development (2 tasks, 2-stage review each)
- **`package.json`** — added `react-icons` dependency (v5.6.0, tree-shakeable)
- **`app/page.tsx`** — Accident Type Grid section fully replaced:
  - Background: `linear-gradient(180deg, #1a5470 0%, #1a5470 14%, #1f6b90 28%, #9dc9e2 50%, #d4eaf5 66%, #EAF6FB 80%, #f3f6f9 100%)` — dramatic dark→light sweep, seamlessly bridges from HIW bottom (#1a5470) to Featured Tools (`bg-surface-info #EAF6FB`)
  - Heading block: amber eyebrow, white h2, Merriweather italic subtext
  - Lifted white card panel: `bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.13)] border border-white/60 p-6`
  - Grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` — 5th card gets `last:col-span-2 sm:last:col-span-1` to center orphan on mobile
  - `FEATURED_ACCIDENTS` array trimmed to `{ slug, title }` only; `ACCIDENT_ICONS` record added for slug→icon lookup
  - Removed 5 unused Lucide imports (`Car, Truck, Bike, AlertTriangle, Briefcase`) and `AccidentCard` import
  - `data-animate="accident-card"` preserved — existing GSAP stagger still works
  - "View all" link: `text-primary-700` (contrast on light bg), `min-h-[44px] sm:min-h-0` (WCAG touch target)

**Commits pushed:** `8cf6d38` → `f3793de` (5 commits on main)

---

### Featured Tools Redesign

- **Brainstormed** via visual companion — 6 options shown (A–F), approved Option E (Full-Width Rows) with plain text CTA links
- **Spec:** `docs/superpowers/specs/2026-04-21-featured-tools-redesign.md`
- **Plan:** `docs/superpowers/plans/2026-04-21-featured-tools-redesign.md`
- **Executed** via subagent-driven development (1 task, 2-stage review)
- **`app/page.tsx`** — Featured Tools section fully replaced:
  - `FEATURED_TOOLS` array trimmed to `{ slug, title, description }` — `icon` field removed
  - `FeaturedTool` interface added for type safety
  - `TOOL_ICONS: Record<string, React.ReactNode>` lookup added (mirrors `ACCIDENT_ICONS` pattern)
  - `ToolCard` import removed (component untouched, still used on `/tools` index)
  - Section markup: `flex flex-col gap-3` horizontal rows on `bg-surface-info`
  - Amber eyebrow "Free Tools" with flanking lines; `<h2>` "Interactive Accident Tools"
  - Each row: `<Link>` with `aria-label`, teal icon tile (`bg-primary-50 border-primary-100 rounded-xl w-[46px] h-[46px]`), bold title, serif italic description, plain "Try It Free →" text CTA (`text-primary-600`)
  - Hover: `border-primary-200 shadow-[0_4px_16px_rgba(40,145,199,0.09)]`
  - `data-animate="tool-card"` preserved — GSAP stagger unchanged

**Commits pushed:** `6f78698` → `f9d51d9` (2 commits on main)

## Architecture Reminders (Key Decisions)

- **HeroVisual is purely decorative** — all content (h1, CTAs, copy) remains in `app/page.tsx`, fully accessible without JS
- **No Three.js** — CSS 3D + SVG + GSAP only. Keeps Lighthouse 90+ target intact.
- **Trust Row partial-height dividers** — use absolutely-positioned `<span>` (not `border-r`) so dividers don't span the full grid cell height.
- **Accident Grid orphan fix** — `last:col-span-2 sm:last:col-span-1` on card `<Link>` centers the 5th card on 2-col mobile grid without affecting sm/lg layouts.
- **react-icons vs lucide-react** — lucide-react for UI icons (header, tools, etc.), react-icons FA Solid for accident-type icons where silhouette distinction matters (car vs truck).
- **Featured Tools rows** — each row is a `<Link>` (not a ToolCard wrapper). `aria-label` added for screen reader clarity. Design tokens (`bg-primary-50`, `border-primary-100`) used instead of hardcoded hex.

---

## What's Next — Phase 3: Intake + State Rules Engine

Per `docs/strategy/MASTER-PLAN.md` Phase 3 (Day 11-13, ~20h):

| Task | Hours |
|------|-------|
| IntakeWizard (9-step multi-step form) | 8 |
| State routing rules engine (CA/AZ routing logic) | 4 |
| Lead scoring / urgency detection | 4 |
| Find Help flow (3 pages: wizard, results, thank-you) | 4 |

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

## Content Gaps to Fill (Lower Priority)

- More city pages: San Jose, San Francisco, Fresno, Sacramento, Long Beach, Oakland, Bakersfield, Anaheim (CA) + Mesa, Chandler, Scottsdale, Gilbert (AZ) — 12 more cities
- More guide files — currently only 3, PRD calls for ~10
- All content pending attorney review before go-live

---

## Active Branch

`main` — all work pushed to origin/main. No open PRs.