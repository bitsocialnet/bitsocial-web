---
title: CLI
description: Kommandoradsgränssnitt för att köra en Bitsocial-nod, skapa gemenskaper och hantera protokolloperationer.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
Det här paketet använder för närvarande äldre namnkonventioner som ärvts från dess uppströmsberoende. Referenser till "plebbit" i kommandon, utdata och konfiguration kommer att migreras till "bitsocial" i en framtida version. Funktionaliteten påverkas inte.
:::

`bitsocial-cli` är ett kommandoradsverktyg för att interagera med Bitsocial-protokollets backend. Den låter dig köra en lokal P2P-demon, skapa och konfigurera gemenskaper och publicera innehåll - allt från terminalen.

Den är byggd ovanpå `plebbit-js` och används av [5chan](/apps/5chan/) och [Seedit](/apps/seedit/) för att skapa community och nodhantering.

## Installation

Förbyggda binärfiler är tillgängliga för Windows, macOS och Linux. Ladda ner den senaste versionen för din plattform från GitHub:

**[Ladda ner från GitHub-versioner](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Efter nedladdning, gör den binära körbar (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Kör Daemon

Den vanligaste användningen av CLI är att köra en Bitsocial-nod. Demonen startar P2P-nätverkslagret och exponerar ett lokalt API som klienter kan ansluta till.

```bash
bitsocial-cli daemon
```

Vid första lanseringen skickar demonen ut länkar till **WebUI**, ett webbläsarbaserat grafiskt gränssnitt för att hantera din nod, gemenskaper och inställningar. Detta är användbart om du föredrar ett GUI framför terminalkommandon.

## Knappkommandon

| Kommando            | Beskrivning                                                    |
| ------------------- | -------------------------------------------------------------- |
| `daemon`            | Starta Bitsocial P2P-noden                                     |
| `create subplebbit` | Skapa en ny gemenskap                                          |
| `subplebbit edit`   | Uppdatera gemenskapsinställningar (titel, beskrivning, regler) |
| `subplebbit list`   | Lista gemenskaper som finns på denna nod                       |
| `subplebbit start`  | Börja tjäna en specifik community                              |
| `subplebbit stop`   | Sluta tjäna en specifik gemenskap                              |

Kör valfritt kommando med `--help` för att se tillgängliga alternativ och flaggor:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Typiskt arbetsflöde

Ett vanligt installationsflöde för att vara värd för en ny community:

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

Gemenskapen är nu live på Bitsocial-nätverket och tillgänglig från alla kompatibla klienter.

## Länkar

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
