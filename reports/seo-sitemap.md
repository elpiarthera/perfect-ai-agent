# Sitemap Audit Report

**Site:** https://perfect-ai-agent-umber.vercel.app
**Sitemap:** /sitemap.xml
**Date:** 2026-03-14
**Source file:** `app/sitemap.ts` (Next.js MetadataRoute)

---

## Summary

| Metric | Value |
|--------|-------|
| Total URLs | 32 |
| Locales | en, fr |
| URL limit (50k) | PASS (32/50,000) |
| XML validity | PASS |
| Duplicate URLs | PASS (0 duplicates) |
| Locale parity | PASS (16 en + 16 fr, symmetric) |
| Location page quality gate | N/A (not location pages) |

---

## Validation Checks

| # | Check | Severity | Result | Detail |
|---|-------|----------|--------|--------|
| 1 | Valid XML structure | Critical | PASS | Proper `<?xml?>` declaration, valid `<urlset>` namespace |
| 2 | URL count < 50,000 | Critical | PASS | 32 URLs |
| 3 | No duplicate URLs | High | PASS | All 32 URLs unique |
| 4 | All URLs likely return 200 | High | NEEDS VERIFY | Cannot HTTP-check from this environment. All URLs match real routes in the codebase. |
| 5 | No noindexed URLs in sitemap | High | PASS | No noindex directives found in source |
| 6 | No redirected URLs | Medium | PASS | All URLs are canonical locale paths |
| 7 | `lastmod` accuracy | Low | FAIL | All 32 URLs share identical `lastmod: 2026-03-14T15:56:57.922Z`. This is `new Date()` at build time, not real content modification dates. |
| 8 | `priority` tag present | Info | WARN | Present on all URLs. Google ignores `priority`. Can remove. |
| 9 | `changefreq` tag present | Info | WARN | Present on all URLs. Google ignores `changefreq`. Can remove. |
| 10 | Root URL `/` in sitemap | Medium | FAIL | Missing. The root URL redirects to `/en` via next-intl middleware, but `/` itself is not in the sitemap. Not critical since middleware handles it, but consider adding the canonical root. |
| 11 | `alternates` / `xhtml:link` hreflang | Medium | FAIL | Sitemap does not declare `xhtml:link` alternates between `/en/...` and `/fr/...` pairs. Google uses hreflang to associate locale variants. |
| 12 | RSS feed reference | Info | OK | RSS at `/feed.xml` exists (EN only). Not a sitemap issue but noted. |

---

## URL Inventory (32 URLs)

### EN (16 URLs)
| URL | changefreq | priority |
|-----|------------|----------|
| /en | weekly | 1.0 |
| /en/chapters | weekly | 0.8 |
| /en/chapters/prologue | monthly | 0.7 |
| /en/chapters/chapter-01 | monthly | 0.7 |
| /en/chapters/chapter-02 | monthly | 0.7 |
| /en/chapters/chapter-03 | monthly | 0.7 |
| /en/chapters/chapter-04 | monthly | 0.7 |
| /en/chapters/chapter-05 | monthly | 0.7 |
| /en/chapters/chapter-06 | monthly | 0.7 |
| /en/chapters/chapter-07 | monthly | 0.7 |
| /en/chapters/chapter-08 | monthly | 0.7 |
| /en/chapters/chapter-09 | monthly | 0.7 |
| /en/chapters/chapter-10 | monthly | 0.7 |
| /en/chapters/chapter-11 | monthly | 0.7 |
| /en/chapters/chapter-12 | monthly | 0.7 |
| /en/chapters/epilogue | monthly | 0.7 |
| /en/about | monthly | 0.5 |

### FR (16 URLs)
| URL | changefreq | priority |
|-----|------------|----------|
| /fr | weekly | 1.0 |
| /fr/chapters | weekly | 0.8 |
| /fr/chapters/prologue | monthly | 0.7 |
| /fr/chapters/chapter-01 | monthly | 0.7 |
| /fr/chapters/chapter-02 | monthly | 0.7 |
| /fr/chapters/chapter-03 | monthly | 0.7 |
| /fr/chapters/chapter-04 | monthly | 0.7 |
| /fr/chapters/chapter-05 | monthly | 0.7 |
| /fr/chapters/chapter-06 | monthly | 0.7 |
| /fr/chapters/chapter-07 | monthly | 0.7 |
| /fr/chapters/chapter-08 | monthly | 0.7 |
| /fr/chapters/chapter-09 | monthly | 0.7 |
| /fr/chapters/chapter-10 | monthly | 0.7 |
| /fr/chapters/chapter-11 | monthly | 0.7 |
| /fr/chapters/chapter-12 | monthly | 0.7 |
| /fr/chapters/epilogue | monthly | 0.7 |
| /fr/about | monthly | 0.5 |

---

## Content vs Sitemap Coverage

### Content files (EN)
- `about-cover.mdx` -- excluded from sitemap (filtered by `!f.startsWith("about-")` in `getChapterSlugs()`). Correct if this is not a standalone page.
- `about-website.mdx` -- also excluded. Same filter. Correct if used as partial content on the `/about` page.
- All 14 chapter files (prologue, ch01-12, epilogue) -- present in sitemap. PASS.

### Content files (FR)
- Full parity with EN: 14 chapter files + 2 about-* partials. PASS.

### App routes vs sitemap
| Route | In sitemap? |
|-------|-------------|
| `/[locale]` (homepage) | Yes |
| `/[locale]/chapters` (index) | Yes |
| `/[locale]/chapters/[slug]` (14 slugs) | Yes |
| `/[locale]/about` | Yes |
| `/feed.xml` | No (correct -- RSS is not an HTML page) |
| `/api/subscribe` | No (correct -- API endpoint) |
| `/api/chapters` | No (correct -- API endpoint) |

No missing pages detected.

---

## Issues and Fixes

### 1. FAIL -- All lastmod dates are identical (Low severity)

**Problem:** `lastmod` is set to `new Date()` (line 19 of `sitemap.ts`), which regenerates at every build. Google treats identical lastmod across all URLs as unreliable and may ignore it entirely.

**Fix:** Use real content modification dates. Read `fs.statSync(filePath).mtime` for each MDX file, or extract a `lastModified` field from frontmatter.

```typescript
// Replace: lastModified: now,
// With:
const stat = fs.statSync(path.join(process.cwd(), 'content', 'en', `${slug}.mdx`))
lastModified: stat.mtime,
```

### 2. FAIL -- No hreflang alternates in sitemap (Medium severity)

**Problem:** The sitemap lists `/en/chapters/chapter-01` and `/fr/chapters/chapter-01` as independent URLs. Google has no signal to associate them as locale variants of the same page.

**Fix:** Add the `xhtml` namespace and `<xhtml:link>` alternates to each `<url>` entry. Next.js `MetadataRoute.Sitemap` supports this via the `alternates` property:

```typescript
entries.push({
  url: `${BASE_URL}/${locale}/chapters/${slug}`,
  lastModified: stat.mtime,
  alternates: {
    languages: {
      en: `${BASE_URL}/en/chapters/${slug}`,
      fr: `${BASE_URL}/fr/chapters/${slug}`,
    },
  },
});
```

This produces `<xhtml:link rel="alternate" hreflang="en" href="..."/>` in the XML output.

### 3. WARN -- priority and changefreq present (Info)

**Problem:** Google's documentation explicitly states it ignores both `<priority>` and `<changefreq>`. They add noise to the XML.

**Fix:** Remove both properties from the sitemap entries. Next.js will omit the tags if the fields are not set.

### 4. FAIL -- Root URL missing (Medium severity)

**Problem:** Visiting `/` triggers a redirect to `/en` via next-intl middleware. The root URL is not in the sitemap. While the middleware handles user navigation, some crawlers may expect to find `/` listed.

**Fix:** Either add the root URL to the sitemap (if it should be indexable) or ensure it returns a 301 to `/en` so Google follows it. Since the middleware already redirects, this is low priority.

---

## Recommended Sitemap (after fixes)

The `sitemap.ts` should be rewritten to:

1. Remove `priority` and `changefreq`
2. Use real file modification dates for `lastmod`
3. Add `alternates.languages` for hreflang pairing
4. Keep the same URL set (no missing pages found)

---

## Quality Gate Assessment

- **Location pages:** Not applicable. This is a book/content site with unique chapter content per URL.
- **Thin content risk:** None. Each chapter is substantial unique content (200+ words minimum).
- **Doorway page risk:** None. FR content is actual translation, not city-name swaps.

---

## Verdict

**Overall: 3 actionable issues, 0 critical.**

| Priority | Action |
|----------|--------|
| 1 (do now) | Add hreflang alternates -- enables proper locale indexing |
| 2 (do now) | Fix lastmod to use real file dates -- improves crawl efficiency |
| 3 (optional) | Remove priority + changefreq -- reduces noise, cleaner XML |
| 4 (optional) | Add root URL or confirm 301 behavior |
