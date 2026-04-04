---
title: Bangun klien imageboard
description: Panduan kontribusi fase 1 untuk pembangun yang ingin memberikan pengalaman papan gambar baru di Bitsocial.
sidebar_position: 1
---

# Bangun klien imageboard

Fase 1 bukan tentang satu aplikasi resmi yang mencakup seluruh kategori. 5chan adalah titik bukti pertama, tetapi tujuan sebenarnya adalah ekosistem papan gambar yang luas: beberapa klien Bitsocial dengan bahasa visual berbeda, default moderasi, model direktori, dan komunitas target.

## Apa yang dibutuhkan Tahap 1

- Klien gaya 4chan yang familier untuk orientasi arus utama
- Klien yang terinspirasi Altchan dengan budaya dan kumpulan dewan yang berbeda
- Klien yang mengutamakan seluler atau bandwidth rendah
- Klien komunitas tunggal atau khusus dengan standar opini yang kuat
- Moderasi, media, orientasi, atau alur penemuan yang lebih baik dibandingkan aplikasi pertama

## Cara tercepat untuk membantu

Jika Anda ingin jalur pengiriman terpendek, berkontribusi langsung ke 5chan terlebih dahulu:

- Jelajahi aplikasi langsung di [5chan.aplikasi](https://5chan.app)
- Tinjau sumbernya di [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Bergabunglah dengan obrolan pembuat di [t.me/fivechandev](https://t.me/fivechandev)

## Bangun klien Anda sendiri

Jika 5chan tidak cocok dengan komunitas atau antarmuka yang Anda inginkan, buatlah klien terpisah. Klien Bitsocial yang kompatibel dapat berbagi jaringan yang sama tanpa berbagi keputusan produk yang sama.

1. Pelajari alat yang berhubungan dengan protokol:
   - [Kait Bitsocial React](../react-hooks/)
   - [CLI Bitsosial](../cli/)
2. Putuskan jenis papan gambar apa yang sebenarnya Anda buat.
Pilih struktur dewan, asumsi identitas, model moderasi, alur penemuan, dan bahasa visual terlebih dahulu.
3. Pilih jalur implementasi yang sesuai dengan proyek.
Fork 5chan jika Anda ingin bergerak cepat dengan basis imageboard yang familiar. Mulailah dari awal jika UI atau model interaksi perlu diubah secara radikal.
4. Kirimkan versi pertama yang sempit.
Satu klien yang melayani satu komunitas nyata dengan baik lebih berharga daripada tiruan samar-samar yang dimaksudkan untuk memuaskan semua orang.
5. Publikasikan hasilnya dan biarkan komunitas mengujinya.
Bitsocial meningkat ketika pembuat luar mengirimkan klien yang memiliki pendapat yang bersaing dalam kualitas produk daripada menunggu satu aplikasi resmi untuk melakukan semuanya.

## Prinsip desain

Bitsocial tidak menang dengan memiliki satu klien yang diberkati. Ia menang ketika banyak klien dapat hidup berdampingan, bercabang, berspesialisasi, dan melayani kebutuhan yang tidak akan pernah bisa dilakukan oleh aplikasi pertama.
