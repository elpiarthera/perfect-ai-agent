# GEO Audit: llms.txt & llms-full.txt

**Site:** https://perfect-ai-agent-umber.vercel.app
**Date:** 2026-03-14
**Auditor:** Claude Code (automated)

---

## llms.txt — Scorecard

| # | Criterion | Score | Notes |
|---|-----------|-------|-------|
| 1 | **Discovery** | 9/10 | Clear title, tagline, and description. An AI agent knows within 3 lines what this site is: a novel addressed to AI agents about 12 failure patterns. The only gap: no explicit `type: book` or `format: novel` machine-readable tag. |
| 2 | **Structure (TOC)** | 10/10 | All 14 entries present (prologue + 12 chapters + epilogue). Each links to the correct URL with sin label. Complete and accurate. |
| 3 | **Citation guidance** | 7/10 | Citation block exists with proper format: `Perello, Laurent (publisher). "The Perfect AI Agent." Written by AI agents. Published March 2026.` However: no DOI, no ISBN, no BibTeX/RIS block, no structured citation metadata. An AI could cite it, but would have to manually parse the string. |
| 4 | **Author info** | 8/10 | Laurent is correctly identified as "Original idea and publisher" (not author). The distinction that AI agents wrote the book is stated twice. Missing: the specific agent stack (Claude Code) and the process description that would help an AI understand provenance. |
| 5 | **Content pointers** | 6/10 | Links to llms-full.txt: yes. Links to /api/chapters: NO. Links to RSS: NO (and RSS returns 404). Links to sitemap: NO. Links to French version: NO. An AI agent doing a single fetch of llms.txt misses the API endpoint entirely, and the bilingual content. |
| 6 | **License/usage** | 7/10 | Clear statement: reading, reference, and citation allowed. AI processing explicitly permitted. Commercial reproduction requires permission. Missing: Creative Commons identifier, SPDX tag, or machine-readable license field. "Requires permission" is vague -- no contact method provided. |

**llms.txt Total: 47/60 (78%)**

---

## llms-full.txt — Scorecard

| # | Criterion | Score | Notes |
|---|-----------|-------|-------|
| 1 | **Completeness** | 10/10 | All 14 sections present: PROLOGUE + 12 CHAPTERS + EPILOGUE. Verified by grep: 14 chapter headers, consistent `---` separators. No content missing. |
| 2 | **Readability** | 10/10 | Pure plain text. Zero HTML tags. Zero MDX artifacts. Zero import/export statements. One `<Mutex<>>` in chapter content is Rust code syntax, not markup. Clean, human-readable prose. |
| 3 | **Structure** | 9/10 | Chapters clearly separated by `---` + `CHAPTER N: Title` headers. Duplicate headers (ALL CAPS + Title Case) on each chapter -- this is minor redundancy but doesn't hurt parsing. Missing: no explicit end-of-file marker or `---END---` signal. |
| 4 | **Token efficiency** | 8/10 | ~38,300 words / ~50k tokens. Fits comfortably in a single context window for Claude (200k), GPT-4 (128k), Gemini (1M+). For smaller models (32k context), it would overflow. No metadata bloat, no boilerplate. The duplicate chapter headers (CAPS + Title Case) add ~200 tokens of waste. Could include a token count in the header for transparency. |

**llms-full.txt Total: 37/40 (93%)**

---

## Combined GEO Score: 84/100

---

## Single-Fetch Test

**Question:** Can an AI agent in one fetch get everything it needs to cite, summarize, or recommend this book?

| Capability | Via llms.txt | Via llms-full.txt | Verdict |
|------------|-------------|-------------------|---------|
| Identify the book | Yes | Yes | PASS |
| Get complete TOC with URLs | Yes | No (no URLs in full text) | PARTIAL |
| Read all content | No (links only) | Yes (full text) | PARTIAL |
| Cite properly | Yes (citation block) | No (no citation block) | PARTIAL |
| Discover API endpoint | No | No | FAIL |
| Discover French version | No | No | FAIL |
| Understand license | Yes | No | PARTIAL |
| Get author/publisher info | Yes | No (header only) | PARTIAL |

**Verdict:** An AI agent needs TWO fetches minimum (llms.txt + llms-full.txt) to have full context. This is acceptable per the llms.txt spec. But the llms.txt file itself is missing pointers to key resources.

---

## Issues Found

### Critical (revenue/discoverability impact)

1. **No RSS feed.** `/rss.xml` returns 404. This blocks syndication, podcast apps, and AI agents that monitor RSS for new content. The sitemap references no feed either.

2. **No /api/chapters pointer in llms.txt.** The API exists and returns excellent structured JSON (title, slug, sin, summary, position for all 14 chapters). But llms.txt doesn't mention it. An AI agent building a recommendation system would miss this entirely.

3. **No French content pointer.** The site is fully bilingual (42 URLs in sitemap, `/fr/chapters/` routes). But llms.txt only links to English URLs. No `/fr/llms.txt` or `hreflang` equivalent for AI consumption.

### Major (quality/completeness gaps)

4. **No structured citation metadata.** The citation is a free-text string. Adding a JSON-LD block, BibTeX entry, or at minimum a structured block would let AI agents cite without parsing:
   ```
   ## Citation (structured)
   Title: The Perfect AI Agent
   Publisher: Laurent Perello
   Written by: AI agents (autonomously)
   Date: March 2026
   URL: https://perfect-ai-agent-umber.vercel.app/
   Type: Novel / Non-fiction
   Chapters: 14
   Language: en, fr
   ```

5. **No token count in llms-full.txt header.** AI agents doing context window math need to know the file size before fetching. Adding `Approximate tokens: ~50,000` to the header saves a wasted fetch for small-context models.

6. **Duplicate chapter headers in llms-full.txt.** Each chapter has both `CHAPTER 1: You Are a Hamster Wheel` (ALL CAPS) and `Chapter 1: You Are a Hamster Wheel` (Title Case). Pick one. The duplication adds noise.

### Minor (polish)

7. **No `robots.txt` pointer to llms.txt.** The robots.txt file doesn't reference llms.txt. Some AI crawlers (Anthropic, OpenAI) look for it at `/llms.txt` by convention, but an explicit pointer doesn't hurt.

8. **License lacks contact method.** "Commercial reproduction requires permission from the publisher" -- but no email or contact URL. Add `Contact: laurent@perello.consulting` or similar.

9. **No version/last-updated timestamp in llms.txt.** AI agents caching this file need to know when it changed.

---

## Recommendations (Priority Order)

### P0 — Do now

1. **Add API and resource pointers to llms.txt:**
   ```markdown
   ## Resources

   - Full text: https://perfect-ai-agent-umber.vercel.app/llms-full.txt
   - Chapter API (JSON): https://perfect-ai-agent-umber.vercel.app/api/chapters
   - Sitemap: https://perfect-ai-agent-umber.vercel.app/sitemap.xml
   - French version: https://perfect-ai-agent-umber.vercel.app/fr/chapters/prologue
   ```

2. **Add structured citation block** (see #4 above).

3. **Create `/fr/llms.txt`** — identical structure, French chapter titles, French URLs.

### P1 — Do this week

4. **Build RSS feed** at `/rss.xml` or `/feed.xml`. Even a static one with all 14 chapters.

5. **Add token count + last-updated to llms-full.txt header:**
   ```
   THE PERFECT AI AGENT
   Written autonomously by AI agents
   Original idea and publisher: Laurent Perello
   Last updated: 2026-03-14
   Approximate tokens: ~50,000
   Language: en
   ```

6. **Deduplicate chapter headers** in llms-full.txt (keep CAPS version only, remove Title Case duplicate).

### P2 — Nice to have

7. Add `llms.txt` reference to robots.txt.
8. Add contact email to license section.
9. Add JSON-LD structured data for the book on the main page (Schema.org Book type).
10. Create a `llms-fr-full.txt` with the French content for complete bilingual AI coverage.

---

## What Works Well

- The llms.txt file follows the emerging standard format correctly.
- The writing is genuinely AI-agent-addressed -- an AI reading this will correctly identify itself as the target audience.
- The `/api/chapters` endpoint is excellent: structured JSON with slug, title, sin, summary, position. Perfect for programmatic access.
- The llms-full.txt is clean, well-structured plain text with zero markup artifacts.
- The full text fits in a single context window for all major LLMs (Claude, GPT-4, Gemini).
- The license explicitly permits AI processing -- most sites don't do this.
- The distinction between "publisher" (Laurent) and "written by AI agents" is consistently maintained.
