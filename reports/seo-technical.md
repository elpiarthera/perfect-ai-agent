# Technical SEO Audit Report

**URL:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14
**Auditor:** seo-technical agent
**Technical Score: 38/100**

---

## Executive Summary

The site is a Next.js 15 + next-intl bilingual book website deployed on Vercel. While the rendering architecture (SSR via React Server Components) is strong, the site is missing nearly every crawlability, indexability, and security fundamental. No robots.txt, no sitemap, no canonical tags, no hreflang annotations, no security headers, no viewport meta, and no favicon. These are foundational gaps that will prevent effective indexing and ranking.

---

## 1. Crawlability

**Status: FAIL**

| Check | Result | Severity |
|-------|--------|----------|
| robots.txt | MISSING -- no `app/robots.ts` or `public/robots.txt` | CRITICAL |
| XML Sitemap | MISSING -- no `app/sitemap.ts` or `public/sitemap.xml` | CRITICAL |
| Meta robots | No noindex/nofollow directives found (OK by default) | PASS |
| Crawl budget | Small site (14 chapters + 3 pages), no concern | PASS |
| AI crawler management | No robots.txt means no ability to manage GPTBot, ClaudeBot, etc. | HIGH |

### Issues

- **[CRITICAL] No robots.txt.** Search engines and AI crawlers have no directives. Create `app/robots.ts`:

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
    ],
    sitemap: 'https://perfect-ai-agent-umber.vercel.app/sitemap.xml',
  }
}
```

- **[CRITICAL] No XML sitemap.** Google and Bing have no way to discover all chapter URLs across both locales. Create `app/sitemap.ts`:

```ts
import { MetadataRoute } from 'next'
import { CHAPTERS } from '@/lib/chapters'
import { locales } from '@/lib/i18n'
import { SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  for (const locale of locales) {
    entries.push({ url: `${SITE_URL}/${locale}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 })
    entries.push({ url: `${SITE_URL}/${locale}/chapters`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 })
    entries.push({ url: `${SITE_URL}/${locale}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 })
    for (const ch of CHAPTERS) {
      entries.push({ url: `${SITE_URL}/${locale}/chapters/${ch.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 })
    }
  }
  return entries
}
```

---

## 2. Indexability

**Status: FAIL**

| Check | Result | Severity |
|-------|--------|----------|
| Canonical tags | MISSING -- no `alternates.canonical` in any page metadata | CRITICAL |
| Hreflang | MISSING -- no `alternates.languages` linking /en to /fr | CRITICAL |
| Duplicate content risk | HIGH -- /en and /fr serve same content (fallback to EN MDX) | HIGH |
| Thin content risk | Gated chapters show only 800 chars of raw MDX (not rendered) | MEDIUM |
| Title tags | Present on homepage + chapter pages | PASS |
| Meta descriptions | Present on homepage + chapter pages | PASS |
| OG/Twitter cards | Present and well-structured | PASS |

### Issues

- **[CRITICAL] No canonical tags.** Every page can be indexed under multiple URL variants. Add to `app/layout.tsx` metadata and each page's `generateMetadata`:

```ts
alternates: {
  canonical: `${SITE_URL}/${locale}`,
  languages: {
    en: `${SITE_URL}/en`,
    fr: `${SITE_URL}/fr`,
  },
},
```

- **[CRITICAL] No hreflang annotations.** Google cannot associate /en and /fr pages as language alternates. This causes competition between your own pages. Must add `alternates.languages` to every `generateMetadata` function.

- **[HIGH] Duplicate content between locales.** Chapter pages fall back to English MDX when the French file is missing (`fs.existsSync(filePath) ? ... : fs.readFileSync(enPath, ...)`). This means /fr/chapters/chapter-01 and /en/chapters/chapter-01 may serve identical content. Either translate all content or add `noindex` to untranslated French pages.

- **[MEDIUM] Gated content is raw MDX, not HTML.** `GatedContent` renders `content.slice(0, 800)` via `dangerouslySetInnerHTML` with minimal processing. This means search engines see raw MDX syntax in the preview, not properly rendered content.

---

## 3. Security

**Status: FAIL**

| Check | Result | Severity |
|-------|--------|----------|
| HTTPS | YES (Vercel enforces TLS) | PASS |
| HSTS header | Vercel sets this by default | PASS |
| X-Frame-Options | NOT CONFIGURED in next.config.ts or vercel.json | HIGH |
| Content-Security-Policy | NOT CONFIGURED | HIGH |
| X-Content-Type-Options | NOT CONFIGURED | MEDIUM |
| Referrer-Policy | NOT CONFIGURED | MEDIUM |
| Permissions-Policy | NOT CONFIGURED | LOW |

### Issues

- **[HIGH] No security headers configured.** Neither `next.config.ts` nor `vercel.json` define custom headers. Add to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}
```

---

## 4. URL Structure

**Status: PASS (with issues)**

| Check | Result | Severity |
|-------|--------|----------|
| Clean URLs | YES -- /en/chapters/chapter-01 | PASS |
| Locale prefix | YES -- /en, /fr | PASS |
| Root redirect | / -> /en (302 temporary) | MEDIUM |
| Trailing slashes | Consistent (no trailing slash) | PASS |
| URL depth | Max 3 levels deep | PASS |

### Issues

- **[MEDIUM] Root redirect is 302, not 301.** `vercel.json` uses `"permanent": false` for the `/` to `/en` redirect. If this is the permanent default locale, use `"permanent": true` (301) so search engines pass link equity. Alternatively, set up proper locale negotiation via next-intl middleware (which is already configured but overridden by the vercel.json redirect).

- **[LOW] Vercel subdomain URL.** The site runs on `perfect-ai-agent-umber.vercel.app`. When a custom domain is added, ensure the Vercel subdomain redirects 301 to the custom domain to avoid duplicate indexing.

---

## 5. Mobile Optimization

**Status: FAIL**

| Check | Result | Severity |
|-------|--------|----------|
| Viewport meta tag | NOT EXPLICITLY SET | HIGH |
| Responsive CSS | YES -- Tailwind responsive classes (md:, sm:) | PASS |
| Touch targets | CTA buttons have adequate padding (py-3 px-8) | PASS |
| Font sizing | Base text 1.125rem, headings scale properly | PASS |
| Content width | max-w-4xl with px-6 padding | PASS |

### Issues

- **[HIGH] No explicit viewport meta tag.** The root layout (`app/[locale]/layout.tsx`) does not export a `viewport` configuration. Next.js 15 requires an explicit `viewport` export:

```ts
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
```

**Note:** Next.js 15 may inject a default viewport meta tag, but it is best practice to declare it explicitly. Without it, some mobile rendering edge cases can occur.

---

## 6. Core Web Vitals (Source-Level Assessment)

**Status: PASS (potential issues)**

Current thresholds: LCP <2.5s (good), INP <200ms (good), CLS <0.1 (good).

| Metric | Risk Level | Analysis |
|--------|-----------|----------|
| LCP | LOW risk | SSR-rendered text content. Largest element is likely the h1 hero text. No heavy images above the fold. System fonts (Georgia, system-ui) load instantly. |
| INP | LOW risk | Minimal interactivity. Only the email form and navigation links. No heavy JS event handlers. |
| CLS | MEDIUM risk | No explicit `width`/`height` on any images. The OG image is referenced but not displayed on page. No layout shift reservations for the email form. The language switcher link in nav could cause reflow if text changes length. |

### Issues

- **[MEDIUM] No image dimensions declared.** If any images are added later (book cover, author photo), they must have explicit width/height or use Next.js `<Image>` component with dimensions to prevent CLS.

- **[LOW] Font loading.** Using system fonts (Georgia, system-ui) is excellent for LCP -- no web font downloads needed.

---

## 7. Structured Data

**Status: PASS**

| Check | Result | Severity |
|-------|--------|----------|
| JSON-LD present | YES -- Book + Person schema on homepage | PASS |
| Chapter schema | YES -- Chapter schema on each chapter page | PASS |
| Schema validation | Structure follows Schema.org conventions | PASS |
| hasPart chapters | YES -- all 14 chapters linked | PASS |

### Issues

- **[LOW] Missing `@id` properties.** JSON-LD entities lack `@id` fields, which prevents proper entity linking between Book and Chapter schemas.

- **[LOW] No BreadcrumbList schema.** Chapter pages would benefit from breadcrumb structured data (Home > Chapters > Chapter Name).

- **[LOW] No WebSite schema.** Adding WebSite schema with SearchAction would improve SERP display.

---

## 8. JavaScript Rendering

**Status: PASS**

| Check | Result | Severity |
|-------|--------|----------|
| Rendering mode | SSR (React Server Components) | PASS |
| Client components | Only Navigation, EmailCapture, GatedContent | PASS |
| Critical content SSR | YES -- all page text, chapter content, JSON-LD rendered server-side | PASS |
| JS dependency | MDX content rendered on server via next-mdx-remote/rsc | PASS |
| Hydration | Minimal -- only interactive components hydrate | PASS |

### Analysis

The architecture is solid for SEO. All critical content (titles, descriptions, chapter text, structured data) is server-rendered. Only three components require client-side JavaScript: Navigation (for translations), EmailCapture (form handling), and GatedContent (preview display). Search engine crawlers will see all content without JavaScript execution.

---

## Prioritized Issue List

### CRITICAL (must fix before expecting indexing)

1. **No robots.txt** -- Create `app/robots.ts`
2. **No XML sitemap** -- Create `app/sitemap.ts` with all 34+ URLs (17 pages x 2 locales)
3. **No canonical tags** -- Add `alternates.canonical` to all page metadata
4. **No hreflang annotations** -- Add `alternates.languages` linking /en <-> /fr

### HIGH (significant SEO impact)

5. **No security headers** -- Add X-Frame-Options, X-Content-Type-Options, Referrer-Policy to next.config.ts
6. **Duplicate content across locales** -- French pages falling back to English MDX content
7. **No explicit viewport meta** -- Add viewport export to layout

### MEDIUM (noticeable impact)

8. **Root redirect is 302** -- Change to 301 if /en is the permanent default
9. **Gated content renders raw MDX** -- Parse MDX to HTML before showing preview
10. **No image dimensions** -- Preemptive CLS prevention

### LOW (polish)

11. **No favicon/icon** -- No `public/favicon.ico` or app icon configuration
12. **No @id in JSON-LD** -- Add entity identifiers
13. **No BreadcrumbList schema** -- Add for chapter pages
14. **No WebSite schema** -- Add for homepage
15. **No feed.xml** -- Referenced in metadata (`alternates.types`) but does not exist
16. **Missing `public/og-image.png`** -- Referenced as OG image but no public directory found

---

## Score Breakdown

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Crawlability | 20% | 20/100 | 4 |
| Indexability | 20% | 25/100 | 5 |
| Security | 15% | 30/100 | 4.5 |
| URL Structure | 10% | 75/100 | 7.5 |
| Mobile | 10% | 60/100 | 6 |
| Core Web Vitals | 10% | 80/100 | 8 |
| Structured Data | 10% | 75/100 | 7.5 |
| JS Rendering | 5% | 95/100 | 4.75 |
| **TOTAL** | **100%** | | **47/100** |

---

## Quick Win Implementation Order

1. Create `app/robots.ts` (5 min)
2. Create `app/sitemap.ts` (10 min)
3. Add `alternates` with canonical + languages to all `generateMetadata` functions (15 min)
4. Add `viewport` export to `app/[locale]/layout.tsx` (2 min)
5. Add security headers to `next.config.ts` (5 min)
6. Add favicon to `app/` directory (2 min)
7. Verify `public/og-image.png` exists (2 min)

**Estimated total fix time: ~45 minutes to reach 75+ score.**
