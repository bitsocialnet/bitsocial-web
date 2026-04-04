# گردش کار ترجمه ها

این پروژه از فایل های ترجمه i18next در `public/translations/{lang}/default.json` استفاده می کند.

## قانون

هر فایل زبانی را به صورت دستی ویرایش نکنید. از `scripts/update-translations.js` استفاده کنید.

## یک کلید را اضافه یا به روز کنید

1. یک فایل فرهنگ لغت موقت ایجاد کنید، به عنوان مثال. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. نقشه ترجمه را اعمال کنید:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. فایل دیکشنری موقت را حذف کنید.

## سایر دستورات مفید

```bash
# یک کلید را از انگلیسی به همه زبان ها کپی کنید (خشک اجرا کنید سپس بنویسید)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# یک کلید را از همه زبان ها حذف کنید
node scripts/update-translations.js --key obsolete_key --delete --write

# ممیزی برای کلیدهای ترجمه استفاده نشده
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
