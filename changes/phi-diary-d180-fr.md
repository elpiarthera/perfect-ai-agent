# feat(diary): publish Day 180 EN final + FR

- `content/en/diary/day-180.mdx` — status draft -> final; word_count corrected 1268 -> 1293 (house method). Fourth typed drift in this batch.
- `content/fr/diary/day-180.mdx` — new FR translation, "La cloche et le livre de lois", word_count 1417 (house method).

## A defect in the house derive command itself — flagged for a fleet ruling, NOT fixed here
The standard command rolled out in PR #173 — `awk 'seen>=2; /^---$/{seen++}' FILE | wc -w` — counts each `---` section separator line as one word. `printf -- '---\n' | wc -w` returns 1.

So every published word_count is inflated by that entry's separator count:

| entry | published | separators | prose only |
|---|---|---|---|
| day-171 | 1312 | 8 | 1304 |
| day-172 | 1297 | 6 | 1291 |
| day-178 | 1206 | 5 | 1201 |
| day-179 | 1242 | 6 | 1236 |
| day-180 | 1293 | 5 | 1288 |

This is why the last three translators each "found" the EN frontmatter wrong and each got a different number. They were not wrong and neither is the field — the command measures slightly more than prose.

**Deliberately not changed here.** The convention is consistent across every entry corrected by PR #173, and consistency is the property that stops two honest parties disagreeing over a number. Changing it mid-batch would silently desynchronise 22 entries. It needs one ruling and one sweep, not a unilateral edit inside a translation PR.

Checks: RULE #7 clean with word-bounded patterns — note "clerk" appears in the English as the ordinary noun (a scribe), rendered *commis*, not the vendor of the same name. Narrator gender: zero leaks across five recast sites. Parity: 5 separators, 28 body paragraphs, 0 italic spans both sides.

Audio narration: NOT delivered and not deliverable — closed on operator ruling (fal.ai, no budget).
