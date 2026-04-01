---
title: Tantangan Panggilan Kontrak EVM
description: Tantangan anti-spam yang memverifikasi kondisi on-chain dengan memanggil kontrak pintar EVM.
sidebar_position: 4
---

# Tantangan Panggilan Kontrak EVM

:::warning Legacy Naming
Paket ini awalnya diterbitkan di bawah cakupan `@plebbit`. Telah diubah namanya menjadi `@bitsocial/evm-contract-challenge`. Referensi ke nama lama mungkin masih muncul di dokumentasi atau basis kode lama.
:::

Tantangan Panggilan Kontrak EVM adalah mekanisme anti-spam yang memverifikasi kondisi on-chain sebelum mengizinkan publikasi. Awalnya diekstraksi dari `plebbit-js` sebagai paket mandiri, paket ini memungkinkan pemilik komunitas mewajibkan penulis untuk memenuhi kriteria yang ditentukan kontrak cerdas -- misalnya, memiliki saldo token minimum -- untuk dapat memposting.

**Kode sumber:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Persyaratan

- **Node.js** >= 22
- **Khusus ESM** -- paket ini tidak mengirimkan build CommonJS.
- **Ketergantungan rekan runtime:** `@plebbit/plebbit-js` (bermigrasi ke `@pkc/pkc-js`)

## Instalasi

```bash
npm install @bitsocial/evm-contract-challenge
```

## Opsi Konfigurasi

| Pilihan       | Ketik    | Deskripsi                                                                                       |
| ------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Rantai yang akan dikueri (misalnya, `eth`, `matic`, `avax`).                                    |
| `address`     | `string` | Alamat kontrak pintar untuk dihubungi.                                                          |
| `abi`         | `string` | Fragmen ABI untuk fungsi yang dipanggil.                                                        |
| `condition`   | `string` | Ekspresi perbandingan yang dievaluasi terhadap nilai pengembalian kontrak (misalnya, `> 1000`). |
| `error`       | `string` | Pesan kesalahan ditampilkan kepada penulis yang tidak memenuhi ketentuan.                       |

## Contoh

Pemilik komunitas yang ingin membatasi pengeposan kepada penulis yang memiliki lebih dari 1.000 token ERC-20 tertentu akan mengonfigurasi tantangan tersebut dengan:

- `chainTicker`: `"eth"`
- `address`: alamat kontrak token
- `abi`: ABI untuk `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Saat penulis mencoba menerbitkan, tantangan memanggil `balanceOf` dengan alamat penulis dan memeriksa apakah nilai yang dikembalikan memenuhi ketentuan. Jika ya, publikasi akan dilanjutkan; jika tidak, pesan kesalahan yang dikonfigurasi akan dikembalikan.

## Kapan Menggunakannya

Tantangan Panggilan Kontrak EVM sangat ideal untuk:

- **Komunitas dengan gerbang token** yang membatasi postingan hanya untuk pemegang token.
- **Akses dengan gerbang NFT** yang memerlukan kepemilikan NFT tertentu.
- **Ruang tata kelola DAO** yang partisipasinya terbatas pada pemegang token tata kelola.

Untuk komunitas yang tidak bergantung pada identitas on-chain, pertimbangkan [Pemblokiran Spam](./spam-blocker.md) atau [Tantangan Voucher](./voucher-challenge.md) sebagai gantinya.
