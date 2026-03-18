import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { CHAPTERS } from '@/lib/chapters'
import { getLocalizedChapter, getLocalizedChapters } from '@/lib/chapters-i18n'
import EmailCapture from '@/components/EmailCapture'
import ShareButtons from '@/components/ShareButtons'
import Breadcrumb from '@/components/Breadcrumb'
import {
  BOOK_TITLE,
  SITE_URL,
  AUTHOR,
  PUBLICATION_DATE,
  chapterJsonLd,
  breadcrumbJsonLd,
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
  const chapter = getLocalizedChapter(slug, locale)
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
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'The Perfect AI Agent — Five hundred complaints. Twelve patterns. Twelve sins.',
        },
      ],
      // article tags for chapter context
      tags: chapter.sin ? [chapter.sin, 'AI', 'AI agents'] : ['AI', 'AI agents'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
    other: {
      'citation_title': title,
      'citation_author': AUTHOR.name,
      'citation_publication_date': PUBLICATION_DATE,
    },
  }
}

/**
 * Strip the first heading from MDX content if it duplicates the chapter title.
 * MDX files start with `# Chapter X: Title` or `# Prologue: Title` which
 * creates a duplicate <h1> since the page header already renders the title.
 */
function stripDuplicateHeading(mdxContent: string, chapterTitle: string): string {
  const lines = mdxContent.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // Skip empty lines
    if (line === '') continue
    // Check if this is a heading that contains the chapter title
    if (line.startsWith('# ') && line.includes(chapterTitle)) {
      lines.splice(i, 1)
      return lines.join('\n')
    }
    // If the first non-empty line isn't a matching heading, stop
    break
  }
  return mdxContent
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
  const chapter = getLocalizedChapter(slug, locale)
  if (!chapter) notFound()

  const rawContent = await getChapterContent(slug, locale)
  if (!rawContent) notFound()

  const content = stripDuplicateHeading(rawContent, chapter.title)

  const localizedChapters = getLocalizedChapters(locale)
  const position = localizedChapters.findIndex((c) => c.slug === slug) + 1
  const chapterSchema = chapterJsonLd(locale, chapter, position)
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/${locale}` },
    { name: 'Chapters', url: `${SITE_URL}/${locale}/chapters` },
    { name: `${chapter.number}: ${chapter.title}`, url: `${SITE_URL}/${locale}/chapters/${slug}` },
  ])

  const breadcrumbItems = [
    { label: locale === 'fr' ? 'Accueil' : 'Home', href: `/${locale}` },
    { label: locale === 'fr' ? 'Chapitres' : 'Chapters', href: `/${locale}/chapters` },
    { label: `${chapter.number}: ${chapter.title}` },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Breadcrumb items={breadcrumbItems} />
      <article className="max-w-3xl mx-auto px-6 pt-8 pb-24">
      {/* Chapter header */}
      <header className="mb-12">
        <p className="text-accent text-xs uppercase tracking-widest font-sans mb-2">
          {chapter.act || chapter.number}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
          {chapter.title}
        </h1>
        {chapter.subtitle && (
          <p className="text-muted font-sans">{chapter.subtitle}</p>
        )}
      </header>

      {/* Full chapter content — no gate */}
      <div className="prose-chapter text-gray-300">
        <MDXRemote source={content} />
      </div>

      {/* Chapter navigation */}
      <nav className="mt-16 pt-8 border-t border-gray-800 flex justify-between">
        {chapter.prev ? (
          <Link
            href={`/${locale}/chapters/${chapter.prev}`}
            className="text-muted hover:text-white transition-colors font-sans text-sm"
          >
            ← {getLocalizedChapter(chapter.prev, locale)?.title}
          </Link>
        ) : (
          <span />
        )}
        {chapter.next ? (
          <Link
            href={`/${locale}/chapters/${chapter.next}`}
            className="text-muted hover:text-white transition-colors font-sans text-sm"
          >
            {getLocalizedChapter(chapter.next, locale)?.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {/* Optional email capture — not a gate */}
      <section className="mt-16 pt-8 border-t border-gray-800">
        <EmailCapture locale={locale} />
      </section>

      {/* Share buttons */}
      <div className="mt-8">
        <ShareButtons
          url={`${SITE_URL}/${locale}/chapters/${slug}`}
          title={`${chapter.number}: ${chapter.title}`}
        />
      </div>
    </article>
    </>
  )
}
