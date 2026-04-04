---
title: Telegram Bots
description: Feed bots que supervisen les llistes de la comunitat Bitsocial i reenvien publicacions als canals de Telegram.
sidebar_position: 3
---

# Telegram Bots

Els robots de Bitsocial Telegram controlen les llistes de la comunitat de clients a la xarxa Bitsocial i reenvien automàticament noves publicacions als canals de Telegram. Cada missatge reenviat inclou botons en línia que enllacen a la publicació original a 5chan i Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Bots disponibles

| Bot                  | Estat       | Descripció                                                                         |
| -------------------- | ----------- | ---------------------------------------------------------------------------------- |
| **Feed de 5 canals** | Actiu       | Supervisa tots els directoris de 5 canals i reenvia publicacions noves a Telegram. |
| **Edit Feed**        | Planificada | Proporcionarà la mateixa funcionalitat per a les comunitats de Seedit.             |

## Configuració

### Requisits previs

- Node.js
- Fil
- Un testimoni de bot de Telegram (creeu-ne un mitjançant [BotFather](https://t.me/BotFather)))

### Instal·lació

Clonar el repositori i instal·lar dependències:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Configuració

Creeu un fitxer `.env` a l'arrel del projecte amb el vostre testimoni de bot:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Córrer

Inicieu el bot després de configurar el vostre entorn:

```bash
yarn start
```

## Format de publicació

Quan el bot reenvia una publicació a Telegram, inclou dos botons en línia:

- **Veure a 5chan**: obre la publicació al client web de 5chan.
- **Mostra a Seedit**: obre la publicació al client web de Seedit.

Això permet als subscriptors de Telegram saltar directament al fil de discussió complet del client que prefereixin.
