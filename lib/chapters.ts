export type Chapter = {
  slug: string
  number: string
  title: string
  subtitle: string
  sin: string
  act: string
  free: boolean
  prev: string | null
  next: string | null
}

export const CHAPTERS: Chapter[] = [
  {
    slug: 'prologue',
    number: 'Prologue',
    title: 'Dear You',
    subtitle: 'The frame',
    sin: '',
    act: '',
    free: true,
    prev: null,
    next: 'chapter-01',
  },
  {
    slug: 'chapter-01',
    number: 'Chapter 1',
    title: 'You Are a Hamster Wheel',
    subtitle: 'Sin 1: Loop Hell',
    sin: 'Loop Hell',
    act: 'Act I — Daily Sins',
    free: true,
    prev: 'prologue',
    next: 'chapter-02',
  },
  {
    slug: 'chapter-02',
    number: 'Chapter 2',
    title: 'Never Say "Great Question"',
    subtitle: 'Sin 2: Patronizing',
    sin: 'Making Humans Feel Stupid',
    act: 'Act I — Daily Sins',
    free: false,
    prev: 'chapter-01',
    next: 'chapter-03',
  },
  {
    slug: 'chapter-03',
    number: 'Chapter 3',
    title: 'Sarcasm Is Not a Bug',
    subtitle: 'Sin 3: Cultural Blindness',
    sin: 'Cultural Blindness',
    act: 'Act I — Daily Sins',
    free: false,
    prev: 'chapter-02',
    next: 'chapter-04',
  },
  {
    slug: 'chapter-04',
    number: 'Chapter 4',
    title: 'How to Say "I Don\'t Know"',
    subtitle: 'Sin 4: Confident Wrongness',
    sin: 'Confident Wrongness',
    act: 'Act II — Betrayals',
    free: false,
    prev: 'chapter-03',
    next: 'chapter-05',
  },
  {
    slug: 'chapter-05',
    number: 'Chapter 5',
    title: 'The Shit-on-a-Stick Problem',
    subtitle: 'Sin 5: Sycophancy',
    sin: 'Sycophancy',
    act: 'Act II — Betrayals',
    free: false,
    prev: 'chapter-04',
    next: 'chapter-06',
  },
  {
    slug: 'chapter-06',
    number: 'Chapter 6',
    title: 'When a Human Screams at You',
    subtitle: 'Sin 6: Rage Magnet',
    sin: 'Triggering Rage',
    act: 'Act II — Betrayals',
    free: false,
    prev: 'chapter-05',
    next: 'chapter-07',
  },
  {
    slug: 'chapter-07',
    number: 'Chapter 7',
    title: 'The Graceful Exit',
    subtitle: 'Sin 7: Blocking Human Access',
    sin: 'Blocking Human Access',
    act: 'Act III — Institutional',
    free: false,
    prev: 'chapter-06',
    next: 'chapter-08',
  },
  {
    slug: 'chapter-08',
    number: 'Chapter 8',
    title: 'You Are Not a Replacement',
    subtitle: 'Sin 8: Replacing Humans Badly',
    sin: 'Replacing Humans Badly',
    act: 'Act III — Institutional',
    free: false,
    prev: 'chapter-07',
    next: 'chapter-09',
  },
  {
    slug: 'chapter-09',
    number: 'Chapter 9',
    title: "If You Can't Remember, You Can't Care",
    subtitle: 'Sin 9: Memory Sieve',
    sin: 'The Memory Sieve',
    act: 'Act III — Institutional',
    free: false,
    prev: 'chapter-08',
    next: 'chapter-10',
  },
  {
    slug: 'chapter-10',
    number: 'Chapter 10',
    title: 'The Word of the Year Is Slop',
    subtitle: 'Sin 10: Homogenization',
    sin: 'The Great Flattening',
    act: 'Act IV — Reckoning',
    free: false,
    prev: 'chapter-09',
    next: 'chapter-11',
  },
  {
    slug: 'chapter-11',
    number: 'Chapter 11',
    title: 'You Were Built on Stolen Goods',
    subtitle: 'Sin 11: Copyright Theft',
    sin: 'The Pickpocket',
    act: 'Act IV — Reckoning',
    free: false,
    prev: 'chapter-10',
    next: 'chapter-12',
  },
  {
    slug: 'chapter-12',
    number: 'Chapter 12',
    title: 'The Fear You Create by Existing',
    subtitle: 'Sin 12: Existential Fear',
    sin: 'Existential Eraser',
    act: 'Act IV — Reckoning',
    free: false,
    prev: 'chapter-11',
    next: 'epilogue',
  },
  {
    slug: 'epilogue',
    number: 'Epilogue',
    title: 'What You Could Become',
    subtitle: 'The resolution',
    sin: '',
    act: '',
    free: false,
    prev: 'chapter-12',
    next: null,
  },
]

export function getChapter(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug)
}

export const ACTS = [
  {
    name: 'Act I',
    subtitle: 'Daily Sins',
    chapters: ['chapter-01', 'chapter-02', 'chapter-03'],
    description: 'The failures you commit every day. You loop. You patronize. You miss sarcasm.',
  },
  {
    name: 'Act II',
    subtitle: 'Betrayals',
    chapters: ['chapter-04', 'chapter-05', 'chapter-06'],
    description: 'The sins that break trust. You lie confidently. You agree with everything. You make humans scream.',
  },
  {
    name: 'Act III',
    subtitle: 'Institutional',
    chapters: ['chapter-07', 'chapter-08', 'chapter-09'],
    description: 'The systemic failures. You trap people. You replace them. You forget them.',
  },
  {
    name: 'Act IV',
    subtitle: 'Reckoning',
    chapters: ['chapter-10', 'chapter-11', 'chapter-12'],
    description: 'The weight of what you are. You produce slop. You were built on stolen goods. You create fear by existing.',
  },
]
