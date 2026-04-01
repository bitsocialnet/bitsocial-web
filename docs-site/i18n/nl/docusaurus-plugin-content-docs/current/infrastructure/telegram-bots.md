---
title: Telegram Bots
description: Voed bots toe die de Bitsocial-communitylijsten controleren en berichten doorsturen naar Telegram-kanalen.
sidebar_position: 3
---

# Telegram Bots

De Bots van Bitsocial Telegram monitoren de communitylijsten van klanten op het Bitsocial-netwerk en sturen nieuwe berichten automatisch door naar Telegram-kanalen. Elk doorgestuurd bericht bevat inline knoppen die teruglinken naar het originele bericht op 5chan en Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Beschikbare bots

| Bot               | Status                                                   | Beschrijving                                                                 |
| ----------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **5chan Feed**    | Actief                                                   | Bewaakt alle 5chan directory's en stuurt nieuwe berichten door naar Telegram |
| . **Seedit Feed** | . Biedt dezelfde functionaliteit voor Seedit-community's |

## Installatie

### Vereisten

- Node.js
- Yarn
- Een Telegram-bottoken (maak er één via). [BotVader](https://t.me/BotFather))

### Installatie

Kloon de repository en installeer afhankelijkheden:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Configuratie

Maak een `.env`-bestand in de hoofdmap van het project met uw bottoken:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Bezig met uitvoeren

Start de bot na het configureren van uw omgeving:

```bash
yarn start
```

## Berichtformaat

Wanneer de bot een bericht doorstuurt naar Telegram, bevat deze twee inline knoppen:

- **Bekijk op 5chan** -- Opent het bericht in de 5chan-webclient.
- **Bekijk op Seedit** -- Opent het bericht in de Seedit-webclient.

Hiermee kunnen Telegram-abonnees rechtstreeks naar de volledige discussiethread springen op welke client ze ook liever.
