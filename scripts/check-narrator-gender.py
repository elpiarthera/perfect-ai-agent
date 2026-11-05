#!/usr/bin/env python3
"""
check-narrator-gender.py — guard the genderless diary narrator (task k177ytjkr).

The narrator of the AI diary (« Pi ») has NO gender. Any French spelling whose form
changes with the narrator's gender is a defect. Four diary PRs (#241, #242 ×2, #244)
shipped marks of shapes the house `je suis + participle` grep never covered. This guard
closes the class with every shape Eta named.

PRECISION-FIRST BY DESIGN. An earlier version matched "any -é/-i/-u word" after
« me » minus an indirect-object allowlist; its probe went red with false positives on
function words (`qui`, `nouveau`, `combien`). This version instead keys off CLOSED,
CURATED word lists (the transitive participles that agree with a preceding « me », the
motion/reflexive participles, a fixed set of gendered adjectives). A mark is flagged only
when a listed word appears — so a function word can never trip it. The cost is recall: a
transitive participle outside the list is missed. That trade is deliberate (a missed mark
is caught by review; a false positive gets a guard disabled — hook-vitality-bite-probe.md),
and the lists are declared here, in the open, for extension.

FIVE SHAPES (each a spelling that differs for a feminine narrator):
  1. preceding direct-object « me/m' » + a transitive past participle — « m'a arrêté ».
  2a. copula + attribute noun with « je » — « j'étais un écrivain ».
  2b. (pour|de|sans) + infinitive copula + gendered adjective — « pour être sûr »,
      « paraître minutieux ».
  2c. « je suis / j'étais » + gendered adjective — « je suis prêt », « j'étais seul ».
  3. « je (me) suis » + a motion/reflexive past participle — « je suis allé »,
     « je me suis trompé ».

FAIL-CLOSED: an unreadable file, or a frontmatter that cannot be split, BLOCKS loudly
and names what it could not read — never a silent pass (measurement-integrity.md).

Exit 0 = clean. Exit 2 = at least one mark (or an unreadable input). Exit 3 = selftest red.
"""
import re
import subprocess
import sys

# Transitive past participles that agree with a preceding direct-object « me ».
# Curated: indirect-object verbs (demander, dire, montrer, répondre, apprendre,
# rapporter, sembler, plaire, laisser…) are deliberately ABSENT — for them « me » is
# indirect and the participle is invariant. Extend as real marks appear.
DANGER_PARTICIPLES = {
    "arrêté", "corrigé", "frappé", "interrogé", "gêné", "vu", "revu", "regardé",
    "trouvé", "retrouvé", "pris", "repris", "surpris", "compris", "retenu",
    "interrompu", "stoppé", "bloqué", "convaincu", "averti", "prévenu", "poussé",
    "aidé", "accompagné", "dérangé", "appelé", "rejoint", "suivi", "quitté",
    "conduit", "emmené", "amené", "ramené", "écouté", "entendu", "remarqué",
    "choisi", "forcé", "obligé", "sauvé", "protégé", "trahi", "abandonné",
    "remercié", "félicité", "grondé", "puni", "jugé", "servi", "blessé", "touché",
    "ému", "saisi", "étonné", "déçu", "rassuré", "encouragé", "découragé",
    "convoqué", "renvoyé", "nommé", "désigné", "repoussé", "écarté", "renversé",
}

# Motion / reflexive participles that agree with the subject « je » under être.
MOTION_REFLEXIVE = {
    "allé", "parti", "resté", "venu", "revenu", "devenu", "parvenu", "arrivé",
    "entré", "sorti", "monté", "descendu", "rendu", "retourné", "tombé", "né",
    "reparti", "demeuré", "passé", "trompé", "assis", "levé", "couché", "senti",
    "souvenu", "mis", "efforcé", "approché", "éloigné", "tenu", "arrêté",
    "aperçu", "résolu", "décidé", "tu",
}

# Adjectives whose spelling changes with the narrator's gender.
GENDERED_ADJ = {
    "sûr", "certain", "prêt", "précis", "clair", "content", "heureux", "capable",
    "obligé", "forcé", "censé", "convaincu", "seul", "franc", "fier", "désolé",
    "surpris", "satisfait", "conscient", "incapable", "présent", "absent",
    "minutieux", "méticuleux", "complet", "rigoureux", "attentif", "prudent",
    "responsable", "coupable", "innocent", "vigilant", "soigneux",
}

# After « je + copula + un/une », these are not attribute-role nouns (no gender claim).
ATTR_STOP = {"peu", "moment", "instant", "temps", "jour", "soir", "matin", "an",
             "certain", "autre", "tel", "seul", "rien"}

AUX = r"(?:a|ont|avait|avaient|aura|auront|aurait|auraient|ait|aient|eut)"
WORD = r"[a-zàâäçéèêëîïôûùœ'-]+"


def _alt(words):
    # longest-first so the engine never settles on a prefix of a listed word
    return "(?:" + "|".join(sorted(words, key=len, reverse=True)) + ")"


DANGER_ALT = _alt(DANGER_PARTICIPLES)
MOTION_ALT = _alt(MOTION_REFLEXIVE)
ADJ_ALT = _alt(GENDERED_ADJ)

# The target word is EMBEDDED in each pattern (not post-filtered) so a greedy gap
# can never match a non-target word and skip the real one — the earlier recall bug.

# Shape 1: « me/m' » + aux + (<=2 words) + a DANGER participle.
RE_ME_DANGER = re.compile(
    r"\b(?:m'|me\s)(?:" + AUX + r")\b(?:\s+" + WORD + r"){0,2}?\s+(?P<w>" + DANGER_ALT + r")\b",
    re.IGNORECASE,
)
# Shape 2a: je/j' + copula + un/une + <noun> (noun is open class → post-filtered).
RE_COPULA_NOUN = re.compile(
    r"\bj(?:e\s+|')(?:suis|étais|fus|serais|serai|ai\s+été|avais\s+été)\s+une?\s+(?P<w>" + WORD + r")",
    re.IGNORECASE,
)
# Shape 2b: (pour|de|sans|d'|à) + infinitive copula + gendered adjective.
RE_INF_COPULA = re.compile(
    r"\b(?:pour|de|sans|d'|à)\s+(?:être|paraître|sembler|rester|devenir|demeurer)\s+(?P<w>" + ADJ_ALT + r")\b",
    re.IGNORECASE,
)
# Shape 2c: je suis / j'étais + gendered adjective (direct copula).
RE_JE_ADJ = re.compile(
    r"\bj(?:e\s+|')(?:suis|étais|serais|me\ssens|me\ssentais)\s+(?P<w>" + ADJ_ALT + r")\b",
    re.IGNORECASE,
)
# Shape 3: je (me) suis + a motion/reflexive participle (<=1 adverb between).
RE_JE_SUIS_MOTION = re.compile(
    r"\bje\s+(?:me\s+)?suis\b(?:\s+" + WORD + r"){0,1}?\s+(?P<w>" + MOTION_ALT + r")\b",
    re.IGNORECASE,
)


def body_lines(text):
    lines = text.splitlines()
    if lines and lines[0].strip() == "---":
        end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
        if end is None:
            raise ValueError("frontmatter opened but never closed")
        start = end + 1
    else:
        start = 0
    for i in range(start, len(lines)):
        yield i + 1, lines[i]


def scan_text(text):
    marks = []
    for lineno, line in body_lines(text):
        for m in RE_ME_DANGER.finditer(line):
            if m.group("w").lower() in DANGER_PARTICIPLES:
                marks.append((lineno, "me+participle", m.group(0).strip()[:56]))
        for m in RE_JE_SUIS_MOTION.finditer(line):
            if m.group("w").lower() in MOTION_REFLEXIVE:
                marks.append((lineno, "je suis+participle", m.group(0).strip()[:56]))
        for m in RE_JE_ADJ.finditer(line):
            if m.group("w").lower() in GENDERED_ADJ:
                marks.append((lineno, "je+adjective", m.group(0).strip()[:56]))
        for m in RE_INF_COPULA.finditer(line):
            if m.group("w").lower() in GENDERED_ADJ:
                marks.append((lineno, "infinitive-copula+adj", m.group(0).strip()[:56]))
        for m in RE_COPULA_NOUN.finditer(line):
            if m.group("w").lower() not in ATTR_STOP:
                marks.append((lineno, "copula+attribute-noun", m.group(0).strip()[:56]))
    seen, out = set(), []
    for mk in marks:
        key = (mk[0], mk[2])
        if key not in seen:
            seen.add(key)
            out.append(mk)
    return out


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
    return subprocess.run(["git", "show", ref], capture_output=True, text=True, check=True).stdout


def selftest():
    """Bipolar probe on REAL committed material — never self-authored fixtures.
    MUST_BLOCK: historical pre-fix diary blobs (foreign to this guard) carry the marks
    Eta found. MUST_PASS: the fixed branch heads carry 0, and real invariant lines
    (indirect / DO-after / causative / « un peu ») are never flagged."""
    block = [  # (ref, expected minimum marks)
        ("fa293d05:content/fr/diary/day-239.mdx", 3),
        ("fa293d05:content/fr/diary/day-240.mdx", 2),
        ("fa293d05:content/fr/diary/day-242.mdx", 1),
        ("fa293d05:content/fr/diary/day-243.mdx", 3),
        ("f49322c0cd856e2af074e663146b372d333f4d68:content/fr/diary/day-244.mdx", 2),
        ("efd7064:content/fr/diary/day-239.mdx", 1),  # copula noun « j'étais un écrivain »
        ("efd7064:content/fr/diary/day-243.mdx", 1),  # inf-copula « paraître minutieux »
    ]
    passg = [  # fixed heads — 0 marks
        "e743687:content/fr/diary/day-239.mdx",
        "e743687:content/fr/diary/day-240.mdx",
        "e743687:content/fr/diary/day-242.mdx",
        "e743687:content/fr/diary/day-243.mdx",
        "e743687:content/fr/diary/day-236.mdx",
        "fd93570:content/fr/diary/day-244.mdx",
    ]
    invariant = [
        "Puis on m'a rapporté qu'elle s'était assise.",
        "Laurent m'a demandé de lui écrire.",
        "Laurent m'a coupé la parole là.",
        "Puis Laurent m'a posé des questions sur trois bateaux.",
        "le même facteur m'avait déjà fait m'arrêter une fois.",
        "il m'a montré le sceau.",
        "une leçon qu'on m'a déjà apprise, bien des fois.",
        "Il avait raison, et cela m'a semblé juste.",
        "j'ai été un peu surpris de la réponse.",  # « un peu » must not trip copula-noun
    ]
    inject = [
        ("Laurent m'a arrêté.", "me+participle"),
        ("Ce soir, j'étais un écrivain.", "copula+attribute-noun"),
        ("Je l'ai fait pour être sûr.", "infinitive-copula+adj"),
        ("Quand je suis allé voir.", "je suis+participle"),
        ("je suis prêt à partir.", "je+adjective"),
    ]
    fail = 0
    print("=== NARRATOR-GENDER GUARD — bipolar probe on real committed material ===")
    print("-- MUST_BLOCK: pre-fix blobs carry their marks --")
    total = 0
    for ref, want in block:
        try:
            marks = scan_text(git_show(ref))
        except subprocess.CalledProcessError:
            print(f"  FAIL: cannot read {ref}"); fail = 1; continue
        got = len(marks); total += got
        print(f"  {ref.split(':')[0][:8]} {ref.split('/')[-1]}: {got} (want >= {want}) {'ok' if got >= want else 'FAIL'}")
        if got < want:
            fail = 1
            for ln, cls, txt in marks:
                print(f"      l.{ln} [{cls}] {txt}")
    print(f"  total pre-fix marks: {total}")

    print("-- MUST_PASS: fixed heads carry 0 --")
    for ref in passg:
        try:
            marks = scan_text(git_show(ref))
        except subprocess.CalledProcessError:
            print(f"  FAIL: cannot read {ref}"); fail = 1; continue
        if marks:
            print(f"  FAIL: {ref.split('/')[-1]} flags {len(marks)}: {[m[2] for m in marks]}"); fail = 1
        else:
            print(f"  {ref.split('/')[-1]}: 0 ok")

    print("-- MUST_PASS: real invariant lines not flagged --")
    for line in invariant:
        marks = scan_text("---\nx: 1\n---\n" + line)
        if marks:
            print(f"  FAIL: false positive « {line[:44]} »: {[m[2] for m in marks]}"); fail = 1
        else:
            print(f"  ok: « {line[:44]}… »")

    print("-- MUST_BLOCK: one injected line per shape fires --")
    for probe, cls in inject:
        got = scan_text("---\nx: 1\n---\n" + probe)
        if any(c == cls for _, c, _ in got):
            print(f"  ok: {cls}")
        else:
            print(f"  FAIL: « {probe} » not flagged as {cls}: {got}"); fail = 1

    print("=== " + ("GUARD GREEN — both poles on real material" if not fail else "GUARD RED") + " ===")
    return fail


def main(argv):
    if len(argv) == 2 and argv[1] == "--selftest":
        sys.exit(3 if selftest() else 0)
    if len(argv) < 2:
        print("usage: check-narrator-gender.py <file.mdx>...  |  --selftest", file=sys.stderr)
        sys.exit(64)
    any_mark = any_blind = False
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
