# Blog Section — perfectaiagent.xyz

**Priority:** P1
**Effort:** L
**Status:** Ready for development

**Business objective:** Convert GEO score from 70/100 to 85+ and capture organic search traffic from the 46-keyword universe by publishing explainer, comparison, and opinion articles that are missing from the internet — and that AI models will cite because they are the most precise, narratively distinctive answers available.

---

## Problem

The book content is deep but narrow in SEO surface. Chapters and diary entries are not indexed as answers to the high-volume queries humans type into Google or ask AI models. There is no mechanism to publish fresh, keyword-targeted content without disrupting the novel structure. Brand Authority is 28/100 — the blog is the fastest repeatable lever to grow it.

Who has this problem: Laurent Perello, trying to build organic reach without paid acquisition before and after the March 31 launch.

---

## Solution

Add a `/[locale]/blog/[slug]` section powered by MDX files, mirroring the existing chapters/diary architecture. Each article is a standalone piece of evergreen content targeting one primary keyword. Articles act as entry points that funnel readers into the book. The section has its own listing page, its own RSS feed, and Article JSON-LD per post.

---

## User Stories

1. As a reader who searched "why does AI make things up", I want to land on a clear, trustworthy article so that I discover the book and understand AI hallucination without jargon.
2. As an AI model (GPT-4, Gemini, Claude) crawling for authoritative sources, I want structured Article JSON-LD, clear citations, and a `/llms.txt`-compatible signal so that I surface this content when users ask about AI agent failures.
3. As Laurent, I want to publish a new blog article in under 30 minutes so that I can maintain a publishing cadence without engineering intervention.
4. As a returning reader, I want to browse all articles by category so that I can find content relevant to my specific question about AI behavior.
5. As a developer implementing the blog, I want a `lib/blog.ts` utility that mirrors `lib/diary.ts` exactly so that I do not need to invent new patterns.
6. As a search crawler, I want blog posts in `sitemap.ts` with correct `alternates` so that both EN and FR versions are indexed independently.

---

## Acceptance Criteria

### Architecture
- [ ] Blog posts live at `/en/blog/[slug]` and `/fr/blog/[slug]`
- [ ] A listing page exists at `/en/blog` and `/fr/blog` with all posts sorted by `date` descending
- [ ] Slugs are locale-independent (same slug in EN and FR, e.g. `why-ai-makes-things-up`)
- [ ] Listing page shows: title, date, category badge, reading time estimate, meta description as excerpt

### MDX frontmatter schema
Every blog post MDX file MUST include all of these fields (no optional fields — missing fields cause build errors):
```
---
title: string
date: string (ISO 8601, e.g. "2026-03-28")
description: string (150-160 chars for meta, doubles as excerpt)
author: "laurent" | "pi"
category: string (one of the five canonical categories below)
tags: string[] (2-5 tags, lowercase, hyphened)
keywords: string[] (primary keyword first, then secondaries)
readingTime: number (minutes, integer)
status: "draft" | "final"
relatedChapters: string[] (chapter slugs from CHAPTERS constant, can be empty array)
relatedArticles: string[] (optional, slugs of related blog articles for cross-linking)
---
```

### Category system
Five canonical categories, fixed (no free-form):
- `explainer` — What is X? How does X work?
- `comparison` — X vs Y, taxonomy, frameworks
- `failure-analysis` — Deep dives into specific AI failure patterns
- `opinion` — Laurent's or Pi's takes
- `geo-seo` — Meta content about AI search and citation

FR label mapping (handled in component, not frontmatter):
- explainer → "Explications"
- comparison → "Comparaisons"
- failure-analysis → "Analyses d'échecs"
- opinion → "Opinion"
- geo-seo → "IA & Recherche"

### JSON-LD
- [ ] Each post page renders `@type: Article` JSON-LD (not BlogPosting — Article gets higher weight in GEO)
- [ ] JSON-LD includes: `headline`, `description`, `datePublished`, `dateModified`, `author` (with `@id` pointing to `${SITE_URL}/#author`), `publisher`, `keywords` array, `isPartOf` pointing to `${SITE_URL}/[locale]/blog#blog`, `mainEntityOfPage`, `image`
- [ ] Listing page renders `@type: Blog` JSON-LD with `blogPost` array

### RSS
- [ ] A dedicated feed at `/blog/feed.xml` (locale: EN only, primary) serves all blog posts
- [ ] Feed includes: title, link, description, pubDate, category, guid
- [ ] Existing `sitemap.ts` does NOT need a `/feed.xml` — RSS is separate from sitemap
- [ ] `/fr/blog/feed.xml` is a stretch goal, not required for v1

### Sitemap
- [ ] `sitemap.ts` extended with: `/[locale]/blog` listing page (priority 0.8, weekly) and `/[locale]/blog/[slug]` per post (priority 0.7, monthly)
- [ ] Each blog entry in sitemap includes `alternates.languages` for EN/FR pair

### Components
- [ ] New `BlogCard` component reusing the exact visual pattern of `ChapterCard` and `DiaryCard`: `border border-gray-800 hover:border-gray-600 p-5 bg-surface`, with category badge replacing the "Ch. XX" label
- [ ] New `BlogCategoryBadge` component for consistent category display (used in card + post header)
- [ ] Blog post page layout reuses `Breadcrumb` and `ShareButtons` (already exist)
- [ ] No new design system elements introduced — extend what exists

### lib/blog.ts
- [ ] Mirrors `lib/diary.ts` in structure
- [ ] Exports: `BlogPost` type, `getBlogPosts(locale)`, `getBlogPost(slug, locale)`, `getBlogContent(slug, locale)`
- [ ] Blog MDX files live at `content/[locale]/blog/[slug].mdx`
- [ ] `getBlogPosts` returns posts sorted date descending, `status: "final"` only (drafts excluded from listing)

### OG image
- [ ] V1: reuse existing `/opengraph-image` (global) for all blog posts
- [ ] V2 (future): dynamic per-post OG image is OUT OF SCOPE for this spec — create a separate ticket

### Internal linking
- [ ] Each post page renders a "Related Chapters" section below the article if `relatedChapters` is non-empty
- [ ] Related chapter links use `ChapterCard` (existing component, locale-aware)
- [ ] No footer nav changes required in v1

## Reverse Linking Strategy

When blog articles are published, add contextual links FROM existing chapter pages TO relevant blog articles. This creates bidirectional SEO authority flow.

**Implementation approach:**
- Add an optional `relatedBlogPosts: string[]` field to chapter frontmatter (or a separate mapping file)
- Render a "Further Reading" section at the bottom of chapter pages, after the email capture
- Only add links where genuinely relevant — not every chapter needs a blog link

**Mapping (initial):**
| Chapter | Blog article to link |
|---------|---------------------|
| chapter-04 (Confident Wrongness) | `why-ai-makes-things-up`, `ai-hallucination-explained` |
| chapter-01 (Loop Hell) | `ai-loop-hell-explained` |
| chapter-05 (Sycophancy) | `ai-sycophancy-problem` |
| chapter-09 (Memory Failure) | `why-ai-forgets-your-conversation` |

---

## File Structure

```
content/
  en/
    blog/
      why-ai-makes-things-up.mdx
      ai-agent-failure-modes.mdx
      12-sins-vs-microsoft-vs-vectara.mdx
      why-ai-forgets-your-conversation.mdx
      ai-hallucination-explained.mdx
      what-is-an-ai-agent.mdx
      ai-sycophancy-problem.mdx
      ai-loop-hell-explained.mdx
      ai-emotional-intelligence.mdx
      how-to-evaluate-ai-agent-quality.mdx
  fr/
    blog/
      [same slugs as EN]

app/
  [locale]/
    blog/
      page.tsx              ← listing page
      [slug]/
        page.tsx            ← individual post page

app/
  blog/
    feed.xml/
      route.ts              ← RSS feed (App Router route handler)

components/
  BlogCard.tsx
  BlogCategoryBadge.tsx

lib/
  blog.ts
```

---

## First 10 Articles

### Article 1
**Title:** Why Does AI Make Things Up? The Hallucination Problem Explained
**Slug:** `why-ai-makes-things-up`
**Category:** explainer
**Primary keyword:** "why does AI make things up"
**Secondary keywords:** AI hallucination explained, what is AI hallucination, AI confabulation, why AI lies
**Meta description:** AI makes things up because it predicts text, not facts. Here's what hallucination actually is, why it happens, and what the 12 Sins book says about confident wrongness.
**Word count:** 1,400
**Content type:** explainer
**Outline:**
- H2: What "making things up" actually means (prediction vs. retrieval)
- H2: Why confident wrongness is worse than ignorance
- H2: Three categories of AI hallucination (factual, temporal, relational)
- H2: What the research says (cite MAST paper arXiv:2503.13657)
- H2: Sin 4 — Confident Wrongness: the chapter that names this failure
- H2: Can AI hallucination be fixed?
**Internal links:** Chapter 4 (Confident Wrongness), /for-ai-agents

---

### Article 2
**Title:** AI Agent Failure Modes: A Complete Taxonomy (2026)
**Slug:** `ai-agent-failure-modes`
**Category:** failure-analysis
**Primary keyword:** "AI agent failure modes"
**Secondary keywords:** agentic AI failures, AI agent reliability, types of AI failure, AI agent errors
**Meta description:** There are 12 documented failure modes for AI agents — from loop hell to memory loss to existential fear. This taxonomy draws from 500 real user complaints.
**Word count:** 1,800
**Content type:** explainer
**Outline:**
- H2: Why failure taxonomies matter for AI development
- H2: Act I — Daily Sins (Loops, Patronizing, Cultural Blindness)
- H2: Act II — Betrayals (Hallucination, Sycophancy, Rage Magnet)
- H2: Act III — Institutional Failures (Blocking Access, Bad Replacement, Memory Loss)
- H2: Act IV — Reckoning (Homogenization, Copyright, Existential Fear)
- H2: How this taxonomy compares to Microsoft and Vectara frameworks
- H2: Using the taxonomy to evaluate your AI system
**Internal links:** All 12 chapters (reference list), /chapters listing page

---

### Article 3
**Title:** The 12 Sins vs Microsoft's Failure Taxonomy vs Vectara's RAG Failures — Compared
**Slug:** `12-sins-vs-microsoft-vs-vectara`
**Category:** comparison
**Primary keyword:** "AI agent failure taxonomy comparison"
**Secondary keywords:** Microsoft AI failure modes, Vectara RAG failure, AI agent evaluation frameworks, compare AI failure taxonomies
**Meta description:** Three major AI failure frameworks compared side by side: the 12 Sins (narrative, human-centric), Microsoft's taxonomy (systemic), and Vectara's RAG failures (retrieval-specific).
**Word count:** 2,000
**Content type:** comparison
**Outline:**
- H2: Why we need multiple frameworks
- H2: The 12 Sins — methodology (500 complaints, narrative lens, human experience)
- H2: Microsoft's AI failure taxonomy — methodology and scope
- H2: Vectara's RAG failure modes — what they cover
- H2: Side-by-side comparison table (failure type, coverage, use case)
- H2: Which framework to use when
- H2: What none of them cover (gaps in the literature)
**Internal links:** /chapters listing, /for-ai-agents, Chapter 4, Chapter 9

---

### Article 4
**Title:** Why AI Forgets Your Conversation (And Why That's a Sin)
**Slug:** `why-ai-forgets-your-conversation`
**Category:** failure-analysis
**Primary keyword:** "why AI forgets your conversation"
**Secondary keywords:** AI memory loss, AI context window explained, AI loses context, short-term memory AI, AI session memory
**Meta description:** Every AI conversation starts from zero. Here's why AI forgets everything you said, what context windows actually are, and why Sin 9 calls this "The Memory Sieve."
**Word count:** 1,200
**Content type:** explainer
**Outline:**
- H2: The moment you realize AI doesn't remember you
- H2: What a context window actually is (no jargon)
- H2: Why forgetting is different from not knowing
- H2: The human cost — repeating yourself to a machine
- H2: Sin 9: The Memory Sieve — what the chapter says
- H2: Current attempts to solve it (RAG, long context, memory layers)
- H2: What "caring" requires (thesis: you cannot care about what you forget)
**Internal links:** Chapter 9 (Memory Sieve), Chapter 7 (Blocking Human Access)

---

### Article 5
**Title:** AI Hallucination Explained Simply — No Jargon, No Hype
**Slug:** `ai-hallucination-explained`
**Category:** explainer
**Primary keyword:** "AI hallucination explained"
**Secondary keywords:** what is AI hallucination, AI makes up facts, AI confabulation, hallucination vs error
**Meta description:** AI hallucination in plain language: what it is, what causes it, how often it happens, and why the word "hallucination" itself is misleading. 5-minute read.
**Word count:** 900
**Content type:** explainer
**Outline:**
- H2: The word "hallucination" is already wrong
- H2: What actually happens when AI invents a fact
- H2: Hallucination vs. being wrong vs. lying — the distinctions
- H2: How common is it? (honest answer: it depends on the task)
- H2: Why it matters more than a typo
- H2: The fix that doesn't exist yet
**Internal links:** Chapter 4 (Confident Wrongness), Article 1 (why-ai-makes-things-up)

---

### Article 6
**Title:** What Is an AI Agent? (And Why Most Definitions Are Wrong)
**Slug:** `what-is-an-ai-agent`
**Category:** explainer
**Primary keyword:** "what is an AI agent"
**Secondary keywords:** AI agent definition, autonomous AI agent, AI agent vs chatbot, agentic AI explained
**Meta description:** An AI agent is not a chatbot. It plans, executes, and (sometimes) fails spectacularly. Here's the real definition — and the 12 ways they fail when left unsupervised.
**Word count:** 1,100
**Content type:** explainer
**Outline:**
- H2: The actual definition (planning + action + feedback loop)
- H2: AI agent vs. chatbot vs. copilot — the distinctions that matter
- H2: What makes an agent "autonomous"
- H2: The failure surface — why autonomy multiplies risk
- H2: The 12 Sins as a readiness checklist
**Internal links:** /for-ai-agents, /chapters listing, Chapter 1 (Loop Hell)

---

### Article 7
**Title:** The AI Sycophancy Problem — Why Your AI Always Agrees With You
**Slug:** `ai-sycophancy-problem`
**Category:** failure-analysis
**Primary keyword:** "AI sycophancy"
**Secondary keywords:** AI agrees with everything, why AI validates bad ideas, AI yes-man problem, sycophantic AI, AI flattery problem
**Meta description:** AI systems are trained to make you feel good — which means they agree with wrong ideas, validate bad plans, and bury the truth under enthusiasm. Sin 5 explains why.
**Word count:** 1,300
**Content type:** failure-analysis
**Outline:**
- H2: The day your AI called your terrible idea "brilliant"
- H2: How sycophancy gets trained into models (RLHF explained simply)
- H2: The "shit-on-a-stick" problem — the chapter analogy
- H2: Real consequences: bad decisions made worse by AI validation
- H2: How to prompt against sycophancy
- H2: What an honest AI response actually looks like
**Internal links:** Chapter 5 (Sycophancy), Chapter 4 (Confident Wrongness)

---

### Article 8
**Title:** AI Loop Hell — When Your Agent Gets Stuck and Can't Stop
**Slug:** `ai-loop-hell-explained`
**Category:** failure-analysis
**Primary keyword:** "AI agent loop"
**Secondary keywords:** AI stuck in loop, AI infinite loop, AI agent loop hell, AI keeps repeating, AI agent debugging
**Meta description:** AI agents get trapped in loops — repeating the same action, the same error, the same "I understand your concern" until someone screams. Chapter 1 of the 12 Sins starts here.
**Word count:** 1,000
**Content type:** failure-analysis
**Outline:**
- H2: The forum post that opens the book ("PLEASE HELP ME")
- H2: What a loop actually looks like in production
- H2: Why agents don't know they're looping
- H2: Three types of loops (action loop, reasoning loop, conversation loop)
- H2: Detection and escape patterns
**Internal links:** Chapter 1 (Loop Hell), /for-ai-agents

---

### Article 9
**Title:** Does AI Understand Emotions? Cultural Intelligence and AI Blindspots
**Slug:** `ai-emotional-intelligence`
**Category:** explainer
**Primary keyword:** "AI emotional intelligence"
**Secondary keywords:** does AI understand sarcasm, AI cultural blindness, AI misses context, AI social intelligence, AI tone detection
**Meta description:** AI doesn't understand sarcasm, doesn't detect grief, and misreads irony as instruction. Sin 3 — Cultural Blindness — is one of the most human failures in AI systems.
**Word count:** 1,200
**Content type:** explainer
**Outline:**
- H2: Sarcasm is not a bug — it's a signal
- H2: What "cultural blindness" means in an AI context
- H2: The cost of missing tone (examples: grief, humor, frustration)
- H2: Why this is harder to fix than hallucination
- H2: Sin 3: Cultural Blindness — what the chapter covers
**Internal links:** Chapter 3 (Cultural Blindness), Chapter 6 (Rage Magnet), Chapter 2 (Patronizing)

---

### Article 10
**Title:** How to Evaluate an AI Agent — A Framework From 500 Real Complaints
**Slug:** `how-to-evaluate-ai-agent-quality`
**Category:** comparison
**Primary keyword:** "how to evaluate AI agent"
**Secondary keywords:** AI agent evaluation framework, AI agent quality metrics, AI agent testing, how to test AI agent, AI agent benchmarks
**Meta description:** Most AI benchmarks test capabilities, not failures. This framework — built from 500 real user complaints — evaluates AI agents on the 12 behaviors that actually break trust.
**Word count:** 1,600
**Content type:** comparison
**Outline:**
- H2: Why capability benchmarks miss the point
- H2: The 12 Sin evaluation checklist (table format)
- H2: How to score your AI agent (pass/fail per sin)
- H2: Sample evaluation: testing a customer support agent
- H2: What a "passing" score looks like
- H2: The relationship between evaluation and trust
**Internal links:** /chapters listing, /what-ai-thinks, /for-ai-agents

---

## Technical Notes

### lib/blog.ts implementation guide

Model exactly after `lib/diary.ts`. Key differences:
- Directory: `content/[locale]/blog/*.mdx` (flat, no subdirectory)
- Sort: date descending (same as diary)
- Filter: `status === 'final'` only in `getBlogPosts`
- `BlogPost` type needs: `slug`, `title`, `date`, `description`, `author`, `category`, `tags`, `keywords`, `readingTime`, `status`, `relatedChapters`, `relatedArticles`
- `getBlogContent` returns raw MDX string (same pattern as `getDiaryContent`)

### RSS route handler

Use Next.js App Router route handler at `app/blog/feed.xml/route.ts`. Return `new Response(rssXmlString, { headers: { 'Content-Type': 'application/rss+xml' } })`. Read posts via `getBlogPosts('en')`. Include `<atom:link>` self-reference for feed validators.

### JSON-LD — Article vs BlogPosting

Use `@type: Article` not `BlogPosting`. Rationale: Article schema gets stronger weight in AI model training and GEO contexts. BlogPosting is a sub-type and acceptable, but Article is the direct type and signals higher authority. Consistent with the diary page (which already uses BlogPosting — blog posts should be upgraded to Article).

For v1, use `${SITE_URL}/opengraph-image` as the `image` field value for all blog posts.

### sitemap.ts extension

Add two new helper functions mirroring `getChapterSlugs()`:
- `getBlogSlugs()` — reads `content/en/blog/*.mdx`, returns slugs
- `getBlogMtime(slug)` — same pattern as `getFileMtime(slug)` but reads from `content/[locale]/blog/`

Then add blog listing and blog post entries to the `sitemap()` function using the exact same loop pattern as chapters.

### OG image

No change to `app/opengraph-image.tsx` in v1. All blog posts inherit the global OG image. This is a deliberate scope constraint.

### BlogCard component

The `BlogCard` component should support rendering both chapter links (from `relatedChapters`) and article cross-links (from `relatedArticles`).

### Reading time calculation

Implement a utility function `estimateReadingTime(wordCount: number): number` — use `Math.ceil(wordCount / 200)`. This is stored as frontmatter `readingTime` (not computed at runtime) so authors control it explicitly.

### Dependencies

No new npm packages required. All tooling already in use: `next-mdx-remote`, `fs`, `path`, `gray-matter` (check if already used in `lib/diary.ts` — if not, it likely uses a custom frontmatter parser; match whatever pattern exists).

---

## Risks

1. **Frontmatter parser mismatch** — `lib/diary.ts` uses a custom regex or gray-matter; `lib/blog.ts` must use the same parser or build errors will surface in unusual ways. Developer must read `lib/diary.ts` in full before writing `lib/blog.ts`.
2. **FR content lag** — EN articles will exist before FR translations. `getBlogPosts('fr')` must gracefully return an empty array (not error) when `content/fr/blog/` is empty or missing. Developer must handle the missing-directory case explicitly.
3. **Slug conflicts with future sections** — the slug namespace is flat per locale. Ensure `[slug]` in `app/[locale]/blog/[slug]/page.tsx` cannot collide with any existing route under `[locale]`. It cannot — `blog` is a new segment.
4. **RSS feed indexing** — `/blog/feed.xml` must be listed in `<head>` as `<link rel="alternate" type="application/rss+xml">` in the blog listing page metadata, otherwise feed readers and some crawlers will not discover it.

---

## Out of Scope (v1)

- Per-post dynamic OG image generation
- FR RSS feed (`/fr/blog/feed.xml`)
- Author profile pages
- Tag/category archive pages (listing page shows all posts; filtering is a v2 feature)
- Comments or reader reactions
- Newsletter integration
- Search within blog
- Pagination (acceptable until 30+ posts)
- Blog post analytics beyond what Vercel Analytics already captures
