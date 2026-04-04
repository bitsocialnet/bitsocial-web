---
title: 5chan
description: Een serverloos, gedecentraliseerd imageboard gebouwd op het Bitsocial-protocol waar iedereen boards kan maken en bezitten.
sidebar_position: 1
---

:::warning[Verouderde naamgeving]
De codebasis van dit project gebruikt nog steeds de oude "plebbit" -naam van vóór de rebranding van Bitsocial. Pakketnamen, API-referenties en bepaalde interne terminologie zullen in een toekomstige release worden bijgewerkt. De hier beschreven functionaliteit is actueel - alleen de naamgeving is verouderd.
:::

# 5chan

5chan is een serverloos, beheerdersloos en volledig gedecentraliseerd imageboard dat draait op het Bitsocial-protocol. Het volgt de bekende mapstructuur van het imageboard en introduceert tegelijkertijd gedecentraliseerd eigendom: iedereen kan een bord maken, en meerdere borden kunnen strijden om dezelfde mapplaats via een stemmechanisme.

## Downloads

| Platform | Link                                   |
| -------- | -------------------------------------- |
| Web      | [5chan.app](https://5chan.app)         |
| Desktop  | Beschikbaar voor Mac, Windows en Linux |
| Mobiel   | Beschikbaar voor Android               |

## Hoe boards werken

5chan organiseert inhoud in boards met behulp van een klassieke mapindeling (bijv. `/b/`, `/g/`). In tegenstelling tot traditioneel imageboards waar een centrale beheerder elk bord beheert, stelt 5chan elke gebruiker in staat zijn eigen bord te maken en volledig te bezitten. Wanneer meerdere borden zich op dezelfde directory-slot richten, strijden ze om die positie door middel van stemmen.

### Een bord maken

Om een nieuw bord te maken, moet je `bitsocial-cli` als een peer-to-peer-knooppunt gebruiken. Dit zorgt ervoor dat je bord op een gedecentraliseerde manier wordt gehost, zonder afhankelijk te zijn van een centraal knooppunt server.

### Maptoewijzingen

Mapslottoewijzingen (welk bord verschijnt op welk pad) worden momenteel beheerd via GitHub pull-verzoeken naar het `5chan-directories.json`-bestand. Dit is een tijdelijk proces. Toekomstige releases zullen het maken van in-app-borden en pubsub-gebaseerd stemmen ondersteunen om maptoewijzingen automatisch af te handelen.

## Interne onderdelen

Onder de motorkap gebruikt 5chan de. plebbit-js API-laag vanwege zijn protocolinteracties Zoals opgemerkt in de bovenstaande waarschuwing, dragen deze interne verwijzingen nog steeds een verouderde naam die dateert van vóór de rebranding van Bitsocial.

## Koppelingen

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licentie**: alleen GPL-2.0
