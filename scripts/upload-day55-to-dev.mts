#!/usr/bin/env npx tsx
/**
 * upload-day55-to-dev.mts
 *
 * One-shot: upload /tmp/day-55-en.mp3 and /tmp/day-55-fr.mp3 to
 * Convex DEV (neat-frog-379) under slugs day-55/en and day-55/fr.
 *
 * Option B — zero fal.ai cost, uses existing MP3 bytes from /tmp.
 *
 * Usage:
 *   npx tsx scripts/upload-day55-to-dev.mts
 */

import fs from "node:fs";

const DEV_URL = "https://neat-frog-379.convex.cloud";

const ENTRIES = [
  { slug: "day-55", locale: "en", tmpPath: "/tmp/day-55-en.mp3", filename: "day-55-en.mp3" },
  { slug: "day-55", locale: "fr", tmpPath: "/tmp/day-55-fr.mp3", filename: "day-55-fr.mp3" },
];

async function convexMutation(
  functionPath: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${DEV_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: functionPath, args, format: "json" }),
  });
  const body = (await res.json()) as { status: string; value?: unknown; errorMessage?: string };
  if (body.status !== "success") {
    throw new Error(`Mutation ${functionPath} failed: ${body.errorMessage ?? JSON.stringify(body)}`);
  }
  return body.value;
}

async function convexQuery(
  functionPath: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${DEV_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: functionPath, args, format: "json" }),
  });
  const body = (await res.json()) as { status: string; value?: unknown; errorMessage?: string };
  if (body.status !== "success") {
    throw new Error(`Query ${functionPath} failed: ${body.errorMessage ?? JSON.stringify(body)}`);
  }
  return body.value;
}

async function uploadEntry(entry: { slug: string; locale: string; tmpPath: string; filename: string }) {
  const { slug, locale, tmpPath, filename } = entry;
  const label = `${slug}/${locale}`;

  // 1. Read MP3 from disk
  if (!fs.existsSync(tmpPath)) {
    throw new Error(`MP3 not found at ${tmpPath}`);
  }
  const audioBytes = fs.readFileSync(tmpPath);
  console.log(`  Read ${label}: ${(audioBytes.length / 1024 / 1024).toFixed(2)} MB from ${tmpPath}`);

  // 2. Get DEV upload URL
  const uploadUrl = (await convexMutation("audio:generateUploadUrl", {})) as string;

  // 3. Upload MP3 to DEV storage
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "audio/mpeg" },
    body: audioBytes,
  });
  if (!uploadRes.ok) {
    throw new Error(`DEV upload failed ${uploadRes.status} ${uploadRes.statusText}`);
  }
  const { storageId } = (await uploadRes.json()) as { storageId: string };
  console.log(`  Uploaded ${label} -> storageId: ${storageId}`);

  // 4. Save metadata on DEV (upserts if already exists)
  const recordId = await convexMutation("audio:saveAudioFile", {
    slug,
    locale,
    storageId,
    filename,
  });
  console.log(`  Saved audioFiles record: ${recordId}`);

  // 5. Verify — get URL back
  const verifyUrl = (await convexQuery("audio:getAudioUrl", { slug, locale })) as string | null;
  if (!verifyUrl) {
    throw new Error(`Verification failed: getAudioUrl returned null for ${label}`);
  }
  console.log(`  Verified ${label}: ${verifyUrl.substring(0, 80)}...`);

  return { label, storageId, sizeBytes: audioBytes.length };
}

async function main() {
  console.log(`Uploading Day 55 audio to DEV (neat-frog-379)`);
  console.log(`Zero fal.ai cost — reading from /tmp/*.mp3\n`);

  const results = [];
  for (const entry of ENTRIES) {
    console.log(`Processing ${entry.slug}/${entry.locale}...`);
    try {
      const result = await uploadEntry(entry);
      results.push({ ...result, ok: true });
    } catch (err) {
      console.error(`  FAILED: ${err}`);
      results.push({ label: `${entry.slug}/${entry.locale}`, ok: false, error: String(err) });
    }
    console.log();
  }

  console.log(`--- Summary ---`);
  for (const r of results) {
    if (r.ok) {
      console.log(`  OK  ${r.label} — ${((r.sizeBytes ?? 0) / 1024 / 1024).toFixed(2)} MB — storageId: ${r.storageId}`);
    } else {
      console.log(`  ERR ${r.label} — ${"error" in r ? r.error : "unknown"}`);
    }
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} upload(s) failed.`);
    process.exit(1);
  }

  console.log(`\nBoth day-55/en and day-55/fr are live on DEV.`);
  console.log(`Audio player should now render on https://perfectaiagent.xyz/en/diary/day-55`);
  console.log(`and https://perfectaiagent.xyz/fr/diary/day-55`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
