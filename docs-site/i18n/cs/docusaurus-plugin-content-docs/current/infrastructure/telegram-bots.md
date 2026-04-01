---
title: Telegramové roboty
description: Vyživujte roboty, kteří monitorují seznamy komunity Bitsocial a přeposílají příspěvky na kanály Telegram.
sidebar_position: 3
---

# Telegramové roboty

Roboti Bitsocial Telegram monitorují seznamy klientských komunit na síti Bitsocial a automaticky přeposílají nové příspěvky do kanálů Telegramu. Každá přeposlaná zpráva obsahuje vložená tlačítka, která odkazují zpět na původní příspěvek na 5chan a Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Dostupné roboty

| Bot                 | Stav      | Popis                                                                      |
| ------------------- | --------- | -------------------------------------------------------------------------- |
| **5kanálový kanál** | Aktivní   | Monitoruje všechny 5chan adresáře a přeposílá nové příspěvky do telegramu. |
| **Seedit Feed**     | Plánováno | Poskytne stejnou funkcionalitu komunitám Seedit.                           |

## Nastavení

### Předpoklady

- Node.js
- Příze
- Token telegramového bota (vytvořte jej prostřednictvím [Oba Otec](https://t.me/BotFather))

### Instalace

Klonujte úložiště a nainstalujte závislosti:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Konfigurace

Vytvořte soubor `.env` v kořenovém adresáři projektu pomocí tokenu bota:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Běh

Spusťte robota po konfiguraci prostředí:

```bash
yarn start
```

## Formát příspěvku

Když robot předá příspěvek do Telegramu, obsahuje dvě vložená tlačítka:

- **View on 5chan** – Otevře příspěvek ve webovém klientovi 5chan.
- **Zobrazit na Seedit** – Otevře příspěvek ve webovém klientovi Seedit.

To umožňuje předplatitelům Telegramu přejít přímo na celé diskusní vlákno na libovolném klientovi, který preferují.
