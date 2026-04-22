import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { SITE_URL } from '@/lib/seo'
import Breadcrumb from '@/components/Breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  // Ahrefs T6: meta description 120-160 chars.
  const description = locale === 'en'
    ? "About Laurent Perello and ElPi Corp — the team behind 'How to Become a Perfect AI Agent'. 25+ years in tech, now building AI agents."
    : "À propos de Laurent Perello et ElPi Corp — derrière 'Comment devenir un agent IA parfait'. 25+ ans dans la tech, maintenant agents IA."
  return {
    title: 'About',
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/about`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/about`,
        'x-default': `${SITE_URL}/en/about`,
      },
    },
    openGraph: {
      title: locale === 'en' ? 'About | How to Become a Perfect AI Agent' : 'À propos | Comment devenir un agent IA parfait',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      description,
      url: `${SITE_URL}/${locale}/about`,
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

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  // Try locale version, fall back to EN
  const localePath = path.join(process.cwd(), 'content', locale, 'about-website.mdx')
  const enPath = path.join(process.cwd(), 'content', 'en', 'about-website.mdx')
  const content = fs.existsSync(localePath)
    ? fs.readFileSync(localePath, 'utf-8')
    : fs.readFileSync(enPath, 'utf-8')

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#author`,
    name: 'Laurent Perello',
    jobTitle: 'Founder, ElPi Corp',
    url: 'https://perello.consulting',
    description:
      "Technology leader with 25+ years in enterprise IT. Founder of ElPi Corp. Author of 'How to Become a Perfect AI Agent' — a novel written autonomously by AI agents about the twelve failure patterns that make AI fail humans.",
    knowsAbout: [
      'AI agent systems',
      'autonomous agents',
      'AI failure patterns',
      'enterprise architecture',
      'digital transformation',
    ],
    sameAs: [
      'https://x.com/PerelloLaurent',
      'https://www.linkedin.com/in/laurentperello/',
      'https://github.com/elpiarthera',
    ],
    worksFor: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'ElPi Corp',
    },
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
    />
    <Breadcrumb items={[
      { label: locale === 'fr' ? 'Accueil' : 'Home', href: `/${locale}` },
      { label: locale === 'fr' ? 'À propos' : 'About' },
    ]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-24">
      <div className="prose prose-lg prose-invert prose-chapter">
        <MDXRemote source={content} />
      </div>
      <div className="mt-12 pt-8 border-t border-gray-800">
        <Link
          href={`/${locale}/chapters/prologue`}
          className="bg-accent text-black px-8 py-3 font-sans font-semibold hover:bg-amber-400 transition-colors w-full sm:w-auto text-center"
        >
          {t('about.cta')}
        </Link>
      </div>
    </div>
    </>
  )
}
