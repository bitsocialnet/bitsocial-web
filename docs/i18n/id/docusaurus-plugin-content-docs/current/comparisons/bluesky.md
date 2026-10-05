---
title: Bitsocial dan Bluesky
description: Perbandingan Bluesky dan AT Protocol, dengan server data pribadi, relay, dan AppView-nya, dengan komunitas peer-to-peer Bitsocial.
---

# Bitsocial dan Bluesky

[Bluesky](https://bsky.app/) adalah aplikasi mikroblog yang dibangun di atas
[AT Protocol](https://atproto.com/), protokol yang dirancang oleh Bluesky Social PBC. Protokol ini
memecah jaringan sosial menjadi layanan-layanan terpisah: server data pribadi menampung akun, relay
menggabungkannya menjadi satu aliran, dan AppView mengindeks aliran itu menjadi linimasa dan utas
yang dilihat orang. Dokumentasinya menggambarkan data akun sebagai data yang disimpan di server
host, "sebagai lawan dari model peer-to-peer" ([ikhtisar](https://atproto.com/guides/overview)).

## Cara kerja AT Protocol

- **Repositori di server.** Setiap postingan, like, atau follow adalah sebuah rekaman di repositori
  bertanda tangan milik penulisnya, yang ditampung di server data pribadi (PDS). Bluesky menjalankan
  server bawaan, dan siapa pun bisa menampung server sendiri.
- **Relay.** Relay berlangganan ke setiap PDS dan menyiarkan ulang perubahan sebagai satu aliran,
  yaitu firehose. Sejak pembaruan protokol pada 2025, relay tidak lagi mengarsipkan setiap
  repositori, sehingga biaya menjalankannya jauh lebih murah
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView.** AppView mengindeks seluruh firehose dan menyajikan linimasa, utas balasan yang
  lengkap, hitungan, dan pencarian. Inilah bagian jaringan yang paling boros sumber daya.
- **Identitas.** Sebuah akun adalah DID: biasanya `did:plc`, yang terdaftar di satu direktori
  global, atau `did:web`, yang terikat pada sebuah domain. Dokumen DID mencantumkan handle akun,
  kunci penandatanganan, dan server saat ini. PDS memegang kunci penandatanganan; `did:plc` juga
  memungkinkan pengguna memegang kunci rotasi agar bisa pindah tanpa bantuan host lama
  ([panduan identitas](https://atproto.com/guides/identity)).
- **Handle.** Handle adalah nama DNS, seperti `alice.bsky.social` atau domain milik pengguna, yang
  diverifikasi terhadap DID.
- **Moderasi.** Hosting dan jangkauan adalah lapisan yang terpisah. Siapa pun bisa menjalankan
  labeler dan pengguna bisa menumpuk beberapa labeler sekaligus
  ([panduan moderasi](https://atproto.com/guides/moderation)), tetapi aplikasi Bluesky selalu
  menerapkan moderasi Bluesky sendiri. Penulis bisa membatasi siapa yang boleh membalas postingan
  mereka dan menyembunyikan balasan.

## Letak perbedaannya

### Server atau peer

Data Bluesky berada di server: PDS menampung setiap akun, relay membawa firehose, dan AppView
menyajikan apa yang ditampilkan klien. Browser adalah klien HTTP bagi layanan-layanan itu, tidak
pernah menjadi peer. Di Bitsocial, node komunitas dan peer yang membacanya menyajikan konten, dan
aplikasi web bisa menjalankan node peer-to-peer sendiri. Lihat
[Peer-to-Peer di Browser](/browser-p2p/).

### Tampilan global atau komunitas

AT Protocol dirancang untuk satu tampilan global: AppView melihat setiap balasan, sehingga utas dan
pencarian menjadi lengkap. Bitsocial tidak punya indeks global; setiap komunitas mempublikasikan
statusnya sendiri, dan aplikasi membangun penemuan konten di atasnya. Lihat
[Penemuan Konten](/content-discovery/).

Saat ini Bluesky tidak punya objek komunitas untuk postingan publik. Pada Juni 2026 Bluesky
[mengumumkan komunitas bawaan](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k) dengan
posting yang memerlukan persetujuan di beberapa tingkat privasi; hingga Oktober 2026 fitur itu belum
diluncurkan. Di Bitsocial, komunitas adalah objek inti, dan node sebuah komunitas menerima atau
menolak postingan.

### Pengendalian spam

Bluesky menangani spam dengan batas laju di servernya, pembatasan host baru di relay, deteksi
otomatis, peninjauan manusia, dan label, dan penulis bisa membatasi balasan. Tidak ada gerbang di
tingkat komunitas yang menentukan apa yang harus dilewati sebuah postingan sebelum diterima. Di
Bitsocial, setiap komunitas memilih tantangannya sendiri. Lihat
[Tantangan Anti-Spam Khusus](/custom-challenges/).

### Siapa yang memegang kunci

Akun di server milik Bluesky sendiri masuk dengan kata sandi, dan server tersebut memegang kunci
penandatanganan akun-akun itu secara kustodial ([Kleppmann dkk.](https://arxiv.org/abs/2402.03239)).
Menurut seorang insinyur protokol Bluesky,
[sebagian besar akun tidak punya kunci rotasi yang dikendalikan secara independen](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Identitas Bitsocial adalah pasangan kunci yang dibuat dan dipegang oleh aplikasi pengguna.

### Menjalankan infrastruktur

Server pribadi itu murah: [PDS referensi](https://github.com/bluesky-social/pds) merekomendasikan
RAM 1 GB untuk hingga 20 pengguna. AppView independen untuk seluruh jaringan adalah proyek besar;
salah satu yang dibangun pada 2025
[menghabiskan sekitar US$200 per bulan](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), sebagian besar
untuk penyimpanan 16 TB. Bitsocial tidak punya indeks global yang perlu direplikasi, dan node
komunitas berjalan di perangkat keras konsumen.

## Perbandingan

| Pertanyaan                   | Bluesky (AT Protocol)                                                           | Bitsocial                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Kategori                     | Server federasi dengan indeks global                                            | Jaringan komunitas peer-to-peer                                                  |
| Identitas                    | DID, dengan kunci penandatanganan yang biasanya dipegang server                 | Pasangan kunci Ed25519 untuk pengguna dan komunitas                              |
| Tempat postingan disimpan    | Repositori penulis di server data pribadi                                       | Node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu        |
| Siapa yang menjaganya online | Host PDS, relay, dan AppView, yang secara bawaan dijalankan Bluesky             | Node pemilik komunitas plus seeder pembantu                                      |
| Komunitas                    | Belum ada untuk postingan publik (diumumkan pada 2026)                          | Objek kelas satu yang node-nya menerima atau menolak postingan                   |
| Pengendalian spam            | Batas laju server, deteksi otomatis, label, kontrol balasan                     | Tantangan masing-masing komunitas sebelum sebuah postingan diterima              |
| Moderasi                     | Labeler yang bisa ditumpuk; aplikasi Bluesky selalu menerapkan moderasi Bluesky | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan |
| Nama                         | Handle DNS yang diverifikasi terhadap DID                                       | Nama `.bso` dan `.eth` yang diresolusi menjadi kunci                             |
| Browser                      | Klien HTTP bagi PDS dan AppView                                                 | Node peer-to-peer di dalam tab browser biasa                                     |
| Konsekuensi utama            | Utas dan pencarian global yang lengkap, tetapi agregasinya butuh server berat   | Tanpa indeks global yang berat, tetapi tanpa tampilan lengkap seluruh jaringan   |
