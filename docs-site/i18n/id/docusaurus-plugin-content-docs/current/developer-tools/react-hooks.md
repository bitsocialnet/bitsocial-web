---
title: Bereaksi Kait
description: Pustaka React hooks untuk membangun aplikasi sosial terdesentralisasi pada protokol Bitsocial.
sidebar_position: 1
---

# Bereaksi Kait

:::warning Legacy Naming
Paket ini saat ini menggunakan konvensi penamaan lama yang diwarisi dari fork hulunya. Referensi ke "plebbit" dalam kode, API, dan konfigurasi akan dimigrasikan ke "bitsocial" pada rilis mendatang. Fungsionalitas tidak terpengaruh.
:::

Paket `bitsocial-react-hooks` menyediakan API React hooks yang familier untuk berinteraksi dengan protokol Bitsocial. Ini menangani pengambilan feed, komentar, dan profil penulis, mengelola akun, menerbitkan konten, dan berlangganan komunitas -- semuanya tanpa bergantung pada server pusat.

Pustaka ini adalah antarmuka utama yang digunakan oleh [5chan](/apps/5chan/) dan aplikasi klien Bitsocial lainnya.

:::note
`bitsocial-react-hooks` adalah fork sementara dari `plebbit/plebbit-react-hooks` yang dikelola untuk pengembangan yang dibantu AI. Itu dikonsumsi langsung dari GitHub daripada dipublikasikan ke npm.
:::

## Instalasi

Karena paket belum ada di npm, instal langsung dari GitHub, sematkan ke hash penerapan tertentu:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Ganti `<commit-hash>` dengan komit yang ingin Anda targetkan.

## Ikhtisar API

Pengait disusun ke dalam kategori fungsional. Di bawah ini adalah ringkasan hook yang paling umum digunakan di setiap kategori. Untuk tanda tangan lengkap, parameter, dan tipe pengembalian, lihat [referensi API lengkap di GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Akun

Kelola akun pengguna lokal, identitas, dan pengaturan.

- `useAccount(accountName?)` -- mengembalikan objek akun yang aktif (atau bernama).
- `useAccounts()` -- mengembalikan semua akun yang disimpan secara lokal
- `useAccountComments(options?)` -- mengembalikan komentar yang diterbitkan oleh akun aktif

### Komentar

Ambil dan berinteraksi dengan komentar dan rangkaian pesan individual.

- `useComment(commentCid?)` -- mengambil satu komentar berdasarkan CID-nya
- `useComments(commentCids?)` -- mengambil beberapa komentar sekaligus
- `useEditedComment(comment?)` -- mengembalikan versi komentar terbaru yang telah diedit

### Komunitas

Ambil metadata dan pengaturan komunitas.

- `useSubplebbit(subplebbitAddress?)` -- mengambil komunitas berdasarkan alamat
- `useSubplebbits(subplebbitAddresses?)` -- mengambil banyak komunitas
- `useSubplebbitStats(subplebbitAddress?)` -- mengembalikan jumlah pelanggan dan kiriman

### Penulis

Cari profil penulis dan metadata.

- `useAuthor(authorAddress?)` -- mengambil profil penulis
- `useAuthorComments(options?)` -- mengembalikan komentar dari penulis tertentu
- `useResolvedAuthorAddress(authorAddress?)` -- menyelesaikan alamat yang dapat dibaca manusia (mis., ENS) ke alamat protokolnya

### Umpan

Berlangganan dan memberi nomor halaman pada feed konten.

- `useFeed(options?)` -- mengembalikan feed postingan yang diberi nomor halaman dari satu atau lebih komunitas
- `useBufferedFeeds(feedOptions?)` -- melakukan pra-buffer pada beberapa feed untuk rendering yang lebih cepat
- `useAuthorFeed(authorAddress?)` -- mengembalikan feed postingan oleh penulis tertentu

### Tindakan

Publikasikan konten dan lakukan operasi tulis.

- `usePublishComment(options?)` -- mempublikasikan komentar atau balasan baru
- `usePublishVote(options?)` -- memberikan suara positif atau suara negatif
- `useSubscribe(options?)` -- berlangganan atau berhenti berlangganan dari komunitas

### Amerika dan RPC

Pantau status koneksi dan berinteraksi dengan daemon Bitsocial jarak jauh.

- `useClientsStates(options?)` -- mengembalikan status koneksi klien IPFS/pubsub
- `usePlebbitRpcSettings()` -- mengembalikan konfigurasi daemon RPC saat ini

## Pembangunan

Untuk mengerjakan perpustakaan hooks secara lokal:

**Prasyarat:** Node.js, Corepack diaktifkan, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Lihat repositori README untuk perintah pengujian dan pembangunan.

## Tautan

- **GitHub:** [bitsocialnet/bitsocial-react-hook](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Lisensi:** Khusus GPL-2.0
