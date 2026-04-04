---
title: Telegram Bots
description: Feed-bots, der overvåger Bitsocial-fællesskabslister og videresender indlæg til Telegram-kanaler.
sidebar_position: 3
---

# Telegram Bots

Bitsocial Telegram-botterne overvåger klientfællesskabslister på Bitsocial-netværket og videresender automatisk nye indlæg til Telegram-kanaler. Hver videresendt besked indeholder inline-knapper, der linker tilbage til det oprindelige indlæg på 5chan og Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Tilgængelige bots

| Bot             | Status   | Beskrivelse                                                          |
| --------------- | -------- | -------------------------------------------------------------------- |
| **5chan feed**  | Aktiv    | Overvåger alle 5chan-mapper og videresender nye indlæg til Telegram. |
| **Seedit Feed** | Planlagt | Vil give den samme funktionalitet til Seedit-fællesskaber.           |

## Opsætning

### Forudsætninger

- Node.js
- Garn
- Et Telegram bot-token (opret et via [BotFather](https://t.me/BotFather))

### Installation

Klon depotet og installer afhængigheder:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Konfiguration

Opret en `.env`-fil i projektroden med dit bot-token:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Løb

Start botten efter at have konfigureret dit miljø:

```bash
yarn start
```

## Indlægsformat

Når botten videresender et indlæg til Telegram, inkluderer det to inline-knapper:

- **Se på 5chan** -- Åbner indlægget i 5chan-webklienten.
- **Se på Seedit** -- Åbner indlægget i Seedit-webklienten.

Dette lader Telegram-abonnenter hoppe direkte til den fulde diskussionstråd på den klient, de foretrækker.
