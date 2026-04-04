# Fordítási munkafolyamat

Ez a projekt a `public/translations/{lang}/default.json` i18next fordítási fájljait használja.

## szabály

Ne szerkesszen manuálisan minden nyelvi fájlt. Használja a `scripts/update-translations.js`-t.

## Kulcs hozzáadása vagy frissítése

1. Hozzon létre egy ideiglenes szótárfájlt, pl. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. A fordítási térkép alkalmazása:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Törölje az ideiglenes szótárfájlt.

## Egyéb hasznos parancsok

```bash
# Kulcs másolása angolról minden nyelvre (száraz futás, majd írás)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Töröljön egy kulcsot az összes nyelvből
node scripts/update-translations.js --key obsolete_key --delete --write

# Fel nem használt fordítási kulcsok ellenőrzése
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
