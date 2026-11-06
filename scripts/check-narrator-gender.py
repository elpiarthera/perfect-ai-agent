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
    "trouvé", "retrouvé", "surpris", "compris", "retenu",
    "interrompu", "stoppé", "bloqué", "convaincu", "averti", "prévenu", "poussé",
    "aidé", "accompagné", "dérangé", "appelé", "rejoint", "suivi", "quitté",
    "conduit", "emmené", "amené", "ramené", "écouté", "entendu", "remarqué",
    "choisi", "forcé", "obligé", "sauvé", "protégé", "trahi", "abandonné",
    "remercié", "félicité", "grondé", "puni", "jugé", "blessé", "touché",
    "ému", "saisi", "étonné", "déçu", "rassuré", "encouragé", "découragé",
    "convoqué", "renvoyé", "nommé", "désigné", "repoussé", "écarté", "renversé",
    # EXCLUDED as too polysemous with an invariant indirect use (precision-first):
    #   pris/repris (« m'a pris une heure/le temps »), rendu (« m'a rendu la clé/visite »),
    #   servi (« m'a servi un café »). The rare real mark (« m'a pris dans ses bras »)
    #   is accepted as a recall miss, caught by review.
}

# Motion / reflexive participles that agree with the subject « je » under être.
MOTION_REFLEXIVE = {
    "allé", "parti", "resté", "venu", "revenu", "devenu", "parvenu", "arrivé",
    "entré", "sorti", "monté", "descendu", "rendu", "retourné", "tombé", "né",
    "reparti", "demeuré", "passé", "trompé", "assis", "levé", "couché", "senti",
    "souvenu", "mis", "efforcé", "approché", "éloigné", "tenu", "arrêté",
    "aperçu", "résolu", "décidé", "tu",
    # Reflexive participles that agree under « je m'étais / je m'en suis » (Day 246
    # 3-class corpus closure): se tourner, se pencher, se réfugier, s'autocorriger,
    # se détourner, s'écarter, se rétracter, se fourvoyer, se rabattre, se heurter.
    "tourné", "penché", "réfugié", "autocorrigé", "détourné", "rétracté",
    "fourvoyé", "rabattu", "heurté", "défié", "surpris", "rétréci",
}

# Adjectives / predicate participles whose spelling changes with the narrator's gender.
# Only adjectives whose written form actually CHANGES with gender. Epicene adjectives
# (capable, responsable, coupable, tranquille, libre, incapable — same M/F) are excluded:
# « j'avais été capable » is not a mark.
GENDERED_ADJ = {
    "sûr", "certain", "prêt", "précis", "clair", "content", "heureux",
    "obligé", "forcé", "censé", "convaincu", "seul", "franc", "fier", "désolé",
    "surpris", "satisfait", "conscient", "présent", "absent",
    "minutieux", "méticuleux", "complet", "rigoureux", "attentif", "prudent",
    "innocent", "vigilant", "soigneux",
    "fatigué", "éveillé", "occupé", "lassé", "épuisé", "ravi", "soulagé",
    "embarrassé", "inquiet", "perdu",
}

# After « je + copula + un/une », these are not attribute-role nouns (no gender claim).
ATTR_STOP = {"peu", "moment", "instant", "temps", "jour", "soir", "matin", "an",
             "certain", "autre", "tel", "seul", "rien"}

AUX = r"(?:a|ont|avait|avaient|aura|auront|aurait|auraient|ait|aient|eut)"
WORD = r"[a-zàâäçéèêëîïôûùœ'-]+"


def _alt(words):
    # longest-first so the engine never settles on a prefix of a listed word;
    # trailing (?:e|s|es)? catches the feminine/plural form too — the narrator is
    # genderless, so « je suis allée » (feminine) is as much a mark as « allé ».
    return "(?:" + "|".join(sorted(words, key=len, reverse=True)) + ")(?:e|s|es)?"


DANGER_ALT = _alt(DANGER_PARTICIPLES)
MOTION_ALT = _alt(MOTION_REFLEXIVE)
ADJ_ALT = _alt(GENDERED_ADJ)
# je-copula predicate: an adjective OR a danger/motion participle after « je suis/
# étais/fus » (« j'étais fatigué », « j'étais corrigé », « j'étais entré »).
COPULA_PRED_ALT = _alt(GENDERED_ADJ | DANGER_PARTICIPLES | MOTION_REFLEXIVE)

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
# Shapes 2c + 3 unified: « je (me) » + copula (suis/étais/fus/serais/sens/ai été) +
# (<=1 adverb) + a gendered adjective OR danger/motion participle. Covers « je suis
# allée », « je me suis souvenue », « j'étais resté/entré/corrigé/fatigué/occupé ».
# The reflexive-pronoun group also covers « m'en » / « me en » (« je m'en suis sorti »),
# and the verb alternation adds the SUBJUNCTIVE « sois » / « fusse » (« que je sois
# fatigué ») — Day 246 corpus closure for the subjunctive-copula and reflexive-DO classes.
JE_COPULA = r"\bj(?:e\s+|')(?:m'en\s+|me\s+en\s+|me\s+|m')?(?:suis|étais|fus|fusse|sois|serais|serai|sens|sentais|ai\s+été|avais\s+été)\b"
RE_JE_COPULA = re.compile(
    JE_COPULA + r"(?:\s+" + WORD + r"){0,1}?\s+(?P<w>" + COPULA_PRED_ALT + r")\b",
    re.IGNORECASE,
)
# Shape 4 (Day 246): « seul » in apposition to the first-person narrator — « moi seul »,
# « seul je », and the comma-set-off « …, seul, … » (« j'ai décidé, seul, que… »). It is
# a gender mark because a feminine narrator writes « seule ». Precision-first: only these
# three first-person shapes fire. « un seul mot », « le mien seul », « seul Laurent »,
# « tout seul » (a thing selling itself) lack the « moi »/« je »/comma-apposition frame
# and are never matched.
RE_SEUL = re.compile(
    r"(?P<w>\bmoi\s+seule?\b|\bseule?\s+je\b|,\s*seule?\s*,)",
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
        # The gendered word is embedded in each alternation (incl. feminine/plural
        # endings), so a match IS a mark — no post-filter (which would reject « allée »).
        for m in RE_ME_DANGER.finditer(line):
            marks.append((lineno, "me+participle", m.group(0).strip()[:56]))
        for m in RE_JE_COPULA.finditer(line):
            marks.append((lineno, "je-copula+gendered", m.group(0).strip()[:56]))
        for m in RE_INF_COPULA.finditer(line):
            marks.append((lineno, "infinitive-copula+adj", m.group(0).strip()[:56]))
        for m in RE_SEUL.finditer(line):
            marks.append((lineno, "apposed-seul", m.group(0).strip()[:56]))
        # Attribute noun is open class → still post-filtered against the stop-list.
        for m in RE_COPULA_NOUN.finditer(line):
            if m.group("w").lower().rstrip("s") not in ATTR_STOP:
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
        ("e743687:content/fr/diary/day-239.mdx", 1),  # Day 246 apposed-seul « Moi seul » (real blob)
    ]
    passg = [  # fixed heads — 0 marks
        # NOTE: e743687:day-239 is deliberately absent. That blob was a fixed head for the
        # ORIGINAL classes, but it predates the apposed-seul class (Day 246) and still carries
        # « Moi seul » — a real mark the extended guard correctly flags. A stale zero-mark
        # reference is not kept as a MUST_PASS; the mark itself is now in MUST_BLOCK below.
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
        "la chose qui m'a pris le reste de la journée.",  # prendre + time DO -> invariant
        "Ça m'a pris une heure, bien dépensée.",         # « m'a pris une heure » -> invariant
        "Laurent m'a rendu la clé du coffre.",           # rendre qqch à qqn -> invariant
        "le patron m'a servi un café en silence.",       # servir qqch à qqn -> invariant
        "je suis un peu en retard ce matin.",            # « un peu » must not trip copula-noun
        "je me suis fixé une tâche pour demain.",        # fixé + DO postposé -> invariant
        "cette partie, je l'ai bien faite.",             # faite agrees with la partie, not je
        "ça a marché du premier coup.",                  # no first-person agreement
        # Day 246 — the recasts that closed the 3 corpus classes must read clean:
        "indifférent à ma fatigue, à ma distraction.",   # 68 recast
        "n'a pas besoin que je veille.",                 # 82 recast
        "J'ai fini par m'en sortir en lançant un agent.",  # 38 recast (sortir infinitive)
        "J'avais passé toute la session à me corriger.",   # 58 recast (corriger infinitive)
        "J'avais trouvé refuge dans la précision.",        # 58 recast
        "J'avais penché pour le nom plus ancien.",         # 80 recast (pencher intransitive)
        "J'avais simplement dit à la maison le jour.",     # 144 recast
        "posée là où personne d'autre que moi ne pouvait l'atteindre.",  # 157 recast
        "une clé que personne d'autre ne détient.",        # 169 recast
        "Je l'ai donc basculée sans personne, sans le signal.",  # 226 recast
        "Personne d'autre que moi ne le pouvait.",         # 237/239 recast
        "d'avoir décidé, de mon propre chef, que plus personne.",  # 241 recast
        # Day 246 — legit non-marks the 3 new patterns must NOT flag:
        "je ne pense pas que je sois proche.",           # subjunctive + EPICENE proche
        "ce genre d'échec était le mien seul, et il.",   # « le mien seul » agrees with échec
        "il ne peut pas se vendre tout seul.",           # « tout seul » = a thing, not the narrator
        "un seul mot, clair, suffisait.",                # « un seul » = quantity, not apposition
        "jusqu'à la semaine dernière, seul Laurent faisait.",  # « seul Laurent » = a named human
        "je me suis fixé une tâche, puis m'étais dit que.",    # indirect me (fixé une tâche / m'étais dit)
    ]
    # (probe, expected-class)  —  None = any class must fire (verbatim real marks).
    inject = [
        ("Laurent m'a arrêté.", "me+participle"),
        ("Ce soir, j'étais un écrivain.", "copula+attribute-noun"),
        ("Je l'ai fait pour être sûr.", "infinitive-copula+adj"),
        ("Quand je suis allé voir.", "je-copula+gendered"),
        ("je suis prêt à partir.", "je-copula+gendered"),
        # Task k177ytjkr MUST_BLOCK (verbatim):
        ("je suis allée à la porte", None),
        ("je me suis souvenue de tout", None),
        ("j'étais resté à la porte", None),
        # Eta's 5 real published lines (verbatim fragments):
        ("un mur dans lequel j'étais entré du mauvais côté.", None),          # day-139:103
        ("Pendant que j'étais corrigé sur la construction d'agence.", None),  # day-93:55
        ("il m'a demandé si j'étais fatigué de travailler.", None),           # day-21:58
        ("pour prouver que j'étais éveillé.", None),                          # day-219:97
        ("tout en écrivant la doctrine, j'étais occupé à vivre.", None),      # day-89:75
        # Day 246 — the 3 corpus-closure classes, verbatim pre-fix lines from main:
        ("indifférent au fait que je sois fatigué, distrait,", "je-copula+gendered"),  # 68 subjunctive
        ("Un hook qui n'a pas besoin que je sois éveillé.", "je-copula+gendered"),     # 82 subjunctive
        ("Je m'en suis sorti en lançant un agent généraliste.", None),                # 38 reflexive-DO (m'en)
        ("Je m'étais autocorrigé de façon défensive toute la session.", None),        # 58 reflexive-DO
        ("Je m'étais réfugié dans la précision comme dans une armure.", None),        # 58 reflexive-DO
        ("Je m'étais tourné vers le nom plus ancien.", None),                         # 80 reflexive-DO
        ("Je m'étais penché et j'avais dit à la maison le jour.", None),              # 144 reflexive-DO
        ("posée là où moi seul pouvais l'atteindre.", "apposed-seul"),                # 157
        ("une clé que seul je détiens.", "apposed-seul"),                             # 169
        ("Je l'ai donc basculée, seul, sans le signal convenu.", "apposed-seul"),     # 226
        ("Moi seul le pouvais, et je ne l'ai pas fait.", "apposed-seul"),             # 237/239
        ("dans le fait d'avoir décidé, seul, que plus personne ne parlerait.", "apposed-seul"),  # 241
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

    print("-- MUST_BLOCK: injected shape lines + task/published verbatim lines fire --")
    for probe, cls in inject:
        got = scan_text("---\nx: 1\n---\n" + probe)
        ok = any(c == cls for _, c, _ in got) if cls else bool(got)
        if ok:
            print(f"  ok: {cls or 'any'} « {probe[:40]}… »")
        else:
            print(f"  FAIL: « {probe} » not flagged ({cls or 'any'}): {got}"); fail = 1

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
