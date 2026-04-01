---
title: Telegram-bots
description: Feed-roboter som overvåker Bitsocial-fellesskapslister og videresender innlegg til Telegram-kanaler.
sidebar_position: 3
---

# Telegram-bots

Bitsocial Telegram-robotene overvåker klientfellesskapslister på Bitsocial-nettverket og videresender automatisk nye innlegg til Telegram-kanaler. Hver videresendt melding inkluderer innebygde knapper som lenker tilbake til det opprinnelige innlegget på 5chan og Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Tilgjengelige bots

| Bot               | Status   | Beskrivelse                                                              |
| ----------------- | -------- | ------------------------------------------------------------------------ |
| **5-kanals feed** | Aktiv    | Overvåker alle 5chan-kataloger og videresender nye innlegg til Telegram. |
| **Seedit-feed**   | Planlagt | Vil gi samme funksjonalitet for Seedit-fellesskap.                       |

## Oppsett

### Forutsetninger

- Node.js
- Garn
- Et Telegram bot-token (opprett en via [BotFather](https://t.me/BotFather))

### Installasjon

Klon depotet og installer avhengigheter:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Konfigurasjon

Opprett en `.env`-fil i prosjektroten med bot-tokenet ditt:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Løper

Start boten etter å ha konfigurert miljøet ditt:

```bash
yarn start
```

## Innleggsformat

Når boten videresender et innlegg til Telegram, inkluderer den to innebygde knapper:

- **Se på 5chan** -- Åpner innlegget i 5chan-nettklienten.
- **Se på Seedit** -- Åpner innlegget i Seedit-webklienten.

Dette lar Telegram-abonnenter hoppe direkte til hele diskusjonstråden på hvilken klient de foretrekker.
