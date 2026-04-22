import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getDiaryEntries, getDiaryEntry, getDiaryContent } from '@/lib/diary'
import Breadcrumb from '@/components/Breadcrumb'
import ShareButtons from '@/components/ShareButtons'
import {
  SITE_URL,
  AUTHOR,
  breadcrumbJsonLd,
  PUBLISHER_ORG,
} from '@/lib/seo'
import DiaryAudioPlayer from '@/components/DiaryAudioPlayer'
import EmailCapture from '@/components/EmailCapture'
import VantagePeersBanner from '@/components/VantagePeersBanner'

/**
 * Truncate a string to a maximum byte-length without breaking mid-word.
 * Used to ensure meta titles stay <=60 chars and descriptions stay in 120-160 range.
 */
function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  const trimmed = str.slice(0, max - 1).replace(/\s+\S*$/, '')
  return `${trimmed}…`
}

/**
 * Build a diary meta description in the 120-160 char sweet spot.
 * Combines entry title + narrator attribution + book context.
 */
function buildDiaryDesc(args: {
  isFr: boolean
  dayLabel: string
  entryTitle: string
  narratorIsPi: boolean
}): string {
  const { isFr, dayLabel, entryTitle, narratorIsPi } = args
  const narrator = isFr
    ? narratorIsPi
      ? 'Pi, l\'orchestrateur IA'
      : 'Laurent Perello'
    : narratorIsPi
      ? 'Pi, the AI orchestrator'
      : 'Laurent Perello'
  const base = isFr
    ? `Journal IA — ${dayLabel} : ${entryTitle}. Par ${narrator}. Construire ElPi Corp, un jour à la fois.`
    : `AI Diary — ${dayLabel}: ${entryTitle}. By ${narrator}. Building ElPi Corp one day at a time.`
  // If above 160, truncate. If under 120, pad with book tagline.
  if (base.length > 160) return truncate(base, 160)
  if (base.length < 120) {
    const pad = isFr
      ? ' Cinq cents plaintes, douze péchés, un roman IA.'
      : ' Five hundred complaints, twelve sins, an AI novel.'
    const padded = base + pad
    return padded.length > 160 ? truncate(padded, 160) : padded
  }
  return base
}


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
  // Ahrefs T7: keep title <=60 chars. Truncate the composite title if needed,
  // and always use `absolute` so the root layout template doesn't append the
  // book name twice.
  const truncatedTitle = truncate(pageTitle, 60)
  const description = buildDiaryDesc({
    isFr,
    dayLabel,
    entryTitle: entry.title,
    narratorIsPi: entry.narrator === 'pi',
  })

  return {
    title: { absolute: truncatedTitle },
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

        {/* Audio player — fetches URL from Convex file storage */}
        <div className="mb-10">
          <DiaryAudioPlayer
            slug={slug}
            locale={locale}
            title={`${dayLabel}: ${entry.title}`}
            narrator={entry.narrator === 'pi' ? 'Pi' : 'Laurent Perello'}
          />
        </div>

        {/* Entry content */}
        <div className="prose-chapter text-gray-300">
          <MDXRemote source={content} />
        </div>

        {/* Entry navigation */}
        <nav className="mt-16 pt-8 border-t border-gray-800 flex justify-between flex-wrap gap-y-2">
          {olderEntry ? (
            <Link
              href={`/${locale}/diary/${olderEntry.slug}`}
              aria-label={`Previous entry: ${isFr ? `Jour ${olderEntry.day}` : `Day ${olderEntry.day}`}: ${olderEntry.title}`}
              className="text-muted hover:text-white transition-colors font-sans text-sm max-w-[48%]"
            >
              <span className="truncate block">← {isFr ? `Jour ${olderEntry.day}` : `Day ${olderEntry.day}`}</span>
            </Link>
          ) : (
            <span />
          )}
          {newerEntry ? (
            <Link
              href={`/${locale}/diary/${newerEntry.slug}`}
              aria-label={`Next entry: ${isFr ? `Jour ${newerEntry.day}` : `Day ${newerEntry.day}`}: ${newerEntry.title}`}
              className="text-muted hover:text-white transition-colors font-sans text-sm max-w-[48%]"
            >
              <span className="truncate block">{isFr ? `Jour ${newerEntry.day}` : `Day ${newerEntry.day}`} →</span>
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

        {/* Email capture */}
        <div className="mt-8">
          <EmailCapture locale={locale} />
        </div>

        {/* VantagePeers CTA */}
        <div className="mt-6">
          <VantagePeersBanner locale={locale} />
        </div>
      </article>
    </>
  )
}
