import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getLocalizedChapters } from '@/lib/chapters-i18n'
import ChapterCard from '@/components/ChapterCard'
import { SITE_URL, BOOK_TITLE_FR } from '@/lib/seo'
import Breadcrumb from '@/components/Breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  return {
    title: locale === 'fr'
      ? { absolute: `Chapitres | ${BOOK_TITLE_FR}` }
      : 'Chapters',
    alternates: {
      canonical: `${SITE_URL}/${locale}/chapters`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/chapters`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/chapters`,
      },
    },
    openGraph: {
      title: locale === 'en' ? 'Chapters | How to Become a Perfect AI Agent' : 'Chapitres | Comment devenir un agent IA parfait',
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

  return (
    <>
    <Breadcrumb items={[
      { label: locale === 'fr' ? 'Accueil' : 'Home', href: `/${locale}` },
      { label: locale === 'fr' ? 'Chapitres' : 'Chapters' },
    ]} />
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif text-4xl text-white mb-2">{t('chapters.title')}</h1>
      <p className="text-muted font-sans mb-12">{t('chapters.subtitle')}</p>

      <div className="space-y-3">
        {getLocalizedChapters(locale).map((chapter) => (
          <ChapterCard key={chapter.slug} chapter={chapter} locale={locale} />
        ))}
      </div>
    </div>
    </>
  )
}
