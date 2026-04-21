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

## Architecture Reminders (Key Decisions)

- **HeroVisual is purely decorative** — all content (h1, CTAs, copy) remains in `app/page.tsx`, fully accessible without JS
- **No Three.js** — CSS 3D + SVG + GSAP only. Keeps Lighthouse 90+ target intact.

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