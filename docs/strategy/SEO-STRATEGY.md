# SEO Strategy

> You cannot guarantee "#1," and nobody honest should. But you can build a site that
> has a real chance to compete by doing the following.

**CRITICAL: SEO is NOT a phase. It is embedded in every build phase starting from Day 1.**
Schema, meta tags, internal linking, and sitemap are built into every page template from Phase 2 onward. Do not bolt on SEO later — bake it in from the start.

---

## 0. Keyword Map (REQUIRED BEFORE ANY CONTENT)

**No page should be written without a target keyword.**

Before building content, every page must have a row in `docs/seo/KEYWORD-MAP.md`:

| Column | Description |
|--------|-------------|
| Target URL | The page this keyword maps to |
| Primary Keyword | The exact keyword to rank for |
| Monthly Volume (US) | Estimated monthly searches |
| Keyword Difficulty | Score 0-100 (from SEMrush/Ahrefs scale) |
| SERP Features | Featured snippet, PAA, video carousel, local pack, AI Overview |
| Current #1 | Who currently ranks first |
| Content Format | What format Google rewards (list, guide, tool, comparison) |
| Word Count Target | Minimum depth needed to compete |
| Priority | P0/P1/P2 based on volume × achievability |

### New Domain Strategy

AccidentPath.com is a brand-new domain (DA 0). The content competitors are:
- Nolo.com (DA 85+, 30+ year content library)
- AllLaw.com (DA 70+)
- Avvo.com (DA 90+, 10M+ monthly visits)
- Forbes Advisor (DA 95+)
- FindLaw (DA 85+)

**We cannot out-authority these sites on Day 1.** Strategy:

1. **Start with long-tail keywords (KD < 30)** — Target 4+ word queries where domain authority matters less: "what to do after car accident california," "accident evidence checklist template," "statute of limitations car accident arizona"
2. **Win with interactive tools** — No competitor has calculators, quizzes, or checklists. Tool pages can rank on utility alone.
3. **Build topical authority in clusters** — Start with lowest-competition cluster, build 10+ pages, earn authority, then attack harder keywords.
4. **Earn 50 referring domains in first 6 months** — See Link Building Playbook.
5. **Target "People Also Ask" boxes** — PAA boxes appear for nearly every PI query and don't require high DA to win.

### Keyword Prioritization for New Domain

| Phase | Keyword Type | KD Range | Example |
|-------|-------------|----------|---------|
| Month 1-3 | Long-tail informational | KD 0-25 | "what evidence to collect after car accident" |
| Month 1-3 | Tool-specific | KD 0-20 | "accident evidence checklist template" |
| Month 1-3 | City + long-tail | KD 10-30 | "what to do after car accident phoenix" |
| Month 3-6 | Mid-tail informational | KD 25-45 | "what to do after car accident" |
| Month 3-6 | Spanish PI keywords | KD 5-20 | "que hacer después de un accidente de auto" |
| Month 6-12 | Competitive informational | KD 45-65 | "car accident lawyer near me" (rankings, not ads) |
| Month 12+ | Head terms | KD 65+ | "personal injury lawyer" (organic presence) |

---

## 1. Build Topical Depth, Not Thin Geo Pages

Create topic clusters around:

| Cluster | Example Pages |
|---------|--------------|
| Accident type | Car, truck, motorcycle, rideshare, pedestrian, bicycle |
| Injury type | TBI, spinal, whiplash, broken bones, soft tissue |
| What to do after | Immediate steps, evidence, police reports, medical care |
| Insurance issues | Filing claims, adjusters, denied claims, UM/UIM |
| Evidence & documentation | Photos, witnesses, medical records, police reports |
| Medical treatment | When to go, what to document, follow-up care |
| State-specific guidance | Laws, statutes of limitations, fault rules (by state) |
| Lawyer selection | How to choose, what to ask, when you need one |
| **Comparisons (NEW)** | Settlement vs. lawsuit, PI vs. workers comp, fault vs. no-fault |
| **Fault & liability (NEW)** | Am I at fault, comparative fault, shared fault rules |

### Cluster Architecture

Each cluster has:
1. **Pillar page** — comprehensive hub (e.g., `/accidents/car`)
2. **Spoke pages** — detailed sub-topics linking back to pillar
3. **Tool pages** — interactive tools related to the cluster
4. **Guide pages** — step-by-step how-to content
5. **Blog posts** — fresh, long-tail content feeding into the cluster

Google's official guidance favors original, substantial, useful content over content made primarily for rankings.

---

## 2. Google AI Overviews (SGE) Strategy

**Google's AI Overviews now appear above organic results for most PI informational queries.** This is not optional to address — it's the new reality of search.

### How AI Overviews Work for PI Queries

For queries like "what to do after a car accident," Google generates an AI summary that:
- Pulls from multiple high-authority sources
- Provides numbered step-by-step answers
- Links to cited sources below the summary
- Often eliminates the need to click through for simple questions

### How to Get Cited in AI Overviews

1. **Structure content for extraction:**
   - Use clear, numbered step lists (AI Overviews prefer steps)
   - Start sections with direct definitions ("Comparative fault is...")
   - Use tables for state-specific data (statutes, deadlines)
   - Use `<h2>` and `<h3>` headings that match common questions exactly

2. **Be the most authoritative source:**
   - Attorney review badges on every page (E-E-A-T signals)
   - Cite official sources (state statutes, NHTSA data, bar association rules)
   - Include original data or statistics not available elsewhere
   - Keep content fresh (quarterly review dates visible)

3. **Optimize for "beyond the overview" clicks:**
   - Provide value that AI cannot summarize: interactive tools, personalized quizzes, downloadable checklists
   - Use compelling meta descriptions that signal depth beyond the AI summary
   - Build brand recognition so users seek AccidentPath specifically

4. **Content formatting for AI citation:**
   ```
   ## What to Do Immediately After a Car Accident in California

   1. **Check for injuries and call 911** — California law requires...
   2. **Move to safety if possible** — Under CVC §20001...
   3. **Exchange information** — Get the other driver's...
   4. **Document everything** — Take photos of...
   5. **Contact your insurance** — California requires...
   ```
   AI Overviews prefer this exact format: clear heading (matching the query), numbered steps with bold lead-ins, and authoritative details.

5. **FAQ content blocks on hub pages:**
   While FAQ *schema* has limited value, FAQ *content blocks* on pages are highly cited by AI Overviews. Structure as:
   ```
   ## Frequently Asked Questions

   ### Do I need a lawyer after a car accident?
   [Direct 2-3 sentence answer first, then expanded context]

   ### How long do I have to file a claim in California?
   [Direct answer: "In California, the statute of limitations is 2 years..."]
   ```

### Monitor AI Overview Presence

- Track which target keywords trigger AI Overviews in GSC
- Monitor whether AccidentPath is cited in AI Overviews (use manual spot checks + third-party tools)
- Adjust content structure based on what format gets cited

---

## 3. Information Architecture

### Site Structure for SEO

```
Home
├── /accidents/          (pillar)
│   ├── /accidents/car   (hub)
│   ├── /accidents/truck  (hub)
│   └── ...
├── /injuries/           (pillar)
│   ├── /injuries/tbi    (hub)
│   └── ...
├── /guides/             (pillar)
│   ├── /guides/after-car-accident  (spoke)
│   ├── /guides/am-i-at-fault      (NEW — comparative fault)
│   ├── /guides/settlement-vs-lawsuit (NEW — comparison)
│   └── ...
├── /tools/              (pillar)
│   ├── /tools/evidence-checklist   (spoke)
│   ├── /tools/statute-countdown    (NEW — statute of limitations)
│   └── ...
├── /states/             (pillar)
│   ├── /states/california          (hub)
│   │   ├── /states/california/los-angeles (city)
│   │   ├── /states/california/san-diego   (city)
│   │   └── ...
│   ├── /states/arizona             (hub)
│   │   ├── /states/arizona/phoenix        (city)
│   │   └── ...
│   └── ...
├── /blog/               (NEW — fresh content)
│   ├── /blog/[slug]     (individual posts)
│   └── ...
├── /resources/          (pillar)
│   └── /resources/[slug] (downloadable PDFs)
├── /directory/          (attorney directory — Rogelio)
│   ├── /directory/[state]/[city]
│   └── /directory/[state]/[slug]   (attorney profiles)
├── /legal-funding/      (legal funding content)
└── /es/                 (Spanish — bilingual)
    ├── /es/accidentes/auto
    └── ...
```

### URL Rules
- Lowercase, hyphenated slugs
- No trailing slashes
- Max 3 levels deep
- Descriptive, keyword-aware (but not stuffed)

---

## 4. Structured Data Implementation

### Required Schema Types

| Schema Type | Where to Use | Priority |
|-------------|-------------|----------|
| `Organization` | Site-wide (header/footer) | Phase 2 |
| `BreadcrumbList` | Every page | Phase 2 |
| `Article` | Blog/guide content pages | Phase 2 |
| `HowTo` | Step-by-step guide pages | Phase 2 |
| `QAPage` | True Q&A content pages only | Phase 2 |
| `FAQPage` | Top 5 hub pages only (selective) | Phase 5 |
| `VideoObject` | Pages with embedded video | Phase 5 |
| `SoftwareApplication` | Injury Journal tool | Phase 4 |
| `LegalService` | Attorney directory profiles | Directory build |
| `Place` | City pages (local business schema) | Phase 5 |
| `LocalBusiness` | Only if physical office exists | Post-launch |
| `Review` | Only where real review content exists | Post-launch |

### Rules
- Use FAQ schema *selectively* on top 5 highest-volume hub pages — not every page
- Review markup ONLY when it accurately reflects actual review content
- Organization data helps Google understand the entity
- Every structured data claim must be verifiable on the page
- **Disclaimers should NOT be included in structured data answer text**
- `inLanguage` must be set on Spanish pages ("es" vs "en")
- All schema must be added during page template build (Phase 2), not bolted on later

### Technical Implementation (Next.js App Router)

```
Meta tags:      generateMetadata() per route segment
Structured data: <script type="application/ld+json"> in layout or page
Sitemap:         app/sitemap.ts (dynamic, partitioned by section)
Canonical:       Derived from route path, set in generateMetadata()
Hreflang:        Set in layout.tsx head for bilingual pages
Robots:          app/robots.ts
```

---

## 5. Trust Signals (E-E-A-T)

Google highlights E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) as major quality concepts. Especially important for legal content (YMYL).

### Required on Every Page

| Signal | Implementation |
|--------|---------------|
| Attorney review date | Badge: "Reviewed by [Name], Esq. — [Date]" |
| Medical reviewer date | Badge for medically sensitive content |
| Statute/agency citations | Link to official sources |
| Original visuals | Custom graphics, not stock photos |
| Case process explainers | Real-world process descriptions |
| Transparent authorship | Author bios with credentials |
| Page speed | Fast load times, strong Core Web Vitals |
| **Last updated date** | "Last updated: [Date]" on every content page |

### Author Pages
- Create `/about/[author-slug]` pages for all content authors
- Include credentials, expertise areas, review count
- Link from every article they've reviewed
- Add `Person` schema with `sameAs` links to LinkedIn, bar association profiles

### Entity SEO (Brand Authority)
- Consistent NAP (Name, Address, Phone) across all platforms
- Google Business Profile (even with virtual office address)
- Presence on legal directories: Avvo, Justia, LawInfo
- Mentions on local business directories: LA Chamber, Phoenix Chamber
- Wikipedia-eligible notability path (long-term goal)

---

## 6. Technical SEO Requirements

### Meta Tags
- Every page has unique `<title>` and `<meta description>`
- Title format: `{Page Title} | AccidentPath`
- Max title: 60 characters
- Max description: 155 characters
- Include primary keyword naturally
- **Never use templated descriptions** — pull actual page-specific details

### Heading Structure
- One `<h1>` per page
- Sequential heading hierarchy (h1 → h2 → h3)
- Keywords in headings where natural
- **Match `<h2>` headings to "People Also Ask" questions where possible**

### Internal Linking
- Every page links to at least 3 related pages
- Descriptive anchor text (not "click here")
- Breadcrumb navigation on all pages
- Related content sections at page bottom
- **Internal linking engine runs weekly to find orphan pages and suggest new links**

### Image Optimization
- WebP/AVIF format
- Descriptive `alt` text on all images
- Lazy loading for below-the-fold
- Responsive `srcset` for different viewports
- Explicit width/height to prevent CLS

### Performance Targets
- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s
- **Monitor field data (CrUX report) in addition to lab data (Lighthouse)**

### Sitemap & Robots
- XML sitemap at `/sitemap.xml` (partitioned: sitemap-pages.xml, sitemap-blog.xml, sitemap-directory.xml, sitemap-es.xml)
- Dynamic sitemap generation for all pages
- `robots.txt` allowing all crawlers
- Canonical URLs on every page
- **IndexNow integration via Vercel for instant indexation of new content**
- **Google Search Console: submit sitemap Day 1, URL inspect priority pages**

### New Site Indexation Plan
1. Submit sitemap to GSC immediately after launch
2. Use URL Inspection tool on top 10 priority pages
3. Monitor indexation rate weekly for first 3 months
4. Use IndexNow (Vercel integration) for all new blog posts
5. Track crawl budget usage in GSC → Settings → Crawl stats

---

## 7. Content Quality Standards

### Google's People-First Content Guidelines

Every piece of content must:

1. **Provide original, substantial value** — not thin rewrites
2. **Demonstrate first-hand expertise** — real process knowledge
3. **Have a clear primary purpose** — helping the user, not ranking
4. **Leave the reader satisfied** — complete answers, clear next steps
5. **Be reviewed by qualified humans** — attorney or medical review where applicable

### Minimum Content Depth

| Page Type | Minimum Word Count | Why |
|-----------|-------------------:|-----|
| Accident hub pages | 2,500 | Top-ranking PI hubs (Nolo, AllLaw) run 2,500-4,000 words |
| Guide pages | 1,500 | Must be comprehensive enough to answer the full question |
| Tool pages | 800 | Supporting content around the interactive tool |
| City pages | 1,200 | Must include unique local data (hospitals, courts, roads) |
| Blog posts | 1,000 | Long-tail answers need depth to rank |
| State pages | 2,000 | Comprehensive state law overview |
| Comparison pages | 1,500 | Must cover both sides thoroughly |

### Content Differentiation (What Makes Us Beat Nolo)

Each page must have AT LEAST 2 of these differentiators that no content-only site can match:

1. **Embedded interactive tool** — checklist, quiz, or calculator inline
2. **Attorney review badge with real name and date** — not "reviewed by our team"
3. **Downloadable PDF resource** — checklist, template, or guide
4. **Video explainer** (60-90 seconds) — embedded on page
5. **State-specific dynamic content** — auto-detects or lets user select state
6. **"Next step" personalization** — CTA adapts based on page context

### AI Content Policy
Google says AI-generated content is not inherently against its policies. The key issue is whether the content is helpful, reliable, and people-first. All AI-drafted content MUST be:
- Reviewed by a human expert (attorney for legal, medical pro for health)
- Enhanced with original insights and real-world knowledge
- Fact-checked against current laws and regulations
- Not published as-is without human review

---

## 8. Link Building Playbook

### Target: 50 Referring Domains in First 6 Months

### Linkable Assets to Build
- Interactive tools (checklist generators, calculators) — most linkable
- Original research / data studies (accident statistics by city/county)
- Comprehensive state-by-state guides
- Downloadable PDF resources
- Infographics on accident statistics
- **Statute of Limitations Countdown tool** — highly shareable

### Specific Link Building Tactics

| Tactic | Target Sites | Links Expected | Timeline |
|--------|-------------|---------------|----------|
| Legal directory listings | Justia, Avvo, LawInfo, HG.org | 5-10 | Month 1 |
| Local business directories | LA Chamber, Phoenix Chamber, BBB | 5-8 | Month 1 |
| Guest posts on legal blogs | Above the Law, Lawyerist, Attorney at Work | 3-5 | Month 2-4 |
| HARO/Connectively responses | Journalist requests for PI expert quotes | 5-10 | Ongoing |
| University law clinic resources | USC, UCLA, ASU law school resource pages | 2-3 | Month 3-6 |
| Consumer advocacy partnerships | Consumer Federation, NCLC | 2-3 | Month 3-6 |
| Local news features | LA Times, Phoenix New Times, local TV | 3-5 | Month 2-6 |
| Tool embeds/citations | Personal finance blogs, legal help sites | 5-10 | Month 3+ |
| Infographic outreach | Legal blogs, news sites, social media | 3-5 | Month 4+ |

### Authority Building
- Guest contributions on legal publications
- Partnerships with consumer advocacy organizations
- Local business partnerships in launch states
- Press coverage of tool launches
- **Google Business Profile** in each target city (even with virtual office)
- **Legal directory profiles** with consistent NAP data

---

## 9. Quarterly Content Freshness Schedule

| Quarter | Action |
|---------|--------|
| Q1 (launch) | All pages published with current data and attorney review |
| Q2 | Review all hub pages for law changes. Update statistics. Refresh attorney review dates. |
| Q3 | Full content audit: identify underperforming pages, update or consolidate. Add new comparison pages based on GSC query data. |
| Q4 | Annual review: update all state-specific content for any legislative changes. Refresh all city data. |

**Monthly:** Blog publishes 8-12 new posts targeting long-tail from Reddit harvester + news.
**Weekly:** GSC monitoring → optimize titles/descriptions on pages gaining impressions but low CTR.

---

## 10. SERP Competitor Analysis (Required)

Before launch, document the actual SERP landscape for the top 20 target keywords:

| Keyword | Pos 1 | Pos 2 | Pos 3 | SERP Features | AI Overview? |
|---------|-------|-------|-------|---------------|-------------|
| what to do after car accident | ? | ? | ? | FS, PAA, Video | Yes/No |
| car accident lawyer los angeles | ? | ? | ? | LSA, Local Pack, Ads | Yes/No |
| ... | ... | ... | ... | ... | ... |

**Key:** FS = Featured Snippet, PAA = People Also Ask, LSA = Local Service Ads

This analysis determines:
- Which keywords are realistic for a new domain (no AI Overview + low-DA competitors = opportunity)
- Which keywords need a different approach (video-first, tool-first, local-first)
- Which keywords to defer until domain authority builds

See: `docs/seo/SERP-ANALYSIS.md` (to be created by SEO Specialist)
