# Session Context — April 30, 2026

## Where We Left Off (read this first in a new session)

**Status: DEV-37 complete + LanguageToggle multi-segment bug fixed.**
**Build: ~155 static pages. TypeScript clean. `main` at `1eab17d`.**

---

## This Session (April 30)

### DEV-34 — Spanish Guide Pages ✓ Complete

**Commits:** `159ea63`, `8c41373`, `6d575ca`

*(Full notes in earlier session history.)*

---

### DEV-34B — Spanish Injury Pages ✓ Complete

**Commit:** `84f7954`

*(Full notes in earlier session history.)*

---

### DEV-35 — Spanish Tool Pages ✓ Complete

**Commits:** `ba525ef` → `886a833`

*(Full notes in `docs/plans/PHASE-7-IMPLEMENTATIONS.md` DEV-35 section.)*

---

### DEV-37 — Spanish State + City Pages ✓ Complete

**Commits:** `60e1cfd`

**Files changed:**

- `lib/cms.ts` — Added `locale?: 'en' | 'es'` param to `getState`, `getAllStates`, `getCity`, `getAllCities`, `getCitiesByState`. Backward-compatible (defaults to `'en'`). Reads from `content/states/es/` or `content/cities/es/` when `locale === 'es'`.

- `content/states/es/california.json` + `arizona.json` — Full Spanish translations. Same slug, same enum values (`abbreviation: 'CA'/'AZ'`, `faultRule.type: 'pure_comparative'`). Legal citations kept in English. All Zod-validated.

- `content/cities/es/*.json` — 16 files (10 CA + 6 AZ). Hospital names/addresses/phones unchanged (proper nouns). Court names/addresses unchanged. `description`, `commonAccidentTypes`, `notableCorridors`, `localNotes` translated. 8 files needed `metaDescription` trimming after initial Zod validation run. All pass CityDataSchema.

- `app/(es)/es/estados/page.tsx` — Spanish states index. Uses `cms.getAllStates('es')` and `cms.getCitiesByState(slug, 'es')`. hreflang to `/states`. `DisclaimerBanner locale="es" variant="state"`.

- `app/(es)/es/estados/[estado]/page.tsx` — Spanish state detail. `generateStaticParams` from `cms.getAllStates('es')`. Param name `estado` (semantic). Fault rule labels in Spanish via `FAULT_RULE_LABELS` map. All section headings, stat labels, CTA in Spanish. hreflang EN↔ES. CTA → `/es/buscar-ayuda`.

- `app/(es)/es/estados/[estado]/[ciudad]/page.tsx` — Spanish city detail. `generateStaticParams` from `cms.getAllCities('es')`. Param names `estado`/`ciudad`. Hospital ER badge shows "UR" (Urgencias). Court type labels rendered as-is from JSON. hreflang EN↔ES. CTA → `/es/buscar-ayuda?city={slug}`.

**Slug invariant:** State and city slugs are identical in EN and ES (`california`, `arizona`, `los-angeles`, etc.). No entries needed in `SLUG_MAP_ES/EN`. `generateStaticParams` calls `cms.getAllStates('es')` directly — no slug mapping required.

---

### LanguageToggle multi-segment path bug ✓ Fixed

**Commit:** `1eab17d`

**File:** `components/layout/LanguageToggle.tsx`

**Bug:** On pages with 2+ path segments after the prefix (e.g., `/states/arizona/gilbert`), `getEquivalentUrl` extracted only the first segment (`arizona`), looked it up in `SLUG_MAP_ES` (not found), and fell back to the section index (`/es/estados`) instead of the correct page (`/es/estados/arizona/gilbert`).

**Fix:** Changed from `split('/')[0]` single-segment extraction to mapping ALL segments through the slug lookup, keeping untranslatable ones as-is:
```ts
// Before
const slug = pathname.slice(enPrefix.length + 1).split('/')[0]
const esSlug = SLUG_MAP_ES[slug]
return esSlug ? `${esPrefix}/${esSlug}` : esPrefix  // ← dropped back to index on miss

// After
const segments = pathname.slice(enPrefix.length + 1).split('/')
const translated = segments.map(seg => SLUG_MAP_ES[seg] ?? seg)  // ← keep-as-is on miss
return `${esPrefix}/${translated.join('/')}`
```

**Effect:** All page types now translate correctly:
- `/states/arizona/gilbert` → `/es/estados/arizona/gilbert` ✓ (fixed)
- `/states/arizona` → `/es/estados/arizona` ✓ (fixed)
- `/accidents/car-accident` → `/es/accidentes/accidente-auto` ✓ (unchanged)
- `/es/estados/arizona/gilbert` → `/states/arizona/gilbert` ✓ (fixed)

---

## Where to Start Next Session

**Next task: DEV-36 — Sitemap + hreflang**

- Extend `app/sitemap.ts` to include all ES routes (`/es/accidentes/*`, `/es/guias/*`, `/es/lesiones/*`, `/es/herramientas/*`, `/es/estados/*`, `/es/estados/*/[ciudad]`)
- Add `lib/hreflang.ts` helper (or inline) to generate consistent alternates
- Verify all EN routes already in sitemap

**After DEV-36:** Tier 2 fully complete. Launch checklist: GA4/Clarity, Domain/DNS.

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
| DEV-34B | 7C | ✓ Complete — Spanish injury pages (7 types) + `/es/lesiones` index |
| DEV-35 | 7C | ✓ Complete — Spanish tool pages (5 live) + `/es/herramientas` index |
| DEV-37 | 7C | ✓ Complete — Spanish state + city pages (2 states, 16 cities) |
| DEV-36 | 7D | Not started — hreflang + sitemap |

**Tier 1 (launch minimum):** DEV-29–32 — ✓ ALL COMPLETE
**Tier 2 (full bilingual):** all 10 tasks — **9/10 complete**

---

## Patterns Established (don't re-derive)

### Adding a new Spanish content page type

1. Extend `lib/cms.ts` with `locale` param on the relevant getter — reads from `content/{type}/es/` when `locale === 'es'`
2. `generateStaticParams` — map EN slugs from `SLUG_MAP_ES` (or call `cms.getAll*(locale='es')` directly when slugs are the same in both languages)
3. `generateMetadata` — hreflang `languages: { en, es, 'x-default' }` + `other: { google: 'notranslate' }`
4. Related sidebar links — render Spanish slugs directly; use lookup table from `NAV_*` config for display labels
5. CTA always → `/es/buscar-ayuda`
6. Breadcrumb `variant="dark"` on `bg-primary-900` heroes
7. JSON files — Spanish slugs in all related arrays (except states/cities which share EN slugs)
8. Run Zod validation before committing (metaTitle ≤70, metaDescription 120–160)

### State + city slug invariant

State and city slugs are identical in EN and ES (`california`, `arizona`, `los-angeles`, etc.). Do NOT add them to `SLUG_MAP_ES/EN`. `generateStaticParams` calls `cms.getAllStates('es')` / `cms.getAllCities('es')` directly. `LanguageToggle` passes unknown segments through as-is (after the multi-segment fix).

### LanguageToggle path translation

`getEquivalentUrl` maps ALL path segments after the prefix through `SLUG_MAP_ES/EN`, keeping untranslatable segments unchanged. This means state/city pages translate correctly without entries in the slug map. Do NOT revert to the single-segment pattern.

### Client components + translations

Client components (`IntakeWizard`, `ToolEngine`, `ToolResults`) cannot call `getDictionary()`. Parent server page loads dict and passes `strings` prop subset. Use `strings?.key ?? 'English fallback'` pattern.

### Output generators + locale

`lib/tools/output-generators-es.ts` mirrors `output-generators.ts` with Spanish strings. `ToolEngine` picks ES generators when `pathname.startsWith('/es/')`. Generator slug lookup: `SLUG_MAP_EN[tool.slug]` resolves Spanish URL slug → English key.

### `InjuryJournal` locale

Detects locale via `usePathname` internally. No props needed from parent. Uses `UI_ES`/`UI_EN` string tables defined in the component file.

### `DisclaimerBanner` locale

Server component. Pass `locale="es"` from every ES page. All 4 variant texts have Spanish equivalents. English pages use default `locale='en'`.

### Zod validation pitfall

`catch { notFound() }` in ES detail pages fires on ANY Zod parse failure — including `metaDescription` over 160 chars. Always validate all metric constraints before committing JSON. Use the `validate-es.ts` script pattern (write a temp file, run `npx tsx validate-es.ts`, delete it).

---

## Build State

| Item | Status |
|------|--------|
| Next.js 14 App Router | ✓ |
| TypeScript strict | ✓ (zero errors) |
| Static pages | ✓ ~155 |
| Spanish i18n | 🔄 DEV-29–37 done; DEV-36 (sitemap) remaining |
| Attorney content review | ✗ Pending |
| GA4 / Clarity | ✗ Pending Michael |
| Domain/DNS | ✗ Pending Michael |
