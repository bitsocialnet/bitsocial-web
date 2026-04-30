---
title: CLI
description: Command-line interface for running a Bitsocial node, creating communities, and managing protocol operations.
sidebar_position: 2
---

# CLI

The `bitsocial-cli` is a command-line tool for interacting with the Bitsocial protocol backend. It lets you run a local P2P daemon, create and configure communities, and publish content -- all from the terminal.

It is built on top of the shared Bitsocial protocol client layer and is used by [5chan](/apps/5chan/) and [Seedit](/apps/seedit/) for community creation and node management.

## Installation

Pre-built binaries are available for Windows, macOS, and Linux. Download the latest release for your platform from GitHub:

**[Download from GitHub Releases](https://github.com/bitsocialnet/bitsocial-cli/releases)**

After downloading, make the binary executable (macOS/Linux):

```bash
chmod +x bitsocial
```

## Running the Daemon

The most common use of the CLI is running a Bitsocial node. The daemon starts the P2P networking layer and exposes a local API that clients can connect to.

```bash
bitsocial daemon
```

On first launch, the daemon outputs links to the **WebUI**, a browser-based graphical interface for managing your node, communities, and settings. This is useful if you prefer a GUI over terminal commands.

## Key Actions

| Action                 | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| Start the daemon       | Launch the Bitsocial P2P node                         |
| Create a community     | Create a new community                                |
| Edit a community       | Update community settings (title, description, rules) |
| List local communities | List communities hosted on this node                  |
| Start a community      | Start serving a specific community                    |
| Stop a community       | Stop serving a specific community                     |

Run the CLI with `--help` to see the current command names and flags exposed by your installed release:

```bash
bitsocial --help
bitsocial daemon --help
```

## Typical Workflow

A common setup flow for hosting a new community:

```bash
# 1. Start the daemon
bitsocial daemon

# 2. In another terminal, inspect the available community-management commands
bitsocial --help
```

From there, use the installed release's community-management commands to create, configure, and start serving a community. Once started, the community is live on the Bitsocial network and accessible from compatible clients.

## Links

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
