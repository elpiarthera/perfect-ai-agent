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

# --- bipolar self-probe on real published entries --------------------------
selftest() {
  local fail=0
  echo "=== BIPOLAR PROBE (real published entries, both directions) ==="

  echo "-- liveness MUST read a known-live day as LIVE --"
  if liveness fr 233; then echo "  ok"; else echo "  FAIL: known-live day 233 not LIVE"; fail=1; fi

  echo "-- liveness MUST read the negative control (day $NEG_CONTROL_DAY) as ABSENT --"
  if liveness fr "$NEG_CONTROL_DAY"; then echo "  FAIL: negative control reported live"; fail=1; else echo "  ok"; fi

  local tmp_present tmp_clean
  tmp_present="$(mktemp)"; tmp_clean="$(mktemp)"
  printf 'Laurent asked the clerk.\nI taught the apprentice.\n' > "$tmp_present"
  printf 'The workshop was quiet.\nNothing to see here.\n'      > "$tmp_clean"

  echo "-- sweep MUST fire on a known-present standalone token --"
  if sweep "$tmp_present" "Laurent" "clerk"; then echo "  ok"; else echo "  FAIL: did not fire on present token"; fail=1; fi

  echo "-- sweep MUST be word-bounded: 'tau' must NOT match inside 'taught' --"
  if sweep "$tmp_present" "tau" "taught"; then echo "  FAIL: matched 'tau' inside 'taught'"; fail=1; else echo "  ok (no spurious match)"; fi

  echo "-- sweep MUST fail LOUD when its positive control is absent (blind instrument) --"
  sweep "$tmp_clean" "Laurent" "clerk" >/dev/null 2>&1
  if [ $? -eq 3 ]; then echo "  ok (refused the 0-hit)"; else echo "  FAIL: trusted a 0-hit on a blind instrument"; fail=1; fi

  echo "-- sweep MUST report CLEAN only with a confirmed control present --"
  if sweep "$tmp_clean" "Laurent" "workshop"; then echo "  FAIL: reported a hit on a clean file"; fail=1; else echo "  ok (clean, control confirmed)"; fi

  echo "-- count MUST carry its command --"
  count "control-lines" -- grep -c . "$tmp_present"

  rm -f "$tmp_present" "$tmp_clean"
  echo "=== $( [ $fail -eq 0 ] && echo 'PROBE GREEN — both poles exercised' || echo 'PROBE RED' ) ==="
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
