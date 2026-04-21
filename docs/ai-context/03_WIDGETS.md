# Widget Library — Complete Schema Reference

> Every widget listed here lives in `modules/content-widget-modules/` or `modules/pieces-modules/`. Each section includes: the widget's **type string** (used in area `items`), its **purpose/HTML mapping hint**, and its **full field schema**.

---

## Shared Field Schemas (imported by many widgets)

### AOS Animation Fields (`aosSchema`)
| Field | Type | Values | Default |
|---|---|---|---|
| `animationEffects` | select | `no-animation`, `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-up-right`, `fade-up-left`, `fade-down-right`, `fade-down-left`, `flip-left`, `flip-right`, `flip-up`, `flip-down`, `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-left`, `zoom-in-right`, `zoom-out`, `zoom-out-up`, `zoom-out-down`, `zoom-out-left`, `zoom-out-right` | `"no-animation"` |

### Custom Attributes Fields (`customAttributesSchema`)
| Field | Type | Description |
|---|---|---|
| `customClassName` | string | Extra CSS classes on the widget root element |
| `customId` | string | Custom `id` attribute on the widget root element |

### Button Fields Reference (buttonSchema — spread into many widgets)
| Field | Type | Values / Notes |
|---|---|---|
| `linkText` | string | Button label |
| `style` | select | `primary` / `secondary` / `custom` |
| `textColor` | color | Used when style = custom |
| `backgroundColor` | color | Used when style = custom |
| `alignment` | select | `center` / `right` / `left` |
| `isSvgIcon` | boolean | Show SVG icon |
| `svgIcon` | codeEditor | SVG code (shown if isSvgIcon) |
| `iconPlacement` | select | `left` / `right` |
| `border` | boolean | Show border |
| `borderColor` | color | |
| `borderRadius` | integer (range 0–50) | px |
| `size` | select | `regular` / `sm` / `lg` |
| `weight` | select | `normal` / `light` / `bold` / `extrabold` |
| `isRedirect` | boolean | Whether button is a link |
| `linkType` | select | `page` / `file` / `custom` |
| `_linkPage` | relationship | Apostrophe page (if linkType=page) |
| `_linkFile` | relationship | Apostrophe file (if linkType=file) |
| `linkUrl` | url | Custom URL (if linkType=custom) |
| `linkTarget` | checkboxes | `_blank` = open in new tab |
| `ariaLabel` | string | Accessibility label |
| `horizontalRule` | boolean | Show `<hr>` after button |
| `customClassName` | string | |
| `customId` | string | |

---

## Layout Widgets

### `hero-banner`
**Purpose:** Full-width hero section, typically the first section on a page. Two side-by-side content columns with optional background image or color.

**HTML Mapping:** Any `<section class="hero">` or `<div class="banner">` with a headline + supporting content + optional image.

| Field | Type | Notes |
|---|---|---|
| `one` | area (heroBannerGroup) | Left/primary content column |
| `two` | area (heroBannerGroup) | Right/secondary content column |
| `bg-img` | area (image only, max 1) | Background image |
| `bg-color` | color | Background color (if no image) |
| `section-class` | string | Custom CSS class on section element |

**Sub-area widget options for `one` and `two`:** `rich-text`, `image`, `button`, `card`, `image-card`, `testimonial`, `accordion`, `map`, `call-to-action`, `overview-card`, `stats-card`, `pricing`, `enterprise`, `team-member`, `specialization`, `services-team`, `product`, `progressBar-slider`, `beyond-barriers-guests`, `audit-slider`, `comparison-table`, `benefit-card`, `logo-grid`, `icon-bullet-list`, `step-card-grid`, `custom-form`

---

### `columns`
**Purpose:** Generic multi-column layout container. Splits the page into 1–4 equal-width columns, each holding any widget.

**HTML Mapping:** `<div class="grid grid-cols-2">` or `<div class="row">` style layouts.

| Field | Type | Values | Notes |
|---|---|---|---|
| `style` | select | `full` / `contained` | Full-width or max-width container |
| `cols` | select | `single` / `double` / `triple` / `quadruple` | Number of columns |
| `one` | area (columnExpandedGroup) | Column 1 (always shown) | |
| `two` | area (columnExpandedGroup) | Column 2 (shown if cols ≥ double) | |
| `three` | area (columnExpandedGroup) | Column 3 (shown if cols ≥ triple) | |
| `four` | area (columnExpandedGroup) | Column 4 (shown if cols = quadruple) | |
| `bgColor` | color | Background of the columns wrapper | |
| `animationEffects` | select | AOS animation | |
| `customClassName` | string | | |
| `customId` | string | | |

---

### `side-by-side`
**Purpose:** Two-column layout where columns can have independent backgrounds, sticky positioning, and optionally be inverted.

**HTML Mapping:** Any split-screen section with text on one side, image on the other.

| Field | Type | Values | Notes |
|---|---|---|---|
| `style` | select | `full` / `contained` | |
| `invert` | boolean | — | Swap left/right order |
| `one` | area (all widgets) | Left column content | |
| `two` | area (all widgets) | Right column content | |
| `bgType` | select | `bgColor` / `bgImg` | How to fill the section background |
| `bgColor` | color | — | Shown if bgType = bgColor |
| `bgImgType` | select | `bgCover` / `bgIndividual` | Shown if bgType = bgImg; cover = single image, individual = per-column |
| `bgImg` | area (image, max 1) | Full-section bg image (if bgCover) | |
| `firstColumnImg` | area (image, max 1) | Column 1 bg (if bgIndividual) | |
| `secondColumnImg` | area (image, max 1) | Column 2 bg (if bgIndividual) | |
| `stickyColumn` | select | `none` / `first` / `second` | Which column sticks on scroll |
| `stickyTopOffset` | integer (range 0–200) | px from top when sticky | Shown if stickyColumn ≠ none |
| `widgetClass` | string | | |
| `widgetId` | string | | |
| `animationEffects` | select | AOS | |

---

## Content Widgets

### `rich-text`
**Purpose:** Formatted text block. Wraps Apostrophe's rich text editor.

**HTML Mapping:** Any `<p>`, `<h1>`–`<h6>`, `<ul>`, `<ol>`, `<blockquote>`, or mixed text section.

| Field | Type | Notes |
|---|---|---|
| `richText` | area (richText only) | The actual rich text content |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

**Rich text storage format:**
```json
{
  "type": "rich-text",
  "richText": {
    "metaType": "area",
    "items": [{
      "metaType": "widget",
      "type": "@apostrophecms/rich-text",
      "content": "<h2>Hello World</h2><p>Body text here.</p>"
    }]
  }
}
```

---

### `image`
**Purpose:** A single image with optional caption/overlay rich text.

**HTML Mapping:** `<img>` tags, `<figure>` elements.

| Field | Type | Notes |
|---|---|---|
| `_image` | relationship (max 1, required) | Reference to `@apostrophecms/image` piece |
| `content` | area (rich-text only) | Optional caption/overlay text |
| `imageClass` | string | CSS class on `<img>` |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

---

### `call-to-action`
**Purpose:** Prominent CTA section with feature image and text/buttons.

**HTML Mapping:** Marketing CTA sections, feature highlight rows with image + text + button.

| Field | Type | Values | Notes |
|---|---|---|---|
| `style` | select | `basic` / `large-marquee` | Layout variant |
| `contentAlignment` | select | `left` / `centered` / `right` | Text alignment within the section |
| `featureImage` | area (image, max 1, required) | The prominent image | |
| `content` | area (rich-text + button-strip) | Text and CTA buttons | |
| `animationEffects` | select | AOS | |
| `customClassName` | string | | |
| `customId` | string | | |

---

### `accordion`
**Purpose:** Expandable FAQ or content list.

**HTML Mapping:** `<details>/<summary>` sections, FAQ sections.

| Field | Type | Notes |
|---|---|---|
| `groupTitle` | string | Optional heading above the accordion |
| `accordions` | array | Each item: `title` (string) + `content` (area: richText + image) |
| `widgetClass` | string | |

---

### `card`
**Purpose:** Grid of cards with image, title, content, and optional link/button.

**HTML Mapping:** Product cards, blog preview cards, feature cards in a grid.

**`card` array item fields:**
| Field | Type | Notes |
|---|---|---|
| `bannerImage` | area (image) | Card image |
| `title` | string | Card heading |
| `content` | area (rich-text) | Card body |
| `isRedirectToAnotherPage` | boolean | Whether card title is a link |
| `linkType` | select | `page` / `file` / `custom` (if isRedirect) |
| `_linkPage` | relationship | (if linkType=page) |
| `_linkFile` | relationship | (if linkType=file) |
| `linkUrl` | url | (if linkType=custom) |
| `linkTarget` | checkboxes | `_blank` |
| `widgetClass` | string | Per-card CSS class |
| `cardBtns` | array (max 1) | Button widget fields (full buttonSchema) |

---

### `image-card`
**Purpose:** Cards with an image thumbnail + title + optional link. Typically used for media/blog lists.

**HTML Mapping:** Blog post preview grids, media galleries with titles.

| Field | Type | Notes |
|---|---|---|
| `images` | array | Each: `cardImage` (area) + `title` (string) + full linkSchema + `imageClass` (string) |
| `isBorder` | boolean | Show border on cards |
| `bgImg` | area (contextual) | Background image |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

---

### `testimonial`
**Purpose:** Testimonial/review carousel.

**HTML Mapping:** Quote sections, review carousels, client testimonials.

| Field | Type | Notes |
|---|---|---|
| `style` | select | `full` / `contained` |
| `arrowColor` | color | Carousel nav arrow color |
| `arrowDisabledColor` | color | |
| `dotColor` | color | Carousel dot color |
| `dotActiveColor` | color | |
| `widgetClass` | string | |
| `widgetId` | string | |

**`testimonial` array item fields:**
| Field | Type | Notes |
|---|---|---|
| `bgColor` | color | Card background |
| `name` | string (required) | Reviewer name |
| `authorNameColor` | color | |
| `position` | select | `top` / `bottom` (profile position) |
| `profile` | area (simple-image, required) | Profile photo |
| `designation` | string (required) | Job title/role |
| `designationColor` | color | |
| `comments` | area (rich-text, required) | Review text |
| `quoteIconColor` | color | |
| `quoteIconImage` | area (image) | Custom quote icon |
| `quoteCircleBgColor` | color | |
| `ratings` | integer (1–5) | Star rating |
| `starColor` | color | |
| `separatorColor` | color | |
| `widgetClass` | string | Per-card CSS class |

---

### `overview-card`
**Purpose:** Feature overview cards with image, metrics/stats items, and a CTA button.

**HTML Mapping:** "Why choose us" sections, feature breakdowns with stats.

| Field | Type | Notes |
|---|---|---|
| `style` | select | `full` / `contained` |
| `widgetClass` | string | |
| `widgetId` | string | |

**`overviewCard` array item fields:**
| Field | Type | Notes |
|---|---|---|
| `title` | string | Card heading |
| `image` | area (image) | Card image |
| `content` | area (rich-text) | Intro text |
| `items` | array | Each: `heading`, `subHeading`, `description`, `icon` (area), `url` (string) |
| `btn` | area (button widget only) | CTA button |

---

### `stats-card`
**Purpose:** Statistics / metrics display — icon + number/value + label.

**HTML Mapping:** "Our numbers" sections, KPI blocks, impact stats.

| Field | Type | Notes |
|---|---|---|
| `headerIcon` | area (image, max 1) | Icon above stats |
| `title` | area (rich-text) | Section heading |
| `bgColor` | color | Default `#f7faff` |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

**`stats` array item fields:**
| Field | Type | Notes |
|---|---|---|
| `icon` | select | 21 predefined icon names + `"custom-svg"` |
| `customSvg` | textarea | SVG code (if icon = custom-svg) |
| `value` | string (required) | The stat number/text, e.g. `"10,000+"` |
| `valueColor` | color | |
| `label` | area (rich-text) | Stat label |
| `description` | area (rich-text) | Supporting text |

---

### `pricing`
**Purpose:** Pricing tier cards.

**HTML Mapping:** Pricing tables, subscription plan comparisons.

| Field | Type | Notes |
|---|---|---|
| `intro` | area (rich-text) | Section heading/intro |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

**`cards` array (max 4) item fields:**
| Field | Type | Notes |
|---|---|---|
| `label` | string | Plan name |
| `content` | area (rich-text) | Price + description |
| `features` | array | Each: `title` (string) — feature line items |
| `buttons` | area (button widget, max 2) | CTA buttons |

---

### `comparison-table`
**Purpose:** Feature comparison matrix between products/tiers.

**HTML Mapping:** Side-by-side comparison tables.

| Field | Type | Notes |
|---|---|---|
| `columns` | array (min 2, max 5) | Each: `title` (string) + `isHighlighted` (boolean) + `highlightColor` (color) |
| `rows` | array | Each: `featureName` (string) + `col1Value`–`col4Value` (select: `check`/`cross`/`text`) + optional custom text per col |
| `tableClass` | string | |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

---

### `logo-grid`
**Purpose:** Grid of partner/client logos.

**HTML Mapping:** "Trusted by" / "As seen in" / client logo sections.

| Field | Type | Values | Notes |
|---|---|---|---|
| `title` | string | — | Optional section heading |
| `columns` | select | `2`/`3`/`4`/`5`/`6` | Grid columns; default `3` |
| `gap` | select | `small`/`medium`/`large` | Grid gap |
| `imageStyle` | select | `rounded`/`rounded-lg`/`circle`/`square` | Logo image shape |
| `showBorder` | boolean | — | Border around each logo |
| `bgColor` | color | — | Default `#ffffff` |
| `animationEffects` | select | AOS | |
| `customClassName` | string | | |
| `customId` | string | | |

**`logos` array item fields:**
| Field | Type | Notes |
|---|---|---|
| `image` | area (image) | Logo image |
| `altText` | string (required) | Alt text |
| `link` | url | Optional link on logo |
| `linkTarget` | select | `_blank` / `_self` |

---

### `icon-bullet-list`
**Purpose:** List of items each with an icon + rich text content.

**HTML Mapping:** Feature lists, "What you get" bullet lists with icons.

| Field | Type | Notes |
|---|---|---|
| `items` | array | See below |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

**`items` array item fields:**
| Field | Type | Values | Notes |
|---|---|---|---|
| `iconType` | select | `svg` / `image` | |
| `customSvg` | codeEditor | — | SVG code (if iconType=svg) |
| `iconImage` | area (image) | — | (if iconType=image) |
| `iconPlacement` | select | `left`/`right`/`top`/`center` | |
| `iconVerticalAlign` | select | `top`/`center`/`bottom` | |
| `iconSize` | integer (range 12–500) | px | |
| `iconBackground` | color | Background behind icon | |
| `iconBorderRadius` | integer (range 0–50) | px | |
| `iconBorderWidth` | integer (range 0–10) | px | |
| `iconBorderColor` | color | | |
| `content` | area (rich-text) | Text content for the item | |

---

### `step-card-grid`
**Purpose:** Step-by-step process cards in a responsive grid. Has explicit breakpoint columns control.

**HTML Mapping:** "How it works" sections, numbered step grids.

**Grid / Breakpoint Fields:**
| Field | Type | Default | Description |
|---|---|---|---|
| `gridColsDesktop` | select (1–6) | `4` | Columns on desktop (≥1024px) |
| `gridColsTablet` | select (1–3) | `2` | Columns on tablet (640px–1023px) |
| `gridColsMobile` | select (1–2) | `1` | Columns on mobile (<640px) |

**Card Border Fields:**
| Field | Type | Notes |
|---|---|---|
| `hasBorder` | boolean | |
| `borderWidth` | integer (range 1–10) | px |
| `borderColor` | color | |
| `borderRadius` | integer (range 0–50) | px |

**Section Icon (between cards):**
| Field | Type | Notes |
|---|---|---|
| `hasIcon` | boolean | Show icon between each card |
| `sectionIconType` | select | `svg` / `image` |
| `sectionIconSvg` | codeEditor | SVG code |
| `sectionIconImage` | area (image) | |

**`cards` array item fields:**
| Field | Type | Notes |
|---|---|---|
| `cardBgColor` | color | Per-card background |
| `cardIconType` | select | `svg` / `image` |
| `cardIconSvg` | codeEditor | |
| `cardIconImage` | area (image) | |
| `cardIconBgColor` | color | |
| `cardIconBorderRadius` | integer (range 0–100) | px |
| `cardIconBorderWidth` | integer | |
| `cardIconBorderColor` | color | |
| `content` | area (rich-text) | Card text |

+ `animationEffects`, `customClassName`, `customId`

---

### `benefit-card`
**Purpose:** Single prominent feature/benefit card — icon + title + description.

**HTML Mapping:** Individual feature highlights, benefit callout boxes.

| Field | Type | Notes |
|---|---|---|
| `icon` | area (image, max 1) | Icon image |
| `title` | string (required) | Benefit name |
| `description` | textarea | Short description |
| `highlightText` | string | Optional highlighted label/tag |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

---

### `map`
**Purpose:** Embeds a map — either via geocoded address (Mapbox) or raw embed code.

**HTML Mapping:** Contact page map, location sections.

| Field | Type | Values | Notes |
|---|---|---|---|
| `mapType` | select | `geocode` / `embed` | |
| `apiKey` | string | — | Mapbox API key (if geocode) |
| `address` | string (required) | — | Street address (if geocode) |
| `mapZoomLevel` | integer (1–14) | 14 | Zoom level (if geocode) |
| `mapEmbedCode` | textarea (required) | — | iframe embed HTML (if embed) |
| `animationEffects` | select | AOS | |
| `customClassName` | string | | |
| `customId` | string | | |

---

### `button`
**Purpose:** Standalone button or button group.

**HTML Mapping:** Individual CTA buttons not inside another widget.

Fields: full **buttonSchema** (see Shared Field Schemas above) + `customAttributesSchema`

---

### `button-strip-widget` (type: used inside other widgets, not directly)
**Purpose:** Row of multiple buttons with configurable spacing.

| Field | Type | Notes |
|---|---|---|
| `buttons` | array | Each item: full buttonSchema |
| `buttonSpacing` | integer (range 0–50) | Gap in px; default `16` |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

---

### `image-gallery`
**Purpose:** Scrollable/slideable image gallery.

**HTML Mapping:** Photo galleries, project portfolios, image sliders.

| Field | Type | Values | Notes |
|---|---|---|---|
| `displayType` | select | `1` / `3` / `4` | Slides visible at once |
| `_images` | relationship (max 10, required) | — | References to `@apostrophecms/image` pieces |
| `arrowBgColor` | color | — | Nav arrow background |
| `arrowIconColor` | color | — | Nav arrow icon color |
| `arrowBorder` | boolean | — | Show border on arrows |
| `arrowBorderColor` | color | — | |
| `animationEffects` | select | AOS | |
| `customClassName` | string | | |
| `customId` | string | | |

---

### `video-upload` (widget)
**Purpose:** Plays an uploaded video file (mp4/webm/mov/avi).

**HTML Mapping:** Video sections, explainer videos.

| Field | Type | Notes |
|---|---|---|
| `_video` | relationship (required) | References a `video-upload` piece |
| `VideosectionClassName` | string | CSS class on section |
| `VideosectionID` | string | ID on section |

---

### `custom-form`
**Purpose:** Embeds an Apostrophe Form. Supports background image or color layout.

**HTML Mapping:** Contact forms, newsletter signups, lead gen forms.

| Field | Type | Values | Notes |
|---|---|---|---|
| `layout` | select | `background` / `column` | |
| `backgroundStyle` | select | `image` / `color` | (if layout=background) |
| `_backgroundImage` | relationship to image | — | (if backgroundStyle=image) |
| `backgroundColor` | color | — | (if backgroundStyle=color) |
| `fontColor` | select | `primary`/`secondary`/`tertiary`/`black`/`white` | |
| `form` | area (max 1, form widget only) | — | |
| `animationEffects` | select | AOS | |
| `customClassName` | string | | |
| `customId` | string | | |

---

### `enterprise`
**Purpose:** Grid of partner/enterprise organisation logos with links.

**HTML Mapping:** "Used by enterprise" logo strips, partner grids.

| Field | Type | Notes |
|---|---|---|
| `title` | string (required) | Section heading |
| `images` | array | Each: `orgImage` (area) + `title` (string) + full linkSchema |
| `widgetClass` | string | |

---

### `services-team`
**Purpose:** Service category tiles — icon/logo + title + description. Simpler than `team-member`.

**HTML Mapping:** Services overview grids, department listings.

| Field | Type | Notes |
|---|---|---|
| `team` | array | Each: `title` (required) + `logo` (area, contextual) + `description` (required) |
| `widgetClass` | string | |

---

### `specialization`
**Purpose:** Specialisation/expertise tiles with logo + description + link.

**HTML Mapping:** Expertise sections, capability showcases.

| Field | Type | Notes |
|---|---|---|
| `specializations` | array | Each: `title` (required) + `logo` (area, contextual) + `description` (area: rich-text, required) + `url` (string) |
| `widgetClass` | string | |
| `widgetId` | string | |

---

### `beyond-barriers-guests`
**Purpose:** Podcast guest profile card — photo, name, role, and links to episodes.

**HTML Mapping:** Speaker/guest profiles, podcast episode cards.

| Field | Type | Notes |
|---|---|---|
| `name` | string (required) | Guest name |
| `role` | string (required) | Job title/role |
| `profile` | area (image, required) | Profile photo |
| `podcastsLinks` | array | Each: `cardImage` (area) + `title` (string) + full linkSchema |
| `bgColor` | color | Default `#f4f4f4` |
| `widgetClass` | string | |

---

### `audit-slider`
**Purpose:** Horizontal progress-bar style slider showing audit/score metrics.

**HTML Mapping:** Score breakdowns, audit results, metric sliders.

| Field | Type | Notes |
|---|---|---|
| `sliderBgColor` | color | Track background |
| `titleTextColor` | color | |
| `descriptionTextColor` | color | |
| `sliderBarColor` | color | Fill bar color |
| `sliderBarBgColor` | color | Unfilled bar background |
| `widgetClass` | string | |
| `widgetId` | string | |

**`slider` array item fields:**
| Field | Type | Notes |
|---|---|---|
| `auditCount` | integer | Score value (0–100) |
| `description` | string | Metric label |

---

### `progressBar-slider`
**Purpose:** Rich progress display — image + progress bars + icon + tagged content + background.

**HTML Mapping:** Skills/competency sections, feature progress sections.

| Field | Type | Notes |
|---|---|---|
| `image` | area (image, max 1) | Section image |
| `sliderBgColor` | color | |
| `titleTextColor` | color | |
| `descriptionTextColor` | color | |
| `sliderBarColor` | color | |
| `sliderBarBgColor` | color | |
| `icon` | area (image, max 1) | Icon displayed near sliders |
| `iconBgColor` | color | Default `#FFD700` |
| `bgImg` | area (image) | Background image |
| `tagline` | string | Small label |
| `content` | area (rich-text + button-strip, required) | Main text + CTA |
| `animationEffects` | select | AOS |
| `customClassName` | string | |
| `customId` | string | |

**`slider` array item fields:**
| Field | Type | Notes |
|---|---|---|
| `auditCount` | string | Percentage/value label |
| `description` | string | Metric label |

---

## Piece-Backed Widgets

### `team-member` (widget)
**Purpose:** Team member profile cards — pulls from the `team-member` piece type.

**HTML Mapping:** Meet the team sections, staff directories.

| Field | Type | Values | Notes |
|---|---|---|---|
| `style` | select | `three-col` / `four-col` | Grid layout |
| `_teamMembers` | relationship (required) | — | References to `team-member` pieces |
| `animationEffects` | select | AOS | |
| `customClassName` | string | | |
| `customId` | string | | |

---

### `product` (widget)
**Purpose:** Product listing cards with price and optional intro — pulls from the `product` piece type.

**HTML Mapping:** Product grids, pricing catalogues.

| Field | Type | Values | Notes |
|---|---|---|---|
| `headingIntro` | area (rich-text) | Section heading | |
| `style` | select | `full` / `split` | Layout variant |
| `currencySybmol` | string (max 1) | Default `$` | Currency symbol |
| `_menuItems` | relationship | — | References to `product` pieces |
| `animationEffects` | select | AOS | |
| `customClassName` | string | | |
| `customId` | string | | |

---

## Widget `@apostrophecms/video` (override)
**Purpose:** Embed a video via embed code (YouTube, Vimeo, Spotify, etc.).

| Field | Type | Notes |
|---|---|---|
| `video` | url (hidden) | Legacy field |
| `embedCode` | string | Paste full `<iframe>` embed code |
