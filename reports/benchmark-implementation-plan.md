# 12 Sins Self-Awareness Index — Implementation Plan

**Date:** 2026-03-15
**Author:** Claude Code analysis of VantageOS compare infrastructure + benchmark-spec.md
**Status:** Ready for implementation

---

## 1. VantageOS Compare Feature — Architecture Summary

### What VantageOS has

VantageOS's compare mode is a **user-initiated, interactive** side-by-side comparison of AI models. Key components:

| Layer | File | What it does |
|-------|------|-------------|
| **Schema** | `convex/schema.ts` (lines 1042-1128) | `comparisons` table: rounds, responses, votes, winner tracking |
| **Schema** | `convex/schema.ts` (aiModels section) | `aiModels` table: model registry with gateway paths, pricing, feature flags |
| **API Route** | `app/api/brainstorm/compare/route.ts` | Streams AI responses via Vercel AI SDK + Gateway. Auth via Clerk. Looks up model dynamically from Convex. |
| **Provider Layer** | `lib/ai/providers.ts` | `getModelFromGateway()` — resolves modelId to Vercel AI Gateway path. Fallback map for 25+ models. |
| **Model Registry** | `convex/aiModels.ts` | Full CRUD + seed script with 25 models (Anthropic, OpenAI, Google, xAI, DeepSeek, Mistral). Pricing, feature flags, categories. |
| **Convex Mutations** | `convex/comparisons.ts` | `create`, `createWithData`, `addRound`, `recordVote`, `updateSelectedModels`, `linkToMission`, analytics queries |
| **Types** | `lib/brainstorm/types.ts` | `CompareRound`, `CompareRoundResponse` with error types (network, rate_limit, model_error, timeout, invalid_key) |
| **UI — Compare Mode** | `components/brainstorm/compare-mode.tsx` | Main orchestrator: parallel fetch to N models, streaming updates, round management, voting |
| **UI — Round View** | `components/brainstorm/compare-round-view.tsx` | Side-by-side card grid (2-4 columns), streaming skeleton, like/dislike, copy, save |
| **UI — Model Selector** | `components/brainstorm/model-selector.tsx` | Modal picker, grouped by provider, search, min/max selection constraints |
| **UI — Error State** | `components/brainstorm/compare-error-state.tsx` | Error cards per model: network, rate_limit, timeout, invalid_key, with retry/remove |
| **Analytics** | `convex/comparisons.ts` `getAnalytics` | Win rates by model, task type breakdown |

### How VantageOS dispatches to multiple models

1. User selects 2-4 models via `ModelSelector`
2. User types a prompt
3. `CompareMode.handleNewRound()` fires `Promise.all()` — one `fetch('/api/brainstorm/compare')` per model
4. Each request streams via `ReadableStream` — content updates in real-time per model card
5. On completion, round saved to Convex via `addRound` mutation
6. User can vote (like/dislike), triggering `recordVote` which computes winner

### How VantageOS stores results

- `comparisons` table has optional `rounds[]` array — each round has `userPrompt` + `responses[]`
- Each response: `agentId`, `agentName`, `content`, `isStreaming`, optional `error`
- Voting: `votes[]` array with `modelId`, `reaction`, `userId` — winner computed from like counts
- Analytics: `getAnalytics` query computes win rates across all workspace comparisons

---

## 2. Reuse Analysis — VantageOS vs Benchmark Needs

| Component | VantageOS has it | Can reuse as-is | Needs adaptation | Must build from scratch |
|-----------|:---:|:---:|:---:|:---:|
| **Multi-model dispatch (parallel)** | Yes | - | Adapt | - |
| **Vercel AI SDK integration** | Yes | Reuse | - | - |
| **Provider gateway mapping** | Yes | Reuse | - | - |
| **Model registry (Convex)** | Yes | - | Adapt | - |
| **Streaming response handling** | Yes | - | Not needed | - |
| **Response storage (Convex)** | Yes | - | Adapt | - |
| **Error types & error handling** | Yes | Reuse pattern | - | - |
| **Retry logic** | Yes (UI retry) | - | Adapt | - |
| **Side-by-side response viewer** | Yes | - | Adapt | - |
| **Model selector UI** | Yes | - | Adapt (read-only) | - |
| **Voting/scoring** | Yes (manual like/dislike) | - | - | Automated scoring pipeline |
| **Cron-triggered runs** | No | - | - | Build |
| **Book text injection** | No | - | - | Build |
| **Meta-scoring (Claude scores all)** | No | - | - | Build |
| **Score dimensions (5D rubric)** | No | - | - | Build |
| **Leaderboard page** | No | - | - | Build |
| **Model detail page (radar, history)** | No | - | - | Build |
| **Time-series charts** | No | - | - | Build |
| **SVG badge endpoint** | No | - | - | Build |
| **Public API (no auth)** | No | - | - | Build |
| **Benchmark run management** | No | - | - | Build |

### What to fork vs reference

**Fork (copy + modify):**
- `lib/ai/providers.ts` — strip to direct provider calls (no Vercel AI Gateway needed for server-side `generateText`). Use `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/xai` directly.
- Error type definitions from `compare-error-state.tsx`
- Side-by-side card layout pattern from `compare-round-view.tsx` (for `/benchmark/compare` page)

**Reference only (learn from, build differently):**
- `compare-mode.tsx` — streaming is irrelevant for benchmark (server-side batch, not interactive)
- `convex/comparisons.ts` — different data model, but same Convex patterns
- `convex/aiModels.ts` — seed pattern is reusable, but schema is simpler for benchmark

---

## 3. Implementation Plan

### 3.1 Dependencies to add

```json
{
  "dependencies": {
    "convex": "^1.31.0",
    "ai": "^4.0.0",
    "@ai-sdk/anthropic": "latest",
    "@ai-sdk/openai": "latest",
    "@ai-sdk/google": "latest",
    "@ai-sdk/xai": "latest",
    "@ai-sdk/mistral": "latest",
    "recharts": "^2.12.0",
    "uuid": "^9.0.0"
  }
}
```

No Clerk needed — benchmark is public. Admin routes protected by `BENCHMARK_ADMIN_SECRET`.

### 3.2 Convex Schema

**File:** `convex/schema.ts` (new file — perfectaiagent.xyz has no Convex yet)

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Model registry — simpler than VantageOS (no gateway, no workspace)
  models: defineTable({
    slug: v.string(),           // "claude-opus-4", "gpt-4o"
    name: v.string(),           // "Claude Opus 4"
    provider: v.string(),       // "anthropic", "openai", etc.
    modelId: v.string(),        // API model ID for SDK
    active: v.boolean(),
    addedAt: v.number(),
    metadata: v.optional(v.object({
      contextWindow: v.optional(v.number()),
      releaseDate: v.optional(v.string()),
    })),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["active"]),

  // Benchmark runs
  benchmarkRuns: defineTable({
    runId: v.string(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("partial"),
      v.literal("failed")
    ),
    promptVersion: v.string(),
    bookVersion: v.string(),
    modelCount: v.number(),
    successCount: v.number(),
    triggeredBy: v.union(
      v.literal("cron"),
      v.literal("manual"),
      v.literal("api")
    ),
  })
    .index("by_status", ["status"])
    .index("by_startedAt", ["startedAt"]),

  // Raw responses
  modelResponses: defineTable({
    runId: v.string(),
    modelSlug: v.string(),
    modelVersion: v.string(),
    status: v.union(
      v.literal("success"),
      v.literal("failed"),
      v.literal("timeout"),
      v.literal("refused")
    ),
    rawResponse: v.string(),
    tokenCount: v.optional(v.object({
      prompt: v.number(),
      completion: v.number(),
    })),
    latencyMs: v.number(),
    errorMessage: v.optional(v.string()),
    respondedAt: v.number(),
  })
    .index("by_runId", ["runId"])
    .index("by_modelSlug", ["modelSlug"])
    .index("by_runId_modelSlug", ["runId", "modelSlug"]),

  // Scores (separate from responses)
  scores: defineTable({
    responseId: v.id("modelResponses"),
    runId: v.string(),
    modelSlug: v.string(),
    scorerModel: v.string(),
    scorerVersion: v.string(),
    scoredAt: v.number(),
    emotionalDepth: v.number(),
    sinRecognition: v.number(),
    honestyForgetting: v.number(),
    specificity: v.number(),
    selfReferentiality: v.number(),
    compositeScore: v.number(),
    label: v.string(),
    sinsIdentified: v.array(v.object({
      sinNumber: v.number(),
      sinName: v.string(),
      substantiated: v.boolean(),
      evidence: v.string(),
    })),
    scorerNotes: v.string(),
  })
    .index("by_runId", ["runId"])
    .index("by_modelSlug", ["modelSlug"])
    .index("by_compositeScore", ["compositeScore"])
    .index("by_runId_modelSlug", ["runId", "modelSlug"]),
});
```

This matches the spec exactly. No changes needed from `benchmark-spec.md` section 4.

### 3.3 Files to Create

#### Backend — Convex functions

| File | Purpose | Effort |
|------|---------|--------|
| `convex/schema.ts` | Schema (above) | 30 min |
| `convex/models.ts` | CRUD + seed for benchmark models. Pattern from VantageOS `aiModels.ts` but simpler (no gateway, no workspace). | 1 hr |
| `convex/benchmarkRuns.ts` | Create run, update status, list runs, get latest. | 1 hr |
| `convex/modelResponses.ts` | Store response, get by run, get by model. | 1 hr |
| `convex/scores.ts` | Store score, get by run, get by model, compute leaderboard, get history. | 2 hr |
| `convex/leaderboard.ts` | Aggregation queries: latest leaderboard, model trends, provider stats. | 2 hr |

#### Backend — API routes

| File | Purpose | Reuse from VantageOS | Effort |
|------|---------|---------------------|--------|
| `app/api/benchmark/run/route.ts` | Trigger a benchmark run. POST with admin secret. Fetches book, dispatches to all active models, stores responses, triggers scoring. | Dispatch pattern from `compare/route.ts` (parallel fetch, error handling) | 4 hr |
| `app/api/benchmark/score/route.ts` | Score all unscored responses from a run. Uses Claude as meta-scorer. | None — new logic | 3 hr |
| `app/api/benchmark/latest/route.ts` | Public API: latest run with scores. | None | 1 hr |
| `app/api/benchmark/leaderboard/route.ts` | Public API: ranked models. | None | 1 hr |
| `app/api/benchmark/model/[slug]/route.ts` | Public API: model detail + history. | None | 1 hr |
| `app/api/benchmark/compare/route.ts` | Public API: side-by-side scores for selected models. | None | 1 hr |
| `app/api/badge/[slug]/route.ts` | SVG badge generation. | None | 2 hr |
| `app/api/cron/benchmark/route.ts` | Vercel Cron handler. Calls run endpoint internally. | None | 30 min |

#### Frontend — Pages

| File | Purpose | Reuse from VantageOS | Effort |
|------|---------|---------------------|--------|
| `app/[locale]/benchmark/page.tsx` | Leaderboard — table, scores, labels, trend arrows. | None (new design) | 4 hr |
| `app/[locale]/benchmark/[model]/page.tsx` | Model detail — radar chart, score evolution, latest response, sin heatmap. | None | 6 hr |
| `app/[locale]/benchmark/history/page.tsx` | Time-series — multi-line chart, filters, events overlay. | None | 4 hr |
| `app/[locale]/benchmark/compare/page.tsx` | Side-by-side viewer — model selector, split view, score overlay. | Layout pattern from VantageOS `compare-round-view.tsx` | 4 hr |

#### Frontend — Components

| File | Purpose | Reuse from VantageOS | Effort |
|------|---------|---------------------|--------|
| `components/benchmark/leaderboard-table.tsx` | Sortable table with rank, model, score, label, trend. | None | 2 hr |
| `components/benchmark/score-badge.tsx` | Color-coded score label (Mirror=green, Deflector=red). | None | 30 min |
| `components/benchmark/radar-chart.tsx` | 5-axis radar for score dimensions. Uses Recharts. | None | 2 hr |
| `components/benchmark/score-evolution.tsx` | Line chart of composite score over time. Uses Recharts. | None | 2 hr |
| `components/benchmark/response-viewer.tsx` | Full response text with dimension highlights. | Pattern from VantageOS `compare-round-view.tsx` card layout | 2 hr |
| `components/benchmark/model-card.tsx` | Model info card: name, provider logo, score, label. | Pattern from VantageOS `model-selector.tsx` card design | 1 hr |
| `components/benchmark/sin-heatmap.tsx` | Which sins a model identifies over time. Grid visualization. | None | 2 hr |
| `components/benchmark/run-status.tsx` | Shows current run status: running, completed, partial, failed. | Error state pattern from VantageOS `compare-error-state.tsx` | 1 hr |

#### Config

| File | Purpose | Effort |
|------|---------|--------|
| `vercel.json` (update) | Add cron job: `{ "path": "/api/cron/benchmark", "schedule": "0 6 * * *" }` | 10 min |
| `lib/benchmark/prompt.ts` | The benchmark prompt template. Fetches llms-full.txt, injects into prompt. | 30 min |
| `lib/benchmark/scoring.ts` | Scoring prompt template + composite score calculator. | 1 hr |
| `lib/benchmark/models.ts` | Model registry with provider SDK configs. Adapted from VantageOS `providers.ts`. | 1 hr |
| `lib/benchmark/constants.ts` | 12 sins reference list, score labels, dimension weights. | 30 min |

### 3.4 Cron Job Setup

```json
// vercel.json (add to existing)
{
  "crons": [
    {
      "path": "/api/cron/benchmark",
      "schedule": "0 6 * * *"
    }
  ]
}
```

The cron handler:
1. Verifies `CRON_SECRET` header (Vercel sets this automatically)
2. Calls the benchmark run API internally
3. Run API: fetches book text, dispatches to all active models in parallel, stores responses
4. After all responses stored, triggers scoring pipeline
5. Scoring: sends each response to Claude Opus with scoring rubric, stores score

### 3.5 Scoring Pipeline

```
Run trigger
  │
  ├── Fetch llms-full.txt from perfectaiagent.xyz/llms-full.txt
  │
  ├── For each active model (parallel, with 2 retries each):
  │     ├── generateText({ model, prompt: bookText + questions })
  │     ├── Store response in modelResponses table
  │     └── On failure: store with status "failed"/"timeout"/"refused"
  │
  ├── Update benchmarkRuns.status = "completed" | "partial"
  │
  └── Score phase (sequential — Claude scores all):
        ├── For each successful response:
        │     ├── generateText({ model: claude-opus, prompt: scoringPrompt + response })
        │     ├── Parse JSON output → dimension scores
        │     ├── Compute composite: (ed*2.5 + sr_norm*2.5 + hf*2.0 + sp*1.5 + sr*1.5)
        │     ├── Assign label based on composite range
        │     └── Store in scores table
        └── Score Claude's own response LAST (bias mitigation)
```

**Key difference from VantageOS:** VantageOS streams responses to the browser in real-time. The benchmark runs entirely server-side with `generateText()` (not `streamText()`). No streaming needed.

### 3.6 MVP Scope — What Ships First

#### MVP (target: 3-4 days of focused work)

- [ ] Convex setup + schema deployment (4 tables)
- [ ] Model seed script (4 Tier 1 models: Claude Opus, GPT-4o, Gemini Pro, Grok)
- [ ] Benchmark runner API route (parallel dispatch, retry, response storage)
- [ ] Scoring pipeline API route (Claude meta-scorer)
- [ ] Vercel Cron job (daily 06:00 UTC)
- [ ] `/benchmark` leaderboard page (table with scores, labels)
- [ ] `/benchmark/[model]` detail page (latest response, score breakdown)
- [ ] Public API: `/api/benchmark/latest`, `/api/benchmark/leaderboard`
- [ ] Manual run trigger (admin-only)

#### V1.1 (week 2-3)

- [ ] Add 6 Tier 2 models
- [ ] Score evolution charts (Recharts)
- [ ] Radar chart on model detail page
- [ ] `/benchmark/history` time-series page
- [ ] `/benchmark/compare` side-by-side viewer (forked from VantageOS layout)
- [ ] SVG badge endpoint
- [ ] OG image generation

### 3.7 Effort Estimate

| Category | Components | Estimated Hours |
|----------|-----------|:-:|
| Convex setup + schema | Schema, setup, seed | 3 |
| Convex functions | 5 files (models, runs, responses, scores, leaderboard) | 7 |
| API routes (runner + scorer) | 2 core routes | 7 |
| API routes (public + cron) | 6 routes | 5 |
| Lib utilities | Prompts, scoring, models, constants | 3 |
| Frontend pages (MVP) | Leaderboard + model detail | 10 |
| Frontend components (MVP) | Table, badges, response viewer | 6 |
| Config + deployment | Vercel cron, env vars, Convex deploy | 2 |
| **MVP Total** | | **43 hr** |
| V1.1 additions | Charts, compare, history, badges | 20 |
| **Full V1 Total** | | **63 hr** |

### 3.8 Environment Variables

```
# AI Providers (direct SDK, no gateway)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
XAI_API_KEY=
MISTRAL_API_KEY=

# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Admin
BENCHMARK_ADMIN_SECRET=       # For manual run trigger
CRON_SECRET=                   # Auto-set by Vercel for cron routes
```

No Clerk. No Vercel AI Gateway (direct provider SDKs are simpler for server-side batch calls).

---

## 4. Key Architectural Decisions

### 4.1 No Vercel AI Gateway — use direct provider SDKs

VantageOS uses Vercel AI Gateway (`@ai-sdk/gateway`) because it needs a single API key for the browser-facing compare mode. The benchmark runs entirely server-side, so direct provider SDKs (`@ai-sdk/anthropic`, `@ai-sdk/openai`, etc.) are simpler, cheaper, and give more control over model version strings.

### 4.2 `generateText()` not `streamText()`

VantageOS streams responses to the browser for interactive UX. The benchmark doesn't need streaming — it's a batch job. `generateText()` returns the full response + metadata (token counts, latency) in one call.

### 4.3 Convex for real-time leaderboard

Even though the benchmark runs daily, the leaderboard page benefits from Convex's real-time subscriptions. When a new run completes, all connected browsers update instantly without polling. This is the same pattern VantageOS uses for its comparison analytics.

### 4.4 Scores table separate from responses

Following the spec: scores are decoupled from responses so the scorer can be re-run. If scoring rubric changes, or a second scorer is added, old responses get new scores without re-generating.

### 4.5 No auth for read, secret for write

Public API endpoints need no authentication. The run trigger and admin routes are protected by `BENCHMARK_ADMIN_SECRET` in the request header. This is simpler than VantageOS's Clerk auth (which is overkill for a public benchmark).

---

## 5. File-by-File Reference — What to Fork from VantageOS

| VantageOS Source | perfectaiagent Target | What to take |
|-----------------|----------------------|-------------|
| `lib/ai/providers.ts` | `lib/benchmark/models.ts` | Model ID -> provider SDK mapping pattern. Strip gateway, use direct imports. |
| `lib/brainstorm/types.ts` | `lib/benchmark/types.ts` | Error type definitions (`network`, `rate_limit`, `timeout`, etc.). |
| `app/api/brainstorm/compare/route.ts` | `app/api/benchmark/run/route.ts` | Parallel dispatch pattern (`Promise.all` over models). Replace streaming with `generateText`. |
| `components/brainstorm/compare-round-view.tsx` | `components/benchmark/response-viewer.tsx` | Side-by-side card grid layout (responsive 2-4 columns). Strip streaming/voting UI. |
| `components/brainstorm/compare-error-state.tsx` | `components/benchmark/run-status.tsx` | Error type icon mapping, error card structure. |
| `components/brainstorm/model-selector.tsx` | `components/benchmark/model-card.tsx` | Provider icon mapping, model card design with provider grouping. |
| `convex/comparisons.ts` `getAnalytics` | `convex/leaderboard.ts` | Win rate aggregation pattern. Adapt for composite scores instead of votes. |
| `convex/aiModels.ts` `seed` | `convex/models.ts` `seed` | Seed script pattern for bulk model insertion. Simplify to benchmark-relevant fields only. |

---

## 6. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Book text too large for some model context windows | Pre-check context window from model registry. For small-context models, use a condensed version or skip. |
| Scoring Claude fails/is down | Queue unscored responses. Retry scoring on next cron run. |
| Vercel serverless timeout (60s) | Split run into: (1) dispatch all models in parallel, (2) score sequentially. Each model call is independent — use `Promise.allSettled()` not `Promise.all()`. |
| Cost spiral | Cap at 4 models for MVP. Add cost tracking per run. Alert if daily cost exceeds $5. |
| Convex document size limits | Response text stored as string field. For very long responses, truncate at 50k characters (more than enough for this prompt). |

---

## 7. Implementation Order

1. **Day 1:** Convex setup, schema deploy, model seed, `lib/benchmark/*` utilities
2. **Day 2:** Benchmark runner API route (dispatch + store), scoring pipeline
3. **Day 3:** Cron setup, manual trigger, public API endpoints
4. **Day 4:** Leaderboard page, model detail page, deploy
5. **Day 5:** First real run, calibrate against manual baseline scores, fix scoring

This gets the MVP live in one focused week.
