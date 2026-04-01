# Arbeidsflyt for oversettelser

Dette prosjektet bruker i18next-oversettelsesfiler i `public/translations/{lang}/default.json`.

## Regel

Ikke rediger hver språkfil manuelt. Bruk `scripts/update-translations.js`.

## Legg til eller oppdater en nøkkel

1. Lag en midlertidig ordbokfil, f.eks. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Bruk oversettelseskartet:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Slett den midlertidige ordbokfilen.

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
