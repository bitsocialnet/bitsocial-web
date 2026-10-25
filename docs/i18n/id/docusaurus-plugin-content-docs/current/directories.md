---
title: Direktori
description: Cara aplikasi Bitsocial membiarkan komunitas bersaing memperebutkan nama topik, alih-alih menyerahkannya kepada siapa pun yang pertama kali mengklaimnya.
---

# Direktori

Di Reddit, nama seperti `r/opensource` hanya bisa dimiliki oleh satu komunitas, dan siapa pun yang mengendalikannya akan terus memegangnya. Jika moderatornya membuat keputusan yang tidak disukai pengguna, satu-satunya alternatif adalah membuat `r/opensource2`. Komunitas baru itu dimulai tanpa satu pun pelanggan, padahal sebagian besar orang yang berlangganan `r/opensource` peduli pada open source, bukan pada tim moderasi tertentu itu.

Aplikasi Bitsocial menghindari hal ini dengan **direktori**. Direktori adalah nama topik, seperti `opensource`, yang diperebutkan oleh komunitas. Rute pendek untuk nama itu membuka komunitas mana pun yang saat ini berada di peringkat pertama, sehingga komunitas yang lebih baik dapat mengambil alih nama tersebut tanpa izin siapa pun.

## Cara kerjanya

1. **Kode direktori adalah nama topik.** Seedit menggunakan rute seperti `/s/funny`. 5chan menggunakan jalur imageboard seperti `/g/`.
2. **Komunitas bersaing sebagai kandidat.** Setiap direktori memiliki daftar komunitas kandidat, masing-masing dengan alamat persisnya sendiri, seperti `funny-posting.bso`.
3. **Kandidat dengan peringkat tertinggi memenangkan rute.** Membuka `/s/funny` akan menampilkan pemenang saat ini.
4. **Kalah tidak menghapus apa pun.** Komunitas yang bukan pemenang tetap mempertahankan alamat, postingan, dan pelanggannya, dan siapa pun masih dapat membukanya secara langsung.

## Nama adalah pintu depan, bukan identitas

Kode direktori hanyalah rute penemuan. Semua hal yang bersifat tetap mengarah ke komunitas tertentu melalui alamat persisnya:

- Berlangganan dari `/s/funny` berarti berlangganan ke alamat persis milik pemenang saat ini. Kode direktori itu sendiri tidak pernah disimpan sebagai langganan.
- Tautan postingan selalu menggunakan alamat persis komunitas, sehingga tautan lama tidak bisa tiba-tiba mengarah ke komunitas lain setelah pemenangnya berganti.
- Saat pemenang berganti, Seedit membiarkan langganan yang ada apa adanya dan menanyakan kepada setiap pelanggan apakah ingin beralih ke pemenang baru, mempertahankan keduanya, atau tetap dengan komunitas saat ini. Peralihan otomatis adalah pengaturan opsional per direktori yang harus diaktifkan sendiri, dan setiap peralihan otomatis menampilkan pemberitahuan dengan opsi untuk membatalkannya.

Jadi, komunitas pesaing tidak mengambil langganan siapa pun. Yang dimenangkannya adalah nama: pengunjung baru akan tiba di komunitas itu, dan pelanggan lama mendapat pilihan dengan sekali klik. Orang yang lebih menyukai komunitas lama tetap bisa mempertahankannya.

## Mengapa bukan nama siapa cepat dia dapat

- **Tidak ada penyerobotan nama.** Memegang nama yang bagus saja tidak cukup. Sebuah komunitas harus tetap menjadi kandidat terbaik untuk nama itu.
- **Tidak ada admin yang membagikan nama.** Alokasi oleh administrator akan menghidupkan kembali hak veto terpusat yang ingin dihilangkan oleh Bitsocial.
- **Pesaing tetap punya jalan menuju audiens.** Komunitas saingan menargetkan nama yang sama alih-alih memulai dari awal dengan nama yang lebih buruk.
- **Klien sepakat tentang pemenangnya.** Seedit memeringkat kandidat secara deterministik, sehingga setiap klien yang membaca snapshot direktori final yang sama menampilkan pemenang yang sama. Seedit tidak menggantinya dengan kandidat lain hanya karena pemenang untuk sementara tidak dapat dijangkau dari koneksi seorang pengguna.

## Cara pemenang dipilih saat ini

Kandidat dipublikasikan sebagai berkas JSON di repositori [bitsocialnet/lists](https://github.com/bitsocialnet/lists), satu berkas per direktori, dan sebuah komunitas bergabung ke direktori melalui pull request ke berkas direktori tersebut. Ini adalah langkah awal sementara. Tujuannya adalah agar pemungutan suara menggantikan pull request sebagai cara menentukan pemenang.

- **Seedit** memeringkat kandidat sebuah direktori berdasarkan skor, lalu berdasarkan waktu penambahannya, lalu berdasarkan alamat. Setiap berkas direktori memuat nomor revisi, dan setiap perubahan pada kandidat atau pemenangnya akan menerbitkan revisi baru.
- **5chan** menjalankan satu kontes pemungutan suara per direktori dengan [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Klien saling bertukar surat suara bertanda tangan melalui libp2p gossipsub dan menghitung hasilnya sendiri, tanpa server yang menghitung suara. Untuk memberikan suara, Anda harus memegang 5chan Pass, yaitu token yang tidak dapat dipindahtangankan, dan setiap pemegangnya mendapat satu suara. Memberikan suara untuk papan yang belum terdaftar berarti menominasikannya. Kontes saat ini berjalan di testnet Base Sepolia, dan sampai kontes tersebut keluar dari testnet, hasil penghitungan ditampilkan tetapi tidak mengubah urutan daftar.

## Protokol atau aplikasi?

Direktori bukan bagian dari PKC, lapisan peer-to-peer yang menyimpan dan memindahkan komunitas. Direktori adalah konvensi yang diterapkan klien di atas lapisan itu, bersama daftar default dan pencarian; lihat [Penemuan Konten](./content-discovery.md). Sebuah klien dapat membaca berkas direktori yang sama, menerbitkan berkasnya sendiri, atau sama sekali tidak memakai direktori, dan pengguna tetap dapat membuka komunitas mana pun melalui alamatnya.
