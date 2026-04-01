---
title: Spam-blokering
description: Centraliseret spamdetektionstjeneste med risikoscoring, OAuth-udfordringer og konfigurerbare niveautærskler.
sidebar_position: 1
---

# Spam-blokering

:::warning Legacy Naming
Denne pakke blev oprindeligt udgivet under `@plebbit`-omfanget. Den er blevet omdøbt til `@bitsocial/spam-blocker-server` og `@bitsocial/spam-blocker-challenge`. Referencer til de gamle navne kan stadig forekomme i ældre dokumentation eller kodebaser.
:::

Spam Blocker er en centraliseret spam-detektionstjeneste, der evaluerer indkommende publikationer og tildeler risikoscore. Den består af to pakker:

- **`@bitsocial/spam-blocker-server`** - HTTP-serveren, der er vært for evaluerings- og udfordrings-API'erne.
- **`@bitsocial/spam-blocker-challenge`** -- en letvægtsklientpakke, som fællesskaber integrerer for at sende publikationer til evaluering.

**Kildekode:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Sådan fungerer risikoscoring

Hver publikation, der sendes til `/evaluate`-endepunktet, modtager en numerisk risikoscore. Scoren er en vægtet kombination af flere signaler:

| Signal            | Beskrivelse                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Kontoens alder    | Nyere konti får højere risikoscore.                                                                                      |
| Karma             | Akkumuleret samfundskarma reducerer risikoen.                                                                            |
| Forfatter omdømme | Omdømmedata indsamlet af baggrundsnetværksindekseren.                                                                    |
| Indholdsanalyse   | Heuristik på tekstniveau (linkdensitet, kendte spammønstre osv.).                                                        |
| Hastighed         | Hurtige på hinanden følgende indlæg fra samme forfatter øger risikoen.                                                   |
| IP-intelligens    | Geolocation på landeniveau og trusselsfeed-opslag. Kun landekoder gemmes - rå IP-adresser deles aldrig med fællesskaber. |

## Niveautærskler

Risikoscoren er knyttet til et af fire konfigurerbare niveauer, der bestemmer, hvad der derefter sker:

1. **Auto-accept** - scoren er lav nok til, at publikationen godkendes uden nogen udfordring.
2. **OAuth-tilstrækkelig** -- forfatteren skal gennemføre en OAuth-bekræftelse for at fortsætte.
3. **OAuth-plus-more** -- OAuth alene er ikke nok; yderligere verifikation (f.eks. CAPTCHA) er påkrævet.
4. **Auto-afvis** -- scoren er for høj; offentliggørelsen afvises blankt.

Alle tærskelværdier kan konfigureres pr. fællesskab.

## Udfordr flow

Når en publikation falder ind i et niveau, der kræver verifikation, begynder udfordringsflowet:

1. Forfatteren bliver først bedt om at godkende via **OAuth** (GitHub, Google, Twitter og andre understøttede udbydere).
2. Hvis OAuth alene er utilstrækkelig (tier 3), præsenteres en **CAPTCHA-faldback** drevet af Cloudflare Turnstile.
3. OAuth-identiteten bruges udelukkende til bekræftelse -- den deles **aldrig** med fællesskabet eller andre brugere.

## API-endepunkter

### `POST /evaluate`

Indsend en publikation til risikovurdering. Returnerer den beregnede risikoscore og det påkrævede udfordringsniveau.

### `POST /challenge/verify`

Indsend resultatet af en gennemført udfordring (OAuth-token, CAPTCHA-løsning eller begge dele) til verifikation.

### `GET /iframe/:sessionId`

Returnerer en HTML-side, der kan integreres, og som gengiver den passende udfordrings-UI for den givne session.

## Satsbegrænsende

Satsgrænser anvendes dynamisk baseret på forfatterens alder og omdømme. Nyere eller lavere ansete forfattere står over for strengere grænser, mens etablerede forfattere nyder godt af mere generøse tærskler. Dette forhindrer spam-oversvømmelser uden at straffe betroede deltagere.

## Baggrundsnetværksindeksering

Serveren kører en baggrundsindeksering, der kontinuerligt gennemgår netværket for at opbygge og vedligeholde forfatterens omdømmedata. Disse data føres direkte ind i risikoscoringspipelinen, hvilket gør det muligt for systemet at genkende gentagne deltagere i god tro på tværs af samfund.

## Privatliv

Spam Blocker er designet med privatliv i tankerne:

- OAuth-identiteter bruges kun til udfordringsbekræftelse og videregives **aldrig** til fællesskaber.
- IP-adresser omsættes til **kun landekoder**; rå IP'er gemmes eller deles ikke.

## Database

Serveren bruger **SQLite** (via `better-sqlite3`) til lokal persistens af omdømmedata, sessionstilstand og konfiguration.
