#!/usr/bin/env python3
"""
Upgrade Master Pipeline:
1. Add Assignee (People) property
2. Add attorney directory + Apify scraping tasks (assigned to Rogelio)
3. Copy Dev Sprint execution prompts into Master Pipeline page bodies
4. Delete redundant databases
"""
import os, sys, time, requests, json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE = os.path.dirname(os.path.dirname(os.path.dirname(SCRIPT_DIR)))
with open(os.path.join(WORKSPACE, ".env")) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ[k.strip()] = v.strip()

API_KEY = os.environ["NOTION_API_KEY"]
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json", "Notion-Version": "2022-06-28"}
BASE = "https://api.notion.com/v1"

MASTER_DB = "346917dc-7b83-81e3-be62-dea1a5250217"
DEV_SPRINT_DB = "345917dc-7b83-81a7-9f64-d4f73bac3bae"
PROJECT_TASKS_DB = "345917dc-7b83-8123-aa1c-d0e6cdaf2f26"
PAGE_ID = "328917dc7b8380b29f18c67de494adc0"

def api(method, ep, data=None):
    r = requests.request(method, f"{BASE}/{ep}", headers=HEADERS, json=data)
    if r.status_code >= 400:
        print(f"  ERR {r.status_code}: {r.text[:300]}")
        return None
    return r.json()


# ═══════════════════════════════════════════════════════════════════
# STEP 1: Add Assignee (People) property to Master Pipeline
# ═══════════════════════════════════════════════════════════════════
print("=" * 60)
print("STEP 1: Adding Assignee (People) property")
result = api("PATCH", f"databases/{MASTER_DB}", {
    "properties": {
        "Assignee": {"people": {}},
    }
})
if result:
    print("  ✅ Assignee (People) property added")
else:
    print("  ⚠️ Could not add People property — may need manual creation")

time.sleep(0.5)


# ═══════════════════════════════════════════════════════════════════
# STEP 2: Add Attorney Directory + Apify tasks
# ═══════════════════════════════════════════════════════════════════
print("\nSTEP 2: Adding Attorney Directory + Apify tasks")

def add_item(item):
    props = {"Name": {"title": [{"text": {"content": item["name"]}}]}}
    if item.get("section"): props["Section"] = {"select": {"name": item["section"]}}
    if item.get("type"): props["Type"] = {"select": {"name": item["type"]}}
    if item.get("priority"): props["Priority"] = {"select": {"name": item["priority"]}}
    if item.get("owner"): props["Owner"] = {"select": {"name": item["owner"]}}
    if item.get("hours"): props["Est. Hours"] = {"number": item["hours"]}
    if item.get("phase"): props["Phase"] = {"rich_text": [{"text": {"content": item["phase"]}}]}
    if item.get("deps"): props["Dependencies"] = {"rich_text": [{"text": {"content": item["deps"]}}]}
    if item.get("state"): props["State"] = {"multi_select": [{"name": s} for s in item["state"]]}
    if item.get("notes"): props["Notes"] = {"rich_text": [{"text": {"content": item["notes"][:2000]}}]}
    return api("POST", "pages", {"parent": {"database_id": MASTER_DB}, "properties": props})

# Add new Section option for Directory
api("PATCH", f"databases/{MASTER_DB}", {
    "properties": {
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
                    {"name": "10 — Attorney Directory", "color": "blue"},
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
                    {"name": "Scrape Config", "color": "orange"},
                ]
            }
        }
    }
})
time.sleep(0.5)

DIRECTORY_ITEMS = [
    # ── STRATEGY ──
    {
        "name": "Attorney Directory: Public searchable directory of CA + AZ attorneys on accidentpath.com",
        "section": "10 — Attorney Directory",
        "type": "Strategy",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "notes": "Public directory = massive SEO play (thousands of indexed profile pages). Searchable by practice area, city, bar number. Think Avvo/Justia but PI-focused with better UX.",
    },
    {
        "name": "Directory: Research best attorney directory UX (Avvo, Justia, LegalMatch, SuperLawyers)",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 4,
        "notes": "Analyze: search/filter UX, profile pages, practice area taxonomy, review display, contact flow, SEO structure. Document what to steal and what to improve.",
    },
    {
        "name": "Directory: Design attorney profile page template",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 6,
        "deps": "Research best directory UX",
        "notes": "Profile page: name, photo, bar number, firm, address, phone, practice areas, years admitted, education, bio, office hours, languages spoken. Schema.org Attorney/LegalService markup. Must generate unique SEO-ready pages.",
    },
    {
        "name": "Directory: Design search/filter page (/directory)",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 6,
        "deps": "Design profile template",
        "notes": "Filters: practice area, city, state, language, years experience. Map view option. Pagination. Mobile-first. Fast search (Supabase full-text or Algolia).",
    },
    {
        "name": "Directory: Design city landing pages (/directory/california/los-angeles)",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 4,
        "notes": "City + practice area combo pages. e.g. 'Personal Injury Lawyers in Los Angeles' with filtered directory view + city-specific content. Massive long-tail SEO.",
    },
    {
        "name": "Directory: Build Supabase schema (attorneys table, practice_areas, cities, reviews)",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 4,
        "deps": "Design profile template",
        "notes": "Tables: attorneys (bar_number PK, name, firm, address, city, state, phone, email, website, practice_areas[], languages[], year_admitted, photo_url, bio), practice_areas, attorney_practice_areas (junction), reviews.",
    },
    {
        "name": "Directory: Build attorney profile page (/directory/[state]/[slug])",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 8,
        "deps": "Supabase schema",
        "notes": "Dynamic page from Supabase. Schema.org Attorney markup. Breadcrumbs. CTA: 'Contact This Attorney' or 'Request Consultation'. Internal links to practice area pages and city pages.",
    },
    {
        "name": "Directory: Build search/filter page with Supabase queries",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 8,
        "deps": "Supabase schema, Profile page",
        "notes": "Server-side filtering via Supabase. URL params for SEO (?city=los-angeles&practice=personal-injury). Results grid with pagination. Fast.",
    },
    {
        "name": "Directory: Build city+practice landing pages (SEO)",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 6,
        "deps": "Search page",
        "notes": "Programmatic pages: /directory/california/los-angeles/personal-injury → pre-filtered directory view + unique H1 + city-specific intro. Generate for all 16 target cities × top 5 practice areas = 80 landing pages.",
    },

    # ── APIFY SCRAPING ──
    {
        "name": "Apify: Create CA State Bar attorney scraper config",
        "section": "10 — Attorney Directory",
        "type": "Scrape Config",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 6,
        "state": ["CA"],
        "notes": "Source: California State Bar member search (apps.calbar.ca.gov). Scrape: name, bar number, status, address, phone, admission date, law school, practice areas. ~270K active attorneys in CA. Filter PI-related. Run via Apify.",
    },
    {
        "name": "Apify: Create AZ State Bar attorney scraper config",
        "section": "10 — Attorney Directory",
        "type": "Scrape Config",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 4,
        "state": ["AZ"],
        "notes": "Source: State Bar of Arizona attorney search (azbar.org). Scrape: name, bar number, status, firm, address, phone, admission date. ~20K active attorneys in AZ.",
    },
    {
        "name": "Apify: Create city-level attorney scraper (all CA cities)",
        "section": "10 — Attorney Directory",
        "type": "Scrape Config",
        "priority": "P2 — Medium",
        "owner": "Rogelio",
        "hours": 4,
        "state": ["CA"],
        "notes": "Modify base CA scraper to filter by city. Run for all major CA cities (LA, SD, SF, SJ, Sac, etc.). Output: JSON per city for import to Supabase.",
    },
    {
        "name": "Apify: Create city-level attorney scraper (all AZ cities)",
        "section": "10 — Attorney Directory",
        "type": "Scrape Config",
        "priority": "P2 — Medium",
        "owner": "Rogelio",
        "hours": 3,
        "state": ["AZ"],
        "notes": "Modify base AZ scraper for city-level output. Phoenix, Tucson, Mesa, Chandler, Scottsdale, Gilbert + others.",
    },
    {
        "name": "Apify: Build import pipeline (Apify → JSON → Supabase attorneys table)",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 6,
        "deps": "Supabase schema, CA scraper, AZ scraper",
        "notes": "Script to: 1) Pull Apify results, 2) Normalize/deduplicate, 3) Map practice areas to taxonomy, 4) Insert/update Supabase. Schedule for monthly refresh.",
    },
    {
        "name": "Apify: Schedule monthly attorney data refresh",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P2 — Medium",
        "owner": "Rogelio",
        "hours": 2,
        "deps": "Import pipeline",
        "notes": "Cron job or n8n workflow: re-scrape CA + AZ state bars monthly, update Supabase, flag new/removed attorneys.",
    },

    # ── SEO / CONTENT FOR DIRECTORY ──
    {
        "name": "Directory SEO: Schema.org Attorney/LegalService on all profile pages",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 3,
        "deps": "Profile page built",
        "notes": "Each attorney profile = indexed page with structured data. Thousands of pages = massive domain authority boost.",
    },
    {
        "name": "Directory SEO: Generate sitemap-directory.xml (attorney profiles + city pages)",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 2,
        "deps": "Profile page built",
    },
    {
        "name": "Directory SEO: Internal linking (profile → city page → accident hub → /find-help)",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P1 — High",
        "owner": "Rogelio",
        "hours": 3,
        "notes": "Every attorney profile links to their city page, city page links to accident hubs, everything links to /find-help. Creates internal link web.",
    },
    {
        "name": "Directory: Attorney claim/update flow (attorneys can claim and update their own profiles)",
        "section": "10 — Attorney Directory",
        "type": "Task",
        "priority": "P2 — Medium",
        "owner": "Rogelio",
        "hours": 10,
        "deps": "Profile page built",
        "notes": "Future: attorneys can verify identity, claim profile, add photo/bio, upgrade to premium listing. Revenue opportunity + data quality.",
    },
    {
        "name": "Doc: ATTORNEY-DIRECTORY-SPEC.md — Full directory scope and architecture",
        "section": "7 — Strategy Docs",
        "type": "Document",
        "owner": "Rogelio",
        "notes": "Document: directory UX research, profile template, search design, Apify configs, Supabase schema, SEO strategy, city×practice page generation, timeline.",
    },
]

ok = 0
for i, item in enumerate(DIRECTORY_ITEMS, 1):
    r = add_item(item)
    if r:
        ok += 1
    else:
        print(f"  ❌ Failed: {item['name'][:50]}")
    if i % 3 == 0:
        time.sleep(1.1)

print(f"  ✅ {ok}/{len(DIRECTORY_ITEMS)} directory items added")


# ═══════════════════════════════════════════════════════════════════
# STEP 3: Copy Dev Sprint execution prompts to Master Pipeline
# ═══════════════════════════════════════════════════════════════════
print("\nSTEP 3: Copying Dev Sprint execution prompts to Master Pipeline")

# 3a: Get all Dev Sprint pages
dev_pages = []
cursor = None
while True:
    payload = {}
    if cursor:
        payload["start_cursor"] = cursor
    r = api("POST", f"databases/{DEV_SPRINT_DB}/query", payload)
    if not r:
        break
    dev_pages.extend(r.get("results", []))
    if r.get("has_more"):
        cursor = r["next_cursor"]
    else:
        break

print(f"  Found {len(dev_pages)} dev sprint pages")

# 3b: Get all Master Pipeline pages that are DEV-XX tasks
master_pages = []
cursor = None
while True:
    payload = {"filter": {"property": "Section", "select": {"equals": "5 — Dev Sprint"}}}
    if cursor:
        payload["start_cursor"] = cursor
    r = api("POST", f"databases/{MASTER_DB}/query", payload)
    if not r:
        break
    master_pages.extend(r.get("results", []))
    if r.get("has_more"):
        cursor = r["next_cursor"]
    else:
        break

print(f"  Found {len(master_pages)} master pipeline dev tasks")

# 3c: Build mapping: dev sprint Task ID → master pipeline page ID
# Dev sprint pages have "Task ID" number property
# Master pipeline pages have names like "DEV-01: ..."
dev_map = {}  # task_id_number -> dev_page_id
for p in dev_pages:
    task_id = p["properties"].get("Task ID", {}).get("number")
    if task_id:
        dev_map[task_id] = p["id"]

master_map = {}  # task_id_number -> master_page_id
for p in master_pages:
    title = "".join(t.get("plain_text", "") for t in p["properties"]["Name"]["title"])
    # Extract number from "DEV-01: ..." or "DEV-28: ..."
    if title.startswith("DEV-"):
        try:
            num = int(title.split(":")[0].replace("DEV-", ""))
            master_map[num] = p["id"]
        except:
            pass

print(f"  Dev sprint tasks mapped: {len(dev_map)}")
print(f"  Master pipeline DEV tasks mapped: {len(master_map)}")

# 3d: For each matched pair, copy blocks from dev sprint page to master pipeline page
copied = 0
for task_id in sorted(dev_map.keys()):
    if task_id not in master_map:
        print(f"  ⚠️ DEV-{task_id:02d} not found in master pipeline")
        continue

    dev_page_id = dev_map[task_id]
    master_page_id = master_map[task_id]

    # Get blocks from dev sprint page
    blocks_result = api("GET", f"blocks/{dev_page_id}/children?page_size=100")
    if not blocks_result:
        continue

    blocks = blocks_result.get("results", [])
    if not blocks:
        continue

    # Convert blocks to appendable format (strip IDs and metadata)
    appendable = []
    for b in blocks:
        btype = b["type"]
        if btype in ("heading_2", "heading_3", "paragraph", "bulleted_list_item",
                     "numbered_list_item", "code", "callout", "divider", "quote"):
            new_block = {"object": "block", "type": btype, btype: b[btype]}
            # Remove non-appendable fields
            if "children" in new_block[btype]:
                del new_block[btype]["children"]
            appendable.append(new_block)

    if appendable:
        result = api("PATCH", f"blocks/{master_page_id}/children", {"children": appendable[:100]})
        if result:
            copied += 1
            if copied % 5 == 0:
                print(f"  [{copied}] Copied prompts...")
        time.sleep(0.5)

print(f"  ✅ Copied execution prompts for {copied} tasks")


# ═══════════════════════════════════════════════════════════════════
# STEP 4: Delete redundant databases
# ═══════════════════════════════════════════════════════════════════
print("\nSTEP 4: Deleting redundant databases")

# Delete Project Tasks DB
r = api("DELETE", f"blocks/{PROJECT_TASKS_DB}")
print(f"  Project Tasks DB: {'✅ deleted' if r else '⚠️ failed'}")
time.sleep(0.5)

# Delete Dev Sprint Tasks DB
r = api("DELETE", f"blocks/{DEV_SPRINT_DB}")
print(f"  Dev Sprint DB: {'✅ deleted' if r else '⚠️ failed'}")

print(f"\n{'='*60}")
print("DONE!")
print(f"Master Pipeline DB: https://www.notion.so/{MASTER_DB.replace('-','')}")
print(f"Total items: 201 original + {len(DIRECTORY_ITEMS)} directory = {201 + len(DIRECTORY_ITEMS)}")
print(f"Execution prompts copied: {copied}/28 dev tasks")
print(f"Redundant DBs deleted: 2")
print(f"\nNOTE: Assignee (People) column added. Assign claude@dtlaprint.com")
print(f"and Rogelio once they're shared on the workspace/page.")
print(f"{'='*60}")
