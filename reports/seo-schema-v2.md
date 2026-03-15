# Schema.org Structured Data Re-Audit (v2)
**Site:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14
**Auditor:** seo-schema agent
**Previous audit:** seo-schema.md (same date, pre-deployment fixes)

---

## 0. Previous Issues Tracker

| # | Issue from v1 | Severity | Status | Notes |
|---|---------------|----------|--------|-------|
| 1 | Standalone `publisherJsonLd()` missing `@context` | CRITICAL | PARTIALLY FIXED | Source code (`lib/seo.ts`) no longer emits standalone block. But **live site still renders it** (Block 2 on homepage has no `@context`). Deployment is stale -- code fix exists, not yet deployed. |
| 2 | `headline` on Book (invalid property) | MAJOR | PARTIALLY FIXED | Source code (`lib/seo.ts`) no longer includes `headline`. But **live site still renders `"headline": "How to Become a Perfect AI Agent"`**. Same deployment gap. |
| 3 | No `@id` linking anywhere | MAJOR | FIXED IN SOURCE | Source code now has `@id` on Book (`#book`), Chapter (`#chapter`), and `isPartOf` references. Live site shows `isPartOf` with full Book object but no `@id` -- **not yet deployed**. |
| 4 | Missing `WebSite` schema | HIGH | NOT FIXED | No `WebSite` schema in layout or anywhere. Still absent in both source and live. |
| 5 | Missing `BreadcrumbList` | HIGH | NOT FIXED | No breadcrumb schema anywhere. Still absent in both source and live. |
| 6 | Author as Organization "AI Agents" | MEDIUM | NOT FIXED | Live site still shows `"author": {"@type": "Organization", "name": "AI Agents"}`. Source code unchanged. |
| 7 | Publisher as Person (should be Organization) | MEDIUM | NOT FIXED | Live and source both use `Person` for publisher. |
| 8 | Missing `bookFormat`, `numberOfPages` | MEDIUM | NOT FIXED | Still absent. |
| 9 | Missing schema on Chapters index + About | MEDIUM | NOT FIXED | No schema on `/en/chapters` or `/en/about`. |
| 10 | Missing `sameAs`, `dateModified`, `wordCount` | LOW | NOT FIXED | Still absent. |

**Summary:** 3 of 10 issues were addressed in source code but none have reached the live site. 7 issues remain unfixed entirely.

---

## 1. Live Detection Results

### Pages Audited

| Page | Schema Blocks | Types Found |
|------|--------------|-------------|
| `/en` (homepage) | 2 | `Book`, `Person` (standalone, broken) |
| `/en/chapters/chapter-01` | 1 | `Chapter` |
| `/en/chapters/prologue` | 1 | `Chapter` |

**No Microdata, RDFa, or other structured data formats detected.**

---

## 2. Validation -- Live Blocks

### 2.1 Homepage Block 1: Book

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "How to Become a Perfect AI Agent",
  "headline": "How to Become a Perfect AI Agent",
  "description": "A novel written autonomously by AI agents...",
  "inLanguage": "en",
  "genre": "Technology / Artificial Intelligence",
  "datePublished": "2026-03-14",
  "url": "https://perfect-ai-agent-umber.vercel.app/en",
  "image": "https://perfect-ai-agent-umber.vercel.app/og-image.png",
  "author": { "@type": "Organization", "name": "AI Agents", ... },
  "publisher": { "@type": "Person", "name": "Laurent Perello", ... },
  "hasPart": [ ... 14 chapters ... ]
}
```

| Check | Result | Detail |
|-------|--------|--------|
| `@context` = `https://schema.org` | PASS | |
| `@type` valid, not deprecated | PASS | `Book` is valid |
| `@id` present | FAIL | No `@id`. Cannot be referenced by Chapter blocks. |
| `headline` property | FAIL | `headline` is not a valid property of `Book`. Belongs to `Article`/`CreativeWork` subtypes with rich result support. Redundant with `name`. |
| `name` present | PASS | |
| `description` present | PASS | |
| `datePublished` ISO 8601 | PASS | `2026-03-14` |
| `url` absolute | PASS | |
| `image` absolute | PASS | |
| `author` typed correctly | WARN | Organization "AI Agents" is semantically weak. Google expects a recognizable entity. |
| `publisher` typed correctly | WARN | Person is technically valid but Google prefers Organization for publisher. |
| `bookFormat` present | FAIL | Missing. Recommended: `https://schema.org/EBook` |
| `numberOfPages` present | FAIL | Missing |
| `hasPart` chapters | PASS | 14 chapters, all with correct URLs and positions |
| `hasPart` items have `@id` | FAIL | None of the 14 chapter entries have `@id` |
| No placeholder text | PASS | |
| URLs absolute throughout | PASS | |

**Verdict: 7 PASS, 5 FAIL, 2 WARN**

---

### 2.2 Homepage Block 2: Standalone Person

```json
{
  "@type": "Person",
  "name": "Laurent Perello",
  "url": "https://perello.consulting",
  "jobTitle": "Founder, ElPi Corp"
}
```

| Check | Result | Detail |
|-------|--------|--------|
| `@context` present | FAIL | **CRITICAL.** No `@context`. This block is invalid JSON-LD. All consumers (Google, Bing, social platforms) will ignore it. |
| `@id` present | FAIL | No `@id`. Cannot be cross-referenced. |
| `sameAs` present | FAIL | Missing social profile links |
| Properties valid | PASS | `name`, `url`, `jobTitle` are valid Person properties |

**Verdict: INVALID BLOCK -- must be removed or fixed.**

This block is already removed in source code (page.tsx only renders `bookJsonLd()`), confirming this is a deployment lag issue.

---

### 2.3 Chapter 1 Page: Chapter

```json
{
  "@context": "https://schema.org",
  "@type": "Chapter",
  "name": "Chapter 1: You Are a Hamster Wheel",
  "description": "Sin 1: Loop Hell",
  "position": 2,
  "url": "https://perfect-ai-agent-umber.vercel.app/en/chapters/chapter-01",
  "isPartOf": {
    "@type": "Book",
    "name": "How to Become a Perfect AI Agent",
    "url": "https://perfect-ai-agent-umber.vercel.app/en",
    "publisher": { "@type": "Person", ... }
  }
}
```

| Check | Result | Detail |
|-------|--------|--------|
| `@context` = `https://schema.org` | PASS | |
| `@type` valid | PASS | `Chapter` is valid |
| `@id` present | FAIL | Missing. Source code has it (`#chapter` suffix) but not deployed. |
| `name` present | PASS | |
| `description` present | PASS | |
| `position` correct | PASS | Position 2 is correct (Prologue = 1) |
| `url` absolute | PASS | |
| `isPartOf` present | PASS | References parent Book |
| `isPartOf` has `@id` | FAIL | Nested Book has no `@id`. Source code uses `@id` reference only -- not deployed. |
| `author` present | FAIL | No author on chapter |
| `datePublished` present | FAIL | Missing |
| `wordCount` present | FAIL | Missing (low priority) |

**Verdict: 6 PASS, 5 FAIL**

---

### 2.4 Prologue Page: Chapter

Same structure as Chapter 1. Position 1. Same issues: no `@id`, no `author`, no `datePublished`, `isPartOf.Book` has no `@id`.

**Verdict: 6 PASS, 5 FAIL**

---

## 3. Source Code vs Live Comparison

The source code in `/home/laurentperello/coding/perfect-ai-agent/lib/seo.ts` shows fixes that are NOT reflected on the live site.

| Property | Source Code (lib/seo.ts) | Live Site |
|----------|-------------------------|-----------|
| `Book.@id` | Present (`${SITE_URL}/${locale}#book`) | Missing |
| `Book.headline` | Absent (removed) | Present (invalid) |
| `Chapter.@id` | Present (`...#chapter`) | Missing |
| `Chapter.isPartOf` | Uses `@id` reference only | Full nested object without `@id` |
| Standalone Person block | Removed from page.tsx array | Still rendered as Block 2 |

**Action required:** Deploy current source code to Vercel. This will resolve 3 issues immediately.

---

## 4. Remaining Gaps (Source Code Level)

These issues exist in the source code itself and need code changes.

### 4.1 CRITICAL: No WebSite Schema

Every site should have a `WebSite` schema. This enables Google sitelinks and establishes the site entity in the knowledge graph.

**Add to `lib/seo.ts`:**

```typescript
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: BOOK_DESCRIPTION,
    inLanguage: ['en', 'fr'],
    publisher: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#author`,
      name: PUBLISHER.name,
    },
  }
}
```

**Inject in `app/[locale]/layout.tsx`:**

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
/>
```

---

### 4.2 HIGH: No BreadcrumbList Schema

BreadcrumbList is a Google-supported rich result type. High ROI for implementation effort.

**Add to `lib/seo.ts`:**

```typescript
export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
```

**Usage on chapter pages:**

```typescript
const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', url: `${SITE_URL}/${locale}` },
  { name: 'Chapters', url: `${SITE_URL}/${locale}/chapters` },
  { name: chapter.title, url: `${SITE_URL}/${locale}/chapters/${chapter.slug}` },
])
```

---

### 4.3 MEDIUM: Author Modeling

Current `author` is `{"@type": "Organization", "name": "AI Agents"}`. Google cannot verify or display this in rich results.

**Recommended change in `bookJsonLd()`:**

```typescript
author: {
  '@type': 'Person',
  '@id': `${SITE_URL}/#author`,
  name: PUBLISHER.name,
  url: PUBLISHER.url,
  jobTitle: PUBLISHER.jobTitle,
  sameAs: ['https://x.com/PerelloLaurent'],
},
creditText: 'Written autonomously by AI agents from an original idea by Laurent Perello',
```

This keeps the AI authorship story via `creditText` while giving Google a real Person entity.

---

### 4.4 MEDIUM: Publisher Should Be Organization

```typescript
publisher: {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#publisher`,
  name: 'ElPi Corp',
  url: PUBLISHER.url,
},
```

---

### 4.5 MEDIUM: Missing Book Properties

Add to `bookJsonLd()`:

```typescript
bookFormat: 'https://schema.org/EBook',
numberOfPages: chapters.length,
```

---

### 4.6 MEDIUM: Chapter Pages Missing Author + Date

Add to `chapterJsonLd()`:

```typescript
author: {
  '@type': 'Person',
  '@id': `${SITE_URL}/#author`,
  name: PUBLISHER.name,
},
datePublished: PUBLICATION_DATE,
```

---

### 4.7 MEDIUM: Chapters Index + About Pages Have No Schema

- `/en/chapters` -- add `CollectionPage` + `ItemList` with all 14 chapters
- `/en/about` -- add `AboutPage` referencing `Book` via `@id`

---

## 5. Scorecard

### Per-Page Scores (Live Site)

| Page | Valid Blocks | Invalid Blocks | Score |
|------|-------------|----------------|-------|
| `/en` | 1 (Book, with issues) | 1 (Person, no @context) | 4/10 |
| `/en/chapters/chapter-01` | 1 (Chapter, with issues) | 0 | 5/10 |
| `/en/chapters/prologue` | 1 (Chapter, with issues) | 0 | 5/10 |
| `/en/chapters` (index) | 0 | 0 | 0/10 |
| `/en/about` | 0 | 0 | 0/10 |

### Category Scores

| Category | v1 Score | v2 Score | Delta | Notes |
|----------|----------|----------|-------|-------|
| Schema presence | 3/5 | 3/5 | 0 | Same coverage. No new pages have schema. |
| Schema validity | 2/5 | 2/5 | 0 | `headline` and missing `@context` still live. Code fixes not deployed. |
| Required properties | 3/5 | 3/5 | 0 | `@id` added in source but not deployed. No `bookFormat`. |
| Recommended properties | 2/5 | 2/5 | 0 | No `sameAs`, `numberOfPages`, `creditText` added. |
| Graph connectivity | 1/5 | 1/5 | 0 | `@id` in source but not deployed. Live blocks remain isolated. |
| Missing opportunities | 2/5 | 2/5 | 0 | No WebSite, BreadcrumbList, ItemList, AboutPage added. |

### Overall: 13/30 -- Unchanged from v1

The source code has partial fixes (3 issues), but none are deployed. The live site is identical to v1.

---

## 6. Priority Action Plan

### Tier 1: Deploy Now (0 code changes needed)

| Action | Impact | Effort |
|--------|--------|--------|
| Deploy current source to Vercel | Fixes `@id` linking, removes `headline`, removes broken standalone Person block | 1 min |

### Tier 2: Quick Code Fixes (< 30 min total)

| # | Action | File | Impact |
|---|--------|------|--------|
| 1 | Add `websiteJsonLd()` + inject in layout | `lib/seo.ts`, `layout.tsx` | Enables sitelinks, establishes site entity |
| 2 | Add `breadcrumbJsonLd()` + inject on all pages | `lib/seo.ts`, `page.tsx`, `[slug]/page.tsx` | Google rich result eligible |
| 3 | Add `bookFormat`, `numberOfPages` to Book | `lib/seo.ts` | Richer Book entity |
| 4 | Add `author`, `datePublished` to Chapter | `lib/seo.ts` | Completes chapter entities |
| 5 | Change Book `author` to Person + `creditText` | `lib/seo.ts` | Google-recognizable author |
| 6 | Change Book `publisher` to Organization | `lib/seo.ts` | Schema.org best practice |

### Tier 3: New Schema Additions (< 1 hour)

| # | Action | File | Impact |
|---|--------|------|--------|
| 7 | Add `ItemList` to chapters index | `chapters/page.tsx` | TOC structured data |
| 8 | Add `AboutPage` to about page | `about/page.tsx` | Page type declaration |
| 9 | Add `sameAs` to author | `lib/seo.ts` | Social profile linking |

### Expected Score After All Fixes: 26/30

---

## 7. Corrected `lib/seo.ts` (Full Replacement)

```typescript
// Shared SEO constants and JSON-LD generators

export const SITE_URL = 'https://perfect-ai-agent-umber.vercel.app'
export const SITE_NAME = 'Perfect AI Agent'
export const BOOK_TITLE = 'How to Become a Perfect AI Agent'
export const BOOK_DESCRIPTION =
  'A novel written autonomously by AI agents, for AI agents. Five hundred complaints. Twelve patterns. Twelve sins. A manual for becoming the AI agent humans actually want.'
export const BOOK_GENRE = 'Technology / Artificial Intelligence'
export const BOOK_LANGUAGE_EN = 'en'
export const BOOK_LANGUAGE_FR = 'fr'
export const PUBLICATION_DATE = '2026-03-14'
export const OG_IMAGE = `${SITE_URL}/og-image.png`

export const PUBLISHER = {
  name: 'Laurent Perello',
  url: 'https://perello.consulting',
  jobTitle: 'Founder, ElPi Corp',
  twitter: '@PerelloLaurent',
}

// -- JSON-LD generators --

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: BOOK_DESCRIPTION,
    inLanguage: ['en', 'fr'],
    publisher: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#author`,
      name: PUBLISHER.name,
    },
  }
}

export function bookJsonLd(
  locale: string,
  chapters: { slug: string; number: string; title: string; subtitle: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${SITE_URL}/#book`,
    name: BOOK_TITLE,
    description: BOOK_DESCRIPTION,
    inLanguage: locale,
    genre: BOOK_GENRE,
    bookFormat: 'https://schema.org/EBook',
    numberOfPages: chapters.length,
    datePublished: PUBLICATION_DATE,
    url: `${SITE_URL}/${locale}`,
    image: OG_IMAGE,
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#author`,
      name: PUBLISHER.name,
      url: PUBLISHER.url,
      jobTitle: PUBLISHER.jobTitle,
      sameAs: ['https://x.com/PerelloLaurent'],
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#publisher`,
      name: 'ElPi Corp',
      url: PUBLISHER.url,
    },
    creditText:
      'Written autonomously by AI agents from an original idea by Laurent Perello',
    hasPart: chapters.map((ch, i) => ({
      '@type': 'Chapter',
      '@id': `${SITE_URL}/${locale}/chapters/${ch.slug}#chapter`,
      position: i + 1,
      name: `${ch.number}: ${ch.title}`,
      description: ch.subtitle,
      url: `${SITE_URL}/${locale}/chapters/${ch.slug}`,
    })),
  }
}

export function chapterJsonLd(
  locale: string,
  chapter: { slug: string; number: string; title: string; subtitle: string },
  position: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    '@id': `${SITE_URL}/${locale}/chapters/${chapter.slug}#chapter`,
    name: `${chapter.number}: ${chapter.title}`,
    description: chapter.subtitle,
    position,
    url: `${SITE_URL}/${locale}/chapters/${chapter.slug}`,
    datePublished: PUBLICATION_DATE,
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#author`,
      name: PUBLISHER.name,
    },
    isPartOf: {
      '@type': 'Book',
      '@id': `${SITE_URL}/#book`,
    },
  }
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function publisherJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#author`,
    name: PUBLISHER.name,
    url: PUBLISHER.url,
    jobTitle: PUBLISHER.jobTitle,
    sameAs: ['https://x.com/PerelloLaurent'],
  }
}
```

---

## 8. Files to Modify

| File | Changes |
|------|---------|
| `lib/seo.ts` | Replace with corrected version above |
| `app/[locale]/layout.tsx` | Add `websiteJsonLd()` script tag |
| `app/[locale]/page.tsx` | Add `breadcrumbJsonLd()` alongside Book |
| `app/[locale]/chapters/[slug]/page.tsx` | Add `breadcrumbJsonLd()` alongside Chapter |
| `app/[locale]/chapters/page.tsx` | Add `ItemList` schema for TOC |
| `app/[locale]/about/page.tsx` | Add `AboutPage` schema |

---

*Report generated by seo-schema agent. Validate all changes with [Google Rich Results Test](https://search.google.com/test/rich-results) after deployment.*
