---
title: Peer-to-Peer di Browser
description: Bagaimana aplikasi web Bitsocial menjalankan node libp2p sungguhan di dalam tab browser, transport apa saja yang dipakainya, dan perbaikan upstream 2026 yang akhirnya membuat penerbitan dari tab berfungsi.
---

# Peer-to-Peer di Browser

Aplikasi web Bitsocial tidak harus menjadi klien dari server milik orang lain. Aplikasi itu bisa
menjalankan node [Helia](https://helia.io/) di dalam tab browser, bergabung ke jaringan peer-to-peer
yang sama dengan node desktop dan CLI, mengambil konten komunitas dari peer lain, dan menerbitkan
lewat pubsub.

Halaman ini menjelaskan apa arti sebenarnya dari hal itu, transport apa yang dipakainya, apa yang
masih belum bisa dilakukannya, dan mengapa penerbitan dari tab baru mulai berfungsi pada 2026.

Untuk desain jaringan yang lebih luas, lihat [Protokol Peer-to-Peer](/peer-to-peer-protocol/).

## Apa yang berjalan di dalam tab

Ketika P2P browser aktif, halaman tersebut menjalankan node libp2p sungguhan:

- ia menghubungi peer lain lewat WebSockets aman
- ia mengambil dan memverifikasi konten komunitas dari peer tersebut, bukan dari gateway IPFS
- ia ikut serta dalam gossipsub, sehingga menerbitkan sebuah postingan tidak memerlukan penyedia
  pubsub yang dihosting
- ia memakai tumpukan klien protokol yang sama (`pkc-js`) dengan semua aplikasi Bitsocial lainnya

Konsekuensi praktisnya, tidak ada operator gateway yang berdiri di antara pembaca web dan sebuah
komunitas. Tidak ada satu endpoint HTTPS tunggal yang bisa ditekan agar menjatuhkan sebuah komunitas
bagi seluruh pengguna browser sekaligus.

## Bagaimana node browser terhubung

`pkc-js` menghubungi peer lewat **WebSockets aman**. Dial WebRTC dan WebTransport ditolak secara
bawaan melalui sebuah connection gater, karena di dalam browser keduanya menambah jalur pembentukan
koneksi yang panjang dan sering gagal — negosiasi STUN/ICE, rotasi certhash — sehingga memperlambat
pemuatan halaman, sementara WebSocket memberi transport yang langsung dan andal. Pemanggil yang
memang menginginkan WebRTC atau WebTransport dapat menimpa gater tersebut lewat
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Konsekuensi praktisnya, sebuah peer browser terhubung ke node yang mengekspos endpoint WSS, dan itu
berarti node tersebut membutuhkan domain serta sertifikat yang ditandatangani CA. Peer di balik
koneksi rumahan tanpa keduanya dijangkau secara tidak langsung, bukan dihubungi langsung dari tab.

## Mengapa penerbitan dari browser baru mulai berfungsi pada 2026

Peer-to-peer di browser bukan ide baru. Yang berubah pada 2026 adalah _postingan_ dari node browser
kini benar-benar sampai ke seluruh jaringan.

Spesifikasi pubsub libp2p mengharuskan `seqno` sebuah pesan berupa bilangan bulat 64-bit big-endian
yang naik secara linear. `js-libp2p-gossipsub` justru menghasilkan 8 byte acak, sedangkan
go-libp2p-pubsub dan rust-libp2p sama-sama memakai penghitung. Kubo 0.40+ mengaktifkan
`BasicSeqnoValidator` secara bawaan, yang menolak setiap pesan dengan seqno yang tidak lebih besar
dari nilai tertinggi yang pernah dilihat dari peer tersebut.

Akibatnya, sebagian besar pesan yang diterbitkan node JavaScript — termasuk node browser — dibuang
diam-diam oleh peer Kubo. Sebuah reproduksi mengukur hanya 2 sampai 8 dari 30 pesan yang sampai.

Masalah ini didiagnosis di
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) dan diperbaiki
di **`@libp2p/gossipsub` 15.0.21** pada Mei 2026. Sebelum perbaikan itu mendarat, node browser bisa
terhubung dan membaca, tetapi postingannya sebagian besar lenyap dalam perjalanan menuju peer Go.
`pkc-js` menyertakan `@libp2p/gossipsub` 16.0.4, yang sudah melewati perbaikan tersebut.

## Apa yang masih belum bisa dilakukan node browser

Node browser adalah peer sungguhan, bukan server. Batasnya berbeda dari node desktop atau node yang
selalu aktif:

- biasanya ia tidak bisa menerima koneksi masuk sembarangan dari internet publik
- ia hanya bekerja selama tab terbuka, jadi ia bukan host jangka panjang untuk data sebuah komunitas
- ia tidak bisa bergabung ke DHT libp2p, dan karena itulah penemuan berjalan lewat router HTTP
- ia kurang cocok untuk seeding dalam skala besar

Hosting komunitas secara penuh tetap paling baik ditangani oleh aplikasi desktop, `bitsocial-cli`,
atau node lain yang selalu aktif. P2P browser mengubah siapa yang bisa _membaca dan memposting_ tanpa
gateway; ia tidak menghapus kebutuhan akan peer yang tetap online.

## Router HTTP bukanlah gateway

Klien browser tetap menanyai [router HTTP](/peer-to-peer-protocol/#public-key-based-addressing) untuk
mengetahui peer mana yang saat ini menyediakan alamat sebuah komunitas. Inilah catatan kaki jujur di
balik "peer-to-peer murni di browser," dan hal itu layak dijelaskan dengan tepat:

- sebuah router hanya menyimpan alamat peer untuk sebuah alamat konten
- ia tidak menyimpan, menyajikan, atau bahkan mengetahui konten komunitas tersebut
- klien menanyai beberapa router secara paralel lalu menggabungkan hasilnya
- siapa pun bisa menjalankannya, dan mengganti router hanyalah perubahan konfigurasi tanpa migrasi
  data

Setelah tahap penemuan, transfer konten dan lalu lintas pubsub bergerak secara peer-to-peer. Router
yang menghilang membuat Anda kehilangan satu jalur pencarian, bukan data Anda. Sebaliknya, gateway
IPFS justru berada di jalur konten.

## Di mana ini sudah berjalan hari ini

- [5chan](/apps/5chan/) menjalankan P2P browser murni secara bawaan pada aplikasi webnya di
  [5chan.app](https://5chan.app).

## Fallback gateway

Akses lewat gateway tetap tersedia sebagai jalur kompatibilitas untuk browser atau jaringan yang
tidak bisa bergabung secara langsung. Lihat [Fallback gateway](/peer-to-peer-protocol/#gateway-fallback).
Arsitektur yang dituju adalah P2P browser lebih dulu, dengan gateway sebagai cadangan opsional, bukan
sebagai bottleneck bawaan.
