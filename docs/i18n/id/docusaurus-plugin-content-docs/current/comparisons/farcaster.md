---
title: Bitsocial dan Farcaster
description: Perbandingan Farcaster, dengan akun onchain, sewa penyimpanan, dan jaringan validator Snapchain, dengan komunitas peer-to-peer Bitsocial.
---

# Bitsocial dan Farcaster

[Farcaster](https://docs.farcaster.xyz/) menyimpan identitas di blockchain dan data sosial di
luarnya. Akun, kunci aplikasi, dan pembayaran penyimpanan berada di kontrak di OP Mainnet, sebuah
layer 2 Ethereum. Postingan, yang disebut cast, beserta follow dan reaksi, adalah pesan bertanda
tangan yang disimpan oleh [Snapchain](https://snapchain.farcaster.xyz/), jaringan mirip blockchain
yang pada 2025 menggantikan jaringan Hub Farcaster sebelumnya.

## Cara kerja Farcaster

- **Akun.** Sebuah akun adalah Farcaster ID berupa angka yang dimiliki oleh sebuah alamat Ethereum,
  yang juga bisa menetapkan alamat pemulihan. Aplikasi memposting dengan kunci aplikasi terdelegasi
  yang terdaftar onchain; kunci aplikasi tidak bisa mengambil alih akun.
- **Sewa penyimpanan.** Setiap akun menyewa unit penyimpanan, saat ini US$0,20 per unit per tahun.
  Satu unit yang disewa sejak Juli 2025 menampung 100 cast; di luar itu, cast tertua dipangkas.
  Batas laju naik seiring penyimpanan yang disewa.
- **Snapchain.** Validator mengurutkan pesan ke dalam blok dengan konsensus bergaya Tendermint, dan
  setiap full node menyimpan data seluruh jaringan. Menurut
  [panduan node](https://snapchain.farcaster.xyz/getting-started), node membutuhkan sekitar 16 GB
  RAM dan penyimpanan 2 TB.
- **Nama.** Nama pengguna bawaan, yang disebut fname, gratis dan diterbitkan oleh server nama milik
  Farcaster sendiri, yang
  [bisa mencabutnya](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Sebagai
  gantinya, pengguna bisa memakai nama `.eth` yang terdaftar di Ethereum.
- **Kanal.** Kanal bertopik adalah fitur eksperimental di klien Farcaster. Cast di dalam kanal
  adalah data protokol, tetapi metadata kanal, follow, dan moderasinya
  [disimpan di klien](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Membaca.** Aplikasi membaca melalui node Snapchain yang mereka jalankan sendiri atau melalui
  penyedia terkelola, biasanya Neynar.

## Letak perbedaannya

### Blockchain dan validator

Farcaster bergantung pada OP Mainnet untuk akun dan pembayaran, serta pada Snapchain, jaringan mirip
blockchain, untuk mengurutkan semua data sosial. Set validator Snapchain bersifat permissioned.
Whitepaper-nya menyatakan bahwa sensor menjadi sulit dengan sekitar sepuluh validator yang tersebar
secara global; pada Oktober 2026 [daftar validatornya](https://snapchain.farcaster.xyz/validators)
lebih sedikit dari itu, dan sebagian besar kuncinya milik Neynar, yang
[mengakuisisi Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) pada Januari 2026.
Bitsocial tidak punya rantai, validator, maupun konsensus.

### Membayar untuk memposting

Setiap akun Farcaster membayar sewa penyimpanan, dan penyimpanan membatasi seberapa banyak riwayat
sebuah akun yang disimpan jaringan. Di Bitsocial, memposting tidak memakan biaya di tingkat
protokol; setiap komunitas memutuskan apakah akan mewajibkan captcha, pembayaran, token, atau hal
lain. Lihat [Tantangan Anti-Spam Khusus](/custom-challenges/).

### Komunitas

Kanal Farcaster adalah fitur klien: klien menyimpan metadatanya dan menegakkan moderasi kanal,
sehingga cast yang diblokir di sebuah kanal bisa tetap sah di jaringan dan terlihat di aplikasi
lain. Di Bitsocial, komunitas adalah objek protokol dengan pasangan kuncinya sendiri, dan node
komunitas menerima atau menolak postingan.

### Menjalankan infrastruktur

Node Farcaster menampung seluruh jaringan, jadi penyimpanannya tumbuh seiring semua aktivitas;
Farcaster memproyeksikan pertumbuhan yang mendekati kapasitas disk cloud terbesar. Node komunitas
Bitsocial hanya menampung komunitasnya sendiri dan berjalan di perangkat keras konsumen.

### Browser

Aplikasi browser Farcaster adalah klien HTTP bagi sebuah node atau penyedia. Aplikasi web Bitsocial
bisa menjalankan node peer-to-peer di dalam tab. Lihat [Peer-to-Peer di Browser](/browser-p2p/).

## Perbandingan

| Pertanyaan                   | Farcaster                                                                                 | Bitsocial                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Kategori                     | Identitas onchain dengan data sosial yang diurutkan validator                             | Jaringan komunitas peer-to-peer                                                                       |
| Identitas                    | Farcaster ID yang dimiliki alamat Ethereum, dengan kunci aplikasi terdelegasi             | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                                   |
| Tempat postingan disimpan    | Snapchain, direplikasi di setiap full node, dalam batas penyimpanan berbayar              | Node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu                             |
| Siapa yang menjaganya online | Validator Snapchain dan operator node                                                     | Node pemilik komunitas plus seeder pembantu                                                           |
| Komunitas                    | Kanal eksperimental yang dikelola klien Farcaster                                         | Objek kelas satu yang node-nya menerima atau menolak postingan                                        |
| Pengendalian spam            | Sewa penyimpanan dan batas laju, ditambah label spam di tingkat aplikasi                  | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                                   |
| Moderasi                     | Pengelola kanal di klien, filter aplikasi, risiko sensor di tingkat validator             | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan                      |
| Nama                         | Fname gratis yang bisa dicabut Farcaster, atau nama `.eth`                                | Nama `.bso` dan `.eth` yang diresolusi menjadi kunci                                                  |
| Browser                      | Klien HTTP bagi node atau penyedia                                                        | Node peer-to-peer di dalam tab browser biasa                                                          |
| Konsekuensi utama            | Satu dataset global yang konsisten, tetapi ada sewa, rantai, dan set validator yang kecil | Tanpa biaya atau rantai, tetapi tanpa dataset global dan konten lama tidak dijamin tersedia selamanya |
