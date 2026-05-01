# Session Notes — 2026-05-01

## Summary

Audited the Notion page tracker, fixed stale tool statuses, built 5 of 6 Spanish tool pages (insurance-call-prep, lost-wages-estimator, record-request, settlement-readiness, state-next-steps), resolved several UI bugs, and pushed to main.

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

## Commits This Session

| Hash | Message |
|------|---------|
| (pending) | feat(es): add Spanish tool — state-next-steps (proximos-pasos-estado) |
| `f54ba32` | feat(es): add Spanish tool — settlement-readiness (preparacion-acuerdo) |
| `46c4438` | docs: move session notes to session_docs/ and update with tasks 2-3 + bug fixes |
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

### Spanish tools (1 remaining, plan written)
| Tool | ES Slug |
|------|---------|
| statute-countdown | `cuenta-regresiva-plazo` |

### City pages (20 — largest open chunk)
All use the shared dynamic route. Each needs `content/cities/{slug}.json` + ES version.

### Spanish-only pages (4)
| Page | Needs |
|------|-------|
| About AccidentPath | `app/(es)/es/sobre-nosotros/page.tsx` |
| Contact AccidentPath | `app/(es)/es/contacto/page.tsx` |
| Spinal Accident Guide | ES JSON + `/es/accidentes/columna` route |
| Traumatic Brain Accident Guide | ES JSON + `/es/accidentes/traumatismo-craneal` route |
