#!/usr/bin/env npx tsx
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import fs from "node:fs";
import path from "node:path";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Error: NEXT_PUBLIC_CONVEX_URL required.");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const AUDIO_DIR = path.join(import.meta.dirname, "../public/audio/diary");

async function main() {
  const files = fs.readdirSync(AUDIO_DIR).filter((f) => f.endsWith(".mp3")).sort();
  console.log(`Found ${files.length} MP3 files to upload.\n`);

  let success = 0;
  let failed = 0;

  for (const filename of files) {
    const base = filename.replace(".mp3", "");
    const lastDash = base.lastIndexOf("-");
    const locale = base.slice(lastDash + 1);
    const slug = base.slice(0, lastDash);

    if (locale !== "en" && locale !== "fr") {
      console.warn(`  Skipping ${filename}: unexpected locale "${locale}"`);
      failed++;
      continue;
    }

    try {
      const uploadUrl: string = await client.mutation(api.audio.generateUploadUrl);
      const filePath = path.join(AUDIO_DIR, filename);
      const fileBytes = fs.readFileSync(filePath);
      const uploadResp = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "audio/mpeg" },
        body: fileBytes,
      });

      if (!uploadResp.ok) {
        throw new Error(`Upload failed: ${uploadResp.status} ${uploadResp.statusText}`);
      }

      const { storageId } = (await uploadResp.json()) as { storageId: string };

      await client.mutation(api.audio.saveAudioFile, {
        slug,
        locale,
        storageId: storageId as any,
        filename,
      });

      console.log(`  ✓ ${filename} → ${slug}/${locale} (${(fileBytes.length / 1024 / 1024).toFixed(1)} MB)`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${filename}: ${err}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} uploaded, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
