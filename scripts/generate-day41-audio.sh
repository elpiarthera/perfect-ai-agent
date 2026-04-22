#!/usr/bin/env bash
# generate-day41-audio.sh
# Generates Day 41 EN + FR audio via fal.ai MiniMax Speech-02 Turbo,
# concatenates chunks, uploads to Convex prod (laudable-hedgehog-797).
#
# Prerequisites:
#   - FAL_KEY in .env.local (account must have balance)
#   - ffmpeg installed
#   - npx tsx available
#   - CONVEX_URL_AUDIO in .env.local (prod URL; falls back to NEXT_PUBLIC_CONVEX_URL)
#
# Usage: bash scripts/generate-day41-audio.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load env
source "$PROJECT_DIR/.env.local"

FAL_KEY="${FAL_KEY:?FAL_KEY not set}"
# Audio uploads target PROD explicitly. perfectaiagent.xyz reads from PROD;
# writing to DEV (neat-frog-379) makes audio invisible to users (Days 35-46 bug, 2026-04-09 → 2026-04-22).
CONVEX_URL="${CONVEX_URL_AUDIO:-${NEXT_PUBLIC_CONVEX_URL:?CONVEX_URL_AUDIO or NEXT_PUBLIC_CONVEX_URL must be set}}"
echo "[audio] Writing audio to deployment: $CONVEX_URL"

EN_CHUNK1="/tmp/day-41-en-chunk1.txt"
EN_CHUNK2="/tmp/day-41-en-chunk2.txt"
FR_CHUNK1="/tmp/day-41-fr-chunk1.txt"
FR_CHUNK2="/tmp/day-41-fr-chunk2.txt"
FR_CHUNK3="/tmp/day-41-fr-chunk3.txt"

# Check preprocessed chunks exist
for f in "$EN_CHUNK1" "$EN_CHUNK2" "$FR_CHUNK1" "$FR_CHUNK2" "$FR_CHUNK3"; do
  if [ ! -f "$f" ]; then
    echo "ERROR: Missing chunk file $f"
    echo "Run: python3 scripts/audio-prep.py content/en/diary/day-41.mdx en /tmp/day-41-en.txt"
    echo "Then: python3 scripts/split-chunks.py (or re-run the prep script)"
    exit 1
  fi
done

generate_chunk() {
  local text_file="$1"
  local voice_id="$2"
  local lang="$3"
  local out_mp3="$4"
  local label="$5"

  echo "Generating $label..."
  TEXT=$(cat "$text_file")

  RESPONSE=$(curl -s -X POST "https://fal.run/fal-ai/minimax/speech-02-turbo" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "import json,sys; t=open('$text_file').read(); print(json.dumps({'text': t, 'voice_id': '$voice_id', 'language': '$lang'}))")")

  if echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); exit(0 if 'audio' in d or 'audio_url' in d else 1)" 2>/dev/null; then
    AUDIO_URL=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('audio', {}).get('url', '') or d.get('audio_url', ''))")
    echo "  -> $AUDIO_URL"
    curl -s -o "$out_mp3" "$AUDIO_URL"
    echo "  Saved $out_mp3 ($(wc -c < "$out_mp3") bytes)"
  else
    echo "ERROR generating $label:"
    echo "$RESPONSE"
    exit 1
  fi
}

# --- EN chunks ---
generate_chunk "$EN_CHUNK1" "English_Trustworthy_Man" "en" "/tmp/day-41-en-c1.mp3" "EN chunk 1"
generate_chunk "$EN_CHUNK2" "English_Trustworthy_Man" "en" "/tmp/day-41-en-c2.mp3" "EN chunk 2"

# Concat EN
echo "file '/tmp/day-41-en-c1.mp3'" > /tmp/day-41-en-list.txt
echo "file '/tmp/day-41-en-c2.mp3'" >> /tmp/day-41-en-list.txt
ffmpeg -y -f concat -safe 0 -i /tmp/day-41-en-list.txt -c copy /tmp/day-41-en.mp3
echo "EN concat done: $(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 /tmp/day-41-en.mp3 2>/dev/null)s"

# --- FR chunks ---
generate_chunk "$FR_CHUNK1" "French_Elegant_Man" "fr" "/tmp/day-41-fr-c1.mp3" "FR chunk 1"
generate_chunk "$FR_CHUNK2" "French_Elegant_Man" "fr" "/tmp/day-41-fr-c2.mp3" "FR chunk 2"
generate_chunk "$FR_CHUNK3" "French_Elegant_Man" "fr" "/tmp/day-41-fr-c3.mp3" "FR chunk 3"

# Concat FR
echo "file '/tmp/day-41-fr-c1.mp3'" > /tmp/day-41-fr-list.txt
echo "file '/tmp/day-41-fr-c2.mp3'" >> /tmp/day-41-fr-list.txt
echo "file '/tmp/day-41-fr-c3.mp3'" >> /tmp/day-41-fr-list.txt
ffmpeg -y -f concat -safe 0 -i /tmp/day-41-fr-list.txt -c copy /tmp/day-41-fr.mp3
echo "FR concat done: $(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 /tmp/day-41-fr.mp3 2>/dev/null)s"

# --- Upload to Convex ---
echo ""
echo "Uploading to Convex ($CONVEX_URL)..."

upload_to_convex() {
  local mp3_file="$1"
  local slug="$2"
  local locale="$3"

  # Get upload URL
  UPLOAD_URL=$(curl -s -X POST "$CONVEX_URL/api/mutation" \
    -H "Content-Type: application/json" \
    -d '{"path": "audio:generateUploadUrl", "args": {}, "format": "json"}' | python3 -c "import json,sys; print(json.load(sys.stdin)['value'])")

  echo "Upload URL for $slug/$locale: $UPLOAD_URL"

  # Upload file
  STORAGE_RESP=$(curl -s -X POST "$UPLOAD_URL" \
    -H "Content-Type: audio/mpeg" \
    --data-binary "@$mp3_file")

  STORAGE_ID=$(echo "$STORAGE_RESP" | python3 -c "import json,sys; print(json.load(sys.stdin)['storageId'])")
  echo "  storageId: $STORAGE_ID"

  # Save record
  curl -s -X POST "$CONVEX_URL/api/mutation" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "import json; print(json.dumps({'path': 'audio:saveAudioFile', 'args': {'slug': '$slug', 'locale': '$locale', 'storageId': '$STORAGE_ID', 'filename': '${slug}-${locale}.mp3'}, 'format': 'json'}))")" | python3 -c "import json,sys; print('  Saved ID:', json.load(sys.stdin).get('value'))"

  # Get public URL
  PUBLIC_URL=$(curl -s -X POST "$CONVEX_URL/api/query" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "import json; print(json.dumps({'path': 'audio:getAudioUrl', 'args': {'slug': '$slug', 'locale': '$locale'}, 'format': 'json'}))")" | python3 -c "import json,sys; print(json.load(sys.stdin).get('value'))")

  echo "  Public URL: $PUBLIC_URL"
}

upload_to_convex "/tmp/day-41-en.mp3" "day-41" "en"
upload_to_convex "/tmp/day-41-fr.mp3" "day-41" "fr"

echo ""
echo "Done. Update MDX frontmatter manually with audio_url_en and audio_url_fr from above."
