# GEO Audit: API & RSS Feed

**Target:** https://perfect-ai-agent-umber.vercel.app
**Date:** 2026-03-14
**Endpoints audited:**
- `/api/chapters` (list mode)
- `/api/chapters?slug=chapter-01` (single chapter mode)
- `/api/chapters?locale=fr` (French locale)
- `/feed.xml` (RSS 2.0)

---

## API Endpoint: `/api/chapters`

### 1. Discoverability (5/10)

**What works:**
- Correct `Content-Type: application/json`
- Returns proper HTTP 200 with structured JSON
- Validates locale parameter (returns 400 for invalid values)
- Returns 404 with helpful error for unknown slugs

**What's missing:**
- **No CORS headers.** Cross-origin requests from AI services (Perplexity, ChatGPT plugins, browser-based agents) will be blocked. No `Access-Control-Allow-Origin` header present at all. This is the single biggest barrier to GEO discoverability.
- No `robots.txt` or sitemap reference pointing to the API
- No OpenAPI/Swagger spec for automated discovery
- No `Link` header for pagination or API documentation
- No rate-limit headers (`X-RateLimit-*`) to signal usage policy

### 2. Schema Quality (7/10)

**What works:**
- Clean, well-named fields: `slug`, `title`, `subtitle`, `sin`, `summary`, `position`, `locale`
- Consistent structure across all 14 chapters
- Book-level metadata wrapper with `book` + `chapters` separation
- Single chapter mode uses `chapter` (singular) vs `chapters` (plural) -- clear

**What's missing:**
- `themes` field is `null` for every chapter -- dead field, pollutes the schema
- No `url` field on chapters -- consumers must construct URLs themselves
- No `readingTime` or `estimatedMinutes` field
- No `publishedAt` / `updatedAt` timestamps
- No schema version field (e.g., `"apiVersion": "1.0"`)

### 3. Filtering (8/10)

**What works:**
- `?locale=en` and `?locale=fr` switch correctly
- `?slug=chapter-01` returns single chapter with full body
- Invalid locale returns 400 with clear error message
- Invalid slug returns 404 with clear error message
- Combined `?slug=X&locale=Y` works

**What's missing:**
- No pagination support (acceptable for 14 items, but not future-proof)
- No `?fields=` parameter to request specific fields
- No `?format=` parameter (e.g., `?format=plain` vs `?format=mdx`)

### 4. Content Depth (8/10)

**What works:**
- Single chapter mode returns full `body` field (12,766 chars for chapter-01)
- `word_count` included (3,480 for chapter-01)
- `status` field included (draft-1)
- Plain text stripped cleanly from MDX -- no JSX artifacts, no import statements
- Summary is auto-generated (first 200 chars) for list mode

**What's missing:**
- No `excerpt` vs `summary` distinction -- summary is just a truncated body, not a curated synopsis
- Body includes the opening epigraph mixed into prose -- no structured `quotes` or `citations` field
- No table of contents / section headings extracted from the chapter body
- `themes` is always null -- this should carry the sin taxonomy

### 5. Metadata (7/10)

**What works:**
- `book.title`, `book.author`, `book.totalChapters`, `book.locale` all present
- Every chapter has `position` for ordering
- `sin` field carries the thematic classification

**What's missing:**
- No `book.description` or `book.tagline`
- No `book.isbn` or `book.url` (canonical link to the book)
- No `book.language` (separate from `locale`)
- No `book.publishedDate`
- No `book.coverImage`
- No chapter-level `url` field (absolute URL to the web page)

### API Total: 35/50

---

## RSS Feed: `/feed.xml`

### 1. Validity (8/10)

**What works:**
- Proper RSS 2.0 declaration with `xmlns:atom`
- `atom:link` self-reference present (required for valid RSS)
- XML escaping function handles `&`, `<`, `>`, `"`, `'`
- Correct `Content-Type: application/rss+xml; charset=utf-8`
- Caching enabled: `max-age=3600`

**What's missing:**
- No `<pubDate>` on individual items -- RSS readers and AI crawlers use this for recency signals
- No `<copyright>` element
- `<author>` should technically be an email per RSS spec (e.g., `laurent@perello.com (Laurent Perello)`)

### 2. Completeness (9/10)

**What works:**
- All 14 chapters present as items (prologue through epilogue)
- Correct order maintained
- Description includes first 300 chars of body text
- Each item has title, description, link, guid, author, category

**What's missing:**
- No `<enclosure>` for cover art or chapter images
- English only -- no French feed variant (e.g., `/feed-fr.xml` or `/fr/feed.xml`)

### 3. Metadata (7/10)

**What works:**
- `<title>`: "The Perfect AI Agent"
- `<description>`: Full book tagline present and compelling
- `<managingEditor>`: Laurent Perello
- `<language>`: en
- `<lastBuildDate>`: Dynamic, accurate

**What's missing:**
- No `<image>` element (channel-level cover art)
- No `<category>` at channel level (e.g., "Books", "Artificial Intelligence")
- No `<ttl>` element
- No `<generator>` element
- No `<webMaster>` element

### 4. Links (9/10)

**What works:**
- All item links resolve correctly (HTTP 200)
- Links use locale-prefixed paths: `/en/chapters/prologue`
- `guid isPermaLink="true"` correctly set
- Channel link points to root

**What's missing:**
- No `<source>` element on items
- Links hardcode the Vercel preview URL -- should use production domain when available

### RSS Total: 33/40

---

## GEO Assessment: Can AI Engines Use This Data?

### Scenario: Perplexity wants to cite this book

**Current state:** Partially possible.
- Perplexity could crawl `/feed.xml` and get titles + 300-char descriptions
- It could fetch `/api/chapters?slug=X` for full text
- **Blocker:** No CORS means browser-based retrieval fails. Server-side crawlers work fine.
- **Gap:** No pubDate means Perplexity can't show "published March 2026" -- hurts recency signal

### Scenario: ChatGPT plugin or GPT Action wants to serve chapter content

**Current state:** Blocked.
- No CORS headers = cross-origin fetch fails
- No OpenAPI spec = cannot register as a GPT Action
- The JSON structure is clean enough that an OpenAPI wrapper would work well

### Scenario: Claude wants to recommend the book with accurate info

**Current state:** Works well via server-side fetch.
- Book metadata (title, author, 14 chapters) is clean and parseable
- Chapter summaries provide context for recommendations
- Sin taxonomy enables topical matching ("the chapter about AI hallucinations" -> chapter-04)
- Full body text available per chapter for deep content understanding

### Overall GEO Score: 7/10

The data structure is solid. The content is rich. The main barriers are infrastructure-level: missing CORS, missing timestamps, missing OpenAPI spec. These are all fixable without touching the content.

---

## Priority Fixes

### CRITICAL (blocks AI engine access)

1. **Add CORS headers to `/api/chapters`**
   ```typescript
   // In route.ts, add to all responses:
   headers: {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'GET',
     'Access-Control-Allow-Headers': 'Content-Type',
   }
   ```
   Impact: Unblocks ChatGPT Actions, browser-based AI tools, Perplexity plugins.

2. **Add `pubDate` to RSS items**
   ```typescript
   <pubDate>${new Date().toUTCString()}</pubDate>
   ```
   Better: store actual publish dates in frontmatter and use those.
   Impact: Enables recency signals for all RSS consumers.

### HIGH (improves AI discoverability)

3. **Add canonical `url` field to each chapter in API response**
   ```typescript
   chapter.url = `https://perfect-ai-agent-umber.vercel.app/${locale}/chapters/${slug}`
   ```

4. **Add `book.description` to API response**
   Already exists in RSS feed -- reuse it.

5. **Remove dead `themes` field or populate it**
   Currently null for all chapters. Either fill from frontmatter or remove to keep schema clean.

6. **Create `/api/chapters/openapi.json`**
   Even a minimal OpenAPI 3.0 spec enables GPT Actions and other AI integrations.

### MEDIUM (improves content quality for AI)

7. **Add curated `excerpt` field (separate from truncated summary)**
   Current summary is a mechanical first-200-chars truncation. A hand-written 1-2 sentence synopsis per chapter would dramatically improve AI citation quality.

8. **Add `publishedAt` timestamps to API chapters**
   Required for any AI that cares about content freshness.

9. **French locale is broken** -- titles show raw slug names (`prologue`, `chapter-01`), subtitle/sin are null, summary contains TODO markers. The `?locale=fr` endpoint is live but returns unfinished data. Either fix the French content or return 404/503 for `?locale=fr` until ready.

10. **Add French RSS feed** (`/feed-fr.xml` or `?locale=fr` parameter on feed)

---

## Source Files

- API route: `/home/laurentperello/coding/perfect-ai-agent/app/api/chapters/route.ts`
- RSS route: `/home/laurentperello/coding/perfect-ai-agent/app/feed.xml/route.ts`
