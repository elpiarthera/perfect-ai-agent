import type { Metadata } from 'next'
import { locales } from '@/lib/i18n'
import {
  SITE_URL,
  SITE_NAME,
  BOOK_TITLE,
  BOOK_DESCRIPTION,
  AUTHOR,
  PUBLICATION_DATE,
} from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BOOK_TITLE,
    template: `%s | ${BOOK_TITLE}`,
  },
  description: BOOK_DESCRIPTION,
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
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
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'The Perfect AI Agent — Five hundred complaints. Twelve patterns. Twelve sins.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BOOK_TITLE,
    description: 'Five hundred complaints. Twelve patterns. Twelve sins.',
    images: [`${SITE_URL}/opengraph-image`],
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  other: {
    'citation_title': BOOK_TITLE,
    'citation_author': AUTHOR.name,
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
