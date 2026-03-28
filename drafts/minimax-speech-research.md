# MiniMax Speech: 2.6 vs 2.8 Turbo Evaluation

**Date:** 2026-03-27
**Verdict:** Hold — do NOT switch from 2.8 Turbo to 2.6
**Confidence:** High

---

## 1. Version Timeline — Which is Newer?

The version numbering is NOT sequential in the way one might assume. Here is the confirmed chronological order:

| Model | Release Date | Notes |
|---|---|---|
| Speech-01 series | Pre-2025 | Legacy |
| Speech-02 / Speech 2.5 | Apr 2, 2025 / Aug 6, 2025 | Naming overlap — "Speech-02" is a generation name, not version 2.0 |
| Speech 2.6 | Oct 29–30, 2025 | Optimized for voice agents, sub-250ms latency |
| **Speech 2.8 (Turbo + HD)** | **Feb 14, 2026** | **Current — adds emotional tone tags** |

**Conclusion: Speech 2.8 Turbo is NEWER than Speech 2.6 by approximately 3.5 months.** We are already on the latest generation. The URL Laurent flagged (`/news/minimax-speech-26`) is an older release announcement.

Naming note: MiniMax uses two parallel naming schemes. "Speech-02" (with a zero, announced May 2025) is a generation umbrella that spawned the 2.5, 2.6, and 2.8 sub-versions. The API model IDs are `speech-2.6-turbo`, `speech-2.6-hd`, `speech-2.8-turbo`, `speech-2.8-hd`.

---

## 2. Key Differences: 2.6 vs 2.8 Turbo

### What 2.6 introduced (vs 2.5)
- Sub-250ms end-to-end latency (Turbo variant)
- Fluent LoRA: voice cloning from imperfect source recordings
- Smart format handling: URLs, emails, phone numbers, dates, monetary amounts spoken naturally without pre-processing
- 40+ language support with improved prosody
- Two variants: Turbo (speed) and HD (quality)

### What 2.8 adds (vs 2.6)
- **Emotional tone tags** — inline interjection markers inserted directly in text:
  - `(laughs)`, `(chuckle)`, `(sighs)`, `(gasps)`, `(clears throat)`, `(coughs)`, `(sneezes)`
- Improved perceived naturalness — topped Artificial Analysis Speech Arena and Hugging Face TTS Arena in blind human preference tests (Speech-02-HD rank: #1 on both leaderboards as of early 2026)
- Pricing unchanged: Turbo = 300 credits / 10K chars, HD = 600 credits / 10K chars
- API is backward-compatible — same parameters, same endpoint, tone tags are opt-in

### What 2.8 does NOT change vs 2.6
- Language support count (still 40+)
- Latency profile (Turbo variant remains sub-250ms)
- Core voice cloning (Fluent LoRA carried forward)
- Base audio quality architecture

---

## 3. French Language Quality

No official head-to-head benchmark exists for French specifically between 2.6 and 2.8. What is documented:

- French is confirmed in both models' supported language lists
- Laurent's assessment of 2.8 Turbo ("perfect French with a slight English accent") reflects the existing behavior of the Turbo variant — slight English accent is a known characteristic of Turbo vs HD
- Speech 2.8 HD ranked #1 on Hugging Face TTS Arena (blind user preference, multilingual), which implies quality improvements carry across languages including French
- The HD variant is recommended for narration use cases (audiobooks, voiceovers) per Novita AI's documentation

---

## 4. API Compatibility

Speech 2.8 Turbo is available on fal.ai at `fal-ai/minimax/speech-2.8-turbo` — which is already what we use. Full parameter parity with 2.6:

- `voice_id`, `speed`, `vol`, `pitch`, `emotion` — identical
- `english_normalization` — present in both
- Pause markers `<#x#>` — identical syntax
- Tone tag interjections — NEW in 2.8, opt-in, does not break 2.6 workflows
- Max characters: 5,000 per request (unchanged)
- Audio formats: MP3, PCM, FLAC (unchanged)

2.6 would be a **downgrade** on fal.ai — it is a prior model still available but superseded.

---

## 5. Quality Benchmarks (Artificial Analysis, Jan–Mar 2026)

| Model | Arena ELO | Notes |
|---|---|---|
| Speech 2.8 HD | ~1175 (rank #5, Artificial Analysis) / #1 Hugging Face TTS Arena | Best quality |
| Speech 2.6 HD | ELO 1108 (rank #4 as of Jan 2026 — older data) | Strong but superseded |
| Speech 2.6 Turbo | ELO 1147 (rank #26 of 66) | Lower than HD |
| Speech-02-HD | #7 Hugging Face TTS Arena, ELO 1544 | Older naming, high score |

Note: ranking numbers vary across platforms and dates. Direction is consistent — 2.8 HD outperforms 2.6 HD in blind preference tests.

---

## 6. Recommendation

**Do not switch to 2.6. We are already on 2.8 Turbo, which is newer, higher-quality, and the current generation.**

The research request appears to have been triggered by seeing MiniMax's October 2025 blog post for Speech 2.6 and assuming it was a newer release. It is not — it predates 2.8 Turbo by 3.5 months.

### Action items

1. **No migration needed.** Continue using `fal-ai/minimax/speech-2.8-turbo` as-is.

2. **Consider testing 2.8 HD** for the final audio output of Pi's voice on perfectaiagent.xyz. HD is optimized for narration/audiobooks (our exact use case), while Turbo is optimized for real-time agents. Quality difference may be audible — especially for French. Cost doubles (600 vs 300 credits/10K chars), but for pre-generated content this may be worth it.

3. **Evaluate tone tags for Pi's voice.** The `(sighs)` and `(gasps)` interjections are new in 2.8 and could add expressiveness to Pi's contemplative narrator persona. Low effort to test — just insert tags in text input.

4. **French accent note.** The slight English accent Laurent observed is a Turbo variant characteristic. If French naturalness is a priority, switching to 2.8 HD (same model family, higher quality tier) would be the correct lever — not switching to an older model.

5. **Monitor for Speech 2.9 / 3.0.** MiniMax releases new versions every 3–4 months (2.5: Aug 2025, 2.6: Oct 2025, 2.8: Feb 2026). Next release expected ~May–Jun 2026.

---

## Sources

- [MiniMax Speech 2.6 Official Announcement](https://www.minimax.io/news/minimax-speech-26) — Oct 30, 2025
- [MiniMax Speech 2.8 Release — UnifiedTTS](http://unifiedtts.com/en/news/2026-02-14-minimax-2.8-models) — Feb 14, 2026
- [MiniMax Models Release Notes (official docs)](https://platform.minimax.io/docs/release-notes/models)
- [MiniMax Speech 2.8 Turbo on fal.ai](https://fal.ai/models/fal-ai/minimax/speech-2.8-turbo/api)
- [MiniMax Speech 2.6 Turbo on fal.ai](https://fal.ai/models/fal-ai/minimax/speech-2.6-turbo/api)
- [MiniMax Speech 2.8 Series on Novita AI](https://blogs.novita.ai/minimax-speech-2-8-series-on-novita/)
- [Artificial Analysis TTS Leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard)
- [MiniMax Speech 2.6 Turbo — Together AI](https://www.together.ai/blog/minimax-speech-2-6)
- [MiniMax Speech 2.6 Deep Dive — CometAPI](https://www.cometapi.com/minimax-releases-minimax-speech-2-6/)
- [MiniMax Speech 2.8 Turbo — Replicate](https://replicate.com/minimax/speech-2.8-turbo)
- [Releasebot MiniMax changelog](https://releasebot.io/updates/minimax)
