# Μεταφράσεις Ροή εργασιών

Αυτό το έργο χρησιμοποιεί αρχεία μετάφρασης i18next στο `public/translations/{lang}/default.json`.

## Κανόνας

Μην επεξεργάζεστε χειροκίνητα κάθε αρχείο γλώσσας. Χρησιμοποιήστε το `scripts/update-translations.js`.

## Προσθήκη ή ενημέρωση κλειδιού

1. Δημιουργήστε ένα προσωρινό αρχείο λεξικού, π.χ. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Εφαρμογή του χάρτη μετάφρασης:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Διαγράψτε το προσωρινό αρχείο λεξικού.

## Άλλες χρήσιμες εντολές

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
