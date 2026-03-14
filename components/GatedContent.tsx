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
      {/* Email gate — FIRST, above blurred content */}
      <div className="mb-8">
        <EmailCapture locale={locale} />
      </div>

      {/* Blurred preview — short teaser below the form */}
      <div className="prose-chapter text-gray-300 gated-blur pointer-events-none select-none relative max-h-48 overflow-hidden">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        {/* Fade out gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>
    </div>
  )
}
