---
title: Pemblokir Spam
description: Layanan deteksi spam terpusat dengan penilaian risiko, tantangan OAuth, dan ambang batas tingkat yang dapat dikonfigurasi.
sidebar_position: 1
---

# Pemblokir Spam

:::warning Legacy Naming
Paket ini awalnya diterbitkan di bawah cakupan `@plebbit`. Telah diubah namanya menjadi `@bitsocial/spam-blocker-server` dan `@bitsocial/spam-blocker-challenge`. Referensi ke nama lama mungkin masih muncul di dokumentasi atau basis kode lama.
:::

Pemblokir Spam adalah layanan pendeteksi spam terpusat yang mengevaluasi publikasi masuk dan memberikan skor risiko. Terdiri dari dua paket:

- **`@bitsocial/spam-blocker-server`** -- server HTTP yang menghosting API evaluasi dan tantangan.
- **`@bitsocial/spam-blocker-challenge`** -- paket klien ringan yang diintegrasikan komunitas untuk mengirim publikasi untuk evaluasi.

**Kode sumber:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Cara Kerja Penilaian Risiko

Setiap publikasi yang dikirimkan ke titik akhir `/evaluate` menerima skor risiko numerik. Skor tersebut merupakan kombinasi tertimbang dari beberapa sinyal:

| Sinyal           | Deskripsi                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Usia akun        | Akun yang lebih baru menerima skor risiko yang lebih tinggi.                                                                                 |
| karma            | Akumulasi karma komunitas mengurangi risiko.                                                                                                 |
| Reputasi penulis | Data reputasi dikumpulkan oleh pengindeks jaringan latar belakang.                                                                           |
| Analisis isi     | Heuristik tingkat teks (kepadatan tautan, pola spam yang diketahui, dll.).                                                                   |
| Kecepatan        | Postingan cepat yang berurutan dari penulis yang sama meningkatkan risiko.                                                                   |
| Kecerdasan IP    | Pencarian geolokasi dan ancaman tingkat negara. Hanya kode negara yang disimpan -- alamat IP mentah tidak pernah dibagikan kepada komunitas. |

## Ambang Batas Tingkat

Skor risiko dipetakan ke salah satu dari empat tingkatan yang dapat dikonfigurasi yang menentukan apa yang terjadi selanjutnya:

1. **Terima otomatis** -- skor cukup rendah sehingga publikasi disetujui tanpa tantangan apa pun.
2. **OAuth-sufficient** -- penulis harus menyelesaikan verifikasi OAuth untuk melanjutkan.
3. **OAuth-plus-more** -- OAuth saja tidak cukup; verifikasi tambahan (misalnya, CAPTCHA) diperlukan.
4. **Tolak otomatis** -- skor terlalu tinggi; publikasinya ditolak mentah-mentah.

Semua nilai ambang batas dapat dikonfigurasi per komunitas.

## Aliran Tantangan

Saat publikasi masuk ke tingkat yang memerlukan verifikasi, alur tantangan dimulai:

1. Penulis pertama-tama diminta untuk mengautentikasi melalui **OAuth** (GitHub, Google, Twitter, dan penyedia lain yang didukung).
2. Jika OAuth saja tidak mencukupi (tingkat 3), **penggantian CAPTCHA** yang didukung oleh Cloudflare Turnstile akan disajikan.
3. Identitas OAuth hanya digunakan untuk verifikasi -- identitas ini **tidak pernah dibagikan** dengan komunitas atau pengguna lain.

## Titik Akhir API

### `POST /evaluate`

Kirimkan publikasi untuk evaluasi risiko. Mengembalikan skor risiko yang dihitung dan tingkat tantangan yang diperlukan.

### `POST /challenge/verify`

Kirimkan hasil tantangan yang telah diselesaikan (token OAuth, solusi CAPTCHA, atau keduanya) untuk verifikasi.

### `GET /iframe/:sessionId`

Mengembalikan halaman HTML yang dapat disematkan yang menampilkan UI tantangan yang sesuai untuk sesi tertentu.

## Pembatasan Nilai

Batasan tarif diterapkan secara dinamis berdasarkan usia dan reputasi penulis. Penulis yang lebih baru atau bereputasi lebih rendah menghadapi batasan yang lebih ketat, sementara penulis yang sudah mapan menikmati batasan yang lebih luas. Hal ini mencegah banjir spam tanpa memberikan sanksi kepada peserta tepercaya.

## Pengindeks Jaringan Latar Belakang

Server menjalankan pengindeks latar belakang yang terus merayapi jaringan untuk membangun dan memelihara data reputasi penulis. Data ini dimasukkan langsung ke dalam jalur penilaian risiko, sehingga memungkinkan sistem untuk mengenali peserta yang berulang kali mempunyai niat baik di seluruh komunitas.

## Privasi

Pemblokir Spam dirancang dengan mempertimbangkan privasi:

- Identitas OAuth hanya digunakan untuk verifikasi tantangan dan **tidak pernah diungkapkan** kepada komunitas.
- Alamat IP ditetapkan menjadi **kode negara saja**; IP mentah tidak disimpan atau dibagikan.

## Basis data

Server menggunakan **SQLite** (melalui `better-sqlite3`) untuk persistensi lokal data reputasi, status sesi, dan konfigurasi.
