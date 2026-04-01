# سير عمل الترجمات

يستخدم هذا المشروع ملفات الترجمة i18next في `public/translations/{lang}/default.json`.

## القاعدة

لا تقم بتحرير كل ملف لغة يدويًا. استخدم `scripts/update-translations.js`.

## إضافة أو تحديث مفتاح

1. قم بإنشاء ملف قاموس مؤقت، على سبيل المثال. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. تطبيق خريطة الترجمة:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. احذف ملف القاموس المؤقت.

## أوامر مفيدة أخرى

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
