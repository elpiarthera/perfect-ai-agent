# Typography — Perfect AI Agent brand kit

**Date**: 2026-05-12
**Maintainer**: Phi (Phase 2 prep)
**Branch**: feat/phi-brand-kit-phase2-prep
**Status**: Approved for Phase 2 reel production

---

## Font stack

- **Display**: Cormorant Garamond — specifically the `Cormorant` Display subfamily (Google Fonts, Christian Thalmann, SIL Open Font License 1.1)
  - URL: `https://fonts.google.com/specimen/Cormorant+Garamond`
  - Weights used in this kit: Light 300, Regular 400, SemiBold 600, Bold 700
- **Primary serif**: Georgia (system-installed)
  - Fallback stack: `Georgia, "Times New Roman", serif`
- **Sans / UI**: system-ui (system-installed)
  - Fallback stack: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`

---

## Display font choice — winner + rationale

**Winner: Cormorant Garamond (Cormorant Display variant)**

Cormorant Garamond wins because it was designed explicitly for display use. Christian Thalmann built the Display subfamily to perform at sizes above 48px — the contrast between thick and thin strokes sharpens rather than degrades as size increases. On a `#0a0a0a` background at 80px, the thin strokes remain legible (not ghosted) because the letterforms have enough structure to hold. With `#f59e0b` amber as the accent color, the high-contrast skeleton of Cormorant creates a natural hierarchy: the warm gold reads as editorial emphasis rather than UI alert. That combination — dark field, high-contrast serif, amber accent — lands precisely in the Penguin Classics / Aeon magazine / Lynch title card register the brand requires.

The weight range is the deciding structural argument. Italiana is a single-weight typeface (Regular only). It is beautiful, but a reel title card system requires at minimum two display weights: one for the H1 hero moment, one for the H2 subhead. Building that contrast with Italiana means resorting to size alone, which on a 1080×1920 canvas creates a monotone rhythm. Cormorant Garamond's Light 300 through Bold 700 range gives the H1/H2 pairing genuine tonal separation without changing typeface — the eye reads the hierarchy as intentional, not accidental. Italiana is also culturally coded toward fashion (Vogue, Town and Country). The Perfect AI Agent is a literary-philosophical novel about AI failure and human accountability. Fashion-adjacent elegance is the wrong register.

Domine is disqualified on character. It is a screen-optimized slab-influenced serif: sturdy, legible, contemporary. Those are virtues for body copy on digital interfaces, not for cinematic title cards. Domine at 80px reads as an editorial CMS template. The brand needs something that feels like it was typeset before the internet existed. Cormorant Garamond has that quality; Domine does not. Domine also competes with Georgia (both are workhorse screen serifs in the same weight class), creating a redundant pairing rather than a clear hierarchy. Cormorant's display-scale elegance is categorically different from Georgia's text-scale reliability — they complement each other. Domine and Georgia cancel each other.

---

## Size scale (reel @1080×1920)

| Level | Size | Font | Weight | Letter-spacing | Use case |
|-------|------|------|--------|----------------|----------|
| H1 reel | 80px | Cormorant (Display) | Bold 700 | -2% | Title card hero line |
| H2 reel | 56px | Cormorant (Display) | SemiBold 600 | -1.5% | Subhead / chapter label |
| H3 callout | 40px | Georgia | Bold 700 | -0.5% | Pull quote, callout block |
| Body | 24px | Georgia | Regular 400 | 0% | Narrative body text |
| Caption | 18px | system-ui | Regular 400 | -0.5% | UI labels, dates, metadata |

Notes on the scale:

- H1 at Bold 700 rather than Black 900 is deliberate. Cormorant's thin strokes at 700 maintain the high-contrast didone quality on dark backgrounds. At 900 the thin strokes collapse and the typeface loses its distinguishing character.
- H2 at SemiBold 600 creates a legible step down from H1 without falling to Regular, which at 56px on dark can read as underweight.
- H3 uses Georgia rather than Cormorant to signal the shift from display to editorial content. Georgia at 40px Bold is authoritative without competing with the display register above it.
- Body at 24px is sized for comfortable reading at arm's length on a phone screen (the primary reel consumption context).
- Caption at 18px uses system-ui deliberately: it signals "this is metadata, not content" through the font switch alone.

---

## Weight scale (cross-font)

- **Regular 400** — body copy (Georgia), default display when neutral tone is required
- **SemiBold 600** — display H2, emphasis within body (use sparingly — max one phrase per paragraph)
- **Bold 700** — display H1, H3 callout (Georgia Bold), primary emphasis
- **Black 900** — reserved for end-card hero moment only (e.g., book title on final reel frame, standalone cover treatment). Never use in running text or multi-line compositions.

---

## Letter-spacing guide

The tracking philosophy follows one principle: large type needs less air, small type needs more. At display sizes (56px and above), letterforms have sufficient internal whitespace that adding external space between characters creates a slack, poster-advertisement feeling. The brand register is literary, not commercial — tighten the display to -1.5% to -2% to achieve the compressed, concentrated feeling of a well-typeset book title page. The exception is all-caps settings: if a title is set in uppercase, relax the tracking to 0% to compensate for the visual density of capital letterforms.

At body size (24px) tracking should rest at 0%. Georgia was designed with appropriate internal spacing for text sizes — do not correct what is not broken. A slight positive track (+0.5%) is acceptable for short caption-length lines in small type where legibility on a compressed mobile screen is a concern.

Avoid tracking below -2% at any size. Below that threshold, individual letterforms begin to merge at the joints on dark backgrounds (particularly where amber `#f59e0b` accent text is used on `#0a0a0a`), creating an illegibility problem that is most visible in the thin strokes of Cormorant's serifs.

---

## Pairing rules

**Cormorant (Display) + Georgia: how to combine**

These two fonts share a common origin (both are roman serifs with classical proportions) but occupy categorically different scales. The pairing works precisely because of that difference. Use Cormorant Display only where size is 48px or above. Use Georgia at 40px and below. Never use both in the same size band — a Cormorant H2 at 56px alongside a Georgia H3 at 48px will create a confused hierarchy where the viewer cannot determine which font is "more important."

On reel title cards, the standard composition structure is:

1. H1 (Cormorant Bold 700, 80px, `#f5f0e8` or `#f59e0b` for accent titles) — top third or center
2. H2 (Cormorant SemiBold 600, 56px, `#c9b99a` muted warm) — directly below H1
3. Caption (system-ui Regular 400, 18px, `#6b6b6b`) — bottom margin, metadata line

Georgia enters only when a reel contains a body text block (excerpt, pull quote). In that case: Cormorant H1 at top, Georgia body at 24px in the body zone, system-ui caption at bottom. Do not introduce Cormorant and Georgia in adjacent lines at comparable sizes.

**Do / Don't:**

- Do: Cormorant H1 title in `#f59e0b` amber on `#0a0a0a`, Georgia body excerpt in `#e8e0d0` below
- Do: Cormorant H2 subhead above a photographic hero image (the high contrast of the font reads through complex backgrounds)
- Do not: mix Cormorant Regular and Georgia Regular at the same or adjacent size — they are too similar to create hierarchy, too different to feel unified
- Do not: use Cormorant below 32px — the thin strokes become illegible on screen at small sizes
- Do not: set Cormorant in all-lowercase for H1 unless the title is a single word — multi-word lowercase Cormorant at display scale loses its structural authority

---

## Web import

Google Fonts CSS `@import` for Cormorant Garamond (Display subfamily, weights used in this kit):

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Cormorant:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&display=swap');
```

`font-display: swap` is mandatory. Reel title cards are image-generated (not live web rendering), but for any web-facing use of this type system, swap prevents invisible text during font load.

For the Cormorant Display variant specifically (optimized for large-scale use), request the `Cormorant` family (not `Cormorant+Garamond`) — it is a separate Google Fonts entry containing the Display, SC, Infant, Roman, and Unicase subfamilies. In the import above, both are included: `Cormorant+Garamond` for body-adjacent uses, `Cormorant` (Display) for H1/H2 reel title cards.

Alternative self-hosted approach (recommended for Rho reel template to eliminate network dependency at render time):

Download the `.ttf` or `.woff2` files from the Google Fonts GitHub repository (`github.com/google/fonts/tree/main/ofl/cormorantgaramond`) and serve from `/public/fonts/`. Use `@font-face` with `font-display: block` for reel generation contexts where flash of unstyled text is not a concern.

---

## Phase 2 handoff

**For Rho reel template — exact specs:**

**H1 title card:**
- Font family: `'Cormorant', Georgia, serif` (Display variant)
- Font size: `80px`
- Font weight: `700`
- Letter-spacing: `-0.02em` (equivalent to -2%)
- Line height: `1.1`
- Color (default): `#f5f0e8` (warm off-white)
- Color (accent/hero title): `#f59e0b` (amber)
- Background assumed: `#0a0a0a`
- Max width: `900px` (leaves 90px margin each side at 1080px canvas width)

**H2 subhead:**
- Font family: `'Cormorant', Georgia, serif` (Display variant)
- Font size: `56px`
- Font weight: `600`
- Letter-spacing: `-0.015em` (equivalent to -1.5%)
- Line height: `1.2`
- Color: `#c9b99a` (muted warm, clearly subordinate to H1)

**Body color rules on dark:**
- Primary body text: `#e8e0d0` (warm light, not pure white — avoids harsh contrast fatigue)
- Secondary / de-emphasized body: `#a09080`
- Accent / highlighted phrase: `#f59e0b`
- Never use pure `#ffffff` on `#0a0a0a` — the contrast ratio is technically accessible but visually harsh for literary reading contexts
- Never use cool grays (e.g., `#d1d5db`) — the brand palette is warm-toned throughout; cool neutrals break the cinematic register

**Minimum safe zone for text placement on 1080×1920:**
- Left/right margin: 80px minimum
- Top safe zone: top 120px reserved (status bar / platform chrome)
- Bottom safe zone: bottom 180px reserved (CTA overlay / platform navigation)
- Active text area: 920px wide × 1620px tall

---

*End of typography specification. Next document in Phase 2 brand kit: color system (`brand-kit-color.md`) and grid system for reel compositions (`brand-kit-grid.md`).*
