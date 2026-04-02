# Monobank Acquiring Integration — Design Spec

**Date:** 2026-04-02  
**Status:** Approved

---

## Overview

Integrate Monobank acquiring payment widget (iframe mode) into the art website's preset pack purchase flow. Users click "Buy" on a preset page, complete payment inside an embedded Monobank iframe on a dedicated checkout page, then are redirected to a download page where they can download the preset files via a time-limited secure link.

---

## Architecture

### New files

| Path | Purpose |
|------|---------|
| `src/app/[lang]/checkout/page.tsx` | Checkout page: creates invoice server-side, renders Monobank iframe |
| `src/app/api/invoice/create/route.ts` | POST endpoint: calls Monobank `/api/merchant/invoice/create`, returns `{ pageUrl, invoiceId }` |
| `src/app/[lang]/download/page.tsx` | Download page: verifies payment status, issues HMAC token, shows download button with 15-min warning |
| `src/app/api/invoice/status/route.ts` | GET endpoint: proxies Monobank status check server-side (keeps token secret) |
| `src/app/api/download/route.ts` | GET endpoint: verifies HMAC token + expiry, streams preset file from `private/presets/` |
| `private/presets/warm-editorial.zip` | Warm Editorial preset files (provided by user) |
| `private/presets/cool-film.zip` | Cool Film preset files (provided by user) |

### Modified files

| Path | Change |
|------|--------|
| `src/lib/presets.ts` | Add `priceKopecks: 49900` field, remove `buyUrl` placeholder |
| `src/app/[lang]/presets/[slug]/page.tsx` | Buy button links to `/[lang]/checkout?preset={slug}` |
| `src/app/[lang]/dictionaries.ts` | Add checkout and download i18n strings |

---

## Data Flow

```
User clicks "Buy" on /[lang]/presets/warm-editorial
  ↓
Navigate to /[lang]/checkout?preset=warm-editorial
  ↓
Client: POST /api/invoice/create
  - body: { amount: 49900, preset: "warm-editorial", lang }
  - calls Monobank POST /api/merchant/invoice/create with displayType: "iframe"
    redirectUrl: "${NEXT_PUBLIC_BASE_URL}/{lang}/download?preset={slug}"
  - returns { pageUrl, invoiceId }
  ↓
Client stores invoiceId in sessionStorage (key: "mono_invoice_id")
Checkout page renders <iframe src={pageUrl} allow="payment *" width="576" height="576" />
  ↓
User completes payment in iframe
  ↓
Monobank redirects browser to /[lang]/download?preset={slug}
  ↓
Download page (server component):
  - Reads preset from URL params, invoiceId from sessionStorage (client-side step before server verify)
  - Calls GET /api/invoice/status?invoiceId={id} (server route → Monobank status API)
  - Confirms status === "success"
  - Generates HMAC token: HMAC-SHA256(secret, `${invoiceId}:${preset}:${expiresAt}`)
  - Passes token + expiresAt to client
  ↓
Client shows "Download" button + "⚠ This link is valid for 15 minutes only"
  ↓
GET /api/download?token={token}&preset={slug}&expires={expiresAt}
  - Verifies HMAC signature
  - Checks expiresAt > now
  - Streams file from private/presets/{slug}.zip
```

---

## Invoice Creation

**Endpoint:** `POST https://api.monobank.ua/api/merchant/invoice/create`

**Headers:**
- `X-Token: {MONOBANK_TOKEN}`
- `Content-Type: application/json`

**Body:**
```json
{
  "amount": 49900,
  "ccy": 980,
  "merchantPaymInfo": {
    "reference": "{preset-slug}",
    "destination": "Preset pack purchase"
  },
  "displayType": "iframe",
  "redirectUrl": "{NEXT_PUBLIC_BASE_URL}/{lang}/download?preset={slug}"
}
```

> Note: `invoiceId` is returned in Monobank's response body. The `redirectUrl` does NOT contain invoiceId (it's not known at request time). The client stores it in `sessionStorage` after the create call and reads it on the download page.

---

## Security

### Token protection
- `MONOBANK_TOKEN` used only in server-side API routes, never in client bundles
- `DOWNLOAD_SECRET` used only in server-side API routes for HMAC signing

### Download link security
- Download URL contains a signed HMAC token: `HMAC-SHA256(DOWNLOAD_SECRET, "${invoiceId}:${preset}:${expiresAt}")`
- Token expires after 15 minutes from generation
- `/api/download` verifies both the HMAC signature and expiry on every request
- Files stored in `private/presets/` — outside `/public`, not statically served

### Invoice ID
- Monobank invoice IDs are UUIDs (128-bit random) — not guessable or enumerable

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invoice creation fails (API error) | Checkout page shows error message, no iframe rendered |
| Payment status not `success` | Download page shows "Payment not confirmed" + link back to presets |
| HMAC token invalid or tampered | `/api/download` returns 403 |
| HMAC token expired | `/api/download` returns 403; download page shows "Link expired" message |
| Preset file missing | `/api/download` returns 404 |

---

## Environment Variables

```
MONOBANK_TOKEN=<merchant api token>
MONOBANK_BASE_URL=https://api.monobank.ua
DOWNLOAD_SECRET=<random 32+ character string>
NEXT_PUBLIC_BASE_URL=https://yoursite.com
```

---

## Preset Prices

Both packs: **499 UAH (49900 kopecks)**, currency code `980` (UAH).

---

## UI Notes

- Iframe minimum dimensions: 576×576px, `border-radius: 24px`, `allow="payment *"`
- Container: flexbox centered
- Download page must prominently display: **"This download link is valid for 15 minutes only"**
- Download page shown in correct locale (`[lang]` prefix respected)

---

## Out of Scope

- Webhook endpoint (not needed for Approach A — redirect-based verification)
- Email delivery of preset files
- Multiple currency support
- Refund flow
