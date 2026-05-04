#!/usr/bin/env bash
# generate-day53-audio.sh
#
# Full pipeline: Day 53 diary audio — FR + EN
# Model:    fal-ai/minimax/speech-2.8-turbo
# Voice:    Pi clone — ttv-voice-2026032704355926-zUb4NZ4I (both locales)
# Pauses:   --- section dividers -> <#1.5#> (1.5s pause, MiniMax native format)
# Chunking: Day 53 is shorter (~768/820 words). Likely single chunk per locale.
#           If either locale exceeds 5000 chars after prep, splits at 2nd pause.
# Uploads:  PROD (laudable-hedgehog-797) + DEV (neat-frog-379) dual-write
#
# Usage:
#   FAL_KEY=<key> bash scripts/generate-day53-audio.sh
#   or: source .env.local && bash scripts/generate-day53-audio.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

FAL_KEY="${FAL_KEY:?FAL_KEY must be set}"
PROD_URL="${CONVEX_URL_AUDIO:-https://laudable-hedgehog-797.convex.cloud}"
DEV_URL="https://neat-frog-379.convex.cloud"
VOICE_ID="ttv-voice-2026032704355926-zUb4NZ4I"
MODEL="fal-ai/minimax/speech-2.8-turbo"

FR_SRC="$REPO_ROOT/content/fr/diary/day-53.mdx"
EN_SRC="$REPO_ROOT/content/en/diary/day-53.mdx"

echo "=== Day 53 Audio Pipeline ==="
echo "Model:  $MODEL"
echo "Voice:  $VOICE_ID"
echo "PROD:   $PROD_URL"
echo "DEV:    $DEV_URL"
echo ""

# ---------------------------------------------------------------------------
# Step 1: Prepare text — replace --- dividers with PAUSEMARKER before audio-prep
# so audio-prep.py (which strips --- lines) does not remove them.
# Then replace PAUSEMARKER with <#1.5#> after.
# ---------------------------------------------------------------------------

echo "--- Preparing text (FR + EN) ---"
python3 - <<PYEOF
import re

for locale, src in [('fr', '$FR_SRC'), ('en', '$EN_SRC')]:
    with open(src, encoding='utf-8') as f:
        raw = f.read()

    if raw.startswith('---'):
        parts = raw.split('---', 2)
        if len(parts) >= 3:
            frontmatter = '---' + parts[1] + '---'
            body = parts[2]
        else:
            frontmatter = ''
            body = raw
    else:
        frontmatter = ''
        body = raw

    body_new = re.sub(r'^\s*---\s*$', 'PAUSEMARKER', body, flags=re.MULTILINE)
    count = body_new.count('PAUSEMARKER')
    print(f'{locale}: {count} dividers replaced with PAUSEMARKER')

    with open(f'/tmp/day-53-{locale}-input.mdx', 'w', encoding='utf-8') as f:
        f.write(frontmatter + body_new)
PYEOF

python3 "$SCRIPT_DIR/audio-prep.py" /tmp/day-53-fr-input.mdx fr /tmp/day-53-fr.txt
python3 "$SCRIPT_DIR/audio-prep.py" /tmp/day-53-en-input.mdx en /tmp/day-53-en.txt

sed -i 's/PAUSEMARKER/<#1.5#>/g' /tmp/day-53-fr.txt
sed -i 's/PAUSEMARKER/<#1.5#>/g' /tmp/day-53-en.txt

FR_PAUSES=$(grep -o '<#1.5#>' /tmp/day-53-fr.txt | wc -l)
EN_PAUSES=$(grep -o '<#1.5#>' /tmp/day-53-en.txt | wc -l)
FR_CHARS=$(python3 -c "print(len(open('/tmp/day-53-fr.txt', encoding='utf-8').read()))")
EN_CHARS=$(python3 -c "print(len(open('/tmp/day-53-en.txt', encoding='utf-8').read()))")

echo "FR: $FR_PAUSES pauses, $FR_CHARS chars"
echo "EN: $EN_PAUSES pauses, $EN_CHARS chars"

if [ "$FR_PAUSES" -ne 3 ]; then echo "ERROR: expected 3 FR pauses, got $FR_PAUSES"; exit 1; fi
if [ "$EN_PAUSES" -ne 3 ]; then echo "ERROR: expected 3 EN pauses, got $EN_PAUSES"; exit 1; fi

# ---------------------------------------------------------------------------
# Step 2: Decide single vs. chunked per locale
# Single chunk if <= 5000 chars, otherwise split at 2nd pause marker.
# ---------------------------------------------------------------------------

echo ""
echo "--- Routing chunks ---"
python3 - <<PYEOF2
import re, os

for locale in ['fr', 'en']:
    text = open(f'/tmp/day-53-{locale}.txt', encoding='utf-8').read()
    chars = len(text)
    if chars <= 5000:
        print(f'{locale}: single chunk ({chars} chars) — no split needed')
        with open(f'/tmp/day-53-{locale}-single.txt', 'w', encoding='utf-8') as f:
            f.write(text)
        # mark as single
        with open(f'/tmp/day-53-{locale}-mode.txt', 'w') as f:
            f.write('single')
    else:
        pauses = [m.start() for m in re.finditer(r'<#1.5#>', text)]
        split_pos = pauses[1] + len('<#1.5#>')
        chunk1 = text[:split_pos].strip()
        chunk2 = text[split_pos:].strip()
        print(f'{locale}: chunked ({chars} chars) — chunk1={len(chunk1)}, chunk2={len(chunk2)}')
        with open(f'/tmp/day-53-{locale}-chunk1.txt', 'w', encoding='utf-8') as f:
            f.write(chunk1)
        with open(f'/tmp/day-53-{locale}-chunk2.txt', 'w', encoding='utf-8') as f:
            f.write(chunk2)
        with open(f'/tmp/day-53-{locale}-mode.txt', 'w') as f:
            f.write('chunked')
PYEOF2

FR_MODE=$(cat /tmp/day-53-fr-mode.txt)
EN_MODE=$(cat /tmp/day-53-en-mode.txt)
echo "FR mode: $FR_MODE"
echo "EN mode: $EN_MODE"

# ---------------------------------------------------------------------------
# Step 3: TTS generation via fal.ai MiniMax speech-2.8-turbo
# ---------------------------------------------------------------------------

echo ""
echo "--- Calling fal.ai: FR ---"

if [ "$FR_MODE" = "single" ]; then
  FR_RESPONSE=$(curl -s -X POST "https://fal.run/$MODEL" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\": $(python3 -c "import json; print(json.dumps(open('/tmp/day-53-fr-single.txt', encoding='utf-8').read()))"), \"voice_id\": \"$VOICE_ID\", \"language\": \"fr\"}")
  FR_URL=$(echo "$FR_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['audio']['url'])")
  echo "FR: $FR_URL"
  curl -s -L "$FR_URL" -o /tmp/day-53-fr.mp3
  echo "FR downloaded: $(du -sh /tmp/day-53-fr.mp3)"
else
  echo "--- Calling fal.ai: FR chunk 1 ---"
  FR_C1_RESPONSE=$(curl -s -X POST "https://fal.run/$MODEL" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\": $(python3 -c "import json; print(json.dumps(open('/tmp/day-53-fr-chunk1.txt', encoding='utf-8').read()))"), \"voice_id\": \"$VOICE_ID\", \"language\": \"fr\"}")
  FR_C1_URL=$(echo "$FR_C1_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['audio']['url'])")
  echo "FR c1: $FR_C1_URL"

  echo "--- Calling fal.ai: FR chunk 2 ---"
  FR_C2_RESPONSE=$(curl -s -X POST "https://fal.run/$MODEL" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\": $(python3 -c "import json; print(json.dumps(open('/tmp/day-53-fr-chunk2.txt', encoding='utf-8').read()))"), \"voice_id\": \"$VOICE_ID\", \"language\": \"fr\"}")
  FR_C2_URL=$(echo "$FR_C2_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['audio']['url'])")
  echo "FR c2: $FR_C2_URL"

  curl -s -L "$FR_C1_URL" -o /tmp/day-53-fr-c1.mp3
  curl -s -L "$FR_C2_URL" -o /tmp/day-53-fr-c2.mp3

  echo "--- Concatenating FR with ffmpeg ---"
  echo "file '/tmp/day-53-fr-c1.mp3'" > /tmp/day-53-fr-list.txt
  echo "file '/tmp/day-53-fr-c2.mp3'" >> /tmp/day-53-fr-list.txt
  ffmpeg -y -f concat -safe 0 -i /tmp/day-53-fr-list.txt -c copy /tmp/day-53-fr.mp3
fi

echo ""
echo "--- Calling fal.ai: EN ---"

if [ "$EN_MODE" = "single" ]; then
  EN_RESPONSE=$(curl -s -X POST "https://fal.run/$MODEL" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\": $(python3 -c "import json; print(json.dumps(open('/tmp/day-53-en-single.txt', encoding='utf-8').read()))"), \"voice_id\": \"$VOICE_ID\", \"language\": \"en\"}")
  EN_URL=$(echo "$EN_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['audio']['url'])")
  echo "EN: $EN_URL"
  curl -s -L "$EN_URL" -o /tmp/day-53-en.mp3
  echo "EN downloaded: $(du -sh /tmp/day-53-en.mp3)"
else
  echo "--- Calling fal.ai: EN chunk 1 ---"
  EN_C1_RESPONSE=$(curl -s -X POST "https://fal.run/$MODEL" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\": $(python3 -c "import json; print(json.dumps(open('/tmp/day-53-en-chunk1.txt', encoding='utf-8').read()))"), \"voice_id\": \"$VOICE_ID\", \"language\": \"en\"}")
  EN_C1_URL=$(echo "$EN_C1_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['audio']['url'])")
  echo "EN c1: $EN_C1_URL"

  echo "--- Calling fal.ai: EN chunk 2 ---"
  EN_C2_RESPONSE=$(curl -s -X POST "https://fal.run/$MODEL" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\": $(python3 -c "import json; print(json.dumps(open('/tmp/day-53-en-chunk2.txt', encoding='utf-8').read()))"), \"voice_id\": \"$VOICE_ID\", \"language\": \"en\"}")
  EN_C2_URL=$(echo "$EN_C2_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['audio']['url'])")
  echo "EN c2: $EN_C2_URL"

  curl -s -L "$EN_C1_URL" -o /tmp/day-53-en-c1.mp3
  curl -s -L "$EN_C2_URL" -o /tmp/day-53-en-c2.mp3

  echo "--- Concatenating EN with ffmpeg ---"
  echo "file '/tmp/day-53-en-c1.mp3'" > /tmp/day-53-en-list.txt
  echo "file '/tmp/day-53-en-c2.mp3'" >> /tmp/day-53-en-list.txt
  ffmpeg -y -f concat -safe 0 -i /tmp/day-53-en-list.txt -c copy /tmp/day-53-en.mp3
fi

echo ""
echo "FR final: $(du -sh /tmp/day-53-fr.mp3)"
echo "EN final: $(du -sh /tmp/day-53-en.mp3)"

# ---------------------------------------------------------------------------
# Step 4: Upload to PROD + DEV via Convex mutations
# ---------------------------------------------------------------------------

echo ""
echo "--- Uploading to PROD ($PROD_URL) and DEV ($DEV_URL) ---"
python3 - <<PYEOF3
import urllib.request
import json

PROD_URL = "$PROD_URL"
DEV_URL = "$DEV_URL"

def convex_mutation(base_url, path, args):
    data = json.dumps({"path": path, "args": args, "format": "json"}).encode()
    req = urllib.request.Request(f"{base_url}/api/mutation", data=data,
        headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as resp:
        body = json.loads(resp.read())
    if body["status"] != "success":
        raise Exception(f"Mutation {path} failed: {body.get('errorMessage', body)}")
    return body["value"]

def convex_query(base_url, path, args):
    data = json.dumps({"path": path, "args": args, "format": "json"}).encode()
    req = urllib.request.Request(f"{base_url}/api/query", data=data,
        headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as resp:
        body = json.loads(resp.read())
    if body["status"] != "success":
        raise Exception(f"Query {path} failed: {body.get('errorMessage', body)}")
    return body["value"]

def upload_entry(base_url, slug, locale, tmp_path, filename):
    label = f"{slug}/{locale}"
    with open(tmp_path, "rb") as f:
        audio_bytes = f.read()
    print(f"  {label}: {len(audio_bytes)/1024/1024:.2f} MB")
    upload_url = convex_mutation(base_url, "audio:generateUploadUrl", {})
    req = urllib.request.Request(upload_url, data=audio_bytes,
        headers={"Content-Type": "audio/mpeg"}, method="POST")
    with urllib.request.urlopen(req) as resp:
        storage_id = json.loads(resp.read())["storageId"]
    convex_mutation(base_url, "audio:saveAudioFile", {
        "slug": slug, "locale": locale, "storageId": storage_id, "filename": filename,
    })
    verify = convex_query(base_url, "audio:getAudioUrl", {"slug": slug, "locale": locale})
    assert verify, f"Verification failed for {label}"
    print(f"  storageId: {storage_id}")
    print(f"  url: {str(verify)[:80]}...")
    return storage_id

entries = [
    ("day-53", "fr", "/tmp/day-53-fr.mp3", "day-53-fr.mp3"),
    ("day-53", "en", "/tmp/day-53-en.mp3", "day-53-en.mp3"),
]

print("\nPROD:")
for slug, locale, path, filename in entries:
    upload_entry(PROD_URL, slug, locale, path, filename)

print("\nDEV:")
for slug, locale, path, filename in entries:
    upload_entry(DEV_URL, slug, locale, path, filename)

print("\nAll 4 uploads complete.")
PYEOF3

echo ""
echo "=== Pipeline complete ==="
echo "  /tmp/day-53-fr.mp3"
echo "  /tmp/day-53-en.mp3"
echo "  PROD: laudable-hedgehog-797  FR + EN"
echo "  DEV:  neat-frog-379          FR + EN"
