import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SITE_URL } from '@/lib/seo'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import WallCardPage from './WallCardPage'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'wall' })

  const title = `${t('title')} | Perfect AI Agent`
  const description = t('meta.description')

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/wall/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/wall/${id}`,
      siteName: 'Perfect AI Agent',
      type: 'article',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function WallCardRoute({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  return (
    <ConvexClientProvider>
      <WallCardPage locale={locale} id={id} />
    </ConvexClientProvider>
  )
}
