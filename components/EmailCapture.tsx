'use client'

import { useState } from 'react'

interface EmailCaptureProps {
  locale: string
}

export default function EmailCapture({ locale }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const isFr = locale === 'fr'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        const data = await res.json()
        setErrorMessage(data.error || (isFr ? 'Une erreur est survenue.' : 'Something went wrong.'))
        setStatus('error')
      }
    } catch {
      setErrorMessage(isFr ? 'Une erreur est survenue.' : 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-gray-800 bg-surface p-6 font-sans">
        <p className="text-accent text-sm">
          {isFr ? 'Inscrit ! On vous notifiera.' : "Subscribed! We'll notify you."}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-surface p-6 font-sans">
      <h3 className="text-gray-300 text-sm font-medium mb-3">
        {isFr
          ? 'Soyez notifie quand le prochain chapitre sort'
          : 'Get notified when the next chapter drops'}
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 rounded-lg border border-gray-800 bg-transparent px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:border-accent focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {status === 'loading'
            ? (isFr ? 'Envoi...' : 'Sending...')
            : (isFr ? 'Recevoir' : 'Get notified')}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-red-400 text-xs">{errorMessage}</p>
      )}
    </div>
  )
}
