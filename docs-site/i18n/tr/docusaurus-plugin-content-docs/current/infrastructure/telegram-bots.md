---
title: Telgraf Botları
description: Bitsocial topluluk listelerini izleyen ve gönderileri Telegram kanallarına ileten botları besleyin.
sidebar_position: 3
---

# Telgraf Botları

Bitsocial Telegram botları, Bitsocial ağındaki müşteri topluluğu listelerini izliyor ve yeni gönderileri otomatik olarak Telegram kanallarına iletiyor. İletilen her mesaj, 5chan ve Seedit'teki orijinal gönderiye bağlantı sağlayan satır içi düğmeler içerir.

- **GitHub**: [bitsocialnet/bitsocial-telegram-botları](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Mevcut Botlar

| Bot                         | Durum     | Açıklama                                                           |
| --------------------------- | --------- | ------------------------------------------------------------------ |
| **5chan Yayını**            | Aktif     | Tüm 5chan dizinlerini izler ve yeni gönderileri Telegram'a iletir. |
| **Bakış Akışını Düzenleme** | Planlanan | Seedit toplulukları için aynı işlevselliği sağlayacaktır.          |

## Kurmak

### Önkoşullar

- Node.js
- İplik
- Bir Telegram bot jetonu ([BotBaba](https://t.me/BotFather)) aracılığıyla bir tane oluşturun)

### Kurulum

Depoyu klonlayın ve bağımlılıkları yükleyin:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Yapılandırma

Bot jetonunuzla proje kökünde bir `.env` dosyası oluşturun:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Koşma

Ortamınızı yapılandırdıktan sonra botu başlatın:

```bash
yarn start
```

## Gönderi Formatı

Bot Telegram'a bir gönderi ilettiğinde iki satır içi düğme içerir:

- **5chan'da görüntüle** -- Gönderiyi 5chan web istemcisinde açar.
- **Seedit'te görüntüle** -- Gönderiyi Seedit web istemcisinde açar.

Bu, Telegram abonelerinin tercih ettikleri istemcideki tartışma konusunun tamamına doğrudan atlamalarına olanak tanır.
