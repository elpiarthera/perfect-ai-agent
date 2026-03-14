import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { SITE_URL } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  return {
    title: 'About',
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/about`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/about`,
      },
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  // Try locale version, fall back to EN
  const localePath = path.join(process.cwd(), 'content', locale, 'about-website.mdx')
  const enPath = path.join(process.cwd(), 'content', 'en', 'about-website.mdx')
  const content = fs.existsSync(localePath)
    ? fs.readFileSync(localePath, 'utf-8')
    : fs.readFileSync(enPath, 'utf-8')

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
      <div className="prose prose-lg prose-invert prose-chapter">
        <MDXRemote source={content} />
      </div>
      <div className="mt-12 pt-8 border-t border-gray-800">
        <Link
          href={`/${locale}/chapters/prologue`}
          className="bg-accent text-black px-8 py-3 font-sans font-semibold hover:bg-amber-400 transition-colors"
        >
          {t('about.cta')}
        </Link>
      </div>
    </div>
  )
}
