# API Patterns — MongoDB Document Structure & REST Payloads

> This document is the **primary reference for AI when generating seed scripts or REST API calls** to replicate an HTML site in Apostrophe. It covers: MongoDB document shapes, area/widget JSON construction, ID generation, relationship handling, and image attachment.

---

## Core Concepts

### Apostrophe ID Format
All `_id` values in Apostrophe use a custom 17-character alphanumeric format. For seed scripts, generate them as:
```js
function aposId() {
  return Math.random().toString(36).slice(2, 11) +
         Math.random().toString(36).slice(2, 10);
  // Produces strings like: "z1a2b3c4dk5e6f7g"
}
```
Or use a library: `const { cuid } = require('@paralleldrive/cuid2')` — Apostrophe also accepts cuid2 strings.

### Locale & Publishing
Every doc in a multi-locale Apostrophe site has:
- `aposLocale`: `"en:published"` (for published english)
- `aposMode`: `"published"`
- `visibility`: `"public"` (for public pages/pieces) or `"loginRequired"`

For a single-locale site (the default in this starter):
```json
{
  "aposLocale": "en:published",
  "aposMode": "published"
}
```

---

## Page Document Shape

```json
{
  "_id": "page-id:en:published",
  "aposDocId": "page-id",
  "aposLocale": "en:published",
  "aposMode": "published",
  "metaType": "doc",
  "type": "default-page",
  "title": "About Us",
  "slug": "/about",
  "visibility": "public",
  "published": true,
  "rank": 0,
  "level": 1,
  "path": "root-id/page-id",
  "orphan": false,
  "main": {
    "metaType": "area",
    "_id": "area-id",
    "items": [
      /* widget objects */
    ]
  }
}
```

**Page types and their `type` field values:**
| Page type | `type` value |
|---|---|
| Home page | `"@apostrophecms/home-page"` |
| Default page | `"default-page"` |
| Blog listing | `"blog-page"` |
| Media listing | `"media-page"` |
| Whitepaper listing | `"whitepaper-page"` |
| Product digest listing | `"product-digest-page"` |
| Podcast listing | `"review-page"` |
| Payment success | `"payment-success-page"` |

---

## Widget Object Shape (inside an area's `items` array)

Every widget must have at minimum:
```json
{
  "metaType": "widget",
  "type": "widget-type-slug",
  "_id": "unique-widget-id",
  /* ... widget-specific fields ... */
}
```

### Example: `rich-text` widget
```json
{
  "metaType": "widget",
  "type": "rich-text",
  "_id": "wid001",
  "animationEffects": "no-animation",
  "customClassName": "",
  "customId": "",
  "richText": {
    "metaType": "area",
    "_id": "aid001",
    "items": [
      {
        "metaType": "widget",
        "type": "@apostrophecms/rich-text",
        "_id": "rtid001",
        "content": "<h2>Our Mission</h2><p>We build great products.</p>"
      }
    ]
  }
}
```

### Example: `hero-banner` widget
```json
{
  "metaType": "widget",
  "type": "hero-banner",
  "_id": "wid002",
  "bg-color": "#0d1117",
  "section-class": "hero-home",
  "one": {
    "metaType": "area",
    "_id": "aid002",
    "items": [
      {
        "metaType": "widget",
        "type": "rich-text",
        "_id": "wid003",
        "animationEffects": "no-animation",
        "richText": {
          "metaType": "area",
          "_id": "aid003",
          "items": [{
            "metaType": "widget",
            "type": "@apostrophecms/rich-text",
            "_id": "rtid002",
            "content": "<h1>Build Something Great</h1><p>We help companies scale.</p>"
          }]
        }
      },
      {
        "metaType": "widget",
        "type": "button",
        "_id": "wid004",
        "linkText": "Get Started",
        "style": "primary",
        "isRedirect": true,
        "linkType": "custom",
        "linkUrl": "/contact",
        "linkTarget": ["_self"],
        "size": "regular",
        "weight": "bold"
      }
    ]
  },
  "two": {
    "metaType": "area",
    "_id": "aid004",
    "items": [
      {
        "metaType": "widget",
        "type": "image",
        "_id": "wid005",
        "_imageIds": ["image-piece-id"],
        "_imageFields": {}
      }
    ]
  }
}
```

### Example: `columns` widget (double column)
```json
{
  "metaType": "widget",
  "type": "columns",
  "_id": "wid010",
  "style": "contained",
  "cols": "double",
  "bgColor": "#ffffff",
  "animationEffects": "no-animation",
  "one": {
    "metaType": "area",
    "_id": "aid010",
    "items": [ /* left column widgets */ ]
  },
  "two": {
    "metaType": "area",
    "_id": "aid011",
    "items": [ /* right column widgets */ ]
  }
}
```

### Example: `side-by-side` widget
```json
{
  "metaType": "widget",
  "type": "side-by-side",
  "_id": "wid020",
  "style": "contained",
  "invert": false,
  "bgType": "bgColor",
  "bgColor": "#f9fafb",
  "stickyColumn": "none",
  "widgetClass": "",
  "widgetId": "",
  "animationEffects": "fade-up",
  "one": {
    "metaType": "area",
    "_id": "aid020",
    "items": [ /* text/content widgets */ ]
  },
  "two": {
    "metaType": "area",
    "_id": "aid021",
    "items": [ /* image widget */ ]
  }
}
```

### Example: `stats-card` widget
```json
{
  "metaType": "widget",
  "type": "stats-card",
  "_id": "wid030",
  "bgColor": "#f7faff",
  "animationEffects": "fade-up",
  "title": {
    "metaType": "area",
    "_id": "aid030",
    "items": [{
      "metaType": "widget",
      "type": "@apostrophecms/rich-text",
      "_id": "rtid030",
      "content": "<h2>Our Impact</h2>"
    }]
  },
  "stats": [
    {
      "_id": "stat001",
      "icon": "custom-svg",
      "customSvg": "<svg>...</svg>",
      "value": "10,000+",
      "valueColor": "#2850EB",
      "label": {
        "metaType": "area",
        "_id": "aid031",
        "items": [{
          "metaType": "widget",
          "type": "@apostrophecms/rich-text",
          "_id": "rtid031",
          "content": "<p>Users worldwide</p>"
        }]
      }
    }
  ]
}
```

### Example: `logo-grid` widget
```json
{
  "metaType": "widget",
  "type": "logo-grid",
  "_id": "wid040",
  "title": "Trusted By",
  "columns": "4",
  "gap": "medium",
  "imageStyle": "square",
  "showBorder": false,
  "bgColor": "#ffffff",
  "animationEffects": "no-animation",
  "logos": [
    {
      "_id": "logo001",
      "image": {
        "metaType": "area",
        "_id": "aid040",
        "items": [{
          "metaType": "widget",
          "type": "@apostrophecms/image",
          "_id": "wid041",
          "_imageIds": ["image-piece-id"],
          "_imageFields": {}
        }]
      },
      "altText": "Company Name",
      "link": "https://example.com",
      "linkTarget": "_blank"
    }
  ]
}
```

---

## Relationship Fields

Relationship fields store related document IDs. The naming convention:
- Schema field name: `_teamMembers` (with underscore prefix)
- Stored in MongoDB as: `_teamMembersIds` (array of aposDocId strings)
- Computed join result (not stored): `_teamMembers` (array of full doc objects)

```json
{
  "type": "team-member",
  "_id": "wid050",
  "style": "three-col",
  "_teamMembersIds": ["member-doc-id-1", "member-doc-id-2"],
  "_teamMembersFields": {}
}
```

**Important for seed scripts:**
1. Insert team-member pieces first
2. Capture their `aposDocId` values
3. Use those in widget's `_teamMembersIds`

---

## Image Handling

Images are stored as `@apostrophecms/image` pieces. To reference an image in a widget:

### Option A: Image widget (full widget)
```json
{
  "metaType": "widget",
  "type": "image",
  "_id": "wid-img",
  "_imageIds": ["image-apos-doc-id"],
  "_imageFields": {},
  "imageClass": ""
}
```

### Option B: Area with `@apostrophecms/image` widget
Used for `bannerImage`, `headerLogo`, `bg-img` type area fields:
```json
{
  "metaType": "area",
  "_id": "area-img",
  "items": [{
    "metaType": "widget",
    "type": "@apostrophecms/image",
    "_id": "core-img-widget-id",
    "_imageIds": ["image-apos-doc-id"],
    "_imageFields": {}
  }]
}
```

### Image piece document shape
```json
{
  "_id": "img001:en:published",
  "aposDocId": "img001",
  "type": "@apostrophecms/image",
  "title": "Hero background",
  "aposLocale": "en:published",
  "visibility": "public",
  "attachment": {
    "_id": "attachment-id",
    "extension": "jpg",
    "name": "hero-bg",
    "width": 1920,
    "height": 1080,
    "length": 245000,
    "md5": "abc123",
    "group": "images"
  }
}
```

> **For seed scripts without actual file uploads:** Use placeholder image IDs and upload images separately via the admin UI, or use the Apostrophe REST API to upload attachments first and get their IDs.

---

## Array Fields in MongoDB

Array fields (like `testimonial.testimonial`, `card.card`, `stats-card.stats`) store items as MongoDB arrays. Each item should have a unique `_id`:

```json
{
  "testimonial": [
    {
      "_id": "item001",
      "name": "Jane Doe",
      "designation": "CEO, Acme Corp",
      "bgColor": "#ffffff",
      "authorNameColor": "#000000",
      "position": "bottom",
      "ratings": 5,
      "starColor": "#FFD700",
      "comments": {
        "metaType": "area",
        "_id": "aid-comment-001",
        "items": [{
          "metaType": "widget",
          "type": "@apostrophecms/rich-text",
          "_id": "rt-comment-001",
          "content": "<p>Amazing product! Highly recommend.</p>"
        }]
      },
      "profile": {
        "metaType": "area",
        "_id": "aid-profile-001",
        "items": [{
          "metaType": "widget",
          "type": "simple-image",
          "_id": "wid-profile-001",
          "_imageIds": ["profile-image-id"],
          "_imageFields": {}
        }]
      }
    }
  ]
}
```

---

## Piece Document Shape

```json
{
  "_id": "piece-id:en:published",
  "aposDocId": "piece-id",
  "aposLocale": "en:published",
  "aposMode": "published",
  "metaType": "doc",
  "type": "blog",
  "title": "10 Ways to Improve UX",
  "slug": "10-ways-to-improve-ux",
  "visibility": "public",
  "published": true,
  "category": "UX",
  "blog_type": "article",
  "publishedDate": "2024-01-15",
  "readingTime": "5 min read",
  "authorName": "Jane Smith",
  "meta": "A guide to better user experiences",
  "bannerImage": { /* area with image */ },
  "summary": { /* area with rich-text */ },
  "content": { /* area with rich-text, image, video */ },
  "bottomSection": { /* area with any widgets */ }
}
```

---

## Global Settings Document Shape

```json
{
  "_id": "global:en:published",
  "aposDocId": "global",
  "aposLocale": "en:published",
  "aposMode": "published",
  "type": "@apostrophecms/global",
  "title": "Global",
  "slug": "global",
  "primaryColor": "#2850EB",
  "secondaryColor": "#000000",
  "headingFontFamily": "Lato",
  "bodyFontFamily": "Merriweather",
  "h1FontSize": "56px",
  "h1LineHeight": "64px",
  /* ... all other global fields ... */
  "headerLayout": "default",
  "headerBackgroundColor": "#ffffff",
  "headerTextColor": "#000000",
  "headerNav": [
    {
      "_id": "nav001",
      "linkText": "About",
      "linkType": "custom",
      "linkUrl": "/about",
      "linkTarget": []
    }
  ],
  "footerLayout": "default",
  "footerBackgroundColor": "#1a1a1a",
  "footerTextColor": "#ffffff",
  "social": [
    { "_id": "social001", "url": "https://twitter.com/company", "icon": "twitter" }
  ]
}
```

---

## MongoDB Seed Script Template

```js
// seed-page.js
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.APOS_MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'spotlight-cms-starter-app';

function aposId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length: 17}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function seed() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const docs = db.collection('aposDocs');

  const pageId = aposId();

  await docs.insertOne({
    _id: `${pageId}:en:published`,
    aposDocId: pageId,
    aposLocale: 'en:published',
    aposMode: 'published',
    metaType: 'doc',
    type: 'default-page',
    title: 'About Us',
    slug: '/about',
    visibility: 'public',
    published: true,
    orphan: false,
    level: 1,
    rank: 1,
    main: {
      metaType: 'area',
      _id: aposId(),
      items: [
        /* paste widget objects here */
      ]
    }
  });

  await client.close();
  console.log('Seeded successfully');
}

seed().catch(console.error);
```

---

## REST API Approach (alternative to direct MongoDB)

Apostrophe exposes a full REST API. This is safer than direct MongoDB writes as it runs through all server-side validation and event handlers.

### Authenticate
```
POST /api/v1/@apostrophecms/login/login
Content-Type: application/json
{ "username": "admin", "password": "adminpass" }
→ Returns: { "token": "session-token" }
```

### Create a page
```
POST /api/v1/@apostrophecms/page
Authorization: Bearer {token}
Content-Type: application/json
{
  "_targetId": "root-page-id",
  "_position": "lastChild",
  "title": "About Us",
  "type": "default-page",
  "main": { /* area object */ }
}
```

### Create a piece
```
POST /api/v1/blog
Authorization: Bearer {token}
Content-Type: application/json
{
  "title": "My Blog Post",
  "category": "UX",
  "publishedDate": "2024-01-15",
  "content": { /* area object */ }
}
```

### Upload an image
```
POST /api/v1/@apostrophecms/attachment/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
file: [binary file data]
→ Returns: { "_id": "attachment-id", ... }

Then POST to /api/v1/@apostrophecms/image with:
{ "title": "Image name", "attachment": { "_id": "attachment-id" } }
```

---

## HTML → Widget Mapping Cheat Sheet

| HTML pattern | Apostrophe widget | Key fields to set |
|---|---|---|
| Full-width hero with headline + CTA + image | `hero-banner` | `one` (rich-text + button), `two` (image), `bg-color` |
| Two-column text + image | `side-by-side` | `one` (rich-text), `two` (image), `invert`, `bgType` |
| 3-column feature cards | `columns` (cols=triple) or `card` | Each column or card array item |
| FAQ section | `accordion` | `groupTitle`, `accordions` array |
| Client logos | `logo-grid` | `logos` array, `columns`, `imageStyle` |
| Testimonials / reviews | `testimonial` | `testimonial` array items |
| Stats / numbers section | `stats-card` | `stats` array, `bgColor` |
| Team grid | `team-member` (widget) | `_teamMembersIds`, `style` |
| Pricing table | `pricing` | `cards` array |
| Feature comparison | `comparison-table` | `columns`, `rows` |
| Steps / process flow | `step-card-grid` | `cards` array, breakpoint cols |
| Icon + text list | `icon-bullet-list` | `items` array |
| Contact form | `custom-form` → `@apostrophecms/form` | Link to form piece |
| Map embed | `map` | `mapType`, `mapEmbedCode` or `address` |
| Video player | `video-upload` or `@apostrophecms/video` | `_videoIds` or `embedCode` |
| Image slider | `image-gallery` | `_imagesIds`, `displayType` |
| Single CTA block | `call-to-action` | `featureImage`, `content` (rich-text + button-strip) |
| Plain text/content | `rich-text` | `richText` area with `@apostrophecms/rich-text` |
| Single image | `image` | `_imageIds` |
| Single button | `button` | buttonSchema fields |
| Partner/enterprise logos | `enterprise` | `title`, `images` array |
| Product listing | `product` (widget) | `_menuItemsIds`, `style`, `currencySybmol` |
