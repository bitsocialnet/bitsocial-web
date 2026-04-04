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
# Kopieer een sleutel van het Engels naar alle talen (proefdraaien en vervolgens schrijven)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Verwijder een sleutel uit alle talen
node scripts/update-translations.js --key obsolete_key --delete --write

# Controle op ongebruikte vertaalsleutels
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
