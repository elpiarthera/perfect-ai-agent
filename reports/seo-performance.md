# Performance Audit: Perfect AI Agent Website

**URL:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14 (updated with live TTFB measurements)
**Methodology:** curl timing (TTFB x4 runs), HTML source analysis, full source code review
**PageSpeed Insights:** Unavailable (API quota exceeded -- rate limited)

---

## Executive Summary

The site is a lightweight, text-only Next.js 15 app with no images, no custom web fonts, and minimal client-side JavaScript. The architecture is fundamentally sound. However, **all pages render dynamically when they should be static**, resulting in a cold-start TTFB of 1.76s and warm TTFB of 240-380ms. The caching headers actively prevent any CDN caching (`no-cache, no-store, must-revalidate`).

Fixing the rendering strategy is the single highest-impact change -- it would drop TTFB from 300ms+ to <50ms and eliminate cold start penalties entirely.

**Estimated Lighthouse Score:** 85-92 (mobile), 95-100 (desktop)

---

## Live TTFB Measurements

| Measurement | TTFB | Total | Notes |
|-------------|------|-------|-------|
| Cold start | **1.756s** | 1.839s | Serverless function cold start |
| Warm #1 | 0.381s | 0.395s | Function warm |
| Warm #2 | 0.340s | 0.340s | Function warm |
| Warm #3 | 0.243s | 0.258s | Function warm |

**Connection breakdown (cold start):**

| Phase | Time |
|-------|------|
| DNS lookup | 21ms |
| TCP connect | 36ms |
| TLS handshake | 73ms |
| Server processing | ~1,625ms |

**Response headers confirming the problem:**
```
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
x-vercel-cache: MISS
```

Every page load hits the origin server. For a content site with static chapters, this is the primary bottleneck.

---

## Core Web Vitals Assessment

| Metric | Estimated | Rating | Confidence |
|--------|-----------|--------|------------|
| **LCP** | ~2.0-2.5s (cold) / ~0.8-1.2s (warm) | NEEDS IMPROVEMENT (cold) / GOOD (warm) | High |
| **INP** | ~50-100ms | GOOD | High |
| **CLS** | ~0 | GOOD | High |

**LCP element:** The `<h1>` text ("How to Become a Perfect AI Agent"). No images compete for LCP. The bottleneck is purely server response time.

**INP rationale:** Only 2 client components (Navigation, EmailCapture). No heavy event handlers. No long tasks. Minimal DOM (~50-70 elements).

**CLS rationale:** System fonts only (no FOUT/FOIT). No images. No dynamic injections. No ads.

---

## Resource Inventory (from live HTML)

### CSS: 1 file
```
/_next/static/css/2b074b9d79c52d19.css (data-precedence="next")
```
Single CSS file, Tailwind-purged. Expected: 5-15 KB gzipped. Render-blocking but small and unavoidable.

### JavaScript: 9 script tags

| Chunk | Loading |
|-------|---------|
| `webpack-*.js` | `preload` (fetchPriority="low") + `async` |
| `4bd1b696-*.js` | `async` |
| `255-*.js` | `async` |
| `main-app-*.js` | `async` |
| `619-*.js` | `async` |
| `604-*.js` | `async` |
| `app/[locale]/page-*.js` | `async` |
| `app/[locale]/layout-*.js` | `async` |
| `polyfills-*.js` | `noModule` (skipped by modern browsers) |

All scripts are async -- non-render-blocking. No third-party scripts. Clean.

### Fonts: 0 external
- Serif: Georgia, Cambria, Times New Roman (system)
- Sans: system-ui, -apple-system (system)

Zero network requests for fonts. Optimal.

### Images: 0 on page
- `og-image.png` referenced in meta but **file does not exist in `public/`** -- social previews are broken.

---

## Root Cause Analysis: Why Everything Renders Dynamically

Three factors force dynamic rendering:

1. **`next-intl` middleware** runs on every request, sets `NEXT_LOCALE` cookie, and opts pages out of static caching.

2. **`cookies()` call in chapter pages** (`app/[locale]/chapters/[slug]/page.tsx` line 96) reads cookies for the email gate. Any `cookies()` call forces dynamic rendering.

3. **`NextIntlClientProvider`** wraps the entire app in the layout, sending the full i18n messages bundle to every page (~3-5 KB of unused translations per page).

Result: despite `generateStaticParams()` being defined for chapters, the pages are never statically generated.

---

## Prioritized Recommendations

### P0: Critical -- Expected Impact: TTFB from 300ms+ to <50ms

#### 1. Enable Static Generation for homepage and chapter index

These pages have no user-specific data.

```tsx
// app/[locale]/page.tsx
export const dynamic = 'force-static'
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }]
}
```

Same for `app/[locale]/chapters/page.tsx`.

#### 2. Move email-gate cookie check to client side

The `cookies()` call in `chapters/[slug]/page.tsx` is the sole reason chapter pages render dynamically. Refactor:

```tsx
// BEFORE (server-side, forces dynamic)
const cookieStore = await cookies()
const emailCaptured = cookieStore.get('email_captured')?.value === 'true'

// AFTER (client component handles gating)
// Remove cookies() import entirely from this file
// Create a ClientGate wrapper that reads document.cookie
```

Then add ISR:
```tsx
export const revalidate = 3600 // Regenerate every hour
```

#### 3. Add cache headers in `next.config.ts`

```ts
async headers() {
  return [
    {
      source: '/:locale',
      headers: [
        { key: 'Cache-Control', value: 's-maxage=3600, stale-while-revalidate=86400' },
      ],
    },
    {
      source: '/:locale/chapters/:slug',
      headers: [
        { key: 'Cache-Control', value: 's-maxage=86400, stale-while-revalidate=604800' },
      ],
    },
  ]
}
```

### P1: High Priority -- SEO + polish

#### 4. Add the missing OG image

`/og-image.png` is referenced in all page metadata but does not exist in `public/`. Social sharing previews (Facebook, X, LinkedIn) are completely broken. Create a 1200x630 PNG or JPG.

#### 5. Add favicon

No favicon detected anywhere. Add `app/favicon.ico` or `public/favicon.ico`.

#### 6. Fix `next.config.ts` settings

```ts
const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['next-intl'],
  },
}
```

#### 7. Split i18n messages by namespace

Currently `getMessages()` sends ALL translation keys to every page. Use namespace filtering:

```tsx
const messages = await getMessages({ namespace: 'hero' })
```

Or restructure the layout to only pass nav translations via the provider, and use server-side `getTranslations()` for page content (already done in pages -- the provider is the issue).

### P2: Medium Priority

#### 8. Add `<meta name="theme-color">`

```tsx
export const metadata: Metadata = {
  themeColor: '#0a0a0a',
}
```

#### 9. Add `loading.tsx` skeleton for chapter navigation

```tsx
// app/[locale]/chapters/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-24 animate-pulse">
      <div className="h-4 bg-gray-800 w-24 mb-4 rounded" />
      <div className="h-12 bg-gray-800 w-3/4 mb-8 rounded" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-800 w-full rounded" />
        <div className="h-4 bg-gray-800 w-5/6 rounded" />
        <div className="h-4 bg-gray-800 w-4/5 rounded" />
      </div>
    </div>
  )
}
```

#### 10. Fix mobile touch targets

From previous visual audit:
- "Chapters" nav link: 59x20px (needs 48x48 minimum)
- "FR" language switcher: 15x16px (needs 48x48 minimum)

Add padding: `min-h-[48px] min-w-[48px] flex items-center justify-center`

#### 11. Add Content-Security-Policy headers

No CSP headers detected. Add via `vercel.json` or `next.config.ts` headers.

### P3: Low Priority

#### 12. Consider converting Navigation to server component

`Navigation` uses `'use client'` solely for `useTranslations`. If the locale is passed as a prop and translations resolved server-side, this hydration boundary could be eliminated.

---

## What's Already Excellent

- **System fonts** -- zero font network requests, zero FOUT/FOIT
- **Zero images** on homepage -- nothing to optimize
- **Zero third-party scripts** -- no analytics/tracking bloat
- **All JS async** -- non-render-blocking
- **Single CSS file** -- Tailwind purges unused classes
- **Only 2 client components** -- minimal hydration cost
- **Clean DOM** -- ~50-70 elements, far under 1,500 threshold
- **Streaming SSR** -- content visible before JS loads
- **Hreflang headers** -- present and correct (en, fr, x-default)
- **JSON-LD structured data** -- Book + Chapter schemas present
- **No horizontal scroll** at any viewport

---

## Score Summary

| Dimension | Score | Notes |
|-----------|-------|-------|
| Loading speed | 6/10 | TTFB 1.76s cold / 300ms warm kills LCP |
| Render blocking | 10/10 | Only one small CSS file |
| Bundle efficiency | 7/10 | i18n bundle bloat, navigation hydration |
| Caching | 2/10 | Aggressive no-cache on all pages |
| Image optimization | N/A | No images to optimize |
| Font loading | 10/10 | System fonts, perfect |
| Third-party impact | 10/10 | Zero third-party resources |
| Mobile performance | 8/10 | Touch target issues in nav |
| **Overall** | **7.6/10** | |

---

## Bottom Line

This is a text-only Next.js site that should score 95+ on Lighthouse but is held back by one architectural decision: **everything renders dynamically when it should be static**. The fix is straightforward:

1. Move cookie-based email gating to a client component (removes `cookies()` from server render)
2. Add `generateStaticParams` + `force-static` or ISR to all pages
3. Add cache headers for CDN edge caching
4. Add the missing OG image

**Expected result after P0 fixes:** TTFB <50ms (CDN edge), LCP <1.0s, INP <100ms, CLS ~0. All three Core Web Vitals firmly in the "good" range at p75. Lighthouse score 95+.
