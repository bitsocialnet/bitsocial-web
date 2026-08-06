---
title: 5chan
description: A serverless, decentralized imageboard built on the Bitsocial protocol where anyone can create and own boards.
sidebar_position: 1
---

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

Under the hood, 5chan uses the shared Bitsocial protocol client layer for its network interactions.
The web app at 5chan.app runs a Helia node in the browser by default, so a normal tab joins the
network as a peer: it loads boards from other peers and publishes over pubsub, with no centralized
IPFS gateway in the content path. See [Browser Peer-to-Peer](/browser-p2p/) for what that
involves and what a browser node still cannot do.

## Links

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **License**: GPL-2.0-only
