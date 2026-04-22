import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getDiaryEntries } from "@/lib/diary";
import { notifyIndexNow } from "@/lib/indexnow";

const BASE_URL = "https://perfectaiagent.xyz";
const LOCALES = ["en", "fr"] as const;

/**
 * POST /api/indexnow-bulk
 *
 * Reads all public URLs (chapters + diary entries + static pages) from the
 * filesystem — same source-of-truth as app/sitemap.xml/route.ts — and
 * submits them to IndexNow in a single bulk call.
 *
 * Auth: Bearer token required.
 *   Header: Authorization: Bearer <INDEXNOW_BULK_SECRET>
 *
 * Returns: { submitted: number, indexNowStatus: number }
 *
 * Phase 2 (future): add a Convex Action hook or GitHub Actions post-merge
 * trigger to call this endpoint automatically when a new diary entry ships.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // Auth: required bearer token
  const bulkSecret = process.env.INDEXNOW_BULK_SECRET;
  if (typeof bulkSecret !== "string" || bulkSecret.length === 0) {
    console.error("[IndexNow Bulk] INDEXNOW_BULK_SECRET env var not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${bulkSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Collect all public URLs — mirrors sitemap.xml/route.ts buildEntries()

  // 1. Static pages
  const urls: string[] = [];
  for (const locale of LOCALES) {
    urls.push(`${BASE_URL}/${locale}`);
    urls.push(`${BASE_URL}/${locale}/chapters`);
    urls.push(`${BASE_URL}/${locale}/diary`);
    urls.push(`${BASE_URL}/${locale}/about`);
    urls.push(`${BASE_URL}/${locale}/for-ai-agents`);
    urls.push(`${BASE_URL}/${locale}/what-ai-thinks`);
    urls.push(`${BASE_URL}/${locale}/wall`);
    urls.push(`${BASE_URL}/${locale}/privacy`);
  }
  urls.push(`${BASE_URL}/en/accessibility`);
  urls.push(`${BASE_URL}/fr/accessibilite`);
  urls.push(`${BASE_URL}/en/accessibility-plan`);
  urls.push(`${BASE_URL}/fr/schema-accessibilite`);
  urls.push(`${BASE_URL}/en/sitemap`);
  urls.push(`${BASE_URL}/fr/plan-du-site`);

  // 2. Chapter pages
  const contentEnDir = path.join(process.cwd(), "content", "en");
  const chapterFiles = fs.existsSync(contentEnDir)
    ? fs.readdirSync(contentEnDir).filter(
        (f) => f.endsWith(".mdx") && !f.startsWith("about-"),
      )
    : [];
  for (const file of chapterFiles) {
    const slug = file.replace(/\.mdx$/, "");
    for (const locale of LOCALES) {
      urls.push(`${BASE_URL}/${locale}/chapters/${slug}`);
    }
  }

  // 3. Diary entries — status "final" only, bilingual
  const enDiaryEntries = getDiaryEntries("en");
  const frDiaryEntries = getDiaryEntries("fr");
  const frSlugs = new Set(frDiaryEntries.map((e) => e.slug));

  for (const entry of enDiaryEntries) {
    urls.push(`${BASE_URL}/en/diary/${entry.slug}`);
    if (frSlugs.has(entry.slug)) {
      urls.push(`${BASE_URL}/fr/diary/${entry.slug}`);
    }
  }

  const result = await notifyIndexNow(urls);

  return NextResponse.json(
    { submitted: urls.length, indexNowStatus: result.status, ok: result.ok, message: result.message },
    { status: result.ok ? 200 : 500 },
  );
}
