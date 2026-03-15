'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Navigation({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)

  const links = [
    { href: `/${locale}/chapters`, label: t('chapters') },
    { href: `/${locale}/for-ai-agents`, label: t('forAgents') },
    { href: `/${locale}/what-ai-thinks`, label: t('whatAiThinks') },
    { href: `/${locale}/wall`, label: t('wall') },
    { href: `/${locale}/chapters/prologue`, label: t('readFree'), accent: true },
  ]

  return (
    <nav className="border-b border-gray-800 px-6 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href={`/${locale}`} className="font-serif text-white hover:text-accent transition-colors min-h-[44px] flex items-center shrink-0">
          Perfect AI Agent
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.accent
                  ? 'bg-accent text-black text-sm font-sans font-semibold px-4 min-h-[44px] flex items-center hover:bg-amber-400 transition-colors'
                  : 'text-muted hover:text-white text-sm font-sans transition-colors min-h-[44px] px-3 flex items-center'
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={locale === 'en' ? '/fr' : '/en'}
            className="text-muted hover:text-white text-xs font-sans uppercase tracking-wider transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </Link>
        </div>

        {/* Mobile: language + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href={locale === 'en' ? '/fr' : '/en'}
            className="text-muted hover:text-white text-xs font-sans uppercase tracking-wider transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="text-muted hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Menu"
          >
            {open ? (
              <span className="text-xl leading-none">&times;</span>
            ) : (
              <span className="text-xl leading-none">&#9776;</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-gray-800 mt-2 pt-2 pb-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                link.accent
                  ? 'block bg-accent text-black text-sm font-sans font-semibold px-4 py-3 hover:bg-amber-400 transition-colors text-center'
                  : 'block text-muted hover:text-white text-sm font-sans transition-colors px-4 py-3'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
