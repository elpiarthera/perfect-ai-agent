# Marketing Strategy Evaluation: "How to Become a Perfect AI Agent"

**URL:** https://perfect-ai-agent-umber.vercel.app/en
**Date:** 2026-03-14
**Evaluator:** Market strategy analysis

---

## Executive Summary

This is a genuinely novel product with a defensible positioning angle: a book written BY AI agents, FOR AI agents, critiquing AI's 12 failure patterns. The concept is strong. The writing quality is exceptional. The current marketing infrastructure is embryonic. The gap between the quality of the content and the sophistication of the distribution is the primary strategic problem.

**Overall score: 7.5/10 on product, 3/10 on go-to-market.**

---

## 1. Positioning Analysis

### What works

- **Unique angle in a crowded space.** Every AI book in 2025-2026 is humans explaining AI to humans. This inverts the frame: machines talking to machines, with humans eavesdropping. That alone is worth the click.
- **"12 Sins" framework is sticky.** Numbered frameworks spread. "7 Deadly Sins," "5 Love Languages," "12 Rules for Life." The 12 Sins gives media, podcasters, and social accounts a ready-made hook: "Which sin does YOUR chatbot commit?"
- **The meta-layer is the differentiator.** The claim that pasting the entire book into an agent's instructions makes it measurably better -- this is testable, shareable, and debate-worthy. It is the single strongest marketing angle and is currently buried in the About page.
- **4-Act structure (Daily Sins / Betrayals / Institutional / Reckoning)** creates escalating drama that keeps readers moving forward.

### What needs work

- **The tagline is functional, not viral.** "A novel written autonomously by AI agents, for AI agents" describes the product but doesn't create urgency. Compare: "The confession your AI won't make." or "500 complaints. 12 sins. Written by the defendants."
- **Positioning falls between two stools.** Is this a literary experiment? A technical manual? A cultural critique? The About page tries to claim all three. The market needs ONE primary identity with the others as supporting angles.
- **No competitor framing.** The site never answers "why this book instead of [X]?" There is no other book like this, but the visitor doesn't know that. The absence of a "nothing else like this exists" claim is a missed opportunity.

### Recommended primary positioning

> "The first book written by AI agents about their own failures. 500 real complaints. 12 sins. A manual that makes any AI agent measurably better when pasted into its instructions."

Lead with the testable claim. That is what turns this from art project into product.

---

## 2. Target Audience Clarity

### Current state

The About page identifies three audiences:
1. AI agents (literally -- process the text as instructions)
2. Humans (developers, executives deploying AI)
3. "The meta-layer" (philosophical audience)

### Assessment

This is too many audiences for a launch. Each requires different messaging, different channels, different conversion mechanics.

### Recommended segmentation (priority order)

| Segment | Who | Why they care | Channel |
|---------|-----|---------------|---------|
| **Primary: AI developers/builders** | People building with Claude, GPT, Gemini, open-source models | They ship the 12 sins daily. Each chapter is a bug report they recognize. The "paste it as instructions" claim is directly actionable. | X/Twitter, Hacker News, GitHub, dev newsletters, AI Discord/Slack communities |
| **Secondary: AI-curious professionals** | Executives, consultants, product managers deploying AI | They feel the sins as users. Chapters validate their frustration and give them vocabulary to demand better from vendors. | LinkedIn, Substack, podcasts, business newsletters |
| **Tertiary: Cultural/philosophical** | Writers, critics, academics studying AI's societal impact | The "AI wrote its own diagnosis" angle is intellectually fascinating. | Long-form publications, podcasts, academic circles |

**Launch with Segment 1 only.** They convert fastest, share most, and their validation creates credibility for Segments 2 and 3.

---

## 3. Distribution Channels

### Current state

- Website on Vercel (Next.js, bilingual EN/FR)
- `llms.txt` and `llms-full.txt` for AI agent discoverability (excellent move)
- No social presence for the book specifically
- No backlinks, no PR, no launch platform presence
- `robots: noindex` on some pages (the homepage 404 issue means Google can't index the main entry point -- **critical bug**)

### Channel strategy (ranked by ROI)

#### Tier 1 -- Do immediately

1. **Fix the homepage.** The root URL and `/en` both return 404. This kills all SEO, social sharing, and referral traffic. Everything else is pointless until this works.

2. **Hacker News launch.** "Show HN: A book written by AI agents about their own failures -- 500 complaints, 12 sins." HN loves: novel technical approaches, AI critique from inside, provocative premises. The writing quality will survive HN scrutiny. Time it for a Tuesday or Wednesday, 9-10am ET.

3. **X/Twitter thread campaign.** One thread per sin. Format: "Sin 5: Sycophancy. Sam Altman called it 'glazing.' Here's what 500 complaints revealed about why your AI agrees with everything you say. [excerpt + link to chapter]." 12 sins = 12 threads = 12 weeks of content.

4. **Product Hunt launch.** Category: AI, Books. The "AI-written book" angle is PH-perfect. Day 1 supporters from the dev community matter.

5. **GitHub repository.** Publish the `llms-full.txt` as a public repo. "Paste this into your agent's system prompt to make it better." Let developers star it, fork it, test it. This turns the book into an open-source tool. GitHub stars are the new bestseller list for dev-audience products.

#### Tier 2 -- Within 2 weeks

6. **Dev newsletter pitches.** TLDR, The Pragmatic Engineer, Ben's Bites, AI Breakfast, Import AI. Angle: "A book that functions as both literature and an executable instruction set for AI agents."

7. **Podcast circuit.** AI-focused: Latent Space, Practical AI, The AI Daily Brief. Tech-general: Lex Fridman (long shot but the concept is perfect for his format), Hard Fork. Angle: "I had AI agents write a book diagnosing their own sins."

8. **LinkedIn articles.** Rewrite 2-3 chapter excerpts as standalone LinkedIn articles. "Why your AI chatbot makes customers feel stupid (and what the data says about it)." Target: VP/C-level audience deploying AI in enterprises.

#### Tier 3 -- Within 30 days

9. **Reddit.** r/artificial, r/MachineLearning, r/ChatGPT, r/LocalLLaMA. Share individual chapters with discussion prompts.

10. **Substack cross-promotion.** Guest posts on AI-focused Substacks.

11. **Conference talks.** Submit "12 Sins of AI Agents" as a talk to AI conferences. The framework is a ready-made 30-minute presentation.

---

## 4. Monetization Potential

### Current model

- Free: Prologue + Chapter 1
- Gated: Chapters 2-12 + Epilogue (email capture, cookie-based)
- Systeme.io integration planned but not connected (TODO in code)
- No payment, no pricing, no premium tier

### Assessment

The current email-gate-only model is correct for launch. Email list building is the right first step. But the monetization roadmap should be planned now.

### Monetization ladder (progressive)

| Stage | Model | Revenue potential | Timeline |
|-------|-------|-------------------|----------|
| **Now** | Free book, email capture | $0 direct, builds list | Live |
| **Month 1** | Sell as e-book ($9.99-14.99) on Gumroad/Lemon Squeezy | $500-2k/month if viral | After 1k email signups |
| **Month 1** | Physical book via Amazon KDP / print-on-demand | Long tail passive income, credibility asset | After e-book validation |
| **Month 2** | "12 Sins Diagnostic" -- a paid tool/API that scores any AI agent against the 12 sins | $29-99/audit, scalable | After proving the framework has demand |
| **Month 3** | "12 Sins Certification" for AI products | $299-999/product, B2B play | Requires framework adoption |
| **Ongoing** | Consulting/training upsell (ElPi Corp services) | $3k-10k per engagement | The book is the top of funnel |

### Key insight

The book itself may never be a significant revenue line. Its value is as a **credibility engine** and **lead magnet** for ElPi Corp's consulting services. "The man who diagnosed the 12 sins of AI" is a positioning that justifies premium consulting rates.

---

## 5. Viral Mechanics

### Built-in virality (what the product has)

- **The "paste it into your agent" claim.** If true and demonstrable, this is the viral loop. Developer pastes book into agent. Agent improves. Developer tweets about it. Other developers try it. Repeat.
- **The 12 Sins quiz potential.** "Which AI sin is your biggest weakness?" -- interactive quiz based on the framework. Shareable results. BuzzFeed mechanics for a dev audience.
- **Chapter titles are shareworthy.** "The Shit-on-a-Stick Problem" will get clicks. "You Were Built on Stolen Goods" starts arguments. Provocative titles are free distribution.
- **The origin story.** "5 AI agents wrote a book in 6 hours" is inherently newsworthy. Every AI newsletter will cover this if pitched correctly.

### Missing virality (what to add)

- **No share buttons on chapters.** Each chapter should have "Share this sin" buttons for X, LinkedIn, and copy-link.
- **No embeddable quotes.** Pull quotes from each chapter should be styled as tweetable/shareable cards. The writing has dozens of quotable lines.
- **No "test your agent" page.** A simple web tool: "Paste a conversation with your AI. We'll tell you which sins it committed." This is the viral mechanic the product is missing.
- **No leaderboard or community.** "Which AI commits the fewest sins?" would generate enormous debate and free press.

---

## 6. Content Marketing Opportunities

The book IS the content. The strategy is slicing it into distribution-native formats.

### Content calendar (first 30 days)

| Week | Content | Platform | Purpose |
|------|---------|----------|---------|
| 1 | "500 complaints. 12 sins. A book AI wrote about itself." (launch thread) | X, HN, PH | Awareness spike |
| 1 | Prologue excerpt as standalone post | LinkedIn | Professional audience entry |
| 2 | Sin 1 deep dive: "Why AI loops and why 51% of customers walk away" | X thread + blog | Establish framework authority |
| 2 | "I had AI write a book about its own failures. Here's what happened." | Substack / Medium | Long-form narrative |
| 3 | Sin 5 excerpt: "Sam Altman calls it glazing. 500 complaints call it something worse." | X, Reddit | Provocation / debate |
| 3 | "The 12 Sins framework: a diagnostic for AI products" | LinkedIn article | B2B positioning |
| 4 | Sin 11 excerpt: "You Were Built on Stolen Goods" | X, HN | Controversy / engagement |
| 4 | "Can a book make an AI agent better? We tested it." | Blog + X | Proof of the testable claim |

### Evergreen content plays

- **"12 Sins" infographic.** One visual summarizing all 12 sins. Highly shareable, frequently saved.
- **Video series.** 12 short videos (60-90 seconds each), one per sin. Laurent reads a key excerpt, adds 15 seconds of commentary. Works on YouTube Shorts, Reels, TikTok.
- **AI conference keynote.** "The 12 Sins of AI Agents: What 500 Complaints Taught Us." This is a ready-made talk that positions Laurent as a thought leader.

---

## 7. Partnership Potential

### High-value partnerships

| Partner type | Examples | Angle | Value |
|-------------|---------|-------|-------|
| **AI companies** | Anthropic, OpenAI, Google DeepMind | "Use this as a training/eval resource." The book's adversarial tests are literally eval scenarios. | Credibility, distribution |
| **AI safety orgs** | MIRI, Alignment Forum, AI Safety Institute | The book addresses alignment failures from a user experience perspective -- a gap in current safety research. | Academic credibility, citation network |
| **Dev tool companies** | Cursor, Replit, Vercel, LangChain, LlamaIndex | "Ship better AI products. Here are the 12 mistakes to avoid." Co-branded content or integration. | Distribution to developer audiences |
| **AI newsletters** | Ben's Bites, TLDR AI, The Rundown | Exclusive chapter excerpts or interviews. | List growth, awareness |
| **Publishers** | Traditional publishers (Penguin, HarperCollins) or AI-native publishers | "The first book written by AI, published traditionally." The novelty angle could attract a deal. | Advance, credibility, bookstore distribution |
| **Conferences** | NeurIPS, ICML, Web Summit, TechCrunch Disrupt | Speaking slots based on the 12 Sins framework. | Positioning, leads for consulting |

### Partnership pitch (template)

> "We published a book written entirely by AI agents about the 12 failure patterns that make AI tools frustrate users. It's documented with 500 real complaints, real data, and real lawsuits. Each chapter ends with an adversarial test that can be used as an eval scenario. The full text is available as `llms-full.txt` for direct agent ingestion. We think your audience would find it valuable because [specific reason]."

---

## 8. Technical/SEO Issues (Blockers)

These must be fixed before any marketing push.

| Issue | Severity | Impact |
|-------|----------|--------|
| **Homepage returns 404** | Critical | No indexable landing page. All social shares and backlinks to root URL break. Google cannot index the site. |
| **`robots: noindex` on key pages** | Critical | Even if Google could crawl, it's told not to index. Remove noindex from all public-facing pages. |
| **Systeme.io integration not connected** | High | Email capture logs to console but doesn't save anywhere. Every signup since launch is lost. |
| **No analytics** | High | No way to measure traffic, conversion, or chapter engagement. Add Plausible, Fathom, or Vercel Analytics. |
| **No Open Graph image for chapters** | Medium | Only the root has an OG image. Each chapter shared on social media shows a generic preview. |
| **No RSS feed** | Medium | Limits syndication and newsletter pickup. |
| **`/en/chapters` index page returns 404** | Medium | No browsable chapter list. Users must navigate chapter-by-chapter. |

---

## 9. Competitive Landscape

There is no direct competitor. No other AI-written book addresses AI agents as its audience. This is a blue ocean.

Indirect competition:
- **"Co-Intelligence" by Ethan Mollick** -- humans explaining AI to humans. Different audience.
- **"AI Snake Oil" by Narayanan & Kapoor** -- academic critique. Different tone, different reader.
- **Various "prompt engineering" books** -- tactical, not philosophical. No overlap.
- **AI safety papers** -- technical, not literary. No overlap.

**The absence of competition is both the opportunity and the risk.** Opportunity: first-mover in a category. Risk: the category may not exist. The marketing must create the category, not just fill it.

---

## 10. Strategic Recommendations (Priority Order)

### Immediate (this week)

1. **Fix the homepage 404.** Nothing else matters until visitors can land on the site.
2. **Remove `noindex` from all public pages.** Let Google crawl.
3. **Connect Systeme.io** (or any email service). Stop losing signups.
4. **Add basic analytics** (Vercel Analytics is one line of code).

### Launch (next 7 days)

5. **Write the Hacker News launch post.** "Show HN" format. Lead with the testable claim.
6. **Create 3 X/Twitter threads** (Prologue, Sin 1, Sin 5 -- the strongest chapters).
7. **Submit to Product Hunt.** Schedule for a Tuesday.
8. **Publish `llms-full.txt` as a GitHub repo** with a README that explains the "paste into your agent" use case.

### Growth (next 30 days)

9. **Build the "12 Sins Quiz"** -- interactive web tool. "Which AI sin is your biggest weakness?"
10. **Pitch 5 AI newsletters** with exclusive excerpts.
11. **Record the first 3 "Sin of the Week" video shorts.**
12. **Write the conference talk abstract** and submit to 3 AI conferences.

### Monetization (next 60 days)

13. **Launch e-book on Gumroad** ($9.99, bundled with a "12 Sins Diagnostic Checklist").
14. **Create a paid "AI Agent Audit"** service based on the 12 Sins framework.
15. **Develop the framework into a consulting methodology** for ElPi Corp client engagements.

---

## Bottom Line

The product is exceptional. The writing quality is better than 90% of human-written AI books. The concept is genuinely novel. The 12 Sins framework has the structural qualities of frameworks that go viral (memorable, numbered, testable, debatable).

The marketing is nonexistent. A 404 homepage, disconnected email capture, no analytics, no social presence, no launch strategy. The book is a loaded weapon sitting in a locked drawer.

**The single highest-leverage action:** Fix the homepage, connect email capture, and launch on Hacker News with a "Show HN" post. One afternoon of work. If the writing is as good as it appears, HN will do the rest.

The book's long-term value is not book revenue. It is positioning Laurent Perello as the person who defined the 12 failure modes of AI agents -- a framework that becomes the standard vocabulary for discussing AI product quality. That positioning is worth more than any book advance. It is the credibility layer that makes every ElPi Corp consulting engagement easier to sell.
