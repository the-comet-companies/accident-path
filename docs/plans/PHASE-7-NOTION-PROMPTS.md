# Phase 7 — Notion Execution Prompts
> Copy each block below into the corresponding Notion task page body.

---

## DEV-29: i18n Infrastructure + Middleware

Read `docs/strategy/SPANISH-STRATEGY.md` §Technical Implementation and `docs/plans/PHASE-7-SPANISH-PLAN.md` §DEV-29 for the complete `es.json` key list and nav array definitions.

- `i18n/config.ts` — exports `LOCALES`, `DEFAULT_LOCALE`, `SLUG_MAP_ES` (English slug → Spanish slug), `SLUG_MAP_EN` (Spanish slug → English slug), and locale-aware nav arrays for Header and Footer (`NAV_ACCIDENT_TYPES`, `NAV_SIMPLE_LINKS`, `NAV_FIND_HELP`, `FOOTER_ACCIDENT_LINKS`, `FOOTER_RESOURCE_LINKS`) — each has `en` and `es` variants with both labels and hrefs
- `i18n/en.json` — all non-nav UI strings: footer disclaimers, CTA labels, trust badge text, emergency text, intake step questions + options + TCPA consent, tool engine button labels
- `i18n/es.json` — same keys, Spanish values; must satisfy a `Dictionary` TypeScript type inferred from `en.json` so missing keys are caught at build time
- `i18n/dictionaries.ts` — `getDictionary(locale: 'en' | 'es'): Promise<Dictionary>` async server-only loader
- `middleware.ts` — on `/` only: check `NEXT_LOCALE` cookie → `Accept-Language` header → if Spanish detected redirect to `/es/`; all other paths pass through unchanged

---

## DEV-30: Language Toggle + Locale-Aware Header + Footer

Read `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `app/layout.tsx`, and `i18n/config.ts` (from DEV-29).

- `components/layout/Header.tsx` — add `locale: 'en' | 'es'` prop (default `'en'`); replace all hardcoded English nav arrays with `NAV_ACCIDENT_TYPES[locale]`, `NAV_SIMPLE_LINKS[locale]`, `NAV_FIND_HELP[locale]` from config; "Get Help Now" / "Obtenga Ayuda Ahora" CTA is locale-driven; add `<LanguageToggle />` to desktop nav and mobile nav
- `components/layout/Footer.tsx` — add `locale: 'en' | 'es'` prop and `dict` prop; replace hardcoded link arrays with `FOOTER_ACCIDENT_LINKS[locale]`, `FOOTER_RESOURCE_LINKS[locale]`; replace 3 hardcoded English disclaimer paragraphs with `dict.footer.disclaimer1/2/3`; replace bottom bar emergency text with locale-aware strings; add `<LanguageToggle />` to bottom bar
- `components/layout/LanguageToggle.tsx` — `'use client'`; reads `usePathname()`; computes equivalent URL using `SLUG_MAP_ES` (EN→ES) or `SLUG_MAP_EN` (ES→EN); on click: sets `NEXT_LOCALE` cookie (1-year expiry), calls `router.push(equivalentUrl)`; falls back to `/es/` or `/` if no match; active locale shown in bold
- `app/layout.tsx` — pass `locale="en"` and `dict` to `<Header>` and `<Footer>`
- `app/es/layout.tsx` — pass `locale="es"` and Spanish `dict` to `<Header>` and `<Footer>`

---

## DEV-31: Route Group Restructure + Spanish Home Page

Read `app/layout.tsx`, `app/page.tsx`, and `app/es/layout.tsx` as reference. Read `i18n/dictionaries.ts`. See `docs/plans/PHASE-7-SPANISH-PLAN.md` §DEV-31 for the full step-by-step.

This task has two parts: (A) route group restructure — prerequisite for correct `<html lang>` on Spanish pages without breaking static generation; (B) Spanish home page.

**Part A — Route group restructure:**

Problem: `app/layout.tsx` wraps ALL routes including `/es/*`, giving Spanish pages `<html lang="en">` and double nav/footer. Using `headers()` to detect locale in the root layout would make all 89 pre-rendered pages dynamic.

Steps (use `git mv` to preserve history):
1. Create `app/(en)/layout.tsx` — copy all content from `app/layout.tsx`; change `import "./globals.css"` → `import "../globals.css"`
2. Move all English routes into `app/(en)/`: `page.tsx`, `accidents/`, `guides/`, `injuries/`, `tools/`, `find-help/`, `states/`, `about/`, `for-attorneys/`, `privacy/`, `terms/`, `disclaimers/`, `cookie-policy/`, `contact/`, `api/`
3. Delete `app/layout.tsx`
4. Keep at `app/` root (do not move): `globals.css`, `robots.ts`, `sitemap.ts`, `favicon.ico`
5. Create `app/(es)/es/` directory; move `app/es/layout.tsx` → `app/(es)/es/layout.tsx`

All URLs are unchanged (route groups are URL-transparent). All `@/` absolute imports throughout the codebase are unchanged.

**Part B — Spanish root layout + home page:**

- `app/(es)/es/layout.tsx` — replace the DEV-30 stub; full Spanish root layout: `async` server component; calls `getDictionary('es')`; renders `<html lang="es" className={...font variables...}>`; `<body>`; `<EmergencyBanner>`; `<SchemaOrg>`; Spanish `<Header locale="es">`; `<MobileNav locale="es">`; `<Footer locale="es" dict={dict}>`; `<meta name="google" content="notranslate" />`; hreflang: `'en': '/'`, `'es': '/es/'`, `'x-default': '/'`; import path: `import "../../globals.css"`
- `app/(es)/es/page.tsx` — mirrors `app/(en)/page.tsx` structure; all UI strings from `dict`; Spanish `generateMetadata` returning title `"AccidentPath | Guía de Accidentes en California"` and description `"Obtenga orientación clara después de un accidente. Conéctese con abogados calificados. Servicio gratuito, sin compromiso."`
- `app/(en)/layout.tsx` — add hreflang alternates to `generateMetadata`: `'en': '/'`, `'es': '/es/'`, `'x-default': '/'`

---

## DEV-32: Spanish Intake Wizard (/es/buscar-ayuda)

Read `components/intake/IntakeWizard.tsx`, `app/find-help/page.tsx`, `app/find-help/results/page.tsx`, `app/find-help/thank-you/page.tsx`, and `docs/strategy/SPANISH-STRATEGY.md` §Intake Wizard + §Disclaimers.

**Constraint:** `IntakeWizard` is `'use client'` and cannot call `getDictionary()`. The parent server page loads the dict and passes strings as props.

**Constraint — intake values are English IDs:** Option `value` attributes must stay as English slugs (e.g. `"car"`, `"whiplash"`). Only the displayed label text changes to Spanish. This keeps results page logic and Supabase submissions working correctly in both languages.

- `app/(es)/es/buscar-ayuda/page.tsx` — server component; loads `getDictionary('es')`; passes `strings={dict.intake}` to `<IntakeWizard>` and `strings={dict.findHelp}` for hero text; hreflang ↔ `/find-help`
- `app/(es)/es/buscar-ayuda/results/page.tsx` — server component; passes `strings={dict.findHelp.results}` and `strings={dict.findHelp.urgency}`; URGENCY_CONFIG labels come from dict, not hardcoded English
- `app/(es)/es/buscar-ayuda/thank-you/page.tsx` — Spanish thank-you page
- `components/intake/IntakeWizard.tsx` — add `strings` prop typed as `Dictionary['intake']`; use for TCPA consent, disclaimer, error messages, CTA labels; exact Spanish text in `docs/plans/PHASE-7-SPANISH-PLAN.md` §DEV-32
- `components/intake/steps/` — read every step component file before editing; each has hardcoded English question text and option arrays; add `strings` prop to each; option `value` stays English ID, only displayed `label` changes to Spanish
- `app/find-help/results/page.tsx` — add optional `strings` prop defaulting to English so English page stays unchanged

---

## DEV-33: Spanish Accident Pages (/es/accidentes/[slug])

Read `app/accidents/[slug]/page.tsx` in full and `content/accidents/car.json` for the complete JSON schema. Read `i18n/config.ts` for `SLUG_MAP_ES`.

- `lib/cms.ts` — add `locale?: 'en' | 'es'` parameter to existing loader methods; when `locale === 'es'` read from `content/[type]/es/[slug].json`; do NOT create a separate `lib/cms-es.ts`
- `app/(es)/es/accidentes/[slug]/page.tsx` — mirrors EN accident page; `generateStaticParams` returns all values from `SLUG_MAP_ES`; calls `cms.getAccident(SLUG_MAP_EN[slug], 'es')`; hreflang EN↔ES; related sidebar links go to `/es/` URLs; CTA → `/es/buscar-ayuda`; includes `<meta name="google" content="notranslate" />`
- `content/accidents/es/` — 13 JSON files: `auto.json`, `camion.json`, `motocicleta.json`, `caida.json`, `trabajo.json`, `bicicleta.json`, `peaton.json`, `mordida-perro.json`, `construccion.json`, `propiedad.json`, `producto.json`, `muerte-injusta.json`, `uber-lyft.json` — same schema as English JSON, Spanish field values, add `"translationStatus": "needs-review"` on every file; disclaimer field must read "Esta información es solo para fines educativos y no constituye asesoramiento legal." — never use placeholder text

---

## DEV-34: Spanish Guide Pages (/es/guias/[slug])

Read `app/guides/[slug]/page.tsx` in full and `content/guides/after-car-accident.json` for schema. Read `i18n/config.ts` for `SLUG_MAP_ES`.

- `app/(es)/es/guias/[slug]/page.tsx` — mirrors EN guide page; `generateStaticParams` returns Spanish guide slugs from `SLUG_MAP_ES`; loads `content/guides/es/[slug].json`; hreflang EN↔ES; CTA → `/es/buscar-ayuda`; includes `<meta name="google" content="notranslate" />`
- `content/guides/es/` — 14 JSON files: `despues-accidente-auto.json`, `despues-accidente-camion.json`, `lista-evidencia.json`, `despues-accidente-motocicleta.json`, `soy-culpable.json`, `errores-comunes.json`, `ajustadores-seguros.json`, `reporte-policial.json`, `contratar-abogado.json`, `reclamos-seguro.json`, `proteger-reclamo.json`, `acuerdo-vs-demanda.json`, `hablar-con-abogado.json`, `facturas-medicas.json` — same schema as English, Spanish values, `"translationStatus": "needs-review"` on each

---

## DEV-34B: Spanish Injury Pages (/es/lesiones/[slug])

Read `app/injuries/[slug]/page.tsx` in full and `content/injuries/whiplash.json` for schema. Read `i18n/config.ts` for `SLUG_MAP_ES`.

- `app/(es)/es/lesiones/[slug]/page.tsx` — mirrors EN injury page; `generateStaticParams` returns Spanish injury slugs from `SLUG_MAP_ES`; loads `content/injuries/es/[slug].json`; hreflang EN↔ES; CTA → `/es/buscar-ayuda`; includes `<meta name="google" content="notranslate" />`
- `content/injuries/es/` — 7 JSON files: `latigazo.json`, `huesos-rotos.json`, `traumatismo-craneal.json`, `columna.json`, `tejido-blando.json`, `quemaduras.json`, `lesiones-internas.json` — same schema as English, Spanish values, `"translationStatus": "needs-review"` on each

---

## DEV-35: Spanish Tool Pages (/es/herramientas/[slug])

Read `app/tools/[slug]/page.tsx`, `components/tools/ToolEngine.tsx`, and `components/tools/ToolResults.tsx`.

**Constraint:** `ToolEngine` and `ToolResults` are `'use client'` and cannot call `getDictionary()`. The parent server page passes translated strings as props.

- `app/(es)/es/herramientas/[slug]/page.tsx` — server component; loads `getDictionary('es')`; passes `strings={dict.tools}` and `strings={dict.cta}` to `<ToolEngine>`; Spanish meta title + description; hreflang EN↔ES; includes `<meta name="google" content="notranslate" />`
- `components/tools/ToolEngine.tsx` — add `strings` prop; use `strings.cta.next`, `strings.cta.back`, `strings.cta.seeMyResults`, `strings.cta.calculating` for buttons; `strings.tools.disclaimer` for disclaimer; tool question content stays English for now — mark with `// TODO: Spanish tool content (DEV-35)`
- `components/tools/ToolResults.tsx` — add `strings` prop; use `strings.tools.yourResults` for heading; `strings.cta.startOver` for button; `strings.tools.priority.*` for badge labels; CTA href → `/es/buscar-ayuda` when `usePathname().startsWith('/es/')`

---

## DEV-37: Spanish State + City Pages (/es/estados/[state]/[city])

Read `app/states/[state]/page.tsx`, `app/states/[state]/[city]/page.tsx`, `content/states/california.json`, and `content/cities/los-angeles.json` for schema.

**Note:** State and city slugs are proper names and do not get translated. `/es/estados/california/los-angeles` uses the same slugs as English. Only the content inside the JSON files is translated.

- `i18n/config.ts` — add `NAV_STATE_GUIDES` with `en` and `es` variants; ES hrefs use `/es/estados/california` and `/es/estados/california/los-angeles`; update `Header.tsx` to use `NAV_STATE_GUIDES[locale]` instead of the hardcoded `stateGuides` constant; update `FOOTER_RESOURCE_LINKS.es` California and Arizona entries to point to `/es/estados/california` and `/es/estados/arizona`
- `app/(es)/es/estados/[state]/page.tsx` — mirrors EN state page; `generateStaticParams` returns `['california', 'arizona']`; loads `content/states/es/[state].json`; hreflang EN↔ES; CTA → `/es/buscar-ayuda`; reviewer byline hidden when `reviewedBy === 'Pending Legal Review'` (same logic as English); `<meta name="google" content="notranslate" />`
- `app/(es)/es/estados/[state]/[city]/page.tsx` — mirrors EN city page; `generateStaticParams` returns all city slugs per state; loads `content/cities/es/[city].json`; hreflang EN↔ES; CTA → `/es/buscar-ayuda`; same reviewer conditional; `<meta name="google" content="notranslate" />`
- `content/states/es/california.json` and `content/states/es/arizona.json` — same schema as English, Spanish field values, `"translationStatus": "needs-review"`
- `content/cities/es/` — 16 JSON files: `los-angeles.json`, `san-diego.json`, `san-francisco.json`, `san-jose.json`, `sacramento.json`, `fresno.json`, `oakland.json`, `long-beach.json`, `anaheim.json`, `bakersfield.json`, `phoenix.json`, `tucson.json`, `mesa.json`, `scottsdale.json`, `chandler.json`, `gilbert.json` — same schema as English, Spanish values, `"translationStatus": "needs-review"`

---

## DEV-36: hreflang + Spanish Sitemap

Read `app/sitemap.ts` in full and `app/(en)/layout.tsx`.

- `lib/hreflang.ts` — `getHreflangAlternates(enPath, esPath)` returns the `alternates.languages` object shape Next.js `generateMetadata` expects; always includes `'x-default': enPath`
- `app/sitemap.ts` — extend (do not create a separate file) to include all `/es/**` URLs alongside English entries; use `SLUG_MAP_ES` values to generate Spanish slugs dynamically
- `app/(en)/layout.tsx` — update `generateMetadata` on English pages to include `alternates.languages` pointing to Spanish equivalents using `getHreflangAlternates()`
