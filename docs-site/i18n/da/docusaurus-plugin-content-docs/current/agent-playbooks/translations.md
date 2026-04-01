# Workflow for oversættelser

Dette projekt bruger i18next-oversættelsesfiler i `public/translations/{lang}/default.json`.

## Regel

Rediger ikke hver sprogfil manuelt. Brug `scripts/update-translations.js`.

## Tilføj eller opdater en nøgle

1. Opret en midlertidig ordbogsfil, f.eks. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Anvend oversættelseskortet:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Slet den midlertidige ordbogsfil.

## Andre nyttige kommandoer

```bash
# Copy a key from English to all languages (dry run then write)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Delete a key from all languages
node scripts/update-translations.js --key obsolete_key --delete --write

# Audit for unused translation keys
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
