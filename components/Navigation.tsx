'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav')

  return (
    <nav className="border-b border-gray-800 px-6 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href={`/${locale}`} className="font-serif text-white hover:text-accent transition-colors min-h-[44px] flex items-center">
          Perfect AI Agent
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/chapters`}
            className="text-muted hover:text-white text-sm font-sans transition-colors min-h-[44px] px-3 flex items-center"
          >
            {t('chapters')}
          </Link>
          <Link
            href={`/${locale}/chapters/prologue`}
            className="bg-accent text-black text-sm font-sans font-semibold px-4 min-h-[44px] flex items-center hover:bg-amber-400 transition-colors"
          >
            {t('readFree')}
          </Link>
          <Link
            href={locale === 'en' ? '/fr' : '/en'}
            className="text-muted hover:text-white text-xs font-sans uppercase tracking-wider transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
