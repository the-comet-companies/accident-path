#!/usr/bin/env python3
"""
Create AccidentPath Master Pipeline Database — EVERYTHING in one DB.
Uses the same status system as all other Comet Companies pipelines.
"""
import os, sys, time, requests

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE = os.path.dirname(os.path.dirname(os.path.dirname(SCRIPT_DIR)))
with open(os.path.join(WORKSPACE, ".env")) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ[k.strip()] = v.strip()

API_KEY = os.environ["NOTION_API_KEY"]
PAGE_ID = "328917dc7b8380b29f18c67de494adc0"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json", "Notion-Version": "2022-06-28"}
BASE = "https://api.notion.com/v1"

def api(method, ep, data=None):
    r = requests.request(method, f"{BASE}/{ep}", headers=HEADERS, json=data)
    if r.status_code >= 400:
        print(f"  ERR {r.status_code}: {r.text[:300]}")
        return None
    return r.json()


def create_db():
    payload = {
        "parent": {"type": "page_id", "page_id": PAGE_ID},
        "title": [{"type": "text", "text": {"content": "AccidentPath Master Pipeline"}}],
        "icon": {"type": "emoji", "emoji": "⚡"},
        "properties": {
            "Name": {"title": {}},
            "Status": {
                "select": {
                    "options": [
                        # To-do
                        {"name": "Blocked", "color": "red"},
                        {"name": "Focus", "color": "orange"},
                        {"name": "Ready", "color": "green"},
                        # In progress
                        {"name": "Pending Review", "color": "purple"},
                        {"name": "Delegate", "color": "gray"},
                        {"name": "In Progress", "color": "blue"},
                        {"name": "Next Up", "color": "green"},
                        {"name": "Hold", "color": "yellow"},
                        # Complete
                        {"name": "Pipelines", "color": "pink"},
                        {"name": "Archived", "color": "brown"},
                        {"name": "Resource", "color": "green"},
                        {"name": "Done", "color": "green"},
                    ]
                }
            },
            "Section": {
                "select": {
                    "options": [
                        {"name": "1 — Vision & Model", "color": "blue"},
                        {"name": "2 — Compliance", "color": "red"},
                        {"name": "3 — Competitors", "color": "orange"},
                        {"name": "4 — Tech & Architecture", "color": "purple"},
                        {"name": "5 — Dev Sprint", "color": "green"},
                        {"name": "6 — Team", "color": "pink"},
                        {"name": "7 — Strategy Docs", "color": "gray"},
                        {"name": "8 — SEO", "color": "yellow"},
                        {"name": "9 — Lead Gen", "color": "brown"},
                        {"name": "Business/Legal", "color": "red"},
                    ]
                }
            },
            "Type": {
                "select": {
                    "options": [
                        {"name": "Task", "color": "blue"},
                        {"name": "Competitor", "color": "orange"},
                        {"name": "Document", "color": "gray"},
                        {"name": "Strategy", "color": "purple"},
                        {"name": "Decision", "color": "green"},
                        {"name": "Requirement", "color": "red"},
                        {"name": "Tool", "color": "yellow"},
                        {"name": "Page", "color": "pink"},
                        {"name": "Integration", "color": "brown"},
                        {"name": "Role", "color": "default"},
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
            "Owner": {
                "select": {
                    "options": [
                        {"name": "Michael", "color": "blue"},
                        {"name": "Joner / Claude", "color": "purple"},
                        {"name": "Content Writer", "color": "green"},
                        {"name": "Legal Counsel", "color": "red"},
                        {"name": "SEO Specialist", "color": "orange"},
                        {"name": "Designer", "color": "pink"},
                        {"name": "QA Engineer", "color": "brown"},
                        {"name": "Rogelio", "color": "yellow"},
                        {"name": "Developer", "color": "default"},
                    ]
                }
            },
            "Est. Hours": {"number": {"format": "number"}},
            "Phase": {"rich_text": {}},
            "Dependencies": {"rich_text": {}},
            "URL": {"url": {}},
            "State": {
                "multi_select": {
                    "options": [
                        {"name": "CA", "color": "blue"},
                        {"name": "AZ", "color": "orange"},
                    ]
                }
            },
            "Notes": {"rich_text": {}},
        },
    }
    result = api("POST", "databases", payload)
    if result:
        print(f"✅ Database created: {result['id']}")
        print(f"   URL: {result.get('url')}")
    return result


def add(db_id, item):
    props = {"Name": {"title": [{"text": {"content": item["name"]}}]}}
    if item.get("status"): props["Status"] = {"select": {"name": item["status"]}}
    if item.get("section"): props["Section"] = {"select": {"name": item["section"]}}
    if item.get("type"): props["Type"] = {"select": {"name": item["type"]}}
    if item.get("priority"): props["Priority"] = {"select": {"name": item["priority"]}}
    if item.get("owner"): props["Owner"] = {"select": {"name": item["owner"]}}
    if item.get("hours"): props["Est. Hours"] = {"number": item["hours"]}
    if item.get("phase"): props["Phase"] = {"rich_text": [{"text": {"content": item["phase"]}}]}
    if item.get("deps"): props["Dependencies"] = {"rich_text": [{"text": {"content": item["deps"]}}]}
    if item.get("url"): props["URL"] = {"url": item["url"]}
    if item.get("state"): props["State"] = {"multi_select": [{"name": s} for s in item["state"]]}
    if item.get("notes"): props["Notes"] = {"rich_text": [{"text": {"content": item["notes"][:2000]}}]}
    return api("POST", "pages", {"parent": {"database_id": db_id}, "properties": props})


# ════════════════════════════════════════════════════════════════════════
# ALL ITEMS
# ════════════════════════════════════════════════════════════════════════

ITEMS = [
    # ── 1. VISION & BUSINESS MODEL ─────────────────────────────────────
    {"name": "Core Value Prop: 'Your first 15 minutes after an accident'", "section": "1 — Vision & Model", "type": "Decision", "status": "Done", "notes": "Help injured people answer: What happened? How urgent? What kind of lawyer? What do I do next?"},
    {"name": "Brand: AccidentPath (accidentpath.com)", "section": "1 — Vision & Model", "type": "Decision", "status": "Done", "notes": "Backup: injuryready.com. Tagline: Your path to recovery starts here."},
    {"name": "Revenue: Marketing-qualified leads ($200-400/lead)", "section": "1 — Vision & Model", "type": "Strategy", "status": "Ready", "notes": "Per-lead pricing for vetted intake leads. Target: 50 leads/mo = $10-20K/mo"},
    {"name": "Revenue: Signed cases (20% fee structure)", "section": "1 — Vision & Model", "type": "Strategy", "status": "Ready", "notes": "Fee per signed case under approved state structures"},
    {"name": "Revenue: Geographic exclusivity (monthly fee)", "section": "1 — Vision & Model", "type": "Strategy", "status": "Ready", "notes": "Monthly fee for exclusive territory coverage"},
    {"name": "Revenue: Intake as a service", "section": "1 — Vision & Model", "type": "Strategy", "status": "Ready", "notes": "Outsourced intake for partner law firms"},
    {"name": "Moat: Educational content (300+ pages planned)", "section": "1 — Vision & Model", "type": "Strategy", "status": "Ready", "notes": "Zero competitors have educational content. Google rewards depth."},
    {"name": "Moat: 10 interactive tools", "section": "1 — Vision & Model", "type": "Strategy", "status": "Ready", "notes": "Zero competitors have ANY interactive tools"},
    {"name": "Moat: Bilingual (EN/ES)", "section": "1 — Vision & Model", "type": "Strategy", "status": "Ready", "notes": "39% CA speaks Spanish. Only 1/9 competitors has basic Spanish."},
    {"name": "Moat: Compliance architecture (LRS-ready)", "section": "1 — Vision & Model", "type": "Strategy", "status": "Ready", "notes": "Can operate where others can't"},
    {"name": "Rock Point Legal Funding partnership", "section": "1 — Vision & Model", "type": "Strategy", "status": "Ready", "owner": "Michael", "notes": "rockpointlegalfunding.com — already offers Spanish support"},

    # ── 2. COMPLIANCE ───────────────────────────────────────────────────
    {"name": "Lane A: Launch as educational brand + lead gen + intake platform", "section": "2 — Compliance", "type": "Decision", "status": "Done", "priority": "P0 — Critical", "notes": "NOT claiming to be a law firm. Explicit disclaimers. See COMPLIANCE.md"},
    {"name": "CA: Email LRS@calbar.ca.gov for certification application", "section": "2 — Compliance", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Michael", "state": ["CA"], "notes": "B&P Code §§6155-6156. Required for CA lawyer referral operations."},
    {"name": "CA: Map compliance rules (LRS cert, fee-sharing, UPL)", "section": "2 — Compliance", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Legal Counsel", "hours": 6, "state": ["CA"]},
    {"name": "AZ: Map compliance rules (ABS framework, advertising)", "section": "2 — Compliance", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Legal Counsel", "hours": 6, "state": ["AZ"], "notes": "AZ ABS framework exists. Paid lead gen allowed but cannot imply recommendation."},
    {"name": "Retain legal ethics counsel (PI / LRS specialist)", "section": "2 — Compliance", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Michael", "hours": 4, "notes": "BLOCKS all state content, disclaimers, panel agreements"},
    {"name": "Draft privacy policy + terms of service + disclaimers", "section": "2 — Compliance", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Legal Counsel", "hours": 8, "deps": "Retain legal counsel"},
    {"name": "Draft panel agreement template (attorney partner contract)", "section": "2 — Compliance", "type": "Task", "status": "Ready", "priority": "P1 — High", "owner": "Legal Counsel", "hours": 6, "deps": "Retain legal counsel"},
    {"name": "Language rule: SAFE — 'lawyers who typically handle matters like this include...'", "section": "2 — Compliance", "type": "Requirement", "status": "Resource", "notes": "COMPLIANCE.md §3. All agents/builders must use these patterns."},
    {"name": "Language rule: PROHIBITED — never say 'we recommend' / 'you have a case'", "section": "2 — Compliance", "type": "Requirement", "status": "Resource", "notes": "COMPLIANCE.md §3. NEVER in any user-facing content."},
    {"name": "Disclaimer: every page footer text", "section": "2 — Compliance", "type": "Requirement", "status": "Resource", "notes": "AccidentPath is not a law firm and does not provide legal advice..."},
    {"name": "Disclaimer: intake/matching pages text", "section": "2 — Compliance", "type": "Requirement", "status": "Resource", "notes": "Attorneys in our network may pay a fee for marketing services..."},
    {"name": "Disclaimer: tool pages text", "section": "2 — Compliance", "type": "Requirement", "status": "Resource", "notes": "This tool is for informational and educational purposes only..."},
    {"name": "Register AccidentPath LLC (CA Secretary of State)", "section": "2 — Compliance", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Michael", "hours": 2},
    {"name": "Set up business bank account + Stripe for partner billing", "section": "2 — Compliance", "type": "Task", "status": "Ready", "priority": "P1 — High", "owner": "Michael", "hours": 3, "deps": "Register LLC"},

    # ── 3. COMPETITORS (all 38 + key non-LRS) ──────────────────────────
    # For-profit (Category A)
    {"name": "LegalMatch (legalmatch.com) — 7.3/10", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://legalmatch.com", "notes": "#1 SEO competitor. $500K-1.5M/mo ads. 1.8-star reviews. 5-step funnel with free-text conversion killer. No tools, no Spanish."},
    {"name": "LawLinq (lawlinq.com) — 6.8/10", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://lawlinq.com", "notes": "Best for-profit LRS. Phone-first, 24/7. ~140 pages. Basic Spanish via WPML. Zero city pages. No visible paid search."},
    {"name": "RepresentYou (representyou.com) — 5.8/10", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://representyou.com", "notes": "Squarespace, 6 URLs total. Unverified $1B claim. Cherry-picks high-value PI cases."},
    {"name": "Attorney Search Network (attorneysearchnetwork.com) — 5.3/10", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://attorneysearchnetwork.com", "notes": "200+ areas, 58 county pages, affiliate program, MarketingHoldings.com backend. ColdFusion, broken structured data."},
    {"name": "Beverly Hills Law Network (beverlyhillslawnetwork.com) — 5.2/10", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://beverlyhillslawnetwork.com", "notes": "WordPress/Elementor, aggressive CTAs, 310 number. No SEO meta, no content."},
    {"name": "Higher Legal (higherlegal.com) — 5.0/10", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://higherlegal.com", "notes": "Only modern threat. Astro-built, 22 blog posts, competitor comparison content. But no tools, no Spanish."},
    {"name": "1000Attorneys (1000attorneys.com) — 2.7/10", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://1000attorneys.com", "notes": "Wix shell, ranks for 'CA lawyer referral' on domain name alone. No content."},
    {"name": "Legal Leaf LRS (legalleaflrs.com) — N/A", "section": "3 — Competitors", "type": "Competitor", "status": "Archived", "url": "https://legalleaflrs.com", "notes": "Domain is now a cannabis store."},
    {"name": "Prime Attorneys (primeattorneys.com) — N/A", "section": "3 — Competitors", "type": "Competitor", "status": "Archived", "url": "https://primeattorneys.com", "notes": "403 blocked / site down."},
    # County Bars (Category B)
    {"name": "SF-Marin LRIS (sfbar.org) — GOLD", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://sfbar.org", "notes": "Spanish, 20+ areas, Military/Veterans/ADA/Senior programs. Steal: niche sub-programs."},
    {"name": "OC Bar LRIS (ocbar.org)", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://ocbar.org", "notes": "50 years, 35 areas, bilingual, ABA-certified, dated design."},
    {"name": "San Fernando Valley ARS (sfvbareferral.com)", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://sfvbareferral.com", "notes": "Cert #0006, 150+ attorneys, 15K requests/year. Market sizing data."},
    {"name": "San Diego County LRIS (sdcba.org) — 404", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://sdcba.org", "notes": "Page broken. SEO opportunity: capture 'san diego lawyer referral' traffic."},
    {"name": "Alameda County LRIS (acbanet.org) — 404", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://acbanet.org", "notes": "Page broken. SEO opportunity."},
    {"name": "Contra Costa County LRIS (cccba.org) — 404", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://cccba.org", "notes": "Page broken. SEO opportunity."},
    {"name": "Santa Clara County LRIS (sccba.com) — 404", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://sccba.com", "notes": "Page broken. SEO opportunity."},
    {"name": "San Bernardino County LRIS (sbcba.org) — 404", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://sbcba.org", "notes": "Page broken. SEO opportunity."},
    {"name": "Riverside County LRIS (riversidelrs.org) — TIMEOUT", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://riversidelrs.org", "notes": "Site unresponsive."},
    {"name": "Fresno County Bar (fresnocountybar.org) — 404", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://fresnocountybar.org", "notes": "Page broken."},
    {"name": "Ventura County LRIS (vcba.org) — 404", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://vcba.org", "notes": "Page broken."},
    # Niche (Category C)
    {"name": "CANHR — 8-language fact sheets (canhr.org)", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://canhr.org", "notes": "GOLD: EN, ES, ZH, JA, KO, VI, RU, TL. 40+ year history. Steal: multi-language strategy."},
    {"name": "SmartLaw / MABA (smartlaw.org)", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://smartlaw.org", "notes": "Multi-step wizard with payment. NO Spanish despite Mexican American bar."},
    {"name": "AIDS Legal Referral Panel (alrp.org)", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "url": "https://alrp.org", "notes": "GOLD: EN/ES, charity ratings displayed, operational transparency."},
    # Non-LRS but relevant
    {"name": "Internet Brands (Avvo + Nolo + Martindale + AllLaw)", "section": "3 — Competitors", "type": "Competitor", "status": "Resource", "notes": "KKR-owned. DA 80-90+. GENERAL legal dirs. Can't pivot to PI-specialized consumer-first. Not a direct threat."},

    # ── 4. TECH & ARCHITECTURE ─────────────────────────────────────────
    {"name": "Framework: Next.js 14+ App Router", "section": "4 — Tech & Architecture", "type": "Decision", "status": "Done"},
    {"name": "Language: TypeScript (strict mode)", "section": "4 — Tech & Architecture", "type": "Decision", "status": "Done"},
    {"name": "Styling: Tailwind CSS", "section": "4 — Tech & Architecture", "type": "Decision", "status": "Done"},
    {"name": "Database: Supabase (Postgres)", "section": "4 — Tech & Architecture", "type": "Decision", "status": "Done"},
    {"name": "Deployment: Vercel", "section": "4 — Tech & Architecture", "type": "Decision", "status": "Done"},
    {"name": "CMS: JSON content system (Zod validated)", "section": "4 — Tech & Architecture", "type": "Decision", "status": "Done"},
    {"name": "Analytics: GA4 + GSC + Microsoft Clarity", "section": "4 — Tech & Architecture", "type": "Decision", "status": "Done"},
    {"name": "i18n: next-intl (EN default, ES future)", "section": "4 — Tech & Architecture", "type": "Decision", "status": "Done"},
    # Pages
    {"name": "Page: Home", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready", "notes": "Hero, trust, how-it-works, category grid, tools, state selector"},
    {"name": "Page: /accidents/car", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready", "notes": "Anchor hub. Highest traffic potential."},
    {"name": "Page: /accidents/truck", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /accidents/motorcycle", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /accidents/slip-and-fall", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /accidents/workplace", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /guides/after-car-accident", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /guides/evidence-checklist", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /guides/insurance-claims", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /guides/hiring-a-lawyer", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /guides/common-mistakes", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /states/california", "section": "4 — Tech & Architecture", "type": "Page", "status": "Blocked", "state": ["CA"], "notes": "Blocked: needs counsel review before publish"},
    {"name": "Page: /states/arizona", "section": "4 — Tech & Architecture", "type": "Page", "status": "Blocked", "state": ["AZ"], "notes": "Blocked: needs counsel review before publish"},
    # City pages
    *[{"name": f"Page: /states/california/{c}", "section": "4 — Tech & Architecture", "type": "Page", "status": "Blocked", "state": ["CA"], "notes": "Unique local data required. Blocked: needs counsel review."} for c in ["los-angeles","san-diego","san-jose","san-francisco","fresno","sacramento","long-beach","oakland","bakersfield","anaheim"]],
    *[{"name": f"Page: /states/arizona/{c}", "section": "4 — Tech & Architecture", "type": "Page", "status": "Blocked", "state": ["AZ"], "notes": "Unique local data required. Blocked: needs counsel review."} for c in ["phoenix","tucson","mesa","chandler","scottsdale","gilbert"]],
    # Static pages
    {"name": "Page: /about", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /about/how-it-works", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /privacy", "section": "4 — Tech & Architecture", "type": "Page", "status": "Blocked", "notes": "Blocked: needs legal counsel draft"},
    {"name": "Page: /terms", "section": "4 — Tech & Architecture", "type": "Page", "status": "Blocked", "notes": "Blocked: needs legal counsel draft"},
    {"name": "Page: /disclaimers", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /for-attorneys", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /contact", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    {"name": "Page: /find-help (intake wizard)", "section": "4 — Tech & Architecture", "type": "Page", "status": "Ready"},
    # Tools
    {"name": "Tool: Accident Case Type Quiz (/tools/accident-case-quiz)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P0 — Critical", "notes": "P0 launch tool"},
    {"name": "Tool: Urgency Checker (/tools/urgency-checker)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P0 — Critical", "notes": "Red/yellow/green + 911 banner. P0 launch tool"},
    {"name": "Tool: Evidence Checklist Generator (/tools/evidence-checklist)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P0 — Critical", "notes": "PDF export. Most linkable asset. P0 launch tool"},
    {"name": "Tool: Injury Journal (/tools/injury-journal)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P0 — Critical", "notes": "Local-first, daily pain tracker, PDF export. P0 launch tool"},
    {"name": "Tool: Lawyer Type Matcher (/tools/lawyer-type-matcher)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P0 — Critical", "notes": "P0 launch tool"},
    {"name": "Tool: Lost Wages Estimator (/tools/lost-wages-estimator)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P2 — Medium", "notes": "Post-launch"},
    {"name": "Tool: Insurance Call Prep (/tools/insurance-call-prep)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P2 — Medium", "notes": "Post-launch"},
    {"name": "Tool: Record Request (/tools/record-request)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P2 — Medium", "notes": "Post-launch"},
    {"name": "Tool: Settlement Readiness (/tools/settlement-readiness)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P2 — Medium", "notes": "Post-launch"},
    {"name": "Tool: State Next-Steps (/tools/state-next-steps)", "section": "4 — Tech & Architecture", "type": "Tool", "status": "Ready", "priority": "P2 — Medium", "notes": "Post-launch. Gated on counsel review."},

    # ── 5. DEV SPRINT (28 tasks) ───────────────────────────────────────
    {"name": "DEV-01: Init Next.js 14 + TS + Tailwind project", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 2, "phase": "Phase 0"},
    {"name": "DEV-02: Folder structure + Zod data models + CMS loader", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 3, "phase": "Phase 0", "deps": "DEV-01"},
    {"name": "DEV-03: Supabase schema (leads, tools, journal)", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 2, "phase": "Phase 0", "deps": "DEV-01"},
    {"name": "DEV-04: Core UI components (CTAButton, TrustBadge, DisclaimerBanner, EmergencyBanner, Breadcrumb)", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 4, "phase": "Phase 1", "deps": "DEV-01"},
    {"name": "DEV-05: Header with mega-menu + MobileNav", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 4, "phase": "Phase 1", "deps": "DEV-04"},
    {"name": "DEV-06: Footer with compliance disclaimers", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 3, "phase": "Phase 1", "deps": "DEV-04"},
    {"name": "DEV-07: SEO primitives (SchemaOrg, MetaTags, CanonicalUrl)", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 3, "phase": "Phase 1", "deps": "DEV-02"},
    {"name": "DEV-08: StateSelector + Compliance HOC", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 3, "phase": "Phase 1", "deps": "DEV-02"},
    {"name": "DEV-09: Home page template", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 6, "phase": "Phase 2", "deps": "DEV-04,05,06,07,08"},
    {"name": "DEV-10: Accident Hub template (/accidents/[slug])", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 5, "phase": "Phase 2", "deps": "DEV-07,08,09"},
    {"name": "DEV-11: Guide + Injury + State + City templates", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 8, "phase": "Phase 2", "deps": "DEV-10"},
    {"name": "DEV-12: Tool template + static pages", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 5, "phase": "Phase 2", "deps": "DEV-10"},
    {"name": "DEV-13: IntakeWizard (9-step, progress bar, localStorage)", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 8, "phase": "Phase 3", "deps": "DEV-04,08"},
    {"name": "DEV-14: State rules engine (CA+AZ) + find-help flow + Server Actions", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 6, "phase": "Phase 3", "deps": "DEV-03,13"},
    {"name": "DEV-15: Shared ToolEngine component", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 4, "phase": "Phase 4", "deps": "DEV-12"},
    {"name": "DEV-16: Tool: Accident Case Quiz", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 4, "phase": "Phase 4", "deps": "DEV-15"},
    {"name": "DEV-17: Tool: Urgency Checker", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 4, "phase": "Phase 4", "deps": "DEV-15"},
    {"name": "DEV-18: Tool: Evidence Checklist Generator", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 5, "phase": "Phase 4", "deps": "DEV-15"},
    {"name": "DEV-19: Tool: Injury Journal + Lawyer Type Matcher", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 8, "phase": "Phase 4", "deps": "DEV-15"},
    {"name": "DEV-20: Write 5 accident hub content JSONs", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 10, "phase": "Phase 5", "deps": "DEV-10"},
    {"name": "DEV-21: Write 5 guide content JSONs", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 8, "phase": "Phase 5", "deps": "DEV-11"},
    {"name": "DEV-22: Write Home + About + static page content", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 4, "phase": "Phase 5", "deps": "DEV-09,12"},
    {"name": "DEV-23: Write CA + AZ state page JSONs", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 6, "phase": "Phase 5", "deps": "DEV-11"},
    {"name": "DEV-24: Research + write 16 city page JSONs", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 16, "phase": "Phase 5", "deps": "DEV-23"},
    {"name": "DEV-25: Structured data + sitemap + internal linking engine", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 8, "phase": "Phase 6", "deps": "DEV-20,21,22,23,24"},
    {"name": "DEV-26: Analytics events + CRM webhook stub", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 4, "phase": "Phase 7", "deps": "DEV-13,15"},
    {"name": "DEV-27: E2E tests (Playwright)", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 6, "phase": "Phase 8", "deps": "DEV-14,19,24"},
    {"name": "DEV-28: Unit tests + Lighthouse 90+ + final polish", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude", "hours": 6, "phase": "Phase 8", "deps": "DEV-27"},

    # ── 6. TEAM ────────────────────────────────────────────────────────
    {"name": "Role: Michael — Business ops, attorney recruitment, paid media, approvals", "section": "6 — Team", "type": "Role", "status": "Resource", "owner": "Michael"},
    {"name": "Role: Joner — Project overseer, reviews Claude output, handles infra", "section": "6 — Team", "type": "Role", "status": "Resource", "owner": "Joner / Claude"},
    {"name": "Role: Claude Code — Primary builder, executes all 28 dev tasks", "section": "6 — Team", "type": "Role", "status": "Resource", "owner": "Joner / Claude"},
    {"name": "Role: Legal Counsel — State compliance, content review, disclaimers (TBD)", "section": "6 — Team", "type": "Role", "status": "Ready", "owner": "Legal Counsel"},
    {"name": "Role: Rogelio — Full lead access (pending setup)", "section": "6 — Team", "type": "Role", "status": "Ready", "owner": "Rogelio"},
    {"name": "Recruit 5 PI attorneys in LA metro", "section": "6 — Team", "type": "Task", "status": "Ready", "priority": "P1 — High", "owner": "Michael", "hours": 10, "state": ["CA"], "deps": "Panel agreement"},
    {"name": "Recruit 5 PI attorneys in Phoenix metro", "section": "6 — Team", "type": "Task", "status": "Ready", "priority": "P1 — High", "owner": "Michael", "hours": 10, "state": ["AZ"], "deps": "Panel agreement"},

    # ── 7. STRATEGY DOCS ───────────────────────────────────────────────
    *[{"name": f"Doc: {d}", "section": "7 — Strategy Docs", "type": "Document", "status": "Resource", "notes": n} for d, n in [
        ("CLAUDE.md", "Master project instructions"),
        ("PRD.md", "Full product requirements"),
        ("COMPLIANCE.md", "Legal compliance rules (NON-NEGOTIABLE)"),
        ("SITE-ARCHITECTURE.md", "Routes, components, data models, schema"),
        ("SEO-STRATEGY.md", "SEO plan, clusters, structured data"),
        ("DESIGN-SYSTEM.md", "Brand feel, typography, colors, UX"),
        ("CONTENT-PLAN.md", "Content modules and topic clusters"),
        ("TOOLS-SPEC.md", "10 interactive tool specifications"),
        ("BUSINESS-CONTEXT.md", "Competitors, revenue model, moat"),
        ("ROADMAP.md", "90-day phased rollout plan"),
        ("MASTER-PLAN.md", "Full implementation plan with cost estimates"),
        ("COMPETITOR-ANALYSIS.md", "9 competitor UX/design audit"),
        ("FULL-38-COMPETITOR-AUDIT.md", "All 38 CA LRS sites audited"),
        ("COMPETITOR-LEAD-GEN.md", "Master lead gen strategy analysis"),
        ("LEGALMATCH-DEEP-DIVE.md", "LegalMatch full teardown"),
        ("LAWLINQ-DEEP-DIVE.md", "LawLinq full teardown"),
        ("LRS-LEAD-GEN-STRATEGIES.md", "5 other LRS competitor strategies"),
        ("PI-LEAD-GEN-MARKET-INTELLIGENCE.md", "Industry map, CPC, lead pricing"),
        ("SPANISH-STRATEGY.md", "Bilingual implementation plan"),
        ("BUILD-PROMPTS.md", "12 copy-paste agent prompts"),
        ("VALUE-ENGINE.md", "Agent roster + traffic automations"),
    ]],

    # ── 8. SEO ─────────────────────────────────────────────────────────
    {"name": "SEO: 8 topic clusters (accident, injury, guides, tools, insurance, medical, state, lawyer)", "section": "8 — SEO", "type": "Strategy", "status": "Ready", "priority": "P0 — Critical"},
    {"name": "SEO: E-E-A-T — attorney review badges + dates on every legal page", "section": "8 — SEO", "type": "Requirement", "status": "Ready", "priority": "P0 — Critical"},
    {"name": "SEO: Schema.org — Organization, BreadcrumbList, QAPage, Article", "section": "8 — SEO", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude"},
    {"name": "SEO: Dynamic sitemap.xml (partitioned by section)", "section": "8 — SEO", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude"},
    {"name": "SEO: Internal linking engine (hub↔injuries↔tools↔state↔city)", "section": "8 — SEO", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Joner / Claude"},
    {"name": "SEO: Unique meta titles + descriptions for all 39 pages", "section": "8 — SEO", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "SEO Specialist"},
    {"name": "SEO: Local — 16 city pages with unique data (hospitals, courts)", "section": "8 — SEO", "type": "Strategy", "status": "Ready", "priority": "P0 — Critical"},
    {"name": "SEO: Local — capture broken county bar URLs (7/15 return 404)", "section": "8 — SEO", "type": "Strategy", "status": "Ready", "priority": "P1 — High"},
    {"name": "SEO: Spanish — 5-10x less competition, /es/ routes", "section": "8 — SEO", "type": "Strategy", "status": "Ready", "priority": "P1 — High"},
    {"name": "SEO: Content velocity — Reddit harvester → 3 articles/week post-launch", "section": "8 — SEO", "type": "Strategy", "status": "Ready", "priority": "P1 — High"},
    {"name": "SEO: Link building — tools as linkable assets, PDFs, press", "section": "8 — SEO", "type": "Strategy", "status": "Ready", "priority": "P1 — High"},
    {"name": "SEO: Lighthouse 90+ on all pages", "section": "8 — SEO", "type": "Requirement", "status": "Ready", "priority": "P0 — Critical"},

    # ── 9. LEAD GEN ────────────────────────────────────────────────────
    {"name": "Lead Gen: Phase 1 — Organic first (Day 1-38). 39 pages + 5 tools.", "section": "9 — Lead Gen", "type": "Strategy", "status": "Ready", "priority": "P0 — Critical"},
    {"name": "Lead Gen: Phase 2 — Paid test AZ ($3-5K/mo) then LA ($5-8K/mo)", "section": "9 — Lead Gen", "type": "Strategy", "status": "Ready", "priority": "P1 — High"},
    {"name": "Lead Gen: Phase 3 — Scale. 3 articles/week, Spanish, PDF magnets.", "section": "9 — Lead Gen", "type": "Strategy", "status": "Ready", "priority": "P1 — High"},
    {"name": "Lead Gen: DO NOT bid head terms ($300-500/click)", "section": "9 — Lead Gen", "type": "Decision", "status": "Resource", "notes": "Target long-tail: 'what to do after accident phoenix' not 'car accident lawyer'"},
    {"name": "Lead Gen: NO shared leads — direct consumer trust is our moat", "section": "9 — Lead Gen", "type": "Decision", "status": "Resource"},
    {"name": "Lead Gen: Help partner attorneys set up LSAs (value-add)", "section": "9 — Lead Gen", "type": "Strategy", "status": "Ready", "priority": "P2 — Medium", "notes": "We can't run LSAs ourselves (not a law firm). But we can help partners optimize theirs."},
    {"name": "Lead Gen: Target $150-250/lead CA, $100-200/lead AZ", "section": "9 — Lead Gen", "type": "Decision", "status": "Resource", "notes": "Starting prices. Exclusive leads."},
    {"name": "Lead Gen: Revenue target — 50 leads/mo = $10-20K/mo", "section": "9 — Lead Gen", "type": "Strategy", "status": "Ready"},

    # ── INTEGRATIONS ───────────────────────────────────────────────────
    {"name": "Integration: GA4 + Google Search Console", "section": "4 — Tech & Architecture", "type": "Integration", "status": "Ready", "owner": "Michael", "hours": 2},
    {"name": "Integration: CRM webhook endpoint", "section": "4 — Tech & Architecture", "type": "Integration", "status": "Ready", "owner": "Developer", "hours": 4},
    {"name": "Integration: Call tracking (CA + AZ number pools)", "section": "4 — Tech & Architecture", "type": "Integration", "status": "Ready", "owner": "Michael", "hours": 4},
    {"name": "Integration: Email notifications (Resend)", "section": "4 — Tech & Architecture", "type": "Integration", "status": "Ready", "owner": "Developer", "hours": 3},
    {"name": "Integration: SMS notifications (Twilio)", "section": "4 — Tech & Architecture", "type": "Integration", "status": "Ready", "owner": "Developer", "hours": 3},
    {"name": "Integration: Microsoft Clarity heatmaps", "section": "4 — Tech & Architecture", "type": "Integration", "status": "Ready", "owner": "Developer", "hours": 1},
    {"name": "Integration: Sentry error tracking", "section": "4 — Tech & Architecture", "type": "Integration", "status": "Ready", "owner": "Developer", "hours": 2},

    # ── QA ─────────────────────────────────────────────────────────────
    {"name": "QA: Lighthouse audit all templates (90+ target)", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "QA Engineer", "hours": 4, "phase": "Phase 8"},
    {"name": "QA: WCAG 2.2 AA accessibility audit", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "QA Engineer", "hours": 6, "phase": "Phase 8"},
    {"name": "QA: Full compliance review — every page vs COMPLIANCE.md", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Legal Counsel", "hours": 8, "phase": "Phase 8"},
    {"name": "QA: Cross-browser + mobile device testing", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "QA Engineer", "hours": 4, "phase": "Phase 8"},
    {"name": "Launch: DNS cutover accidentpath.com → Vercel", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Michael", "hours": 1, "phase": "Launch", "deps": "All QA passed"},
    {"name": "Launch: Smoke test + Slack alert on first 10 leads", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Michael", "hours": 2, "phase": "Launch", "deps": "DNS cutover"},

    # ── POST-LAUNCH ────────────────────────────────────────────────────
    {"name": "Post-Launch: Paid search LA + Phoenix (car, truck accidents)", "section": "9 — Lead Gen", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Michael", "hours": 8},
    {"name": "Post-Launch: Remaining 10 accident hub content", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P1 — High", "owner": "Content Writer", "hours": 30, "phase": "Post-Launch"},
    {"name": "Post-Launch: Injury type pages (7 pages)", "section": "5 — Dev Sprint", "type": "Task", "status": "Ready", "priority": "P1 — High", "owner": "Content Writer", "hours": 14, "phase": "Post-Launch"},
    {"name": "Post-Launch: Reddit Question Harvester cron job", "section": "8 — SEO", "type": "Task", "status": "Ready", "priority": "P1 — High", "owner": "Joner / Claude", "hours": 4},
    {"name": "Post-Launch: GSC Ranking Monitor cron job", "section": "8 — SEO", "type": "Task", "status": "Ready", "priority": "P1 — High", "owner": "Joner / Claude", "hours": 4},
    {"name": "Post-Launch: Spanish Tier-1 rollout (UI chrome translation)", "section": "8 — SEO", "type": "Task", "status": "Ready", "priority": "P2 — Medium", "owner": "Content Writer", "hours": 12},
    {"name": "Post-Launch: Onboard first 3-5 attorney partners", "section": "6 — Team", "type": "Task", "status": "Ready", "priority": "P0 — Critical", "owner": "Michael", "hours": 10},
    {"name": "Post-Launch: A/B test intake CTAs and headlines", "section": "9 — Lead Gen", "type": "Task", "status": "Ready", "priority": "P1 — High", "owner": "Developer", "hours": 6},
]


def main():
    print("=" * 60)
    print("AccidentPath — Creating Master Pipeline Database")
    print(f"Total items: {len(ITEMS)}")
    print("=" * 60)

    db = create_db()
    if not db:
        sys.exit(1)

    db_id = db["id"]
    ok = 0
    for i, item in enumerate(ITEMS, 1):
        r = add(db_id, item)
        if r:
            ok += 1
            if i % 10 == 0:
                print(f"  [{i}/{len(ITEMS)}] ✅ {ok} created...")
        else:
            print(f"  [{i}/{len(ITEMS)}] ❌ {item['name'][:50]}")
        if i % 3 == 0:
            time.sleep(1.1)

    print(f"\n{'='*60}")
    print(f"Done! {ok}/{len(ITEMS)} items created.")
    print(f"URL: {db.get('url')}")
    print(f"ID:  {db_id}")

    with open(os.path.join(os.path.dirname(SCRIPT_DIR), ".notion-master-db-id"), "w") as f:
        f.write(db_id)


if __name__ == "__main__":
    main()
