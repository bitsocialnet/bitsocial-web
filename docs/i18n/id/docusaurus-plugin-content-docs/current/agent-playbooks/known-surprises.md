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
- **Yang mengejutkan:** URL lokal default bukan port Vite biasa. Repo mengharapkan `https://bitsocial.localhost` melalui Portless, jadi memeriksa `localhost:3000` atau `localhost:5173` dapat menemukan aplikasi yang salah atau tidak sama sekali.
- **Dampak:** Pemeriksaan browser dapat gagal atau memvalidasi target yang salah meskipun server pengembang dalam keadaan sehat.
- **Mitigasi:** Gunakan `https://bitsocial.localhost` terlebih dahulu. Hanya lewati dengan `PORTLESS=0 corepack yarn start` ketika Anda secara eksplisit membutuhkan port Vite langsung.
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
- **Mitigasi:** Pertahankan startup Portless di belakang `scripts/start-dev.mjs`, yang sekarang menggunakan rute `*.bitsocial.localhost` cakupan cabang di luar kasus kanonis dan kembali ke rute cakupan cabang ketika nama `bitsocial.localhost` kosong sudah digunakan.
- **Status:** dikonfirmasi

### Pratinjau Dokumen digunakan untuk mengkodekan port 3001

- **Tanggal:** 30-03-2026
- **Diamati oleh:** Codex
- **Konteks:** Menjalankan `yarn start` bersama repo dan agen lokal lainnya
- **Yang mengejutkan:** Perintah root dev menjalankan ruang kerja dokumen dengan `docusaurus start --port 3001`, sehingga seluruh sesi dev gagal setiap kali proses lain sudah memiliki `3001`, meskipun aplikasi utama sudah menggunakan Portless.
- **Dampak:** `yarn start` dapat menghentikan proses web segera setelah proses booting, sehingga mengganggu pekerjaan lokal yang tidak terkait karena tabrakan port dokumen.
- **Mitigasi:** Pertahankan permulaan dokumen di belakang `yarn start:docs`, yang sekarang menggunakan Portless plus `scripts/start-docs.mjs` untuk mengikuti port bebas yang dimasukkan atau kembali ke port berikutnya yang tersedia saat dijalankan secara langsung.
- **Status:** dikonfirmasi

### Memperbaiki nama host Portless dokumen yang di-hardcode

- **Tanggal:** 03-04-2026
- **Diamati oleh:** Codex
- **Konteks:** Menjalankan `yarn start` di pohon kerja Web Bitsocial sekunder sementara pohon kerja lain sudah menyajikan dokumen melalui Portless
- **Yang mengejutkan:** `start:docs` masih mendaftarkan nama host `docs.bitsocial.localhost` literal, sehingga `yarn start` bisa gagal meskipun aplikasi about sudah mengetahui cara menghindari tabrakan rute Portless untuk nama hostnya sendiri.
- **Dampak:** Pohon kerja paralel tidak dapat menggunakan perintah root dev dengan andal karena proses dokumen keluar terlebih dahulu dan `concurrently` kemudian menghentikan sisa sesi.
- **Mitigasi:** Pertahankan permulaan dokumen di belakang `scripts/start-docs.mjs`, yang kini memperoleh nama host Portless cakupan cabang yang sama dengan aplikasi about dan memasukkan URL publik yang dibagikan tersebut ke target proksi pengembang `/docs`.
- **Status:** dikonfirmasi

### Shell Worktree dapat melewatkan versi Node yang disematkan pada repo

- **Tanggal:** 03-04-2026
- **Diamati oleh:** Codex
- **Konteks:** Menjalankan `yarn start` di pohon kerja Git seperti `.claude/worktrees/*` atau checkout pohon kerja saudaranya
- **Yang mengejutkan:** Beberapa worktree shell menyelesaikan `node` dan `yarn node` ke Homebrew Node `25.2.1` meskipun repo menyematkan `22.12.0` di `.nvmrc`, sehingga `yarn start` dapat menjalankan peluncur dev secara diam-diam pada runtime yang salah.
- **Dampak:** Perilaku server pengembang dapat berpindah antara checkout utama dan pohon kerja, membuat bug sulit untuk direproduksi dan melanggar toolchain Node 22 yang diharapkan dari repo.
- **Mitigasi:** Pertahankan peluncur pengembang di belakang `scripts/start-dev.mjs` dan `scripts/start-docs.mjs`, yang sekarang dijalankan ulang di bawah biner Node `.nvmrc` ketika shell saat ini berada pada versi yang salah. Pengaturan shell tetap harus memilih `nvm use`.
- **Status:** dikonfirmasi

### Sisa `docs-site/` dapat menyembunyikan sumber dokumen yang hilang setelah pemfaktoran ulang

- **Tanggal:** 01-04-2026
- **Diamati oleh:** Codex
- **Konteks:** Pembersihan monorepo pasca-penggabungan setelah memindahkan proyek Docusaurus dari `docs-site/` ke `docs/`
- **Yang mengejutkan:** Folder `docs-site/` yang lama dapat tetap berada di disk dengan file basi namun penting seperti `i18n/`, bahkan setelah repo yang dilacak dipindahkan ke `docs/`. Hal ini membuat pemfaktoran ulang terlihat terduplikasi secara lokal dan dapat menyembunyikan fakta bahwa terjemahan dokumen yang dilacak tidak benar-benar dipindahkan ke `docs/`.
- **Dampak:** Agen dapat menghapus folder lama sebagai “sampah” dan secara tidak sengaja kehilangan satu-satunya salinan lokal terjemahan dokumen, atau terus mengedit skrip yang masih mengarah ke jalur `docs-site/` yang mati.
- **Mitigasi:** Perlakukan `docs/` sebagai satu-satunya proyek dokumen kanonik. Sebelum menghapus sisa `docs-site/` lokal, pulihkan sumber terlacak seperti `docs/i18n/` dan perbarui skrip dan kait untuk berhenti merujuk `docs-site`.
- **Status:** dikonfirmasi

### Pratinjau dokumen multilokal dapat meningkatkan RAM selama verifikasi

- **Tanggal:** 01-04-2026
- **Diamati oleh:** Codex
- **Konteks:** Memperbaiki dokumen i18n, perutean lokal, dan perilaku Pagefind dengan `yarn start:docs` plus Playwright
- **Yang mengejutkan:** Mode pratinjau dokumen default kini membuat dokumen multilokal penuh ditambah pengindeksan Pagefind sebelum ditayangkan, dan menjaga proses tersebut tetap berjalan bersamaan dengan beberapa sesi Playwright atau Chrome dapat menghabiskan lebih banyak RAM daripada loop pengembang Vite atau Docusaurus lokal tunggal yang normal.
- **Dampak:** Mesin dapat mengalami keterbatasan memori, sesi browser dapat mogok, dan proses yang terhenti dapat menyebabkan server dokumen menjadi usang atau browser tanpa kepala yang terus menghabiskan memori.
- **Mitigasi:** Untuk pekerjaan dokumen yang tidak memerlukan rute lokal atau verifikasi Pagefind, pilih `DOCS_START_MODE=live yarn start:docs`. Hanya gunakan pratinjau multilokal default saat Anda perlu memvalidasi rute yang diterjemahkan atau Pencarian Halaman. Pertahankan satu sesi Penulis Drama, tutup sesi browser lama sebelum membuka yang baru, dan hentikan server dokumen setelah verifikasi jika Anda tidak lagi membutuhkannya.
- **Status:** dikonfirmasi
