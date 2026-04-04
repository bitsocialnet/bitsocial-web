# Arbetsflöde för översättningar

Det här projektet använder i18next-översättningsfiler i `public/translations/{lang}/default.json`.

## Regel

Redigera inte varje språkfil manuellt. Använd `scripts/update-translations.js`.

## Lägg till eller uppdatera en nyckel

1. Skapa en tillfällig ordboksfil, t.ex. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Använd översättningskartan:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Ta bort den tillfälliga ordboksfilen.

## Andra användbara kommandon

```bash
# Kopiera en nyckel från engelska till alla språk (torka sedan och skriv)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Ta bort en nyckel från alla språk
node scripts/update-translations.js --key obsolete_key --delete --write

# Granska för oanvända översättningsnycklar
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
