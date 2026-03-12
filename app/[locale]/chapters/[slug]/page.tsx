import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getChapter, CHAPTERS } from '@/lib/chapters'
import EmailCapture from '@/components/EmailCapture'
import GatedContent from '@/components/GatedContent'

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.slug }))
}

async function getChapterContent(slug: string, locale: string) {
  const filePath = path.join(process.cwd(), 'content', locale, `${slug}.mdx`)
  const enPath = path.join(process.cwd(), 'content', 'en', `${slug}.mdx`)

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

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const chapter = getChapter(slug)
  if (!chapter) notFound()

  const content = await getChapterContent(slug, locale)
  if (!content) notFound()

  // Check if email was captured
  const cookieStore = await cookies()
  const emailCaptured = cookieStore.get('email_captured')?.value === 'true'

  const isAccessible = chapter.free || emailCaptured

  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
      {/* Chapter header */}
      <div className="mb-12">
        <p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">
          {chapter.act || chapter.number}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
          {chapter.title}
        </h1>
        {chapter.subtitle && (
          <p className="text-muted font-sans">{chapter.subtitle}</p>
        )}
      </div>

      {/* Content */}
      {isAccessible ? (
        <div className="prose-chapter text-gray-300">
          <MDXRemote source={content} />
        </div>
      ) : (
        <GatedContent preview={content.slice(0, 800)} locale={locale} />
      )}

      {/* Chapter navigation */}
      <nav className="mt-16 pt-8 border-t border-gray-800 flex justify-between">
        {chapter.prev ? (
          <Link
            href={`/${locale}/chapters/${chapter.prev}`}
            className="text-muted hover:text-white transition-colors font-sans text-sm"
          >
            ← {getChapter(chapter.prev)?.title}
          </Link>
        ) : (
          <span />
        )}
        {chapter.next ? (
          <Link
            href={`/${locale}/chapters/${chapter.next}`}
            className="text-muted hover:text-white transition-colors font-sans text-sm"
          >
            {getChapter(chapter.next)?.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
