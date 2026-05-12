---
title: 5kan
description: Een serverloos, gedecentraliseerd imageboard gebouwd op het Bitsocial-protocol waar iedereen borden kan maken en bezitten.
sidebar_position: 1
---

# 5kan

5chan is een serverloos, beheerdersloos en volledig gedecentraliseerd imageboard dat draait op het Bitsocial-protocol. Het volgt de bekende mapstructuur van het imageboard en introduceert tegelijkertijd gedecentraliseerd eigendom: iedereen kan een bord maken, en meerdere borden kunnen strijden om hetzelfde directoryslot via een stemmechanisme.

## Downloads

| Platform   | Koppeling                              |
| ---------- | -------------------------------------- |
| Web        | [5chan.app](https://5chan.app)         |
| Bureaublad | Beschikbaar voor Mac, Windows en Linux |
| Mobiel     | Beschikbaar voor Android               |

## Hoe borden werken

5chan organiseert inhoud in borden met behulp van een klassieke mapindeling (bijvoorbeeld `/b/`, `/g/`). In tegenstelling tot traditionele imageboards waarbij een centrale beheerder elk bord beheert, stelt 5chan elke gebruiker in staat zijn eigen bord te maken en volledig te bezitten. Wanneer meerdere besturen zich op dezelfde directory-slot richten, strijden ze om die positie door middel van stemmen.

### Een bord maken

Om een nieuw bord te maken, moet u `bitsocial-cli` uitvoeren als een peer-to-peer-knooppunt. Dit zorgt ervoor dat uw bord op een gedecentraliseerde manier wordt gehost zonder afhankelijk te zijn van een centrale server.

### Directory-toewijzingen

Mapslottoewijzingen (welk bord op welk pad verschijnt) worden momenteel beheerd via GitHub-pull-aanvragen naar het `5chan-directories.json`-bestand. Dit is een tijdelijk proces; toekomstige releases zullen het maken van in-app-borden en pubsub-gebaseerd stemmen ondersteunen om maptoewijzingen automatisch af te handelen.

## Interne onderdelen

Onder de motorkap gebruikt 5chan de gedeelde Bitsocial-protocolclientlaag voor zijn netwerkinteracties. De webapp op 5chan.app kan ook een Helia-knooppunt in de browser uitvoeren wanneer browser-P2P is ingeschakeld via Geavanceerde instellingen, zodat lezers kunnen laden van peers zonder een gecentraliseerde IPFS-gateway. Zie de browser-P2P-sectie in de peer-to-peer-protocolopmerkingen.

## Koppelingen

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/vijfchandev](https://t.me/fivechandev)
- **Licentie**: alleen GPL-2.0
