---
title: Voucher Challenge
description: Tantangan anti-spam yang menjadi gerbang penerbitan di balik kode voucher unik yang didistribusikan oleh pemilik komunitas.
sidebar_position: 3
---

# Voucher Challenge

Tantangan Voucher adalah mekanisme anti-spam yang membuka gerbang publikasi konten di balik kode voucher unik. Daripada mengandalkan deteksi otomatis, hal ini mengalihkan kepercayaan kepada pemilik komunitas, yang secara manual mendistribusikan kode kepada orang-orang yang mereka percayai.

**Kode sumber:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Cara Kerjanya

1. Pemilik komunitas menghasilkan satu atau lebih kode voucher unik.
2. Pemilik mendistribusikan kode tersebut kepada penulis tepercaya melalui saluran pilihan mereka (pesan langsung, email, tatap muka, dll.).
3. Ketika seorang penulis mencoba untuk mempublikasikan, sistem tantangan meminta mereka untuk memberikan kode voucher.
4. Kode telah divalidasi -- jika kode tersebut asli dan belum pernah digunakan, maka publikasinya diterima.

Setiap kode voucher terikat pada penulis tertentu setelah ditukarkan, sehingga mencegah penggunaan kembali oleh orang lain.

## Kapan Menggunakannya

Tantangan Voucher paling cocok untuk:

- **Komunitas khusus undangan** yang keanggotaannya sengaja dibatasi.
- **Ruang yang dikurasi** tempat pemiliknya secara pribadi memeriksa setiap peserta.
- **Lingkungan dengan kepercayaan tinggi** di mana penilaian spam otomatis tidak diperlukan atau tidak diinginkan.

Karena memerlukan distribusi kode manual, maka tidak berskala ke komunitas terbuka yang besar. Untuk skenario tersebut, pertimbangkan [Spam Blocker](./spam-blocker.md) atau [EVM Contract Call Challenge](./evm-contract-call.md) sebagai gantinya.

## Integrasi

Tantangan Voucher dihubungkan ke antarmuka tantangan yang sama dengan yang digunakan oleh paket anti-spam lainnya di ekosistem Bitsocial. Pemilik komunitas mengaktifkannya melalui pengaturan komunitas mereka, dan tantangan diberikan kepada penulis secara otomatis ketika mereka mencoba memposting.
