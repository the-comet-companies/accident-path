#!/usr/bin/env python3
"""
Create AccidentPath AI-Agent Dev Tasks Database in Notion.
Each task includes a full execution prompt in the page body
that Claude Code can pick up and execute autonomously.

Run: python3 scripts/create-agent-tasks-db.py
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
    print("ERROR: NOTION_API_KEY not found")
    sys.exit(1)

PARENT_PAGE_ID = "328917dc7b8380b29f18c67de494adc0"
NOTION_VERSION = "2022-06-28"
HEADERS = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
}
BASE = "https://api.notion.com/v1"


def api(method, endpoint, data=None):
    resp = requests.request(method, f"{BASE}/{endpoint}", headers=HEADERS, json=data)
    if resp.status_code >= 400:
        print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
        return None
    return resp.json()


def create_database():
    payload = {
        "parent": {"type": "page_id", "page_id": PARENT_PAGE_ID},
        "title": [{"type": "text", "text": {"content": "AccidentPath — Dev Sprint Tasks (AI Agent)"}}],
        "icon": {"type": "emoji", "emoji": "🤖"},
        "properties": {
            "Task": {"title": {}},
            "Task ID": {"number": {"format": "number"}},
            "Phase": {
                "select": {
                    "options": [
                        {"name": "0 — Bootstrap", "color": "gray"},
                        {"name": "1 — Design System", "color": "purple"},
                        {"name": "2 — Templates", "color": "blue"},
                        {"name": "3 — Intake + Rules", "color": "green"},
                        {"name": "4 — Tools", "color": "yellow"},
                        {"name": "5 — Content", "color": "orange"},
                        {"name": "6 — SEO", "color": "red"},
                        {"name": "7 — Integrations", "color": "pink"},
                        {"name": "8 — QA + Polish", "color": "brown"},
                    ]
                }
            },
            "Status": {
                "select": {
                    "options": [
                        {"name": "Not Started", "color": "default"},
                        {"name": "In Progress", "color": "blue"},
                        {"name": "Done", "color": "green"},
                        {"name": "Blocked", "color": "red"},
                        {"name": "Needs Review", "color": "yellow"},
                    ]
                }
            },
            "Est. Hours": {"number": {"format": "number"}},
            "Depends On": {"rich_text": {}},
            "Files to Create": {"rich_text": {}},
            "Acceptance Criteria": {"rich_text": {}},
        },
    }
    result = api("POST", "databases", payload)
    if result:
        print(f"✅ Database created: {result['id']}")
        print(f"   URL: {result.get('url')}")
    return result


def add_task(db_id, task):
    """Create a page (task) with properties + body blocks (the execution prompt)."""
    properties = {
        "Task": {"title": [{"text": {"content": task["name"]}}]},
        "Task ID": {"number": task["id"]},
        "Phase": {"select": {"name": task["phase"]}},
        "Status": {"select": {"name": "Not Started"}},
        "Est. Hours": {"number": task["hours"]},
    }
    if task.get("depends"):
        properties["Depends On"] = {"rich_text": [{"text": {"content": task["depends"]}}]}
    if task.get("files"):
        properties["Files to Create"] = {"rich_text": [{"text": {"content": task["files"]}}]}
    if task.get("criteria"):
        properties["Acceptance Criteria"] = {"rich_text": [{"text": {"content": task["criteria"]}}]}

    # Create the page
    page = api("POST", "pages", {"parent": {"database_id": db_id}, "properties": properties})
    if not page:
        return None

    # Add body blocks (the execution prompt)
    if task.get("prompt_blocks"):
        blocks = task["prompt_blocks"]
        # Notion allows max 100 blocks per request
        for i in range(0, len(blocks), 100):
            chunk = blocks[i:i+100]
            api("PATCH", f"blocks/{page['id']}/children", {"children": chunk})
            if i + 100 < len(blocks):
                time.sleep(0.4)

    return page


def h2(text):
    return {"object": "block", "type": "heading_2", "heading_2": {"rich_text": [{"type": "text", "text": {"content": text}}]}}

def h3(text):
    return {"object": "block", "type": "heading_3", "heading_3": {"rich_text": [{"type": "text", "text": {"content": text}}]}}

def para(text):
    # Notion rich_text limit is 2000 chars per element
    chunks = [text[i:i+2000] for i in range(0, len(text), 2000)]
    return {"object": "block", "type": "paragraph", "paragraph": {"rich_text": [{"type": "text", "text": {"content": c}} for c in chunks]}}

def code(text, lang="typescript"):
    chunks = [text[i:i+2000] for i in range(0, len(text), 2000)]
    return {"object": "block", "type": "code", "code": {"rich_text": [{"type": "text", "text": {"content": c}} for c in chunks], "language": lang}}

def bullet(text):
    return {"object": "block", "type": "bulleted_list_item", "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": text}}]}}

def divider():
    return {"object": "block", "type": "divider", "divider": {}}

def callout(text, emoji="⚠️"):
    return {"object": "block", "type": "callout", "callout": {"rich_text": [{"type": "text", "text": {"content": text}}], "icon": {"type": "emoji", "emoji": emoji}}}


# ════════════════════════════════════════════════════════════════════════════
# TASK DEFINITIONS — Full execution prompts for AI agent
# ════════════════════════════════════════════════════════════════════════════

TASKS = [
    # ── PHASE 0: BOOTSTRAP ─────────────────────────────────────────────────
    {
        "id": 1,
        "name": "Initialize Next.js 14 project with TypeScript + Tailwind",
        "phase": "0 — Bootstrap",
        "hours": 2,
        "depends": "None",
        "files": "package.json, tsconfig.json, tailwind.config.ts, next.config.ts, app/layout.tsx, app/page.tsx, .env.local.example",
        "criteria": "npm run dev starts without errors. npm run build succeeds. TypeScript strict mode on. Tailwind classes render.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read projects/legal-leads-accident-path/CLAUDE.md before starting. Tech stack is NON-NEGOTIABLE: Next.js 14+ App Router, TypeScript strict, Tailwind CSS.", "📋"),
            divider(),
            h3("Step 1: Create Next.js project"),
            code("npx create-next-app@latest accidentpath --typescript --tailwind --eslint --app --src-dir=false --import-alias='@/*' --use-npm", "bash"),
            para("Project should be created at: ~/Code/github/organizations/thecometcompanies/accidentpath/"),
            h3("Step 2: Configure TypeScript strict mode"),
            para("Update tsconfig.json: set strict: true, noUncheckedIndexedAccess: true, forceConsistentCasingInFileNames: true."),
            h3("Step 3: Configure Tailwind"),
            para("Set up tailwind.config.ts with the AccidentPath design tokens from DESIGN-SYSTEM.md:"),
            code("""// tailwind.config.ts
const config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1e3a5f', 50: '#f0f5ff', 100: '#e0ebff', 500: '#2d5a8e', 600: '#1e3a5f', 700: '#162d4a', 800: '#0f1f35', 900: '#081220' },
        accent: { DEFAULT: '#d4a843', 50: '#fdf8eb', 100: '#faf0d0', 500: '#d4a843', 600: '#b8912a', 700: '#9a7a1f' },
        success: { DEFAULT: '#16a34a', 50: '#f0fdf4', 500: '#16a34a' },
        warning: { DEFAULT: '#d97706', 50: '#fffbeb', 500: '#d97706' },
        danger: { DEFAULT: '#dc2626', 50: '#fef2f2', 500: '#dc2626' },
        surface: { DEFAULT: '#fafaf8', 50: '#ffffff', 100: '#fafaf8', 200: '#f5f5f0' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
    },
  },
}""", "typescript"),
            h3("Step 4: Create .env.local.example"),
            code("""# AccidentPath Environment Variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=""", "bash"),
            h3("Step 5: Add essential dev dependencies"),
            code("npm install zod lucide-react @supabase/supabase-js", "bash"),
            code("npm install -D prettier prettier-plugin-tailwindcss", "bash"),
            h3("Step 6: Set up app/layout.tsx with fonts"),
            code("""import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading' })

export const metadata: Metadata = {
  title: { default: 'AccidentPath — Your Path to Recovery Starts Here', template: '%s | AccidentPath' },
  description: 'Get clear next steps after an accident. Learn what to do, what evidence to keep, and whether speaking with a lawyer could help.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-surface text-gray-900 antialiased">{children}</body>
    </html>
  )
}""", "typescript"),
            h3("Step 7: Verify"),
            code("npm run dev   # Must start without errors\nnpm run build # Must succeed\nnpx tsc --noEmit  # Must pass", "bash"),
        ],
    },
    {
        "id": 2,
        "name": "Create folder structure + all TypeScript data models",
        "phase": "0 — Bootstrap",
        "hours": 3,
        "depends": "Task 1",
        "files": "types/*.ts, content/, components/, lib/",
        "criteria": "All Zod schemas validate. npx tsc --noEmit passes. Folder structure matches SITE-ARCHITECTURE.md.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read SITE-ARCHITECTURE.md for the full component tree and types/ definitions.", "📋"),
            divider(),
            h3("Step 1: Create folder structure"),
            code("""mkdir -p components/{layout,ui,content,intake,seo}
mkdir -p lib
mkdir -p types
mkdir -p content/{accidents,injuries,guides,states,cities,tools}
mkdir -p app/accidents/[slug]
mkdir -p app/injuries/[slug]
mkdir -p app/guides/[slug]
mkdir -p app/states/[state]
mkdir -p app/states/[state]/[city]
mkdir -p app/tools/[slug]
mkdir -p app/find-help/results
mkdir -p app/find-help/thank-you
mkdir -p app/about/how-it-works
mkdir -p public/icons""", "bash"),
            h3("Step 2: Create types/accident.ts"),
            code("""import { z } from 'zod'

export const AccidentTypeSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortTitle: z.string(),
  description: z.string().min(100),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  icon: z.string(),
  commonCauses: z.array(z.object({ title: z.string(), description: z.string() })).min(3),
  likelyInjuries: z.array(z.object({ slug: z.string(), title: z.string(), severity: z.enum(['mild', 'moderate', 'severe', 'catastrophic']) })),
  immediateSteps: z.array(z.object({ step: z.number(), title: z.string(), description: z.string(), urgency: z.enum(['critical', 'important', 'helpful']) })),
  evidenceChecklist: z.array(z.object({ category: z.string(), items: z.array(z.string()), priority: z.enum(['critical', 'important', 'helpful']) })),
  timelineRisks: z.array(z.object({ period: z.string(), risk: z.string(), action: z.string() })),
  insuranceIssues: z.array(z.object({ issue: z.string(), explanation: z.string() })),
  whenToGetLawyer: z.array(z.string()),
  relatedAccidents: z.array(z.string()),
  relatedInjuries: z.array(z.string()),
  relatedGuides: z.array(z.string()),
  relatedTools: z.array(z.string()),
})

export type AccidentType = z.infer<typeof AccidentTypeSchema>""", "typescript"),
            h3("Step 3: Create types/injury.ts"),
            code("""import { z } from 'zod'

export const InjuryTypeSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  description: z.string().min(100),
  symptoms: z.array(z.string()),
  longTermEffects: z.array(z.string()),
  treatmentOptions: z.array(z.string()),
  commonCauses: z.array(z.string()),
  relatedAccidents: z.array(z.string()),
  relatedTools: z.array(z.string()),
})

export type InjuryType = z.infer<typeof InjuryTypeSchema>""", "typescript"),
            h3("Step 4: Create types/state.ts"),
            code("""import { z } from 'zod'

export const StateDataSchema = z.object({
  slug: z.string(),
  name: z.string(),
  abbreviation: z.enum(['CA', 'AZ']),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  statuteOfLimitations: z.object({ personalInjury: z.string(), propertyDamage: z.string(), wrongfulDeath: z.string() }),
  faultRule: z.object({ type: z.enum(['pure_comparative', 'modified_comparative', 'contributory', 'no_fault']), description: z.string() }),
  reportingDeadlines: z.array(z.object({ type: z.string(), deadline: z.string(), details: z.string() })),
  insuranceMinimums: z.object({ bodilyInjuryPerPerson: z.string(), bodilyInjuryPerAccident: z.string(), propertyDamage: z.string(), uninsuredMotorist: z.string().optional() }),
  keyLaws: z.array(z.object({ name: z.string(), description: z.string() })),
  reviewedBy: z.string().min(1),
  reviewDate: z.string().min(1),
})

export type StateData = z.infer<typeof StateDataSchema>

export const CityDataSchema = z.object({
  slug: z.string(),
  name: z.string(),
  stateSlug: z.string(),
  stateAbbreviation: z.enum(['CA', 'AZ']),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  population: z.string(),
  description: z.string().min(200),
  hospitals: z.array(z.object({ name: z.string(), address: z.string(), phone: z.string().optional(), erAvailable: z.boolean() })).min(2),
  courts: z.array(z.object({ name: z.string(), address: z.string(), phone: z.string().optional(), type: z.string() })).min(1),
  commonAccidentTypes: z.array(z.string()).min(3),
  notableCorridors: z.array(z.string()).optional(),
  localNotes: z.string().min(50),
  reviewedBy: z.string().min(1),
  reviewDate: z.string().min(1),
})

export type CityData = z.infer<typeof CityDataSchema>""", "typescript"),
            h3("Step 5: Create types/intake.ts"),
            code("""import { z } from 'zod'

export const IntakeFormSchema = z.object({
  accidentType: z.string(),
  accidentDate: z.string(),
  city: z.string(),
  state: z.enum(['CA', 'AZ']),
  injuries: z.array(z.string()),
  medicalTreatment: z.enum(['none', 'er', 'doctor', 'ongoing', 'surgery']),
  policeReport: z.boolean(),
  insuranceStatus: z.enum(['has_insurance', 'no_insurance', 'unsure']),
  workImpact: z.enum(['none', 'missed_days', 'cant_work', 'reduced_capacity']),
  urgencyFactors: z.array(z.string()),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  consent: z.boolean(),
})

export type IntakeForm = z.infer<typeof IntakeFormSchema>""", "typescript"),
            h3("Step 6: Create types/tool.ts"),
            code("""import { z } from 'zod'

export const ToolConfigSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  description: z.string(),
  disclaimer: z.string(),
  steps: z.array(z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['select', 'multiselect', 'checklist', 'number', 'text', 'date']),
    options: z.array(z.object({ value: z.string(), label: z.string(), description: z.string().optional() })).optional(),
  })),
})

export type ToolConfig = z.infer<typeof ToolConfigSchema>

export interface ToolOutput {
  summary: string
  items: { label: string; value: string; priority?: 'critical' | 'important' | 'helpful' }[]
  cta: { text: string; href: string }
  disclaimer: string
  exportable: boolean
}""", "typescript"),
            h3("Step 7: Create types/content.ts (CMS model)"),
            code("""import { z } from 'zod'

export const GuideSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  description: z.string().min(100),
  sections: z.array(z.object({
    heading: z.string(),
    content: z.string().min(50),
    tips: z.array(z.string()).optional(),
  })).min(3),
  relatedAccidents: z.array(z.string()),
  relatedTools: z.array(z.string()),
  relatedGuides: z.array(z.string()),
})

export type Guide = z.infer<typeof GuideSchema>""", "typescript"),
            h3("Step 8: Create lib/cms.ts (JSON CMS loader)"),
            code("""import fs from 'fs'
import path from 'path'
import { AccidentTypeSchema, type AccidentType } from '@/types/accident'
import { InjuryTypeSchema, type InjuryType } from '@/types/injury'
import { StateDataSchema, CityDataSchema, type StateData, type CityData } from '@/types/state'
import { GuideSchema, type Guide } from '@/types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function loadAndValidate<T>(dir: string, slug: string, schema: { parse: (data: unknown) => T }): T {
  const filePath = path.join(CONTENT_DIR, dir, `${slug}.json`)
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return schema.parse(raw)
}

function loadAll<T>(dir: string, schema: { parse: (data: unknown) => T }): T[] {
  const dirPath = path.join(CONTENT_DIR, dir)
  if (!fs.existsSync(dirPath)) return []
  return fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json'))
    .map(f => schema.parse(JSON.parse(fs.readFileSync(path.join(dirPath, f), 'utf-8'))))
}

export const cms = {
  getAccident: (slug: string) => loadAndValidate<AccidentType>('accidents', slug, AccidentTypeSchema),
  getAllAccidents: () => loadAll<AccidentType>('accidents', AccidentTypeSchema),
  getInjury: (slug: string) => loadAndValidate<InjuryType>('injuries', slug, InjuryTypeSchema),
  getAllInjuries: () => loadAll<InjuryType>('injuries', InjuryTypeSchema),
  getState: (slug: string) => loadAndValidate<StateData>('states', slug, StateDataSchema),
  getAllStates: () => loadAll<StateData>('states', StateDataSchema),
  getCity: (slug: string) => loadAndValidate<CityData>('cities', slug, CityDataSchema),
  getAllCities: () => loadAll<CityData>('cities', CityDataSchema),
  getCitiesByState: (stateSlug: string) => loadAll<CityData>('cities', CityDataSchema).filter(c => c.stateSlug === stateSlug),
  getGuide: (slug: string) => loadAndValidate<Guide>('guides', slug, GuideSchema),
  getAllGuides: () => loadAll<Guide>('guides', GuideSchema),
}""", "typescript"),
            h3("Step 9: Verify everything compiles"),
            code("npx tsc --noEmit", "bash"),
        ],
    },
    {
        "id": 3,
        "name": "Create Supabase database schema",
        "phase": "0 — Bootstrap",
        "hours": 2,
        "depends": "Task 1",
        "files": "lib/supabase.ts, supabase/migrations/001_initial.sql",
        "criteria": "Supabase client connects. Tables created with proper indexes and RLS.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("Step 1: Create lib/supabase.ts"),
            code("""import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)""", "typescript"),
            h3("Step 2: Create SQL migration"),
            para("Create file: supabase/migrations/001_initial.sql"),
            code("""-- Intake sessions (leads)
CREATE TABLE intake_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accident_type TEXT NOT NULL,
  accident_date DATE,
  city TEXT,
  state TEXT CHECK (state IN ('CA', 'AZ')),
  injuries TEXT[],
  medical_treatment TEXT,
  police_report BOOLEAN,
  insurance_status TEXT,
  work_impact TEXT,
  urgency_factors TEXT[],
  name TEXT,
  email TEXT,
  phone TEXT,
  consent BOOLEAN DEFAULT FALSE,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_intake_state ON intake_sessions(state);
CREATE INDEX idx_intake_created ON intake_sessions(created_at DESC);
CREATE INDEX idx_intake_type ON intake_sessions(accident_type);

-- Tool submissions (anonymized usage data)
CREATE TABLE tool_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug TEXT NOT NULL,
  answers JSONB NOT NULL,
  result_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tool_slug ON tool_submissions(tool_slug);

-- Journal entries (for injury journal tool)
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  date DATE NOT NULL,
  pain_level INTEGER CHECK (pain_level BETWEEN 1 AND 10),
  symptoms TEXT[],
  treatments TEXT[],
  medications TEXT[],
  limitations TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journal_session ON journal_entries(session_id);

-- Enable RLS
ALTER TABLE intake_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon (public form submissions)
CREATE POLICY "Allow public inserts" ON intake_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON tool_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON journal_entries FOR INSERT WITH CHECK (true);""", "sql"),
            h3("Step 3: Verify"),
            para("Run the migration against Supabase. Verify tables exist and RLS policies are active."),
        ],
    },

    # ── PHASE 1: DESIGN SYSTEM ────────────────────────────────────────────
    {
        "id": 4,
        "name": "Build all core UI components",
        "phase": "1 — Design System",
        "hours": 4,
        "depends": "Task 1",
        "files": "components/ui/CTAButton.tsx, components/ui/TrustBadge.tsx, components/ui/DisclaimerBanner.tsx, components/ui/EmergencyBanner.tsx, components/layout/Breadcrumb.tsx",
        "criteria": "All components render correctly. Accessible (keyboard, ARIA). 44x44px touch targets on CTAs. DisclaimerBanner uses exact text from COMPLIANCE.md.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("CRITICAL: Read COMPLIANCE.md before writing ANY component that shows text to users. All disclaimers must use the EXACT language from COMPLIANCE.md §4.", "🚨"),
            divider(),
            h3("CTAButton.tsx"),
            para("Two variants: primary (solid bg-primary text-white) and secondary (outlined border-primary text-primary). Must accept: variant, size (sm/md/lg), href (optional, renders <a>), onClick, children, className. Min touch target 44x44px. Focus ring visible."),
            h3("TrustBadge.tsx"),
            para("Shows a trust signal with icon + text. Props: icon (shield/lock/clock/badge), text, variant (default/outlined). Examples: 'Attorney-Reviewed Content', 'Your information is secure', 'Free consultation — no obligation'."),
            h3("DisclaimerBanner.tsx"),
            para("Three variants based on page type:"),
            bullet("'default' — every-page footer disclaimer: 'AccidentPath is not a law firm and does not provide legal advice...'"),
            bullet("'intake' — matching page disclaimer about attorney network fees"),
            bullet("'tool' — tool educational purposes disclaimer"),
            bullet("'state' — jurisdiction-specific disclaimer"),
            para("Text comes from COMPLIANCE.md §4. Gray bg, 14px min font, always visible (never behind toggle)."),
            h3("EmergencyBanner.tsx"),
            para("Fixed banner with danger styling: 'In immediate danger? Call 911. For medical emergencies, seek care now.' Shows Phone icon + link to tel:911. Visible but not alarming. Can be dismissed per session (sessionStorage)."),
            h3("Breadcrumb.tsx"),
            para("SEO breadcrumb with schema.org BreadcrumbList JSON-LD. Props: items: {label, href}[]. Renders nav > ol > li with proper aria-current on last item."),
        ],
    },
    {
        "id": 5,
        "name": "Build Header with mega-menu navigation",
        "phase": "1 — Design System",
        "hours": 4,
        "depends": "Task 4",
        "files": "components/layout/Header.tsx, components/layout/MobileNav.tsx",
        "criteria": "Responsive mega-menu. Keyboard navigable. Accessible (ARIA). Mobile hamburger with slide-out. Bottom-fixed CTA on mobile.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Navigation items from SITE-ARCHITECTURE.md: Accident Types | Injuries | What To Do Next | Tools | Find Help | State Guides | Resources | About", "📋"),
            divider(),
            h3("Desktop Header"),
            para("Sticky header with: Logo (left) + nav items (center) + 'Get Help Now' CTA (right). 'Accident Types' and 'State Guides' get mega-menu dropdowns. Mega-menu shows grid of accident types with icons. 'State Guides' shows CA + AZ with city lists."),
            h3("Mobile Navigation"),
            para("Hamburger icon triggers full-screen slide-out nav. Bottom-fixed 'Get Help Now' CTA bar on all mobile pages (sticky, always visible). Close on backdrop click or Escape key. Trap focus inside when open."),
            h3("Technical Requirements"),
            bullet("Use Lucide icons throughout (Menu, X, ChevronDown, Phone, Shield)"),
            bullet("Logo: text-only 'AccidentPath' in font-heading until brand logo delivered"),
            bullet("Responsive: hamburger below lg: breakpoint"),
            bullet("Mega-menu: appear on hover (desktop) or click (mobile)"),
            bullet("ARIA: aria-expanded, aria-controls, role=navigation"),
            bullet("Skip navigation link as first focusable element"),
        ],
    },
    {
        "id": 6,
        "name": "Build Footer with full disclaimers",
        "phase": "1 — Design System",
        "hours": 3,
        "depends": "Task 4",
        "files": "components/layout/Footer.tsx",
        "criteria": "Footer contains all links, full disclaimer text from COMPLIANCE.md §4, emergency notice. Renders on every page via layout.tsx.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("Footer Structure"),
            para("4-column grid on desktop, stacked on mobile:"),
            bullet("Column 1: AccidentPath logo + tagline + 'Your path to recovery starts here.'"),
            bullet("Column 2: Accident Types (links to top 5 hubs)"),
            bullet("Column 3: Resources (Guides, Tools, State Guides, For Attorneys)"),
            bullet("Column 4: Company (About, How It Works, Contact, Privacy, Terms, Disclaimers)"),
            para("Below columns: full disclaimer block (COMPLIANCE.md §4 every-page footer text). Below that: '© 2026 AccidentPath. Not a law firm.' + emergency line."),
            h3("Disclaimer Text (exact — do NOT modify)"),
            code("AccidentPath is not a law firm and does not provide legal advice. Information provided is for educational purposes only. By using this site, you acknowledge that no attorney-client relationship is formed. If you are in immediate danger, call 911. For medical emergencies, seek care immediately.", "plain text"),
        ],
    },
    {
        "id": 7,
        "name": "Build SEO primitives (SchemaOrg, MetaTags, CanonicalUrl)",
        "phase": "1 — Design System",
        "hours": 3,
        "depends": "Task 2",
        "files": "components/seo/SchemaOrg.tsx, components/seo/MetaTags.tsx, lib/seo.ts",
        "criteria": "Organization schema renders in head on every page. Each page template can inject page-specific schema. Google Rich Results Test validates.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("SchemaOrg.tsx"),
            para("Component that renders JSON-LD in a <script type='application/ld+json'> tag. Props: schema (object). Used by every page template."),
            h3("lib/seo.ts — Schema generators"),
            code("""export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AccidentPath',
    url: 'https://accidentpath.com',
    description: 'Accident guidance and attorney matching platform',
    logo: 'https://accidentpath.com/logo.png',
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function articleSchema(page: { title: string; description: string; url: string; datePublished: string; dateModified: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    url: page.url,
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    publisher: organizationSchema(),
  }
}""", "typescript"),
        ],
    },
    {
        "id": 8,
        "name": "Build JSON CMS loader + StateSelector + Compliance HOC",
        "phase": "1 — Design System",
        "hours": 3,
        "depends": "Task 2",
        "files": "components/ui/StateSelector.tsx, lib/compliance.tsx",
        "criteria": "StateSelector shows CA + AZ with city dropdowns. Compliance wrapper auto-injects correct disclaimer per route type.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("StateSelector.tsx"),
            para("Two-step dropdown: first select state (California / Arizona), then select city from that state's list. Compact mode (inline) and full mode (standalone page section). Pre-selectable via props."),
            para("CA cities: Los Angeles, San Diego, San Jose, San Francisco, Fresno, Sacramento, Long Beach, Oakland, Bakersfield, Anaheim"),
            para("AZ cities: Phoenix, Tucson, Mesa, Chandler, Scottsdale, Gilbert"),
            h3("Compliance HOC (lib/compliance.tsx)"),
            para("A wrapper that determines the page type from the route and auto-injects the correct DisclaimerBanner variant:"),
            bullet("/tools/* → 'tool' disclaimer"),
            bullet("/find-help/* → 'intake' disclaimer"),
            bullet("/states/* → 'state' disclaimer"),
            bullet("Everything else → 'default' disclaimer"),
            para("Used in layout.tsx to wrap {children} so every page gets the right disclaimer automatically."),
        ],
    },

    # ── PHASE 2: PAGE TEMPLATES ───────────────────────────────────────────
    {
        "id": 9,
        "name": "Build Home page",
        "phase": "2 — Templates",
        "hours": 6,
        "depends": "Tasks 4, 5, 6, 7, 8",
        "files": "app/page.tsx, components/content/AccidentCard.tsx, components/content/ToolCard.tsx",
        "criteria": "Home page renders all 8 sections from PRD. Lighthouse 90+. Mobile responsive. All CTAs link correctly.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read PRD.md §3 for exact Home page requirements. Sections must appear in the specified order.", "📋"),
            divider(),
            h3("Home Page Sections (in order)"),
            para("1. Hero: heading 'Get Clear Next Steps After an Accident', subtext, primary CTA 'Start Free Accident Check' → /find-help, secondary CTA 'Explore Accident Guides' → /accidents"),
            para("2. Trust modules: 3-4 TrustBadge components in a row"),
            para("3. How It Works: 3 steps (1. Tell us what happened, 2. Get personalized guidance, 3. Connect with help if needed)"),
            para("4. Accident type grid: cards for all 5 launch types (car, truck, motorcycle, slip-fall, workplace) using AccidentCard.tsx → /accidents/[slug]"),
            para("5. Featured tools: cards for 5 P0 tools using ToolCard.tsx → /tools/[slug]"),
            para("6. Educational content teaser: 2-3 featured guides with excerpts"),
            para("7. State selector: 'Find help in your area' with StateSelector showing CA + AZ"),
            para("8. Strong footer (already built in Phase 1)"),
            h3("AccidentCard.tsx"),
            para("Props: slug, title, shortTitle, icon, description. Card with icon, title, short description, arrow. Hover: slight lift shadow. Links to /accidents/[slug]."),
            h3("ToolCard.tsx"),
            para("Props: slug, title, description, icon. Card with 'Try It' CTA. Links to /tools/[slug]."),
            h3("Design Notes"),
            bullet("Hero: full-width, bg gradient from primary-900 to primary-700, white text"),
            bullet("How It Works: numbered circles (1, 2, 3) with icons, alternating bg"),
            bullet("Cards: white bg, subtle shadow, rounded-xl, hover:shadow-md transition"),
            bullet("All sections: generous py-16 lg:py-24 spacing"),
        ],
    },
    {
        "id": 10,
        "name": "Build Accident Hub template (/accidents/[slug])",
        "phase": "2 — Templates",
        "hours": 5,
        "depends": "Tasks 7, 8, 9",
        "files": "app/accidents/page.tsx, app/accidents/[slug]/page.tsx, components/content/ChecklistBlock.tsx, components/content/TimelineBlock.tsx",
        "criteria": "Dynamic page loads from JSON CMS. All sections from CONTENT-PLAN.md hub template render. Structured data + breadcrumbs. Internal links to injuries, tools, guides.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read CONTENT-PLAN.md §1 for the hub template structure and SITE-ARCHITECTURE.md for the accident hub page template.", "📋"),
            divider(),
            h3("app/accidents/page.tsx (index)"),
            para("List all accident types in a grid of AccidentCards. H1: 'Accident Types — Find Help for Your Situation'. Metadata from generateMetadata."),
            h3("app/accidents/[slug]/page.tsx (hub)"),
            para("Load accident data via cms.getAccident(slug). Render sections:"),
            bullet("Breadcrumb: Home > Accidents > {title}"),
            bullet("Hero with H1 + description"),
            bullet("Common Causes (numbered list with explanations)"),
            bullet("Likely Injuries (link cards to /injuries/*)"),
            bullet("Immediate Steps (ChecklistBlock with urgency indicators)"),
            bullet("Evidence Checklist (interactive ChecklistBlock)"),
            bullet("Timeline Risks (TimelineBlock visual)"),
            bullet("Insurance Issues (content blocks)"),
            bullet("When You Need a Specialist Lawyer (content + CTA to /find-help)"),
            bullet("State-specific notes callout (link to /states/*)"),
            bullet("CTA: 'Start Your Free Accident Check' → /find-help"),
            bullet("DisclaimerBanner auto-injected"),
            h3("ChecklistBlock.tsx"),
            para("Interactive checklist. User can check off items. Items colored by priority (critical=red border, important=amber, helpful=green). Accessible: checkboxes with labels."),
            h3("TimelineBlock.tsx"),
            para("Visual timeline with periods + risks. Horizontal on desktop, vertical on mobile. Color-coded urgency."),
            h3("generateStaticParams"),
            code("export async function generateStaticParams() {\n  const accidents = cms.getAllAccidents()\n  return accidents.map(a => ({ slug: a.slug }))\n}", "typescript"),
        ],
    },
    {
        "id": 11,
        "name": "Build Guide + Injury + State + City templates",
        "phase": "2 — Templates",
        "hours": 8,
        "depends": "Task 10",
        "files": "app/guides/[slug]/page.tsx, app/injuries/[slug]/page.tsx, app/states/[state]/page.tsx, app/states/[state]/[city]/page.tsx",
        "criteria": "All 4 templates render from CMS JSON. State/City pages enforce reviewedBy + reviewDate. Breadcrumbs + structured data on all.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("Guide Template (/guides/[slug])"),
            para("Load via cms.getGuide(slug). Render: breadcrumb, H1, description, sections (each with heading + content + optional tips callout), related links (accidents, tools, other guides), CTA to /find-help."),
            h3("Injury Template (/injuries/[slug])"),
            para("Load via cms.getInjury(slug). Render: breadcrumb, H1, description, symptoms list, long-term effects, treatment options, common accident causes (links to /accidents/*), related tools, CTA."),
            h3("State Template (/states/[state])"),
            callout("CRITICAL: State template MUST check for reviewedBy and reviewDate in the JSON. If missing, render a 'Content pending review' placeholder instead of potentially wrong legal info.", "🚨"),
            para("Load via cms.getState(slug). Render: breadcrumb, H1, key laws table, statute of limitations box, fault rules explanation, reporting deadlines, insurance minimums, city links grid (cms.getCitiesByState), CTA with state pre-selected. Show 'Reviewed by [name] — [date]' badge."),
            h3("City Template (/states/[state]/[city])"),
            callout("Each city page MUST have unique local content. The Zod schema requires min 200-char description, 2+ hospitals, 1+ courts. NO templated filler.", "🚨"),
            para("Load via cms.getCity(slug). Render: breadcrumb, H1 'Accident Help in {city}, {state}', population, unique description, hospitals list (name, address, ER availability), courts list, notable corridors (if available), common accident types (links), state law summary (from parent state data), CTA with city + state pre-filled. 'Reviewed by [name]' badge."),
        ],
    },
    {
        "id": 12,
        "name": "Build Tool template + static pages (About, Privacy, Terms, etc.)",
        "phase": "2 — Templates",
        "hours": 5,
        "depends": "Task 10",
        "files": "app/tools/[slug]/page.tsx, app/tools/page.tsx, app/about/page.tsx, app/about/how-it-works/page.tsx, app/privacy/page.tsx, app/terms/page.tsx, app/disclaimers/page.tsx, app/for-attorneys/page.tsx, app/contact/page.tsx",
        "criteria": "Tool template wraps ToolEngine. All static pages have proper metadata, disclaimers, and semantic HTML. Contact page has basic form.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("Tool Template"),
            para("app/tools/page.tsx — index grid of all tools. app/tools/[slug]/page.tsx — loads ToolConfig from JSON, passes to ToolEngine (Phase 4). For now, create the page shell with a placeholder 'Tool loading...' where ToolEngine will go."),
            h3("Static Pages"),
            para("Each page gets proper generateMetadata, breadcrumbs, and semantic HTML:"),
            bullet("/about — Company mission, how it works overview, trust signals, team placeholder"),
            bullet("/about/how-it-works — Detailed 3-step process with visuals"),
            bullet("/privacy — Privacy policy placeholder (will be replaced by legal counsel draft)"),
            bullet("/terms — Terms of service placeholder"),
            bullet("/disclaimers — Full disclosure page (who operates site, how matching works, attorney fees, not a law firm)"),
            bullet("/for-attorneys — Partner recruitment page (benefits of joining, how it works for attorneys, contact form)"),
            bullet("/contact — Simple contact form (name, email, phone, message) + phone number + address placeholder"),
            callout("Privacy, Terms, and Disclaimers pages will get real legal copy later. Create well-structured pages with placeholder sections that match the headings legal counsel will fill in.", "⚠️"),
        ],
    },

    # ── PHASE 3: INTAKE + RULES ENGINE ────────────────────────────────────
    {
        "id": 13,
        "name": "Build IntakeWizard multi-step flow",
        "phase": "3 — Intake + Rules",
        "hours": 8,
        "depends": "Tasks 4, 8",
        "files": "components/intake/IntakeWizard.tsx, components/intake/ProgressBar.tsx, components/intake/ConsentCheckbox.tsx, components/intake/IntakeStep.tsx",
        "criteria": "9-step wizard works end-to-end. Persists to localStorage between steps. Mobile optimized. Back button on every step. TCPA consent before contact info. Analytics events fire on each step.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read PRD.md §5 for quiz/intake architecture. Read COMPLIANCE.md for consent language.", "📋"),
            divider(),
            h3("IntakeWizard.tsx"),
            para("Multi-step form with 9 steps:"),
            bullet("Step 1: Accident type (select from 5 types with icons)"),
            bullet("Step 2: When did it happen? (date picker + 'today', 'this week', 'this month', 'over a month ago' quick options)"),
            bullet("Step 3: Where? (state selector CA/AZ + city dropdown)"),
            bullet("Step 4: Injuries (multiselect checklist: head/brain, neck/back, broken bones, soft tissue, burns, internal, other)"),
            bullet("Step 5: Medical treatment (select: none, ER visit, saw doctor, ongoing treatment, had surgery)"),
            bullet("Step 6: Police report filed? (yes/no + 'not sure')"),
            bullet("Step 7: Insurance status (has insurance, no insurance, unsure)"),
            bullet("Step 8: Work impact (none, missed days, can't work, reduced capacity)"),
            bullet("Step 9: Contact info (name, email, phone) — ONLY after ConsentCheckbox is checked"),
            h3("Technical Requirements"),
            bullet("ProgressBar at top showing step X of 9"),
            bullet("Back button on every step (except step 1)"),
            bullet("Persist answers to localStorage on each step"),
            bullet("Large touch targets (44x44px min) on all options"),
            bullet("Smooth transitions between steps (slide left/right)"),
            bullet("On completion: POST to /api/intake Server Action"),
            bullet("Fire analytics events: intake_started (step 1), step_completed (each), intake_submitted (final)"),
            h3("ConsentCheckbox.tsx"),
            para("Checkbox with text: 'I agree to be contacted about my inquiry. I understand this is not a request for legal representation and no attorney-client relationship will be formed by submitting this form. View our Privacy Policy.'"),
        ],
    },
    {
        "id": 14,
        "name": "Build state rules engine + find-help flow + Server Actions",
        "phase": "3 — Intake + Rules",
        "hours": 6,
        "depends": "Tasks 3, 13",
        "files": "lib/state-rules.ts, app/find-help/page.tsx, app/find-help/results/page.tsx, app/find-help/thank-you/page.tsx, app/api/intake/route.ts",
        "criteria": "State rules return correct data for CA and AZ. Intake submits to Supabase. Results page shows personalized next steps. Thank-you confirms submission.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("lib/state-rules.ts"),
            code("""interface StateRules {
  statuteOfLimitations: { personalInjury: string; propertyDamage: string; wrongfulDeath: string }
  faultRule: { type: string; description: string }
  reportingDeadlines: { type: string; deadline: string }[]
  insuranceMinimums: { bodilyInjury: string; propertyDamage: string }
}

const STATE_RULES: Record<string, StateRules> = {
  CA: {
    statuteOfLimitations: { personalInjury: '2 years', propertyDamage: '3 years', wrongfulDeath: '2 years' },
    faultRule: { type: 'Pure Comparative Fault', description: 'California uses pure comparative fault. You can recover damages even if you are 99% at fault, but your award is reduced by your percentage of fault.' },
    reportingDeadlines: [
      { type: 'Police report', deadline: 'File within 24 hours for hit-and-run; recommended within 10 days for all accidents' },
      { type: 'DMV SR-1 form', deadline: 'Within 10 days if anyone was injured or killed, or property damage exceeds $1,000' },
      { type: 'Insurance claim', deadline: 'As soon as possible; check your policy for specific deadlines' },
    ],
    insuranceMinimums: { bodilyInjury: '$15,000/$30,000', propertyDamage: '$5,000' },
  },
  AZ: {
    statuteOfLimitations: { personalInjury: '2 years', propertyDamage: '2 years', wrongfulDeath: '2 years' },
    faultRule: { type: 'Pure Comparative Fault', description: 'Arizona uses pure comparative fault. Your damages are reduced by your percentage of fault, but you can still recover even if mostly at fault.' },
    reportingDeadlines: [
      { type: 'Police report', deadline: 'Required if injury, death, or property damage over $2,000' },
      { type: 'Insurance claim', deadline: 'As soon as possible; check your policy for specific deadlines' },
    ],
    insuranceMinimums: { bodilyInjury: '$25,000/$50,000', propertyDamage: '$15,000' },
  },
}

export function getStateRules(state: string): StateRules | null {
  return STATE_RULES[state] ?? null
}""", "typescript"),
            h3("Find Help Flow"),
            para("/find-help/page.tsx — renders IntakeWizard component"),
            para("/find-help/results — receives intake answers (from URL params or localStorage), shows: personalized summary, suggested lawyer type (educational), relevant accident hub link, relevant tools, state rules callout, CTA to submit contact info if not yet provided"),
            para("/find-help/thank-you — confirmation page with: 'What happens next' timeline, resources to read while waiting, emergency reminder"),
            h3("Server Action"),
            para("app/api/intake/route.ts — POST handler that validates IntakeFormSchema with Zod, inserts into Supabase intake_sessions table, returns success. Later will trigger CRM webhook + notifications."),
        ],
    },

    # ── PHASE 4: TOOLS ────────────────────────────────────────────────────
    {
        "id": 15,
        "name": "Build shared ToolEngine component",
        "phase": "4 — Tools",
        "hours": 4,
        "depends": "Task 12",
        "files": "components/tools/ToolEngine.tsx, components/tools/ToolStep.tsx, components/tools/ToolResults.tsx",
        "criteria": "ToolEngine consumes any ToolConfig and renders the multi-step flow. Progress bar, back button, results page, disclaimer on every tool.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read TOOLS-SPEC.md for ToolConfig interface and shared requirements.", "📋"),
            divider(),
            h3("ToolEngine.tsx"),
            para("Generic tool renderer. Props: config (ToolConfig), outputGenerator (function that takes answers and returns ToolOutput). Renders: disclaimer (before tool), progress bar, ToolStep for each step, ToolResults when complete, disclaimer (after results), CTA."),
            h3("ToolStep.tsx"),
            para("Renders a single step based on type: 'select' (radio buttons), 'multiselect' (checkboxes), 'checklist' (checkboxes with priorities), 'number' (input), 'text' (textarea), 'date' (date picker). Each option is a large tappable card (44x44px min)."),
            h3("ToolResults.tsx"),
            para("Renders ToolOutput: summary paragraph, items list (with priority badges), CTA button, disclaimer, optional 'Export to PDF' button. Export uses window.print() as v1 (swap to @react-pdf/renderer later)."),
            h3("Analytics"),
            para("Fire events: tool_started, step_completed, tool_completed. Include tool_slug in all events."),
        ],
    },
    {
        "id": 16,
        "name": "Build Tool: Accident Case Type Quiz",
        "phase": "4 — Tools",
        "hours": 4,
        "depends": "Task 15",
        "files": "content/tools/accident-case-quiz.json, lib/tools/accident-case-quiz.ts",
        "criteria": "Quiz works end-to-end. Classifies into case type. Shows relevant hub link + next steps. Disclaimer present.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read TOOLS-SPEC.md Tool 1 for exact flow. NEVER use language that sounds like legal advice.", "📋"),
            divider(),
            h3("Tool Config JSON"),
            para("Create content/tools/accident-case-quiz.json with 5 steps: 1) Select accident type, 2) Describe what happened (multiple choice), 3) Select injuries (checklist), 4) When did it happen (select ranges), 5) Were there witnesses/evidence?"),
            h3("Output Generator (lib/tools/accident-case-quiz.ts)"),
            para("Function: (answers) => ToolOutput. Logic: map accident type + circumstances to a case type classification. Return: educational summary, relevant accident hub link, suggested next steps (evidence, medical, consider lawyer), CTA to /find-help."),
            para("Output language: 'Based on what you described, cases like this are typically classified as [type]. This is general educational information — every situation is unique.'"),
        ],
    },
    {
        "id": 17,
        "name": "Build Tool: Urgency Checker",
        "phase": "4 — Tools",
        "hours": 4,
        "depends": "Task 15",
        "files": "content/tools/urgency-checker.json, lib/tools/urgency-checker.ts",
        "criteria": "Red-flag symptoms immediately show 911 banner. Green/yellow/red classification works. Medical disclaimer prominent.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read TOOLS-SPEC.md Tool 2. If ANY red-flag symptom selected, immediately show '911' emergency banner. This tool has the strongest medical disclaimer requirement.", "🚨"),
            divider(),
            h3("Red-flag symptoms (immediate 911 banner)"),
            bullet("Loss of consciousness"),
            bullet("Severe bleeding that won't stop"),
            bullet("Difficulty breathing"),
            bullet("Chest pain or pressure"),
            bullet("Numbness or paralysis"),
            bullet("Severe head/neck pain"),
            bullet("Confusion or slurred speech"),
            h3("Output: Red/Yellow/Green"),
            para("Red: 'Based on your answers, we strongly encourage you to seek medical attention immediately. Call 911 if needed.'"),
            para("Yellow: 'Your symptoms suggest you should see a doctor within 24-48 hours.'"),
            para("Green: 'Your symptoms may be mild, but delayed symptoms are common. Consider seeing a doctor within a week.'"),
            h3("Disclaimer (exact)"),
            code("This tool is for educational purposes only. It is not medical advice. Always consult a healthcare provider for medical concerns.", "plain text"),
        ],
    },
    {
        "id": 18,
        "name": "Build Tool: Evidence Checklist Generator",
        "phase": "4 — Tools",
        "hours": 5,
        "depends": "Task 15",
        "files": "content/tools/evidence-checklist.json, lib/tools/evidence-checklist.ts",
        "criteria": "Generates customized checklist by accident type. Priority-coded items. Printable via window.print(). Disclaimer present.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read TOOLS-SPEC.md Tool 3.", "📋"),
            divider(),
            h3("Steps: 1) Accident type, 2) Location type (road, business, workplace, home), 3) Witnesses?, 4) Police report?, 5) Photos taken?"),
            h3("Output Generator"),
            para("Generate checklist customized by accident type. Categories: Scene Evidence, Documents, Witnesses, Digital, Medical, Financial. Each item tagged: critical/important/helpful. Render as interactive checklist (user can check off). Add 'Print Checklist' button (window.print with print-friendly CSS)."),
        ],
    },
    {
        "id": 19,
        "name": "Build Tool: Injury Journal + Lawyer Type Matcher",
        "phase": "4 — Tools",
        "hours": 8,
        "depends": "Task 15",
        "files": "content/tools/injury-journal.json, lib/tools/injury-journal.ts, content/tools/lawyer-type-matcher.json, lib/tools/lawyer-type-matcher.ts, app/tools/injury-journal/page.tsx",
        "criteria": "Journal: daily entry form, pain scale, localStorage persistence, export to print. Lawyer Matcher: maps accident + severity to lawyer type with educational language.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read TOOLS-SPEC.md Tools 4 and 9.", "📋"),
            divider(),
            h3("Injury Journal"),
            para("This is a standalone tool (not just a quiz). It's a daily log that persists in localStorage."),
            bullet("Date selector (defaults to today)"),
            bullet("Pain level slider (1-10 with emoji faces)"),
            bullet("Symptoms checklist (pre-populated by injury type)"),
            bullet("Treatment log (free text)"),
            bullet("Medications (tag input)"),
            bullet("Activity limitations (checklist)"),
            bullet("Notes (textarea)"),
            bullet("View past entries (calendar view or list)"),
            bullet("Export all entries to printable format"),
            para("All data stays in localStorage. No server calls unless user opts in to Supabase sync later."),
            h3("Lawyer Type Matcher"),
            para("4-step quiz: 1) What happened, 2) How severe, 3) Special circumstances (commercial vehicle, government property, workplace), 4) State."),
            para("Output: 'Based on your answers, cases like this are typically handled by a [type] attorney.' + what to look for + questions to ask + CTA."),
            callout("Language: 'This is general information — every situation is unique.' NEVER 'you need' or 'we recommend'.", "🚨"),
        ],
    },

    # ── PHASE 5: CONTENT ──────────────────────────────────────────────────
    {
        "id": 20,
        "name": "Write all 5 accident hub content JSONs",
        "phase": "5 — Content",
        "hours": 10,
        "depends": "Task 10",
        "files": "content/accidents/car.json, content/accidents/truck.json, content/accidents/motorcycle.json, content/accidents/slip-and-fall.json, content/accidents/workplace.json",
        "criteria": "Each JSON validates against AccidentTypeSchema. Min 100-char descriptions. 5+ causes, 5+ injuries, 5+ steps. All cross-links populated. Original content, not generic.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read CONTENT-PLAN.md §1 for hub template. Read COMPLIANCE.md before writing ANY content. Never give legal advice. Use educational language only.", "🚨"),
            divider(),
            h3("Content Quality Requirements"),
            bullet("Original, substantial content — not thin rewrites"),
            bullet("Each hub: 5-10 common causes with explanations"),
            bullet("Each hub: link to relevant injury pages (by slug)"),
            bullet("Each hub: 5-8 immediate steps (first 15 min, 24 hrs, 7 days)"),
            bullet("Each hub: evidence checklist items by category"),
            bullet("Each hub: timeline risks with statute warnings"),
            bullet("Each hub: insurance issues specific to that accident type"),
            bullet("Each hub: 'when you need a specialist' guidance (educational, not advice)"),
            bullet("Each hub: relatedAccidents, relatedInjuries, relatedGuides, relatedTools arrays"),
            h3("Language Rules"),
            para("DO: 'Lawyers who typically handle matters like this include...'"),
            para("DO: 'You may benefit from speaking with...'"),
            para("NEVER: 'You should sue', 'You have a case', 'We recommend this lawyer'"),
            h3("Car Accidents Hub (most important — highest traffic)"),
            para("This is the anchor page. Make it the most comprehensive. Cover: rear-end, T-bone, head-on, sideswipe, hit-and-run, parking lot, highway, intersection. Include California and Arizona specific notes where relevant."),
        ],
    },
    {
        "id": 21,
        "name": "Write all 5 guide content JSONs",
        "phase": "5 — Content",
        "hours": 8,
        "depends": "Task 11",
        "files": "content/guides/after-car-accident.json, content/guides/evidence-checklist.json, content/guides/insurance-claims.json, content/guides/hiring-a-lawyer.json, content/guides/common-mistakes.json",
        "criteria": "Each JSON validates against GuideSchema. Min 3 sections with 50+ char content. Cross-links populated.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read CONTENT-PLAN.md §3 for guide pages. Educational tone throughout.", "📋"),
            divider(),
            h3("Guide Topics"),
            bullet("after-car-accident: Step-by-step what to do in the first 15 minutes, 24 hours, and 7 days"),
            bullet("evidence-checklist: Complete guide to collecting and preserving evidence after any accident"),
            bullet("insurance-claims: How the insurance claim process works, what to expect, common tactics"),
            bullet("hiring-a-lawyer: How to evaluate and choose a personal injury attorney, questions to ask"),
            bullet("common-mistakes: Top 10 mistakes people make after an accident that hurt their claim"),
            h3("Quality Bar"),
            para("Each guide should be 1500-2500 words of real, useful content. Think: would an injured person find this genuinely helpful? If it reads like SEO filler, rewrite it."),
        ],
    },
    {
        "id": 22,
        "name": "Write Home page + About + static page content",
        "phase": "5 — Content",
        "hours": 4,
        "depends": "Tasks 9, 12",
        "files": "content/pages/home.json, content/pages/about.json, content/pages/how-it-works.json, content/pages/for-attorneys.json",
        "criteria": "All page content complete. Trust copy substantiated. No prohibited language.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            para("Write compelling content for the home page sections, about page, how-it-works page, and attorney partner page. Every word must comply with COMPLIANCE.md. Focus on building trust and demonstrating genuine value."),
        ],
    },
    {
        "id": 23,
        "name": "Write CA + AZ state page JSONs",
        "phase": "5 — Content",
        "hours": 6,
        "depends": "Task 11",
        "files": "content/states/california.json, content/states/arizona.json",
        "criteria": "Both JSONs validate against StateDataSchema. reviewedBy set to 'Pending Legal Review'. All legal data fact-checked against current statutes.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("State-specific legal information MUST be fact-checked against current statutes. Set reviewedBy to 'Pending Legal Review' and reviewDate to today. These pages will NOT display until legal counsel signs off.", "🚨"),
            divider(),
            h3("California"),
            para("Statute of limitations: 2 years PI, 3 years property. Pure comparative fault. DMV SR-1 within 10 days. Insurance minimums: 15/30/5. Cover Prop 213 (uninsured drivers), MedPay, UM/UIM coverage. Key courts: Superior Courts of California."),
            h3("Arizona"),
            para("Statute of limitations: 2 years all categories. Pure comparative fault. Insurance minimums: 25/50/15. Cover: AZ ABS framework, no-fault insurance NOT required, mandatory liability insurance. Key: AZ allows suing for pain and suffering without threshold."),
        ],
    },
    {
        "id": 24,
        "name": "Research + write all 16 city page JSONs",
        "phase": "5 — Content",
        "hours": 16,
        "depends": "Task 23",
        "files": "content/cities/los-angeles.json, content/cities/san-diego.json, content/cities/san-jose.json, content/cities/san-francisco.json, content/cities/fresno.json, content/cities/sacramento.json, content/cities/long-beach.json, content/cities/oakland.json, content/cities/bakersfield.json, content/cities/anaheim.json, content/cities/phoenix.json, content/cities/tucson.json, content/cities/mesa.json, content/cities/chandler.json, content/cities/scottsdale.json, content/cities/gilbert.json",
        "criteria": "Each JSON validates against CityDataSchema. 200+ char unique description. 2+ real hospitals with addresses. 1+ real courts. NO templated content across cities.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("CRITICAL: Each city page must have REAL, UNIQUE local data. Research actual hospitals, courts, and local details. The Zod schema enforces minimums. Do NOT copy-paste between cities.", "🚨"),
            divider(),
            h3("Required Research Per City"),
            bullet("Population (US Census data)"),
            bullet("2+ hospitals with ER (name, address, phone if available)"),
            bullet("1+ county/municipal court (name, address)"),
            bullet("Notable accident corridors or intersections (local traffic data)"),
            bullet("Unique local description: what makes this city's accident landscape different"),
            h3("CA Cities (10)"),
            para("Los Angeles, San Diego, San Jose, San Francisco, Fresno, Sacramento, Long Beach, Oakland, Bakersfield, Anaheim"),
            h3("AZ Cities (6)"),
            para("Phoenix, Tucson, Mesa, Chandler, Scottsdale, Gilbert"),
            h3("Content Rules"),
            bullet("Each description must be genuinely unique — mention local geography, traffic patterns, demographics"),
            bullet("Set stateSlug and stateAbbreviation correctly"),
            bullet("Set commonAccidentTypes to the most relevant 3-5 for each city"),
            bullet("Set reviewedBy to 'Pending Legal Review'"),
        ],
    },

    # ── PHASE 6: SEO ──────────────────────────────────────────────────────
    {
        "id": 25,
        "name": "Implement all structured data + sitemap + internal linking",
        "phase": "6 — SEO",
        "hours": 8,
        "depends": "Tasks 20, 21, 22, 23, 24",
        "files": "app/sitemap.ts, app/robots.ts, lib/related.ts",
        "criteria": "sitemap.xml includes all pages partitioned. robots.txt correct. Internal links: every accident hub links to 3+ injury pages, every page has CTA. Google Rich Results Test validates all schema.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            callout("Read SEO-STRATEGY.md and SITE-ARCHITECTURE.md §Internal Linking Strategy.", "📋"),
            divider(),
            h3("app/sitemap.ts"),
            para("Dynamic sitemap generator. Group URLs: core pages, accident hubs, injury pages, guides, tools, state pages, city pages. Set appropriate changeFrequency and priority."),
            h3("app/robots.ts"),
            code("export default function robots() {\n  return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://accidentpath.com/sitemap.xml' }\n}", "typescript"),
            h3("lib/related.ts"),
            para("Internal linking engine. Functions: getRelatedContent(slug, type) returns related accidents, injuries, tools, guides. Used by every template to auto-generate 'Related' sections. Enforces SITE-ARCHITECTURE.md cross-linking rules:"),
            bullet("Every accident hub → 3+ injury pages"),
            bullet("Every injury → accident types that cause it"),
            bullet("Every guide → relevant tools"),
            bullet("Every page → at least 1 CTA to /find-help"),
            bullet("State pages → all accident types with state context"),
            h3("Unique Meta Titles + Descriptions"),
            para("Review every page's generateMetadata. Each must have a unique, compelling title (max 70 chars) and description (120-160 chars). Pull actual content details — never use templates."),
        ],
    },

    # ── PHASE 7: INTEGRATIONS ─────────────────────────────────────────────
    {
        "id": 26,
        "name": "Implement analytics events + CRM webhook stub",
        "phase": "7 — Integrations",
        "hours": 4,
        "depends": "Tasks 13, 15",
        "files": "lib/analytics.ts, app/api/webhook/route.ts",
        "criteria": "GA4 events fire correctly. CRM webhook endpoint accepts POST with lead data.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("lib/analytics.ts"),
            code("""type EventName = 'page_view' | 'intake_started' | 'step_completed' | 'intake_submitted' | 'tool_started' | 'tool_completed' | 'cta_clicked'

interface EventParams {
  tool_slug?: string
  step_number?: number
  accident_type?: string
  state?: string
  city?: string
}

export function trackEvent(name: EventName, params?: EventParams) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}""", "typescript"),
            h3("CRM Webhook Stub"),
            para("app/api/webhook/route.ts — POST endpoint that receives intake data and forwards to CRM. For now, log the payload and return 200. Structured for easy swap to real CRM later."),
        ],
    },

    # ── PHASE 8: QA + POLISH ──────────────────────────────────────────────
    {
        "id": 27,
        "name": "Write E2E tests (Playwright) for all critical flows",
        "phase": "8 — QA + Polish",
        "hours": 6,
        "depends": "Tasks 14, 19, 24",
        "files": "e2e/home.spec.ts, e2e/accident-hub.spec.ts, e2e/intake-flow.spec.ts, e2e/tools.spec.ts, playwright.config.ts",
        "criteria": "All tests pass. Coverage: home page renders, accident hub loads from CMS, intake flow completes 9 steps, tool quiz produces results.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("Install Playwright"),
            code("npm install -D @playwright/test\nnpx playwright install", "bash"),
            h3("Test Scenarios"),
            bullet("Home: renders hero, accident cards, CTA links work"),
            bullet("Accident hub: /accidents/car loads, all sections render, internal links work"),
            bullet("Intake: complete all 9 steps, verify submission, check thank-you page"),
            bullet("Tool: complete accident-case-quiz, verify results render with disclaimer"),
            bullet("State page: /states/california loads, city links work"),
            bullet("Mobile: test hamburger nav, bottom CTA bar visible"),
            bullet("Accessibility: no axe violations on home, accident hub, intake"),
        ],
    },
    {
        "id": 28,
        "name": "Unit tests + Lighthouse optimization + final polish",
        "phase": "8 — QA + Polish",
        "hours": 6,
        "depends": "Task 27",
        "files": "lib/__tests__/state-rules.test.ts, lib/__tests__/cms.test.ts",
        "criteria": "All unit tests pass. Lighthouse 90+ on home + accident hub + tools. No TypeScript errors. No console errors.",
        "prompt_blocks": [
            h2("Execution Prompt"),
            divider(),
            h3("Unit Tests"),
            bullet("state-rules.ts: verify CA returns 2yr SOL, AZ returns 2yr, unknown state returns null"),
            bullet("cms.ts: verify loading valid JSON succeeds, invalid JSON throws Zod error"),
            bullet("Tool output generators: verify each tool produces valid ToolOutput"),
            h3("Lighthouse Optimization"),
            bullet("Run: npx next build && npx lighthouse http://localhost:3000 --output json"),
            bullet("Target: Performance 90+, Accessibility 95+, Best Practices 90+, SEO 95+"),
            bullet("Common fixes: optimize images (next/image), defer non-critical JS, preload fonts, add missing meta tags"),
            h3("Final Polish Checklist"),
            bullet("Every page has unique <title> and <meta description>"),
            bullet("Every page has BreadcrumbList JSON-LD"),
            bullet("Every page has appropriate DisclaimerBanner"),
            bullet("No console errors in production build"),
            bullet("npm run build succeeds with zero warnings"),
            bullet("npx tsc --noEmit passes"),
        ],
    },
]


def main():
    print("=" * 60)
    print("AccidentPath — Creating AI Agent Dev Tasks Database")
    print("=" * 60)

    db = create_database()
    if not db:
        print("Failed to create database.")
        sys.exit(1)

    db_id = db["id"]
    print(f"\nPopulating {len(TASKS)} tasks with full execution prompts...")

    success = 0
    for i, task in enumerate(TASKS, 1):
        result = add_task(db_id, task)
        if result:
            success += 1
            print(f"  [{i}/{len(TASKS)}] ✅ {task['name'][:65]}")
        else:
            print(f"  [{i}/{len(TASKS)}] ❌ FAILED: {task['name'][:65]}")
        # Rate limit
        time.sleep(0.5)

    print(f"\n{'=' * 60}")
    print(f"Done! {success}/{len(TASKS)} tasks created.")
    print(f"Database URL: {db.get('url')}")
    print(f"Database ID:  {db_id}")

    config_path = os.path.join(PROJECT_DIR, ".notion-agent-db-id")
    with open(config_path, "w") as f:
        f.write(db_id)
    print(f"Saved to: {config_path}")


if __name__ == "__main__":
    main()
