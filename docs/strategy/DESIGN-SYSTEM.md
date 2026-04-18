# Design System

## Brand Identity

### Brand Feel
- Premium legal-tech
- Calm, sharp, trustworthy, high-clarity
- Blend of top-tier fintech + healthcare UX + elite law-firm credibility
- Mobile-first, conversion-optimized, extremely clean
- Fast, semantic, SEO-first

### What This Is NOT
- Cheesy legal marketing with gavels and scales of justice
- Aggressive "CALL NOW" injury lawyer ads
- Generic template sites
- Thin lead-gen landing pages

### What This IS
- High-end SaaS feel applied to legal
- Think: Stripe meets One Medical meets top-tier law firm
- Serious but modern
- Trust-forward
- Human-centered

---

## Design Direction

### Typography (FINALIZED)

**Heading + UI Font: Inter** — Geometric sans-serif designed for screen readability. Open apertures, tall x-height, variable font support, excellent Spanish diacritical support.
- H1: Inter 700 (Bold)
- H2-H3: Inter 600 (SemiBold)
- H4-H6, nav, buttons: Inter 500 (Medium)
- UI labels, captions: Inter 400 (Regular)

**Body Font: Merriweather** — Screen-optimized serif. Serifs guide the eye in long-form text and carry implicit legal/authority associations. Sturdy serifs render well at small sizes.
- Body text: Merriweather 400 (Regular)
- Emphasis, quotes: Merriweather 400 Italic
- Inline bold: Merriweather 700 (Bold)

**Rule:** Inter for interface (buttons, nav, cards, CTAs). Merriweather for content (articles, guides, legal text, attorney bios). Never mix — do not use Merriweather for buttons or Inter for article paragraphs.

**Font loading:** Both available on Google Fonts. Use `font-display: swap` to prevent invisible text during load (LCP optimization)

### Spacing & Layout
- Generous whitespace
- Strong visual hierarchy
- Clear content sections with breathing room
- Card-based layouts for browseable content
- Full-width sections alternating with contained content

### Visual Treatment
- Soft shadows for depth
- Subtle gradients (not flat, not glossy)
- Restrained color palette
- High-contrast text for readability
- Clean borders and dividers

### Motion & Animation
- Tasteful, purposeful motion
- Subtle entrance animations
- Smooth transitions between states
- Respect `prefers-reduced-motion`
- Performance must not suffer for animation

---

## Color Palette (FINALIZED — Research-Backed)

> Based on color psychology research by Labrecque & Milne (2012), Singh (2006), Elliot & Maier (2014), and Madden et al. (2000). Full research with citations in `docs/strategy/COLOR-PSYCHOLOGY-RESEARCH.md`.

### Primary: Deep Teal-Blue (Trust + Authority + Care)

Sits between blue (trust) and teal (care/healing). Warmer than corporate blue, more authoritative than green-teal. HSL(200, 65%, 47%) places it in the trust-competence zone identified by Labrecque & Milne.

| Shade | Hex | Use |
|-------|-----|-----|
| 50 | `#EAF6FB` | Subtle info backgrounds, feature section tints |
| 100 | `#D4ECF7` | Light background fills |
| 200 | `#A8D9EF` | Hover states, light accents |
| 300 | `#78C1E2` | Decorative, illustrations |
| 400 | `#4BA8D4` | Dark mode primary |
| **500** | **`#2891C7`** | **Primary buttons, links, key UI elements** |
| 600 | `#2179A8` | Body text links (meets 4.5:1 on white) |
| 700 | `#1A5F85` | Strong emphasis |
| 800 | `#134561` | Dark headings |
| 900 | `#0C2D3E` | Hero overlays, footer backgrounds |

### Secondary: Warm Amber (Warmth + Care + Comfort)

Avoids "ambulance chaser" red/orange connotation. Culturally positive across Western and Latin American audiences (warmth, sun, welcome). Complementary harmony with blue.

| Shade | Hex | Use |
|-------|-----|-----|
| 50 | `#FDF7EE` | Warm background tint (testimonials, empathy blocks) |
| **500** | **`#E08A2E`** | **Secondary CTAs, warmth accents, highlights** |
| 600 | `#C97420` | Warm CTA buttons ("Get Help Now") |
| 700 | `#AB5F1C` | Dark warm accents |

### Success: Healing Green

| Shade | Hex | Use |
|-------|-----|-----|
| 50 | `#ECFAF2` | Success backgrounds |
| **500** | **`#2AB07E`** | **"Matched with attorney", positive outcomes** |
| 700 | `#1A7A4C` | Dark success text |

### Warning: Measured Gold

| Shade | Hex | Use |
|-------|-----|-----|
| 50 | `#FDF8EB` | Warning backgrounds |
| **500** | **`#CC9629`** | **Deadline warnings, statute of limitations alerts** |

### Danger: Restrained Red (Errors Only)

Used sparingly — users are already in distress. Never used for marketing.

| Shade | Hex | Use |
|-------|-----|-----|
| 50 | `#FDECEC` | Error backgrounds |
| **500** | **`#E04545`** | **Form errors, urgent deadlines, critical alerts only** |

### Neutral: Cool Slate (Blue Undertone)

Blue undertone keeps it cohesive with primary. Near-black (#0F1720) for text instead of pure black — gentler on stressed users.

| Shade | Hex | Use |
|-------|-----|-----|
| 50 | `#F3F6F9` | Page background |
| 100 | `#E8EEF4` | Borders, dividers |
| 200 | `#D2DCEA` | Subtle separators |
| 300 | `#B5C3D2` | Dark mode secondary text |
| 500 | `#728AA0` | Secondary text, placeholders |
| 700 | `#435166` | Label text |
| 900 | `#1A2332` | Dark mode card backgrounds |
| **950** | **`#0F1720`** | **Primary text (headlines, body)** |

### Backgrounds

| Surface | Hex | Use |
|---------|-----|-----|
| Page | `#F3F6F9` | Main background (not sterile white) |
| Card | `#FFFFFF` | Card/surface backgrounds |
| Warm tint | `#FDF7EE` | Testimonials, "you're in good hands" |
| Info tint | `#EAF6FB` | Feature sections, info cards |

### WCAG 2.2 AA Contrast Verification

All combinations verified against WCAG 2.2 relative luminance formula:

| Combination | Ratio | Passes |
|------------|------:|--------|
| neutral-950 on white | 16.8:1 | Body text (4.5:1 req) |
| neutral-950 on neutral-50 | 15.2:1 | Body text on page BG |
| primary-600 on white | 4.6:1 | Small text links |
| primary-500 on white | 3.4:1 | Large text / buttons only |
| white on primary-900 | 13.2:1 | White text on dark hero |
| amber-600 on white | 3.5:1 | Large text CTA |

**Note:** Primary-500 (#2891C7) passes 3:1 for large text/buttons but not 4.5:1 for small text. Use primary-600 (#2179A8) for body text links.

### Cultural Note (Hispanic/Latino Audience — 39% of CA)

Per Madden et al. (2000): Blue is perceived positively across all Latin American cultures (quality, trustworthiness). Warm amber/gold tones are culturally resonant in Mexican and Central American design traditions. The amber secondary should be used more liberally on Spanish-language pages.

### Color Rules

- Minimum 4.5:1 contrast for body text
- Minimum 3:1 for large text and UI elements
- Never convey information through color alone
- Support dark mode via `prefers-color-scheme` (see dark mode mapping above)
- Use color consistently across the site
- **Never use danger red for marketing elements or CTAs**
- **Never use pure black (#000000) for text — use neutral-950 (#0F1720)**

---

## Component Design Patterns

### Trust Modules
```
[Shield Icon] "Attorney-Reviewed Content"
[Badge] "Reviewed by [Name], Esq. — March 2026"
[Lock Icon] "Your information is secure and private"
[Clock Icon] "Free consultation — no obligation"
```

### CTA Buttons
- **Primary:** Bold, high-contrast, clear action text
  - "Start Your Free Accident Check"
  - "Get Your Next Steps"
  - "Find Help Now"
- **Secondary:** Outlined or subtle background
  - "Explore Accident Guides"
  - "Learn More"
  - "View All Tools"

### Emergency Banner
- Visible but not alarming
- Fixed or prominent position
- "In immediate danger? Call 911. For medical emergencies, seek care now."

### Disclaimer Blocks
- Subtle but readable
- Gray background or bordered section
- Smaller font size, but still accessible (14px minimum)
- Always present, never hidden behind toggles

### Cards
- Accident type cards: icon + title + brief description + arrow
- Tool cards: icon + title + description + "Try It" CTA
- Guide cards: title + excerpt + read time + review badge

### Intake Wizard
- Full-screen or modal multi-step flow
- Progress bar at top
- One question group per step
- Large, tappable options (44x44px minimum)
- Clean transitions between steps
- "Back" always available
- Save progress indicator

---

## Responsive Design

### Breakpoints
```
sm:  640px   → Mobile landscape
md:  768px   → Tablet
lg:  1024px  → Laptop
xl:  1280px  → Desktop
2xl: 1536px  → Large desktop
```

### Mobile-First Rules
1. Design for mobile FIRST, then scale up
2. Touch targets: minimum 44x44px
3. Single column layouts on mobile
4. Collapsible navigation
5. Bottom-fixed CTAs on key pages
6. Thumb-zone aware interaction placement

---

## Accessibility Requirements

### WCAG 2.2 Level AA

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | 4.5:1 normal text, 3:1 large text |
| Keyboard nav | All interactive elements reachable via Tab |
| Focus indicators | Visible, 3:1 contrast minimum |
| Screen readers | Semantic HTML + ARIA where needed |
| Reduced motion | Respect `prefers-reduced-motion` |
| Alt text | All images have descriptive alt text |
| Form labels | Every input has an associated label |
| Error messages | Clear, specific, associated with fields |
| Skip navigation | "Skip to main content" link |
| Landmarks | `<nav>`, `<main>`, `<aside>`, `<footer>` |

---

## Iconography

### Style
- Line icons, consistent weight
- Simple, recognizable shapes
- Match the overall premium feel
- Suggest: Lucide Icons or Heroicons

### Required Icons
- Accident types (car, truck, motorcycle, pedestrian, etc.)
- Injuries (brain, spine, bones, etc.)
- Tools (calculator, checklist, journal, etc.)
- Trust signals (shield, lock, badge, checkmark)
- Navigation (arrow, menu, search, close)
- Status (warning, success, info, error)
