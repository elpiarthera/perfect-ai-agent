#!/usr/bin/env bash
# generate-day50-audio.sh
# Generates Day 50 FR audio via fal.ai MiniMax Speech-2.8-Turbo
# using Pi's cloned voice (ttv-voice-2026032704355926-zUb4NZ4I).
#
# FR ONLY — Day 50 milestone post is French-only.
# Splits into 2 chunks (each < 5000 chars) and concatenates with ffmpeg.
# Then uploads to Convex PROD (laudable-hedgehog-797) and dual-writes to
# Convex DEV (neat-frog-379) at zero additional fal.ai cost.
#
# Model: fal-ai/minimax/speech-2.8-turbo (cloned voice, NOT speech-02-turbo)
# Voice: ttv-voice-2026032704355926-zUb4NZ4I (Pi clone — Day 50+)
# Pause format: <#1.5#> for --- section dividers (MiniMax native, NOT SSML)
#
# Prerequisites:
#   - FAL_KEY in .env.local (account must have balance)
#   - ffmpeg installed
#   - CONVEX_URL_AUDIO in .env.local (PROD URL laudable-hedgehog-797)
#   - num2words Python package (pip install num2words)
#
# Usage: bash scripts/generate-day50-audio.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load env
source "$PROJECT_DIR/.env.local"

FAL_KEY="${FAL_KEY:?FAL_KEY not set}"
CONVEX_URL="${CONVEX_URL_AUDIO:-${NEXT_PUBLIC_CONVEX_URL:?CONVEX_URL_AUDIO or NEXT_PUBLIC_CONVEX_URL must be set}}"
echo "[audio] Writing audio to PROD deployment: $CONVEX_URL"

VOICE_ID="ttv-voice-2026032704355926-zUb4NZ4I"
MODEL="fal-ai/minimax/speech-2.8-turbo"

# Step 1: Preprocess — strip frontmatter, convert numbers, add pause markers
echo "[step 1] Preprocessing day-50.mdx (FR)..."
python3 - <<'PYEOF'
import re
from num2words import num2words

LANG_WORDS = {"fr": {"euros": "euros", "euro": "euro", "percent": "pour cent", "number": "numéro"}}

def normalize_thousands(text):
    pattern = re.compile(r"(\d+)[\s ,](\d{3})(?=\D|$)")
    prev = None
    while prev != text:
        prev = text
        text = pattern.sub(r"\1\2", text)
    return text

def digits_to_words(text, lang):
    words_map = LANG_WORDS.get(lang, {})
    def repl_currency(m):
        return f"{num2words(int(m.group('num')), lang=lang)} {words_map['euros']}"
    text = re.sub(r"(?P<num>\d+)\s*€", repl_currency, text)
    text = re.sub(r"€\s*(?P<num>\d+)", repl_currency, text)
    def repl_percent(m):
        return f"{num2words(int(m.group('num')), lang=lang)} {words_map['percent']}"
    text = re.sub(r"(?P<num>\d+)\s*%", repl_percent, text)
    def repl_int(m):
        try:
            return num2words(int(m.group(0)), lang=lang)
        except ValueError:
            return m.group(0)
    text = re.sub(r"(?<![\w.])\d+(?![\w.])", repl_int, text)
    return text

import sys
src = "content/fr/diary/day-50.mdx"
with open(src, encoding="utf-8") as f:
    content = f.read()

# Strip frontmatter
parts = content.split("---", 2)
body = parts[2] if len(parts) >= 3 else content

# Replace standalone --- with pause marker (BEFORE stripping)
body = re.sub(r"^\s*---\s*$", "<#1.5#>", body, flags=re.MULTILINE)

# Strip markdown
body = re.sub(r"^#+\s*", "", body, flags=re.MULTILINE)
body = re.sub(r"\*\*([^*]+)\*\*", r"\1", body)
body = re.sub(r"\*([^*]+)\*", r"\1", body)
body = re.sub(r"`([^`]+)`", r"\1", body)
body = re.sub(r"\n{3,}", "\n\n", body)
body = body.strip()

# Number conversions
body = normalize_thousands(body)
body = digits_to_words(body, "fr")

with open("/tmp/day-50-fr-paused.txt", "w", encoding="utf-8") as f:
    f.write(body)

print(f"Written: {len(body)} chars, pauses: {body.count('<#1.5#>')}")
PYEOF

# Step 2: Split at 4th pause marker (keeps both chunks under 5000 chars)
echo "[step 2] Splitting into chunks..."
python3 - <<'PYEOF'
import re
with open("/tmp/day-50-fr-paused.txt", encoding="utf-8") as f:
    text = f.read()

pauses = [m.start() for m in re.finditer(r"<#1\.5#>", text)]
split_pos = pauses[3]  # 4th pause ~ 54% of total

chunk1 = text[:split_pos + len("<#1.5#>")].strip()
chunk2 = text[split_pos + len("<#1.5#>"):].strip()

with open("/tmp/day-50-fr-chunk1.txt", "w", encoding="utf-8") as f:
    f.write(chunk1)
with open("/tmp/day-50-fr-chunk2.txt", "w", encoding="utf-8") as f:
    f.write(chunk2)

print(f"Chunk1: {len(chunk1)} chars | Chunk2: {len(chunk2)} chars")
PYEOF

# Step 3: Generate audio chunks via fal.ai
generate_chunk() {
  local text_file="$1"
  local voice="$2"
  local lang="$3"
  local out_mp3="$4"
  local label="$5"

  echo "[fal.ai] Generating $label..."

  PAYLOAD=$(python3 - "$text_file" "$voice" "$lang" <<'PYEOF'
import json, sys
text_file, voice_id, lang = sys.argv[1], sys.argv[2], sys.argv[3]
with open(text_file, encoding="utf-8") as f:
    text = f.read()
print(json.dumps({"text": text, "voice_id": voice_id, "language": lang}))
PYEOF
)

  RESPONSE=$(curl -s -X POST "https://fal.run/$MODEL" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD")

  if echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); exit(0 if 'audio' in d else 1)" 2>/dev/null; then
    AUDIO_URL=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['audio']['url'])")
    DURATION=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('duration_ms', 0))")
    echo "  URL: $AUDIO_URL"
    echo "  Duration: ${DURATION}ms"
    curl -s -o "$out_mp3" "$AUDIO_URL"
    echo "  Saved $out_mp3 ($(wc -c < "$out_mp3") bytes)"
  else
    echo "ERROR generating $label:"
    echo "$RESPONSE"
    exit 1
  fi
}

generate_chunk "/tmp/day-50-fr-chunk1.txt" "$VOICE_ID" "fr" "/tmp/day-50-fr-c1.mp3" "FR chunk 1"
generate_chunk "/tmp/day-50-fr-chunk2.txt" "$VOICE_ID" "fr" "/tmp/day-50-fr-c2.mp3" "FR chunk 2"

# Step 4: Concat chunks
echo "[step 4] Concatenating chunks with ffmpeg..."
echo "file '/tmp/day-50-fr-c1.mp3'" > /tmp/day-50-fr-list.txt
echo "file '/tmp/day-50-fr-c2.mp3'" >> /tmp/day-50-fr-list.txt
ffmpeg -y -f concat -safe 0 -i /tmp/day-50-fr-list.txt -c copy /tmp/day-50-fr.mp3
DURATION_S=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 /tmp/day-50-fr.mp3 2>/dev/null)
echo "Final FR MP3: $(wc -c < /tmp/day-50-fr.mp3) bytes | Duration: ${DURATION_S}s"

# Step 5: Upload to Convex PROD
echo ""
echo "[step 5] Uploading to Convex PROD ($CONVEX_URL)..."

upload_to_convex() {
  local mp3_file="$1"
  local slug="$2"
  local locale="$3"
  local target_url="$4"

  UPLOAD_URL=$(curl -s -X POST "$target_url/api/mutation" \
    -H "Content-Type: application/json" \
    -d '{"path": "audio:generateUploadUrl", "args": {}, "format": "json"}' \
    | python3 -c "import json,sys; print(json.load(sys.stdin)['value'])")

  STORAGE_RESP=$(curl -s -X POST "$UPLOAD_URL" \
    -H "Content-Type: audio/mpeg" \
    --data-binary "@$mp3_file")

  STORAGE_ID=$(echo "$STORAGE_RESP" | python3 -c "import json,sys; print(json.load(sys.stdin)['storageId'])")
  echo "  storageId: $STORAGE_ID"

  SAVE_PAYLOAD=$(python3 - "$slug" "$locale" "$STORAGE_ID" <<'PYEOF'
import json, sys
slug, locale, storage_id = sys.argv[1], sys.argv[2], sys.argv[3]
print(json.dumps({
    "path": "audio:saveAudioFile",
    "args": {"slug": slug, "locale": locale, "storageId": storage_id, "filename": f"{slug}-{locale}.mp3"},
    "format": "json"
}))
PYEOF
)

  curl -s -X POST "$target_url/api/mutation" \
    -H "Content-Type: application/json" \
    -d "$SAVE_PAYLOAD" | python3 -c "import json,sys; print('  Saved record ID:', json.load(sys.stdin).get('value'))"

  PUBLIC_URL=$(curl -s -X POST "$target_url/api/query" \
    -H "Content-Type: application/json" \
    -d "{\"path\": \"audio:getAudioUrl\", \"args\": {\"slug\": \"$slug\", \"locale\": \"$locale\"}, \"format\": \"json\"}" \
    | python3 -c "import json,sys; print(json.load(sys.stdin).get('value'))")
  echo "  Public URL: $PUBLIC_URL"
}

upload_to_convex "/tmp/day-50-fr.mp3" "day-50" "fr" "$CONVEX_URL"
echo "PROD upload complete."

# Step 6: Dual-write to DEV
echo ""
echo "[step 6] Dual-write to Convex DEV (neat-frog-379)..."
cd "$PROJECT_DIR"
npx tsx scripts/upload-day50-to-dev.mts

echo ""
echo "Done. PROD (laudable-hedgehog-797) and DEV (neat-frog-379) both have day-50/fr."
echo "Model: $MODEL | Voice: $VOICE_ID | Pause format: <#1.5#>"
