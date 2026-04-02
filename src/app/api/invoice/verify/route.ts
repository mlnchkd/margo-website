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
