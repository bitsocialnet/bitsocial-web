# Alur Kerja Agen yang Berjalan Lama

Gunakan pedoman ini ketika suatu tugas kemungkinan akan mencakup beberapa sesi, serah terima, atau agen yang muncul.

## Sasaran

- Berikan setiap sesi baru cara cepat untuk mendapatkan kembali konteksnya
- Pertahankan pekerjaan secara bertahap, bukan hanya melakukan perubahan besar dalam satu waktu
- Tangkap baseline lokal yang rusak sebelum menambahkan lebih banyak kode
- Tinggalkan artefak tahan lama yang dapat dipercaya pada sesi berikutnya

## Tempat Menyimpan Negara

- Gunakan `docs/agent-runs/<slug>/` ketika manusia, bot peninjau, atau beberapa rantai alat memerlukan status tugas yang sama.
- Gunakan direktori alat-lokal seperti `.codex/runs/<slug>/` hanya jika status tugas sengaja bersifat lokal pada satu stasiun kerja atau satu rantai alat.
- Jangan sembunyikan status bersama multi-sesi dalam file awal pribadi jika kontributor atau agen lain membutuhkannya nanti.

## File yang Diperlukan

Buat file-file ini di awal tugas yang sudah berjalan lama:

- `feature-list.json`
- `progress.md`

Gunakan templat di `docs/agent-playbooks/templates/feature-list.template.json` dan `docs/agent-playbooks/templates/progress.template.md`.

Pilih JSON untuk daftar fitur sehingga agen dapat memperbarui sejumlah kecil bidang tanpa menulis ulang seluruh dokumen.

## Daftar Periksa Mulai Sesi

1. Jalankan `pwd`.
2. Baca `progress.md`.
3. Baca `feature-list.json`.
4. Jalankan `git log --oneline -20`.
5. Jalankan `./scripts/agent-init.sh --smoke`.
6. Pilih tepat satu item dengan prioritas tertinggi yang masih `pending`, `in_progress`, atau `blocked`.

Jika langkah asap gagal, perbaiki garis dasar yang rusak sebelum menerapkan potongan fitur baru.

## Aturan Sesi

- Kerjakan satu fitur atau bagian tugas dalam satu waktu.
- Jaga agar daftar fitur dapat dibaca mesin dan stabil. Perbarui status, catatan, file, dan bidang verifikasi daripada menulis ulang item yang tidak terkait.
- Hanya tandai item yang diverifikasi setelah menjalankan perintah atau alur pengguna yang tercantum dalam item tersebut.
- Gunakan agen yang dihasilkan untuk irisan yang dibatasi, bukan untuk kepemilikan status tugas secara keseluruhan.
- Ketika agen anak memiliki satu item, berikan id item yang tepat, kriteria penerimaan, dan file yang mungkin disentuhnya.

## Daftar Periksa Akhir Sesi

1. Tambahkan entri kemajuan singkat ke `progress.md`.
2. Perbarui item yang disentuh di `feature-list.json`.
3. Catat perintah persis yang dijalankan untuk verifikasi.
4. Tangkap pemblokir, tindak lanjut, dan item terbaik berikutnya untuk dilanjutkan.

## Bentuk Entri Kemajuan yang Direkomendasikan

Gunakan struktur pendek seperti:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
