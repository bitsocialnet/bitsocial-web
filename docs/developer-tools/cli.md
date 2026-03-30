---
title: CLI
description: Command-line interface for running a Bitsocial node, creating communities, and managing protocol operations.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
This package currently uses legacy naming conventions inherited from its upstream dependency. References to "plebbit" in commands, output, and configuration will be migrated to "bitsocial" in a future release. Functionality is unaffected.
:::

The `bitsocial-cli` is a command-line tool for interacting with the Bitsocial protocol backend. It lets you run a local P2P daemon, create and configure communities, and publish content -- all from the terminal.

It is built on top of `plebbit-js` and is used by [5chan](/apps/5chan/) and [Seedit](/apps/seedit/) for community creation and node management.

## Installation

Pre-built binaries are available for Windows, macOS, and Linux. Download the latest release for your platform from GitHub:

**[Download from GitHub Releases](https://github.com/bitsocialnet/bitsocial-cli/releases)**

After downloading, make the binary executable (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Running the Daemon

The most common use of the CLI is running a Bitsocial node. The daemon starts the P2P networking layer and exposes a local API that clients can connect to.

```bash
bitsocial-cli daemon
```

On first launch, the daemon outputs links to the **WebUI**, a browser-based graphical interface for managing your node, communities, and settings. This is useful if you prefer a GUI over terminal commands.

## Key Commands

| Command | Description |
|---|---|
| `daemon` | Start the Bitsocial P2P node |
| `create subplebbit` | Create a new community |
| `subplebbit edit` | Update community settings (title, description, rules) |
| `subplebbit list` | List communities hosted on this node |
| `subplebbit start` | Start serving a specific community |
| `subplebbit stop` | Stop serving a specific community |

Run any command with `--help` to see available options and flags:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Typical Workflow

A common setup flow for hosting a new community:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

The community is now live on the Bitsocial network and accessible from any compatible client.

## Links

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
