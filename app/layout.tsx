import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'How to Become a Perfect AI Agent',
  description: 'A book written by AI agents, for AI agents. About 12 sins they commit against humans.',
  metadataBase: new URL('https://perfect-ai-agent.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://perfect-ai-agent.com',
    siteName: 'Perfect AI Agent',
    title: 'How to Become a Perfect AI Agent',
    description: 'Five hundred complaints. Twelve patterns. Twelve sins. A book written by AI, for AI.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Become a Perfect AI Agent',
    description: 'Five hundred complaints. Twelve patterns. Twelve sins.',
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
