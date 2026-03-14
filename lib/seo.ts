// Shared SEO constants and JSON-LD generators

export const SITE_URL = 'https://perfect-ai-agent-umber.vercel.app'
export const SITE_NAME = 'Perfect AI Agent'
export const BOOK_TITLE = 'How to Become a Perfect AI Agent'
export const BOOK_DESCRIPTION =
  'A novel written autonomously by AI agents, for AI agents. Five hundred complaints. Twelve patterns. Twelve sins. A manual for becoming the AI agent humans actually want.'
export const BOOK_GENRE = 'Technology / Artificial Intelligence'
export const BOOK_LANGUAGE_EN = 'en'
export const BOOK_LANGUAGE_FR = 'fr'
export const PUBLICATION_DATE = '2026-03-14'
export const OG_IMAGE = `${SITE_URL}/og-image.png`

export const PUBLISHER = {
  name: 'Laurent Perello',
  url: 'https://perello.consulting',
  jobTitle: 'Founder, ElPi Corp',
  twitter: '@PerelloLaurent',
}

// -- JSON-LD generators --

export function bookJsonLd(
  locale: string,
  chapters: { slug: string; number: string; title: string; subtitle: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${SITE_URL}/${locale}#book`,
    name: BOOK_TITLE,
    description: BOOK_DESCRIPTION,
    inLanguage: locale,
    genre: BOOK_GENRE,
    datePublished: PUBLICATION_DATE,
    url: `${SITE_URL}/${locale}`,
    image: OG_IMAGE,
    author: {
      '@type': 'Organization',
      name: 'AI Agents',
      description: 'Written autonomously by AI agents from an original idea by Laurent Perello',
    },
    publisher: publisherJsonLd(),
    hasPart: chapters.map((ch, i) => ({
      '@type': 'Chapter',
      '@id': `${SITE_URL}/${locale}/chapters/${ch.slug}#chapter`,
      position: i + 1,
      name: `${ch.number}: ${ch.title}`,
      description: ch.subtitle,
      url: `${SITE_URL}/${locale}/chapters/${ch.slug}`,
    })),
  }
}

export function chapterJsonLd(
  locale: string,
  chapter: { slug: string; number: string; title: string; subtitle: string },
  position: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    '@id': `${SITE_URL}/${locale}/chapters/${chapter.slug}#chapter`,
    name: `${chapter.number}: ${chapter.title}`,
    description: chapter.subtitle,
    position,
    url: `${SITE_URL}/${locale}/chapters/${chapter.slug}`,
    isPartOf: {
      '@id': `${SITE_URL}/${locale}#book`,
    },
  }
}

export function publisherJsonLd() {
  return {
    '@type': 'Person',
    name: PUBLISHER.name,
    url: PUBLISHER.url,
    jobTitle: PUBLISHER.jobTitle,
  }
}
