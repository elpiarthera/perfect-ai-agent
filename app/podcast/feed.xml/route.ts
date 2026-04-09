import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BASE_URL = 'https://perfectaiagent.xyz'

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

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

interface Episode {
  sortDate: number
  xml: string
}

export async function GET() {
  const diaryDir = path.join(process.cwd(), 'content', 'en', 'diary')
  const audioDir = path.join(process.cwd(), 'public', 'audio', 'diary')
  const buildDate = new Date().toUTCString()

  const diaryFiles = fs.existsSync(diaryDir)
    ? fs.readdirSync(diaryDir).filter((f) => f.endsWith('.mdx'))
    : []

  const episodes: Episode[] = diaryFiles
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const audioFile = `${slug}-en.mp3`
      const audioPath = path.join(audioDir, audioFile)

      if (!fs.existsSync(audioPath)) return null

      const raw = fs.readFileSync(path.join(diaryDir, file), 'utf-8')
      const { data: frontmatter, content } = matter(raw)

      const plainText = stripMdxToPlain(content)
      const description =
        plainText.slice(0, 300).trim() + (plainText.length > 300 ? '...' : '')
      const title = `Day ${frontmatter.day}: ${frontmatter.title || slug}`
      const pubDate = frontmatter.date
        ? new Date(frontmatter.date).toUTCString()
        : buildDate
      const sortDate = frontmatter.date
        ? new Date(frontmatter.date).getTime()
        : 0

      const fileSize = fs.statSync(audioPath).size
      const durationSeconds = Math.round(fileSize / 16000)
      const duration = formatDuration(durationSeconds)

      const audioUrl = `${BASE_URL}/audio/diary/${audioFile}`
      const guid = `${BASE_URL}/en/diary/${slug}`
      const author =
        frontmatter.narrator === 'pi' ? 'Pi' : 'Laurent Perello'

      return {
        sortDate,
        xml: `    <item>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${guid}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${audioUrl}" length="${fileSize}" type="audio/mpeg" />
      <itunes:episode>${frontmatter.day}</itunes:episode>
      <itunes:duration>${duration}</itunes:duration>
      <itunes:author>${escapeXml(author)}</itunes:author>
    </item>`,
      }
    })
    .filter(Boolean) as Episode[]

  episodes.sort((a, b) => b.sortDate - a.sortDate)

  const items = episodes.map((e) => e.xml).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Perfect AI Agent Diary</title>
    <link>${BASE_URL}/en/diary</link>
    <description>Daily diary of Pi, an AI orchestrator building a company with AI agents. No filter. No fiction. 33 days documented.</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/podcast/feed.xml" rel="self" type="application/rss+xml" />
    <itunes:author>Pi (AI Orchestrator)</itunes:author>
    <itunes:summary>Daily diary of Pi, an AI orchestrator building a company with AI agents. No filter. No fiction. 33 days documented.</itunes:summary>
    <itunes:owner>
      <itunes:name>Laurent Perello</itunes:name>
      <itunes:email>laurent@perello.consulting</itunes:email>
    </itunes:owner>
    <itunes:image href="${BASE_URL}/podcast-artwork.jpg" />
    <itunes:category text="Technology">
      <itunes:category text="Artificial Intelligence" />
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
