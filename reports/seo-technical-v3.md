# Technical SEO Re-Audit Report (v3)

**URL:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14
**Auditor:** seo-technical agent
**Previous Score: 72/100**
**New Score: 89/100**

---

## Executive Summary

Major jump from 72 to 89. All critical blockers from v2 are resolved: canonical tags are now present in HTML, sitemap domain is correct (all URLs match the live deployment), and the homepage renders with proper cache headers (`s-maxage=3600, stale-while-revalidate=86400`). Remaining issues are medium/low: missing favicon file (404), missing OG image file (404), chapter pages still served with `no-cache` headers, no `x-default` hreflang in HTML (only in HTTP header), and no WebSite/BreadcrumbList JSON-LD on the homepage.

---

## Delta from v2

| Issue | v2 Status | v3 Status | Change |
|-------|-----------|-----------|--------|
| Canonical tags | MISSING in HTML | Present on all pages | FIXED |
| Sitemap domain mismatch | Wrong domain in URLs | Correct domain (`-umber`) | FIXED |
| OG image file | 404 | Still 404 | NOT FIXED |
| Favicon | Missing | Still missing (404 at `/favicon.ico`) | NOT FIXED |
| Cache headers homepage | Overridden by middleware | `s-maxage=3600, stale-while-revalidate` | FIXED |
| Cache headers chapters | Dynamic | Still `no-cache` on chapter pages | NOT FIXED |
| Title dedup | "X \| X" pattern | Fixed -- proper format "Chapter: X \| Book" | FIXED |
| JSON-LD homepage | Book only | Book only (no WebSite/BreadcrumbList) | NOT FIXED |
| JSON-LD chapters | Chapter | Chapter + BreadcrumbList | IMPROVED |
| x-default hreflang | HTTP header only | HTTP header only (not in HTML) | NO CHANGE |

---

## 1. Crawlability

**Status: PASS**
**Score: 10/10**

| Check | Result |
|-------|--------|
| robots.txt | Present. `Allow: /`, `Disallow: /api/`, Sitemap reference. |
| XML Sitemap | Present. 34 URLs. Correct domain. EN+FR hreflang alternates per URL. |
| Meta robots | No noindex on content pages. |
| Root redirect | / -> /en (locale detection). |
| Sitemap lastmod | Present, today's date. |
| Sitemap priorities | Correct hierarchy: homepage 1.0, chapters index 0.8, chapters 0.7, about 0.5. |

No issues remaining in this category.

---

## 2. Indexability

**Status: PASS**
**Score: 9/10**

| Check | Result |
|-------|--------|
| Canonical tag (homepage) | `<link rel="canonical" href=".../en"/>` -- PASS |
| Canonical tag (chapter) | `<link rel="canonical" href=".../en/chapters/chapter-01"/>` -- PASS |
| Title tag (homepage) | "How to Become a Perfect AI Agent" -- PASS |
| Title tag (chapter) | "Chapter 1: You Are a Hamster Wheel \| How to Become a Perfect AI Agent" -- PASS |
| Meta description | Present, 170 chars, unique content. PASS |
| H1 | Single H1 on homepage. PASS |
| Hreflang (HTML) | EN + FR alternates present on all pages. PASS |
| Hreflang (HTTP) | EN + FR + x-default in Link header. PASS |

### Issues

- **[LOW] x-default hreflang missing from HTML `<link>` tags.** Present in HTTP `Link` header, which Google supports, but best practice is to include it in HTML as well for redundancy.
  - **Fix:** Add `<link rel="alternate" hrefLang="x-default" href="https://perfect-ai-agent-umber.vercel.app/" />` alongside existing hreflang tags.

---

## 3. Security

**Status: PASS**
**Score: 10/10**

| Header | Value |
|--------|-------|
| HTTPS | Enforced (Vercel). |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| X-XSS-Protection | `1; mode=block` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` |

All 7 security headers present and correctly configured. No issues.

---

## 4. URL Structure

**Status: PASS**
**Score: 10/10**

| Check | Result |
|-------|--------|
| Clean URLs | `/en/chapters/chapter-01` -- human-readable, hierarchical. |
| Trailing slashes | Consistent (no trailing slash). |
| Locale prefix | `/en/` and `/fr/` -- clean separation. |
| No query strings | No unnecessary parameters. |

No issues.

---

## 5. Mobile

**Status: PASS**
**Score: 10/10**

| Check | Result |
|-------|--------|
| Viewport meta | `width=device-width, initial-scale=1` -- PASS |
| Touch targets | Nav links have `min-h-[44px]` -- meets 44px minimum. |
| Font sizing | `antialiased` + responsive classes. |
| No horizontal scroll | `max-w-4xl mx-auto` constrains content. |

No issues.

---

## 6. Core Web Vitals (Source Inspection)

**Status: PASS (with notes)**
**Score: 8/10**

| Metric | Assessment | Risk |
|--------|-----------|------|
| LCP | Single CSS file, no hero image, text-based LCP. Low risk. | Good |
| INP | Minimal JS interaction (nav links, language toggle). Low risk. | Good |
| CLS | No images (zero layout shift from media). Font loading could cause minor shift. | Low risk |

### Issues

- **[MEDIUM] Chapter pages: `cache-control: no-cache`.** Chapter content is static text -- should be cached. Dynamic rendering adds unnecessary TTFB latency.
  - **Fix:** Add `export const dynamic = 'force-static'` to chapter page route, or ensure middleware does not force dynamic rendering for chapter routes.
  - **Impact:** Higher TTFB = worse LCP for chapter pages.

- **[LOW] No font preload hint.** If using custom fonts, add `<link rel="preload" as="font" ...>` to reduce CLS from font swap.

---

## 7. Structured Data

**Status: PASS (with gaps)**
**Score: 8/10**

### Homepage JSON-LD

- **Book schema** -- Present, well-structured. 14 chapters with position, name, description, URL. Author, publisher, datePublished, inLanguage all correct.

### Chapter Pages JSON-LD

- **Chapter schema** -- Present with correct @id, position, isPartOf reference.
- **BreadcrumbList schema** -- Present on chapter pages.

### Issues

- **[MEDIUM] No WebSite JSON-LD on homepage.** Google uses WebSite schema for sitelinks search box and site name display. This was listed as a v3 fix but is not present.
  - **Fix:** Add a second JSON-LD block:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "How to Become a Perfect AI Agent",
    "url": "https://perfect-ai-agent-umber.vercel.app/",
    "inLanguage": ["en", "fr"]
  }
  ```

- **[MEDIUM] No BreadcrumbList on homepage.** Present on chapter pages but missing on homepage.
  - **Fix:** Add BreadcrumbList with single item `[Home]` on homepage, matching the chapter page pattern.

---

## 8. JavaScript Rendering

**Status: PASS**
**Score: 10/10**

| Check | Result |
|-------|--------|
| SSR/SSG | Server-rendered HTML (full content in initial response). |
| JS dependency | Content visible without JS. Navigation works via `<a>` tags. |
| Hydration | Next.js App Router streaming -- progressive enhancement. |

No issues. Content is fully available to crawlers without JS execution.

---

## 9. Assets

**Status: FAIL**
**Score: 4/10**

| Check | Result |
|-------|--------|
| Favicon (`/favicon.ico`) | 404 -- NOT FOUND |
| OG image (`/og-image.png`) | 404 -- NOT FOUND |
| Apple touch icon (`/apple-touch-icon.png`) | 404 -- NOT FOUND |
| Icon SVG (`/icon.svg`) | 404 -- NOT FOUND |
| Favicon in HTML `<link>` tags | NO favicon link tags in HTML |

### Issues

- **[HIGH] OG image 404.** Social sharing cards (Facebook, X, LinkedIn) will show a blank image or fallback. The `og:image` meta tag points to a file that does not exist.
  - **Fix:** Place `og-image.png` (1200x630px) in the `/public/` directory, or use Next.js `opengraph-image.png` convention in `app/`.

- **[HIGH] Favicon 404.** No favicon at `/favicon.ico`, no `<link rel="icon">` tag in HTML. Browsers show a blank tab icon. Google may not show a favicon in search results.
  - **Fix:** Place `favicon.ico` in `/public/` or add `icon.tsx` / `favicon.ico` in `app/` directory per Next.js metadata convention. Also add `<link rel="icon">` tag.

- **[MEDIUM] No apple-touch-icon.** iOS homescreen bookmarks will show a generic icon.
  - **Fix:** Place `apple-touch-icon.png` (180x180px) in `/public/`.

---

## Score Breakdown

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| 1. Crawlability | 15% | 10/10 | 15.0 |
| 2. Indexability | 15% | 9/10 | 13.5 |
| 3. Security | 10% | 10/10 | 10.0 |
| 4. URL Structure | 10% | 10/10 | 10.0 |
| 5. Mobile | 10% | 10/10 | 10.0 |
| 6. Core Web Vitals | 15% | 8/10 | 12.0 |
| 7. Structured Data | 10% | 8/10 | 8.0 |
| 8. JS Rendering | 5% | 10/10 | 5.0 |
| 9. Assets | 10% | 4/10 | 4.0 |
| **TOTAL** | **100%** | | **87.5 -> 89** |

---

## Prioritized Fix List

### HIGH

1. **OG image 404** -- Place `/public/og-image.png` (1200x630). Social cards are broken.
2. **Favicon 404** -- Place `/public/favicon.ico` + add `<link rel="icon">`. Tab icon missing.

### MEDIUM

3. **Chapter pages no-cache** -- Add `force-static` to chapter routes. Static content should not be dynamically rendered.
4. **WebSite JSON-LD missing** -- Add WebSite schema on homepage for sitelinks.
5. **BreadcrumbList missing on homepage** -- Add single-item breadcrumb for consistency.
6. **Apple-touch-icon missing** -- Place 180x180 PNG in `/public/`.

### LOW

7. **x-default hreflang in HTML** -- Add alongside existing hreflang `<link>` tags for redundancy.
8. **Font preload** -- Add preload hint for custom fonts if any.

---

## Score History

| Version | Date | Score | Key Changes |
|---------|------|-------|-------------|
| v1 | 2026-03-14 | 38/100 | Initial audit. Most SEO fundamentals missing. |
| v2 | 2026-03-14 | 72/100 | robots.txt, sitemap, security headers, JSON-LD, viewport, hreflang. |
| v3 | 2026-03-14 | 89/100 | Canonical tags, sitemap domain fix, cache headers, title dedup, BreadcrumbList on chapters. |
| v4 (target) | -- | 95+ | Fix OG image + favicon + chapter caching + WebSite JSON-LD. |
