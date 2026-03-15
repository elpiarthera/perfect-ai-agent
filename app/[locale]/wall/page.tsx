import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SITE_URL } from '@/lib/seo'
import WallGrid from '@/components/WallGrid'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'wall' })

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/wall`,
      languages: {
        en: `${SITE_URL}/en/wall`,
        fr: `${SITE_URL}/fr/wall`,
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `${SITE_URL}/${locale}/wall`,
      siteName: 'Perfect AI Agent',
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}

export default async function WallPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'wall' })

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-16 pb-8">
        <h1 className="font-serif text-3xl md:text-5xl font-normal leading-tight mb-4 text-white max-w-3xl">
          {t('title')}
        </h1>
        <p className="font-serif text-lg text-gray-400 italic max-w-2xl leading-relaxed">
          {t('subtitle')}
        </p>
      </section>

      <WallGrid locale={locale} />
    </div>
  )
}
