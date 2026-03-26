import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getDiaryEntries, getDiaryEntry, getDiaryContent } from '@/lib/diary'
import Breadcrumb from '@/components/Breadcrumb'
import ShareButtons from '@/components/ShareButtons'
import {
  BOOK_TITLE_FR,
  SITE_URL,
  AUTHOR,
  breadcrumbJsonLd,
  PUBLISHER_ORG,
} from '@/lib/seo'

export function generateStaticParams() {
  const entries = getDiaryEntries('en')
  return entries.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const entry = getDiaryEntry(slug, locale)
  if (!entry) return {}

  const otherLocale = locale === 'en' ? 'fr' : 'en'
  const isFr = locale === 'fr'
  const dayLabel = isFr ? `Jour ${entry.day}` : `Day ${entry.day}`
  const pageTitle = `${dayLabel}: ${entry.title}`
  const description = isFr
    ? `Journal IA — ${dayLabel}. Par ${entry.narrator === 'pi' ? 'Pi, l\'orchestrateur IA' : 'Laurent Perello'}.`
    : `AI Diary — ${dayLabel}. By ${entry.narrator === 'pi' ? 'Pi, the AI orchestrator' : 'Laurent Perello'}.`

  return {
    title: isFr
      ? { absolute: `${pageTitle} | ${BOOK_TITLE_FR}` }
      : pageTitle,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/diary/${slug}`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/diary/${slug}`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/diary/${slug}`,
        'x-default': `${SITE_URL}/en/diary/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: pageTitle,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      description,
      url: `${SITE_URL}/${locale}/diary/${slug}`,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'The Perfect AI Agent — Five hundred complaints. Twelve patterns. Twelve sins.',
        },
      ],
      tags: ['AI diary', 'AI agents', entry.narrator === 'pi' ? 'AI perspective' : 'founder perspective'],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
    other: {
      'citation_title': pageTitle,
      'citation_author': entry.narrator === 'pi' ? 'Pi (AI Orchestrator)' : AUTHOR.name,
      'citation_publication_date': entry.date,
    },
  }
}

/**
 * Strip the first heading from MDX content if it duplicates the entry title.
 */
function stripDuplicateHeading(mdxContent: string): string {
  const lines = mdxContent.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === '') continue
    if (line.startsWith('# ')) {
      lines.splice(i, 1)
      return lines.join('\n')
    }
    break
  }
  return mdxContent
}

export default async function DiaryEntryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const entry = getDiaryEntry(slug, locale)
  if (!entry) notFound()

  const rawContent = getDiaryContent(slug, locale)
  if (!rawContent) notFound()

  const content = stripDuplicateHeading(rawContent)

  const entries = getDiaryEntries(locale)
  const currentIndex = entries.findIndex((e) => e.slug === slug)
  // entries are sorted newest first, so "prev" is the next newer entry and "next" is the older one
  const newerEntry = currentIndex > 0 ? entries[currentIndex - 1] : null
  const olderEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null

  const isFr = locale === 'fr'
  const dayLabel = isFr ? `Jour ${entry.day}` : `Day ${entry.day}`

  const formattedDate = new Date(entry.date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const breadcrumbs = breadcrumbJsonLd([
    { name: isFr ? 'Accueil' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: isFr ? 'Journal IA' : 'AI Diary', url: `${SITE_URL}/${locale}/diary` },
    { name: `${dayLabel}: ${entry.title}`, url: `${SITE_URL}/${locale}/diary/${slug}` },
  ])

  const breadcrumbItems = [
    { label: isFr ? 'Accueil' : 'Home', href: `/${locale}` },
    { label: isFr ? 'Journal IA' : 'AI Diary', href: `/${locale}/diary` },
    { label: `${dayLabel}: ${entry.title}` },
  ]

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/${locale}/diary/${slug}#article`,
    headline: `Day ${entry.day}: ${entry.title}`,
    name: `Day ${entry.day}: ${entry.title}`,
    description: isFr
      ? `Journal IA — Jour ${entry.day}. Par ${entry.narrator === 'pi' ? 'Pi, l\'orchestrateur IA' : 'Laurent Perello'}.`
      : `AI Diary — Day ${entry.day}. By ${entry.narrator === 'pi' ? 'Pi, the AI orchestrator' : 'Laurent Perello'}.`,
    datePublished: entry.date,
    dateModified: entry.date,
    inLanguage: locale,
    url: `${SITE_URL}/${locale}/diary/${slug}`,
    mainEntityOfPage: `${SITE_URL}/${locale}/diary/${slug}`,
    author: entry.narrator === 'pi'
      ? { '@type': 'Person', name: 'Pi (AI Orchestrator)', description: 'Autonomous AI agent, ElPi Corp' }
      : { '@id': `${SITE_URL}/#author` },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_ORG.name,
      url: PUBLISHER_ORG.url,
    },
    isPartOf: { '@id': `${SITE_URL}/${locale}/diary#blog` },
    keywords: ['AI diary', 'AI agents', 'autonomous agents', entry.narrator === 'pi' ? 'AI perspective' : 'founder perspective'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <Breadcrumb items={breadcrumbItems} />
      <article className="max-w-3xl mx-auto px-6 pt-8 pb-24">
        {/* Entry header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-accent text-xs uppercase tracking-widest font-sans">
              {dayLabel}
            </p>
            <span
              className={`text-xs font-sans px-2 py-0.5 rounded-full ${
                entry.narrator === 'pi'
                  ? 'bg-accent/10 text-accent'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {entry.narrator === 'pi' ? 'Pi' : 'Laurent'}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
            {entry.title}
          </h1>
          <p className="text-muted font-sans text-sm">{formattedDate}</p>
        </header>

        {/* Entry content */}
        <div className="prose-chapter text-gray-300">
          <MDXRemote source={content} />
        </div>

        {/* Entry navigation */}
        <nav className="mt-16 pt-8 border-t border-gray-800 flex justify-between">
          {olderEntry ? (
            <Link
              href={`/${locale}/diary/${olderEntry.slug}`}
              className="text-muted hover:text-white transition-colors font-sans text-sm"
            >
              ← {isFr ? `Jour ${olderEntry.day}` : `Day ${olderEntry.day}`}
            </Link>
          ) : (
            <span />
          )}
          {newerEntry ? (
            <Link
              href={`/${locale}/diary/${newerEntry.slug}`}
              className="text-muted hover:text-white transition-colors font-sans text-sm"
            >
              {isFr ? `Jour ${newerEntry.day}` : `Day ${newerEntry.day}`} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        {/* Share buttons */}
        <div className="mt-8">
          <ShareButtons
            url={`${SITE_URL}/${locale}/diary/${slug}`}
            title={`${dayLabel}: ${entry.title}`}
          />
        </div>
      </article>
    </>
  )
}
