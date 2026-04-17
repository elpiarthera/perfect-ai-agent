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
    - Strips inline code backticks (keeps the text inside).
    - Strips bold/italic markers (keeps text).
    - Normalizes thousand separators: "2 400", "2,400", "2\u00a0400" -> "2400".
    - Converts standalone integers to words in the target language.
    - Handles currency: "2400 \u20ac" / "\u20ac 2400" -> "deux mille quatre cents euros".
    - Handles percent: "30 %" -> "trente pour cent" (fr) / "thirty percent" (en).
    - Handles years: "2026" -> "deux mille vingt-six" / "twenty twenty-six".
    - Leaves dates like "13 avril 2026" alone for the day number by passing it
      through as a cardinal (acceptable for narration).
    - "Day 38" / "Jour 38" is handled as standalone digit -> words.
    - Hex codes: "0x2014" -> "zero x twenty fourteen" (en) / "zéro x deux zéro un quatre" (fr).
    - Unicode codepoints: "U+2014" -> "U plus two zero one four" (en).
    - RFC references: "RFC 7230" -> "R F C seven two three zero" (en).
    - Port numbers: "Port 8082" -> "Port eight zero eight two" (en).
    - HTTP status standalone 404 -> "four oh four" (en) / "quatre cent quatre" (fr).
    - Issue/PR "#18" -> "number eighteen" (en) / "numéro dix-huit" (fr).
"""
import re
import sys
from num2words import num2words

LANG_WORDS = {
    "fr": {"euros": "euros", "euro": "euro", "percent": "pour cent",
           "number": "numéro"},
    "en": {"euros": "euros", "euro": "euro", "percent": "percent",
           "number": "number"},
}

# Hex digit spell-outs per language
HEX_DIGIT_EN = {
    "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
    "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
    "a": "A", "b": "B", "c": "C", "d": "D", "e": "E", "f": "F",
}
HEX_DIGIT_FR = {
    "0": "zéro", "1": "un", "2": "deux", "3": "trois", "4": "quatre",
    "5": "cinq", "6": "six", "7": "sept", "8": "huit", "9": "neuf",
    "a": "A", "b": "B", "c": "C", "d": "D", "e": "E", "f": "F",
}

# Digit-by-digit spell-out for port numbers / error codes read as digits
DIGIT_WORD_EN = {
    "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
    "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
}
DIGIT_WORD_FR = {
    "0": "zéro", "1": "un", "2": "deux", "3": "trois", "4": "quatre",
    "5": "cinq", "6": "six", "7": "sept", "8": "huit", "9": "neuf",
}


def spell_hex_digits(digits: str, lang: str) -> str:
    """Spell out each hex digit individually."""
    table = HEX_DIGIT_FR if lang == "fr" else HEX_DIGIT_EN
    return " ".join(table.get(ch.lower(), ch) for ch in digits)


def spell_digits(digits: str, lang: str) -> str:
    """Spell out each decimal digit individually."""
    table = DIGIT_WORD_FR if lang == "fr" else DIGIT_WORD_EN
    return " ".join(table.get(ch, ch) for ch in digits)


def normalize_thousands(text: str) -> str:
    """Join digit groups separated by space/nbsp/comma: 2 400 -> 2400."""
    # repeatedly collapse: (\d+)[\s\u00a0,](\d{3})(?=\D|$)
    pattern = re.compile(r"(\d+)[\s\u00a0,](\d{3})(?=\D|$)")
    prev = None
    while prev != text:
        prev = text
        text = pattern.sub(r"\1\2", text)
    return text


def apply_special_patterns(text: str, lang: str) -> str:
    """Apply before generic digit-to-words conversion."""
    words_map = LANG_WORDS.get(lang, LANG_WORDS["en"])

    # Strip inline code backticks: `some code` -> some code
    text = re.sub(r"`([^`]+)`", r"\1", text)

    # Strip bold/italic markers
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"_([^_]+)_", r"\1", text)

    # RFC references: RFC 7230 -> R F C seven two three zero
    def repl_rfc(m):
        digits = m.group(1)
        if lang == "fr":
            spelled = " ".join(spell_digits(d, "fr") for d in digits)
            return f"R F C {spelled}"
        else:
            spelled = " ".join(spell_digits(d, "en") for d in digits)
            return f"R F C {spelled}"

    text = re.sub(r"\bRFC\s+(\d+)\b", repl_rfc, text)

    # Hex codes: 0x2014 -> zero x two zero one four (en) / zéro x deux zéro un quatre (fr)
    def repl_hex(m):
        digits = m.group(1)
        spelled = spell_hex_digits(digits, lang)
        if lang == "fr":
            return f"zéro x {spelled}"
        else:
            return f"zero x {spelled}"

    text = re.sub(r"\b0x([0-9a-fA-F]+)\b", repl_hex, text)

    # Unicode codepoints: U+2014 -> U plus two zero one four (en) / U plus deux zéro un quatre (fr)
    def repl_unicode(m):
        digits = m.group(1)
        spelled = spell_hex_digits(digits, lang)
        if lang == "fr":
            return f"U plus {spelled}"
        else:
            return f"U plus {spelled}"

    text = re.sub(r"\bU\+([0-9a-fA-F]+)\b", repl_unicode, text)

    # Port numbers: "Port 8082" or "port 8082" -> Port eight zero eight two
    # Match "port XXXX" where XXXX is 4+ digits (port range)
    def repl_port(m):
        prefix = m.group(1)
        digits = m.group(2)
        spelled = spell_digits(digits, lang)
        return f"{prefix} {spelled}"

    text = re.sub(r"([Pp]ort)\s+(\d{4,5})\b", repl_port, text)

    # HTTP 302 redirect code: "a 302" -> "a three oh two"
    # "responded with a 302" type patterns
    def repl_http_code(m):
        digits = m.group(1)
        spelled = spell_digits(digits, lang)
        return spelled

    text = re.sub(r"\ba\s+(3\d{2})\b", lambda m: f"a {spell_digits(m.group(1), lang)}", text)

    # Standalone 404 -> "four oh four" (en) / "quatre cent quatre" (fr)
    # Must be surrounded by word boundaries, not inside other numbers
    def repl_404(m):
        if lang == "fr":
            return "quatre cent quatre"
        else:
            return "four oh four"

    text = re.sub(r"(?<!\d)404(?!\d)", repl_404, text)

    # Issue/PR references: "#18" -> "number eighteen" / "numéro dix-huit"
    def repl_issue(m):
        n = int(m.group(1))
        word = num2words(n, lang=lang)
        return f"{words_map['number']} {word}"

    text = re.sub(r"#(\d+)", repl_issue, text)

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
    text = apply_special_patterns(text, lang)
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
