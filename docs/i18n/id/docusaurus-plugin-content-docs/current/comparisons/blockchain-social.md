---
title: Bitsocial dan Jaringan Sosial Blockchain
description: Bagaimana Lens, DeSo, dan Steem menaruh data atau aturan sosial di blockchain, dan mengapa Bitsocial tidak memakainya.
---

# Bitsocial dan Jaringan Sosial Blockchain

Lens, DeSo, dan Steem masing-masing menaruh aktivitas sosial di blockchain. Akun, follow, postingan,
atau aturan di sekitarnya menjadi transaksi yang diurutkan dan disimpan oleh validator. Bitsocial
tidak memakai blockchain: media sosial tidak membutuhkan urutan global untuk setiap postingan, jadi
Bitsocial melewatkan konsensus, gas, dan staking. Lihat
[Protokol Peer-to-Peer](/peer-to-peer-protocol/) untuk alasannya.

## Kesamaan mereka

- **Ada yang membayar setiap penulisan.** Lens mengenakan gas, yang bisa disponsori aplikasi; DeSo
  memungut biaya pada setiap tindakan; Steem menjatah tindakan berdasarkan token yang di-stake.
- **Rantai menetapkan satu kebijakan spam untuk semua orang.** Biaya, stake, dan biaya akun berlaku
  di seluruh jaringan, bukan dipilih oleh masing-masing komunitas.
- **Catatan onchain bersifat permanen.** Aplikasi bisa menyembunyikan konten, tetapi tidak bisa
  menghapusnya dari rantai.
- **Browser adalah klien API.** Aplikasi web menandatangani transaksi dan membaca melalui node,
  indexer, atau API yang dioperasikan pihak lain.

## Lens

[Lens](https://lens.xyz/) berjalan di Lens Chain, sebuah layer 2 Ethereum yang dibangun dengan ZK
Stack milik ZKsync dan memakai Avail untuk ketersediaan data. Mask Network telah
[mengelola Lens sejak Januari 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Di dalam rantai:** akun adalah smart contract, nama pengguna adalah NFT di dalam namespace, dan
  graf, grup, feed, beserta aturannya juga berupa kontrak.
- **Di luar rantai:** teks dan media sebuah postingan berada dalam file JSON di sebuah URI, biasanya
  di Grove, layanan penyimpanan Lens yang berdiri di depan IPFS. Reaksi dan bookmark dipegang oleh
  Lens API, dan aplikasi membaca melalui API tersebut.
- **Spam dan gerbang:** transaksi membutuhkan gas dalam GHO, yang bisa disponsori aplikasi dengan
  batas laju. Aturan feed dan grup bisa mewajibkan kepemilikan token atau pembayaran.
- **Operasi rantai:** [L2BEAT](https://l2beat.com/scaling/projects/lens) menilai Lens Chain sebagai
  validium Stage 0 dengan operator terpusat yang bisa menolak memasukkan transaksi.

## DeSo

[DeSo](https://docs.deso.org/) adalah blockchain layer 1 yang dibangun untuk aplikasi sosial. DeSo
beralih dari proof of work ke proof of stake pada Juli 2024.

- **Di dalam rantai:** profil, postingan, like, follow, dan pesan langsung semuanya adalah transaksi
  yang disimpan oleh setiap full node. Gambar dan video dihosting di luar rantai; node referensi
  memakai Google Cloud Storage dan Cloudflare Stream.
- **Spam:** setiap tindakan membayar biaya dalam DESO. Pengguna baru biasanya mendapat DESO awal
  dari sebuah node setelah verifikasi nomor telepon.
- **Moderasi:** setiap node memutuskan apa yang ditampilkannya dengan blacklist atau graylist,
  tetapi [konten tetap berada di rantai](https://docs.deso.org/deso-blockchain/content-moderation).
- **Komunitas:** dokumentasinya tidak menjelaskan primitif komunitas atau forum apa pun; sebuah
  "komunitas" adalah feed yang dikurasi sebuah aplikasi.
- **Menjalankan node:** menurut
  [panduan validator](https://docs.deso.org/deso-validators/run-a-validator), validator membutuhkan
  setidaknya RAM 32 GB dan disk 200 GB.

## Steem

[Steem](https://steem.com/) adalah blockchain sosial yang memberi imbalan token kepada penulis dan
kurator, dengan [Steemit](https://steemit.com/) sebagai aplikasi blog utamanya. Hive memisahkan diri
dari Steem pada 2020; menurut [whitepaper Hive](https://hive.io/whitepaper.pdf), fork itu terjadi
setelah Steemit Inc. dijual kepada Justin Sun.

- **Di dalam rantai:** postingan teks, komentar, vote, dan riwayat suntingannya, yang diurutkan oleh
  21 witness terpilih yang menghasilkan satu blok setiap tiga detik. Gambar dihosting di luar
  rantai.
- **Spam:** tindakan menghabiskan Resource Credits, yang bertambah seiring STEEM yang di-stake.
  Membuat akun memerlukan STEEM; Steemit membayarnya untuk pengguna yang memverifikasi alamat email
  dan nomor telepon.
- **Komunitas:** komunitas berupa
  [operasi khusus yang ditafsirkan oleh indexer](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  di luar konsensus. Moderator bisa membisukan postingan, yang menyembunyikannya di aplikasi tetapi
  membiarkannya tetap di rantai.
- **Imbalan:** inflasi mendanai imbalan, dan vote yang dibobot berdasarkan stake menentukan
  pembagiannya, sehingga pemegang besar membentuk apa yang mendapat perhatian.

## Perbandingan

| Pertanyaan        | Lens                                                                                         | DeSo                                                                           | Steem                                                              | Bitsocial                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Rantai            | Layer 2 Ethereum (validium ZK Stack)                                                         | Layer 1 sendiri, proof of stake                                                | Rantai sendiri, delegated proof of stake                           | Tidak ada                                                                                           |
| Konten postingan  | JSON di luar rantai, biasanya di Grove                                                       | Teks di dalam rantai; media di luar rantai                                     | Teks di dalam rantai; gambar di luar rantai                        | Di node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu                        |
| Identitas         | Akun smart contract; NFT nama pengguna                                                       | Pasangan kunci dengan profil onchain                                           | Akun rantai bernama dengan kunci berjenjang                        | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                                 |
| Komunitas         | Grup dan feed sebagai kontrak beraturan                                                      | Tidak ada primitif komunitas                                                   | Komunitas yang ditafsirkan indexer di luar konsensus               | Objek kelas satu yang node-nya menerima atau menolak postingan                                      |
| Pengendalian spam | Gas (sering disponsori), aturan token atau pembayaran                                        | Biaya pada setiap tindakan; dana awal setelah verifikasi telepon               | Resource Credits dari stake; pembuatan akun berbayar               | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                                 |
| Moderasi          | Admin grup, aturan onchain, penyembunyian di tingkat API                                     | Setiap node menyaring apa yang ditampilkannya                                  | Pembisuan komunitas, downvote berbobot stake, filter aplikasi      | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan                    |
| Menjalankannya    | Operator rantai ditambah Lens API dan Grove                                                  | Validator dengan RAM minimal 32 GB                                             | Witness terpilih ditambah node API dan indexer                     | Node komunitas di perangkat keras konsumen, ditambah seeder pembantu                                |
| Konsekuensi utama | Aturan onchain yang bisa diprogram, tetapi konten dan pembacaan bergantung pada layanan Lens | Kumpulan data terbuka, tetapi setiap tindakan berbiaya dan tersimpan selamanya | Imbalan bawaan, tetapi stake membentuk visibilitas dan tata kelola | Tanpa biaya atau stake, tetapi tanpa urutan global dan konten lama tidak dijamin tersedia selamanya |
