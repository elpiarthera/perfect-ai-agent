import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getDiaryEntries } from '@/lib/diary'
import DiaryCard from '@/components/DiaryCard'
import { SITE_URL, BOOK_TITLE_FR, PUBLISHER_ORG } from '@/lib/seo'
import Breadcrumb from '@/components/Breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  const isFr = locale === 'fr'

  const title = isFr ? 'Journal IA' : 'AI Diary'
  // Ahrefs T6: meta descriptions 120-160 chars.
  const description = isFr
    ? 'Journal quotidien de la construction d\'ElPi Corp — par Laurent Perello et Pi, l\'orchestrateur IA. Une entreprise, jour après jour.'
    : 'Daily log of building ElPi Corp — by Laurent Perello and Pi, the AI orchestrator. One founder, one AI, one company, one day at a time.'

  return {
    title: isFr
      ? { absolute: `${title} | ${BOOK_TITLE_FR}` }
      : title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/diary`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/diary`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/diary`,
        'x-default': `${SITE_URL}/en/diary`,
      },
    },
    openGraph: {
      title: isFr ? `Journal IA | ${BOOK_TITLE_FR}` : 'AI Diary | How to Become a Perfect AI Agent',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      description,
      url: `${SITE_URL}/${locale}/diary`,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'The Perfect AI Agent — Five hundred complaints. Twelve patterns. Twelve sins.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`${SITE_URL}/opengraph-image`],
    },
  }
}

export default async function DiaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const entries = getDiaryEntries(locale)

  const isFr = locale === 'fr'

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/${locale}/diary#blog`,
    name: isFr ? 'Journal IA — Le Parfait Agent IA' : 'AI Diary — The Perfect AI Agent',
    description: isFr
      ? 'Journal quotidien de la construction d\'ElPi Corp — par Laurent Perello et Pi, l\'orchestrateur IA. Une entreprise, jour après jour.'
      : 'Daily log of building ElPi Corp — by Laurent Perello and Pi, the AI orchestrator. One founder, one AI, one company, one day at a time.',
    url: `${SITE_URL}/${locale}/diary`,
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_ORG.name,
      url: PUBLISHER_ORG.url,
    },
    blogPost: entries.slice(0, 5).map((entry) => ({
      '@type': 'BlogPosting',
      headline: `${isFr ? 'Jour' : 'Day'} ${entry.day}: ${entry.title}`,
      url: `${SITE_URL}/${locale}/diary/${entry.slug}`,
      datePublished: entry.date,
    })),
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
    <Breadcrumb items={[
      { label: locale === 'fr' ? 'Accueil' : 'Home', href: `/${locale}` },
      { label: t('diary.title') },
    ]} />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24">
      <h1 className="font-serif text-4xl text-white mb-2">{t('diary.title')}</h1>
      <p className="text-muted font-sans mb-12">{t('diary.subtitle')}</p>

      <div className="space-y-3">
        {entries.map((entry) => (
          <DiaryCard key={entry.slug} entry={entry} locale={locale} />
        ))}
      </div>
    </div>
    </>
  )
}
