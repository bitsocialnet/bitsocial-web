---
title: CLI
description: Commandoregelinterface voor het uitvoeren van een Bitsocial-knooppunt, het creëren van communities en het beheren van protocolbewerkingen.
sidebar_position: 2
---

# CLI

:::warning Oude naamgeving
Dit pakket maakt momenteel gebruik van verouderde naamgevingsconventies die zijn overgenomen van de upstream-afhankelijkheid. Verwijzingen naar "plebbit" in opdrachten, uitvoer en configuratie zullen in een toekomstige release worden gemigreerd naar "bitsocial". De functionaliteit wordt niet beïnvloed.
:::

De `bitsocial-cli` is een opdrachtregelprogramma voor interactie met de backend van het Bitsocial-protocol. Hiermee kunt u een lokale P2P-daemon uitvoeren, communities maken en configureren en inhoud publiceren - allemaal vanaf de terminal.

Het is gebouwd bovenop `plebbit-js` en wordt gebruikt door [5chan](/apps/5chan/) en [Seedit](/apps/seedit/) voor het creëren van community's en knooppuntbeheer.

## Installatie

Vooraf gebouwde binaire bestanden zijn beschikbaar voor Windows, macOS en Linux. Download de nieuwste release voor uw platform vanaf GitHub:

**[Download van GitHub Releases](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Maak na het downloaden het binaire bestand uitvoerbaar (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Het uitvoeren van de Daemon

Het meest voorkomende gebruik van de CLI is het uitvoeren van een Bitsocial-knooppunt. De daemon start de P2P-netwerklaag en stelt een lokale API beschikbaar waarmee clients verbinding kunnen maken.

```bash
bitsocial-cli daemon
```

Bij de eerste keer opstarten voert de daemon links uit naar de **WebUI**, een browsergebaseerde grafische interface voor het beheren van uw knooppunt, communities en instellingen. Dit is handig als u de voorkeur geeft aan een GUI boven terminalopdrachten.

## Sleutelopdrachten

| Commando            | Beschrijving                                                   |
| ------------------- | -------------------------------------------------------------- |
| `daemon`            | Start het Bitsocial P2P-knooppunt                              |
| `create subplebbit` | Creëer een nieuwe gemeenschap                                  |
| `subplebbit edit`   | Community-instellingen bijwerken (titel, beschrijving, regels) |
| `subplebbit list`   | Geef community's weer die op dit knooppunt worden gehost       |
| `subplebbit start`  | Begin met het bedienen van een specifieke gemeenschap          |
| `subplebbit stop`   | Stop met het dienen van een specifieke gemeenschap             |

Voer een willekeurige opdracht uit met `--help` om de beschikbare opties en vlaggen te zien:

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

De community is nu live op het Bitsocial-netwerk en toegankelijk vanaf elke compatibele client.

## Koppelingen

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
