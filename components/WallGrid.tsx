'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import SubmitResponseModal from './SubmitResponseModal'

interface WallEntry {
  id: string
  modelName: string
  date: string
  pullQuote: string
  responseText: string
  source: 'benchmark' | 'community'
}

function WallCard({ entry }: { entry: WallEntry }) {
  const t = useTranslations('wall')
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-800 bg-surface/50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif text-lg text-white font-semibold">
          {entry.modelName}
        </h3>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-500 font-sans">{entry.date}</span>
          <span
            className={`text-xs font-sans px-2 py-0.5 rounded ${
              entry.source === 'benchmark'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
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

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-gray-500 hover:text-amber-500 transition-colors font-sans mt-auto self-start"
      >
        {expanded ? t('collapse') : t('readFull')}
      </button>
    </div>
  )
}

export default function WallGrid({ locale }: { locale: string }) {
  const t = useTranslations('wall')
  const [entries, setEntries] = useState<WallEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch('/wall-data.json')
      .then((res) => res.json())
      .then((data: WallEntry[]) => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      {/* Submit button */}
      <div className="mb-10">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-accent text-black px-6 py-3 font-sans font-semibold hover:bg-amber-400 transition-colors"
        >
          {t('submitButton')}
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-gray-500 font-sans text-sm py-12 text-center">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="text-gray-500 font-sans text-sm py-12 text-center">{t('noEntries')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
          {entries.map((entry) => (
            <WallCard key={entry.id} entry={entry} />
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
