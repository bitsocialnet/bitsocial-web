---
title: Seedit
description: A serverless, decentralized Reddit-style forum built on the Bitsocial protocol where anyone can create and own communities.
sidebar_position: 2
---

# Seedit

Seedit is a serverless, adminless, and fully decentralized alternative to old-style Reddit, built on the Bitsocial protocol. It gives users complete ownership over their communities — anyone can create one, and multiple communities can compete for the same short route, such as `/s/funny`.

## Downloads

| Platform  | Link                                             |
| --------- | ------------------------------------------------ |
| Web       | [seedit.app](https://seedit.app)                 |
| Web (ENS) | `seedit.eth` via Brave browser or IPFS Companion |
| Desktop   | Available for Mac, Windows, and Linux            |
| Mobile    | Available for Android                            |

## How communities work

Seedit organizes content into communities similar to subreddits. Each community is owned by its creator and operates without centralized administration. Multiple communities can compete for the same [directory](/directories/) route, such as `/s/funny`, which opens the current winner. Subscriptions and post links always point to the exact community.

### Creating a community

There are two ways to create a new community:

1. **Desktop client** — Use the built-in GUI in the desktop application to set up and configure your community.
2. **bitsocial-cli** — Run the CLI tool to create and manage communities from the command line.

### Default community list

New accounts subscribe to a default list of exact communities defined in `seedit-default-subscriptions.json` in the [bitsocialnet/lists](https://github.com/bitsocialnet/lists) repository. Directory candidates are listed in `seedit-directories/seedit-<code>-directory.json` files in the same repository. To add your community to either list, submit a pull request with your community's details.

## Links

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **License**: GPL-2.0-only
