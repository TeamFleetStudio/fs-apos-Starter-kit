# Global Settings — `@apostrophecms/global`

> The global settings document is a **singleton** stored in `aposDocs` with `type: "@apostrophecms/global"`. It controls site-wide brand, typography, header, footer, custom code, and per-piece-type sidebar content. Changes here affect every page template.

---

## MongoDB Document Shape

```json
{
  "type": "@apostrophecms/global",
  "title": "Global",
  "slug": "global",
  ...fieldValues
}
```

---

## Field Groups

### Brand
| Field | Type | Default | Description |
|---|---|---|---|
| `title` | string (required) | — | Site name |
| `logo` | area (image only) | — | Site logo image |
| `primaryColor` | color | `#000000` | Primary brand color, available as CSS var |
| `secondaryColor` | color | `#2850EB` | Secondary brand color |
| `headingFontFamily` | string | `"Lato"` | Google Font / system font for headings |
| `bodyFontFamily` | string | `"Merriweather"` | Google Font / system font for body |
| `skipLinkTextColor` | color | — | Accessibility skip-link text color |
| `skipLinkBgColor` | color | — | Accessibility skip-link background |

---

### Typography — Headings
Each heading level (h1–h6) has two fields:

| Pattern | Type | Default |
|---|---|---|
| `h1FontSize` | string | `"56px"` |
| `h1LineHeight` | string | `"64px"` |
| `h2FontSize` | string | `"48px"` |
| `h2LineHeight` | string | `"56px"` |
| `h3FontSize` | string | `"36px"` |
| `h3LineHeight` | string | `"44px"` |
| `h4FontSize` | string | `"28px"` |
| `h4LineHeight` | string | `"36px"` |
| `h5FontSize` | string | `"22px"` |
| `h5LineHeight` | string | `"30px"` |
| `h6FontSize` | string | `"18px"` |
| `h6LineHeight` | string | `"26px"` |

---

### Typography — Body
| Field | Type | Default | Description |
|---|---|---|---|
| `pFontSize` | string | `"16px"` | Default paragraph size |
| `pLineHeight` | string | `"24px"` | |
| `p1FontSize` | string | `"18px"` | Large body |
| `p1LineHeight` | string | `"28px"` | |
| `p2FontSize` | string | `"14px"` | Small body |
| `p2LineHeight` | string | `"20px"` | |
| `p3FontSize` | string | `"12px"` | Caption |
| `p3LineHeight` | string | `"16px"` | |
| `hrColor` | color | `#e5e7eb` | `<hr>` color |
| `hrHeight` | string | `"1px"` | `<hr>` thickness |

---

### Header
| Field | Type | Notes |
|---|---|---|
| `headerLayout` | select | `"default"` / `"header-layout-1"` / `"header-layout-2"` |
| `headerLogo` | area (image) | Logo shown in header |
| `headerNav` | array of link items | Shown when layout = `default` or `header-layout-1` |
| `headerNavLayout2` | array of navLink items | Shown when layout = `header-layout-2`; supports dropdown submenus |
| `headerBtns` | array of button items | Shown when layout = `default` or `header-layout-2` |
| `headerBackgroundColor` | color | Header background |
| `headerTextColor` | color | Header text / link color |
| `headerButtonSpacing` | integer (range 0–50) | Gap between header buttons in px; default `16` |
| `headerCustomClassName` | string | Extra CSS class on header element |
| `headerCustomId` | string | Custom `id` on header element |

**`headerNav` item fields** (from `linkSchema`):
`linkText`, `linkType` (page/file/custom), `_linkPage` (relationship), `_linkFile` (relationship), `linkUrl` (url), `linkTarget` (checkboxes: `_blank`), `ariaLabel`

**`headerNavLayout2` item fields** (from `navLinkSchema`) — extends linkSchema with:
`hasDropdown` (boolean), `submenuItems` (array: `submenuLinkText`, `submenuLinkType`, `_submenuLinkPage`, `_submenuLinkFile`, `submenuLinkUrl`, `submenuLinkTarget`, `submenuAriaLabel`)

**`headerBtns` item fields** — full buttonSchema (see `03_WIDGETS.md` → Button Fields Reference)

---

### Footer

**`footerLayout`** select: `"default"` / `"footer-layout-1"` / `"footer-layout-2"`

#### Footer — default layout
| Field | Type | Notes |
|---|---|---|
| `footerNav` | array of link items | Same shape as `headerNav` |
| `footerBtns` | array of button items | Same shape as `headerBtns` |
| `footerBackgroundColor` | color | |
| `footerTextColor` | color | |
| `footerButtonSpacing` | integer (range 0–50) | Default `16` |
| `footerCustomClassName` | string | |
| `footerCustomId` | string | |
| `social` | array (max 5) | Each item: `url` (string) + `icon` (select: `instagram`/`facebook`/`twitter`/`linkedin`) |

#### Footer — footer-layout-1
| Field | Type | Notes |
|---|---|---|
| `footerBgImg` | area (image) | Background image |
| `footerDescription` | string | Short tagline |
| `footerPrimaryNavigation` | array | Each item: `title` (string) + `navItems` (array of link items) |
| `footerSourceForgeScript` | codeEditor | HTML/JS embed (e.g. SourceForge badge) |
| `footerSocial` | array | Each item: `title` + `icon` (area: image) + `link` (url) |

#### Footer — footer-layout-2
| Field | Type | Notes |
|---|---|---|
| `footerNavigationColumns` | array | Each column has up to 3 sections; each section has `navItems` array |
| `footerPoweredByLogo` | area (image) | "Powered by" logo |
| `footerPoweredByText` | string | Text next to powered-by logo |
| `footerLegalLinks` | array of link items | Privacy, Terms, etc. |
| `footerCopyrightText` | string | © notice |

**Shared footer field (all layouts):**
`footerLogo` (area, image only)

---

### Custom Code
| Field | Type | Description |
|---|---|---|
| `customCSS` | codeEditor (CSS) | Injected into `<head>` |
| `customJavaScriptHead` | codeEditor (JS) | Injected into `<head>` before `</head>` |
| `customJavaScript` | codeEditor (JS) | Injected before `</body>` |

---

### Piece-Type Sidebar Slots
These areas appear in the sidebar/bottom of piece detail pages:

| Field | Widget Groups | Shown on |
|---|---|---|
| `blogTopRightSection` | fullExpandedGroup | Blog post detail — right column top |
| `blogBottomSection` | fullExpandedGroup | Blog post detail — below content |
| `whitepaperBottomSection` | fullExpandedGroup | Whitepaper detail — below content |
| `podcastBottomSection` | fullExpandedGroup | Podcast detail — below content |

---

### Payment Modal (Razorpay)
| Field | Type | Notes |
|---|---|---|
| `paymentModalTitle` | string | Modal heading |
| `paymentModalSubtitle` | string | Modal subheading |
| `paymentModalBody` | area | Richtext / widgets above payment button |
| `paymentModalButtonLabel` | string | CTA button text |
| `paymentModalButtonBgColor` | color | |
| `paymentModalButtonTextColor` | color | |
| `paymentModalBgColor` | color | |
| `paymentModalTextColor` | color | |
| `razorpayMode` | select | `"button"` (embed script) or `"checkout"` (JS SDK) |
| `razorpayButtonId` | string | If mode = button |
| `razorpayKeyId` | string | If mode = checkout |
| `razorpayAmount` | string | In smallest currency unit |
| `razorpayCurrency` | string | e.g. `"INR"` |
| `razorpayCompanyName` | string | |
| `razorpayDescription` | string | |
| `razorpaySuccessUrl` | string | Redirect after payment |

---

## CSS Variables Generated from Global Settings

The template generates CSS custom properties from global field values, available everywhere:

```css
:root {
  --primary-color: /* primaryColor */;
  --secondary-color: /* secondaryColor */;
  --heading-font: /* headingFontFamily */;
  --body-font: /* bodyFontFamily */;
  --h1-size: /* h1FontSize */;
  /* ...all heading/body font sizes and line heights */
}
```
