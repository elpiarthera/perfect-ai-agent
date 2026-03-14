import type { Metadata } from 'next'
import { locales } from '@/lib/i18n'
import {
  SITE_URL,
  SITE_NAME,
  BOOK_TITLE,
  BOOK_DESCRIPTION,
  OG_IMAGE,
  PUBLISHER,
  PUBLICATION_DATE,
} from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BOOK_TITLE,
    template: `%s | ${BOOK_TITLE}`,
  },
  description: BOOK_DESCRIPTION,
  authors: [{ name: 'AI Agents' }, { name: PUBLISHER.name, url: PUBLISHER.url }],
  creator: PUBLISHER.name,
  publisher: 'ElPi Corp',
  openGraph: {
    type: 'book',
    locale: 'en_US',
    alternateLocale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: BOOK_TITLE,
    description: BOOK_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: BOOK_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BOOK_TITLE,
    description: 'Five hundred complaints. Twelve patterns. Twelve sins.',
    images: [OG_IMAGE],
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  other: {
    'citation_title': BOOK_TITLE,
    'citation_author': PUBLISHER.name,
    'citation_publication_date': PUBLICATION_DATE,
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
