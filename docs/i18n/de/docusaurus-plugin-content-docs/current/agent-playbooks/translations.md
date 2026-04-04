# Übersetzungsworkflow

Dieses Projekt verwendet i18next-Übersetzungsdateien in `public/translations/{lang}/default.json`.

## Regel

Bearbeiten Sie nicht jede Sprachdatei manuell. Verwenden Sie `scripts/update-translations.js`.

## Fügen Sie einen Schlüssel hinzu oder aktualisieren Sie ihn

1. Erstellen Sie eine temporäre Wörterbuchdatei, z.B. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Wenden Sie die Übersetzungskarte an:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Löschen Sie die temporäre Wörterbuchdatei.

## Andere nützliche Befehle

```bash
# Kopieren Sie einen Schlüssel vom Englischen in alle Sprachen (Probelauf, dann schreiben)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Einen Schlüssel aus allen Sprachen löschen
node scripts/update-translations.js --key obsolete_key --delete --write

# Prüfung auf ungenutzte Übersetzungsschlüssel
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
