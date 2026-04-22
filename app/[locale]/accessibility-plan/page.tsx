import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const title = "Digital Accessibility Multi-Year Plan 2026–2028";
	const description = `Multi-year accessibility plan for ${SITE_NAME} — RGAA 4.1.2 compliance roadmap and governance for 2026–2028.`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/en/accessibility-plan`,
			languages: {
				en: `${SITE_URL}/en/accessibility-plan`,
				fr: `${SITE_URL}/fr/schema-accessibilite`,
				"x-default": `${SITE_URL}/en/accessibility-plan`,
			},
		},
		openGraph: {
			type: "website",
			title,
			description,
			url: `${SITE_URL}/en/accessibility-plan`,
		},
	};
}

export default async function AccessibilityPlanPage({
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
					{ label: "Accessibility", href: `/${locale}/accessibility` },
					{ label: "Multi-Year Plan" },
				]}
			/>
			<article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
				<header className="mb-12">
					<p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">
						Legal
					</p>
					<h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
						Digital Accessibility Multi-Year Plan
					</h1>
					<p className="text-accent font-sans font-medium">2026–2028</p>
					<p className="text-muted font-sans mt-2">
						Published: March 18, 2026 — Last updated: March 18, 2026
					</p>
				</header>

				<div className="prose-chapter text-gray-300 space-y-10">
					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							1. Mission and Regulatory Context
						</h2>
						<p>
							This multi-year plan is published in compliance with{" "}
							<strong className="text-white">
								Article 47 of Law No. 2005-102 of February 11, 2005
							</strong>{" "}
							for equal rights and opportunities, participation and citizenship
							of persons with disabilities, as amended by Law No. 2016-1321 of
							October 7, 2016 for a Digital Republic.
						</p>
						<p className="mt-3">
							The law requires public communication services and certain private
							organisations to make their digital content accessible. As a
							publicly accessible website distributing a work of cultural and
							educational value,{" "}
							<strong className="text-white">perfectaiagent.xyz</strong> commits
							to full compliance with the{" "}
							<strong className="text-white">
								Référentiel Général d&apos;Amélioration de l&apos;Accessibilité
								(RGAA) 4.1.2
							</strong>
							.
						</p>
						<p className="mt-3">
							This plan covers the period{" "}
							<strong className="text-white">2026 to 2028</strong> and is
							updated annually. It is complemented by the{" "}
							<Link
								href={`/${locale}/accessibility`}
								className="text-accent hover:underline"
							>
								Accessibility Declaration
							</Link>{" "}
							published separately.
						</p>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							2. Accessibility Policy
						</h2>
						<p>
							<strong className="text-white">perfectaiagent.xyz</strong>,
							published by ElPi Corp, is committed to making its website
							accessible to all users, regardless of disability status or
							assistive technology used.
						</p>
						<p className="mt-3">Our policy rests on three commitments:</p>
						<ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
							<li>
								<strong className="text-white">Continuous improvement</strong> —
								accessibility issues are treated as defects, not deferred
								features. All new pages meet RGAA 4.1.2 before publication.
							</li>
							<li>
								<strong className="text-white">Transparency</strong> —
								compliance status, audit results, and remediation progress are
								published openly on this site.
							</li>
							<li>
								<strong className="text-white">Responsiveness</strong> — any
								accessibility complaint receives a substantive response within 5
								business days.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							3. Current Status
						</h2>
						<p>
							As of <strong className="text-white">March 2026</strong>,
							perfectaiagent.xyz has achieved{" "}
							<strong className="text-accent">full conformity</strong> with RGAA
							4.1.2.
						</p>
						<div className="mt-4 p-4 border border-gray-700 rounded bg-gray-900">
							<dl className="space-y-2 font-sans text-sm">
								<div className="flex justify-between">
									<dt className="text-muted">Conformance rate</dt>
									<dd className="text-accent font-medium">
										100% (53/53 criteria met)
									</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted">Reference framework</dt>
									<dd className="text-white">RGAA 4.1.2</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted">Audit method</dt>
									<dd className="text-white">Automated AI audit pipeline</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted">Last full audit</dt>
									<dd className="text-white">March 18, 2026</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted">Next scheduled audit</dt>
									<dd className="text-white">June 2026 (quarterly)</dd>
								</div>
							</dl>
						</div>
						<p className="mt-4">
							See the{" "}
							<Link
								href={`/${locale}/accessibility`}
								className="text-accent hover:underline"
							>
								full Accessibility Declaration
							</Link>{" "}
							for a detailed breakdown of audited pages and resolved issues.
						</p>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							4. Governance
						</h2>
						<p>
							perfectaiagent.xyz is operated as a{" "}
							<strong className="text-white">sole-operator structure</strong>.
							Accessibility is managed directly by the publisher.
						</p>
						<div className="mt-4 p-4 border border-gray-700 rounded bg-gray-900 font-sans text-sm space-y-2">
							<div className="flex gap-3">
								<span className="text-muted w-44 shrink-0">
									Accessibility officer
								</span>
								<span className="text-white">Laurent Perello, ElPi Corp</span>
							</div>
							<div className="flex gap-3">
								<span className="text-muted w-44 shrink-0">
									Technical implementation
								</span>
								<span className="text-white">
									AI-assisted audit pipeline (VantageOS)
								</span>
							</div>
							<div className="flex gap-3">
								<span className="text-muted w-44 shrink-0">Contact</span>
								<a
									href="mailto:contact@perello.consulting"
									className="text-accent hover:underline"
								>
									contact@perello.consulting
								</a>
							</div>
						</div>
						<p className="mt-4 text-sm text-gray-400">
							The audit pipeline automatically runs RGAA checks on every
							deployment. Results are reviewed manually before any new page is
							published.
						</p>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							5. Year 1 Action Plan — 2026
						</h2>
						<p className="text-sm text-muted mb-4">
							Objective: maintain 100% RGAA 4.1.2 conformity across all pages.
						</p>
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="border-b border-gray-700">
									<th className="text-left py-2 pr-4 text-white font-sans font-medium">
										Action
									</th>
									<th className="text-left py-2 pr-4 text-white font-sans font-medium">
										Timeline
									</th>
									<th className="text-left py-2 text-white font-sans font-medium">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="text-gray-400 divide-y divide-gray-800">
								<tr>
									<td className="py-2 pr-4">
										Quarterly RGAA 4.1.2 re-audits on all existing pages
									</td>
									<td className="py-2 pr-4">Q2, Q3, Q4 2026</td>
									<td className="py-2 text-accent">Planned</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										Accessibility check on every new page before publication
									</td>
									<td className="py-2 pr-4">Ongoing</td>
									<td className="py-2 text-green-400">Active</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										Monitor RGAA 5 draft publication and announce transition
										timeline
									</td>
									<td className="py-2 pr-4">Q3 2026</td>
									<td className="py-2 text-accent">Planned</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										Update Accessibility Declaration to reflect audit results
									</td>
									<td className="py-2 pr-4">After each audit</td>
									<td className="py-2 text-green-400">Active</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										Respond to all accessibility complaints within 5 business
										days
									</td>
									<td className="py-2 pr-4">Ongoing</td>
									<td className="py-2 text-green-400">Active</td>
								</tr>
							</tbody>
						</table>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							6. Year 2 Action Plan — 2027
						</h2>
						<p className="text-sm text-muted mb-4">
							Objective: migrate to RGAA 5 when published; maintain coverage for
							all new pages.
						</p>
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="border-b border-gray-700">
									<th className="text-left py-2 pr-4 text-white font-sans font-medium">
										Action
									</th>
									<th className="text-left py-2 pr-4 text-white font-sans font-medium">
										Timeline
									</th>
									<th className="text-left py-2 text-white font-sans font-medium">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="text-gray-400 divide-y divide-gray-800">
								<tr>
									<td className="py-2 pr-4">
										RGAA 5 gap analysis against current site
									</td>
									<td className="py-2 pr-4">Q1 2027 (if RGAA 5 published)</td>
									<td className="py-2 text-muted">Pending RGAA 5</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										RGAA 5 migration for all existing pages
									</td>
									<td className="py-2 pr-4">Q2 2027</td>
									<td className="py-2 text-muted">Pending RGAA 5</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										Expand automated audit pipeline to cover RGAA 5 criteria
									</td>
									<td className="py-2 pr-4">Q1–Q2 2027</td>
									<td className="py-2 text-muted">Pending RGAA 5</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										Accessibility compliance for all new pages (RGAA 5)
									</td>
									<td className="py-2 pr-4">From Q3 2027</td>
									<td className="py-2 text-muted">Planned</td>
								</tr>
							</tbody>
						</table>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">
							7. Year 3 Action Plan — 2028
						</h2>
						<p className="text-sm text-muted mb-4">
							Objective: full RGAA 5 conformity with assistive technology
							validation.
						</p>
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr className="border-b border-gray-700">
									<th className="text-left py-2 pr-4 text-white font-sans font-medium">
										Action
									</th>
									<th className="text-left py-2 pr-4 text-white font-sans font-medium">
										Timeline
									</th>
									<th className="text-left py-2 text-white font-sans font-medium">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="text-gray-400 divide-y divide-gray-800">
								<tr>
									<td className="py-2 pr-4">
										Manual testing with NVDA + Chrome and VoiceOver + Safari
									</td>
									<td className="py-2 pr-4">Q1 2028</td>
									<td className="py-2 text-muted">Planned</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										Full RGAA 5 audit with third-party verification
									</td>
									<td className="py-2 pr-4">Q2 2028</td>
									<td className="py-2 text-muted">Planned</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										Publish updated Accessibility Declaration with 2028 results
									</td>
									<td className="py-2 pr-4">Q2 2028</td>
									<td className="py-2 text-muted">Planned</td>
								</tr>
								<tr>
									<td className="py-2 pr-4">
										Publish next three-year plan (2029–2031)
									</td>
									<td className="py-2 pr-4">Q4 2028</td>
									<td className="py-2 text-muted">Planned</td>
								</tr>
							</tbody>
						</table>
					</section>

					<section>
						<h2 className="font-serif text-2xl text-white mb-4">8. Contact</h2>
						<p>
							To report an accessibility issue, request content in an
							alternative format, or ask questions about this plan:
						</p>
						<ul className="list-none mt-3 space-y-2">
							<li>
								<strong className="text-white">Email:</strong>{" "}
								<a
									href="mailto:contact@perello.consulting"
									className="text-accent hover:underline"
								>
									contact@perello.consulting
								</a>
							</li>
							<li>
								<strong className="text-white">Publisher:</strong> Laurent
								Perello / ElPi Corp
							</li>
						</ul>
						<p className="mt-4">
							If you do not receive a satisfactory response, you may contact the{" "}
							<a
								href="https://formulaire.defenseurdesdroits.fr"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Défenseur des droits — online form (opens in new window)"
								className="text-accent hover:underline"
							>
								Défenseur des droits{" "}
								<span aria-hidden="true" className="text-muted text-sm">
									(opens in new window)
								</span>
							</a>
							.
						</p>
					</section>
				</div>

				<div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-6 text-sm">
					<Link
						href={`/${locale}/accessibility`}
						className="text-muted hover:text-white transition-colors font-sans"
					>
						← Accessibility Declaration
					</Link>
					<Link
						href={`/${locale}`}
						className="text-muted hover:text-white transition-colors font-sans"
					>
						← Back to home
					</Link>
				</div>
			</article>
		</>
	);
}
