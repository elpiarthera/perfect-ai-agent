import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const SITE_URL = 'https://perfect-ai-agent-umber.vercel.app'

const BOOK_META = {
  title: 'The Perfect AI Agent',
  author: 'Laurent Perello',
  description:
    'A novel written autonomously by AI agents, for AI agents. Five hundred complaints. Twelve patterns. Twelve sins. A manual for becoming the AI agent humans actually want.',
}

const CHAPTER_FILES = [
  'prologue',
  'chapter-01',
  'chapter-02',
  'chapter-03',
  'chapter-04',
  'chapter-05',
  'chapter-06',
  'chapter-07',
  'chapter-08',
  'chapter-09',
  'chapter-10',
  'chapter-11',
  'chapter-12',
  'epilogue',
]

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function stripMdx(content: string): string {
  return content
    // Remove import statements
    .replace(/^import\s+.*$/gm, '')
    // Remove JSX/MDX components
    .replace(/<[^>]+\/>/g, '')
    .replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '')
    // Remove markdown headers
    .replace(/^#{1,6}\s+.*$/gm, '')
    // Remove markdown bold/italic
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    // Remove markdown links, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove blockquotes marker
    .replace(/^>\s?/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Collapse multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function getChapterData(slug: string, locale: string, includeBody: boolean) {
  const contentDir = path.join(process.cwd(), 'content', locale)
  const filePath = path.join(contentDir, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data: frontmatter, content } = matter(raw)

  const plainText = stripMdx(content)
  const position = CHAPTER_FILES.indexOf(slug)

  const chapter: Record<string, unknown> = {
    slug,
    title: frontmatter.title || slug,
    subtitle: frontmatter.based_on || null,
    sin: frontmatter.sin || null,
    summary: plainText.slice(0, 200).trim() + (plainText.length > 200 ? '...' : ''),
    url: `${SITE_URL}/${locale}/chapters/${slug}`,
    position: position >= 0 ? position : null,
    locale,
  }

  if (includeBody) {
    chapter.body = plainText
    chapter.word_count = frontmatter.word_count || null
    chapter.status = frontmatter.status || null
  }

  return chapter
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale') || 'en'
  const slug = searchParams.get('slug')

  if (!['en', 'fr'].includes(locale)) {
    return NextResponse.json(
      { error: 'Invalid locale. Supported: en, fr' },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  // Single chapter mode
  if (slug) {
    if (!CHAPTER_FILES.includes(slug)) {
      return NextResponse.json(
        { error: `Chapter not found: ${slug}` },
        { status: 404, headers: CORS_HEADERS }
      )
    }

    const chapter = getChapterData(slug, locale, true)
    if (!chapter) {
      return NextResponse.json(
        { error: `Chapter not found for locale: ${locale}` },
        { status: 404, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(
      {
        book: { ...BOOK_META, totalChapters: CHAPTER_FILES.length, locale },
        chapter,
      },
      { headers: CORS_HEADERS }
    )
  }

  // All chapters mode
  const chapters = CHAPTER_FILES
    .map((s) => getChapterData(s, locale, false))
    .filter(Boolean)

  return NextResponse.json(
    {
      book: { ...BOOK_META, totalChapters: CHAPTER_FILES.length, locale },
      chapters,
    },
    { headers: CORS_HEADERS }
  )
}
