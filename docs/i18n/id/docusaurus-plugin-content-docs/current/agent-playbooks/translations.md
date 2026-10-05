# Terjemahan

Situs about memakai JSON i18next di `about/public/translations/{lang}/default.json`. Terjemahan sumber Docusaurus berada terpisah di `docs/i18n/`.

## Key situs about

Gunakan `.agents/skills/translate/SKILL.md`. Temukan locale yang ada saat ini dari disk dan pertahankan placeholder, markup, istilah teknis, dan nama merek. Untuk permintaan yang lebih besar, agen anak dapat menghasilkan peta secara independen, tetapi satu agen induk menerapkan setiap penulisan locale secara berurutan; updater tidak memiliki kunci penulis.

Gunakan jalur peta unik yang dimiliki tugas. Pratinjau dengan `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, lalu terapkan dengan argumen yang sama ditambah `--write`. Verifikasi cakupan/nilai setelah menulis dan hapus hanya peta sementara milik tugas ini.

Gunakan `--delete` untuk penghapusan yang diminta. Periksa temuan `--audit --dry` sebelum menjalankan `--audit --write` yang diizinkan; key terjemahan dinamis memerlukan tinjauan sumber secara manual. Salin teks bahasa Inggris ke setiap locale hanya untuk istilah teknis, merek, atau placeholder.

## Halaman Docusaurus

`scripts/translate-docs.py` adalah penulis massal untuk semua halaman/locale dan tidak memiliki filter per berkas; jangan gunakan untuk suntingan terjemahan yang sempit. `scripts/check-docs-translations.py` adalah verifikator hanya-baca dan mendukung `--locales` serta `--paths`.

Jaga agar code fence, tautan, kode inline, alamat kontrak, judul, tabel, dan admonition tetap selaras dengan sumber bahasa Inggris. Selesaikan error verifikator; peringatan `frontmatter-untranslated` untuk nama merek memang bisa diperkirakan. Ikuti `docs/AGENTS.md` dan lakukan build melalui root ketika mengubah tema dokumentasi atau perilaku i18n agar keluaran statis dan Pagefind tetap selaras.

## Tinjauan semantik opsional

Untuk key i18next tertentu, gunakan `scripts/jev/translation-README.md`. Untuk halaman dokumentasi, jalankan `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md` terlebih dahulu. Perintah ini memerlukan pemilihan locale/halaman yang eksplisit, menjalankan verifikator struktural, dan melaporkan tinjauan semantik sebagai belum terverifikasi sampai inferensi langsung diaktifkan. Tambahkan `--live` hanya dengan otorisasi penyedia dan anggaran dari tugas; konfigurasi mesin privat bersama menyediakan kredensial dan model yang dipatok. Variabel lingkungan dan `--model` dapat menimpa penyiapan itu. Perintah ini tidak pernah menyunting terjemahan.

Adapter halaman mempertahankan konteks seluruh halaman dan membatasi tiap halaman hingga 24 KB serta tiap eksekusi hingga 30 pasangan. Untuk halaman yang lebih besar, siapkan pasangan paragraf sumber/terjemahan yang diselaraskan secara eksplisit untuk `translations.mjs --pairs`; jangan memasangkan paragraf secara otomatis berdasarkan indeks. Hasil semantik bersifat saran: periksa masalah dan ketidakpastian yang dilaporkan, dan pertahankan pemeriksaan kode/tautan/alamat yang deterministik.
