---
name: Blog section PRD
description: Blog section designed for perfectaiagent.xyz — SEO/GEO content engine, 10 articles, /en/blog/[slug] structure, Article JSON-LD, RSS feed
type: project
---

Blog spec written and saved to /root/coding/perfect-ai-agent/drafts/blog-spec.md on 2026-03-26.

**Why:** GEO score 70/100, Brand Authority 28/100. Blog is the main lever to grow organic reach before and after March 31 launch. 46 target keywords identified from SEO research but no mechanism to publish keyword-targeted content without touching the novel structure.

**How to apply:** When delegating blog implementation to dev agents, point them to /drafts/blog-spec.md. Key constraint: lib/blog.ts must mirror lib/diary.ts exactly — developer must read that file first. FR blog content will lag EN — getBlogPosts('fr') must handle empty/missing directory gracefully.

Architecture decisions locked:
- URL: /[locale]/blog/[slug]
- 5 categories: explainer, comparison, failure-analysis, opinion, geo-seo
- JSON-LD: @type Article (not BlogPosting — higher GEO weight)
- RSS: /blog/feed.xml via App Router route handler (EN only, v1)
- OG image: reuse global, per-post dynamic OG is v2
- Components: BlogCard + BlogCategoryBadge, no new design system elements
- Pagination: deferred until 30+ posts
