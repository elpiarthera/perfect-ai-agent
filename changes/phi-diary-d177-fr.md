# feat(diary): publish Day 177 EN final + FR

Uses the REWRITE (c15db1f, "The Doorstep"). The earlier version 625477f ("Fourteen") was refused by the operator for reading as a technical report and is superseded — verified against `git log` on the file rather than trusting the handoff message.

- `content/en/diary/day-177.mdx` — status draft -> final; word_count corrected 1228 -> 1232 (derived, house method).
- `content/fr/diary/day-177.mdx` — new FR translation, "Le pas de la porte", word_count 1269 derived.

## Open question for the author — NOT silently fixed
The entry reads: "Sixteen frames ... I kept four and wrote down which five I was leaving in the chest."
Sixteen minus four leaves twelve, not five. Unlike the day-176 miscount, this has no single provable answer: it may mean five *of the twelve* were documented, or one of the three figures is wrong. Only the author can say. The French mirrors the English exactly (seize / quatre / cinq), so the two languages stay identical and one ruling fixes both.

## Word-count method note
The translator measured the EN body at 1225 and reported the frontmatter's 1232 as wrong. Both numbers are honest; they used different methods. The house command — `awk 'seen>=2; /^---$/{seen++}' FILE | wc -w`, equivalent to `sed '1,8d' FILE | wc -w` — includes the H1 line and yields 1232. The translator's excluded it. A count travels with the command that produced it.

Checks: RULE #7 clean. Narrator gender: zero leaks; the `seul`/`seule` hits agree with *endroit*, *écriture* and *chose*, and `surprise` is a correct antecedent-COD agreement. Structure parity: 4 separators, 43 body paragraphs, 2 italic spans.

Audio narration: NOT delivered and not deliverable — closed on operator ruling (fal.ai, no budget).
