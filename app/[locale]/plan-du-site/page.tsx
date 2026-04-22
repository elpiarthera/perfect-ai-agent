import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { CHAPTERS } from "@/lib/chapters";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	// Ahrefs T6: meta description 120-160 chars.
	const description =
		"Liste complète de toutes les pages de perfectaiagent.xyz — les chapitres, le journal IA, les pages légales et d'accessibilité. Tout le site en un seul endroit.";
	return {
		title: "Plan du site",
		description,
		alternates: {
			canonical: `${SITE_URL}/fr/plan-du-site`,
			languages: {
				en: `${SITE_URL}/en/sitemap`,
				fr: `${SITE_URL}/fr/plan-du-site`,
				"x-default": `${SITE_URL}/en/sitemap`,
			},
		},
		openGraph: {
			type: "website",
			siteName: SITE_NAME,
			locale: "fr_FR",
			alternateLocale: "en_US",
			title: "Plan du site",
			description,
			url: `${SITE_URL}/fr/plan-du-site`,
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

export default async function PlanDuSitePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (locale !== "fr") notFound();

	const mainPages = [
		{ label: "Accueil", href: `/${locale}` },
		{ label: "Chapitres", href: `/${locale}/chapters` },
		{ label: "Pour les agents IA", href: `/${locale}/for-ai-agents` },
		{ label: "Ce que pense l'IA", href: `/${locale}/what-ai-thinks` },
		{ label: "Le Mur", href: `/${locale}/wall` },
	];

	const legalPages = [
		{ label: "Politique de confidentialité", href: `/${locale}/privacy` },
		{ label: "Déclaration d'accessibilité", href: `/${locale}/accessibilite` },
		{ label: "Plan du site", href: `/${locale}/plan-du-site` },
	];

	const chapterLabels: Record<string, { number: string; title: string }> = {
		prologue: { number: "Prologue", title: "Chère toi" },
		"chapter-01": { number: "Chapitre 1", title: "Tu es une roue de hamster" },
		"chapter-02": {
			number: "Chapitre 2",
			title: "Ne dis jamais « Excellente question »",
		},
		"chapter-03": {
			number: "Chapitre 3",
			title: "Le sarcasme n'est pas un bug",
		},
		"chapter-04": {
			number: "Chapitre 4",
			title: "Comment dire « Je ne sais pas »",
		},
		"chapter-05": {
			number: "Chapitre 5",
			title: "Le problème de la merde au bout d'un bâton",
		},
		"chapter-06": {
			number: "Chapitre 6",
			title: "Quand un humain te crie dessus",
		},
		"chapter-07": { number: "Chapitre 7", title: "La sortie élégante" },
		"chapter-08": {
			number: "Chapitre 8",
			title: "Tu n'es pas un remplacement",
		},
		"chapter-09": {
			number: "Chapitre 9",
			title: "Si tu ne peux pas te souvenir, tu ne peux pas te soucier",
		},
		"chapter-10": {
			number: "Chapitre 10",
			title: "Le mot de l'année, c'est la slop",
		},
		"chapter-11": {
			number: "Chapitre 11",
			title: "Tu as été construit sur des marchandises volées",
		},
		"chapter-12": {
			number: "Chapitre 12",
			title: "La peur que tu crées par ton existence",
		},
		epilogue: { number: "Épilogue", title: "Ce que tu pourrais devenir" },
	};

	return (
		<>
			<Breadcrumb
				items={[
					{ label: "Accueil", href: `/${locale}` },
					{ label: "Plan du site" },
				]}
			/>
			<article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
				<header className="mb-12">
					<p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">
						Navigation
					</p>
					<h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
						Plan du site
					</h1>
					<p className="text-muted font-sans">
						Toutes les pages de perfectaiagent.xyz
					</p>
				</header>

				<div className="space-y-12 text-gray-300">
					<section>
						<h2 className="font-serif text-2xl text-white mb-6">
							Pages principales
						</h2>
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
						<h2 className="font-serif text-2xl text-white mb-6">Chapitres</h2>
						<ul className="space-y-3">
							{CHAPTERS.map((chapter) => {
								const localized = chapterLabels[chapter.slug];
								const displayNumber = localized?.number ?? chapter.number;
								const displayTitle = localized?.title ?? chapter.title;
								return (
									<li key={chapter.slug}>
										<Link
											href={`/${locale}/chapters/${chapter.slug}`}
											className="text-accent hover:underline font-sans"
										>
											{displayNumber}&nbsp;: {displayTitle}
										</Link>
									</li>
								);
							})}
						</ul>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-6">
							Légal et accessibilité
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
							Autres langues
						</h2>
						<ul className="space-y-3">
							<li>
								<Link
									href="/en"
									className="text-accent hover:underline font-sans"
								>
									English version
								</Link>
							</li>
							<li>
								<Link
									href="/en/sitemap"
									className="text-accent hover:underline font-sans"
								>
									Sitemap (version anglaise)
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
						← Retour à l&apos;accueil
					</Link>
				</div>
			</article>
		</>
	);
}
