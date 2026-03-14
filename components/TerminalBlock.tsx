'use client'

import { useState } from 'react'

export default function TerminalBlock({
  content,
  copyable = false,
}: {
  content: string
  copyable?: boolean
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const lines = content.split('\n')

  return (
    <div className="relative group">
      <pre className="bg-[#0a0a0a] border border-gray-800 p-6 overflow-x-auto text-sm font-mono rounded">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line.startsWith('#') ? (
              <span className="text-amber-500">{line}</span>
            ) : (
              <span className="text-gray-300">{line}</span>
            )}
          </span>
        ))}
      </pre>
      {copyable && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 text-xs font-sans px-3 py-1.5 border border-gray-700 text-gray-400 hover:text-accent hover:border-accent transition-colors rounded"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </div>
  )
}
