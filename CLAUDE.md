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

## Task Tracking

All tasks are in the Notion Master Pipeline database.
- **DB ID:** `346917dc-7b83-81e3-be62-dea1a5250217`
- **Phases DB:** `346917dc-7b83-81a3-82f9-f9eaf51a875e`

Filter by Owner = "Claude" for autonomous tasks.
Each DEV-XX task has a full execution prompt in its Notion page body.

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
