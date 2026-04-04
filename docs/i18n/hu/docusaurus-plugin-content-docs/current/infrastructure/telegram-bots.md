---
title: Telegram Bots
description: Feed botok, amelyek figyelik a Bitsocial közösségi listákat, és továbbítják a bejegyzéseket a Telegram csatornáknak.
sidebar_position: 3
---

# Telegram Bots

A Bitsocial Telegram robotok figyelik a Bitsocial hálózat kliensközösségi listáit, és automatikusan továbbítják az új bejegyzéseket a Telegram csatornákra. Minden továbbított üzenet tartalmaz beágyazott gombokat, amelyek az 5chan és a Seedit eredeti bejegyzésére hivatkoznak.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Elérhető Botok

| Bot                        | Állapot   | Leírás                                                                               |
| -------------------------- | --------- | ------------------------------------------------------------------------------------ |
| **5 csatorna hírcsatorna** | Aktív     | Figyeli az összes 5chan könyvtárat, és továbbítja az új bejegyzéseket a Telegramnak. |
| **Seedit feed**            | Tervezett | Ugyanazt a funkcionalitást fogja biztosítani a Seedit közösségek számára.            |

## Beállítás

### Előfeltételek

- Node.js
- Fonal
- Telegram bot token (hozzon létre egyet a [BotFather](https://t.me/BotFather) segítségével)

### Telepítés

A tár klónozása és a függőségek telepítése:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Konfiguráció

Hozzon létre egy `.env` fájlt a projekt gyökérjében a bot tokennel:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Futás

Indítsa el a botot a környezet konfigurálása után:

```bash
yarn start
```

## Hozzászólás formátuma

Amikor a bot továbbít egy bejegyzést a Telegramnak, két soron belüli gombot tartalmaz:

- **Megtekintés az 5chan-on** – Megnyitja a bejegyzést az 5chan webkliensben.
- **Megtekintés a Seediten** – Megnyitja a bejegyzést a Seedit webkliensben.

Ez lehetővé teszi a Telegram-előfizetők számára, hogy közvetlenül a teljes vitaszálra ugorjanak, amelyik kliensről szeretnek.
