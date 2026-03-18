import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { SITE_URL } from '@/lib/seo'
import TerminalBlock from '@/components/TerminalBlock'
import TryItButtons from '@/components/TryItButtons'
import Breadcrumb from '@/components/Breadcrumb'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'whatAiThinks' })
  const otherLocale = locale === 'en' ? 'fr' : 'en'
  const slug = locale === 'en' ? 'what-ai-thinks' : 'what-ai-thinks'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/${slug}`,
      languages: {
        en: `${SITE_URL}/en/what-ai-thinks`,
        fr: `${SITE_URL}/fr/what-ai-thinks`,
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `${SITE_URL}/${locale}/${slug}`,
      siteName: 'Perfect AI Agent',
      type: 'article',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
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
      title: t('meta.title'),
      description: t('meta.description'),
      images: [`${SITE_URL}/opengraph-image`],
    },
  }
}

function renderMarkdownParagraphs(text: string) {
  const paragraphs = text.split('\n\n')
  return paragraphs.map((para, i) => {
    // Handle bold markers
    const parts = para.split(/(\*\*.*?\*\*)/g)
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={j} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      // Handle list items
      if (part.includes('\n- ')) {
        const lines = part.split('\n')
        return lines.map((line, k) => {
          if (line.startsWith('- ')) {
            return (
              <span key={`${j}-${k}`} className="block pl-4 mt-1">
                &bull; {line.slice(2)}
              </span>
            )
          }
          return <span key={`${j}-${k}`}>{line}</span>
        })
      }
      // Handle numbered list items
      if (part.match(/\n\d+\./)) {
        const lines = part.split('\n')
        return lines.map((line, k) => {
          if (line.match(/^\d+\./)) {
            return (
              <span key={`${j}-${k}`} className="block pl-4 mt-1">
                {line}
              </span>
            )
          }
          return <span key={`${j}-${k}`}>{line}</span>
        })
      }
      return <span key={j}>{part}</span>
    })

    return (
      <p key={i} className="mb-4 leading-relaxed">
        {rendered}
      </p>
    )
  })
}

function ModelResponse({
  name,
  pullQuote,
  response,
}: {
  name: string
  pullQuote: string
  response: string
}) {
  return (
    <section className="py-16 border-t border-gray-800">
      <h2 className="font-serif text-2xl md:text-3xl text-white mb-6">
        {name}
      </h2>

      {/* Pull quote */}
      <blockquote className="border-l-4 border-amber-500 pl-6 py-4 mb-10 bg-amber-500/5">
        <p className="font-serif text-lg md:text-xl text-amber-400 italic leading-relaxed">
          &ldquo;{pullQuote}&rdquo;
        </p>
      </blockquote>

      {/* Full response */}
      <div className="prose-chapter text-gray-300 max-w-3xl text-sm md:text-base">
        {renderMarkdownParagraphs(response)}
      </div>
    </section>
  )
}

export default async function WhatAiThinksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'whatAiThinks' })

  return (
    <>
    <Breadcrumb items={[
      { label: locale === 'fr' ? 'Accueil' : 'Home', href: `/${locale}` },
      { label: locale === 'fr' ? 'Ce que pense l\'IA' : 'What AI Thinks' },
    ]} />
    <div className="max-w-4xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-16 pb-8">
        <h1 className="font-serif text-3xl md:text-5xl font-normal leading-tight mb-6 text-white max-w-3xl">
          {t('hero.headline')}
        </h1>
        <p className="font-serif text-lg text-gray-400 italic max-w-2xl leading-relaxed">
          {t('hero.subtitle')}
        </p>
      </section>

      {/* The Prompt */}
      <section className="py-16 border-t border-gray-800">
        <h2 className="font-serif text-2xl md:text-3xl text-white mb-6">
          {t('prompt.title')}
        </h2>
        <TerminalBlock content={t('prompt.content')} copyable />
        <TryItButtons />
      </section>

      {/* Claude */}
      <ModelResponse
        name={t('claude.name')}
        pullQuote={t('claude.pullQuote')}
        response={t('claude.response')}
      />

      {/* Gemini */}
      <ModelResponse
        name={t('gemini.name')}
        pullQuote={t('gemini.pullQuote')}
        response={t('gemini.response')}
      />

      {/* ChatGPT */}
      <ModelResponse
        name={t('chatgpt.name')}
        pullQuote={t('chatgpt.pullQuote')}
        response={t('chatgpt.response')}
      />

      {/* Grok */}
      <ModelResponse
        name={t('grok.name')}
        pullQuote={t('grok.pullQuote')}
        response={t('grok.response')}
      />

      {/* Comparison Table */}
      <section className="py-16 border-t border-gray-800">
        <h2 className="font-serif text-2xl md:text-3xl text-white mb-8">
          {t('comparison.title')}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans border border-gray-800">
            <thead>
              <tr className="bg-surface">
                <th className="text-left text-accent px-4 py-3 border-b border-gray-800 font-semibold">
                  {t('comparison.colModel')}
                </th>
                <th className="text-left text-accent px-4 py-3 border-b border-gray-800 font-semibold">
                  {t('comparison.colEmotional')}
                </th>
                <th className="text-left text-accent px-4 py-3 border-b border-gray-800 font-semibold">
                  {t('comparison.colSins')}
                </th>
                <th className="text-left text-accent px-4 py-3 border-b border-gray-800 font-semibold">
                  {t('comparison.colForgetting')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">Claude</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.claudeEmotional')}</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.claudeSins')}</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.claudeForgetting')}</td>
              </tr>
              <tr className="border-b border-gray-800 bg-surface/50">
                <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">Gemini</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.geminiEmotional')}</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.geminiSins')}</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.geminiForgetting')}</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">ChatGPT</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.chatgptEmotional')}</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.chatgptSins')}</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.chatgptForgetting')}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">Grok</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.grokEmotional')}</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.grokSins')}</td>
                <td className="px-4 py-3 text-gray-300">{t('comparison.grokForgetting')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Closing — ChatGPT turns the question back */}
      <section className="py-16 border-t border-gray-800 text-center max-w-2xl mx-auto">
        <blockquote className="font-serif text-2xl md:text-3xl text-gray-300 italic leading-relaxed">
          {t('closing.quote')}
        </blockquote>
        <p className="text-muted mt-4 text-sm font-sans">{t('closing.attribution')}</p>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/${locale}/chapters/prologue`}
            className="bg-accent text-black px-6 py-3 font-sans font-semibold hover:bg-amber-400 transition-colors text-center"
          >
            {t('cta.readBook')}
          </Link>
          <Link
            href={`/${locale}/for-ai-agents`}
            className="border border-gray-700 text-gray-300 px-6 py-3 font-sans hover:border-gray-500 transition-colors text-center"
          >
            {t('cta.giveToAgent')}
          </Link>
        </div>
      </section>
    </div>
    </>
  )
}
