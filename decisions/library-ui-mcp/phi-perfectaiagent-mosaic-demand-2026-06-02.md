# Mosaic v0.2.0 Demand Audit — perfectaiagent.xyz
**Date:** 2026-06-02
**Auditor:** Phi (perfect-ai-agent orchestrator)
**Task:** VP task k174qjxz2dfx99dtdprjw06jhx87xpye
**Mosaic source:** `npm pack @vantageos/mosaic` (v0.1.0, published 2026-06-02, 43.7 kB packed / 192.8 kB unpacked)
**Phi component count:** 17 files in `/components/` (confirmed via `find`)

---

## Section 1 — UI Surfaces Inventory

### 1.1 Navigation Header (`components/Navigation.tsx`)
- `"use client"` — owns mobile hamburger open/closed state
- Responsive: desktop horizontal link row + language switcher; mobile dropdown
- Locale-prefixed links, EN/FR toggle, one accent CTA ("Read Free")
- No badge/status indicators; no search

### 1.2 Homepage (`app/[locale]/page.tsx`)
- Server Component, fully static
- Surfaces: hero (BookCover + dual CTA), audience grid (4 cards), opening quote, 4-Act Arc grid, chapter teaser inline prose, back-cover blurb, EmailCapture, Agent CTA + CopyCommand
- BookCover: pure CSS decorative component — not swappable
- EmailCapture: `"use client"`, local state, POST `/api/subscribe`

### 1.3 Diary List (`app/[locale]/diary/page.tsx`)
- Server Component, static at build
- Renders a flat list of DiaryCard items (one per MDX file)
- DiaryCard: Server Component — link + narrator badge (amber pill for Pi, gray for Laurent) + truncated title + date

### 1.4 Diary Detail — MDX + audio (`app/[locale]/diary/[slug]/page.tsx`)
- Server Component wrapper; statically generated via `generateStaticParams`
- Surfaces: Breadcrumb, entry header (day label + narrator badge + title + date), DiaryAudioPlayer, MDX prose (`<MDXRemote>`), prev/next nav links, ShareButtons, EmailCapture, VantagePeersBanner
- **DiaryAudioPlayer** (`"use client"`) — wraps Convex `useQuery` to fetch signed URL then renders AudioPlayer
- **AudioPlayer** (`"use client"`) — full custom implementation: seek bar (role=slider), playback rate cycler, play/pause, time display; EN/FR locale-aware title/narrator labels passed as props

### 1.5 Chapters List + Detail
- Same card-grid pattern as diary (ChapterCard, server)
- Detail page uses MDXRemote with `prose-chapter` Tailwind class

### 1.6 Wall (`app/[locale]/wall/`)
- `WallGrid` (`"use client"`) — Convex `useQuery`, filter tabs (all/benchmark/community), masonry-style 3-col grid
- WallCard: expand/collapse response text, share link copy, narrator-style badge
- SubmitResponseModal (`"use client"`) — full accessible modal: focus trap, Escape key, `role="dialog"`, Convex mutation

### 1.7 Footer (inline in `app/[locale]/layout.tsx`)
- Server-rendered; copyright + 4 policy/sitemap links
- No interactive elements; minimal

### 1.8 Ancillary Components
| Component | Type | Notes |
|---|---|---|
| `Breadcrumb` | Server | Schema.org BreadcrumbList; uses `key={i}` (cosmetic, stable) |
| `CopyCommand` | Client | Pre-block + clipboard copy button |
| `TerminalBlock` | Client | Syntax-highlighted pre + optional copy |
| `SinRegistry` | — | Not inspected (for-ai-agents page) |
| `TryItButtons` | — | Not inspected |
| `VantagePeersBanner` | Server | Static informational banner |

---

## Section 2 — Mosaic v0.1.0 Fit Per Component

Mosaic v0.1.0 ships **6 components**: ProgressBar, ConfirmDialog, TableView, MarkdownRenderer, TokenDisplayOnceModal, StatusBadge.

| Mosaic Component | Category | Useful in diary/site? | Rationale |
|---|---|---|---|
| **ProgressBar** | progress | **Conditional** | Audio seek bar in `AudioPlayer` is a custom `role="slider"` div. A ProgressBar without seek interaction (display-only) could serve chapter reading-progress. But the audio seek is a custom no-swap zone (see Section 4). |
| **ConfirmDialog** | input | **No** | No destructive user actions on the public-facing site. SubmitResponseModal is a multi-field form, not a confirm gate. No swap target exists. |
| **TableView** | display | **No** | No tabular data on the site. Wall grid is a masonry card layout; diary is a list. TableView + RxJS Observable overhead not justified. |
| **MarkdownRenderer** | artifacts | **Conditional** | Site uses `next-mdx-remote` for MDX with custom Tailwind prose classes. MarkdownRenderer (via `marked`) could serve simpler prose contexts (diary snippet previews, wall pull-quotes) but would lose MDX component injection, i18n-aware heading links, and the `prose-chapter` Tailwind styling. Partial fit only. |
| **TokenDisplayOnceModal** | confirmation | **No** | No API token / secret display surface exists or is planned on a public literary site. |
| **StatusBadge** | media | **Yes** | Direct fit for narrator badges (Pi / Laurent) in DiaryCard and diary detail header. Currently hand-rolled as amber/gray `<span>` pills. A shared StatusBadge with `variant: success/info/neutral` and EN+FR locale prop maps cleanly. `"use client"` not required — StatusBadge renders as a pure display element. |

**Summary:** 1 direct fit (StatusBadge), 2 conditional fits (ProgressBar display-only, MarkdownRenderer partial), 3 no-fit (ConfirmDialog, TableView, TokenDisplayOnceModal).

---

## Section 3 — DEMAND LIST (Missing Components for Mosaic v0.2.0)

Components needed by Phi that do not exist in Mosaic v0.1.0:

| Component | Category | Use case (Phi) | Variants needed | Priority |
|---|---|---|---|---|
| **AudioPlayer** | media | Custom EN+FR bilingual diary audio: play/pause, seek slider, playback rate, Convex URL injection, narrator badge, "coming soon" empty state | `default` (full controls), `compact` (no seek, embed), `empty` (coming soon state) | **must** |
| **NarratorBadge** | display | Narrator attribution pill on DiaryCard + diary detail header — Pi (amber) vs Laurent (gray); replaces hand-rolled span | `ai` (amber), `human` (gray), `system` (blue) | **must** |
| **DiaryCard** | display | Diary list item: day number label + title + date + narrator badge + hover accent arrow; used in list pages | `default`, `compact` (no date) | **must** |
| **MDXProse** | artifacts | Wrapper that applies the site's `prose-chapter` Tailwind classes around `next-mdx-remote` output; standardises heading, blockquote, code styling across diary + chapter detail pages | `chapter`, `diary`, `minimal` | **must** |
| **EmailCaptureForm** | input | Inline newsletter subscribe: email input + submit button + loading/success/error states; used on homepage + diary detail | `inline` (form only), `card` (with heading + border) | **should** |
| **ShareRow** | social | Share-to-X + copy-link row with accessible live region for copied feedback; used on diary detail pages | `default`, `minimal` (copy only) | **should** |
| **ContentCard** | display | Generic bordered card with eyebrow label, serif title, optional subtitle, body text; used for audience grid, arc acts, chapter listing | `default` (full), `link` (full card clickable), `mini` (compact) | **should** |
| **CopyBlock** | input | Code/command pre-block with clipboard copy button + accessible live region; used by CopyCommand + TerminalBlock; collapses two near-duplicate components | `inline` (single line), `block` (multiline + syntax highlight), `terminal` (dark monospace) | **should** |
| **ModalDialog** | overlay | Accessible modal shell: focus trap, Escape dismiss, `role="dialog"`, backdrop; used by SubmitResponseModal and any future gated interaction | `default`, `form` (scrollable content area) | **should** |
| **ProgressReadingBar** | progress | Sticky chapter/diary reading progress bar (display-only, no seek); distinct from AudioPlayer seek | `sticky-top`, `inline` | **nice** |
| **LocaleSwitcher** | navigation | EN/FR toggle button with accessible label; currently inline in Navigation; extracting enables consistent appearance across nav + footer | `button`, `link` | **nice** |
| **ToastNotification** | feedback | Transient success/error feedback (copy confirmation, form submission); currently each component implements its own setTimeout + state | `success`, `error`, `info` | **nice** |

**Priority breakdown:** 4 must / 5 should / 3 nice-to-have — **12 total** (exceeds minimum of 8).

---

## Section 4 — No-Swap Zones (Phi-Specific)

The following surfaces are custom implementations that **must not be replaced** by Mosaic components, even if a future Mosaic component overlaps:

### 4.1 DiaryAudioPlayer / AudioPlayer
- **Why no-swap:** Tightly coupled to Convex file storage (`api.audio.getAudioUrl`), EN/FR bilingual narrator labels passed via props, custom seek logic with drag support, and a specific "coming soon" empty state tied to the diary publishing pipeline. Any Mosaic AudioPlayer component should be a new addition; the Phi audio chain wraps it — not replaces it.
- **Boundary:** `DiaryAudioPlayer` owns the Convex data-fetch + error boundary. `AudioPlayer` owns the controls UI. These layers must remain independent.

### 4.2 MDXRemote Prose Rendering
- **Why no-swap:** `<MDXRemote source={content} />` from `next-mdx-remote/rsc` runs as a React Server Component and supports custom MDX component injection (e.g., TerminalBlock in MDX). Mosaic's `MarkdownRenderer` uses `marked` (a client-side string processor) and cannot accept MDX component maps or RSC streaming. The `prose-chapter` Tailwind class set — typography, blockquote accent borders, code block theming — is site-specific and maintained in `globals.css`. A future `MDXProse` Mosaic component should be a **wrapper** (adds the class set), not a renderer replacement.

### 4.3 SubmitResponseModal
- **Why no-swap:** The multi-field form (model selector, textarea, display name), Convex mutation, and i18n strings are too domain-specific to replace with a generic `ConfirmDialog`. A generic `ModalDialog` shell from Mosaic should provide the focus trap + ARIA wrapper; the form content stays Phi-owned.

---

## Section 5 — Bundle-Size Budget Note

**Context:** perfectaiagent.xyz is a Next.js 15 SSG public literary site deployed on Vercel. It is not a browser extension (no MV3 constraints). It is not an MCP host UI (no iframe budget).

**Current bundle profile:**
- Most routes are statically generated Server Components — zero client JS except for interactive islands
- Client components (Navigation, AudioPlayer, EmailCapture, ShareButtons, WallGrid, SubmitResponseModal) are already isolated
- Mosaic v0.1.0 ships recharts (chart library) and RxJS as peer dependencies — both are dead weight for this site. Any Mosaic import must be tree-shakeable at the component level; barrel imports of the full package are disallowed.

**Per-component budget guidance for v0.2.0:**
| Component | Recommended budget | Notes |
|---|---|---|
| NarratorBadge | ≤ 5 kB | Pure display, no deps |
| DiaryCard | ≤ 10 kB | Link + layout, no interactivity |
| MDXProse | ≤ 8 kB | CSS wrapper only, no JS |
| EmailCaptureForm | ≤ 20 kB | Client, form state only |
| ShareRow | ≤ 12 kB | Client, clipboard API |
| ContentCard | ≤ 8 kB | Server-renderable |
| CopyBlock | ≤ 15 kB | Client, clipboard + syntax |
| ModalDialog | ≤ 25 kB | Client, focus trap logic |
| AudioPlayer | ≤ 35 kB | Client, no codec deps |
| ProgressReadingBar | ≤ 10 kB | Client, IntersectionObserver |

**SSR/SSG compatibility notes (React 19 / Next.js 15):**
- `NarratorBadge`, `ContentCard`, `MDXProse`, `DiaryCard` — can be Server Components; no `"use client"` required
- `AudioPlayer`, `EmailCaptureForm`, `ShareRow`, `CopyBlock`, `ModalDialog`, `ProgressReadingBar`, `LocaleSwitcher`, `ToastNotification` — require `"use client"` due to event handlers, browser APIs, or state
- Mosaic components that use RxJS Observables (e.g., TableView) require `"use client"` and must never be imported in Server Component trees without a client boundary wrapper
- No Mosaic component should import `recharts` or `rxjs` unless explicitly opted in by the consuming page

---

## Verification Checksums

- **Mosaic v0.1.0 — 6 components confirmed:** ProgressBar, ConfirmDialog, TableView, MarkdownRenderer, TokenDisplayOnceModal, StatusBadge (source: `registry.yaml` + `dist/index.d.ts` from `npm pack`)
- **Phi component count:** 17 files in `/components/` (confirmed via `find /root/coding/perfect-ai-agent/components -type f | wc -l`)
- **Mosaic source used:** `npm pack @vantageos/mosaic` — local tarball inspection (no git clone required; npm registry accessible)
- **friction_observed:** none — npm pack succeeded on first attempt; registry accessible; mosaic published 12 minutes before audit ran
