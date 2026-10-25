---
title: Seedit
description: Een serverloos, gedecentraliseerd forum in Reddit-stijl gebouwd op het Bitsocial-protocol waar iedereen communities kan creëren en bezitten.
sidebar_position: 2
---

# Seedit

Seedit is een serverloos, beheerdersloos en volledig gedecentraliseerd alternatief voor de oude stijl Reddit, gebouwd op het Bitsocial-protocol. Het geeft gebruikers het volledige eigendom over hun community's: iedereen kan er een maken, en meerdere community's kunnen strijden om dezelfde korte route, zoals `/s/funny`.

## Downloads

| Platform  | Link                                             |
| --------- | ------------------------------------------------ |
| Web       | [seedit.app](https://seedit.app)                 |
| Web (ENS) | `seedit.eth` via Brave browser of IPFS Companion |
| Desktop   | Beschikbaar voor Mac, Windows en Linux           |
| Mobiel    | Beschikbaar voor Android                         |

## Hoe communities werken

Seedit organiseert inhoud in vergelijkbare communities naar subreddits. Elke community is eigendom van de maker ervan en werkt zonder gecentraliseerd beheer. Meerdere community's kunnen strijden om dezelfde route van een [directory](/directories/), zoals `/s/funny`, en die route opent de huidige winnaar. Abonnementen en links naar berichten verwijzen altijd naar de exacte community.

### Een community maken

Er zijn twee manieren om een nieuwe community te maken:

1. **Desktopclient** — Gebruik de ingebouwde GUI in de desktoptoepassing om uw community in te stellen en te configureren.
2. **bitsocial-cli** — Voer de app uit. CLI-tool om community's te maken en te beheren vanaf de opdrachtregel.

### Standaard communitylijst

Nieuwe accounts abonneren zich op een standaardlijst van exacte community's, gedefinieerd in `seedit-default-subscriptions.json` in de repository [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Kandidaten voor directory's staan in de bestanden `seedit-directories/seedit-<code>-directory.json` in dezelfde repository. Om uw community aan een van beide lijsten toe te voegen, dient u een pull-verzoek in met de details van uw community.

## Koppelingen

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licentie**: alleen GPL-2.0
