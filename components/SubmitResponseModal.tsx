'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const MODEL_OPTIONS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Grok',
  'Perplexity',
  'Other',
]

interface SubmitResponseModalProps {
  open: boolean
  onClose: () => void
  locale: string
}

export default function SubmitResponseModal({ open, onClose, locale }: SubmitResponseModalProps) {
  const t = useTranslations('wall.modal')
  const [modelName, setModelName] = useState('')
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (responseText.length < 200) {
      setError(t('errorTooShort'))
      return
    }
    if (responseText.length > 50000) {
      setError(t('errorTooLong'))
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/submit-wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName, responseText }),
      })

      if (res.status === 429) {
        setError(t('errorRateLimit'))
        setSubmitting(false)
        return
      }

      if (!res.ok) {
        setError(t('errorGeneric'))
        setSubmitting(false)
        return
      }

      setSuccess(true)
    } catch {
      setError(t('errorGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    setModelName('')
    setResponseText('')
    setError('')
    setSuccess(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        {success ? (
          <div className="text-center py-8">
            <h3 className="font-serif text-2xl text-white mb-4">{t('successTitle')}</h3>
            <p className="text-gray-400 font-sans text-sm mb-6">{t('successMessage')}</p>
            <Link
              href={`/${locale}/wall`}
              onClick={handleClose}
              className="bg-accent text-black px-6 py-3 font-sans font-semibold hover:bg-amber-400 transition-colors inline-block"
            >
              {t('successCta')}
            </Link>
          </div>
        ) : (
          <>
            <h3 className="font-serif text-xl text-white mb-2">{t('title')}</h3>
            <p className="text-gray-400 font-sans text-sm mb-6">{t('description')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Model selector */}
              <div>
                <label className="block text-sm text-gray-300 font-sans mb-1.5">
                  {t('modelLabel')}
                </label>
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm font-sans focus:border-amber-500 focus:outline-none"
                >
                  <option value="" disabled>
                    {t('modelPlaceholder')}
                  </option>
                  {MODEL_OPTIONS.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Response textarea */}
              <div>
                <label className="block text-sm text-gray-300 font-sans mb-1.5">
                  {t('responseLabel')}
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  required
                  rows={10}
                  placeholder={t('responsePlaceholder')}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm font-sans focus:border-amber-500 focus:outline-none resize-y"
                />
                <p className="text-xs text-gray-500 font-sans mt-1">
                  {responseText.length} / 200 min
                </p>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm font-sans">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-accent text-black px-6 py-2.5 font-sans font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  {submitting ? t('submitting') : t('submit')}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="border border-gray-700 text-gray-400 px-6 py-2.5 font-sans hover:border-gray-500 hover:text-gray-300 transition-colors"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
