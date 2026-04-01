# Kejutan yang Diketahui

File ini melacak titik kebingungan spesifik repositori yang menyebabkan kesalahan agen.

## Kriteria Masuk

Tambahkan entri hanya jika semuanya benar:

- Ini khusus untuk repositori ini (bukan saran umum).
- Kemungkinan besar hal ini akan terulang kembali pada agen di masa mendatang.
- Ada mitigasi konkrit yang bisa diikuti.

Jika tidak yakin, tanyakan kepada pengembang sebelum menambahkan entri.

## Templat Entri

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Entri

### Portless mengubah URL aplikasi lokal kanonik

- **Tanggal:** 18-03-2026
- **Diamati oleh:** Codex
- **Konteks:** Verifikasi browser dan aliran asap
- **Yang mengejutkan:** URL lokal default bukan port Vite biasa. Repo mengharapkan `http://bitsocial.localhost:1355` melalui Portless, jadi memeriksa `localhost:3000` atau `localhost:5173` dapat menemukan aplikasi yang salah atau tidak sama sekali.
- **Dampak:** Pemeriksaan browser dapat gagal atau memvalidasi target yang salah meskipun server pengembang dalam keadaan sehat.
- **Mitigasi:** Gunakan `http://bitsocial.localhost:1355` terlebih dahulu. Hanya lewati dengan `PORTLESS=0 corepack yarn start` ketika Anda secara eksplisit membutuhkan port Vite langsung.
- **Status:** dikonfirmasi

### Kait komit memblokir komitmen non-interaktif

- **Tanggal:** 18-03-2026
- **Diamati oleh:** Codex
- **Konteks:** Alur kerja penerapan berbasis agen
- **Yang mengejutkan:** `git commit` memicu Commitizen melalui Husky dan menunggu masukan TTY interaktif, yang menyebabkan shell agen non-interaktif hang.
- **Dampak:** Agen dapat terhenti tanpa batas waktu selama komitmen normal.
- **Mitigasi:** Gunakan `git commit --no-verify -m "message"` untuk komitmen yang dibuat agen. Manusia masih bisa menggunakan `corepack yarn commit` atau `corepack yarn exec cz`.
- **Status:** dikonfirmasi

### Corepack diperlukan untuk menghindari Benang klasik

- **Tanggal:** 19-03-2026
- **Diamati oleh:** Codex
- **Konteks:** Migrasi manajer paket ke Yarn 4
- **Yang mengejutkan:** Mesin ini masih memiliki instalasi Yarn klasik global di `PATH`, jadi menjalankan `yarn` biasa dapat diselesaikan ke v1, bukan versi Yarn 4 yang disematkan.
- **Dampak:** Pengembang dapat secara tidak sengaja mengabaikan penyematan pengelola paket repo dan mendapatkan perilaku pemasangan atau keluaran file kunci yang berbeda.
- **Mitigasi:** Gunakan `corepack yarn ...` untuk perintah shell, atau jalankan `corepack enable` terlebih dahulu sehingga `yarn` memutuskan ke versi Yarn 4 yang disematkan.
- **Status:** dikonfirmasi

### Memperbaiki nama aplikasi Portless yang bertabrakan di pohon kerja Web Bitsocial

- **Tanggal:** 30-03-2026
- **Diamati oleh:** Codex
- **Konteks:** Memulai `yarn start` di satu pohon kerja Web Bitsocial sementara pohon kerja lain sudah ditayangkan melalui Portless
- **Yang mengejutkan:** Menggunakan nama aplikasi Portless literal `bitsocial` di setiap pohon kerja membuat rute itu sendiri bertabrakan, meskipun port pendukungnya berbeda, sehingga proses kedua gagal karena `bitsocial.localhost` sudah terdaftar.
- **Dampak:** Cabang Web Bitsocial paralel dapat memblokir satu sama lain meskipun Portless dimaksudkan agar cabang tersebut dapat hidup berdampingan dengan aman.
- **Mitigasi:** Pertahankan startup Portless di belakang `scripts/start-dev.mjs`, yang sekarang menggunakan rute `*.bitsocial.localhost:1355` cakupan cabang di luar kasus kanonis dan kembali ke rute cakupan cabang ketika nama `bitsocial.localhost` kosong sudah digunakan.
- **Status:** dikonfirmasi

### Pratinjau Dokumen digunakan untuk mengkodekan port 3001

- **Tanggal:** 30-03-2026
- **Diamati oleh:** Codex
- **Konteks:** Menjalankan `yarn start` bersama repo dan agen lokal lainnya
- **Yang mengejutkan:** Perintah root dev menjalankan ruang kerja dokumen dengan `docusaurus start --port 3001`, sehingga seluruh sesi dev gagal setiap kali proses lain sudah memiliki `3001`, meskipun aplikasi utama sudah menggunakan Portless.
- **Dampak:** `yarn start` dapat menghentikan proses web segera setelah proses booting, sehingga mengganggu pekerjaan lokal yang tidak terkait karena tabrakan port dokumen.
- **Mitigasi:** Pertahankan permulaan dokumen di belakang `yarn start:docs`, yang sekarang menggunakan Portless plus `scripts/start-docs.mjs` untuk mengikuti port bebas yang dimasukkan atau kembali ke port berikutnya yang tersedia saat dijalankan secara langsung.
- **Status:** dikonfirmasi
