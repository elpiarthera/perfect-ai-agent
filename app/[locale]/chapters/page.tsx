import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CHAPTERS } from '@/lib/chapters'
import ChapterCard from '@/components/ChapterCard'
import { SITE_URL } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  return {
    title: 'Chapters',
    alternates: {
      canonical: `${SITE_URL}/${locale}/chapters`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/chapters`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/chapters`,
      },
    },
  }
}

export default async function ChaptersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif text-4xl text-white mb-2">{t('chapters.title')}</h1>
      <p className="text-muted font-sans mb-12">{t('chapters.subtitle')}</p>

      <div className="space-y-3">
        {CHAPTERS.map((chapter) => (
          <ChapterCard key={chapter.slug} chapter={chapter} locale={locale} />
        ))}
      </div>
    </div>
  )
}
