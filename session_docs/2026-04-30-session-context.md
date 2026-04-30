# Session Context — April 30, 2026

## Where We Left Off (read this first in a new session)

**Status: DEV-35 complete. Spanish tool pages live at `/es/herramientas/` and `/es/herramientas/[slug]`.**
**Build: ~135 static pages. TypeScript clean. `main` at `886a833`.**

---

## This Session (April 30)

### DEV-34 — Spanish Guide Pages ✓ Complete

**Commits:** `159ea63`, `8c41373`, `6d575ca`

*(Full notes in `2026-04-30-session-context.md` original — unchanged.)*

---

### DEV-34B — Spanish Injury Pages ✓ Complete

**Commit:** `84f7954`

*(Full notes in `2026-04-30-session-context.md` original — unchanged.)*

---

### DEV-35 — Spanish Tool Pages ✓ Complete

**Commits:** `ba525ef`, `0af5e75`, `c9b57a3`, `d054fc1`, `1ef4b58`, `adc1be1`, `a28d397`, `baad482`, `72cd2b3`, `886a833`

**Files changed:**

- `i18n/config.ts` — Added `TOOL_META_ES` map with Spanish title + description for all 11 tools (5 live + 6 coming-soon). Added 4 tool slug mappings: `urgency-checker → verificador-urgencia`, `injury-journal → diario-lesiones`, `lawyer-type-matcher → tipo-abogado`, `lost-wages-estimator → calculadora-salario`. (`accident-case-quiz → evaluacion-caso` and `evidence-checklist → lista-evidencia` already existed.)

- `lib/cms.ts` — Extended `getTool(slug, locale='en')` and `getAllTools(locale='en')` with locale param; reads from `content/tools/es/` when `locale === 'es'`. Backward-compatible.

- `app/(es)/es/herramientas/page.tsx` — Spanish tool index. Featured 2-col section + 3-col grid. Uses `SLUG_MAP_ES` for hrefs, `TOOL_META_ES` for Spanish titles/descriptions. Live vs. coming-soon distinction via `LAUNCH_SLUGS`. hreflang to `/tools`.

- `app/(es)/es/herramientas/[slug]/page.tsx` — Spanish tool detail page. `generateStaticParams` maps 5 live EN slugs through `SLUG_MAP_ES`. Calls `cms.getTool(slug, 'es')` (Spanish URL slug passed directly, matches JSON filename in `content/tools/es/`). Uses `enSlug` (not `tool.slug`) to detect `injury-journal` for the `InjuryJournal` component. Passes `toolStrings = { cta: dict.cta, tools: dict.tools }` to `ToolEngine`. hreflang EN↔ES. `notranslate`. CTA → `/es/buscar-ayuda`.

- `content/tools/es/*.json` — 5 files: `evaluacion-caso.json`, `verificador-urgencia.json`, `lista-evidencia.json`, `diario-lesiones.json`, `tipo-abogado.json`. All pass Zod validation. Step `id` fields and option `value` fields kept in English (output generators match on them). Only `question` text and option `label` text translated. Related arrays use English slugs.

- `components/tools/ToolEngine.tsx` — Added `strings` optional prop (`ToolEngineStrings` interface: cta + tools namespaces). Added `usePathname` for locale detection. Generator lookup now falls back via `SLUG_MAP_EN[tool.slug]` when `tool.slug` is a Spanish slug. On ES path: overrides `result.cta.href` to `/es/buscar-ayuda` and `result.cta.label` to `strings.cta.getFreGuidance`.

- `components/tools/ToolResults.tsx` — Added `strings` optional prop with English fallbacks. `ItemCard` now accepts `priorityLabels` prop (passed from `ToolResults`) instead of module-level constant.

- `lib/tools/output-generators-es.ts` — New file. Spanish output generators for 5 live tools: `accident-case-quiz`, `urgency-checker`, `evidence-checklist`, `injury-journal`, `lawyer-type-matcher`. Hub links point to `/es/accidentes/*`. `ToolEngine` uses ES generators when `pathname.startsWith('/es/')`, falling back to English for any tool without an ES variant.

- `components/tools/InjuryJournal.tsx` — Added `UI_EN`/`UI_ES` string tables and `SYMPTOM_OPTIONS_EN/ES` + `TREATMENT_OPTIONS_EN/ES` arrays. Detects locale via `usePathname`. All UI strings (tabs, headings, labels, placeholders, month names, weekday headers, aria-labels, date locale) switch based on path. `formatDate` now accepts a locale param.

- `components/ui/DisclaimerBanner.tsx` — Added `locale?: 'en' | 'es'` prop (default `'en'`). Spanish text defined for all 4 variants (`default`, `intake`, `tool`, `state`). All 8 ES pages now pass `locale="es"`.

---

**Bugs encountered and fixed in DEV-35:**

1. **404 on `/es/herramientas/evaluacion-caso`** — `metaDescription` was 163 chars (Zod max 160) → Zod threw → `catch { notFound() }`. Fixed: trimmed `evaluacion-caso` (163→155) and `tipo-abogado` (162→154).

2. **"Results for this tool are coming soon."** — `outputGenerators[tool.slug]` failed because `tool.slug` was `'evaluacion-caso'` (Spanish) but map keys are English. Fixed: `SLUG_MAP_EN[tool.slug]` fallback in `ToolEngine.handleFinish`.

3. **"Get Free Guidance" CTA in English** — generator output hardcodes English label. Fixed: override `result.cta.label` on ES path with `strings.cta.getFreGuidance`.

4. **InjuryJournal component not rendering on `/es/herramientas/diario-lesiones`** — page checked `tool.slug === 'injury-journal'` but `tool.slug` is `'diario-lesiones'` on ES pages. Fixed: changed guard to `enSlug === 'injury-journal'`.

5. **InjuryJournal UI still in English** — all strings hardcoded. Fixed: full UI translation with `usePathname` locale detection.

6. **DisclaimerBanner still in English on all ES pages** — hardcoded text. Fixed: `locale` prop + Spanish text + `locale="es"` on all 8 ES pages.

---

## Where to Start Next Session

**Next task: DEV-37 — Spanish State + City Pages**

- `app/(es)/es/estados/[state]/page.tsx` — 2 states (California, Arizona)
- `app/(es)/es/estados/[state]/[city]/page.tsx` — 16 cities
- `content/states/es/*.json` — 2 files
- `content/cities/es/*.json` — 16 files
- Extend `lib/cms.ts` with locale param for `getState`/`getCity`/`getCitiesByState`

**After DEV-37:** DEV-36 (extend `app/sitemap.ts` + `lib/hreflang.ts` helper)

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
| DEV-37 | 7C | Not started — Spanish state + city pages (2 states, 16 cities) |
| DEV-36 | 7D | Not started — hreflang + sitemap |

**Tier 1 (launch minimum):** DEV-29–32 — ✓ ALL COMPLETE
**Tier 2 (full bilingual):** all 10 tasks — 8/10 complete

---

## Patterns Established (don't re-derive)

### Adding a new Spanish content page type

1. Extend `lib/cms.ts` with `locale` param on the relevant getter — reads from `content/{type}/es/` when `locale === 'es'`
2. `generateStaticParams` — map EN slugs from `SLUG_MAP_ES`
3. `generateMetadata` — hreflang `languages: { en, es, 'x-default' }` + `other: { google: 'notranslate' }`
4. Related sidebar links — render Spanish slugs directly; use lookup table from `NAV_*` config for display labels
5. CTA always → `/es/buscar-ayuda`
6. Breadcrumb `variant="dark"` on `bg-primary-900` heroes
7. JSON files — Spanish slugs in all related arrays
8. Run Zod validation before committing (metaTitle ≤70, metaDescription 120–160)

### Client components + translations

Client components (`IntakeWizard`, `ToolEngine`, `ToolResults`) cannot call `getDictionary()`. Parent server page loads dict and passes `strings` prop subset. Use `strings?.key ?? 'English fallback'` pattern.

### Output generators + locale

`lib/tools/output-generators-es.ts` mirrors `output-generators.ts` with Spanish strings. `ToolEngine` picks ES generators when `pathname.startsWith('/es/')`. Generator slug lookup: `SLUG_MAP_EN[tool.slug]` resolves Spanish URL slug → English key.

### `InjuryJournal` locale

Detects locale via `usePathname` internally. No props needed from parent. Uses `UI_ES`/`UI_EN` string tables defined in the component file.

### `DisclaimerBanner` locale

Server component. Pass `locale="es"` from every ES page. All 4 variant texts have Spanish equivalents. English pages use default `locale='en'`.

### Zod validation pitfall

`catch { notFound() }` in ES detail pages fires on ANY Zod parse failure — including `metaDescription` over 160 chars. Always validate all 5 metric constraints before committing JSON: `metaTitle ≤70`, `metaDescription 120–160`, `description ≥100`, `supportingContent ≥4` (each `content ≥150`), `faq ≥3` (each `answer ≥50`).

---

## Build State

| Item | Status |
|------|--------|
| Next.js 14 App Router | ✓ |
| TypeScript strict | ✓ (zero errors) |
| Static pages | ✓ ~135 |
| Spanish i18n | 🔄 DEV-29–35 done; DEV-37/36 remaining |
| Attorney content review | ✗ Pending |
| GA4 / Clarity | ✗ Pending Michael |
| Domain/DNS | ✗ Pending Michael |
