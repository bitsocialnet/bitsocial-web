# Format Komit dan Masalah

Gunakan ini saat mengusulkan atau menerapkan perubahan kode yang berarti.

## Format Saran Komit

- **Judul:** Gaya Commits Konvensional, pendek, dibalut backticks.
- Gunakan `perf` (bukan `fix`) untuk pengoptimalan kinerja.
- **Deskripsi:** Opsional 2-3 kalimat informal yang menjelaskan solusi. Ringkas, teknis, tanpa poin-poin.

Contoh:

> **Judul komitmen:** `fix: correct date formatting in timezone conversion`
>
> Diperbarui `formatDate()` di `date-utils.ts` untuk menangani offset zona waktu dengan benar.

## Format Saran Masalah GitHub

- **Judul:** Sesingkat mungkin, dibungkus dengan backticks.
- **Deskripsi:** 2-3 kalimat informal yang menggambarkan masalah (bukan solusi), seolah-olah masih belum terselesaikan.

Contoh:

> **Masalah GitHub:**
>
> - **Judul:** `Date formatting displays incorrect timezone`
> - **Deskripsi:** Stempel waktu komentar menunjukkan zona waktu yang salah ketika pengguna melihat postingan dari wilayah berbeda. Fungsi `formatDate()` tidak memperhitungkan pengaturan zona waktu lokal pengguna.
