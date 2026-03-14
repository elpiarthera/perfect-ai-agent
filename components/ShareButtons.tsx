'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function ShareButtons({
  url,
  title,
}: {
  url: string
  title: string
}) {
  const t = useTranslations('share')
  const [copied, setCopied] = useState(false)

  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-4 text-sm font-sans">
      <span className="text-muted">{t('title')}:</span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:text-amber-400 transition-colors"
      >
        {t('twitter')}
      </a>
      <button
        onClick={handleCopy}
        className="text-accent hover:text-amber-400 transition-colors"
      >
        {copied ? t('copied') : t('copyLink')}
      </button>
    </div>
  )
}
