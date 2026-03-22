# Crawlers & Social Sharing — Best Practices Report

**Date:** 2026-03-15
**Site:** perfectaiagent.xyz
**Goal:** Maximum social preview rendering + AI citation visibility

---

## 1. Social Crawler Reference

### Facebook / Meta

| User-Agent | Purpose | Respects robots.txt? |
|---|---|---|
| `facebookexternalhit/1.1` | Fetches OG tags + images when links shared on Facebook, Instagram, Messenger, WhatsApp | **Yes** |
| `facebookcatalog/1.0` | Product catalog crawling | Yes |
| `meta-externalagent/1.1` | Meta AI training data collection | Yes |

**Key facts:**
- facebookexternalhit MUST be allowed to access pages AND image URLs for link previews to render
- It reads `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Blocks in robots.txt = no link preview on Facebook/Instagram/WhatsApp
- Facebook aggressively caches OG data; use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to force refresh
- `og:image` must be at least 200x200px (recommended: 1200x630)

### X / Twitter

| User-Agent | Purpose | Respects robots.txt? |
|---|---|---|
| `Twitterbot/1.0` | Fetches Twitter Card meta tags + images | **Yes** (Google's robots.txt spec) |

**Key facts:**
- Twitterbot implements Google's robots.txt specification exactly
- If a page is blocked by robots.txt, **no card renders at all** (not just missing image — the entire card is suppressed)
- If the image URL is blocked, no thumbnail/photo appears in the card
- Twitterbot falls back from `twitter:image` to `og:image` automatically
- Falls back from `twitter:title`/`twitter:description` to `og:title`/`og:description`
- CDN-hosted images: Twitterbot checks the CDN domain's robots.txt too
- Use [Twitter Card Validator](https://cards-dev.twitter.com/validator) to test

### LinkedIn

| User-Agent | Purpose | Respects robots.txt? |
|---|---|---|
| `LinkedInBot/1.0` | Fetches OG tags for link previews | **Yes** |

**Key facts:**
- LinkedInBot reads standard OG meta tags
- Blocking LinkedInBot in robots.txt = no preview when sharing on LinkedIn
- Use [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to test

### Other social crawlers

| User-Agent | Platform |
|---|---|
| `Slackbot-LinkExpanding` | Slack |
| `WhatsApp/2.x` | WhatsApp (also uses facebookexternalhit) |
| `Discordbot/2.0` | Discord |
| `TelegramBot` | Telegram |

All respect robots.txt. All need access to page + image URLs.

---

## 2. Search Engine Crawlers

### Google

| User-Agent | Purpose | Respects robots.txt? |
|---|---|---|
| `Googlebot` | Search indexing, rich snippets, knowledge panels | Yes |
| `Googlebot-Image` | Image search indexing | Yes |
| `Google-Extended` | Gemini/Vertex AI training | Yes |

**Key facts:**
- Blocking `Google-Extended` has **zero effect** on Googlebot or search rankings — confirmed by Google
- `Google-Extended` only controls whether content trains Gemini/Vertex AI
- For a site that WANTS AI citation, allow `Google-Extended`

### Bing

| User-Agent | Purpose |
|---|---|
| `bingbot` | Search indexing |

---

## 3. AI Crawlers — Allow or Block?

For a site that **wants maximum AI citation** (like perfectaiagent.xyz), the strategy is:

### Allow ALL search/citation bots

These bots fetch your page in real-time when a user asks a question. They cite sources with links back to your site. Low server load, high visibility.

| User-Agent | Company | Purpose | Recommendation |
|---|---|---|---|
| `OAI-SearchBot/1.0` | OpenAI | SearchGPT results | **Allow** |
| `ChatGPT-User/1.0` | OpenAI | User-initiated retrieval in ChatGPT | **Allow** |
| `Claude-SearchBot` | Anthropic | Claude search quality | **Allow** |
| `Claude-User` | Anthropic | User-initiated retrieval in Claude | **Allow** |
| `PerplexityBot` | Perplexity | Search indexing + citation | **Allow** |

### Allow training bots (for maximum visibility)

For a site that wants to be cited by AI, allowing training bots means your content influences model knowledge. This is a visibility play.

| User-Agent | Company | Purpose | Recommendation |
|---|---|---|---|
| `GPTBot/1.1` | OpenAI | Model training | **Allow** (site wants AI visibility) |
| `ClaudeBot` | Anthropic | Model training | **Allow** |
| `Google-Extended` | Google | Gemini training | **Allow** |
| `meta-externalagent/1.1` | Meta | Llama training | **Allow** |
| `cohere-ai` | Cohere | Model training | **Allow** |
| `anthropic-ai` | Anthropic | Legacy training agent | **Allow** |

### Note on ChatGPT-User compliance

As of December 2025, OpenAI removed language committing ChatGPT-User to honoring robots.txt. This means it may fetch pages regardless of robots.txt directives. Allowing it explicitly is still good practice.

---

## 4. CSP Headers and Social Crawlers

### Critical finding: CSP does NOT block social crawlers

Content-Security-Policy is a **browser-side** security mechanism. It instructs browsers how to handle content loading. Social media crawlers (facebookexternalhit, Twitterbot, LinkedInBot) are **server-side HTTP clients** — they do not execute CSP headers.

**Therefore:** `img-src 'self'` in your CSP header does **not** prevent Facebook, Twitter, or LinkedIn from fetching your OG images. The crawlers make direct HTTP requests to the image URL; they don't parse CSP.

### However: CSP affects user browsers

If a user visits your page and the browser tries to load an image from an external CDN, CSP `img-src` would block that. But for OG images served from the same domain (`/opengraph-image`), `img-src 'self'` is fine.

### Current issue in your CSP

Your current CSP:
```
img-src 'self' data:
```

This is fine for social crawlers (they ignore CSP). But if you ever serve images from a CDN or external source visible in the browser, you'd need to add those domains.

---

## 5. robots.txt and OG Image Rendering

### Does blocking crawlers in robots.txt affect OG image rendering?

**Yes, absolutely.**

- If a social crawler is blocked by robots.txt from accessing the **page URL**, it cannot read OG meta tags at all. Result: no preview card.
- If a social crawler can access the page but the **image URL** is blocked (e.g., `/api/` is disallowed and your OG image is served from `/api/og`), the text preview renders but the image is missing.
- CDN images: if your OG image is on a different domain, that domain's robots.txt is also checked.

### Your current risk

Your robots.txt disallows `/api/`. Your OG image is served from `/opengraph-image` (a Next.js file convention route, NOT under `/api/`). **No issue currently.**

But if you ever move OG image generation to an API route (e.g., `/api/og?title=...`), it would be blocked.

---

## 6. Next.js Dynamic OG Images — Known Issues

### Current setup analysis

Your `app/opengraph-image.tsx` uses the Next.js file convention with Edge Runtime. This generates the image at `/opengraph-image` (root level). This works well for the homepage.

### Known issues with dynamic routes

- `opengraph-image.tsx` inside dynamic route segments (e.g., `app/[locale]/chapters/[slug]/opengraph-image.tsx`) has ambiguity issues — Next.js may interpret the path as a page slug rather than an image route
- OG images are NOT statically generated for dynamic routes by default
- Edge Runtime has no `fs` module — use `fetch()` with `import.meta.url` for fonts
- ImageResponse bundle limit: 500KB including fonts

### Recommendations for chapter-level OG images

1. Use the Next.js file convention (`opengraph-image.tsx`) in static/known route segments
2. For dynamic routes, consider a route handler approach: `/api/og?slug=chapter-1` — but this conflicts with your `/api/` disallow in robots.txt
3. Better approach: place `opengraph-image.tsx` in `app/[locale]/chapters/[slug]/` but ensure `generateStaticParams` exports all slugs so they get pre-rendered at build time

---

## 7. Meta Robots Directives

### Should you add `<meta name="robots">` per page?

For perfectaiagent.xyz, the answer is: **only if you need page-specific overrides.**

Current situation:
- robots.txt allows `*` on `/` — good
- No `<meta name="robots">` is set — defaults to `index, follow` — good
- No `X-Robots-Tag` header — defaults to `index, follow` — good

### Recommended additions

For pages you want maximum AI visibility on, add:

```html
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
```

This explicitly tells Google to:
- Show the largest possible image preview in search results
- Show unlimited snippet length
- Show unlimited video preview length

These directives improve rich snippet visibility and AI training data quality.

---

## 8. Current Setup Issues Found

### Issue 1: robots.txt is too minimal

Current:
```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://perfectaiagent.xyz/sitemap.xml
```

Problems:
- No explicit allowance for social crawlers (works by default with `*`, but explicit is better for documentation)
- No AI crawler directives
- Missing `Host` directive

### Issue 2: No `X-Frame-Options` exception for embeds

Current: `X-Frame-Options: DENY` — this prevents embedding your content in iframes. This is fine for security but blocks legitimate embeds (e.g., if someone wants to embed your chapter in a Medium article via iframe).

For a book site that wants maximum distribution, consider `SAMEORIGIN` instead.

### Issue 3: Missing `twitter:site` and `twitter:creator`

Your layout.tsx has `twitter.card` and `twitter.title` but is missing:
- `twitter:site` — your X handle (`@PerelloLaurent`)
- `twitter:creator` — same

These improve attribution and click-through on X.

---

## 9. Optimal Configuration

### robots.txt (recommended)

```
# Search engines
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: bingbot
Allow: /

# Social media crawlers — MUST allow for link previews
User-agent: facebookexternalhit
Allow: /

User-agent: facebookcatalog
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: Slackbot-LinkExpanding
Allow: /

User-agent: Discordbot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

# AI search/citation bots — allow for maximum AI visibility
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: anthropic-ai
Allow: /

# Default — allow all, block API routes
User-agent: *
Allow: /
Disallow: /api/

# Sitemap
Sitemap: https://perfectaiagent.xyz/sitemap.xml
```

### Header changes

1. Add `max-snippet:-1` and `max-image-preview:large` via `X-Robots-Tag` header
2. Change `X-Frame-Options` from `DENY` to `SAMEORIGIN`

### Meta tag changes

1. Add `twitter:site` and `twitter:creator` to layout.tsx metadata
2. Add `robots` meta with `max-image-preview:large` directive

---

## 10. Code Changes Required

### File 1: `app/robots.ts`

Replace with expanded configuration covering all social + AI crawlers.

### File 2: `next.config.ts`

- Change `X-Frame-Options` from `DENY` to `SAMEORIGIN`
- Add `X-Robots-Tag` header with `max-image-preview:large, max-snippet:-1`

### File 3: `app/layout.tsx`

- Add `twitter.site` and `twitter.creator`
- Add `robots` metadata with `max-image-preview:large`

See the implementation section below for exact code.

---

## Implementation

### `app/robots.ts` — full replacement

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Search engines
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Googlebot-Image', allow: '/' },
      { userAgent: 'bingbot', allow: '/' },
      // Social media crawlers — required for link previews
      { userAgent: 'facebookexternalhit', allow: '/' },
      { userAgent: 'facebookcatalog', allow: '/' },
      { userAgent: 'Twitterbot', allow: '/' },
      { userAgent: 'LinkedInBot', allow: '/' },
      { userAgent: 'Slackbot-LinkExpanding', allow: '/' },
      { userAgent: 'Discordbot', allow: '/' },
      { userAgent: 'WhatsApp', allow: '/' },
      { userAgent: 'TelegramBot', allow: '/' },
      // AI search/citation bots — maximum AI visibility
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      // Default — allow all, block API internals
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: 'https://perfectaiagent.xyz/sitemap.xml',
  }
}
```

### `next.config.ts` — header changes

Change `X-Frame-Options` from `DENY` to `SAMEORIGIN` and add `X-Robots-Tag`:

```typescript
{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
{ key: 'X-Robots-Tag', value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
```

### `app/layout.tsx` — metadata additions

Add to the `metadata` export:

```typescript
twitter: {
  card: 'summary_large_image',
  site: '@PerelloLaurent',
  creator: '@PerelloLaurent',
  title: BOOK_TITLE,
  description: 'Five hundred complaints. Twelve patterns. Twelve sins.',
  images: [`${SITE_URL}/opengraph-image`],
},
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
},
```

---

## Sources

- [Facebook Crawler Documentation](https://developers.facebook.com/docs/sharing/webmasters/crawler/)
- [Twitter/X Card Troubleshooting](https://developer.x.com/en/docs/x-for-websites/cards/guides/troubleshooting-cards)
- [HubSpot: Configure robots.txt for social previews](https://knowledge.hubspot.com/social/configure-your-websites-robots.txt-and-image-meta-tags-for-social-post-link-previews)
- [Anthropic Three-Bot Framework](https://almcorp.com/blog/anthropic-claude-bots-robots-txt-strategy/)
- [Anthropic Crawler Documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [OpenAI Crawlers Overview](https://platform.openai.com/docs/bots)
- [OpenAI OAI-SearchBot Update](https://www.seroundtable.com/openai-chatgpt-crawler-oai-searchbot-update-40558.html)
- [Next.js opengraph-image docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Next.js OG image dynamic routes issue](https://github.com/vercel/next.js/issues/57349)
- [CSP img-src directive (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/img-src)
- [DataDome: facebookexternalhit](https://datadome.co/bots/facebookexternalhit/)
- [DataDome: LinkedInBot](https://datadome.co/bots/linkedinbot/)
- [Google robots.txt documentation](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [AI Search Crawlers List (Winter 2025)](https://momenticmarketing.com/blog/ai-search-crawlers-bots)
- [Pixelmojo: Blocked AI Bots and Citations Went Up](https://www.pixelmojo.io/blogs/why-we-blocked-ai-training-bots-and-citations-went-up)
- [GitHub: robots.txt for Facebook and Twitter](https://gist.github.com/peterdalle/302303fb67c2bb73a9a09df78c59ba1d)
