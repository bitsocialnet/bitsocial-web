---
title: Mendesentralisasikan Twitter/X
description: "Tahap 3 rencana induk: alternatif Twitter/X yang fokus dan terdesentralisasi untuk percakapan publik yang mengutamakan teks, dengan infrastruktur yang dapat diganti."
---

# Mendesentralisasikan Twitter/X

Tahap 3 adalah rencana untuk membangun alternatif Twitter/X yang fokus dan terdesentralisasi. Pusatnya adalah percakapan publik yang mengutamakan teks: posting singkat, balasan, repost, mengikuti akun, diskusi real-time, dan komunitas, dengan lapisan platform yang dibuka.

Twitter/X masih ditentukan oleh posting, teks, dan berbagi gagasan. Klien Tahap 3 seharusnya bersaing pada pengalaman inti tersebut dan membuatnya bekerja dengan sangat baik.

Halaman ini menjelaskan arah produk, bukan spesifikasi rilis yang dikunci. Antarmuka yang tepat, feed bawaan, model iklan, fitur AI, dan marketplace RPC dapat berubah seiring dengan berkembangnya protokol dan aplikasi-aplikasi awal.

## Hal yang harus dibuktikan

Klien seharusnya membuktikan bahwa jejaring sosial berbasis profil dapat menghindari menjadi platform kustodial:

- pengguna dapat memiliki identitas dan profil mereka
- komunitas dan node profil dapat tetap peer-to-peer
- komunitas dapat membawa efek jaringan di antara klien Bitsocial
- penyedia RPC dapat membuat klien nyaman digunakan tanpa mengambil alih kustodi
- algoritma feed dapat menjadi layanan opsional, bukan aturan yang dipaksakan platform
- klien lain tetap dapat bersaing untuk jaringan yang sama

Tujuannya adalah membangun klien percakapan publik sekuat mungkin dan menunjukkan sejauh mana protokol dapat berkembang.

## Akrab dalam tujuan, dapat diganti sejak desain

Pengalaman bawaan seharusnya bersaing dengan inti Twitter/X: feed beranda yang cepat, posting teks, mengikuti akun, balasan, distribusi melalui repost, komunitas, notifikasi, pencarian, dan tampilan For You berperingkat yang langsung berfungsi.

Bitsocial Forge dapat menjalankan layanan RPC dan feed bawaan pertama. Layanan bawaan itu dapat menyertakan feed berperingkat dan iklan agar klien terasa lengkap sejak hari pertama, alih-alih meminta pengguna umum merakit seluruh stack sendiri.

Perbedaannya adalah pilihan bawaan tidak boleh menjadi penjara. Pengguna seharusnya dapat mengganti RPC, feed, instance, sistem peringkat, iklan, dan penyedia penemuan, atau menghapus pemeringkatan sepenuhnya. Klien dapat membuat pilihan bawaan yang tegas saat pertama kali dibuka sambil menjaga agar setiap layanan utama tetap dapat diganti.

Hal itu membuat klien lebih mudah disesuaikan dibandingkan platform konvensional. Seorang pengguna mungkin mempertahankan feed bawaan berperingkat dengan iklan. Pengguna lain mungkin memakai feed kronologis tanpa pemeringkatan. Yang lain dapat memilih RPC yang berfokus pada privasi, layanan penemuan yang dijalankan komunitas, feed berbayar tanpa iklan, atau algoritma khusus untuk subkultur tertentu.

## Komunitas lintas klien

Komunitas seharusnya jauh lebih penting daripada kelompok terisolasi di dalam satu aplikasi.

Di X/Twitter, komunitas terbatas di dalam X. Komunitas dapat berguna, tetapi mewarisi batasan satu platform, satu sistem akun, satu stack rekomendasi, dan satu permukaan produk.

Komunitas Bitsocial dapat dibuat, di-host, ditemukan, dan digunakan melalui klien yang berbeda. Artinya, klien Tahap 3 dapat menampilkan komunitas dan posting dari jaringan Bitsocial yang lebih luas, bukan hanya dari pengguna yang memulai di dalamnya. Sebuah komunitas dapat memperoleh aktivitas secara bersamaan dari klien imageboard, klien diskusi bergaya Reddit, klien forum khusus, aplikasi seluler, dan klien Tahap 3.

Itulah keunggulan utama efek jaringan: satu klien dapat terasa akrab bagi pengguna umum sambil tetap memperoleh nilai dari banyak klien, node komunitas, penyedia RPC, dan layanan independen.

## Algoritma feed opsional

Klien Tahap 3 tidak seharusnya memaksakan satu sistem pemeringkatan global kepada semua orang.

Algoritma feed seharusnya dipilih secara aktif. Pengguna dapat memilih algoritma dari marketplace, berganti penyedia, menggunakan algoritma dari perusahaan, operator anonim, atau komunitas, menjalankan algoritma pribadi, atau tidak menggunakan algoritma sama sekali.

Penyedia RPC publik adalah tempat alami bagi layanan ini untuk bersaing. Mereka dapat mengindeks, memberi peringkat, dan merekomendasikan konten, tetapi tidak seharusnya memiliki pengguna atau profil.

Layanan tersebut juga dapat bersaing dalam bentuk klien itu sendiri. Satu RPC mungkin menyediakan feed berperingkat dengan iklan. RPC lain mungkin menyediakan feed kronologis tanpa peringkat. Yang lain lagi mungkin berfokus pada privasi, penerjemahan, moderasi, penemuan komunitas, atau graf sosial khusus.

Jika model ekonominya berjalan, layanan feed berbasis RPC dapat menambahkan fitur AI serupa dengan yang sedang dicoba oleh platform arus utama di feed mereka: terjemahan otomatis, ringkasan, balasan dengan bantuan bot, jawaban pencarian, bantuan moderasi, atau konteks bergaya catatan komunitas.

Fitur tersebut seharusnya menjadi pilihan layanan, bukan persyaratan protokol. RPC bawaan dapat bersaing dengan menawarkan feed yang lebih kaya, tetapi pengguna dan klien pesaing tetap harus dapat memilih alternatif yang lebih sederhana, privat, kronologis, bebas iklan, atau khusus komunitas.

## RPC nonkustodial

Setiap pengguna seharusnya dapat berpartisipasi sebagai node peer-to-peer penuh melalui RPC tanpa memberikan kepemilikan identitas atau profil mereka kepada penyedia RPC.

Jalur yang di-host penting karena sebagian besar pengguna tidak akan memulai dengan menjalankan server. Jalur keluar sama pentingnya: pengguna seharusnya dapat berpindah ke node profil mereka sendiri pada perangkat berspesifikasi rendah, termasuk Raspberry Pi, kapan pun mereka mau.

Itulah perbedaan antara kemudahan dan kustodi.

## Percakapan publik, diperkuat oleh Bitsocial Chain

Bitsocial Chain dapat menghadirkan penamaan permanen, pembayaran, tip, penghargaan, dan sarana finansial lainnya langsung ke dalam percakapan publik.

Klien Tahap 3 tetap berpusat pada posting, teks, berbagi gagasan, dan diskusi real-time sambil berbagi komunitas dan efek jaringan dengan klien Bitsocial lainnya.
