---
title: Seedit
description: Forum bergaya Reddit terdesentralisasi dan tanpa server yang dibangun di atas protokol Bitsocial tempat siapa pun dapat membuat dan memiliki komunitas.
sidebar_position: 2
---

# Seedit

Seedit adalah alternatif tanpa server, tanpa admin, dan terdesentralisasi sepenuhnya untuk Reddit gaya lama, yang dibangun di atas protokol Bitsocial. Hal ini memberi pengguna kepemilikan penuh atas komunitas mereka — siapa pun dapat membuatnya, dan beberapa komunitas dapat bersaing memperebutkan rute pendek yang sama, seperti `/s/funny`.

## Unduhan

| Platform  | Link                                                   |
| --------- | ------------------------------------------------------ |
| jaring    | [seedit.app](https://seedit.app)                       |
| Web (ENS) | `seedit.eth` melalui browser Brave atau IPFS Companion |
| Desktop   | Tersedia untuk Mac, Windows, dan Linux                 |
| Seluler   | Tersedia untuk Android                                 |

## Bagaimana komunitas bekerja

Seedit mengatur konten ke dalam komunitas yang mirip dengan subreddits. Setiap komunitas dimiliki oleh penciptanya dan beroperasi tanpa administrasi terpusat. Beberapa komunitas dapat bersaing memperebutkan rute [direktori](/directories/) yang sama, seperti `/s/funny`, yang membuka pemenang saat ini. Langganan dan tautan postingan selalu mengarah ke alamat persis komunitas.

### Menciptakan komunitas

Ada dua cara untuk membuat komunitas baru:

1. **Klien desktop** — Gunakan GUI bawaan di aplikasi desktop untuk menyiapkan dan mengonfigurasi komunitas Anda.
2. **bitsocial-cli** — Jalankan alat CLI untuk membuat dan mengelola komunitas dari baris perintah.

### Daftar komunitas default

Akun baru otomatis berlangganan ke daftar default berisi komunitas tertentu yang ditetapkan di `seedit-default-subscriptions.json` dalam repositori [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Kandidat direktori dicantumkan dalam berkas `seedit-directories/seedit-<code>-directory.json` di repositori yang sama. Untuk menambahkan komunitas Anda ke salah satu daftar tersebut, kirimkan pull request dengan detail komunitas Anda.

## Tautan

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Lisensi**: Khusus GPL-2.0
