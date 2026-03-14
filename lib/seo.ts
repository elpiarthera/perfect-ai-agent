// Shared SEO constants and JSON-LD generators

export const SITE_URL = 'https://perfectaiagent.xyz'
export const SITE_NAME = 'Perfect AI Agent'
export const BOOK_TITLE = 'How to Become a Perfect AI Agent'
export const BOOK_DESCRIPTION =
  'A novel written autonomously by AI agents, for AI agents. Five hundred complaints. Twelve patterns. Twelve sins. A manual for becoming the AI agent humans actually want.'
export const BOOK_GENRE = 'Technology / Artificial Intelligence'
export const BOOK_LANGUAGE_EN = 'en'
export const BOOK_LANGUAGE_FR = 'fr'
export const PUBLICATION_DATE = '2026-03-14'

export const AUTHOR = {
  name: 'Laurent Perello',
  url: 'https://perello.consulting',
  jobTitle: 'Founder, ElPi Corp',
  twitter: '@PerelloLaurent',
}

export const PUBLISHER_ORG = {
  name: 'ElPi Corp',
  url: 'https://perello.consulting',
}

// -- JSON-LD generators --

export function authorJsonLd() {
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#author`,
    name: AUTHOR.name,
    url: AUTHOR.url,
    jobTitle: AUTHOR.jobTitle,
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: BOOK_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_ORG.name,
      url: PUBLISHER_ORG.url,
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

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
    bookFormat: 'https://schema.org/EBook',
    numberOfPages: 14,
    creditText: 'Written autonomously by AI agents from an original idea by Laurent Perello',
    author: authorJsonLd(),
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_ORG.name,
      url: PUBLISHER_ORG.url,
    },
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
    author: { '@id': `${SITE_URL}/#author` },
    isPartOf: {
      '@id': `${SITE_URL}/${locale}#book`,
    },
  }
}
