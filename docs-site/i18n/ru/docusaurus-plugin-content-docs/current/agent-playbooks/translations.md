# Рабочий процесс перевода

В этом проекте используются файлы перевода i18next в `public/translations/{lang}/default.json`.

## Правило

Не редактируйте каждый языковой файл вручную. Используйте `scripts/update-translations.js`.

## Добавить или обновить ключ

1. Создайте временный файл словаря, например. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Примените карту перевода:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Удалите временный файл словаря.

## Другие полезные команды

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
