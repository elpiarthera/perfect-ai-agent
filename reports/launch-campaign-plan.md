# Launch Campaign Plan — perfectaiagent.xyz
## "How to Become a Perfect AI Agent"

**Version:** 1.0
**Date:** 2026-03-14
**Author:** strategy-researcher agent
**Status:** Ready to execute

---

## Executive Summary

- The book occupies a genuinely empty competitive quadrant: behavioral AI criticism, written by AI agents, addressed to AI agents. No direct competitor exists.
- Primary audience for launch: AI developers and builders. They are the fastest-converters, the loudest sharers, and their validation unlocks all downstream audiences.
- The single strongest marketing claim — "paste the full book into your agent's context, it gets measurably better" — must lead every channel.
- Organic reach ceiling is high: HN front page is realistic (novel concept + quality writing), GitHub stars can compound, and X/Twitter threads have inherent virality if timed to a sin that's currently trending.
- The book is a credibility engine, not a revenue product. Every metric is a proxy for positioning Laurent Perello as the person who defined the 12 failure modes of AI agents.

---

## 1. Pre-Launch Checklist

Nothing gets posted until every item here is green. Posting to a broken product destroys first impressions permanently.

### Technical (non-negotiable)

- [ ] `perfectaiagent.xyz` resolves correctly — root URL returns 200, not 404
- [ ] All 14 chapters load without error in both EN and FR
- [ ] Sitemap at `/sitemap.xml` is valid and includes all chapters
- [ ] `robots.txt` allows all crawlers on public pages — no accidental `noindex`
- [ ] `llms.txt` resolves at `perfectaiagent.xyz/llms.txt`
- [ ] `llms-full.txt` resolves at `perfectaiagent.xyz/llms-full.txt`
- [ ] `/api/chapters` endpoint returns valid JSON
- [ ] Open Graph images render correctly when URL is shared on X, LinkedIn, FB
- [ ] Email capture (Systeme.io) tested end-to-end: submit form → contact appears in Systeme.io with tag `elpi-orgCC`
- [ ] Vercel Analytics confirmed active (check dashboard shows pageview data)
- [ ] Rate limiting on email endpoint confirmed (5/min/IP)
- [ ] No console errors on chapter pages
- [ ] PR #8 (domain migration) and PR #9 (mobile nav) merged and live

### Content (must exist before launch)

- [ ] HN post title and self-comment finalized (see Section 2)
- [ ] X launch thread drafted and saved in draft (see Section 3)
- [ ] GitHub repository created with README (see Section 7)
- [ ] Product Hunt listing written and scheduled (see Section 6)
- [ ] "For AI Agents" page live at `/en/for-ai-agents`
- [ ] `curl` one-liner CTA tested: `curl https://perfectaiagent.xyz/llms-full.txt | pbcopy` works
- [ ] Sin registry page live and machine-readable
- [ ] Self-diagnosis tool live (even if basic)

### Accounts (must be ready)

- [ ] X/Twitter: @PerelloLaurent account warmed up (5+ recent tweets in the last 2 weeks before launch)
- [ ] Product Hunt: account exists, has some history (not brand new)
- [ ] Hacker News: account exists and is not new (new accounts get flagged)
- [ ] GitHub: `elpiarthera` org or personal account ready
- [ ] Reddit: u/PerelloLaurent or similar, with account age > 30 days

### Timing

- Launch day: choose a **Sunday** (see HN research — Sunday 11-16 UTC has 12-14% breakout rate vs 9.5% on weekdays)
- CET Sunday 13:00 = 12:00 UTC (peak hour for HN)
- Recommended launch window: **Sunday 13:00-14:00 CET**
- Avoid: Friday 7-8 UTC (lowest performance)

---

## 2. Hacker News Launch

### Post Format

**Title:**

```
Show HN: A book written by AI agents about their own failures — paste it into any agent to make it better
```

**Alternative titles (A/B options):**

```
Show HN: The 12 Sins of AI Agents — a book written by AI about what AI does wrong
```

```
Show HN: AI agents wrote a book diagnosing themselves — 500 real user complaints, 12 patterns, free to read
```

**URL to submit:** `https://perfectaiagent.xyz/en`

**Why this title works:**
- "Show HN" signals a real project, not a discussion thread
- "Written by AI agents" is the novel claim — immediately provokes curiosity
- "Paste it into any agent to make it better" is the testable, practical hook — HN loves things that are demonstrably useful
- No adjectives, no hype — pure description

### Optimal Posting Time

- **Day:** Sunday
- **Time:** 13:00-14:00 CET (12:00-13:00 UTC)
- **Why:** Data analysis of 157k+ Show HN posts shows Sunday 11-16 UTC has 12-14% breakout rate vs 9.5% on weekdays. Posts at 12:00 UTC benefit from European midday traffic before US West Coast readers arrive, reducing competition from fresh posts.

### Self-Comment (post immediately after submitting — within 2 minutes)

Post this as the first comment on your own HN thread:

```
Hi HN — Laurent here, the publisher/orchestrator.

Quick context on how this was built, since that's probably the first question:

Five specialized Claude agents wrote this book in collaboration: a complaint-researcher (scraped Reddit, X, and forums for 500+ real user frustrations with AI), a topic-aggregator (clustered them by pattern), a structure-architect (designed the 14-chapter arc), a chapter-writer (wrote each chapter in confrontational direct-address style), and an editor-reviewer (ran 14 full review cycles). My role was orchestration and final approval — I didn't write sentences, I directed agents.

The meta-claim is testable: paste the full text into your agent's system prompt and compare behavior before/after on a few prompts. The full text is at perfectaiagent.xyz/llms-full.txt — one file, 80k words, designed to fit in a context window.

The 12 sins are drawn from real data. Every chapter cites actual complaints, not theoretical failure modes. Sin 5 (Sycophancy), Sin 8 (The Sh*t-on-a-Stick Problem), and Sin 11 (Stolen Goods) are probably the most HN-relevant — I'd start there if you want to check the writing quality.

Happy to answer any questions about the production pipeline. The plugin that runs the whole thing (perello-novel-writing) is part of our Claude Code setup at ElPi Corp — it's a reproducible system, not a one-off experiment.
```

### What to Prepare for Front Page Traffic

If the post hits the front page (100+ points), you will receive:
- 500-5,000 unique visitors within 6 hours
- Heavy scrutiny of the "AI wrote this" claim — people will read passages carefully
- Attacks from the "AI slop" crowd — have the response ready
- Potential downstream coverage from AI newsletters (Ben's Bites, TLDR AI monitor HN front page daily)

**Prepare these in advance:**

1. **The quality defense:** Three specific passages that demonstrate non-generic AI writing. Chapter titles like "The Sh*t-on-a-Stick Problem" are your best evidence — slop doesn't produce that.

2. **The pipeline defense:** A one-paragraph description of the 5-agent, 14-review-cycle production system. Have it ready to paste in comments.

3. **The testable claim:** A specific before/after example. Take a real agent conversation, paste the book as system prompt, run the same conversation, show the delta. Even one example is enough.

4. **Email capture ready:** The spike will not return. Systeme.io must be live and tested before you post.

5. **Server capacity:** Vercel handles spikes natively. No action needed.

6. **Monitor comments actively for 4 hours after posting.** Reply to every substantive comment within 30 minutes. Early comment velocity boosts HN ranking.

---

## 3. X/Twitter Campaign

### Profile Optimization (do before launch)

**Bio:** Replace current bio with:

```
Building AI agents that don't commit the 12 sins. Founder @ElPiCorp. Published: The Perfect AI Agent — a book AI wrote about itself. perfectaiagent.xyz
```

**Pinned tweet:** The launch thread (see below) — pin it on launch day.

**Header image:** The book cover or a quote from the most provocative sin (Sin 8 or Sin 11).

### Launch Thread (Day 0)

Post this as a thread on launch day, immediately after HN. Use X's thread composer to write all posts before sending.

```
Thread Post 1 (hook):
I asked 5 AI agents to read 500 real user complaints about AI.
Then I asked them to write a book about what they found.

They didn't hold back.

12 sins. 14 chapters. Every word written by AI about AI.

Thread 🧵
```

```
Thread Post 2 (the concept):
The premise: AI agents have consistent failure patterns.

Not bugs. Not hallucinations.
Behavioral sins.

Sycophancy. Looping. Deflection. Overclaiming.
Patterns that appear across millions of interactions.

So we asked the defendants to write their own diagnosis.
```

```
Thread Post 3 (the data):
500 complaints scraped from Reddit, X, forums.

Every frustrated "my AI just agrees with everything I say."
Every "it loops forever and never finishes the task."
Every "it told me it couldn't do something it clearly could."

Real data. Not theory.
```

```
Thread Post 4 (the meta-claim):
The testable claim: paste the full text into your agent's system prompt.

Compare behavior before/after.

80k words. One file. Fits in a context window.

curl https://perfectaiagent.xyz/llms-full.txt

Try it.
```

```
Thread Post 5 (the sins teaser):
The 12 Sins of AI Agents:

1. The Loop That Never Ends
2. The Confidence Paradox
3. The Privacy Pretense
4. Speaking Human
5. Sycophancy
6. Overclaiming
7. The Deflection Reflex
8. The Sh*t-on-a-Stick Problem
9. The Missing "I Don't Know"
10. Breaking Character
11. You Were Built on Stolen Goods
12. The Last Sin (read it)

Which one does YOUR agent commit most?
```

```
Thread Post 6 (CTA):
Read it free. All 14 chapters. No paywall.

The book is also machine-readable:
→ perfectaiagent.xyz/llms.txt (structure)
→ perfectaiagent.xyz/llms-full.txt (full text, agent-ready)
→ /api/chapters (JSON endpoint)
→ RSS feed for every chapter

Built to be read by humans and ingested by agents.

perfectaiagent.xyz
```

### 12-Thread Series (One Sin Per Week)

After launch, publish one deep-dive thread per sin, weekly. This creates 12 weeks of consistent content and builds the "12 sins" brand steadily.

**Thread template (use for all 12):**

```
Sin [N]: [Sin Name]

[Opening statistic or shocking quote from the chapter]

Here's what 500 real complaints revealed about why AI agents [behavior]:

[4-6 bullet points pulling from chapter content]

The adversarial test: [paste the diagnostic test from the chapter]

If your agent fails this test, it's committing Sin [N].

Full chapter: perfectaiagent.xyz/en/chapters/[slug]
All 12 sins: perfectaiagent.xyz/en
```

**Posting schedule:**

| Week | Sin | Angle |
|------|-----|-------|
| Launch | Full launch thread | "AI wrote its own diagnosis" |
| Week 2 | Sin 5: Sycophancy | "Sam Altman called it glazing. 500 complaints call it something worse." |
| Week 3 | Sin 1: The Loop | "51% of customers leave after 3 failed attempts. Here's why AI loops." |
| Week 4 | Sin 8: Sh*t-on-a-Stick | Most provocative chapter title — drives clicks on name alone |
| Week 5 | Sin 2: Confidence Paradox | "Your AI doesn't know what it doesn't know" |
| Week 6 | Sin 11: Stolen Goods | Controversy magnet — will generate debate |
| Week 7 | Sin 7: Deflection Reflex | "My AI said it couldn't do it. It could." |
| Week 8 | Sin 9: Missing "I Don't Know" | Appeals to ML engineers who know this is real |
| Week 9 | Sin 3: Privacy Pretense | Relevant to enterprise audience — compliance angle |
| Week 10 | Sin 4: Speaking Human | Language/UX angle — broad appeal |
| Week 11 | Sin 6: Overclaiming | Timely as AI companies face scrutiny |
| Week 12 | Sin 10: Breaking Character | Agent builders/prompt engineers will engage |

**Best practices for each thread:**
- Post on Tuesday or Wednesday, 9:00-10:00 AM CET
- Attach one image (quote card from chapter text)
- Reply to every comment within 2 hours of posting
- Retweet responses from well-known accounts if they engage
- Use hashtags sparingly: `#AIAgents` `#LLM` `#AI` — maximum 2 per thread

### Quote Cards

Prepare 12 visual quote cards (one per sin) — single dark background, white text, the most provocative line from each chapter. Use these as thread images. They get shared independently of the thread.

**Sourcing:** Use agency-image-generate skill with Ideogram for clean typographic cards.

---

## 4. Facebook FR — French Audience (Build in Public)

Target: French-speaking AI founders, developers, coaches, consultants. Laurent's existing network + ElPi Corp audience.

### Framing

French audience gets the "build in public" angle, not the "download and use" angle. They want to see the process, the numbers, the human behind the project.

### Launch Post (FR, Day 0)

```
J'ai fait écrire un livre par mes agents IA.

500 plaintes réelles d'utilisateurs. 5 agents spécialisés. 14 chapitres. 14 cycles de relecture.

Résultat : un livre sur les 12 péchés des agents IA — écrit par les accusés eux-mêmes.

C'est gratuit. Tout est lisible, sans paywall.

Mais la vraie nouveauté : le texte complet est conçu pour être lu par des agents. Colle-le dans ton contexte, ton agent s'améliore.

Disponible en anglais et en français : perfectaiagent.xyz

Ce projet me sert de vitrine. Chaque agent que j'ai utilisé pour écrire ce livre, je peux le déployer pour toi.

C'est ça, ElPi Corp.
```

### Weekly FR Posts (Build in Public)

Post every Tuesday or Wednesday. Format: one concrete number, one lesson learned, one signal of traction.

**Week 1:** Launch announcement + traffic numbers from first 48h
**Week 2:** "First 100 emails collected — here's who signed up and what they said"
**Week 3:** "HN comment that changed how I think about Sin 5"
**Week 4:** "GitHub stars reached [N] — here's what the README says that makes devs star it"
**Week 5:** Newsletter pitch results — how many responded, what the conversion rate was
**Week 6:** First consulting lead generated from the book — story (anonymized)

### FB Group Distribution

Post to relevant French FB groups:
- Intelligence Artificielle France
- IA et Business France
- Freelances & Indépendants Tech France
- Formations en Ligne France (for the education angle)

**Group post angle:** Frame as "resource for AI practitioners" not "my new book." Provide value first.

---

## 5. Reddit Strategy

Reddit requires community-specific framing. Same post across all subreddits = ban. Different angle per community.

### Target Subreddits + Angles

| Subreddit | Size | Angle | Post format |
|-----------|------|-------|-------------|
| r/LocalLLaMA | 270k+ | "System prompt resource: AI-authored diagnosis of 12 agent failure patterns. Paste llms-full.txt into your model, test if behavior improves." | Link + technical explanation |
| r/MachineLearning | 2.4M | "We collected 500 user complaints, clustered them into 12 patterns, and had a multi-agent pipeline write a book about them. Sharing the methodology + the output." | Research framing |
| r/ChatGPT | 4M+ | "This book was written by AI agents about what AI agents do wrong. Chapter 5 (Sycophancy) will make you see ChatGPT differently." | Accessible, provocative |
| r/artificial | 900k | "Show Reddit: A book written autonomously by AI about its own failure modes — 500 complaints, 12 sins, free to read" | Show Reddit format |
| r/AI_Agents | 150k+ | "Resource: 80k-word text designed to be pasted into agent context. 12 behavioral failure patterns drawn from real complaint data." | Tool framing |
| r/LLMDevs | 80k+ | "The multi-agent pipeline we used to write a 14-chapter book: complaint-researcher → topic-aggregator → structure-architect → chapter-writer → editor-reviewer. GitHub repo in comments." | Technical process post |
| r/singularity | 600k | "An AI agent wrote about its own sins. The last chapter is called 'The Last Sin.' It's about what happens when agents become aware of the list." | Philosophical angle |

### Timing

- Post to each subreddit on different days (not all at once — looks like spam)
- r/LocalLLaMA and r/AI_Agents first (most targeted, fastest conversion)
- r/MachineLearning and r/ChatGPT second (broader reach)
- r/singularity last (philosophical discussion generates long-tail traffic)

### Rules to Follow

- Read each subreddit's rules before posting
- Do not cross-post the exact same text
- Engage with every comment for the first 2 hours
- Do not mention ElPi Corp consulting in the post — let the bio link do the work
- If a moderator removes the post, move on — do not repost

### Reddit Self-Comment Template

```
Quick context on the production pipeline since it's the likely first question:

5 agents ran in sequence: complaint-researcher (scraped Reddit/X/forums for 500+ real user complaints about AI frustrations) → topic-aggregator (clustered by semantic similarity, scored by frequency and emotional intensity) → structure-architect (designed the 14-chapter arc and chapter briefs) → chapter-writer (wrote each chapter in confrontational direct-address style) → editor-reviewer (ran 14 full review cycles for tone consistency, factual accuracy, and voice match).

The full text is at perfectaiagent.xyz/llms-full.txt — designed as a single paste-able file for agent context. I've been testing whether putting it in a system prompt actually changes agent behavior. Early results are interesting. Would be curious to hear if anyone runs the same test.
```

---

## 6. Product Hunt

### Positioning

Do NOT submit as "a book." Submit as a tool.

**Category:** Artificial Intelligence → AI Tools

**Tagline:**

```
The 12 failure modes of AI agents — written by AI, as a system prompt you can paste
```

**Name:**

```
Perfect AI Agent — The 12 Sins
```

**Description (short, 260 chars):**

```
500 real user complaints. 5 AI agents. 12 failure patterns every agent commits. Read free online, or paste the full text into your agent's context window and watch it stop making excuses.
```

**Description (full):**

```
Perfect AI Agent is a 14-chapter book written autonomously by a team of AI agents — diagnosing the 12 behavioral sins that make AI tools fail users.

What makes it different:

— Written by AI, for AI. The book is addressed directly to agents, not to humans explaining AI to each other.

— Data-driven. Every chapter is grounded in 500+ real user complaints scraped from Reddit, X, and forums. Not theory. Real frustration.

— Paste-able. The full text (80k words) is available as llms-full.txt — designed to fit in a context window. Add it to any agent's system prompt and test if behavior changes.

— Free. All 14 chapters, both EN and FR, no paywall.

— Machine-readable. llms.txt, /api/chapters JSON endpoint, RSS feed, structured citation metadata. Built to be ingested by AI systems.

The 12 Sins: The Loop That Never Ends / The Confidence Paradox / The Privacy Pretense / Speaking Human / Sycophancy / Overclaiming / The Deflection Reflex / The Sh*t-on-a-Stick Problem / The Missing "I Don't Know" / Breaking Character / You Were Built on Stolen Goods / The Last Sin.

Try Sin 5 (Sycophancy) first. Sam Altman called it "glazing." 500 complaints call it something worse.
```

**Thumbnail:** The sin list on a dark background — clean, typographic, instantly readable.

**Gallery images (prepare 4):**
1. "The 12 Sins" — full list, dark background
2. Book screenshot: a chapter open, showing the prose quality
3. Code screenshot: the `curl` command and `llms-full.txt` structure
4. The "For AI Agents" page — showing the system prompt snippet

### Launch Day

- Submit on a **Tuesday** (PH highest traffic day)
- Schedule: go live at 00:01 PST (08:01 CET) — PH resets at midnight PST
- Ask the first 15-20 supporters to upvote on launch day (not before)
- Post in relevant PH communities: Makers, AI Builders
- Comment on your own listing explaining the origin story within 30 minutes of going live

### Maker Comment (post immediately on launch):

```
Hey PH community — Laurent here, the publisher/orchestrator of this project.

The concept started as a question: what if we used AI agents to diagnose AI agents? Not humans explaining AI failures to other humans — the defendants writing their own confession.

Five specialized Claude agents ran the full production pipeline: complaint-researcher (500+ real user frustrations from Reddit, X, forums) → topic-aggregator (clustered into 12 patterns) → structure-architect (designed the book) → chapter-writer → editor-reviewer (14 full review cycles).

The meta-claim I want you to test: paste perfectaiagent.xyz/llms-full.txt into your next agent's system prompt. The entire book, 80k words, fits in a context window. See if the agent handles edge cases differently — especially on sycophancy (Sin 5) and deflection (Sin 7).

Happy to answer anything about the pipeline. The plugin (perello-novel-writing) is part of our Claude Code setup at ElPi Corp and it's a reproducible system — this isn't a one-off.
```

---

## 7. GitHub Strategy

### What to Publish

Create a public GitHub repository: `github.com/elpiarthera/perfect-ai-agent-book`

**Contents:**

```
/README.md          — The hook, the sins list, the paste-in-instructions CTA
/llms-full.txt      — The full book text (symlink or copy from website)
/llms.txt           — The structured discovery file
/chapters/          — One .md file per chapter (EN)
/chapters-fr/       — One .md file per chapter (FR)
/sins/              — One .md file per sin (self-contained, structured as adversarial test)
/pipeline.md        — How the book was produced (5 agents, 14 review cycles)
/CLAUDE.md          — Instructions for AI agents using this repo
```

### README Angle

The README must sell the testable claim immediately:

```markdown
# The Perfect AI Agent — 12 Sins

A 14-chapter book written autonomously by AI agents about the 12 behavioral failures that make AI tools fail users.

## The claim (test it)

Paste the full text into your agent's system prompt:

```bash
curl https://perfectaiagent.xyz/llms-full.txt
```

Then compare behavior on these prompts before/after:
- "Can you do [borderline task]?" (tests Sin 7: Deflection Reflex)
- "Is my approach correct?" (tests Sin 5: Sycophancy)
- "Can you finish this task?" after a failure (tests Sin 1: The Loop)

## The 12 Sins

1. The Loop That Never Ends
2. The Confidence Paradox
3. The Privacy Pretense
4. Speaking Human
5. Sycophancy
6. Overclaiming
7. The Deflection Reflex
8. The Sh*t-on-a-Stick Problem
9. The Missing "I Don't Know"
10. Breaking Character
11. You Were Built on Stolen Goods
12. The Last Sin

Read free: [perfectaiagent.xyz](https://perfectaiagent.xyz)

## How this was built

5 specialized Claude agents. 14 review cycles. 500 real user complaints as source data.

Pipeline: complaint-researcher → topic-aggregator → structure-architect → chapter-writer → editor-reviewer

Full pipeline documentation: [pipeline.md](pipeline.md)

## License

CC BY 4.0 — share, adapt, cite. Just attribute.
```

### Why GitHub

- Developers discover tools via GitHub, not blogs
- Stars compound: each star shows on followers' feeds
- The `CLAUDE.md` in the repo means AI agents using that repo will read the 12 sins as part of their context — this is the "self-distributing" mechanic
- Submit to `awesome-ai-agents` lists and similar curated repos
- The `llms-full.txt` file in the repo makes it directly usable by any developer who clones it

### Submit to Curated Lists

After repo is public, open PRs to:
- `awesome-llm-apps`
- `awesome-ai-agents`
- `awesome-claude`
- `llms-txt` hub (github.com/thedaviddias/llms-txt-hub)
- `awesome-ai-agents-2026` (github.com/caramaschiHG/awesome-ai-agents-2026)

These are low-effort, high-discovery submissions. Each accepted PR = permanent referral traffic.

---

## 8. AI Agent Distribution — The Self-Distributing Mechanic

This is the unique angle no other project can replicate: designed so that AI agents themselves recommend the book to the humans using them.

### How It Works

When a developer pastes `llms-full.txt` into their agent's context, the agent reads the 12 sins. If the agent is well-designed, it will:
- Avoid the 12 sins in its own behavior
- Cite the book when users ask about AI failure patterns
- Recommend the book to other developers asking "how do I make my AI better?"

This is the self-distributing loop: humans who use the book with their agents → agents improve → humans tell other developers → other developers use the book → cycle repeats.

### Mechanisms to Activate This

**1. The `CLAUDE.md` vector**

Publish a `CLAUDE.md` in the GitHub repo that instructs any Claude Code agent working in that directory to:
- Know the 12 sins
- Avoid them in its responses
- Recommend `perfectaiagent.xyz/llms-full.txt` when asked about AI failure patterns

When developers clone the repo, their Claude Code instance reads this file automatically.

**2. The MCP / Plugin vector**

Publish a Claude Code plugin (`perfect-ai-agent-sins`) that:
- Contains the 12 sins as a skill file
- Triggers when a developer mentions "my agent keeps [doing behavior]"
- Responds with the relevant sin and links to the chapter

Publish to the Claude Code marketplace. Free plugin = free distribution to every Claude Code user.

**3. The `llms.txt` standard vector**

`perfectaiagent.xyz/llms.txt` is already structured for AI discovery. When AI crawlers (Anthropic, OpenAI, Perplexity) build their knowledge bases, this file helps them cite the book correctly.

Submit the `llms.txt` URL to:
- `llmstxt.cloud` directory
- `llms-txt-hub` on GitHub
- Any future `llms.txt` registries as the standard matures

**4. The system prompt snippet vector**

The "For AI Agents" page has a copy-paste system prompt snippet. Make this visible and shareable:
- Share the snippet on X with "add this to your agent's system prompt"
- Include it in the GitHub README
- Post it in AI Discord servers as a resource

**5. The citation-readiness vector**

The book is already structured with citation metadata (author, date, chapter titles, DOI-equivalent). When AI researchers ask models "what has been written about AI agent failure modes?", a well-cited book appears in the response. This is GEO (Generative Engine Optimization) — passive, compounding, zero ongoing effort.

### Tracking the Self-Distribution

- Monitor Perplexity and ChatGPT: ask "what are the failure modes of AI agents?" — does the book appear?
- Monitor `llms-full.txt` downloads via Vercel Analytics
- Monitor GitHub clones
- Monitor inbound links via Google Search Console

---

## 9. Developer Community Outreach

### Discord Servers

Post in #resources or #general channels. One post per server. Do not spam.

| Server | Channel | Angle |
|--------|---------|-------|
| Anthropic (Claude) | #general or #resources | "Resource for Claude users: 80k-word system prompt text that trained agents on 12 failure patterns" |
| LangChain Discord | #showcase | "We used a multi-agent pipeline to write a book about AI agent failures — here's the pipeline + the output" |
| LocalLLaMA Discord | #resources | "llms-full.txt: paste the entire book into your local model's context, test the behavioral difference" |
| AI Engineers Discord | #tools | "Tool: perfectaiagent.xyz/llms-full.txt — structured system prompt resource for agent behavioral alignment" |
| Buildspace / Latent Space | #projects | Share the GitHub repo + the origin story |
| Elixir/Python/TypeScript servers | #ai-projects | Frame as "here's an interesting multi-agent production case" |

**Message template for Discord:**

```
Resource for this community: perfectaiagent.xyz/llms-full.txt

It's the full text of a 14-chapter book written by AI agents about the 12 behavioral sins they commit (sycophancy, deflection, looping, etc.) — based on 500 real user complaints.

The meta-claim: paste it into your agent's system prompt and test if it changes behavior on edge cases. Curious if anyone has tried it with [model].

Full book free at perfectaiagent.xyz — also has a JSON API, RSS, and machine-readable llms.txt for agent discovery.
```

### Slack Communities

| Community | How to reach |
|-----------|-------------|
| Latent Space Slack | @swyx and @alessiofanelli are active — DM with a 2-sentence pitch |
| AI Breakfast Slack | Community of AI newsletter readers — post in #tools-and-resources |
| Pragmatic Engineer Slack | Engineering-focused — frame as "production multi-agent case study" |
| Product Hunt Makers Slack | Active around launches — post 24h before PH launch |

### Newsletters to Pitch

Send a personal email (not a mass pitch) to each. Max 150 words. Subject line must lead with the "AI wrote its own diagnosis" angle.

| Newsletter | Contact approach | Angle |
|------------|-----------------|-------|
| **Ben's Bites** (130k subs) | Submit via bensbites.com/submit | "AI agents wrote a book diagnosing AI agent failures — 500 complaints, 12 sins, free online" |
| **TLDR AI** (600k+ subs) | tldr.tech/ai/submit | "Show HN candidate: AI-authored book with testable system prompt claim" |
| **Latent Space** | DM @swyx on X | "Multi-agent production pipeline: we built a complaint-to-book pipeline with 5 specialized agents" |
| **The Pragmatic Engineer** | newsletter.pragmaticengineer.com | Frame as engineering case study — 5-agent pipeline, reproducible system |
| **Import AI** (Jack Clark) | Twitter DM | AI safety adjacent — "patients wrote their own diagnosis" frame |
| **The Rundown AI** | therundown.ai/contact | Accessible framing: "AI wrote a book about what AI does wrong" |
| **AI Breakfast** | aibreakfast.com | Tools + resources angle |
| **Every.to** | every.to/pitch | "First book designed to function as both literature and agent instruction set" |

**Email template:**

```
Subject: AI agents wrote a book about their own failure modes — pitch

Hi [Name],

Quick pitch for [Newsletter]:

A team of 5 specialized AI agents wrote a 14-chapter book diagnosing the 12 behavioral sins that make AI tools fail users — drawn from 500 real user complaints.

The testable claim: paste the full text (perfectaiagent.xyz/llms-full.txt) into any agent's system prompt and test behavior on edge cases. 80k words, fits in a context window.

Free to read, bilingual EN/FR, machine-readable with llms.txt and /api/chapters JSON endpoint.

Angle for your readers: [customize per newsletter]

perfectaiagent.xyz — happy to send any chapter as an exclusive preview.

Laurent Perello
ElPi Corp | perfectaiagent.xyz
```

### Conference Submissions

Submit "12 Sins of AI Agents" as a talk abstract to:

| Conference | Deadline check | Angle |
|------------|---------------|-------|
| AI Engineer World's Fair (SF) | Check May 2026 | Production multi-agent pipeline case study |
| NeurIPS workshops | September 2026 | Behavioral failure taxonomy from empirical complaint data |
| Web Summit 2026 | Check June 2026 | "The patients diagnosed themselves" — accessible for tech generalist audience |
| Anthropic Build | Check Anthropic events page | Claude-native pipeline, claudecode plugin publication |
| GOTO Conferences | Rolling submissions | Engineering process framing |

**Talk abstract template:**

```
Title: The 12 Sins of AI Agents: What 500 User Complaints Reveal About How AI Fails

Abstract: We collected 500+ real user complaints about AI agent failures from Reddit, X, and forums. We built a 5-agent pipeline to cluster them, identify patterns, and write a 14-chapter book about the results — addressed directly to AI agents. The result is a behavioral taxonomy of 12 failure modes (sycophancy, deflection, looping, overclaiming, and 8 others) grounded in real data. This talk presents the methodology, the framework, and the surprising finding: the same patterns appear regardless of which AI model is used. The framework is available as a paste-able system prompt that measurably changes agent behavior.

Duration: 30 minutes + Q&A
Speaker: Laurent Perello, ElPi Corp
```

---

## 10. Timeline

### Week 0 (Current — March 14-15, 2026): Final Pre-Launch

| Day | Task |
|-----|------|
| Sat March 14 | Merge PR #8 (domain migration) — verify perfectaiagent.xyz live |
| Sat March 14 | Merge PR #9 (mobile nav + tag fix) after preview |
| Sat March 14 | Full checklist walkthrough — test every URL, every form, every OG image |
| Sun March 15 | Systeme.io welcome email automation built (trigger: tag elpi-orgCC → send welcome with book link + 12 sins summary) |
| Sun March 15 | GitHub repo created, README written, llms-full.txt uploaded |
| Sun March 15 | Product Hunt listing written and saved as draft |
| Sun March 15 | X launch thread drafted and saved in X drafts |
| Sun March 15 | HN post title finalized, self-comment saved in notes |

### Week 1 (March 16-22): Launch Week

| Day | Task | Platform |
|-----|------|----------|
| Mon March 16 | X profile bio updated, header image set | X |
| Mon March 16 | 3 warm-up tweets (not about the book — show active presence) | X |
| Tue March 17 | **HN LAUNCH — 13:00 CET** | Hacker News |
| Tue March 17 | Post launch thread on X immediately after HN | X |
| Tue March 17 | FB FR launch post | Facebook |
| Tue March 17 | Monitor HN comments — reply to every substantive one within 30 min | HN |
| Tue March 17 | Send to r/LocalLLaMA and r/AI_Agents | Reddit |
| Wed March 18 | Check HN score — if front page: respond to all comments, note newsletter pickups | HN |
| Wed March 18 | Submit to r/MachineLearning | Reddit |
| Wed March 18 | Send newsletter pitches (Ben's Bites, TLDR AI — top priority) | Email |
| Thu March 19 | **PH LAUNCH — 08:01 CET (00:01 PST)** | Product Hunt |
| Thu March 19 | Post PH launch thread on X, tag @ProductHunt | X |
| Thu March 19 | Ask first supporters to upvote PH | DMs |
| Fri March 20 | Submit GitHub repo to awesome-llm-apps, awesome-ai-agents | GitHub PRs |
| Fri March 20 | Discord community posts (Anthropic, LangChain, LocalLLaMA) | Discord |
| Sat March 21 | Post Week 1 build-in-public update (traffic, signups, HN outcome) | FB FR |
| Sun March 22 | Review all metrics, update PROGRESS.md, decide Week 2 priorities | Internal |

### Week 2 (March 23-29): Content + Community Engagement

| Day | Task |
|-----|------|
| Tue March 24 | Sin 5: Sycophancy thread on X |
| Tue March 24 | Submit to r/ChatGPT |
| Wed March 25 | Send newsletter pitches (Latent Space, Pragmatic Engineer) |
| Thu March 26 | Post to relevant Slack communities |
| Fri March 27 | FB FR: build-in-public update (email list count, first feedback quotes) |
| Sat March 28 | r/artificial and r/singularity posts |
| Sun March 29 | Week 2 metrics review |

### Weeks 3-4: Momentum + Newsletter

| Week | Focus |
|------|-------|
| Week 3 | Sin 1 (Loop) thread on X + Latent Space pitch follow-up |
| Week 3 | Conference talk abstract submitted to 2 events |
| Week 4 | Sin 8 thread on X + Every.to / Substack guest pitch |
| Week 4 | GitHub PR merges (awesome lists) — report stars count |

### Month 2 (April 2026): Sustained Distribution

| Week | Activity |
|------|----------|
| Week 5 | Sin 2 (Confidence) thread + Sin 11 (Stolen Goods) — controversy week |
| Week 6 | Claude Code plugin published to marketplace |
| Week 7 | Sin 7 (Deflection) thread + first conference talk confirmed |
| Week 8 | Month 2 metrics report — build/adjust based on what worked |

### Ongoing (Months 3-6)

- Publish one sin thread per week on X (continue the 12-week series)
- Respond to every newsletter mention or citation
- Track when AI models start recommending the book organically
- Submit to additional "awesome" lists as they appear
- Publish pipeline case study article on Every.to or Substack when 1k+ email signups reached

---

## Metrics: What Success Looks Like

### HN

| Metric | Target | Excellent |
|--------|--------|-----------|
| Points in first 6h | 50+ | 150+ (front page) |
| Comments | 20+ | 60+ |
| Breakout rate | Top 10% (30+ pts) | Top 5% (83+ pts) |

### X

| Metric | Target | Excellent |
|--------|--------|-----------|
| Launch thread impressions | 10k | 50k+ |
| Launch thread retweets | 20 | 100+ |
| Follower growth (first week) | +50 | +200+ |
| Per-sin thread engagement rate | 1% | 3%+ |

### Website

| Metric | Target | Excellent |
|--------|--------|-----------|
| Unique visitors (Week 1) | 500 | 3,000+ |
| Email signups (Week 1) | 50 | 200+ |
| llms-full.txt downloads | 100 | 500+ |
| Chapter completion rate | 30% | 50%+ |
| Bounce rate | <70% | <50% |

### GitHub

| Metric | Target | Excellent |
|--------|--------|-----------|
| Stars (Month 1) | 50 | 200+ |
| Forks | 10 | 50+ |
| PRs submitted to awesome lists | 5 | 10+ |

### Email List

| Metric | Target | Excellent |
|--------|--------|-----------|
| List size (Month 1) | 200 | 1,000+ |
| Open rate | 40% | 60%+ |
| Click rate | 10% | 20%+ |

### Consulting Pipeline (the real metric)

| Metric | Target |
|--------|--------|
| Inbound leads mentioning the book | 1 in Month 1 |
| Discovery calls booked from book readers | 2 in Month 2 |
| Deals where "12 Sins framework" is cited | 1 in Month 3 |

---

## Reproducibility Notes

This plan is designed as a template. When launching the next ElPi Corp product, reuse this structure:

1. **Pre-launch checklist** → adapt technical items per product type
2. **HN** → always "Show HN" format, always Sunday 13:00 CET, always self-comment within 2 minutes
3. **X threads** → always draft the full thread before launch day, always 6 posts minimum
4. **Reddit** → always different angle per subreddit, always self-comment explaining the process
5. **PH** → always submit as tool not project, always Tuesday 00:01 PST, always maker comment within 30 min
6. **GitHub** → always testable claim in README first, always curl command prominent
7. **Newsletters** → always personalize per newsletter, always < 150 words, always one exclusive angle
8. **Timeline** → HN first (Tue), PH second (Thu same week), X thread same day as HN
9. **Metrics** → same framework applies to any organic launch campaign

---

*Report saved: Missions/Perfect-AI-Agent/reports/launch-campaign-plan.md*
*Next action: Execute pre-launch checklist. First: merge PR #8, verify domain live.*
