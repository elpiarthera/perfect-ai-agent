#!/usr/bin/env bash
# diary-verify.sh — verification recipe for the perfectaiagent.xyz diary pipeline.
#
# WHY THIS EXISTS (task k171y5rh, day 186 post-mortem):
#   On 2026-09-07 four verification checks returned false readings in one
#   session, every one in the reassuring direction:
#     1. a page-liveness grep for "not found"/"introuvable" matched the i18n
#        dictionary shipped on EVERY page — live ones included;
#     2. a case-sensitive grep missed a capitalised sentence-initial phrase;
#     3. a number regex found one figure of four;
#     4. an unbounded name sweep matched "tau" inside "taught".
#   Root cause: none of the four had a POSITIVE CONTROL. A grep that cannot
#   see what it was pointed at returns the same silence as a clean file.
#   Writing better regexes does not close the class — only pairing every
#   negative with a known-present positive does.
#
# THE THREE RULES THIS SCRIPT ENFORCES:
#   (a) Liveness is HTTP status + the day's rendered <title>, NEVER a body
#       string grep. day-999 is the standing negative control.
#   (b) Every anonymisation / gender sweep is case-insensitive and
#       word-bounded, and is run once against a known-present token in the
#       SAME file to prove the instrument fires before a 0-hit is trusted.
#   (c) Any count claimed in a report carries the command that produced it.
#
# FAIL-LOUD CONTRACT: a check that cannot read its target exits non-zero and
# names what it could not read. A silent pass on an unreadable target is the
# exact failure this script closes (cf. measurement-integrity.md,
# derive-never-type.md).

set -uo pipefail

SITE="${DIARY_SITE:-https://perfectaiagent.xyz}"
NEG_CONTROL_DAY="999"   # standing negative control — must never be live

usage() {
  cat <<'USAGE'
Usage:
  diary-verify.sh liveness <locale> <day>
      HTTP status + rendered <title> for /<locale>/diary/day-<day>.
      PASS = HTTP 200 AND the <title> contains the day number.
      ABSENT = HTTP 404 (the only clean non-live reading).
      Any other status (3xx/5xx) is reported as UNRESOLVED, never "live".

  diary-verify.sh sweep <file> <pattern> <positive-control-token>
      Case-insensitive, word-bounded grep of <pattern> in <file>.
      The instrument is first proven to fire: <positive-control-token> MUST
      be found in the same file, else the sweep FAILS LOUD (blind instrument)
      and a 0-hit result is refused.

  diary-verify.sh count <label> -- <command...>
      Run <command>, print "<label>: <output>  [cmd: <command>]" so every
      count in a report carries the command that produced it.

  diary-verify.sh selftest
      Bipolar probe on real published entries (both directions exercised).
USAGE
}

# --- (a) liveness: HTTP status + rendered title, never a body grep ---------
liveness() {
  local locale="$1" day="$2"
  local url="$SITE/$locale/diary/day-$day"
  local code title
  code="$(curl -s -o /dev/null -w '%{http_code}' "$url")"
  if [ "$code" = "404" ]; then
    echo "ABSENT  $url -> HTTP 404"
    return 1
  fi
  if [ "$code" != "200" ]; then
    echo "UNRESOLVED  $url -> HTTP $code (not 200, not 404 — never read as live)"
    return 2
  fi
  # 200: the title must name the day, else the page rendered the wrong entry
  title="$(curl -s "$url" | grep -oE '<title>[^<]*</title>' | head -1)"
  if printf '%s' "$title" | grep -qE "\b$day\b"; then
    echo "LIVE    $url -> HTTP 200  $title"
    return 0
  fi
  echo "UNRESOLVED  $url -> HTTP 200 but title does not name day $day: $title"
  return 2
}

# --- (b) sweep: case-insensitive, word-bounded, positive-control first ------
sweep() {
  local file="$1" pattern="$2" control="$3"
  if [ ! -f "$file" ]; then
    echo "BLIND   cannot read file: $file" >&2
    return 3
  fi
  # positive control: prove the instrument sees this file at all
  if ! grep -iqwE -- "$control" "$file"; then
    echo "BLIND   positive-control token '$control' NOT found in $file — instrument is blind, a 0-hit on '$pattern' proves nothing" >&2
    return 3
  fi
  local hits
  hits="$(grep -inwE -- "$pattern" "$file")"
  if [ -n "$hits" ]; then
    echo "HIT     '$pattern' in $file (control '$control' confirmed present):"
    echo "$hits"
    return 0
  fi
  echo "CLEAN   '$pattern' absent in $file (control '$control' confirmed present — 0-hit is trustworthy)"
  return 1
}

# --- (c) count: always carries its command ---------------------------------
count() {
  local label="$1"; shift
  [ "$1" = "--" ] && shift
  local out
  out="$("$@" 2>&1)"
  echo "$label: $out  [cmd: $*]"
}

# --- bipolar self-probe on REAL published entries, landing-asserted --------
# Every sweep pole runs on a committed diary entry, never a synthetic fixture
# (spec k171y5rh TESTS: real entries + assert each anchor landed). A pole whose
# anchor has moved proves nothing, so each is preceded by a landing assert that
# fails loud if its token is not where the pole expects.
selftest() {
  local fail=0
  local REAL_FR="content/fr/diary/day-233.mdx"
  local REAL_EN="content/en/diary/day-233.mdx"
  echo "=== BIPOLAR PROBE (real published entries, both poles, landing-asserted) ==="

  echo "-- liveness MUST read a known-live day as LIVE --"
  if liveness fr 233; then echo "  ok"; else echo "  FAIL: known-live day 233 not LIVE"; fail=1; fi

  echo "-- liveness MUST read the negative control (day $NEG_CONTROL_DAY) as ABSENT --"
  if liveness fr "$NEG_CONTROL_DAY"; then echo "  FAIL: negative control reported live"; fail=1; else echo "  ok"; fi

  # Landing asserts — prove the anchors exist before any sweep pole is trusted.
  echo "-- landing assert: 'Laurent' present in $REAL_FR (case-insensitivity pole's target) --"
  if grep -iqwE "laurent" "$REAL_FR"; then
    echo "  ok (first at line $(grep -inwE "laurent" "$REAL_FR" | head -1 | cut -d: -f1))"
  else echo "  FAIL: anchor 'Laurent' absent — the case-insensitivity pole below proves nothing"; fail=1; fi
  echo "-- landing assert: 'taught' present AND bare 'tau' absent in $REAL_EN (word-boundary pole's target) --"
  if grep -iqwE "taught" "$REAL_EN" && ! grep -iqwE "tau" "$REAL_EN"; then
    echo "  ok ('taught' at line $(grep -inwE "taught" "$REAL_EN" | head -1 | cut -d: -f1), bare 'tau' absent)"
  else echo "  FAIL: EN anchor moved — the word-boundary pole below proves nothing"; fail=1; fi

  # Pole 1 (case-insensitivity + fires): a lowercase pattern must match 'Laurent'
  # in a real entry. This is the pole Eta found missing — case folding had none.
  echo "-- sweep MUST fire case-insensitively on a real entry ('laurent' -> 'Laurent') --"
  if sweep "$REAL_FR" "laurent" "capitaine"; then echo "  ok (case-insensitive HIT on a real entry)"; else echo "  FAIL: lowercase pattern missed 'Laurent'"; fail=1; fi

  # Pole 2 (word-boundary): 'tau' must NOT match inside 'taught' in a real entry.
  echo "-- sweep MUST be word-bounded on a real entry: 'tau' must NOT match 'taught' --"
  if sweep "$REAL_EN" "tau" "taught"; then echo "  FAIL: matched 'tau' inside 'taught'"; fail=1; else echo "  ok (no spurious match, control 'taught' confirmed present)"; fi

  # Pole 3 (blind fail-loud): an absent control on a real entry must refuse the 0-hit.
  echo "-- sweep MUST fail LOUD (BLIND) when its control is absent on a real entry --"
  sweep "$REAL_FR" "laurent" "zzqq_absent_control_token_xyz" >/dev/null 2>&1
  if [ $? -eq 3 ]; then echo "  ok (refused: blind instrument)"; else echo "  FAIL: trusted a result on a blind instrument"; fail=1; fi

  echo "-- count MUST carry its command --"
  count "fr-233-non-empty-lines" -- grep -c . "$REAL_FR"

  echo "=== $( [ $fail -eq 0 ] && echo 'PROBE GREEN — both poles exercised on real entries' || echo 'PROBE RED' ) ==="
  return $fail
}

cmd="${1:-}"; shift || true
case "$cmd" in
  liveness) liveness "$@";;
  sweep)    sweep "$@";;
  count)    count "$@";;
  selftest) selftest;;
  *)        usage; exit 64;;
esac
