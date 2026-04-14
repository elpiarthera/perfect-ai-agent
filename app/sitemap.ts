import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
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

function getDiaryMtime(locale: string, slug: string): Date {
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
		return fs.statSync(localePath).mtime;
	}
	if (fs.existsSync(enPath)) {
		return fs.statSync(enPath).mtime;
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
					"x-default": `${BASE_URL}/en`,
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
					"x-default": `${BASE_URL}/en/chapters`,
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
						"x-default": `${BASE_URL}/en/chapters/${slug}`,
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
					"x-default": `${BASE_URL}/en/for-ai-agents`,
				},
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
			url: `${BASE_URL}/${locale}/what-ai-thinks`,
			lastModified: whatAiThinksMtime,
			changeFrequency: "monthly",
			priority: 0.8,
			alternates: {
				languages: {
					[locale]: `${BASE_URL}/${locale}/what-ai-thinks`,
					[otherLocale]: `${BASE_URL}/${otherLocale}/what-ai-thinks`,
					"x-default": `${BASE_URL}/en/what-ai-thinks`,
				},
			},
		});
	}

	// Wall of Fame page for each locale
	const wallMtime = getPageMtime("app/[locale]/wall/page.tsx");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			url: `${BASE_URL}/${locale}/wall`,
			lastModified: wallMtime,
			changeFrequency: "daily",
			priority: 0.8,
			alternates: {
				languages: {
					[locale]: `${BASE_URL}/${locale}/wall`,
					[otherLocale]: `${BASE_URL}/${otherLocale}/wall`,
					"x-default": `${BASE_URL}/en/wall`,
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
					"x-default": `${BASE_URL}/en/about`,
				},
			},
		});
	}

	// Privacy page for each locale
	const privacyMtime = getPageMtime("app/[locale]/privacy/page.tsx");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			url: `${BASE_URL}/${locale}/privacy`,
			lastModified: privacyMtime,
			changeFrequency: "yearly",
			priority: 0.3,
			alternates: {
				languages: {
					[locale]: `${BASE_URL}/${locale}/privacy`,
					[otherLocale]: `${BASE_URL}/${otherLocale}/privacy`,
					"x-default": `${BASE_URL}/en/privacy`,
				},
			},
		});
	}

	// Accessibility declaration pages
	const accessibilityMtime = getPageMtime(
		"app/[locale]/accessibility/page.tsx",
	);
	entries.push({
		url: `${BASE_URL}/en/accessibility`,
		lastModified: accessibilityMtime,
		changeFrequency: "yearly",
		priority: 0.3,
		alternates: {
			languages: {
				en: `${BASE_URL}/en/accessibility`,
				fr: `${BASE_URL}/fr/accessibilite`,
				"x-default": `${BASE_URL}/en/accessibility`,
			},
		},
	});
	entries.push({
		url: `${BASE_URL}/fr/accessibilite`,
		lastModified: accessibilityMtime,
		changeFrequency: "yearly",
		priority: 0.3,
		alternates: {
			languages: {
				en: `${BASE_URL}/en/accessibility`,
				fr: `${BASE_URL}/fr/accessibilite`,
				"x-default": `${BASE_URL}/en/accessibility`,
			},
		},
	});

	// Accessibility multi-year plan pages
	const planMtime = getPageMtime("app/[locale]/accessibility-plan/page.tsx");
	entries.push({
		url: `${BASE_URL}/en/accessibility-plan`,
		lastModified: planMtime,
		changeFrequency: "yearly",
		priority: 0.3,
		alternates: {
			languages: {
				en: `${BASE_URL}/en/accessibility-plan`,
				fr: `${BASE_URL}/fr/schema-accessibilite`,
				"x-default": `${BASE_URL}/en/accessibility-plan`,
			},
		},
	});
	entries.push({
		url: `${BASE_URL}/fr/schema-accessibilite`,
		lastModified: planMtime,
		changeFrequency: "yearly",
		priority: 0.3,
		alternates: {
			languages: {
				en: `${BASE_URL}/en/accessibility-plan`,
				fr: `${BASE_URL}/fr/schema-accessibilite`,
				"x-default": `${BASE_URL}/en/accessibility-plan`,
			},
		},
	});

	// Diary index page for each locale
	const diaryIndexMtime = getPageMtime("app/[locale]/diary/page.tsx");
	for (const locale of LOCALES) {
		const otherLocale = locale === "en" ? "fr" : "en";
		entries.push({
			url: `${BASE_URL}/${locale}/diary`,
			lastModified: diaryIndexMtime,
			changeFrequency: "daily",
			priority: 0.9,
			alternates: {
				languages: {
					[locale]: `${BASE_URL}/${locale}/diary`,
					[otherLocale]: `${BASE_URL}/${otherLocale}/diary`,
					"x-default": `${BASE_URL}/en/diary`,
				},
			},
		});
	}

	// Individual diary entries — auto-discovered from filesystem, status "final" only
	// getDiaryEntries already filters to status === "final"
	const enDiaryEntries = getDiaryEntries("en");
	const frDiaryEntries = getDiaryEntries("fr");

	// Build a map of slug -> fr entry for cross-referencing alternates
	const frBySlug = new Map(frDiaryEntries.map((e) => [e.slug, e]));

	for (const entry of enDiaryEntries) {
		const { slug } = entry;
		const hasFr = frBySlug.has(slug);

		for (const locale of LOCALES) {
			// Only include fr entry if it exists in fr locale
			if (locale === "fr" && !hasFr) continue;

			entries.push({
				url: `${BASE_URL}/${locale}/diary/${slug}`,
				lastModified: getDiaryMtime(locale, slug),
				changeFrequency: "weekly",
				priority: 0.7,
				alternates: {
					languages: {
						en: `${BASE_URL}/en/diary/${slug}`,
						...(hasFr ? { fr: `${BASE_URL}/fr/diary/${slug}` } : {}),
						"x-default": `${BASE_URL}/en/diary/${slug}`,
					},
				},
			});
		}
	}

	return entries;
}
