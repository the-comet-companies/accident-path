# Session Context — April 29, 2026

## Where We Left Off (read this first in a new session)

**Status: All 28 DEV tasks complete. Site handed off to Michael for review.**
**Current task: Spanish language implementation (i18n) — planning complete, ready for implementation**

### What Happened Since April 24
- Pre-handoff code review completed — fixed lint errors, compliance issues, CA insurance data
- `lib/related.ts` wired into accident, guide, and injury page sidebars
- `/cookie-policy` page created (was linked in footer but missing)
- Footer "Attorney-Reviewed Content" badge changed to "Content Review in Progress"
- State/city pages now hide reviewer byline when `reviewedBy === "Pending Legal Review"`
- CA insurance minimums corrected to post-SB 1107 values ($30k/$60k/$15k) everywhere
- Site pushed to Vercel: https://accident-path.vercel.app
- Michael confirmed **Spanish language version is the top priority** before launch

### This Session (April 29)
- Created full Phase 7 Spanish implementation plan
- Reviewed plan with superpowers writing-plans skill — found and fixed 8 architectural gaps
- Ran final pre-implementation spec check against actual source files — found and fixed 4 more gaps
- All planning docs finalized and ready

### Last commit: `1fa9109`

---

## Current Task: Spanish Language Implementation

**Planning is complete. Next step is implementation starting with DEV-29.**

Read these two files to start implementation:
1. `docs/plans/PHASE-7-SPANISH-PLAN.md` — full technical plan, architecture decisions, all task specs
2. `docs/plans/PHASE-7-NOTION-PROMPTS.md` — clean execution prompts per task (for Notion and subagents)

For the Notion overview doc (what's being built, maintenance, implications):
- `docs/plans/PHASE-7-NOTION-OVERVIEW.md`

---

## Architecture (Locked)

- English stays at existing root routes — zero breaking changes
- Spanish pages live in parallel `app/es/` tree
- Layouts pass `locale` prop to Header and Footer (both have all nav + footer text hardcoded — must be locale-aware)
- Client components (`IntakeWizard`, `ToolEngine`, `ToolResults`) receive translated strings as props from parent server pages — they cannot call `getDictionary()` directly
- **Intake form values are always English IDs** (`"car"`, not `"auto"`) — only display labels are localized
- CMS loader: extend `lib/cms.ts` with `locale` param — do NOT create `lib/cms-es.ts`
- Middleware only redirects `/` — all other paths pass through

---

## Task List (DEV-29 through DEV-37 + DEV-36)

| Task | Phase | Status |
|------|-------|--------|
| DEV-29 | 7A | Not started — i18n config, dict files, middleware |
| DEV-30 | 7A | Not started — language toggle + Header/Footer locale refactor |
| DEV-31 | 7A | Not started — Spanish home page + layout |
| DEV-32 | 7B | Not started — Spanish intake wizard |
| DEV-33 | 7C | Not started — Spanish accident pages (13 types) |
| DEV-34 | 7C | Not started — Spanish guide pages (14 guides) |
| DEV-34B | 7C | Not started — Spanish injury pages (7 types) |
| DEV-35 | 7C | Not started — Spanish tool pages |
| DEV-37 | 7C | Not started — Spanish state + city pages (2 states, 16 cities) |
| DEV-36 | 7D | Not started — hreflang + sitemap |

**Tier 1 (launch minimum):** DEV-29 + DEV-30 + DEV-31 + DEV-32
**Tier 2 (full bilingual):** all 10 tasks

---

## Key Gaps Fixed During Planning (don't re-open these)

1. Header and Footer have ALL nav labels and hrefs hardcoded English — DEV-30 adds `locale` prop and locale-aware nav arrays to `i18n/config.ts`
2. Client components can't call `getDictionary()` — parent server pages pass `strings` as props
3. LanguageToggle needs both `SLUG_MAP_ES` (EN→ES) and `SLUG_MAP_EN` (ES→EN)
4. Spanish injury pages were missing — added as DEV-34B
5. `[NOMBRE DE MARCA]` placeholder in Spanish disclaimer — replaced with `AccidentPath` everywhere
6. `notranslate` meta tag needed on all Spanish pages to prevent Chrome auto-translate
7. DEV-36 conflicting sitemap guidance — resolved to extend `app/sitemap.ts` only
8. TypeScript key parity between `en.json` and `es.json` enforced via `Dictionary` type
9. Intake step sub-components (`components/intake/steps/`) have hardcoded English — must be updated in DEV-32
10. `URGENCY_CONFIG` in results page is hardcoded English — added `findHelp.urgency` keys to `es.json`
11. `find-help/page.tsx` hero text hardcoded — added `findHelp` keys to `es.json`
12. `lib/cms-es.ts` approach replaced with `locale` param on existing `lib/cms.ts`

---

## Build State (as of April 29)

| Item | Status |
|------|--------|
| Next.js 14 App Router | ✓ |
| TypeScript strict | ✓ (zero errors) |
| Tailwind v4 + design tokens | ✓ |
| All 28 DEV tasks | ✓ Complete |
| Lighthouse Desktop | ✓ 99 |
| Lighthouse Mobile | ✓ 82–96 |
| Unit tests | ✓ 26/26 |
| E2E tests | ✓ 24/24 |
| Spanish i18n | ✗ Not started (plan complete) |
| Attorney review of content | ✗ Pending (non-code) |
| GA4 setup | ✗ Pending Michael |
| Domain/DNS | ✗ Pending Michael |
| Privacy/Terms copy | ✗ Pending attorney |

---

## Architecture Reminders

- **Tailwind v4** — no `tailwind.config.ts`. All tokens in `app/globals.css` via `@theme`.
- **CMS = JSON files** at `content/**/*.json`, validated with Zod. Supabase = runtime user data only.
- **`generateStaticParams`** pre-builds all slugs → static HTML.
- **GSAP animations** — lazy-loaded via `next/dynamic ssr:false` in `components/home/LazyAnimations.tsx`.
- **EmergencyBanner** — server component. Inline `<script>` hides banner if sessionStorage shows dismissed.
- **Breadcrumb `variant="dark"`** required on all detail pages with `bg-primary-900` hero.
- **Font display** — both Inter and Merriweather use `display: "optional"`.
- **Compliance HOC routes:** `/tools/*` → `tool`, `/find-help/*` → `intake`, `/states/*` → `state`.
- **`lib/related.ts`** — wired into accident, guide, injury pages. `getToolRelated`, `getCityRelated`, `getStateRelated` still not wired (lower priority).
