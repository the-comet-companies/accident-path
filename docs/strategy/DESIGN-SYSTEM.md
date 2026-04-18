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

### Typography
- Beautiful, professional typography
- Strong hierarchy between headings, body, and UI text
- Readable at all sizes
- Suggested: Inter, Plus Jakarta Sans, or similar modern sans-serif
- Legal content may use a slightly more traditional serif for body text to convey authority

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

## Color Palette (Suggested Direction)

| Role | Description | Notes |
|------|-------------|-------|
| Primary | Deep navy or dark blue | Authority, trust, professionalism |
| Secondary | Warm accent (amber/gold) | Warmth, hope, human touch |
| Success | Green | Positive outcomes, safe actions |
| Warning | Amber | Urgency indicators |
| Danger | Red | Emergency/critical situations |
| Neutral | Gray scale | Backgrounds, borders, secondary text |
| Background | Off-white / warm white | Clean but not sterile |

### Color Rules
- Minimum 4.5:1 contrast for body text
- Minimum 3:1 for large text and UI elements
- Never convey information through color alone
- Support dark mode via `prefers-color-scheme`
- Use color consistently across the site

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
