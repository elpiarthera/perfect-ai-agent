import Link from 'next/link'
import { type Chapter } from '@/lib/chapters'

export default function ChapterCard({
  chapter,
  locale,
}: {
  chapter: Chapter
  locale: string
}) {
  return (
    <Link
      href={`/${locale}/chapters/${chapter.slug}`}
      className="flex items-center gap-4 border border-gray-800 hover:border-gray-600 p-5 transition-colors group bg-surface"
    >
      <div className="text-muted font-sans text-xs uppercase tracking-wider w-16 shrink-0">
        {chapter.slug === 'prologue' || chapter.slug === 'epilogue'
          ? chapter.number
          : chapter.slug.replace('chapter-', 'Ch. ')}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-white group-hover:text-accent transition-colors truncate">
          {chapter.title}
        </h3>
        {chapter.subtitle && (
          <p className="text-muted text-sm font-sans mt-0.5">{chapter.subtitle}</p>
        )}
      </div>
      <div className="shrink-0">
        {chapter.free ? (
          <span className="text-accent text-xs font-sans uppercase tracking-wider border border-accent px-2 py-0.5">
            Free
          </span>
        ) : (
          <span className="text-muted text-xs font-sans uppercase tracking-wider">
            Email
          </span>
        )}
      </div>
    </Link>
  )
}
