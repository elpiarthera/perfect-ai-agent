import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/seo'
import { CHAPTERS } from '@/lib/chapters'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    title: 'Sitemap',
    description: `Complete list of all pages on ${SITE_NAME}.`,
    alternates: {
      canonical: `${SITE_URL}/${locale}/sitemap`,
      languages: {
        en: `${SITE_URL}/en/sitemap`,
        fr: `${SITE_URL}/fr/plan-du-site`,
      },
    },
    openGraph: {
      type: 'website',
      title: 'Sitemap',
      description: `Complete list of all pages on ${SITE_NAME}.`,
      url: `${SITE_URL}/${locale}/sitemap`,
    },
  }
}

export default async function SitemapPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const mainPages = [
    { label: 'Home', href: `/${locale}` },
    { label: 'Chapters', href: `/${locale}/chapters` },
    { label: 'For AI Agents', href: `/${locale}/for-ai-agents` },
    { label: 'What AI Thinks', href: `/${locale}/what-ai-thinks` },
    { label: 'The Wall', href: `/${locale}/wall` },
  ]

  const legalPages = [
    { label: 'Privacy Policy', href: `/${locale}/privacy` },
    { label: 'Accessibility Declaration', href: `/${locale}/accessibility` },
    { label: 'Sitemap', href: `/${locale}/sitemap` },
  ]

  return (
    <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
      <header className="mb-12">
        <p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">Navigation</p>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
          Sitemap
        </h1>
        <p className="text-muted font-sans">All pages on perfectaiagent.xyz</p>
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
                  {SITE_URL}{page.href}
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
          <h2 className="font-serif text-2xl text-white mb-6">Legal &amp; Accessibility</h2>
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
          <h2 className="font-serif text-2xl text-white mb-6">Other Languages</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/fr" className="text-accent hover:underline font-sans">
                Version française (French)
              </Link>
            </li>
            <li>
              <Link href="/fr/plan-du-site" className="text-accent hover:underline font-sans">
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
  )
}
