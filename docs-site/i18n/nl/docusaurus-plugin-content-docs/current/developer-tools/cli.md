---
title: CLI
description: Commandoregelinterface voor het uitvoeren van een Bitsocial-knooppunt, het creëren van communities en het beheren van protocolbewerkingen.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
Dit pakket maakt momenteel gebruik van verouderde naamgevingsconventies die zijn overgenomen van de upstream-afhankelijkheid. Verwijzingen naar "plebbit" in opdrachten, uitvoer en configuratie zullen in een toekomstige release worden gemigreerd naar "bitsocial". De functionaliteit blijft onaangetast.
:::

De `bitsocial-cli` is een opdrachtregelprogramma voor interactie met de backend van het Bitsocial-protocol. Hiermee kunt u een lokale P2P-daemon uitvoeren, communities maken en configureren en inhoud publiceren - allemaal vanaf de terminal.

Het is gebouwd bovenop `plebbit-js` en wordt gebruikt door [5chan](/apps/5chan/) en [Zaad](/apps/sedit/) voor het maken van community's en knooppuntbeheer.

## Installatie

Vooraf gebouwde binaire bestanden zijn beschikbaar voor Windows, macOS en Linux. Download de nieuwste release voor uw platform vanaf GitHub:

**[Downloaden van GitHub-releases](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Maak na het downloaden het binaire uitvoerbare bestand (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## De Daemon uitvoeren

Het meest voorkomende gebruik van de CLI is het uitvoeren van een Bitsocial-node. De daemon start de P2P-netwerklaag en biedt een lokale API waarmee clients verbinding kunnen maken.

```bash
bitsocial-cli daemon
```

Bij de eerste keer opstarten voert de daemon links uit naar de **WebUI**, een browsergebaseerde grafische interface voor het beheren van uw knooppunt, communities en instellingen. Dit is handig als u de voorkeur geeft aan een GUI boven terminalopdrachten.

## Sleutelopdrachten

| Commando            |
| ------------------- | ----------------------------------------------------- |
|                     | Start the Bitsocial P2P node                          |
| `create subplebbit` | Create a new community                                |
| `subplebbit edit`   | Update community settings (title, description, rules) |
| `subplebbit list`   | List communities hosted on this node                  |
| `subplebbit start`  | . Begin met het bedienen van een specifieke community |
| . `subplebbit stop` | . Stop met het bedienen van een specifieke community  |

Voer een opdracht uit met `--help` om de beschikbare opties en vlaggen te zien:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Typische workflow

Een algemene installatiestroom voor het hosten van een nieuwe community:

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

De community is nu live op het Bitsocial-netwerk en toegankelijk. vanaf elke compatibele client.

## Links

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
