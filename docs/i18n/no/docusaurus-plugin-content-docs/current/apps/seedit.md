---
title: Seedit
description: Et serverløst, desentralisert forum i Reddit-stil bygget på Bitsocial-protokollen der hvem som helst kan opprette og eie fellesskap.
sidebar_position: 2
---

# Seedit

Seedit er et serverløst, adminløst og fullstendig desentralisert alternativ til gammeldags Reddit, bygget på Bitsocial-protokollen. Det gir brukerne fullstendig eierskap over fellesskapene deres - hvem som helst kan opprette et, og flere fellesskap kan konkurrere om den samme korte ruten, for eksempel `/s/funny`.

## Nedlastinger

| Plattform | Link                                                  |
| --------- | ----------------------------------------------------- |
| Web       | [seedit.app](https://seedit.app)                      |
| Web (ENS) | `seedit.eth` via Brave nettleser eller IPFS Companion |
| Desktop   | Tilgjengelig for Mac, Windows og Linux                |
| Mobil     | Tilgjengelig for Android                              |

## Hvordan fellesskap fungerer

Seedit organiserer innhold i fellesskap som ligner på subreddits. Hvert fellesskap eies av dets skaper og opererer uten sentralisert administrasjon. Flere fellesskap kan konkurrere om den samme [katalogruten](/directories/), for eksempel `/s/funny`, og ruten åpner den nåværende vinneren. Abonnementer og lenker til innlegg peker alltid på det eksakte fellesskapet.

### Å skape et fellesskap

Det er to måter å opprette et nytt fellesskap på:

1. **Skrivebordsklient** — Bruk den innebygde GUI i skrivebordsapplikasjonen for å sette opp og konfigurere fellesskapet ditt.
2. **bitsocial-cli** — Kjør CLI-verktøyet for å opprette og administrere fellesskap fra kommandolinjen.

### Standard fellesskapsliste

Nye kontoer abonnerer på en standardliste med eksakte fellesskap, definert i `seedit-default-subscriptions.json` i depotet [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Katalogkandidater står i filene `seedit-directories/seedit-<code>-directory.json` i det samme depotet. For å legge til fellesskapet ditt i en av listene, send inn en pull-forespørsel med fellesskapets detaljer.

## Lenker

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Lisens**: Kun GPL-2.0
