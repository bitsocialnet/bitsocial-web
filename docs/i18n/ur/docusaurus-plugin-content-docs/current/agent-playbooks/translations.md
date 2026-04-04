# ترجمہ ورک فلو

یہ پروجیکٹ i18next ترجمہ فائلوں کو `public/translations/{lang}/default.json` میں استعمال کرتا ہے۔

## قاعدہ

ہر زبان کی فائل میں دستی طور پر ترمیم نہ کریں۔ `scripts/update-translations.js` استعمال کریں۔

## کلید شامل کریں یا اپ ڈیٹ کریں

1. ایک عارضی لغت فائل بنائیں، جیسے `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. ترجمے کا نقشہ لگائیں:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. عارضی لغت فائل کو حذف کریں۔

## دیگر مفید کمانڈز

```bash
# انگریزی سے تمام زبانوں میں ایک کلید کاپی کریں (ڈرائی رن پھر لکھیں)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# تمام زبانوں سے کلید کو حذف کریں۔
node scripts/update-translations.js --key obsolete_key --delete --write

# غیر استعمال شدہ ترجمے کی چابیاں کا آڈٹ
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
