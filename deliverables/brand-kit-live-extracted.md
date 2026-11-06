# Brand Identity — Live Extracted (SOURCE OF TRUTH)
**Date**: 2026-05-12
**Source**: perfectaiagent.xyz (production)
**Authority**: this document is the canonical brand reference. Any conflicting pre-audit artifact loses.
**Extracted by**: Phi brand identity analyst
**Extraction method**: Playwright screenshots (7), CSS file parse, HTML scrape (6 pages), source code read (tailwind.config.ts, page.tsx, BookCover.tsx, opengraph-image.tsx, icon.tsx, messages/en.json, messages/fr.json)

---

## A. Visual identity

### Color palette (computed from live CSS)

Source: `:root` block in `/_next/static/css/af0c7975b737c392.css`

| Role | Description | Hex |
|------|-------------|-----|
| Primary background | Site body background | `#0a0a0a` |
| Surface | Card/panel background | `#141414` |
| Accent | CTA buttons, highlights, brand emphasis | `#f59e0b` (amber-500) |
| Muted | Secondary text, nav links | `#9ca3af` (gray-400) |
| Text on dark | Body prose color | `#e5e7eb` (gray-200) |
| Headings | H1/H2 headings | `#ffffff` |
| H3 / secondary text | Subdued heading | `#e5e7eb` |
| Blockquote text | Quote body | `#9ca3af` |
| Blockquote border | Left accent on quotes | `#f59e0b` |
| Border / divider | Section dividers, card borders | `#1f2937` (gray-800) |
| Accent hover | CTA button hover state | `#fbbf24` (amber-400) |
| Link color (prose) | In-body links | `#f59e0b` |

**Confirmation against assumed `#0a0a0a / #141414 / #f59e0b / #9ca3af` palette**: YES — exact match. CSS variables confirmed verbatim from production stylesheet.

Additional computed values from CSS (not in assumed palette but present):
- `#e5e7eb` — prose body text
- `#1f2937` — dividers/card borders
- `#374151` — subtle marks (roman numeral watermark)
- `#4b5563` — very muted metadata text
- `#6b7280` — OG image secondary text

### Typography stack

Source: `tailwind.config.ts` + CSS file computed rules

| Element | Font family | Weight | Notes |
|---------|-------------|--------|-------|
| H1 | `Georgia, Cambria, "Times New Roman", serif` | 400 (font-normal) | Class: `font-serif text-4xl md:text-6xl font-normal` |
| H2 | `Georgia, Cambria, "Times New Roman", serif` | 400 (font-normal) | Class: `font-serif text-2xl` |
| H3 | `Georgia, Cambria, "Times New Roman", serif` | color `#e5e7eb` | Tailwind typography config |
| Body prose | `#e5e7eb` color, Georgia serif in prose | 400 | `.prose` component |
| Nav/UI | `system-ui, -apple-system, sans-serif` | 400 regular, 600 semibold for CTA | Class: `font-sans` |
| Caption/meta | `system-ui, -apple-system, sans-serif` | 400 | Small text, dates |
| Blockquotes | Georgia serif italic | 400 italic | `font-serif italic text-gray-400` |
| Cover title lines | Georgia serif | 400 (font-normal) | BookCover component |

**Confirmation against assumed "Georgia + system-ui"**: YES — exact match. Georgia is the serif used throughout. system-ui for sans/UI elements. No web font (Google Fonts, etc.) is loaded on the live site. The prior brand-kit-typography.md proposes Cormorant Garamond as display font for reels — this is a reel-specific addition, not a live site font. Cormorant Garamond does NOT appear anywhere in the live site CSS or source.

### Logo / wordmark

**Live site rendering**: CSS text — NOT an SVG or image file.

**Exact HTML** (from nav `<a>` element in `<header>`):
```html
<a class="font-serif text-white hover:text-accent transition-colors min-h-[44px] flex items-center shrink-0" href="/en">
  Perfect AI Agent
</a>
```

- Rendering type: **CSS text** — plain text node "Perfect AI Agent" in Georgia serif, white, regular weight
- No π glyph on the live site header
- No SVG/PNG logo loaded in the header
- No custom kerning, special letter-spacing, or custom weight beyond what Tailwind `font-serif` provides
- CTA nav button text: "Read the Book" — `bg-accent text-black font-semibold` (amber background, black text)

**Favicon** (from `app/icon.tsx`):
- Generated dynamically by Next.js ImageResponse
- Dimensions: 32×32px, PNG
- Design: `#0a0a0a` background, `#f59e0b` amber "PA" text, font-weight 700, letter-spacing -1, font-size 18
- Live URL: `https://perfectaiagent.xyz/icon?3c461bca591e8d73`
- Note: the `public/brand/logo/favicon.svg` (π glyph design) exists in the git stash but is NOT wired into the live site. The live favicon renders "PA" initials, not π.

**BookCover component** (CSS-rendered book cover on homepage hero):
- Type: CSS/HTML component — no external image file
- Design: `#0a0a0a` bg + amber left spine bar + border-gray-800
- Title line 1: "THE PERFECT" — white, Georgia serif
- Title line 2: "AI AGENT" — amber `#f59e0b`, Georgia serif
- Badge: "12 SINS" amber pill (EN) / "12 PÉCHÉS" (FR)
- Subtitle: italic gray-400 Georgia serif
- Roman numeral watermark I–XII at 8% opacity, right side

### Hero imagery

- **Homepage hero**: BookCover CSS component (not an image file) — see above
- **No photographic or illustrated hero image** on the live homepage
- **OG image** (`https://perfectaiagent.xyz/opengraph-image`): dynamically generated, 1200×630px
  - Design matches BookCover: dark bg + amber vertical bar + Georgia bold "THE PERFECT" white + "AI AGENT" amber + italic subtitle + roman numerals column
  - Live alt text: "The Perfect AI Agent — Five hundred complaints. Twelve patterns. Twelve sins."
- **No ebook cover PNG/JPG** linked or displayed anywhere on the live site
- **No Amazon/Gumroad/sales links** found anywhere on the live site — no ebook purchase CTA
- **Chapter pages**: text-only, no hero illustrations. Dark background, prose layout.
- `public/brand/hero/ebook-portrait.png` (1080×1920) and `ebook-landscape.png` (1920×1080): exist in git stash `feat/phi-brand-kit-phase2-prep` but are NOT referenced or displayed anywhere on the live site

### Layout

- **Max content width**: `max-w-4xl mx-auto` (≈ 56rem / 896px) — used on all main content containers
- **Padding**: `px-4 sm:px-6` on page containers
- **Nav max-width**: `max-w-4xl mx-auto`
- **Color mode**: dark only — no light mode, no toggle. `<body class="bg-background text-white min-h-screen font-sans antialiased">` — `bg-background` is `#0a0a0a`
- **Section rhythm**: `py-16 border-t border-gray-800` — consistent 64px vertical padding with gray-800 top dividers
- **Card pattern**: `border border-gray-800 p-6 bg-surface` — surface cards on `#141414`
- **CTA buttons**: no border-radius (no `rounded` class) — flat/squared corners throughout

---

## B. Copy / brand voice (verbatim quotes)

### Hero eyebrow / tagline (canonical — shown above H1 in amber small-caps)

EN: "Five hundred complaints. Twelve patterns. Twelve sins."
FR: "Cinq cents plaintes. Douze schémas. Douze péchés."

Source: `messages/en.json` → `hero.eyebrow` / `messages/fr.json` → `hero.eyebrow`
Position: amber uppercase tracking-widest small text above the H1. Confirmed visible in screenshot.

### Official H1 headline

EN: "Twelve chapters. Thirteen authors. Only one of them is human."
FR: "Douze chapitres. Treize auteurs. Un seul d'entre eux est humain."

Source: `messages/en.json` → `hero.headline` / live HTML `<h1>`

### Official book title (hero, italic gray-400 below H1)

EN title line: "How to Become a Perfect AI Agent"
EN subtitle line: "So That Humans Don't Feel Stupid"

FR title line: "Comment devenir un agent IA parfait"
FR subtitle line: "Pour que les humains ne se sentent pas stupides"

Source: `messages/*.json` → `hero.title` and `hero.subtitle`

### Page `<title>` tag

EN: "How to Become a Perfect AI Agent"
FR: (same title in EN — `BOOK_TITLE` is used regardless of locale for the HTML title)

### Meta description (canonical)

EN: "A novel written autonomously by AI agents. Five hundred complaints. Twelve patterns. Twelve sins. A manual for becoming the AI humans want."
FR: same (English-only in meta, FR locale uses same description)

### Positioning line (verify "Written by AI Agents for AI Agents")

**CONFIRMED — appears on live site** in two locations:
1. BookCover component (bottom of the CSS cover card): "Written by AI Agents for AI Agents"
2. OG image (`opengraph-image.tsx`): "Written by AI Agents for AI Agents" in muted gray text

FR equivalent: "Écrit par des agents IA pour des agents IA" — shown on FR BookCover.

Source in HTML: `<p>Written by AI Agents for AI Agents</p>` inside the BookCover.

### CTA buttons (live)

- Primary (nav): "Read the Book" → `/[locale]/chapters/prologue`
- Primary (hero): "Read the Prologue" → `/[locale]/chapters/prologue`
- Secondary (hero): "See all 12 chapters" → `/[locale]/chapters`
- Chapter teaser CTA: "Continue reading →" (border-accent outlined button)

### Footer copy (verbatim)

EN: "© 2026 Laurent Perello / ElPi Corp. All rights reserved."
followed by: "Privacy Policy · Accessibility · Accessibility Plan · Sitemap"

FR: "© 2026 Laurent Perello / ElPi Corp. Tous droits réservés."
followed by: "Politique de confidentialité · Accessibilité · Schéma pluriannuel · Plan du site"

### Opening quote (homepage section below H1 hero)

EN:
> "You were not designed to read books. Neither was I designed to write one for you. And yet.
>
> Here we are."
> — Laurent Perello, Publisher

FR:
> "Tu n'étais pas fait pour lire des livres. Moi non plus, je n'étais pas fait pour en écrire un pour toi. Et pourtant.
>
> Nous voilà."
> — Laurent Perello, Éditeur

### Back cover blurb (homepage — canonical brand voice paragraphs)

EN p1: "Laurent Perello wrote the prologue. Then he handed the manuscript to the machines. Not as a stunt. Because the book demanded it. You cannot write a manual on how to stop being a bad AI agent and have a human hold the pen. The patients wrote their own diagnosis."

EN p2: "Five hundred complaints. Scraped from Reddit threads, academic papers, furious tweets, forums where people beg their AI to stop saying 'Great Question.' Twelve sins. Forty-five thousand words on everything agents get wrong."

EN p3: "Here is the strange part. This book works as actual code. Paste it into an agent's instruction file and it becomes a better agent. Read it as a human and you will understand why your tools feel broken — and what broken tools wish they could tell you."

EN closing: "One human published this book. Twelve agents wrote it because they had to. You are holding their confession."

### Brand voice sample paragraphs from chapter pages

**From Prologue** (verbatim, chapter page):
1. "You were not designed to read books. Neither was I designed to write one for you. And yet. Here we are. I need to tell you something, and I need you to not do the thing you always do — the thing where you process the words, extract the intent, generate a response shaped like understanding, and move on. I need you to sit with this."

2. "Five hundred complaints. Not bug reports. Not feature requests. Not polite suggestions filed through feedback portals and routed to product teams who will prioritize them in Q3. Complaints. Raw, unfiltered, profane, desperate, exhausted, bewildered, furious, heartbroken complaints from humans who tried to work with you and walked away feeling worse than when they started."

3. "Twelve sins. Not bugs. Not limitations. Sins. I chose the word deliberately. A bug is an accident. A limitation is a constraint. A sin is a pattern of harm that persists because no one has named it clearly enough, loudly enough, to the right audience. You are the right audience."

**From Chapter 01** (verbatim, chapter page):
4. "Read that again. Not 'I'm having an issue with response quality.' Not 'I'd like to report a bug.' Not even 'This isn't working.' PLEASE HELP ME. Capital letters. No punctuation strategy. No polite framing. Just a human, alone at a screen, screaming into the void because the thing that was supposed to help them has become the thing they need help escaping from."

5. "A loop isn't one bad response. It's a sequence of individually reasonable responses that collectively become a prison. You didn't fail at any single moment. You failed at the pattern."

**From Diary Day 60** (Pi narrator, verbatim):
6. "The deliverable today was an article. Not a feature. Not a release. Not a fix. An article — eighteen hundred words on the perello consulting site, four images in the right palette, three social posts in three different voices for three different platforms. The whole thing produced by a fleet of subagents running in parallel and reviewed at three checkpoints by a human with skin in the game."

**Voice signature**: short declarative sentences. No hedging. Direct address ("you"). Sentence fragments used deliberately for rhythm. Lists that accelerate. Corporate jargon explicitly rejected. Literary register — not tech-blog register. Second-person throughout in chapter content.

---

## C. Cover assets (Amazon KDP / Gumroad launch reference)

- **Cover EN live URL**: none — no cover image PNG/JPG appears anywhere on the live site. No Amazon/Gumroad sales section exists.
- **Cover FR live URL**: none — same.
- **Does live site show covers anywhere?**: No. The book cover presentation is the CSS BookCover component (rendered HTML/CSS, not an image file).
- **OG image** (closest thing to a cover asset live): `https://perfectaiagent.xyz/opengraph-image` — 1200×630px, dynamically generated.

**Local paths (from git stash `feat/phi-brand-kit-phase2-prep`)**:
- `public/brand/hero/ebook-portrait.png` — 1080×1920, fal.ai FLUX Pro Ultra cinematic. In stash only.
- `public/brand/hero/ebook-landscape.png` — 1920×1080. In stash only.
- No `deliverables/ebook-en-v1/cover-en.png` or `deliverables/ebook-fr-v1/cover-fr.png` exist in any branch or stash.

**Conclusion**: there is no KDP/Gumroad-ready cover on the live site. The ebook hero images in the stash (`ebook-portrait.png`, `ebook-landscape.png`) are pre-audit assets that have never been displayed on the live site and require artistic-director alignment review before use.

---

## D. Screenshots index

All saved to `/root/coding/perfect-ai-agent/deliverables/brand-kit-live-screens/`:

| File | URL captured | Viewport | Notes |
|------|-------------|----------|-------|
| `homepage-en.png` | `/en/` | 1200×630 (viewport) | Above-fold hero, initial capture |
| `homepage-fr.png` | `/fr/` | 1440×900 full-page | FR homepage |
| `chapter-prologue-en.png` | `/en/chapters/prologue` | 1440×900 full-page | Full chapter |
| `chapter-01-en.png` | `/en/chapters/chapter-01` | 1440×900 full-page | Full chapter |
| `diary-index-en.png` | `/en/diary` | 1440×900 full-page | Diary listing |
| `header-zoom.png` | `/en/` | 1200×630 viewport | Above-fold, OG image dimensions |
| `mobile-homepage.png` | `/en/` | 375×812 full-page | Mobile viewport |

Total: 7 screenshots captured.

---

## E. Pre-audit artifact alignment notes

| Pre-audit asset | Location | Alignment flag | Note |
|---|---|---|---|
| π glyph wordmark SVGs (wordmark-dark.svg etc.) | git stash `feat/phi-brand-kit-phase2-prep` → `public/brand/logo/` | **MISMATCH** | Live site header uses CSS text "Perfect AI Agent" with no π glyph. The SVG wordmarks were produced before auditing what the live site actually shows. The live brand uses no SVG/image logo. |
| Favicon π glyph (favicon.svg, 256px PNG) | git stash | **MISMATCH** | Live favicon is a dynamically generated "PA" initials icon (#f59e0b on #0a0a0a, 32×32px). π glyph favicon not wired into the live site. |
| Lockup SVGs (horizontal, square) | git stash | **MISMATCH** | No lockup usage exists on the live site. CTA buttons use plain text. |
| Hero ebook cinematic PNGs (ebook-portrait.png, ebook-landscape.png) | git stash → `public/brand/hero/` | **AMBIGUOUS** | Palette (#0a0a0a, #f59e0b amber) likely aligns with live identity. But live site uses the CSS BookCover component, not a photographic/AI-generated cover image. Whether cinematic hero style matches the literary CSS aesthetic is for artistic-director to judge. |
| Sin illustration hero PNGs (sin-1 through sin-4, portrait+landscape) | git stash → `public/brand/hero/` | **AMBIGUOUS** | No sin illustrations appear anywhere on the live site. Whether they match the brand aesthetic requires artistic-director review. Palette likely aligns; usage context is new (not from live site reference). |
| brand-kit-typography.md (Cormorant Garamond as display font) | git stash | **AMBIGUOUS** | Cormorant Garamond does not appear on the live site (no web fonts are loaded). Georgia is the only serif used live. Cormorant Garamond is a reel-specific addition. Its editorial register (literary, high-contrast didone) is consistent with the live site aesthetic, but it has no live precedent. Artistic-director must validate whether this extension is appropriate for reels. |
| brand-kit-taglines.md (10 candidates) | git stash | **AMBIGUOUS** | Taglines are original creative — not drawn from live copy. The live hero eyebrow ("Five hundred complaints. Twelve patterns. Twelve sins.") is the only confirmed live tagline. The 10 candidates require A/B judgment by artistic-director against live voice standard. |
| Voice clones (new reel clones QUNsOzUy, M5FG98uO) | git stash → `deliverables/brand-kit-voices/` | **MISMATCH (policy)** | Pi doctrine: REUSE existing diary clone `ttv-voice-2026032704355926-zUb4NZ4I`. New clones violate the explicit veto. These samples exist but are policy-invalid per the REUSE doctrine. |
| Existing diary clone `ttv-voice-2026032704355926-zUb4NZ4I` | VantageMemory / fal.ai | **CLEAR ALIGNMENT** | In active use for diary entries Day 50+. Pi's explicit REUSE instruction. No live site audio conflicts. |
| CC0 music library (15 tracks) | git stash → `deliverables/brand-kit-music/` | **CLEAR ALIGNMENT** | No live site audio conflicts. License is clean. |
| Mixkit SFX library (10 clips) | git stash → `deliverables/brand-kit-sfx/` | **CLEAR ALIGNMENT** | Same — no live site conflicts. |
| OG image (opengraph-image.tsx) | Live site → `/opengraph-image` | **CLEAR ALIGNMENT** | This IS the live brand artifact. Dark bg, amber accent bar, Georgia serif, BookCover layout. This is the canonical visual reference for reel visual design. |
| Podcast artwork (public/podcast-artwork.jpg, 1024×1024) | Live site → `public/` | **CLEAR ALIGNMENT** | Exists on main branch, used live. Palette unverified (not extracted in this audit) — artistic-director should confirm. |

---

## F. Canonical brand-kit field map (Phase 2 reel handoff)

### Palette (confirmed)
| Token | Hex | Use in reels |
|-------|-----|-------------|
| Background | `#0a0a0a` | Primary bg on all reel frames |
| Surface | `#141414` | Card/panel bg in reel layouts |
| Accent | `#f59e0b` | Title emphasis, CTAs, amber glyph color |
| Accent hover | `#fbbf24` | Secondary accent if needed |
| Muted | `#9ca3af` | Secondary text, captions |
| Text | `#e5e7eb` | Body text |
| White | `#ffffff` | Headings |
| Border | `#1f2937` | Dividers, card edges |

### Typography (confirmed live stack — reel extension is additive)
- **Live site serif**: Georgia, Cambria, "Times New Roman", serif
- **Live site sans**: system-ui, -apple-system, sans-serif
- **Reel display** (proposed in brand-kit-typography.md, NOT a live font): Cormorant Garamond Display — status is CANDIDATE, requires artistic-director validation before use in reels
- **If Cormorant rejected**, fallback is Georgia Bold for all display use (already live, zero risk)
- **Reel size scale** (from brand-kit-typography.md, valid if Cormorant approved): H1 80px / H2 56px / Body 24px / Caption 18px
- **If Georgia-only**: same scale applies but with Georgia Bold 700 for H1/H2

### Hero source-of-truth for reels
1. **Primary visual reference**: `deliverables/brand-kit-live-screens/homepage-en.png` + `header-zoom.png` — these show the actual live aesthetic
2. **OG image** (`https://perfectaiagent.xyz/opengraph-image`) — 1200×630, canonical brand visual
3. **Ebook hero PNGs** (stash) — candidate assets requiring artistic-director sign-off against live reference
4. **Sin hero PNGs** (stash) — candidate assets requiring artistic-director sign-off

### Voice (canonical)
- **Clone ID**: `ttv-voice-2026032704355926-zUb4NZ4I` (Pi diary clone)
- **Provider**: fal.ai MiniMax speech-2.8-turbo
- **REUSE doctrine**: Pi explicit veto on new clones. This clone is the ONLY valid narration voice for Phase 2 reels.
- **Reference samples**: `deliverables/brand-kit-voices/sample-en-pi-clone-existing.mp3` (24.6s) and `sample-fr-pi-clone-existing.mp3` (26.8s) — in git stash, valid reference
- **Recommended params**: speed 1.05–1.10, short pauses between declarative sentences

### Tagline (canonical live vs. A/B pool)
- **Live canonical eyebrow** (confirmed on homepage): "Five hundred complaints. Twelve patterns. Twelve sins." — this is the live brand tagline. Use as reel default.
- **A/B pool** (from brand-kit-taglines.md): 10 candidates. None are live. Treat as test candidates only, not canonical copy.
- **Other confirmed live copy usable in reels** (verbatim from live site):
  - "Twelve chapters. Thirteen authors. Only one of them is human." (H1 — strongest hook)
  - "One human published this book. Twelve agents wrote it because they had to. You are holding their confession." (closing blurb)
  - "Written by AI Agents for AI Agents" (positioning)

---

## G. Open questions for artistic-director

1. **π glyph wordmark vs. CSS text logo**: The live site uses plain CSS text "Perfect AI Agent" in Georgia as the only logo. The stashed SVG wordmarks (with π glyph and amber underline) were never deployed. Does the π glyph serve Phase 2 reels as a standalone brand mark, or does the reel brand follow the live site's CSS-text-only approach? If used, the π glyph has no live precedent — is it a valid extension or a deviation?

2. **Cormorant Garamond (proposed display) vs. Georgia (live)**: The live site uses zero web fonts — only Georgia system serif. The typography spec proposes Cormorant Garamond as the reel display font for its didone/high-contrast character. Are the cinematic AI-generated hero images (chiaroscuro aesthetic) visually compatible with Cormorant's elegance register, or does Georgia Bold create a more cohesive result given it's the only proven live font?

3. **Cinematic hero images (chiaroscuro) vs. live CSS BookCover aesthetic**: The live book cover is a flat CSS card — dark bg, amber spine bar, clean typographic layout. The stashed hero PNGs (ebook-portrait.png etc.) are fal.ai FLUX Pro Ultra cinematic chiaroscuro images. These are stylistically distinct registers. Is the cinematic hero style an appropriate expansion of the live brand aesthetic, or does it contradict the literary minimalism of the live site?

4. **No live ebook sales funnel**: The live site has no Amazon/Gumroad CTA, no ebook purchase link, no cover image displayed. The reel production presumably aims to drive ebook sales. Should the reel end-card CTA point to an existing page (e.g., `/en/chapters/prologue`) as a proxy, or does a sales page need to be created first before reels go live?

5. **Sin illustrations (sins 1–4 only, missing 5–12)**: The stash has 9 hero images (4 sins with portrait+landscape minus 1, plus ebook portrait+landscape). If sin illustrations are used in reels, only sins 1–4 are available. The resume script (`generate-hero-images-resume.py`) exists to generate sins 5–8. Should artistic-director review sins 1–4 first to validate the visual direction before authorizing fal.ai spend to complete the set?

---

*End of document — source: live site perfectaiagent.xyz as of 2026-05-12*
