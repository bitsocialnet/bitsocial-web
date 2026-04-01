---
title: CLI
description: Interfaccia della riga di comando per eseguire un nodo Bitsocial, creare comunità e gestire le operazioni del protocollo.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
Questo pacchetto attualmente utilizza convenzioni di denominazione legacy ereditate dalla sua dipendenza upstream. I riferimenti a "plebbit" nei comandi, nell'output e nella configurazione verranno migrati in "bitsocial" in una versione futura. La funzionalità non è influenzata.
:::

`bitsocial-cli` è uno strumento da riga di comando per interagire con il backend del protocollo Bitsocial. Ti consente di eseguire un demone P2P locale, creare e configurare comunità e pubblicare contenuti, tutto dal terminale.

È basato su `plebbit-js` ed è utilizzato da [5chan](/apps/5chan/) e [Semina](/apps/seedit/) per la creazione di comunità e la gestione dei nodi.

## Installazione

I binari predefiniti sono disponibili per Windows, macOS e Linux. Scarica l'ultima versione per la tua piattaforma da GitHub:

**[Scarica da GitHub Versioni](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Dopo il download, rendi eseguibile il binario (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Eseguire il demone

L'uso più comune della CLI è l'esecuzione di un nodo Bitsocial. Il demone avvia il livello di rete P2P ed espone un'API locale a cui i client possono connettersi.

```bash
bitsocial-cli daemon
```

Al primo avvio, il demone genera collegamenti a **WebUI**, un'interfaccia grafica basata su browser per la gestione del nodo, delle comunità e delle impostazioni. Ciò è utile se si preferisce una GUI rispetto ai comandi del terminale.

## Comandi chiave

| Comando             |                                                       |
| ------------------- | ----------------------------------------------------- |
|                     |
| `create subplebbit` | Create a new community                                |
| `subplebbit edit`   | Update community settings (title, description, rules) |
| `subplebbit list`   | List communities hosted on this node                  |
| `subplebbit start`  | Start serving a specific community                    |
| `subplebbit stop`   | . Smetti di servire una comunità specifica            |

Esegui qualsiasi comando con `--help` per vedere le opzioni e i flag disponibili:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Flusso di lavoro tipico

Un flusso di configurazione comune per ospitare una nuova comunità:

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

La comunità è ora attiva sulla rete Bitsocial ed è accessibile da qualsiasi client compatibile.

## Link

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
