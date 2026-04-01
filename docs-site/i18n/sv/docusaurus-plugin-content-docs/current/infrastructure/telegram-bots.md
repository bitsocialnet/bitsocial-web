---
title: Telegrambots
description: Flödebots som övervakar Bitsocial-gemenskapslistor och vidarebefordrar inlägg till Telegram-kanaler.
sidebar_position: 3
---

# Telegrambots

Bitsocial Telegram-botarna övervakar klientgemenskapslistor på Bitsocial-nätverket och vidarebefordrar automatiskt nya inlägg till Telegram-kanaler. Varje vidarebefordrat meddelande innehåller inline-knappar som länkar tillbaka till det ursprungliga inlägget på 5chan och Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Tillgängliga bots

| Bot              | Status   | Beskrivning                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------------- |
| **5chan-flöde**  | Aktiv    | Övervakar alla 5chan-kataloger och vidarebefordrar nya inlägg till Telegram. |
| **Seedit-flöde** | Planerad | Kommer att tillhandahålla samma funktionalitet för Seedit-gemenskaper.       |

## Inställning

### Förutsättningar

- Node.js
- Garn
- En Telegram bot-token (skapa en via [BotFather](https://t.me/BotFather))

### Installation

Klona förvaret och installera beroenden:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Konfiguration

Skapa en `.env`-fil i projektroten med din bottoken:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Spring

Starta boten efter att ha konfigurerat din miljö:

```bash
yarn start
```

## Postformat

När boten vidarebefordrar ett inlägg till Telegram innehåller det två inline-knappar:

- **Visa på 5chan** -- Öppnar inlägget i 5chans webbklient.
- **Visa på Seedit** -- Öppnar inlägget i Seedit webbklient.

Detta låter Telegram-prenumeranter hoppa direkt till hela diskussionstråden på vilken klient de föredrar.
