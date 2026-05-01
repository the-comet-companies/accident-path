# Spanish Tool Pages — 6 Remaining Tools

**Date:** 2026-05-01
**Status:** Approved for implementation
**Approach:** Option C — one tool at a time, user reviews each before proceeding

---

## Goal

Add fully-translated Spanish versions of the 6 English tools that are live but have no Spanish equivalent. Each tool should be live at `/es/herramientas/{es-slug}`.

---

## What's Already in Place

- Route: `app/(es)/es/herramientas/[slug]/page.tsx` ✓
- `TOOL_META_ES` entries for all 6 tools already in `i18n/config.ts` ✓
- `SLUG_MAP_ES` has `lost-wages-estimator` → `calculadora-salario` ✓
- 5 existing Spanish tools serve as translation reference

---

## Tools to Build (in order)

| # | EN Slug | ES Slug | ES JSON Path |
|---|---------|---------|-------------|
| 1 | `insurance-call-prep` | `preparacion-llamada-seguro` | `content/tools/es/preparacion-llamada-seguro.json` |
| 2 | `lost-wages-estimator` | `calculadora-salario` | `content/tools/es/calculadora-salario.json` |
| 3 | `record-request` | `solicitud-registros` | `content/tools/es/solicitud-registros.json` |
| 4 | `settlement-readiness` | `preparacion-acuerdo` | `content/tools/es/preparacion-acuerdo.json` |
| 5 | `state-next-steps` | `proximos-pasos-estado` | `content/tools/es/proximos-pasos-estado.json` |
| 6 | `statute-countdown` | `cuenta-regresiva-plazo` | `content/tools/es/cuenta-regresiva-plazo.json` |

---

## Per-Tool Delivery Sequence

For each tool:
1. Create the ES JSON file (full translation)
2. Add ES slug to `SLUG_MAP_ES` in `i18n/config.ts` (if not already present)
3. Add EN slug to `TOOL_EN_SLUGS` in `app/(es)/es/herramientas/[slug]/page.tsx`
4. **Stop and wait for user review**
5. On approval: update Notion row (Spanish Status → Live, Spanish Route populated)
6. Move to next tool

---

## Translation Scope (per JSON file)

Full translation of all fields:

| Field | Translate? |
|-------|-----------|
| `slug` | Yes — use ES slug |
| `title`, `metaTitle`, `metaDescription` | Yes |
| `description`, `disclaimer` | Yes |
| `steps[].question` | Yes |
| `steps[].options[].label` | Yes |
| `steps[].options[].value` | No — values are internal keys |
| `supportingContent[].heading` | Yes |
| `supportingContent[].content` | Yes |
| `supportingContent[].tips[]` | Yes |
| `faq[].question`, `faq[].answer` | Yes |
| `relatedTools`, `relatedGuides`, `relatedAccidents` | No — stay as EN slugs |

---

## Config Changes (accumulated across all 6 tools)

### `i18n/config.ts` — add to `SLUG_MAP_ES`

```ts
'insurance-call-prep': 'preparacion-llamada-seguro',
'record-request': 'solicitud-registros',
'settlement-readiness': 'preparacion-acuerdo',
'state-next-steps': 'proximos-pasos-estado',
'statute-countdown': 'cuenta-regresiva-plazo',
// lost-wages-estimator already present
```

### `app/(es)/es/herramientas/[slug]/page.tsx` — add to `TOOL_EN_SLUGS`

```ts
'insurance-call-prep',
'lost-wages-estimator',
'record-request',
'settlement-readiness',
'state-next-steps',
'statute-countdown',
```

---

## Notion Updates (after each tool is approved)

- Set `Spanish Status` → `Live`
- Set `Spanish Route` → full URL, e.g. `https://accident-path.vercel.app/es/herramientas/preparacion-llamada-seguro`

---

## Translation Quality Notes

- Source: English JSON in `content/tools/{slug}.json`
- Reference: existing ES JSONs in `content/tools/es/` for tone and style consistency
- Tone: formal "usted" register (matching existing ES tools)
- Legal language: preserve all disclaimers, do not soften or omit
- Someone will review translations after implementation — accuracy over perfection
