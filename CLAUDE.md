# AccidentPath — Claude Code Project Instructions

> Read this file before doing ANY work on this project.

## What This Is

AccidentPath (accidentpath.com) is a consumer-first personal injury guidance + attorney matching platform for California and Arizona. We help injured people get clear guidance after an accident, connect them with qualified attorneys, and generate revenue through attorney partnerships.

## Tech Stack (NON-NEGOTIABLE)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Deployment | Vercel |
| CMS | JSON content system (Zod validated) |
| Analytics | GA4 + Google Search Console + Microsoft Clarity |

## Project Structure

```
accident-path/
├── CLAUDE.md              ← You are here
├── docs/
│   ├── strategy/          ← All strategy docs (PRD, compliance, SEO, etc.)
│   └── competitors/       ← Competitor analysis files
├── scripts/               ← Notion DB scripts, automation
├── app/                   ← Next.js app routes (to be created)
├── components/            ← React components (to be created)
├── lib/                   ← Utilities, CMS loader, state rules (to be created)
├── types/                 ← Zod schemas (to be created)
└── content/               ← JSON CMS files (to be created)
```

## Strategy Docs (Read Before Building)

| Priority | File | What It Covers |
|----------|------|----------------|
| **READ FIRST** | `docs/strategy/COMPLIANCE.md` | Legal rules — HARD CONSTRAINTS for all content |
| **READ FIRST** | `docs/strategy/PRD.md` | Full product requirements |
| Architecture | `docs/strategy/SITE-ARCHITECTURE.md` | Routes, components, data models |
| Design | `docs/strategy/DESIGN-SYSTEM.md` | Brand feel, colors, typography |
| SEO | `docs/strategy/SEO-STRATEGY.md` | Topic clusters, schema, E-E-A-T |
| Content | `docs/strategy/CONTENT-PLAN.md` | Content modules, topic clusters |
| Tools | `docs/strategy/TOOLS-SPEC.md` | 10 interactive tool specifications |
| Plan | `docs/strategy/MASTER-PLAN.md` | Full implementation plan |

## Source of Truth

**Git repo is the single source of truth for all code and strategy docs.**
- **Repo:** `git@github.com:thecometcompanies/accident-path.git`
- **Never edit strategy docs in Google Drive** — only edit in this repo and push.
- **Notion** is for task tracking only (statuses, assignments, priorities).

## Task Tracking

All tasks are in the Notion Master Pipeline database.
- **Master Pipeline:** [Open](https://www.notion.so/346917dc7b8381e3be62dea1a5250217) (DB ID: `346917dc-7b83-81e3-be62-dea1a5250217`)
- **Phases:** [Open](https://www.notion.so/346917dc7b8381a382f9f9eaf51a875e) (DB ID: `346917dc-7b83-81a3-82f9-f9eaf51a875e`)
- **Notion page:** [AccidentPath](https://www.notion.so/m7dtla/LRS-AccidentPath-com-328917dc7b8380b29f18c67de494adc0)

Filter by Owner = "Claude" for autonomous tasks.
Each DEV-XX task has a full execution prompt in its Notion page body.

## Pending Work

See `PENDING.md` in the project root for the current list of unbuilt pages and missing Spanish translations.

**Important rule:** After completing any pending task, always ask the user before marking it as Live in Notion — they want to review the work first.

---

## Page Status Tracker

The **"Accident Path Website Pages"** Notion database (DB ID: `352917dc-7b83-8190-a9be-cecaf2b6df5d`) tracks the live/pending status of every page on the site. The database has **~96 rows**. Use it to answer questions like "what pages are still pending?" or "is the [X] page live?".

**Columns:**
| Column | What It Means |
|--------|---------------|
| Page Title | Human-readable page name |
| Route | English URL (e.g. `https://accident-path.vercel.app/accidents/car-accident`) |
| Status | `Live` (green) = built and deployed; `Coming Soon` (yellow) = planned but not built |
| Spanish Route | The `/es/...` equivalent URL |
| Spanish Status | `Live` / `Coming Soon` / `Not Started` for the Spanish version |
| Category | Homepage, Static, Hub, Accident, Injury, Tool, Guide, State, City, Lead Gen |
| Source File | The Next.js file that renders the page |

**How to query ALL rows (important — do not skip pagination):**

1. Call `mcp__notion__API-post-search` with:
   - `query`: `""` (empty string — do NOT pass a search term or you'll get a partial match)
   - `filter`: `{"property": "object", "value": "page"}`
   - `page_size`: `100`
2. From the results, keep only pages where `parent.database_id == "352917dc-7b83-8190-a9be-cecaf2b6df5d"` — the search returns pages from all databases in the workspace.
3. If the response has `has_more: true`, call again with `start_cursor` set to the `next_cursor` value to get the remaining rows.
4. Expect ~96 rows total across 1–2 pages of results. If you're seeing fewer than 50, you are missing rows — paginate or re-query.

**Searching for a specific page:** Use `mcp__notion__API-post-search` with the page name as `query` (e.g. `"Riverside"`) and `filter: {property: "object", value: "page"}`. Check the returned `Route` field to confirm it's a city/page match and not a hub or state page.

**Important:** The Notion database is a tracking layer — the real source of truth is the `content/` JSON files and `app/` route files. If accuracy matters, verify against the codebase after checking Notion.

**Known access limitation:** The Master Pipeline tasks DB (`346917dc-7b83-81e3-be62-dea1a5250217`) has NOT been shared with the Notion integration and will return 404. Only the "Accident Path Website Pages" DB is accessible.

## Rules

### ALWAYS
1. Read `docs/strategy/COMPLIANCE.md` before writing ANY user-facing copy
2. Use careful legal language — never imply legal advice
3. Include disclaimers on every page
4. Use Tailwind CSS only
5. JSON CMS for all content (never hardcode)
6. Target 90+ Lighthouse scores
7. Mobile-first, accessible (WCAG 2.2 AA)

### NEVER
1. Say "We recommend this lawyer" or "You have a case"
2. Give state-specific legal advice without counsel review
3. Present tools as legal advice engines
4. Hardcode content — use JSON CMS
5. Skip disclaimers on any page

### SAFE Language Patterns
```
"Based on what you told us, lawyers who typically handle matters like this include..."
"You may benefit from speaking with a lawyer experienced in..."
"This information is for educational purposes only and does not constitute legal advice."
```

## Build Commands

```bash
npm run dev      # Development
npm run build    # Build
npm run lint     # Lint
npx tsc --noEmit # Type check
```

## Slack Updates

Channel: `C0ATA1QUBRD`
Every 6 hours: task status check → next task posted to Slack.
