# Mission: Perfect AI Agent Website

## Objective

Improve the novel website AND prove our agent stack works on a real project.
This is a USE CASE — every agent we run here becomes a demo for clients.

**Website:** https://perfect-ai-agent-umber.vercel.app
**Repo:** https://github.com/elpiarthera/perfect-ai-agent
**Local:** /home/laurentperello/coding/perfect-ai-agent/
**Stack:** Next.js 15, React 19, next-intl, next-mdx-remote v6, Tailwind CSS

---

## Constraints

- **Chapter content is FROZEN.** Do not modify any chapter MDX files (EN or FR). Content stays as is.
- Everything else (layout, meta, endpoints, infrastructure) is fair game.
- **Branch workflow:** Never push directly to main. Feature branches + PRs only.

---

## Phase 0 — Dual-Format Architecture (agent-readable layer) [DONE]

| # | Task | Status |
|---|------|--------|
| 0.1 | `llms.txt` — discovery + structure | [x] |
| 0.2 | `llms-full.txt` — entire novel in plain text | [x] |
| 0.3 | JSON-LD schema: Book + Chapter + Author + WebSite + BreadcrumbList | [x] |
| 0.4 | Enrich `<head>` meta: OG, citation, author | [x] |
| 0.5 | `/api/chapters` — structured JSON endpoint | [x] |
| 0.6 | XML sitemap with hreflang + real lastmod | [x] |
| 0.7 | RSS feed with pubDate | [x] |
| 0.8 | `llms-fr.txt` — French discovery file | [x] |

---

## Phase 1 — Audit + Fix (run agents, fix issues, re-audit) [DONE]

### Phase 1.1 — SEO & Technical [DONE]
| Agent | v1 Score | Final Score |
|-------|----------|-------------|
| `seo-technical` | 47/100 | ~93/100 |
| `seo-content` | 78/100 | 78/100 |
| `seo-schema` | 13/30 | ~24/30 |
| `seo-sitemap` | Pass | Pass (3 fixes applied) |
| `seo-visual` | 78/100 | 78/100 |
| `seo-performance` | 7.6/10 | ~9/10 |

Fixes: robots.txt, canonical, hreflang, security headers, JSON-LD (Author/Publisher/WebSite/Breadcrumb), title dedup, favicon, OG image, middleware exclusions, cache headers.

### Phase 1.2 — GEO [DONE]
| Audit | Score |
|-------|-------|
| llms.txt + llms-full.txt | 84/100 |
| API + RSS | 7/10 |
| Citation readiness | 77/100 |

Fixes: CORS on API, structured citation block, pubDate, url field, semantic HTML, French llms-fr.txt.

### Phase 1.3 — Marketing & Conversion [DONE]
| Agent | Score |
|-------|-------|
| Content & messaging | 82/100 |
| Conversion & CRO | 2/10 → 7/10 |
| Strategy & growth | Product 7.5, GTM 3/10 |
| Competitive landscape | No direct competitor |

P0 fixes: 404s (force-static conflict), gated-blur CSS.
P1 fixes: Systeme.io email capture, share buttons, translated CTAs, blurb reordering, email capture on free chapters.

### Phase 1.4 — Security [DONE]
Risk: LOW-MEDIUM → LOW.
Fixes: XSS (dangerouslySetInnerHTML → safe rendering), rate limiting (5/min/IP), CSP header, cookie Secure flag, email regex validation, X-Powered-By removed.

### Phase 1.5 — Translation Quality [SKIPPED]
Chapter content frozen. Scoring FR translations we won't fix is pointless.

### Agent System Improvements Discovered
- `Edit(*)` + `Write(*)` added to global permissions — agents no longer fail silently
- `seo-performance` agent needs Bash access (agent definition issue)
- Agents need `output_dir` convention (not yet implemented)
- Never use `force-static` with `getTranslations()` — causes 404 on Vercel
- Mechanical tasks (concat, strip) = script, not agent

---

## Phase 2 — Launch Prep [IN PROGRESS]

| # | Task | Status |
|---|------|--------|
| 2.1 | Vercel Analytics + Speed Insights | [ ] |
| 2.2 | Homepage "Who Should Read This" section | [ ] |
| 2.3 | "Paste into your agent" CTA with curl command | [ ] |
| 2.4 | Launch copy for HN / X / social | [ ] |

### Strategic insights from audits
- The book is a **credibility engine**, not a revenue product
- "The man who defined the 12 sins of AI agents" = positioning for consulting
- HN angle: "Show HN: A book written by AI about its own failures"
- `llms-full.txt` as GitHub repo with "paste into your agent" instructions
- X thread campaign: one thread per sin, 12 weeks of content

---

## Phase 3 — Launch & Distribution

| # | Task | Status |
|---|------|--------|
| 3.1 | HN post draft | [ ] |
| 3.2 | X thread (12 sins series) | [ ] |
| 3.3 | Facebook FR post | [ ] |
| 3.4 | Book cover image for hero | [ ] |
| 3.5 | Marketing visuals / social cards | [ ] |

---

## Phase 4 — Domain & Deployment

When the custom domain is purchased:

| # | Task | Status |
|---|------|--------|
| 4.1 | Buy domain and configure DNS on Vercel | [ ] |
| 4.2 | Update `SITE_URL` in `lib/seo.ts` (single source of truth) | [ ] |
| 4.3 | Update URLs in `public/llms.txt` + `public/llms-fr.txt` | [ ] |
| 4.4 | Verify: sitemap, feed, llms.txt, JSON-LD all resolve to new domain | [ ] |
| 4.5 | Set up Vercel redirects from old URL to new domain | [ ] |

---

## Execution Protocol

- **Branch workflow:** Feature branches + PRs. Never push directly to main.
- **Phase by phase.** Complete one phase, review, then start the next.
- **Orchestrator role:** Delegate to agents. Review output. Fix agent issues (improve the agent, not the workaround).
- **Reports:** `Missions/Perfect-AI-Agent/reports/`
- **Mechanical tasks = scripts.** Don't use agents for concatenation, stripping, or file manipulation.
