---
title: Bots de Telegramas
description: Feed bots que monitorean las listas de la comunidad Bitsocial y reenvían publicaciones a los canales de Telegram.
sidebar_position: 3
---

# Bots de Telegramas

Los bots de Bitsocial Telegram monitorean las listas de comunidades de clientes en la red Bitsocial y reenvían automáticamente nuevas publicaciones a los canales de Telegram. Cada mensaje reenviado incluye botones en línea que enlazan con la publicación original en 5chan y Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Bots disponibles

| Robot                     | Estado      | Descripción                                                                         |
| ------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| **Alimentación de 5chan** | Activo      | Supervisa todos los directorios de 5chan y reenvía nuevas publicaciones a Telegram. |
| **Seeditar feed**         | Planificado | Proporcionará la misma funcionalidad para las comunidades Seedit.                   |

## Configuración

### Requisitos previos

- Nodo.js
- hilo
- Un token de bot de Telegram (crea uno a través de [BotPadre](https://t.me/BotFather))

### Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Configuración

Cree un archivo `.env` en la raíz del proyecto con su token de bot:

```env
BOT_TOKEN=your_telegram_bot_token
```

### corriendo

Inicie el bot después de configurar su entorno:

```bash
yarn start
```

## Formato de publicación

Cuando el bot reenvía una publicación a Telegram, incluye dos botones en línea:

- **Ver en 5chan**: abre la publicación en el cliente web de 5chan.
- **Ver en Seedit**: abre la publicación en el cliente web de Seedit.

Esto permite a los suscriptores de Telegram ir directamente al hilo de discusión completo en cualquier cliente que prefieran.
