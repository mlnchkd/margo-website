import { NextRequest } from "next/server";
import { presetPacks } from "@/lib/presets";

export async function POST(req: NextRequest) {
  const { preset, lang } = await req.json();

  const pack = presetPacks.find((p) => p.slug === preset);
  if (!pack) {
    return Response.json({ error: "Unknown preset" }, { status: 400 });
  }

  const ALLOWED_LOCALES = ["en", "uk"];
  if (!lang || !ALLOWED_LOCALES.includes(lang)) {
    return Response.json({ error: "Invalid lang" }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const encodedLang = encodeURIComponent(lang);
  const encodedPreset = encodeURIComponent(preset);
  const successUrl = `${base}/${encodedLang}/payment-callback?preset=${encodedPreset}`;
  const failUrl = `${base}/${encodedLang}/presets/${encodedPreset}`;

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
        successUrl,
        failUrl,
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
