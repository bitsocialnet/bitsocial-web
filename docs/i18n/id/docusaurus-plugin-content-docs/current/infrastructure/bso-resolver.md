---
title: BSO Resolver
description: Selesaikan nama domain .bso menjadi kunci publik menggunakan data ENS TXT, dengan cache bawaan dan dukungan lintas platform.
sidebar_position: 1
---

# BSO Resolver

BSO Resolver menerjemahkan nama domain `.bso` menjadi kunci publik yang sesuai dengan membaca data TXT Bitsocial yang disimpan di ENS. Ini menyediakan klien viem bersama, cache persisten, dan berfungsi di lingkungan Node.js dan browser.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Lisensi**: Khusus GPL-2.0

## Instalasi

```bash
npm install @bitsocial/bso-resolver
```

## Membuat Penyelesai

Buat instance penyelesai dengan meneruskan objek konfigurasi ke konstruktor:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parameter  | Diperlukan | Keterangan                                          |
| ---------- | ---------- | --------------------------------------------------- |
| `key`      | Ya         | Pengidentifikasi untuk instans penyelesai.          |
| `provider` | Ya         | Konfigurasi transportasi (lihat di bawah).          |
| `dataPath` | TIDAK      | Direktori untuk file cache SQLite (khusus Node.js). |

### Opsi Penyedia

Parameter `provider` menerima tiga format:

- **`"viem"`** -- Menggunakan transportasi umum default yang disediakan oleh viem.
- **URL HTTP(S)** -- Menyambungkan melalui titik akhir JSON-RPC (misalnya, `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** -- Menyambungkan melalui titik akhir RPC WebSocket (misalnya, `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Metode

### `resolve({ name, abortSignal? })`

Mencari nama `.bso` dan mengembalikan kunci publik terkait. `AbortSignal` opsional dapat diteruskan untuk membatalkan permintaan yang sudah berjalan lama.

### `canResolve({ name })`

Mengembalikan boolean yang menunjukkan apakah penyelesai mampu menangani nama yang diberikan. Gunakan ini untuk memeriksa dukungan sebelum mencoba resolusi penuh.

### `destroy()`

Meruntuhkan penyelesai, menutup koneksi database dan melepaskan sumber daya. Panggil ini ketika penyelesai tidak lagi diperlukan.

## cache

Nama yang terselesaikan disimpan dalam cache secara otomatis untuk mengurangi pencarian jaringan yang berlebihan. Backend caching dipilih berdasarkan lingkungan runtime:

| Lingkungan  | Bagian belakang    | Catatan                                                             |
| ----------- | ------------------ | ------------------------------------------------------------------- |
| Node.js     | SQLite             | Disimpan di `dataPath`. Menggunakan mode WAL untuk akses bersamaan. |
| Peramban    | DB yang diindeks   | Menggunakan transaksi IndexedDB asli.                               |
| Penggantian | Dalam memori `Map` | Digunakan ketika SQLite atau IndexedDB tidak tersedia.              |

Semua entri cache memiliki **TTL satu jam** dan secara otomatis dikeluarkan setelah habis masa berlakunya.

## Integrasi dengan pkc-js

Resolver dapat dipasang langsung ke pkc-js melalui opsi `nameResolvers`, memungkinkan resolusi nama `.bso` yang transparan selama pencarian kunci:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Konkurensi

Resolver dirancang agar aman jika digunakan secara bersamaan:

- Satu klien viem bersama menghindari koneksi yang berlebihan.
- SQLite beroperasi dalam mode WAL (Write-Ahead Logging), memungkinkan pembacaan bersamaan tanpa pemblokiran.
- Caching browser bergantung pada transaksi IndexedDB asli untuk isolasi.

## Titik Masuk Platform

Paket ini mengirimkan titik masuk terpisah untuk Node.js dan versi browser. Bundler yang mendukung bidang `exports` di `package.json` akan secara otomatis memilih yang benar.
