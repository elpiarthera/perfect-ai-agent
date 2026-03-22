import Link from 'next/link'
import { type DiaryEntry } from '@/lib/diary'

export default function DiaryCard({
  entry,
  locale,
}: {
  entry: DiaryEntry
  locale: string
}) {
  const formattedDate = new Date(entry.date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/${locale}/diary/${entry.slug}`}
      className="flex items-center gap-4 border border-gray-800 hover:border-gray-600 p-5 transition-colors group bg-surface"
    >
      <div className="text-muted font-sans text-xs uppercase tracking-wider w-16 shrink-0">
        {locale === 'fr' ? `Jour ${entry.day}` : `Day ${entry.day}`}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-serif text-lg text-white group-hover:text-accent transition-colors truncate">
          {entry.title}
        </h2>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-muted text-sm font-sans">{formattedDate}</p>
          <span
            className={`text-xs font-sans px-2 py-0.5 rounded-full ${
              entry.narrator === 'pi'
                ? 'bg-accent/10 text-accent'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {entry.narrator === 'pi' ? 'Pi' : 'Laurent'}
          </span>
        </div>
      </div>
      <span className="text-muted group-hover:text-accent transition-colors">→</span>
    </Link>
  )
}
