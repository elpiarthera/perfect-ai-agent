'use client'

import { useState, useEffect } from 'react'
import EmailCapture from './EmailCapture'

export default function GatedContent({
  preview,
  locale,
  children,
}: {
  preview: string
  locale: string
  children?: React.ReactNode
}) {
  const [emailCaptured, setEmailCaptured] = useState(false)

  useEffect(() => {
    // Check cookie client-side
    const hasCookie = document.cookie.split(';').some((c) =>
      c.trim().startsWith('email_captured=true')
    )
    setEmailCaptured(hasCookie)
  }, [])

  // If email captured, show full content passed as children
  if (emailCaptured && children) {
    return (
      <div className="prose-chapter text-gray-300">
        {children}
      </div>
    )
  }

  // Show blurred preview + email capture
  const lines = preview.split('\n').filter(Boolean).slice(0, 6)

  return (
    <div>
      {/* Blurred preview */}
      <div className="prose-chapter text-gray-300 gated-blur pointer-events-none select-none mb-0">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* Email gate */}
      <div className="border-t border-gray-800 pt-16 mt-4">
        <EmailCapture locale={locale} />
      </div>
    </div>
  )
}
