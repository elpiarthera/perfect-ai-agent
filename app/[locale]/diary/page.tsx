import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getDiaryEntries } from '@/lib/diary'
import DiaryCard from '@/components/DiaryCard'
import { SITE_URL, BOOK_TITLE_FR } from '@/lib/seo'
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
  const description = isFr
    ? 'Journal quotidien de la construction d\'ElPi Corp — par Laurent Perello et Pi, l\'orchestrateur IA.'
    : 'Daily log of building ElPi Corp — by Laurent Perello and Pi, the AI orchestrator.'

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
      },
    },
    openGraph: {
      title: isFr ? `Journal IA | ${BOOK_TITLE_FR}` : 'AI Diary | How to Become a Perfect AI Agent',
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

  return (
    <>
    <Breadcrumb items={[
      { label: locale === 'fr' ? 'Accueil' : 'Home', href: `/${locale}` },
      { label: t('diary.title') },
    ]} />
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
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
