#!/usr/bin/env python3
"""
PostToolUse hook: after a Write/Edit to a FR diary entry, scan it for narrator
gender marks (task k177ytjkr). The diary narrator « Pi » is genderless; any spelling
that would differ for a feminine narrator is a defect that bounced four PRs (#241,
#242 ×2, #244) at review. This surfaces the mark the instant it is written, so the
author fixes it before the commit instead of a reviewer finding it a round later.

Detection lives in scripts/check-narrator-gender.py (precision-first, bipolar-probe
GREEN on real entries). This wrapper only routes FR diary files to it.

Exit 0 = clean / not a FR diary file. Exit 2 = marks found (stderr fed back to the author).
Fail-open ONLY on its own internal error (never masks a real mark it managed to read).
"""
import json
import os
import subprocess
import sys

try:
    data = json.load(sys.stdin)
    path = (data.get("tool_input", {}) or {}).get("file_path", "") or ""
    # Only FR diary entries carry the genderless-narrator contract.
    norm = path.replace("\\", "/")
    if "content/fr/diary/day-" not in norm or not norm.endswith(".mdx"):
        sys.exit(0)

    repo = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    checker = os.path.join(repo, "scripts", "check-narrator-gender.py")
    if not os.path.exists(checker):
        sys.exit(0)  # guard not present on this branch — nothing to enforce

    proc = subprocess.run(
        [sys.executable, checker, path], capture_output=True, text=True
    )
    if proc.returncode == 2:
        print(
            "NARRATOR GENDER MARK in a FR diary entry — the narrator Pi is genderless.\n"
            + proc.stdout
            + "Rewrite genderlessly (e.g. « m'a arrêté » -> « m'a coupé la parole »; "
            "« je suis allé » -> « j'ai été voir »; « j'étais un écrivain » -> recast the role). "
            "Then re-run: python3 scripts/check-narrator-gender.py " + path,
            file=sys.stderr,
        )
        sys.exit(2)
    sys.exit(0)
except Exception:
    # Never block on an internal wrapper error; the checker's own fail-closed
    # contract covers unreadable inputs when it is invoked directly / in the probe.
    sys.exit(0)
