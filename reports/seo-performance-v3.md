# SEO Performance Audit v3 — Perfect AI Agent

**URL:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14
**Context:** Re-audit after deploying force-static on pages, OG image cleanup, favicon fix.

---

## TTFB & Response Times

| Page | TTFB | HTTP | Gzip Size |
|------|------|------|-----------|
| `/en` (home) | 220-515ms | 200 | 5.6 KB |
| `/fr` (home) | ~230ms | 200 | ~5.6 KB |
| `/en/chapters` (TOC) | ~108ms | **404** | — |
| `/en/chapters/prologue` | ~330ms | 200 | 10.2 KB |
| `/en/chapters/chapter-01` | ~250ms | 200 | — |

**Verdict:** TTFB acceptable (220-330ms typical), but first cold hit can spike to 515ms. Not terrible for SSR, but should be ~50ms for truly static pages.

---

## Caching — CRITICAL FAILURE

### x-vercel-cache Status

| Route | x-vercel-cache | cache-control |
|-------|---------------|---------------|
| `/en` | **MISS** (every hit) | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/fr` | **MISS** (every hit) | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/en/chapters/prologue` | **MISS** (every hit) | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/en/chapters/chapter-01` | **MISS** (every hit) | `private, no-cache, no-store, max-age=0, must-revalidate` |
| `/_next/static/css/*` | **HIT** | `public, max-age=31536000, immutable` |
| `/_next/static/chunks/*` | **HIT** | `public, max-age=31536000, immutable` |

**Root cause:** Despite `export const dynamic = 'force-static'` on `/en` and `/en/chapters`, Next.js is still server-rendering all pages. The `next-intl` plugin wraps the config and likely injects middleware or server-side locale detection that forces SSR. The `cache-control: private, no-cache` header is set by Next.js itself, overriding the custom headers in `next.config.ts`.

**Evidence:**
- `force-static` is present on `app/[locale]/page.tsx` and `app/[locale]/chapters/page.tsx`
- `generateStaticParams` is present on `app/[locale]/chapters/[slug]/page.tsx`
- Yet ALL pages return `x-vercel-cache: MISS` and `cache-control: private, no-cache`
- Static assets (`_next/static/*`) correctly return `HIT` and `immutable`

**The `next.config.ts` custom headers are being ignored** because Next.js applies its own cache-control first (SSR = no-cache), and custom headers cannot override the framework's response headers.

---

## Fix Status: force-static

| Fix | Status | Notes |
|-----|--------|-------|
| `force-static` on home page | DEPLOYED but NOT WORKING | Next.js still SSR-rendering |
| `force-static` on chapters index | DEPLOYED but NOT WORKING | Returns 404 (see below) |
| `generateStaticParams` on chapter pages | DEPLOYED but NOT WORKING | Still SSR, no cache |

**Why force-static fails:** The `next-intl` plugin uses middleware for locale routing. Middleware runs on every request, which prevents Vercel's CDN from serving static HTML from the edge. The `[locale]` dynamic segment combined with middleware = SSR on every hit.

---

## Fix Status: OG Image

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/opengraph-image` | 307 -> `/en/opengraph-image` -> **404** | BROKEN |
| `/en/opengraph-image` | **404** | File exists at `app/opengraph-image.tsx` but locale routing intercepts |

**Root cause:** The `opengraph-image.tsx` is at `app/opengraph-image.tsx` (root level), but the locale middleware rewrites `/opengraph-image` to `/en/opengraph-image`, which doesn't exist as a route. The OG image route never resolves.

**HTML meta tags reference:** `content="https://perfect-ai-agent-umber.vercel.app/opengraph-image?918651932f213033"` -- this URL returns 404 after redirect.

**Impact:** Social sharing (Facebook, Twitter, LinkedIn) will show no image. GEO/AI citation crawlers may also fail to index the OG data properly.

---

## Fix Status: Favicon

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/favicon.ico` | **404** | No static favicon.ico exists |
| `/icon` | 307 -> `/en/icon` -> **404** | Dynamic icon.tsx exists but locale routing breaks it |

**Root cause:** Same as OG image. `app/icon.tsx` generates a dynamic favicon, but the middleware rewrites `/icon` to `/en/icon`, which 404s.

**HTML references:** `<link rel="icon" href="/icon?3c461bca591e8d73" type="image/png" sizes="32x32">` -- this URL 404s after redirect.

**Impact:** No favicon displayed in browser tabs. Minor SEO signal but poor UX.

---

## /en/chapters Returns 404

The chapters index page at `/en/chapters` returns **HTTP 404** despite rendering full HTML content (the TOC with all 14 chapters is in the RSC payload). This means:
- Search engines will NOT index the chapters index page
- The page is functionally invisible to crawlers
- `force-static` is set but the page errors at build time, so Vercel serves it as a 404 with the fallback shell

---

## JS Bundle Analysis

| Chunk | Gzip Size | Notes |
|-------|-----------|-------|
| `4bd1b696` (framework) | 53.5 KB | React/Next.js core |
| `255-*` (shared) | 45.7 KB | App shared chunk |
| `polyfills` | 38.8 KB | Only loaded with noModule |
| `webpack` | 1.8 KB | Runtime |
| `main-app` | 0.5 KB | App bootstrap |
| CSS | Single file | Good -- no fragmentation |

**Total initial JS:** ~100 KB gzipped (framework + shared). Acceptable for a Next.js app.

---

## Security Headers

All present and correct:
- `strict-transport-security: max-age=63072000; includeSubDomains; preload`
- `x-content-type-options: nosniff`
- `x-frame-options: DENY`
- `x-xss-protection: 1; mode=block`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy: camera=(), microphone=(), geolocation=()`

---

## Hreflang / i18n

Working correctly via `Link` headers:
```
link: <.../en>; rel="alternate"; hreflang="en",
      <.../fr>; rel="alternate"; hreflang="fr",
      <.../>; rel="alternate"; hreflang="x-default"
```

---

## Summary Scorecard

| Area | Score | Status |
|------|-------|--------|
| TTFB | 6/10 | Acceptable but not static-fast |
| CDN Caching | 1/10 | CRITICAL -- all pages MISS, every request hits origin |
| OG Image | 0/10 | CRITICAL -- 404, social sharing broken |
| Favicon | 0/10 | CRITICAL -- 404, no favicon |
| /en/chapters | 0/10 | CRITICAL -- returns 404 HTTP status |
| Static Assets | 10/10 | Perfect -- HIT, immutable |
| Security Headers | 10/10 | All present |
| JS Bundle | 8/10 | ~100 KB gzip, acceptable |
| Hreflang | 9/10 | Correct |

**Overall: 4.9/10**

---

## Required Fixes (Priority Order)

### P0 -- Critical (blocks SEO + social)

1. **Fix OG image route:** Move `app/opengraph-image.tsx` to `app/[locale]/opengraph-image.tsx` OR create a static OG image in `public/og-image.png` and reference it directly in metadata. The static approach is simpler and faster.

2. **Fix favicon:** Either move `app/icon.tsx` to `app/[locale]/icon.tsx` OR (recommended) generate a static `public/favicon.ico` and `public/icon-32.png`, then reference them in the root layout metadata. Static favicons are faster and cacheable.

3. **Fix /en/chapters 404:** The `force-static` + `generateStaticParams` only covers `[locale]` from `layout.tsx`. The chapters page may be erroring at build. Check Vercel build logs. May need `generateStaticParams` on the chapters page too, or the issue is that `getTranslations` (from next-intl) is incompatible with `force-static`.

### P1 -- High (performance)

4. **Fix CDN caching for all pages:** The core issue is `next-intl` middleware preventing static generation. Options:
   - **Option A (recommended):** Use `next-intl`'s static rendering mode (`unstable_setRequestLocale` or the newer `setRequestLocale`) in every page/layout that needs to be static. Ensure middleware only runs on API routes or redirects, not on pre-rendered pages.
   - **Option B:** Add `export const dynamicParams = false` to chapter pages alongside `generateStaticParams` to force full static pre-rendering.
   - **Option C:** If next-intl cannot be made static, add Vercel edge config or `stale-while-revalidate` via `revalidate` export instead of custom headers.

5. **Add `export const dynamic = 'force-static'` to chapter detail page** (`app/[locale]/chapters/[slug]/page.tsx`) -- currently missing. It only has `generateStaticParams`.
