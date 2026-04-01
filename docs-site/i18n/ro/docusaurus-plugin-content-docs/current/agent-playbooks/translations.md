# Flux de lucru pentru traduceri

Acest proiect folosește fișierele de traducere i18next în `public/translations/{lang}/default.json`.

## Regulă

Nu editați manual fiecare fișier de limbă. Utilizați `scripts/update-translations.js`.

## Adăugați sau actualizați o cheie

1. Creați un fișier de dicționar temporar, de ex. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Aplicați harta de traducere:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Ștergeți fișierul dicționar temporar.

## Alte comenzi utile

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
