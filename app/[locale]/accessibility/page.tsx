import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const title = "Accessibility Declaration";
	const description = `Accessibility statement for ${SITE_NAME} — RGAA 4.1.2 compliance status and contact information.`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/en/accessibility`,
			languages: {
				en: `${SITE_URL}/en/accessibility`,
				fr: `${SITE_URL}/fr/accessibilite`,
				"x-default": `${SITE_URL}/en/accessibility`,
			},
		},
		openGraph: {
			type: "website",
			siteName: SITE_NAME,
			locale: "en_US",
			alternateLocale: "fr_FR",
			title,
			description,
			url: `${SITE_URL}/en/accessibility`,
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

export default async function AccessibilityPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	return (
		<>
			<Breadcrumb
				items={[
					{ label: "Home", href: `/${locale}` },
					{ label: "Accessibility Declaration" },
				]}
			/>
			<article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
				<header className="mb-12">
					<p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">
						Legal
					</p>
					<h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
						Accessibility Declaration
					</h1>
					<p className="text-muted font-sans">
						Published: March 18, 2026 — Last updated: March 18, 2026
					</p>
				</header>

				<div className="prose-chapter text-gray-300 space-y-8">
					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							Compliance Status
						</h2>
						<p>
							<strong className="text-white">perfectaiagent.xyz</strong> is{" "}
							<strong className="text-white">partially compliant</strong> with
							the Référentiel Général d&apos;Amélioration de
							l&apos;Accessibilité (RGAA) 4.1.2.
						</p>
						<p className="mt-3">
							Conformance rate: <strong className="text-accent">58%</strong> (31
							compliant criteria out of 53 applicable).
						</p>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							Technologies Used
						</h2>
						<ul className="list-disc pl-6 space-y-1 text-gray-400">
							<li>HTML5</li>
							<li>CSS3 (Tailwind CSS)</li>
							<li>JavaScript (Next.js 15, React)</li>
							<li>JSON-LD (Schema.org)</li>
						</ul>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							Pages Audited
						</h2>
						<ol className="list-decimal pl-6 space-y-1 text-gray-400">
							<li>
								Homepage — <code>/en</code> and <code>/fr</code>
							</li>
							<li>
								Chapters index — <code>/en/chapters</code>
							</li>
							<li>
								Chapter page — <code>/en/chapters/prologue</code> and{" "}
								<code>/fr/chapters/prologue</code>
							</li>
							<li>
								Privacy policy — <code>/en/privacy</code>
							</li>
						</ol>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							Non-Accessible Content
						</h2>
						<p>The following non-conformities have been identified:</p>
						<ol className="list-decimal pl-6 mt-3 space-y-2 text-gray-400">
							<li>
								<strong className="text-white">
									Email input without accessible label
								</strong>{" "}
								(RGAA 11.1, 11.2) — The newsletter email field lacked a
								programmatic label association.{" "}
								<span className="text-accent">Fixed March 18, 2026.</span>
							</li>
							<li>
								<strong className="text-white">No skip link</strong> (RGAA 12.7)
								— No bypass mechanism allowing keyboard users to skip
								navigation.{" "}
								<span className="text-accent">Fixed March 18, 2026.</span>
							</li>
							<li>
								<strong className="text-white">
									Insufficient colour contrast on secondary text
								</strong>{" "}
								(RGAA 3.2) — Some subtitle and caption text used colours with
								contrast ratios below the WCAG AA threshold of 4.5:1.
							</li>
							<li>
								<strong className="text-white">
									Inconsistent heading hierarchy
								</strong>{" "}
								(RGAA 9.1) — On the homepage, h2 elements appeared before the
								h1. On the chapters index, the heading hierarchy skipped h2.
							</li>
							<li>
								<strong className="text-white">
									Page title not translated on French pages
								</strong>{" "}
								(RGAA 8.6) — The &lt;title&gt; element remained in English on
								French-locale pages.
							</li>
							<li>
								<strong className="text-white">
									Partial server-side rendering on chapter pages
								</strong>{" "}
								(RGAA 8.3) — Chapter pages returned an HTML shell without a{" "}
								<code>lang</code> attribute before JavaScript hydration,
								affecting screen readers.
							</li>
						</ol>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">Exemptions</h2>
						<p>No exemptions are claimed.</p>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">Contact</h2>
						<p>
							If you cannot access content or a service on this site, you may
							contact us to be directed to an accessible alternative or to
							receive the content in another form.
						</p>
						<p className="mt-3">
							<strong className="text-white">Email:</strong>{" "}
							<a
								href="mailto:contact@perello.consulting"
								className="text-accent hover:underline"
							>
								contact@perello.consulting
							</a>
						</p>
						<p className="mt-1">
							<strong className="text-white">Site owner:</strong> Laurent
							Perello / ElPi Corp
						</p>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							Enforcement Procedure
						</h2>
						<p>
							If you report an accessibility deficiency and do not receive a
							satisfactory response within a reasonable time, you may escalate
							to the following authorities:
						</p>
						<ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
							<li>
								<a
									href="https://formulaire.defenseurdesdroits.fr"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Défenseur des droits — online form (opens in new window)"
									className="text-accent hover:underline"
								>
									Défenseur des droits — online form{" "}
									<span aria-hidden="true" className="text-muted text-sm">
										(opens in new window)
									</span>
								</a>
							</li>
							<li>
								<a
									href="https://www.defenseurdesdroits.fr/saisir/delegues"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Contact a regional delegate of the Défenseur des droits (opens in new window)"
									className="text-accent hover:underline"
								>
									Contact a regional delegate of the Défenseur des droits{" "}
									<span aria-hidden="true" className="text-muted text-sm">
										(opens in new window)
									</span>
								</a>
							</li>
							<li>
								By post (no stamp required):
								<br />
								<address className="not-italic mt-1 text-gray-400">
									Défenseur des droits
									<br />
									Libre réponse 71120
									<br />
									75342 Paris CEDEX 07
								</address>
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
