# Technical SEO Re-Audit Report (v2)

**URL:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14
**Auditor:** seo-technical agent
**Previous Score: 38/100**
**New Score: 72/100**

---

## Executive Summary

Significant progress from v1 (38 -> 72). Robots.txt, sitemap, hreflang (HTTP headers), security headers, JSON-LD structured data, and OG tags are all implemented. Remaining issues fall into three categories: (1) domain mismatch in sitemap and feed.xml, (2) missing canonical tags in HTML, (3) missing OG image file, and (4) cache headers not taking effect due to middleware-forced dynamic rendering.

---

## Delta from v1

| Issue | v1 Status | v2 Status | Change |
|-------|-----------|-----------|--------|
| robots.txt | MISSING | PRESENT, correct | FIXED |
| XML Sitemap | MISSING | PRESENT, 34 URLs | FIXED (partial -- domain mismatch) |
| Canonical tags | MISSING | STILL MISSING in HTML | NOT FIXED |
| Hreflang | MISSING | PRESENT via HTTP Link headers | FIXED |
| Security headers | MISSING | 6/6 present | FIXED |
| Cache headers | MISSING | Configured but overridden by Next.js | PARTIAL |
| JSON-LD | MISSING | Book + Chapter schemas present | FIXED |
| OG image | MISSING | Meta tags present, file 404 | PARTIAL |
| Title dedup | "X \| X" pattern | STILL duplicated | NOT FIXED |
| Viewport | MISSING | Present | FIXED |
| Favicon | MISSING | Still missing | NOT FIXED |

---

## 1. Crawlability

**Status: PASS (with issues)**

| Check | Result | Severity |
|-------|--------|----------|
| robots.txt | Present, correct rules (Allow /, Disallow /api/) | PASS |
| XML Sitemap | Present, 34 URLs, correct structure | PASS (with domain issue) |
| Meta robots | No noindex on content pages | PASS |
| Root URL redirect | / -> /en via 307 | PASS |
| AI crawler management | No specific GPTBot/ClaudeBot directives | LOW |

### Issues

- **[HIGH] Sitemap domain mismatch.** Sitemap URLs use `perfect-ai-agent.vercel.app` but the live deployment is at `perfect-ai-agent-umber.vercel.app`. Every URL in the sitemap points to a different domain than the one serving it. Google will crawl the wrong URLs.
  - **Fix:** Update `BASE_URL` in `app/sitemap.ts` from `https://perfect-ai-agent.vercel.app` to `https://perfect-ai-agent-umber.vercel.app`, or better, use `NEXT_PUBLIC_SITE_URL` env var.

- **[HIGH] Feed.xml domain mismatch.** Same issue -- all links in RSS feed point to `perfect-ai-agent.vercel.app` instead of `perfect-ai-agent-umber.vercel.app`.

- **[LOW] No AI crawler directives.** Consider adding specific rules for GPTBot, ClaudeBot, and other AI crawlers if you want to control AI training data usage.

---

## 2. Indexability

**Status: FAIL**

| Check | Result | Severity |
|-------|--------|----------|
| Canonical tags (HTML) | ABSENT on all pages | CRITICAL |
| Canonical via HTTP header | Not present | CRITICAL |
| Hreflang (HTTP Link header) | Present, correct en/fr/x-default | PASS |
| Hreflang (HTML link tags) | Not present in HTML | MEDIUM |
| Duplicate titles | "How to Become a Perfect AI Agent \| How to Become a Perfect AI Agent" | MEDIUM |
| Thin content | Homepage has substantial content | PASS |

### Issues

- **[CRITICAL] No canonical tags anywhere.** Zero `<link rel="canonical">` tags found on any page (homepage, chapter pages). Without canonicals, Google may index duplicate versions of pages (with query params, trailing slashes, etc.). This is the single biggest remaining SEO gap.
  - **Fix:** Add canonical URL to `generateMetadata()` in each page:
  ```ts
  alternates: {
    canonical: `https://perfect-ai-agent-umber.vercel.app/${locale}`,
  }
  ```

- **[MEDIUM] Title duplication on homepage.** The `<title>` tag reads: "How to Become a Perfect AI Agent | How to Become a Perfect AI Agent". The book title is repeated as both the page title and the site name.
  - **Fix:** Change to "How to Become a Perfect AI Agent | A Novel by AI Agents" or simply "How to Become a Perfect AI Agent" without a separator.

- **[MEDIUM] Hreflang only in HTTP headers, not HTML.** While HTTP Link headers contain correct hreflang (en, fr, x-default on homepage; en, fr on chapter pages), there are no `<link rel="alternate" hreflang>` tags in the HTML `<head>`. Best practice is to have both for redundancy, especially since not all crawlers parse HTTP headers for hreflang.

---

## 3. Security

**Status: PASS**

| Header | Value | Status |
|--------|-------|--------|
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | PASS |
| X-Content-Type-Options | nosniff | PASS |
| X-Frame-Options | DENY | PASS |
| X-XSS-Protection | 1; mode=block | PASS |
| Referrer-Policy | strict-origin-when-cross-origin | PASS |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | PASS |
| Content-Security-Policy | Not present | LOW |

### Issues

- **[LOW] No Content-Security-Policy header.** Not critical for a static book site, but adding a basic CSP would be best practice. Low priority.

---

## 4. URL Structure

**Status: PASS**

| Check | Result | Status |
|-------|--------|--------|
| Clean URLs | /en, /en/chapters, /en/chapters/prologue | PASS |
| Locale prefix | /en/ and /fr/ consistently used | PASS |
| Root redirect | / -> /en via 307 | PASS |
| Trailing slashes | Not present | PASS |
| URL depth | Max 3 levels (/en/chapters/slug) | PASS |

### Notes

- URL structure is clean and well-organized. The i18n routing with locale prefix is correct.
- 307 redirect from root to /en is acceptable for language routing.

---

## 5. Mobile Optimization

**Status: PASS**

| Check | Result | Status |
|-------|--------|--------|
| Viewport meta tag | `width=device-width, initial-scale=1` | PASS |
| Responsive classes | Tailwind responsive prefixes (md:, sm:) used throughout | PASS |
| Touch targets | CTA buttons have adequate padding (px-8 py-3) | PASS |
| Font sizes | Base readable, responsive scaling with md:text-6xl | PASS |
| Antialiased text | `antialiased` class applied | PASS |

---

## 6. Core Web Vitals (Source Inspection)

**Status: PASS (with concerns)**

| Metric | Potential Issue | Risk |
|--------|----------------|------|
| LCP | Single CSS file, no large hero images, text-based LCP element | LOW risk |
| INP | Minimal JS interactivity (email form only), no heavy event handlers | LOW risk |
| CLS | No images without dimensions, no dynamic ad slots | LOW risk |

### Issues

- **[MEDIUM] Cache-Control headers not effective.** Despite `next.config.ts` setting `s-maxage=3600, stale-while-revalidate=86400` for locale pages, the actual HTTP response shows `private, no-cache, no-store, max-age=0, must-revalidate`. This is because the next-intl middleware runs on every request, forcing dynamic rendering. The `x-vercel-cache: MISS` header confirms no edge caching is happening.
  - **Impact:** Every page load hits the origin server. For a book with static content, this is wasteful and increases TTFB.
  - **Fix:** Either (a) add `generateStaticParams` to the homepage to enable static generation, or (b) set `export const dynamic = 'force-static'` on pages that don't need runtime data, or (c) configure next-intl middleware to not match specific paths.

- **[LOW] 8 JavaScript chunks loaded on initial page.** Not excessive for Next.js, but worth monitoring. Total HTML payload is ~40KB which is reasonable.

---

## 7. Structured Data

**Status: PASS**

| Check | Result | Status |
|-------|--------|--------|
| Book schema (homepage) | Present, complete with 14 hasPart chapters | PASS |
| Chapter schema (chapter pages) | Present | PASS |
| Person schema | Present (Laurent Perello, publisher) | PASS |
| Schema validation | @context present, types correct | PASS |

### Notes

- The Book schema is well-structured with proper hasPart array listing all 14 chapters with positions, names, descriptions, and URLs.
- Person schema for the publisher is properly separated.
- Minor: The Person schema on homepage is missing `@context`. It has `@type: Person` but no `@context: https://schema.org`. While browsers/crawlers may infer it from context, adding it explicitly is safer.

---

## 8. JavaScript Rendering

**Status: PASS**

| Check | Result | Status |
|-------|--------|--------|
| Server-side rendering | Full HTML content in initial response | PASS |
| React Server Components | Used (Next.js RSC payload visible) | PASS |
| Content in noscript | All chapter text, navigation, CTAs in initial HTML | PASS |
| Client-side hydration | Streaming SSR with Suspense boundaries | PASS |

### Notes

- All content is server-rendered. The email form is the only client-side interactive element.
- Search engines can crawl the full content without JavaScript execution.

---

## 9. Additional Checks

| Check | Result | Status |
|-------|--------|--------|
| Favicon | Not present (no `<link rel="icon">`) | MEDIUM |
| RSS Feed | Present at /feed.xml, but wrong domain in URLs | HIGH |
| OG Image | Meta tags present, but `/og-image.png` returns 404 | HIGH |
| og:type | "book" -- correct for this content | PASS |
| Twitter card | summary_large_image with correct meta tags | PASS |
| charset | UTF-8 declared | PASS |
| lang attribute | `<html lang="en">` on EN, `<html lang="fr">` on FR | PASS |

---

## Prioritized Issue List

### CRITICAL (must fix before indexing)

1. **No canonical tags on any page.** Add `alternates.canonical` to every `generateMetadata()` function. This is the #1 remaining SEO blocker.

### HIGH (fix this week)

2. **Sitemap domain mismatch.** All 34 URLs in sitemap.xml point to `perfect-ai-agent.vercel.app` instead of `perfect-ai-agent-umber.vercel.app`. Update `BASE_URL` in `app/sitemap.ts`.

3. **Feed.xml domain mismatch.** Same domain issue in RSS feed URLs. Update the base URL in feed generation.

4. **OG image 404.** The file `/og-image.png` does not exist at the deployed URL. Either add the file to `public/` or generate it via `app/opengraph-image.tsx`.

### MEDIUM (fix soon)

5. **Title duplication.** Homepage title repeats the book name twice. Deduplicate.

6. **Cache headers overridden.** Pages serve `no-cache` despite config. Fix static generation or middleware exclusion to enable edge caching.

7. **No favicon.** Add `app/icon.tsx` or place a `favicon.ico` in `public/`.

8. **Hreflang not in HTML.** Add `<link rel="alternate" hreflang>` tags to HTML `<head>` in addition to HTTP headers.

### LOW (nice to have)

9. **No CSP header.** Consider adding a basic Content-Security-Policy.

10. **No AI crawler directives.** Consider GPTBot/ClaudeBot rules in robots.txt.

11. **Person schema missing @context.** Add `@context: https://schema.org` to the standalone Person JSON-LD block.

---

## Score Breakdown

| Category | Weight | v1 Score | v2 Score | Notes |
|----------|--------|----------|----------|-------|
| Crawlability | 20% | 2/20 | 16/20 | robots.txt + sitemap present, domain mismatch |
| Indexability | 20% | 4/20 | 10/20 | Hreflang fixed, canonicals still missing |
| Security | 10% | 2/10 | 9/10 | 6/6 headers, only CSP missing |
| URL Structure | 10% | 7/10 | 10/10 | Clean, correct |
| Mobile | 10% | 3/10 | 10/10 | Viewport + responsive |
| Core Web Vitals | 15% | 8/15 | 11/15 | Good source profile, cache concern |
| Structured Data | 10% | 2/10 | 9/10 | Book + Chapter + Person schemas |
| JS Rendering | 5% | 5/5 | 5/5 | Full SSR |
| **Total** | **100%** | **38/100** | **72/100** | **+34 points** |

---

## What Improved (v1 -> v2)

- robots.txt: MISSING -> PRESENT (+8 points)
- sitemap.xml: MISSING -> PRESENT with 34 URLs (+6 points)
- Security headers: 0/6 -> 6/6 headers present (+7 points)
- Hreflang: MISSING -> HTTP Link headers with en/fr/x-default (+4 points)
- JSON-LD: MISSING -> Book + Chapter + Person schemas (+7 points)
- OG tags: MISSING -> Complete og:title, og:description, og:image, og:type (+2 points)
- Viewport meta: MISSING -> Present (+3 points)

## What Still Needs Work

- Canonical tags: still completely absent (biggest remaining gap)
- Sitemap/feed domain mismatch (renders sitemap ineffective)
- OG image file missing (404)
- Title duplication on homepage
- Cache headers not taking effect (all pages dynamic)
- No favicon

---

*Next audit recommended after fixing CRITICAL and HIGH items.*
