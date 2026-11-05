#!/usr/bin/env python3
"""
check-narrator-gender.py — guard the genderless diary narrator (task k177ytjkr).

The narrator of the AI diary (« Pi ») has NO gender. Any French spelling whose form
changes with the narrator's gender is a defect. Three diary PRs in a row (#241, #242,
#244) shipped marks of a class the house `je suis + participle` grep never covered;
this guard closes that class with the two shapes Eta named added to MUST_BLOCK.

THREE CLASSES FLAGGED (each a spelling that would differ for a feminine narrator):

  1. Preceding direct-object « me/m' » + past participle — « Laurent m'a arrêté ».
     The participle agrees with « me » (the narrator), so it carries gender.
     NOT flagged when « me » is an INDIRECT object (the participle is then invariant):
     « m'a demandé », « m'a dit », « m'a coupé la parole ». Two declared escapes below
     make that distinction, and both are visible here, never hidden in a matcher.

  2. « être » / « je suis » + a gendered adjective or participle — « pour être sûr »,
     « je suis prêt ».

  3. « je (me) suis » + a past participle (the original house class) — « je suis allé »,
     « je me suis trompé ».

FAIL-CLOSED: a file that cannot be read, or a frontmatter that cannot be split, is an
error that BLOCKS loudly and names what it could not read — never a silent pass
(measurement-integrity.md: an absence of signal is an event, never a rest).

Exit 0 = clean. Exit 2 = at least one mark (or an unreadable input). Exit 3 = selftest red.
"""
import re
import subprocess
import sys

# --- Declared escape 1: verbs whose « me » is standardly INDIRECT (à qqn) -----------
# For these the past participle does not agree with « me », so no gender mark.
# Written here, where the reader of the guard sees it — a declared divergence is a
# decision, never a silent exclusion (derive-never-type.md).
INVARIANT_IO = {
    "demandé", "dit", "montré", "plu", "semblé", "répondu", "écrit", "appris",
    "parlé", "rapporté", "posé", "laissé", "donné", "envoyé", "raconté", "offert",
    "promis", "permis", "répété", "expliqué", "confié", "rappelé", "suggéré",
    "conseillé", "ordonné", "interdit", "reproché", "souri", "menti", "téléphoné",
    "fait",  # « m'a fait + infinitif » is causative, invariant
}

# --- Declared escape 2: a direct object AFTER the participle makes it invariant ------
# « m'a coupé LA PAROLE », « m'a posé DES QUESTIONS » — the DO follows, so no agreement.
DO_AFTER = re.compile(
    r"^\s+(l[ae]s?|l'|un[e]?|des|du|de\s|d'|س?[mts](?:on|a|es)|leurs?|cette?|ces|quelque)",
    re.IGNORECASE,
)

AUX = r"(?:a|ont|avait|avaient|aura|auront|aurait|auraient|ait|aient|eut)"
# A past participle in a form that WOULD change for a feminine narrator.
PART = r"[a-zàâäçéèêëîïôûùœ]+(?:é|és|i|is|it|u|us|ert|eint|aint|int)"

# Class 1: preceding-DO « me/m' » + aux + (adverb)? + participle
RE_ME_PART = re.compile(
    r"\b(?P<me>m'|me\s)(?P<aux>" + AUX + r")\s+(?:(?P<adv>[a-zàâäçéèêëîïôûù]+(?:ment)?)\s+)?"
    r"(?P<part>" + PART + r")(?P<tail>.*)$",
    re.IGNORECASE,
)

# Class 2: être / je suis + gendered adjective
GENDERED_ADJ = (
    "sûr", "certain", "prêt", "précis", "clair", "content", "heureux", "capable",
    "obligé", "forcé", "censé", "convaincu", "seul", "franc", "fier", "désolé",
    "surpris", "satisfait", "conscient", "incapable", "présent", "absent",
)
RE_ETRE_ADJ = re.compile(
    r"\b(?:pour\s+être|d'être|je\s+suis|j'étais|je\s+serais|je\s+reste|je\s+demeure)\s+"
    r"(?P<adj>" + "|".join(GENDERED_ADJ) + r")\b",
    re.IGNORECASE,
)

# Class 3: je (me) suis + past participle (the original house class)
RE_JE_SUIS_PART = re.compile(
    r"\bje\s+(?:me\s+)?suis\s+(?:[a-zàâäçéèêëîïôûù]+\s+)?(?P<part>" + PART + r")\b",
    re.IGNORECASE,
)


def body_lines(text):
    """Yield (lineno, line) for the body, skipping YAML frontmatter. Fail-closed:
    a frontmatter that opens and never closes raises, so the caller blocks loudly."""
    lines = text.splitlines()
    if lines and lines[0].strip() == "---":
        end = None
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                end = i
                break
        if end is None:
            raise ValueError("frontmatter opened but never closed")
        start = end + 1
    else:
        start = 0
    for i in range(start, len(lines)):
        yield i + 1, lines[i]


def scan_text(text):
    """Return a list of (lineno, class, matched) marks."""
    marks = []
    for lineno, line in body_lines(text):
        for m in RE_ME_PART.finditer(line):
            part = m.group("part").lower()
            if part in INVARIANT_IO:
                continue
            if DO_AFTER.match(m.group("tail")):
                continue
            marks.append((lineno, "me+participle", m.group(0).strip()[:60]))
        for m in RE_ETRE_ADJ.finditer(line):
            marks.append((lineno, "être+adjective", m.group(0).strip()[:60]))
        for m in RE_JE_SUIS_PART.finditer(line):
            part = m.group("part").lower()
            if part in INVARIANT_IO:
                continue
            marks.append((lineno, "je suis+participle", m.group(0).strip()[:60]))
    return marks


def scan_file(path):
    try:
        with open(path, "r", encoding="utf-8") as fh:
            text = fh.read()
    except OSError as exc:
        print(f"BLIND: cannot read {path}: {exc}", file=sys.stderr)
        return None
    try:
        return scan_text(text)
    except ValueError as exc:
        print(f"BLIND: cannot parse {path}: {exc}", file=sys.stderr)
        return None


def git_show(ref):
    return subprocess.run(
        ["git", "show", ref], capture_output=True, text=True, check=True
    ).stdout


def selftest():
    """Bipolar probe on REAL committed material — never self-authored fixtures.
    MUST_BLOCK: the historical pre-fix diary blobs (foreign to this guard) carry the
    11 marks Eta found. MUST_PASS: the current fixed HEAD versions carry 0. Each
    pre-fix blob is landing-asserted to actually contain its marks before it is trusted."""
    # (ref, path, expected minimum marks) — the oracle from Eta's #242/#244 verdicts.
    block = [
        ("fa293d05:content/fr/diary/day-239.mdx", 3),
        ("fa293d05:content/fr/diary/day-240.mdx", 2),
        ("fa293d05:content/fr/diary/day-242.mdx", 1),
        ("fa293d05:content/fr/diary/day-243.mdx", 3),
        ("f49322c0cd856e2af074e663146b372d333f4d68:content/fr/diary/day-244.mdx", 2),
    ]
    passg = [
        "HEAD:content/fr/diary/day-233.mdx",  # a clean published entry
    ]
    # invariant lines that MUST NOT be flagged (false-positive guard)
    invariant = [
        "Puis on m'a rapporté qu'elle s'était assise.",
        "Laurent m'a demandé de lui écrire.",
        "Laurent m'a coupé la parole là.",
        "Puis Laurent m'a posé des questions sur trois bateaux.",
        "le même facteur m'avait déjà fait m'arrêter une fois.",
        "il m'a montré le sceau.",
    ]
    fail = 0
    print("=== NARRATOR-GENDER GUARD — bipolar probe on real committed material ===")

    print("-- MUST_BLOCK: pre-fix historical blobs carry their marks --")
    total = 0
    for ref, want in block:
        try:
            marks = scan_text(git_show(ref))
        except subprocess.CalledProcessError:
            print(f"  FAIL: cannot read oracle blob {ref}"); fail = 1; continue
        got = len(marks)
        total += got
        ok = got >= want
        print(f"  {ref.split(':')[0][:8]} {ref.split('/')[-1]}: {got} marks (want >= {want}) {'ok' if ok else 'FAIL'}")
        if not ok:
            fail = 1
            for ln, cls, txt in marks:
                print(f"      l.{ln} [{cls}] {txt}")
    print(f"  total pre-fix marks flagged: {total} (Eta oracle: 11)")

    print("-- MUST_PASS: current fixed entries carry 0 --")
    for ref in passg:
        try:
            marks = scan_text(git_show(ref))
        except subprocess.CalledProcessError:
            print(f"  FAIL: cannot read {ref}"); fail = 1; continue
        if marks:
            print(f"  FAIL: {ref} flags {len(marks)}: {marks}"); fail = 1
        else:
            print(f"  {ref.split('/')[-1]}: 0 ok")

    print("-- MUST_PASS: known invariant (indirect / DO-after / causative) lines --")
    for line in invariant:
        marks = scan_text("---\nx: 1\n---\n" + line)
        if marks:
            print(f"  FAIL: false positive on « {line} »: {marks}"); fail = 1
        else:
            print(f"  ok: « {line[:48]}… »")

    print("-- MUST_BLOCK: a minimal injected mark of each class fires --")
    for probe, cls in [
        ("Laurent m'a arrêté.", "me+participle"),
        ("Je l'ai fait pour être sûr.", "être+adjective"),
        ("Quand je suis allé voir.", "je suis+participle"),
    ]:
        marks = scan_text("---\nx: 1\n---\n" + probe)
        if any(c == cls for _, c, _ in marks):
            print(f"  ok: « {probe} » -> {cls}")
        else:
            print(f"  FAIL: « {probe} » not flagged as {cls}: {marks}"); fail = 1

    print("=== " + ("GUARD GREEN — both poles on real material" if not fail else "GUARD RED") + " ===")
    return fail


def main(argv):
    if len(argv) == 2 and argv[1] == "--selftest":
        sys.exit(3 if selftest() else 0)
    if len(argv) < 2:
        print("usage: check-narrator-gender.py <file.mdx>...  |  --selftest", file=sys.stderr)
        sys.exit(64)
    any_mark = False
    any_blind = False
    for path in argv[1:]:
        marks = scan_file(path)
        if marks is None:
            any_blind = True
            continue
        for ln, cls, txt in marks:
            any_mark = True
            print(f"{path}:{ln}: narrator gender mark [{cls}]: {txt}")
    if any_blind:
        print("BLOCKED: a file could not be read/parsed (fail-closed).", file=sys.stderr)
        sys.exit(2)
    if any_mark:
        print("BLOCKED: narrator gender mark(s) found — the diary narrator is genderless.", file=sys.stderr)
        sys.exit(2)
    sys.exit(0)


if __name__ == "__main__":
    main(sys.argv)

# ---------------------------------------------------------------------------
# STATUS 2026-11-05: WIP — probe RED, NOT shipped (no PR). Do not wire as a hook.
# The bipolar probe (selftest) correctly flags the regex as fragile:
#   - MUST_BLOCK side GREEN: catches 11/11 real pre-fix marks on foreign blobs,
#     AND found 2 marks the manual REVISE missed (day-236 l.81, day-240 l.45).
#   - FALSE POSITIVES remain: PART matches function words ending in i/u/é
#     ("qui","nouveau","combien","aussi"); the optional-adverb group mis-captures
#     the real participle; DO_AFTER "de " wrongly skips adverbial "de nouveau".
# REDESIGN (next pass): replace broad PART-minus-INVARIANT_IO with a CURATED
#   DANGER-PARTICIPLE list (arrêté, corrigé, frappé, interrogé, gêné, vu, pris,
#   retenu, interrompu, surpris, averti, convaincu, …) — precision over recall,
#   each entry with a real positive control; drop the free adverb group; tighten
#   DO_AFTER to explicit determiners only. Re-run the probe until MUST_PASS is 0
#   on the FIXED branch heads (6627696 / efd7064 / 419a3d9), not on day-233
#   (which carries its own latent marks — see the separate sweep finding).
# ---------------------------------------------------------------------------
