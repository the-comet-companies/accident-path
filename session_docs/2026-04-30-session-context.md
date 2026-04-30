# Session Context — April 30, 2026

## Where We Left Off (read this first in a new session)

**Status: DEV-34 complete. Spanish guide pages live at `/es/guias/[slug]`.**
**Build: 122 static pages. TypeScript clean. Both `main` and `staging` in sync.**

---

## This Session (April 30)

### DEV-34 — Spanish Guide Pages ✓ Complete

**Commits:** `159ea63`, `8c41373`, `6d575ca`

**Files changed:**

- `i18n/config.ts` — Added 11 guide slug mappings to `SLUG_MAP_ES`:
  `after-motorcycle-crash` → `despues-accidente-motocicleta`, `am-i-at-fault` → `soy-culpable`,
  `common-mistakes` → `errores-comunes`, `dealing-with-insurance-adjusters` → `ajustadores-seguros`,
  `getting-your-police-report` → `reporte-policial`, `hiring-a-lawyer` → `contratar-abogado`,
  `insurance-claims` → `reclamos-seguro`, `protecting-your-claim` → `proteger-reclamo`,
  `settlement-vs-lawsuit` → `acuerdo-vs-demanda`, `should-i-talk-to-a-lawyer` → `hablar-con-abogado`,
  `understanding-medical-bills` → `facturas-medicas`
  *(3 guide mappings already existed: `after-car-accident`, `after-truck-accident`, `evidence-checklist`)*

- `lib/cms.ts` — `getGuide(slug, locale='en')` and `getAllGuides(locale='en')` extended with locale param; reads from `content/guides/es/` when `locale === 'es'`. Backward-compatible.

- `app/(es)/es/guias/[slug]/page.tsx` — Spanish guide detail page. `generateStaticParams` maps `GUIDE_EN_SLUGS` through `SLUG_MAP_ES`. Related accidents use `ACCIDENT_LABEL_ES` lookup from `NAV_ACCIDENT_TYPES.es`. Related guides/tools rendered with Spanish slugs directly. hreflang EN↔ES. `notranslate`. CTA → `/es/buscar-ayuda`.

- `app/(es)/es/guias/page.tsx` — Spanish guide index. 3-column grid. `cms.getAllGuides('es')`.

- `content/guides/es/*.json` — 14 files. All pass Zod validation. metaTitles 48–60 chars. metaDescriptions 129–158 chars. `translationStatus: "needs-review"` on all. Mexican Spanish.

**Zod validation run:** All 14 files passed inline schema check before commit. No length failures (unlike DEV-33 where 6 of 13 accident files had to be trimmed post-generation).

### Guides UI unification

English `/guides` page had a different UI from Spanish `/es/guias` — it used `GuidesHubClient`, a `'use client'` component with a category filter rail (sidebar nav + card panel in a split layout). Spanish used a simple 3-column card grid.

- **`components/content/GuidesHubClient.tsx`** — deleted (was only used by `/guides`)
- **`app/(en)/guides/page.tsx`** — rewritten as pure server component with the same 3-column card grid as `/es/guias`. Retains "N sections · ~N min read" footer metadata. Removed "Cornerstone Guide" badge (was hardcoded on `am-i-at-fault` and `settlement-vs-lawsuit` — the Spanish version never had it).

Both branches pushed: `main` and `staging` are in sync at `6d575ca`.

---

## Where to Start Next Session

**Next task: DEV-34B — Spanish Injury Pages (`/es/lesiones/[slug]`)**

Read before starting:
1. `docs/plans/PHASE-7-IMPLEMENTATIONS.md` — authoritative record of what was built
2. `docs/plans/PHASE-7-SPANISH-PLAN.md` §DEV-34B

**DEV-34B quick spec:**
- `lib/cms.ts` — add `locale` param to `getInjury` and `getAllInjuries` (same pattern as accidents/guides)
- `app/(es)/es/lesiones/[slug]/page.tsx` — mirrors `app/(en)/injuries/[slug]/page.tsx`; `generateStaticParams` from `SLUG_MAP_ES` injury entries; hreflang; `notranslate`; CTA → `/es/buscar-ayuda`
- `app/(es)/es/lesiones/page.tsx` — Spanish injury index (same grid pattern)
- `content/injuries/es/` — 7 JSON files: `latigazo.json`, `huesos-rotos.json`, `traumatismo-craneal.json`, `columna.json`, `tejido-blando.json`, `quemaduras.json`, `lesiones-internas.json`
- Injury slug mappings are already in `SLUG_MAP_ES`: `whiplash → latigazo`, `broken-bones → huesos-rotos`, `traumatic-brain → traumatismo-craneal`, `spinal → columna`, `soft-tissue → tejido-blando`, `burns → quemaduras`, `internal → lesiones-internas`

**After DEV-34B, order is:** DEV-35 (Spanish tool pages, requires `ToolEngine.tsx` strings prop) → DEV-37 (states/cities, 18 content files) → DEV-36 (sitemap hreflang)

---

## Task List

| Task | Phase | Status |
|------|-------|--------|
| DEV-29 | 7A | ✓ Complete — i18n config, dict files, proxy (locale redirect) |
| DEV-30 | 7A | ✓ Complete — LanguageToggle + locale-aware Header, MobileNav, Footer |
| DEV-31 | 7A | ✓ Complete — route group restructure + Spanish home page + hreflang |
| DEV-32 | 7B | ✓ Complete — Spanish intake wizard + results + thank-you |
| DEV-33 | 7C | ✓ Complete — Spanish accident pages (13 types) + `/es/accidentes` index |
| DEV-34 | 7C | ✓ Complete — Spanish guide pages (14 guides) + `/es/guias` index |
| DEV-34B | 7C | Not started — Spanish injury pages (7 types) |
| DEV-35 | 7C | Not started — Spanish tool pages |
| DEV-37 | 7C | Not started — Spanish state + city pages (2 states, 16 cities) |
| DEV-36 | 7D | Not started — hreflang + sitemap |

**Tier 1 (launch minimum):** DEV-29–32 — ✓ ALL COMPLETE
**Tier 2 (full bilingual):** all 10 tasks — 6/10 complete

---

## Patterns Established (don't re-derive)

### Adding a new Spanish content page type

1. Extend `lib/cms.ts` with `locale` param on the relevant getter — reads from `content/{type}/es/` when `locale === 'es'`
2. `generateStaticParams` — map EN slugs from `SLUG_MAP_ES`
3. `generateMetadata` — hreflang `languages: { en, es, 'x-default' }` + `other: { google: 'notranslate' }`
4. Related sidebar links — render Spanish slugs directly; use lookup table from `NAV_*` config for display labels
5. CTA always → `/es/buscar-ayuda`
6. Breadcrumb `variant="dark"` on `bg-primary-900` heroes
7. JSON files — Spanish slugs in all related arrays; `translationStatus: "needs-review"`
8. Run Zod validation before committing (metaTitle ≤70, metaDescription 120–160)

### `buildMetaTags()` + hreflang conflict
`buildMetaTags()` sets `alternates: { canonical }` which replaces layout-level `alternates` entirely. For Spanish pages, set metadata directly (not via `buildMetaTags()`) and include full `alternates.languages`.

### Client components + translations
Client components (`IntakeWizard`, `ToolEngine`, `ToolResults`) cannot call `getDictionary()`. Parent server page loads dict and passes `strings` prop subset.

---

## Build State

| Item | Status |
|------|--------|
| Next.js 14 App Router | ✓ |
| TypeScript strict | ✓ (zero errors) |
| Static pages | ✓ 122 |
| Spanish i18n | 🔄 DEV-29–34 done; DEV-34B/35/37/36 remaining |
| Attorney content review | ✗ Pending |
| GA4 / Clarity | ✗ Pending Michael |
| Domain/DNS | ✗ Pending Michael |
