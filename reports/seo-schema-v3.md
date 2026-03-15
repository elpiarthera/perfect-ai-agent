# Schema.org Structured Data Audit (v3)
**Site:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14
**Auditor:** seo-schema agent
**Previous audits:** seo-schema.md (v1), seo-schema-v2.md (v2)

---

## 0. Previous Issues Tracker

| # | Issue from v2 | Severity | v2 Status | v3 Status | Notes |
|---|---------------|----------|-----------|-----------|-------|
| 1 | Standalone Person block without `@context` | CRITICAL | PARTIALLY FIXED (source only) | FIXED | Block removed from live site. Only Book renders on homepage. |
| 2 | `headline` on Book (invalid property) | MAJOR | PARTIALLY FIXED (source only) | FIXED | No longer present on live site. |
| 3 | No `@id` linking anywhere | MAJOR | FIXED IN SOURCE | FIXED | `@id` present on Book (`#book`), all 14 Chapter entries, and Chapter pages use `@id` references. |
| 4 | Missing `WebSite` schema | HIGH | NOT FIXED | FIXED IN SOURCE, NOT DEPLOYED | `websiteJsonLd()` exists in `lib/seo.ts` and is called in `page.tsx`, but **live homepage does not render it**. See Section 2.1. |
| 5 | Missing `BreadcrumbList` | HIGH | NOT FIXED | FIXED IN SOURCE, NOT DEPLOYED | `breadcrumbJsonLd()` exists in `lib/seo.ts` and is called in chapter `page.tsx`, but **live chapter pages do not render it**. |
| 6 | Author as Organization "AI Agents" | MEDIUM | NOT FIXED | PARTIALLY FIXED | Source code uses `Person` with `@id`. **Live site still shows `{"@type": "Organization", "name": "AI Agents"}`**. Deployment gap. |
| 7 | Publisher as Person (should be Organization) | MEDIUM | NOT FIXED | PARTIALLY FIXED | Source code uses `Organization`. **Live site still shows `Person`**. Deployment gap. |
| 8 | Missing `bookFormat`, `numberOfPages` | MEDIUM | NOT FIXED | FIXED IN SOURCE, NOT DEPLOYED | Source has `bookFormat: "https://schema.org/EBook"` and `numberOfPages: 14`. Live site has neither. |
| 9 | Missing schema on Chapters index + About | MEDIUM | NOT FIXED | NOT FIXED | No JSON-LD on either page, in source or live. |
| 10 | Missing `sameAs`, `dateModified`, `wordCount` | LOW | NOT FIXED | NOT FIXED | `sameAs` not in source. No `dateModified` or `wordCount` anywhere. |

**Summary:** Source code has fixed 8 of 10 issues. The live site reflects fixes for issues 1, 2, and 3 only. Issues 4-8 are fixed in code but **not yet deployed**. Issues 9-10 remain unfixed everywhere.

---

## 1. Live Detection Results

### Pages Audited

| Page | JSON-LD Blocks | Types Found |
|------|---------------|-------------|
| `/en` (homepage) | 1 | `Book` (with nested `Chapter` x14) |
| `/en/chapters/chapter-01` | 1 | `Chapter` |
| `/en/chapters` (index) | 0 | None |
| `/en/about` | 0 | None |

**No Microdata, RDFa, or other structured data formats detected on any page.**

---

## 2. Validation -- Live Blocks

### 2.1 Homepage: Book (1 block)

Live JSON-LD (key fields):

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "@id": "https://perfect-ai-agent-umber.vercel.app/en#book",
  "name": "How to Become a Perfect AI Agent",
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
  "hasPart": [ ... 14 chapters with @id ... ]
}
```

| Check | Result | Detail |
|-------|--------|--------|
| `@context` = `https://schema.org` | PASS | |
| `@type` valid, not deprecated | PASS | `Book` is valid |
| `@id` present | PASS | `...#book` -- **fixed since v2** |
| `name` present | PASS | |
| `headline` absent | PASS | **fixed since v2** -- no longer has invalid `headline` property |
| `description` present | PASS | |
| `datePublished` ISO 8601 | PASS | `2026-03-14` |
| `url` absolute | PASS | |
| `image` absolute | PASS | |
| `author` typed correctly | FAIL | Still `Organization "AI Agents"`. Google cannot verify. Source code has `Person` -- not deployed. |
| `publisher` typed correctly | FAIL | Still `Person`. Google expects `Organization`. Source code fixed -- not deployed. |
| `bookFormat` present | FAIL | Missing. Source has `https://schema.org/EBook` -- not deployed. |
| `numberOfPages` present | FAIL | Missing. Source has `14` -- not deployed. |
| `creditText` present | FAIL | Missing. Source has it -- not deployed. |
| `hasPart` chapters | PASS | 14 chapters, all with correct URLs, positions, and `@id` |
| No placeholder text | PASS | |
| URLs absolute throughout | PASS | |

**Verdict: 10 PASS, 5 FAIL (down from 5 FAIL + 2 WARN in v2)**

**Missing schema on homepage (source exists, not deployed):**
- `WebSite` schema: `websiteJsonLd()` is called in `page.tsx` line 59, but live site only renders 1 block (Book). The WebSite block is not in the HTML.

---

### 2.2 Chapter 1 Page: Chapter (1 block)

Live JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "Chapter",
  "@id": "https://perfect-ai-agent-umber.vercel.app/en/chapters/chapter-01#chapter",
  "name": "Chapter 1: You Are a Hamster Wheel",
  "description": "Sin 1: Loop Hell",
  "position": 2,
  "url": "https://perfect-ai-agent-umber.vercel.app/en/chapters/chapter-01",
  "isPartOf": {
    "@id": "https://perfect-ai-agent-umber.vercel.app/en#book"
  }
}
```

| Check | Result | Detail |
|-------|--------|--------|
| `@context` = `https://schema.org` | PASS | |
| `@type` valid | PASS | `Chapter` is valid |
| `@id` present | PASS | **Fixed since v2** |
| `name` present | PASS | |
| `description` present | PASS | |
| `position` correct | PASS | Position 2 (Prologue = 1) |
| `url` absolute | PASS | |
| `isPartOf` present | PASS | References parent Book |
| `isPartOf` uses `@id` reference | PASS | **Fixed since v2** -- lean `@id`-only reference, not nested object |
| `author` present | FAIL | Missing. Source code has `{ "@id": ".../#author" }` -- not deployed. |
| `datePublished` present | FAIL | Missing. Source code has `PUBLICATION_DATE` -- not deployed. |

**Verdict: 9 PASS, 2 FAIL (up from 6 PASS, 5 FAIL in v2)**

**Missing schema (source exists, not deployed):**
- `BreadcrumbList`: `breadcrumbJsonLd()` is called in `[slug]/page.tsx` line 100-104, but live site only renders 1 block (Chapter). The BreadcrumbList block is not in the HTML.

---

## 3. Source Code vs Live Delta

| Property | Source Code (`lib/seo.ts`) | Live Site | Gap |
|----------|---------------------------|-----------|-----|
| `WebSite` schema block | Present, called in `page.tsx` | **Not rendered** | DEPLOY |
| `BreadcrumbList` block | Present, called in `[slug]/page.tsx` | **Not rendered** | DEPLOY |
| `Book.author` | `Person` with `@id: #author` | `Organization "AI Agents"` | DEPLOY |
| `Book.publisher` | `Organization "ElPi Corp"` | `Person "Laurent Perello"` | DEPLOY |
| `Book.bookFormat` | `https://schema.org/EBook` | Missing | DEPLOY |
| `Book.numberOfPages` | `14` | Missing | DEPLOY |
| `Book.creditText` | Present | Missing | DEPLOY |
| `Chapter.author` | `{ "@id": ".../#author" }` | Missing | DEPLOY |
| `Chapter.datePublished` | `2026-03-14` | Missing | DEPLOY |
| `Book.@id` | `...#book` | Present | IN SYNC |
| `Chapter.@id` | `...#chapter` | Present | IN SYNC |
| `Chapter.isPartOf` | `@id` reference | `@id` reference | IN SYNC |

**9 properties are fixed in source but not deployed. 3 properties are in sync.**

---

## 4. Source Code Validation

Validating `lib/seo.ts` as-written (what will appear after deploy).

### 4.1 `websiteJsonLd()`

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: BOOK_DESCRIPTION,
  publisher: {
    '@type': 'Organization',
    name: PUBLISHER_ORG.name,
    url: PUBLISHER_ORG.url,
  },
}
```

| Check | Result | Detail |
|-------|--------|--------|
| `@context` correct | PASS | |
| `@type` valid | PASS | |
| `@id` present | PASS | `#website` |
| `name` present | PASS | |
| `url` present | PASS | |
| `publisher` as Organization | PASS | |
| `inLanguage` present | FAIL | Missing. Should be `['en', 'fr']` for multilingual site. v2 recommendation included this. |
| `potentialAction` (SearchAction) | SKIP | No site search -- not applicable |

**Verdict: 6 PASS, 1 FAIL**

### 4.2 `bookJsonLd()`

| Check | Result | Detail |
|-------|--------|--------|
| `@context` correct | PASS | |
| `@type` valid | PASS | |
| `@id` present | PASS | `.../${locale}#book` |
| `name` present | PASS | |
| `bookFormat` valid | PASS | `https://schema.org/EBook` -- correct full URI |
| `numberOfPages` present | PASS | `14` |
| `author` as Person | PASS | With `@id: #author`, name, url, jobTitle |
| `publisher` as Organization | PASS | |
| `creditText` present | PASS | AI authorship context preserved |
| `hasPart` with `@id` | PASS | All 14 chapters have `@id` |
| `author.sameAs` present | FAIL | Not in source. v2 recommendation included `sameAs: ['https://x.com/PerelloLaurent']` |
| `image` present | FAIL | Source code removed `image: OG_IMAGE`. Live site has it. Regression. |

**Verdict: 10 PASS, 2 FAIL**

### 4.3 `chapterJsonLd()`

| Check | Result | Detail |
|-------|--------|--------|
| `@context` correct | PASS | |
| `@type` valid | PASS | |
| `@id` present | PASS | |
| `name` present | PASS | |
| `description` present | PASS | |
| `position` present | PASS | |
| `url` absolute | PASS | |
| `author` present | PASS | Uses `@id` reference -- correct pattern |
| `isPartOf` uses `@id` | PASS | Lean reference -- correct pattern |
| `datePublished` present | FAIL | Not in source. v2 recommendation included it. `chapterJsonLd()` at line 100-118 has no `datePublished`. |
| `wordCount` present | FAIL | Low priority, still missing |

**Verdict: 9 PASS, 2 FAIL**

### 4.4 `breadcrumbJsonLd()`

| Check | Result | Detail |
|-------|--------|--------|
| `@context` correct | PASS | |
| `@type` valid | PASS | Google-supported rich result type |
| `itemListElement` structure | PASS | Proper `ListItem` with `position`, `name`, `item` |
| URLs absolute | PASS | Caller provides absolute URLs |

**Verdict: 4 PASS, 0 FAIL -- Clean.**

### 4.5 `authorJsonLd()` (standalone helper)

| Check | Result | Detail |
|-------|--------|--------|
| No `@context` | OK | This is designed as an embedded sub-object, not a standalone block. Correct usage. |
| `@type` Person | PASS | |
| `@id` present | PASS | `#author` |
| `sameAs` present | FAIL | Missing social profile links |

**Verdict: 2 PASS, 1 FAIL**

---

## 5. Issues Found in Current Source Code

### 5.1 MEDIUM: `chapterJsonLd()` missing `datePublished`

The v2 report recommended adding `datePublished: PUBLICATION_DATE` to `chapterJsonLd()`. The function at line 100-118 of `lib/seo.ts` does not include it. The `author` reference was added (`{ '@id': '.../#author' }`) but `datePublished` was not.

**Fix:** Add `datePublished: PUBLICATION_DATE,` after line 112 in `lib/seo.ts`.

### 5.2 MEDIUM: `bookJsonLd()` missing `image`

The live site currently has `"image": "https://perfect-ai-agent-umber.vercel.app/og-image.png"` on the Book. The source code in `bookJsonLd()` (lines 66-98) does not include an `image` property. This is a regression -- the previous version had it.

**Fix:** Add `image: \`${SITE_URL}/og-image.png\`,` to `bookJsonLd()`.

### 5.3 LOW: `websiteJsonLd()` missing `inLanguage`

For a bilingual site, `inLanguage: ['en', 'fr']` should be present on the WebSite entity.

**Fix:** Add `inLanguage: ['en', 'fr'],` to `websiteJsonLd()`.

### 5.4 LOW: No `sameAs` on author

`authorJsonLd()` and the inline author in `bookJsonLd()` lack `sameAs` for social profiles.

**Fix:** Add `sameAs: ['https://x.com/PerelloLaurent'],` to `authorJsonLd()`.

### 5.5 MEDIUM: No schema on `/en/chapters` (index page)

This page lists all 14 chapters but has no structured data. A `CollectionPage` + `ItemList` would be appropriate.

### 5.6 MEDIUM: No schema on `/en/about`

An `AboutPage` referencing the Book `@id` would complete the site's knowledge graph.

---

## 6. Scorecard

### Per-Page Scores (Live Site)

| Page | v2 Score | v3 Score | Delta | Notes |
|------|----------|----------|-------|-------|
| `/en` (homepage) | 4/10 | 7/10 | +3 | `@id` deployed, `headline` removed, broken Person block gone. Still missing: correct author/publisher/bookFormat/WebSite. |
| `/en/chapters/chapter-01` | 5/10 | 8/10 | +3 | `@id` deployed, `isPartOf` uses lean `@id` reference. Still missing: author, datePublished, BreadcrumbList. |
| `/en/chapters` (index) | 0/10 | 0/10 | 0 | No schema. |
| `/en/about` | 0/10 | 0/10 | 0 | No schema. |

### Category Scores

| Category | v1 | v2 | v3 | Delta v2->v3 | Notes |
|----------|----|----|----|----|-------|
| Schema presence | 3/5 | 3/5 | 3/5 | 0 | Same 3 page types have schema. Chapters index + About still empty. |
| Schema validity | 2/5 | 2/5 | 4/5 | +2 | No invalid properties remain on live site. `headline` gone, broken Person gone. Author/publisher typing still wrong on live. |
| Required properties | 3/5 | 3/5 | 4/5 | +1 | `@id` linking deployed. `bookFormat` and `author.datePublished` still missing on live. |
| Recommended properties | 2/5 | 2/5 | 2/5 | 0 | No `sameAs`, `numberOfPages`, `creditText`, `image` on live. Source has some. |
| Graph connectivity | 1/5 | 1/5 | 3/5 | +2 | `@id` references working: Book `#book`, Chapter `#chapter`, `isPartOf` links. Missing: `#website` not deployed, `#author` not cross-referenced on live. |
| Missing opportunities | 2/5 | 2/5 | 2/5 | 0 | WebSite in source but not live. No ItemList, no AboutPage. |

### Overall

| Audit | Score | Rating |
|-------|-------|--------|
| v1 | 13/30 | Poor |
| v2 | 13/30 | Poor (no deployment) |
| **v3 (live)** | **18/30** | **Fair** |
| **v3 (after deploy)** | **24/30** | **Good** |
| **v3 (after deploy + remaining fixes)** | **28/30** | **Excellent** |

---

## 7. Improvements Since v2

Confirmed fixes deployed to live site:

1. **Removed broken standalone Person block** -- no more invalid JSON-LD without `@context`
2. **Removed invalid `headline` property** from Book
3. **Added `@id` to Book** (`#book`) -- enables cross-referencing
4. **Added `@id` to all 14 Chapter entries** in `hasPart`
5. **Chapter pages use lean `@id` reference** for `isPartOf` instead of nested full object
6. **Chapter pages have `@id`** on their own Chapter entity

These are significant structural improvements. The knowledge graph now has proper entity linking between Book and Chapters.

---

## 8. Priority Action Plan

### Tier 1: Deploy Current Source (0 code changes)

| Action | Issues Resolved | Impact |
|--------|----------------|--------|
| Deploy current `lib/seo.ts` + `page.tsx` + `[slug]/page.tsx` to Vercel | 6, 7, 8 (author/publisher/bookFormat) | +6 points estimated. WebSite and BreadcrumbList blocks also go live. |

**Expected score after deploy: 24/30**

### Tier 2: Quick Source Fixes (< 15 min)

| # | Fix | File | Line | Change |
|---|-----|------|------|--------|
| 1 | Add `datePublished` to Chapter | `lib/seo.ts` | After line 112 | `datePublished: PUBLICATION_DATE,` |
| 2 | Add `image` to Book (regression) | `lib/seo.ts` | In `bookJsonLd()` | `image: \`${SITE_URL}/og-image.png\`,` |
| 3 | Add `inLanguage` to WebSite | `lib/seo.ts` | In `websiteJsonLd()` | `inLanguage: ['en', 'fr'],` |
| 4 | Add `sameAs` to author | `lib/seo.ts` | In `authorJsonLd()` | `sameAs: ['https://x.com/PerelloLaurent'],` |

### Tier 3: New Schema (< 30 min)

| # | Action | File | Schema Type |
|---|--------|------|-------------|
| 5 | Add `ItemList` to chapters index | `app/[locale]/chapters/page.tsx` | `CollectionPage` + `ItemList` |
| 6 | Add `AboutPage` schema | `app/[locale]/about/page.tsx` | `AboutPage` with `mainEntity` -> `@id: #book` |

### Expected Score After All Fixes: 28/30

Remaining 2 points would require `wordCount` per chapter (low ROI) and `dateModified` tracking (requires build-time logic).

---

## 9. Deployment Gap Analysis

The core problem across all three audits: **source code fixes are not reaching the live site consistently**. The homepage `page.tsx` calls both `websiteJsonLd()` and `bookJsonLd()` (lines 58-61), yet the live site only renders the Book block.

Possible causes:
- Vercel deployment cache serving stale build
- Build error silently dropping the WebSite block
- Static generation (`force-static`) caching an older version

**Recommendation:** Force a full Vercel redeploy with cache clear (`vercel --force`), then re-verify.

---

*Report generated by seo-schema agent. Validate all changes with [Google Rich Results Test](https://search.google.com/test/rich-results) after deployment.*
