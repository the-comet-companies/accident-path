# Dev Phase 7 — Spanish Language Implementation

> **For agentic workers:** Use superpowers:subagent-driven-development to implement task-by-task.

**Goal:** Full bilingual site (EN + ES) with Google-indexable Spanish pages, language toggle in header + footer, and a fully translated intake wizard.

**Architecture:** English stays at existing root routes — no breaking changes. Spanish pages live in a parallel `app/es/` tree. Layouts pass `locale` as a prop to Header and Footer (which contain all nav links and footer text). Client components receive translated strings as props from their parent server page, not from a context or async loader.

**Tech stack:** Next.js 14 App Router, TypeScript strict, Tailwind v4, JSON content files, `cookies()` from `next/headers` for locale cookie in middleware.

**Locked decision — intake form values are always English IDs:** `accidentType`, `injuries`, and all other intake form enum values are stored and submitted as English slugs/IDs (e.g. `"car"`, not `"auto"` or `"Accidente de Auto"`). The UI displays localized labels, but the underlying value passed to state is always the English ID. This ensures the results page, Supabase submissions, and output generators work correctly regardless of locale.

---

## Architecture Decision (Locked)

**English:** `/accidents/car`, `/guides/after-car-accident`, `/find-help` — unchanged  
**Spanish:** `/es/accidentes/auto`, `/es/guias/despues-accidente-auto`, `/es/buscar-ayuda`  
**Routing:** `app/(es)/es/` directory tree; `<html lang="es">` set in `app/(es)/es/layout.tsx`; all English routes live in `app/(en)/`; route groups are URL-transparent  
**Middleware:** Detects browser language on `/` only → redirects to `/es/` for Spanish users  
**Toggle:** Cookie-based (`NEXT_LOCALE=es|en`), shown in Header + Footer

### How locale flows through the app

Route groups `(en)` and `(es)` give each language its own root HTML shell — required so Spanish pages get `<html lang="es">` in SSR without making all 89 static pages dynamic (using `headers()` in `app/layout.tsx` would do that).

```
app/(en)/layout.tsx         → <html lang="en"> + <Header locale="en" /> <Footer locale="en" />
app/(es)/es/layout.tsx      → <html lang="es"> + <Header locale="es" /> <Footer locale="es" />

app/(es)/es/buscar-ayuda/page.tsx (server) → loads ES strings → <IntakeWizard strings={esStrings} />
app/(es)/es/herramientas/[slug]/page.tsx (server) → loads ES strings → <ToolEngine strings={esStrings} />
```

**Why not React context for locale:** Header is `'use client'` — it cannot consume a React server context. The simplest correct pattern is passing `locale` as a prop from the layout. Client components that need translated strings receive them as props from their parent server page component.

### URL slug mapping (English → Spanish path segment)

| English slug | Spanish path segment |
|---|---|
| `car` | `auto` |
| `truck` | `camion` |
| `motorcycle` | `motocicleta` |
| `slip-and-fall` | `caida` |
| `workplace` | `trabajo` |
| `bicycle` | `bicicleta` |
| `pedestrian` | `peaton` |
| `dog-bite` | `mordida-perro` |
| `construction` | `construccion` |
| `premises` | `propiedad` |
| `product` | `producto` |
| `wrongful-death` | `muerte-injusta` |
| `uber-lyft` | `uber-lyft` |
| `after-car-accident` | `despues-accidente-auto` |
| `after-truck-accident` | `despues-accidente-camion` |
| `evidence-checklist` | `lista-evidencia` |
| `accident-case-quiz` | `evaluacion-caso` |
| `broken-bones` | `huesos-rotos` |
| `whiplash` | `latigazo` |
| `traumatic-brain` | `traumatismo-craneal` |
| `spinal` | `columna` |
| `soft-tissue` | `tejido-blando` |
| `burns` | `quemaduras` |
| `internal` | `lesiones-internas` |

---

## Flaw Review (completed before implementation)

These gaps were found by reading the actual source files before writing tasks:

**Gap 1 — Header/Footer nav is fully hardcoded English (critical)**  
`Header.tsx` and `Footer.tsx` have ALL nav labels AND hrefs hardcoded as English string constants (`accidentTypes`, `simpleLinks`, `accidentLinks`, `resourceLinks`, etc.). The plan said "add LanguageToggle" as if that's all DEV-30 needs. It isn't. For Spanish pages, the nav labels AND the hrefs both need to change (e.g. `Car Accidents` → `Accidentes de Auto`, `/accidents/car` → `/es/accidentes/auto`). Also, `Footer.tsx` has 3 paragraphs of hardcoded English disclaimer text that need Spanish equivalents.  
**Fix:** DEV-30 now includes adding a `locale` prop to both Header and Footer, and defining locale-aware nav data in `i18n/config.ts`. The `app/es/layout.tsx` passes `locale="es"` to both.

**Gap 2 — Client components cannot call `getDictionary()` (critical)**  
`IntakeWizard.tsx` and `ToolEngine.tsx` are `'use client'` components. `getDictionary(locale)` is an async server-only function. The plan said to add a `locale` prop and call the dict loader inside them — this doesn't work. Client components must receive translated strings as plain props from their parent server page.  
**Fix:** Each Spanish page server component (`app/es/buscar-ayuda/page.tsx`, `app/es/herramientas/[slug]/page.tsx`) loads the dict and passes the relevant string subset as a `strings` prop.

**Gap 3 — LanguageToggle needs reverse slug map (not just forward)**  
DEV-30's toggle must compute the equivalent URL in the other locale from the current path. Switching EN→ES uses `SLUG_MAP_ES` (English slug → Spanish slug). Switching ES→EN needs `SLUG_MAP_EN` (Spanish slug → English slug). Only `SLUG_MAP_ES` was defined in DEV-29.  
**Fix:** DEV-29 also exports `SLUG_MAP_EN` (the reverse of `SLUG_MAP_ES`).

**Gap 4 — Spanish injury pages missing entirely**  
`app/injuries/[slug]` exists in English with 7 injury types. There is no task for `/es/lesiones/[slug]`. Injury pages are major content and link to accident pages — they need Spanish counterparts.  
**Fix:** Added DEV-34B for Spanish injury pages (between guides and tools).

**Gap 5 — `[NOMBRE DE MARCA]` placeholder in Spanish disclaimer**  
The Spanish disclaimer text from the strategy doc contains `[NOMBRE DE MARCA]`. This must be replaced with `AccidentPath` before any Spanish content is shipped.  
**Fix:** All Spanish disclaimers use `AccidentPath` explicitly.

**Gap 6 — DEV-36 had conflicting sitemap guidance**  
Scope section said create `app/sitemap-es.xml/route.ts`. Execution prompt said extend `app/sitemap.ts`. These conflict.  
**Fix:** Extend `app/sitemap.ts` only (one sitemap to maintain, standard Next.js pattern).

**Gap 7 — `notranslate` meta tag missing on Spanish pages**  
Without this, Chrome will offer to translate our intentional Spanish content into English for English-speaking visitors, which conflicts with our toggle UX.  
**Fix:** Added to DEV-31: `app/es/layout.tsx` includes `<meta name="google" content="notranslate" />`.

**Gap 8 — TypeScript dict key parity not enforced**  
If a developer adds a string to `en.json` and forgets `es.json`, the Spanish page silently shows English text — no build error.  
**Fix:** DEV-29 includes a `Dictionary` TypeScript type inferred from `en.json` that `es.json` must satisfy.

---

## Phase 7A — Foundation

### DEV-29: i18n Infrastructure + Middleware

**Execution Prompt:**
Read `docs/strategy/SPANISH-STRATEGY.md` §Technical Implementation and the URL slug mapping table in this plan.

- `i18n/config.ts` — exports `LOCALES`, `DEFAULT_LOCALE`, `SLUG_MAP_ES` (EN slug → ES slug), `SLUG_MAP_EN` (ES slug → EN slug, the reverse), and locale-aware nav arrays used by Header and Footer (both labels and hrefs per locale)
- `i18n/en.json` — all non-nav UI strings: footer disclaimer paragraphs, CTA button labels, trust badge text, emergency text, intake step questions + options + validation messages, TCPA consent, tool engine button labels (~150 keys)
- `i18n/es.json` — same keys, Spanish values; must satisfy the `Dictionary` TypeScript type inferred from `en.json`
- `i18n/dictionaries.ts` — `getDictionary(locale: 'en' | 'es'): Promise<Dictionary>` async loader; reads JSON files from filesystem (server-only)
- `middleware.ts` — locale detection on `/` only: check `NEXT_LOCALE` cookie first → `Accept-Language` header second → if Spanish detected redirect to `/es/`; all other paths pass through unchanged

**Key strings for es.json (complete list):**
```json
{
  "cta": {
    "getHelpNow": "Obtenga Ayuda Ahora",
    "startFreeCheck": "Comience Su Evaluación Gratis",
    "findHelp": "Buscar Ayuda",
    "seeMyResults": "Ver Mis Resultados",
    "calculating": "Calculando…",
    "next": "Siguiente",
    "back": "Atrás",
    "startOver": "Comenzar de Nuevo",
    "printSave": "Imprimir / Guardar PDF",
    "getFreGuidance": "Obtenga Orientación Gratuita"
  },
  "trust": {
    "badge1": "Certificado por el Colegio de Abogados",
    "badge2": "Soporte 24/7",
    "badge3": "Servicio Gratuito",
    "badge4": "Sin Compromiso",
    "contentReview": "Revisión de Contenido en Progreso",
    "infoSecure": "Su información está segura",
    "freeConsult": "Consulta gratuita — sin compromiso"
  },
  "emergency": {
    "danger": "¿En peligro? Llame al",
    "seekCare": "Busque atención médica inmediata para lesiones."
  },
  "phone": {
    "callUs": "Llámenos — Hablamos Español"
  },
  "footer": {
    "accidentTypes": "Tipos de Accidentes",
    "resources": "Recursos",
    "company": "Empresa",
    "emergency": "¿Emergencia?",
    "call911": "Llame al 911",
    "copyright": "Todos los derechos reservados.",
    "doNotSell": "No Vender Mi Información",
    "disclaimer1": "AccidentPath no es un bufete de abogados y no proporciona asesoramiento legal. La información proporcionada es solo para fines educativos. Al usar este sitio, usted reconoce que no se forma ninguna relación abogado-cliente. Si está en peligro inmediato, llame al 911. Para emergencias médicas, busque atención de inmediato.",
    "disclaimer2": "AccidentPath conecta a los consumidores con abogados en nuestra red. Los abogados en nuestra red pueden pagar una tarifa por servicios de marketing. Esto no afecta la calidad del servicio que recibe. AccidentPath no respalda ni garantiza los servicios de ningún abogado. La disponibilidad varía según el estado y el tipo de caso.",
    "disclaimer3": "Cada caso es diferente. Consulte a un abogado con licencia para obtener asesoramiento específico a su situación. Los resultados pueden variar. Los resultados anteriores no garantizan resultados futuros."
  },
  "tools": {
    "yourResults": "Sus Resultados",
    "disclaimer": "Esta información es solo para fines educativos y no constituye asesoramiento legal.",
    "priority": {
      "critical": "Crítico",
      "important": "Importante",
      "helpful": "Útil"
    }
  },
  "findHelp": {
    "heroLabel": "Orientación Gratuita",
    "heroHeadline": "Encontremos Sus Próximos Pasos",
    "heroDescription": "Responda 9 preguntas rápidas y le mostraremos qué hacer después de su accidente.",
    "heroCta": "Sin cuenta requerida",
    "urgency": {
      "highLabel": "Alta Prioridad",
      "highMessage": "Basado en sus respuestas, su situación puede requerir atención inmediata. Los plazos legales pueden estar corriendo.",
      "moderateLabel": "Prioridad Moderada",
      "moderateMessage": "Su situación merece atención oportuna. Hable con un abogado pronto para proteger sus derechos.",
      "standardLabel": "Prioridad Estándar",
      "standardMessage": "Sus próximos pasos son claros. Continúe con las siguientes recomendaciones a su propio ritmo."
    },
    "results": {
      "heading": "Sus Resultados Personalizados",
      "subheading": "Esto Es Lo Que Encontramos",
      "noResults": "No se encontraron resultados. Por favor intente de nuevo.",
      "stateInfo": "Información Específica de su Estado",
      "filingDeadline": "Plazo para Presentar Reclamo de Lesiones Personales",
      "reportingDeadlines": "Plazos de Reporte Importantes",
      "faultRule": "Regla de Culpabilidad",
      "lawyerType": "Tipo de Abogado que Puede Ayudar",
      "resources": "Recursos Recomendados",
      "exploreTools": "Explorar Herramientas Gratuitas",
      "startOver": "Comenzar de Nuevo"
    }
  },
  "intake": {
    "step1_question": "¿Qué tipo de accidente tuvo?",
    "step2_question": "¿Cuándo ocurrió el accidente?",
    "step3_question": "¿En qué ciudad y estado?",
    "step4_question": "¿Qué lesiones sufrió?",
    "step5_question": "¿Ha visitado un doctor?",
    "step5_yes": "Sí",
    "step5_no": "No",
    "step6_question": "¿Se hizo un reporte policial?",
    "step6_yes": "Sí",
    "step6_no": "No",
    "step7_question": "¿Tiene seguro?",
    "step7_yes": "Sí",
    "step7_no": "No",
    "step8_question": "¿Esto ha afectado su trabajo?",
    "step8_yes": "Sí",
    "step8_no": "No",
    "step9_question": "¿Cómo podemos contactarlo?",
    "tcpaConsent": "Al enviar este formulario, acepto recibir comunicaciones por teléfono, mensaje de texto y correo electrónico sobre mi consulta. Entiendo que este servicio es gratuito y no estoy obligado a contratar a ningún abogado.",
    "disclaimer": "AccidentPath no es un bufete de abogados y no proporciona asesoramiento legal. La información proporcionada es solo para fines educativos.",
    "required": "Este campo es obligatorio",
    "submit": "Enviar",
    "resultsHeading": "Sus Resultados"
  }
}
```

**Locale-aware nav data in `i18n/config.ts`:**
```ts
export const NAV_ACCIDENT_TYPES = {
  en: [
    { label: 'Car Accidents', href: '/accidents/car' },
    { label: 'Truck Accidents', href: '/accidents/truck' },
    { label: 'Motorcycle Accidents', href: '/accidents/motorcycle' },
    { label: 'Uber / Lyft Accidents', href: '/accidents/uber-lyft' },
    { label: 'Pedestrian Accidents', href: '/accidents/pedestrian' },
    { label: 'Bicycle Accidents', href: '/accidents/bicycle' },
    { label: 'Slip & Fall', href: '/accidents/slip-and-fall' },
    { label: 'Dog Bites', href: '/accidents/dog-bite' },
    { label: 'Construction Injuries', href: '/accidents/construction' },
    { label: 'Workplace Injuries', href: '/accidents/workplace' },
    { label: 'Wrongful Death', href: '/accidents/wrongful-death' },
    { label: 'Premises Liability', href: '/accidents/premises' },
    { label: 'Product Liability', href: '/accidents/product' },
  ],
  es: [
    { label: 'Accidentes de Auto', href: '/es/accidentes/auto' },
    { label: 'Accidentes de Camión', href: '/es/accidentes/camion' },
    { label: 'Accidentes de Motocicleta', href: '/es/accidentes/motocicleta' },
    { label: 'Accidentes de Uber / Lyft', href: '/es/accidentes/uber-lyft' },
    { label: 'Accidentes de Peatón', href: '/es/accidentes/peaton' },
    { label: 'Accidentes de Bicicleta', href: '/es/accidentes/bicicleta' },
    { label: 'Caídas', href: '/es/accidentes/caida' },
    { label: 'Mordidas de Perro', href: '/es/accidentes/mordida-perro' },
    { label: 'Lesiones de Construcción', href: '/es/accidentes/construccion' },
    { label: 'Lesiones en el Trabajo', href: '/es/accidentes/trabajo' },
    { label: 'Muerte Injusta', href: '/es/accidentes/muerte-injusta' },
    { label: 'Responsabilidad de Propiedad', href: '/es/accidentes/propiedad' },
    { label: 'Responsabilidad del Producto', href: '/es/accidentes/producto' },
  ],
}

export const NAV_SIMPLE_LINKS = {
  en: [
    { label: 'Injuries', href: '/injuries' },
    { label: 'What To Do Next', href: '/guides' },
    { label: 'Tools', href: '/tools' },
    { label: 'About', href: '/about' },
  ],
  es: [
    { label: 'Lesiones', href: '/es/lesiones' },
    { label: 'Qué Hacer Después', href: '/es/guias' },
    { label: 'Herramientas', href: '/es/herramientas' },
    { label: 'Acerca de', href: '/about' },
  ],
}

export const NAV_FIND_HELP = {
  en: { label: 'Find Help', href: '/find-help' },
  es: { label: 'Buscar Ayuda', href: '/es/buscar-ayuda' },
}

export const FOOTER_ACCIDENT_LINKS = {
  en: [
    { label: 'Car Accidents', href: '/accidents/car' },
    { label: 'Truck Accidents', href: '/accidents/truck' },
    { label: 'Motorcycle Accidents', href: '/accidents/motorcycle' },
    { label: 'Pedestrian Accidents', href: '/accidents/pedestrian' },
    { label: 'Slip & Fall', href: '/accidents/slip-and-fall' },
    { label: 'Workplace Injuries', href: '/accidents/workplace' },
    { label: 'View All Accident Types', href: '/accidents' },
  ],
  es: [
    { label: 'Accidentes de Auto', href: '/es/accidentes/auto' },
    { label: 'Accidentes de Camión', href: '/es/accidentes/camion' },
    { label: 'Accidentes de Motocicleta', href: '/es/accidentes/motocicleta' },
    { label: 'Accidentes de Peatón', href: '/es/accidentes/peaton' },
    { label: 'Caídas', href: '/es/accidentes/caida' },
    { label: 'Lesiones en el Trabajo', href: '/es/accidentes/trabajo' },
    { label: 'Ver Todos los Tipos', href: '/es/accidentes' },
  ],
}

export const FOOTER_RESOURCE_LINKS = {
  en: [
    { label: 'Accident Guides', href: '/guides' },
    { label: 'Injury Types', href: '/injuries' },
    { label: 'Free Tools', href: '/tools' },
    { label: 'California Guide', href: '/states/california' },
    { label: 'Arizona Guide', href: '/states/arizona' },
    { label: 'Find an Attorney', href: '/find-help' },
  ],
  es: [
    { label: 'Guías de Accidentes', href: '/es/guias' },
    { label: 'Tipos de Lesiones', href: '/es/lesiones' },
    { label: 'Herramientas Gratuitas', href: '/es/herramientas' },
    { label: 'Guía de California', href: '/states/california' },
    { label: 'Guía de Arizona', href: '/states/arizona' },
    { label: 'Buscar un Abogado', href: '/es/buscar-ayuda' },
  ],
}
```

**Manual verification:**
- [ ] `i18n/config.ts` exports `LOCALES`, `DEFAULT_LOCALE`, `SLUG_MAP_ES`, `SLUG_MAP_EN`, and all nav arrays
- [ ] `es.json` has every key that `en.json` has (TypeScript type enforcement catches mismatches at build time)
- [ ] `getDictionary('en')` returns English strings, `getDictionary('es')` returns Spanish
- [ ] Visit `/` with `Accept-Language: es` header → redirects to `/es/`
- [ ] Visit `/es/accidentes/auto` → no redirect, passes through
- [ ] `NEXT_LOCALE=en` cookie → no redirect to Spanish

---

### DEV-30: Language Toggle + Locale-Aware Header + Footer

**Execution Prompt:**
Read `components/layout/Header.tsx` and `components/layout/Footer.tsx` in full. Read `i18n/config.ts` (from DEV-29).

This task has two parts: (A) make Header and Footer locale-aware, (B) add the toggle.

**Part A — Header and Footer locale prop:**
- `components/layout/Header.tsx` — add `locale: 'en' | 'es'` prop (default `'en'`); replace hardcoded `accidentTypes`, `stateGuides`, `simpleLinks` constants with `NAV_ACCIDENT_TYPES[locale]`, `NAV_SIMPLE_LINKS[locale]`, `NAV_FIND_HELP[locale]` from `i18n/config.ts`; "Accident Types" / "Tipos de Accidentes" section heading also locale-driven; "Get Help Now" / "Obtenga Ayuda Ahora" CTA locale-driven; "View all accident types →" / "Ver todos →" locale-driven
- `components/layout/Footer.tsx` — add `locale: 'en' | 'es'` prop (default `'en'`); replace all hardcoded link arrays with `FOOTER_ACCIDENT_LINKS[locale]`, `FOOTER_RESOURCE_LINKS[locale]` from config; replace 3 hardcoded English disclaimer paragraphs with `dict.footer.disclaimer1/2/3` (dict passed as prop from layout); replace bottom bar emergency text and copyright with locale-aware strings from dict
- `app/layout.tsx` — pass `locale="en"` to `<Header>` and `<Footer>`; pass `dict` to `<Footer>`
- `app/es/layout.tsx` — pass `locale="es"` to `<Header>` and `<Footer>`; pass Spanish `dict` to `<Footer>`

**Part B — Language toggle:**
- `components/layout/LanguageToggle.tsx` — `'use client'`; reads `usePathname()`; computes equivalent URL using `SLUG_MAP_ES` (EN→ES) and `SLUG_MAP_EN` (ES→EN); on click: sets `NEXT_LOCALE` cookie with 1-year expiry, calls `router.push(equivalentUrl)`; falls back to `/es/` or `/` if no slug match; renders `EN | ES` with active locale visually distinct (font-semibold, text-primary-600)
- `components/layout/Header.tsx` — add `<LanguageToggle />` to desktop nav (between last nav item and CTA button) and inside mobile nav
- `components/layout/Footer.tsx` — add `<LanguageToggle />` to bottom bar

**Manual verification:**
- [ ] `/accidents/car` — nav shows English labels, hrefs are English paths
- [ ] `/es/accidentes/auto` — nav shows Spanish labels, hrefs are `/es/` paths
- [ ] Footer disclaimer paragraphs are in Spanish on `/es/` pages
- [ ] Toggle visible in desktop header, mobile nav, and footer
- [ ] Click ES on `/accidents/car` → goes to `/es/accidentes/auto`
- [ ] Click EN on `/es/accidentes/auto` → goes to `/accidents/car`
- [ ] Click ES on home `/` → goes to `/es/`
- [ ] Active locale is bold/colored
- [ ] Refresh after toggle → cookie persists, stays in selected locale
- [ ] `npm run build` passes with no TypeScript errors

---

### DEV-31: Route Group Restructure + Spanish Home Page

**Execution Prompt:**
Read `app/layout.tsx`, `app/page.tsx`, and `app/es/layout.tsx` as reference. Read `i18n/dictionaries.ts`.

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

- `app/(es)/es/layout.tsx` — replace the DEV-30 stub; full Spanish root layout: `async` server component; calls `getDictionary('es')`; renders `<html lang="es" className={...font variables...}>`; `<body>`; `<EmergencyBanner>`; `<SchemaOrg>`; Spanish `<Header locale="es">`; `<MobileNav locale="es">`; `<Footer locale="es" dict={dict}>`; `<meta name="google" content="notranslate" />`; hreflang tags: `hreflang="en" href="/"`, `hreflang="es" href="/es/"`, `hreflang="x-default" href="/"`; import path: `import "../../globals.css"` (two levels up from `app/(es)/es/`)
- `app/(es)/es/page.tsx` — mirrors `app/(en)/page.tsx` structure (hero, trust strip, accident type grid, tools preview, CTAs); all UI strings from `dict`; Spanish `generateMetadata` returning title `"AccidentPath | Guía de Accidentes en California"` and description `"Obtenga orientación clara después de un accidente. Conéctese con abogados calificados. Servicio gratuito, sin compromiso."`
- `app/(en)/layout.tsx` — add hreflang alternates to `generateMetadata`: `'en': '/'`, `'es': '/es/'`, `'x-default': '/'`

**Manual verification:**
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `/` still loads (English routes not broken by move to `(en)`)
- [ ] `/es/` loads without errors
- [ ] `<html lang="es">` in `/es/` page source
- [ ] `<meta name="google" content="notranslate">` present on `/es/`
- [ ] Hero headline and CTA button are in Spanish
- [ ] Nav labels are in Spanish, nav hrefs point to `/es/` paths
- [ ] Footer disclaimer paragraphs are in Spanish
- [ ] `<link rel="alternate" hreflang="en">` present on `/es/`
- [ ] `<link rel="alternate" hreflang="es">` present on `/`
- [ ] All 89 previously static English pages still resolve correctly

---

## Phase 7B — Intake

### DEV-32: Spanish Intake Wizard (/es/buscar-ayuda)

**Execution Prompt:**
Read `components/intake/IntakeWizard.tsx`, `app/find-help/page.tsx`, `app/find-help/results/page.tsx`, `app/find-help/thank-you/page.tsx`, and `docs/strategy/SPANISH-STRATEGY.md` §Intake Wizard + §Disclaimers.

**Key constraint:** `IntakeWizard` is `'use client'`. It cannot call `getDictionary()`. The parent server page loads the dict and passes relevant strings as props.

**Key constraint — intake values are English IDs:** Option values passed to form state must be English slugs (e.g. `"car"`, `"whiplash"`), not localized labels. Display the Spanish label in the UI but store the English ID as the value. This ensures results page logic and Supabase submissions work correctly in both languages.

- `app/(es)/es/buscar-ayuda/page.tsx` — server component; loads `getDictionary('es')`; passes `strings={dict.intake}` to `<IntakeWizard>` and `strings={dict.findHelp}` for page hero text; hreflang ↔ `/find-help`
- `app/(es)/es/buscar-ayuda/results/page.tsx` — server component; passes `strings={dict.findHelp.results}` and `strings={dict.findHelp.urgency}` to results component; URGENCY_CONFIG labels and messages come from dict, not hardcoded English
- `app/(es)/es/buscar-ayuda/thank-you/page.tsx` — Spanish thank-you page
- `components/intake/IntakeWizard.tsx` — add `strings` prop typed as `Dictionary['intake']`; use `strings.*` for wrapper-level text (TCPA consent, disclaimer, error messages, CTA labels); CTA link → `/es/buscar-ayuda` when `usePathname().startsWith('/es/')`
- `components/intake/steps/` — read every step component file before editing; each has hardcoded English question text and option arrays (e.g. `StepAccidentType.tsx` has a hardcoded `ACCIDENT_TYPES` array); add `strings` prop to each step component; option `value` attributes stay as English IDs, only the displayed `label` text changes to Spanish
- `app/find-help/results/page.tsx` — update to accept optional `strings` prop defaulting to English values so the English page stays unchanged

**Spanish TCPA consent (exact):**
```
Al enviar este formulario, acepto recibir comunicaciones por teléfono, mensaje de texto y correo electrónico sobre mi consulta. Entiendo que este servicio es gratuito y no estoy obligado a contratar a ningún abogado.
```

**Spanish disclaimer (exact, no placeholder):**
```
AccidentPath no es un bufete de abogados y no proporciona asesoramiento legal. La información proporcionada es solo para fines educativos.
```

**Manual verification:**
- [ ] `/es/buscar-ayuda` loads in Spanish
- [ ] All wizard step questions and option labels are in Spanish
- [ ] TCPA consent is the exact Spanish text above
- [ ] Disclaimer is Spanish (no `[NOMBRE DE MARCA]` placeholder)
- [ ] Results page shows Spanish heading and CTA
- [ ] Thank-you page is in Spanish
- [ ] hreflang: EN (`/find-help`) ↔ ES (`/es/buscar-ayuda`)
- [ ] Supabase submission still works
- [ ] English `/find-help` is unchanged
- [ ] `npm run build` passes

---

## Phase 7C — Content Pages

### DEV-33: Spanish Accident Pages (/es/accidentes/[slug])

**Execution Prompt:**
Read `app/accidents/[slug]/page.tsx` in full and `content/accidents/car.json` for the complete JSON schema. Read `i18n/config.ts` for `SLUG_MAP_ES`.

- `lib/cms.ts` — add `locale?: 'en' | 'es'` parameter to existing loader methods (e.g. `getAccident(slug, locale = 'en')`); when `locale === 'es'` read from `content/accidents/es/[slug].json`; do NOT create a separate `lib/cms-es.ts`
- `app/(es)/es/accidentes/[slug]/page.tsx` — mirrors EN accident page; `generateStaticParams` returns all Spanish slugs (values of `SLUG_MAP_ES`); calls `cms.getAccident(SLUG_MAP_EN[slug], 'es')`; hreflang links EN↔ES; all related sidebar links point to `/es/` URLs; CTA href is `/es/buscar-ayuda`; `<meta name="google" content="notranslate" />`
- `content/accidents/es/` directory — 13 JSON files: `auto.json`, `camion.json`, `motocicleta.json`, `caida.json`, `trabajo.json`, `bicicleta.json`, `peaton.json`, `mordida-perro.json`, `construccion.json`, `propiedad.json`, `producto.json`, `muerte-injusta.json`, `uber-lyft.json` — same schema as English, Spanish field values, add `"translationStatus": "needs-review"` on every file

**Minimum JSON schema each ES file must satisfy** (read `content/accidents/car.json` for exact field names):
```json
{
  "slug": "auto",
  "translationStatus": "needs-review",
  "title": "Accidente de Auto",
  "metaTitle": "Abogado de Accidentes de Auto en California | AccidentPath",
  "metaDescription": "¿Tuviste un accidente de auto en California? Obtenga orientación clara y conéctese con abogados calificados. Servicio gratuito.",
  "heroHeadline": "¿Tuviste un accidente de auto?",
  "disclaimer": "Esta información es solo para fines educativos y no constituye asesoramiento legal."
}
```

**Manual verification:**
- [ ] `/es/accidentes/auto` loads without errors, page in Spanish
- [ ] All 13 Spanish slugs resolve (spot-check: `/es/accidentes/camion`, `/es/accidentes/caida`)
- [ ] `<html lang="es">` present
- [ ] hreflang: `/accidents/car` ↔ `/es/accidentes/auto`
- [ ] Related sidebar links are `/es/` URLs
- [ ] CTA links to `/es/buscar-ayuda`
- [ ] No `[NOMBRE DE MARCA]` placeholder anywhere
- [ ] `npm run build` passes

---

### DEV-34: Spanish Guide Pages (/es/guias/[slug])

**Execution Prompt:**
Read `app/guides/[slug]/page.tsx` in full and `content/guides/after-car-accident.json` for schema. Read `i18n/config.ts` for `SLUG_MAP_ES`.

- `app/(es)/es/guias/[slug]/page.tsx` — mirrors EN guide page; `generateStaticParams` returns Spanish guide slugs from `SLUG_MAP_ES`; loads `content/guides/es/[slug].json`; hreflang EN↔ES; CTA → `/es/buscar-ayuda`; `<meta name="google" content="notranslate" />`
- `content/guides/es/` — 14 JSON files with same schema as English, Spanish values, `"translationStatus": "needs-review"` on each: `despues-accidente-auto.json`, `despues-accidente-camion.json`, `lista-evidencia.json`, `despues-accidente-motocicleta.json`, `soy-culpable.json`, `errores-comunes.json`, `ajustadores-seguros.json`, `reporte-policial.json`, `contratar-abogado.json`, `reclamos-seguro.json`, `proteger-reclamo.json`, `acuerdo-vs-demanda.json`, `hablar-con-abogado.json`, `facturas-medicas.json`

**Manual verification:**
- [ ] `/es/guias/despues-accidente-auto` loads in Spanish
- [ ] All 14 guide slugs resolve
- [ ] hreflang links to `/guides/after-car-accident`
- [ ] CTA links to `/es/buscar-ayuda`
- [ ] `npm run build` passes

---

### DEV-34B: Spanish Injury Pages (/es/lesiones/[slug])

**Execution Prompt:**
Read `app/injuries/[slug]/page.tsx` in full and `content/injuries/whiplash.json` for schema.

- `app/(es)/es/lesiones/[slug]/page.tsx` — mirrors EN injury page; `generateStaticParams` from `SLUG_MAP_ES` injury entries; loads `content/injuries/es/[slug].json`; hreflang EN↔ES; CTA → `/es/buscar-ayuda`; `<meta name="google" content="notranslate" />`
- `content/injuries/es/` — 7 JSON files: `latigazo.json`, `huesos-rotos.json`, `traumatismo-craneal.json`, `columna.json`, `tejido-blando.json`, `quemaduras.json`, `lesiones-internas.json` — Spanish values, `"translationStatus": "needs-review"` on each

**Manual verification:**
- [ ] `/es/lesiones/latigazo` loads in Spanish
- [ ] All 7 slugs resolve
- [ ] hreflang links to `/injuries/whiplash`
- [ ] CTA links to `/es/buscar-ayuda`
- [ ] `npm run build` passes

---

### DEV-35: Spanish Tool Pages (/es/herramientas/[slug])

**Execution Prompt:**
Read `app/tools/[slug]/page.tsx`, `components/tools/ToolEngine.tsx`, `components/tools/ToolResults.tsx`.

**Key constraint:** `ToolEngine` and `ToolResults` are `'use client'`. The parent server page passes translated strings as a `strings` prop.

- `app/(es)/es/herramientas/[slug]/page.tsx` — server component; loads `getDictionary('es')`; passes `strings={dict.tools}` and `strings={dict.cta}` to `<ToolEngine>`; Spanish meta; hreflang EN↔ES; `<meta name="google" content="notranslate" />`
- `components/tools/ToolEngine.tsx` — add `strings` prop typed as `Pick<Dictionary, 'cta' | 'tools'>`; use `strings.cta.next`, `strings.cta.back`, `strings.cta.seeMyResults`, `strings.cta.calculating` for buttons; `strings.tools.disclaimer` for disclaimer text; tool question content stays English for now — mark with `// TODO: Spanish tool content (DEV-35)`; CTA in results points to `/es/buscar-ayuda` when `usePathname().startsWith('/es/')`
- `components/tools/ToolResults.tsx` — add `strings` prop; use `strings.tools.yourResults` for "Your Results" heading; `strings.cta.startOver` for "Start Over"; `strings.tools.priority.*` for priority badge labels

**Manual verification:**
- [ ] `/es/herramientas/lista-evidencia` loads without errors
- [ ] Buttons show "Siguiente", "Atrás", "Ver Mis Resultados"
- [ ] Priority badges show "Crítico", "Importante", "Útil"
- [ ] Disclaimer is in Spanish
- [ ] Result CTA links to `/es/buscar-ayuda`
- [ ] hreflang links to `/tools/evidence-checklist`
- [ ] English tool pages unchanged
- [ ] `npm run build` passes

---

### DEV-37: Spanish State + City Pages (/es/estados/[state]/[city])

**Execution Prompt:**
Read `app/states/[state]/page.tsx`, `app/states/[state]/[city]/page.tsx`, `content/states/california.json`, and one city file e.g. `content/cities/los-angeles.json` for schema.

**Note:** State and city slugs are proper names — they do not get translated. `/es/estados/california` and `/es/estados/california/los-angeles` use the same slugs as English. Only the content fields inside the JSON files are translated.

**Also:** The Header mega-menu `stateGuides` array (state + city links) was not covered by DEV-29/DEV-30 because the state routes didn't exist yet. Add `NAV_STATE_GUIDES` to `i18n/config.ts` in this task, and update `Header.tsx` to use it.

- `i18n/config.ts` — add `NAV_STATE_GUIDES` with `en` and `es` variants; ES hrefs use `/es/estados/california` and `/es/estados/california/los-angeles` etc.; update `Header.tsx` to use `NAV_STATE_GUIDES[locale]` instead of the hardcoded `stateGuides` constant; also update Footer `FOOTER_RESOURCE_LINKS.es` entries for California and Arizona to point to `/es/estados/california` and `/es/estados/arizona` (currently pointing to English paths)
- `app/(es)/es/estados/[state]/page.tsx` — mirrors EN state page; `generateStaticParams` returns `['california', 'arizona']`; loads `content/states/es/[state].json`; hreflang EN↔ES; CTA → `/es/buscar-ayuda`; reviewer byline hidden when `reviewedBy === 'Pending Legal Review'` (same logic as English version); `<meta name="google" content="notranslate" />`
- `app/(es)/es/estados/[state]/[city]/page.tsx` — mirrors EN city page; `generateStaticParams` returns all city slugs per state; loads `content/cities/es/[city].json`; hreflang EN↔ES; CTA → `/es/buscar-ayuda`; same reviewer conditional; `<meta name="google" content="notranslate" />`
- `content/states/es/california.json` and `content/states/es/arizona.json` — same schema as English, Spanish field values (statute of limitations descriptions, fault rule description, reporting deadline details, insurance minimum labels), `"translationStatus": "needs-review"`
- `content/cities/es/` — 16 JSON files: `los-angeles.json`, `san-diego.json`, `san-francisco.json`, `san-jose.json`, `sacramento.json`, `fresno.json`, `oakland.json`, `long-beach.json`, `anaheim.json`, `bakersfield.json`, `phoenix.json`, `tucson.json`, `mesa.json`, `scottsdale.json`, `chandler.json`, `gilbert.json` — same schema as English, Spanish values, `"translationStatus": "needs-review"`

**Manual verification:**
- [ ] `/es/estados/california` loads in Spanish
- [ ] `/es/estados/california/los-angeles` loads in Spanish
- [ ] `/es/estados/arizona` loads in Spanish
- [ ] Reviewer byline is hidden (all content is still "Pending Legal Review")
- [ ] Header state guides mega-menu shows Spanish labels and `/es/estados/` hrefs on Spanish pages
- [ ] Footer "Guía de California" links to `/es/estados/california` (not `/states/california`)
- [ ] hreflang: `/states/california` ↔ `/es/estados/california`
- [ ] All 16 city slugs resolve under their respective states
- [ ] CTA links to `/es/buscar-ayuda`
- [ ] `npm run build` passes

---

## Phase 7D — SEO

### DEV-36: hreflang + Spanish Sitemap

**Execution Prompt:**
Read `app/sitemap.ts` in full.

- `lib/hreflang.ts` — `getHreflangAlternates(enPath: string, esPath: string): AlternateURLs` returns the object shape Next.js `generateMetadata` expects for `alternates.languages`; always includes `'x-default': enPath`; use in every Spanish page's `generateMetadata`
- `app/sitemap.ts` — extend to include all `/es/**` URLs alongside English URLs; each entry includes the correct Spanish path; use `SLUG_MAP_ES` values to generate all Spanish slugs dynamically
- `app/layout.tsx` — update root layout `generateMetadata` to include `alternates.languages` for all English pages pointing to their Spanish equivalents

**Next.js alternates shape:**
```ts
alternates: {
  canonical: '/accidents/car',
  languages: {
    'en': '/accidents/car',
    'es': '/es/accidentes/auto',
    'x-default': '/accidents/car',
  }
}
```

**Manual verification:**
- [ ] View source on `/accidents/car` — hreflang tags present for EN + ES + x-default
- [ ] View source on `/es/accidentes/auto` — hreflang tags present for EN + ES + x-default
- [ ] `/sitemap.xml` includes all `/es/**` URLs
- [ ] `npm run build` passes with no TypeScript errors

---

## Summary Table

| Task | Phase | Key Files | Complexity |
|------|-------|-----------|-----------|
| DEV-29 | 7A | `i18n/` (5 files), `middleware.ts` | Medium |
| DEV-30 | 7A | `LanguageToggle.tsx`, `Header.tsx`, `Footer.tsx`, both layouts | High |
| DEV-31 | 7A | Route group restructure + `app/(es)/es/layout.tsx`, `app/(es)/es/page.tsx` | Medium |
| DEV-32 | 7B | `app/(es)/es/buscar-ayuda/**`, `IntakeWizard.tsx` | High |
| DEV-33 | 7C | `app/(es)/es/accidentes/[slug]/page.tsx`, 13 JSON files | Medium |
| DEV-34 | 7C | `app/(es)/es/guias/[slug]/page.tsx`, 14 JSON files | Medium |
| DEV-34B | 7C | `app/(es)/es/lesiones/[slug]/page.tsx`, 7 JSON files | Medium |
| DEV-35 | 7C | `app/(es)/es/herramientas/[slug]/page.tsx`, `ToolEngine.tsx`, `ToolResults.tsx` | Medium |
| DEV-37 | 7C | `app/(es)/es/estados/[state]/page.tsx`, `app/(es)/es/estados/[state]/[city]/page.tsx`, 18 JSON files | Medium |
| DEV-36 | 7D | `lib/hreflang.ts`, `app/sitemap.ts`, `app/layout.tsx` | Medium |

**Total: 10 tasks**  
**Tier 1 complete after:** DEV-29 + DEV-30 + DEV-31 + DEV-32  
**Tier 2 complete after:** all 10 tasks  

---

## Compliance Notes

- All Spanish pages must include Spanish disclaimer (no English-only disclaimer on Spanish pages)
- TCPA consent must be in Spanish on all Spanish intake forms
- Never use `[NOMBRE DE MARCA]` — always write `AccidentPath`
- Prohibited language rules from `docs/strategy/COMPLIANCE.md` apply in both languages
- Every Spanish content JSON includes `"translationStatus": "needs-review"` — flag for attorney review before launch
