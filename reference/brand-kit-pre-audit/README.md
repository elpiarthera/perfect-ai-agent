# Brand Kit — Pre-Audit Reference Artifacts

**Date**: 2026-05-12
**Status**: REFERENCE ONLY — produced by 7 sub-agents dispatched BEFORE the Step 0 audit. Retained for visibility and as input to the audit's REUSE/UPGRADE/PRODUCE/HYBRID decisions. **NOT for production use as-is.**

## Why this branch exists
Phi dispatched 7 production sub-agents in parallel without first auditing what already existed in the perfect-ai-agent repo + live site + VantagePeers memory. Laurent flagged the anti-pattern: production-first is wasteful. Pi acknowledged the fault and patched the task to require a Step 0 audit (REUSE-first). The pre-audit production was halted; outputs are preserved here as **REFERENCE ONLY** so Laurent can browse what was generated and the Step 0 audit can evaluate each artifact against existing repo assets.

Branch prefix `phi/...` (not `feat/...`) is intentional — explicit signal "reference, not for merge". No PR opened.

## Contents

### `logo/` — 12 files (7 SVG + 5 PNG)
Wordmark with stylized π glyph (Pi narrator symbol). 4 variants (light, dark, mono-white, mono-accent) + 2 lockups (horizontal, square) + favicon. Spec in `logo-spec.md`.

### `hero/` — 9 PNG (partial: 9/18 planned)
fal.ai FLUX Pro Ultra cinematic photographic hero illustrations. ebook (portrait + landscape) + sins 1-4 (portrait + landscape — sin-4 only portrait completed). fal.ai balance exhausted before sins 5-8 could be generated. Spec in `hero-spec.md`. `_generation-log.json` has prompts/seeds for resume.

### `taglines.md` — 10 candidates (5 EN + 5 FR)
5 frameworks each language. Sole-survivor picks: **EN-2** "The only book written by the mistake." / **FR-5** "Tous les contrôles étaient au vert. La page était fausse."

### `typography.md` — Display font choice
**Cormorant Display** chosen winner over Italiana + Domine. Full size/weight/letter-spacing scale.

### `sfx/` — 10 MP3 Mixkit license (4 categories)
Transitions (3) + Reveal (3) + Accents (2) + End-card (2). All commercial-use, attribution-not-required. Spec in `sfx-spec.md`.

### `music/` — 15 MP3 (3 moods × 5 tracks)
Build-up (5) + Tension (5) + Reflective (5). Downloaded but BPM analysis incomplete (subagent killed by Phi for patch compliance). Sources: Pixabay Music + FMA.

### `voice-invalidated.md` — Voice clones produced then invalidated
2 new fal.ai voice clones (EN `QUNsOzUy` + FR `M5FG98uO`) were generated before Pi patch landed. Pi explicit veto: REUSE existing Pi diary voice `ttv-voice-2026032704355926-zUb4NZ4I`. New clones are documented as INVALIDATED. No sample MP3s committed.

## Cost incurred pre-patch
- fal.ai voice-design: ~$0.072
- fal.ai FLUX Pro Ultra (9 hero PNG): ~$0.54
- fal.ai MiniMax speech samples: ~$0.016
- Mixkit + Pixabay/FMA downloads: $0
- **Total**: ~$0.63 burnt before reuse-first doctrine landed. Accepted as Pi's faute, not amplified.

## What happens next
The Step 0 audit (single `dev-tech-researcher` sub-agent dispatched 2026-05-12) is producing `deliverables/brand-kit-audit-2026-05-12.md` with REUSE/UPGRADE/PRODUCE/HYBRID verdict per deliverable. Laurent acks the audit. Only PRODUCE/UPGRADE/HYBRID verdicts trigger downstream production. REUSE = document only. The artifacts in this branch may be selected REUSE or REPRODUCE in the final brand kit depending on audit verdicts.
