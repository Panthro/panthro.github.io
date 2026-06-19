---
name: Rafael Roman
description: Executive personal brand site — precise, principled, rare.
colors:
  void-black: "#09090b"
  void-charcoal: "#18181b"
  iron: "#27272a"
  slate: "#71717a"
  ash: "#a1a1aa"
  platinum: "#e4e4e7"
  paper: "#f4f4f5"
  ink: "#ffffff"
  signal-green: "#a3e635"
  signal-green-deep: "#65a30d"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body-large:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
spacing:
  xs: "8px"
  sm: "16px"
  md: "20px"
  lg: "24px"
  section: "80px"
  section-loose: "112px"
  hero: "128px"
components:
  inline-link:
    textColor: "{colors.ash}"
    typography: "{typography.body}"
  inline-link-hover:
    textColor: "{colors.signal-green}"
  nav-item:
    textColor: "{colors.slate}"
    typography: "{typography.label}"
  nav-item-active:
    textColor: "{colors.signal-green-deep}"
  nav-brand:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  nav-brand-hover:
    textColor: "{colors.signal-green-deep}"
  signal-mark:
    backgroundColor: "{colors.signal-green-deep}"
    height: "4px"
    width: "48px"
  section-title:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  back-nav:
    textColor: "{colors.slate}"
    typography: "{typography.label}"
  theme-toggle:
    size: "44px"
---

# Design System: Rafael Roman

## 1. Overview

**Creative North Star: "The Basel Monolith"**

This system is built from the authority of restraint. The surface is near-black — not "dark mode by default" but permanent and intentional, like ink pressed into stone. Swiss precision governs every column, margin, and typographic interval: each earns its place by function, not formula. The single accent color appears as a signal, not a decoration — it fires once per context and recedes.

The register is executive with technical depth. The personality is Precise. Principled. Rare. — which means the design is permitted to be quiet to the point of austerity, because the substance carries the weight. This is not a portfolio that impresses through visual complexity. It impresses by knowing exactly when to step back. The typefaces, the spacing, and the prose are the brand. Effects are not.

What this system explicitly rejects: developer portfolio clichés (skills bars, project grids, scrolling card decks); VC-bro personal branding (hype, buzzword soup, manufactured LinkedIn warmth); agency flash (case-study heaviness, decorative glassmorphism, visual performance for its own sake). The monolith doesn't perform — it stands.

**Key Characteristics:**
- Dark-primary surface (`zinc-950`) with semantic text tiers via utility classes (`.text-heading`, `.text-prose`, `.text-meta`, `.text-accent`)
- One accent color at ≤10% visual area per viewport; the 48×4px signal mark anchors page heroes
- Three typefaces with strict role separation: Bricolage Grotesque for display headings and section titles, Inter for body prose, JetBrains Mono for metadata and technical fragments
- No box shadows — depth through tonal zinc layering and a single header blur
- Hero-only entrance animation (`.animate-hero`); all other content visible by default
- WCAG AA baseline: semantic tokens, 44px touch targets, lime focus rings, safe-area insets

## 2. Colors: The Monolith Palette

A near-monochromatic dark spectrum anchored at void-black, articulated through zinc tones, with a single lime signal that fires precisely when needed. Light mode (`html:not(.dark)`) mirrors the same hierarchy with inverted contrast pairs.

### Primary
- **Signal Green** (`#a3e635` dark / `#65a30d` light): The accent. Active navigation routes, hover text on links, ToC active state, timeline highlights, role labels. Never used as a large background fill. The muted lime underline decoration (40% opacity) is the one tolerated secondary presence — it reads as infrastructure, not accent.

### Neutral
- **Void Black** (`#09090b` / Tailwind `zinc-950`): The primary background in dark mode. Every surface at rest.
- **Void Charcoal** (`#18181b`): Deepest foreground on light surfaces (`text-zinc-900`).
- **Iron** (`#27272a` / `zinc-800`): Borders and dividers on dark surfaces. The structural line color.
- **Slate** (`#71717a` / `zinc-500`): Navigation items at rest. Secondary metadata in mono contexts.
- **Ash** (`#a1a1aa` / `zinc-400`): Primary prose text on dark backgrounds. Protect the 4.5:1 floor.
- **Platinum** (`#e4e4e7` / `zinc-200`): Borders and dividers on light surfaces.
- **Paper** (`#f4f4f5` / `zinc-100`): Light mode surface.
- **Ink** (`#ffffff`): Display and headline text on dark.

### Semantic utilities
Implemented in `src/styles/global.css` as theme-aware classes — use these instead of raw zinc/lime utilities in components:

| Class | Dark | Light | Role |
|---|---|---|---|
| `.text-heading` | white | zinc-900 | Titles, names, entry headlines |
| `.text-prose` | zinc-400 | zinc-600 | Body and secondary copy |
| `.text-meta` | zinc-400 | zinc-600 | Dates, captions, footer |
| `.text-accent` | lime-400 | lime-600 | Role labels, speaker callouts |
| `.border-subtle` | zinc-800 | zinc-200 | Section dividers |
| `.bg-surface-muted` | zinc-800 | zinc-200 | Author avatar block |

### Named Rules
**The Monolith Rule.** Void Black (`#09090b`) is the base and it is permanent. Never substitute zinc-900 as the page background, never warm it with a chroma tint.

**The One Signal Rule.** Signal Green appears at ≤10% of any given viewport's visual area. Its rarity is its authority. A screen with three green elements has none — the signal has become noise.

**The Pair Rule.** Every semantic text token has an explicit light/dark pair. Never ship a zinc shade that only works in one theme.

## 3. Typography

**Display Font:** Bricolage Grotesque Variable (Inter, system-ui fallback)
**Body Font:** Inter (system-ui, sans-serif fallback)
**Label / Mono Font:** JetBrains Mono (monospace fallback)

**Character:** Bricolage Grotesque carries the display register — condensed proportions and distinctive character at large sizes. Inter is the workhorse for body prose: geometric precision with enough humanist warmth to read as a person rather than a stylesheet. JetBrains Mono is the precision instrument: dates, navigation, metadata, code references. Its presence marks the technical register.

### Hierarchy
- **Display** (Bricolage 800, `clamp(2.25rem, 5vw, 3.75rem)` homepage / up to `3.25rem` on articles, line-height 1.05–1.08): Hero name, page titles, article h1. Apply `text-wrap: balance`. `.text-heading` color.
- **Headline / Section title** (Bricolage 800, `1.5rem` / `text-2xl`, via `.section-title`): Section heads ("Work", "Writing", "Connect"). Not Inter — Bricolage at section scale is the hierarchy signal introduced in the bolder pass.
- **Body Large** (Inter 400, `clamp(1.25rem, 2vw, 1.5rem)`): Lead paragraphs on homepage and article descriptions. `.text-prose`.
- **Body** (Inter 400, `1rem`, line-height 1.625): Article prose via `@tailwindcss/typography`. Max line length 65–75ch via `max-w-2xl` (672px).
- **Label** (JetBrains Mono 400, `0.75rem–0.875rem`): Dates, nav items, ToC links, metadata. Lowercase for nav; uppercase tracking permitted only for structural labels inside articles (ToC header "Contents", callout type labels) — never on section headings.

### Named Rules
**The Three Voice Rule.** Bricolage Grotesque leads at display and section sizes; Inter carries body; JetBrains Mono marks data. Each face has a strictly scoped role.

**The Weight Ceiling Rule.** 800 is the maximum weight, reserved for Bricolage Grotesque at display and section sizes. Inter caps at 700. `font-black` (900) is prohibited.

## 4. Elevation

This system is flat by design. No `box-shadow` declarations appear anywhere in the interface. Depth is conveyed entirely through tonal progression within the zinc ramp: Iron borders separate surfaces, prose text floats above Void Black, and Ink headings lift highest in the visual stack.

The one approved elevation effect is the header's `backdrop-filter: blur(12px) saturate(150%)` with `zinc-950/80` (dark) or `zinc-100/80` (light) translucency. This creates a floating plane as the user scrolls. It is architectural — tied to scroll context — not decorative.

**The Flat-By-Default Rule.** Surfaces do not lift. When separation is needed, use a 1px Iron border — not a shadow. The header blur is the system's single elevation exception.

## 5. Components

### Signal Mark (`.signal-mark`)
A 48×4px horizontal bar in Signal Green (`lime-600` light / `lime-400` dark). Appears above the display heading on every page hero — homepage, index pages, and article headers. This is the permitted pure-visual accent punctuation; one mark per page, not repeated within the page body.

### Navigation
Fixed to the top with safe-area padding, blurred, separated by a 1px border (`border-subtle`).

- **Brand name:** Inter 700. `.text-heading` at rest, Signal Green on hover/active. 300ms ease-in-out. `.focus-ring` on focus-visible.
- **Nav items:** JetBrains Mono, lowercase. Slate at rest; heading color on hover; Signal Green when route matches (`aria-current="page"`). 44px min touch height via `.touch-target`.
- **Focus:** `.focus-ring` — 2px lime outline, 2px offset.

### Inline Links (`Link.astro`)
Underline on by default (`underline-offset: 2px`).

- **Rest:** Inherits context color; lime decoration at 40% opacity.
- **Hover / active:** Text shifts to Signal Green; decoration opacity rises.
- **Focus:** `.focus-ring`.

### List Entries (Work, Articles, Talks)
`pl-4` left indent with transparent `border-l`. On hover, a 1px structural border emerges (`border-zinc-300` light / `border-zinc-700` dark) — never a colored stripe.

- **Date:** JetBrains Mono, `text-xs`, `.text-meta`.
- **Title / company:** Bricolage Grotesque 700, `text-lg`, `.text-heading`. Hover shifts to Signal Green.
- **Role / talk title:** Inter, `text-sm`, `.text-accent`.

### Back Navigation (`BackToPrev` / `BackToTop`)
Bordered pill-less buttons: 1px `border-subtle`, min 44px touch target, left arrow SVG with line/chevron animation on hover (always visible on touch via `@media (hover: none)`). `.focus-ring`. BackToTop fades in when `html.scrolled` class is set.

### Container / Layout
Single centered column: `max-width: 672px` (`max-w-2xl`), `padding-inline: 16px` mobile / `20px` sm+. Section spacing: `80px` (`space-y-20`) standard, `112px` (`space-y-28`) on homepage. Safe-area insets on body, header, footer.

### Article / Prose
Article layout uses `@tailwindcss/typography` with Bricolage on h1–h3, Inter on paragraphs. Article links: lime underline per inline link spec. Headings have `scroll-margin-top: 6rem` for fixed header offset.

**Table of Contents:** Mono links (`.toc-link`), `.text-prose` at rest, Signal Green when active (`.toc-active` + `aria-current="location"`). Scroll-spy via IntersectionObserver in `Head.astro`.

**Callout:** Bordered surface (`note` / `warning` / `tip` / `info`), mono uppercase type label, Inter body. Semantic border/bg tints per variant — the one place secondary hues (amber, sky) appear, confined to callout boxes.

**Timeline:** Mono timestamps in fixed-width column, vertical 1px track, lime dot for highlighted events. Title in sentence case (not uppercase).

**Author bio / related:** Muted surface block (`.bg-surface-muted`), initials in Signal Green, related entries with left-border hover affordance matching list entries.

### Theme Toggle (Footer)
Three icon buttons (light / dark / system), 44×44px (`.size-11`), `rounded-full` — the sole permitted radius exception, scoped to these hit-target circles only. Stroke icons shift to Signal Green on hover. `.focus-ring`.

### Motion
- **Hero entrance:** `.animate-hero` — opacity 0→1, translateY(12px→0), 700ms ease-out. Applied to page hero blocks only. Content is visible by default if JS fails or `prefers-reduced-motion: reduce`.
- **State transitions:** 300ms ease-in-out on color, border-color, decoration-color.
- **No** uniform stagger on every section. No opacity-gating on article body, ToC, or footer.

## 6. Do's and Don'ts

### Do:
- **Do** treat Signal Green as a signal, not a color scheme. One focal accent per viewport.
- **Do** use semantic utility classes (`.text-heading`, `.text-prose`, `.text-meta`, `.text-accent`, `.border-subtle`) — not raw zinc/lime classes in components.
- **Do** set display headings with `text-wrap: balance` and long prose with `text-wrap: pretty`.
- **Do** keep all content within the 672px (`max-w-2xl`) column.
- **Do** use JetBrains Mono only for dates, nav, metadata, code, and structural in-article labels. Never for paragraph prose.
- **Do** apply `.focus-ring` to every interactive element. Keyboard focus must be visible.
- **Do** enforce 44px minimum touch targets (`.touch-target`, `.touch-target-block`) on mobile.
- **Do** animate hero entrance only (`.animate-hero`). All other content ships visible.
- **Do** verify contrast in both light and dark themes before shipping. Floor is WCAG AA 4.5:1 for body text.
- **Do** use the signal mark once per page hero as the visual accent anchor.

### Don't:
- **Don't** use `border-left` thicker than 1px as a colored stripe accent. Structural hover borders only.
- **Don't** use gradient text (`background-clip: text`). Signal Green is a solid color.
- **Don't** add box shadows. The Flat-By-Default Rule applies everywhere except header blur.
- **Don't** add border radius except on theme-toggle icon buttons (44px circles). Everywhere else: sharp corners.
- **Don't** design this as a developer portfolio. No skills bars, no project grids, no "Hello World" energy.
- **Don't** introduce VC-bro branding: hype language, buzzword soup, manufactured warmth, "I'm passionate about" constructions.
- **Don't** add agency-level visual flash: decorative glassmorphism, animated gradients, hover lift effects.
- **Don't** warm the background. The cream/sand/beige band is forbidden.
- **Don't** introduce a fourth typeface. Bricolage, Inter, JetBrains Mono are the complete system.
- **Don't** gate content visibility on JavaScript animation classes. If it's important, it's in the DOM visible by default.
- **Don't** use numbered section markers (01 / 02 / 03) as scaffolding.
- **Don't** add uppercase eyebrow labels above every section heading. Structural mono labels inside articles (Contents, callout types) are permitted; section titles are not eyebrows.
