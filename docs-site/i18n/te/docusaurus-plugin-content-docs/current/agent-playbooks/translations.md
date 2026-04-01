# అనువాద వర్క్‌ఫ్లో

ఈ ప్రాజెక్ట్ `public/translations/{lang}/default.json`లో i18next అనువాద ఫైల్‌లను ఉపయోగిస్తుంది.

## నియమం

ప్రతి భాషా ఫైల్‌ను మాన్యువల్‌గా సవరించవద్దు. `scripts/update-translations.js`ని ఉపయోగించండి.

## ఒక కీని జోడించండి లేదా నవీకరించండి

1. తాత్కాలిక నిఘంటువు ఫైల్‌ను సృష్టించండి, ఉదా. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. అనువాద మ్యాప్‌ని వర్తింపజేయండి:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. తాత్కాలిక నిఘంటువు ఫైల్‌ను తొలగించండి.

## ఇతర ఉపయోగకరమైన ఆదేశాలు

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
