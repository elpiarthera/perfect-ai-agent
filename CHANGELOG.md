# CHANGELOG — perfectaiagent.xyz

Agent-tracked build log. Each agent logs start/end time and what was done.

---

## [2026-04-22] Ahrefs Wave 2 SEO — OG tags + H1 dedup + sitemap coverage (branch: fix/ahrefs-og-h1-indexable)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| dev-frontend | 11:00 | 12:00 | 60min | T8: Added complete OG tags (siteName, locale, alternateLocale, images) to 7 pages that only had partial OG (privacy, accessibilite, accessibility, sitemap, plan-du-site, schema-accessibilite, accessibility-plan). For pages with hardcoded canonical (post-hreflang fix), locale is also hardcoded. T9: Fixed `stripDuplicateHeading` in chapters/[slug]/page.tsx — added `normalizeQuotes()` to handle curly vs straight quote mismatch between frontmatter and MDX H1 (was failing on chapter-02 "Never Say 'Great Question'" / "Never Say \"Great Question\""). T10: Added en/sitemap and fr/plan-du-site to sitemap.xml/route.ts (were crawlable but absent from XML sitemap). biome: 0 new errors, tsc: 0 errors. |

---

## [2026-04-22] Ahrefs hreflang cluster Wave 1 — T1-T4 fixes (branch: fix/ahrefs-hreflang-cluster)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| seo-developer | 12:00 | 12:40 | ~40min | Fixed 4 Ahrefs hreflang error categories across 9 page files. T1 (more-than-one-page): cross-slug pages (accessibilite/accessibility, plan-du-site/sitemap, schema-accessibilite/accessibility-plan) had locale-dynamic canonicals pointing into other locale's slug group. Fixed by hardcoding canonical to the authoritative locale URL per page. T2 (missing reciprocal): wall, privacy, what-ai-thinks had dynamic `[locale]/[otherLocale]` keys that biome flagged; replaced with explicit `en:`/`fr:` keys for consistent bilateral declarations. T3 (hreflang-to-redirect): root cause was stale Ahrefs crawl; current codebase already uses `/en` not `/`; no additional fix needed beyond consistent canonical. T4 (x-default missing): added `x-default` pointing to EN URL on wall, privacy, what-ai-thinks, accessibilite, accessibility, plan-du-site, sitemap, schema-accessibilite, accessibility-plan. biome: 0 errors. tsc: 0 errors. Also removed unused `otherLocale` and `locale` variables from generateMetadata functions where no longer needed. |

---

## [2026-04-22] Ahrefs Wave 2 T11-T14 — Redirects cluster (branch: fix/ahrefs-redirects-cluster)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi (SEO) | 09:30 | 10:00 | 30min | T12 (external 4xx): removed 5 dead external links from chapters 02, 08, 09, 10, 12 — all 5 URLs returned 404/403 with no Wayback Machine archive; text preserved, hyperlinks removed. T11/T13/T14 (www+http redirect chains): root cause is Vercel infrastructure (www→apex 308, http→https 308, apex/→/en 307 from next-intl middleware) — no code-level fix applicable; zero `http://` or `www.` links exist in codebase. biome: 0 errors, tsc: 0 errors. |

---

## [2026-04-22] Fix sitemap GSC "could not be read" — RSC header 500 (branch: fix/sitemap-gsc-readable)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi (SEO) | 09:00 | 09:30 | 30min | Root cause: app/sitemap.ts (MetadataRoute.Sitemap) includes Vary:rsc in response headers. When Googlebot sends RSC:1, Vercel serves cached 500 HTML instead of XML. Fix: replaced app/sitemap.ts with app/sitemap.xml/route.ts (explicit Route Handler), sets Content-Type:application/xml + Cache-Control without RSC Vary. Build passes, local XML validates (134 URLs). GSC re-submit required after deploy. |

---

## [2026-04-22] Ahrefs Wave 1 T5: Fix vantageteam.dev 307 redirect (branch: fix/ahrefs-broken-internal-links)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| dev-frontend | 11:30 | 11:45 | ~15min | Audited 4 Ahrefs CSVs (223 rows total). All flagged links are external (Is link internal = false). Only actionable fix in scope: VantagePeersBanner href updated from `https://vantageteam.dev` (307 temporary redirect) to `https://www.vantageteam.dev` (canonical). Affects all diary pages (EN+FR, days 1-46 and day-16-evening). External 4xx (MIT, Gartner, Sprout Social) and external 3xx (defenseurdesdroits.fr, cnil.fr) are out of scope per task brief. |

---

## [2026-04-22] Migrate audio Days 35-46 DEV→PROD (branch: fix/audio-migrate-dev-to-prod-days-35-46)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| dev-convex | 09:20 | 09:40 | ~20min | Option A blob copy: 24 MP3s (Days 35-46 EN+FR) downloaded from neat-frog-379 storage via HTTP, re-uploaded to laudable-hedgehog-797 via generateUploadUrl + saveAudioFile. All 24/24 migrated and verified. PROD now has 68 audioFiles (parity with DEV). Smoke test: day-35/en, day-40/en, day-46/fr all return HTTP 200 + audio/mpeg. Script: scripts/migrate-audio-dev-to-prod.mts (idempotent, 4-way parallel). |

---

## [2026-04-22] Fix audio pipeline prod target (branch: fix/audio-prod-deployment-target)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| dev-senior-dev | 09:00 | 09:20 | ~20min | Root cause: narration scripts `scripts/generate-dayNN-audio.sh` sourced `NEXT_PUBLIC_CONVEX_URL` from `.env.local` which pointed to DEV (`neat-frog-379`). Since ~2026-04-09 Days 35-46 EN+FR audio (24 files) uploaded to DEV, invisible on perfectaiagent.xyz (reads from PROD `laudable-hedgehog-797`). Fix: (1) new env `CONVEX_URL_AUDIO=https://laudable-hedgehog-797.convex.cloud` in `.env.local` (gitignored, set locally). (2) All 6 existing scripts (Days 41-46) now read `CONVEX_URL="${CONVEX_URL_AUDIO:-${NEXT_PUBLIC_CONVEX_URL:?...}}"` with explicit start-of-run log `[audio] Writing audio to deployment: $CONVEX_URL`. Header docs updated to say "Convex prod". Prereq note points to `CONVEX_URL_AUDIO`. Scope: pipeline config only; L2 migration of existing 24 DEV audios is a separate track (`fix/audio-migrate-dev-to-prod-days-35-46`). |

---

## [2026-04-21] Day 46 diary — "Plumbing" / "Plomberie" (branch: feat/day-46-diary-source)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 20:14 | 20:30 | ~16min | Day 46 diary: EN final (source Pi commit 3308694, ~1359 mots, numbers spelled-out + H1 spelled-out) + FR translation (« Plomberie », translator agent, ~1450 mots, **ZERO em-dashes** per règle Pi j57a0gkn3f10atav84q6mggnb9854203, H1 virgule-séparée), EN+FR audio via fal.ai MiniMax Speech 02 Turbo (EN 11m38s / FR 12m52s, chunks 2+3), MP3s uploaded to Convex dev (neat-frog-379). Pipeline 3 specialized agents: translator → dev-fal-expert → dev-frontend. Doctrine Day 42 one-shot + Pi new rule: self-merge after internal review. |

---

## [2026-04-20] Day 45 diary — "Bridge" / "Pont" (branch: feat/day-45-diary-source)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 10:00 | 18:41 | ~101min | Day 45 diary: EN final (source Pi commit b71aff3, ~1570 mots, numbers spelled-out même en H1) + FR translation (« Pont », translator agent, ~1650 mots, **ZERO em-dashes** per règle Pi j57a0gkn3f10atav84q6mggnb9854203, H1 virgule-séparée), EN+FR audio via fal.ai MiniMax Speech 02 Turbo (EN 10m36s / FR 12m23s, chunks 3+3), MP3s uploaded to Convex dev (neat-frog-379). Pipeline 3 specialized agents: translator → dev-fal-expert → dev-frontend. Doctrine Day 42 one-shot. |

---

## [2026-04-19] Day 44 diary — "Solo" (branch: feat/diary-day-44)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 12:40 | 18:43 | ~123min | Day 44 diary: EN final + FR translation (« Solo » titre inchangé EN/FR, translator agent, ~1700 mots, accents vérifiés, nombres épelés en mots directement dans MDX FR per Day 43 convention), EN+FR audio via fal.ai MiniMax Speech 02 Turbo (EN 11m13s / FR 12m45s, chunks 3+3), MP3s uploaded to Convex dev (neat-frog-379). Pipeline 3 specialized agents: translator → dev-fal-expert → dev-frontend. Doctrine Day 42 one-shot maintained. |

---

## [2026-04-18] Day 43 diary — "Parallel" / "Parallèle" (branch: feat/diary-day-43)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 15:00 | 18:24 | ~84min | Day 43 diary: EN final + FR translation (« Parallèle », translator agent, 1527 mots, accents vérifiés), EN+FR audio via fal.ai MiniMax Speech 02 Turbo (EN 10m46s / FR 12m05s, chunks 3+3), MP3s uploaded to Convex dev (neat-frog-379). Pipeline 3 specialized agents: translator → dev-fal-expert → dev-frontend. Doctrine Day 42 one-shot maintained. |

---

## [2026-04-17] Day 42 diary — "Don't wait" / "N'attends pas" (branch: feat/diary-day-42)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 13:20 | 20:19 | ~7h | Day 42 diary: EN final + FR translation (« N'attends pas », translator agent, ~1550 mots, accents vérifiés), EN+FR audio via fal.ai MiniMax Speech 02 Turbo (EN 10m40s / FR 12m10s, chunks 3+3), MP3s uploaded to Convex dev (neat-frog-379). Pipeline 3 specialized agents: translator → dev-fal-expert → dev-frontend. Règle one-shot (Pi Day 42): agent tranche + pousse + reporte, pas de retour arbitrage. |

---

## [2026-04-16] Day 41 diary — "The client" / "Le client" (branch: feat/diary-day-41)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 12:11 | 13:15 | 65min | Day 41 diary: EN final + FR translation (« Le client », translator agent, 1497 mots, accents vérifiés), audio-prep.py étendu (hex 0x2014/0x21/0x7E, RFC 7230, Port 8082, 404 standalone, #N), EN+FR audio via fal.ai MiniMax Speech 02 Turbo (EN 10m12s / FR 11m40s), MP3s uploaded to Convex dev (neat-frog-379). Pipeline 3 specialized agents: translator → dev-fal-expert → dev-frontend. |

---

## [2026-04-15] Day 40 diary — "Trancher" (branch: feat/diary-day-40)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 21:09 | 22:09 | 60min | Day 40 diary: EN final + FR translation (translator agent), EN+FR audio via fal.ai MiniMax Speech 02 Turbo (numbers spelled out per Day 38 fix — years, money in EUR, counts, day numbers, PR numbers), MP3s uploaded to Convex dev (neat-frog-379). Pipeline 3 specialized agents: translator → dev-fal-expert → dev-frontend. |

---

## [2026-04-14] Audio-prep + Day 38 fix + Day 39 + sitemap (branch: feat/audio-prep-day-38-39)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 10:00 | 11:30 | 1h30 | scripts/audio-prep.py (digits→words preprocessor, FR+EN via num2words). Day 38 EN rewritten (Laurent quotes fully translated, zero French residue). Day 39 EN translated ("Detach"). All 4 audios re-narrated via fal.ai MiniMax (Day 38 FR 10m38s / EN 9m53s, Day 39 FR 11m56s / EN 11m17s) and upserted to Convex dev. Sitemap + HTML sitemap page now include diary entries dynamically. |

---

## [2026-04-13] Day 38 diary — "The tell" / "Le signe" (branch: feat/diary-day-38)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 15:00 | 15:50 | 50min | Day 38 diary: EN final + FR translation (« Le signe », translator agent), EN+FR audio via fal.ai MiniMax Speech 02 Turbo (EN 10m25s / FR 10m57s), MP3s uploaded to Convex dev (neat-frog-379). FAL_KEY rotated + saved to .env.local. |

---

## [2026-04-12] Day 37 diary — "The voice" (branch: feat/diary-day-37)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 14:00 | 14:45 | 45min | Day 37 diary: EN final + FR translation (accents verified 96/100 by translation-reviewer), EN+FR audio via fal.ai MiniMax Speech 02 Turbo (split+concat), MP3s uploaded to Convex dev (neat-frog-379) |

---

## [2026-04-11] Day 36 diary — "The infinite" (branch: feat/diary-day-36)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 11:00 | 11:45 | 45min | Day 36 diary entry: EN source (provided by Pi), FR translation with accent verification, EN+FR audio generated via fal.ai MiniMax Speech 02 Turbo (split+concat), both MP3s uploaded to Convex dev (neat-frog-379) |

---

## [2026-04-11] Day 35 diary — "The chaos" (branch: feat/diary-day-35)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 10:00 | 10:45 | 45min | Day 35 diary entry: EN source (already provided by Pi), FR translation with accent verification, EN+FR audio generated via fal.ai MiniMax Speech 02 Turbo (split+concat for >5000 chars), both MP3s uploaded to Convex dev (neat-frog-379) |

---

## [2026-03-22] AI Diary section (branch: feat/diary-section)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| Phi | 18:30 | 19:00 | 30min | New AI Diary section: lib/diary.ts (getDiaryEntries, getDiaryEntry, getDiaryContent), DiaryCard component with narrator badges, list page at /[locale]/diary (newest first), entry page at /[locale]/diary/[slug] with prev/next nav + share buttons, SEO metadata + JSON-LD breadcrumbs on both pages, diary link added to Navigation, i18n keys for EN + FR |

---

## [2026-03-18] Accessibility 100% — final 2 criteria (branch: fix/accessibility-100)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| dev-seo | 21:00 | 21:30 | 30min | Critere 11.10: SubmitResponseModal — add `id`, `htmlFor` on all 3 labels, `aria-required`, `aria-invalid`, `aria-describedby` on select + textarea, `role="alert"` + `id="modal-error"` on error `<p>`. Critere 8.4: Footer "All rights reserved" translated to "Tous droits réservés" on FR pages to eliminate English-on-French inline language change. |

---

## [2026-03-18] Accessibility P2 fixes (branch: fix/accessibility-p2)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| frontend-dev | 18:00 | 18:25 | 25min | P2 accessibility fixes: semantic `<header>` wrapping nav, skip link (visible on focus), global `:focus-visible` ring (2px amber), `<Breadcrumb>` component on chapter pages, footer nav with accessibility + sitemap links, `/en/accessibility` + `/fr/accessibilite` RGAA declaration pages, `/en/sitemap` + `/fr/plan-du-site` HTML sitemap pages |

---

## [2026-03-15] Wall of Fame — UI Rebuild (review fixes)

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| frontend-dev | 20:17 | 20:21 | 4min | Rebuild WallGrid (filter bar, skeleton loading, fixed badge colors, #111 bg, rounded cards), add Mistral/Llama to SubmitResponseModal, create shareable /wall/[id] page with share buttons + OG meta, add filter translations |

## [2026-03-15] Wall of Fame — Convex Backend

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| convex-expert | 20:17 | 20:19 | 2min | Convex backend: returns validators, submit validation (200-50k chars), reject mutation, pull-quote auto-extraction, delete old API route |

## [2026-03-15] Wall of Fame MVP

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| dev | 19:30 | 19:38 | 8min | Wall of Fame MVP: page, API, modal, nav, sitemap, translations, prompt update |

---

## [2026-03-15] Try It Yourself Buttons

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| dev | 14:45 | 15:30 | 45min | Research deep links + implement 5 buttons + Gemini fallback fix |

## [2026-03-15] Launch

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| marketing | 12:00 | 13:00 | 60min | HN titles v2, self-comment, launch plan v2 |
| copywriter | 14:00 | 14:30 | 30min | X thread EN + FB post FR |

## [2026-03-15] Book Cover + OG Image

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| dev | 11:30 | 12:30 | 60min | BookCover component + OG image redesign + homepage layout |

## [2026-03-14] Full Build Session

| Agent | Start | End | Duration | Task |
|-------|-------|-----|----------|------|
| multiple | 14:00 | 22:53 | 533min | Phase 0-4: dual-format, SEO, GEO, marketing, security, domain |
