# Dev Phase 7 — Spanish Language Implementation

---

## What We're Building

A full bilingual version of the site — real Spanish pages at real Spanish URLs that Google can find and rank independently. This is not a translate button that machine-translates on the fly. Every Spanish page is a separate, properly written page that lives at a `/es/` URL.

**English stays exactly as-is.** `/accidents/car` still works. Nothing breaks. Spanish pages are added in parallel:

| English | Spanish |
|---|---|
| `/accidents/car` | `/es/accidentes/auto` |
| `/find-help` | `/es/buscar-ayuda` |
| `/guides/after-car-accident` | `/es/guias/despues-accidente-auto` |
| `/states/california` | `/es/estados/california` |
| `/states/california/los-angeles` | `/es/estados/california/los-angeles` |

A language toggle (`EN | ES`) appears in the header and footer. Clicking it takes the user to the equivalent page in the other language and remembers their preference. Spanish-language browsers visiting the home page are automatically redirected to `/es/`.

---

## Why This Matters

39% of California speaks Spanish at home. 28% are Spanish-dominant. Of the 9 competitor LRS sites we analyzed, only one has any Spanish UI at all — and it's just a badge that says "Hablamos Español." We're building a real bilingual experience.

Spanish PI keywords have 5–10x less competition than English. That means lower cost per lead on paid and easier organic rankings. Estimated impact: +25–40% lead volume once content pages are live.

---

## What's Included

**Phase 7A — Foundation (Tier 1, launch-ready)**
- Language infrastructure: config, dictionary files, middleware
- Language toggle in header and footer — fully bilingual nav with correct Spanish URLs
- Spanish home page (`/es/`)

**Phase 7B — Intake (Tier 1, launch-ready)**
- Full Spanish intake wizard at `/es/buscar-ayuda`
- All steps, option labels, TCPA consent, and disclaimers in Spanish
- Spanish results and thank-you pages

**Phase 7C — Content Pages (Tier 2)**
- Spanish accident pages: 13 types at `/es/accidentes/[slug]`
- Spanish guide pages: 14 guides at `/es/guias/[slug]`
- Spanish injury pages: 7 types at `/es/lesiones/[slug]`
- Spanish tool pages at `/es/herramientas/[slug]`
- Spanish state pages: California + Arizona at `/es/estados/[state]`
- Spanish city pages: 16 cities at `/es/estados/[state]/[city]`

**Phase 7D — SEO**
- hreflang tags on every page (tells Google the EN and ES versions are linked)
- Spanish URLs added to the sitemap

---

## What's Not Included

- Spanish About, For Attorneys, Contact pages — low search volume, easy to add later
- Original Spanish-first content (Tier 3 from strategy doc) — requires a Spanish copywriter, future initiative
- Video content in Spanish — requires production resources, future initiative

---

## SEO Implications

Google indexes the English and Spanish pages **separately**. A Spanish speaker searching "abogado de accidentes de auto California" can find `/es/accidentes/auto` directly in search results — before they even visit the site. hreflang tags tell Google these pages are related so rankings on one help the other.

This is fundamentally different from a translate widget, which Google does not index at all.

One important detail: Spanish pages include a tag that prevents Chrome from offering to auto-translate them into English. Since the Spanish content is intentional, we don't want Chrome fighting against our language toggle.

---

## Does This Affect Dev Phase 6-8 (SEO, Tests, Polish)?

No. Phase 6-8 is complete and stays complete. Phase 7 is purely additive:

- English pages and their tests are untouched
- The sitemap gets extended (not replaced)
- Unit tests for ToolEngine and IntakeWizard need `locale="en"` added as a default prop — 5-minute fix
- Spanish pages will need their own Lighthouse audit after build (can be DEV-38 if needed)

---

## Content Translation — Important Notes

All Spanish JSON content files ship with a `"translationStatus": "needs-review"` flag. This means:

1. The content structure is correct and the pages load
2. The Spanish copy has not been reviewed by a bilingual attorney
3. **No Spanish content page should go live without human review** — mistranslation of legal content creates liability

**Recommended order of operations before launch:**
1. Attorney finalizes all English JSON content first
2. Native Spanish translator produces Spanish JSON files based on the locked English versions
3. Bilingual attorney reviews Spanish content
4. `"translationStatus"` updated to `"approved"` on each file

Translating before English is finalized wastes money — if English changes, Spanish has to be redone. Lock English first.

---

## Maintenance — What Happens When Content Changes

**Any content update to an English page requires the same update on the Spanish version.** This is the ongoing maintenance cost of a bilingual site. The `translationStatus` field manages this:
- English JSON is updated → developer sets `"translationStatus": "needs-update"` on the Spanish JSON
- Running `grep -r "needs-update" content/` shows every Spanish file out of sync at a glance
- Translator updates those files → attorney re-reviews → status back to `"approved"`

The exception is code/structure changes (bug fixes, new page sections, schema updates) — those affect both languages automatically since EN and ES share the same page component. Only copy changes require touching both files.

**If a new accident type, guide, or injury page is added in the future:**
- Add the English JSON file
- Add one line to the slug config map
- Add the Spanish JSON file and have it translated
- Routing picks it up automatically at build — no code changes needed

**If a new state or city is added:**
- Add the English JSON file to `content/states/` or `content/cities/`
- Add the Spanish JSON file to `content/states/es/` or `content/cities/es/`
- No code changes needed — `generateStaticParams` reads from the CMS dynamically

---

## Tasks

| Task | What It Does |
|---|---|
| DEV-29 | i18n config, dictionary files, language detection middleware |
| DEV-30 | Language toggle + full Header/Footer bilingual refactor |
| DEV-31 | Spanish home page and root layout |
| DEV-32 | Spanish intake wizard (`/es/buscar-ayuda`) |
| DEV-33 | Spanish accident pages (13 types) |
| DEV-34 | Spanish guide pages (14 guides) |
| DEV-34B | Spanish injury pages (7 types) |
| DEV-35 | Spanish tool pages |
| DEV-37 | Spanish state + city pages (2 states, 16 cities) |
| DEV-36 | hreflang tags + sitemap |
