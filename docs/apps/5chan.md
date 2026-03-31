---
title: 5chan
description: A serverless, decentralized imageboard built on the Bitsocial protocol where anyone can create and own boards.
sidebar_position: 1
---

:::warning[Legacy naming]
This project's codebase still uses the legacy "plebbit" naming from before the Bitsocial rebrand. Package names, API references, and some internal terminology will be updated in a future release. The functionality described here is current — only the naming is outdated.
:::

# 5chan

5chan is a serverless, adminless, and fully decentralized imageboard that runs on the Bitsocial protocol. It follows the familiar imageboard directory structure while introducing decentralized ownership — anyone can create a board, and multiple boards can compete for the same directory slot through a voting mechanism.

## Downloads

| Platform | Link                                  |
| -------- | ------------------------------------- |
| Web      | [5chan.app](https://5chan.app)        |
| Desktop  | Available for Mac, Windows, and Linux |
| Mobile   | Available for Android                 |

## How boards work

5chan organizes content into boards using a classic directory layout (e.g., `/b/`, `/g/`). Unlike traditional imageboards where a central admin controls every board, 5chan allows any user to create and fully own their own board. When multiple boards target the same directory slot, they compete for that position through voting.

### Creating a board

To create a new board, you need to run `bitsocial-cli` as a peer-to-peer node. This ensures your board is hosted in a decentralized manner without relying on any central server.

### Directory assignments

Directory slot assignments (which board appears at which path) are currently managed through GitHub pull requests to the `5chan-directories.json` file. This is a temporary process — future releases will support in-app board creation and pubsub-based voting to handle directory assignments automatically.

## Internals

Under the hood, 5chan uses the plebbit-js API layer for its protocol interactions. As noted in the warning above, these internal references still carry legacy naming that predates the Bitsocial rebrand.

## Links

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **License**: GPL-2.0-only
