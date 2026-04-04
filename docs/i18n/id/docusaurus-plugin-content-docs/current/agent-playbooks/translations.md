# Alur Kerja Terjemahan

Proyek ini menggunakan file terjemahan i18next di `public/translations/{lang}/default.json`.

## Aturan

Jangan mengedit setiap file bahasa secara manual. Gunakan `scripts/update-translations.js`.

## Tambahkan atau Perbarui Kunci

1. Buat file kamus sementara, mis. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Terapkan peta terjemahan:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Hapus file kamus sementara.

## Perintah Berguna Lainnya

```bash
# Salin kunci dari bahasa Inggris ke semua bahasa (uji coba lalu tulis)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Hapus kunci dari semua bahasa
node scripts/update-translations.js --key obsolete_key --delete --write

# Audit untuk kunci terjemahan yang tidak digunakan
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
