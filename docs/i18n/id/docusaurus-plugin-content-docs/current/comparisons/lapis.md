---
title: Bitsocial dan Lapis Net
description: Perbandingan Lapis Net, protokol sosial peer-to-peer berbasis Kotlin dengan skor kepercayaan per pembaca dan visibilitas yang didukung Bitcoin, dengan Bitsocial.
---

# Bitsocial dan Lapis Net

[Lapis Net](https://net.lapisproject.dev/) adalah protokol jaringan sosial peer-to-peer yang ditulis
dalam Kotlin untuk JVM. Secara independen, Lapis Net sampai pada fondasi yang mirip dengan
Bitsocial: identitas berbasis pasangan kunci, penyimpanan konten bergaya IPFS, dan gossipsub libp2p.
Keduanya berbeda dalam hal di mana penyaringan spam dan kurasi ditempatkan. Lapis memberi setiap
pembaca graf kepercayaan pribadi dan membiarkan pembayaran Bitcoin dan Lightning menaikkan
visibilitas; Bitsocial membiarkan setiap komunitas memutuskan apa yang boleh dipublikasikan.

Lapis adalah prototipe yang berfungsi. Menurut
[repositorinya](https://github.com/lapisproject-dev/Lapis-Net), pada Oktober 2026 Lapis belum punya
jaringan publik, dan menghubungkan dua node masih merupakan langkah manual.

## Cara kerja Lapis

- **Identitas.** Setiap identitas adalah pasangan kunci secp256k1, yang kompatibel dengan kunci
  Bitcoin, dengan kunci Ed25519 yang terikat padanya untuk peer ID libp2p.
- **Penyimpanan dan propagasi.** Konten disimpan dengan Nabu, implementasi IPFS di atas libp2p (DHT
  dan Bitswap), dan disebarkan dengan gossipsub libp2p.
- **Penilaian.** Empat skor opsional berada di atas inti yang tetap netral terhadap kurasi:
  - Veritas, jaringan kepercayaan yang dihitung dari graf kepercayaan milik setiap pembaca
  - Virtus, visibilitas yang didukung bukti pembayaran onchain atau Lightning yang meluruh seiring
    waktu
  - Karma, like gratis yang dibobot oleh Veritas
  - Madli, skor reputasi yang dicatat node tentang perilaku satu sama lain
- **Pesan.** Pesan langsung terenkripsi end-to-end, panggilan suara satu lawan satu, dan sistem
  pesan asinkron mirip email merupakan bagian dari proyek ini.
- **Klien.** Setiap pengguna menjalankan node JVM. Klien referensinya adalah antarmuka web yang
  disajikan oleh node lokal tersebut.

## Letak perbedaannya

### Siapa yang menyaring spam

Lapis menyaring di sisi pembaca. Konten menyebar, lalu graf kepercayaan setiap pembaca dan aturan
pembayaran aplikasi yang mereka pakai menentukan apa yang muncul. Bitsocial menyaring di tingkat
komunitas: sebuah postingan harus lolos tantangan komunitas sebelum node komunitas menerimanya,
sehingga spam yang ditolak tidak pernah menjadi bagian dari komunitas. Lihat
[Tantangan Anti-Spam Khusus](/custom-challenges/).

### Siapa yang memegang kekuasaan

Di Lapis, setiap pembaca memutuskan siapa yang mereka percayai, dan operator setiap aplikasi
menentukan cara kerja visibilitas berbayar di aplikasinya. Di Bitsocial, pemilik komunitas
menetapkan aturan untuk komunitas itu saja, dan aplikasi memilih apa yang ditampilkan. Tidak satu
pun dari keduanya punya administrator di tingkat protokol.

### Ekonomi

Lapis memasukkan bukti pembayaran Bitcoin dan Lightning ke dalam skor visibilitasnya. Bitsocial
tidak punya lapisan pembayaran di dalam protokol; sebuah komunitas bisa mewajibkan pembayaran atau
token melalui tantangannya.

### Browser

Aplikasi Bitsocial bisa menjalankan node peer-to-peer di dalam tab browser biasa. Lihat
[Peer-to-Peer di Browser](/browser-p2p/). Antarmuka browser Lapis adalah halaman lokal yang
disajikan oleh node JVM pengguna.

### Cakupan

Lapis menggabungkan pesan langsung, panggilan suara, dan surat. Bitsocial berfokus pada komunitas
publik dan belum punya pesan langsung bawaan.

## Perbandingan

| Pertanyaan                | Lapis Net                                                                                 | Bitsocial                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Kategori                  | Protokol sosial peer-to-peer (prototipe)                                                  | Jaringan komunitas peer-to-peer                                                          |
| Identitas                 | Pasangan kunci secp256k1 dengan peer ID Ed25519 yang terikat                              | Pasangan kunci Ed25519 untuk pengguna dan komunitas                                      |
| Tempat postingan disimpan | Penyimpanan Nabu (IPFS di atas libp2p) di node yang berpartisipasi                        | Node pemilik komunitas dan peer yang membaca serta men-seed komunitas itu                |
| Komunitas                 | Tidak ada objek komunitas; kurasi terjadi per pembaca dan per aplikasi                    | Objek kelas satu yang node-nya menerima atau menolak postingan                           |
| Pengendalian spam         | Graf kepercayaan pembaca, visibilitas berbayar, deposit Lightning untuk pesan pertama     | Tantangan masing-masing komunitas sebelum sebuah postingan diterima                      |
| Moderasi                  | Graf kepercayaan setiap pembaca; operator aplikasi menetapkan aturan visibilitas berbayar | Pemilik komunitas memoderasi komunitasnya; aplikasi memilih apa yang ditampilkan         |
| Ekonomi                   | Bukti pembayaran Bitcoin dan Lightning dalam penilaian                                    | Tidak ada di dalam protokol; tantangan bisa mewajibkan pembayaran atau token             |
| Browser                   | Antarmuka web lokal yang disajikan node JVM                                               | Node peer-to-peer di dalam tab browser biasa                                             |
| Jaringan                  | Prototipe tanpa jaringan publik                                                           | Jaringan aktif dengan aplikasi seperti [5chan](/apps/5chan/) dan [Seedit](/apps/seedit/) |
| Konsekuensi utama         | Reputasi dan pesan bawaan yang kaya, tetapi belum ada jaringan publik                     | Inti yang lebih kecil dan berjalan di browser, tetapi tanpa reputasi atau DM bawaan      |

## Bisakah keduanya bekerja sama?

Tantangan Bitsocial adalah kode arbitrer, jadi skor kepercayaan bergaya Lapis bisa dijadikan salah
satunya. Tantangan bawaan `whitelist` sudah bisa membaca daftar alamat yang diizinkan dari URL.
Sebuah layanan yang mempublikasikan alamat Bitsocial yang dipercayai graf Veritas bisa memungkinkan
para penulis itu melewati CAPTCHA di sebuah komunitas. Untuk itu dibutuhkan cara menautkan identitas
Lapis ke alamat Bitsocial, dan hal semacam itu belum ada saat ini.
