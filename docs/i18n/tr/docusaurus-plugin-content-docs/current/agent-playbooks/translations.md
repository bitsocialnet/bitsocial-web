# Çeviri İş Akışı

Bu proje `public/translations/{lang}/default.json` içindeki i18next çeviri dosyalarını kullanıyor.

## Kural

Her dil dosyasını manuel olarak düzenlemeyin. `scripts/update-translations.js` kullanın.

## Anahtar Ekleme veya Güncelleme

1. Geçici bir sözlük dosyası oluşturun, ör. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Çeviri haritasını uygulayın:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Geçici sözlük dosyasını silin.

## Diğer Yararlı Komutlar

```bash
# Bir anahtarı İngilizce'den tüm dillere kopyalayın (kuru çalıştırma ve ardından yazma)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Tüm dillerden bir anahtarı silin
node scripts/update-translations.js --key obsolete_key --delete --write

# Kullanılmayan çeviri anahtarlarının denetimi
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
