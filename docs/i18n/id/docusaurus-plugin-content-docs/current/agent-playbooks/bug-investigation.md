# Alur Kerja Investigasi Bug

Gunakan ini ketika bug dilaporkan dalam blok file/baris/kode tertentu.

## Langkah Pertama yang Wajib

Sebelum mengedit, periksa riwayat git untuk kode yang relevan. Kontributor sebelumnya mungkin telah memperkenalkan perilaku untuk kasus/solusi edge.

## Alur kerja

1. Pindai judul komit terbaru (hanya judul) untuk file/area:

```bash
# Judul komit terbaru untuk file tertentu
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Judul penerapan terbaru untuk rentang baris tertentu
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Periksa hanya komitmen yang relevan dengan perbedaan cakupan:

```bash
# Tampilkan pesan komit + perbedaan untuk satu file
git show <commit-hash> -- path/to/file.tsx
```

3. Lanjutkan dengan reproduksi dan perbaikan setelah memahami konteks sejarah.

## Aturan Pemecahan Masalah

Saat diblokir, cari di web untuk perbaikan/solusi terkini.
