---
title: Bitsocial dan ActivityPub
description: Perbandingan Fediverse, dengan Mastodon untuk mikroblog dan Lemmy untuk komunitas bergaya Reddit, dengan komunitas peer-to-peer Bitsocial.
---

# Bitsocial dan ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) adalah standar W3C di balik Fediverse. Pengguna
memilih sebuah server, yang disebut instance, untuk menampung akun mereka, dan server-server saling
bertukar postingan. [Mastodon](https://joinmastodon.org/) adalah perangkat lunak mikroblognya yang
paling dikenal; [Lemmy](https://join-lemmy.org/) adalah agregator tautan dan forum bergaya Reddit
yang tersusun dari komunitas-komunitas bertopik, sehingga Lemmy menjadi padanan terdekat di
Fediverse bagi aplikasi Bitsocial seperti [Seedit](/apps/seedit/).

## Cara kerja ActivityPub

- **Inbox dan outbox.** Setiap akun punya inbox dan outbox. Server mengirimkan aktivitas ke inbox di
  server lain, dan setiap server penerima menyimpan salinannya sendiri atas apa yang diikuti
  penggunanya.
- **Identitas milik server.** ID akun dan postingan adalah alamat HTTPS di domain server asal.
  Handle Mastodon berbentuk `@user@domain`, diresolusi dengan WebFinger, dan server menandatangani
  pesan federasi atas nama pengguna.
- **Klien.** Aplikasi dan browser hanya berkomunikasi dengan server milik pengguna sendiri, melalui
  API server tersebut.
- **Komunitas Lemmy.** Sebuah komunitas adalah aktor grup yang ditampung di satu instance. Pengguna
  mengirim postingan ke komunitas, yang lalu menyiarkannya ulang ke para pengikutnya; menurut
  standar forum bersama
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)), sebuah
  komunitas boleh memvalidasi postingan terlebih dahulu, bahkan sampai persetujuan manual oleh
  moderator.
- **Moderasi.** Moderasi bersifat lokal di setiap server. Admin bisa menangguhkan akun, memblokir
  seluruh server, atau hanya berfederasi dengan server dalam allowlist; Lemmy juga punya moderator
  untuk setiap komunitas.
- **Pengendalian spam.** ActivityPub tidak mendefinisikan mekanisme anti-spam apa pun. Mastodon dan
  Lemmy menyaring pendaftaran dengan persetujuan, undangan, pertanyaan pendaftaran, captcha, dan
  pemeriksaan email, lalu mengandalkan batas laju, laporan, dan moderasi.

## Letak perbedaannya

### Identitas milik sebuah domain

Akun Fediverse dimiliki oleh domain servernya. Mastodon bisa mengalihkan pengikut ke akun baru,
tetapi [postingan tidak ikut pindah](https://docs.joinmastodon.org/user/moving/), perpindahan harus
dimulai dari server lama, dan ada masa tunggu 30 hari. Di Bitsocial, profil dan komunitas adalah
pasangan kunci, jadi berganti host atau aplikasi tidak mengubah identitas. Lihat
[Identitas dan Kepemilikan Komunitas](/identity-and-ownership/).

### Tempat sebuah komunitas berada

Secara struktur, komunitas Lemmy mirip dengan komunitas Bitsocial: postingan dikirim ke komunitas,
yang bisa memeriksanya sebelum menyiarkannya ulang. Perbedaannya ada pada tempat komunitas itu
berada. Komunitas Lemmy hanya bisa dibuat di instance asal pembuatnya, admin instance memiliki
[kendali penuh](https://join-lemmy.org/docs/users/05-censorship-resistance.html) atasnya, dan tidak
ada cara terdokumentasi untuk memindahkannya ke instance lain. Komunitas Bitsocial adalah pasangan
kuncinya sendiri: pemiliknya bisa menjalankan node komunitas itu di mana saja, dan tidak ada admin
server di atasnya.

### Pengendalian spam

Server Fediverse sebagian besar menghentikan spam saat pendaftaran dan memoderasi sesudahnya.
Komunitas Bitsocial menjalankan tantangan pada setiap postingan sebelum menerimanya, dan setiap
komunitas memilih tantangannya sendiri: captcha, allowlist, pembayaran, atau kode lain apa pun.
Lihat [Tantangan Anti-Spam Khusus](/custom-challenges/).

### Menjalankan infrastruktur

Menjalankan instance berarti menyediakan server yang selalu menyala dengan domain, TLS, dan email.
Mastodon juga membutuhkan PostgreSQL, Redis, dan worker latar belakang; Lemmy lebih ringan, sekitar
150 MB RAM menurut angkanya sendiri. Setiap instance menyimpan salinan konten jarak jauh yang
diikuti penggunanya. Node komunitas Bitsocial tidak memerlukan domain atau sertifikat dan berjalan
dari aplikasi desktop atau `bitsocial-cli`.

### Apa yang diberikan server sebagai gantinya

Server Fediverse menyimpan riwayat lengkap dan menyajikannya dengan andal, dan Mastodon punya alat
moderasi matang yang dibangun selama bertahun-tahun. Bitsocial tidak menjamin konten lama tersedia
selamanya, dan alat moderasinya ada di masing-masing aplikasi.

## Perbandingan

| Pertanyaan                   | ActivityPub (Mastodon, Lemmy)                                                     | Bitsocial                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Kategori                     | Server federasi                                                                   | Jaringan komunitas peer-to-peer                                                     |
| Identitas                    | Akun di domain sebuah server, ditandatangani oleh server                          | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                 |
| Tempat postingan disimpan    | Server asal, ditambah salinan di setiap server yang mengikuti                     | Node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu           |
| Siapa yang menjaganya online | Admin instance                                                                    | Node pemilik komunitas plus seeder pembantu                                         |
| Komunitas                    | Komunitas Lemmy yang ditampung di satu instance                                   | Objek kelas satu yang node-nya menerima atau menolak postingan                      |
| Pengendalian spam            | Penyaringan pendaftaran, batas laju, laporan, dan moderasi                        | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                 |
| Moderasi                     | Admin server dan moderator komunitas, lokal di setiap server                      | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan    |
| Nama                         | Handle `@user@domain` dan `!community@domain`                                     | Nama `.bso` dan `.eth` yang diresolusi menjadi kunci                                |
| Browser                      | Klien bagi server milik pengguna                                                  | Node peer-to-peer di dalam tab browser biasa                                        |
| Konsekuensi utama            | Riwayat andal dan moderasi matang, tetapi identitas dan komunitas dimiliki server | Tidak perlu server atau domain, tetapi konten lama tidak dijamin tersedia selamanya |
