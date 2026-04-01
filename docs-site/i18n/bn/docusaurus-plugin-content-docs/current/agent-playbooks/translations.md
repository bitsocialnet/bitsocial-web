# অনুবাদ কর্মপ্রবাহ

এই প্রকল্পটি `public/translations/{lang}/default.json`-এ i18next অনুবাদ ফাইল ব্যবহার করে।

## নিয়ম

প্রতিটি ভাষার ফাইল ম্যানুয়ালি সম্পাদনা করবেন না। `scripts/update-translations.js` ব্যবহার করুন।

## একটি কী যোগ করুন বা আপডেট করুন

1. একটি অস্থায়ী অভিধান ফাইল তৈরি করুন, যেমন `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. অনুবাদ মানচিত্র প্রয়োগ করুন:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. অস্থায়ী অভিধান ফাইল মুছুন।

## অন্যান্য দরকারী কমান্ড

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
