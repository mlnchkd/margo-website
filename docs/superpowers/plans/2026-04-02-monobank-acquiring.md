# Monobank Acquiring Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Monobank acquiring iframe payment into the preset purchase flow, with a secure 15-minute HMAC-signed download link after payment.

**Architecture:** Checkout page (server + client) creates a Monobank invoice server-side, embeds the iframe, stores `invoiceId` in `sessionStorage`. After payment, Monobank redirects to a download page that verifies payment server-side, generates a 15-minute HMAC token, and serves the preset file via a protected API route.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Node.js `crypto` module (built-in), Monobank Acquiring API.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `private/presets/README.md` | Placeholder — user drops zip files here |
| Modify | `src/lib/presets.ts` | Add `priceKopecks`, `priceDisplay`, `fileBasename`; remove `buyUrl` |
| Modify | `src/dictionaries/en.json` | Add `checkout` and `download` translation keys |
| Modify | `src/dictionaries/uk.json` | Add `checkout` and `download` translation keys |
| Create | `src/app/api/invoice/create/route.ts` | POST: create Monobank invoice, return `{ pageUrl, invoiceId }` |
| Create | `src/app/api/invoice/verify/route.ts` | POST: verify payment status + generate HMAC download token |
| Create | `src/app/api/download/route.ts` | GET: verify HMAC token + stream preset file |
| Create | `src/app/[lang]/checkout/page.tsx` | Server wrapper: validates preset, passes dict to client |
| Create | `src/app/[lang]/checkout/CheckoutClient.tsx` | Client: fetches invoice, stores invoiceId, renders iframe |
| Create | `src/app/[lang]/checkout/checkout.module.css` | Checkout page styles |
| Create | `src/app/[lang]/download/page.tsx` | Server wrapper: validates preset, passes dict to client |
| Create | `src/app/[lang]/download/DownloadClient.tsx` | Client: reads sessionStorage, calls verify, shows download button |
| Create | `src/app/[lang]/download/download.module.css` | Download page styles |
| Modify | `src/app/[lang]/presets/[slug]/page.tsx` | Change buy buttons from `<a href={buyUrl}>` to `<Link href=/checkout>` |

---

## Task 1: Environment Setup

**Files:**
- Create: `.env.local`
- Create: `private/presets/README.md`

- [ ] **Step 1: Create `.env.local`**

```bash
cat > /path/to/project/.env.local << 'EOF'
MONOBANK_TOKEN=u0oSFTRb2KerQlQXrK58XLyRCptRLUnUZzGc_AsWCu5o
MONOBANK_BASE_URL=https://api.monobank.ua
DOWNLOAD_SECRET=replace_with_32_plus_random_chars_generated_below
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF
```

Generate a `DOWNLOAD_SECRET` value:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as the `DOWNLOAD_SECRET` value in `.env.local`.

- [ ] **Step 2: Create `private/presets/` directory with placeholder README**

```bash
mkdir -p private/presets
```

Create `private/presets/README.md`:

```markdown
# Preset Files

Drop your preset zip files here before deploying.

Expected files:
- `warm-editorial.zip`
- `cool-film.zip`

These files are served via `/api/download` after payment verification.
This directory is NOT served statically — files are only accessible through the protected API route.
```

- [ ] **Step 3: Verify `.env.local` is gitignored**

Run:
```bash
cat .gitignore | grep env
```

Expected output should include `.env.local`. If it doesn't, add it:
```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 4: Commit**

```bash
git add private/presets/README.md .gitignore
git commit -m "chore: add private/presets directory and env setup"
```

---

## Task 2: Update `src/lib/presets.ts`

**Files:**
- Modify: `src/lib/presets.ts`

- [ ] **Step 1: Replace the file content**

```typescript
export type PresetPair = {
  index: number;
};

export type PresetPack = {
  slug: string;
  title: string;
  priceKopecks: number;
  priceDisplay: string;
  fileBasename: string;
  pairCount: number;
};

export const presetPacks: PresetPack[] = [
  {
    slug: "warm-editorial",
    title: "Warm Editorial",
    priceKopecks: 49900,
    priceDisplay: "499 ₴",
    fileBasename: "warm-editorial.zip",
    pairCount: 10,
  },
  {
    slug: "cool-film",
    title: "Cool Film",
    priceKopecks: 49900,
    priceDisplay: "499 ₴",
    fileBasename: "margophotoo-cool-film.zip",
    pairCount: 12,
  },
];

export function getPresetPackBySlug(slug: string): PresetPack | undefined {
  return presetPacks.find((pack) => pack.slug === slug);
}

export function getPresetPairImageUrl(
  packSlug: string,
  pairIndex: number,
  side: "before" | "after",
  width: number,
  height: number,
): string {
  return `https://picsum.photos/seed/${packSlug}-${side}-${pairIndex}/${width}/${height}`;
}

export function getPresetPairs(pack: PresetPack): PresetPair[] {
  return Array.from({ length: pack.pairCount }, (_, index) => ({ index }));
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If errors mention `buyUrl` it means `page.tsx` still references it — that gets fixed in Task 9.

- [ ] **Step 3: Commit**

```bash
git add src/lib/presets.ts
git commit -m "feat: update PresetPack type with priceKopecks and fileBasename"
```

---

## Task 3: Update Dictionaries

**Files:**
- Modify: `src/dictionaries/en.json`
- Modify: `src/dictionaries/uk.json`

- [ ] **Step 1: Update `src/dictionaries/en.json`**

Replace the file with:

```json
{
  "nav": {
    "overview": "Overview",
    "presets": "Presets",
    "about": "About"
  },
  "presets": {
    "section_label": "Presets",
    "back": "← All preset packs",
    "buy": "Buy",
    "before": "Before",
    "after": "After"
  },
  "about": {
    "heading": "About",
    "bio1": "This portfolio presents editorial and portrait photography projects with a focus on story, composition, and natural light.",
    "bio2": "For commissions and collaborations, please reach out through the contact channels below.",
    "contact_heading": "Contact",
    "cta": "LET'S WORK\nTOGETHER"
  },
  "ticker": "ALL PRESETS MADE WITH LOVE. ",
  "checkout": {
    "loading": "Loading payment form…",
    "error": "Payment form could not be loaded. Please try again.",
    "back": "← Back"
  },
  "download": {
    "verifying": "Verifying your payment…",
    "error_payment": "Payment not confirmed. Please complete your purchase first.",
    "error_generic": "Something went wrong. Please try again.",
    "ready_title": "Your preset pack is ready!",
    "warning": "This download link is valid for 15 minutes only.",
    "download_button": "Download Presets",
    "back": "← All presets",
    "expired": "Your download link has expired. Please go back and download again."
  }
}
```

- [ ] **Step 2: Update `src/dictionaries/uk.json`**

Replace the file with:

```json
{
  "nav": {
    "overview": "Огляд",
    "presets": "Пресети",
    "about": "Про мене"
  },
  "presets": {
    "section_label": "Пресети",
    "back": "← Всі пресети",
    "buy": "Придбати пресети",
    "before": "До",
    "after": "Після"
  },
  "about": {
    "heading": "Про мене",
    "bio1": "Це портфоліо представляє редакційні та портретні фотопроєкти з акцентом на розповідь, композицію та природне світло.",
    "bio2": "Для замовлень та співпраці, будь ласка, зв'яжіться через контакти нижче.",
    "contact_heading": "Контакти",
    "cta": "ДАВАЙТЕ ПРАЦЮВАТИ\nРАЗОМ"
  },
  "ticker": "ВСІ ПРЕСЕТИ ЗРОБЛЕНІ З ЛЮБОВ'Ю. ",
  "checkout": {
    "loading": "Завантаження форми оплати…",
    "error": "Форму оплати не вдалося завантажити. Спробуйте ще раз.",
    "back": "← Назад"
  },
  "download": {
    "verifying": "Перевірка оплати…",
    "error_payment": "Оплату не підтверджено. Будь ласка, спочатку завершіть покупку.",
    "error_generic": "Щось пішло не так. Спробуйте ще раз.",
    "ready_title": "Ваш набір пресетів готовий!",
    "warning": "Це посилання для завантаження дійсне лише 15 хвилин.",
    "download_button": "Завантажити пресети",
    "back": "← Всі пресети",
    "expired": "Посилання для завантаження застаріло. Поверніться та завантажте знову."
  }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/dictionaries/en.json src/dictionaries/uk.json
git commit -m "feat: add checkout and download i18n strings"
```

---

## Task 4: Create Invoice Create API Route

**Files:**
- Create: `src/app/api/invoice/create/route.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/app/api/invoice/create
```

Create `src/app/api/invoice/create/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { presetPacks } from "@/lib/presets";

export async function POST(req: NextRequest) {
  const { preset, lang } = await req.json();

  const pack = presetPacks.find((p) => p.slug === preset);
  if (!pack) {
    return Response.json({ error: "Unknown preset" }, { status: 400 });
  }

  if (!lang || typeof lang !== "string") {
    return Response.json({ error: "Missing lang" }, { status: 400 });
  }

  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/download?preset=${preset}`;

  const monoRes = await fetch(
    `${process.env.MONOBANK_BASE_URL}/api/merchant/invoice/create`,
    {
      method: "POST",
      headers: {
        "X-Token": process.env.MONOBANK_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: pack.priceKopecks,
        ccy: 980,
        merchantPaymInfo: {
          reference: preset,
          destination: `${pack.title} preset pack`,
        },
        displayType: "iframe",
        redirectUrl,
      }),
    }
  );

  if (!monoRes.ok) {
    const text = await monoRes.text();
    console.error("Monobank invoice create failed:", monoRes.status, text);
    return Response.json({ error: "Failed to create invoice" }, { status: 502 });
  }

  const data = await monoRes.json();
  return Response.json({ pageUrl: data.pageUrl, invoiceId: data.invoiceId });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Smoke test with curl (dev server must be running)**

```bash
npm run dev &
sleep 3
curl -s -X POST http://localhost:3000/api/invoice/create \
  -H "Content-Type: application/json" \
  -d '{"preset":"warm-editorial","lang":"en"}' | jq .
```

Expected: JSON with `pageUrl` and `invoiceId` fields (from Monobank test API).
If you get `{ "error": "Failed to create invoice" }`, check your `MONOBANK_TOKEN` in `.env.local`.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/invoice/create/route.ts
git commit -m "feat: add invoice create API route"
```

---

## Task 5: Create Invoice Verify API Route

**Files:**
- Create: `src/app/api/invoice/verify/route.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/app/api/invoice/verify
```

Create `src/app/api/invoice/verify/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { createHmac } from "crypto";
import { presetPacks } from "@/lib/presets";

export async function POST(req: NextRequest) {
  const { invoiceId, preset } = await req.json();

  if (!invoiceId || typeof invoiceId !== "string") {
    return Response.json({ error: "Missing invoiceId" }, { status: 400 });
  }

  const pack = presetPacks.find((p) => p.slug === preset);
  if (!pack) {
    return Response.json({ error: "Unknown preset" }, { status: 400 });
  }

  const monoRes = await fetch(
    `${process.env.MONOBANK_BASE_URL}/api/merchant/invoice/status?invoiceId=${encodeURIComponent(invoiceId)}`,
    {
      headers: { "X-Token": process.env.MONOBANK_TOKEN! },
    }
  );

  if (!monoRes.ok) {
    console.error("Monobank status check failed:", monoRes.status);
    return Response.json({ error: "Status check failed" }, { status: 502 });
  }

  const { status } = await monoRes.json();

  if (status !== "success") {
    return Response.json({ error: "Payment not confirmed", status }, { status: 402 });
  }

  const expiresAt = Date.now() + 15 * 60 * 1000;
  const message = `${preset}:${expiresAt}`;
  const token = createHmac("sha256", process.env.DOWNLOAD_SECRET!)
    .update(message)
    .digest("hex");

  return Response.json({ token, expiresAt });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/invoice/verify/route.ts
git commit -m "feat: add invoice verify API route with HMAC token generation"
```

---

## Task 6: Create Download API Route

**Files:**
- Create: `src/app/api/download/route.ts`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/app/api/download
```

Create `src/app/api/download/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import { presetPacks } from "@/lib/presets";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const token = searchParams.get("token");
  const preset = searchParams.get("preset");
  const expires = searchParams.get("expires");

  if (!token || !preset || !expires) {
    return new Response("Bad Request", { status: 400 });
  }

  const expiresAt = parseInt(expires, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return new Response("Link expired", { status: 403 });
  }

  const pack = presetPacks.find((p) => p.slug === preset);
  if (!pack) {
    return new Response("Not Found", { status: 404 });
  }

  const message = `${preset}:${expiresAt}`;
  const expected = createHmac("sha256", process.env.DOWNLOAD_SECRET!)
    .update(message)
    .digest("hex");

  const tokenBuf = Buffer.from(token.length === expected.length ? token : "", "hex");
  const expectedBuf = Buffer.from(expected, "hex");

  if (tokenBuf.length !== expectedBuf.length || !timingSafeEqual(tokenBuf, expectedBuf)) {
    return new Response("Forbidden", { status: 403 });
  }

  const filePath = path.join(process.cwd(), "private", "presets", pack.fileBasename);

  try {
    const fileBuffer = await readFile(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${pack.fileBasename}"`,
        "Cache-Control": "no-store, no-cache",
      },
    });
  } catch {
    return new Response("File not found", { status: 404 });
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/download/route.ts
git commit -m "feat: add secure download API route with HMAC verification"
```

---

## Task 7: Create Checkout Page

**Files:**
- Create: `src/app/[lang]/checkout/page.tsx`
- Create: `src/app/[lang]/checkout/CheckoutClient.tsx`
- Create: `src/app/[lang]/checkout/checkout.module.css`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p "src/app/[lang]/checkout"
```

- [ ] **Step 2: Create `src/app/[lang]/checkout/page.tsx`**

```typescript
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { presetPacks } from "@/lib/presets";
import { CheckoutClient } from "./CheckoutClient";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { preset } = await searchParams;
  if (!hasLocale(lang)) notFound();

  const presetSlug = Array.isArray(preset) ? preset[0] : preset;
  const pack = presetPacks.find((p) => p.slug === presetSlug);
  if (!pack) notFound();

  const dict = await getDictionary(lang);

  return (
    <CheckoutClient
      lang={lang}
      pack={pack}
      dict={dict.checkout}
    />
  );
}
```

- [ ] **Step 3: Create `src/app/[lang]/checkout/CheckoutClient.tsx`**

```typescript
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PresetPack } from "@/lib/presets";
import type { Dictionary } from "../dictionaries";
import styles from "./checkout.module.css";

type Props = {
  lang: string;
  pack: PresetPack;
  dict: Dictionary["checkout"];
};

type InvoiceState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; pageUrl: string };

export function CheckoutClient({ lang, pack, dict }: Props) {
  const [invoice, setInvoice] = useState<InvoiceState>({ status: "loading" });

  useEffect(() => {
    fetch("/api/invoice/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preset: pack.slug, lang }),
    })
      .then((res) => res.json())
      .then((data: { pageUrl?: string; invoiceId?: string; error?: string }) => {
        if (data.pageUrl && data.invoiceId) {
          sessionStorage.setItem("mono_invoice_id", data.invoiceId);
          setInvoice({ status: "ready", pageUrl: data.pageUrl });
        } else {
          setInvoice({ status: "error" });
        }
      })
      .catch(() => setInvoice({ status: "error" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <p className={styles.back}>
        <Link href={`/${lang}/presets/${pack.slug}`}>{dict.back}</Link>
      </p>

      <h1 className={styles.title}>{pack.title}</h1>

      {invoice.status === "loading" && (
        <div className={styles.state}>{dict.loading}</div>
      )}

      {invoice.status === "error" && (
        <div className={styles.stateError}>{dict.error}</div>
      )}

      {invoice.status === "ready" && (
        <div className={styles.frameWrap}>
          <iframe
            id="payFrame"
            title="monopay"
            src={invoice.pageUrl}
            allow="payment *"
            width="576"
            height="576"
            style={{ borderRadius: "24px", border: "none" }}
          />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/[lang]/checkout/checkout.module.css`**

```css
.page {
  padding: 24px 0;
  max-width: 640px;
}

.back {
  font-size: 14px;
  margin: 0 0 16px;
}

.back a {
  color: #444;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.03;
  color: #0a0a0a;
  margin: 0 0 32px;
}

.state {
  font-size: 15px;
  color: #444;
  padding: 48px 0;
}

.stateError {
  font-size: 15px;
  color: #c00;
  padding: 48px 0;
}

.frameWrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add "src/app/[lang]/checkout/"
git commit -m "feat: add checkout page with Monobank iframe"
```

---

## Task 8: Create Download Page

**Files:**
- Create: `src/app/[lang]/download/page.tsx`
- Create: `src/app/[lang]/download/DownloadClient.tsx`
- Create: `src/app/[lang]/download/download.module.css`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p "src/app/[lang]/download"
```

- [ ] **Step 2: Create `src/app/[lang]/download/page.tsx`**

```typescript
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { presetPacks } from "@/lib/presets";
import { DownloadClient } from "./DownloadClient";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DownloadPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { preset } = await searchParams;
  if (!hasLocale(lang)) notFound();

  const presetSlug = Array.isArray(preset) ? preset[0] : preset;
  const pack = presetPacks.find((p) => p.slug === presetSlug);
  if (!pack) notFound();

  const dict = await getDictionary(lang);

  return (
    <DownloadClient
      lang={lang}
      pack={pack}
      dict={dict.download}
    />
  );
}
```

- [ ] **Step 3: Create `src/app/[lang]/download/DownloadClient.tsx`**

```typescript
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PresetPack } from "@/lib/presets";
import type { Dictionary } from "../dictionaries";
import styles from "./download.module.css";

type Props = {
  lang: string;
  pack: PresetPack;
  dict: Dictionary["download"];
};

type DownloadState =
  | { status: "verifying" }
  | { status: "error"; message: string }
  | { status: "ready"; token: string; expiresAt: number }
  | { status: "expired" };

export function DownloadClient({ lang, pack, dict }: Props) {
  const [state, setState] = useState<DownloadState>({ status: "verifying" });

  useEffect(() => {
    const invoiceId = sessionStorage.getItem("mono_invoice_id");

    if (!invoiceId) {
      setState({ status: "error", message: dict.error_payment });
      return;
    }

    fetch("/api/invoice/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId, preset: pack.slug }),
    })
      .then((res) => res.json())
      .then((data: { token?: string; expiresAt?: number; error?: string }) => {
        if (data.token && data.expiresAt) {
          setState({ status: "ready", token: data.token, expiresAt: data.expiresAt });
          const remaining = data.expiresAt - Date.now();
          if (remaining > 0) {
            setTimeout(() => setState({ status: "expired" }), remaining);
          }
        } else {
          setState({ status: "error", message: dict.error_payment });
        }
      })
      .catch(() => setState({ status: "error", message: dict.error_generic }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadUrl =
    state.status === "ready"
      ? `/api/download?token=${state.token}&preset=${pack.slug}&expires=${state.expiresAt}`
      : "#";

  return (
    <div className={styles.page}>
      <p className={styles.back}>
        <Link href={`/${lang}/presets`}>{dict.back}</Link>
      </p>

      {state.status === "verifying" && (
        <div className={styles.state}>{dict.verifying}</div>
      )}

      {state.status === "error" && (
        <div className={styles.stateError}>
          <p>{state.message}</p>
        </div>
      )}

      {state.status === "expired" && (
        <div className={styles.stateError}>
          <p>{dict.expired}</p>
        </div>
      )}

      {state.status === "ready" && (
        <div className={styles.readyWrap}>
          <h1 className={styles.title}>{dict.ready_title}</h1>
          <p className={styles.warning}>⚠ {dict.warning}</p>
          <a href={downloadUrl} className={styles.downloadButton}>
            {dict.download_button}
          </a>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/[lang]/download/download.module.css`**

```css
.page {
  padding: 24px 0;
  max-width: 640px;
}

.back {
  font-size: 14px;
  margin: 0 0 32px;
}

.back a {
  color: #444;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.state {
  font-size: 15px;
  color: #444;
  padding: 48px 0;
}

.stateError {
  font-size: 15px;
  color: #c00;
  padding: 48px 0;
}

.readyWrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.03;
  color: #0a0a0a;
  margin: 0;
}

.warning {
  font-size: 14px;
  font-weight: 600;
  color: #b45309;
  background: #fef3c7;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 0;
}

.downloadButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  background: #111;
  border: 1px solid #111;
  transition: background 0.15s ease;
  align-self: flex-start;
}

.downloadButton:hover {
  background: #333;
  border-color: #333;
  color: #fff;
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add "src/app/[lang]/download/"
git commit -m "feat: add download page with HMAC-verified download link"
```

---

## Task 9: Update Preset Pack Page Buy Buttons

**Files:**
- Modify: `src/app/[lang]/presets/[slug]/page.tsx`

- [ ] **Step 1: Update the file**

The existing file has two `<a href={pack.buyUrl} ...>` tags. Replace the entire file content with:

```typescript
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPresetPackBySlug,
  getPresetPairs,
  getPresetPairImageUrl,
  presetPacks,
} from "@/lib/presets";
import { getDictionary, hasLocale } from "../../dictionaries";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import styles from "@/app/[lang]/presets/[slug]/pack.module.css";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  const langs = ["en", "uk"];
  return langs.flatMap((lang) =>
    presetPacks.map((pack) => ({ lang, slug: pack.slug }))
  );
}

export default async function PresetPackPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const pack = getPresetPackBySlug(slug);
  if (!pack) notFound();

  const dict = await getDictionary(lang);
  const t = dict.presets;
  const pairs = getPresetPairs(pack);

  return (
    <div>
      <p className={styles.back}>
        <Link href={`/${lang}/presets`}>{t.back}</Link>
      </p>

      <div className={styles.header}>
        <h1 className={styles.title}>{pack.title}</h1>
        <Link href={`/${lang}/checkout?preset=${pack.slug}`} className={styles.buyButton}>
          <span>{t.buy}</span>
          <span className={styles.buyPrice}>{pack.priceDisplay}</span>
        </Link>
      </div>

      <div className={styles.pairs}>
        {pairs.map((pair) => (
          <article key={pair.index} className={styles.pair}>
            <BeforeAfterSlider
              beforeSrc={getPresetPairImageUrl(pack.slug, pair.index, "before", 900, 650)}
              afterSrc={getPresetPairImageUrl(pack.slug, pair.index, "after", 900, 650)}
              beforeLabel={t.before}
              afterLabel={t.after}
            />
          </article>
        ))}
      </div>

      <div className={styles.footer}>
        <Link href={`/${lang}/checkout?preset=${pack.slug}`} className={styles.buyButton}>
          <span>{t.buy}</span>
          <span className={styles.buyPrice}>{pack.priceDisplay}</span>
        </Link>
        <h1 className={styles.title}>{pack.title}</h1>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify dev server starts cleanly**

```bash
npm run dev
```

Navigate to `http://localhost:3000/en/presets/warm-editorial`. The buy button should link to `/en/checkout?preset=warm-editorial` instead of an external URL. Check in browser devtools → hover over button → confirm href.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[lang]/presets/[slug]/page.tsx"
git commit -m "feat: wire buy buttons to Monobank checkout page"
```

---

## Task 10: End-to-End Smoke Test

No automated test framework exists in this project. Follow these manual steps to verify the full flow.

- [ ] **Step 1: Place a placeholder zip file for testing**

```bash
echo "test" > private/presets/warm-editorial.zip
```

- [ ] **Step 2: Start dev server**

```bash
npm run dev
```

- [ ] **Step 3: Test invoice creation**

```bash
curl -s -X POST http://localhost:3000/api/invoice/create \
  -H "Content-Type: application/json" \
  -d '{"preset":"warm-editorial","lang":"en"}' | jq .
```

Expected: `{ "pageUrl": "https://...", "invoiceId": "..." }`. Note the `invoiceId`.

- [ ] **Step 4: Test the checkout page in browser**

Open `http://localhost:3000/en/checkout?preset=warm-editorial`. Confirm:
- Page loads without error
- Loading state appears briefly
- Monobank iframe renders (min 576×576px)
- Browser devtools → Application → Session Storage → confirm `mono_invoice_id` is set

- [ ] **Step 5: Test HMAC token generation (simulate paid invoice)**

Using the `invoiceId` from Step 3, call verify. Note: in test mode the invoice status will be `created` not `success`. To manually verify the HMAC logic works, generate a token directly in Node:

```bash
node -e "
const { createHmac } = require('crypto');
const secret = process.env.DOWNLOAD_SECRET || 'test-secret';
const preset = 'warm-editorial';
const expiresAt = Date.now() + 15 * 60 * 1000;
const token = createHmac('sha256', secret).update(\`\${preset}:\${expiresAt}\`).digest('hex');
console.log('token:', token);
console.log('expires:', expiresAt);
console.log('url:', \`http://localhost:3000/api/download?token=\${token}&preset=\${preset}&expires=\${expiresAt}\`);
" 
```

Load the printed URL in browser. Confirm: file downloads (even if it's just the `echo "test"` content).

- [ ] **Step 6: Test expired token**

Modify the `expiresAt` in the URL to a past timestamp (e.g., `1000`) and load the URL.
Expected: response `Link expired` with status 403.

- [ ] **Step 7: Test tampered token**

Change one character in the `token` query param and load the URL.
Expected: response `Forbidden` with status 403.

- [ ] **Step 8: Test unknown preset**

```bash
curl -s "http://localhost:3000/api/download?token=abc&preset=fake&expires=9999999999999" -o /dev/null -w "%{http_code}"
```

Expected: `404`.

- [ ] **Step 9: Full payment test (when Monobank test environment is available)**

Complete a full payment using a Monobank test card. After payment, confirm redirect to `/en/download?preset=warm-editorial`, the 15-minute warning banner is visible, and the download button triggers file download.

- [ ] **Step 10: Final commit**

```bash
echo "test" > private/presets/margophotoo-cool-film.zip
git add private/presets/
git commit -m "chore: add placeholder preset files for testing"
```

---

## Post-Implementation Checklist

Before going to production:

- [ ] Replace `.env.local` test token with production `MONOBANK_TOKEN`
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Replace placeholder `.zip` files in `private/presets/` with real preset files
- [ ] Verify `private/presets/` is NOT committed to git (add to `.gitignore` if needed)
- [ ] Set all env vars in your hosting platform (Vercel, etc.)
