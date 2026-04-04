---
title: Captcha Canvas Challenge
description: Generator captcha berbasis gambar mandiri dengan karakter, dimensi, dan warna yang dapat dikonfigurasi.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Penamaan Warisan
Paket ini awalnya diterbitkan dalam lingkup `@plebbit`. Telah diubah namanya menjadi `@bitsocial/captcha-canvas-challenge`. Referensi ke nama lama mungkin masih muncul di dokumentasi atau basis kode lama.
:::

Captcha Canvas Challenge adalah generator captcha gambar mandiri yang awalnya diekstraksi dari `plebbit-js`. Ini merender teks acak ke dalam kanvas HTML dan mengembalikan gambar yang dihasilkan, yang dapat disajikan oleh komunitas kepada penulis sebagai tantangan spam.

**Kode sumber:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Persyaratan

- **Node.js** >= 22
- **Khusus ESM** -- paket ini tidak mengirimkan build CommonJS.
- **Ketergantungan rekan runtime:** `@plebbit/plebbit-js` (bermigrasi ke `@pkc/pkc-js`)

## Instalasi

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Opsi Konfigurasi

| Pilihan      | Jenis    | Bawaan    | Keterangan                                              |
| ------------ | -------- | --------- | ------------------------------------------------------- |
| `characters` | `number` | `6`       | Jumlah karakter acak yang dirender pada gambar captcha. |
| `height`     | `number` | `100`     | Tinggi gambar yang dihasilkan dalam piksel.             |
| `width`      | `number` | `300`     | Lebar gambar yang dihasilkan dalam piksel.              |
| `colors`     | `string` | `#32cf7e` | Warna primer yang digunakan untuk teks captcha.         |

## Cara Kerjanya

1. Generator mengambil string acak dengan panjang yang dikonfigurasi.
2. String dirender ke kanvas dengan noise visual untuk menahan OCR.
3. Gambar yang dihasilkan (dan jawaban yang diharapkan) dikembalikan sehingga aplikasi pemanggil dapat menyajikan tantangan dan kemudian memverifikasi responsnya.

Karena paket ini adalah generator gambar murni, paket ini tidak menangani manajemen jaringan atau sesi sendiri. Hal ini dimaksudkan untuk diintegrasikan ke dalam alur tantangan yang lebih besar -- misalnya, sebagai salah satu jenis tantangan yang didukung oleh [Spam Blocker](./spam-blocker.md).
