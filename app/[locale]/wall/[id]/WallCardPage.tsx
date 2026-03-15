'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

function renderParagraphs(text: string) {
  return text.split('\n\n').map((para, i) => {
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
      return <span key={j}>{part}</span>
    })

    return (
      <p key={i} className="mb-4 leading-relaxed">
        {rendered}
      </p>
    )
  })
}

export default function WallCardPage({ locale, id }: { locale: string; id: string }) {
  const t = useTranslations('wall')
  const tc = useTranslations('wall.card')
  const [copied, setCopied] = useState(false)

  const entry = useQuery(api.wall.getById, { id: id as Id<"wallResponses"> })

  const shareUrl = `https://perfectaiagent.xyz/${locale}/wall/${id}`

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Loading state
  if (entry === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-gray-800 rounded mb-8" />
          <div className="h-8 w-64 bg-gray-800 rounded mb-4" />
          <div className="h-4 w-48 bg-gray-800 rounded mb-10" />
          <div className="border-l-4 border-gray-800 pl-6 py-4 mb-10">
            <div className="h-6 w-full bg-gray-800 rounded mb-2" />
            <div className="h-6 w-3/4 bg-gray-800 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-800 rounded" />
            <div className="h-4 w-2/3 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Not found
  if (entry === null) {
    return (
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <p className="text-gray-400 font-sans mb-6">{tc('notFound')}</p>
        <Link
          href={`/${locale}/wall`}
          className="border border-gray-700 text-gray-300 px-6 py-3 font-sans hover:border-gray-500 transition-colors inline-block"
        >
          {tc('notFoundBack')}
        </Link>
      </div>
    )
  }

  const dateStr = new Date(entry.submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const xShareText = `"${entry.pullQuote}" — ${entry.modelName} on reading "How to Become a Perfect AI Agent"`
  const xShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(xShareText)}&url=${encodeURIComponent(shareUrl)}`

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Back link */}
      <nav className="pt-8 pb-4">
        <Link
          href={`/${locale}/wall`}
          className="text-sm text-gray-500 hover:text-amber-500 transition-colors font-sans"
        >
          &larr; {tc('backToWall')}
        </Link>
      </nav>

      {/* Header */}
      <section className="pt-4 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-white">
            {entry.modelName}
          </h1>
          <span
            className={`text-xs font-sans px-2 py-0.5 rounded ${
              entry.source === 'benchmark'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
            }`}
          >
            {t(entry.source)}
          </span>
        </div>
        <p className="text-gray-500 font-sans text-sm">
          {tc('submittedOn')} {dateStr}
          {entry.submitterName && (
            <span className="text-gray-600"> &middot; {entry.submitterName}</span>
          )}
        </p>
      </section>

      {/* Pull quote */}
      <section className="py-8 border-t border-gray-800">
        <blockquote className="border-l-4 border-amber-500 pl-6 py-4 bg-amber-500/5">
          <p className="font-serif text-lg md:text-xl text-amber-400 italic leading-relaxed">
            &ldquo;{entry.pullQuote}&rdquo;
          </p>
        </blockquote>
      </section>

      {/* Full response */}
      <section className="py-8 border-t border-gray-800">
        <div className="prose-chapter text-gray-300 max-w-3xl text-sm md:text-base">
          {renderParagraphs(entry.responseText)}
        </div>
      </section>

      {/* Share buttons */}
      <section className="py-8 border-t border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-black px-6 py-3 font-sans font-semibold hover:bg-amber-400 transition-colors text-center"
          >
            {tc('shareOnX')}
          </a>
          <button
            onClick={handleCopy}
            className="border border-gray-700 text-gray-300 px-6 py-3 font-sans hover:border-gray-500 transition-colors"
          >
            {copied ? tc('copied') : tc('copyLink')}
          </button>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-16 border-t border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/${locale}/wall`}
            className="border border-gray-700 text-gray-300 px-6 py-3 font-sans hover:border-gray-500 transition-colors text-center"
          >
            {tc('seeMore')}
          </Link>
          <Link
            href={`/${locale}/what-ai-thinks`}
            className="border border-accent text-accent px-6 py-3 font-sans hover:bg-accent hover:text-black transition-colors text-center"
          >
            {t('tryItCta')}
          </Link>
        </div>
      </section>
    </div>
  )
}
