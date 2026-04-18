# AccidentPath

> The most useful, trustworthy accident guidance and attorney-matching website on the internet.

**Domain:** accidentpath.com | **Backup:** injuryready.com
**States:** California + Arizona | **Cities:** 16 target metros

## Quick Start

```bash
git clone git@github.com:thecometcompanies/accident-path.git
cd accident-path
npm install
npm run dev
```

## Project Status

- **Phase:** Pre-development (strategy complete, dev tasks ready)
- **Tasks:** 221 items in [Notion Master Pipeline](https://www.notion.so/346917dc7b8381e3be62dea1a5250217)
- **Dev Sprint:** 28 tasks with full execution prompts
- **Strategy Docs:** 22 documents in `docs/`

## Documentation

| Doc | Location |
|-----|----------|
| Project instructions (Claude Code) | `CLAUDE.md` |
| Product requirements | `docs/strategy/PRD.md` |
| Legal compliance (READ FIRST) | `docs/strategy/COMPLIANCE.md` |
| Site architecture | `docs/strategy/SITE-ARCHITECTURE.md` |
| Design system | `docs/strategy/DESIGN-SYSTEM.md` |
| SEO strategy | `docs/strategy/SEO-STRATEGY.md` |
| Implementation plan | `docs/strategy/MASTER-PLAN.md` |
| Competitor analysis | `docs/competitors/` |

## Tech Stack

Next.js 14+ App Router, TypeScript (strict), Tailwind CSS, Supabase, Vercel

## Joner's Workflow — How to Run Tasks

### Setup (one time)

```bash
# 1. Clone the repo
git clone git@github.com:thecometcompanies/accident-path.git
cd accident-path

# 2. Make sure Claude Code is installed
# https://docs.anthropic.com/en/docs/claude-code

# 3. Open the Notion Master Pipeline
# https://www.notion.so/346917dc7b8381e3be62dea1a5250217
# Create a "Focus" view filtered by Status = Focus
```

### Daily Workflow

```
1. OPEN NOTION → Master Pipeline → filter Status = "Focus"
   These are the tasks to work on NOW.

2. PICK THE FIRST TASK (lowest DEV number)
   Example: "DEV-01: Init Next.js 14 + TS + Tailwind project"

3. CLICK THE TASK → read the execution prompt in the page body
   It tells you exactly what to build, which files to create,
   and how to verify it works.

4. OPEN TERMINAL → cd into the repo

5. START CLAUDE CODE:
   claude

6. TELL CLAUDE WHAT TO DO:
   "Read CLAUDE.md, then execute DEV-01: Initialize the Next.js
   project with TypeScript and Tailwind. Follow the execution
   prompt exactly."

   Or paste the execution prompt directly from Notion.

7. REVIEW CLAUDE'S WORK
   - Does it match the acceptance criteria?
   - Does npm run build pass?
   - Does npx tsc --noEmit pass?

8. COMMIT + PUSH:
   git add -A
   git commit -m "feat: DEV-01 — init Next.js project"
   git push

9. MARK DONE IN NOTION:
   Set Status → Done on the task
   Move to the next task
```

### Task Status Guide

| Status | What It Means | Action |
|--------|--------------|--------|
| **Focus** | Work on this NOW | Pick it up |
| **Ready** | Can start after Focus items are done | Wait |
| **Blocked** | Waiting on something (counsel, LLC, etc.) | Skip, unblock later |
| **Next Up** | Post-launch, not yet | Ignore for now |
| **Resource** | Reference material | Read when needed |
| **Done** | Shipped | Nothing to do |

### Owner Guide

| Owner | What It Means |
|-------|--------------|
| **Claude** | Claude Code can handle this autonomously — just paste the prompt |
| **Joner → Claude** | Read the task first, add any context needed, then pass to Claude |
| **Michael** | Business task — Michael handles directly |
| **Rogelio** | Attorney directory — Rogelio's scope |
| **Legal Counsel** | Needs attorney review before it can ship |

### Key Files Claude Needs

When you start Claude Code, it reads `CLAUDE.md` automatically. But for specific tasks, Claude may need to read additional docs. The execution prompt will tell you which ones:

| Reference | Repo Path |
|-----------|-----------|
| Project instructions | `CLAUDE.md` |
| Legal compliance rules | `docs/strategy/COMPLIANCE.md` |
| Product requirements | `docs/strategy/PRD.md` |
| Site architecture | `docs/strategy/SITE-ARCHITECTURE.md` |
| Design system | `docs/strategy/DESIGN-SYSTEM.md` |
| SEO strategy | `docs/strategy/SEO-STRATEGY.md` |
| Content plan | `docs/strategy/CONTENT-PLAN.md` |
| Tool specifications | `docs/strategy/TOOLS-SPEC.md` |

### Automated Updates

A Slack routine checks Notion every 6 hours and posts the next unblocked task to `#accidentpath` (channel C0ATA1QUBRD). If you're not sure what to work on, check Slack.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| Claude doesn't know the project context | Make sure you're in the `accident-path/` directory — it reads `CLAUDE.md` automatically |
| Build fails | Run `npm run build` to see errors. Ask Claude to fix them. |
| Task is blocked | Check the Dependencies field in Notion. Complete the dependency first. |
| Not sure which task is next | Filter Notion: Status = Focus, sort by Name ascending |
| Claude writes prohibited language | It should read COMPLIANCE.md first. If it doesn't, tell it: "Read docs/strategy/COMPLIANCE.md before writing any content" |

## Team

| Role | Person |
|------|--------|
| Business / Approvals | Michael |
| Project Oversight | Joner |
| Primary Builder | Claude Code |
| Attorney Directory | Rogelio |
| Legal Review | TBD |
