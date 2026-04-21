# Area Configuration — `lib/area.js`

> This file is the **central registry of widget groups** used across all pages and widgets. Whenever a schema field of type `area` is defined, it references one of these group configurations to control which widgets the editor can insert.

---

## Area Group Reference

### `area.all`
**Usage:** Used inside the `columns-widget` and `side-by-side-widget` sub-columns where any widget is valid.

Flat list of all registered widget types (no grouping):
```
columns, video-upload, call-to-action, custom-form, image-gallery, product,
side-by-side, rich-text, image, map, accordion, pricing, enterprise,
team-member, specialization, services-team, button, hero-banner,
progressBar-slider, image-card, testimonial, overview-card, card,
beyond-barriers-guests, audit-slider, stats-card, comparison-table,
benefit-card, logo-grid, icon-bullet-list, step-card-grid
```

---

### `area.fullExpandedGroup`
**Usage:** Top-level page `main` area (home-page, default-page, piece-pages). The primary "full page builder" picker.

Groups exposed to the editor:

| Group Label | Widgets included |
|---|---|
| **Layout** | `columns`, `side-by-side`, `hero-banner` |
| **Media** | `image`, `video-upload`, `image-gallery` |
| **Content** | `rich-text`, `accordion`, `call-to-action`, `card`, `image-card`, `testimonial`, `overview-card`, `stats-card`, `button`, `map`, `pricing`, `enterprise`, `team-member`, `specialization`, `services-team`, `product`, `progressBar-slider`, `beyond-barriers-guests`, `audit-slider`, `comparison-table`, `benefit-card`, `logo-grid`, `icon-bullet-list`, `step-card-grid`, `custom-form` |

---

### `area.columnExpandedGroup`
**Usage:** Areas inside `columns-widget` columns (one/two/three/four). A slightly restricted picker — no layout nesting.

Groups:

| Group Label | Widgets included |
|---|---|
| **Basic** | `rich-text`, `image`, `button`, `video-upload` |
| **Layout** | `side-by-side`, `hero-banner` |
| **Themed** | `card`, `image-card`, `testimonial`, `accordion`, `map`, `call-to-action`, `overview-card`, `stats-card`, `pricing`, `enterprise`, `team-member`, `specialization`, `services-team`, `product`, `progressBar-slider`, `beyond-barriers-guests`, `audit-slider`, `comparison-table`, `benefit-card`, `logo-grid`, `icon-bullet-list`, `step-card-grid`, `custom-form` |

---

### `area.heroBannerGroup`
**Usage:** The `one` and `two` columns inside the `hero-banner-widget`.

Groups:

| Group Label | Widgets included |
|---|---|
| **Basic** | `rich-text`, `image`, `button` |
| **Themed** | `card`, `image-card`, `testimonial`, `accordion`, `map`, `call-to-action`, `overview-card`, `stats-card`, `pricing`, `enterprise`, `team-member`, `specialization`, `services-team`, `product`, `progressBar-slider`, `beyond-barriers-guests`, `audit-slider`, `comparison-table`, `benefit-card`, `logo-grid`, `icon-bullet-list`, `step-card-grid`, `custom-form` |

---

### `area.richText`
**Usage:** Simple rich-text-only areas (e.g. blog `summary`, form intro).

- Widget: `@apostrophecms/rich-text` only
- Full toolbar: `styles, bold, italic, strike, superscript, subscript, link, anchor, horizontalRule, bulletList, orderedList, blockquote, alignLeft, alignCenter, alignRight, alignJustify, colorButton, image, codeBlock, undo, redo`
- Simple toolbar (used in some sub-areas): `styles, bold, italic, link, colorButton, bulletList, orderedList`

**Rich text style classes available:**
`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p1` (Small Heading), `p` / `h7` / `p2` / `p3` (paragraph sizes), `blogheading`, `small`, `lead`, `highlight-primary`, `highlight-secondary`, `highlight-tertiary`, `highlight-black`, `highlight-white`, `highlight-yellow`, `highlight-muted`, `highlight-grey`, `highlight-darkblue`, `highlight-lightblack`, `custom-richtext-class`

---

### `area.apos`
**Usage:** Minimal content areas inside pieces or widget sub-areas.

Widgets: `@apostrophecms/image`, `@apostrophecms/video`, `@apostrophecms/rich-text`

---

### `area['video-upload']`
**Usage:** Video-only area slots.

Widget: `video-upload` only

---

## How Areas Are Stored in MongoDB

An area field in the database is a **nested object**, not a separate collection:

```json
{
  "main": {
    "metaType": "area",
    "_id": "generated-id",
    "items": [
      {
        "metaType": "widget",
        "type": "hero-banner",
        "_id": "widget-id",
        "section-class": "hero-home",
        "bg-color": "#0d1117",
        "one": {
          "metaType": "area",
          "_id": "sub-area-id",
          "items": [
            {
              "metaType": "widget",
              "type": "rich-text",
              "_id": "rt-id",
              "richText": { "metaType": "area", "_id": "...", "items": [...] }
            }
          ]
        }
      }
    ]
  }
}
```

### Key Rules
- Every area object must have `metaType: "area"` and a unique `_id`
- Every widget object must have `metaType: "widget"`, `type`, and a unique `_id`
- `_id` values should be 17-character alphanumeric strings (Apostrophe format), e.g. `"z1a2b3c4d5e6f7g8h"`
- Relationship fields (e.g. `_linkPage`, `_teamMembers`) store the related document's `_id` in an `aposDocId` reference array — for seed scripts, resolve slugs to IDs first
- `color` fields store CSS color strings: `"#ff0000"`, `"rgba(0,0,0,0.5)"`
- `boolean` fields store JavaScript booleans: `true` / `false`
- `integer` and `float` fields store numbers
