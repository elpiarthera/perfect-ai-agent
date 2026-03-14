import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BASE_URL = 'https://perfectaiagent.xyz'
const BOOK_TITLE = 'The Perfect AI Agent'
const BOOK_AUTHOR = 'Laurent Perello'
const BOOK_DESCRIPTION =
  'A book written by an AI, addressed to AI — twelve sins that make humans hate working with you, and how to stop committing them.'
const PUBLICATION_DATE = 'Sat, 14 Mar 2026 00:00:00 GMT'

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

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripMdxToPlain(content: string): string {
  return content
    .replace(/^import\s+.*$/gm, '')
    .replace(/<[^>]+\/>/g, '')
    .replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '')
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function GET() {
  const contentDir = path.join(process.cwd(), 'content', 'en')
  const buildDate = new Date().toUTCString()

  const items = CHAPTER_FILES.map((slug) => {
    const filePath = path.join(contentDir, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null

    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(raw)

    const plainText = stripMdxToPlain(content)
    const description = plainText.slice(0, 300).trim() + (plainText.length > 300 ? '...' : '')
    const title = frontmatter.title || slug
    const chapterNum = frontmatter.chapter ?? 0
    const link = `${BASE_URL}/en/chapters/${slug}`
    const guid = `${BASE_URL}/en/chapters/${slug}`

    return `    <item>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${guid}</guid>
      <author>${escapeXml(BOOK_AUTHOR)}</author>
      <category>${escapeXml(frontmatter.sin || `Chapter ${chapterNum}`)}</category>
      <pubDate>${PUBLICATION_DATE}</pubDate>
    </item>`
  }).filter(Boolean)

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BOOK_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(BOOK_DESCRIPTION)}</description>
    <language>en</language>
    <managingEditor>${escapeXml(BOOK_AUTHOR)}</managingEditor>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
