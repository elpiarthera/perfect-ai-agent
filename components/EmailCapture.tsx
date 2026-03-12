'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function EmailCapture({ locale }: { locale: string }) {
  const t = useTranslations('gate')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })

      if (!res.ok) throw new Error('Subscription failed')

      setDone(true)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <p className="font-serif text-xl text-white mb-2">You're in.</p>
        <p className="text-gray-400 font-sans text-sm">All 12 chapters are now unlocked.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="font-serif text-3xl text-white mb-3">{t('headline')}</h2>
      <p className="text-gray-400 font-sans mb-8 leading-relaxed">{t('body')}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          required
          className="flex-1 bg-surface border border-gray-700 text-white px-4 py-3 font-sans focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-black font-sans font-semibold px-6 py-3 hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : t('button')}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm font-sans mt-3">{error}</p>}
      <p className="text-muted text-xs font-sans mt-4">{t('privacy')}</p>
    </div>
  )
}
