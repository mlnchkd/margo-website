import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createReadStream, existsSync } from "fs";
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

  if (!existsSync(filePath)) {
    return new Response("File not found", { status: 404 });
  }

  const stream = createReadStream(filePath);
  const readableStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${pack.fileBasename}"`,
      "Cache-Control": "no-store, no-cache",
    },
  });
}
