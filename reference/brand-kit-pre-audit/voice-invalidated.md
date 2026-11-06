# Voice clones — INVALIDATED (REFERENCE ONLY)

**Status**: invalidated by Pi patch 2026-05-12 post-dispatch
**Reason**: Doctrine clarified — Pi diary narrator voice already exists and is the same persona as Pi reel narrator. No new voice clones required. Reuse existing Pi diary voice + ad-tempo via script + ElevenLabs/MiniMax params adjustment.

## Verdict
REUSE existing Pi diary clone `ttv-voice-2026032704355926-zUb4NZ4I` (EN + FR multi-lingual, fal.ai MiniMax voice clone, memory `j576105d1nnrb7xhd266sbhw5183ndbd`).

## What was produced before patch (NOT to be used)
The `dev-fal-expert` subagent ran A/B test BEFORE Pi patch landed and produced 2 new voice clones via `fal-ai/minimax/voice-design` ($0.072 fal.ai cost — accepted as Pi's faute, NOT to be amplified). These IDs are documented here for tracking only; do **not** wire them into any production reel.

### EN reel voice (INVALIDATED)
- voice_id: `ttv-voice-2026051301303726-QUNsOzUy`
- Provider: fal.ai voice-design + speech-2.8-turbo
- Tone tags claimed: calm authority + momentum, sharp consonants, mid-thirties European female

### FR reel voice (INVALIDATED)
- voice_id: `ttv-voice-2026051301310926-M5FG98uO`
- Provider: fal.ai voice-design + speech-2.8-turbo
- Tone tags claimed: same persona in French, cultivated accent, ad-tempo built in

## Production-correct usage (post-patch)
- **Diary / audiobook narration**: `ttv-voice-2026032704355926-zUb4NZ4I` (existing, slow, contemplative ~150 wpm)
- **Reel / ad voiceover**: same `ttv-voice-2026032704355926-zUb4NZ4I` + ad-tempo achieved via:
  - **Script-side** (agency-copywriter): short, punchy sentences ≤60s total reel
  - **TTS params-side** (fal.ai MiniMax): adjust speed multiplier 1.05-1.15, emotion neutral, intensity 30, pitch +5
  - **ElevenLabs equivalent params** (if migration): stability 0.3-0.5 lower, style 0.6-0.8 higher, similarity_boost 0.75 standard

## Sample MP3s (REFERENCE ONLY — not committed)
The fal.ai voice-design step produced these test samples; they exist locally but are excluded from this branch per Pi instruction (sample MP3s for new clones, not committed):
- `sample-en-pi-clone-existing.mp3` — existing clone at speed 1.1, 24.6s
- `sample-fr-pi-clone-existing.mp3` — existing clone at speed 1.1, 26.8s
- `sample-en-pi-reel-QUNsOzUy.mp3` — INVALIDATED new clone, 27.3s
- `sample-fr-pi-reel-M5FG98uO.mp3` — INVALIDATED new clone, 26.7s
- `preview-en-pi-reel-QUNsOzUy.mp3` — INVALIDATED new clone preview
- `preview-fr-pi-reel-M5FG98uO.mp3` — INVALIDATED new clone preview

## Lesson capitalized
Reuse-first doctrine applies to voice. The Pi narrator persona is one voice across all surfaces (diary, book, reel). Cadence/energy is a script + params problem, not a voice cloning problem.
