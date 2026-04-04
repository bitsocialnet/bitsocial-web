---
title: Spam Blocker
description: Sentralisert spam-deteksjonstjeneste med risikoscoring, OAuth-utfordringer og konfigurerbare nivåterskler.
sidebar_position: 1
---

# Spam Blocker

:::warning Legacy navngivning
Denne pakken ble opprinnelig publisert under `@plebbit`-omfanget. Den har fått nytt navn til `@bitsocial/spam-blocker-server` og `@bitsocial/spam-blocker-challenge`. Referanser til de gamle navnene kan fortsatt forekomme i eldre dokumentasjon eller kodebaser.
:::

Spam Blocker er en sentralisert spam-deteksjonstjeneste som evaluerer innkommende publikasjoner og tildeler risikopoeng. Den består av to pakker:

- **`@bitsocial/spam-blocker-server`** – HTTP-serveren som er vert for evaluerings- og utfordrings-API-ene.
- **`@bitsocial/spam-blocker-challenge`** -- en lett klientpakke som fellesskap integrerer for å sende publikasjoner til evaluering.

**Kildekode:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Hvordan risikoscoring fungerer

Hver publikasjon som sendes til `/evaluate`-endepunktet får en numerisk risikoscore. Poengsummen er en vektet kombinasjon av flere signaler:

| Signal            | Beskrivelse                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Kontoalder        | Nyere kontoer får høyere risikoscore.                                                                                      |
| Karma             | Akkumulert fellesskapskarma reduserer risikoen.                                                                            |
| Forfatter omdømme | Omdømmedata samlet inn av bakgrunnsnettverksindeksereren.                                                                  |
| Innholdsanalyse   | Heuristikk på tekstnivå (koblingstetthet, kjente spammønstre osv.).                                                        |
| Hastighet         | Raske påfølgende innlegg fra samme forfatter øker risikoen.                                                                |
| IP-intelligens    | Geolokalisering på landsnivå og oppslag i trusselfeed. Bare landskoder lagres – rå IP-adresser deles aldri med fellesskap. |

## Nivåterskler

Risikopoengsummen tilordnes ett av fire konfigurerbare nivåer som bestemmer hva som skjer videre:

1. **Auto-accept** -- poengsummen er lav nok til at publikasjonen godkjennes uten noen utfordring.
2. **OAuth-tilstrekkelig** -- forfatteren må fullføre en OAuth-verifisering for å fortsette.
3. **OAuth-pluss-mer** -- OAuth alene er ikke nok; ytterligere bekreftelse (f.eks. CAPTCHA) kreves.
4. **Auto-avvis** -- poengsummen er for høy; publikasjonen avvises direkte.

Alle terskelverdier kan konfigureres per fellesskap.

## Utfordre flyt

Når en publikasjon faller inn i et nivå som krever bekreftelse, begynner utfordringsflyten:

1. Forfatteren blir først bedt om å autentisere via **OAuth** (GitHub, Google, Twitter og andre støttede leverandører).
2. Hvis OAuth alene er utilstrekkelig (nivå 3), presenteres en **CAPTCHA-reserve** drevet av Cloudflare Turnstile.
3. OAuth-identiteten brukes utelukkende til verifisering -- den deles **aldri** med fellesskapet eller andre brukere.

## API-endepunkter

### `POST /evaluate`

Send inn en publikasjon for risikovurdering. Returnerer den beregnede risikopoengsummen og det nødvendige utfordringsnivået.

### `POST /challenge/verify`

Send inn resultatet av en fullført utfordring (OAuth-token, CAPTCHA-løsning eller begge deler) for verifisering.

### `GET /iframe/:sessionId`

Returnerer en innebyggbar HTML-side som gjengir det riktige utfordringsgrensesnittet for den gitte økten.

## Satsbegrensende

Satsgrenser brukes dynamisk basert på forfatterens alder og omdømme. Forfattere med nyere eller lavere omdømme står overfor strengere grenser, mens etablerte forfattere har mer sjenerøse terskler. Dette forhindrer spamflommer uten å straffe pålitelige deltakere.

## Bakgrunnsnettverksindekserer

Serveren kjører en bakgrunnsindekserer som kontinuerlig gjennomsøker nettverket for å bygge og vedlikeholde forfatterens omdømmedata. Disse dataene føres direkte inn i risikoscoringspipelinen, slik at systemet kan gjenkjenne gjentatte deltakere i god tro på tvers av lokalsamfunn.

## Privatliv

Spam Blocker er designet med personvern i tankene:

- OAuth-identiteter brukes kun til utfordringsverifisering og blir **aldri avslørt** til fellesskap.
- IP-adresser er løst til **kun landskoder**; rå IP-er blir ikke lagret eller delt.

## Database

Serveren bruker **SQLite** (via `better-sqlite3`) for lokal persistens av omdømmedata, økttilstand og konfigurasjon.
