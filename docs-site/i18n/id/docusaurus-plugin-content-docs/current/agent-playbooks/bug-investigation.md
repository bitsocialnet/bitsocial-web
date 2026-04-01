# Alur Kerja Investigasi Bug

Gunakan ini ketika bug dilaporkan dalam blok file/baris/kode tertentu.

## Langkah Pertama yang Wajib

Sebelum mengedit, periksa riwayat git untuk kode yang relevan. Kontributor sebelumnya mungkin telah memperkenalkan perilaku untuk kasus/solusi edge.

## Alur kerja

1. Pindai judul komit terbaru (hanya judul) untuk file/area:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Periksa hanya komitmen yang relevan dengan perbedaan cakupan:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Lanjutkan dengan reproduksi dan perbaikan setelah memahami konteks sejarah.

## Aturan Pemecahan Masalah

Saat diblokir, cari di web untuk perbaikan/solusi terkini.
