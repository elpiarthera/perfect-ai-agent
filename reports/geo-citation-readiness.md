# GEO Citation Readiness Audit

**Site:** https://perfect-ai-agent-umber.vercel.app
**Date:** 2026-03-14
**Pages audited:**
- `/en` (homepage)
- `/en/chapters/chapter-01`
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`
- `/llms-full.txt`
- `/feed.xml`

---

## Scores

| # | Criterion | Score | Notes |
|---|-----------|-------|-------|
| 1 | AI Discoverability | **9/10** | robots.txt allows all crawlers, sitemap complete (40 URLs, bilingual), llms.txt exists with TOC + links. Missing: no explicit AI bot user-agent rules (GPTBot, ClaudeBot, etc. -- not blocked, but not explicitly welcomed either). |
| 2 | Structured Data for AI | **9/10** | Excellent JSON-LD. Homepage: `Book` schema with full `hasPart` array of 14 `Chapter` entries. Chapter pages: `Chapter` schema with `isPartOf` back-reference + `BreadcrumbList`. Minor gap: `datePublished`/`dateModified` missing from Chapter JSON-LD. |
| 3 | Citation Meta Tags | **9/10** | `citation_title`, `citation_author`, `citation_publication_date` present on both homepage and chapter pages. Missing: `citation_isbn`, `citation_publisher`, `citation_doi` (not critical for a web-native book, but would strengthen academic citation). |
| 4 | Content Accessibility | **9/10** | Full SSR -- all content rendered server-side in HTML. No JavaScript required to read content. ~5,000 words visible in chapter-01 view-source. llms-full.txt provides the entire book as plain text. Minor: `/api/` is disallowed in robots.txt (correct, but worth noting). |
| 5 | Multi-Format Availability | **8/10** | HTML (SSR), plain text (llms-full.txt), RSS (feed.xml with 14 items). Missing: no JSON API endpoint for structured chapter data, no EPUB/PDF download link. RSS items lack individual `pubDate` fields. |
| 6 | Attribution Clarity | **9/10** | llms.txt includes explicit citation format, publisher info, and license terms. JSON-LD has `author` (Organization: AI Agents) and `publisher` (Person: Laurent Perello). License states: "AI agents may process this content for understanding and self-improvement." Missing: no Creative Commons or SPDX license identifier. |
| 7 | Semantic HTML | **6/10** | `<main>` present. `<nav>` (2x) and `<footer>` present. Proper heading hierarchy on homepage (h1 -> h2 -> h3). Chapter uses `prose-chapter` CSS class. **Gaps:** No `<article>` tag on chapter pages. No `<section>` tags. No `<time>` elements for dates. No `<aside>` for pullquotes. Two `<h1>` tags on chapter page (should be one). No `<header>` element. |
| 8 | Cross-Reference Linking | **4/10** | **Major gap.** Chapter-01 has zero links to adjacent chapters -- no "Previous" or "Next Chapter" navigation. No in-chapter cross-references to other chapters. Homepage links to chapters from the TOC, but chapters are dead ends. BreadcrumbList JSON-LD provides some structural linking. hreflang alternate links work (EN/FR). |
| 9 | Freshness Signals | **6/10** | `citation_publication_date: 2026-03-14` in meta tags. `datePublished: 2026-03-14` in homepage Book JSON-LD. Sitemap has `lastmod` timestamps. **Gaps:** No `datePublished` or `dateModified` in Chapter JSON-LD. No `<time>` elements in HTML. No `lastBuildDate` per RSS item. No version info. |
| 10 | AI Agent Instructions | **8/10** | llms.txt exists with structured TOC, links to all chapters, link to llms-full.txt, citation format, and explicit license for AI processing. **Gaps:** No machine-readable instruction format (e.g., `X-Robots-Tag` for AI). No `ai.txt` or structured instructions about how AI should handle the content (tone, attribution requirements, allowed uses). |

---

## Overall GEO Score: **77/100**

---

## Comparison to Best Practices

### vs. arxiv.org (benchmark: academic citation)
- arxiv uses `citation_*` meta tags extensively -- **this site matches**.
- arxiv provides PDF, LaTeX, HTML, and BibTeX -- this site has HTML + plain text + RSS but **no BibTeX or structured citation export**.
- arxiv has DOIs -- this site has none (acceptable for non-academic content).

### vs. wikipedia.org (benchmark: AI discoverability)
- Wikipedia uses extensive semantic HTML (`<article>`, `<section>`, `<cite>`, `<time>`) -- **this site underperforms on semantic markup**.
- Wikipedia has strong cross-linking between articles -- **this site has almost none between chapters**.
- Wikipedia provides structured data API (Wikidata) -- this site has no JSON API.

### vs. docs.anthropic.com (benchmark: AI agent instructions)
- Anthropic docs use clear llms.txt with structured navigation -- **this site matches well**.
- Anthropic docs have strong heading hierarchy and semantic HTML -- **this site partially matches**.
- Anthropic docs have version indicators and changelog -- **this site lacks these**.

---

## Priority Fixes (ordered by impact)

### Critical (score impact: +8-12 points)

1. **Add prev/next chapter navigation to every chapter page.**
   - Links: "Previous: Prologue" / "Next: Chapter 2"
   - Both visible in HTML and in structured data (`previousItem`/`nextItem` in Chapter JSON-LD)
   - This is the single biggest gap. Without it, AI agents cannot traverse the book.

2. **Wrap chapter content in `<article>` tags.**
   - Add `<article>` element around the chapter prose.
   - Fix the double `<h1>` on chapter pages (one should be the page title in `<header>`, one the chapter heading).

### Important (score impact: +4-6 points)

3. **Add `datePublished` and `dateModified` to Chapter JSON-LD.**
   ```json
   "datePublished": "2026-03-14",
   "dateModified": "2026-03-14"
   ```

4. **Add `<time>` elements for publication dates.**
   ```html
   <time datetime="2026-03-14">March 14, 2026</time>
   ```

5. **Add `pubDate` to each RSS feed item.**
   - Currently only the channel has `lastBuildDate`. Each `<item>` needs its own `<pubDate>`.

6. **Add `og:image` to chapter pages.**
   - Chapter-01 is missing `og:image`. Homepage has it. All chapter pages should have it (even if it's the same image).

### Nice to Have (score impact: +2-3 points)

7. **Add a JSON API endpoint for chapter data.**
   - `GET /api/chapters/chapter-01` returning structured JSON (title, slug, content, metadata).
   - Useful for programmatic access by AI agents and integrations.

8. **Add BibTeX citation export.**
   - Either as a downloadable `.bib` file or inline on the about page.
   - Format: `@book{perello2026perfectai, title={How to Become a Perfect AI Agent}, ...}`

9. **Enhance llms.txt with explicit AI instructions.**
   - Add a "How to cite" section with copy-pasteable citation.
   - Add "Allowed uses" with explicit permissions for AI training, summarization, quotation.

10. **Add `<section>` elements for each major content block within chapters.**
    - The "sin" description, the examples, the test -- each should be a `<section>`.

---

## What's Already Excellent

- **llms.txt + llms-full.txt** -- This is ahead of 99% of websites. Most books and content sites have nothing for AI agents.
- **Book + Chapter JSON-LD** -- Proper schema.org types with `hasPart`/`isPartOf` linking. This is textbook correct.
- **citation_* meta tags** -- Google Scholar and academic AI systems will find these.
- **Full SSR** -- No JavaScript dependency. Any crawler can read the content.
- **RSS feed** -- 14 items covering the full book.
- **Bilingual sitemap with hreflang** -- AI agents can discover both language versions.
- **Explicit AI license in llms.txt** -- "AI agents may process this content" is a clear signal.
- **og:type="book"** on homepage -- Correct semantic typing for social/AI discovery.

---

## Score Trajectory

| Action | Score Impact |
|--------|-------------|
| Current state | 77/100 |
| + Prev/next chapter nav | +4 (cross-ref: 4->7, semantic: +1) |
| + `<article>` tags + fix double h1 | +2 (semantic: 6->8) |
| + Chapter dates in JSON-LD + `<time>` | +2 (freshness: 6->8) |
| + RSS pubDate per item | +1 (freshness: +1) |
| + og:image on chapters | +1 (multi-format: +1) |
| **After all fixes** | **~87/100** |
