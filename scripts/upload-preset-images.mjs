/**
 * Upload preset before/after images from imagesToBucket/ → Cloudinary
 *
 * Reads flat image files (e.g. 4-before.jpg, 9-after.jpg) directly from
 * imagesToBucket/ and uploads them to the presets/presets/ Cloudinary folder,
 * overwriting any existing images with the same public_id.
 *
 * Usage:
 *   node --env-file=.env.local scripts/upload-preset-images.mjs
 */

import { v2 as cloudinary } from "cloudinary";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import sharp from "sharp";

const MAX_WIDTH = 2400;
const QUALITY = 88;
const CLOUDINARY_FOLDER = "presets/film-feel";
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT = new URL("../imagesToBucket", import.meta.url).pathname;

async function resizeBuffer(filePath) {
  return sharp(filePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true })
    .toBuffer();
}

async function uploadFile(filePath) {
  const name = basename(filePath, extname(filePath));
  const buffer = await resizeBuffer(filePath);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: name,
        overwrite: true,
        invalidate: true,
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
  const entries = await readdir(ROOT);
  const files = [];

  for (const entry of entries) {
    const full = join(ROOT, entry);
    const s = await stat(full);
    if (s.isFile() && ALLOWED.has(extname(entry).toLowerCase())) {
      files.push(full);
    }
  }

  if (files.length === 0) {
    console.log("No image files found in imagesToBucket/");
    return;
  }

  console.log(`Uploading ${files.length} images to ${CLOUDINARY_FOLDER}/\n`);

  for (const file of files) {
    try {
      const url = await uploadFile(file);
      console.log(`  ✓ ${basename(file)}`);
      console.log(`    ${url}`);
    } catch (err) {
      console.error(`  ✗ ${basename(file)}: ${err.message}`);
    }
  }
}

main().catch(console.error);
