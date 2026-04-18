# Spanish Language Strategy

> 39% of California speaks Spanish at home. Most PI competitors either ignore this
> or slap on a "Hablamos Español" badge. We're building a real bilingual experience.

---

## Why This Matters

| Stat | Source |
|------|--------|
| 39% of CA population speaks Spanish at home | US Census |
| 28% of CA residents are Spanish-dominant (limited English) | Pew Research |
| Spanish PI keywords have 5-10x less competition | SEMrush data |
| Only 1 of 9 competitor LRS sites has any Spanish UI | Our competitor analysis |
| Rock Point already offers Spanish support | rockpointlegalfunding.com |

**The math:** If 28% of CA accident victims are Spanish-dominant and NO competitor serves them well, we have a wide-open market segment worth potentially millions in leads.

---

## Technical Implementation

### Next.js i18n Setup

```
app/
├── [locale]/                    ← Dynamic locale segment
│   ├── layout.tsx               ← Locale-aware layout
│   ├── page.tsx                 ← Home (both languages)
│   ├── accidents/
│   │   ├── car/page.tsx         → /en/accidents/car OR /es/accidentes/auto
│   │   └── truck/page.tsx       → /en/accidents/truck OR /es/accidentes/camion
│   ├── guides/
│   ├── tools/
│   └── find-help/
├── middleware.ts                 ← Locale detection + redirect
└── i18n/
    ├── en.json                  ← English strings
    ├── es.json                  ← Spanish strings
    ├── dictionaries.ts          ← Loader utility
    └── config.ts                ← Supported locales, default locale
```

### URL Structure

| English | Spanish |
|---------|---------|
| `/accidents/car` | `/es/accidentes/auto` |
| `/accidents/truck` | `/es/accidentes/camion` |
| `/accidents/motorcycle` | `/es/accidentes/motocicleta` |
| `/accidents/slip-and-fall` | `/es/accidentes/caida` |
| `/accidents/workplace` | `/es/accidentes/trabajo` |
| `/guides/after-car-accident` | `/es/guias/despues-accidente-auto` |
| `/tools/evidence-checklist` | `/es/herramientas/lista-evidencia` |
| `/find-help` | `/es/buscar-ayuda` |
| `/legal-funding` | `/es/financiamiento-legal` |
| `/states/california` | `/es/estados/california` |

### Language Detection Priority

1. URL path (`/es/` prefix)
2. User's explicit toggle selection (stored in cookie)
3. Browser `Accept-Language` header
4. Default to English

### SEO for Bilingual Content

- `hreflang` tags on every page linking EN ↔ ES versions
- Separate XML sitemaps: `/sitemap-en.xml` and `/sitemap-es.xml`
- Spanish meta titles and descriptions (NOT just translated — rewritten for Spanish search intent)
- Spanish structured data (Organization schema with Spanish name/description variant)
- Spanish-specific keywords in URL slugs (NOT translated English — actual Spanish search terms)

```html
<link rel="alternate" hreflang="en" href="https://[domain]/accidents/car" />
<link rel="alternate" hreflang="es" href="https://[domain]/es/accidentes/auto" />
<link rel="alternate" hreflang="x-default" href="https://[domain]/accidents/car" />
```

---

## Tier 1: Bilingual UI + Spanish Intake (Launch Day)

### What Gets Translated

| Component | English | Spanish |
|-----------|---------|---------|
| **Nav items** | Accident Types | Tipos de Accidentes |
| | Injuries | Lesiones |
| | What To Do Next | Qué Hacer Después |
| | Tools | Herramientas |
| | Find Help | Buscar Ayuda |
| | State Guides | Guías por Estado |
| | Resources | Recursos |
| | About | Acerca de |
| **CTAs** | Start Your Free Accident Check | Comience Su Evaluación Gratis |
| | Get Help Now | Obtenga Ayuda Ahora |
| | Explore Accident Guides | Explore Guías de Accidentes |
| **Trust strip** | State Bar Certified | Certificado por el Colegio de Abogados |
| | 24/7 Support | Soporte 24/7 |
| | Free Service | Servicio Gratuito |
| | No Obligation | Sin Compromiso |
| **Phone badge** | Call us | Llámenos — Hablamos Español |
| **Emergency** | In danger? Call 911 | En peligro? Llame al 911 |

### Intake Wizard — Full Spanish Version

Every field, label, option, validation message, and result page in Spanish:

| Step | English | Spanish |
|------|---------|---------|
| Accident type | What type of accident were you in? | Qué tipo de accidente tuvo? |
| Date | When did the accident happen? | Cuándo ocurrió el accidente? |
| Location | What city and state? | En qué ciudad y estado? |
| Injuries | What injuries did you sustain? | Qué lesiones sufrió? |
| Medical | Have you seen a doctor? | Ha visitado un doctor? |
| Police | Was a police report filed? | Se hizo un reporte policial? |
| Insurance | Do you have insurance? | Tiene seguro? |
| Work | Has this affected your work? | Esto ha afectado su trabajo? |
| Contact | How can we reach you? | Cómo podemos contactarlo? |

### Disclaimers in Spanish

```
[NOMBRE DE MARCA] no es un bufete de abogados y no proporciona asesoramiento
legal. La información proporcionada es solo para fines educativos. Al usar este
sitio, usted reconoce que no se forma ninguna relación abogado-cliente. Si está
en peligro inmediato, llame al 911. Para emergencias médicas, busque atención
de inmediato.
```

### TCPA Consent in Spanish

```
Al enviar este formulario, acepto recibir comunicaciones por teléfono, mensaje
de texto y correo electrónico sobre mi consulta. Entiendo que este servicio
es gratuito y no estoy obligado a contratar a ningún abogado.
```

---

## Tier 2: Content Translation (Month 2-3)

### Translation Requirements

**NOT machine translation.** Requirements:
- Native Spanish speaker with legal terminology knowledge
- Mexican Spanish dialect (dominant in California)
- Legal terms verified against official Spanish-language legal resources
- Cultural adaptation (not word-for-word translation)
- SEO keyword research done separately in Spanish

### Pages to Translate (Priority Order)

1. Home page
2. Car accidents hub (/es/accidentes/auto)
3. Truck accidents hub (/es/accidentes/camion)
4. "What to do after an accident" guide
5. Intake/matching flow results page
6. About / How it works
7. Evidence checklist tool
8. Case type quiz tool
9. 3 remaining accident hubs (motorcycle, slip-and-fall, workplace)
10. Legal funding hub

### Spanish SEO Keywords (Different from English!)

| English Keyword | Spanish Keyword | Notes |
|----------------|-----------------|-------|
| car accident lawyer | abogado de accidentes de auto | Higher "abogado" volume |
| personal injury attorney | abogado de lesiones personales | |
| what to do after car accident | que hacer después de un accidente | |
| insurance claim denied | reclamo de seguro negado | |
| slip and fall lawyer | abogado de caídas | |
| truck accident | accidente de camión | |
| wrongful death | muerte injusta | |
| workers compensation | compensación de trabajadores | |
| how to find a lawyer | como encontrar un abogado | |
| free legal consultation | consulta legal gratuita | Very high volume |

**Important:** Spanish search intent is often more question-based and longer-tail. Users search in full sentences more than English users.

---

## Tier 3: Spanish-First Content (Month 4+)

### Original Spanish Content Strategy

Don't just translate English articles — create content for Spanish-specific search queries:

| Content Idea | Why |
|-------------|-----|
| "Accidente de auto sin documentos — tiene derechos" | Undocumented immigrants fear seeking help — educational content builds massive trust |
| "Cómo funciona un abogado de contingencia" | Many Spanish speakers don't know attorneys can be free upfront |
| "Sus derechos como peatón en California" | Pedestrian accidents disproportionately affect Hispanic communities in CA |
| "Qué hacer si el otro conductor no tiene seguro" | Uninsured driver content in Spanish — very underserved |
| "Accidentes de trabajo — compensación vs. demanda" | Workplace injuries in construction, agriculture — high Hispanic workforce |
| "Financiamiento legal pre-acuerdo — es seguro?" | Legal funding explained in Spanish for the first time |

### Spanish Video Content
- Short explainer videos (60-90 seconds) for each accident type
- "What to do" step-by-step videos
- Attorney Q&A videos in Spanish
- These can be embedded on Spanish pages and posted to YouTube/TikTok

### Spanish Community Presence
- Reddit: r/DerechoMexicano, r/ConsejosLegales, other Spanish-language legal subreddits
- Facebook Groups: Spanish-language accident help groups (very active in CA)
- YouTube: Spanish PI content has almost zero competition

---

## Compliance Notes for Spanish Content

1. ALL disclaimers must appear in Spanish on Spanish pages
2. Safe/prohibited language rules from COMPLIANCE.md apply in BOTH languages
3. Spanish legal terms must be verified — mistranslation of a legal concept could create liability
4. State-specific content in Spanish needs attorney review by a bilingual attorney
5. TCPA consent must be in the language the user is viewing

### Spanish Prohibited Language (Same Rules, Translated)

```
NEVER: "Le recomendamos este abogado" (We recommend this lawyer)
NEVER: "El mejor abogado para su caso" (The best lawyer for your case)
NEVER: "Debe demandar" (You should sue)
NEVER: "Garantizamos resultados" (We guarantee results)
NEVER: "Necesita un abogado" (You need a lawyer)
NEVER: "Su caso vale $X" (Your case is worth $X)
```

### Spanish Safe Language

```
"Según su información, abogados que típicamente manejan este tipo de casos incluyen..."
"Podría beneficiarse de hablar con un abogado con experiencia en..."
"La disponibilidad varía según el estado y tipo de caso."
"Esta información es solo para fines educativos y no constituye asesoramiento legal."
```

---

## Resources Needed

| Resource | For | Cost Estimate |
|----------|-----|--------------|
| Native Spanish legal copywriter | Content translation + original Spanish content | $0.10-0.15/word |
| Bilingual attorney reviewer | Legal accuracy of Spanish content | Part of legal counsel retainer |
| Spanish SEO keyword research | Separate keyword strategy for Spanish | One-time research task |
| Spanish voice talent | Video content (future) | Per-video basis |

---

## Impact Projection

| Metric | English Only | With Spanish |
|--------|-------------|-------------|
| Addressable CA market | ~61% of population | ~100% of population |
| Organic keyword competition | High | Low-Medium for Spanish |
| Competitor coverage | 1 of 9 has basic toggle | We'd be only LRS with real Spanish content |
| Lead volume increase | Baseline | +25-40% estimated |
| Cost per lead (paid) | $50-200 for English PI | $15-50 for Spanish PI keywords |
