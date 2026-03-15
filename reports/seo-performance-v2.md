# Performance Re-Audit (v2): Perfect AI Agent Website

**URL:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14
**Previous audit:** seo-performance.md (same date, earlier session)
**Methodology:** curl TTFB x4, response header analysis, full source code review at `/home/laurentperello/coding/perfect-ai-agent/`

---

## Changes Since v1 Audit

| Issue from v1 | Status | Notes |
|----------------|--------|-------|
| `cookies()` call forcing dynamic render | FIXED | Moved to client-side `document.cookie` in `GatedContent.tsx` |
| Cache headers missing (`no-cache, no-store`) | NOT FIXED | Headers configured in `next.config.ts` but overridden by Next.js dynamic rendering |
| Full i18n bundle sent to every page | PARTIALLY FIXED | Messages are ~4.5 KB EN / ~5.1 KB FR -- small enough to be acceptable. No French text leaks into EN page. |
| Touch targets too small in nav | FIXED | All nav links now have `min-h-[44px]`, language switcher has `min-w-[44px]` |
| Security headers missing | FIXED | X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy all present |
| Duplicate title tag | NOT FIXED | `<title>How to Become a Perfect AI Agent | How to Become a Perfect AI Agent</title>` |
| Missing OG image (`/og-image.png` = 404) | NOT FIXED | `opengraph-image.tsx` exists but generates at wrong path; `og:image` meta still points to `/og-image.png` which returns 404 |
| Missing favicon | NOT FIXED | `/favicon.ico` returns 404, no file in `app/` or `public/` |
| `x-powered-by: Next.js` exposed | NOT FIXED | `poweredByHeader: false` not set in `next.config.ts` |
| Missing `theme-color` meta | NOT FIXED |
| No `loading.tsx` skeletons | NOT FIXED |

---

## Live TTFB Measurements (v2)

| Measurement | TTFB | x-vercel-cache | cache-control |
|-------------|------|----------------|---------------|
| Run 1 | 0.248s | MISS | `private, no-cache, no-store, max-age=0, must-revalidate` |
| Run 2 | 0.257s | MISS | same |
| Run 3 | 0.252s | MISS | same |
| Run 4 | 0.425s | MISS | same |

**Improvement vs v1:**
- Cold start: 1.76s -> not observed (no cold start hit during this test window)
- Warm TTFB: 240-380ms -> 248-425ms (no meaningful change)
- Cache: still 0% hit rate -- every request hits origin

---

## Root Cause: Why Cache Headers Are Ignored

The `next.config.ts` correctly defines cache headers:

```ts
{
  source: '/:locale(en|fr)',
  headers: [
    { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
  ],
}
```

But Next.js **overrides custom `Cache-Control` headers for dynamically rendered pages** with `private, no-cache, no-store, max-age=0, must-revalidate`. The page is still rendering dynamically because:

1. **`next-intl` middleware** intercepts every request, sets `NEXT_LOCALE` cookie, and opts the response out of static generation
2. **No `export const dynamic = 'force-static'`** on any page
3. **No `export const revalidate`** on any page

The `cookies()` removal was necessary but not sufficient. The middleware alone is enough to force dynamic rendering.

---

## Duplicate Title Bug

The rendered HTML shows:
```html
<title>How to Become a Perfect AI Agent | How to Become a Perfect AI Agent</title>
```

**Root cause:** In `app/layout.tsx`, the metadata template is:
```ts
title: {
  default: BOOK_TITLE,          // "How to Become a Perfect AI Agent"
  template: `%s | ${BOOK_TITLE}` // "%s | How to Become a Perfect AI Agent"
}
```

In `app/[locale]/page.tsx`, the page metadata uses:
```ts
title: { absolute: BOOK_TITLE }
```

The `absolute` key should bypass the template, but the rendered output shows it being applied anyway. This may be a Next.js 15 bug with nested layouts, or the root layout's template is being applied despite the `absolute` flag. Quick fix: change the root layout template to use `SITE_NAME` instead of `BOOK_TITLE`:

```ts
// FROM:
template: `%s | ${BOOK_TITLE}`,
// TO:
template: `%s | ${SITE_NAME}`,
```

This produces `Chapter Title | Perfect AI Agent` instead of repeating the full book title.

---

## Resource Inventory

| Resource | Size (uncompressed) | Notes |
|----------|-------------------|-------|
| HTML document | 40 KB | Server-rendered, includes inline JSON-LD |
| CSS (1 file) | 31 KB | Tailwind purged |
| JS total (8 chunks + polyfill) | 530 KB | See breakdown below |
| **Total page weight** | **601 KB** | Text-only site; acceptable |

### JS Chunk Breakdown

| Chunk | Size | Purpose |
|-------|------|---------|
| `4bd1b696-*.js` | 173 KB | React runtime / vendor |
| `255-*.js` | 173 KB | React DOM / vendor |
| `polyfills-*.js` | 113 KB | `noModule` -- skipped by modern browsers |
| `604-*.js` | 54 KB | next-intl client provider |
| `619-*.js` | 9 KB | Shared utilities |
| `webpack-*.js` | 4 KB | Webpack runtime |
| `layout-*.js` | 2 KB | Layout component |
| `page-*.js` | 2 KB | Page component |
| `main-app-*.js` | 0.6 KB | App entry |

The 54 KB `next-intl` chunk is the i18n client provider. This is the cost of `NextIntlClientProvider` wrapping the entire app in the locale layout.

### Static Asset Caching

Static assets (`/_next/static/*`) are correctly cached:
```
cache-control: public,max-age=31536000,immutable
x-vercel-cache: HIT
```

Only the HTML pages lack caching.

---

## Prioritized Remaining Fixes

### P0: Critical -- Will drop TTFB from ~300ms to <50ms

#### 1. Force static generation on all content pages

```tsx
// Add to app/[locale]/page.tsx, app/[locale]/chapters/page.tsx,
// and app/[locale]/about/page.tsx
export const dynamic = 'force-static'
```

Chapter pages already have `generateStaticParams()` returning all slugs. Adding `force-static` will tell Next.js to ignore the middleware's dynamic signal and pre-render at build time.

#### 2. Add ISR revalidation as fallback

```tsx
// All page files
export const revalidate = 3600
```

This ensures pages regenerate periodically even if `force-static` has edge cases with next-intl.

#### 3. Fix the duplicate title

Change `app/layout.tsx` line 17:
```ts
// FROM:
template: `%s | ${BOOK_TITLE}`,
// TO:
template: `%s | ${SITE_NAME}`,
```

This produces `Chapter Title | Perfect AI Agent` instead of repeating the full book title.

### P1: High -- Social sharing + branding

#### 4. Fix OG image (404)

The `og:image` meta points to `/og-image.png` but the file doesn't exist. The `opengraph-image.tsx` generates at `/opengraph-image` (different path). Two options:
- **Option A:** Export a static PNG to `public/og-image.png`
- **Option B:** Update `lib/seo.ts` to use the correct generated path: `${SITE_URL}/opengraph-image`

Option A is better for performance (no edge function execution on social crawls).

#### 5. Add favicon

Add `app/favicon.ico` or `public/favicon.ico`. Without it, browsers make a 404 request on every page load.

#### 6. Disable `x-powered-by` header

Add to `next.config.ts`:
```ts
poweredByHeader: false,
```

### P2: Medium -- Polish

#### 7. Add `theme-color` meta

```ts
// app/layout.tsx metadata
themeColor: '#0a0a0a',
```

#### 8. Add loading skeletons

Create `app/[locale]/chapters/[slug]/loading.tsx` for instant navigation feedback.

#### 9. Optimize next-intl client bundle

The 54 KB `next-intl` client chunk serves 3 translated strings in the Navigation component. Consider:
- Pass translations as props from the server layout instead of using client-side `useTranslations`
- Convert Navigation to a server component

---

## Score Summary

| Dimension | v1 Score | v2 Score | Delta | Notes |
|-----------|----------|----------|-------|-------|
| Loading speed (TTFB) | 6/10 | 6/10 | -- | Still dynamic rendering, no cold start observed this run |
| Render blocking | 10/10 | 10/10 | -- | Still clean |
| Bundle efficiency | 7/10 | 7/10 | -- | i18n client bundle still ships 54 KB for 3 strings |
| Caching | 2/10 | 2/10 | -- | Still `no-cache, no-store` on HTML |
| Image optimization | N/A | N/A | -- | No images |
| Font loading | 10/10 | 10/10 | -- | System fonts |
| Third-party impact | 10/10 | 10/10 | -- | Zero third-party |
| Mobile performance | 8/10 | 9/10 | +1 | Touch targets fixed |
| Security headers | 5/10 | 8/10 | +3 | All security headers present except CSP |
| SEO metadata | 5/10 | 4/10 | -1 | Duplicate title still present, OG image still 404, no favicon |
| **Overall** | **7.6/10** | **7.8/10** | **+0.2** |

---

## What Improved

1. `cookies()` removed from server-side chapter rendering -- prerequisite for static generation done
2. Touch targets in nav fixed to 44px minimum
3. Security headers (5 of 6 recommended) added
4. Cache headers configured in `next.config.ts` (even if overridden by dynamic rendering)

## What Didn't Change

1. Pages still render dynamically (TTFB ~250-425ms, x-vercel-cache: MISS on every request)
2. Cache-Control still overridden to `no-cache, no-store`
3. OG image still 404
4. Duplicate title still present
5. No favicon
6. `x-powered-by: Next.js` still exposed
7. No loading skeletons

## Bottom Line

The v1 audit's P0 prerequisite (removing `cookies()`) was completed. But the actual static generation switch (`export const dynamic = 'force-static'`) was never applied. The site is still dynamically rendered on every request. Adding that single line to each page file is the remaining step to unlock CDN caching and drop TTFB from ~300ms to <50ms.

The duplicate title and missing OG image are the most visible SEO regressions that need immediate attention.
