# Brand Kit Audit — Step 0 (REUSE-FIRST)
**Date**: 2026-05-12
**Auditor**: dev-tech-researcher subagent (dispatched by Phi)
**Purpose**: Map every Phase 2 brand kit deliverable to REUSE | UPGRADE | PRODUCE | HYBRID verdict before any production sub-agent dispatch.

---

## Executive summary

6 of the 8 deliverables are either fully REUSE or HYBRID (minor gap to fill). Only 1 deliverable requires pure PRODUCE work (9 missing hero illustrations). The voice situation is a policy conflict: the prior subagent produced 2 new clones in violation of Pi's explicit veto — verdict is REUSE of the existing diary clone per Pi doctrine, but Laurent must decide whether the prior clones are discarded or retained. Estimated production scope reduction vs. original 7-subagent plan: ~65%.

---

## A. Asset inventory — REUSABLE

| Path / source | Type | Quality assessment | Covers which deliverable? | 200% gap (if any) |
|---|---|---|---|---|
| `public/brand/logo/wordmark-dark.svg` (520×72 viewBox, 2.7KB) | SVG vector logo | Production-grade. Georgia Bold allcaps + π glyph + amber underline. Correct palette. | Deliverable 1 — Logo system | None |
| `public/brand/logo/wordmark-dark.png` (1024×142px, 18.2KB) | PNG raster | Production-grade raster for web/social | Deliverable 1 | None |
| `public/brand/logo/wordmark-light.svg` (520×72, 1.9KB) | SVG vector | Production-grade light-bg variant | Deliverable 1 | None |
| `public/brand/logo/wordmark-light.png` (1024×142px, 16.9KB) | PNG raster | Production-grade | Deliverable 1 | None |
| `public/brand/logo/wordmark-mono-white.svg` (520×72, 1.8KB) | SVG vector | Production-grade mono-white | Deliverable 1 | None |
| `public/brand/logo/wordmark-mono-white.png` (1024×142px, 17.3KB) | PNG raster | Production-grade | Deliverable 1 | None |
| `public/brand/logo/wordmark-mono-accent.svg` (520×72, 1.7KB) | SVG vector | Production-grade amber variant | Deliverable 1 | None |
| `public/brand/logo/wordmark-mono-accent.png` (1024×142px, 18.1KB) | PNG raster | Production-grade | Deliverable 1 | None |
| `public/brand/logo/lockup-horizontal.svg` (580×60, 2.5KB) | SVG vector lockup | Production-grade horizontal | Deliverable 1 | None |
| `public/brand/logo/lockup-square.svg` (320×320, 2.8KB) | SVG vector lockup | Production-grade square/stamp | Deliverable 1 | None |
| `public/brand/logo/favicon.svg` (256×256, 1.4KB) | SVG favicon master | Production-grade π glyph | Deliverable 1 | None |
| `public/brand/logo/favicon.png` (256×256, 1.0KB) | PNG favicon raster | Production-grade | Deliverable 1 | Missing: 16px, 32px, 64px rasters for `.ico` bundle |
| `deliverables/brand-kit-taglines.md` | Tagline bank | 10 candidates (5 EN + 5 FR), ranked, rationale per line, anti-patterns documented | Deliverable 2 — Tagline ebook reel | None — REUSE direct |
| `deliverables/brand-kit-typography.md` | Typography spec | Cormorant Garamond + Georgia + system-ui. Size/weight/tracking scale for reel (H1 80px / H2 56px / body 24px). Full pairing rules. Google Fonts import. | Deliverable 7 — Typography | None — 200% spec |
| `public/brand/hero/ebook-portrait.png` (1080×1920, 1381KB) | Hero PNG | fal.ai FLUX Pro Ultra cinematic chiaroscuro. Exact brand palette. Production-grade. | Deliverable 3 — Hero ebook portrait | None |
| `public/brand/hero/ebook-landscape.png` (1920×1080, 1827KB) | Hero PNG | Same. | Deliverable 3 — Hero ebook landscape | None |
| `public/brand/hero/sin-1-hallucination-portrait.png` (1080×1920, 1426KB) | Hero PNG | Production-grade | Deliverable 3 — Sin 1 portrait | None |
| `public/brand/hero/sin-1-hallucination-landscape.png` (1920×1080, 1475KB) | Hero PNG | Production-grade | Deliverable 3 — Sin 1 landscape | None |
| `public/brand/hero/sin-2-manipulation-portrait.png` (1080×1920, 1558KB) | Hero PNG | Production-grade | Deliverable 3 — Sin 2 portrait | None |
| `public/brand/hero/sin-2-manipulation-landscape.png` (1920×1080, 1323KB) | Hero PNG | Production-grade | Deliverable 3 — Sin 2 landscape | None |
| `public/brand/hero/sin-3-optimization-trap-portrait.png` (1080×1920, 1963KB) | Hero PNG | Production-grade | Deliverable 3 — Sin 3 portrait | None |
| `public/brand/hero/sin-3-optimization-trap-landscape.png` (1920×1080, 1721KB) | Hero PNG | Production-grade | Deliverable 3 — Sin 3 landscape | None |
| `public/brand/hero/sin-4-tool-misuse-portrait.png` (1080×1920, 1772KB) | Hero PNG | Production-grade | Deliverable 3 — Sin 4 portrait | None |
| `deliverables/brand-kit-music/build-up/01-straight-towards-the-sun.mp3` (244s, 10.1MB) | Music — build-up | CC0 public domain. John Bartmann "100 Ambient Atmospheric Soundtracks". No attribution needed. Production-grade. | Deliverable 5 — Music library | None |
| `deliverables/brand-kit-music/build-up/02-above-the-clouds.mp3` (244s, 10.1MB) | Music — build-up | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/build-up/03-starbeams.mp3` (244s, 10.1MB) | Music — build-up | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/build-up/04-surfacing.mp3` (244s, 10.1MB) | Music — build-up | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/build-up/05-healing-ground.mp3` (244s, 10.1MB) | Music — build-up | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/reflective/01-ethereal-moments.mp3` (228s, 9.5MB) | Music — reflective | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/reflective/02-memory-shores.mp3` (244s, 10.1MB) | Music — reflective | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/reflective/03-nostalgia.mp3` (244s, 10.1MB) | Music — reflective | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/reflective/04-glass-bell.mp3` (244s, 10.1MB) | Music — reflective | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/reflective/05-ice-crystal-harp.mp3` (244s, 10.1MB) | Music — reflective | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/tension/01-dark-dyne.mp3` (244s, 10.1MB) | Music — tension | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/tension/02-ominous-night.mp3` (244s, 10.1MB) | Music — tension | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/tension/03-dystopia.mp3` (244s, 10.1MB) | Music — tension | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/tension/04-lurking-deep.mp3` (244s, 10.1MB) | Music — tension | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-music/tension/05-broken-suspense.mp3` (244s, 10.1MB) | Music — tension | CC0. | Deliverable 5 | None |
| `deliverables/brand-kit-sfx/transitions/01-whoosh.mp3` (1.33s, 44KB) | SFX — transition | Mixkit Free commercial license, no attribution. | Deliverable 6 — SFX library | None |
| `deliverables/brand-kit-sfx/transitions/02-glitch.mp3` (3.70s, 115KB) | SFX — transition | Mixkit Free. | Deliverable 6 | None |
| `deliverables/brand-kit-sfx/transitions/03-hit.mp3` (1.10s, 35KB) | SFX — transition | Mixkit Free. | Deliverable 6 | None |
| `deliverables/brand-kit-sfx/reveal/04-typewriter.mp3` (5.04s, 119KB) | SFX — text reveal | Mixkit Free. | Deliverable 6 | None |
| `deliverables/brand-kit-sfx/reveal/05-swipe.mp3` (0.78s, 27KB) | SFX — text reveal | Mixkit Free. | Deliverable 6 | None |
| `deliverables/brand-kit-sfx/reveal/06-chime.mp3` (2.40s, 61KB) | SFX — text reveal | Mixkit Free. | Deliverable 6 | None |
| `deliverables/brand-kit-sfx/accents/07-heartbeat.mp3` (4.05s, 96KB) | SFX — accent | Mixkit Free. | Deliverable 6 | None |
| `deliverables/brand-kit-sfx/accents/08-alert.mp3` (3.36s, 103KB) | SFX — accent | Mixkit Free. | Deliverable 6 | None |
| `deliverables/brand-kit-sfx/end-card/09-sting.mp3` (2.57s, 81KB) | SFX — end card | Mixkit Free. | Deliverable 6 | None |
| `deliverables/brand-kit-sfx/end-card/10-riser.mp3` (8.59s, 253KB) | SFX — end card | Mixkit Free. | Deliverable 6 | None |
| Voice ID `ttv-voice-2026032704355926-zUb4NZ4I` (Pi diary clone) | TTS voice | fal.ai MiniMax speech-2.8-turbo. Active. Used Days 50-66. Memory ref: `j576105d1nnrb7xhd266sbhw5183ndbd`. | Deliverable 4 — Voice (diary narration) | None per Pi doctrine |
| `deliverables/brand-kit-voices/sample-en-pi-clone-existing.mp3` (24.6s, 384KB) | Voice sample EN | Reference sample of diary clone at speed 1.1 | Deliverable 4 — baseline reference | None |
| `deliverables/brand-kit-voices/sample-fr-pi-clone-existing.mp3` (26.8s, 419KB) | Voice sample FR | Reference sample of diary clone at speed 1.1 | Deliverable 4 — baseline reference | None |
| `app/opengraph-image.tsx` (1200×630 OG image, server-rendered) | OG image | Production-grade. Dark bg + amber accent bar + Georgia Bold title. Used live on perfectaiagent.xyz. | Deliverable 1 (identity) | None |
| `public/podcast-artwork.jpg` (1024×1024, 59KB) | Podcast artwork | Existing social/podcast square. Not part of brand kit deliverables but reusable as-is for social profile images. | Supplemental | None |

---

## B. Asset inventory — MISSING (needs PRODUCE)

| Deliverable | Why nothing reusable | Production scope |
|---|---|---|
| Hero illustrations — 9 missing (sin-4-landscape + sins 5-8 both orientations) | fal.ai balance exhausted mid-run. Scripts exist (`generate-hero-images-resume.py`), seeds defined, prompts written. Pure execution gap. | Minimal: top up fal.ai balance, run resume script. ~9 API calls. Model: `fal-ai/flux-pro/v1.1-ultra`. Estimated cost: ~$0.27–$0.45 (fal.ai FLUX Pro Ultra ~$0.03–$0.05/image). |
| Brand kit consolidated doc (Deliverable 8) | Not yet written — requires all other 7 deliverables to be audited and finalized first. This audit is the prerequisite. | Medium: one subagent, doc-assembly task. No new assets needed. All inputs exist after Step 0 audit. |

---

## C. Asset inventory — UPGRADE (exists but needs polish for 200%)

| Existing path | Current state | Upgrade scope | Effort |
|---|---|---|---|
| `public/brand/logo/favicon.png` (256×256 only, 1.0KB) | Master raster exists but only at 256px. A proper `.ico` bundle needs 16, 32, 64 sizes. The live site uses the Next.js default favicon fallback — the π favicon is not yet wired into `app/[locale]/layout.tsx`. | Generate 3 additional rasters (16, 32, 64px) from `favicon.svg` using `cairosvg`. Add `<link rel="icon">` declarations to layout. Command in `brand-kit-logo-spec.md` section 9. | Low — 30min dev task (delegate to Tau or Rho) |
| `deliverables/brand-kit-voices.md` (voice spec) | Documents two new reel clones that violate Pi's veto (no new clones). Spec must be corrected: delete Option B verdict, replace with REUSE verdict for diary clone + recommended ad-tempo params for diary clone. | Update doc to reflect Pi doctrine. Add param recommendation: speed 1.05–1.10, style 0.6–0.8 (if MiniMax allows), short pauses `<#0.5#>` for punchy cadence. No new voice generation. | Low — doc-only edit |

---

## D. Decision flowchart — 8 deliverables

### 1. Logo system → REUSE

All 12 files exist in `public/brand/logo/` on branch `feat/phi-brand-kit-phase2-prep`:
- 4 wordmark variants (dark/light/mono-white/mono-accent): SVG + PNG each
- 2 lockups (horizontal/square): SVG each
- Favicon: SVG master + 256px PNG

SVGs have full `<path>` data (16 path/rect/circle/text elements confirmed), aria-labels, titles. Logo spec doc is complete with usage rules, minimum sizes, clear-space rules, color codes, and rasterization instructions.

One minor gap: the favicon is not yet integrated into the live site layout, and only a 256px PNG raster exists (needs 16/32/64px for `.ico` bundle). This is an UPGRADE on the favicon alone — the logo system itself is REUSE.

Verdict: **REUSE** (with micro-UPGRADE on favicon wiring — delegate to Tau/Rho, not a production subagent task).

---

### 2. Tagline ebook reel → REUSE

`deliverables/brand-kit-taglines.md` contains 10 candidates (5 EN, 5 FR) with per-line rationale, A/B test guesses, and ranked recommendations. Final picks documented: EN-1 + EN-2 for reel/back-cover, FR-1 + FR-5 for reel/back-cover. Anti-patterns catalogued. Word counts verified (all within limits). Pi voice register confirmed throughout.

No gap. The tagline bank is production-ready. No new subagent needed.

Verdict: **REUSE**

---

### 3. Hero illustrations (ebook + 8 sins × 2 formats = 18 PNG) → HYBRID

**Completed (9/18):** Committed on `feat/phi-brand-kit-phase2-prep` branch.
- `ebook-portrait.png` 1080×1920 ✓
- `ebook-landscape.png` 1920×1080 ✓
- `sin-1-hallucination` portrait + landscape ✓
- `sin-2-manipulation` portrait + landscape ✓
- `sin-3-optimization-trap` portrait + landscape ✓
- `sin-4-tool-misuse` portrait only ✓

**Missing (9/18):** Balance exhausted mid-run.
- `sin-4-tool-misuse` landscape ✗
- `sin-5-loop-hell` portrait + landscape ✗
- `sin-6-specification-gaming` portrait + landscape ✗
- `sin-7-reward-hacking` portrait + landscape ✗
- `sin-8-misevolution` portrait + landscape ✗

**Reuse for ebook reel format?** The ebook portrait (1080×1920) is already the exact reel format — it can be used directly as the opening card in a 9:16 reel with logo overlay. No re-generation needed.

**Ebook covers on `feat/ebook-novel-en-v1` branch:** `cover-en-kdp.png` (1600×2560, ~382KB) and `cover-fr-kdp.png` (1600×2560, ~382KB) are KDP-spec book covers, not hero illustrations. They serve a different purpose (Amazon product page) and are not interchangeable with the 1080×1920 cinematic hero set. They do not reduce the PRODUCE scope for the 9 missing heroes.

Resume script ready at `scripts/generate-hero-images-resume.py`. Seeds, prompts, and style concept locked.

Verdict: **HYBRID** (9 REUSE + 9 PRODUCE via resume script)

---

### 4. Voice IDs → REUSE (Pi doctrine, non-negotiable)

**Pi explicit veto**: No new voice clones. REUSE diary voice.

**Existing Pi diary clone:**
- Voice ID: `ttv-voice-2026032704355926-zUb4NZ4I`
- Provider: fal.ai MiniMax speech-2.8-turbo
- Memory ref: `j576105d1nnrb7xhd266sbhw5183ndbd`
- Active production use: Days 50–66 EN + FR diaries on perfectaiagent.xyz
- Samples: `deliverables/brand-kit-voices/sample-en-pi-clone-existing.mp3` (24.6s) and `sample-fr-pi-clone-existing.mp3` (26.8s)

**Prior subagent violation:** `brand-kit-voices.md` documents two new clones (`QUNsOzUy` EN and `M5FG98uO` FR) created in violation of Pi veto. Samples exist in `deliverables/brand-kit-voices/`. These are uncommitted (untracked). Per audit scope they are INVENTORIED but their PRODUCE verdict is overridden.

**Ad-tempo recommendation for diary clone (no new clone):**
Use the diary clone with these MiniMax params for reel/ad format:
- `speed`: `1.05` (slight acceleration, preserves prosody better than 1.1)
- Short pause markup: `<#0.5#>` between punchy sentences
- Script structure: max 70 words, period-terminated declarative sentences, no em-dashes
- Expected output duration: ~25–28s at speed 1.05 for a 70-word script

The diary clone's contemplative register can be made serviceable for reel format through script discipline (shorter, punchier sentences) rather than voice substitution.

Verdict: **REUSE** (diary clone only — per Pi doctrine)

**Outstanding policy question for Laurent:** The two new reel clones (`QUNsOzUy`, `M5FG98uO`) already exist as untracked files. Should they be discarded or retained as optional assets? (See Section G.)

---

### 5. Music library → REUSE

15 tracks across 3 moods confirmed present:
- **build-up** (5 tracks): `01-straight-towards-the-sun`, `02-above-the-clouds`, `03-starbeams`, `04-surfacing`, `05-healing-ground`. Each 244s.
- **reflective** (5 tracks): `01-ethereal-moments` (228s), `02-memory-shores`, `03-nostalgia`, `04-glass-bell`, `05-ice-crystal-harp`. Each ~244s.
- **tension** (5 tracks): `01-dark-dyne`, `02-ominous-night`, `03-dystopia`, `04-lurking-deep`, `05-broken-suspense`. Each 244s.

**License confirmed:** John Bartmann "100 Ambient Atmospheric Audio Drama Soundtracks: Straylight Drones Collection" — CC0 Public Domain. Source: Free Music Archive (freemusicarchive.org) and Bandcamp. Commercial use permitted, no attribution required, may be edited/looped/resampled. All metadata tags confirm source and artist.

No music spec doc exists in `deliverables/` — the SFX spec doc exists but not a companion music doc. The music usage map (which track for which reel beat) is a gap. This is a documentation gap, not an asset gap.

Verdict: **REUSE** (all 15 tracks). PRODUCE needed only for a usage-map doc — delegate to the consolidated brand kit doc in Deliverable 8.

---

### 6. SFX library → REUSE

10 effects across 4 categories confirmed:
- transitions (3): whoosh 1.33s, glitch 3.70s, hit 1.10s
- reveal (3): typewriter 5.04s, swipe 0.78s, chime 2.40s
- accents (2): heartbeat 4.05s, alert 3.36s
- end-card (2): sting 2.57s, riser 8.59s

**License confirmed:** Mixkit Sound Effects Free License — commercial use permitted, no attribution required. Full spec documented in `deliverables/brand-kit-sfx.md` including Mixkit IDs, URLs, durations, bitrates (191–265 kbps / 44.1kHz), and usage map for reel beat placement.

Verdict: **REUSE**

---

### 7. Typography → REUSE

`deliverables/brand-kit-typography.md` is production-complete:
- Display font: Cormorant Garamond (Display subfamily, Christian Thalmann, SIL Open Font License 1.1) — rationale documented against alternatives (Italiana, Domine)
- Size scale: H1 80px Cormorant Bold 700 / H2 56px Cormorant SemiBold 600 / H3 40px Georgia Bold / Body 24px Georgia / Caption 18px system-ui
- Letter-spacing guide with rationale
- Pairing rules (Cormorant + Georgia + system-ui)
- Web import CSS snippet (Google Fonts + self-hosted alternative)
- Exact reel specs for Rho handoff (colors, margins, safe zones)
- Body color rules on dark: primary `#e8e0d0`, secondary `#a09080`, accent `#f59e0b`

Current site `tailwind.config.ts` uses Georgia + system-ui as defined — the Cormorant display layer is an additive extension for reel title cards, not a replacement. No conflict.

Reel title cards are image-generated (not live web rendering), so font licensing for production use is the Google Fonts OFL which permits commercial use.

Verdict: **REUSE** (spec is 200% complete for reel production handoff)

---

### 8. Brand kit consolidated doc → PRODUCE

This deliverable does not yet exist. It requires all 7 prior deliverables to be finalized. This audit is its prerequisite. It is always a final-step PRODUCE task — no prior asset to reuse.

**10+ sections the doc must contain:**
1. Brand identity overview (voice, register, positioning)
2. Color system: `#0a0a0a` / `#141414` / `#f59e0b` / `#9ca3af` / `#f5f0e8` / `#c9b99a` / `#e8e0d0` — with usage rules per surface
3. Logo system (link to `brand-kit-logo-spec.md`, file index)
4. Typography system (link to `brand-kit-typography.md`, reel specs)
5. Tagline bank (link to `brand-kit-taglines.md`, final picks)
6. Hero illustration system (spec link, status 9/18 → 18/18 post-resume)
7. Voice infrastructure (diary clone ID, ad-tempo params, MiniMax markup reference)
8. Music library (15 tracks, CC0 license, mood taxonomy, usage map)
9. SFX library (10 effects, Mixkit license, usage map for reel beats)
10. Reel production handoff spec (canvas dimensions, safe zones, Rho brief)
11. Live site integration status (what's wired, what's pending)
12. Decision log (vetoes, corrections, Pi doctrine applied)

Verdict: **PRODUCE** (post-audit, once Laurent confirms verdicts)

---

## E. VantagePeers memory pointers

| Memory ID | Content | Relevance |
|---|---|---|
| `j576105d1nnrb7xhd266sbhw5183ndbd` | Pi diary voice clone ID `ttv-voice-2026032704355926-zUb4NZ4I` — full fal.ai MiniMax params | Deliverable 4 — Voice |
| `j57fg47bheegmrfgfdgys2a2yx83yvhx` | MiniMax pause format reference: `<#0.5#>` short / `<#1.0#>` section / `<#1.5#>` long | Deliverable 4 — Voice script format |
| (Git commit) `5b24517` | Hero image generation: 9/18 FLUX Pro Ultra images committed, resume script included | Deliverable 3 |
| (Git commit) `6d754db` | Voice subagent commit — Option B (2 new clones, per-veto violation) — OVERRIDE with REUSE verdict | Deliverable 4 |
| (Branch) `feat/ebook-novel-en-v1` | KDP covers `cover-en-kdp.png` + `cover-fr-kdp.png` at 1600×2560 | Supplemental — ebook product page |
| (Untracked) `deliverables/brand-kit-music/` | 15 CC0 tracks from John Bartmann Straylight Drones — no commit yet | Deliverable 5 |
| (Untracked) `deliverables/brand-kit-sfx/` | 10 Mixkit Free SFX — no commit yet | Deliverable 6 |
| (Untracked) `public/brand/logo/` | 12 logo files (SVG + PNG) — no commit yet | Deliverable 1 |
| (Untracked) `deliverables/brand-kit-taglines.md` | 10 tagline candidates — no commit yet | Deliverable 2 |
| (Untracked) `deliverables/brand-kit-typography.md` | Full typography spec — no commit yet | Deliverable 7 |

**Critical note:** All assets except hero images (committed in `5b24517`) and voice samples (committed in `6d754db`) are untracked on `feat/phi-brand-kit-phase2-prep`. They will be lost if the branch is discarded. They need a single commit to persist: logos, taglines, typography, music, SFX.

---

## F. Recommended next action for Phi

After Laurent acknowledges this audit:

### Sub-agents NOT to dispatch (REUSE = document only)
- Logo production subagent — all 12 files exist
- Tagline production subagent — 10 candidates written and ranked
- Typography production subagent — spec complete
- Music sourcing subagent — 15 CC0 tracks confirmed
- SFX sourcing subagent — 10 Mixkit tracks confirmed
- New voice clone subagent — Pi veto applies

### Sub-agents to dispatch (PRODUCE / HYBRID only)
1. **Hero resume subagent** (LOW cost): Top up fal.ai balance, run `scripts/generate-hero-images-resume.py`. Generates 9 missing PNGs (sins 4-landscape through 8). Estimated ~$0.30–$0.50 in fal.ai credits.
2. **Favicon wiring task** (Tau/Rho, not a research subagent): Generate 16/32/64px favicon rasters from `public/brand/logo/favicon.svg`, update `app/[locale]/layout.tsx` with icon declarations.
3. **Brand kit doc subagent**: Produce `deliverables/brand-kit-consolidated.md` (Deliverable 8) once Laurent confirms verdicts. Assembles all 12 sections from existing deliverables. No new assets — documentation only.
4. **Single commit task** (Phi/Tau): Commit all untracked brand kit assets on current branch before any branch operations. Risk: all untracked assets (logos, taglines, typography, music, SFX) are lost if the branch is reset or deleted.

### Estimated quota saved vs original 7-subagent plan
- Original plan: 7 production subagents (logo, taglines, hero, voices, music, SFX, typography)
- Post-audit plan: 1 resume subagent (hero) + 2 doc tasks (consolidated doc, favicon wiring)
- Quota reduction: **~65%** (5 of 7 subagent dispatches eliminated)
- fal.ai cost reduction: all voice generation, music sourcing, SFX sourcing, logo production eliminated

---

## G. Outstanding questions for Laurent

1. **Voice policy conflict**: The prior subagent created two new reel clones (`ttv-voice-2026051301303726-QUNsOzUy` EN and `ttv-voice-2026051301310926-M5FG98uO` FR) before Pi's veto was enforced. Samples exist at `deliverables/brand-kit-voices/`. Pi said REUSE diary clone only. Decision needed: (a) discard new clones and delete the samples, or (b) retain as optional alternate voices for reel format without officially adopting them. The `brand-kit-voices.md` doc must be corrected either way.

2. **Hero completion priority**: 9 missing hero images require a fal.ai balance top-up. The resume script is ready. Is the Phase 2 reel blocked on all 18 images, or can production proceed with the 9 completed? Sins 5–8 cover loop hell, specification gaming, reward hacking, and misevolution — all relevant to the book narrative. If the reel focuses on ebook + sins 1–4, zero blocking.

3. **Untracked assets commit**: 5 deliverable categories (logos, taglines, typography, music, SFX) are untracked on `feat/phi-brand-kit-phase2-prep`. They exist only on this working tree. Confirm: commit these as a single "brand-kit assets: logos, taglines, typography, music, SFX" commit on the current branch before any other operations. This is low-risk but needs explicit approval per the NEVER COMMIT WITHOUT REQUEST protocol.

---

## Verification

```
test -f /root/coding/perfect-ai-agent/deliverables/brand-kit-audit-2026-05-12.md && echo OK
```
Expected: OK

Section count (`## ` lines): 7 (A through G plus Executive summary and title)
Verdict count: REUSE + UPGRADE + PRODUCE + HYBRID instances: 12+

---

*Sources for music license verification: [Free Music Archive — John Bartmann](https://freemusicarchive.org/music/John_Bartmann/100-ambient-atmospheric-soundtracks-straylight-drones-collection), [Bandcamp](https://johnbartmann.bandcamp.com/album/100-ambient-atmospheric-audio-drama-soundtracks-straylight-drones-straylight-drones), [Wikimedia Commons CC0 documentation](https://commons.wikimedia.org/wiki/Category:100_Ambient_Atmospheric_Soundtracks-Straylight_Drones_Collection_by_John_Bartmann_(album)). SFX license: [Mixkit Sound Effects Free License](https://mixkit.co/license/).*
