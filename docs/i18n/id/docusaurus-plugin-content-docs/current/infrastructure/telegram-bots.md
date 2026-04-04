---
title: Telegram Bots
description: Bot umpan yang memantau daftar komunitas Bitsocial dan meneruskan postingan ke saluran Telegram.
sidebar_position: 3
---

# Telegram Bots

Bot Bitsocial Telegram memantau daftar komunitas klien di jaringan Bitsocial dan secara otomatis meneruskan postingan baru ke saluran Telegram. Setiap pesan yang diteruskan menyertakan tombol sebaris yang menghubungkan kembali ke postingan asli di 5chan dan Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Bot yang Tersedia

| Bot                  | Status    | Keterangan                                                            |
| -------------------- | --------- | --------------------------------------------------------------------- |
| **Umpan 5chan**      | Aktif     | Pantau semua direktori 5chan dan teruskan postingan baru ke Telegram. |
| **Umpan Edit Benih** | Berencana | Akan menyediakan fungsi yang sama untuk komunitas Seeedit.            |

## Pengaturan

### Prasyarat

- Node.js
- Benang
- Token bot Telegram (buat melalui [BotFather](https://t.me/BotFather))

### Instalasi

Kloning repositori dan instal dependensi:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Konfigurasi

Buat file `.env` di root proyek dengan token bot Anda:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Berlari

Mulai bot setelah mengonfigurasi lingkungan Anda:

```bash
yarn start
```

## Format Postingan

Saat bot meneruskan postingan ke Telegram, ada dua tombol sebaris:

- **Lihat di 5chan** -- Membuka postingan di klien web 5chan.
- **Lihat di Seedit** -- Membuka postingan di klien web Seedit.

Hal ini memungkinkan pelanggan Telegram langsung beralih ke rangkaian diskusi lengkap tentang klien mana pun yang mereka sukai.
