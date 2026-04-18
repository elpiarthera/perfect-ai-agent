#!/usr/bin/env bash
# build-ebook-en.sh
# Builds the EN novel ebook v1 of "The Perfect AI Agent".
# Scope: prologue + chapter-01..chapter-12 + epilogue. NO diary.
# PDF engine: xelatex (preferred). If xelatex is missing, falls back to weasyprint.
# Idempotent: wipes and rebuilds the output dir on every run.

set -euo pipefail

# Force UTF-8 locale so pandoc passes through non-ASCII metadata (e.g. ©) intact.
export LC_ALL="${LC_ALL:-C.UTF-8}"
export LANG="${LANG:-C.UTF-8}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/content/en"
OUT="$ROOT/deliverables/ebook-en-v1"
COMBINED="$OUT/combined.md"

TITLE="The Perfect AI Agent"
SUBTITLE="A Novel"
AUTHOR="Laurent Perello"
PUBLISHER="ElPi Corp"
LANG="en"
PUBDATE="2026-04-18"
RIGHTS="© 2026 Laurent Perello. All rights reserved."

EPUB_OUT="$OUT/PerfectAIAgent-Novel-v1-EN.epub"
PDF_OUT="$OUT/PerfectAIAgent-Novel-v1-EN.pdf"

# Ordered novel-only file list.
FILES=(
  "prologue.mdx"
  "chapter-01.mdx"
  "chapter-02.mdx"
  "chapter-03.mdx"
  "chapter-04.mdx"
  "chapter-05.mdx"
  "chapter-06.mdx"
  "chapter-07.mdx"
  "chapter-08.mdx"
  "chapter-09.mdx"
  "chapter-10.mdx"
  "chapter-11.mdx"
  "chapter-12.mdx"
  "epilogue.mdx"
)

echo "==> Wiping and rebuilding $OUT"
rm -rf "$OUT"
mkdir -p "$OUT"

# Pick PDF engine.
PDF_ENGINE=""
if command -v xelatex >/dev/null 2>&1; then
  PDF_ENGINE="xelatex"
elif command -v weasyprint >/dev/null 2>&1; then
  PDF_ENGINE="weasyprint"
else
  echo "ERROR: neither xelatex nor weasyprint available. Install texlive-xetex or 'pip install weasyprint'." >&2
  exit 1
fi
echo "==> PDF engine: $PDF_ENGINE"

# Require pandoc.
if ! command -v pandoc >/dev/null 2>&1; then
  echo "ERROR: pandoc not found. Install with: sudo apt-get install -y pandoc" >&2
  exit 1
fi
echo "==> pandoc $(pandoc --version | head -1 | awk '{print $2}')"

# Build combined.md with title page + ordered novel content.
{
  echo "---"
  echo "title: \"$TITLE\""
  echo "subtitle: \"$SUBTITLE\""
  echo "author: \"$AUTHOR\""
  echo "publisher: \"$PUBLISHER\""
  echo "date: \"$PUBDATE\""
  echo "rights: \"$RIGHTS\""
  echo "lang: $LANG"
  echo "---"
  echo
  echo "# $TITLE"
  echo
  echo "### $SUBTITLE"
  echo
  echo "**$AUTHOR**"
  echo
  echo "*$PUBLISHER — $PUBDATE*"
  echo
  echo "$RIGHTS"
  echo
  echo '\newpage'
  echo
} > "$COMBINED"

# Strip YAML frontmatter between opening --- and first closing ---.
strip_frontmatter() {
  awk '
    BEGIN { in_fm = 0; done = 0 }
    NR == 1 && /^---[[:space:]]*$/ { in_fm = 1; next }
    in_fm && /^---[[:space:]]*$/ { in_fm = 0; done = 1; next }
    in_fm { next }
    { print }
  ' "$1"
}

# Strip stray JSX component lines (defensive — current EN novel files have none,
# but keeps the script safe if future edits add <Component ... /> blocks).
# Matches lines that start with an uppercase-tagged JSX element or import/export.
strip_jsx() {
  awk '
    /^[[:space:]]*import[[:space:]]/ { next }
    /^[[:space:]]*export[[:space:]]/ { next }
    /^[[:space:]]*<[A-Z][A-Za-z0-9]*([[:space:]][^>]*)?\/?>[[:space:]]*$/ { next }
    /^[[:space:]]*<\/[A-Z][A-Za-z0-9]*>[[:space:]]*$/ { next }
    { print }
  '
}

for f in "${FILES[@]}"; do
  path="$SRC/$f"
  if [[ ! -f "$path" ]]; then
    echo "ERROR: missing source $path" >&2
    exit 1
  fi
  echo "==> Appending $f"
  strip_frontmatter "$path" | strip_jsx >> "$COMBINED"
  printf '\n\n\\newpage\n\n' >> "$COMBINED"
done

# Build EPUB.
COVER_FLAG=()
if [[ -f "$OUT/cover-en.png" ]]; then
  COVER_FLAG=(--epub-cover-image="$OUT/cover-en.png")
  echo "==> Using cover: $OUT/cover-en.png"
fi

echo "==> Building EPUB"
pandoc "$COMBINED" \
  -o "$EPUB_OUT" \
  --metadata title="$TITLE" \
  --metadata subtitle="$SUBTITLE" \
  --metadata author="$AUTHOR" \
  --metadata publisher="$PUBLISHER" \
  --metadata date="$PUBDATE" \
  --metadata rights="$RIGHTS" \
  --metadata lang="$LANG" \
  --toc --toc-depth=1 \
  "${COVER_FLAG[@]}"

echo "==> Building PDF with $PDF_ENGINE"
if [[ "$PDF_ENGINE" == "xelatex" ]]; then
  pandoc "$COMBINED" \
    -o "$PDF_OUT" \
    --pdf-engine=xelatex \
    -V geometry:margin=1in \
    -V fontsize=11pt \
    -V linestretch=1.3 \
    -V mainfont="DejaVu Serif" \
    --metadata title="$TITLE" \
    --metadata author="$AUTHOR" \
    --metadata date="$PUBDATE" \
    --metadata lang="$LANG" \
    --toc --toc-depth=1
else
  pandoc "$COMBINED" \
    -o "$PDF_OUT" \
    --pdf-engine=weasyprint \
    --metadata title="$TITLE" \
    --metadata author="$AUTHOR" \
    --metadata date="$PUBDATE" \
    --metadata lang="$LANG" \
    --toc --toc-depth=1
fi

echo
echo "==> Build complete"
ls -lh "$EPUB_OUT" "$PDF_OUT"
