---
title: Bots de télégramme
description: Alimentez les robots qui surveillent les listes de la communauté Bitsocial et transfèrent les publications vers les chaînes Telegram.
sidebar_position: 3
---

# Bots de télégramme

Les robots Bitsocial Telegram surveillent les listes de communautés de clients sur le réseau Bitsocial et transfèrent automatiquement les nouvelles publications vers les canaux Telegram. Chaque message transféré comprend des boutons en ligne qui renvoient à la publication d'origine sur 5chan et Seedit.

- **GitHub** : [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Bots disponibles

| Bot             | Statut | Descriptif                                                                              |
| --------------- | ------ | --------------------------------------------------------------------------------------- |
| **Flux 5chan**  | Actif  | Surveille tous les répertoires 5chan et transmet les nouvelles publications à Telegram. |
| **Flux Seedit** | Prévu  | Fournit la même fonctionnalité pour les communautés Seedit.                             |

## Configuration

### Conditions préalables

- Noeud.js
- Fil
- Un jeton de bot Telegram (créez-en un via [BotPère](https://t.me/BotFather))

### Mise en place

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Configuration

Créez un fichier `.env` à la racine du projet avec votre jeton de bot :

```env
BOT_TOKEN=your_telegram_bot_token
```

### Courir

Démarrez le bot après avoir configuré votre environnement :

```bash
yarn start
```

## Format du message

Lorsque le bot transfère une publication à Telegram, il comprend deux boutons en ligne :

- **Afficher sur 5chan** -- Ouvre la publication dans le client Web 5chan.
- **Afficher sur Seedit** -- Ouvre la publication dans le client Web Seedit.

Cela permet aux abonnés de Telegram d'accéder directement au fil de discussion complet sur le client qu'ils préfèrent.
