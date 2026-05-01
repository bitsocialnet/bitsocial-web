---
name: Bitsocial Web
description: Public Bitsocial brand site, docs gateway, and ecosystem directory.
colors:
  stage-void: "#0c0c10"
  stage-panel: "#121218"
  protocol-blue: "#1a4fd0"
  electric-blue: "#2563eb"
  graphite: "#2f3336"
  silver: "#9ca3af"
  silver-bright: "#e5e7eb"
  light-surface: "#f8fafc"
  light-panel: "#fafafc"
  ink: "#1a1a1a"
  soft-border: "#e5e5e5"
  amber-status: "#f59e0b"
typography:
  display:
    fontFamily: "Exo, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Exo, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Exo, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  pill: "999px"
  sm: "0.75rem"
  md: "1rem"
  card: "1.5rem"
  sheet: "2rem"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section-y: "6rem"
components:
  button-prominent:
    backgroundColor: "{colors.protocol-blue}"
    textColor: "{colors.silver-bright}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 2rem"
  button-glass:
    backgroundColor: "{colors.stage-panel}"
    textColor: "{colors.silver-bright}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 2rem"
  card-glass:
    backgroundColor: "{colors.stage-panel}"
    textColor: "{colors.silver-bright}"
    rounded: "{rounded.card}"
    padding: "1.75rem"
  input-search:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 2.75rem"
---

# Design System: Bitsocial Web

## 1. Overview

**Creative North Star: "Protocol Observatory"**

Bitsocial Web should feel like a polished public control room for a protocol that is already being built: dark-first, technical, spacious, and precise. The interface uses cinematic protocol visuals on the home route, then settles into practical cards, filters, docs links, and app metadata where users need to make decisions.

The system is brand-led, but it includes product-like surfaces such as the app directory. Those surfaces should stay denser and more functional than the home hero while still sharing the same blue, silver, glass, and Exo-driven identity.

**Key Characteristics:**

- Dark technical atmosphere with a light theme that remains calm and legible.
- Blue glow used as a rare signal for active, primary, or Bitsocial-specific states.
- Rounded glass surfaces, restrained borders, and soft ambient shadows.
- Large Exo display type for thesis moments, Manrope for readable supporting copy.
- No-JS, reduced-motion, and simplified-graphics paths are first-class design states.

## 2. Colors

The palette is a restrained protocol palette: near-black and graphite foundations, silver text, and a focused electric blue accent.

### Primary

- **Protocol Blue** (`#1a4fd0`): Primary Bitsocial accent for highlighted calls to action, active filters, selected rows, and emphasized borders.
- **Electric Blue** (`#2563eb`): Glow, hover, focus, link, timeline, and interactive emphasis color. Use sparingly so it keeps signal value.

### Secondary

- **Amber Status** (`#f59e0b`): Experimental app status and caution-style ecosystem metadata. Keep it local to status, not brand identity.

### Neutral

- **Stage Void** (`#0c0c10`): Deep background and visual baseline for dark sections.
- **Stage Panel** (`#121218`): Raised dark surface and card foundation.
- **Graphite** (`#2f3336`): Dark neutral support for rings, separators, and subdued UI.
- **Silver** (`#9ca3af`): Secondary text, captions, app metadata, and de-emphasized labels.
- **Silver Bright** (`#e5e7eb`): High-contrast foreground and bright UI details.
- **Light Surface** (`#f8fafc`): Simplified light cards and Firefox or reduced graphics fallbacks.
- **Soft Border** (`#e5e5e5`): Light-mode dividers and low-emphasis strokes.

### Named Rules

**The Blue Signal Rule.** Blue indicates interaction, selection, Bitsocial ownership, or protocol emphasis. Do not use it as broad decoration.

**The Neutral Stage Rule.** Most surfaces should stay neutral so the protocol visuals, app logos, and blue states can carry meaning.

## 3. Typography

**Display Font:** Exo, locally hosted for headings and brand labels.
**Body Font:** Manrope from Google Fonts, with sans-serif fallback.
**Label Font:** Exo, usually uppercase with wide tracking.

**Character:** Exo gives the brand a technical, orbital shape without becoming monospace. Manrope keeps long explanations, app copy, forms, and docs-adjacent content readable.

### Hierarchy

- **Display** (600, `text-4xl` to `lg:text-7xl`, `1.1` line-height): Home and app-directory hero headlines, section theses, major route titles.
- **Headline** (400 to 600, `text-2xl` to `text-3xl`, tight line-height): Card titles, mailing-list title, app detail headings, category names.
- **Title** (500 to 600, `text-lg` to `text-2xl`): App cards, feature cards, timeline phases, sheet titles.
- **Body** (400, `text-sm` to `text-lg`, relaxed line-height): Explanatory copy, descriptions, app metadata, and form help text. Cap long prose near 65 to 75 characters.
- **Label** (500 to 600, `text-xs`, uppercase, `0.18em` to `0.2em` tracking): Section labels, directory labels, mirror headers, and compact metadata.

### Named Rules

**The Thesis Scale Rule.** Reserve the largest display sizes for route-level claims. Inside cards and controls, keep type compact and scannable.

## 4. Elevation

Depth is mostly tonal and atmospheric. The default surface is a bordered glass card with subtle gradient fill and backdrop blur. Shadows appear on active app statuses, hover states, focused controls, sheets, and selected filters.

### Shadow Vocabulary

- **Focus Ring** (`0 0 0 2px rgb(37 99 235 / 0.92), 0 0 0 5px rgba(37, 99, 235, 0.16)`): Keyboard focus for buttons, links, and custom controls.
- **CTA Glow** (`0 0 20px rgba(37, 99, 235, 0.35)`): Hover treatment for primary and inline calls to action.
- **Selected Filter Glow** (`0 0 24px rgba(37, 99, 235, 0.12)`): Active app filters and category buttons.
- **Ready App Halo** (`0 0 20px rgba(37, 99, 235, 0.14)`): Ready app cards.
- **Experimental App Halo** (`0 0 20px rgba(245, 158, 11, 0.14)`): Experimental app cards.
- **Sheet Lift** (`-8px 0 40px rgba(0, 0, 0, 0.06)` light, `-8px 0 40px rgba(0, 0, 0, 0.4)` dark): Slide-over panels.

### Named Rules

**The State-Only Glow Rule.** Glow should come from state, hierarchy, or protocol emphasis. Static pages should not accumulate ambient glow everywhere.

## 5. Components

### Buttons

- **Shape:** Pill by default (`999px`) with stable padding and icon gaps.
- **Primary:** Blue-tinted border and background (`#1a4fd0` at low alpha), foreground near full contrast, Exo semibold.
- **Hover / Focus:** Border shifts to Electric Blue, text brightens, and CTA glow may appear. Keyboard focus uses the shared blue ring.
- **Secondary / Ghost:** Transparent or glass backgrounds with neutral text. Hover should clarify affordance without looking like a new primary action.

### Chips

- **Style:** Small pill, 1px border, neutral text when inactive.
- **Active State:** Protocol Blue border, foreground text, optional ring-glow. Counts stay in nested tiny pills with subdued borders.

### Cards / Containers

- **Corner Style:** `1.5rem` rounded glass cards for content groups; `2rem` for large footer/sheet edges.
- **Background:** Layered gradient glass in default mode, simplified solid surfaces when graphics capability or browser support needs it.
- **Shadow Strategy:** Cards are mostly flat at rest. Selected, ready, experimental, or hover states add low-alpha halo.
- **Border:** 1px subtle neutral border, turning blue only for active or highlighted Bitsocial states.
- **Internal Padding:** `1.25rem` to `2rem`, with route-level cards using larger desktop padding.

### Inputs / Fields

- **Style:** Rounded full-width fields, neutral border, translucent background, icon at the leading edge.
- **Focus:** Border shifts to Protocol Blue and receives the shared focus glow.
- **Error / Disabled:** Disabled actions reduce opacity and suppress hover glow. Error copy should stay direct and short.

### Navigation

- **Topbar:** Frosted, adaptive, and compact. Links use Exo, muted foreground, and a blue underline or color shift on hover.
- **Mobile Menu:** Uses the same glass/sheet language, with no-JS details fallback where needed.
- **Footer:** Rounded frosted top surface, compact grouped links, and subdued brand mark.

## 6. Do's and Don'ts

**Do:**

- Use existing Tailwind tokens and CSS utilities before inventing a new surface style.
- Keep blue rare and meaningful.
- Keep app-directory surfaces denser than the home route.
- Preserve reduced-motion, no-JS, RTL, long-label, and simplified-graphics behavior.
- Let app logos, protocol diagrams, and timeline states provide visual variety.

**Don't:**

- Add generic Web3 neon gradients, token dashboards, or speculative finance visuals.
- Convert every section into identical icon cards.
- Use decorative glass effects where a simple solid surface would be clearer.
- Use broad glow as background decoration.
- Hide technical details behind vague marketing copy.
