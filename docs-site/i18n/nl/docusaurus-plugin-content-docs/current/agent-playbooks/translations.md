# Vertaalworkflow

Dit project gebruikt i18next-vertaalbestanden in `public/translations/{lang}/default.json`.

## Regel

Bewerk niet elk taalbestand handmatig. Gebruik `scripts/update-translations.js`.

## Een sleutel toevoegen of bijwerken

1. Maak een tijdelijk woordenboekbestand, b.v. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Pas de vertaalkaart toe:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Verwijder het tijdelijke woordenboekbestand.

## Andere nuttige opdrachten

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
