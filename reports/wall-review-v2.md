# Wall of Fame — Code Review v2

**Date:** 2026-03-15
**Reviewer:** senior-dev (perello-dev-studio)
**Scope:** Verify all v1 review failures are fixed + full checklist

---

## Checklist

### 1. Convex schema — PASS

`convex/schema.ts` defines `wallResponses` table with correct fields:
- `modelName`, `responseText`, `pullQuote` (all `v.string()`)
- `source`: `v.union(v.literal("benchmark"), v.literal("community"))`
- `status`: `v.union(v.literal("approved"), v.literal("pending"), v.literal("rejected"))`
- `submitterName`: `v.optional(v.string())`
- `submittedAt`: `v.number()`
- `approvedAt`: `v.optional(v.number())`
- Indexes: `by_status` on `["status"]`, `by_model` on `["modelName"]`

All correct.

---

### 2. Convex mutations/queries — PASS (with note)

`convex/wall.ts` implements:
- `list` — queries by `status === "approved"`, returns desc order. Has full return validator. **PASS**
- `getById` — takes `v.id("wallResponses")`, returns entry or null. Has return validator. **PASS**
- `submit` — validates modelName non-empty, responseText 200-50000 chars, auto-extracts pullQuote, sets `status: "pending"`, `source: "community"`. Has return validator (`v.id`). **PASS**
- `approve` — checks entry exists and is pending before patching. **PASS**
- `reject` — same guard logic. **PASS**

**Note:** `getById` returns any entry regardless of status. A pending/rejected entry is accessible via `/wall/[id]` if someone has the ID. Low risk (IDs are opaque Convex IDs, not sequential), but worth noting for a future hardening pass.

---

### 3. ConvexClientProvider wraps app — PASS

- `components/ConvexClientProvider.tsx` — uses `ConvexProvider` + `ConvexReactClient` with `NEXT_PUBLIC_CONVEX_URL`.
- `app/[locale]/layout.tsx` line 29-37 — `<ConvexClientProvider>` wraps `<NextIntlClientProvider>` which wraps all children.

Correct hierarchy.

---

### 4. WallGrid — PASS

`components/WallGrid.tsx`:
- Uses `useQuery(api.wall.list)` (line 109).
- Loading state: `LoadingSkeleton` component with `animate-pulse` grid (lines 87-105). Renders when `entries === undefined` (line 150).
- Filter bar: three tabs (All / Benchmark / Community) with amber active state (lines 132-146). Filtering logic at lines 115-118.
- Share button on cards: `handleShare` copies URL to clipboard, shows "Copied!" feedback (lines 19-24, 75-81).

All items present.

---

### 5. SubmitResponseModal — PASS

`components/SubmitResponseModal.tsx`:
- Uses `useMutation(api.wall.submit)` (line 28).
- Dark theme: `bg-[#0a0a0a]`, `border-gray-800`, `bg-gray-900` inputs, `focus:border-amber-500`, `bg-accent text-black` button. No blue. **PASS**
- Validation: client-side checks for < 200 chars (line 42) and > 50000 chars (line 46). Server-side validation in `convex/wall.ts` as backup. **PASS**
- Display name field: present (lines 147-157), optional, with placeholder. **PASS** (was missing in v1)
- Model options include Mistral and Llama (added since v1).

---

### 6. Shareable card page — PASS

`app/[locale]/wall/[id]/page.tsx`:
- Route exists at correct path.
- OG meta: `openGraph` with title, description, URL, siteName, type `"article"`, locale. **PASS**
- Twitter card: `twitter.card = "summary_large_image"`. **PASS**
- Canonical URL set per card ID.

`app/[locale]/wall/[id]/WallCardPage.tsx`:
- Fetches entry via `useQuery(api.wall.getById, { id })`. **PASS**
- Loading skeleton. **PASS**
- Not-found state when entry is null. **PASS**
- Share on X button with pre-composed tweet text (line 93). **PASS**
- Copy link button with clipboard + "Copied!" feedback. **PASS**
- "See more AI confessions" CTA linking back to `/wall` (line 173). **PASS**
- "Try it yourself" CTA linking to `/what-ai-thinks` (line 177). **PASS**

**Note:** OG meta uses generic page-level translations (`t('title')`) rather than per-card dynamic data (model name, pull quote). The title will always be "Wall of Fame | Perfect AI Agent" regardless of which card is being shared. This is a missed opportunity for viral sharing but not a functional failure — the OG tags are structurally correct. The `generateMetadata` function has access to the `id` param but cannot query Convex from the server (no server-side Convex client configured). This is a known limitation of the current architecture.

---

### 7. Old API route deleted — PASS

No `app/api/submit-wall/` directory exists. Confirmed via glob search.

---

### 8. Seed data mutation — PASS

`convex/seed.ts`:
- `seedWall` mutation inserts 4 entries (Claude Opus, ChatGPT, Gemini Pro, Grok).
- Idempotent: checks `existing` before seeding (line 144).
- Sets `status: "approved"` and `approvedAt: Date.now()` on seed entries.
- Returns `{ seeded: boolean, message: string }` with validator.

---

### 9. CHANGELOG updated — PASS

`CHANGELOG.md` has two entries for the fix session:
- `[2026-03-15] Wall of Fame — Convex Backend` — convex-expert, 2min
- `[2026-03-15] Wall of Fame — UI Rebuild (review fixes)` — frontend-dev, 4min

Both logged with agent, start/end times, and task descriptions.

---

### 10. No leftover wall-data.json usage — PASS (with note)

No code imports or references `wall-data.json` in any `.ts`/`.tsx` file. Confirmed via grep.

**Note:** The file `public/wall-data.json` still exists on disk. It is dead code — not imported, not fetched, not referenced. Should be deleted in a cleanup pass to avoid confusion.

---

### 11. Design matches site theme — PASS

Across all wall components:
- Dark backgrounds: `bg-[#111]` cards, `bg-[#0a0a0a]` modal, inherits `bg-background` from layout.
- Amber accents: `border-amber-500/50`, `text-amber-400`, `bg-amber-500/10`, `hover:text-amber-500`, `bg-accent`, `hover:bg-amber-400`.
- Serif headings: `font-serif` on h1, h3, blockquote.
- Sans body: `font-sans` on body text, buttons, metadata.
- No blue colors detected anywhere in wall components.

---

### 12. Translations complete — PASS

Both `messages/en.json` and `messages/fr.json` contain complete `wall` namespace with:
- Page-level: title, subtitle, submitButton, readFull, collapse, filters, noEntries, tryItCta
- Modal: title, description, modelLabel, responseLabel, displayNameLabel, submit, cancel, success messages, error messages (6 error keys)
- Card page: backToWall, submittedOn, shareOnX, copyLink, copied, seeMore, notFound, notFoundBack
- Meta: title, description

French translations use proper diacritics and typographic conventions.

---

## Summary

| # | Check | Verdict |
|---|-------|---------|
| 1 | Convex schema (fields + indexes) | **PASS** |
| 2 | Convex mutations/queries (validation, return types) | **PASS** |
| 3 | ConvexClientProvider wraps app | **PASS** |
| 4 | WallGrid (useQuery, loading, filter bar, share button) | **PASS** |
| 5 | SubmitResponseModal (useMutation, dark theme, validation) | **PASS** |
| 6 | Shareable card page (/wall/[id] + OG meta) | **PASS** |
| 7 | Old API route deleted | **PASS** |
| 8 | Seed data mutation | **PASS** |
| 9 | CHANGELOG updated | **PASS** |
| 10 | No leftover wall-data.json usage | **PASS** |
| 11 | Design matches site theme | **PASS** |
| 12 | Translations complete (EN + FR) | **PASS** |

**Result: 12/12 PASS**

---

## Non-blocking Notes (for future improvement)

1. **`getById` returns any status** — Pending/rejected entries are technically accessible via direct URL. Add a `status === "approved"` filter or return null for non-approved in a hardening pass.

2. **OG meta is generic on card pages** — `generateMetadata` at `/wall/[id]/page.tsx` uses page-level translations, not per-card model name / pull quote. A Convex server client or preloading pattern would enable dynamic OG tags per card (important for viral sharing).

3. **`public/wall-data.json` still on disk** — Dead file. Delete it.

4. **No admin review page** — `approve` and `reject` mutations exist in `convex/wall.ts` but no UI to invoke them. Community submissions will accumulate as "pending" with no way to review them except the Convex dashboard.
