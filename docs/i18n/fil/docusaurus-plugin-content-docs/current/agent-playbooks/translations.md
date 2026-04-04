# Daloy ng Trabaho ng Mga Pagsasalin

Gumagamit ang proyektong ito ng i18next translation file sa `public/translations/{lang}/default.json`.

## Panuntunan

Huwag manu-manong i-edit ang bawat file ng wika. Gamitin ang `scripts/update-translations.js`.

## Magdagdag o Mag-update ng Key

1. Gumawa ng pansamantalang file ng diksyunaryo, hal. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Ilapat ang mapa ng pagsasalin:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Tanggalin ang pansamantalang file ng diksyunaryo.

## Iba pang Mga Kapaki-pakinabang na Utos

```bash
# Kopyahin ang isang susi mula sa Ingles sa lahat ng mga wika (dry run pagkatapos ay magsulat)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Magtanggal ng susi sa lahat ng wika
node scripts/update-translations.js --key obsolete_key --delete --write

# Pag-audit para sa mga hindi nagamit na translation key
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
