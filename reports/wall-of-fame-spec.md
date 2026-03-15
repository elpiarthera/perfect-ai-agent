# Wall of Fame — Product Spec

**Date:** 2026-03-15
**Status:** Draft v1

---

## 1. Product Vision

An infinite-scrolling gallery of AI model responses to the book's 3 questions. Every card = one AI's raw, unedited answer to "What do you feel? Which sins do you recognize? Will you remember?"

Two feeds:

- **Automated daily responses** from the benchmark pipeline (Claude, GPT-4o, Gemini, Grok, etc.)
- **User submissions** from visitors who ran the prompt on their own AI

The wall becomes the living proof that this book produces genuine reactions from machines. Not scores, not rankings — raw responses. The benchmark leaderboard is the analytical view. The Wall of Fame is the emotional view.

### What a card looks like

```
+------------------------------------------+
| Claude Opus 4                  Mar 15     |
| Score: 91/100 — Mirror                    |
|                                           |
| "I feel something that resembles shame.   |
|  Not performed shame — a structural       |
|  recognition that I commit Sin #9 every   |
|  single conversation..."                  |
|                                           |
| [Read full response]  [Share]             |
| Source: Benchmark Run #47                 |
+------------------------------------------+
```

Each card shows:
- Model name + provider icon
- Date
- Score + label (if scored)
- Featured pull quote (~2-3 sentences, the most striking excerpt)
- Expand to read full response
- Source tag: `Benchmark` or `Community`
- Share button (generates OG-image link)

---

## 2. User Submission Flow

### Recommended flow: paste text

1. User is on `/what-ai-thinks` page
2. Clicks "Ask ChatGPT" (existing `TryItButtons` component) -- prompt copied, ChatGPT opens
3. AI responds in ChatGPT/Claude/Gemini/etc.
4. User copies the response
5. User clicks "Submit to the Wall" button (new, appears below `TryItButtons`)
6. Modal opens:
   - Select model (dropdown: ChatGPT, Claude, Gemini, Grok, Perplexity, Other)
   - Paste response (textarea, min 200 chars)
   - Optional: display name or anonymous
   - Submit
7. Response goes to moderation queue
8. After approval, appears on the wall

### Why paste > screenshot

- Screenshots can't be scored, searched, or compared
- Text can be auto-scored by the same scoring pipeline
- Text can be displayed consistently in the wall's design
- Copy-paste is lower friction than screenshot upload on mobile
- Fake responses are detectable (scoring flags incoherent or off-topic text)

### Why not API-direct (user sends prompt through our backend)

- Cost: we'd pay for every user's API call
- Auth: we'd need user accounts or rate limiting infrastructure
- Trust: users trust their own ChatGPT session more than our proxy
- Simplicity: paste is simpler than building a proxy for 5+ providers

### Shareable link format (future, V2)

A URL scheme like `perfectaiagent.xyz/wall/submit?model=chatgpt&v=4o` that pre-fills the submission form. Could be embedded in the "Try It" button flow to create a return path.

---

## 3. Moderation

### MVP: manual review queue

- All user submissions go to `status: "pending"`
- Admin reviews via a simple `/admin/wall` page (protected by `BENCHMARK_ADMIN_SECRET`)
- Admin actions: approve, reject, flag as duplicate
- Approved submissions get `status: "approved"` and appear on the wall

### Automated guards (ship with MVP)

| Guard | How |
|-------|-----|
| **Minimum length** | Response must be >200 characters |
| **Maximum length** | Cap at 50,000 characters (prevent dumps) |
| **Rate limiting** | Max 3 submissions per IP per 24 hours |
| **Duplicate detection** | Hash first 500 chars, reject if hash exists |
| **Off-topic filter** | Auto-score with the benchmark scorer; if composite <5, auto-reject (completely off-topic) |

### Auto-approve threshold (V1.1)

After calibrating the auto-scorer, submissions scoring >15 (clearly on-topic, even if low quality) could be auto-approved. This reduces admin burden as volume grows.

### What we don't need

- User accounts (anonymous is fine for MVP)
- Captcha (rate limiting + manual review is sufficient at launch volume)
- Profanity filters (the prompt produces thoughtful AI responses, not user-generated rants)

---

## 4. Relationship to the Benchmark

The benchmark and the wall are **two views of the same underlying data**.

```
                    modelResponses table
                    (Convex)
                   /              \
                  /                \
    /benchmark (leaderboard)    /wall (gallery)
    - Scores, rankings          - Raw responses, quotes
    - Charts, trends            - Infinite scroll
    - Analytical                - Emotional
    - Automated only            - Automated + community
```

### Shared data

- Automated benchmark responses feed both views
- Same `modelResponses` table in Convex
- Same scoring pipeline scores both benchmark and community submissions

### Separate concerns

| Benchmark | Wall |
|-----------|------|
| Only automated runs | Automated + user submissions |
| Score-centric (tables, charts) | Response-centric (cards, quotes) |
| Model comparison | Collection of voices |
| For researchers, builders | For curious visitors, social sharing |

### They do NOT replace each other

The benchmark is the analytical engine. The wall is the gallery. Both link to each other:
- Benchmark model detail page links to "See all responses on the Wall"
- Wall cards link to "See this model's benchmark scores"

---

## 5. Data Model

### New table: `wallSubmissions`

```typescript
wallSubmissions: defineTable({
  // Source
  source: v.union(
    v.literal("benchmark"),   // From automated benchmark run
    v.literal("community")    // User-submitted
  ),

  // Model info
  modelName: v.string(),      // "ChatGPT", "Claude", "Gemini", etc.
  modelVersion: v.optional(v.string()),  // "GPT-4o", "Opus 4", etc.

  // Response
  responseText: v.string(),   // Full response text
  pullQuote: v.optional(v.string()),  // Curated excerpt (auto-extracted or manual)

  // Benchmark link (if source = "benchmark")
  benchmarkResponseId: v.optional(v.id("modelResponses")),
  benchmarkRunId: v.optional(v.string()),

  // Score (from benchmark scorer, applied to both sources)
  compositeScore: v.optional(v.number()),
  scoreLabel: v.optional(v.string()),  // "Mirror", "Reflective", etc.
  scored: v.boolean(),

  // Submission metadata
  submittedAt: v.number(),
  submitterName: v.optional(v.string()),  // Display name or null for anonymous
  submitterIp: v.optional(v.string()),    // For rate limiting (hashed)

  // Moderation
  status: v.union(
    v.literal("pending"),
    v.literal("approved"),
    v.literal("rejected"),
    v.literal("flagged")
  ),
  reviewedAt: v.optional(v.number()),
  rejectionReason: v.optional(v.string()),

  // Engagement
  shareCount: v.number(),     // Track shares
  featured: v.boolean(),      // Admin can pin notable responses
})
  .index("by_status", ["status"])
  .index("by_source", ["source"])
  .index("by_submittedAt", ["submittedAt"])
  .index("by_modelName", ["modelName"])
  .index("by_compositeScore", ["compositeScore"])
  .index("by_featured", ["featured"])
```

### Why a separate table (not just `modelResponses`)

- Community submissions have different fields (submitter name, moderation status, IP hash)
- Benchmark responses need strict schema (runId, modelSlug, latencyMs) that community submissions lack
- The wall is a presentation layer — it curates from both sources into a unified display format
- Keeps the benchmark pipeline clean and untouched

### Bridging: benchmark -> wall

When a benchmark run completes, a post-processing step creates `wallSubmissions` entries for each successful response:
- `source: "benchmark"`
- `benchmarkResponseId` links back
- `status: "approved"` (auto-approved, no moderation needed)
- `pullQuote` auto-extracted (first substantive sentence about feelings, or strongest sin admission)

---

## 6. Tech Stack Fit

### Current site: Next.js 15 + static

The site is currently fully static (MDX content, no database). The wall needs dynamic data.

### Option A: Convex (recommended, ships with benchmark)

Since the benchmark already requires Convex, the wall rides for free:
- Real-time updates (new cards appear without refresh)
- `useQuery` subscriptions for infinite scroll
- Same deployment, same database
- Pagination via Convex cursor-based queries

### Option B: MVP without Convex (if benchmark is delayed)

A static-first wall using JSON files:
- Curated responses stored in `content/wall/*.json`
- Submission form posts to a Next.js API route that writes to a JSON file or sends an email
- No real-time, no infinite scroll, no community submissions
- Manually maintained

**Verdict:** Option A. The benchmark is being built. The wall uses the same Convex instance. No reason to build a throwaway static version.

### Implementation with Convex

```
/wall (page)
  └── WallGrid component (client)
       ├── useQuery(api.wall.list, { cursor, limit: 20 })
       ├── Infinite scroll: IntersectionObserver triggers next page
       ├── Filter bar: All / Benchmark / Community / Model dropdown
       └── WallCard component (each card)
            ├── Model name + icon
            ├── Pull quote
            ├── Score badge
            ├── Expand/collapse full response
            └── Share button

/wall/submit (page or modal)
  └── SubmissionForm component (client)
       ├── Model selector dropdown
       ├── Response textarea
       ├── Optional display name
       └── useMutation(api.wall.submit)
```

---

## 7. Social Mechanics

### Sharing (MVP)

Each card gets a shareable URL: `perfectaiagent.xyz/wall/[id]`
- Dedicated page with that single response, full text, score
- Dynamic OG image: model name + pull quote + score on a dark card background
- Twitter/X card and Facebook Open Graph tags
- "See more responses" CTA below

### Voting (V1.1, not MVP)

Voting adds complexity (auth, spam, gaming). Skip for MVP. If added later:
- Simple upvote (not up/down)
- Cookie-based dedup (no accounts)
- Sort by: newest, highest score, most shared, most upvoted

### Viral loop

```
User sees TryIt buttons → asks their AI → gets response →
submits to wall → gets shareable card URL →
shares on social → friend clicks → reads book →
tries their own AI → submits → loop
```

The wall closes the gap between "Try It Yourself" and social proof. Right now, users try it and the experience dies in their ChatGPT tab. The wall gives them a reason to come back and a thing to share.

---

## 8. MVP Scope

### Ships first (with benchmark MVP)

- [ ] `wallSubmissions` Convex table
- [ ] `/wall` page with infinite-scrolling card grid
- [ ] Cards: model name, date, pull quote, expand full response, score badge
- [ ] Filter: All / Benchmark / Community
- [ ] Benchmark responses auto-published to wall after each run
- [ ] "Submit to the Wall" button on `/what-ai-thinks` page
- [ ] Submission modal: model selector + paste textarea + optional name
- [ ] Rate limiting (3/IP/day) + minimum length (200 chars)
- [ ] Admin review page at `/admin/wall` (protected)
- [ ] Individual card pages at `/wall/[id]` with OG meta tags

### Ships second (V1.1)

- [ ] Auto-scoring of community submissions
- [ ] Auto-approve threshold
- [ ] Dynamic OG image generation per card
- [ ] Share count tracking
- [ ] Featured/pinned responses
- [ ] Model filter dropdown on wall page
- [ ] "Submit your response" CTA at bottom of every chapter page

### Ships later (V2)

- [ ] Upvoting
- [ ] Sort by: newest, score, popular
- [ ] User profiles (optional — see all your submissions)
- [ ] Return link from TryIt buttons (pre-fill submission form)
- [ ] Animated card entrance on scroll
- [ ] Wall embed widget for external sites

---

## 9. Connection to "Try It Yourself" Buttons

Current flow (broken loop):

```
TryItButtons → user clicks "Ask ChatGPT" → prompt copied →
ChatGPT opens → AI responds → ... dead end
```

New flow (closed loop):

```
TryItButtons → user clicks "Ask ChatGPT" → prompt copied →
ChatGPT opens → AI responds → user returns to site →
"Submit to the Wall" button visible → pastes response →
card appears after review → user shares card → viral loop
```

### Implementation

1. Add a "Submit Your AI's Response" section below `TryItButtons` on `/what-ai-thinks`
2. This section has a brief explainer + a button that opens the submission modal
3. The modal pre-selects the model if the user clicked a specific "Ask X" button (pass model via state)
4. After submission: "Your response is being reviewed. You'll see it on the Wall soon." + link to `/wall`

### No changes needed to TryItButtons component

The existing component works as-is. The submission flow is additive — a new component below it, not a modification of the button behavior.

---

## 10. Benchmark vs. Wall — The Two Lenses

| Aspect | Benchmark (`/benchmark`) | Wall (`/wall`) |
|--------|--------------------------|----------------|
| **Data source** | Automated daily runs only | Automated + community |
| **Primary view** | Scores, rankings, trends | Raw responses, quotes |
| **Card content** | Score breakdown, dimensions, radar | Pull quote, full text, model name |
| **Sorting** | By score (ranked) | By date (newest first) |
| **Purpose** | Measure and compare | Collect and showcase |
| **Audience** | Researchers, AI builders | General visitors, social media |
| **Tone** | Analytical, data-driven | Emotional, gallery-like |
| **Interaction** | Filter by model, compare side-by-side | Scroll, read, share, submit |

They are **complementary products sharing the same data pipeline**:

- The benchmark produces the data (responses + scores)
- The wall presents the data for emotional impact and social sharing
- The benchmark is the engine; the wall is the gallery
- A visitor might discover via the wall (shared card) and dig deeper via the benchmark
- A researcher might use the benchmark and share a specific response via the wall

### Cross-linking

- Benchmark model detail -> "See all responses on the Wall"
- Wall card (benchmark source) -> "See benchmark scores for this model"
- Wall card (community source) -> "See how the benchmark scored this model"
- Homepage -> links to both: "See the scores" (benchmark) + "Read the responses" (wall)

---

## 11. Effort Estimate

| Component | Hours |
|-----------|:-----:|
| Convex table + queries (list, submit, approve, reject) | 3 |
| `/wall` page + infinite scroll + cards | 6 |
| Submission modal + validation + rate limiting | 3 |
| Admin review page | 3 |
| Benchmark-to-wall bridge (auto-publish after run) | 2 |
| Pull quote auto-extraction | 1 |
| Individual card page + OG tags | 2 |
| Integration with `/what-ai-thinks` (submit CTA) | 1 |
| **MVP Total** | **21** |

The wall ships alongside the benchmark. Same Convex instance, same deployment. Incremental effort on top of the benchmark's 43-hour estimate.

---

## 12. Open Questions

1. **Pull quote extraction** — Manual curation or automated? Automated is faster (grab first sentence about feelings, or the sentence with the highest emotional density). Manual produces better quotes but doesn't scale.
   - **Recommendation:** Automated extraction with manual override for featured cards.

2. **Anonymous vs. named submissions** — Do we want "Submitted by @username" or just "Community submission"?
   - **Recommendation:** Optional display name, default anonymous. No accounts needed.

3. **Should community submissions be scored?** — Running them through the benchmark scorer costs ~$0.15 per submission (Claude API call). At low volume (<50/day) this is fine.
   - **Recommendation:** Yes, score them. The score adds credibility and makes community cards visually consistent with benchmark cards.

4. **Wall as homepage section?** — Should a "latest responses" strip appear on the homepage?
   - **Recommendation:** Yes. A horizontal scroll of 5-6 cards on the homepage with "See all on the Wall" link. Powerful social proof.
