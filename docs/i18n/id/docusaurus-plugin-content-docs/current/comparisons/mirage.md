---
title: Bitsocial dan Mirage
description: Perbandingan Mirage, forum bergaya Reddit di blockchain Cosmos SDK miliknya sendiri, dengan Bitsocial dan aplikasi bergaya Reddit-nya, Seedit.
---

# Bitsocial dan Mirage

[Mirage](https://mirage.foundation/) adalah jaringan diskusi bergaya Reddit dengan komunitas,
postingan berutas, dan vote. Alih-alih basis data perusahaan, Mirage berjalan di blockchain-nya
sendiri, rantai Cosmos SDK dengan konsensus CometBFT. Produk Bitsocial yang paling mirip adalah
[Seedit](/apps/seedit/), aplikasi bergaya Reddit di jaringan Bitsocial, jadi perbandingan ini
sebagian besar menyangkut cara masing-masing menampung, memiliki, dan memoderasi komunitas.

## Cara kerja Mirage

- **Node.** Sebuah node Mirage adalah satu container Docker yang berisi validator, basis data
  PostgreSQL, indexer, API HTTP, dan frontend web. Setiap node juga merupakan validator. Menurut
  [panduan deploy](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md),
  menjalankannya memerlukan server Ubuntu di amd64 dan 10.000.000 token MIRAGE di akun operator.
- **Memposting.** Browser menandatangani setiap tindakan dengan kunci secp256k1 milik pengguna, dan
  pengguna gratis juga menghitung proof of work kecil. Node membungkus tindakan itu dalam transaksi
  rantai dan membayar biayanya.
- **Membaca.** Indexer setiap node menyalin data rantai ke basis datanya sendiri dan menyajikan feed
  melalui API HTTP. Node menyimpan blok selama sekitar seminggu, jadi riwayat postingan jangka
  panjang berada di basis data masing-masing node, dan node baru mulai tanpa riwayat sebelum titik
  sinkronisasinya.
- **Akun.** Sebuah akun adalah kunci yang diturunkan dari seed phrase 12 kata, dan seed yang sama
  berfungsi di node mana pun. Nama pengguna dicatat di rantai dan unik di seluruh jaringan.
- **Komunitas.** Setiap nama yang valid sudah merupakan komunitas, dan tidak ada yang memilikinya.
  Tim kurator berbayar yang masing-masing beranggotakan hingga sepuluh pengguna memelihara tampilan
  termoderasi sebuah komunitas; pembaca memilih tampilan sebuah tim, tampilan bawaan node, atau
  tampilan tanpa sensor. Lihat [FAQ Mirage](https://mirage.talk/faq).
- **Token.** Token MIRAGE membayar langganan, memberi imbalan kepada penulis dan node, serta memberi
  validator bobot dalam tata kelola. Pelanggan melewati proof of work dan mendapat batas yang lebih
  tinggi.

## Letak perbedaannya

### Siapa yang memiliki komunitas

Di Seedit, pembuat komunitas memegang pasangan kunci komunitas itu, menjalankan atau mendelegasikan
node-nya, dan memoderasinya. Di Mirage, tidak ada yang memiliki komunitas: tim-tim kurator yang
bersaing menawarkan tampilan termoderasi untuk nama yang sama, dan tampilan bawaannya adalah tim
yang dipilih oleh pelanggan berbayar terbanyak.

### Pengendalian spam

Mirage menerapkan satu aturan untuk seluruh jaringan: pengguna gratis membayar dengan proof of work
yang tingkat kesulitannya menyesuaikan volume yang masuk, dan pelanggan melewatinya. Di Bitsocial,
setiap komunitas memilih tantangannya sendiri, mulai dari captcha, allowlist, hingga pembayaran.
Lihat [Tantangan Anti-Spam Khusus](/custom-challenges/).

### Infrastruktur

Mirage membutuhkan blockchain. Validator mencapai konsensus atas setiap tindakan, dan setiap node
menjalankan tumpukan server lengkap serta harus memegang stake token yang besar. Bitsocial tidak
punya rantai: node komunitas berjalan di perangkat keras konsumen dari aplikasi desktop atau
`bitsocial-cli`, dan pembaca bisa ikut membagikan konten.

### Kendali atas seluruh jaringan

Mirage punya tata kelola onchain yang dibobot berdasarkan stake validator. Tata kelola itu bisa
mengubah tingkat kesulitan, harga, dan emisi token, mencetak atau membakar token, serta menunjuk
admin yang penghapusannya diterapkan indexer referensi pada postingan apa pun. Kode rantainya juga
memungkinkan tata kelola
[menghapus akun](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
dan
[mengirim token dari alamat mana pun](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
Pada Oktober 2026, empat validator menghasilkan blok rantai tersebut, dan runbook milik proyek itu
sendiri mengelola keempatnya.

Bitsocial tidak punya administrator di tingkat protokol. Pemilik komunitas memoderasi komunitas
mereka sendiri dan aplikasi memilih apa yang ditampilkan. Lihat
[Moderasi Lokal, Bukan Larangan Global](/local-moderation/).

### Browser

Klien web Mirage adalah klien HTTP bagi sebuah node: browser menandatangani tindakan tetapi tidak
bergabung dengan jaringan peer-to-peer. Aplikasi Bitsocial bisa menjalankan node peer-to-peer di
dalam tab browser. Lihat [Peer-to-Peer di Browser](/browser-p2p/).

## Perbandingan

| Pertanyaan                   | Mirage                                                                                                                                        | Bitsocial                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Kategori                     | Forum di blockchain miliknya sendiri (Cosmos SDK)                                                                                             | Jaringan komunitas peer-to-peer                                                                            |
| Identitas                    | Kunci secp256k1 dari seed 12 kata, dengan nama pengguna onchain                                                                               | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                                        |
| Tempat postingan disimpan    | Transaksi rantai, lalu basis data PostgreSQL setiap node                                                                                      | Node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu                                  |
| Siapa yang menjaganya online | Node validator, masing-masing memegang 10.000.000 MIRAGE                                                                                      | Node pemilik komunitas plus seeder pembantu                                                                |
| Komunitas                    | Nama tanpa pemilik dengan tim kurator berbayar yang bersaing                                                                                  | Dimiliki oleh pasangan kunci; node pemiliknya menerima atau menolak postingan                              |
| Pengendalian spam            | Proof of work untuk seluruh jaringan; pelanggan melewatinya                                                                                   | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                                        |
| Moderasi                     | Tampilan tim kurator, filter pribadi, admin yang ditunjuk tata kelola                                                                         | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan                           |
| Ekonomi                      | Token MIRAGE untuk langganan, imbalan, dan stake validator                                                                                    | Tidak ada di dalam protokol; tantangan bisa mewajibkan pembayaran atau token                               |
| Browser                      | Klien HTTP bagi sebuah node                                                                                                                   | Node peer-to-peer di dalam tab browser biasa                                                               |
| Konsekuensi utama            | Satu status bersama yang terurut dan pendaftaran yang mudah, tetapi set validator yang kecil dan kewenangan tata kelola atas seluruh jaringan | Tidak perlu rantai atau stake, tetapi tanpa urutan global dan konten lama tidak dijamin tersedia selamanya |
