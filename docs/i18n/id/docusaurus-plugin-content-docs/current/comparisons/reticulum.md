---
title: Bitsocial dan Reticulum
description: Perbandingan antara Reticulum, tumpukan jaringan kriptografis untuk LoRa dan tautan lain berbandwidth rendah, dengan Bitsocial, serta apakah Bitsocial bisa berjalan di atasnya.
---

# Bitsocial dan Reticulum

[Reticulum](https://reticulum.network/) adalah tumpukan jaringan berbasis kriptografi untuk
membangun jaringan di atas media pembawa apa pun yang tersedia: radio LoRa, radio paket, tautan
serial, Wi-Fi, Ethernet, TCP, UDP, atau I2P. Reticulum sering disebut bersama Bitsocial karena
keduanya menyingkirkan perusahaan yang berdiri di tengah. Keduanya melakukannya di lapisan yang
berbeda, jadi keduanya saling melengkapi, bukan saling bersaing.

## Lapisan yang berbeda

Reticulum menggantikan lapisan jaringan. Reticulum memberi aplikasi endpoint terenkripsi yang bisa
dirutekan tanpa alamat IP, DNS, otoritas sertifikat, maupun akun, dan dirancang agar tetap berfungsi
pada tautan selambat 5 bit per detik dengan MTU 500 byte. Reticulum tidak mendefinisikan postingan,
komunitas, atau moderasi; aplikasi yang dibangun di atasnya yang menambahkan semua itu.

Bitsocial adalah protokol sosial. Bitsocial berjalan di atas tumpukan IPFS/libp2p melalui koneksi
internet biasa, termasuk dari tab browser, dan mendefinisikan komunitas, publikasi, serta tantangan
anti-spam per komunitas. Lihat [Protokol Peer-to-Peer](/peer-to-peer-protocol/) dan
[Peer-to-Peer di Browser](/browser-p2p/).

Dalam tumpukan Bitsocial, Reticulum kira-kira akan menempati posisi libp2p, bukan posisi protokol
Bitsocial.

## Cara kerja Reticulum

- **Identitas.** Identitas Reticulum adalah set kunci 512-bit: kunci X25519 untuk enkripsi dan
  kunci Ed25519 untuk tanda tangan.
- **Destinasi.** Aplikasi membuat destinasi, yang dialamatkan dengan hash SHA-256 yang dipotong
  menjadi 16 byte. Paket tidak membawa alamat sumber.
- **Pengumuman.** Sebuah destinasi menjadi dapat dijangkau dengan mengirim pengumuman. Node
  transport meneruskannya dan mengingat hop berikutnya untuk jalur kembali, sehingga tidak ada node
  yang perlu memegang peta seluruh jaringan.
- **Enkripsi.** Lalu lintas dienkripsi secara bawaan, dengan kunci efemeral dan forward secrecy.
- **LXMF.** Lapisan pesan [LXMF](https://github.com/markqvist/LXMF) menambahkan pesan bertanda
  tangan, pengiriman langsung, serta simpan-dan-teruskan melalui node propagasi bagi penerima yang
  sedang offline.

Aplikasi yang dibangun dengan cara ini antara lain [Sideband](https://github.com/markqvist/Sideband)
untuk berkirim pesan dan [Nomad Network](https://github.com/markqvist/NomadNet) untuk berkirim pesan
serta halaman yang dihosting. Panduan Reticulum memuat
[daftar program](https://reticulum.network/manual/software.html).

## Perbandingan

| Pertanyaan         | Reticulum                                                                                                    | Bitsocial                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Apa itu            | Tumpukan jaringan                                                                                            | Protokol dan aplikasi sosial peer-to-peer                                                      |
| Dirancang untuk    | Media pembawa apa pun, hingga tautan radio yang lambat                                                       | Koneksi internet, termasuk tab browser                                                         |
| Identitas          | Set kunci X25519 dan Ed25519                                                                                 | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                            |
| Alamat             | Hash dari identitas dan nama aplikasi                                                                        | Hash dari kunci publik komunitas                                                               |
| Menemukan peer     | Pengumuman yang disebarkan node transport                                                                    | Router HTTP mengembalikan peer penyedia                                                        |
| Fitur sosial       | Ditambahkan oleh aplikasi seperti Nomad Network                                                              | Komunitas, postingan, balasan, dan moderasi di dalam protokol                                  |
| Pengendalian spam  | Batas laju pengumuman per antarmuka; stempel proof-of-work LXMF yang bisa diwajibkan oleh penerima atau node | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                            |
| Pengiriman offline | Node propagasi LXMF menyimpan lalu meneruskan pesan                                                          | Peer terus menyajikan status terbaru komunitas; publikasi membutuhkan node komunitasnya online |

## Bisakah Bitsocial berjalan di atas Reticulum?

Tidak untuk saat ini. Bitsocial tidak memiliki transport Reticulum, dan model datanya mengasumsikan
bandwidth internet: klien mengambil metadata komunitas dan konten postingan dari peer serta bertukar
pesan pubsub, dan pola itu kurang cocok untuk tautan yang dirancang di sekitar paket 500 byte dengan
throughput yang diukur dalam bit atau kilobit per detik.

Jalur yang realistis lebih sempit: sebuah klien yang bekerja di atas mesh lokal selama tidak
terhubung, lalu menyinkronkan diri dengan jaringan Bitsocial yang lebih luas ketika peer atau
gateway yang punya akses internet dapat dijangkau. Itu berarti klien dan jembatan baru, bukan
perubahan pada protokol, dan hal itu tidak ada dalam peta jalan saat ini.

## Untuk pengembang

Reticulum diterbitkan di bawah
[Lisensi Reticulum](https://reticulum.network/manual/license.html): ketentuan bergaya MIT ditambah
dua pembatasan. Perangkat lunak ini tidak boleh dipakai dalam sistem yang dirancang untuk mencelakai
manusia, ataupun untuk membuat dataset pelatihan AI atau machine learning. Bacalah lisensinya sebelum
menyertakan kode Reticulum ke dalam aplikasi Bitsocial.

Implementasi referensinya [ditulis dalam Python](https://github.com/markqvist/Reticulum). Para
pengelola Reticulum memperingatkan bahwa beberapa port tidak resmi dari Reticulum dan LXMF dihasilkan
oleh mesin dan membawa klaim lisensi yang mereka anggap batal, jadi utamakan implementasi referensi
atau program yang tercantum dalam panduan.
