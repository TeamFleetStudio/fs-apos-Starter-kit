# Piece Types — Complete Schema Reference

> Pieces are standalone content documents stored in `aposDocs`. They are managed in the admin bar and referenced by pages and widgets via `relationship` fields. Each piece has a REST API at `/api/v1/{module-name}`.

---

## MongoDB Document Shape (all pieces)

```json
{
  "_id": "unique-id",
  "type": "blog",
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "visibility": "public",
  "published": true,
  "aposLocale": "en:published",
  ...fieldValues
}
```

---

## `blog`
**Purpose:** Blog/article posts. Supports filtering by category and type (podcast/article).

**Module:** `blog`
**perPage:** 10 | **Sort:** `publishedDate: -1`
**Admin shortcut:** none

### Fields
| Field | Type | Values / Notes |
|---|---|---|
| `category` | select | `All` / `Creative` / `UX` / `Development` / `Compliance` / `Accessibility` / `How-To` |
| `blog_type` | select | `podcast` / `article` |
| `meta` | string | Short meta/subtitle text |
| `summary` | area (rich-text only) | Short excerpt shown in listings |
| `content` | area (rich-text, image, video-upload, @apostrophecms/video) | Full article body |
| `bannerImage` | area (image only) | Hero/featured image |
| `metaTitle` | string | SEO title override |
| `metaDescription` | string | SEO description override |
| `authorName` | string | Author display name |
| `authorPhoto` | area (image) | Author profile photo |
| `podcastEmbed` | codeEditor | Embed code for podcast player (if blog_type=podcast) |
| `publishedDate` | date | Publication date for sorting/display |
| `readingTime` | string | e.g. `"5 min read"` |
| `bottomSection` | area (fullExpandedGroup) | Content below article — CTAs, related posts widgets, etc. |

### URL Pattern
`/blog/{slug}` — listing at `/blog`

### Filterable via query strings on blog-page:
- `?category=UX` — filter by category
- `?blog_type=podcast` — filter by type
- `?search=keyword` — full-text search

---

## `media`
**Purpose:** Press mentions, news links, or external media articles.

**Module:** `media`
**perPage:** 9 | **Sort:** `createdAt: -1`

### Fields
| Field | Type | Notes |
|---|---|---|
| `shortDescription` | string | Short excerpt |
| `bannerImage` | area (image only) | Featured image |
| `metaTitle` | string | SEO title |
| `url` | string | External article/post URL (links out) |

### URL Pattern
`/media` (listing only — detail page links to `url`)

---

## `whitepaper`
**Purpose:** Downloadable guides/whitepapers, often gated behind a form.

**Module:** `whitepaper`
**perPage:** 9 | **Sort:** `createdAt: -1`

### Fields
| Field | Type | Notes |
|---|---|---|
| `meta` | string | Short subtitle |
| `content` | area (richText + image + custom-form) | Body — typically includes the download form |
| `bannerImage` | area (image) | Cover image |
| `metaTitle` | string | SEO title |
| `metaDescription` | string | SEO description |
| `bottomSection` | area (fullExpandedGroup) | Below-content CTA area |

### URL Pattern
`/whitepaper/{slug}`

---

## `review` (Podcast)
**Purpose:** Podcast episodes. Internal label is "Podcast".

**Module:** `review`
**perPage:** 9 | **Sort:** `createdAt: -1`
**Admin shortcut:** `g,c`

### Fields
| Field | Type | Notes |
|---|---|---|
| `author` | string (required) | Guest/host name |
| `role` | string | Guest role/title |
| `description` | textarea | Episode description |
| `featuredImage` | area (image, max 1) | Thumbnail |
| `content` | area (video-upload, @apostrophecms/video, rich-text, image, image-card) | Episode content |
| `profileImage` | area (image) | Host/guest profile |
| `duration` | string | e.g. `"42:15"` |
| `externalUrl` | string | Spotify/Apple Podcasts link |
| `metaTitle` | string | SEO title |
| `bottomSection` | area (fullExpandedGroup) | Below-content area |

### URL Pattern
`/podcasts/{slug}`

---

## `product-digest`
**Purpose:** Product updates, release digests, changelogs.

**Module:** `product-digest`
**perPage:** 9 | **Sort:** `createdAt: -1`
**Admin shortcut:** `g,d`

### Fields
| Field | Type | Notes |
|---|---|---|
| `shortDescription` | string | Short excerpt |
| `content` | area (richText + video-upload) | Full digest content |
| `bannerImage` | area (image) | Cover image |
| `metaTitle` | string | SEO title |
| `metaDescription` | string | SEO description |

### URL Pattern
`/product-digest/{slug}`

---

## `team-member`
**Purpose:** Staff/team member profiles. Referenced by the `team-member` widget.

**Module:** `team-member`
**openGraph:** disabled | **SEO fields:** disabled
**No piece-page** (not publicly browsable as individual pages)

### Fields
| Field | Type | Notes |
|---|---|---|
| `title` | string (required) | Full name |
| `profileImage` | area (image, max 1) | Profile photo |
| `workTitle` | string | Job title/position |

### Referenced by widget
The `team-member` widget uses `_teamMembers` (relationship) to select which team members to display.

---

## `product`
**Purpose:** Simple product catalogue items with price. Referenced by the `product` widget.

**Module:** `product`
**openGraph:** disabled | **SEO fields:** disabled
**Admin shortcut:** `g,o`

### Fields
| Field | Type | Notes |
|---|---|---|
| `title` | string | Product name |
| `description` | string | Short description |
| `price` | float (min: 0.01, required) | Price value (display controlled by widget's `currencySybmol`) |

### Referenced by widget
The `product` widget uses `_menuItems` (relationship) to select products to display.

---

## `video-upload`
**Purpose:** Uploaded video files (mp4/webm/mov/avi). Referenced by the `video-upload` widget.

**Module:** `video-upload`
**openGraph:** disabled | **SEO fields:** disabled

### Fields
| Field | Type | Notes |
|---|---|---|
| `title` | string (required) | Video title |
| `Thumbnail` | area (image, max 1) | Poster/thumbnail image |
| `video` | attachment (fileGroup: video) | The actual uploaded video file |
| `VideoClassName` | string | CSS class |
| `VideoID` | string | Custom ID |

### Accepted video formats
`mp4`, `webm`, `mov`, `avi`

### Referenced by widget
The `video-upload` widget uses `_video` (relationship) to select the video to play.

---

## Form Submission Pieces

These are **autopublished** pieces used to store form submission data. They cannot be created manually (`showCreate: false`).

### `contact-us-form`
| Field | Required | Type |
|---|---|---|
| `title` | — | string |
| `firstName` | ✓ | string |
| `lastName` | ✓ | string |
| `email` | ✓ | string |
| `phoneNumber` | ✓ | string |
| `company` | ✓ | string |
| `jobTitle` | — | string |

### `footer-form`
| Field | Required | Type |
|---|---|---|
| `title` | ✓ | string |
| `email` | ✓ | string |

### `whitepaper-form`
| Field | Required | Type |
|---|---|---|
| `title` | — | string |
| `firstName` | ✓ | string |
| `lastName` | ✓ | string |
| `email` | ✓ | string |
| `jobTitle` | — | string |

---

## Piece REST API Patterns

### List pieces
```
GET /api/v1/{module-name}?page=1&perPage=10&aposMode=published
```

### Get single piece
```
GET /api/v1/{module-name}/{id}
```

### Create piece (requires auth)
```
POST /api/v1/{module-name}
Content-Type: application/json
{
  "title": "My Post",
  "category": "UX",
  "publishedDate": "2024-01-15",
  ...
}
```

### Relationship field format in MongoDB
When a widget or piece references another document via a `relationship` field, the stored format is:
```json
{
  "_teamMembersIds": ["aposDocId1", "aposDocId2"],
  "_teamMembersFields": {}
}
```
The `_teamMembers` field (with underscore prefix) is **computed at query time** — only the `_teamMembersIds` array is stored.

For seed scripts, resolve piece titles → `_id` values first, then populate the `*Ids` arrays.
