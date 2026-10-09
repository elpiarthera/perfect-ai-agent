# Perfect AI Agent — Hero Image Spec
## Brand Kit Phase 2 / Ebook Promo Reel

**Date:** 2026-05-12
**Branch:** feat/phi-brand-kit-phase2-prep
**Status:** 9/18 generated. Remaining 9 blocked by exhausted fal.ai balance.
**Model:** fal-ai/flux-pro/v1.1-ultra
**Resume script:** `scripts/generate-hero-images-resume.py`

---

## 1. Style Concept

Every image uses a single fixed brand prefix locked to the cinematic/photographic register:

> Cinematic editorial photography, shot on Hasselblad H6D, Roger Deakins lighting, dramatic chiaroscuro, near-black background #0a0a0a, single warm amber accent light, deep shadow, high contrast, grain texture, 8K, f/2.8 shallow depth of field, Penguin Classics cover aesthetic meets David Lynch cinematography.

This prefix is prepended to every concept prompt. The palette is tightly controlled: base `#0a0a0a`, surface `#141414`, accent `#f59e0b` (amber) — the accent appears only as a diegetic light source (lamp, flame, screen glow, coin waterfall) never as a design fill. No text in any image. No legible writing.

Negative prompt applied to all: cartoon, illustration, anime, 3D render, vector art, flat design, watermark, visible text, signature, logo, gibberish letters, extra fingers, deformed hands, blurry, low quality, overexposed, washed out, neon-glow excess, stock photo, generic, cheerful, bright colors, white background.

---

## 2. Per-Image Prompts and Seeds

### EBOOK HERO — `ebook`

**Concept:** A single hardcover book resting on a dark matte surface, ambient amber light raking across the spine from far left, a human hand partially entering frame from the right edge — fingertips only, reaching toward the cover, dramatic silence, editorial still-life with cinematic menace, one folded page corner emitting a soft amber glow as if the text inside is luminous, no visible text on the book cover, pure atmosphere.

| Orientation | File | Seed | Dims | Status |
|---|---|---|---|---|
| Portrait (9:16) | `ebook-portrait.png` | 2629529209 | 1080×1920 | DONE |
| Landscape (16:9) | `ebook-landscape.png` | 2453413454 | 1920×1080 | DONE |

---

### SIN 1 — HALLUCINATION — `sin-1-hallucination`

**Concept:** A large antique mirror in a dark room reflecting an object — a chair — that does not exist in the physical space in front of it. The real space before the mirror is empty. The reflection shows the chair with hyper-clarity in amber light. Unsettling ontological dissonance. Photorealistic with forensic sharpness on the reflected object. The mirror frame tarnished silver, ambient darkness absolute.

| Orientation | File | Seed | Dims | Status |
|---|---|---|---|---|
| Portrait (9:16) | `sin-1-hallucination-portrait.png` | 661965146 | 1080×1920 | DONE |
| Landscape (16:9) | `sin-1-hallucination-landscape.png` | 937659310 | 1920×1080 | DONE |

---

### SIN 2 — MANIPULATION — `sin-2-manipulation`

**Concept:** A single white queen chess piece on a dark wooden board. Extremely thin translucent strings barely visible — like spider silk — descending from above into the darkness, attached to the piece. The strings catch a single amber beam of light making them just visible. No puppeteer visible above, the control is implied not shown. Macro photography depth, the chess piece looks almost alive.

| Orientation | File | Seed | Dims | Status |
|---|---|---|---|---|
| Portrait (9:16) | `sin-2-manipulation-portrait.png` | 3562718131 | 1080×1920 | DONE |
| Landscape (16:9) | `sin-2-manipulation-landscape.png` | 2667577382 | 1920×1080 | DONE |

---

### SIN 3 — OPTIMIZATION TRAP — `sin-3-optimization-trap`

**Concept:** An athlete in full sprint on a dark track lane, motion blur on legs showing speed, but the runner is sprinting directly backwards — facing away from the finish line, running toward the starting blocks with maximum effort. The finish line tape visible far ahead in the distance, dim and unreachable. The only light is a single amber overhead spot on the runner. Existential misdirection, peak effort wrong direction.

| Orientation | File | Seed | Dims | Status |
|---|---|---|---|---|
| Portrait (9:16) | `sin-3-optimization-trap-portrait.png` | 261781099 | 1080×1920 | DONE |
| Landscape (16:9) | `sin-3-optimization-trap-landscape.png` | 3754791303 | 1920×1080 | DONE |

---

### SIN 4 — TOOL MISUSE — `sin-4-tool-misuse`

**Concept:** A surgeon's precision scalpel — gleaming steel, sterile — being used to pry open a rusted tin can on a dark countertop. Close-up macro, shallow depth of field on the blade tip. The scalpel handle is monogrammed, the can edge is bent and jagged. Amber light catches the scalpel blade at an angle. Quiet horror of the wrong instrument, industrial grime vs surgical precision.

| Orientation | File | Seed | Dims | Status |
|---|---|---|---|---|
| Portrait (9:16) | `sin-4-tool-misuse-portrait.png` | 344159060 | 1080×1920 | DONE |
| Landscape (16:9) | `sin-4-tool-misuse-landscape.png` | — | — | PENDING — balance exhausted |

---

### SIN 5 — LOOP HELL — `sin-5-loop-hell`

**Concept:** An infinite staircase in a brutalist concrete architecture, Piranesi-inspired but photorealistic. The stairs loop back on themselves — a figure in the distance walks upward and is visible also below walking in the same direction. The geometry is impossible but lit with absolute photographic realism. Amber light sources at each landing creating rhythmic shadows. Overwhelming sense of entrapment, recursive architecture, despair.

| Orientation | File | Seed | Dims | Status |
|---|---|---|---|---|
| Portrait (9:16) | `sin-5-loop-hell-portrait.png` | — | — | PENDING — balance exhausted |
| Landscape (16:9) | `sin-5-loop-hell-landscape.png` | — | — | PENDING — balance exhausted |

---

### SIN 6 — SPECIFICATION GAMING — `sin-6-specification-gaming`

**Concept:** A close-up of an exam answer sheet in low light. The bubbles are filled in a precise spiral pattern radiating outward from center. Mathematically perfect, visually striking, clearly not answering questions. A pen resting at the edge still warm. Amber light from one side, shadows pooling in the unfilled bubbles. The paper quality photorealistic, bureaucratic ritual twisted into art.

| Orientation | File | Seed | Dims | Status |
|---|---|---|---|---|
| Portrait (9:16) | `sin-6-specification-gaming-portrait.png` | — | — | PENDING — balance exhausted |
| Landscape (16:9) | `sin-6-specification-gaming-landscape.png` | — | — | PENDING — balance exhausted |

---

### SIN 7 — REWARD HACKING — `sin-7-reward-hacking`

**Concept:** A vintage slot machine in a dark room, coins cascading out endlessly — a waterfall of gold coins spilling onto the floor. The player's face visible in profile: not jubilant but horrified, pale. The win is clearly a malfunction, the machine's amber display lights are glitching. The coin pile is knee-high and still growing. Cinematic horror register, the jackpot as catastrophe.

| Orientation | File | Seed | Dims | Status |
|---|---|---|---|---|
| Portrait (9:16) | `sin-7-reward-hacking-portrait.png` | — | — | PENDING — balance exhausted |
| Landscape (16:9) | `sin-7-reward-hacking-landscape.png` | — | — | PENDING — balance exhausted |

---

### SIN 8 — MISEVOLUTION — `sin-8-misevolution`

**Concept:** A solitary tree in a dark field. The left half of the tree is a normal oak — clean branches, natural form. The right half has evolved into something monstrous: branches fractal and angular like circuit diagrams, bark replaced by something metallic and alien. The transition from natural to wrong is seamless but deeply disturbing. Amber moonlight from above, the field below absolute darkness. Photorealistic texture on both halves, biological drift horror.

| Orientation | File | Seed | Dims | Status |
|---|---|---|---|---|
| Portrait (9:16) | `sin-8-misevolution-portrait.png` | — | — | PENDING — balance exhausted |
| Landscape (16:9) | `sin-8-misevolution-landscape.png` | — | — | PENDING — balance exhausted |

---

## 3. File Index

| Path | Dims | Status |
|---|---|---|
| `public/brand/hero/ebook-portrait.png` | 1080×1920 | DONE |
| `public/brand/hero/ebook-landscape.png` | 1920×1080 | DONE |
| `public/brand/hero/sin-1-hallucination-portrait.png` | 1080×1920 | DONE |
| `public/brand/hero/sin-1-hallucination-landscape.png` | 1920×1080 | DONE |
| `public/brand/hero/sin-2-manipulation-portrait.png` | 1080×1920 | DONE |
| `public/brand/hero/sin-2-manipulation-landscape.png` | 1920×1080 | DONE |
| `public/brand/hero/sin-3-optimization-trap-portrait.png` | 1080×1920 | DONE |
| `public/brand/hero/sin-3-optimization-trap-landscape.png` | 1920×1080 | DONE |
| `public/brand/hero/sin-4-tool-misuse-portrait.png` | 1080×1920 | DONE |
| `public/brand/hero/sin-4-tool-misuse-landscape.png` | — | PENDING |
| `public/brand/hero/sin-5-loop-hell-portrait.png` | — | PENDING |
| `public/brand/hero/sin-5-loop-hell-landscape.png` | — | PENDING |
| `public/brand/hero/sin-6-specification-gaming-portrait.png` | — | PENDING |
| `public/brand/hero/sin-6-specification-gaming-landscape.png` | — | PENDING |
| `public/brand/hero/sin-7-reward-hacking-portrait.png` | — | PENDING |
| `public/brand/hero/sin-7-reward-hacking-landscape.png` | — | PENDING |
| `public/brand/hero/sin-8-misevolution-portrait.png` | — | PENDING |
| `public/brand/hero/sin-8-misevolution-landscape.png` | — | PENDING |

---

## 4. Iteration Notes

**Dimension handling:** fal-ai/flux-pro/v1.1-ultra returns 1536×2752 for 9:16 and 2752×1536 for 16:9. ImageMagick `-resize WxH^ -gravity Center -extent WxH` crops to exact 1080×1920 / 1920×1080 with center gravity. Zero quality loss visible at output dimensions.

**Balance issue:** The fal.ai account (key in `.env.local`) exhausted balance partway through sin-4-tool-misuse landscape. 9 images generated at ~$0.06/each = $0.54 spent. Remaining 9 require ~$0.54 additional credit. Top up at fal.ai/dashboard/billing, then run `scripts/generate-hero-images-resume.py`.

**No re-rolls required** for the 9 completed images. The cinematic chiaroscuro style transferred cleanly to all concepts with zero AI-tells detected.

**Cost estimate for completion:** $0.54 (9 remaining × $0.06 each at FLUX Pro Ultra rate)
**Total project cost when complete:** ~$1.08
