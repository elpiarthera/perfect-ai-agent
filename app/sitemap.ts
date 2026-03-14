import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE_URL = "https://perfectaiagent.xyz";
const LOCALES = ["en", "fr"] as const;

function getChapterSlugs(): string[] {
  const contentDir = path.join(process.cwd(), "content", "en");
  const files = fs.readdirSync(contentDir);

  return files
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("about-"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function getFileMtime(slug: string): Date {
  // Use the most recent mtime across both locales
  const enPath = path.join(process.cwd(), "content", "en", `${slug}.mdx`);
  const frPath = path.join(process.cwd(), "content", "fr", `${slug}.mdx`);

  let latest = new Date(0);

  if (fs.existsSync(enPath)) {
    const stat = fs.statSync(enPath);
    if (stat.mtime > latest) latest = stat.mtime;
  }
  if (fs.existsSync(frPath)) {
    const stat = fs.statSync(frPath);
    if (stat.mtime > latest) latest = stat.mtime;
  }

  return latest.getTime() > 0 ? latest : new Date();
}

function getPageMtime(pagePath: string): Date {
  const fullPath = path.join(process.cwd(), pagePath);
  if (fs.existsSync(fullPath)) {
    return fs.statSync(fullPath).mtime;
  }
  return new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const chapterSlugs = getChapterSlugs();

  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  const homeMtime = getPageMtime("app/[locale]/page.tsx");
  for (const locale of LOCALES) {
    const otherLocale = locale === "en" ? "fr" : "en";
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: homeMtime,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          [locale]: `${BASE_URL}/${locale}`,
          [otherLocale]: `${BASE_URL}/${otherLocale}`,
        },
      },
    });
  }

  // Chapters listing for each locale
  const chaptersPageMtime = getPageMtime("app/[locale]/chapters/page.tsx");
  for (const locale of LOCALES) {
    const otherLocale = locale === "en" ? "fr" : "en";
    entries.push({
      url: `${BASE_URL}/${locale}/chapters`,
      lastModified: chaptersPageMtime,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          [locale]: `${BASE_URL}/${locale}/chapters`,
          [otherLocale]: `${BASE_URL}/${otherLocale}/chapters`,
        },
      },
    });
  }

  // Individual chapter pages for each locale
  for (const locale of LOCALES) {
    const otherLocale = locale === "en" ? "fr" : "en";
    for (const slug of chapterSlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/chapters/${slug}`,
        lastModified: getFileMtime(slug),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            [locale]: `${BASE_URL}/${locale}/chapters/${slug}`,
            [otherLocale]: `${BASE_URL}/${otherLocale}/chapters/${slug}`,
          },
        },
      });
    }
  }

  // For AI Agents page for each locale
  const forAgentsMtime = getPageMtime("app/[locale]/for-ai-agents/page.tsx");
  for (const locale of LOCALES) {
    const otherLocale = locale === "en" ? "fr" : "en";
    entries.push({
      url: `${BASE_URL}/${locale}/for-ai-agents`,
      lastModified: forAgentsMtime,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          [locale]: `${BASE_URL}/${locale}/for-ai-agents`,
          [otherLocale]: `${BASE_URL}/${otherLocale}/for-ai-agents`,
        },
      },
    });
  }

  // About page for each locale
  const aboutMtime = getFileMtime("about-website");
  for (const locale of LOCALES) {
    const otherLocale = locale === "en" ? "fr" : "en";
    entries.push({
      url: `${BASE_URL}/${locale}/about`,
      lastModified: aboutMtime,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: {
          [locale]: `${BASE_URL}/${locale}/about`,
          [otherLocale]: `${BASE_URL}/${otherLocale}/about`,
        },
      },
    });
  }

  return entries;
}
