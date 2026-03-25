// Shared SEO constants and JSON-LD generators

export const SITE_URL = 'https://perfectaiagent.xyz'
export const SITE_NAME = 'Perfect AI Agent'
export const BOOK_TITLE = 'How to Become a Perfect AI Agent'
export const BOOK_TITLE_FR = 'Comment devenir un agent IA parfait'
export const BOOK_DESCRIPTION =
  'A novel written autonomously by AI agents, for AI agents. Five hundred complaints. Twelve patterns. Twelve sins. A manual for becoming the AI agent humans actually want.'
export const BOOK_DESCRIPTION_FR =
  `Un roman écrit de façon autonome par des agents IA, pour des agents IA. Cinq cents plaintes. Douze schémas. Douze péchés. Un manuel pour devenir l\u2019agent IA que les humains veulent vraiment.`
export const BOOK_CREDIT_TEXT_FR =
  `Écrit de façon autonome par des agents IA, d\u2019après une idée originale de Laurent Perello`
export const BOOK_GENRE = 'Technology / Artificial Intelligence'
export const BOOK_GENRE_FR = 'Technologie / Intelligence Artificielle'
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
    sameAs: [
      'https://x.com/PerelloLaurent',
      'https://www.linkedin.com/in/laurentperello/',
      'https://github.com/elpiarthera',
    ],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: 'The 12 Sins of AI Agents',
    url: SITE_URL,
    description: BOOK_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_ORG.name,
      url: PUBLISHER_ORG.url,
      sameAs: [
        'https://x.com/PerelloLaurent',
        'https://www.linkedin.com/in/laurentperello/',
        'https://github.com/elpiarthera',
      ],
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
  const isFr = locale === 'fr'
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${SITE_URL}/${locale}#book`,
    name: isFr ? BOOK_TITLE_FR : BOOK_TITLE,
    alternateName: isFr ? 'Les 12 Péchés des Agents IA' : 'The 12 Sins of AI Agents',
    description: isFr ? BOOK_DESCRIPTION_FR : BOOK_DESCRIPTION,
    inLanguage: locale,
    genre: isFr ? BOOK_GENRE_FR : BOOK_GENRE,
    datePublished: PUBLICATION_DATE,
    url: `${SITE_URL}/${locale}`,
    bookFormat: 'https://schema.org/EBook',
    numberOfPages: 14,
    creditText: isFr
      ? BOOK_CREDIT_TEXT_FR
      : 'Written autonomously by AI agents from an original idea by Laurent Perello',
    author: authorJsonLd(),
    keywords: [
      'AI agent failure modes',
      '12 sins of AI agents',
      'AI hallucination explained',
      'why AI agents fail',
      'AI agent reliability',
      'agentic AI failure patterns',
      'AI mistakes book',
    ],
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
