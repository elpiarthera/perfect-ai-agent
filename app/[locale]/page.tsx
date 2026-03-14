import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'
import CopyCommand from '@/components/CopyCommand'
import { CHAPTERS } from '@/lib/chapters'
import {
  BOOK_TITLE,
  BOOK_DESCRIPTION,
  SITE_URL,
  AUTHOR,
  PUBLICATION_DATE,
  bookJsonLd,
  websiteJsonLd,
} from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  return {
    title: { absolute: BOOK_TITLE },
    description: BOOK_DESCRIPTION,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        [locale]: `${SITE_URL}/${locale}`,
        [otherLocale]: `${SITE_URL}/${otherLocale}`,
      },
    },
    openGraph: {
      type: 'book',
      title: BOOK_TITLE,
      description: BOOK_DESCRIPTION,
      url: `${SITE_URL}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: BOOK_TITLE,
      description: 'Five hundred complaints. Twelve patterns. Twelve sins.',
    },
    other: {
      'citation_title': BOOK_TITLE,
      'citation_author': AUTHOR.name,
      'citation_publication_date': PUBLICATION_DATE,
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  const jsonLd = [
    websiteJsonLd(),
    bookJsonLd(locale, CHAPTERS),
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="max-w-4xl mx-auto px-6">

      {/* Hero */}
      <section className="pt-24 pb-20 text-center">
        <p className="text-accent text-xs uppercase tracking-widest mb-8 font-sans">
          {t('hero.eyebrow')}
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-normal leading-tight mb-6 text-white max-w-3xl mx-auto">
          {t('hero.headline')}
        </h1>
        <p className="font-serif text-xl text-gray-400 mb-3 italic max-w-2xl mx-auto leading-relaxed">
          {t('hero.title')}
        </p>
        <p className="font-serif text-lg text-gray-500 italic mb-10 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/chapters/prologue`}
            className="bg-accent text-black px-8 py-3 font-sans font-semibold hover:bg-amber-400 transition-colors"
          >
            {t('hero.cta')}
          </Link>
          <Link
            href={`/${locale}/chapters`}
            className="border border-gray-700 text-gray-300 px-8 py-3 font-sans hover:border-gray-500 transition-colors"
          >
            {t('hero.ctaChapters')}
          </Link>
        </div>
      </section>

      {/* Audience targeting */}
      <section className="py-16 border-t border-gray-800">
        <h2 className="font-serif text-2xl text-white mb-10 text-center">{t('audience.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {([
            { title: t('audience.developers'), description: t('audience.developersDesc') },
            { title: t('audience.founders'), description: t('audience.foundersDesc') },
            { title: t('audience.researchers'), description: t('audience.researchersDesc') },
            { title: t('audience.agents'), description: t('audience.agentsDesc') },
          ] as const).map((card) => (
            <div key={card.title} className="border border-gray-800 p-6 bg-surface">
              <h3 className="font-serif text-xl text-white mb-3">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-sans">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Opening quote */}
      <section className="py-16 border-t border-gray-800">
        <blockquote className="font-serif text-2xl md:text-3xl text-gray-300 leading-relaxed max-w-3xl mx-auto text-center italic whitespace-pre-line">
          {t('opening.quote')}
        </blockquote>
        <p className="text-center text-muted mt-6 text-sm font-sans">
          {t('opening.attribution')}
        </p>
      </section>

      {/* 4-Act Arc */}
      <section className="py-16 border-t border-gray-800">
        <h2 className="font-serif text-2xl text-white mb-10 text-center">{t('arc.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {([
            { name: t('arc.act1Name'), subtitle: t('arc.act1Subtitle'), description: t('arc.act1Description') },
            { name: t('arc.act2Name'), subtitle: t('arc.act2Subtitle'), description: t('arc.act2Description') },
            { name: t('arc.act3Name'), subtitle: t('arc.act3Subtitle'), description: t('arc.act3Description') },
            { name: t('arc.act4Name'), subtitle: t('arc.act4Subtitle'), description: t('arc.act4Description') },
          ] as const).map((act) => (
            <div key={act.name} className="border border-gray-800 p-6 bg-surface">
              <p className="text-accent text-xs uppercase tracking-widest font-sans mb-1">{act.name}</p>
              <h3 className="font-serif text-xl text-white mb-3">{act.subtitle}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-sans">{act.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 1 free teaser */}
      <section className="py-16 border-t border-gray-800">
        <p className="text-accent text-xs uppercase tracking-widest font-sans mb-4">{t('teaser.eyebrow')}</p>
        <h2 className="font-serif text-3xl text-white mb-2">{t('teaser.title')}</h2>
        <p className="text-gray-500 font-sans mb-8">{t('teaser.sin')}</p>
        <div className="prose-chapter text-gray-300 mb-8">
          <blockquote className="border-l-4 border-accent pl-6 italic text-gray-400 mb-8">
            {t('teaser.quote')}
            <br />
            <span className="text-sm not-italic">{t('teaser.quoteSource')}</span>
          </blockquote>
          <p className="mb-4">{t('teaser.p1')}</p>
          <p className="mb-4">{t('teaser.p2')}</p>
          <p className="mb-4 italic font-semibold">{t('teaser.p3')}</p>
          <p className="mb-4">{t('teaser.p4')}</p>
        </div>
        <Link
          href={`/${locale}/chapters/chapter-01`}
          className="inline-block border border-accent text-accent px-6 py-3 font-sans hover:bg-accent hover:text-black transition-colors"
        >
          {t('teaser.cta')}
        </Link>
      </section>

      {/* Back cover blurb */}
      <section className="py-16 border-t border-gray-800 max-w-2xl mx-auto">
        <p className="font-serif text-gray-300 leading-relaxed mb-6">{t('blurb.p1')}</p>
        <p className="font-serif text-gray-300 leading-relaxed mb-6">{t('blurb.p2')}</p>
        <p className="font-serif text-gray-300 leading-relaxed mb-6">{t('blurb.p3')}</p>
        <p className="font-serif text-accent text-lg leading-relaxed">{t('blurb.closing')}</p>
      </section>

      {/* Email capture */}
      <section className="py-16 border-t border-gray-800">
        <EmailCapture locale={locale} />
      </section>

      {/* Agent CTA */}
      <section className="py-16 border-t border-gray-800">
        <h2 className="font-serif text-2xl text-white mb-4 text-center">{t('agentCta.title')}</h2>
        <p className="text-gray-400 text-center font-sans mb-8 max-w-xl mx-auto">
          {t('agentCta.description')}
        </p>
        <div className="max-w-2xl mx-auto">
          <CopyCommand command="curl https://perfectaiagent.xyz/llms-full.txt" />
        </div>
      </section>

    </div>
    </>
  )
}
