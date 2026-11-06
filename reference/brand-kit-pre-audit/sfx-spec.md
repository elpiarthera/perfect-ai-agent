# SFX library — Phase 2 ebook reel
**Date**: 2026-05-12
**Total SFX**: 10 across 4 categories
**All licensed for commercial use**
**License**: Mixkit Sound Effects Free License — commercial use permitted, no attribution required
**License URL**: https://mixkit.co/license/

---

## Transitions (3)

| # | Title | Source | License | URL | Duration | Bitrate | Path |
|---|-------|--------|---------|-----|----------|---------|------|
| 1 | Cinematic whoosh fast transition | Mixkit (ID 1492) | Mixkit Free | https://mixkit.co/free-sound-effects/whoosh/ | 1.33s | 255kbps / 44.1kHz | deliverables/brand-kit-sfx/transitions/01-whoosh.mp3 |
| 2 | Glitch sci fi rewind transition | Mixkit (ID 1093) | Mixkit Free | https://mixkit.co/free-sound-effects/glitch/ | 3.70s | 252kbps / 44.1kHz | deliverables/brand-kit-sfx/transitions/02-glitch.mp3 |
| 3 | Short bass hit | Mixkit (ID 2299) | Mixkit Free | https://mixkit.co/free-sound-effects/bass/ | 1.10s | 249kbps / 44.1kHz | deliverables/brand-kit-sfx/transitions/03-hit.mp3 |

## Text reveal (3)

| # | Title | Source | License | URL | Duration | Bitrate | Path |
|---|-------|--------|---------|-----|----------|---------|------|
| 4 | Old typewriter typing | Mixkit (ID 1372) | Mixkit Free | https://mixkit.co/free-sound-effects/typewriter/ | 5.04s | 192kbps / 44.1kHz | deliverables/brand-kit-sfx/reveal/04-typewriter.mp3 |
| 5 | Fast small sweep transition | Mixkit (ID 166) | Mixkit Free | https://mixkit.co/free-sound-effects/sweep/ | 0.78s | 265kbps / 44.1kHz | deliverables/brand-kit-sfx/reveal/05-swipe.mp3 |
| 6 | Achievement bell | Mixkit (ID 600) | Mixkit Free | https://mixkit.co/free-sound-effects/bell/ | 2.40s | 203kbps / 44.1kHz | deliverables/brand-kit-sfx/reveal/06-chime.mp3 |

## Accents (2)

| # | Title | Source | License | URL | Duration | Bitrate | Path |
|---|-------|--------|---------|-----|----------|---------|------|
| 7 | Slow heartbeat (trimmed 4s) | Mixkit (ID 494) | Mixkit Free | https://mixkit.co/free-sound-effects/heartbeat/ | 4.05s | 191kbps / 44.1kHz | deliverables/brand-kit-sfx/accents/07-heartbeat.mp3 |
| 8 | Bell notification | Mixkit (ID 933) | Mixkit Free | https://mixkit.co/free-sound-effects/notification/ | 3.36s | 247kbps / 44.1kHz | deliverables/brand-kit-sfx/accents/08-alert.mp3 |

## End card (2)

| # | Title | Source | License | URL | Duration | Bitrate | Path |
|---|-------|--------|---------|-----|----------|---------|------|
| 9 | Cinematic trailer riser | Mixkit (ID 790) | Mixkit Free | https://mixkit.co/free-sound-effects/cinematic/ | 2.57s | 252kbps / 44.1kHz | deliverables/brand-kit-sfx/end-card/09-sting.mp3 |
| 10 | Cinematic horror trailer long sweep | Mixkit (ID 561) | Mixkit Free | https://mixkit.co/free-sound-effects/cinematic/ | 8.59s | 239kbps / 44.1kHz | deliverables/brand-kit-sfx/end-card/10-riser.mp3 |

---

## Attribution requirements

**None.** All 10 SFX are sourced from Mixkit under the Mixkit Sound Effects Free License, which permits commercial use with no attribution required. No credits line needed in the final reel.

---

## Technical verification

All files confirmed:
- Format: MP3 (MPEG ADTS Layer III)
- Sample rate: 44100 Hz (all pass >= 44100 Hz requirement)
- Bitrate: 191–265 kbps (all pass >= 128 kbps requirement)
- Total count: 10 files across 4 directories

Processing note:
- `07-heartbeat.mp3`: original was 45s loop; trimmed to 4.05s via ffmpeg (192kbps, 44.1kHz) to extract a 2-beat slow accent.
- `04-typewriter.mp3`: original was 24s; trimmed to 5.04s via ffmpeg for a punchy rapid-key burst.

---

## Phase 2 handoff — SFX usage map

| Beat in reel | SFX | File | Rationale |
|---|---|---|---|
| 0:00 — Cold open | 10-riser | `end-card/10-riser.mp3` | 8.6s tension build from silence into title reveal |
| 0:08 — Title slam | 03-hit | `transitions/03-hit.mp3` | Sub-bass impact punctuates title appearance |
| 0:09 — Title text types in | 04-typewriter | `reveal/04-typewriter.mp3` | Keys sound as title letters animate |
| 0:14 — Scene cut 1 | 01-whoosh | `transitions/01-whoosh.mp3` | Cinematic cut to chapter excerpt |
| 0:15 — Text reveal (excerpt) | 05-swipe | `reveal/05-swipe.mp3` | Sub-second swipe as line of text slides in |
| 0:22 — Scene cut 2 | 02-glitch | `transitions/02-glitch.mp3` | Glitch transition — AI/digital theme reinforcement |
| 0:26 — Heartbeat moment | 07-heartbeat | `accents/07-heartbeat.mp3` | Slow beat under "human vs AI" tension beat |
| 0:30 — Alert / hook line | 08-alert | `accents/08-alert.mp3` | Soft bell punctuates key copy line |
| 0:34 — Word reveal | 06-chime | `reveal/06-chime.mp3` | Chime on final word reveal / "perfect" beat |
| 0:36 — End card | 09-sting | `end-card/09-sting.mp3` | 2.6s dramatic sting locks in end card + URL |

---

## Category substitution log

| # | Requested | Delivered | Reason |
|---|---|---|---|
| 9 | Dramatic ending sting | "Cinematic trailer riser" (ID 790) | No dedicated "sting" category on Mixkit; this 2.57s cinematic punctuation mark functions identically — short, dramatic, final. Used as sting. |
| 10 | Building tension riser | "Cinematic horror trailer long sweep" (ID 561) | Direct match — 8.59s building sweep with rising tension arc, ideal pre-reveal riser. |
