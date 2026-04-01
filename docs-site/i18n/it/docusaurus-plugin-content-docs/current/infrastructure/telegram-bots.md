---
title: Bot di Telegram
description: Bot di feed che monitorano gli elenchi delle community di Bitsocial e inoltrano i post ai canali di Telegram.
sidebar_position: 3
---

# Bot di Telegram

I bot Bitsocial Telegram monitorano gli elenchi delle community dei clienti sulla rete Bitsocial e inoltrano automaticamente i nuovi post ai canali Telegram. Ogni messaggio inoltrato include pulsanti in linea che rimandano al post originale su 5chan e Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bot](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Bot disponibili

| Bot                                  | Stato    | Descrizione                                                               |
| ------------------------------------ | -------- | ------------------------------------------------------------------------- |
| **5chan Feed**                       | Attivo   | Monitora tutte le directory e gli inoltri di 5chan nuovi post su Telegram |
| **Mangime per la modifica dei semi** | Previsto | Fornirà la stessa funzionalità per le comunità Seedit.                    |

## Configurazione

### Prerequisiti

- Node.js
- Yarn
- Un token bot di Telegram (creane uno tramite [BotFather](https://t.me/BotFather))

### Installazione

Clona il repository e installa le dipendenze:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Configurazione

Crea un file `.env` nella root del progetto con il token del tuo bot:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Esegui

Avvia il bot dopo aver configurato il tuo ambiente:

```bash
yarn start
```

## Formato post

Quando il bot inoltra un post a Telegram, include due pulsanti in linea:

- **Visualizza su 5chan** -- Apre il post nel client web 5chan.
- **Visualizza su Seedit** -- Apre il post nel client web Seedit.

Questo consente agli abbonati di Telegram di passare direttamente al thread di discussione completo su qualunque client preferiscano.
