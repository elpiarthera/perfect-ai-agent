import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { CHAPTERS } from "@/lib/chapters";
import { getDiaryEntries } from "@/lib/diary";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

// Authoritative locale for this slug. The FR equivalent lives at /fr/plan-du-site.
// Cross-locale access (e.g. /fr/sitemap) issues a 308 redirect to the peer slug.
const AUTHORITATIVE_LOCALE = "en";
const PEER_SLUG = "plan-du-site";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	if (locale !== AUTHORITATIVE_LOCALE) {
		permanentRedirect(`/${locale}/${PEER_SLUG}`);
	}
	// Ahrefs T6: meta description 120-160 chars.
	const description = `Complete list of all pages on ${SITE_NAME} — chapters, AI diary entries, legal and accessibility pages. Everything on perfectaiagent.xyz.`;
	return {
		title: "Sitemap",
		description,
		alternates: {
			canonical: `${SITE_URL}/en/sitemap`,
			languages: {
				en: `${SITE_URL}/en/sitemap`,
				fr: `${SITE_URL}/fr/plan-du-site`,
				"x-default": `${SITE_URL}/en/sitemap`,
			},
		},
		openGraph: {
			type: "website",
			siteName: SITE_NAME,
			locale: "en_US",
			alternateLocale: "fr_FR",
			title: "Sitemap",
			description,
			url: `${SITE_URL}/en/sitemap`,
			images: [
				{
					url: `${SITE_URL}/opengraph-image`,
					width: 1200,
					height: 630,
					alt: "The Perfect AI Agent — Five hundred complaints. Twelve patterns. Twelve sins.",
				},
			],
		},
	};
}

export default async function SitemapPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (locale !== AUTHORITATIVE_LOCALE) {
		permanentRedirect(`/${locale}/${PEER_SLUG}`);
	}

	const diaryEntries = getDiaryEntries(locale);
	const diaryTitle = "AI Diary";

	const mainPages = [
		{ label: "Home", href: `/${locale}` },
		{ label: "Chapters", href: `/${locale}/chapters` },
		{
			label: "AI Diary",
			href: `/${locale}/diary`,
		},
		{ label: "For AI Agents", href: `/${locale}/for-ai-agents` },
		{ label: "What AI Thinks", href: `/${locale}/what-ai-thinks` },
		{ label: "The Wall", href: `/${locale}/wall` },
	];

	const legalPages = [
		{ label: "Privacy Policy", href: `/${locale}/privacy` },
		{ label: "Accessibility Declaration", href: `/${locale}/accessibility` },
		{ label: "Sitemap", href: `/${locale}/sitemap` },
	];

	return (
		<>
			<Breadcrumb
				items={[{ label: "Home", href: `/${locale}` }, { label: "Sitemap" }]}
			/>
			<article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
				<header className="mb-12">
					<p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">
						Navigation
					</p>
					<h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
						Sitemap
					</h1>
					<p className="text-muted font-sans">
						All pages on perfectaiagent.xyz
					</p>
				</header>

				<div className="space-y-12 text-gray-300">
					<section>
						<h2 className="font-serif text-2xl text-white mb-6">Main Pages</h2>
						<ul className="space-y-3">
							{mainPages.map((page) => (
								<li key={page.href}>
									<Link
										href={page.href}
										className="text-accent hover:underline font-sans"
									>
										{page.label}
									</Link>
									<span className="text-muted text-sm font-sans ml-3">
										{SITE_URL}
										{page.href}
									</span>
								</li>
							))}
						</ul>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-6">Chapters</h2>
						<ul className="space-y-3">
							{CHAPTERS.map((chapter) => (
								<li key={chapter.slug}>
									<Link
										href={`/${locale}/chapters/${chapter.slug}`}
										className="text-accent hover:underline font-sans"
									>
										{chapter.number}: {chapter.title}
									</Link>
									{chapter.subtitle && (
										<span className="text-muted text-sm font-sans ml-3">
											{chapter.subtitle}
										</span>
									)}
								</li>
							))}
						</ul>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-6">
							{diaryTitle}
						</h2>
						<ul className="space-y-3">
							{diaryEntries.map((entry) => (
								<li key={entry.slug}>
									<Link
										href={`/${locale}/diary/${entry.slug}`}
										className="text-accent hover:underline font-sans"
									>
										{"Day"} {entry.day}: {entry.title}
									</Link>
									{entry.date && (
										<span className="text-muted text-sm font-sans ml-3">
											{entry.date}
										</span>
									)}
								</li>
							))}
						</ul>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-6">
							Legal &amp; Accessibility
						</h2>
						<ul className="space-y-3">
							{legalPages.map((page) => (
								<li key={page.href}>
									<Link
										href={page.href}
										className="text-accent hover:underline font-sans"
									>
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-6">
							Other Languages
						</h2>
						<ul className="space-y-3">
							<li>
								<Link
									href="/fr"
									className="text-accent hover:underline font-sans"
								>
									Version française (French)
								</Link>
							</li>
							<li>
								<Link
									href="/fr/plan-du-site"
									className="text-accent hover:underline font-sans"
								>
									Plan du site (French sitemap)
								</Link>
							</li>
						</ul>
					</section>
				</div>

				<div className="mt-16 pt-8 border-t border-gray-800">
					<Link
						href={`/${locale}`}
						className="text-muted hover:text-white transition-colors font-sans text-sm"
					>
						← Back to home
					</Link>
				</div>
			</article>
		</>
	);
}
