'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { useTranslations } from 'next-intl'
import { api } from '@/convex/_generated/api'
import type { Doc } from '@/convex/_generated/dataModel'
import SubmitResponseModal from './SubmitResponseModal'

type FilterType = 'all' | 'benchmark' | 'community'

function WallCard({ entry, locale }: { entry: Doc<"wallResponses">; locale: string }) {
  const t = useTranslations('wall')
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = `https://perfectaiagent.xyz/${locale}/wall/${entry._id}`

  function handleShare() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const dateStr = new Date(entry.submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="border border-gray-800 bg-[#111] rounded p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif text-lg text-white font-bold">
          {entry.modelName}
        </h3>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400 font-sans">{dateStr}</span>
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
      </div>

      {/* Pull quote */}
      <blockquote className="border-l-2 border-amber-500/50 pl-4 mb-4">
        <p className="font-serif text-sm text-amber-400/80 italic leading-relaxed">
          &ldquo;{entry.pullQuote}&rdquo;
        </p>
      </blockquote>

      {/* Expand/collapse */}
      {expanded && (
        <div className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap font-sans">
          {entry.responseText}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-auto pt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-gray-400 hover:text-amber-500 transition-colors font-sans"
        >
          {expanded ? t('collapse') : t('readFull')}
        </button>
        <button
          onClick={handleShare}
          className="text-sm text-gray-400 hover:text-amber-500 transition-colors font-sans"
          title="Copy share link"
        >
          {copied ? '✓ Copied!' : 'Share'}
        </button>
      </div>
    </article>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border border-gray-800 bg-[#111] rounded p-6 animate-pulse">
          <div className="flex justify-between mb-4">
            <div className="h-5 w-28 bg-gray-800 rounded" />
            <div className="h-4 w-20 bg-gray-800 rounded" />
          </div>
          <div className="border-l-2 border-gray-800 pl-4 mb-4">
            <div className="h-4 w-full bg-gray-800 rounded mb-2" />
            <div className="h-4 w-3/4 bg-gray-800 rounded" />
          </div>
          <div className="h-4 w-24 bg-gray-800 rounded" />
        </div>
      ))}
    </div>
  )
}

export default function WallGrid({ locale }: { locale: string }) {
  const t = useTranslations('wall')
  const entries = useQuery(api.wall.list)
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')

  const loading = entries === undefined

  const filtered = entries?.filter((entry) => {
    if (filter === 'all') return true
    return entry.source === filter
  })

  return (
    <>
      {/* Controls: submit + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 border-t border-gray-800 pt-8">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-accent text-black px-6 py-3 font-sans font-semibold hover:bg-amber-400 transition-colors"
        >
          {t('submitButton')}
        </button>

        {/* Filter tabs */}
        <div className="flex gap-1 font-sans text-sm">
          {(['all', 'benchmark', 'community'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 transition-colors ${
                filter === f
                  ? 'text-amber-400 border-b-2 border-amber-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t(f === 'all' ? 'filterAll' : f === 'benchmark' ? 'filterBenchmark' : 'filterCommunity')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : !filtered || filtered.length === 0 ? (
        <div className="text-gray-500 font-sans text-sm py-12 text-center">{t('noEntries')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {filtered.map((entry) => (
            <WallCard key={entry._id} entry={entry} locale={locale} />
          ))}
        </div>
      )}

      {/* Submit modal */}
      <SubmitResponseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        locale={locale}
      />
    </>
  )
}
