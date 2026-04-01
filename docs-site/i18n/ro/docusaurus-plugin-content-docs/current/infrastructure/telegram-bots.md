---
title: Telegram Bots
description: Feed bots care monitorizează listele comunității Bitsocial și trimit postări către canalele Telegram.
sidebar_position: 3
---

# Telegram Bots

Boții Bitsocial Telegram monitorizează listele comunității de clienți de pe rețeaua Bitsocial și trimit automat noi postări pe canalele Telegram. Fiecare mesaj redirecționat include butoane inline care se leagă înapoi la postarea originală pe 5chan și Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Boți disponibili

| Bot                  | Stare      | Descriere                                                                           |
| -------------------- | ---------- | ----------------------------------------------------------------------------------- |
| **Feed de 5 canale** | Activ      | Monitorizează toate directoarele cu 5 canale și trimite postări noi către Telegram. |
| **Seedit Feed**      | Planificat | Va oferi aceeași funcționalitate pentru comunitățile Seedit.                        |

## Înființat

### Cerințe preliminare

- Node.js
- Fire
- Un jeton de bot Telegram (creați unul prin [Tatăl Bot](https://t.me/BotFather))

### Instalare

Clonează depozitul și instalează dependențe:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Configurare

Creați un fișier `.env` în rădăcina proiectului cu simbolul dvs. bot:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Funcţionare

Porniți botul după configurarea mediului dvs.:

```bash
yarn start
```

## Format post

Când botul trimite o postare către Telegram, aceasta include două butoane în linie:

- **Vizualizare pe 5chan** -- Deschide postarea în clientul web 5chan.
- **Vizualizare pe Seedit** -- Deschide postarea în clientul web Seedit.

Acest lucru le permite abonaților Telegram să sară direct la firul de discuții complet despre orice client preferă.
