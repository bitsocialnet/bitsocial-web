---
title: CLI
description: Kommandolinjegrænseflade til at køre en Bitsocial-node, oprette fællesskaber og administrere protokoloperationer.
sidebar_position: 2
---

# CLI

:::warning Ældre navngivning
Denne pakke bruger i øjeblikket ældre navngivningskonventioner, der er arvet fra dens opstrømsafhængighed. Referencer til "plebbit" i kommandoer, output og konfiguration vil blive migreret til "bitsocial" i en fremtidig udgivelse. Funktionaliteten er upåvirket.
:::

`bitsocial-cli` er et kommandolinjeværktøj til at interagere med Bitsocial-protokollens backend. Det giver dig mulighed for at køre en lokal P2P-dæmon, oprette og konfigurere fællesskaber og udgive indhold -- alt sammen fra terminalen.

Det er bygget oven på `plebbit-js` og bruges af [5chan](/apps/5chan/) og [Seedit](/apps/seedit/) til oprettelse af fællesskaber og nodeadministration.

## Installation

Forudbyggede binarer er tilgængelige til Windows, mac og mac. Download den seneste udgivelse til din platform fra GitHub:

**[Download fra GitHub-udgivelser](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Efter download skal du gøre den binære eksekverbare (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Køring af Daemon

Den mest almindelige brug af CLI er at køre en Bitsocial node. Dæmonen starter P2P-netværkslaget og afslører en lokal API, som klienter kan oprette forbindelse til.

```bash
bitsocial-cli daemon
```

Ved første lancering udsender dæmonen links til **WebUI**, en browserbaseret grafisk grænseflade til styring af din node, fællesskaber og indstillinger. Dette er nyttigt, hvis du foretrækker en GUI frem for terminalkommandoer.

## Nøglekommandoer

| Kommando            | Beskrivelse                                                   |
| ------------------- | ------------------------------------------------------------- |
| `daemon`            | Start Bitsocial P2P-knuden                                    |
| `create subplebbit` | Opret et nyt fællesskab                                       |
| `subplebbit edit`   | Opdater fællesskabsindstillinger (titel, beskrivelse, regler) |
| `subplebbit list`   | Liste over fællesskaber, der er hostet på denne node          |
| `subplebbit start`  | Begynd at tjene et bestemt fællesskab                         |
| `subplebbit stop`   | Stop med at tjene et bestemt samfund                          |

Kør en hvilken som helst kommando med `--help` for at se tilgængelige indstillinger og flag:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Typisk arbejdsgang

Et almindeligt opsætningsforløb for at være vært for et nyt fællesskab:

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

Fællesskabet er nu kompatibelt fra ethvert netværk, der er tilgængeligt fra ethvert Bitsocial-netværk. klient.

## Links

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
