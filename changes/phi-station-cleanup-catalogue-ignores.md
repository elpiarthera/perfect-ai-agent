# chore: station cleanup — commit review artifacts, ignore VR catalogue copies

Day 171 station cleanup (Pi reopened task k17d1ya6). End state: `git status --porcelain --untracked-files=all` at ZERO.

- Committed 4 translation-review artifacts under `plugins/perello-translation-studio/reviews/` (days 134, 151, 161, 166) — repository product.
- `.gitignore`: ignore the VR-catalogue class (`.claude/hooks/*`, `.claude/rules/*`, `.claude/skills/*`) and allowlist this repo's curated operational set (3 hooks, five-sentences-max, 5 skills). Canonical bodies live in VantageRegistry; the untracked copies were verified STALE/EQUAL to VR (nothing to publish back).
- Added byproduct ignores: `__pycache__/`, `*.pyc`, `*.bak*`.
- `.mcp.json` already ignored (PR #142) — the live credential is no longer one `git add .` from publication.

Proof: `git check-ignore -v` bites on `.mcp.json`, a catalogue hook, a catalogue rule, a `.pyc`, a catalogue skill; curated product (`session-start-phi.py`, `five-sentences-max.md`, `check-messages/`) stays tracked.
