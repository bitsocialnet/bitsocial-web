---
title: Bitsocial dan Nostr
description: Perbandingan model berbasis relay milik Nostr dengan komunitas peer-to-peer Bitsocial, mulai dari jalur data dan identitas hingga grup, pengendalian spam, dan moderasi.
---

# Bitsocial dan Nostr

Nostr tidak masuk rapi ke kategori federasi maupun blockchain. Pengguna tidak diberi akun oleh
instance, dan tidak ada rantai, konsensus, gas, maupun urutan global. Nostr lebih tepat disebut
**media sosial berbasis relay**: pengguna memegang pasangan kunci, menandatangani event, lalu
mempublikasikannya ke relay, yaitu server biasa yang menyimpan dan menyajikan event tersebut
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)).
[README](https://github.com/nostr-protocol/nostr) Nostr sendiri menyatakan bahwa Nostr tidak
mengandalkan teknik peer-to-peer.

Hal itu menempatkan Nostr lebih dekat ke Bitsocial daripada sistem federasi atau blockchain dalam
satu hal penting: identitasnya kriptografis dan bisa dibawa pindah. Perbedaannya ada di lapisan data
dan di tangan siapa gerbangnya dipegang.

## Cara kerja Nostr

- **Event dan relay.** Setiap postingan, profil, atau reaksi adalah event JSON bertanda tangan.
  Klien mempublikasikan event ke relay melalui WebSocket dan berlangganan dengan filter; relay
  menyimpan event dan menyajikannya kembali. Relay tidak saling berkomunikasi.
- **Replikasi.** Pengguna biasanya mempublikasikan ke beberapa relay. Sebuah studi pada 2023
  terhadap 712 relay menemukan bahwa rata-rata satu postingan ada di 34,6 relay
  ([Wei dan Tyson](https://arxiv.org/abs/2402.05709)).
- **Menemukan postingan seseorang.** Pengguna mempublikasikan daftar relay tempat mereka menulis dan
  membaca ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), dan klien mengambil
  postingan seorang pengguna dari relay tulis milik pengguna tersebut.
- **Identitas.** Setiap pengguna adalah sebuah kunci secp256k1 yang menandatangani dengan tanda
  tangan Schnorr. Spesifikasinya tidak mendefinisikan rotasi atau pemulihan kunci, jadi kehilangan
  kunci berarti kehilangan akun. Pengenal opsional `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) diperiksa terhadap sebuah
  file di server web domain tersebut.
- **Grup.** Mekanisme komunitas yang direkomendasikan adalah grup berbasis relay
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): sebuah relay menampung grup,
  menegakkan aturan keanggotaan dan aturan posting grup itu sebelum menerima postingan, serta
  menandatangani metadatanya. Komunitas dengan persetujuan moderator yang lebih lama
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) kini ditandai tidak
  direkomendasikan dan digantikan NIP-29.
- **Pengendalian spam.** Setiap relay memilih gerbangnya sendiri: proof of work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autentikasi dan allowlist
  ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), pembayaran, atau batas laju.
  Klien menambahkan daftar bisu dan skor kepercayaan.
- **Media.** Gambar dan video diunggah ke server file HTTP terpisah.

## Letak perbedaannya

### Siapa yang menyimpan dan menyajikan postingan

Di Nostr, relay adalah lapisan penyimpanan dan pengiriman: sebuah server harus menjaga setiap
postingan tetap online. Di Bitsocial, router HTTP hanya membantu klien menemukan peer. Router tidak
menyimpan postingan, profil, metadata komunitas, atau status moderasi; klien mengambil konten dari
node komunitas dan dari peer yang men-seed komunitas itu. Lihat
[Protokol Peer-to-Peer](/peer-to-peer-protocol/).

### Siapa yang memegang gerbang

Gerbang tulis di Nostr dipegang operator relay. Di luar grup NIP-29, kunci yang ditolak oleh satu
relay bisa mempublikasikan event yang sama ke relay mana pun yang mau menerimanya, dan apa yang
dilihat pembaca bergantung pada relay mana yang dibaca klien mereka. Grup NIP-29 lebih mirip
komunitas Bitsocial: relay yang menampungnya menerima atau menolak postingan. Namun relay tetap
menentukan apa yang boleh dilakukan peran-peran dalam grup, dan riwayat grup tetap terikat pada
relay itu kecuali ada relay lain yang bersedia mengambil alih.

Di Bitsocial, komunitas adalah objek kriptografis dengan pasangan kuncinya sendiri. Node komunitas
menjalankan tantangan apa pun yang dipilih pemiliknya dan mempublikasikan status yang diterima ke
jaringan peer-to-peer. Lihat [Tantangan Anti-Spam Khusus](/custom-challenges/).

### Menjalankan infrastruktur

Relay adalah server dengan domain dan endpoint WebSocket, dan relay populer menanggung biaya
penyimpanan dan bandwidth untuk apa yang mereka sajikan. Studi tahun 2023 tadi memperkirakan sekitar
95% relay gratis tidak bisa menutup biayanya dari donasi. Node komunitas Bitsocial berjalan di
perangkat keras konsumen, dan peer yang membaca sebuah komunitas bisa ikut membagikannya.

### Browser

Klien web Nostr membuka koneksi WebSocket langsung ke relay, jadi tidak perlu server aplikasi.
Aplikasi web Bitsocial menjalankan node peer-to-peer di dalam tab dan mengambil konten dari peer.
Lihat [Peer-to-Peer di Browser](/browser-p2p/).

### Konten lama

Postingan Nostr direplikasi secara luas di berbagai relay, sehingga postingan lama lebih mungkin
bertahan. Bitsocial menyimpan status komunitas terbaru dan tidak menjamin konten lama tersedia
selamanya.

## Perbandingan

| Pertanyaan                   | Nostr                                                                                                    | Bitsocial                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Kategori                     | Protokol berbasis relay                                                                                  | Jaringan komunitas peer-to-peer                                                            |
| Identitas                    | Kunci pengguna secp256k1, tanpa rotasi dalam spesifikasi                                                 | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                        |
| Tempat postingan disimpan    | Relay yang dipilih penulis, sering kali banyak                                                           | Node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu                  |
| Siapa yang menjaganya online | Operator relay                                                                                           | Node pemilik komunitas plus seeder pembantu                                                |
| Komunitas                    | Grup yang ditampung relay (NIP-29)                                                                       | Objek kelas satu yang node-nya menerima atau menolak postingan                             |
| Pengendalian spam            | Kebijakan tiap relay: proof of work, autentikasi, pembayaran, allowlist, batas laju                      | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                        |
| Moderasi                     | Kebijakan relay, daftar bisu klien, label, dan laporan                                                   | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan           |
| Nama                         | Pengenal opsional `name@domain` yang diperiksa lewat HTTPS                                               | Nama `.bso` dan `.eth` yang diresolusi menjadi kunci                                       |
| Browser                      | Klien WebSocket bagi relay                                                                               | Node peer-to-peer di dalam tab browser biasa                                               |
| Konsekuensi utama            | Identitas bisa dibawa pindah dan replikasi luas, tetapi ketersediaan dan kebijakan bergantung pada relay | Ketergantungan pada relay lebih kecil, tetapi konten lama tidak dijamin tersedia selamanya |
