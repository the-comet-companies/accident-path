# SEO Strategy

> You cannot guarantee "#1," and nobody honest should. But you can build a site that
> has a real chance to compete by doing the following.

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

### Cluster Architecture

Each cluster has:
1. **Pillar page** — comprehensive hub (e.g., `/accidents/car`)
2. **Spoke pages** — detailed sub-topics linking back to pillar
3. **Tool pages** — interactive tools related to the cluster
4. **Guide pages** — step-by-step how-to content

Google's official guidance favors original, substantial, useful content over content made primarily for rankings.

---

## 2. Information Architecture

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
│   └── ...
├── /tools/              (pillar)
│   ├── /tools/evidence-checklist   (spoke)
│   └── ...
├── /states/             (pillar)
│   ├── /states/california          (hub)
│   └── ...
└── /resources/          (pillar)
```

### URL Rules
- Lowercase, hyphenated slugs
- No trailing slashes
- Max 3 levels deep
- Descriptive, keyword-aware (but not stuffed)

---

## 3. Structured Data Implementation

### Required Schema Types

| Schema Type | Where to Use |
|-------------|-------------|
| `Organization` | Site-wide (header/footer) |
| `BreadcrumbList` | Every page |
| `QAPage` | True Q&A content pages only |
| `LocalBusiness` | Only if physical office exists |
| `Review` | Only where real review content exists |
| `Article` | Blog/guide content pages |
| `HowTo` | Step-by-step guide pages |

### Rules
- Do NOT over-invest in FAQ rich results — Google has limited FAQ rich results
- Review markup ONLY when it accurately reflects actual review content
- Organization data helps Google understand the entity
- Every structured data claim must be verifiable on the page

---

## 4. Trust Signals (E-E-A-T)

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

### Author Pages
- Create `/about/[author-slug]` pages for all content authors
- Include credentials, expertise areas, review count
- Link from every article they've reviewed

---

## 5. Technical SEO Requirements

### Meta Tags
- Every page has unique `<title>` and `<meta description>`
- Title format: `{Page Title} | {Brand Name}`
- Max title: 60 characters
- Max description: 155 characters
- Include primary keyword naturally

### Heading Structure
- One `<h1>` per page
- Sequential heading hierarchy (h1 → h2 → h3)
- Keywords in headings where natural

### Internal Linking
- Every page links to at least 3 related pages
- Descriptive anchor text (not "click here")
- Breadcrumb navigation on all pages
- Related content sections at page bottom

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

### Sitemap & Robots
- XML sitemap at `/sitemap.xml`
- Dynamic sitemap generation for all pages
- `robots.txt` allowing all crawlers
- Canonical URLs on every page

---

## 6. Content Quality Standards

### Google's People-First Content Guidelines

Every piece of content must:

1. **Provide original, substantial value** — not thin rewrites
2. **Demonstrate first-hand expertise** — real process knowledge
3. **Have a clear primary purpose** — helping the user, not ranking
4. **Leave the reader satisfied** — complete answers, clear next steps
5. **Be reviewed by qualified humans** — attorney or medical review where applicable

### AI Content Policy
Google says AI-generated content is not inherently against its policies. The key issue is whether the content is helpful, reliable, and people-first. All AI-drafted content MUST be:
- Reviewed by a human expert (attorney for legal, medical pro for health)
- Enhanced with original insights and real-world knowledge
- Fact-checked against current laws and regulations
- Not published as-is without human review

---

## 7. Link Building Strategy

### Linkable Assets to Build
- Interactive tools (checklist generators, calculators)
- Original research / data studies
- Comprehensive state-by-state guides
- Downloadable PDF resources
- Infographics on accident statistics

### Authority Building
- Guest contributions on legal publications
- Partnerships with consumer advocacy organizations
- Local business partnerships in launch states
- Press coverage of tool launches
