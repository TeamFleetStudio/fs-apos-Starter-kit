# Breakpoints & Layout Behaviour

> This document describes how widgets control their responsive layout — both through built-in Apostrophe field settings and through the underlying CSS/SCSS system. Use this when mapping an HTML site's responsive behaviour to Apostrophe widget fields.

---

## Breakpoint System

The project uses **Tailwind-style breakpoint naming** in its SCSS. The breakpoints are:

| Name | Min-width | CSS context |
|---|---|---|
| mobile | < 640px | Default (mobile-first) |
| sm | ≥ 640px | `@media (min-width: 640px)` |
| md | ≥ 768px | `@media (min-width: 768px)` |
| lg | ≥ 1024px | `@media (min-width: 1024px)` |
| xl | ≥ 1280px | `@media (min-width: 1280px)` |
| 2xl | ≥ 1536px | `@media (min-width: 1536px)` |

**Key threshold: 640px** — widgets that have a column layout wrap to a single column below 640px by default.

---

## Widgets With Explicit Breakpoint Fields

### `step-card-grid` — Only widget with direct breakpoint fields
This widget exposes grid-column counts as separate schema fields, one per breakpoint tier:

| Field | Breakpoint | Range | Default |
|---|---|---|---|
| `gridColsDesktop` | ≥ 1024px | 1–6 | `4` |
| `gridColsTablet` | 640px – 1023px | 1–3 | `2` |
| `gridColsMobile` | < 640px | 1–2 | `1` |

The widget renders a CSS grid with `grid-template-columns` driven by these values via inline style or generated classes.

**AI Usage:** When the HTML has a step/process grid that changes columns at breakpoints, populate these three fields accordingly.

---

## Layout Widgets — Responsive Behaviour

### `columns` widget
| `cols` value | Desktop layout | Mobile (< 640px) behaviour |
|---|---|---|
| `single` | 1 column, full width | 1 column |
| `double` | 2 equal columns | Stacks to 1 column |
| `triple` | 3 equal columns | Stacks to 1 column |
| `quadruple` | 4 equal columns | Stacks to 2 columns (sm), then 1 (xs) |

- `style: "full"` → `width: 100%` (no max-width)
- `style: "contained"` → `max-width: var(--container-max-width)`, centered

### `side-by-side` widget
- Desktop: **two columns side by side** (typically 50/50 or configurable ratio)
- Mobile (< 640px): **stacks vertically** — column `one` on top, column `two` below
- `invert: true` flips left/right on desktop; stacking order on mobile follows natural document order after inversion
- `stickyColumn`: makes one column `position: sticky; top: {stickyTopOffset}px` — only meaningful on desktop

### `hero-banner` widget
- Desktop: two columns (`one` and `two`) side by side
- Mobile (< 768px): stacks vertically — `one` on top, `two` below
- Background image covers the full section regardless of viewport
- `section-class` controls the outer section's CSS class — use this to apply custom height/sizing classes

---

## Container / Width System

Defined in `_containers.scss`:

| CSS class | Behaviour |
|---|---|
| `.container` | `max-width` from global var, centered, with padding |
| `.container-fluid` | Full width with side padding only |
| `.section-full` | `width: 100%`, no max-width |
| `.section-contained` | Applies the container max-width |

These map to the `style` field on layout widgets:
- `style: "full"` → `.section-full`
- `style: "contained"` → `.section-contained` / `.container`

---

## Rich Text — Responsive Typography

The global settings generate CSS custom properties that the typography system uses responsively. The project does **not** use separate mobile/desktop font size fields — instead:

- Base sizes defined in global settings (e.g. `h1FontSize: "56px"`)
- The theme SCSS (`_typography.scss`, `_theme.scss`) uses `clamp()` or media-query overrides
- Rich text style classes (`h1`–`h6`, `p1`–`p3`) map to these CSS variables

**Important:** When replicating an HTML site, if headings have responsive sizes (e.g. h1 is 56px on desktop, 32px on mobile), you should:
1. Set the global `h1FontSize` to the desktop value
2. Add responsive overrides in the `customCSS` field of global settings

---

## Card Grids — Implicit Responsive Behaviour

These widgets render multi-column card grids with **automatic responsive wrapping**:

| Widget | Desktop cols | Tablet cols | Mobile cols |
|---|---|---|---|
| `card` | 3 (auto) | 2 | 1 |
| `image-card` | 3–4 | 2 | 1 |
| `testimonial` | Carousel (1–3 visible) | 1–2 | 1 |
| `logo-grid` | Controlled by `columns` field (2–6) | ~half of `columns` | 2 |
| `stats-card` | 3–4 | 2 | 1 |
| `team-member (four-col)` | 4 | 2 | 1 |
| `team-member (three-col)` | 3 | 2 | 1 |
| `benefit-card` | Used standalone | — | — |
| `pricing` | Up to 4 | 2 | 1 |

These responsive behaviours are CSS-driven (not field-controlled) — **no field mapping needed** for the responsive behaviour itself.

---

## `image-gallery` — Slide Visibility

The `displayType` field controls how many slides show at once (using Swiper.js):

| `displayType` | Desktop | Tablet (768px) | Mobile (640px) |
|---|---|---|---|
| `"1"` | 1 slide | 1 slide | 1 slide |
| `"3"` | 3 slides | 2 slides | 1 slide |
| `"4"` | 4 slides | 2 slides | 1 slide |

---

## Sticky Columns (`side-by-side`)

When `stickyColumn` is set to `first` or `second`, the chosen column becomes `position: sticky` on desktop. This is used for:
- Sticky sidebar navigation
- Sticky image while scrolling through content
- Sticky CTA alongside a long content block

Set `stickyTopOffset` (0–200px) to account for fixed headers.

**Mobile behaviour:** Sticky is disabled at the mobile breakpoint — content stacks normally.

---

## Background Patterns

Multiple widgets support backgrounds. Priority / layering:

1. `bgImg` (area with image) — rendered as `background-image: url(...)` with `background-size: cover`
2. `bgColor` (color field) — rendered as `background-color`
3. Widget has no background → transparent (parent section background shows through)

The `bgType` field (on `side-by-side`) selects between image and color:
- `bgType: "bgColor"` → show `bgColor` field
- `bgType: "bgImg"` → show `bgImgType` field:
  - `bgImgType: "bgCover"` → single `bgImg` covers the full section
  - `bgImgType: "bgIndividual"` → `firstColumnImg` + `secondColumnImg` cover each column separately

---

## AOS (Animate On Scroll) Integration

The `animationEffects` field (from `aosSchema`) adds a `data-aos="..."` attribute to the widget's root element. AOS fires when the element scrolls into the viewport.

- `"no-animation"` → no `data-aos` attribute
- Any other value → `data-aos="fade-up"` (or whichever effect selected)
- AOS library is initialised globally in the asset bundle

**AI Usage:** When the HTML has scroll-triggered animations on sections, set `animationEffects` to the closest matching AOS effect.

---

## Summary: Field → CSS Behaviour Quick Reference

| HTML pattern | Widget | Key field |
|---|---|---|
| 2-col responsive section | `side-by-side` | `invert`, `bgType`, `stickyColumn` |
| N-col grid that wraps | `columns` | `cols`, `style` |
| Hero with bg image | `hero-banner` | `bg-img`, `bg-color` |
| Process steps with grid | `step-card-grid` | `gridColsDesktop`, `gridColsTablet`, `gridColsMobile` |
| Image gallery slider | `image-gallery` | `displayType` |
| Fade/slide animation | any widget | `animationEffects` |
| Logo marquee/grid | `logo-grid` | `columns`, `gap`, `imageStyle` |
| Custom CSS on a widget | any | `customClassName` + global `customCSS` |
