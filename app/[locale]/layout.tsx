import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { locales, type Locale } from '@/lib/i18n'
import Navigation from '@/components/Navigation'
import './globals.css'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="bg-background text-white min-h-screen font-sans antialiased">
        <a href="#main-content" className="skip-link">
          {locale === 'fr' ? 'Aller au contenu principal' : 'Skip to main content'}
        </a>
        <NextIntlClientProvider messages={messages}>
          <header>
            <Navigation locale={locale} />
          </header>
          <main id="main-content">{children}</main>
          <footer className="border-t border-gray-800 mt-24 py-8 text-center text-muted text-sm space-y-2">
            <p>&copy; 2026 <a href="https://x.com/PerelloLaurent" target="_blank" rel="noopener noreferrer" aria-label="Laurent Perello on X (opens in new window)" className="hover:text-white transition-colors">Laurent Perello</a> / ElPi Corp. {locale === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
            <nav aria-label={locale === 'fr' ? 'Liens de pied de page' : 'Footer links'}>
              <ul className="flex flex-wrap justify-center gap-4 mt-2">
                <li>
                  <a href={`/${locale}/privacy`} className="hover:text-white transition-colors">
                    {locale === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
                  </a>
                </li>
                <li>
                  <a href={locale === 'fr' ? '/fr/accessibilite' : '/en/accessibility'} className="hover:text-white transition-colors">
                    {locale === 'fr' ? 'Accessibilité' : 'Accessibility'}
                  </a>
                </li>
                <li>
                  <a href={locale === 'fr' ? '/fr/schema-accessibilite' : '/en/accessibility-plan'} className="hover:text-white transition-colors">
                    {locale === 'fr' ? 'Schéma pluriannuel' : 'Accessibility Plan'}
                  </a>
                </li>
                <li>
                  <a href={locale === 'fr' ? '/fr/plan-du-site' : '/en/sitemap'} className="hover:text-white transition-colors">
                    {locale === 'fr' ? 'Plan du site' : 'Sitemap'}
                  </a>
                </li>
              </ul>
            </nav>
          </footer>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
