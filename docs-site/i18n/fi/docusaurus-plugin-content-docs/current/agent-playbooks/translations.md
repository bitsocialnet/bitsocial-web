# Käännöstyönkulku

Tämä projekti käyttää i18next-käännöstiedostoja muodossa `public/translations/{lang}/default.json`.

## Sääntö

Älä muokkaa kaikkia kielitiedostoja manuaalisesti. Käytä `scripts/update-translations.js`.

## Lisää tai päivitä avain

1. Luo väliaikainen sanakirjatiedosto, esim. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Käytä käännöskartta:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Poista väliaikainen sanakirjatiedosto.

## Muut hyödylliset komennot

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
