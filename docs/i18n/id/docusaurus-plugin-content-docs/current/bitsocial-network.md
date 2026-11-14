---
title: Bitsocial Chain
description: Fase 3 dari rencana induk, mencakup usulan lapisan ekonomi appchain L2 Ethereum untuk aplikasi Bitsocial.
---

# Bitsocial Chain

Bitsocial Chain adalah usulan lapisan ekonomi berupa appchain L2 Ethereum untuk aplikasi Bitsocial.
Situs khusus rantai ini saat ini berada di [chain.bitsocial.net](https://chain.bitsocial.net).

Lapisan sosial peer-to-peer membuat komunitas, identitas, dan konten dapat berpindah ke luar basis
data platform terpusat. Bitsocial Chain dimaksudkan untuk menambahkan primitif penamaan, monetisasi,
dan pembayaran bersama yang membuat aplikasi-aplikasi itu lebih sulit dikeringkan secara finansial.

## Apa yang ingin ditenagai

- domain Bitsocial terdesentralisasi seperti `.bso`
- penghargaan dan pemberian tip
- rel monetisasi yang tahan lama
- likuiditas bersama di seluruh aplikasi
- struktur keuangan yang lebih sulit diputus oleh bank atau platform
- efek jaringan yang tidak bergantung pada satu perusahaan yang memiliki seluruh tumpukan teknologi

Tujuannya bukan menonjolkan mekanika token lebih dulu. Tujuannya adalah membuat aplikasi sosial yang
berguna menjadi lebih tahan lama, lebih mudah didanai, dan tidak terlalu bergantung pada penyedia
pembayaran atau penamaan yang terpusat.

## Bukti konsep saat ini

Bukti konsep Bitsocial Chain yang pertama berfokus pada nama `.bso` native. Bukti konsep itu
menunjukkan bahwa registri nama dapat diturunkan dari riwayat Ethereum L1 tanpa menempatkan konten
sosial secara on-chain:

- pengguna mengirimkan intent pendaftaran, pembaruan, pemindahan, dan pencabutan lewat transaksi
  Ethereum L1 biasa
- siapa pun dapat menjalankan node derivasi dan merekonstruksi status registri `.bso` yang sama
- sebuah resolver memetakan nama `.bso` ke kunci publik Bitsocial yang sudah dipakai klien di
  protokol peer-to-peer
- postingan, suara, moderasi, feed, dan konten komunitas tetap off-chain dan peer-to-peer

Bukti konsep itu bukan peluncuran Stage 2 tingkat produksi. Belum ada sistem pembuktian, mekanisme
tantangan, kode yang telah diaudit, penerapan yang sudah berjalan, harga final, maupun tata kelola
final. Sikap jangka panjangnya adalah transparan secara bawaan dan kompatibel dengan privasi sejak
desainnya: rantai intinya bersifat publik, sementara pemberian tip, pembayaran, penghargaan, dan
likuiditas di masa depan sebaiknya menghindari kaitan permanen yang dipaksakan antara identitas
sosial dan riwayat dompet.

## Mengapa ini penting

Mendesentralisasi komunitas dan identitas memang perlu, tetapi itu belum cukup untuk mendesentralisasi
seluruh media sosial.

Jika aplikasi sosial masih bergantung pada segelintir rel ekonomi yang terpusat, aplikasi itu tetap
mudah ditekan, dikeluarkan dari platform, atau dikeringkan secara finansial. Bitsocial Chain adalah
jawaban yang diusulkan untuk lapisan ketergantungan kedua tersebut.

## Hubungan dengan aplikasi

Bitsocial Chain seharusnya berada di bawah aplikasi Bitsocial, bukan menggantikannya.

Hasil yang terlihat oleh publik seharusnya:

- komunitas tetap peer-to-peer
- aplikasi tetap berbeda satu sama lain
- pengguna mendapat fitur penamaan dan monetisasi yang praktis
- kreator dan komunitas dapat menerima dukungan lintas klien
- nilai dapat berpindah di seluruh ekosistem tanpa menciptakan kembali pemilik platform yang terpusat

## Mengapa ini datang setelah alternatif Twitter/X

Rencana induk saat ini menempatkan Bitsocial Chain setelah alternatif Twitter/X, karena aplikasi itu tidak membutuhkan chain. Profil berjalan sebagai node profil melalui RPC non-kustodial, dan nama `.bso` dapat dimulai di registri sementara di mainnet Ethereum ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) lalu pindah ke chain nanti.

Bitsocial Chain tidak boleh menukar desentralisasi dengan peluncuran yang lebih awal. Chain ini tidak boleh menambahkan asumsi kepercayaan apa pun di luar Ethereum itu sendiri: tanpa kunci upgrade, tanpa dewan keamanan, dan tanpa operator yang dapat menyensor atau menghentikannya. Desain utama untuk itu, native rollup, bergantung pada upgrade Ethereum yang belum dijadwalkan. Sampai chain dapat memenuhi standar itu, alternatif Twitter/X menumbuhkan basis pengguna yang akan dilayani chain.

## Prinsip desain

Karena Bitsocial Chain masih berupa infrastruktur yang diusulkan, bukan produk yang sudah diluncurkan,
rencananya harus tetap disiplin:

- Aplikasi dan komunitas lebih dulu. Lapisan jaringan harus membuat produk sosial nyata menjadi lebih
  kuat.
- Fitur praktis lebih dulu. Nama, penghargaan, pemberian tip, dan pembayaran lebih mudah dijelaskan
  daripada arsitektur keuangan yang abstrak.
- Kontribusi nyata di atas hype. Primitif ekonomi harus memberi imbalan pada partisipasi, pembangunan,
  dan dukungan komunitas.
- Kurasi diperbolehkan. Aplikasi dapat membentuk peringkat, pengaturan bawaan, dan penemuan agar
  mengutamakan komunitas yang tahan lama.
- Mekanisme persisnya masih terbuka. Halaman ini menjelaskan peran Bitsocial Chain, bukan janji yang
  sudah terkunci tentang model ekonomi finalnya.
