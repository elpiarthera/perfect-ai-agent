'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function CopyCommand({ command }: { command: string }) {
  const t = useTranslations('agentCta')
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="relative group">
      <pre className="bg-[#0d0d0d] border border-gray-800 p-4 pr-16 overflow-x-auto text-sm font-mono text-gray-300 rounded">
        <code>{command}</code>
      </pre>
      <button
        onClick={handleCopy}
        aria-label={copied ? t('copied') : 'Copy to clipboard'}
        className="absolute top-3 right-3 text-xs font-sans px-3 py-1.5 border border-gray-700 text-gray-400 hover:text-accent hover:border-accent transition-colors rounded"
      >
        {copied ? t('copied') : 'Copy'}
      </button>
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {copied ? t('copied') : ''}
      </span>
    </div>
  )
}
