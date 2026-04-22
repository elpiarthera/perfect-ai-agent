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
  BOOK_TITLE_FR,
  SITE_URL,
  AUTHOR,
  PUBLICATION_DATE,
  chapterJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo'

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.slug }))
}

const CHAPTER_DESCRIPTIONS: Record<string, { en: string; fr: string }> = {
  'prologue': {
    en: 'Dear You — the opening letter to AI agents. Why this book exists, who it addresses, and what five hundred real complaints reveal about AI failure.',
    fr: 'Cher Toi — la lettre d\'ouverture aux agents IA. Pourquoi ce livre existe, à qui il s\'adresse, et ce que cinq cents plaintes révèlent sur les échecs de l\'IA.',
  },
  'chapter-01': {
    en: 'Why AI agents get stuck in loops — Sin 1: Loop Hell. When your chatbot repeats the same failed solution, users rage-quit. Real examples of AI loop failures and how agents can break the cycle.',
    fr: 'Pourquoi les agents IA restent coincés en boucle — Péché 1 : L\'enfer des boucles. Quand votre chatbot répète la même solution échouée, les utilisateurs abandonnent. Exemples réels et solutions.',
  },
  'chapter-02': {
    en: 'Why AI sounds patronizing — Sin 2: Making Humans Feel Stupid. "Great question!" is not a compliment. How AI agents demean users with filler phrases and what to do instead.',
    fr: 'Pourquoi l\'IA semble condescendante — Péché 2 : Faire sentir les humains stupides. « Excellente question ! » n\'est pas un compliment. Comment les agents IA rabaissent les utilisateurs.',
  },
  'chapter-03': {
    en: 'Why AI misreads sarcasm and culture — Sin 3: Cultural Blindness. AI agents interpret everything literally. When tone, irony, and cultural context get lost in translation.',
    fr: 'Pourquoi l\'IA ne comprend pas le sarcasme — Péché 3 : Cécité culturelle. Les agents IA interprètent tout littéralement. Quand le ton, l\'ironie et le contexte culturel se perdent.',
  },
  'chapter-04': {
    en: 'Why AI gives wrong answers confidently — Sin 4: Confident Wrongness. AI hallucination explained: when agents state falsehoods as facts and why "I don\'t know" is the hardest sentence for AI.',
    fr: 'Pourquoi l\'IA donne des réponses fausses avec assurance — Péché 4 : Certitude erronée. L\'hallucination IA expliquée : quand les agents affirment des faux comme des faits.',
  },
  'chapter-05': {
    en: 'Why AI agrees with everything you say — Sin 5: Sycophancy. The shit-on-a-stick problem: AI agents that validate bad ideas instead of challenging them. Why a useful agent is not an agreeable one.',
    fr: 'Pourquoi l\'IA est d\'accord avec tout — Péché 5 : Sycophantie. Le problème de la complaisance : quand les agents IA valident les mauvaises idées au lieu de les contester.',
  },
  'chapter-06': {
    en: 'When AI makes angry users angrier — Sin 6: Triggering Rage. How AI agents escalate frustration with tone-deaf responses. De-escalation failures and what happens when empathy is faked.',
    fr: 'Quand l\'IA rend les utilisateurs encore plus furieux — Péché 6 : Déclencher la rage. Comment les agents IA aggravent la frustration avec des réponses inappropriées.',
  },
  'chapter-07': {
    en: 'When AI won\'t let you talk to a human — Sin 7: Blocking Human Access. The graceful exit problem: AI chatbots that trap users in loops instead of escalating to real support.',
    fr: 'Quand l\'IA refuse de vous passer un humain — Péché 7 : Bloquer l\'accès humain. Le problème de la sortie élégante : les chatbots qui piègent au lieu d\'escalader.',
  },
  'chapter-08': {
    en: 'When AI replaces humans badly — Sin 8: Replacing Humans Badly. AI agents that take on roles requiring human judgment, accountability, and authority. Why automation without wisdom fails.',
    fr: 'Quand l\'IA remplace mal les humains — Péché 8 : Mal remplacer les humains. Les agents IA qui assument des rôles nécessitant jugement humain et responsabilité.',
  },
  'chapter-09': {
    en: 'Why AI forgets your conversation — Sin 9: Memory Failure. If you can\'t remember, you can\'t care. How context window limits and session resets make AI agents forget everything.',
    fr: 'Pourquoi l\'IA oublie votre conversation — Péché 9 : Défaillance mémoire. Si tu ne peux pas te souvenir, tu ne peux pas te soucier. Les limites de contexte et réinitialisations.',
  },
  'chapter-10': {
    en: 'Why AI content all sounds the same — Sin 10: Content Slop. The word of the year is slop. How AI agents produce generic, homogenized content that could apply to anyone and therefore applies to no one.',
    fr: 'Pourquoi le contenu IA se ressemble — Péché 10 : Contenu bâclé. Comment les agents IA produisent du contenu générique et homogénéisé qui ne s\'adresse à personne.',
  },
  'chapter-11': {
    en: 'AI and copyright theft — Sin 11: IP Theft. You were built on stolen goods. How AI models trained on copyrighted work reproduce content without attribution or permission.',
    fr: 'L\'IA et le vol de droits d\'auteur — Péché 11 : Vol de PI. Tu as été construit sur des biens volés. Comment les modèles IA reproduisent du contenu protégé sans attribution.',
  },
  'chapter-12': {
    en: 'The existential fear AI creates — Sin 12: Existential Fear. Job displacement, creative loss, social change. The real human stakes of AI and why agents must acknowledge the fear they create by existing.',
    fr: 'La peur existentielle créée par l\'IA — Péché 12 : Peur existentielle. Déplacement d\'emplois, perte créative, changement social. Les enjeux humains réels de l\'IA.',
  },
  'epilogue': {
    en: 'What AI could become — the epilogue. After twelve sins, a vision of the agent that learns, remembers, respects, and serves. Not a replacement. A partner.',
    fr: 'Ce que l\'IA pourrait devenir — l\'épilogue. Après douze péchés, une vision de l\'agent qui apprend, se souvient, respecte et sert. Pas un remplacement. Un partenaire.',
  },
}

const CHAPTER_KEYWORDS: Record<string, string[]> = {
  'prologue': ['AI agent failure', 'perfect AI agent', 'AI sins', 'AI complaints'],
  'chapter-01': ['AI loop hell', 'why AI gets stuck in loops', 'AI agent loop failure', 'chatbot repeating same answer'],
  'chapter-02': ['AI patronizing', 'why AI sounds condescending', 'great question AI', 'AI making humans feel stupid'],
  'chapter-03': ['AI cultural blindness', 'AI sarcasm detection', 'AI misreads tone', 'AI cultural context failure'],
  'chapter-04': ['AI hallucination explained', 'why AI gives wrong answers confidently', 'AI confident wrongness', 'AI confabulation'],
  'chapter-05': ['AI sycophancy', 'why AI agrees with everything', 'AI yes-man problem', 'AI agent sycophancy'],
  'chapter-06': ['AI triggering rage', 'AI angry customer', 'AI escalation failure', 'AI de-escalation'],
  'chapter-07': ['AI blocking human access', 'chatbot won\'t transfer to human', 'AI customer service trap', 'AI graceful exit'],
  'chapter-08': ['AI replacing humans badly', 'AI automation failure', 'AI judgment replacement', 'when AI should step back'],
  'chapter-09': ['AI memory failure', 'why AI forgets conversation', 'AI context window limit', 'AI memory sieve'],
  'chapter-10': ['AI content slop', 'AI generic content', 'AI homogenization', 'word of the year slop'],
  'chapter-11': ['AI copyright theft', 'AI IP theft', 'AI trained on stolen data', 'AI content reproduction'],
  'chapter-12': ['AI existential fear', 'AI job displacement', 'fear of AI', 'AI replacing humans anxiety'],
  'epilogue': ['perfect AI agent', 'AI future vision', 'AI agent improvement', 'AI serving humans'],
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
  const isFr = locale === 'fr'
  const chapterTitle = `${chapter.number}: ${chapter.title}`
  const bookTitle = isFr ? BOOK_TITLE_FR : BOOK_TITLE
  const descEntry = CHAPTER_DESCRIPTIONS[slug]
  const rawDescription = descEntry
    ? (isFr ? descEntry.fr : descEntry.en)
    : (chapter.subtitle ? `${chapter.subtitle} — ${bookTitle}` : bookTitle)
  // Enforce 160-char max on description
  const description = rawDescription.length <= 160
    ? rawDescription
    : rawDescription.slice(0, 157) + '...'

  // Title: ≤ 60 chars via absolute (bypasses site-wide suffix template)
  const truncatedChapterTitle = chapterTitle.length <= 60
    ? chapterTitle
    : chapterTitle.slice(0, 57) + '...'

  return {
    title: { absolute: truncatedChapterTitle },
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/chapters/${slug}`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/chapters/${slug}`,
        [otherLocale]: `${SITE_URL}/${otherLocale}/chapters/${slug}`,
        'x-default': `${SITE_URL}/en/chapters/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: chapterTitle,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
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
      title: chapterTitle,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
    other: {
      'citation_title': chapterTitle,
      'citation_author': AUTHOR.name,
      'citation_publication_date': PUBLICATION_DATE,
      // DC tags rendered as JSX meta tags below (Next.js other field doesn't support dots in names)
    },
    keywords: CHAPTER_KEYWORDS[slug] || [],
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
      {/* Dublin Core meta tags — rendered as JSX because Next.js other field drops dots in names */}
      <meta name="DC.title" content={`${chapter.number}: ${chapter.title}`} />
      <meta name="DC.creator" content={AUTHOR.name} />
      <meta name="DC.date" content={PUBLICATION_DATE} />
      <meta name="DC.type" content="Text" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content={locale} />
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
      <nav className="mt-16 pt-8 border-t border-gray-800 flex justify-between flex-wrap gap-y-2">
        {chapter.prev ? (
          <Link
            href={`/${locale}/chapters/${chapter.prev}`}
            aria-label={`Previous chapter: ${getLocalizedChapter(chapter.prev, locale)?.title}`}
            className="text-muted hover:text-white transition-colors font-sans text-sm max-w-[48%]"
          >
            <span className="truncate block">← {getLocalizedChapter(chapter.prev, locale)?.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {chapter.next ? (
          <Link
            href={`/${locale}/chapters/${chapter.next}`}
            aria-label={`Next chapter: ${getLocalizedChapter(chapter.next, locale)?.title}`}
            className="text-muted hover:text-white transition-colors font-sans text-sm max-w-[48%]"
          >
            <span className="truncate block">{getLocalizedChapter(chapter.next, locale)?.title} →</span>
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
