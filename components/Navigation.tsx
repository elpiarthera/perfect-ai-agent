'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav')

  return (
    <nav className="border-b border-gray-800 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href={`/${locale}`} className="font-serif text-white hover:text-accent transition-colors">
          Perfect AI Agent
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}/chapters`}
            className="text-muted hover:text-white text-sm font-sans transition-colors"
          >
            {t('chapters')}
          </Link>
          <Link
            href={`/${locale}/chapters/prologue`}
            className="bg-accent text-black text-sm font-sans font-semibold px-4 py-1.5 hover:bg-amber-400 transition-colors"
          >
            {t('readFree')}
          </Link>
          <Link
            href={locale === 'en' ? '/fr' : '/en'}
            className="text-muted hover:text-white text-xs font-sans uppercase tracking-wider transition-colors"
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
