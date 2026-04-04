---
title: Spam Blocker
description: Centraliserad spamdetekteringstjänst med riskpoäng, OAuth-utmaningar och konfigurerbara nivåtrösklar.
sidebar_position: 1
---

# Spam Blocker

:::warning Äldre namngivning
Detta paket publicerades ursprungligen under `@plebbit`-omfånget. Den har bytt namn till `@bitsocial/spam-blocker-server` och `@bitsocial/spam-blocker-challenge`. Referenser till de gamla namnen kan fortfarande förekomma i äldre dokumentation eller kodbaser.
:::

Spam Blocker är en centraliserad spamdetekteringstjänst som utvärderar inkommande publikationer och tilldelar riskpoäng. Den består av två paket:

- **`@bitsocial/spam-blocker-server`** – HTTP-servern som är värd för utvärderings- och utmanings-API:erna.
- **`@bitsocial/spam-blocker-challenge`** – ett lättviktigt klientpaket som gemenskaper integrerar för att skicka publikationer för utvärdering.

**Källkod:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Hur Riskpoäng fungerar

Varje publikation som skickas till `/evaluate`-slutpunkten får ett numeriskt riskpoäng. Poängen är en viktad kombination av flera signaler:

| Signal             | Beskrivning                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Kontoålder         | Nyare konton får högre riskpoäng.                                                                                                     |
| Karma              | Ackumulerad samhällskarma minskar risken.                                                                                             |
| Författarens rykte | Ryktedata samlad in av bakgrundsnätverksindexeraren.                                                                                  |
| Innehållsanalys    | Heuristik på textnivå (länkdensitet, kända skräppostmönster, etc.).                                                                   |
| Hastighet          | Snabba på varandra följande inlägg från samma författare ökar risken.                                                                 |
| IP-intelligens     | Geolokalisering på landsnivå och hotfeed-sökningar. Endast landskoder lagras -- obearbetade IP-adresser delas aldrig med gemenskaper. |

## Nivåtrösklar

Riskpoängen mappas till en av fyra konfigurerbara nivåer som avgör vad som händer härnäst:

1. **Auto-acceptera** - poängen är tillräckligt låg för att publikationen ska godkännas utan någon utmaning.
2. **OAuth-tillräcklig** -- författaren måste slutföra en OAuth-verifiering för att fortsätta.
3. **OAuth-plus-mer** -- OAuth ensamt är inte tillräckligt; ytterligare verifiering (t.ex. CAPTCHA) krävs.
4. **Auto-avvisa** -- poängen är för hög; publiceringen avvisas helt och hållet.

Alla tröskelvärden är konfigurerbara per gemenskap.

## Utmana Flow

När en publikation hamnar i en nivå som kräver verifiering börjar utmaningsflödet:

1. Författaren uppmanas först att autentisera via **OAuth** (GitHub, Google, Twitter och andra leverantörer som stöds).
2. Om enbart OAuth är otillräckligt (nivå 3), presenteras en **CAPTCHA reserv** som drivs av Cloudflare Turnstile.
3. OAuth-identiteten används enbart för verifiering -- den delas **aldrig** med communityn eller andra användare.

## API-slutpunkter

### `POST /evaluate`

Lämna in en publikation för riskbedömning. Returnerar det beräknade riskpoängen och den obligatoriska utmaningsnivån.

### `POST /challenge/verify`

Skicka in resultatet av en avslutad utmaning (OAuth-token, CAPTCHA-lösning eller båda) för verifiering.

### `GET /iframe/:sessionId`

Returnerar en inbäddningsbar HTML-sida som renderar rätt utmaningsgränssnitt för den givna sessionen.

## Prisbegränsande

Prisgränser tillämpas dynamiskt baserat på författarens ålder och rykte. Nyare eller lägre anseende författare möter strängare gränser, medan etablerade författare åtnjuter mer generösa trösklar. Detta förhindrar spamflöden utan att bestraffa betrodda deltagare.

## Bakgrundsnätverksindexerare

Servern kör en bakgrundsindexerare som kontinuerligt genomsöker nätverket för att bygga och underhålla uppgifter om författarens rykte. Dessa data matas in direkt i riskpoängpipelinen, vilket gör att systemet kan känna igen återkommande deltagare i god tro i olika samhällen.

## Privatliv

Spam Blocker är designad med sekretess i åtanke:

- OAuth-identiteter används endast för utmaningsverifiering och avslöjas **aldrig** för grupper.
- IP-adresser löses till **endast landskoder**; rå IP-adresser lagras eller delas inte.

## Databas

Servern använder **SQLite** (via `better-sqlite3`) för lokal beständighet av ryktedata, sessionstillstånd och konfiguration.
