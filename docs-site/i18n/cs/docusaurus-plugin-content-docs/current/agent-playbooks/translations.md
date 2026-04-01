# Pracovní postup překladů

Tento projekt používá překladové soubory i18next v `public/translations/{lang}/default.json`.

## Pravidlo

Neupravujte ručně každý jazykový soubor. Použijte `scripts/update-translations.js`.

## Přidat nebo aktualizovat klíč

1. Vytvořte dočasný soubor slovníku, např. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Použijte mapu překladu:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Odstraňte dočasný soubor slovníku.

## Další užitečné příkazy

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
