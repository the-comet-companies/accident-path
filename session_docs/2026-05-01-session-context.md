# Session Notes — 2026-05-01

## Summary

Audited the Notion page tracker, fixed stale tool statuses, built all 6 Spanish tool pages, added Spanish output generators for state-next-steps and statute-countdown, resolved several UI bugs, and pushed to main. All 11 tools are now fully live in both EN and ES. Also completed all 20 pending city pages (EN + ES), verified and corrected all hospital data with phone numbers, and fixed the states listing UI imbalance between CA and AZ.

**Session continuation (same day):** Built Spanish Contact page (`/es/contacto`), Spanish About page (`/es/sobre-nosotros`), fixed ES desktop header crowding, fixed LanguageToggle routing for `/about` ↔ `/es/sobre-nosotros` and `/contact` ↔ `/es/contacto`, updated footer ES About link. Only 2 Spanish pages remain (Spinal + TBI accident guides).

---

## Notion Tracker Audit

- Queried the **Accident Path Website Pages** DB (`352917dc-7b83-8190-a9be-cecaf2b6df5d`)
- Confirmed 30 pages still pending — 22 EN not built (16 cities + 6 tools), 8 ES not started
- Discovered mismatch: Notion showed 6 tools as **EN: Coming Soon** but all 11 tool JSON files existed in `content/tools/`
- Fixed: updated all 6 tool rows in Notion → **EN: Live** (Spanish remains Coming Soon)

## PENDING.md Confirmed Accurate

- `PENDING.md` was verified against the codebase — it correctly reflects the real to-do state
- Tools section is accurate: 6 tools need Spanish versions (EN is live)
- 20 city pages need both EN + ES content JSON
- 4 pages (About, Contact, Spinal, TBI) need Spanish routes only

## Spanish Tools — Spec + Plan Written

- Brainstormed and designed the 6 Spanish tool pages
- Spec: `docs/superpowers/specs/2026-05-01-spanish-tools-design.md`
- Plan: `docs/superpowers/plans/2026-05-01-spanish-tools.md`
- Approach: Option C — one tool at a time, user reviews each before proceeding
- Full translated JSON content pre-written in plan for all 6 tools

## Task 1 Complete: insurance-call-prep ✅

- Created `content/tools/es/preparacion-llamada-seguro.json` (full translation)
- Added `'insurance-call-prep': 'preparacion-llamada-seguro'` to `SLUG_MAP_ES` in `i18n/config.ts`
- Added `'insurance-call-prep'` to `TOOL_EN_SLUGS` in `app/(es)/es/herramientas/[slug]/page.tsx`
- Fixed `metaTitle` from 89 → 66 chars (Zod schema enforces 70-char max)
- Notion updated: Spanish Status → Live

## Task 2 Complete: lost-wages-estimator ✅

- Created `content/tools/es/calculadora-salario.json` (full translation)
- `SLUG_MAP_ES` already had the entry — no change needed
- Added `'lost-wages-estimator'` to `TOOL_EN_SLUGS`
- Code quality review caught `metaDescription` at 185 chars → fixed to 158 chars (Zod max 160)
- Notion updated: Spanish Status → Live, Spanish Route set

## Task 3 Complete: record-request ✅

- Created `content/tools/es/solicitud-registros.json` (full translation)
- Added `'record-request': 'solicitud-registros'` to `SLUG_MAP_ES`
- Added `'record-request'` to `TOOL_EN_SLUGS`
- Code quality review surfaced pre-existing `slip-fall` alias bug (see Bug Fixes below)
- Notion updated: Spanish Status → Live, Spanish Route set

## Task 4 Complete: settlement-readiness ✅

- Created `content/tools/es/preparacion-acuerdo.json` (full translation)
- Added `'settlement-readiness': 'preparacion-acuerdo'` to `SLUG_MAP_ES`
- Added `'settlement-readiness'` to `TOOL_EN_SLUGS`
- metaTitle 50 chars, metaDescription 158 chars — both within Zod limits
- Notion updated: Spanish Status → Live, Spanish Route set

## Task 5 Complete: state-next-steps ✅

- Created `content/tools/es/proximos-pasos-estado.json` (full translation)
- Added `'state-next-steps': 'proximos-pasos-estado'` to `SLUG_MAP_ES`
- Added `'state-next-steps'` to `TOOL_EN_SLUGS`
- Implementer trimmed metaDescription from 172 → 158 chars to pass Zod max(160)
- Notion updated: Spanish Status → Live, Spanish Route set

## Task 6 Complete: statute-countdown ✅

- Created `content/tools/es/cuenta-regresiva-plazo.json` (full translation)
- Added `'statute-countdown': 'cuenta-regresiva-plazo'` to `SLUG_MAP_ES`
- Added `'statute-countdown'` to `TOOL_EN_SLUGS` (now 11 items — all tools live)
- Implementer trimmed metaDescription from 185 → 160 chars to pass Zod max(160)
- Notion updated: Spanish Status → Live, Spanish Route set

## Spanish Output Generators (state-next-steps + statute-countdown)

- Root cause: result cards for these two tools were rendering in English on the ES pages
- `lib/tools/output-generators-es.ts` only had 5 generators; `state-next-steps` and `statute-countdown` fell back to the EN generator
- Fix: added `stateNextStepsEs` and `statuteCountdownEs` functions to `output-generators-es.ts`; registered both in `outputGeneratorsEs`
- ES results now use Spanish strings, `es-MX` date formatting, and `/es/buscar-ayuda` CTA links

## Bug Fixes

### Coming Soon badges still showing on listing pages
- Root cause: `app/(en)/tools/page.tsx` and `app/(es)/es/herramientas/page.tsx` each have their own `LAUNCH_SLUGS` array — separate from the detail page's array — that wasn't updated
- Fixed both listing pages to include all 11 tools

### EN tool detail pages showing Coming Soon
- Root cause: `app/(en)/tools/[slug]/page.tsx` `LAUNCH_SLUGS` only had 5 slugs
- Fixed: added all 6 new slugs

### Spanish tool detail page showing EN labels
- Related Tools sidebar showed EN tool names (slug-to-label transform)
- Related Guides sidebar showed EN guide names
- Accident type buttons showed EN accident names
- Fix: added `ACCIDENT_LABEL_ES` and `GUIDE_LABEL_ES` maps to `i18n/config.ts`; updated component to use `TOOL_META_ES` for tool names

### slip-fall alias missing from SLUG_MAP_ES
- Root cause: All ES tool JSON files use `slip-fall` in `relatedAccidents`, but `SLUG_MAP_ES` only mapped `slip-and-fall` → `caida`
- Result: Related accidents link resolved to broken `/es/accidentes/slip-fall` on all 7 ES tool pages
- Fix: added `'slip-fall': 'caida'` alias to `SLUG_MAP_ES` in `i18n/config.ts`

### EmergencyBanner React 19 script warning
- Root cause: Turbopack/React 19 warns that `<script dangerouslySetInnerHTML>` inside React components is never executed on client-side renders
- Previous approach: inline script ran synchronously in SSR HTML to hide dismissed banner before paint
- Fix: converted to `'use client'` component using `useLayoutEffect` + `useRef` — same pre-paint behavior, works on both SSR and client-side navigation, eliminates the warning

---

## City Pages — All 20 Complete ✅

### Approach
- Pilot batch of 5 cities first (Riverside, Irvine, Santa Ana, Santa Clarita, Chula Vista) — user reviewed and approved quality
- Remaining 15 cities in two parallel subagent batches (Fremont, Stockton, San Bernardino, Modesto, Glendale CA, Fontana, Torrance + Pomona, Huntington Beach, Ontario, Lancaster, Palmdale, Pasadena, Rancho Cucamonga, Glendale AZ)
- All 20 cities × EN + ES = 40 JSON files in `content/cities/` and `content/cities/es/`
- No route changes needed — `generateStaticParams` auto-discovers JSON files

### Schema constraints (Zod)
- `metaTitle` max 70, `metaDescription` min 120 / max 160, `description` min 200, `hospitals` min 2, `courts` min 1, `commonAccidentTypes` min 3, `localNotes` min 50
- Two ES files exceeded 160-char metaDescription on build: `es/huntington-beach.json` (162→160) and `es/rancho-cucamonga.json` (161→159) — fixed by removing `/a` gender suffix
- **Lesson:** Always use Node.js (`string.length`) to count chars for Zod validation, not Python's `len()` — they disagree on multi-byte characters like `¿`

### Hospital data verification
- All hospital data sourced from training knowledge — web-search verified after build
- **5 name errors corrected:**
  - Santa Ana: `UCI Health — Western Medical Center Santa Ana` → `Orange County Global Medical Center` (KPC Health — UCI has no affiliation)
  - Irvine: `Kaiser Permanente Irvine Medical Center` → `Kaiser Permanente Orange County — Irvine Medical Center`
  - Lancaster + Palmdale: `Antelope Valley Hospital` → `Antelope Valley Medical Center` (rebranded 2022)
  - Pasadena: `Huntington Hospital` → `Huntington Health` (rebranded 2022, now Cedars-Sinai affiliate)
  - Glendale AZ: `Arrowhead Hospital` → `Abrazo Arrowhead Campus` (rebranded)
- **Phone numbers added** to all 40 hospitals across the 20 new city files (EN + ES)
- **Geographic mismatches confirmed intentional:** Several cities list hospitals in neighboring cities (e.g. Arrowhead Regional in Colton for Fontana, San Antonio Regional in Upland for Pomona/Ontario/Rancho Cucamonga). Web research confirmed no in-city acute care ER exists for those cities — nearest regional hospitals are the correct choice. Addresses already show the real city so users are not misled.
- **Rancho Cucamonga note:** Only hospital within city limits is Kindred Hospital (long-term acute care, no ER) — no general ER in the city.
- **Valencia = Santa Clarita:** Henry Mayo Newhall Hospital address shows "Valencia, CA" but Valencia is legally within Santa Clarita city limits (one of four original communities incorporated in 1987).

### UI fix: states listing page imbalance
- Root cause: `/states` and `/es/estados` pages rendered ALL city chips, making CA card (29 cities) much taller than AZ card (7 cities)
- Fix: capped chips at 8 per card; if `cities.length > 8`, shows "View all N cities →" link to the state page
- Applied to both `app/(en)/states/page.tsx` and `app/(es)/es/estados/page.tsx`

## Commits This Session

| Hash | Message |
|------|---------|
| `12e30b6` | fix(ui): cap city chips at 8 per state card with overflow link |
| `3e19e4c` | fix(cities): correct hospital names and add verified phone numbers to all 20 city pages |
| `21c8080` | fix(cities): trim ES Rancho Cucamonga metaDescription to 160-char Zod limit |
| `a6293ed` | fix(cities): trim ES Huntington Beach metaDescription to 160-char Zod limit |
| `8aec141` | docs: remove completed city pages from PENDING.md |
| `6a7e6da` | feat(cities): add remaining 15 cities EN + ES |
| `c38401d` | feat(cities): add pilot batch — Riverside, Irvine, Santa Ana, Santa Clarita, Chula Vista (EN + ES) |
| `d5aae4d` | feat(es): add Spanish output generators for state-next-steps and statute-countdown |
| `6dc9b8c` | feat(es): add Spanish tool — statute-countdown (cuenta-regresiva-plazo) |
| `b11e29d` | docs: update session notes — tasks 4-5 complete |
| `6fb666d` | feat(es): add Spanish tool — state-next-steps (proximos-pasos-estado) |
| `f54ba32` | feat(es): add Spanish tool — settlement-readiness (preparacion-acuerdo) |
| `46c4438` | docs: move session notes to session_docs/ and update with tasks 2-3 + bug fixes |
| `4a15080` | docs: update session notes — tasks 2 & 3 complete, bug fixes documented |
| `2fde8b0` | fix(ui): replace inline script in EmergencyBanner with useLayoutEffect to fix React 19 warning |
| `8273286` | fix(es): add slip-fall alias to SLUG_MAP_ES to fix broken related-accident links |
| `047fa92` | feat(es): add Spanish tool — record-request (solicitud-registros) |
| `5114b78` | fix(es): shorten metaDescription for calculadora-salario to fit 160-char Zod limit |
| `a91f739` | feat(es): add Spanish tool — lost-wages-estimator (calculadora-salario) |
| `8cf0c2b` | docs: add session notes for 2026-05-01 |
| `ec680e3` | fix(es): translate related tools, guides, and accident type labels on ES tool detail pages |
| `2bef1ee` | fix(es): remove Próximamente badge from 6 live tools on herramientas listing page |
| `9e5aca4` | fix(en): remove Coming Soon badge from 6 live tools on listing page |
| `5d808a2` | fix(es): shorten metaTitle for insurance-call-prep ES tool to fit 70-char limit |
| `8894d98` | feat(es): add Spanish tool — insurance-call-prep (preparacion-llamada-seguro) |
| `a61f02d` | docs: add implementation plan for 6 Spanish tool pages |
| `2252ca4` | docs: add spec for Spanish tool pages (6 remaining tools) |

---

## Remaining To-Do (from PENDING.md)

### Spanish tools
All 6 tools are now live in Spanish. ✅

### City pages
All 20 city pages complete in EN + ES. ✅

### Spanish-only pages (all complete ✅)
| Page | Status |
|------|--------|
| About AccidentPath | ✅ Live — `app/(es)/es/sobre-nosotros/page.tsx` |
| Contact AccidentPath | ✅ Live — `app/(es)/es/contacto/page.tsx` |
| Spinal Accident Guide | ✅ Live — `content/accidents/es/columna.json` |
| Traumatic Brain Accident Guide | ✅ Live — `content/accidents/es/traumatismo-craneal.json` |

---

## Session Continuation — Spanish Static Pages + UI Fixes

### Spanish Contact Page ✅
- Created `app/(es)/es/contacto/page.tsx` (full translation of `/contact`)
- `CONTACT_TOPICS` and `EXPECTATIONS` fully translated in usted register
- Metadata: `canonical: /es/contacto`, hreflang `en: /contact`, `es: /es/contacto`
- Commit: `f517de1`

### Spanish About Page ✅
- Created `app/(es)/es/sobre-nosotros/page.tsx` (full translation of `/about`)
- `VALUES` array fully translated; CTA links to `/about/how-it-works` and `/es/contacto`
- Metadata: `canonical: /es/sobre-nosotros`, hreflang `en: /about`, `es: /es/sobre-nosotros`

### Nav + Footer Updates ✅
- `NAV_SIMPLE_LINKS.es` updated: `href: '/about'` → `href: '/es/sobre-nosotros'`
- `Footer.tsx` `getCompanyLinks`: ES "Sobre Nosotros" → `/es/sobre-nosotros`
- `i18n/config.ts`: added `{ label: 'Sobre Nosotros', href: '/es/sobre-nosotros' }` to ES nav

### LanguageToggle Routing Fix ✅
- Root cause: `/about` and `/contact` not in prefix maps → fell back to `/es/` when switching locales
- Fix: added `STATIC_EN_TO_ES` and `STATIC_ES_TO_EN` maps in `LanguageToggle.tsx`
  - `/about` ↔ `/es/sobre-nosotros`
  - `/contact` ↔ `/es/contacto`

### ES Desktop Header Crowding Fix ✅
- Root cause: 7-item ES nav with longer labels overflowed at 1280px (xl breakpoint)
- Fix in `Header.tsx`:
  - `navItemPx`: `px-2.5` → `px-2` for ES
  - Nav gap: `gap-0.5` → `gap-0` for ES
- Fix in `i18n/config.ts`: `getHelpNow: 'Obtenga Ayuda Ahora'` → `'Obtenga Ayuda'` (full text stays in `getHelpNowFull` for mobile bottom bar)
- Note: breakpoint is already `xl` (1280px) for ES via `app/(es)/es/layout.tsx`

### Notion Tracker Updated ✅
- About AccidentPath: Spanish Route → `https://accidentpath.com/es/sobre-nosotros`, Spanish Status → Live
- Contact AccidentPath: Spanish Route → `https://accidentpath.com/es/contacto`, Spanish Status → Live

### Commits This Continuation
| Hash | Message |
|------|---------|
| `0f85408` | feat(es): add Sobre Nosotros to ES header nav |
| `30c6720` | feat(ui): add Contact Us / Contacto to footer company links |
| `f517de1` | feat(es): add Spanish contact page (/es/contacto) |
| `3dd611e` | feat(es): add Spanish About page + fix header crowding + fix language toggle routing |

---

## Session Continuation — Spanish Accident Guides (Spinal + TBI)

### Spinal Accident Guide ES ✅
- Created `content/accidents/es/columna.json` (full translation of `/accidents/spinal`)
- Added `'spinal'` to `ACCIDENT_EN_SLUGS` in `app/(es)/es/accidentes/[slug]/page.tsx`
- Route: `/es/accidentes/columna`
- metaDescription: 143 chars (Zod max 160)
- Notion updated: Spanish Route → `https://accidentpath.com/es/accidentes/columna`, Spanish Status → Live

### Traumatic Brain Accident Guide ES ✅
- Created `content/accidents/es/traumatismo-craneal.json` (full translation of `/accidents/traumatic-brain`)
- Added `'traumatic-brain'` to `ACCIDENT_EN_SLUGS` in `app/(es)/es/accidentes/[slug]/page.tsx`
- Route: `/es/accidentes/traumatismo-craneal`
- metaDescription: 149 chars (Zod max 160)
- Notion updated: Spanish Route → `https://accidentpath.com/es/accidentes/traumatismo-craneal`, Spanish Status → Live

### PENDING.md Cleared ✅
- All pending work is now complete — `PENDING.md` reflects no remaining items
- Site is fully bilingual: all accident types, injury guides, tools, city pages, state pages, and static pages have Spanish versions

### Notion Tracker Sync (this continuation)
- Spinal Accident Guide: Spanish Route + Spanish Status → Live
- Traumatic Brain Accident Guide: Spanish Route + Spanish Status → Live
- (Previous continuation also fixed: 20 city pages EN Status → Live, all 20 city pages Spanish Route populated, all 20 cities Spanish Status → Live, Insurance Call Prep Spanish Route populated)

### Commits This Continuation
| Hash | Message |
|------|---------|
| `76c3516` | feat(es): add Spanish Spinal and TBI accident guides |
