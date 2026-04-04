---
title: Telegram Bots
description: Feed bots që monitorojnë listat e komuniteteve Bitsocial dhe përcjellin postimet në kanalet Telegram.
sidebar_position: 3
---

# Telegram Bots

Bots Bitsocial Telegram monitorojnë listat e komuniteteve të klientëve në rrjetin Bitsocial dhe përcjellin automatikisht postimet e reja në kanalet e Telegramit. Çdo mesazh i përcjellë përfshin butona inline që lidhen me postimin origjinal në 5chan dhe Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Bots në dispozicion

| Bot              | Statusi     | Përshkrimi                                                                     |
| ---------------- | ----------- | ------------------------------------------------------------------------------ |
| **5kanali Feed** | Aktiv       | Monitoron të gjitha drejtoritë 5chan dhe përcjell postimet e reja në Telegram. |
| **Seedit Feed**  | Planifikuar | Do të ofrojë të njëjtin funksionalitet për komunitetet Seedit.                 |

## Konfigurimi

### Parakushtet

- Nyja.js
- fije
- Një token bot i Telegramit (krijo një nëpërmjet [BotFather](https://t.me/BotFather))

### Instalimi

Klononi depon dhe instaloni varësitë:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Konfigurimi

Krijoni një skedar `.env` në rrënjën e projektit me tokenin tuaj të botit:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Vrapimi

Nisni robotin pasi të keni konfiguruar mjedisin tuaj:

```bash
yarn start
```

## Formati i postimit

Kur roboti përcjell një postim në Telegram, ai përfshin dy butona inline:

- **Shiko në 5chan** -- Hap postimin në klientin në internet 5chan.
- **Shiko në Seedit** -- Hap postimin në klientin e uebit të Seedit.

Kjo i lejon abonentët e Telegram-it të kalojnë drejtpërdrejt në temën e plotë të diskutimit për cilindo klient që ata preferojnë.
