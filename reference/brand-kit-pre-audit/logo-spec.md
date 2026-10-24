# Perfect AI Agent — Logo System Specification
**Version:** 1.0  
**Date:** 2026-05-12  
**Author:** Phi (image-designer, ElPi Corp)  
**Branch:** feat/phi-brand-kit-phase2-prep

---

## 1. Concept

The "Perfect AI Agent" logo system is built for a literary work — not a tech product. The visual language draws from Penguin Classics, Taschen editorial design, and New Yorker masthead typography: severe, unhurried, confident. No gradients. No rounded corners. No "innovation" energy.

The system consists of one signature glyph (the π mark) paired with a three-word wordmark set in tight-tracked Georgia Bold allcaps. Amber (#f59e0b) appears only as a diacritical accent — a footnote mark, a small fire — never as a dominant fill. Every variant is designed to read at 16px and hold authority at 4096px.

---

## 2. Glyph: Stylized π (Pi)

**Choice: Option A — geometric π mark**

**Rationale:**

Pi is the AI narrator of the book. The mathematical constant π is irrational, infinite, never fully knowable — a precise metaphor for an AI that catalogs its own failures toward perfection. The glyph carries the book's thesis in a single symbol.

Technical survival at small sizes: the π reduces to three rectangles (one horizontal crossbar, two vertical legs) — maximum legibility at 16px favicon, where it reads as two distinct vertical strokes under a cap-line. No curves, no serifs on the glyph itself. This is intentional: the type sets the literary warmth; the glyph supplies geometric precision.

The amber underline below the glyph legs is the signature mark — a typographic footnote indicator, referencing the book's cataloguing of errors. It survives at 16px as a 1px amber line.

**Anatomy:**
- Crossbar: horizontal stroke, stroke-weight 1/8 of glyph width
- Left leg: vertical, flush left of crossbar inner quarter
- Right leg: vertical, flush right of crossbar inner quarter  
- Underline: centered amber bar, width = 1/4 glyph width, height = 1/16 glyph width, border-radius = 50%

---

## 3. Color Codes Per Variant

| Variant | Glyph fill | Wordmark fill | Tagline fill | Accent | Background |
|---------|-----------|---------------|-------------|--------|------------|
| wordmark-dark | `#ffffff` | `#ffffff` | `#9ca3af` | `#f59e0b` | transparent |
| wordmark-light | `#0a0a0a` | `#0a0a0a` | `#6b7280` | `#f59e0b` | transparent |
| wordmark-mono-white | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` | transparent |
| wordmark-mono-accent | `#f59e0b` | `#f59e0b` | `#f59e0b` | `#f59e0b` | transparent |
| lockup-horizontal | `#ffffff` | `#ffffff` | `#9ca3af` | `#f59e0b` | transparent |
| lockup-square | `#ffffff` | `#ffffff` | — | `#f59e0b` | transparent |
| favicon | `#ffffff` | — | — | `#f59e0b` | `#0a0a0a` |

**Brand palette reference:**
- Background dark: `#0a0a0a`
- Surface: `#141414`
- Ink white: `#ffffff`
- Ink dark: `#0a0a0a`
- Accent amber: `#f59e0b`
- Muted: `#9ca3af`
- Muted light: `#6b7280`

---

## 4. Typography Specification

**Font family:** Georgia, 'Times New Roman', serif  
**Weight:** 700 (Bold)  
**Case:** ALL CAPS  
**Font size (production):** 28px at 520px viewBox (scales proportionally)  
**Letter-spacing:** -0.4px at 28px (approximately -1.4% — tighter than default, avoids "spaced out" book title effect)  
**Tagline:** 9px, weight 400, letter-spacing 2.5–2.8px (all-caps tracked subtitle)

**Three-word separation:** amber interpunct dots (·) rendered as `<circle r="2.5" fill="#f59e0b"/>`. Not a slash, not a dash. The dot is the system's rhythmic punctuation — it appears exactly twice (between PERFECT·AI and AI·AGENT), creating a visual beat.

**Custom kerning notes:**
- No ligatures — allcaps setting with standard Georgia spacing is clean enough
- "AI" receives tighter treatment due to two-character width; flanked by ornament lines in square lockup
- "PERFECT" and "AGENT" are set at identical tracking — visual balance maintained
- Tagline "A NOVEL BY LAURENT PERELLO" deliberately wide-tracked (2.5px) to read as caption, not headline

---

## 5. Usage Rules

### DO
- Use wordmark-dark on backgrounds `#0a0a0a` or `#141414`
- Use wordmark-light on white or light paper backgrounds
- Use mono-white on photographs or colored backdrops
- Use mono-accent sparingly — embossed covers, foil treatments, limited accent applications only
- Use lockup-square for social avatars, book spine, press kit stamps
- Use lockup-horizontal for site header, email footers, document headers
- Use favicon as app icon / browser tab — at 16px it reads as a π mark

### DO NOT
- Do not place wordmark-dark on white backgrounds (white-on-white = invisible)
- Do not place wordmark-light on dark backgrounds (dark-on-dark = invisible)
- Do not stretch or skew any variant — use viewBox scaling only
- Do not recolor the glyph underline away from amber in the two-color variants (mono exceptions allowed)
- Do not add drop shadows, glows, or gradients to any variant
- Do not set the wordmark in lowercase or mixed case
- Do not use mono-accent as a primary logo on most placements — it is a highlight variant only
- Do not pair with sans-serif typography in logo proximity (defeat the editorial tone)
- Do not place on backgrounds below 3:1 contrast ratio with ink color

---

## 6. Minimum Sizes

| Context | Minimum size | Notes |
|---------|-------------|-------|
| Favicon (browser tab) | 16×16px | π glyph alone; amber underline = 1px line |
| UI inline (header, nav) | 24px height | Wordmark + glyph; tagline drops below 32px |
| UI standard | 32px height | Full lockup readable |
| Print caption | 20mm width | Wordmark only |
| Print body | 32mm width | Full lockup |
| Print display | No maximum | Scales to 4096px+ without quality loss |
| Social avatar (lockup-square) | 128×128px | Glyph + wordmark both legible |

---

## 7. Clear-Space Rule

Minimum clear space on all sides = **1× cap-height of the wordmark**.

At 28px font-size, cap-height ≈ 20px. Therefore minimum clear space = 20px on all sides at screen resolution. Scale proportionally with the mark.

In the lockup-square, the double-rule border frame embeds the clear-space concept: no external content should intrude into the frame zone.

---

## 8. File Index

| Path | Format | Dimensions | Purpose |
|------|--------|-----------|---------|
| `public/brand/logo/wordmark-dark.svg` | SVG vector | 520×72 viewBox | Dark bg — primary production |
| `public/brand/logo/wordmark-dark.png` | PNG RGBA | 1024×142px | Dark bg — web/social raster |
| `public/brand/logo/wordmark-light.svg` | SVG vector | 520×72 viewBox | Light bg — press/print |
| `public/brand/logo/wordmark-light.png` | PNG RGBA | 1024×142px | Light bg — web raster |
| `public/brand/logo/wordmark-mono-white.svg` | SVG vector | 520×72 viewBox | Photography overlays |
| `public/brand/logo/wordmark-mono-white.png` | PNG RGBA | 1024×142px | Photography overlays raster |
| `public/brand/logo/wordmark-mono-accent.svg` | SVG vector | 520×72 viewBox | Emboss/foil/accent applications |
| `public/brand/logo/wordmark-mono-accent.png` | PNG RGBA | 1024×142px | Accent raster |
| `public/brand/logo/lockup-horizontal.svg` | SVG vector | 580×60 viewBox | Site header, email, docs |
| `public/brand/logo/lockup-square.svg` | SVG vector | 320×320 viewBox | Social avatar, book spine, stamps |
| `public/brand/logo/favicon.svg` | SVG vector | 256×256 viewBox | Favicon master |
| `public/brand/logo/favicon.png` | PNG RGB | 256×256px | Favicon / app icon |

**Total files:** 12 (7 SVG + 5 PNG)

---

## 9. Rasterization Instructions (for future variants)

```bash
# From public/brand/logo/
python3 -c "
import cairosvg
cairosvg.svg2png(url='wordmark-dark.svg', write_to='wordmark-dark.png', output_width=1024)
"

# For print (4096px):
python3 -c "
import cairosvg
cairosvg.svg2png(url='wordmark-dark.svg', write_to='wordmark-dark-4096.png', output_width=4096)
"

# Favicon at all sizes:
for size in 16 32 64 128 256; do
  python3 -c "import cairosvg; cairosvg.svg2png(url='favicon.svg', write_to='favicon-${size}.png', output_width=${size}, output_height=${size})"
done
```
