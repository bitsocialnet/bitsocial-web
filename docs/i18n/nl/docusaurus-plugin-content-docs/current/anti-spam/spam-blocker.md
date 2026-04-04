---
title: Spam Blocker
description: Gecentraliseerde spamdetectieservice met risicoscores, OAuth-uitdagingen en configureerbare niveaudrempels.
sidebar_position: 1
---

# Spam Blocker

:::warning Oude naamgeving
Dit pakket is oorspronkelijk gepubliceerd onder het bereik `@plebbit`. De naam is gewijzigd in `@bitsocial/spam-blocker-server` en `@bitsocial/spam-blocker-challenge`. Verwijzingen naar de oude namen kunnen nog steeds voorkomen in oudere documentatie of codebases.
:::

Spam Blocker is een gecentraliseerde spamdetectieservice die binnenkomende publicaties evalueert en risicoscores toekent. Het bestaat uit twee pakketten:

- **`@bitsocial/spam-blocker-server`** -- de HTTP-server die de API's voor evaluatie en uitdaging host.
- **`@bitsocial/spam-blocker-challenge`** -- een lichtgewicht clientpakket dat gemeenschappen integreren om publicaties ter evaluatie te verzenden.

**Broncode:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Hoe risicoscores werken

Elke publicatie die wordt ingediend bij het `/evaluate`-eindpunt krijgt een numerieke risicoscore. De score is een gewogen combinatie van verschillende signalen:

| Signaal           | Beschrijving                                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Accountleeftijd   | Nieuwere accounts ontvangen hogere risicoscores.                                                                                                |
| Karma             | Accumulated community karma reduces risk.                                                                                                       |
| Author reputation | Reputation data gathered by the background network indexer.                                                                                     |
| Content analysis  | Text-level heuristics (link density, known spam patterns, etc.).                                                                                |
| Velocity          | Rapid successive posts from the same author increase risk.                                                                                      |
| IP intelligence   | Geolocatie op landniveau en zoekopdrachten naar bedreigingsfeeds worden opgeslagen. Onbewerkte IP-adressen worden nooit gedeeld met community's |

## Niveaudrempels

De risicoscore wordt toegewezen aan een van de vier configureerbare niveaus die bepalen wat er vervolgens gebeurt:

1. **Automatisch accepteren** -- de score is laag genoeg om de publicatie zonder enige uitdaging te laten goedkeuren.
2. **OAuth-voldoende** - de auteur moet voldoende zijn. voltooi een OAuth-verificatie om door te gaan.
3. **OAuth-plus-more** -- OAuth alleen is niet voldoende; aanvullende verificatie (bijv. CAPTCHA) is vereist.
4. **Auto-reject** -- score is te hoog; de publicatie wordt volledig afgewezen.

Alle drempelwaarden kunnen per community worden geconfigureerd.

## Uitdagingsstroom

Wanneer een publicatie plaatsvindt valt in een niveau dat verificatie vereist, begint de uitdagingsstroom:

1. De auteur wordt eerst gevraagd om te authenticeren via **OAuth** (GitHub, Google, Twitter en andere ondersteunde providers).
2. Als OAuth alleen onvoldoende is (niveau 3), wordt een **CAPTCHA fallback**, mogelijk gemaakt door Cloudflare Turnstile, gepresenteerd.
3. De OAuth-identiteit wordt uitsluitend gebruikt voor verificatie - deze wordt **nooit gedeeld** met de community of andere gebruikers.

## API-eindpunten

### `POST /evaluate`

Dien een publicatie in voor risico-evaluatie. Retourneert de berekende risicoscore en het vereiste uitdagingsniveau.

### `POST /challenge/verify`

Dien het resultaat in van een voltooide uitdaging (OAuth-token, CAPTCHA-oplossing of beide) ter verificatie.

### `GET /iframe/:sessionId`

Retourneert een insluitbare HTML-pagina die de juiste uitdagings-UI voor de gegeven situatie weergeeft. sessie.

## Snelheidslimiet

Tarieflimieten worden dynamisch toegepast op basis van de leeftijd en reputatie van de auteur. Nieuwere auteurs of auteurs met een lagere reputatie worden geconfronteerd met strengere limieten, terwijl gevestigde auteurs genereuzere drempels genieten. Dit voorkomt spamoverstromingen zonder dat vertrouwde deelnemers worden bestraft.

## Achtergrondnetwerkindexer

De server voert een achtergrondindexer uit die voortdurend het netwerk doorzoekt om reputatiegegevens van auteurs op te bouwen en te onderhouden. Deze gegevens worden rechtstreeks in de pijplijn voor risicoscores ingevoerd, waardoor het systeem terugkerende deelnemers te goeder trouw in gemeenschappen kan herkennen.

## Privacy

Spam Blocker is ontworpen met het oog op privacy:

- OAuth-identiteiten worden alleen gebruikt voor uitdagingsverificatie en worden **nooit bekendgemaakt** aan communities.
- IP-adressen worden omgezet in **alleen landcodes**; onbewerkte IP-adressen worden niet opgeslagen of gedeeld.

## Database

De server gebruikt **SQLite** (via `better-sqlite3`) voor lokale persistentie van reputatiegegevens, sessiestatus en configuratie.
