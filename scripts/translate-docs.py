#!/usr/bin/env python3

from __future__ import annotations

import ast
import argparse
import json
import re
import sys
import time
from pathlib import Path
from typing import Any

from deep_translator import GoogleTranslator

REPO_ROOT = Path(__file__).resolve().parents[1]
DOCS_ROOT = REPO_ROOT / "docs"
DOCS_I18N_ROOT = REPO_ROOT / "docs" / "i18n"

LOCALE_TARGETS = {
    "ar": "ar",
    "bn": "bn",
    "ca": "ca",
    "cs": "cs",
    "da": "da",
    "de": "de",
    "el": "el",
    "en": "en",
    "es": "es",
    "fa": "fa",
    "fi": "fi",
    "fil": "tl",
    "fr": "fr",
    "he": "iw",
    "hi": "hi",
    "hu": "hu",
    "id": "id",
    "it": "it",
    "ja": "ja",
    "ko": "ko",
    "mr": "mr",
    "nl": "nl",
    "no": "no",
    "pl": "pl",
    "pt": "pt",
    "ro": "ro",
    "ru": "ru",
    "sq": "sq",
    "sv": "sv",
    "te": "te",
    "th": "th",
    "tr": "tr",
    "uk": "uk",
    "ur": "ur",
    "vi": "vi",
    "zh": "zh-CN",
}

TRANSLATABLE_FRONTMATTER_KEYS = {"title", "description", "sidebar_label"}
JSON_SKIP_KEYS = {"slug", "type", "id", "task", "status", "last_updated"}
PLACEHOLDER_PREFIX = "ZXQPLACEHOLDER"
BATCH_SEPARATOR = "<zxqsep/>"
BATCH_START_MARKER = f"{PLACEHOLDER_PREFIX}BATCHSTARTZXQ"
BATCH_MARKER_OVERHEAD = len(PLACEHOLDER_PREFIX) + len("BATCH999ZXQ\n")
BATCH_SIZE = 1
BATCH_DELAY_SECONDS = 0.05
MAX_REQUEST_CHARS = 3500
MAX_RETRIES = 2
RETRY_BASE_DELAY_SECONDS = 1.5

translator_cache: dict[str, GoogleTranslator] = {}
text_cache: dict[tuple[str, str], str] = {}


def log(message: str) -> None:
    print(message, flush=True)


def get_translator(locale: str) -> GoogleTranslator:
    if locale not in translator_cache:
        translator_cache[locale] = GoogleTranslator(
            source=LOCALE_TARGETS["en"],
            target=LOCALE_TARGETS[locale],
        )
    return translator_cache[locale]


def should_translate_text(text: str) -> bool:
    return bool(re.search(r"[A-Za-z]", text))


def chunked(values: list[str], size: int) -> list[list[str]]:
    return [values[index : index + size] for index in range(0, len(values), size)]


def chunked_by_request_size(values: list[str], max_chars: int) -> list[list[str]]:
    chunks: list[list[str]] = []
    current_chunk: list[str] = []
    current_length = 0

    for value in values:
        value_length = len(value) + BATCH_MARKER_OVERHEAD
        if value_length > max_chars:
            if current_chunk:
                chunks.append(current_chunk)
                current_chunk = []
                current_length = 0
            chunks.append([value])
            continue

        if current_chunk and current_length + value_length > max_chars:
            chunks.append(current_chunk)
            current_chunk = [value]
            current_length = value_length
            continue

        current_chunk.append(value)
        current_length += value_length

    if current_chunk:
        chunks.append(current_chunk)

    return chunks


def build_marked_batch_payload(batch: list[str]) -> tuple[str, list[str]]:
    markers = [f"{PLACEHOLDER_PREFIX}BATCH{index}ZXQ" for index in range(len(batch))]
    payload_parts: list[str] = [BATCH_START_MARKER]

    for marker, text in zip(markers, batch):
        payload_parts.append(marker)
        payload_parts.append(text)

    return "\n".join(payload_parts), markers


def split_marked_batch_payload(translated_payload: str, markers: list[str]) -> list[str]:
    translated_batch: list[str] = []
    cursor = 0

    for index, marker in enumerate(markers):
        marker_index = translated_payload.find(marker, cursor)
        if marker_index == -1:
            raise ValueError(f"Missing translated batch marker for entry {index}")

        content_start = marker_index + len(marker)
        content_end = len(translated_payload)
        if index + 1 < len(markers):
            next_marker = markers[index + 1]
            next_marker_index = translated_payload.find(next_marker, content_start)
            if next_marker_index == -1:
                raise ValueError(f"Missing translated batch marker for entry {index + 1}")
            content_end = next_marker_index

        segment = translated_payload[content_start:content_end]
        translated_batch.append(segment.lstrip("\n").rstrip("\n"))
        cursor = content_end

    return translated_batch


def translate_text_batch(texts: list[str], locale: str) -> list[str]:
    if locale == "en":
        return texts

    translated_texts = list(texts)
    uncached_texts: list[str] = []

    for text in texts:
        if not text or not should_translate_text(text):
            continue

        cache_key = (locale, text)
        if cache_key in text_cache or text in uncached_texts:
            continue
        uncached_texts.append(text)

    if uncached_texts:
        translator = get_translator(locale)
        sized_batches: list[list[str]] = []
        for count_batch in chunked(uncached_texts, BATCH_SIZE):
            sized_batches.extend(chunked_by_request_size(count_batch, MAX_REQUEST_CHARS))

        for batch in sized_batches:
            for attempt in range(MAX_RETRIES):
                try:
                    payload, markers = build_marked_batch_payload(batch)
                    translated_joined = translator.translate(payload)
                    translated_batch = split_marked_batch_payload(translated_joined, markers)
                    if len(translated_batch) != len(batch):
                        raise ValueError(
                            f"Unexpected translated batch split for {locale}: {len(translated_batch)} != {len(batch)}"
                        )
                    break
                except Exception as error:
                    if "Unexpected translated batch split" in str(error) and len(batch) > 1:
                        log(
                            f"Separator mismatch for {locale} batch of {len(batch)} entries; falling back to individual translations ({error})"
                        )
                        translated_batch = translate_texts_individually(batch, locale)
                        break

                    if "No translation was found" in str(error) and len(batch) == 1:
                        log(
                            f"No translation found for {locale} single entry; keeping source text ({error})"
                        )
                        translated_batch = list(batch)
                        break

                    is_last_attempt = attempt == MAX_RETRIES - 1
                    if is_last_attempt:
                        if len(batch) == 1:
                            log(
                                f"Retry budget exhausted for {locale} single entry; keeping source text ({error})"
                            )
                            translated_batch = list(batch)
                            break

                        log(
                            f"Retry budget exhausted for {locale} batch of {len(batch)} entries; falling back to individual translations ({error})"
                        )
                        translated_batch = translate_texts_individually(batch, locale)
                        break

                    sleep_for = RETRY_BASE_DELAY_SECONDS * (attempt + 1)
                    log(
                        f"Translate request failed for {locale} batch of {len(batch)} entries (attempt {attempt + 1}/{MAX_RETRIES}): {error}. Sleeping {sleep_for}s before retry."
                    )
                    time.sleep(sleep_for)

            for source_text, translated_text in zip(batch, translated_batch):
                text_cache[(locale, source_text)] = translated_text

            time.sleep(BATCH_DELAY_SECONDS)

    for index, text in enumerate(texts):
        translated_texts[index] = text_cache.get((locale, text), text)

    return translated_texts


def translate_text_individual(text: str, locale: str) -> str:
    if locale == "en" or not text or not should_translate_text(text):
        return text

    translator = get_translator(locale)
    for attempt in range(MAX_RETRIES):
        try:
            return translator.translate(text)
        except Exception as error:
            if "No translation was found" in str(error):
                log(f"No translation found for {locale} single entry; keeping source text ({error})")
                return text
            if attempt == MAX_RETRIES - 1:
                log(
                    f"Retry budget exhausted for {locale} single entry; keeping source text ({error})"
                )
                return text
            sleep_for = RETRY_BASE_DELAY_SECONDS * (attempt + 1)
            log(
                f"Translate request failed for {locale} single entry (attempt {attempt + 1}/{MAX_RETRIES}): {error}. Sleeping {sleep_for}s before retry."
            )
            time.sleep(sleep_for)


def translate_texts_individually(texts: list[str], locale: str) -> list[str]:
    return [translate_text_individual(text, locale) for text in texts]


def protect_patterns(text: str, pattern: str, placeholders: dict[str, str]) -> str:
    def replace(match: re.Match[str]) -> str:
        token = f"{PLACEHOLDER_PREFIX}{len(placeholders)}ZXQ"
        placeholders[token] = match.group(0)
        return token

    return re.sub(pattern, replace, text)


def restore_placeholders(text: str, placeholders: dict[str, str]) -> str:
    for token, value in placeholders.items():
        text = text.replace(token, value)
    return text


def decode_js_string(value: str, quote: str = '"') -> str:
    if quote == '"':
        return json.loads(f'"{value}"')

    return ast.literal_eval(f"{quote}{value}{quote}")


def prepare_inline_text(text: str, locale: str) -> tuple[str, dict[str, str]]:
    if locale == "en" or not should_translate_text(text):
        return text, {}

    link_pattern = re.compile(r"(!?\[)([^\]]+)(\]\()([^)]+)(\))")

    def replace_link(match: re.Match[str]) -> str:
        open_bracket, label, middle, url, close_bracket = match.groups()
        translated_label = translate_inline_text(label, locale)
        return f"{open_bracket}{translated_label}{middle}{url}{close_bracket}"

    text = re.sub(link_pattern, replace_link, text)

    placeholders: dict[str, str] = {}
    text = protect_patterns(text, r"`[^`]+`", placeholders)
    text = protect_patterns(text, r"<[^>]+>", placeholders)
    text = protect_patterns(text, r"https?://\S+", placeholders)
    return text, placeholders


def translate_inline_text_batch(texts: list[str], locale: str) -> list[str]:
    prepared_texts: list[str] = []
    placeholder_sets: list[dict[str, str]] = []

    for text in texts:
        prepared_text, placeholders = prepare_inline_text(text, locale)
        prepared_texts.append(prepared_text)
        placeholder_sets.append(placeholders)

    translated_texts = translate_text_batch(prepared_texts, locale)
    return [
        restore_placeholders(translated_text, placeholders)
        for translated_text, placeholders in zip(translated_texts, placeholder_sets)
    ]


def translate_inline_text(text: str, locale: str) -> str:
    return translate_inline_text_batch([text], locale)[0]


def split_markdown_translation_unit(line: str) -> tuple[str, str] | None:
    if not line.strip():
        return None

    stripped = line.lstrip()
    indent = line[: len(line) - len(stripped)]

    if stripped.startswith(("import ", "export ")):
        return None

    if stripped.startswith(":::"):
        return None

    if stripped.startswith("<") and stripped.endswith(">"):
        return None

    if re.fullmatch(r"[-=]{3,}", stripped):
        return None

    for pattern in (
        r"^(#{1,6}\s+)(.*)$",
        r"^(\s*[-*+]\s+\[[ xX]\]\s+)(.*)$",
        r"^(\s*[-*+]\s+)(.*)$",
        r"^(\s*\d+\.\s+)(.*)$",
        r"^((?:>\s*)+)(.*)$",
    ):
        match = re.match(pattern, line)
        if match:
            prefix, content = match.groups()
            return prefix, content

    return indent, stripped


def translate_markdown_line(line: str, locale: str) -> str:
    if not line.strip():
        return line

    stripped = line.lstrip()
    indent = line[: len(line) - len(stripped)]

    if stripped.startswith(("import ", "export ")):
        return line

    if stripped.startswith(":::"):
        return line

    if stripped.startswith("<") and stripped.endswith(">"):
        if "description=" in stripped:
            return re.sub(
                r'description="([^"]+)"',
                lambda match: f'description="{translate_inline_text(match.group(1), locale)}"',
                line,
            )
        return line

    if re.fullmatch(r"[-=]{3,}", stripped):
        return line

    for pattern in (
        r"^(#{1,6}\s+)(.*)$",
        r"^(\s*[-*+]\s+\[[ xX]\]\s+)(.*)$",
        r"^(\s*[-*+]\s+)(.*)$",
        r"^(\s*\d+\.\s+)(.*)$",
        r"^((?:>\s*)+)(.*)$",
    ):
        match = re.match(pattern, line)
        if match:
            prefix, content = match.groups()
            return f"{prefix}{translate_inline_text(content, locale)}"

    return f"{indent}{translate_inline_text(stripped, locale)}"


def is_plain_paragraph_line(line: str) -> bool:
    stripped = line.strip()
    if not stripped:
        return False
    if "|" in stripped:
        return False
    if stripped.startswith(":::"):
        return False
    if stripped.startswith(("import ", "export ", "<")):
        return False
    if re.match(r"^\s*(```|~~~)", line):
        return False
    if re.fullmatch(r"[-=]{3,}", stripped):
        return False
    if re.match(r"^(#{1,6}\s+)", stripped):
        return False
    if re.match(r"^\s*[-*+]\s+", line):
        return False
    if re.match(r"^\s*\d+\.\s+", line):
        return False
    if stripped.startswith("|"):
        return False
    if re.match(r"^>\s*", stripped):
        return False
    return True


def translate_frontmatter(lines: list[str], locale: str) -> list[str]:
    translated_lines = list(lines)
    translatable_entries: list[tuple[int, str, str]] = []

    for index, line in enumerate(lines):
        match = re.match(r"^([A-Za-z_]+):(.*)$", line)
        if not match:
            continue

        key, raw_value = match.groups()
        value = raw_value.strip()
        if key not in TRANSLATABLE_FRONTMATTER_KEYS or not value:
            continue

        quote = ""
        if value[0] in {"'", '"'} and value[-1] == value[0]:
            quote = value[0]
            value = value[1:-1]

        translatable_entries.append((index, quote, value))

    translated_values = translate_inline_text_batch(
        [value for _, _, value in translatable_entries], locale
    )

    for (index, quote, _), translated_value in zip(translatable_entries, translated_values):
        key = lines[index].split(":", 1)[0]
        translated_lines[index] = f"{key}: {quote}{translated_value}{quote}"

    return translated_lines


def translate_markdown_file(source_path: Path, target_path: Path, locale: str) -> None:
    content = source_path.read_text()
    lines = content.splitlines()
    output: list[str] = []
    queued_texts: list[str] = []
    queued_indices: list[int] = []
    index = 0
    in_code_block = False

    if lines[:1] == ["---"]:
        try:
            end = lines.index("---", 1)
        except ValueError:
            end = -1
        if end > 0:
            output.append("---")
            output.extend(translate_frontmatter(lines[1:end], locale))
            output.append("---")
            index = end + 1

    while index < len(lines):
        line = lines[index]
        if re.match(r"^\s*(```|~~~)", line):
            in_code_block = not in_code_block
            output.append(line)
        elif in_code_block:
            output.append(line)
        elif is_plain_paragraph_line(line):
            paragraph_lines = [line.strip()]
            index += 1
            while index < len(lines) and is_plain_paragraph_line(lines[index]):
                paragraph_lines.append(lines[index].strip())
                index += 1
            paragraph = " ".join(paragraph_lines)
            queued_indices.append(len(output))
            output.append("")
            queued_texts.append(paragraph)
            continue
        else:
            translation_unit = split_markdown_translation_unit(line)
            if translation_unit is None:
                output.append(translate_markdown_line(line, locale))
            else:
                prefix, text = translation_unit
                queued_indices.append(len(output))
                output.append(prefix)
                queued_texts.append(text)
        index += 1

    translated_texts = translate_inline_text_batch(queued_texts, locale)
    for output_index, translated_text in zip(queued_indices, translated_texts):
        output[output_index] = f"{output[output_index]}{translated_text}"

    target_path.parent.mkdir(parents=True, exist_ok=True)
    target_path.write_text("\n".join(output) + ("\n" if content.endswith("\n") else ""))


def translate_json_messages(source_data: Any, target_data: Any, locale: str) -> Any:
    pending_messages: list[tuple[dict[str, Any], str]] = []

    def walk(source: Any, target: Any) -> Any:
        if isinstance(source, dict):
            if "message" in source and isinstance(source["message"], str):
                translated = dict(target or {})
                current_message = translated.get("message", source["message"])
                if current_message == source["message"]:
                    pending_messages.append((translated, source["message"]))
                return translated

            result = dict(target or {})
            for key, value in source.items():
                result[key] = walk(value, result.get(key))
            return result

        if isinstance(source, list):
            return [
                walk(
                    item,
                    target[index] if isinstance(target, list) and index < len(target) else None,
                )
                for index, item in enumerate(source)
            ]

        return source

    translated_root = walk(source_data, target_data)
    translated_messages = translate_inline_text_batch(
        [message for _, message in pending_messages], locale
    )
    for (target_dict, _), translated_message in zip(pending_messages, translated_messages):
        target_dict["message"] = translated_message

    return translated_root


def translate_category_json(value: Any, locale: str, key: str | None = None) -> Any:
    if isinstance(value, dict):
        return {child_key: translate_category_json(child_value, locale, child_key) for child_key, child_value in value.items()}
    if isinstance(value, list):
        return [translate_category_json(item, locale, key) for item in value]
    if isinstance(value, str) and key not in JSON_SKIP_KEYS:
        return translate_inline_text(value, locale)
    return value


def extract_docs_home_messages() -> dict[str, dict[str, str]]:
    docs_home_path = REPO_ROOT / "docs" / "src" / "components" / "DocsHome.tsx"
    content = docs_home_path.read_text()
    string_literal = r'(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\')'
    pattern = re.compile(
        rf"tr\(\s*{string_literal}\s*,\s*{string_literal}\s*,\s*{string_literal}\s*,?\s*\)",
        re.S,
    )
    messages: dict[str, dict[str, str]] = {}

    for match in pattern.finditer(content):
        message_id_groups = match.groups()[0:2]
        message_groups = match.groups()[2:4]
        description_groups = match.groups()[4:6]
        message_id = next(value for value in message_id_groups if value is not None)
        message = next(value for value in message_groups if value is not None)
        description = next(value for value in description_groups if value is not None)
        messages[message_id] = {
            "message": decode_js_string(message, '"' if message_groups[0] is not None else "'"),
            "description": decode_js_string(
                description,
                '"' if description_groups[0] is not None else "'",
            ),
        }

    return messages


def ensure_custom_code_messages(locales: list[str]) -> None:
    docs_home_messages = extract_docs_home_messages()
    source_code_path = DOCS_I18N_ROOT / "en" / "code.json"
    source_code = json.loads(source_code_path.read_text())

    for message_id, value in docs_home_messages.items():
        source_code.setdefault(message_id, value)

    source_code_path.write_text(json.dumps(source_code, ensure_ascii=False, indent=2) + "\n")

    for locale in locales:
        if locale == "en":
            continue

        target_code_path = DOCS_I18N_ROOT / locale / "code.json"
        target_code = json.loads(target_code_path.read_text())
        for message_id, value in docs_home_messages.items():
            target_code.setdefault(message_id, value)
        target_code_path.write_text(json.dumps(target_code, ensure_ascii=False, indent=2) + "\n")


def ensure_locale_scaffold(locale: str) -> None:
    if locale == "en":
        return

    source_root = DOCS_I18N_ROOT / "en"
    target_root = DOCS_I18N_ROOT / locale
    scaffold_files = [
        Path("code.json"),
        Path("docusaurus-plugin-content-docs") / "current.json",
        Path("docusaurus-theme-classic") / "footer.json",
        Path("docusaurus-theme-classic") / "navbar.json",
    ]

    for relative_path in scaffold_files:
        source_path = source_root / relative_path
        target_path = target_root / relative_path
        if target_path.exists():
            continue
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(source_path.read_text())


def copy_and_translate_docs(locale: str) -> None:
    target_root = DOCS_I18N_ROOT / locale / "docusaurus-plugin-content-docs" / "current"
    log(f"Translating markdown docs for {locale} into {target_root}")

    for source_path in sorted(DOCS_ROOT.rglob("*")):
        if source_path.is_dir():
            continue

        relative_path = source_path.relative_to(DOCS_ROOT)
        target_path = target_root / relative_path

        if source_path.suffix in {".md", ".mdx"}:
            log(f"  [{locale}] {relative_path}")
            translate_markdown_file(source_path, target_path, locale)
        elif source_path.name == "_category_.json":
            data = json.loads(source_path.read_text())
            log(f"  [{locale}] {relative_path}")
            translated = translate_category_json(data, locale)
            target_path.parent.mkdir(parents=True, exist_ok=True)
            target_path.write_text(json.dumps(translated, ensure_ascii=False, indent=2) + "\n")


def translate_locale_json(locale: str) -> None:
    source_root = DOCS_I18N_ROOT / "en"
    target_root = DOCS_I18N_ROOT / locale
    log(f"Translating Docusaurus locale JSON for {locale} in {target_root}")

    for source_path in sorted(source_root.rglob("*.json")):
        if source_path.name == "_category_.json":
            continue

        relative_path = source_path.relative_to(source_root)
        target_path = target_root / relative_path
        if not target_path.exists():
            continue

        source_data = json.loads(source_path.read_text())
        target_data = json.loads(target_path.read_text()) if target_path.exists() else source_data
        translated = translate_json_messages(source_data, target_data, locale)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(json.dumps(translated, ensure_ascii=False, indent=2) + "\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Translate Docusaurus docs markdown and locale JSON.")
    parser.add_argument(
        "--locales",
        nargs="+",
        default=[locale for locale in LOCALE_TARGETS if locale != "en"],
        help="Locales to translate.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    for locale in args.locales:
        ensure_locale_scaffold(locale)
    ensure_custom_code_messages(args.locales)

    for locale in args.locales:
        if locale not in LOCALE_TARGETS:
            raise SystemExit(f"Unsupported locale: {locale}")
        if locale == "en":
            continue

        translate_locale_json(locale)
        copy_and_translate_docs(locale)

    return 0


if __name__ == "__main__":
    sys.exit(main())
