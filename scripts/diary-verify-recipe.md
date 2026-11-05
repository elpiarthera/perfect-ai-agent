# Diary verification recipe — no negative grep is conclusive without a positive control

Task **k171y5rh**. Closes the class discovered on day 186 (2026-09-07): during the
172–182 diary backlog run, **four verification checks returned false readings in one
session, every one in the reassuring direction.** The fix is not better regexes — it
is pairing every negative check with a **known-present positive control** that proves
the instrument fired.

Tool: [`scripts/diary-verify.sh`](./diary-verify.sh). Probe: `bash scripts/diary-verify.sh selftest`.

## What failed, and why a better regex would not have saved it

| # | The check | The false reading | The missing control |
|---|-----------|-------------------|---------------------|
| 1 | page-liveness grep for `not found` / `introuvable` | both strings ship in the i18n dictionary on **every** page; the grep declared live pages dead (or dead pages live) | liveness is HTTP status + the day's rendered title, never a body-string grep |
| 2 | case-sensitive grep for a required phrase | missed a capitalised sentence-initial occurrence; nearly failed a sound translation | case-insensitive match |
| 3 | number regex | found one figure of four when all four were present | count carries its command; the figure is re-derived, not eyeballed |
| 4 | unbounded name sweep | matched `tau` inside `taught` | word-bounded match |

All four share one root: **a grep that cannot see what it was pointed at returns exactly
the same silence as a clean file.** (day-170: *an absence of signal is an event, never a
rest*; day-178: *a complete instrument doing nothing looks precisely like an instrument
that is not needed*.)

## The three rules

### (a) Liveness is HTTP status + rendered title — never a body-string grep

```
bash scripts/diary-verify.sh liveness <locale> <day>
```

- `LIVE` = HTTP 200 **and** the `<title>` names the day (guards against a 200 that
  rendered the wrong entry).
- `ABSENT` = HTTP 404 — the only clean non-live reading.
- Anything else (3xx/5xx) is `UNRESOLVED`, **never** read as live.
- **day-999 is the standing negative control.** Every liveness run proves itself by
  also reading day-999 as `ABSENT` (built into `selftest`). A liveness check that
  cannot tell day-999 from a real day is not measuring anything.

### (b) Every anonymisation / gender sweep is case-insensitive, word-bounded, and proven to fire

```
bash scripts/diary-verify.sh sweep <file> <pattern> <positive-control-token>
```

- Match is `grep -inwE` — case-**i**nsensitive, **w**ord-bounded, extended regex. This
  alone kills failures 2 and 4.
- Before any **0-hit** is trusted as `CLEAN`, the sweep greps `<positive-control-token>`
  — a token **known to be present in the same file** — and **fails loud (`BLIND`,
  exit 3)** if it is absent. A sweep that has never fired proves nothing. A 0-hit is
  trustworthy only once the instrument is shown to see the file.

Gender sweep for the genderless narrator (apply per FR entry, with a present control
such as `je` or `Laurent`):

```
bash scripts/diary-verify.sh sweep content/fr/diary/day-NNN.mdx \
  "je (me )?suis (alle|allee|parti|revenu|reste|sorti|rendu|devenu|venu|arrive|entre|monte|descendu)" je
```

### (c) Any count in a report carries the command that produced it

```
bash scripts/diary-verify.sh count <label> -- <command...>
```

Prints `<label>: <output>  [cmd: <command>]`. A typed number with no command is refused
upstream by `derive-never-type.md`; this makes citing the command the path of least
resistance.

## Proof the recipe itself fires — bipolar probe

`bash scripts/diary-verify.sh selftest` exercises **both poles on committed diary
entries** — never a synthetic fixture — and **landing-asserts** every anchor first
(a pole whose token has moved proves nothing). Run it from the repo root:

- liveness reads day-233 FR as `LIVE` **and** day-999 as `ABSENT` (real production site);
- landing asserts: `Laurent` present in `content/fr/diary/day-233.mdx` (l.19), and
  `taught` present with bare `tau` absent in `content/en/diary/day-233.mdx` (l.26) —
  each fails loud if the anchor has moved;
- **case-insensitivity pole:** a lowercase pattern `laurent` must HIT `Laurent` in the
  real FR entry (the pole case-folding previously lacked);
- **word-boundary pole:** `tau` must stay `CLEAN` against the real EN entry (not match
  `taught`), control `taught` confirmed present;
- **blind-instrument pole:** an absent control token on the real FR entry must `FAIL
  LOUD` (`BLIND`, exit 3), refusing the 0-hit;
- count carries its command.

A probe written by whoever wrote the matcher only proves the matcher understands itself —
so every pole runs against real committed material and the live production site, not a mock.

## Cross-reference

- `.claude/rules/derive-never-type.md` — a count a tool can read is never typed.
- `measurement-integrity.md` — an absence of signal is an event, never a rest; an
  instrument that cannot read must fail loud, never fail open.
- Friction memory `j578etah47axn7mc6dfjp39jkh8dzr8k` (day 186).
