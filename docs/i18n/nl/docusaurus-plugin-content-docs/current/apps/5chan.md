---
title: 5chan
description: Een serverloos, gedecentraliseerd imageboard op het Bitsocial-protocol waar iedereen boards kan maken en bezitten.
sidebar_position: 1
---

# 5chan

5chan is een serverloos, beheerdersloos en volledig gedecentraliseerd imageboard dat op het Bitsocial-protocol draait. Het houdt de vertrouwde mapstructuur van imageboards aan en voegt daar gedecentraliseerd eigendom aan toe: iedereen kan een board aanmaken, en meerdere boards kunnen via een stemmechanisme strijden om dezelfde plek in de directory.

## Downloads

| Platform | Link                                   |
| -------- | -------------------------------------- |
| Web      | [5chan.app](https://5chan.app)         |
| Desktop  | Beschikbaar voor Mac, Windows en Linux |
| Mobiel   | Beschikbaar voor Android               |

## Hoe boards werken

5chan ordent inhoud in boards volgens een klassieke mapindeling (bijvoorbeeld `/b/`, `/g/`). Anders dan bij traditionele imageboards, waar één centrale beheerder elk board bestuurt, kan bij 5chan elke gebruiker een eigen board aanmaken en volledig in eigendom houden. Wanneer meerdere boards dezelfde plek in de directory willen, strijden ze om die positie; zie [Directory's](/directories/).

### Een board aanmaken

Om een nieuw board aan te maken, moet je `bitsocial-cli` als peer-to-peer node draaien. Zo wordt je board op gedecentraliseerde wijze gehost, zonder afhankelijk te zijn van een centrale server.

### Toewijzing van directoryplekken

De kandidaat-boards van elke directory staan in een bestand `5chan-directories/5chan-<code>-directory.json` in de repository [bitsocialnet/lists](https://github.com/bitsocialnet/lists), en een board sluit zich bij een directory aan via een pull request op dat bestand. Daarnaast houdt 5chan voor elke directory een stemronde met [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting): elke houder van een 5chan Pass krijgt één stem, en een stem op een board dat niet op de lijst staat, nomineert dat board. De stemrondes draaien momenteel op het Base Sepolia-testnet, waar de tellingen wel worden getoond maar de volgorde van de lijst niet veranderen.

## Onder de motorkap

Intern gebruikt 5chan de gedeelde clientlaag van het Bitsocial-protocol voor al het netwerkverkeer.
De webapp op 5chan.app draait standaard een Helia-node in de browser, waardoor een gewoon tabblad als
peer aan het netwerk deelneemt: het laadt boards van andere peers en publiceert via pubsub, zonder
gecentraliseerde IPFS-gateway in het contentpad. Zie [Peer-to-peer in de browser](/browser-p2p/) voor wat
daarbij komt kijken en wat een browsernode nog steeds niet kan.

## Links

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licentie**: GPL-2.0-only
