---
title: 5chan
description: Imageboard terdesentralisasi tanpa server yang dibangun di atas protokol Bitsocial, tempat siapa pun bisa membuat dan memiliki papannya sendiri.
sidebar_position: 1
---

# 5chan

5chan adalah imageboard tanpa server, tanpa admin, dan sepenuhnya terdesentralisasi yang berjalan di atas protokol Bitsocial. 5chan mengikuti struktur direktori imageboard yang sudah dikenal sekaligus memperkenalkan kepemilikan yang terdesentralisasi — siapa pun dapat membuat papan, dan beberapa papan dapat memperebutkan slot direktori yang sama melalui mekanisme pemungutan suara.

## Unduhan

| Platform | Tautan                                 |
| -------- | -------------------------------------- |
| Web      | [5chan.app](https://5chan.app)         |
| Desktop  | Tersedia untuk Mac, Windows, dan Linux |
| Seluler  | Tersedia untuk Android                 |

## Cara kerja papan

5chan menata konten ke dalam papan menggunakan tata letak direktori klasik (misalnya `/b/`, `/g/`). Berbeda dengan imageboard tradisional yang setiap papannya dikendalikan oleh admin pusat, 5chan memungkinkan setiap pengguna membuat dan sepenuhnya memiliki papannya sendiri. Ketika beberapa papan mengincar slot direktori yang sama, mereka memperebutkan posisi itu; lihat [Direktori](/directories/).

### Membuat papan

Untuk membuat papan baru, Anda perlu menjalankan `bitsocial-cli` sebagai node peer-to-peer. Dengan begitu papan Anda dihosting secara terdesentralisasi tanpa bergantung pada server pusat mana pun.

### Penetapan direktori

Papan kandidat untuk setiap direktori dicantumkan dalam berkas `5chan-directories/5chan-<code>-directory.json` di repositori [bitsocialnet/lists](https://github.com/bitsocialnet/lists), dan sebuah papan bergabung ke direktori melalui pull request ke berkas tersebut. 5chan juga menjalankan kontes pemungutan suara untuk setiap direktori dengan [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting): setiap pemegang 5chan Pass mendapat satu suara, dan memberikan suara untuk papan yang belum terdaftar berarti menominasikannya. Kontes saat ini berjalan di testnet Base Sepolia, tempat hasil penghitungan ditampilkan tetapi tidak mengubah urutan daftar.

## Cara kerja internal

Di balik layar, 5chan memakai lapisan klien protokol Bitsocial bersama untuk seluruh interaksi
jaringannya. Aplikasi web di 5chan.app secara bawaan menjalankan node Helia di dalam browser, sehingga
satu tab biasa pun ikut bergabung ke jaringan sebagai peer: tab itu memuat papan dari peer lain dan
memublikasikan lewat pubsub, tanpa gateway IPFS terpusat di jalur kontennya. Lihat
[Peer-to-Peer di Browser](/browser-p2p/) untuk mengetahui apa saja yang tercakup di dalamnya dan apa
yang masih belum bisa dilakukan node browser.

## Tautan

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lisensi**: GPL-2.0-only
