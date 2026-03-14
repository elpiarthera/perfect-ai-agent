import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE_URL = "https://perfect-ai-agent.vercel.app";
const LOCALES = ["en", "fr"] as const;

function getChapterSlugs(): string[] {
  const contentDir = path.join(process.cwd(), "content", "en");
  const files = fs.readdirSync(contentDir);

  return files
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("about-"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const chapterSlugs = getChapterSlugs();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    });
  }

  // Chapters listing for each locale
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}/chapters`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Individual chapter pages for each locale
  for (const locale of LOCALES) {
    for (const slug of chapterSlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/chapters/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // About page for each locale
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
