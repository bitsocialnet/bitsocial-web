---
title: Telegram Bots
description: Feed bots that monitor Bitsocial community lists and forward posts to Telegram channels.
sidebar_position: 3
---

# Telegram Bots

The Bitsocial Telegram bots monitor client community lists on the Bitsocial network and automatically forward new posts into Telegram channels. Each forwarded message includes inline buttons that link back to the original post on 5chan and Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Available Bots

| Bot | Status | Description |
|-----|--------|-------------|
| **5chan Feed** | Active | Monitors all 5chan directories and forwards new posts to Telegram. |
| **Seedit Feed** | Planned | Will provide the same functionality for Seedit communities. |

## Setup

### Prerequisites

- Node.js
- Yarn
- A Telegram bot token (create one via [BotFather](https://t.me/BotFather))

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Configuration

Create a `.env` file in the project root with your bot token:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Running

Start the bot after configuring your environment:

```bash
yarn start
```

## Post Format

When the bot forwards a post to Telegram, it includes two inline buttons:

- **View on 5chan** -- Opens the post in the 5chan web client.
- **View on Seedit** -- Opens the post in the Seedit web client.

This lets Telegram subscribers jump directly to the full discussion thread on whichever client they prefer.
