# Narration voices — Phase 2 ebook reel
**Date**: 2026-05-12
**Verdict**: Option B — new reel clones produced

---

## Existing Pi clone (baseline)

- voice_id: `ttv-voice-2026032704355926-zUb4NZ4I`
- Provider: fal.ai MiniMax speech-2.8-turbo
- Trained for: diary narration (slow, contemplative, ~150 wpm)
- Used in: Days 50-66 diaries on perfectaiagent.xyz (EN + FR)
- Memory ref: `j576105d1nnrb7xhd266sbhw5183ndbd`
- Sample EN: `brand-kit-voices/sample-en-pi-clone-existing.mp3` — 24.6s, 384KB (speed: 1.1)
- Sample FR: `brand-kit-voices/sample-fr-pi-clone-existing.mp3` — 26.8s, 419KB (speed: 1.1)

---

## A/B verdict

The existing Pi clone hits the timing target at speed 1.1 (24-27s for the reel script) but the prosodic envelope is wrong for ad format. The clone was trained on contemplative diary audio: its breath patterning, pause weighting, and stress distribution are calibrated for meditative listening, not attention-capture. A speed multiplier accelerates the signal without reshaping it — you get a faster slow narrator, not an ad narrator. For production-grade Amazon KDP / Gumroad reel content, the first 3 seconds must create forward pull. The diary clone does not do this. Option B is the correct call.

---

## New voice clones produced

### EN reel voice

- voice_id: `ttv-voice-2026051301303726-QUNsOzUy`
- Provider: fal.ai MiniMax voice-design + speech-2.8-turbo
- Model: `fal-ai/minimax/voice-design`
- Training prompt: Female, mid-thirties, European accent, clear precise articulation. Calm authority with forward momentum — podcast host meets cinematic trailer narrator. Sharp consonants, controlled breath, confident pacing. Measured intensity, every word lands.
- Sample: `brand-kit-voices/sample-en-pi-reel-QUNsOzUy.mp3` — 27.3s, 425KB
- Preview (voice-design output): `brand-kit-voices/preview-en-pi-reel-QUNsOzUy.mp3` — 20.0s, 235KB
- Speed used for sample: 1.0 (ad-tempo built into voice design, no speed shift needed)
- Tone tags: `ad-tempo`, `calm-authority`, `cinematic`, `european`, `female`, `sharp-consonants`

### FR reel voice

- voice_id: `ttv-voice-2026051301310926-M5FG98uO`
- Provider: fal.ai MiniMax voice-design + speech-2.8-turbo
- Model: `fal-ai/minimax/voice-design`
- Training prompt: Voix féminine trentaine, accent français cultivé, articulation précise. Autorité calme avec énergie portée vers l'avant — présentatrice podcast / bandes-annonces cinématographiques. Consonnes tranchées, souffle maîtrisé, rythme confiant. Intensité mesurée.
- Sample: `brand-kit-voices/sample-fr-pi-reel-M5FG98uO.mp3` — 26.7s, 417KB
- Preview (voice-design output): `brand-kit-voices/preview-fr-pi-reel-M5FG98uO.mp3` — 20.9s, 246KB
- Speed used for sample: 1.0 (ad-tempo built into voice design)
- Tone tags: `ad-tempo`, `autorité-calme`, `cinématique`, `français`, `féminine`, `articulation-nette`

---

## Sample durations summary

| File | Duration | Size | Voice | Use |
|------|----------|------|-------|-----|
| sample-en-pi-clone-existing.mp3 | 24.6s | 384KB | ttv-voice-...zUb4NZ4I | Diary EN (baseline) |
| sample-fr-pi-clone-existing.mp3 | 26.8s | 419KB | ttv-voice-...zUb4NZ4I | Diary FR (baseline) |
| sample-en-pi-reel-QUNsOzUy.mp3 | 27.3s | 425KB | ttv-voice-...QUNsOzUy | Reel EN (production) |
| sample-fr-pi-reel-M5FG98uO.mp3 | 26.7s | 417KB | ttv-voice-...M5FG98uO | Reel FR (production) |

---

## Production usage rules

### Voice assignment by content type

| Content type | EN voice | FR voice |
|-------------|----------|----------|
| Diary narration (audiobook, slow) | `ttv-voice-2026032704355926-zUb4NZ4I` | `ttv-voice-2026032704355926-zUb4NZ4I` |
| Reel / ad voiceover (30-60s) | `ttv-voice-2026051301303726-QUNsOzUy` | `ttv-voice-2026051301310926-M5FG98uO` |
| Title card narration | `ttv-voice-2026051301303726-QUNsOzUy` | `ttv-voice-2026051301310926-M5FG98uO` |
| End card CTA | `ttv-voice-2026051301303726-QUNsOzUy` | `ttv-voice-2026051301310926-M5FG98uO` |

### Pause format (MiniMax markup)
- `<#0.5#>` — short beat between punchy sentences (reel format)
- `<#1.0#>` — section break (diary format)
- `<#1.5#>` — long pause (intro / outro)
- Memory ref for pause format: `j57fg47bheegmrfgfdgys2a2yx83yvhx`

### Technical parameters
- Model: `fal-ai/minimax/speech-2.8-turbo`
- Speed: `1.0` for reel voices (ad-tempo is embedded in voice design)
- Speed: `1.0` to `1.05` for diary voice (native tempo)
- Max characters per chunk: 5000
- Do not use speed > 1.15 on any voice — prosody degrades above this threshold

### Script format for reel
- Short declarative sentences, period-terminated
- `<#0.5#>` between each sentence for punchy cadence
- No em-dashes or ellipsis in TTS input — use periods
- Target word count: 60-80 words for 25-30s output at speed 1.0

---

## Cost summary (this session)

| Generation | Model | Cost (est.) |
|-----------|-------|-------------|
| sample-en-pi-clone-existing | speech-2.8-turbo | ~$0.008 |
| sample-fr-pi-clone-existing | speech-2.8-turbo | ~$0.008 |
| voice-design EN (QUNsOzUy) | voice-design | ~$0.020 |
| voice-design FR (M5FG98uO) | voice-design | ~$0.020 |
| sample-en-pi-reel-QUNsOzUy | speech-2.8-turbo | ~$0.008 |
| sample-fr-pi-reel-M5FG98uO | speech-2.8-turbo | ~$0.008 |
| **Total** | | **~$0.072** |

---

## Phase 2 handoff to Rho

Voice IDs for Rho mission brief (reel production):

```
EN_REEL_VOICE_ID=ttv-voice-2026051301303726-QUNsOzUy
FR_REEL_VOICE_ID=ttv-voice-2026051301310926-M5FG98uO
DIARY_VOICE_ID=ttv-voice-2026032704355926-zUb4NZ4I
TTS_MODEL=fal-ai/minimax/speech-2.8-turbo
PAUSE_SHORT=<#0.5#>
PAUSE_LONG=<#1.5#>
MAX_CHARS=5000
```

All sample MP3s in `deliverables/brand-kit-voices/` for Rho's audio review before video assembly.
