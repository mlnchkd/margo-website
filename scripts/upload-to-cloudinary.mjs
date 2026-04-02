/**
 * Upload imagesToBucket/ → Cloudinary
 *
 * Usage:
 *   CLOUDINARY_CLOUD_NAME=xxx CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=xxx \
 *   node scripts/upload-to-cloudinary.mjs
 *
 * Or create a .env.local with the three vars and run with:
 *   node --env-file=.env.local scripts/upload-to-cloudinary.mjs
 */

import { v2 as cloudinary } from "cloudinary";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import sharp from "sharp";

const MAX_WIDTH = 2400;  // px — enough for any screen, far smaller file
const QUALITY   = 88;   // JPEG quality

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT = new URL("../imagesToBucket", import.meta.url).pathname;
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function getFiles(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isFile() && ALLOWED.has(extname(entry).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function resizeBuffer(filePath) {
  return sharp(filePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true })
    .toBuffer();
}

async function uploadFile(filePath, folder) {
  const name = basename(filePath, extname(filePath));

  // Resize in memory, then stream to Cloudinary via upload_stream
  const buffer = await resizeBuffer(filePath);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: name,
        overwrite: false,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function main() {
  const folders = await readdir(ROOT);
  const mapping = {};

  for (const folder of folders) {
    const folderPath = join(ROOT, folder);
    const s = await stat(folderPath);
    if (!s.isDirectory()) continue;

    const files = await getFiles(folderPath);
    if (files.length === 0) continue;

    // Cloudinary folder: use folder name as-is (supports Unicode)
    const cloudFolder = `portfolio/${folder.trim()}`;
    console.log(`\n📁 ${folder} (${files.length} images) → ${cloudFolder}`);

    mapping[folder.trim()] = [];

    for (const file of files) {
      try {
        const url = await uploadFile(file, cloudFolder);
        mapping[folder.trim()].push(url);
        console.log(`  ✓ ${basename(file)}`);
      } catch (err) {
        console.error(`  ✗ ${basename(file)}: ${err.message}`);
      }
    }
  }

  console.log("\n\n=== URL MAPPING (paste into portfolio.ts) ===\n");
  console.log(JSON.stringify(mapping, null, 2));
}

main().catch(console.error);
