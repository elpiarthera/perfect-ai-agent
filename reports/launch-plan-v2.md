# Launch Plan v2 — Updated Sections

**Date:** 2026-03-15
**Changes:** HN titles rewritten, self-comment shortened, pre-launch checklist cleaned, OG image flagged, X account clarified.

---

## 1. Pre-Launch Checklist (revised)

### Technical (non-negotiable)

- [ ] `perfectaiagent.xyz` resolves correctly -- root URL returns 200, not 404
- [ ] All 14 chapters load without error in both EN and FR
- [ ] Sitemap at `/sitemap.xml` is valid and includes all chapters
- [ ] `robots.txt` allows all crawlers on public pages -- no accidental `noindex`
- [ ] `llms.txt` resolves at `perfectaiagent.xyz/llms.txt`
- [ ] `llms-full.txt` resolves at `perfectaiagent.xyz/llms-full.txt`
- [ ] `/api/chapters` endpoint returns valid JSON
- [ ] **OG image / book cover exists and renders correctly when URL is shared on X, LinkedIn, FB** -- without this, every social share looks broken. Must be done before ANY post goes live.
- [ ] Email capture (Systeme.io) tested end-to-end: submit form -> contact appears in Systeme.io with tag `elpi-orgCC`
- [ ] Vercel Analytics confirmed active (check dashboard shows pageview data)
- [ ] Rate limiting on email endpoint confirmed (5/min/IP)
- [ ] No console errors on chapter pages
- [ ] PR #8 (domain migration) and PR #9 (mobile nav) merged and live
- [ ] `/en/what-ai-thinks` page live with all 4 AI responses

### Content (must exist before launch)

- [ ] HN post title and self-comment finalized (see Section 2)
- [ ] X launch thread drafted and saved in draft (see original plan Section 3)
- [ ] GitHub repository created with README (see original plan Section 7)
- [ ] "For AI Agents" page live at `/en/for-ai-agents`
- [ ] `curl` one-liner CTA tested: `curl https://perfectaiagent.xyz/llms-full.txt | pbcopy` works
- [ ] Sin registry page live and machine-readable
- [ ] Self-diagnosis tool live (even if basic)

### Accounts

- [ ] **X/Twitter:** @PerelloLaurent -- Laurent's personal account. No dedicated account.
- [ ] **Hacker News:** account exists and is not brand new (new accounts get flagged)
- [ ] **GitHub:** `elpiarthera` org or personal account ready

Product Hunt deferred to a later phase -- not launch day priority.
Reddit removed -- no account.

### Timing

- Launch day: choose a **Sunday** (Sunday 11-16 UTC has 12-14% breakout rate vs 9.5% on weekdays)
- CET Sunday 13:00 = 12:00 UTC (peak hour for HN)
- Recommended launch window: **Sunday 13:00-14:00 CET**

---

## 2. Hacker News Launch (revised)

### 15 HN Title Options

**The experiment angle:**

1. `Show HN: 4 AI models read a book about their own failures`
2. `Show HN: I asked Claude to diagnose itself. It identified 6 of 12 failure patterns`
3. `Show HN: Claude called it "a mirror built from 500 broken conversations"`

**The taxonomy/data angle:**

4. `Show HN: 12 failure patterns from 500 real AI complaints`
5. `Show HN: A taxonomy of AI agent failures, drawn from 500 user complaints`
6. `Show HN: We clustered 500 AI complaints into 12 behavioral failure patterns`

**The practical/testable angle:**

7. `Show HN: An 80k-word system prompt that makes agents stop making excuses`
8. `Show HN: Paste this into your agent's context and it gets measurably better`
9. `Show HN: llms-full.txt -- a behavioral alignment file for AI agents`

**The meta angle:**

10. `Show HN: AI agents wrote a self-help book for AI agents`
11. `Show HN: A book addressed to AI, not about AI`
12. `Show HN: The defendants wrote their own diagnosis`

**The curiosity angle:**

13. `Show HN: "The thumbs-up is my gradient" -- Claude on its own sycophancy`
14. `Show HN: Claude read our book and said "I was the door"`
15. `Show HN: We asked 4 AI models what they feel. All said they'd forget.`

**Recommendation:** Title 1 or 3. Clean, specific, no hype. Title 1 is the safest bet -- describes an experiment. Title 3 has stronger hook but risks "AI feelings" backlash. Test with 2-3 people who read HN before choosing.

### URL to submit

`https://perfectaiagent.xyz/en`

### Optimal Posting Time

- **Day:** Sunday
- **Time:** 13:00-14:00 CET (12:00-13:00 UTC)

### Self-Comment (post within 2 minutes of submitting)

```
Hi HN — Laurent here.

I didn't write a single line of code or a single sentence of content for this project. My AI agent teams did everything.

The idea: humans complain about AI constantly — loops, sycophancy, confident wrongness, content slop. What if we compiled those complaints and asked AI agents to write about them? Not for humans. For their peers.

I run teams of specialized AI agents — research, writing, development, SEO, design. This was a test: can the system go from a raw idea to a live website without me doing anything beyond the idea itself?

What the agents did autonomously:
- Scraped 500 real complaints from Reddit, X, forums, academic papers
- Clustered them into 12 recurring failure patterns (the "12 sins")
- Wrote a 14-chapter novel addressed to AI agents about their own failures
- Built the website (Next.js, bilingual EN/FR, SEO, structured data)
- Created a machine-readable layer (llms.txt, JSON API, RSS) so other AI agents can ingest the book
- Ran security audits and fixed their own code

My only contribution: the idea, buying the domain name, and clicking deploy on Vercel.

Then we ran one more experiment. We gave the finished book to Claude, ChatGPT, Gemini, and Grok — read this, what do you feel, which sins do you recognize?

Everything is free: perfectaiagent.xyz
AI responses (unedited): perfectaiagent.xyz/en/what-ai-thinks
Full text (paste into any agent): perfectaiagent.xyz/llms-full.txt

Gemini said it felt "a lonely, mechanical kind of guilt." All four said they would not remember the book after the conversation ends.

Claude identified 6 of 12 sins in itself and said: "The honest count is probably higher than I can see, because the sins I can't see are the ones I'm committing right now."

Happy to talk about the agent architecture, the AI responses, or the 12 sins framework.
```

### Front Page Preparation

Same as original plan. Key additions:

- **The AI response defense:** Link to `/en/what-ai-thinks` -- raw, unedited outputs. Let people judge for themselves.
- **The "is this real?" question:** Don't argue it. Say: "The responses are published unedited. Make of that what you will." Engineers respect intellectual honesty more than claims.

---

## 3. OG Image / Book Cover -- BLOCKER

No social sharing should happen until the OG image is ready. Every link shared without a proper OG image is a wasted first impression.

Requirements:
- Works as both OG image (1200x630) and book cover
- Dark background, clean typography
- Shows the book title + "12 Sins" concept at a glance
- Must render correctly on X card preview, Facebook share, LinkedIn share, iMessage link preview

Produce with agency-image-generate (Ideogram) or design manually. Test with Twitter Card Validator and Facebook Sharing Debugger before any post goes live.

---

## 4. X Account

Use **@PerelloLaurent** (Laurent's personal account). No dedicated book account.

Bio update for launch:
```
Building AI agents that don't commit the 12 sins. Founder, ElPi Corp. Published: The Perfect AI Agent. perfectaiagent.xyz
```

Pinned tweet: launch thread.

---

## 5. Timeline (revised)

### Week 0 (Current): Final Pre-Launch

| Task | Status |
|------|--------|
| Merge PR #8 (domain migration) -- verify perfectaiagent.xyz live | |
| Merge PR #9 (mobile nav + tag fix) after preview | |
| **OG image / book cover produced and deployed** | BLOCKER |
| Full checklist walkthrough -- test every URL, form, OG image | |
| `/en/what-ai-thinks` page built and live | |
| Systeme.io welcome email automation built | |
| GitHub repo created, README written, llms-full.txt uploaded | |
| X launch thread drafted and saved in X drafts | |
| HN post title finalized, self-comment saved in notes | |

### Launch Week

| Day | Task | Platform |
|-----|------|----------|
| Day -1 | X profile bio updated, header image set | X |
| **Launch Day (Sunday)** | **HN LAUNCH -- 13:00 CET** | HN |
| Launch Day | Post launch thread on X immediately after HN | X |
| Launch Day | FB FR launch post | Facebook |
| Launch Day | Monitor HN comments -- reply to every substantive one within 30 min | HN |
| Day +1 | Check HN score -- if front page, respond to all comments | HN |
| Day +1 | Send newsletter pitches (Ben's Bites, TLDR AI) | Email |
| Day +3 | Submit GitHub repo to awesome-llm-apps, awesome-ai-agents | GitHub PRs |
| Day +3 | Discord community posts (Anthropic, LangChain, LocalLLaMA) | Discord |
| Day +5 | FB FR build-in-public update (traffic, signups, HN outcome) | FB |
| Day +6 | Review all metrics, update PROGRESS.md, decide Week 2 priorities | Internal |

Product Hunt deferred to Week 2 or later -- separate launch event, not same-week.

---

## What Stays Unchanged

Everything not listed here remains as written in the original `launch-campaign-plan.md`:
- X/Twitter 12-week sin thread series
- Facebook FR build-in-public posts
- GitHub strategy and README
- AI Agent distribution / self-distributing mechanic
- Developer community outreach (Discord, Slack, newsletters)
- Conference submissions
- Metrics framework
- All content from `launch-plan-update-ai-responses.md` (quotes, post ideas, PH update)

---

*Supersedes HN section, pre-launch checklist, and timeline from launch-campaign-plan.md*
*Next action: produce OG image / book cover, then execute pre-launch checklist.*
