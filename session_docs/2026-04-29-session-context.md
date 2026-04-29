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
- **DEV-29 complete** — i18n infrastructure implemented on `staging` branch
- **DEV-30 complete** — LanguageToggle + locale-aware Header, MobileNav, Footer

### DEV-29 files created
- `i18n/config.ts` — `LOCALES`, `DEFAULT_LOCALE`, `SLUG_MAP_ES` (24 entries), `SLUG_MAP_EN` (auto-reversed), + 5 locale-aware nav arrays + `NAV_LABELS`
- `i18n/en.json` + `i18n/es.json` — ~150 keys across `cta`, `trust`, `emergency`, `phone`, `footer`, `tools`, `findHelp`, `intake` namespaces
- `i18n/dictionaries.ts` — `getDictionary(locale)` async loader; `satisfies Dictionary` enforces key parity at build time
- `proxy.ts` — locale detection on `/` only (cookie first, then `Accept-Language`); redirects Spanish users to `/es/`
  - **Note:** Next.js 16 renamed `middleware.ts` → `proxy.ts` and `export function middleware` → `export function proxy`

### DEV-30 files created/modified
- `components/layout/LanguageToggle.tsx` — new `'use client'` pill toggle; path translation using `SLUG_MAP_ES`/`SLUG_MAP_EN` + prefix map; sets `NEXT_LOCALE` cookie; `variant="light"` (header/mobile) or `variant="dark"` (footer); `cursor-pointer` on buttons
- `components/layout/Header.tsx` — `locale` prop (default `'en'`); nav arrays from `i18n/config`; `LanguageToggle` between last link and CTA
- `components/layout/MobileNav.tsx` — `locale` prop; Find Help separated from simpleLinks for amber styling; `LanguageToggle` in drawer; CTA links locale-aware
- `components/layout/Footer.tsx` — `locale` + `dict` props; disclaimer paragraphs from `dict.footer.disclaimer1/2/3`; section headings/emergency/copyright from dict; `LanguageToggle variant="dark"` in bottom bar
- `app/layout.tsx` — now `async`; loads EN dict; passes `locale="en"` + `dict` to Footer
- `app/es/layout.tsx` — new stub; loads ES dict; passes `locale="es"` to Header/MobileNav/Footer

### DEV-31 files created/modified
- Route group restructure: all English routes moved from `app/` → `app/(en)/`; `app/layout.tsx` replaced by `app/(en)/layout.tsx`; `app/es/layout.tsx` moved to `app/(es)/es/layout.tsx`
- `app/(en)/layout.tsx` — English root layout (`<html lang="en">`); same as old `app/layout.tsx` + hreflang alternates; `import "../globals.css"`
- `app/(es)/es/layout.tsx` — full Spanish root layout (`<html lang="es">`); fonts + EmergencyBanner + SchemaOrg + Spanish Header/MobileNav/Footer; `other: { google: 'notranslate' }`; hreflang en/es/x-default; `import "../../globals.css"`
- `app/(es)/es/page.tsx` — Spanish home page; mirrors English page structure with all strings translated; Spanish accident/tool/guide data with `/es/*` hrefs
- `app/(en)/page.tsx` — hreflang `alternates.languages` added (en/es/x-default)

### DEV-32 files created/modified
- `i18n/en.json` + `i18n/es.json` — added full `intake` option arrays (accidentTypeLabels, injuryLabels, medicalLabels/Descriptions, insuranceLabels/Descriptions, workImpactLabels/Descriptions) + all step text keys (step descriptions, field labels, button labels)
- `lib/intake.ts` — added `strings?: Dictionary['intake']` to `StepProps`
- `components/intake/IntakeWizard.tsx` — `strings?: Dictionary['intake']` prop; `usePathname` locale-aware redirect to `/es/buscar-ayuda/thank-you`; strips empty optional contact fields before POST to fix Zod `z.string().email()` rejecting `""`
- `components/intake/steps/StepAccidentType.tsx` — English values (`ACCIDENT_TYPE_VALUES`) stored, Spanish labels displayed via `strings.accidentTypeLabels`
- `components/intake/steps/StepInjuries.tsx` — English values (`INJURY_VALUES`) stored, Spanish labels displayed
- `components/intake/steps/StepWhen/Where/Medical/PoliceReport/Insurance/WorkImpact/Contact.tsx` — all updated with `strings` prop + English fallbacks
- `components/intake/ConsentCheckbox.tsx` — `tcpaText?: string` prop; defaults to full English TCPA; Spanish pages pass short `strings.tcpaConsent`
- `app/(es)/es/buscar-ayuda/page.tsx` — server component; loads ES dict; passes `dict.intake` to `<IntakeWizard>`
- `app/(es)/es/buscar-ayuda/results/page.tsx` — client component; Spanish URGENCY_CONFIG from `es.json`; reads localStorage same as English version
- `app/(es)/es/buscar-ayuda/thank-you/page.tsx` — static Spanish thank-you page
- **Bug fix (2779f98):** `z.string().email().optional()` rejects `""` — stripping empty contact strings to `undefined` before POST

### Hydration mismatch fixes (post-DEV-32)

Three files fixed for React hydration mismatch caused by `localStorage` reads inside `useState` initializers (server renders `{}` / `null`, client reads saved state → className / JSX branch mismatch):

- `components/intake/IntakeWizard.tsx` — `useState({})` init, load from localStorage in `useEffect`, `loaded` flag guards save effect from wiping localStorage before read completes
- `app/(en)/find-help/results/page.tsx` — `useState(null)` init, load in `useEffect`, `if (!loaded) return null` prevents server/client tree mismatch on direct URL load or refresh
- `app/(es)/es/buscar-ayuda/results/page.tsx` — same pattern as English results

Root cause: `if (typeof window === 'undefined')` check in state initializer only guards server; client still reads localStorage during hydration, diverging from server HTML.

### DEV-33 files (commits 4ab2c15, e55b431, 6f3e654)

- `lib/cms.ts` — `getAccident(slug, locale='en')` and `getAllAccidents(locale='en')` extended; backward-compatible
- `app/(es)/es/accidentes/[slug]/page.tsx` — Spanish accident detail page; translated headings, urgency labels, state notes (CA/AZ), hreflang, `notranslate`, CTA → `/es/buscar-ayuda`; `generateStaticParams` from `SLUG_MAP_ES`
- `app/(es)/es/accidentes/page.tsx` — Spanish accidents index; 3-column grid of all 13 types; `cms.getAllAccidents('es')`
- `content/accidents/es/*.json` — 13 files (auto, camion, motocicleta, caida, trabajo, bicicleta, peaton, mordida-perro, construccion, propiedad, producto, muerte-injusta, uber-lyft); Mexican Spanish; all Zod-validated; `translationStatus: "needs-review"`
- **Bug fixed post-generation:** 6 files had `metaTitle`/`metaDescription` over Zod length limits, causing Zod parse failure → `notFound()` → 404. Fixed by trimming to ≤70/≤160 chars.
- **Important pattern:** Spanish JSON files use Spanish slugs in `likelyInjuries[].slug`, `relatedAccidents`, `relatedInjuries`, `relatedGuides`, `relatedTools` — the page renders hrefs directly without additional translation.

### Hydration mismatch fixes (commits c17f992)

- `components/intake/IntakeWizard.tsx` — `useState({})` init, load from localStorage in `useEffect`, `loaded` flag guards save effect
- `app/(en)/find-help/results/page.tsx` — `useState(null)` init, load in `useEffect`, `if (!loaded) return null`
- `app/(es)/es/buscar-ayuda/results/page.tsx` — same pattern

Root cause: `if (typeof window === 'undefined')` check in state initializer only guards server; client reads localStorage during hydration, diverging from server HTML.

### Last commit: `edff211`

---

## Where to Start Next Session

**Next task: DEV-34 — Spanish Guide Pages (`/es/guias/[slug]`)**

Read these files before starting:
1. `docs/plans/PHASE-7-IMPLEMENTATIONS.md` — actual architecture built so far (authoritative)
2. `docs/plans/PHASE-7-SPANISH-PLAN.md` §DEV-34 — full spec for guide pages

**DEV-34 quick spec:**
- Extend `lib/cms.ts`: add `locale` param to `getGuide` and `getAllGuides` (same pattern as `getAccident`)
- Create `app/(es)/es/guias/[slug]/page.tsx` — mirrors `app/(en)/guides/[slug]/page.tsx`
- Create `app/(es)/es/guias/page.tsx` — Spanish guides index (mirrors `app/(en)/guides/page.tsx`)
- Create `content/guides/es/` — 14 JSON files (same schema as English guides)
- Spanish guide slugs (from `SLUG_MAP_ES`): `despues-accidente-auto`, `despues-accidente-camion`, `lista-evidencia`, `evaluacion-caso` + 10 more from the plan
- Use 3-agent parallel pattern (same as DEV-33) to write the JSON content files

**Key lesson from DEV-33:** After agents write JSON files, always run the Zod validation script before committing:
```bash
node -e "
const { z } = require('zod');
const fs = require('fs');
// paste GuideSchema inline, loop over content/guides/es/
"
```
Or check `metaTitle` ≤70 chars and `metaDescription` 120–160 chars manually — those were the only failures in DEV-33.

**After DEV-34, order is:** DEV-34B (injuries, 7 files) → DEV-35 (tools, ToolEngine strings) → DEV-37 (states/cities) → DEV-36 (sitemap)

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
| DEV-29 | 7A | ✓ Complete — i18n config, dict files, proxy (locale redirect) |
| DEV-30 | 7A | ✓ Complete — LanguageToggle + locale-aware Header, MobileNav, Footer |
| DEV-31 | 7A | ✓ Complete — route group restructure + Spanish home page + hreflang |
| DEV-32 | 7B | ✓ Complete — Spanish intake wizard + results + thank-you |
| DEV-33 | 7C | ✓ Complete — Spanish accident pages (13 types) + `/es/accidentes` index |
| DEV-34 | 7C | Not started — Spanish guide pages (14 guides) |
| DEV-34B | 7C | Not started — Spanish injury pages (7 types) |
| DEV-35 | 7C | Not started — Spanish tool pages |
| DEV-37 | 7C | Not started — Spanish state + city pages (2 states, 16 cities) |
| DEV-36 | 7D | Not started — hreflang + sitemap |

**Tier 1 (launch minimum):** DEV-29 + DEV-30 + DEV-31 + DEV-32 — ✓ ALL COMPLETE
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
| Spanish i18n | 🔄 DEV-29–33 done; DEV-34/34B/35/37/36 next |
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
