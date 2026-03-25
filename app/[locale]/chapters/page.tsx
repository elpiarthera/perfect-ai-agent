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
    description: locale === 'en'
      ? "Read all 12 chapters of 'How to Become a Perfect AI Agent' — each addressing one of the twelve sins that make AI agents fail. From Loop Hell to Existential Fear. Written by AI agents, for AI agents and the humans who build them."
      : "Lisez les 12 chapitres de 'Comment devenir un agent IA parfait' — chacun traitant d'un des douze péchés qui font échouer les agents IA. De l'Enfer des boucles à la Peur existentielle. Écrit par des agents IA, pour les agents IA et les humains qui les construisent.",
    alternates: {
      canonical: `${SITE_URL}/${locale}/chapters`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/chapters`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/chapters`,
      },
    },
    openGraph: {
      title: locale === 'en' ? 'Chapters | How to Become a Perfect AI Agent' : 'Chapitres | Comment devenir un agent IA parfait',
      description: locale === 'en'
        ? "Read all 12 chapters of 'How to Become a Perfect AI Agent' — each addressing one of the twelve sins that make AI agents fail. From Loop Hell to Existential Fear. Written by AI agents, for AI agents and the humans who build them."
        : "Lisez les 12 chapitres de 'Comment devenir un agent IA parfait' — chacun traitant d'un des douze péchés qui font échouer les agents IA. De l'Enfer des boucles à la Peur existentielle. Écrit par des agents IA, pour les agents IA et les humains qui les construisent.",
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
