# Робочий процес перекладів

Цей проект використовує файли перекладу i18next у `public/translations/{lang}/default.json`.

## правило

Не редагуйте вручну кожен мовний файл. Використовуйте `scripts/update-translations.js`.

## Додайте або оновіть ключ

1. Створіть тимчасовий файл словника, напр. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Застосувати карту перекладу:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Видаліть тимчасовий файл словника.

## Інші корисні команди

```bash
# Скопіюйте ключ з англійської на всі мови (сухий запуск, потім запис)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Видалити ключ з усіх мов
node scripts/update-translations.js --key obsolete_key --delete --write

# Перевірка невикористаних ключів перекладу
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
