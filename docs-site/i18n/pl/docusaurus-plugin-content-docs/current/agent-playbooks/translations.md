# Przebieg tłumaczeń

W tym projekcie zastosowano pliki tłumaczeń i18next w formacie `public/translations/{lang}/default.json`.

## Reguła

Nie edytuj ręcznie każdego pliku językowego. Użyj `scripts/update-translations.js`.

## Dodaj lub zaktualizuj klucz

1. Utwórz tymczasowy plik słownika, np. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Zastosuj mapę tłumaczeniową:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Usuń tymczasowy plik słownika.

## Inne przydatne polecenia

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
