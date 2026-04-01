---
title: CLI
description: Antarmuka baris perintah untuk menjalankan node Bitsocial, membuat komunitas, dan mengelola operasi protokol.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
Paket ini saat ini menggunakan konvensi penamaan lama yang diwarisi dari ketergantungan upstreamnya. Referensi ke "plebbit" dalam perintah, keluaran, dan konfigurasi akan dimigrasikan ke "bitsocial" pada rilis mendatang. Fungsionalitas tidak terpengaruh.
:::

`bitsocial-cli` adalah alat baris perintah untuk berinteraksi dengan backend protokol Bitsocial. Ini memungkinkan Anda menjalankan daemon P2P lokal, membuat dan mengkonfigurasi komunitas, dan mempublikasikan konten -- semuanya dari terminal.

Itu dibangun di atas `plebbit-js` dan digunakan oleh [5chan](/apps/5chan/) dan [edit benih](/apps/seedit/) untuk pembuatan komunitas dan pengelolaan node.

## Instalasi

Biner bawaan tersedia untuk Windows, macOS, dan Linux. Unduh rilis terbaru untuk platform Anda dari GitHub:

**[Unduh dari Rilis GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Setelah mengunduh, buat binernya dapat dieksekusi (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Menjalankan Daemon

Penggunaan CLI yang paling umum adalah menjalankan node Bitsocial. Daemon memulai lapisan jaringan P2P dan menampilkan API lokal yang dapat dihubungkan oleh klien.

```bash
bitsocial-cli daemon
```

Pada peluncuran pertama, daemon mengeluarkan tautan ke **WebUI**, antarmuka grafis berbasis browser untuk mengelola node, komunitas, dan pengaturan Anda. Ini berguna jika Anda lebih memilih GUI daripada perintah terminal.

## Perintah Kunci

| Perintah            | Deskripsi                                                |
| ------------------- | -------------------------------------------------------- |
| `daemon`            | Mulai simpul P2P Bitsocial                               |
| `create subplebbit` | Buat komunitas baru                                      |
| `subplebbit edit`   | Perbarui pengaturan komunitas (judul, deskripsi, aturan) |
| `subplebbit list`   | Daftar komunitas yang dihosting di node ini              |
| `subplebbit start`  | Mulai melayani komunitas tertentu                        |
| `subplebbit stop`   | Berhenti melayani komunitas tertentu                     |

Jalankan perintah apa pun dengan `--help` untuk melihat opsi dan tanda yang tersedia:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Alur Kerja Khas

Alur penyiapan umum untuk menghosting komunitas baru:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

Komunitas tersebut sekarang aktif di jaringan Bitsocial dan dapat diakses dari klien mana pun yang kompatibel.

## Tautan

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
