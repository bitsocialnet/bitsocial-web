---
title: Di Mana Postingan Berada dan Berapa Lama Bertahan
description: Mengapa postingan Bitsocial ditandatangani dan dialamatkan berdasarkan konten, tetapi tidak disimpan selamanya oleh setiap node; siapa yang menjaganya tetap online dan bagaimana pengarsip menjaga konten lama tetap dapat dibaca.
---

# Di Mana Postingan Berada dan Berapa Lama Bertahan

Bitsocial tidak menyimpan setiap postingan di blockchain atau basis data perusahaan. Node milik setiap
komunitas menyimpan postingannya, pembaca dan seeder membantu menyajikannya, dan siapa pun yang ingin
catatan permanen dapat menyimpannya. Menyimpan postingan selamanya **bersifat opsional, bukan wajib**:
protokol tidak memaksa setiap peserta menyimpan seluruh riwayat jaringan.

Halaman ini menjelaskan arti praktisnya, karena "tidak disimpan selamanya" mudah disalahartikan sebagai
"menghilang" atau "percayalah".

## Keaslian dan ketersediaan adalah pertanyaan terpisah

Ada dua pertanyaan berbeda tentang sebuah postingan:

1. **Apakah ini asli?** Apakah penulis ini yang menulisnya, dan apakah komunitas menerimanya?
2. **Apakah masih online?** Dapatkah seseorang mengambilnya hari ini?

Bitsocial menjawab pertanyaan pertama dengan kriptografi, bukan kepercayaan. Setiap postingan
ditandatangani oleh pasangan kunci penulisnya dan, setelah komunitas menerimanya, disimpan di bawah
content identifier (CID): hash dari byte persisnya. Siapa pun yang mengambilnya dapat memeriksa tanda
tangan dan hash sendiri. Node, router, gateway, atau arsip tidak dapat mengubah teks atau memalsukan
postingan atas nama orang lain tanpa pemeriksaan gagal.

Pertanyaan kedua adalah tentang siapa yang menyimpan salinan; itu satu-satunya bagian yang tidak
dijamin.

## Siapa yang menjaga postingan tetap online

- **Node komunitas.** Node pemilik menerima postingan dan menyimpannya di basis datanya selama komunitas
  mempertahankannya. Ini satu salinan yang selalu ada selama komunitas berjalan. Lihat
  [Protokol Peer-to-Peer](/peer-to-peer-protocol/).
- **Pembaca.** Aplikasi desktop seperti aplikasi Electron 5chan men-seed komunitas yang mereka muat saat
  berjalan, sehingga komunitas populer disajikan banyak peer seperti torrent populer. Tab browser dapat
  menyimpan cache dan memvalidasi konten saat terbuka, tetapi bukan host jangka panjang.
- **Seeder.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) memungkinkan siapa
  pun menyumbangkan kapasitas selalu aktif dari VPS atau mesin cadangan. Ia mem-pin halaman terbaru dan
  pembaruan postingan komunitas, sehingga komunitas di balik router rumah dapat dimuat di browser.
- **Pengarsip.** Siapa pun dapat merayapi komunitas dan menyimpan semua yang dilihatnya. Arsip adalah
  layanan biasa di atas jaringan, bukan peran khusus dalam protokol.

## Komunitas memilih retensinya sendiri

Berapa lama komunitas menyimpan postingan lama adalah keputusan pemiliknya, bukan aturan protokol.
Sebagian ingin riwayat bertahun-tahun. Yang lain dirancang untuk melupakan: papan 5chan bekerja seperti
imageboard, dengan utas yang jatuh dari papan, pindah ke arsip, lalu dihapus dari node papan setelah
waktu tertentu (48 jam secara bawaan). Komunitas juga dapat melewati arsip sepenuhnya.

Protokol yang sama mendukung keduanya karena retensi adalah kebijakan setiap komunitas, bukan biaya yang
harus dibayar setiap node.

## Mengapa tidak menyimpan semuanya selamanya?

Jaringan yang mengharuskan setiap node menyimpan setiap postingan selamanya harus membayarnya:

- **Blockchain** membuat setiap node penuh menyimpan seluruh riwayat, sehingga kebutuhan node tumbuh
  bersama seluruh aktivitas dan memposting biasanya berbiaya.
- **Penyimpanan berbayar**, seperti sewa penyimpanan Farcaster, membuat pengguna membayar riwayatnya dan
  memangkas postingan tertua di luar yang mereka bayar. Lihat [Bitsocial dan Farcaster](/comparisons/farcaster/).
- **Server terpusat** menyimpan semuanya, tetapi hanya selama satu perusahaan menginginkannya, dengan
  aturan perusahaan itu.

Media sosial tidak memerlukan buku besar global. Tidak penting apakah postingan A diterima satu milidetik
sebelum B, dan sebagian besar postingan lama jarang dibaca. Bitsocial membiarkan tiap node komunitas
menampung komunitasnya sendiri saja, sehingga hosting tetap cukup murah untuk laptop, Raspberry Pi, atau
VPS kecil. Lihat [Mengapa bukan blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Pertukarannya

Jika tidak ada yang menyimpan salinan postingan, ia dapat tidak tersedia. CID postingan tidak pernah
berubah, tetapi CID hanya alamat: konten dapat diambil hanya selama setidaknya satu node menyajikannya.
Jika node komunitas mati permanen dan tidak ada pembaca, seeder, atau arsip yang menyimpan postingannya,
postingan itu hilang.

Itulah biaya jujur karena tidak mewajibkan buku besar global. Ini juga biaya semua platform besar: post
lama lenyap ketika akun, server, atau perusahaan menghilang. Bedanya, di Bitsocial menyimpan sesuatu
tidak memerlukan izin siapa pun.

## Menyimpan yang penting

- **Jalankan node komunitas sendiri.** Pemilik yang menjaga node tetap berjalan menyimpan riwayat
  komunitas selama pengaturan komunitas mempertahankannya.
- **Seed.** Membiarkan aplikasi desktop terbuka atau menjalankan `bitsocial-seeder` menjaga komunitas
  tersedia bagi orang lain.
- **Arsipkan.** Arsip independen menjaga utas lama dapat dibaca dan dicari setelah komunitas menghapusnya.
  [5archive.org](https://5archive.org) mengarsipkan papan 5chan dan
  [seeditarchive.org](https://seeditarchive.org) mengarsipkan komunitas Seedit. Keduanya sumber terbuka,
  sehingga siapa pun dapat menjalankan mirror atau arsip pesaing.

Karena setiap postingan yang diarsipkan tetap ditandatangani, arsip tidak dapat diam-diam menulis ulang
ucapan seseorang: pembaca dapat memverifikasi tanda tangan postingan arsip seperti postingan langsung.
