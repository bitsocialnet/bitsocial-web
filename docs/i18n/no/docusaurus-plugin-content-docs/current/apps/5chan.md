---
title: 5chan
description: Et serverløst, desentralisert bildebrett bygget på Bitsocial-protokollen der alle kan lage og eie tavler.
sidebar_position: 1
---

# 5chan

5chan er et serverløst, adminløst og fullstendig desentralisert bildebord som kjører på Bitsocial-protokollen. Den følger den kjente imageboard-katalogstrukturen samtidig som den introduserer desentralisert eierskap - hvem som helst kan opprette et styre, og flere styrene kan konkurrere om samme katalogspor gjennom en stemmemekanisme.

## Nedlastinger

| Plattform | Link                                   |
| --------- | -------------------------------------- |
| Web       | [5chan.app](https://5chan.app)         |
| Desktop   | Tilgjengelig for Mac, Windows og Linux |
| Mobil     | Tilgjengelig for Android               |

## Hvordan styrene fungerer

5chan organiserer innhold i tavler ved hjelp av en klassisk katalogoppsett (f.eks. `/b/`, `/g/`). I motsetning til tradisjonelle bildetavler hvor en sentral administrator kontrollerer hvert brett, lar 5chan enhver bruker lage og fullt ut eie sitt eget brett. Når flere brett målretter mot samme katalogplass, konkurrerer de om den posisjonen gjennom å stemme.

### Å lage et brett

For å opprette et nytt styre, må du kjøre `bitsocial-cli` som en node-til-node-node. Dette sikrer at styret ditt er vert på en desentralisert måte uten å stole på noen sentral server.

### Katalogoppdrag

Katalogsportilordninger (hvilket bord vises på hvilken bane) administreres for øyeblikket gjennom GitHub pull-forespørsler til `5chan-directories.json`-filen. Dette er en midlertidig prosess – fremtidige utgivelser vil støtte oppretting av tavler i appen og pubsub-basert avstemning for å håndtere katalogoppdrag automatisk.

## Internaler

Under panseret bruker 5chan det delte Bitsocial-protokollklientlaget for sine nettverksinteraksjoner. Nettappen på 5chan.app kan også kjøre en Helia-node i nettleseren når nettleseren P2P er aktivert fra Avanserte innstillinger, slik at lesere kan laste fra jevnaldrende uten en sentralisert IPFS-gateway. Se P2P-delen av nettleseren i notatene om node-til-node-protokoll.

## Lenker

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lisens**: Kun GPL-2.0
