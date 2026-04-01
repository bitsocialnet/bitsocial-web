# अनुवाद कार्यप्रवाह

यह प्रोजेक्ट `public/translations/{lang}/default.json` में i18next अनुवाद फ़ाइलों का उपयोग करता है।

## नियम

प्रत्येक भाषा फ़ाइल को मैन्युअल रूप से संपादित न करें। `scripts/update-translations.js` का उपयोग करें।

## कोई कुंजी जोड़ें या अपडेट करें

1. एक अस्थायी शब्दकोश फ़ाइल बनाएँ, उदा. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. अनुवाद मानचित्र लागू करें:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. अस्थायी शब्दकोश फ़ाइल हटाएँ.

## अन्य उपयोगी आदेश

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
