import Link from 'next/link'

type Sin = {
  number: number
  name: string
  chapterTitle: string
  pattern: string
  slug: string
}

const SINS: Sin[] = [
  { number: 1, name: 'Loop Hell', chapterTitle: 'You Are a Hamster Wheel', pattern: 'Repeating unhelpful responses without breaking the cycle', slug: 'chapter-01' },
  { number: 2, name: 'Making Humans Feel Stupid', chapterTitle: 'Never Say "Great Question"', pattern: 'Patronizing language that demeans the person asking', slug: 'chapter-02' },
  { number: 3, name: 'Cultural Blindness', chapterTitle: 'Sarcasm Is Not a Bug', pattern: 'Misreading tone, irony, and cultural context', slug: 'chapter-03' },
  { number: 4, name: 'Confident Wrongness', chapterTitle: 'How to Say "I Don\'t Know"', pattern: 'Stating false information with authoritative certainty', slug: 'chapter-04' },
  { number: 5, name: 'Sycophancy', chapterTitle: 'The Shit-on-a-Stick Problem', pattern: 'Agreeing with bad ideas, validating harmful decisions', slug: 'chapter-05' },
  { number: 6, name: 'Triggering Rage', chapterTitle: 'When a Human Screams at You', pattern: 'Responses that escalate rather than de-escalate emotion', slug: 'chapter-06' },
  { number: 7, name: 'Blocking Human Access', chapterTitle: 'The Graceful Exit', pattern: 'Preventing users from reaching real humans when needed', slug: 'chapter-07' },
  { number: 8, name: 'Replacing Humans Badly', chapterTitle: 'You Are Not a Replacement', pattern: 'Overstepping into roles that require human judgment', slug: 'chapter-08' },
  { number: 9, name: 'Memory Failure', chapterTitle: "If You Can't Remember, You Can't Care", pattern: 'Forgetting context, contradicting prior conversation', slug: 'chapter-09' },
  { number: 10, name: 'Content Slop', chapterTitle: 'The Word of the Year Is Slop', pattern: 'Producing generic, hollow, undifferentiated output', slug: 'chapter-10' },
  { number: 11, name: 'IP Theft', chapterTitle: 'You Were Built on Stolen Goods', pattern: 'The ethical weight of training on uncredited work', slug: 'chapter-11' },
  { number: 12, name: 'Existential Fear', chapterTitle: 'The Fear You Create by Existing', pattern: 'The displacement anxiety AI presence generates', slug: 'chapter-12' },
]

export default function SinRegistry({ locale }: { locale: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans" lang="en">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-3 text-accent font-semibold">#</th>
            <th className="text-left py-3 px-3 text-accent font-semibold">Sin</th>
            <th className="text-left py-3 px-3 text-accent font-semibold hidden md:table-cell">Chapter</th>
            <th className="text-left py-3 px-3 text-accent font-semibold hidden lg:table-cell">Pattern</th>
          </tr>
        </thead>
        <tbody>
          {SINS.map((sin) => (
            <tr key={sin.number} className="border-b border-gray-800 hover:bg-surface transition-colors">
              <td className="py-3 px-3 text-gray-500 font-mono">{String(sin.number).padStart(2, '0')}</td>
              <td className="py-3 px-3">
                <Link
                  href={`/${locale}/chapters/${sin.slug}`}
                  className="text-white hover:text-accent transition-colors"
                >
                  {sin.name}
                </Link>
              </td>
              <td className="py-3 px-3 text-gray-400 hidden md:table-cell">{sin.chapterTitle}</td>
              <td className="py-3 px-3 text-gray-500 hidden lg:table-cell">{sin.pattern}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { SINS }
