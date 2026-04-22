# Pattern: IndexNow Direct API — perfectaiagent.xyz

Version: 1.0 — 2026-04-22
Author: dev-convex-expert (Phi orchestration — mission k572b8wepjp1nv9vyh5z620frn85b4hz)
Reference: Alpha PR #56 (perello.consulting) + Tau PR #14 (vantageteam.dev) defensive guards

---

## Overview

IndexNow is an open protocol (Bing, Yandex, Naver) for real-time URL indexing notifications.
Benefit: re-indexing in hours instead of days.

Architecture for perfectaiagent.xyz:

```
UUID generated locally
  → key hosted at /public/<UUID>.txt
  → helper lib/indexnow.ts (server-side, no "use client")
  → manual trigger POST /api/indexnow-bulk (post-deploy or on demand)
```

---

## PAA-specific deltas vs Alpha (perello.consulting)

| Aspect | Alpha (perello.consulting) | PAA (perfectaiagent.xyz) |
|--------|---------------------------|--------------------------|
| Stack | Next.js App Router, static MDX | Next.js App Router + Convex (audio only) |
| Content source | MDX posts via `getAllBlogPosts()` | Filesystem MDX: `content/[locale]/diary/*.mdx` + `content/en/*.mdx` for chapters |
| Auth on bulk route | Optional (`INDEXNOW_TRIGGER_TOKEN`, open if not set) | Required (`INDEXNOW_BULK_SECRET`, always enforced — 401 if missing) |
| URL validation | String prefix check | `new URL()` try/catch parse + hostname comparison (Tau PR #14 guard) |
| UUID format check | None | Runtime UUID regex check on `INDEXNOW_API_KEY` |
| 10k URL cap | Hard reject if > 10k | Truncate to 10k with console.warn (Tau PR #14 guard) |
| Convex hook | Not applicable | Phase 2 (out of scope): add Convex scheduler/action on diary publish |

---

## Files

### L1 — UUID key file

```
/public/6afd4401-c939-4f0a-8262-03a1bfe743cc.txt
```

Content: `6afd4401-c939-4f0a-8262-03a1bfe743cc` (UUID only, no newline stripped by Vercel static file serving)

Verify after deploy:
```bash
curl https://perfectaiagent.xyz/6afd4401-c939-4f0a-8262-03a1bfe743cc.txt
# Expected: 6afd4401-c939-4f0a-8262-03a1bfe743cc
```

### L2 — Helper `lib/indexnow.ts`

Key behaviors:
- Runtime `typeof` checks on both `INDEXNOW_API_KEY` and `INDEXNOW_HOST`
- UUID regex validation on the API key value
- `new URL(raw)` parse in try/catch per URL — skip malformed, skip off-host
- Truncate to 10 000 URLs with `console.warn` (IndexNow per-request limit)
- Returns `{ ok, status, message? }` — never throws

### L3 — API route `app/api/indexnow-bulk/route.ts`

- POST only (no GET)
- Auth: `Authorization: Bearer <INDEXNOW_BULK_SECRET>` — always required (401 if absent or wrong)
- Collects URLs from filesystem, mirrors `app/sitemap.xml/route.ts` logic:
  - Static pages (home, chapters, diary, about, for-ai-agents, what-ai-thinks, wall, privacy, accessibility, sitemap — bilingual)
  - Chapter pages: `content/en/*.mdx` (excluding `about-*`)
  - Diary entries: `getDiaryEntries("en")` + `getDiaryEntries("fr")` — status "final" only
- Calls `notifyIndexNow(urls)` from lib/indexnow.ts
- Returns `{ submitted, indexNowStatus, ok, message? }`

---

## Required Vercel env vars

| Variable | Value | Notes |
|----------|-------|-------|
| `INDEXNOW_API_KEY` | `6afd4401-c939-4f0a-8262-03a1bfe743cc` | Must match the UUID filename in /public/ |
| `INDEXNOW_HOST` | `perfectaiagent.xyz` | No `www`, no `https://` |
| `INDEXNOW_BULK_SECRET` | `<random-secret>` | Choose a strong random string; used for API route auth |

Set in both Production and Preview environments in Vercel dashboard.
Redeploy after adding env vars.

---

## First bulk trigger (post-deploy)

```bash
curl -X POST https://perfectaiagent.xyz/api/indexnow-bulk \
  -H "Authorization: Bearer <INDEXNOW_BULK_SECRET>"
```

Expected response:
```json
{ "submitted": 130, "indexNowStatus": 202, "ok": true }
```

IndexNow returns 202 Accepted when submission is valid.

---

## Phase 2 (future — Convex Action hook)

PAA uses Convex for audio files only (`audioFiles` table). Diary entries are filesystem MDX.
If diary publish ever moves to a Convex mutation, add a `ctx.scheduler.runAfter(0, ...)` call
to trigger `notifyIndexNow([newEntryUrl])` automatically.

For now, the manual bulk trigger post-deploy is sufficient.

---

## Reusable pattern

This pattern is reused across the ElPi Corp portfolio:
- Alpha: perello.consulting PR #56
- Tau: vantageteam.dev PR #14
- Phi: perfectaiagent.xyz (this PR)

The `lib/indexnow.ts` signature is consistent across all three sites.
Main variation is the URL collection logic (each site has its own content structure).
