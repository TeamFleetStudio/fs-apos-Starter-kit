# Apostrophe CMS Starter — AI Context Index

> **Purpose:** These documents describe the data model, widget library, and configuration of the `fs-apostrophe-cms-starter` Apostrophe v4 project. They are intended to be fed to an AI coding assistant alongside an HTML site's markup, so the assistant can map HTML sections → Apostrophe widgets and generate the correct MongoDB seed documents or REST API payloads to replicate the site.

---

## Document Map

| File | Covers |
|---|---|
| `01_AREA_CONFIG.md` | `lib/area.js` — widget groups, pickers, and how areas are structured |
| `02_GLOBAL_SETTINGS.md` | `@apostrophecms/global` — brand, typography, header, footer, custom code |
| `03_WIDGETS.md` | Every widget's field schema, purpose, and HTML mapping hints |
| `04_BREAKPOINTS_AND_LAYOUT.md` | Responsive behaviour, breakpoint fields, column/layout patterns |
| `05_PIECES.md` | All piece types (blog, media, team-member, product, etc.) |
| `06_FORMS.md` | Form module override, field types, integrations |
| `07_API_PATTERNS.md` | How Apostrophe stores areas/widgets in MongoDB; REST API payload shapes |

---

## Key Concepts for AI

### What is an Area?
An **area** is a collection of widgets. In the database it is stored as:
```json
{
  "metaType": "area",
  "items": [
    { "type": "widget-name", "_id": "...", ...fieldValues }
  ]
}
```
Every `area` field in a schema is a nested document following this shape.

### What is a Widget?
A **widget** is a discrete content block. Each widget type has a `type` string (e.g. `"hero-banner"`, `"columns"`, `"rich-text"`) and a flat set of fields defined in its `index.js`. Widgets live inside areas.

### What is a Piece?
A **piece** is a reusable, standalone document (blog post, team member, product). Pages reference pieces via `relationship` fields. Pieces have their own REST endpoints.

### Page Structure
Every page has:
- `type`: page type slug (e.g. `"default-page"`, `"@apostrophecms/home-page"`)
- `title`: string
- `slug`: url path (e.g. `"/"`, `"/about"`)
- `main`: an **area** containing top-level widgets

### MongoDB Collection Naming
- Pages → `aposDocs` (with `type` = page type)
- Pieces → `aposDocs` (with `type` = piece type slug)
- Global → `aposDocs` (with `type` = `"@apostrophecms/global"`)

---

## Workflow: HTML → Apostrophe

1. Identify each visual section in the HTML
2. Match it to a widget from `03_WIDGETS.md` using the "HTML Mapping Hints"
3. Map HTML content values → widget field names
4. Construct the area JSON using the patterns in `07_API_PATTERNS.md`
5. Wrap in a page document and insert into `aposDocs`
