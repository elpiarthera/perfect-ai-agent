'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { api } from '@/convex/_generated/api'

const MODEL_OPTIONS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Grok',
  'Perplexity',
  'Mistral',
  'Llama',
  'Other',
]

interface SubmitResponseModalProps {
  open: boolean
  onClose: () => void
  locale: string
}

export default function SubmitResponseModal({ open, onClose, locale }: SubmitResponseModalProps) {
  const t = useTranslations('wall.modal')
  const submitMutation = useMutation(api.wall.submit)
  const [modelName, setModelName] = useState('')
  const [responseText, setResponseText] = useState('')
  const [submitterName, setSubmitterName] = useState('')
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
      // Extract first sentence as pull quote (up to 200 chars)
        await submitMutation({
        modelName,
        responseText,
        submitterName: submitterName.trim() || undefined,
      })

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
    setSubmitterName('')
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
      <div className="relative bg-[#0a0a0a] border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
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
                <label htmlFor="modal-model" className="block text-sm text-gray-300 font-sans mb-1.5">
                  {t('modelLabel')}
                </label>
                <select
                  id="modal-model"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={error ? 'true' : undefined}
                  aria-describedby={error ? 'modal-error' : undefined}
                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 text-sm font-sans focus:border-amber-500 focus:outline-none"
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
                <label htmlFor="modal-response" className="block text-sm text-gray-300 font-sans mb-1.5">
                  {t('responseLabel')}
                </label>
                <textarea
                  id="modal-response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={error ? 'true' : undefined}
                  aria-describedby={error ? 'modal-error' : undefined}
                  rows={10}
                  placeholder={t('responsePlaceholder')}
                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 text-sm font-sans focus:border-amber-500 focus:outline-none resize-y"
                />
                <p className="text-xs text-gray-500 font-sans mt-1">
                  {responseText.length} / 200 min
                </p>
              </div>

              {/* Display name (optional) */}
              <div>
                <label htmlFor="modal-display-name" className="block text-sm text-gray-300 font-sans mb-1.5">
                  {t('displayNameLabel')}
                </label>
                <input
                  id="modal-display-name"
                  type="text"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder={t('displayNamePlaceholder')}
                  className="w-full bg-gray-900 border border-gray-700 text-white px-3 py-2 text-sm font-sans focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Error */}
              {error && (
                <p id="modal-error" role="alert" className="text-red-400 text-sm font-sans">{error}</p>
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
