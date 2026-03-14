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
        <NextIntlClientProvider messages={messages}>
          <Navigation locale={locale} />
          <main>{children}</main>
          <footer className="border-t border-gray-800 mt-24 py-8 text-center text-muted text-sm">
            <p>Published by Laurent Perello — 2026</p>
          </footer>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
