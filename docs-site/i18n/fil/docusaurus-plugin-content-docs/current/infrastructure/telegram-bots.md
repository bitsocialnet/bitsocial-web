---
title: Mga Telegram Bot
description: Magpakain ng mga bot na sumusubaybay sa mga listahan ng komunidad ng Bitsocial at nagpapasa ng mga post sa mga channel ng Telegram.
sidebar_position: 3
---

# Mga Telegram Bot

Sinusubaybayan ng mga bot ng Bitsocial Telegram ang mga listahan ng komunidad ng kliyente sa network ng Bitsocial at awtomatikong nagpapasa ng mga bagong post sa mga channel ng Telegram. Kasama sa bawat ipinasa na mensahe ang mga inline na button na nagli-link pabalik sa orihinal na post sa 5chan at Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Magagamit na mga Bot

| Bot             | Katayuan | Paglalarawan                                                                                 |
| --------------- | -------- | -------------------------------------------------------------------------------------------- |
| **5chan Feed**  | Aktibo   | Sinusubaybayan ang lahat ng 5chan na direktoryo at nagpapasa ng mga bagong post sa Telegram. |
| **Seedit Feed** | Binalak  | Magbibigay ng parehong functionality para sa mga komunidad ng Seedit.                        |

## Setup

### Mga kinakailangan

- Node.js
- Sinulid
- Isang Telegram bot token (lumikha ng isa sa pamamagitan ng [BotAma](https://t.me/BotFather))

### Pag-install

I-clone ang repositoryo at i-install ang mga dependency:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Configuration

Gumawa ng `.env` file sa root ng proyekto gamit ang iyong bot token:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Tumatakbo

Simulan ang bot pagkatapos i-configure ang iyong kapaligiran:

```bash
yarn start
```

## Format ng Post

Kapag nagpasa ang bot ng isang post sa Telegram, may kasama itong dalawang inline na button:

- **Tingnan sa 5chan** -- Binubuksan ang post sa 5chan web client.
- **Tingnan sa Seedit** -- Binubuksan ang post sa Seedit web client.

Nagbibigay-daan ito sa mga subscriber ng Telegram na direktang tumalon sa buong thread ng talakayan sa alinmang kliyente na gusto nila.
