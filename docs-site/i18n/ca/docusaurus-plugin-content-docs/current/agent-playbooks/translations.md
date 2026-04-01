# Flux de treball de traduccions

Aquest projecte utilitza fitxers de traducció i18next a `public/translations/{lang}/default.json`.

## Regla

No editeu manualment tots els fitxers d'idioma. Utilitzeu `scripts/update-translations.js`.

## Afegeix o actualitza una clau

1. Creeu un fitxer de diccionari temporal, p. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Aplica el mapa de traducció:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Suprimeix el fitxer de diccionari temporal.

## Altres ordres útils

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
