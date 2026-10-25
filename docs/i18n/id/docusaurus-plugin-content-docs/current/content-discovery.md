---
title: Penemuan Konten
description: Bagaimana Bitsocial memisahkan penemuan rekan dari kurasi tingkat aplikasi.
---

# Penemuan Konten

Bitsocial tidak memasukkan satu feed global, indeks pencarian, atau algoritma peringkat dalam protokolnya. Ini memisahkan penemuan konten menjadi dua lapisan:

1. **Pencarian jaringan** menemukan rekan yang saat ini melayani komunitas yang dikenal.
2. **Kurasi aplikasi** menentukan komunitas, papan, daftar, atau postingan mana yang pertama kali ditampilkan produk.

Hal ini menjaga protokol tetap kecil dan memberikan ruang bagi banyak pengalaman penemuan untuk bersaing.

## Pencarian jaringan

Setiap komunitas memiliki alamat stabil yang berasal dari kunci publiknya. Ketika klien sudah mengetahui alamat tersebut, klien akan menanyakan router HTTP ringan untuk menemukan rekan yang mengumumkan dirinya sebagai penyedia alamat tersebut.

Router hanya mengembalikan alamat rekan penyedia. Mereka tidak menyimpan postingan, metadata, daftar pengguna, atau direktori komunitas yang dapat dibaca manusia. Setelah klien menerima alamat rekan, klien terhubung ke rekan tersebut dan mengambil metadata komunitas terbaru ditambah penunjuk konten, lalu mengambil data postingan aktual dengan hash.

Ini menjawab pertanyaan protokol: "Di mana saya dapat mengambil status terbaru untuk komunitas ini?"

## Kurasi aplikasi

Pertanyaan produk terpisahnya adalah: "Komunitas mana yang pertama kali dilihat pengguna?"

Bitsocial menyerahkan hal itu kepada aplikasi, daftar, dan pengguna alih-alih memasukkan satu jawaban ke dalam jaringan. Contohnya meliputi:

- klien menunjukkan komunitas yang sudah diikuti pengguna
- daftar default yang dikurasi untuk aplikasi bergaya Reddit
- direktori, tempat komunitas bersaing memperebutkan nama topik seperti `/g/` atau `/s/funny`
- indeks pencarian atau peringkat yang dikelola oleh aplikasi tertentu
- tautan langsung yang dibagikan oleh pengguna

Aplikasi dapat mengindeks, memberi peringkat, memfilter, atau menyorot berbagai hal tanpa mengubah pilihan tersebut menjadi hukum protokol. Jika permukaan penemuan satu aplikasi tidak berguna, aplikasi lain dapat membuat penemuan lain di komunitas dasar yang sama.

## Aplikasi saat ini

5chan dan Seedit sama-sama menggunakan [direktori](./directories.md): rute pendek seperti `/g/` atau `/s/funny` yang diperebutkan komunitas. Saat ini kandidat dicantumkan di repositori publik, dan 5chan sedang menguji kontes pemungutan suara untuk menentukan pemenangnya.

Seedit juga membuat akun baru otomatis berlangganan ke daftar default berisi komunitas-komunitas tertentu. Komunitas masih dapat dibuat dan dibagikan di luar daftar-daftar ini.

Dalam kedua kasus tersebut, daftar tingkat aplikasi membantu pengguna menemukan sesuatu untuk dibuka, dan pencarian tingkat protokol kemudian menyelesaikan komunitas yang dipilih menjadi komunitas yang setara.

## Mengapa perpecahan ini penting

Jaringan tunggal yang terdesentralisasi masih memerlukan penemuan yang baik, namun lapisan penemuan harus dapat diganti. Protokol inti Bitsocial berfokus pada kemampuan alamat, pencarian rekan, penerbitan, dan anti-spam. Kurasi berada di atas lapisan tersebut, tempat aplikasi dapat bereksperimen dengan direktori, daftar default, feed, penelusuran, pemungutan suara, dan kebijakan moderasi tanpa memerlukan migrasi seluruh jaringan.
