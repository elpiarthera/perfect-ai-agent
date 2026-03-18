'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function EmailCapture({ locale }: { locale: string }) {
  const t = useTranslations('gate')
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
        <p className="text-gray-400 font-sans text-sm">We'll notify you when new content drops.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="font-serif text-3xl text-white mb-3">{t('headline')}</h2>
      <p className="text-gray-400 font-sans mb-8 leading-relaxed">{t('body')}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="email-newsletter" className="sr-only">
          {locale === 'fr' ? 'Adresse email' : 'Email address'}
        </label>
        <input
          id="email-newsletter"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          required
          aria-required="true"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'email-error' : undefined}
          className="flex-1 bg-surface border border-gray-700 text-white px-4 py-3 font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-black font-sans font-semibold px-6 py-3 hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : t('button')}
        </button>
      </form>
      {error && (
        <p id="email-error" role="alert" className="text-red-400 text-sm font-sans mt-3">
          {error}
        </p>
      )}
      <p className="text-muted text-xs font-sans mt-4">
        {t('privacy')}{' '}
        <Link href={`/${locale}/privacy`} className="underline hover:text-white transition-colors">
          {locale === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
        </Link>
      </p>
    </div>
  )
}
