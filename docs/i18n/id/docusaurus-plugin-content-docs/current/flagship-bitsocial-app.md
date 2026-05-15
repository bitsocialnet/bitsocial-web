---
title: Aplikasi Bitsocial andalan
description: "Klien Bitsocial berbasis profil yang diusulkan: familiar seperti X/Twitter secara default, tetapi dengan RPC, feed, algoritma, iklan, dan komunitas yang dapat diganti."
---

# Aplikasi Bitsocial andalan

Aplikasi unggulan Bitsocial adalah klien berbasis profil pertama yang diusulkan untuk jaringan tersebut. Perbandingan paling sederhana adalah: familiar seperti X/Twitter secara default, tetapi dengan lapisan platform terbuka.

Ini akan menambahkan profil, mengikuti, balasan, feed, komunitas, notifikasi, dan percakapan publik real-time sambil menjaga layanan dasar tetap dapat diganti. 5chan membuktikan komunitas anonim dapat berfungsi. Seedit bergerak menuju diskusi yang gigih. Aplikasi andalan ini akan menghadirkan efek jaringan tersebut ke dalam media sosial arus utama tanpa menjadikan satu perusahaan sebagai pemilik grafiknya.

Halaman ini menjelaskan arah produk, bukan spesifikasi rilis yang terkunci. Antarmuka yang tepat, feed default, model iklan, fitur AI, dan pasar RPC dapat berubah seiring dengan semakin matangnya protokol dan aplikasi awal.

## Apa yang harus dibuktikan

Aplikasi ini harus membuktikan bahwa jejaring sosial berbasis profil dapat menghindari menjadi platform kustodian:

- pengguna dapat memiliki identitas dan profil
- komunitas dan node profil dapat tetap bersifat peer-to-peer
- komunitas dapat membawa efek jaringan ke seluruh klien Bitsocial
- Penyedia RPC dapat membuat aplikasi nyaman tanpa mengambil hak asuh
- algoritme umpan dapat menjadi layanan opsional, bukan hukum platform
- klien lain masih dapat bersaing untuk jaringan yang sama

Intinya bukan menjadikan satu-satunya klien Bitsocial. Intinya adalah membuat klien luas pertama yang menunjukkan sejauh mana protokol dapat diperluas.

## Familiar secara default, dapat diganti berdasarkan desain

Pengalaman default harus bersaing dengan aplikasi percakapan publik arus utama: feed beranda cepat, mengikuti, membalas, distribusi gaya posting ulang, komunitas, notifikasi, pencarian, dan tampilan peringkat Untuk Anda yang langsung berfungsi.

Bitsocial Forge dapat menjalankan RPC dan layanan feed default pertama. Default tersebut dapat mencakup feed berperingkat dan iklan sehingga aplikasi terasa lengkap pada hari pertama daripada meminta pengguna umum untuk merakit sendiri seluruh tumpukannya.

Bedanya, defaultnya tidak boleh jadi penjara. Pengguna harus dapat mengganti RPC, feed, instance, sistem peringkat, iklan, dan penyedia penemuan, atau menghapus peringkat seluruhnya. Aplikasi ini dapat diberi opini pada peluncuran pertama sambil menjaga setiap layanan utama tetap dapat diganti.

Hal ini membuat aplikasi lebih dapat disesuaikan dibandingkan platform konvensional. Satu pengguna mungkin mempertahankan feed peringkat default dengan iklan. Yang lain mungkin menggunakan feed kronologis tanpa peringkat. Yang lain mungkin memilih RPC yang berfokus pada privasi, layanan penemuan yang dijalankan komunitas, feed bebas iklan berbayar, atau algoritma khusus yang dibuat untuk subkultur tertentu.

## Komunitas lintas klien

Komunitas harus menjadi lebih penting daripada kelompok terisolasi dalam satu aplikasi.

Di X/Twitter, komunitas dibatasi di dalam X. Komunitas mungkin berguna, namun mereka mewarisi batasan dari satu platform, satu sistem akun, satu tumpukan rekomendasi, dan satu permukaan produk.

Komunitas Bitsocial dapat dibuat, dihosting, ditemukan, dan digunakan melalui klien yang berbeda. Artinya, aplikasi unggulan dapat menampilkan komunitas dan postingan dari jaringan Bitsocial yang lebih luas, tidak hanya dari pengguna yang memulai di dalam aplikasi unggulan. Komunitas dapat memiliki aktivitas dari klien imageboard, klien diskusi bergaya Reddit, klien forum khusus, aplikasi seluler, dan aplikasi andalan secara bersamaan.

Itulah keunggulan efek jaringan inti: satu klien dapat merasa akrab dengan pengguna arus utama sambil tetap mendapatkan manfaat dari banyak klien, node komunitas, penyedia RPC, dan layanan independen.

## Algoritme umpan opsional

Aplikasi unggulan tidak boleh memaksakan satu sistem peringkat global pada semua orang.

Algoritme umpan harus ikut serta. Pengguna dapat memilih algoritme dari pasar, berpindah penyedia, menggunakan algoritme dari perusahaan, menggunakan algoritme yang dijalankan oleh operator anonim, menggunakan algoritme yang dibuat oleh komunitas, menjalankan algoritme pribadi, atau tidak menggunakan algoritme sama sekali.

Penyedia RPC publik adalah tempat alami bagi layanan ini untuk bersaing. Mereka dapat mengindeks, memberi peringkat, dan merekomendasikan konten, tetapi mereka tidak boleh memiliki pengguna atau profil tersebut.

Layanan-layanan tersebut juga dapat bersaing dalam bentuk aplikasi itu sendiri. Satu RPC mungkin menyediakan feed berperingkat dengan iklan. Yang lain mungkin memberikan umpan kronologis yang tidak diberi peringkat. Yang lain mungkin berspesialisasi dalam privasi, terjemahan, moderasi, penemuan komunitas, atau grafik sosial khusus.

Jika ekonominya berhasil, layanan feed yang didukung RPC dapat menambahkan fitur AI serupa dengan apa yang coba dimasukkan oleh platform arus utama ke dalam feed mereka: terjemahan otomatis, ringkasan, balasan yang dibantu bot, jawaban pencarian, bantuan moderasi, atau konteks gaya catatan komunitas.

Fitur-fitur tersebut harus menjadi pilihan layanan, bukan persyaratan protokol. RPC default dapat bersaing dengan menawarkan feed yang lebih kaya, namun pengguna dan klien yang bersaing tetap dapat memilih alternatif yang lebih sederhana, pribadi, kronologis, bebas iklan, atau spesifik komunitas.

## RPC non-penahanan

Setiap pengguna harus dapat berpartisipasi sebagai node peer-to-peer penuh melalui RPC tanpa memberikan kepemilikan kepada penyedia RPC atas identitas atau profil mereka.

Jalur yang dihosting penting karena sebagian besar pengguna tidak akan memulai dengan menjalankan server. Jalur keluar juga penting: pengguna harus dapat berpindah ke node profil mereka sendiri pada perangkat keras berspesifikasi rendah, termasuk Raspberry Pi, kapan pun mereka mau.

Itulah perbedaan antara kenyamanan dan hak asuh.

## Mengapa ini bisa menjadi aplikasi segalanya

Jika Bitsocial Network memberi aplikasi penamaan, pembayaran, pemberian tip, penghargaan, dan jalur finansial lainnya yang tahan lama pada aplikasi, aplikasi andalan bisa menjadi lebih dari sekadar klien feed.

Kendala pentingnya adalah aplikasi tidak boleh menjadi pemilik baru jaringan. Ini bisa berupa klien besar, bahkan mungkin klien paling populer, namun tetap menyisakan ruang untuk aplikasi pesaing, RPC pesaing, algoritme umpan pesaing, dan node profil yang dihosting sendiri.
