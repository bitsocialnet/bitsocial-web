---
title: Bangun klien Bitsocial Anda sendiri
description: Panduan bagi pengembang untuk merilis klien Bitsocial yang independen, mulai dari imageboard dan forum hingga aplikasi sosial niche.
---

# Bangun klien Bitsocial Anda sendiri

Bitsocial tidak menang dengan menyediakan satu aplikasi resmi untuk setiap kebutuhan. Bitsocial menang
ketika banyak klien dapat berbagi protokol yang sama sambil bersaing dalam antarmuka, budaya,
penemuan konten, pengaturan bawaan, dan model bisnis.

5chan dan Seedit adalah bukti awal, bukan batas atas. Seorang pengembang harus bisa merilis imageboard
baru, forum, klien profil, aplikasi sosial yang mengutamakan seluler, alat komunitas niche, atau klien
terpusat yang memakai Bitsocial di baliknya tanpa perlu meminta izin kepada pemilik platform.

## Apa yang bisa diubah pengembang

Sebuah klien Bitsocial dapat bersaing dalam keputusan produk tanpa harus mem-fork seluruh jaringan:

- antarmuka dan bahasa visual
- alur onboarding
- pengaturan bawaan komunitas
- permukaan moderasi
- model penemuan konten
- pengalaman media
- batasan seluler, desktop, atau bandwidth rendah
- monetisasi dan model bisnis

Lapisan bersamanya adalah protokol. Lapisan produk terbuka untuk persaingan.

## Cara tercepat untuk belajar

Mulailah dari aplikasi yang sudah ada:

- Coba [5chan](https://5chan.app) untuk komunitas imageboard anonim.
- Coba [Seedit](https://seedit.app) untuk diskusi bergaya Reddit.
- Baca dokumentasi [React hooks Bitsocial](https://hooks.bitsocial.net/docs/quickstart/) untuk integrasi di sisi klien.
- Baca dokumentasi [Bitsocial CLI](/developer-tools/cli/) untuk pengoperasian node dan komunitas.

Jika ingin bergerak cepat, berkontribusilah dulu pada aplikasi yang sudah ada. Jika antarmuka, budaya,
atau model komunitas yang Anda inginkan tidak cocok di sana, bangunlah klien terpisah.

## Pilih versi pertama yang sempit

Versi pertama yang terbaik bukanlah aplikasi sosial serba bisa, melainkan klien dengan satu audiens
yang jelas dan satu alasan kuat untuk ada.

Titik awal yang baik antara lain:

- klien imageboard yang lebih rapi untuk satu budaya tertentu
- klien forum yang mengutamakan seluler
- aplikasi satu komunitas dengan pengaturan bawaan yang ketat
- klien untuk komunitas kreator
- klien penemuan konten yang hanya bisa dibaca
- konsol moderasi atau operator
- klien yang dioptimalkan untuk satu bahasa, wilayah, atau kelas perangkat

Klien kecil tetap berguna karena Bitsocial membuat mereka tumbuh di dalam jaringan yang sama, alih-alih
mengurung penggunanya di dalam basis data privat.

## Jalur implementasi

Ada tiga jalur praktis:

1. Fork klien yang sudah ada jika ide Anda dekat dengan 5chan atau Seedit.
2. Bangun klien React baru dengan [React hooks Bitsocial](https://hooks.bitsocial.net/).
3. Bangun integrasi Anda sendiri di atas API node dan infrastruktur RPC publik.

RPC publik seharusnya membuat jalur ketiga jauh lebih praktis. Pengguna dapat memulai lewat penyedia
RPC non-kustodial yang dikelola pihak lain, lalu pindah ke hosting mandiri atau penyedia pesaing di
kemudian hari.

## Prinsip desain

Bangunlah klien yang memang seharusnya ada untuk komunitas Anda, lalu biarkan klien-klien yang
kompatibel bersaing secara terbuka.
