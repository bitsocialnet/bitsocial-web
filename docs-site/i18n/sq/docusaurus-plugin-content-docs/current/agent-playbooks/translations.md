# Rrjedha e punës së përkthimeve

Ky projekt përdor skedarët e përkthimit i18next në `public/translations/{lang}/default.json`.

## Rregulli

Mos e modifikoni manualisht çdo skedar gjuhësor. Përdor `scripts/update-translations.js`.

## Shtoni ose përditësoni një çelës

1. Krijo një skedar të përkohshëm fjalori, p.sh. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Aplikoni hartën e përkthimit:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Fshi skedarin e përkohshëm të fjalorit.

## Komanda të tjera të dobishme

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
