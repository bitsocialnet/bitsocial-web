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
# Αντιγράψτε ένα κλειδί από τα Αγγλικά σε όλες τις γλώσσες (στεγνή εκτέλεση και μετά γράψτε)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Διαγράψτε ένα κλειδί από όλες τις γλώσσες
node scripts/update-translations.js --key obsolete_key --delete --write

# Έλεγχος για αχρησιμοποίητα κλειδιά μετάφρασης
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
