---
title: Spam Blocker
description: Centraliserad tjänst för spamdetektering med riskpoäng, OAuth-utmaningar och konfigurerbara nivåtrösklar.
sidebar_position: 1
---

# Spam Blocker

Spam Blocker är en centraliserad tjänst för spamdetektering som utvärderar inkommande publikationer och tilldelar dem riskpoäng. Den består av två paket:

- **`@bitsocial/spam-blocker-server`** -- HTTP-servern som tillhandahåller API:erna för utvärdering och utmaningar.
- **`@bitsocial/spam-blocker-challenge`** -- ett lättviktigt klientpaket som communities integrerar för att skicka publikationer till utvärdering.

**Källkod:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Så beräknas riskpoängen

Varje publikation som skickas till slutpunkten `/evaluate` får en numerisk riskpoäng. Poängen är en viktad kombination av flera signaler:

| Signal             | Beskrivning                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Kontoålder         | Nyare konton får högre riskpoäng.                                                                        |
| Karma              | Upparbetad karma i communityn sänker risken.                                                             |
| Författarens rykte | Ryktesdata som samlas in av bakgrundsindexeraren för nätverket.                                          |
| Innehållsanalys    | Heuristik på textnivå (länktäthet, kända spammönster och så vidare).                                     |
| Publiceringstakt   | Många inlägg i snabb följd från samma författare ökar risken.                                            |
| IP-analys          | Geolokalisering på landsnivå och uppslag mot hotdatabaser. Råa IP-adresser delas aldrig med communities. |

## Nivåtrösklar

Riskpoängen mappas till en av fyra konfigurerbara nivåer som avgör vad som händer sedan:

1. **Automatiskt godkännande** -- poängen är tillräckligt låg för att publikationen ska godkännas utan någon utmaning.
2. **OAuth räcker** -- författaren måste slutföra en OAuth-verifiering för att komma vidare.
3. **OAuth och mer** -- enbart OAuth räcker inte; ytterligare verifiering (t.ex. CAPTCHA) krävs.
4. **Automatiskt avslag** -- poängen är för hög; publikationen avvisas direkt.

Alla tröskelvärden går att konfigurera per community.

## Utmaningsflödet

När en publikation hamnar på en nivå som kräver verifiering startar utmaningsflödet:

1. Författaren ombeds först att autentisera sig via **OAuth** (GitHub, Google, Twitter och andra leverantörer som stöds).
2. Om enbart OAuth inte räcker (nivå 3) visas en **CAPTCHA-reserv** som drivs av Cloudflare Turnstile.
3. OAuth-identiteten används enbart för verifiering -- den **delas aldrig** med communityn eller med andra användare.

## API-slutpunkter

### `POST /evaluate`

Skicka in en publikation för riskutvärdering. Returnerar den beräknade riskpoängen och vilken utmaningsnivå som krävs.

### `POST /challenge/verify`

Skicka in resultatet av en genomförd utmaning (OAuth-token, CAPTCHA-lösning eller båda) för verifiering.

### `GET /iframe/:sessionId`

Returnerar en inbäddningsbar HTML-sida som visar rätt utmaningsgränssnitt för den angivna sessionen.

## Hastighetsbegränsning

Hastighetsgränserna sätts dynamiskt utifrån författarens ålder och rykte. Nyare författare och författare med lägre rykte möter striktare gränser, medan etablerade författare får mer generösa trösklar. På så sätt stoppas spamvågor utan att betrodda deltagare straffas.

## Bakgrundsindexerare för nätverket

Servern kör en bakgrundsindexerare som kontinuerligt genomsöker nätverket för att bygga upp och underhålla ryktesdata om författare. Dessa data matas direkt in i riskpoängsättningen, vilket gör att systemet känner igen återkommande deltagare i god tro över flera communities.

## Integritet

Spam Blocker är byggd med integriteten i åtanke:

- OAuth-identiteter används enbart för att verifiera utmaningar och **röjs aldrig** för communities.
- Tjänstens operatör lagrar råa IP-adresser för att upptäcka missbruk och skickar dem till en extern leverantör av IP-information för klassificering.
- Communities får bara landskoden, IP-risken och en uppskattning av anslutningstypen, aldrig den råa IP-adressen.

## Databas

Servern använder **SQLite** (via `better-sqlite3`) för lokal lagring av ryktesdata, sessionstillstånd och konfiguration.
