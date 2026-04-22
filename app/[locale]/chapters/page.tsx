import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getLocalizedChapters } from '@/lib/chapters-i18n'
import ChapterCard from '@/components/ChapterCard'
import { SITE_URL, BOOK_TITLE_FR, BOOK_TITLE, breadcrumbJsonLd } from '@/lib/seo'
import Breadcrumb from '@/components/Breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  // Ahrefs T6: meta descriptions 120-160 chars.
  const description = locale === 'en'
    ? "Read all 12 chapters of 'How to Become a Perfect AI Agent' — each addressing one of the twelve sins that make AI agents fail real humans."
    : "Lisez les 12 chapitres de 'Comment devenir un agent IA parfait' — chacun traite l'un des douze péchés qui font échouer les agents IA face aux humains."
  return {
    title: locale === 'fr'
      ? { absolute: `Chapitres | ${BOOK_TITLE_FR}` }
      : 'Chapters',
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/chapters`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/chapters`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/chapters`,
        'x-default': `${SITE_URL}/en/chapters`,
      },
    },
    openGraph: {
      title: locale === 'en' ? 'Chapters | How to Become a Perfect AI Agent' : 'Chapitres | Comment devenir un agent IA parfait',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      description,
      url: `${SITE_URL}/${locale}/chapters`,
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

export default async function ChaptersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const isFr = locale === 'fr'

  const chapters = getLocalizedChapters(locale)

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/${locale}/chapters#toc`,
    name: isFr ? `Table des matières — ${BOOK_TITLE_FR}` : `Table of Contents — ${BOOK_TITLE}`,
    description: isFr ? '14 chapitres sur les douze péchés des agents IA' : '14 chapters addressing the twelve sins of AI agents',
    numberOfItems: chapters.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    isPartOf: { '@id': `${SITE_URL}/${locale}#book` },
    itemListElement: chapters.map((ch, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${ch.number}: ${ch.title}`,
      url: `${SITE_URL}/${locale}/chapters/${ch.slug}`,
    })),
  }

  const breadcrumbs = breadcrumbJsonLd([
    { name: isFr ? 'Accueil' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: isFr ? 'Chapitres' : 'Chapters', url: `${SITE_URL}/${locale}/chapters` },
  ])

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    <Breadcrumb items={[
      { label: locale === 'fr' ? 'Accueil' : 'Home', href: `/${locale}` },
      { label: locale === 'fr' ? 'Chapitres' : 'Chapters' },
    ]} />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24">
      <h1 className="font-serif text-4xl text-white mb-2">{t('chapters.title')}</h1>
      <p className="text-muted font-sans mb-12">{t('chapters.subtitle')}</p>

      <div className="space-y-3">
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.slug} chapter={chapter} locale={locale} />
        ))}
      </div>
    </div>
    </>
  )
}
