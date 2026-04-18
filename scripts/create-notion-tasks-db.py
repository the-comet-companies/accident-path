#!/usr/bin/env python3
"""
Create AccidentPath Tasks Database in Notion + populate with all project tasks.
Run: python3 scripts/create-notion-tasks-db.py
"""

import json
import os
import sys
import time
import requests

# ── Config ──────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
WORKSPACE_DIR = os.path.dirname(os.path.dirname(PROJECT_DIR))

# Load .env
env_path = os.path.join(WORKSPACE_DIR, ".env")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip())

NOTION_API_KEY = os.environ.get("NOTION_API_KEY")
if not NOTION_API_KEY:
    print("ERROR: NOTION_API_KEY not found in environment or .env")
    sys.exit(1)

PARENT_PAGE_ID = "328917dc7b8380b29f18c67de494adc0"  # AccidentPath Notion page
NOTION_VERSION = "2022-06-28"
HEADERS = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
}
BASE_URL = "https://api.notion.com/v1"


# ── Helpers ─────────────────────────────────────────────────────────────────
def notion_request(method, endpoint, data=None):
    url = f"{BASE_URL}/{endpoint}"
    resp = requests.request(method, url, headers=HEADERS, json=data)
    if resp.status_code >= 400:
        print(f"ERROR {resp.status_code}: {resp.text[:500]}")
        return None
    return resp.json()


def create_database():
    """Create the tasks database under the AccidentPath page."""
    payload = {
        "parent": {"type": "page_id", "page_id": PARENT_PAGE_ID},
        "title": [{"type": "text", "text": {"content": "AccidentPath Project Tasks"}}],
        "icon": {"type": "emoji", "emoji": "✅"},
        "properties": {
            "Task": {"title": {}},
            "Phase": {
                "select": {
                    "options": [
                        {"name": "Phase 0: Bootstrap", "color": "gray"},
                        {"name": "Phase 1: Design System", "color": "purple"},
                        {"name": "Phase 2: Page Templates", "color": "blue"},
                        {"name": "Phase 3: Intake + Rules", "color": "green"},
                        {"name": "Phase 4: Tools", "color": "yellow"},
                        {"name": "Phase 5: Content", "color": "orange"},
                        {"name": "Phase 6: SEO", "color": "red"},
                        {"name": "Phase 7: Integrations", "color": "pink"},
                        {"name": "Phase 8: QA + Launch", "color": "brown"},
                        {"name": "Phase 9: Post-Launch", "color": "default"},
                        {"name": "Business/Legal", "color": "gray"},
                    ]
                }
            },
            "Workstream": {
                "select": {
                    "options": [
                        {"name": "Development", "color": "blue"},
                        {"name": "Design", "color": "purple"},
                        {"name": "Content", "color": "green"},
                        {"name": "SEO", "color": "orange"},
                        {"name": "Legal/Compliance", "color": "red"},
                        {"name": "Business Ops", "color": "gray"},
                        {"name": "Integrations", "color": "pink"},
                        {"name": "QA/Testing", "color": "brown"},
                        {"name": "Marketing", "color": "yellow"},
                    ]
                }
            },
            "Owner": {
                "select": {
                    "options": [
                        {"name": "Michael", "color": "blue"},
                        {"name": "Developer", "color": "purple"},
                        {"name": "Content Writer", "color": "green"},
                        {"name": "SEO Specialist", "color": "orange"},
                        {"name": "Legal Counsel", "color": "red"},
                        {"name": "Designer", "color": "pink"},
                        {"name": "QA Engineer", "color": "brown"},
                        {"name": "Rogelio", "color": "yellow"},
                        {"name": "Claude", "color": "gray"},
                    ]
                }
            },
            "Priority": {
                "select": {
                    "options": [
                        {"name": "P0 — Critical", "color": "red"},
                        {"name": "P1 — High", "color": "orange"},
                        {"name": "P2 — Medium", "color": "yellow"},
                        {"name": "P3 — Low", "color": "gray"},
                    ]
                }
            },
            "Status": {
                "select": {
                    "options": [
                        {"name": "Not Started", "color": "default"},
                        {"name": "In Progress", "color": "blue"},
                        {"name": "Blocked", "color": "red"},
                        {"name": "In Review", "color": "yellow"},
                        {"name": "Done", "color": "green"},
                    ]
                }
            },
            "Est. Hours": {"number": {"format": "number"}},
            "Target Date": {"date": {}},
            "Dependencies": {"rich_text": {}},
            "State": {
                "multi_select": {
                    "options": [
                        {"name": "CA", "color": "blue"},
                        {"name": "AZ", "color": "orange"},
                        {"name": "Both", "color": "green"},
                    ]
                }
            },
            "Notes": {"rich_text": {}},
        },
    }
    result = notion_request("POST", "databases", payload)
    if result:
        print(f"✅ Database created: {result['id']}")
        print(f"   URL: {result.get('url', 'N/A')}")
    return result


def add_task(db_id, task):
    """Add a single task to the database."""
    properties = {
        "Task": {"title": [{"text": {"content": task["name"]}}]},
        "Phase": {"select": {"name": task["phase"]}},
        "Workstream": {"select": {"name": task["workstream"]}},
        "Owner": {"select": {"name": task["owner"]}},
        "Priority": {"select": {"name": task["priority"]}},
        "Status": {"select": {"name": "Not Started"}},
    }

    if task.get("hours"):
        properties["Est. Hours"] = {"number": task["hours"]}

    if task.get("dependencies"):
        properties["Dependencies"] = {
            "rich_text": [{"text": {"content": task["dependencies"]}}]
        }

    if task.get("state"):
        properties["State"] = {
            "multi_select": [{"name": s} for s in task["state"]]
        }

    if task.get("notes"):
        properties["Notes"] = {
            "rich_text": [{"text": {"content": task["notes"]}}]
        }

    payload = {"parent": {"database_id": db_id}, "properties": properties}
    return notion_request("POST", "pages", payload)


# ── Task Definitions ────────────────────────────────────────────────────────
# Every task that needs delegation across the team

TASKS = [
    # ═══════════════════════════════════════════════════════════════════════
    # BUSINESS / LEGAL (Michael + Legal Counsel)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Register AccidentPath LLC (CA Secretary of State)",
        "phase": "Business/Legal",
        "workstream": "Business Ops",
        "owner": "Michael",
        "priority": "P0 — Critical",
        "hours": 2,
        "notes": "Form entity at bizfileOnline.sos.ca.gov",
    },
    {
        "name": "Email LRS@calbar.ca.gov for CA certification application",
        "phase": "Business/Legal",
        "workstream": "Legal/Compliance",
        "owner": "Michael",
        "priority": "P0 — Critical",
        "hours": 1,
        "notes": "Required for CA lawyer referral operations. See COMPLIANCE.md Lane B.",
    },
    {
        "name": "Retain legal ethics counsel (PI / LRS specialist)",
        "phase": "Business/Legal",
        "workstream": "Legal/Compliance",
        "owner": "Michael",
        "priority": "P0 — Critical",
        "hours": 4,
        "notes": "Must review all state content, disclaimers, and routing rules before launch",
    },
    {
        "name": "Draft privacy policy, terms of service, disclaimer language",
        "phase": "Business/Legal",
        "workstream": "Legal/Compliance",
        "owner": "Legal Counsel",
        "priority": "P0 — Critical",
        "hours": 8,
        "dependencies": "Retain legal ethics counsel",
        "notes": "See COMPLIANCE.md §4 for required disclaimer templates",
    },
    {
        "name": "Map AZ compliance rules (ABS framework, advertising, UPL)",
        "phase": "Business/Legal",
        "workstream": "Legal/Compliance",
        "owner": "Legal Counsel",
        "priority": "P0 — Critical",
        "hours": 6,
        "state": ["AZ"],
        "notes": "AZ is favorable (ABS exists) but still needs specific legal review",
    },
    {
        "name": "Map CA compliance rules (LRS certification, fee-sharing)",
        "phase": "Business/Legal",
        "workstream": "Legal/Compliance",
        "owner": "Legal Counsel",
        "priority": "P0 — Critical",
        "hours": 6,
        "state": ["CA"],
        "notes": "B&P Code §§6155-6156. See LRS-Rules.pdf",
    },
    {
        "name": "Draft panel agreement template (attorney partner contract)",
        "phase": "Business/Legal",
        "workstream": "Business Ops",
        "owner": "Legal Counsel",
        "priority": "P1 — High",
        "hours": 6,
        "dependencies": "Retain legal ethics counsel",
        "notes": "20% fee structure per BUSINESS-CONTEXT.md",
    },
    {
        "name": "Recruit 5 PI attorneys in Los Angeles metro",
        "phase": "Business/Legal",
        "workstream": "Business Ops",
        "owner": "Michael",
        "priority": "P1 — High",
        "hours": 10,
        "state": ["CA"],
        "dependencies": "Draft panel agreement template",
    },
    {
        "name": "Recruit 5 PI attorneys in Phoenix metro",
        "phase": "Business/Legal",
        "workstream": "Business Ops",
        "owner": "Michael",
        "priority": "P1 — High",
        "hours": 10,
        "state": ["AZ"],
        "dependencies": "Draft panel agreement template",
    },
    {
        "name": "Set up business bank account + Stripe for partner billing",
        "phase": "Business/Legal",
        "workstream": "Business Ops",
        "owner": "Michael",
        "priority": "P1 — High",
        "hours": 3,
        "dependencies": "Register AccidentPath LLC",
    },
    {
        "name": "Establish Rock Point Legal Funding partnership",
        "phase": "Business/Legal",
        "workstream": "Business Ops",
        "owner": "Michael",
        "priority": "P2 — Medium",
        "hours": 4,
        "notes": "rockpointlegalfunding.com — already offers Spanish support",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 0: PROJECT BOOTSTRAP (Developer + Claude)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Initialize Next.js 14 App Router + TS + Tailwind project",
        "phase": "Phase 0: Bootstrap",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 2,
        "notes": "App Router, TypeScript strict, Tailwind CSS, ESLint, Prettier",
    },
    {
        "name": "Create Vercel project + connect GitHub repo + preview deploys",
        "phase": "Phase 0: Bootstrap",
        "workstream": "Development",
        "owner": "Developer",
        "priority": "P0 — Critical",
        "hours": 1,
        "dependencies": "Initialize Next.js project",
    },
    {
        "name": "Create Supabase project + initial schema (leads, intake_sessions, states, attorneys)",
        "phase": "Phase 0: Bootstrap",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
    },
    {
        "name": "Set up CI pipeline (lint, typecheck, next build, Lighthouse CI)",
        "phase": "Phase 0: Bootstrap",
        "workstream": "Development",
        "owner": "Developer",
        "priority": "P1 — High",
        "hours": 3,
        "dependencies": "Initialize Next.js project",
    },
    {
        "name": "Configure GA4 + Google Search Console + env vars",
        "phase": "Phase 0: Bootstrap",
        "workstream": "Integrations",
        "owner": "Michael",
        "priority": "P1 — High",
        "hours": 2,
    },
    {
        "name": "Set up folder structure per SITE-ARCHITECTURE.md",
        "phase": "Phase 0: Bootstrap",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 1,
        "notes": "components/{layout,ui,content,intake,seo}, lib/, content/, types/",
    },
    {
        "name": "Create TypeScript data models (Zod schemas for all content types)",
        "phase": "Phase 0: Bootstrap",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
        "notes": "accident.ts, injury.ts, state.ts, intake.ts, attorney.ts, content.ts, tool.ts",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 1: DESIGN SYSTEM + CMS + COMPLIANCE PRIMITIVES
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Define Tailwind theme tokens (colors, type scale, radii, shadows)",
        "phase": "Phase 1: Design System",
        "workstream": "Design",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 2,
        "notes": "Deep navy primary, warm amber accent. See DESIGN-SYSTEM.md",
    },
    {
        "name": "Build Header component (mega-menu with accident types, responsive)",
        "phase": "Phase 1: Design System",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
    },
    {
        "name": "Build Footer component (full disclaimers, link columns, trust badges)",
        "phase": "Phase 1: Design System",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
        "notes": "Must include COMPLIANCE.md §4 every-page disclaimer",
    },
    {
        "name": "Build MobileNav component (hamburger, bottom CTA bar)",
        "phase": "Phase 1: Design System",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
    },
    {
        "name": "Build core UI components (CTAButton, TrustBadge, DisclaimerBanner, EmergencyBanner, Breadcrumb)",
        "phase": "Phase 1: Design System",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
    },
    {
        "name": "Build StateSelector component (dropdown for CA + AZ cities)",
        "phase": "Phase 1: Design System",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P1 — High",
        "hours": 2,
        "state": ["Both"],
    },
    {
        "name": "Build JSON CMS loader (lib/cms.ts reading content/*.json with Zod validation)",
        "phase": "Phase 1: Design System",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
    },
    {
        "name": "Build SEO primitives (SchemaOrg, MetaTags, CanonicalUrl components)",
        "phase": "Phase 1: Design System",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
    },
    {
        "name": "Build Compliance wrapper HOC (auto-inject disclaimers per route type)",
        "phase": "Phase 1: Design System",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 2,
        "notes": "See COMPLIANCE.md for disclaimer text per page type",
    },
    {
        "name": "Set up next-intl for i18n scaffolding (en default, es future)",
        "phase": "Phase 1: Design System",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P2 — Medium",
        "hours": 2,
        "notes": "Wire from day one per SPANISH-STRATEGY.md to avoid retrofits",
    },
    {
        "name": "Create brand logo + icon set (accident types, injuries, trust signals)",
        "phase": "Phase 1: Design System",
        "workstream": "Design",
        "owner": "Designer",
        "priority": "P1 — High",
        "hours": 12,
        "notes": "Lucide or Heroicons for UI. Custom icons for accident types. Premium feel.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 2: PAGE TEMPLATES
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Build Home page template (hero, trust, how-it-works, category grid, tools, state selector)",
        "phase": "Phase 2: Page Templates",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 6,
        "dependencies": "Phase 1 complete",
    },
    {
        "name": "Build Accident Hub template (/accidents/[slug]) — CMS-driven",
        "phase": "Phase 2: Page Templates",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 5,
        "notes": "Common causes, injuries, steps, evidence checklist, timeline, insurance, lawyer CTA",
    },
    {
        "name": "Build Injury template (/injuries/[slug]) — CMS-driven",
        "phase": "Phase 2: Page Templates",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P1 — High",
        "hours": 3,
    },
    {
        "name": "Build Guide template (/guides/[slug]) — CMS-driven",
        "phase": "Phase 2: Page Templates",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
    },
    {
        "name": "Build State template (/states/[state]) with reviewedBy/reviewDate gate",
        "phase": "Phase 2: Page Templates",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
        "notes": "Must refuse to build if reviewedBy + reviewDate missing from JSON",
    },
    {
        "name": "Build City template (/states/[state]/[city]) with local data requirements",
        "phase": "Phase 2: Page Templates",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
        "state": ["Both"],
        "notes": "Local hospitals, courts, accident stats. Zod requires min word count + unique fields",
    },
    {
        "name": "Build Tool template (/tools/[slug]) wrapping ToolEngine",
        "phase": "Phase 2: Page Templates",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
    },
    {
        "name": "Build static pages (About, How It Works, Privacy, Terms, Disclaimers, For Attorneys, Contact)",
        "phase": "Phase 2: Page Templates",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 5,
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 3: INTAKE WIZARD + STATE RULES ENGINE
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Build IntakeWizard multi-step component (9 steps, progress bar, back/forward)",
        "phase": "Phase 3: Intake + Rules",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 8,
        "notes": "Accident type → date → location → injuries → treatment → police → insurance → work → urgency",
    },
    {
        "name": "Build ConsentCheckbox with TCPA placeholder language",
        "phase": "Phase 3: Intake + Rules",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 1,
        "dependencies": "Draft privacy policy",
    },
    {
        "name": "Build state rules engine (lib/state-rules.ts) — CA + AZ only",
        "phase": "Phase 3: Intake + Rules",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
        "state": ["Both"],
        "notes": "Statute of limitations, fault rules, reporting deadlines, insurance minimums",
    },
    {
        "name": "Build /find-help → /find-help/results → /find-help/thank-you flow",
        "phase": "Phase 3: Intake + Rules",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
    },
    {
        "name": "Implement Server Actions for intake submission + Supabase persistence",
        "phase": "Phase 3: Intake + Rules",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 4: INTERACTIVE TOOLS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Build shared ToolEngine component (ToolConfig consumer, step renderer, output generator)",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 5,
        "notes": "See TOOLS-SPEC.md for ToolConfig/ToolStep/ToolOutput interfaces",
    },
    {
        "name": "Build Tool: Accident Case Type Quiz",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
        "notes": "/tools/accident-case-quiz — classify case type + next steps",
    },
    {
        "name": "Build Tool: Urgency Checker (red/yellow/green + 911 banner)",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
        "notes": "/tools/urgency-checker — medical urgency triage with emergency banner",
    },
    {
        "name": "Build Tool: Evidence Checklist Generator (with PDF export)",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 5,
        "notes": "/tools/evidence-checklist — customized by accident type, PDF via @react-pdf/renderer",
    },
    {
        "name": "Build Tool: Injury & Treatment Journal (local-first + optional Supabase sync)",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 8,
        "notes": "/tools/injury-journal — daily pain tracker, treatment log, photo upload, PDF export",
    },
    {
        "name": "Build Tool: Lawyer Type Matcher",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
        "notes": "/tools/lawyer-type-matcher — educational matching by accident type + severity",
    },
    {
        "name": "Build Tool: Lost Wages Estimator",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Developer",
        "priority": "P2 — Medium",
        "hours": 4,
        "notes": "/tools/lost-wages-estimator — Phase 9 expansion tool",
    },
    {
        "name": "Build Tool: Insurance Call Prep",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Developer",
        "priority": "P2 — Medium",
        "hours": 4,
        "notes": "/tools/insurance-call-prep — call script + what NOT to say",
    },
    {
        "name": "Build Tool: Record Request Checklist",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Developer",
        "priority": "P2 — Medium",
        "hours": 3,
        "notes": "/tools/record-request",
    },
    {
        "name": "Build Tool: Settlement Readiness Checklist",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Developer",
        "priority": "P2 — Medium",
        "hours": 3,
        "notes": "/tools/settlement-readiness",
    },
    {
        "name": "Build Tool: State-Specific Next-Step Generator (CA + AZ)",
        "phase": "Phase 4: Tools",
        "workstream": "Development",
        "owner": "Developer",
        "priority": "P2 — Medium",
        "hours": 5,
        "state": ["Both"],
        "notes": "/tools/state-next-steps — gated on counsel review of state data",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 5: CONTENT (Content Writer + Legal Counsel review)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Write Home page content (hero, value prop, trust, how-it-works)",
        "phase": "Phase 5: Content",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P0 — Critical",
        "hours": 4,
    },
    {
        "name": "Write 5 accident hub content JSONs (car, truck, motorcycle, slip-fall, workplace)",
        "phase": "Phase 5: Content",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P0 — Critical",
        "hours": 20,
        "notes": "Each hub: causes, injuries, steps, evidence, timeline, insurance, lawyer guidance. See CONTENT-PLAN.md",
    },
    {
        "name": "Write 5 guide page content JSONs (after-accident, evidence, insurance, hiring-lawyer, mistakes)",
        "phase": "Phase 5: Content",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P0 — Critical",
        "hours": 15,
    },
    {
        "name": "Write About / How It Works page content",
        "phase": "Phase 5: Content",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P0 — Critical",
        "hours": 3,
    },
    {
        "name": "Write California state page JSON (statute of limitations, fault rules, insurance)",
        "phase": "Phase 5: Content",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P0 — Critical",
        "hours": 4,
        "state": ["CA"],
        "dependencies": "Map CA compliance rules",
        "notes": "MUST be reviewed by CA-licensed attorney before publish",
    },
    {
        "name": "Write Arizona state page JSON (statute of limitations, fault rules, insurance)",
        "phase": "Phase 5: Content",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P0 — Critical",
        "hours": 4,
        "state": ["AZ"],
        "dependencies": "Map AZ compliance rules",
        "notes": "MUST be reviewed by AZ-licensed attorney before publish",
    },
    {
        "name": "Research + write 10 CA city page JSONs (LA, San Diego, San Jose, SF, Fresno, Sacramento, Long Beach, Oakland, Bakersfield, Anaheim)",
        "phase": "Phase 5: Content",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P0 — Critical",
        "hours": 15,
        "state": ["CA"],
        "notes": "Each city: real hospitals, courts, accident corridors, stats. NO templates — unique content per city.",
    },
    {
        "name": "Research + write 6 AZ city page JSONs (Phoenix, Tucson, Mesa, Chandler, Scottsdale, Gilbert)",
        "phase": "Phase 5: Content",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P0 — Critical",
        "hours": 9,
        "state": ["AZ"],
        "notes": "Each city: real hospitals, courts, accident corridors, stats. NO templates — unique content per city.",
    },
    {
        "name": "Legal counsel review: all CA state + city content",
        "phase": "Phase 5: Content",
        "workstream": "Legal/Compliance",
        "owner": "Legal Counsel",
        "priority": "P0 — Critical",
        "hours": 6,
        "state": ["CA"],
        "dependencies": "Write CA state + city JSONs",
    },
    {
        "name": "Legal counsel review: all AZ state + city content",
        "phase": "Phase 5: Content",
        "workstream": "Legal/Compliance",
        "owner": "Legal Counsel",
        "priority": "P0 — Critical",
        "hours": 4,
        "state": ["AZ"],
        "dependencies": "Write AZ state + city JSONs",
    },
    {
        "name": "Legal counsel review: all disclaimers, intake language, tool outputs",
        "phase": "Phase 5: Content",
        "workstream": "Legal/Compliance",
        "owner": "Legal Counsel",
        "priority": "P0 — Critical",
        "hours": 4,
        "dependencies": "Write all content",
    },
    {
        "name": "Write For Attorneys partner page (recruitment landing page)",
        "phase": "Phase 5: Content",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P1 — High",
        "hours": 3,
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 6: SEO + LOCAL SCHEMA
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Implement BreadcrumbList structured data on every page",
        "phase": "Phase 6: SEO",
        "workstream": "SEO",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 2,
    },
    {
        "name": "Implement Organization schema site-wide",
        "phase": "Phase 6: SEO",
        "workstream": "SEO",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 1,
    },
    {
        "name": "Implement QAPage schema on true Q&A content pages",
        "phase": "Phase 6: SEO",
        "workstream": "SEO",
        "owner": "Claude",
        "priority": "P1 — High",
        "hours": 2,
    },
    {
        "name": "Build dynamic sitemap.xml (partitioned: states, cities, accidents, tools)",
        "phase": "Phase 6: SEO",
        "workstream": "SEO",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
    },
    {
        "name": "Implement internal linking engine (hub ↔ injuries ↔ tools ↔ state ↔ city)",
        "phase": "Phase 6: SEO",
        "workstream": "SEO",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
        "notes": "See SITE-ARCHITECTURE.md cross-linking rules",
    },
    {
        "name": "Write unique meta titles + descriptions for all 39 pages",
        "phase": "Phase 6: SEO",
        "workstream": "SEO",
        "owner": "SEO Specialist",
        "priority": "P0 — Critical",
        "hours": 6,
        "notes": "NO templates. Pull actual content details per feedback memory.",
    },
    {
        "name": "Implement Place schema on city pages",
        "phase": "Phase 6: SEO",
        "workstream": "SEO",
        "owner": "Claude",
        "priority": "P1 — High",
        "hours": 2,
        "state": ["Both"],
    },
    {
        "name": "Submit sitemaps to Google Search Console",
        "phase": "Phase 6: SEO",
        "workstream": "SEO",
        "owner": "SEO Specialist",
        "priority": "P1 — High",
        "hours": 1,
        "dependencies": "Build dynamic sitemap.xml",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 7: INTEGRATIONS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Set up CRM webhook endpoint (lead payload schema)",
        "phase": "Phase 7: Integrations",
        "workstream": "Integrations",
        "owner": "Developer",
        "priority": "P0 — Critical",
        "hours": 4,
    },
    {
        "name": "Set up call tracking (dynamic number insertion by source/state, 2 pools: CA + AZ)",
        "phase": "Phase 7: Integrations",
        "workstream": "Integrations",
        "owner": "Michael",
        "priority": "P0 — Critical",
        "hours": 4,
        "state": ["Both"],
    },
    {
        "name": "Set up email notifications (Resend) for intake confirmations",
        "phase": "Phase 7: Integrations",
        "workstream": "Integrations",
        "owner": "Developer",
        "priority": "P1 — High",
        "hours": 3,
    },
    {
        "name": "Set up SMS notifications (Twilio) for lead alerts to attorneys",
        "phase": "Phase 7: Integrations",
        "workstream": "Integrations",
        "owner": "Developer",
        "priority": "P1 — High",
        "hours": 3,
    },
    {
        "name": "Implement analytics event schema (intake_started, step_completed, tool_completed, lead_submitted)",
        "phase": "Phase 7: Integrations",
        "workstream": "Integrations",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 3,
    },
    {
        "name": "Set up Microsoft Clarity heatmaps",
        "phase": "Phase 7: Integrations",
        "workstream": "Integrations",
        "owner": "Developer",
        "priority": "P2 — Medium",
        "hours": 1,
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 8: QA + LAUNCH
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Lighthouse audit all page templates (target 90+ on all)",
        "phase": "Phase 8: QA + Launch",
        "workstream": "QA/Testing",
        "owner": "QA Engineer",
        "priority": "P0 — Critical",
        "hours": 4,
    },
    {
        "name": "WCAG 2.2 AA accessibility audit (axe-core + manual keyboard + screen reader)",
        "phase": "Phase 8: QA + Launch",
        "workstream": "QA/Testing",
        "owner": "QA Engineer",
        "priority": "P0 — Critical",
        "hours": 6,
    },
    {
        "name": "Full compliance review: every page against COMPLIANCE.md language rules",
        "phase": "Phase 8: QA + Launch",
        "workstream": "Legal/Compliance",
        "owner": "Legal Counsel",
        "priority": "P0 — Critical",
        "hours": 8,
        "notes": "Check for prohibited language, missing disclaimers, state-specific claims",
    },
    {
        "name": "E2E tests (Playwright): home, accident hub, guide, tool, full intake flow",
        "phase": "Phase 8: QA + Launch",
        "workstream": "QA/Testing",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 6,
    },
    {
        "name": "Unit tests: state rules engine + tool output generators",
        "phase": "Phase 8: QA + Launch",
        "workstream": "QA/Testing",
        "owner": "Claude",
        "priority": "P0 — Critical",
        "hours": 4,
    },
    {
        "name": "Cross-browser + mobile device testing (iOS Safari, Android Chrome, desktop)",
        "phase": "Phase 8: QA + Launch",
        "workstream": "QA/Testing",
        "owner": "QA Engineer",
        "priority": "P0 — Critical",
        "hours": 4,
    },
    {
        "name": "DNS cutover to Vercel production (accidentpath.com)",
        "phase": "Phase 8: QA + Launch",
        "workstream": "Development",
        "owner": "Michael",
        "priority": "P0 — Critical",
        "hours": 1,
        "dependencies": "All QA passed",
    },
    {
        "name": "Set up Sentry error tracking",
        "phase": "Phase 8: QA + Launch",
        "workstream": "Development",
        "owner": "Developer",
        "priority": "P1 — High",
        "hours": 2,
    },
    {
        "name": "Smoke test live site + Slack alert on first 10 leads",
        "phase": "Phase 8: QA + Launch",
        "workstream": "QA/Testing",
        "owner": "Michael",
        "priority": "P0 — Critical",
        "hours": 2,
        "dependencies": "DNS cutover",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHASE 9: POST-LAUNCH / SCALE
    # ═══════════════════════════════════════════════════════════════════════
    {
        "name": "Launch paid search for LA + Phoenix (car accidents, truck accidents)",
        "phase": "Phase 9: Post-Launch",
        "workstream": "Marketing",
        "owner": "Michael",
        "priority": "P0 — Critical",
        "hours": 8,
        "state": ["Both"],
        "notes": "Start with 2-3 accident types. Track conversion by city + type.",
    },
    {
        "name": "Publish remaining 10 accident hub content (uber-lyft through spinal)",
        "phase": "Phase 9: Post-Launch",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P1 — High",
        "hours": 30,
    },
    {
        "name": "Publish injury type pages (TBI, spinal, broken bones, soft tissue, whiplash, burns, internal)",
        "phase": "Phase 9: Post-Launch",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P1 — High",
        "hours": 14,
    },
    {
        "name": "Set up Reddit Question Harvester cron job (daily content brief generation)",
        "phase": "Phase 9: Post-Launch",
        "workstream": "Marketing",
        "owner": "Claude",
        "priority": "P1 — High",
        "hours": 4,
        "notes": "r/legaladvice, r/personalinjury, r/insurance, r/caraccidents. See VALUE-ENGINE.md",
    },
    {
        "name": "Set up GSC Ranking Monitor cron job (weekly ranking + CTR analysis)",
        "phase": "Phase 9: Post-Launch",
        "workstream": "SEO",
        "owner": "Claude",
        "priority": "P1 — High",
        "hours": 4,
    },
    {
        "name": "A/B test intake flow CTAs, headlines, form layouts",
        "phase": "Phase 9: Post-Launch",
        "workstream": "Marketing",
        "owner": "Developer",
        "priority": "P1 — High",
        "hours": 6,
    },
    {
        "name": "Onboard first 3-5 attorney partners and test lead routing end-to-end",
        "phase": "Phase 9: Post-Launch",
        "workstream": "Business Ops",
        "owner": "Michael",
        "priority": "P0 — Critical",
        "hours": 10,
        "dependencies": "Recruit PI attorneys",
    },
    {
        "name": "Begin Spanish Tier-1 rollout (UI chrome translation, es locale)",
        "phase": "Phase 9: Post-Launch",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P2 — Medium",
        "hours": 12,
        "notes": "Per SPANISH-STRATEGY.md — 39% of CA speaks Spanish at home",
    },
    {
        "name": "Create downloadable PDF resources (post-accident checklist, evidence guide, insurance script)",
        "phase": "Phase 9: Post-Launch",
        "workstream": "Content",
        "owner": "Content Writer",
        "priority": "P2 — Medium",
        "hours": 8,
    },
    {
        "name": "Set up competitor content monitor cron job (weekly crawl of 9 LRS sites)",
        "phase": "Phase 9: Post-Launch",
        "workstream": "Marketing",
        "owner": "Claude",
        "priority": "P2 — Medium",
        "hours": 4,
        "notes": "See VALUE-ENGINE.md — monitor 1000Attorneys, LegalMatch, LawLinq, etc.",
    },
]


# ── Main ────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("AccidentPath — Creating Notion Tasks Database")
    print("=" * 60)

    # Step 1: Create database
    db = create_database()
    if not db:
        print("Failed to create database. Exiting.")
        sys.exit(1)

    db_id = db["id"]
    print(f"\nPopulating {len(TASKS)} tasks...")

    # Step 2: Populate tasks
    success = 0
    failed = 0
    for i, task in enumerate(TASKS, 1):
        result = add_task(db_id, task)
        if result:
            success += 1
            print(f"  [{i}/{len(TASKS)}] ✅ {task['name'][:60]}")
        else:
            failed += 1
            print(f"  [{i}/{len(TASKS)}] ❌ FAILED: {task['name'][:60]}")

        # Rate limit: Notion API allows 3 requests/second
        if i % 3 == 0:
            time.sleep(1.1)

    print(f"\n{'=' * 60}")
    print(f"Done! {success} tasks created, {failed} failed.")
    print(f"Database URL: {db.get('url', 'check Notion')}")
    print(f"Database ID: {db_id}")
    print(f"{'=' * 60}")

    # Save DB ID for future use
    config_path = os.path.join(PROJECT_DIR, ".notion-tasks-db-id")
    with open(config_path, "w") as f:
        f.write(db_id)
    print(f"Saved database ID to {config_path}")


if __name__ == "__main__":
    main()
