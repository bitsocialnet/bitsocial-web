---
title: Spamblokkering
description: Gecentraliseerde spamdetectieservice met risicoscores, OAuth-uitdagingen en configureerbare niveaudrempels.
sidebar_position: 1
---

# Spamblokkering

Spam Blocker is een gecentraliseerde spamdetectieservice die binnenkomende publicaties evalueert en risicoscores toekent. Het bestaat uit twee pakketten:

- **`@bitsocial/spam-blocker-server`** -- de HTTP-server die de evaluatie- en uitdagings-API's host.
- **`@bitsocial/spam-blocker-challenge`** - een lichtgewicht clientpakket dat gemeenschappen integreren om publicaties ter evaluatie te verzenden.

**Broncode:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Hoe risicoscores werken

Elke publicatie die wordt ingediend bij het `/evaluate`-eindpunt krijgt een numerieke risicoscore. De score is een gewogen combinatie van verschillende signalen:

| Signaal              | Beschrijving                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Accountleeftijd      | Nieuwere accounts ontvangen hogere risicoscores.                                                                               |
| Karma                | Geaccumuleerd karma van de gemeenschap vermindert het risico.                                                                  |
| Reputatie van auteur | Reputatiegegevens verzameld door de achtergrondnetwerkindexer.                                                                 |
| Inhoudsanalyse       | Heuristieken op tekstniveau (linkdichtheid, bekende spampatronen, enz.).                                                       |
| Snelheid             | Snel opeenvolgende berichten van dezelfde auteur verhogen het risico.                                                          |
| IP-intelligentie     | Geolocatie op landniveau en zoekopdrachten naar bedreigingsfeeds. Onbewerkte IP-adressen worden nooit gedeeld met communities. |

## Niveaudrempels

De risicoscore wordt toegewezen aan een van de vier configureerbare niveaus die bepalen wat er vervolgens gebeurt:

1. **Automatisch accepteren** -- de score is zo laag dat de publicatie zonder enige uitdaging wordt goedgekeurd.
2. **OAuth-voldoende**: de auteur moet een OAuth-verificatie voltooien om door te gaan.
3. **OAuth-plus-more** -- OAuth alleen is niet voldoende; aanvullende verificatie (bijvoorbeeld CAPTCHA) is vereist.
4. **Automatisch afwijzen** -- score is te hoog; de publicatie wordt ronduit afgewezen.

Alle drempelwaarden zijn per gemeenschap configureerbaar.

## Uitdagingsstroom

Wanneer een publicatie in een niveau valt waarvoor verificatie vereist is, begint de uitdagingsstroom:

1. De auteur wordt eerst gevraagd zich te authenticeren via **OAuth** (GitHub, Google, Twitter en andere ondersteunde providers).
2. Als OAuth alleen onvoldoende is (tier 3), wordt een **CAPTCHA fallback**, mogelijk gemaakt door Cloudflare Turnstile, gepresenteerd.
3. De OAuth-identiteit wordt uitsluitend gebruikt voor verificatie; deze wordt **nooit gedeeld** met de community of andere gebruikers.

## API-eindpunten

### `POST /evaluate`

Dien een publicatie in voor risicobeoordeling. Retourneert de berekende risicoscore en het vereiste uitdagingsniveau.

### `POST /challenge/verify`

Dien het resultaat van een voltooide uitdaging (OAuth-token, CAPTCHA-oplossing of beide) in ter verificatie.

### `GET /iframe/:sessionId`

Retourneert een insluitbare HTML-pagina die de juiste uitdagings-UI voor de gegeven sessie weergeeft.

## Tariefbeperking

Tarieflimieten worden dynamisch toegepast op basis van de leeftijd en reputatie van de auteur. Nieuwere auteurs of auteurs met een lagere reputatie worden geconfronteerd met strengere limieten, terwijl gevestigde auteurs genereuzere drempels genieten. Dit voorkomt spamoverstromingen zonder dat vertrouwde deelnemers worden bestraft.

## Achtergrondnetwerkindexer

De server voert een achtergrondindexeerder uit die voortdurend het netwerk doorzoekt om reputatiegegevens van auteurs op te bouwen en te onderhouden. Deze gegevens worden rechtstreeks in de risicoscorepijplijn ingevoerd, waardoor het systeem terugkerende deelnemers te goeder trouw in gemeenschappen kan herkennen.

## Privacy

Spam Blocker is ontworpen met het oog op privacy:

- OAuth-identiteiten worden alleen gebruikt voor uitdagingsverificatie en worden **nooit bekendgemaakt** aan communities.
- De beheerder van de dienst slaat onbewerkte IP-adressen op om misbruik te detecteren en stuurt ze ter classificatie naar een externe aanbieder van IP-informatie.
- Communities ontvangen alleen de landcode, het IP-risico en een schatting van het verbindingstype, nooit het onbewerkte IP-adres.

## Database

De server gebruikt **SQLite** (via `better-sqlite3`) voor lokale persistentie van reputatiegegevens, sessiestatus en configuratie.
