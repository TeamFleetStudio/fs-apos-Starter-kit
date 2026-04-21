# Form Module — Schema & Integration Reference

> The project uses `@apostrophecms/form` (a first-party Apostrophe plugin) with a heavily customised override in `modules/@apostrophecms/form/index.js`. Forms are embedded on pages via the `custom-form` widget.

---

## Form Widget Embedding

Forms are embedded using the `custom-form` widget (see `03_WIDGETS.md`). The widget wraps the form with optional background/layout styling and includes a `form` area (max 1 form widget).

---

## Form Module Configuration

```js
// modules/@apostrophecms/form/index.js
{
  classPrefix: 'my-form',        // CSS class prefix on form elements
  recaptcha: {
    siteKey: process.env.APOS_RECAPTCHA_SITE_KEY,
    secretKey: process.env.APOS_RECAPTCHA_SECRET_KEY,
    threshold: 0.5               // reCAPTCHA v3 score threshold
  }
}
```

---

## Form Field Types Available in the Form Builder

When an editor creates a form (`@apostrophecms/form` piece), they can add these field widgets:

| Widget type | Description |
|---|---|
| `@apostrophecms/form-text-field` | Single-line text input |
| `@apostrophecms/form-textarea-field` | Multi-line textarea |
| `@apostrophecms/form-boolean-field` | Checkbox (yes/no) |
| `@apostrophecms/form-select-field` | Dropdown select |
| `@apostrophecms/form-radio-field` | Radio button group |
| `@apostrophecms/form-checkboxes-field` | Multiple checkboxes |
| `@apostrophecms/form-phone-field` | Phone number input (intl-tel-input) |
| `@apostrophecms/form-conditional` | Show/hide groups of fields based on another field's value |
| `@apostrophecms/rich-text` | Rich text content between form fields |

---

## Form Schema — Custom Fields Added

These fields are added to every `@apostrophecms/form` piece (beyond the default title/fields area):

| Field | Type | Notes |
|---|---|---|
| `subscription` | boolean | If true, show email field for newsletter opt-in |
| `emailSubscriptionField` | string | Field name in form that holds the email to subscribe |
| `linkUrl` | string | Redirect URL after successful submission |
| `thankYouBody` | area | Thank-you message shown after submission (rich-text + widgets) |

---

## Form Integrations Object (`formIntegrations`)

This is a nested **object** field on each form piece. It groups all integration settings.

### Save to Piece
| Sub-field | Type | Notes |
|---|---|---|
| `saveToPieceType` | string | Module name of a piece type to save submission as a new piece (e.g. `"contact-us-form"`) |

### Slack Notification
| Sub-field | Type | Notes |
|---|---|---|
| `slack` | boolean | Enable Slack posting |
| `slackWebhookUrl` | string | Incoming webhook URL |
| `slackMessageTemplate` | textarea | Message body; use `{{fieldName}}` to interpolate form field values |

### Email Notification
| Sub-field | Type | Notes |
|---|---|---|
| `emailNotification` | boolean | Enable email sending |
| `emailRecipients` | array | Each item: email address string |
| `emailSubject` | string | Email subject line |

### External API
| Sub-field | Type | Notes |
|---|---|---|
| `externalApi` | boolean | Enable API call on submission |
| `externalApiUrl` | string | Target URL |
| `externalApiMethod` | select | `POST` / `PUT` / `PATCH` |
| `externalApiFieldMapping` | array | Each item: `formField` (form field name) + `apiField` (API body key) + `defaultValue` |
| `externalApiStaticFields` | array | Each item: `key` + `value` (static key-value pairs always sent) |

### Payment (Razorpay)
| Sub-field | Type | Notes |
|---|---|---|
| `triggerPaymentModal` | boolean | Open Razorpay payment modal after form submit |
| `paymentVerifyUrl` | string | Lambda/API endpoint to verify payment signature |
| `pocketbaseSync` | boolean | Sync submission to PocketBase after payment |
| `pocketbaseBaseUrl` | string | PocketBase instance URL |
| `pocketbaseCollection` | string | Collection name |
| `pocketbaseMatchEmailField` | string | Form field name containing email (used to look up existing record) |
| `pocketbaseMatchPhoneField` | string | Form field name containing phone |

### Interakt WhatsApp
| Sub-field | Type | Notes |
|---|---|---|
| `interaktNotify` | boolean | Send WhatsApp notification via Interakt |
| `interaktApiKey` | string | Interakt API key |
| `interaktTemplateName` | string | WhatsApp template name |
| `interaktTemplateLanguage` | string | e.g. `"en"` |
| `interaktNameField` | string | Form field name for recipient's name |
| `interaktPhoneField` | string | Form field name for recipient's phone |
| `interaktBodyValues` | array | Each item: a value or `pb:field_name` to resolve from PocketBase record |

### Brevo CRM
| Sub-field | Type | Notes |
|---|---|---|
| `brevoSync` | boolean | Sync contact to Brevo |
| `brevoApiKey` | string | Brevo API key |
| `brevoFormType` | select | `event` / `hire` / `rad` / `ebook` / `institution` / `corporate` |
| `brevoListId` | string | Brevo list ID to add contact to |
| `brevoFieldMapping` | array | Each item: `brevoAttribute` (Brevo field name) + `sourceValue` (form field value or static) |

---

## Submission Flow

```
User submits form
  → reCAPTCHA v3 validation (threshold 0.5)
  → Save to piece (saveToPieceType) if configured
  → Email notification if configured
  → External API call if configured
  → [if triggerPaymentModal] → Open Razorpay modal
    → Payment verified at paymentVerifyUrl
    → PocketBase sync if configured
    → Interakt WhatsApp if configured
    → Brevo CRM sync if configured
  → Redirect to linkUrl or show thankYouBody
```

---

## Custom API Route

```
POST /api/v1/@apostrophecms/form/verify-payment
```
This route is CSRF-excepted and is used by the Razorpay payment flow to verify payment signatures server-side.

---

## Legacy Form Submission Pieces

For backwards compatibility, three legacy form piece types store submissions:

| Piece type | Form slug match | Stored fields |
|---|---|---|
| `contact-us-form` | Forms with slug `contact-us-form` | firstName, lastName, email, phoneNumber, company, jobTitle |
| `footer-form` | Forms with slug `footer-form` | email |
| `whitepaper-form` | Forms with slug `whitepaper-form` | firstName, lastName, email, jobTitle |

These are autopublished (`published: true` automatically) and hidden from the "create" UI.

---

## Using Forms in Seed Data

When creating a page that contains a form widget, the form piece must already exist in the database. Reference it in the `custom-form` widget's `form` area:

```json
{
  "type": "custom-form",
  "_id": "widget-id",
  "metaType": "widget",
  "layout": "column",
  "fontColor": "black",
  "form": {
    "metaType": "area",
    "_id": "area-id",
    "items": [{
      "metaType": "widget",
      "type": "@apostrophecms/form",
      "_id": "form-widget-id",
      "_formId": "THE-FORM-PIECE-ID"
    }]
  }
}
```

The `_formId` field must contain the `_id` of an existing `@apostrophecms/form` piece.

---

## Environment Variables Required

```env
APOS_RECAPTCHA_SITE_KEY=     # reCAPTCHA v3 site key
APOS_RECAPTCHA_SECRET_KEY=   # reCAPTCHA v3 secret key
```

Integration-specific vars (set at runtime, not in code):
- Slack: configured per-form via admin UI (webhook URL stored in piece)
- Email: uses `nodemailer`, transport configured in server env
- Razorpay: key stored in global settings (`razorpayKeyId`)
- PocketBase / Interakt / Brevo: API keys stored per-form via admin UI
