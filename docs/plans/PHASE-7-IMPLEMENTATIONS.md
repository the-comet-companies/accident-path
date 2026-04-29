# Phase 7 — Spanish Implementation: Actual State

> **Purpose:** Authoritative record of what was actually built vs. what the plan specified. Use this alongside `PHASE-7-SPANISH-PLAN.md` when implementing DEV-33 through DEV-36.
>
> Last updated: April 29, 2026 — covers DEV-29, DEV-30, DEV-31, DEV-32

---

## Tier 1 Status: Complete

DEV-29, DEV-30, DEV-31, DEV-32 are all merged to `main`. The site is fully bilingual at:
- `/` — English home
- `/es/` — Spanish home
- `/es/buscar-ayuda` — Spanish intake wizard (all 9 steps, results, thank-you)

Vercel auto-deploys from `main`. Build: **93 static pages**, TypeScript clean.

---

## Architecture: What Was Actually Built

### Route Groups

```
app/
├── (en)/                   ← URL-transparent group for all English routes
│   ├── layout.tsx          ← <html lang="en">, EN header/footer/EmergencyBanner
│   ├── page.tsx            ← / (English home)
│   ├── accidents/
│   ├── guides/
│   ├── injuries/
│   ├── find-help/
│   ├── tools/
│   ├── states/
│   ├── api/intake/route.ts
│   └── ... (all other EN routes)
└── (es)/
    └── es/                 ← /es/* routes
        ├── layout.tsx      ← <html lang="es">, ES header/footer/EmergencyBanner
        ├── page.tsx        ← /es/ (Spanish home)
        └── buscar-ayuda/
            ├── page.tsx
            ├── results/page.tsx
            └── thank-you/page.tsx
```

**Why route groups (not in the original plan):** The plan originally assumed a shared `app/layout.tsx` with locale detection. That approach would have made all 89 static English pages dynamic (any use of `headers()` in the root layout forces dynamic rendering). Route groups give each language its own `<html lang>` attribute without touching the English routes at all.

### Middleware

`proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts` and `export function middleware` → `export function proxy`).

- Matches only `/` via `config.matcher: ['/']`
- Reads `NEXT_LOCALE` cookie first, then `Accept-Language` header
- Redirects Spanish-preferring users from `/` → `/es/`
- All other paths (including `/api/*`) pass through untouched

### Dictionary System

```
i18n/
├── en.json          ← source of truth for Dictionary type
├── es.json          ← must satisfy Dictionary (enforced at build time)
├── config.ts        ← SLUG_MAP_ES, SLUG_MAP_EN, NAV_* arrays, NAV_LABELS
└── dictionaries.ts  ← getDictionary(locale) + Dictionary type + parity check
```

`Dictionary = typeof enStrings` — the type is inferred from en.json. Any key missing from es.json is a TypeScript error at build time (`void (esStrings satisfies Dictionary)`).

**Dict namespaces:** `cta`, `trust`, `emergency`, `phone`, `footer`, `tools`, `findHelp`, `intake`

**The `intake` namespace** was significantly expanded in DEV-32 (not in DEV-29 original):
- Added all step descriptions, field labels, button labels, placeholders
- Added option label arrays: `accidentTypeLabels` (9), `injuryLabels` (8), `medicalLabels/Descriptions` (5 each), `insuranceLabels/Descriptions` (3 each), `workImpactLabels/Descriptions` (4 each)

### i18n/config.ts Exports

```ts
LOCALES: ['en', 'es']
DEFAULT_LOCALE: 'en'
SLUG_MAP_ES: Record<string, string>   // EN slug → ES slug (24 entries)
SLUG_MAP_EN: Record<string, string>   // ES slug → EN slug (auto-reversed)
NAV_ACCIDENT_TYPES: Record<Locale, NavItem[]>
NAV_SIMPLE_LINKS: Record<Locale, NavItem[]>
NAV_FIND_HELP: Record<Locale, NavItem>
NAV_LABELS: Record<Locale, { accidentTypes, stateGuides, viewAllAccidents, viewAllStates, getHelpNow }>
type Locale = 'en' | 'es'
```

---

## Files Changed Per Task

### DEV-29 — i18n Infrastructure

| File | Action | Notes |
|------|--------|-------|
| `i18n/config.ts` | Created | SLUG_MAP_ES, SLUG_MAP_EN, 5 nav arrays, NAV_LABELS, Locale type |
| `i18n/en.json` | Created | ~150 keys, expanded further in DEV-32 |
| `i18n/es.json` | Created | Mirrors en.json, Spanish values |
| `i18n/dictionaries.ts` | Created | getDictionary(), Dictionary type, parity check |
| `proxy.ts` | Created | Root-only locale redirect; Next.js 16 naming |

### DEV-30 — Locale-Aware Layout Components

| File | Action | Notes |
|------|--------|-------|
| `components/layout/LanguageToggle.tsx` | Created | `'use client'`; `variant="light"\|"dark"`; SLUG_MAP path translation; sets NEXT_LOCALE cookie |
| `components/layout/Header.tsx` | Modified | `locale` prop (default `'en'`); nav from `i18n/config`; `whitespace-nowrap` on all nav items; `px-2.5`/`gap-0.5` to fit longer Spanish labels; logo href locale-aware |
| `components/layout/MobileNav.tsx` | Modified | `locale` prop; Find Help separated for amber styling; LanguageToggle in drawer |
| `components/layout/Footer.tsx` | Modified | `locale` + `dict` props; disclaimer text from dict |
| `components/ui/EmergencyBanner.tsx` | Modified | `locale?: 'en' \| 'es'` prop; Spanish text: "¿En peligro? Llame al 911." |

**Deviation from plan:** The plan said "add `locale` prop to Header." The actual implementation also required `whitespace-nowrap` on all nav items because Spanish labels ("Tipos de Accidentes", "Qué Hacer Después", "Guías por Estado") are longer than English and wrapped in the 64px header. This was caught and fixed post-implementation.

### DEV-31 — Route Group Restructure + Spanish Home

| File | Action | Notes |
|------|--------|-------|
| `app/(en)/layout.tsx` | Created (was `app/layout.tsx`) | `<html lang="en">`; `import "../globals.css"` |
| `app/(en)/page.tsx` | Moved + modified | Added `alternates.languages` hreflang (overrides `buildMetaTags()` canonical) |
| `app/(en)/{all routes}/` | Moved | 14 directories moved from `app/` to `app/(en)/`; `git mv` failed on Windows (VS Code file locks) — used PowerShell `Move-Item` + `git add -A` |
| `app/(es)/es/layout.tsx` | Created | `<html lang="es">`; `other: { google: 'notranslate' }`; hreflang; `import "../../globals.css"` |
| `app/(es)/es/page.tsx` | Created | Full Spanish home page; 7 sections; Spanish accident/tool/guide data; `/es/*` hrefs |

**Deviation from plan:** `buildMetaTags()` sets `alternates: { canonical: url }` which in Next.js metadata merging **replaces** the layout's `alternates` entirely (including `languages`). English home page required explicit `alternates.languages` override after spreading `buildMetaTags()` result. Not in the original plan.

**Deviation from plan:** Route group restructure was not in the original DEV-31 spec (it was added to the plan before implementation). The original plan assumed a shared `app/layout.tsx`.

### DEV-32 — Spanish Intake Wizard

| File | Action | Notes |
|------|--------|-------|
| `i18n/en.json` + `es.json` | Modified | Added ~60 new intake keys (option arrays + step text) |
| `lib/intake.ts` | Modified | Added `strings?: Dictionary['intake']` to `StepProps` |
| `components/intake/IntakeWizard.tsx` | Modified | `strings?` prop; `usePathname` locale-aware redirect; **bug fix: strips `""` contact fields to `undefined` before POST** |
| `components/intake/ConsentCheckbox.tsx` | Modified | `tcpaText?: string` prop; defaults to full English TCPA |
| `components/intake/steps/StepAccidentType.tsx` | Modified | `ACCIDENT_TYPE_VALUES` (English) stored as values; `strings.accidentTypeLabels` displayed |
| `components/intake/steps/StepInjuries.tsx` | Modified | `INJURY_VALUES` (English) stored; `strings.injuryLabels` displayed |
| `components/intake/steps/StepMedical.tsx` | Modified | Separate `MEDICAL_VALUES`, `EN_LABELS`, `EN_DESCRIPTIONS` constants; `strings` prop |
| `components/intake/steps/StepInsurance.tsx` | Modified | `INSURANCE_VALUES` (English IDs); `strings` prop |
| `components/intake/steps/StepWorkImpact.tsx` | Modified | `WORK_IMPACT_VALUES` (English IDs); `strings` prop |
| `components/intake/steps/StepWhen.tsx` | Modified | `strings` prop; all text from strings with English fallbacks |
| `components/intake/steps/StepWhere.tsx` | Modified | `strings` prop; all text from strings with English fallbacks |
| `components/intake/steps/StepPoliceReport.tsx` | Modified | `strings` prop; `step6_yes/no` for Yes/No buttons |
| `components/intake/steps/StepContact.tsx` | Modified | `strings` prop; detects `locale` from `strings ? 'es' : 'en'` for privacy/terms link URLs |
| `app/(es)/es/buscar-ayuda/page.tsx` | Created | Server component; loads `getDictionary('es')`; passes `dict.intake` to `<IntakeWizard>` |
| `app/(es)/es/buscar-ayuda/results/page.tsx` | Created | `'use client'`; Spanish `URGENCY_CONFIG` from `import esStrings from '@/i18n/es.json'`; reads localStorage; all Spanish UI text |
| `app/(es)/es/buscar-ayuda/thank-you/page.tsx` | Created | Static server page; all Spanish text; links to `/es/buscar-ayuda/results` |

**Deviation from plan:** The plan called for `app/(es)/es/buscar-ayuda/results/page.tsx` to be a **server component** passing `strings` to a child client component. The actual implementation is a standalone `'use client'` page (matching the English results page pattern) that imports `es.json` directly. Refactoring the English results page into a wrapper was considered unnecessary complexity for DEV-32.

**Bug discovered and fixed post-DEV-32 (commit 2779f98):** `z.string().email().optional()` in `IntakeFormSchema` rejects `""` — only accepts `undefined` or a valid email format. If a user touched the email input and cleared it, `data.email === ""` caused Zod validation to return 400, the wizard swallowed the error, and the user was redirected to thank-you with nothing saved. Fix: strip empty optional contact fields to `undefined` before POST.

---

## Intake Form Value Contract

**Critical invariant — do not change this:**

The values stored in `IntakeForm` state and submitted to the API are always English identifiers, regardless of display language. This is required because:
1. `IntakeFormSchema` uses Zod enums with English values
2. `computeUrgency`, `suggestLawyerType`, `suggestResources` in `lib/intake.ts` match against English strings
3. Supabase `intake_sessions` table stores English values

| Step | Field | Values stored |
|------|-------|---------------|
| 1 | `accidentType` | `"Car Accident"`, `"Truck Accident"`, `"Motorcycle Crash"`, `"Slip & Fall"`, `"Workplace Injury"`, `"Bicycle Accident"`, `"Pedestrian Accident"`, `"Dog Bite"`, `"Other"` |
| 4 | `injuries` | `"Head / Brain"`, `"Neck / Back"`, `"Broken Bones"`, `"Soft Tissue (whiplash, sprains)"`, `"Burns"`, `"Internal Injuries"`, `"Emotional / Psychological"`, `"None Visible Yet"` |
| 5 | `medicalTreatment` | `'none' \| 'er' \| 'doctor' \| 'ongoing' \| 'surgery'` |
| 7 | `insuranceStatus` | `'has_insurance' \| 'no_insurance' \| 'unsure'` |
| 8 | `workImpact` | `'none' \| 'missed_days' \| 'reduced_capacity' \| 'cant_work'` |

Spanish UI displays translated labels but the `onChange` callbacks always receive the English value from the parallel `*_VALUES` constant array.

---

## Patterns for DEV-33 Onwards

### Adding a new Spanish content page (accidents / guides / injuries)

1. **CMS loader** — `lib/cms.ts` gets a `locale?: 'en' | 'es'` param. When `locale === 'es'`, read from `content/{type}/es/[slug].json`. Do NOT create `lib/cms-es.ts`.

2. **`generateStaticParams`** — return Spanish slugs from `SLUG_MAP_ES` values.

3. **hreflang** — page-level `metadata.alternates.languages` overrides layout's `alternates`. Always set explicitly:
   ```ts
   alternates: {
     canonical: `/es/accidentes/${slug}`,
     languages: {
       en: `/accidents/${SLUG_MAP_EN[slug]}`,
       es: `/es/accidentes/${slug}`,
       'x-default': `/accidents/${SLUG_MAP_EN[slug]}`,
     },
   }
   ```

4. **`notranslate`** — every Spanish page needs `other: { google: 'notranslate' }` in metadata.

5. **CTA link** — always points to `/es/buscar-ayuda`, not `/find-help`.

6. **Related sidebar links** — must point to `/es/*` URLs.

7. **Breadcrumb** — `variant="dark"` on pages with `bg-primary-900` hero.

8. **JSON content files** — live at `content/{type}/es/[spanish-slug].json`. Every file needs `"translationStatus": "needs-review"`.

### `buildMetaTags()` and hreflang

`buildMetaTags()` sets `alternates: { canonical: url }` which **replaces** any layout-level `alternates`. If you need `alternates.languages` on a page that uses `buildMetaTags()`, spread the result and re-add:

```ts
export const metadata: Metadata = {
  ...buildMetaTags({ title: '...', description: '...', canonical: '/es/...' }),
  alternates: {
    canonical: 'https://accidentpath.com/es/...',
    languages: { en: '/...', es: '/es/...', 'x-default': '/...' },
  },
}
```

### Client components that need translated strings

Client components (`IntakeWizard`, `ToolEngine`, `ToolResults`, etc.) cannot call `getDictionary()`. The pattern:

```ts
// Server page (app/(es)/es/buscar-ayuda/page.tsx)
export default async function Page() {
  const dict = await getDictionary('es')
  return <IntakeWizard strings={dict.intake} />
}

// Client component
interface Props {
  strings?: Dictionary['intake']
}
export function IntakeWizard({ strings }: Props) {
  // use strings.someKey ?? 'English fallback'
}
```

### globals.css import depth

The `globals.css` import path depends on nesting level:
- `app/(en)/layout.tsx` → `import "../globals.css"` (one level up)
- `app/(es)/es/layout.tsx` → `import "../../globals.css"` (two levels up, through `(es)/es/`)

---

## DEV-33 — Spanish Accident Pages (Complete)

| File | Action | Notes |
|------|--------|-------|
| `lib/cms.ts` | Modified | `getAccident(slug, locale='en')` + `getAllAccidents(locale='en')` — backward-compatible |
| `app/(es)/es/accidentes/[slug]/page.tsx` | Created | Spanish detail page; `generateStaticParams` from `SLUG_MAP_ES`; translated headings/urgency labels; hreflang; `notranslate` |
| `app/(es)/es/accidentes/page.tsx` | Created | Spanish index; 3-column grid; `cms.getAllAccidents('es')` |
| `content/accidents/es/*.json` | Created | 13 files — Mexican Spanish; Zod-validated; `translationStatus: "needs-review"` |

**Slug convention for Spanish JSON files:** `likelyInjuries[].slug`, `relatedAccidents`, `relatedInjuries`, `relatedGuides`, `relatedTools` all use Spanish slugs. The page renders hrefs directly without re-translating.

**Post-generation validation pattern:** After agents write JSON files, validate with inline Zod before committing — 6 of 13 files had `metaTitle`/`metaDescription` over the length limit (Zod parse failure → `notFound()` → 404). Always check ≤70 chars metaTitle and 120–160 chars metaDescription.

---

## Remaining Tasks (Tier 2)

| Task | Routes to create | Content files to create |
|------|-----------------|------------------------|
| DEV-34 | `app/(es)/es/guias/[slug]/page.tsx` | `content/guides/es/*.json` (14 files) |
| DEV-34B | `app/(es)/es/lesiones/[slug]/page.tsx` | `content/injuries/es/*.json` (7 files) |
| DEV-35 | `app/(es)/es/herramientas/[slug]/page.tsx` | Update `ToolEngine.tsx` + `ToolResults.tsx` with `strings` prop |
| DEV-37 | `app/(es)/es/estados/[state]/[city]/page.tsx` + `[state]/page.tsx` | `content/states/es/*.json` (18 files) |
| DEV-36 | Extend `app/sitemap.ts` | Add `lib/hreflang.ts` helper |

For full specs of each task, see `docs/plans/PHASE-7-SPANISH-PLAN.md`.

---

## Known Deferred Items

- **State rules data** (`lib/state-rules.ts`) — deadlines and fault rule summaries are English-only. The Spanish results page (`/es/buscar-ayuda/results`) shows these in English for now. Full translation is out of scope for current phase.
- **`suggestLawyerType()`** — returns English attorney type strings. The Spanish results page displays these English strings under a Spanish heading. Acceptable for MVP.
- **`suggestResources()`** — returns English guide/tool hrefs and labels. Links work (they point to English content pages). Will auto-update when DEV-33/34 add Spanish slugs.
- **Privacy/Terms pages** — `/es/privacidad` and `/es/terminos` don't exist yet. `StepContact` links to the English `/privacy` and `/terms` for now.
- **Spanish tool content** — `ToolEngine` question text is English-only. DEV-35 will add `strings` prop for UI chrome; full question translation is a separate content task.
