# Execution Prompts for Joner

> Ready-to-paste prompts for Claude Code. Each one builds on the keyword research findings.
> Copy the prompt, open Claude Code in the `accident-path/` repo, paste it.

---

## Prompt 1: Build Interactive Tools FIRST (Highest-Priority SEO Play)

**Why first:** Zero competitors have interactive tools. Tool pages are resistant to Google AI Overviews. Users who engage with tools convert at 2-4x the rate of content-only visitors. Tool keywords have LOW competition because nobody has built them yet.

**Target keywords this captures:**
- "accident evidence checklist" (5,400/mo, Low-Medium KD)
- "car accident settlement calculator" (5,400/mo, Medium KD)
- "what kind of case do I have" (2,900/mo, Low KD)
- "statute of limitations car accident california" (5,400/mo, Medium KD)
- "do I need medical care after accident" (1,900/mo, Low KD)
- "what type of lawyer do I need" (3,600/mo, Low-Medium KD)

### Prompt to paste:

```
Read CLAUDE.md, then read docs/strategy/TOOLS-SPEC.md and docs/strategy/SEO-STRATEGY.md.

Build the shared ToolEngine component and then build these 6 tools in priority order:

1. Evidence Checklist Generator (/tools/evidence-checklist)
   - Target keyword: "accident evidence checklist"
   - Must include 800+ words of supporting educational content around the tool
   - Add FAQ content block below tool targeting "People Also Ask" questions
   - Add HowTo schema markup
   - Make the generated checklist shareable via unique URL

2. Accident Case Type Quiz (/tools/accident-case-quiz)
   - Target keyword: "what kind of case do I have"
   - Progressive multi-step flow, mobile-optimized
   - Educational summary output (NOT legal advice)
   - Links to relevant accident hub pages

3. Statute of Limitations Countdown (/tools/statute-countdown)
   - Target keyword: "statute of limitations car accident california"
   - Takes state + accident type + date → shows countdown
   - Green/yellow/red urgency levels
   - State-specific statute citations (CA CCP §335.1, AZ §12-542)
   - SoftwareApplication schema markup

4. Urgency Checker (/tools/urgency-checker)
   - Target keyword: "do I need medical care after accident"
   - Red flag symptom detection with immediate 911 guidance
   - Three output levels: urgent, soon, monitor

5. Lawyer Type Matcher (/tools/lawyer-type-matcher)
   - Target keyword: "what type of lawyer do I need"
   - Based on accident type + severity + circumstances
   - Educational output about attorney specializations

6. Injury Journal (/tools/injury-journal)
   - Target keyword: "injury journal template"
   - Daily pain tracker, symptom log, treatment log
   - Local storage (no account required)
   - PDF export functionality

For EVERY tool page:
- 800+ words of supporting content (Google can't index JS tool outputs)
- Disclaimer before AND after results
- FAQ content block (3-5 questions targeting PAA boxes)
- At least 3 internal links to related hub/guide pages
- Analytics events on each step + completion
- Mobile-first: 44x44px touch targets
- CTA to /find-help after results

Read docs/strategy/COMPLIANCE.md before writing ANY user-facing copy.
```

---

## Prompt 2: Spanish Bilingual Launch (Blue Ocean Opportunity)

**Why now:** Spanish PI keywords have 50-60% lower CPCs and near-zero quality content in search results. Only 1 of 9 competitor LRS sites has any Spanish content at all. 39% of California speaks Spanish at home. This is the single largest underserved audience in the PI market.

**Target keywords this captures:**
- "abogado de accidentes" (18,100/mo, Medium KD)
- "que hacer después de un accidente de auto" (6,600/mo, Low KD)
- "abogado de lesiones personales" (8,100/mo, Medium KD)
- "consulta legal gratuita" (3,600/mo, Low KD)
- "accidente de auto sin documentos" (~1,000/mo, Very Low KD)

### Prompt to paste:

```
Read CLAUDE.md, then read docs/strategy/SPANISH-STRATEGY.md and docs/strategy/COMPLIANCE.md.

Implement Spanish Tier 1 — bilingual UI + intake wizard. This is a launch-day feature, not post-launch.

1. Set up Next.js i18n with [locale] dynamic segment:
   - /en/ (default, no prefix needed)
   - /es/ (Spanish prefix)
   - middleware.ts for locale detection (URL path > cookie > Accept-Language > default EN)

2. Create i18n string files:
   - i18n/en.json — all UI strings in English
   - i18n/es.json — all UI strings in Mexican Spanish (NOT machine translation)
   - i18n/dictionaries.ts — loader utility
   - i18n/config.ts — supported locales

3. Translate all UI elements (from SPANISH-STRATEGY.md):
   - Navigation items
   - CTAs ("Start Your Free Accident Check" → "Comience Su Evaluación Gratis")
   - Trust strip badges
   - Emergency banner ("In danger? Call 911" → "En peligro? Llame al 911")
   - Phone badge with "Hablamos Español"

4. Build full Spanish intake wizard:
   - Every field, label, option, validation message in Spanish
   - TCPA consent in Spanish (see COMPLIANCE.md Section 9)
   - Results page in Spanish

5. Build Spanish disclaimers (from COMPLIANCE.md):
   - Footer disclaimer in Spanish
   - Tool disclaimers in Spanish
   - State-specific disclaimers in Spanish

6. SEO for bilingual content:
   - hreflang tags on every page linking EN ↔ ES versions
   - Separate XML sitemaps: sitemap-en.xml and sitemap-es.xml
   - Spanish meta titles and descriptions (rewritten for Spanish search intent, NOT translated)
   - inLanguage: "es" in all Spanish page structured data
   - Spanish URL slugs: /es/accidentes/auto (NOT /es/accidents/car)

7. Language toggle:
   - Visible toggle in header (EN | ES)
   - Store preference in cookie
   - Smooth transition without page reload

Read docs/strategy/COMPLIANCE.md — ALL safe/prohibited language rules apply in BOTH languages.
```

---

## Prompt 3: Long-Tail Content Blitz (70+ Rankable Keywords)

**Why:** Head terms like "car accident lawyer" ($300-500 CPC, Extreme competition) are unreachable for a new domain in year 1. But long-tail informational keywords like "what to do after a car accident not your fault" (2,900/mo) are winnable in 1-3 months. Our keyword research identified 70+ long-tail keywords with combined volume exceeding 100,000 monthly searches.

**Target keywords this captures (sample):**
- "what to do after a car accident not your fault" (2,900/mo, Low KD)
- "how to talk to insurance adjuster after car accident" (2,400/mo, Low KD)
- "should I get a lawyer for a car accident that was my fault" (1,900/mo, Low KD)
- "mistakes to avoid after a car accident" (1,600/mo, Low KD)
- "am I at fault if I rear ended someone" (1,300/mo, Low KD)
- "how long does a car accident claim take" (2,900/mo, Low KD)
- "settlement vs going to court" (1,600/mo, Low KD)

### Prompt to paste:

```
Read CLAUDE.md, then read docs/seo/KEYWORD-RESEARCH.md (Section 2: Long-Tail Keywords and Section 11: Content Priority Matrix).

Build the 5 highest-priority accident hub pages + 5 guide pages as JSON content files. Each page targets specific long-tail keywords from our keyword research.

ACCIDENT HUBS (2,500+ words each):

1. /accidents/car — Primary: "what to do after a car accident" (33,100/mo)
   Include sections for: not at fault, at fault, rear-end, T-bone, hit and run
   Embed: Evidence Checklist tool inline
   FAQ block targeting PAA: "Should I call police for minor accident?" "Can I sue if I was partly at fault?" "How long do I have to file?"

2. /accidents/truck — Primary: "truck accident what to do" (2,900/mo)
   Include: federal regulations, multiple liable parties, commercial insurance
   Embed: Case Type Quiz inline

3. /accidents/motorcycle — Primary: "motorcycle accident steps" (1,300/mo)
   Include: unique injury patterns, helmet law by state, lane splitting (CA legal)

4. /accidents/slip-and-fall — Primary: "slip and fall what to do" (1,600/mo)
   Include: premises liability, documentation importance, store vs. property

5. /accidents/workplace — Primary: "workplace injury what to do" (1,900/mo)
   Include: workers comp vs PI claim, employer liability, construction

GUIDE PAGES (1,500+ words each):

6. /guides/after-car-accident — Primary: "what to do after a car accident" (33,100/mo)
   Step-by-step with 15-min, 24-hr, 7-day timeframes
   Format for AI Overview citation: numbered steps with bold lead-ins

7. /guides/am-i-at-fault — Primary: "am I at fault car accident" (2,900/mo)
   Comparative fault CA (pure) vs AZ (modified at 50%)
   Scenario-specific: rear-end, left turn, parking lot, lane change

8. /guides/common-mistakes — Primary: "mistakes after car accident" (1,600/mo)
   Top 10 list format (featured snippet opportunity)

9. /guides/hiring-a-lawyer — Primary: "how to find personal injury lawyer" (2,900/mo)
   What to ask, red flags, contingency fees explained

10. /guides/settlement-vs-lawsuit — Primary: "settlement vs lawsuit" (1,600/mo)
    Side-by-side comparison table, pros/cons, decision framework

EVERY PAGE MUST HAVE:
- Unique title tag + meta description (from docs/seo/KEYWORD-MAP.md)
- One H1 matching primary keyword naturally
- H2 headings matching "People Also Ask" questions
- At least 3 internal links to related pages
- CTA to /find-help
- Attorney review badge placeholder (reviewedBy + reviewDate fields in JSON)
- State-specific dynamic section (CA vs AZ content)
- Appropriate disclaimers per COMPLIANCE.md
- BreadcrumbList structured data
- Article schema (guides) or WebPage schema (hubs)
- Minimum word count enforced by Zod schema

Format as JSON content files in content/ directory with Zod validation.
Read docs/strategy/COMPLIANCE.md before writing ANY content.
```

---

## Prompt 4: Blog Launch Batch (Fresh Content from Day 1)

**Why:** Google rewards sites that publish fresh content consistently. These 10 blog posts target long-tail questions that real people ask on Reddit, each with 1,000+ words and low competition.

### Prompt to paste:

```
Read CLAUDE.md, then read docs/seo/KEYWORD-RESEARCH.md (Section 2 and Section 12: 90-Day Plan).

Create the blog infrastructure and write 10 launch blog posts as JSON content files.

INFRASTRUCTURE:
1. Create /blog route with paginated index page
2. Create /blog/[slug] dynamic route for individual posts
3. Add blog to XML sitemap (sitemap-blog.xml)
4. Add Article schema on each post
5. Add author page link (placeholder until authors are set up)
6. Add "Related Articles" component at bottom of each post

BLOG POSTS (1,000+ words each, targeting low-competition long-tail):

1. "How Long Does a Car Accident Claim Take in California?"
   Keyword: "how long car accident claim california" (2,900/mo)

2. "What Is Pain and Suffering in a Personal Injury Case?"
   Keyword: "what is pain and suffering" (3,600/mo)

3. "Comparative Fault in California: Can I Sue If I Was Partly at Fault?"
   Keyword: "comparative fault california" (1,300/mo)

4. "Contingency Fee Agreements Explained: How PI Lawyers Get Paid"
   Keyword: "contingency fee agreement explained" (480/mo, Very Low KD)

5. "Hit by an Uninsured Driver? Here's What to Do in California"
   Keyword: "hit by uninsured driver california" (1,600/mo)

6. "What to Do If You're in an Uber or Lyft Accident"
   Keyword: "uber accident what to do" (1,300/mo)

7. "Understanding Your Medical Bills After an Accident"
   Keyword: "accident medical bills explained" (720/mo, Very Low KD)

8. "How Insurance Adjusters Work (And What They Won't Tell You)"
   Keyword: "how insurance adjusters work" (1,300/mo)

9. "Should I Accept the First Settlement Offer After a Car Accident?"
   Keyword: "first settlement offer car accident" (880/mo, Low KD)

10. "Your Rights as a Pedestrian Hit by a Car in California"
    Keyword: "pedestrian hit by car rights california" (720/mo, Low KD)

EVERY POST MUST HAVE:
- Unique title tag (under 60 chars) + meta description (under 155 chars)
- Primary keyword in H1 naturally
- FAQ section at bottom (3 questions targeting PAA)
- Internal links to relevant hub pages and tools
- CTA to /find-help
- Disclaimer footer
- "Last updated" date field
- Article schema with author, datePublished, dateModified
- Reading time estimate

Read docs/strategy/COMPLIANCE.md before writing ANY content.
```

---

## Prompt 5: City Pages with Real Local Data (16 Cities)

**Why:** City-specific keywords like "car accident help phoenix" have LOW competition because most competitors use thin geo-page farms with no real content. Our pages will have actual local data (hospitals, courts, dangerous roads, local stats) making them genuinely useful and rankable.

### Prompt to paste:

```
Read CLAUDE.md, then read docs/strategy/MASTER-PLAN.md (Target Cities section) and docs/seo/KEYWORD-RESEARCH.md (Section 5: City-Specific Keywords).

Research and write 16 city page JSON content files. Each page must have 1,200+ words with REAL, unique local data. NO templated descriptions.

CALIFORNIA (10 cities):
1. Los Angeles — keyword: "car accident help los angeles"
2. San Diego — keyword: "car accident help san diego"
3. San Jose — keyword: "car accident help san jose"
4. San Francisco — keyword: "car accident help san francisco"
5. Fresno — keyword: "car accident help fresno"
6. Sacramento — keyword: "car accident help sacramento"
7. Long Beach — keyword: "car accident help long beach"
8. Oakland — keyword: "car accident help oakland"
9. Bakersfield — keyword: "car accident help bakersfield"
10. Anaheim — keyword: "car accident help anaheim"

ARIZONA (6 cities):
11. Phoenix — keyword: "car accident help phoenix"
12. Tucson — keyword: "car accident help tucson"
13. Mesa — keyword: "car accident help mesa"
14. Chandler — keyword: "car accident help chandler"
15. Scottsdale — keyword: "car accident help scottsdale"
16. Gilbert — keyword: "car accident help gilbert"

EACH CITY PAGE MUST INCLUDE (all unique, researched data):
- Local hospitals with trauma centers (actual names and addresses)
- County courthouse / filing info (address, hours, phone)
- Dangerous roads / intersections (named, with context)
- Local accident statistics (from NHTSA, state DOT, or city data)
- State law summary (from shared state rules engine — CA or AZ)
- Local attorney count from directory (placeholder until Rogelio builds)
- CTA with city + state pre-filled in intake form
- Place schema (LocalBusiness or CivicStructure)
- Unique meta title + description
- BreadcrumbList: Home > State Guides > [State] > [City]

The Zod schema must enforce: minimum 1,200 words, at least 2 unique local
data points (hospitals, courts), and non-empty localHighways field.

Read docs/strategy/COMPLIANCE.md — state-specific content needs counsel review before PUBLISH (but build now with real data, review later).
```

---

## How Joner Should Use These Prompts

1. Open terminal → `cd accident-path`
2. Run `claude`
3. Paste the prompt exactly as written
4. Let Claude build
5. Review: Does `npm run build` pass? Does `npx tsc --noEmit` pass?
6. Commit + push
7. Mark the corresponding Notion tasks as Done
8. Move to the next prompt

**Recommended order:** DEV-01 through DEV-08 first (project setup), then Prompt 1 (tools), then Prompt 3 (content), then Prompt 2 (Spanish), then Prompt 4 (blog), then Prompt 5 (cities).
