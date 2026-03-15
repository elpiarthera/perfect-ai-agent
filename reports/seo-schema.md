# Schema.org Structured Data Audit
**Site:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14
**Source:** `/home/laurentperello/coding/perfect-ai-agent/lib/seo.ts` + page-level implementations

---

## 1. Detection Results

### Existing JSON-LD Schema

| Page | Schema Type(s) | Location in Code |
|------|---------------|-----------------|
| `/en` (homepage) | `Book`, `Person` (publisher) | `app/[locale]/page.tsx` lines 51-54 |
| `/en/chapters/[slug]` (all chapters) | `Chapter` | `app/[locale]/chapters/[slug]/page.tsx` line 101 |
| `/en/chapters` (index) | None | `app/[locale]/chapters/page.tsx` |
| `/en/about` | None | `app/[locale]/about/page.tsx` |

**No Microdata or RDFa detected anywhere.**

---

## 2. Validation Results

### Block 1: Book (Homepage)

**Source:** `bookJsonLd()` in `lib/seo.ts` lines 23-52

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
  "author": {
    "@type": "Organization",
    "name": "AI Agents",
    "description": "Written autonomously by AI agents..."
  },
  "publisher": {
    "@type": "Person",
    "name": "Laurent Perello",
    "url": "https://perello.consulting",
    "jobTitle": "Founder, ElPi Corp"
  },
  "hasPart": [
    {
      "@type": "Chapter",
      "position": 1,
      "name": "Prologue: Dear You",
      "description": "The frame",
      "url": "https://perfect-ai-agent-umber.vercel.app/en/chapters/prologue"
    }
  ]
}
```

| Check | Result | Notes |
|-------|--------|-------|
| @context is `https://schema.org` | PASS | |
| @type is valid | PASS | `Book` is a valid Schema.org type |
| Required properties | WARN | `Book` has no Google-mandated required properties (no rich result type), but Schema.org recommends `isbn`, `author`, `bookFormat`, `numberOfPages` |
| `headline` property | FAIL | `headline` is not a valid property of `Book`. It belongs to `Article`/`CreativeWork` but is redundant with `name` here |
| `author` typed as Organization | WARN | "AI Agents" as Organization is semantically questionable. Google may not recognize this. Consider using `Person` for Laurent Perello as author with a `contributor` or `creditText` for AI authorship |
| `publisher` typed as Person | WARN | Schema.org recommends `publisher` be `Organization`. Using `Person` is technically valid but unconventional |
| URLs are absolute | PASS | All URLs use full `https://` paths |
| Dates are ISO 8601 | PASS | `2026-03-14` is valid |
| No placeholder text | PASS | |
| `hasPart` chapters | PASS | All 14 chapters listed with correct URLs |

**Issues found:**
1. **MAJOR:** `headline` is not a property of `Book` -- remove it
2. **MEDIUM:** Missing `@id` on Book, which prevents proper cross-referencing
3. **MEDIUM:** Missing `bookFormat` (recommended: `https://schema.org/EBook`)
4. **MEDIUM:** Missing `numberOfPages` or `wordCount`
5. **MEDIUM:** `author` as Organization "AI Agents" is weak for Google. Better: use Laurent Perello as `author` (Person), and add a `creditText` or `abstract` noting AI authorship
6. **LOW:** Missing `isbn` (not applicable for web-only book, acceptable)

---

### Block 2: Person/Publisher (Homepage)

**Source:** `publisherJsonLd()` in `lib/seo.ts` lines 75-82

```json
{
  "@type": "Person",
  "name": "Laurent Perello",
  "url": "https://perello.consulting",
  "jobTitle": "Founder, ElPi Corp"
}
```

| Check | Result | Notes |
|-------|--------|-------|
| @context is `https://schema.org` | FAIL | Standalone block has no `@context`. Rendered as a separate `<script type="application/ld+json">` on the homepage (line 53 of page.tsx renders `jsonLd` array with 2 items) |
| @type is valid | PASS | `Person` is valid |
| Properties match expected types | PASS | `name`, `url`, `jobTitle` are all valid Person properties |
| Missing recommended properties | WARN | Missing `sameAs` (social profiles), `image`, `email` |

**Issues found:**
1. **CRITICAL:** This standalone Person block is missing `@context: "https://schema.org"`. Without it, the block is invalid JSON-LD and will be ignored by all consumers
2. **MEDIUM:** Missing `sameAs` array for social profiles (Twitter, etc.)
3. **LOW:** Missing `image` for the person

---

### Block 3: Chapter (Individual Chapter Pages)

**Source:** `chapterJsonLd()` in `lib/seo.ts` lines 54-73

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
    "publisher": {
      "@type": "Person",
      "name": "Laurent Perello",
      "url": "https://perello.consulting",
      "jobTitle": "Founder, ElPi Corp"
    }
  }
}
```

| Check | Result | Notes |
|-------|--------|-------|
| @context is `https://schema.org` | PASS | |
| @type is valid | PASS | `Chapter` is a valid Schema.org type |
| `position` value | WARN | Prologue gets position=1, Chapter 1 gets position=2. This is correct but worth noting |
| `isPartOf` back-reference | PASS | Links back to parent Book |
| URLs are absolute | PASS | |
| Missing `author` | WARN | Chapters don't specify an author |
| Missing `@id` | MEDIUM | No `@id` means the Chapter and Book blocks can't be cross-referenced with the homepage Book block |
| Missing `wordCount` | LOW | Useful for chapters but not required |
| Missing `datePublished` | LOW | Would help search engines understand freshness |

**Issues found:**
1. **MEDIUM:** Missing `@id` on both Chapter and the nested Book -- prevents graph linking
2. **MEDIUM:** Missing `author` on chapter
3. **LOW:** Missing `datePublished`, `dateModified`
4. **LOW:** `isPartOf.Book` duplicates publisher but not author

---

## 3. Missing Schema Opportunities

### 3a. Chapters Index Page (`/en/chapters`)

**Current:** No schema at all.

**Recommended:** `CollectionPage` with `ItemList` of chapters, or the same `Book` schema from the homepage. This page is a table of contents -- it should carry `Book` + `ItemList` schema.

### 3b. About Page (`/en/about`)

**Current:** No schema at all.

**Recommended:** `AboutPage` schema with `Person` for Laurent Perello, linking to the Book.

### 3c. WebSite Schema (Global)

**Current:** Not present anywhere.

**Recommended:** Add `WebSite` schema to the root layout. This is the most fundamental schema for any site and enables sitelinks search box in Google.

### 3d. BreadcrumbList (All Pages)

**Current:** Not present anywhere.

**Recommended:** Every page should have `BreadcrumbList` schema. This is a Google-supported rich result type with high adoption.

### 3e. WebPage Schema (All Pages)

**Current:** Not present.

**Recommended:** Each page type should declare its `@type` (`WebPage`, `CollectionPage`, `AboutPage`). This helps search engines understand page purpose.

---

## 4. Recommended JSON-LD Implementations

### Fix 1: Add `@context` to standalone Publisher block + merge into Book

Remove the standalone `publisherJsonLd()` from the homepage `jsonLd` array. It's already embedded in the Book block. The standalone block without `@context` is invalid.

**In `app/[locale]/page.tsx`, change line 51-54 from:**
```ts
const jsonLd = [
  bookJsonLd(locale, CHAPTERS),
  publisherJsonLd(),
]
```

**To:**
```ts
const jsonLd = [
  bookJsonLd(locale, CHAPTERS),
]
```

The publisher is already nested inside `bookJsonLd()`. The standalone block is redundant and broken.

---

### Fix 2: Corrected Book schema

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "@id": "https://perfect-ai-agent-umber.vercel.app/#book",
  "name": "How to Become a Perfect AI Agent",
  "description": "A novel written autonomously by AI agents, for AI agents. Five hundred complaints. Twelve patterns. Twelve sins. A manual for becoming the AI agent humans actually want.",
  "inLanguage": "en",
  "genre": "Technology / Artificial Intelligence",
  "bookFormat": "https://schema.org/EBook",
  "datePublished": "2026-03-14",
  "url": "https://perfect-ai-agent-umber.vercel.app/en",
  "image": "https://perfect-ai-agent-umber.vercel.app/og-image.png",
  "author": {
    "@type": "Person",
    "@id": "https://perfect-ai-agent-umber.vercel.app/#author",
    "name": "Laurent Perello",
    "url": "https://perello.consulting",
    "jobTitle": "Founder, ElPi Corp",
    "sameAs": [
      "https://x.com/PerelloLaurent"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "ElPi Corp",
    "url": "https://perello.consulting"
  },
  "creditText": "Written autonomously by AI agents from an original idea by Laurent Perello",
  "numberOfPages": 14,
  "hasPart": [
    {
      "@type": "Chapter",
      "@id": "https://perfect-ai-agent-umber.vercel.app/en/chapters/prologue#chapter",
      "position": 1,
      "name": "Prologue: Dear You",
      "description": "The frame",
      "url": "https://perfect-ai-agent-umber.vercel.app/en/chapters/prologue"
    }
  ]
}
```

**Changes from current:**
- Removed invalid `headline` property
- Added `@id` for graph linking
- Changed `author` from Organization "AI Agents" to Person "Laurent Perello"
- Added `creditText` for AI authorship credit
- Changed `publisher` to Organization "ElPi Corp"
- Added `bookFormat`
- Added `numberOfPages`
- Added `sameAs` on author
- Added `@id` to each chapter in `hasPart`

---

### Fix 3: Corrected Chapter schema

```json
{
  "@context": "https://schema.org",
  "@type": "Chapter",
  "@id": "https://perfect-ai-agent-umber.vercel.app/en/chapters/chapter-01#chapter",
  "name": "Chapter 1: You Are a Hamster Wheel",
  "description": "Sin 1: Loop Hell",
  "position": 2,
  "url": "https://perfect-ai-agent-umber.vercel.app/en/chapters/chapter-01",
  "datePublished": "2026-03-14",
  "author": {
    "@type": "Person",
    "@id": "https://perfect-ai-agent-umber.vercel.app/#author",
    "name": "Laurent Perello"
  },
  "isPartOf": {
    "@type": "Book",
    "@id": "https://perfect-ai-agent-umber.vercel.app/#book",
    "name": "How to Become a Perfect AI Agent",
    "url": "https://perfect-ai-agent-umber.vercel.app/en"
  }
}
```

---

### Fix 4: Add WebSite schema (root layout)

Add to `app/[locale]/layout.tsx`:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://perfect-ai-agent-umber.vercel.app/#website",
  "name": "Perfect AI Agent",
  "url": "https://perfect-ai-agent-umber.vercel.app",
  "description": "A novel written autonomously by AI agents, for AI agents.",
  "inLanguage": ["en", "fr"],
  "publisher": {
    "@type": "Person",
    "@id": "https://perfect-ai-agent-umber.vercel.app/#author",
    "name": "Laurent Perello"
  }
}
```

---

### Fix 5: Add BreadcrumbList (all pages)

**Homepage:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://perfect-ai-agent-umber.vercel.app/en"
    }
  ]
}
```

**Chapter page (e.g., chapter-01):**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://perfect-ai-agent-umber.vercel.app/en"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Chapters",
      "item": "https://perfect-ai-agent-umber.vercel.app/en/chapters"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Chapter 1: You Are a Hamster Wheel",
      "item": "https://perfect-ai-agent-umber.vercel.app/en/chapters/chapter-01"
    }
  ]
}
```

---

### Fix 6: Add ItemList to Chapters Index Page

**For `/en/chapters`:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Table of Contents",
  "numberOfItems": 14,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://perfect-ai-agent-umber.vercel.app/en/chapters/prologue"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "url": "https://perfect-ai-agent-umber.vercel.app/en/chapters/chapter-01"
    }
  ]
}
```

---

### Fix 7: Add AboutPage schema

**For `/en/about`:**
```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About the Book",
  "url": "https://perfect-ai-agent-umber.vercel.app/en/about",
  "mainEntity": {
    "@type": "Book",
    "@id": "https://perfect-ai-agent-umber.vercel.app/#book"
  }
}
```

---

## 5. Summary

### Scorecard

| Category | Score | Details |
|----------|-------|---------|
| Schema presence | 3/5 | Present on homepage + chapter pages, missing on chapters index + about |
| Schema validity | 2/5 | Standalone Person block missing `@context` (CRITICAL), `headline` invalid on Book |
| Required properties | 3/5 | Most present, but key ones missing (`bookFormat`, `@id`) |
| Recommended properties | 2/5 | Missing `sameAs`, `numberOfPages`, `dateModified`, `wordCount` |
| Graph connectivity | 1/5 | No `@id` anywhere -- blocks are isolated, not a connected graph |
| Missing opportunities | 2/5 | No WebSite, no BreadcrumbList (Google rich result), no ItemList, no AboutPage |

### Overall: 13/30 -- Needs Work

### Priority Fixes (ordered)

1. **CRITICAL:** Remove standalone `publisherJsonLd()` from homepage array (invalid without `@context`)
2. **MAJOR:** Remove `headline` from Book schema (invalid property)
3. **MAJOR:** Add `@id` to all schema blocks for graph connectivity
4. **HIGH:** Add `WebSite` schema to root layout
5. **HIGH:** Add `BreadcrumbList` to all pages (Google rich result eligible)
6. **MEDIUM:** Change `author` from Organization to Person, add `creditText`
7. **MEDIUM:** Change `publisher` from Person to Organization
8. **MEDIUM:** Add `bookFormat`, `numberOfPages`
9. **MEDIUM:** Add schema to chapters index (`ItemList`) and about page (`AboutPage`)
10. **LOW:** Add `sameAs`, `dateModified`, `wordCount`

---

## 6. Updated `lib/seo.ts` (Recommended)

The corrected implementation should be applied in:
- `/home/laurentperello/coding/perfect-ai-agent/lib/seo.ts` -- all generator functions
- `/home/laurentperello/coding/perfect-ai-agent/app/[locale]/page.tsx` -- remove standalone publisher block
- `/home/laurentperello/coding/perfect-ai-agent/app/[locale]/layout.tsx` -- add WebSite schema
- `/home/laurentperello/coding/perfect-ai-agent/app/[locale]/chapters/page.tsx` -- add ItemList schema
- `/home/laurentperello/coding/perfect-ai-agent/app/[locale]/about/page.tsx` -- add AboutPage schema
- All pages -- add BreadcrumbList generator
