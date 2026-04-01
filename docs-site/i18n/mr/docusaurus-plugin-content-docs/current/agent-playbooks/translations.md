# भाषांतर कार्यप्रवाह

हा प्रकल्प `public/translations/{lang}/default.json` मध्ये i18next भाषांतर फाइल्स वापरतो.

## नियम

प्रत्येक भाषा फाइल व्यक्तिचलितपणे संपादित करू नका. `scripts/update-translations.js` वापरा.

## की जोडा किंवा अपडेट करा

1. तात्पुरती शब्दकोश फाइल तयार करा, उदा. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. अनुवाद नकाशा लागू करा:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. तात्पुरती शब्दकोश फाइल हटवा.

## इतर उपयुक्त आदेश

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
