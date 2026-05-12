---
title: 5chan
description: Imageboard terdesentralisasi tanpa server yang dibangun di atas protokol Bitsocial tempat siapa pun dapat membuat dan memiliki papan.
sidebar_position: 1
---

# 5chan

5chan adalah imageboard tanpa server, tanpa admin, dan sepenuhnya terdesentralisasi yang berjalan pada protokol Bitsocial. Ini mengikuti struktur direktori imageboard yang sudah dikenal sambil memperkenalkan kepemilikan terdesentralisasi — siapa pun dapat membuat papan, dan beberapa papan dapat bersaing untuk mendapatkan slot direktori yang sama melalui mekanisme pemungutan suara.

## Unduhan

| Peron    | Tautan                                 |
| -------- | -------------------------------------- |
| jaringan | [5chan.aplikasi](https://5chan.app)    |
| Desktop  | Tersedia untuk Mac, Windows, dan Linux |
| Seluler  | Tersedia untuk Android                 |

## Cara kerja papan

5chan mengatur konten ke dalam papan menggunakan tata letak direktori klasik (misalnya, `/b/`, `/g/`). Tidak seperti papan gambar tradisional di mana admin pusat mengontrol setiap papan, 5chan memungkinkan setiap pengguna membuat dan memiliki papan mereka sendiri sepenuhnya. Ketika beberapa dewan menargetkan slot direktori yang sama, mereka bersaing untuk mendapatkan posisi tersebut melalui pemungutan suara.

### Membuat papan

Untuk membuat papan baru, Anda perlu menjalankan `bitsocial-cli` sebagai node peer-to-peer. Hal ini memastikan forum Anda dihosting secara terdesentralisasi tanpa bergantung pada server pusat mana pun.

### Tugas direktori

Penetapan slot direktori (papan mana yang muncul di jalur mana) saat ini dikelola melalui permintaan penarikan GitHub ke file `5chan-directories.json`. Ini adalah proses sementara — rilis mendatang akan mendukung pembuatan papan dalam aplikasi dan pemungutan suara berbasis pubsub untuk menangani penetapan direktori secara otomatis.

## Internal

Di balik terpalnya, 5chan menggunakan lapisan klien protokol Bitsocial bersama untuk interaksi jaringannya. Aplikasi web di 5chan.app juga dapat menjalankan node Helia di browser ketika P2P browser diaktifkan dari Pengaturan Lanjutan, sehingga pembaca dapat memuat dari rekan-rekan tanpa gateway IPFS terpusat. Lihat bagian P2P browser di catatan protokol peer-to-peer.

## Tautan

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lisensi**: Khusus GPL-2.0
