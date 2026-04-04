# Flusso di lavoro delle traduzioni

Questo progetto utilizza file di traduzione i18next in `public/translations/{lang}/default.json`.

## Regola

Non modificare manualmente ogni file di lingua. Utilizza `scripts/update-translations.js`.

## Aggiungi o aggiorna una chiave

1. Crea un file dizionario temporaneo, ad es. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Applica la mappa di traduzione:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Elimina il file dizionario temporaneo.

## Altri comandi utili

```bash
# Copia una chiave dall'inglese a tutte le lingue (esegui prima una prova, poi scrivi)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Elimina una chiave da tutte le lingue
node scripts/update-translations.js --key obsolete_key --delete --write

# Verifica le chiavi di traduzione inutilizzate
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
