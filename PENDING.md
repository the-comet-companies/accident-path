# AccidentPath — Pending Work

> Last updated: 2026-05-01
> Source of truth: Notion "Accident Path Website Pages" DB (`352917dc-7b83-8190-a9be-cecaf2b6df5d`)

---

## How to mark tasks done

**After completing any task below, ask the user before updating Notion:**

> "I've finished [task]. Would you like me to mark it as Live in the Notion tracker, or would you like to review the work first?"

The user reviews all completed work before it's marked Live. Do not update Notion status automatically.

---

## English — Coming Soon (20 cities)

These cities are tracked in Notion but have no content files built yet. Each needs:
- `content/cities/{slug}.json` — city data file (see existing cities for schema)
- `content/cities/es/{slug}.json` — Spanish version

| City | Notion Route |
|------|-------------|
| Riverside, CA | `/states/california/riverside` |
| Irvine, CA | `/states/california/irvine` |
| Santa Ana, CA | `/states/california/santa-ana` |
| Santa Clarita, CA | `/states/california/santa-clarita` |
| Chula Vista, CA | `/states/california/chula-vista` |
| Fremont, CA | `/states/california/fremont` |
| Stockton, CA | `/states/california/stockton` |
| San Bernardino, CA | `/states/california/san-bernardino` |
| Modesto, CA | `/states/california/modesto` |
| Glendale, CA | `/states/california/glendale` |
| Fontana, CA | `/states/california/fontana` |
| Torrance, CA | `/states/california/torrance` |
| Pomona, CA | `/states/california/pomona` |
| Huntington Beach, CA | `/states/california/huntington-beach` |
| Ontario, CA | `/states/california/ontario` |
| Lancaster, CA | `/states/california/lancaster` |
| Palmdale, CA | `/states/california/palmdale` |
| Pasadena, CA | `/states/california/pasadena` |
| Rancho Cucamonga, CA | `/states/california/rancho-cucamonga` |
| Glendale, AZ | `/states/arizona/glendale` |

When done: update English `Status` → `Live` AND `Spanish Status` → `Live` AND populate `Spanish Route` in Notion.

---

## Spanish — Not Started (4 pages)

These English pages exist but have no Spanish version yet.

| Page | English Route | Notes |
|------|--------------|-------|
| Spinal Accident Guide | `/accidents/spinal` | Needs `content/accidents/es/` JSON + `/es/accidentes/[slug]` page |
| Traumatic Brain Accident Guide | `/accidents/traumatic-brain` | Needs `content/accidents/es/` JSON + `/es/accidentes/[slug]` page |
| About AccidentPath | `/about` | Needs `app/(es)/es/sobre-nosotros/page.tsx` (or similar slug) |
| Contact AccidentPath | `/contact` | Needs `app/(es)/es/contacto/page.tsx` (or similar slug) |

When done: update `Spanish Status` → `Live` and set `Spanish Route` in Notion.

---

## Not planned for Spanish (intentional)

These pages show as "Spanish Not Started" in Notion but have no Spanish translation planned. Do not treat as pending work.

- `/about/how-it-works`
- `/privacy`, `/terms`, `/disclaimers`, `/for-attorneys`, `/cookie-policy`
