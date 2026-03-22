import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type DiaryEntry = {
  slug: string
  day: number
  title: string
  date: string
  narrator: 'laurent' | 'pi'
  wordCount: number
  status: string
}

/**
 * Read all diary entries for a given locale, sorted newest first.
 * Falls back to English frontmatter if the locale file doesn't exist.
 */
export function getDiaryEntries(locale: string): DiaryEntry[] {
  const dirPath = path.join(process.cwd(), 'content', locale, 'diary')
  const enDirPath = path.join(process.cwd(), 'content', 'en', 'diary')

  // Use locale dir if it exists, otherwise fall back to English
  const sourceDir = fs.existsSync(dirPath) ? dirPath : enDirPath
  if (!fs.existsSync(sourceDir)) return []

  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.mdx'))

  const entries: DiaryEntry[] = files
    .map((file) => {
      const filePath = path.join(sourceDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(raw)

      if (data.status !== 'final') return null

      const slug = file.replace('.mdx', '')
      return {
        slug,
        day: data.day as number,
        title: data.title as string,
        date: data.date as string,
        narrator: data.narrator as 'laurent' | 'pi',
        wordCount: data.word_count as number,
        status: data.status as string,
      }
    })
    .filter((e): e is DiaryEntry => e !== null)

  // Sort newest first
  entries.sort((a, b) => b.day - a.day)

  return entries
}

/**
 * Get a single diary entry by slug for a given locale.
 */
export function getDiaryEntry(slug: string, locale: string): DiaryEntry | undefined {
  return getDiaryEntries(locale).find((e) => e.slug === slug)
}

/**
 * Read the MDX content for a diary entry.
 * Falls back to English if locale file doesn't exist.
 */
export function getDiaryContent(slug: string, locale: string): string | null {
  const filePath = path.join(process.cwd(), 'content', locale, 'diary', `${slug}.mdx`)
  const enPath = path.join(process.cwd(), 'content', 'en', 'diary', `${slug}.mdx`)

  let content = ''
  try {
    content = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, 'utf-8')
      : fs.readFileSync(enPath, 'utf-8')
  } catch {
    return null
  }

  const { content: mdxContent } = matter(content)
  return mdxContent
}
