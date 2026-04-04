---
title: CLI
description: Kommandolinjegrensesnitt for å kjøre en Bitsocial-node, opprette fellesskap og administrere protokolloperasjoner.
sidebar_position: 2
---

# CLI

:::warning Legacy navngivning
Denne pakken bruker for tiden eldre navnekonvensjoner som er arvet fra oppstrømsavhengigheten. Referanser til "plebbit" i kommandoer, utdata og konfigurasjon vil bli migrert til "bitsocial" i en fremtidig utgivelse. Funksjonaliteten er upåvirket.
:::

`bitsocial-cli` er et kommandolinjeverktøy for å samhandle med Bitsocial-protokollens backend. Den lar deg kjøre en lokal P2P-demon, opprette og konfigurere fellesskap og publisere innhold - alt fra terminalen.

Den er bygget på toppen av `plebbit-js` og brukes av [5chan](/apps/5chan/) og [Seedit](/apps/seedit/) for opprettelse av fellesskap og nodeadministrasjon.

## Installasjon

Forhåndsbygde binærfiler er tilgjengelige for Windows, macOS og Linux. Last ned den siste utgivelsen for plattformen din fra GitHub:

**[Last ned fra GitHub-utgivelser](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Etter nedlasting gjør du den binære kjørbare (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Kjører Daemon

Den vanligste bruken av CLI er å kjøre en Bitsocial-node. Daemonen starter P2P-nettverkslaget og avslører et lokalt API som klienter kan koble til.

```bash
bitsocial-cli daemon
```

Ved første lansering sender demonen ut koblinger til **WebUI**, et nettleserbasert grafisk grensesnitt for å administrere noden, fellesskapene og innstillingene dine. Dette er nyttig hvis du foretrekker en GUI fremfor terminalkommandoer.

## Tastekommandoer

| Kommando            | Beskrivelse                                                     |
| ------------------- | --------------------------------------------------------------- |
| `daemon`            | Start Bitsocial P2P-noden                                       |
| `create subplebbit` | Opprett et nytt fellesskap                                      |
| `subplebbit edit`   | Oppdater fellesskapsinnstillinger (tittel, beskrivelse, regler) |
| `subplebbit list`   | Liste fellesskap som er vert for denne noden                    |
| `subplebbit start`  | Begynn å betjene et bestemt fellesskap                          |
| `subplebbit stop`   | Slutt å tjene et bestemt fellesskap                             |

Kjør en hvilken som helst kommando med `--help` for å se tilgjengelige alternativer og flagg:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Typisk arbeidsflyt

En vanlig oppsettflyt for å være vert for et nytt fellesskap:

```bash
# 1. Start demonen
bitsocial-cli daemon

# 2. Opprett et fellesskap i en annen terminal
bitsocial-cli create subplebbit

# 3. Konfigurer fellesskapet
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Begynn å servere den
bitsocial-cli subplebbit start <address>
```

Fellesskapet er nå live på Bitsocial-nettverket og tilgjengelig fra enhver kompatibel klient.

## Lenker

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
