# Translations

The about site uses i18next JSON at `about/public/translations/{lang}/default.json`. Docusaurus source translations live separately in `docs/i18n/`.

## About-site keys

Use `.agents/skills/translate/SKILL.md`. Discover current locales from disk and preserve placeholders, markup, technical terms, and brand names. For larger requests, children can generate independent maps, but one parent applies every locale write serially; the updater has no writer lock.

Use a unique task-owned map path. Preview with `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, then apply with the same arguments and `--write`. Verify coverage/values after writing and remove only the temporary maps owned by this task.

Use `--delete` for requested removals. Inspect `--audit --dry` findings before an authorized `--audit --write`; dynamic translation keys require manual source review. Copy English into every locale only for a technical term, brand, or placeholder.

## Docusaurus pages

`scripts/translate-docs.py` is a bulk writer for all pages/locales and has no per-file filter; do not use it for a narrow translation edit. `scripts/check-docs-translations.py` is the read-only verifier and supports `--locales` and `--paths`.

Keep code fences, links, inline code, contract addresses, headings, tables, and admonitions aligned with the English source. Resolve verifier errors; brand-name `frontmatter-untranslated` warnings can be expected. Follow `docs/AGENTS.md` and build through the root when changing docs theme or i18n behavior so static output and Pagefind stay aligned.
