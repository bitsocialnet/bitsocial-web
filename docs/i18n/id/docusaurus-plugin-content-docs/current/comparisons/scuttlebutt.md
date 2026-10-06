---
title: Bitsocial dan Secure Scuttlebutt
description: Perbandingan Secure Scuttlebutt (SSB) dan aplikasinya, Manyverse, dengan Bitsocial, mulai dari feed append-only dan replikasi berdasarkan graf follow hingga komunitas, pengendalian spam, dan sinkronisasi offline.
---

# Bitsocial dan Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) adalah protokol sosial peer-to-peer yang dibuat
oleh Dominic Tarr pada 2014. [Manyverse](https://www.manyver.se/) adalah aplikasinya yang paling
dikenal, tersedia untuk Android, iOS, dan desktop; [Patchwork](https://github.com/ssbc/patchwork)
adalah klien desktop utama sebelum diarsipkan. Di antara sistem yang dibandingkan dalam dokumentasi
ini, SSB adalah yang paling dekat dengan Bitsocial secara semangat: tidak ada server di jalur data,
tidak ada blockchain, tidak ada urutan global, dan identitas memakai kunci Ed25519. Keduanya
mengambil pilihan yang berlawanan soal apa yang disimpan setiap peer dan di mana spam dihentikan.

## Cara kerja Scuttlebutt

- **Feed.** Setiap identitas adalah pasangan kunci Ed25519, yang ditulis sebagai
  `@<public key>.ed25519`. Semua yang dipublikasikan pengguna masuk ke feed miliknya sendiri, yaitu
  log append-only (hanya bisa ditambah) tempat setiap pesan bertanda tangan membawa nomor urut dan
  hash pesan sebelumnya. Menurut
  [panduan protokol](https://ssbc.github.io/scuttlebutt-protocol-guide/), pesan yang sudah diposting
  tidak bisa diubah lagi.
- **Replikasi.** Peer menyalin feed secara utuh, bukan postingan satu per satu, dan graf follow
  menentukan feed mana yang disimpan sebuah peer. Patchwork, misalnya, menampilkan feed hingga dua
  hop jauhnya dan mereplikasi feed hingga tiga hop jauhnya. Dengan epidemic broadcast trees (EBT),
  peer membandingkan nomor urut terbaru yang mereka miliki untuk setiap feed dan hanya mengirim yang
  belum ada.
- **Koneksi.** Peer melakukan autentikasi dengan secret handshake dan mengenkripsi lalu lintas
  dengan box stream. Handshake ini menggunakan pengenal jaringan sebagai kunci, sehingga peer di
  jaringan SSB terpisah yang memakai pengenal berbeda tidak bisa terhubung ke jaringan utama.
- **Menemukan peer.** Peer mengumumkan dirinya di jaringan lokal melalui broadcast UDP dan melakukan
  sinkronisasi melalui LAN; Manyverse juga melakukan sinkronisasi melalui Bluetooth. Melalui
  internet, pengguna mengandalkan **pub**, yaitu peer yang selalu online yang mem-follow balik Anda
  setelah Anda menukarkan kode undangan lalu menyimpan dan menyajikan feed Anda, serta **room**,
  yang tidak menyimpan feed tetapi meneruskan koneksi antaranggotanya melalui tunnel.
- **Blob dan pesan pribadi.** Gambar dan file lainnya adalah blob beralamat konten yang diambil dari
  peer, dengan batas ukuran bawaan 5 MB pada implementasi saat ini. Pesan pribadi dienkripsi untuk
  paling banyak tujuh penerima dan dipublikasikan sebagai ciphertext di feed penulisnya.

## Letak perbedaannya

### Apa yang disimpan sebuah peer

Peer SSB menyimpan salinan lengkap setiap feed dalam jangkauan replikasinya, mulai dari pesan
pertama tiap feed, dan menyajikan feed tersebut kepada pihak lain. Itulah yang membuat SSB bisa
bekerja secara offline, tetapi kebutuhan penyimpanan bertambah seiring setiap pesan dalam jangkauan,
dan instalasi baru harus mengunduh feed-feed itu sebelum bisa menampilkan banyak hal. Klien
Bitsocial mengambil status terbaru dari komunitas yang dibukanya dari node komunitas dan dari peer
yang men-seed komunitas itu, dan jaringan hanya menyimpan status terbaru tersebut. Lihat
[Protokol Peer-to-Peer](/peer-to-peer-protocol/).

### Penghapusan dan perangkat

Karena feed adalah rantai hash, SSB tidak punya penghapusan di seluruh jaringan: sebuah peer bisa
membuang pesan dari basis datanya sendiri tetapi tidak bisa menariknya kembali dari salinan milik
peer lain. Memposting dengan kunci yang sama dari dua perangkat, atau dari cadangan yang dipulihkan,
membuat feed bercabang (fork), sehingga solusi yang lazim adalah satu identitas per perangkat. PZP,
protokol penerus dari tim Manyverse, mencantumkan penghapusan, banyak perangkat per akun, dan feed
yang tahan terhadap fork sebagai beberapa perubahan utamanya dari SSB
([postingan peluncuran](https://www.manyver.se/blog/2024-07-03/)). Node komunitas Bitsocial
mempublikasikan versi baru status komunitas pada setiap pembaruan, sehingga konten yang dihapus
moderatornya hilang dari status terbaru.

### Siapa yang bisa Anda dengar

Jangkauan replikasi SSB sekaligus berfungsi sebagai filter spamnya. Feed orang asing hanya sampai
kepada Anda jika ada seseorang dalam jangkauan hop Anda yang mem-follow-nya, dan memblokir sebuah
feed membuat node Anda berhenti mereplikasinya. Spam tetap di luar, tetapi begitu pula pendatang
baru, sampai ada yang mem-follow mereka. Bitsocial membiarkan siapa pun memposting ke sebuah
komunitas, dan node komunitas memutuskan melalui tantangannya apakah sebuah postingan diterima.
Lihat [Tantangan Anti-Spam Khusus](/custom-challenges/).

### Komunitas

SSB tidak punya objek komunitas. Channel dan hashtag adalah label pada postingan individual, balasan
dalam sebuah thread berada di feed masing-masing penulisnya, dan seberapa banyak thread yang Anda
lihat bergantung pada feed mana saja yang dimiliki node Anda. Room bisa memiliki moderator dan
daftar anggota, tetapi mereka mengendalikan siapa yang boleh terhubung melalui room tersebut, bukan
apa yang dipublikasikan. Komunitas Bitsocial adalah objek kelas satu dengan pasangan kunci, aturan,
moderator, dan tantangannya sendiri.

### Infrastruktur

Keduanya menjauhkan server dari jalur data, dan keduanya mengandalkan pembantu. Pub adalah hal yang
paling mendekati layanan yang di-host di SSB: pub menyimpan dan menyajikan feed semua orang yang
mereka follow. Room lebih mirip router HTTP Bitsocial karena keduanya tidak menyimpan konten, tetapi
room meneruskan koneksi antaranggotanya, sedangkan router hanya mengembalikan alamat penyedia dan
tidak berperan dalam transfer. Seperti peer SSB, node komunitas Bitsocial berjalan di perangkat
keras konsumen, dan node itu harus online untuk menerima postingan baru.

### Offline dan jaringan lokal

Di sinilah SSB lebih unggul. Dua peer SSB di jaringan Wi-Fi yang sama, atau melalui Bluetooth di
Manyverse, bisa melakukan sinkronisasi tanpa koneksi internet, dan semua yang sudah direplikasi
tetap bisa dibaca secara offline. Tujuan utama yang dinyatakan Manyverse adalah membuat jejaring
sosial tidak bergantung pada konektivitas internet. Bitsocial membutuhkan koneksi internet untuk
menemukan peer dan untuk mempublikasikan.

### Browser

Aplikasi SSB utama menyertakan node SSB lengkap: Manyverse membundel satu node di aplikasi seluler
dan desktopnya. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) menjalankan SSB di
dalam browser dengan replikasi parsial dan koneksi melalui room, dan diarsipkan pada 2022. Aplikasi
Bitsocial menjalankan node peer-to-peer di dalam tab browser biasa. Lihat
[Peer-to-Peer di Browser](/browser-p2p/).

### Pesan pribadi

SSB memiliki pesan pribadi terenkripsi bawaan. Bitsocial berfokus pada komunitas publik dan belum
punya pesan langsung bawaan.

## Status proyek

André Staltz, yang membangun Manyverse, mundur dari SSB, Manyverse, dan penerus yang mereka
rencanakan pada April 2024 ([pembaruan terakhirnya](https://www.manyver.se/blog/2024-04-05/)). Pada
Juli 2024, Jacob Karlsson meluncurkan penerus itu sebagai [PZP](https://pzp.wiki/) dan menulis bahwa
ia tidak akan lagi mengerjakan Manyverse dan tidak tahu ada orang lain yang berencana melakukannya.
Pada Oktober 2026, repositori PZP di [Codeberg](https://codeberg.org/pzp) tidak mendapat pembaruan
apa pun setelah Desember 2024. Repositori Patchwork telah diarsipkan dengan v3.18.1 sebagai rilis
terakhirnya, dan tim di balik Planetary, aplikasi SSB untuk iOS, beralih ke Nostr dengan aplikasi
Nos mereka pada 2023. Jaringan SSB masih berjalan di atas peer dan pub yang dijaga tetap online oleh
orang-orang, tetapi aplikasi utamanya tidak lagi dikembangkan.

## Perbandingan

| Pertanyaan                | Secure Scuttlebutt                                                                                                  | Bitsocial                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Kategori                  | Protokol gossip peer-to-peer                                                                                        | Jaringan komunitas peer-to-peer                                                                  |
| Identitas                 | Satu pasangan kunci Ed25519 per perangkat                                                                           | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                              |
| Tempat postingan disimpan | Feed append-only milik penulis, yang disalin oleh setiap peer yang mereplikasinya                                   | Node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu                        |
| Apa yang disimpan peer    | Riwayat lengkap setiap feed dalam jangkauan follow-nya                                                              | Status terbaru dari komunitas yang dibaca atau di-seed-nya                                       |
| Komunitas                 | Tidak ada objek komunitas; channel dan hashtag melabeli postingan                                                   | Objek kelas satu yang node-nya menerima atau menolak postingan                                   |
| Pengendalian spam         | Jangkauan replikasi berdasarkan graf follow, serta blokir                                                           | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                              |
| Moderasi                  | Follow dan blokir masing-masing pengguna                                                                            | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan                 |
| Server pembantu           | Pub menyimpan dan menyajikan feed; room meneruskan koneksi melalui tunnel                                           | Router HTTP mengembalikan peer penyedia dan tidak menyimpan konten                               |
| Offline                   | Sinkronisasi LAN dan Bluetooth tanpa internet                                                                       | Membutuhkan koneksi internet                                                                     |
| Browser                   | Aplikasi membundel node SSB lengkap                                                                                 | Node peer-to-peer di dalam tab browser biasa                                                     |
| Jaringan                  | Masih berjalan, tetapi aplikasi utamanya tidak lagi dikembangkan                                                    | Jaringan aktif dengan aplikasi seperti [5chan](/apps/5chan/) dan [Seedit](/apps/seedit/)         |
| Konsekuensi utama         | Bekerja offline dan tidak butuh hosting, tetapi feed terus bertambah tanpa batas dan orang asing tetap tak terlihat | Publikasi terbuka dan dukungan browser, tetapi butuh internet dan hanya menyimpan status terbaru |
