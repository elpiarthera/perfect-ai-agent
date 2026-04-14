#!/usr/bin/env python3
"""
audio-prep — transform web text into TTS-ready text.

Replaces digits with spelled-out words per language so MiniMax (and other TTS)
stops reading "2000" as "two zero zero zero".

Usage:
    python3 scripts/audio-prep.py <input.mdx> <lang> [output.txt]

Rules:
    - Preserves frontmatter-stripped body. Caller is responsible for stripping.
    - Strips `---` divider lines.
    - Strips markdown headings `#` markers (keeps heading text).
    - Normalizes thousand separators: "2 400", "2,400", "2\u00a0400" -> "2400".
    - Converts standalone integers to words in the target language.
    - Handles currency: "2400 \u20ac" / "\u20ac 2400" -> "deux mille quatre cents euros".
    - Handles percent: "30 %" -> "trente pour cent" (fr) / "thirty percent" (en).
    - Handles years: "2026" -> "deux mille vingt-six" / "twenty twenty-six".
    - Leaves dates like "13 avril 2026" alone for the day number by passing it
      through as a cardinal (acceptable for narration).
    - "Day 38" / "Jour 38" is handled as standalone digit -> words.
"""
import re
import sys
from num2words import num2words

LANG_WORDS = {
    "fr": {"euros": "euros", "euro": "euro", "percent": "pour cent"},
    "en": {"euros": "euros", "euro": "euro", "percent": "percent"},
}


def normalize_thousands(text: str) -> str:
    """Join digit groups separated by space/nbsp/comma: 2 400 -> 2400."""
    # repeatedly collapse: (\d+)[\s\u00a0,](\d{3})(?=\D|$)
    pattern = re.compile(r"(\d+)[\s\u00a0,](\d{3})(?=\D|$)")
    prev = None
    while prev != text:
        prev = text
        text = pattern.sub(r"\1\2", text)
    return text


def digits_to_words(text: str, lang: str) -> str:
    words_map = LANG_WORDS.get(lang, LANG_WORDS["en"])

    # Currency: "1200 \u20ac" or "\u20ac1200"
    def repl_currency(m):
        n = int(m.group("num"))
        return f"{num2words(n, lang=lang)} {words_map['euros']}"

    text = re.sub(
        r"(?P<num>\d+)\s*\u20ac",
        repl_currency,
        text,
    )
    text = re.sub(
        r"\u20ac\s*(?P<num>\d+)",
        repl_currency,
        text,
    )

    # Percent: "30 %" / "30%"
    def repl_percent(m):
        n = int(m.group("num"))
        return f"{num2words(n, lang=lang)} {words_map['percent']}"

    text = re.sub(r"(?P<num>\d+)\s*%", repl_percent, text)

    # Standalone integers
    def repl_int(m):
        token = m.group(0)
        try:
            n = int(token)
        except ValueError:
            return token
        return num2words(n, lang=lang)

    # word-boundary integers (avoids eating inside identifiers like "h1")
    text = re.sub(r"(?<![\w.])\d+(?![\w.])", repl_int, text)

    return text


def strip_markdown(text: str) -> str:
    # Remove frontmatter if present
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            text = parts[2]
    # Remove divider lines
    text = re.sub(r"^\s*---\s*$", "", text, flags=re.MULTILINE)
    # Strip heading markers but keep text
    text = re.sub(r"^#+\s*", "", text, flags=re.MULTILINE)
    # Collapse consecutive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def prep(text: str, lang: str) -> str:
    text = strip_markdown(text)
    text = normalize_thousands(text)
    text = digits_to_words(text, lang)
    return text


def main():
    if len(sys.argv) < 3:
        print("Usage: audio-prep.py <input.mdx> <lang> [output.txt]", file=sys.stderr)
        sys.exit(1)
    src = sys.argv[1]
    lang = sys.argv[2]
    dst = sys.argv[3] if len(sys.argv) > 3 else None

    with open(src, encoding="utf-8") as f:
        raw = f.read()
    out = prep(raw, lang)
    if dst:
        with open(dst, "w", encoding="utf-8") as f:
            f.write(out)
        print(f"Wrote {dst} ({len(out)} chars)")
    else:
        sys.stdout.write(out)


if __name__ == "__main__":
    main()
