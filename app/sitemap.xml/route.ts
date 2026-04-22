/**
 * sitemap.xml Route Handler
 *
 * Replaces app/sitemap.ts (MetadataRoute.Sitemap) with an explicit Route Handler.
 *
 * Why: Next.js MetadataRoute.Sitemap routes include "RSC" in the Vary header.
 * When Googlebot sends RSC:1, Vercel serves a cached 500 response instead of XML.
 * A Route Handler bypasses RSC entirely and has full control over response headers.
 *
 * Root cause: app/sitemap.ts + Vary:rsc → RSC:1 request → 500 from cached error page.
 * Fix: explicit GET handler, sets Content-Type + Cache-Control, no RSC involvement.
 */

import fs from "node:fs";
import path from "node:path";
import { getDiaryEntries } from "@/lib/diary";

const BASE_URL = "https://perfectaiagent.xyz";
const LOCALES = ["en", "fr"] as const;

function getChapterSlugs(): string[] {
	const contentDir = path.join(process.cwd(), "content", "en");
	const files = fs.readdirSync(contentDir);
	return files
		.filter((f) => f.endsWith(".mdx") && !f.startsWith("about-"))
		.map((f) => f.replace(/\.mdx$/, ""));
}

function getFileMtime(slug: string): string {
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
	return (latest.getTime() > 0 ? latest : new Date()).toISOString();
}

function getPageMtime(pagePath: string): string {
	const fullPath = path.join(process.cwd(), pagePath);
	if (fs.existsSync(fullPath)) {
		return fs.statSync(fullPath).mtime.toISOString();
	}
	return new Date().toISOString();
}

function getDiaryMtime(locale: string, slug: string): string {
	const localePath = path.join(
		process.cwd(),
		"content",
		locale,
		"diary",
		`${slug}.mdx`,
	);
	const enPath = path.join(
		process.cwd(),
		"content",
		"en",
		"diary",
		`${slug}.mdx`,
	);
	if (fs.existsSync(localePath)) {
		return fs.statSync(localePath).mtime.toISOString();
	}
	if (fs.existsSync(enPath)) {
		return fs.statSync(enPath).mtime.toISOString();
	}
	return new Date().toISOString();
}

type UrlEntry = {
	loc: string;
	lastmod: string;
	changefreq: string;
	priority: number;
	alternates: Record<string, string>;
};

function buildEntries(): UrlEntry[] {
	const chapterSlugs = getChapterSlugs();
	const entries: UrlEntry[] = [];

	// Homepage for each locale
	const homeMtime = getPageMtime("app/[locale]/page.tsx");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			loc: `${BASE_URL}/${locale}`,
			lastmod: homeMtime,
			changefreq: "weekly",
			priority: 1.0,
			alternates: {
				[locale]: `${BASE_URL}/${locale}`,
				[otherLocale]: `${BASE_URL}/${otherLocale}`,
				"x-default": `${BASE_URL}/en`,
			},
		});
	}

	// Chapters listing for each locale
	const chaptersPageMtime = getPageMtime("app/[locale]/chapters/page.tsx");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			loc: `${BASE_URL}/${locale}/chapters`,
			lastmod: chaptersPageMtime,
			changefreq: "weekly",
			priority: 0.8,
			alternates: {
				[locale]: `${BASE_URL}/${locale}/chapters`,
				[otherLocale]: `${BASE_URL}/${otherLocale}/chapters`,
				"x-default": `${BASE_URL}/en/chapters`,
			},
		});
	}

	// Individual chapter pages for each locale
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		for (const slug of chapterSlugs) {
			entries.push({
				loc: `${BASE_URL}/${locale}/chapters/${slug}`,
				lastmod: getFileMtime(slug),
				changefreq: "monthly",
				priority: 0.7,
				alternates: {
					[locale]: `${BASE_URL}/${locale}/chapters/${slug}`,
					[otherLocale]: `${BASE_URL}/${otherLocale}/chapters/${slug}`,
					"x-default": `${BASE_URL}/en/chapters/${slug}`,
				},
			});
		}
	}

	// For AI Agents page for each locale
	const forAgentsMtime = getPageMtime("app/[locale]/for-ai-agents/page.tsx");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			loc: `${BASE_URL}/${locale}/for-ai-agents`,
			lastmod: forAgentsMtime,
			changefreq: "monthly",
			priority: 0.9,
			alternates: {
				[locale]: `${BASE_URL}/${locale}/for-ai-agents`,
				[otherLocale]: `${BASE_URL}/${otherLocale}/for-ai-agents`,
				"x-default": `${BASE_URL}/en/for-ai-agents`,
			},
		});
	}

	// What AI Thinks page for each locale
	const whatAiThinksMtime = getPageMtime(
		"app/[locale]/what-ai-thinks/page.tsx",
	);
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			loc: `${BASE_URL}/${locale}/what-ai-thinks`,
			lastmod: whatAiThinksMtime,
			changefreq: "monthly",
			priority: 0.8,
			alternates: {
				[locale]: `${BASE_URL}/${locale}/what-ai-thinks`,
				[otherLocale]: `${BASE_URL}/${otherLocale}/what-ai-thinks`,
				"x-default": `${BASE_URL}/en/what-ai-thinks`,
			},
		});
	}

	// Wall of Fame page for each locale
	const wallMtime = getPageMtime("app/[locale]/wall/page.tsx");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			loc: `${BASE_URL}/${locale}/wall`,
			lastmod: wallMtime,
			changefreq: "daily",
			priority: 0.8,
			alternates: {
				[locale]: `${BASE_URL}/${locale}/wall`,
				[otherLocale]: `${BASE_URL}/${otherLocale}/wall`,
				"x-default": `${BASE_URL}/en/wall`,
			},
		});
	}

	// About page for each locale
	const aboutMtime = getFileMtime("about-website");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			loc: `${BASE_URL}/${locale}/about`,
			lastmod: aboutMtime,
			changefreq: "monthly",
			priority: 0.5,
			alternates: {
				[locale]: `${BASE_URL}/${locale}/about`,
				[otherLocale]: `${BASE_URL}/${otherLocale}/about`,
				"x-default": `${BASE_URL}/en/about`,
			},
		});
	}

	// Privacy page for each locale
	const privacyMtime = getPageMtime("app/[locale]/privacy/page.tsx");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			loc: `${BASE_URL}/${locale}/privacy`,
			lastmod: privacyMtime,
			changefreq: "yearly",
			priority: 0.3,
			alternates: {
				[locale]: `${BASE_URL}/${locale}/privacy`,
				[otherLocale]: `${BASE_URL}/${otherLocale}/privacy`,
				"x-default": `${BASE_URL}/en/privacy`,
			},
		});
	}

	// Accessibility declaration pages
	const accessibilityMtime = getPageMtime(
		"app/[locale]/accessibility/page.tsx",
	);
	entries.push({
		loc: `${BASE_URL}/en/accessibility`,
		lastmod: accessibilityMtime,
		changefreq: "yearly",
		priority: 0.3,
		alternates: {
			en: `${BASE_URL}/en/accessibility`,
			fr: `${BASE_URL}/fr/accessibilite`,
			"x-default": `${BASE_URL}/en/accessibility`,
		},
	});
	entries.push({
		loc: `${BASE_URL}/fr/accessibilite`,
		lastmod: accessibilityMtime,
		changefreq: "yearly",
		priority: 0.3,
		alternates: {
			en: `${BASE_URL}/en/accessibility`,
			fr: `${BASE_URL}/fr/accessibilite`,
			"x-default": `${BASE_URL}/en/accessibility`,
		},
	});

	// Accessibility multi-year plan pages
	const planMtime = getPageMtime("app/[locale]/accessibility-plan/page.tsx");
	entries.push({
		loc: `${BASE_URL}/en/accessibility-plan`,
		lastmod: planMtime,
		changefreq: "yearly",
		priority: 0.3,
		alternates: {
			en: `${BASE_URL}/en/accessibility-plan`,
			fr: `${BASE_URL}/fr/schema-accessibilite`,
			"x-default": `${BASE_URL}/en/accessibility-plan`,
		},
	});
	entries.push({
		loc: `${BASE_URL}/fr/schema-accessibilite`,
		lastmod: planMtime,
		changefreq: "yearly",
		priority: 0.3,
		alternates: {
			en: `${BASE_URL}/en/accessibility-plan`,
			fr: `${BASE_URL}/fr/schema-accessibilite`,
			"x-default": `${BASE_URL}/en/accessibility-plan`,
		},
	});

	// Sitemap pages (en/sitemap and fr/plan-du-site)
	const sitemapPageMtime = getPageMtime("app/[locale]/sitemap/page.tsx");
	entries.push({
		loc: `${BASE_URL}/en/sitemap`,
		lastmod: sitemapPageMtime,
		changefreq: "weekly",
		priority: 0.3,
		alternates: {
			en: `${BASE_URL}/en/sitemap`,
			fr: `${BASE_URL}/fr/plan-du-site`,
			"x-default": `${BASE_URL}/en/sitemap`,
		},
	});
	const planDuSitePageMtime = getPageMtime(
		"app/[locale]/plan-du-site/page.tsx",
	);
	entries.push({
		loc: `${BASE_URL}/fr/plan-du-site`,
		lastmod: planDuSitePageMtime,
		changefreq: "weekly",
		priority: 0.3,
		alternates: {
			en: `${BASE_URL}/en/sitemap`,
			fr: `${BASE_URL}/fr/plan-du-site`,
			"x-default": `${BASE_URL}/en/sitemap`,
		},
	});

	// Diary index page for each locale
	const diaryIndexMtime = getPageMtime("app/[locale]/diary/page.tsx");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			loc: `${BASE_URL}/${locale}/diary`,
			lastmod: diaryIndexMtime,
			changefreq: "daily",
			priority: 0.9,
			alternates: {
				[locale]: `${BASE_URL}/${locale}/diary`,
				[otherLocale]: `${BASE_URL}/${otherLocale}/diary`,
				"x-default": `${BASE_URL}/en/diary`,
			},
		});
	}

	// Individual diary entries — status "final" only
	const enDiaryEntries = getDiaryEntries("en");
	const frDiaryEntries = getDiaryEntries("fr");
	const frBySlug = new Map(frDiaryEntries.map((e) => [e.slug, e]));

	for (const entry of enDiaryEntries) {
		const { slug } = entry;
		const hasFr = frBySlug.has(slug);

		for (const locale of LOCALES) {
			if (locale === "fr" && !hasFr) continue;

			entries.push({
				loc: `${BASE_URL}/${locale}/diary/${slug}`,
				lastmod: getDiaryMtime(locale, slug),
				changefreq: "weekly",
				priority: 0.7,
				alternates: {
					en: `${BASE_URL}/en/diary/${slug}`,
					...(hasFr ? { fr: `${BASE_URL}/fr/diary/${slug}` } : {}),
					"x-default": `${BASE_URL}/en/diary/${slug}`,
				},
			});
		}
	}

	return entries;
}

function renderXml(entries: UrlEntry[]): string {
	const urlElements = entries
		.map((entry) => {
			const alternateLinks = Object.entries(entry.alternates)
				.map(
					([lang, href]) =>
						`  <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`,
				)
				.join("\n");

			return `<url>
  <loc>${entry.loc}</loc>
${alternateLinks}
  <lastmod>${entry.lastmod}</lastmod>
  <changefreq>${entry.changefreq}</changefreq>
  <priority>${entry.priority}</priority>
</url>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements}
</urlset>`;
}

export async function GET() {
	const entries = buildEntries();
	const xml = renderXml(entries);

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			// No Vary on RSC headers — sitemap must be identical for all callers
			"Cache-Control":
				"public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
