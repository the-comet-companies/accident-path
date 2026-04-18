# Value Creation Engine — Agent Roster + Traffic Automations

## THE PLAN

Three parallel tracks running simultaneously:

```
Track 1: BUILD THE SITE        → Agents ship pages, tools, components
Track 2: GROW FREE TRAFFIC     → Cron jobs publish content + monitor rankings
Track 3: CONVERT & MONETIZE    → Intake pipeline + attorney partner onboarding
```

---

## AGENT ROSTER — Who Does What

### Track 1: Build (One-Time Sprints)

| Agent | Type | Assignment | Deliverable |
|-------|------|-----------|-------------|
| `systems-architect` | Existing | Design component architecture, data models, state routing engine | Architecture doc + folder structure |
| `frontend-ux-specialist` | Existing | Build all page templates, components, intake wizard | Next.js pages + components |
| `senior-software-engineer` | Existing | Build tools (quiz, calculators, journal), API routes, Supabase schema | 10 interactive tools |
| `content-marketer-writer` | Existing | Write 25 cornerstone pages, disclaimers, trust copy | JSON content files |
| `seo-specialist` | Existing | Structured data, meta tags, sitemap, internal linking, schema.org | SEO infrastructure |
| `legal-compliance-checker` | Existing | Review ALL user-facing copy against COMPLIANCE.md | Compliance audit reports |
| `qa-test-engineer` | Existing | Test intake flows, tools, mobile, accessibility | Test results + fixes |
| `performance-optimizer` | Existing | Lighthouse 90+, Core Web Vitals, bundle optimization | Performance audit |
| `design-guardian` | Existing | Enforce design system consistency across all pages | Design review |

### Track 2: Grow (Recurring Automations)

| Agent | Type | Assignment | Frequency |
|-------|------|-----------|-----------|
| `content-marketer-writer` | Existing | Generate new spoke articles for topic clusters | 3x/week |
| `seo-specialist` | Existing | Monitor rankings, find keyword gaps, update pages | Weekly |
| `deep-research-specialist` | Existing | Research trending accident/injury topics for fresh content | Weekly |
| `competitive-intelligence-mx` | Existing | Monitor competitor LRS sites for new features/content | Bi-weekly |
| `reddit-intelligence-mx` | Existing | Find PI/accident questions on Reddit → content ideas | Daily |
| `trend-researcher` | Existing | Track trending accident news → timely content | Daily |

### Track 3: Convert (Revenue Operations)

| Agent | Type | Assignment | Frequency |
|-------|------|-----------|-----------|
| `customer-acquisition-gr` | Existing | Optimize intake funnel, A/B test CTAs | Weekly |
| `partnership-strategist-gr` | Existing | Identify and pitch PI attorney partners | Ongoing |
| `analytics-reporter` | Existing | Traffic + conversion reporting, lead quality metrics | Weekly |
| `retention-specialist-gr` | Existing | Follow-up sequences, re-engagement | Ongoing |
| `sales-engineer-gr` | Existing | Build partner attorney dashboard/portal | One-time |

---

## CRON JOBS — Free Traffic Engine

### Job 1: Reddit Question Harvester
**Schedule:** Every day at 7am
**What it does:** Scans Reddit (r/legaladvice, r/personalinjury, r/insurance, r/caraccidents) for questions people are asking. Saves topics as content briefs.
**Why:** Every Reddit question = a long-tail keyword people are actually searching. Content that answers these questions ranks.

### Job 2: Content Generator
**Schedule:** Mon/Wed/Fri at 9am
**What it does:** Takes content briefs from the harvester, generates draft articles using AI, flags them for human/attorney review, saves to content queue.
**Why:** 3 articles/week = 156 articles/year. Each one targets a long-tail keyword cluster. Compound traffic growth.

### Job 3: GSC Ranking Monitor
**Schedule:** Every Monday at 8am
**What it does:** Pulls Google Search Console data, identifies pages losing rankings, pages gaining impressions but low CTR, and new keyword opportunities. Creates optimization tasks.
**Why:** React to ranking changes before you lose traffic. Optimize titles/descriptions for CTR.

### Job 4: Competitor Content Monitor
**Schedule:** Every Wednesday at 6am
**What it does:** Crawls the 9 competitor LRS sites (1000Attorneys, LegalMatch, etc.) for new pages/content. Identifies gaps where we can create better content.
**Why:** If a competitor publishes "truck accident guide" and we don't have one, that's a gap. Stay ahead.

### Job 5: Accident News Newsjacker
**Schedule:** Every day at 6am
**What it does:** Searches Google News for major accidents, new laws, insurance changes. Creates timely content briefs for "newsjacking" — publishing relevant content while a topic is trending.
**Why:** News-driven content gets immediate traffic spikes and backlinks from news aggregators.

### Job 6: Internal Link Optimizer
**Schedule:** Every Sunday at 10pm
**What it does:** Audits the site's internal linking structure. Finds orphan pages (no links pointing to them), finds pages with too few internal links, suggests new cross-links.
**Why:** Internal linking is one of the highest-ROI SEO activities. Google discovers and ranks pages faster when they're well-linked.

### Job 7: Content Freshness Updater
**Schedule:** 1st of every month at 8am
**What it does:** Identifies content older than 90 days, checks if laws/statutes cited are still current, flags pages for refresh, updates "last reviewed" dates.
**Why:** Google rewards fresh, accurate content. Stale legal info is a liability AND a ranking killer.

### Job 8: Social Proof Collector
**Schedule:** Every Friday at 3pm
**What it does:** Checks for new reviews/mentions of the brand online. Aggregates positive feedback for trust modules on the site. Alerts on negative mentions.
**Why:** Trust signals improve conversion AND E-E-A-T signals for Google.

---

## EXECUTION ORDER

### Week 1-2: Foundation Sprint

```
Day 1:  systems-architect    → Design architecture, set up Next.js project
Day 2:  frontend-ux-specialist → Build component library + layout
Day 3:  senior-software-engineer → Set up Supabase, API routes, data models
Day 4:  frontend-ux-specialist → Build page templates (accident hub, tool, guide)
Day 5:  content-marketer-writer → Write home page + about page + disclaimers
Day 6:  seo-specialist         → Implement structured data, sitemap, meta tags
Day 7:  legal-compliance-checker → First compliance review pass
```

### Week 3-4: Content + Tools Sprint

```
Week 3: content-marketer-writer → Write 5 accident hubs + 5 guides
         senior-software-engineer → Build 5 core tools
         seo-specialist → Internal linking + schema per page

Week 4: content-marketer-writer → Write 3 state pages + resources
         frontend-ux-specialist → Build intake wizard
         qa-test-engineer → Full QA pass
         performance-optimizer → Lighthouse audit + fixes
```

### Week 5: Launch + Activate Crons

```
Day 29: Deploy to Vercel
Day 30: Connect analytics, Search Console, heatmaps
Day 31: Activate ALL cron jobs
Day 32: legal-compliance-checker → Final compliance audit
Day 33: Start partner attorney outreach
Day 34: Monitor first week of data
Day 35: First optimization cycle
```

---

## FREE TRAFFIC FLYWHEEL

```
Reddit Questions → Content Briefs → AI Draft → Attorney Review → Publish
       ↑                                                            |
       |                                                            ↓
  More Questions ← More Authority ← More Rankings ← More Content
```

The flywheel compounds:
- More content → more keywords ranked → more traffic
- More traffic → more leads → more attorney partners
- More partners → more revenue → more content investment
- Better content → higher E-E-A-T → better rankings

### Traffic Projections (Conservative)

| Month | Pages | Estimated Monthly Organic Sessions |
|-------|-------|------------------------------------|
| Month 1 | 25 pages + 5 tools | 500-1,000 |
| Month 3 | 75 pages + 10 tools | 3,000-8,000 |
| Month 6 | 150+ pages + 10 tools | 15,000-30,000 |
| Month 12 | 300+ pages + 15 tools | 50,000-100,000 |

PI keywords have high CPCs ($50-200+), so even modest organic traffic is extremely valuable. 1,000 organic visits/month at $100 CPC = $100K in equivalent paid value.

---

## N8N WORKFLOWS TO BUILD

These cron jobs need real n8n workflows for persistent, reliable execution:

| Workflow | Trigger | Key Nodes |
|----------|---------|-----------|
| `legal-leads-reddit-harvester` | Schedule (daily 7am) | Reddit API → Filter PI topics → Save to Notion DB |
| `legal-leads-content-generator` | Schedule (MWF 9am) | Read briefs → AI draft → Save draft → Slack notify |
| `legal-leads-gsc-monitor` | Schedule (Mon 8am) | GSC API → Analyze rankings → Create tasks → Slack report |
| `legal-leads-competitor-watch` | Schedule (Wed 6am) | Crawl competitor sites → Diff check → Alert on new content |
| `legal-leads-news-scanner` | Schedule (daily 6am) | Google News API → Filter accidents/law → Create briefs |
| `legal-leads-link-auditor` | Schedule (Sun 10pm) | Crawl site → Check internal links → Create optimization tasks |
| `legal-leads-freshness-check` | Schedule (1st monthly) | Check content dates → Flag stale → Create refresh tasks |
| `legal-leads-social-monitor` | Schedule (Fri 3pm) | Brand mentions → Sentiment analysis → Slack alert |

---

## WHAT CREATES VALUE

| Value Driver | How | Who |
|-------------|-----|-----|
| **Organic traffic** | 300+ pages of PI content ranking on Google | Content + SEO crons |
| **Lead quality** | Smart intake wizard qualifies leads before attorney handoff | senior-software-engineer |
| **Attorney revenue** | $50-200+ per qualified lead × volume | partnership-strategist |
| **Tool stickiness** | Users bookmark and return for journal, checklists | frontend-ux-specialist |
| **Compliance moat** | Properly certified LRS = barrier to entry | legal-compliance-checker |
| **Data advantage** | Intake data improves matching over time | analytics-reporter |
| **Brand trust** | Attorney-reviewed content + real tools = E-E-A-T | content-marketer-writer |
