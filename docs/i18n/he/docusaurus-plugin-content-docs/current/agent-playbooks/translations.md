# זרימת עבודה של תרגומים

פרויקט זה משתמש בקובצי תרגום i18next ב-`public/translations/{lang}/default.json`.

## כלל

אל תערוך ידנית כל קובץ שפה. השתמש ב-`scripts/update-translations.js`.

## הוסף או עדכן מפתח

1. צור קובץ מילון זמני, למשל. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. החל את מפת התרגום:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. מחק את קובץ המילון הזמני.

## פקודות שימושיות אחרות

```bash
# העתק מפתח מאנגלית לכל השפות (הפעל יבש ואז כתוב)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# מחק מפתח מכל השפות
node scripts/update-translations.js --key obsolete_key --delete --write

# ביקורת על מפתחות תרגום שאינם בשימוש
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
