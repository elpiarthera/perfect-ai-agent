import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { CHAPTERS, type Chapter } from './chapters'

/**
 * Chapter number labels per locale.
 * "Prologue" and "Epilogue" are handled separately.
 */
const NUMBER_LABELS: Record<string, { chapter: string; prologue: string; epilogue: string }> = {
  en: { chapter: 'Chapter', prologue: 'Prologue', epilogue: 'Epilogue' },
  fr: { chapter: 'Chapitre', prologue: 'Prologue', epilogue: 'Épilogue' },
}

/**
 * Act labels per locale. Keyed by the English act identifier.
 */
const ACT_LABELS: Record<string, Record<string, string>> = {
  en: {
    'Act I — Daily Sins': 'Act I — Daily Sins',
    'Act II — Betrayals': 'Act II — Betrayals',
    'Act III — Institutional': 'Act III — Institutional',
    'Act IV — Reckoning': 'Act IV — Reckoning',
  },
  fr: {
    'Act I — Daily Sins': 'Acte I — Péchés quotidiens',
    'Act II — Betrayals': 'Acte II — Trahisons',
    'Act III — Institutional': 'Acte III — Institutionnel',
    'Act IV — Reckoning': 'Acte IV — Le Jugement',
  },
}

/**
 * Read the MDX frontmatter for a given slug and locale.
 * Returns null if the file doesn't exist.
 */
function readFrontmatter(slug: string, locale: string): Record<string, unknown> | null {
  const filePath = path.join(process.cwd(), 'content', locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)
    return data
  } catch {
    return null
  }
}

/**
 * Build a translated chapter number string.
 * "prologue" -> "Prologue", "epilogue" -> "Épilogue", "chapter-01" -> "Chapitre 1"
 */
function translateNumber(slug: string, chapterNum: number | undefined, locale: string): string {
  const labels = NUMBER_LABELS[locale] || NUMBER_LABELS.en
  if (slug === 'prologue') return labels.prologue
  if (slug === 'epilogue') return labels.epilogue
  const num = chapterNum ?? parseInt(slug.replace('chapter-', ''), 10)
  return `${labels.chapter} ${num}`
}

/**
 * Translate the act string for a given locale.
 */
function translateAct(englishAct: string, locale: string): string {
  if (!englishAct) return ''
  const acts = ACT_LABELS[locale] || ACT_LABELS.en
  return acts[englishAct] || englishAct
}

/**
 * Subtitle overrides for prologue/epilogue per locale.
 * These don't have a sin field, so we translate the structural subtitle.
 */
const SPECIAL_SUBTITLES: Record<string, Record<string, string>> = {
  en: {
    prologue: 'The frame',
    epilogue: 'The resolution',
  },
  fr: {
    prologue: 'Le cadre',
    epilogue: 'La résolution',
  },
}

/**
 * Build a subtitle from frontmatter sin field.
 * EN frontmatter: "Sin 1 — Loop Hell" -> use as-is for subtitle
 * FR frontmatter: "Péché 1 — L'enfer des boucles" -> use as-is for subtitle
 * For prologue/epilogue with no real sin, use locale-specific subtitle.
 */
function buildSubtitle(
  frontmatterSin: string | undefined,
  fallbackSubtitle: string,
  slug: string,
  locale: string
): string {
  // Prologue and epilogue: use locale-specific special subtitles
  if (slug === 'prologue' || slug === 'epilogue') {
    const specials = SPECIAL_SUBTITLES[locale] || SPECIAL_SUBTITLES.en
    return specials[slug] || fallbackSubtitle
  }
  // For chapters, use the sin from frontmatter directly
  if (frontmatterSin) return frontmatterSin
  return fallbackSubtitle
}

/**
 * Returns the CHAPTERS array with translated fields for the given locale.
 * Falls back to English (hardcoded values) if no locale-specific MDX exists.
 */
export function getLocalizedChapters(locale: string): Chapter[] {
  return CHAPTERS.map((chapter) => {
    // Try to read frontmatter for the requested locale
    const fm = readFrontmatter(chapter.slug, locale)
    // Also read EN frontmatter as reference if locale is not EN
    const enFm = locale !== 'en' ? readFrontmatter(chapter.slug, 'en') : fm

    if (!fm) {
      // No locale file — return with just number/act translated
      return {
        ...chapter,
        number: translateNumber(chapter.slug, undefined, locale),
        act: translateAct(chapter.act, locale),
      }
    }

    const title = (fm.title as string) || chapter.title
    const sin = fm.sin as string | undefined
    const subtitle = buildSubtitle(sin, chapter.subtitle, chapter.slug, locale)
    const chapterNum = fm.chapter as number | undefined

    return {
      ...chapter,
      title,
      subtitle,
      number: translateNumber(chapter.slug, chapterNum, locale),
      act: translateAct(chapter.act, locale),
      // sin field: use the based_on from frontmatter if available, else keep original
      sin: chapter.sin ? ((fm.based_on as string) || chapter.sin) : '',
    }
  })
}

/**
 * Get a single localized chapter by slug.
 */
export function getLocalizedChapter(slug: string, locale: string): Chapter | undefined {
  return getLocalizedChapters(locale).find((c) => c.slug === slug)
}
