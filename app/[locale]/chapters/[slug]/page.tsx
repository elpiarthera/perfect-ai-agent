import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { getChapter, CHAPTERS } from '@/lib/chapters'
import GatedContent from '@/components/GatedContent'
import {
  BOOK_TITLE,
  SITE_URL,
  OG_IMAGE,
  PUBLISHER,
  PUBLICATION_DATE,
  chapterJsonLd,
} from '@/lib/seo'

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const chapter = getChapter(slug)
  if (!chapter) return {}

  const otherLocale = locale === 'en' ? 'fr' : 'en'
  const title = `${chapter.number}: ${chapter.title}`
  const description = chapter.subtitle
    ? `${chapter.subtitle} — ${BOOK_TITLE}`
    : BOOK_TITLE

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/chapters/${slug}`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/chapters/${slug}`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/chapters/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}/${locale}/chapters/${slug}`,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
      // article tags for chapter context
      tags: chapter.sin ? [chapter.sin, 'AI', 'AI agents'] : ['AI', 'AI agents'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
    other: {
      'citation_title': title,
      'citation_author': PUBLISHER.name,
      'citation_publication_date': PUBLICATION_DATE,
    },
  }
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

  const position = CHAPTERS.findIndex((c) => c.slug === slug) + 1
  const jsonLd = chapterJsonLd(locale, chapter, position)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      {/* Content — free chapters render directly, gated chapters check client-side */}
      {chapter.free ? (
        <div className="prose-chapter text-gray-300">
          <MDXRemote source={content} />
        </div>
      ) : (
        <GatedContent preview={content.slice(0, 800)} locale={locale}>
          <MDXRemote source={content} />
        </GatedContent>
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
    </>
  )
}
