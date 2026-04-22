#!/usr/bin/env npx tsx
/**
 * migrate-audio-dev-to-prod.mts
 *
 * Copies 24 audio files (Days 35-46, EN + FR) from Convex DEV (neat-frog-379)
 * to Convex PROD (laudable-hedgehog-797) using Option A: blob copy.
 *
 * Strategy: download MP3 from DEV storage URL → re-upload to PROD → save metadata.
 * Zero fal.ai cost, preserves exact bytes, idempotent (saveAudioFile upserts).
 *
 * Usage:
 *   npx tsx scripts/migrate-audio-dev-to-prod.mts
 *
 * Requires no auth tokens — both deployments have public storage URLs and
 * open generateUploadUrl / saveAudioFile mutations (no auth gate in schema).
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const DEV_URL = "https://neat-frog-379.convex.cloud";
const PROD_URL = "https://laudable-hedgehog-797.convex.cloud";

const TMP_DIR = path.join(os.tmpdir(), "migrate-audio");
fs.mkdirSync(TMP_DIR, { recursive: true });

interface SlugEntry {
  slug: string;
  locale: string;
  filename: string;
}

// Build the 24-entry manifest: days 35-46, both locales
const ENTRIES: SlugEntry[] = [];
for (let day = 35; day <= 46; day++) {
  for (const locale of ["en", "fr"] as const) {
    ENTRIES.push({
      slug: `day-${day}`,
      locale,
      filename: `day-${day}-${locale}.mp3`,
    });
  }
}

async function convexQuery(
  baseUrl: string,
  functionPath: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${baseUrl}/api/query`, {
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

async function convexMutation(
  baseUrl: string,
  functionPath: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(`${baseUrl}/api/mutation`, {
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

interface MigrationResult {
  slug: string;
  locale: string;
  filename: string;
  devUrl: string;
  prodStorageId: string;
  sizeBytes: number;
}

async function migrateEntry(entry: SlugEntry): Promise<MigrationResult> {
  const { slug, locale, filename } = entry;
  const label = `${slug}/${locale}`;

  // 1. Get URL from DEV
  const devUrl = (await convexQuery(DEV_URL, "audio:getAudioUrl", {
    slug,
    locale,
  })) as string | null;
  if (!devUrl) {
    throw new Error(`DEV has no audio for ${label}`);
  }

  // 2. Download MP3 from DEV
  const tmpPath = path.join(TMP_DIR, filename);
  const downloadRes = await fetch(devUrl);
  if (!downloadRes.ok) {
    throw new Error(`Download failed ${downloadRes.status}: ${devUrl}`);
  }
  const audioBytes = Buffer.from(await downloadRes.arrayBuffer());
  fs.writeFileSync(tmpPath, audioBytes);
  const sizeBytes = audioBytes.length;

  // 3. Get PROD upload URL
  const uploadUrl = (await convexMutation(PROD_URL, "audio:generateUploadUrl", {})) as string;

  // 4. Upload MP3 to PROD storage
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "audio/mpeg" },
    body: audioBytes,
  });
  if (!uploadRes.ok) {
    throw new Error(`PROD upload failed ${uploadRes.status} ${uploadRes.statusText}`);
  }
  const { storageId: prodStorageId } = (await uploadRes.json()) as { storageId: string };

  // 5. Save metadata on PROD (upserts if already exists)
  await convexMutation(PROD_URL, "audio:saveAudioFile", {
    slug,
    locale,
    storageId: prodStorageId,
    filename,
  });

  // 6. Clean up tmp file
  fs.unlinkSync(tmpPath);

  return {
    slug,
    locale,
    filename,
    devUrl,
    prodStorageId,
    sizeBytes,
  };
}

async function verifyProd(slug: string, locale: string): Promise<string | null> {
  return (await convexQuery(PROD_URL, "audio:getAudioUrl", { slug, locale })) as string | null;
}

async function main() {
  console.log(`Migration: DEV (neat-frog-379) → PROD (laudable-hedgehog-797)`);
  console.log(`Entries to migrate: ${ENTRIES.length}`);
  console.log(`Temp dir: ${TMP_DIR}\n`);

  // Migrate in batches of 4 (parallel)
  const BATCH_SIZE = 4;
  const results: MigrationResult[] = [];
  const failed: Array<{ entry: SlugEntry; error: string }> = [];

  for (let i = 0; i < ENTRIES.length; i += BATCH_SIZE) {
    const batch = ENTRIES.slice(i, i + BATCH_SIZE);
    console.log(
      `Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ENTRIES.length / BATCH_SIZE)}: ` +
        batch.map((e) => `${e.slug}/${e.locale}`).join(", ")
    );

    const batchResults = await Promise.allSettled(batch.map((entry) => migrateEntry(entry)));

    for (let j = 0; j < batchResults.length; j++) {
      const r = batchResults[j];
      const entry = batch[j];
      if (r.status === "fulfilled") {
        const { sizeBytes } = r.value;
        console.log(
          `  OK  ${entry.slug}/${entry.locale} — ${(sizeBytes / 1024 / 1024).toFixed(2)} MB → ${r.value.prodStorageId}`
        );
        results.push(r.value);
      } else {
        console.error(`  ERR ${entry.slug}/${entry.locale} — ${r.reason}`);
        failed.push({ entry, error: String(r.reason) });
      }
    }
  }

  console.log(`\n--- Verification (PROD) ---`);
  const verifyResults: Array<{ label: string; url: string | null; ok: boolean }> = [];
  for (const r of results) {
    const url = await verifyProd(r.slug, r.locale);
    const ok = url !== null;
    verifyResults.push({ label: `${r.slug}/${r.locale}`, url, ok });
    console.log(`  ${ok ? "OK" : "FAIL"} ${r.slug}/${r.locale}: ${url ?? "null"}`);
  }

  const failedVerify = verifyResults.filter((v) => !v.ok);

  console.log(`\n--- Summary ---`);
  console.log(`Migrated:         ${results.length} / ${ENTRIES.length}`);
  console.log(`Failed migration: ${failed.length}`);
  console.log(`Failed verify:    ${failedVerify.length}`);

  if (results.length > 0) {
    console.log(`\n--- Slug mapping table ---`);
    console.log(`${"slug/locale".padEnd(16)} | ${"DEV storageId (from URL)".padEnd(44)} | ${"PROD storageId".padEnd(44)} | size`);
    console.log(`${"-".repeat(16)}-+-${"-".repeat(44)}-+-${"-".repeat(44)}-+------`);
    for (const r of results) {
      const devStorageId = r.devUrl.split("/api/storage/")[1] ?? "?";
      console.log(
        `${`${r.slug}/${r.locale}`.padEnd(16)} | ${devStorageId.padEnd(44)} | ${r.prodStorageId.padEnd(44)} | ${(r.sizeBytes / 1024 / 1024).toFixed(2)} MB`
      );
    }
  }

  if (failed.length > 0 || failedVerify.length > 0) {
    process.exit(1);
  }

  console.log(`\nAll ${results.length} files migrated and verified on PROD.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
