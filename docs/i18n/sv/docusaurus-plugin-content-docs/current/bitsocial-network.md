---
title: Bitsocial Chain
description: Fas 3 av masterplanen, som beskriver det föreslagna ekonomiska lagret för Bitsocial-appar i form av en Ethereum L2-appchain.
---

# Bitsocial Chain

Bitsocial Chain är det föreslagna ekonomiska lagret för Bitsocial-appar, byggt som en Ethereum
L2-appchain. Den nuvarande kedjespecifika webbplatsen finns på
[chain.bitsocial.net](https://chain.bitsocial.net).

Det sociala peer-to-peer-lagret gör att communities, identiteter och innehåll kan röra sig utanför
en central plattformsdatabas. Bitsocial Chain ska lägga till de delade primitiverna för namngivning,
intäkter och betalningar som gör sådana appar svårare att svälta ut ekonomiskt.

## Vad det är tänkt att driva

- decentraliserade Bitsocial-domäner som `.bso`
- utmärkelser och dricks
- hållbar infrastruktur för intäkter
- delad likviditet mellan appar
- finansiella strukturer som är svårare för banker eller plattformar att strypa
- nätverkseffekter som inte bygger på att ett enda företag äger hela stacken

Målet är inte att sätta tokenmekanik främst. Målet är att göra användbara sociala appar mer
hållbara, lättare att finansiera och mindre beroende av centraliserade betal- eller namntjänster.

## Nuvarande proof of concept

Det första proof of concept-projektet för Bitsocial Chain fokuserar på nativa `.bso`-namn. Det visar
att ett namnregister kan härledas ur historiken på Ethereum L1 utan att socialt innehåll läggs
on-chain:

- användare skickar in avsikter om att registrera, uppdatera, överföra och återkalla namn genom
  vanliga transaktioner på Ethereum L1
- vem som helst kan köra härledningsnoden och återskapa samma tillstånd för `.bso`-registret
- en resolver kopplar ett `.bso`-namn till den publika Bitsocial-nyckel som klienter redan använder
  över peer-to-peer-protokollet
- inlägg, röster, moderering, flöden och community-innehåll stannar utanför kedjan och förblir
  peer-to-peer

Detta proof of concept är ingen produktionsfärdig Stage 2-lansering. Det saknar ännu bevissystem,
utmaningsmekanism, granskad kod, live-driftsättning, slutlig prissättning och slutlig styrning. Den
långsiktiga hållningen är transparent som standard och förenlig med integritet redan i designen:
själva kärnkedjan är offentlig, medan framtida dricks, betalningar, utmärkelser och likviditet bör
undvika att tvinga fram permanenta kopplingar mellan social identitet och plånbokshistorik.

## Varför det spelar roll

Att decentralisera communities och identiteter är nödvändigt, men det räcker inte för att
decentralisera alla sociala medier.

Om sociala appar fortfarande är beroende av ett fåtal centraliserade ekonomiska kanaler förblir de
lätta att pressa, utestänga eller svälta ut ekonomiskt. Bitsocial Chain är det föreslagna svaret på
det andra lagret av beroende.

## Förhållande till apparna

Bitsocial Chain ska ligga under Bitsocial-apparna, inte ersätta dem.

Resultatet utåt bör bli att:

- communities förblir peer-to-peer
- apparna förblir differentierade
- användare får praktiska funktioner för namn och intäkter
- kreatörer och communities kan ta emot stöd oavsett klient
- värde kan röra sig genom ekosystemet utan att en centraliserad plattformsägare återskapas

## Varför detta kommer efter Twitter/X-alternativet

Den nuvarande masterplanen placerar Bitsocial Chain efter Twitter/X-alternativet, eftersom den appen inte behöver kedjan. Profiler körs som profilnoder via icke-förvaltande RPC, och `.bso`-namn kan börja i ett tillfälligt register på Ethereums mainnet ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) och flytta över till kedjan senare.

Bitsocial Chain bör inte byta bort decentralisering mot en tidigare lansering. Den bör inte lägga till några tillitsantaganden utöver Ethereum självt: inga uppgraderingsnycklar, inget säkerhetsråd och ingen operatör som kan censurera eller stoppa den. Den ledande designen för det, en native rollup, är beroende av en Ethereum-uppgradering som ännu inte är schemalagd. Tills kedjan kan uppfylla det kravet bygger Twitter/X-alternativet upp den användarbas som kedjan ska tjäna.

## Designprinciper

Eftersom Bitsocial Chain fortfarande är föreslagen infrastruktur snarare än en lanserad produkt bör
planen förbli disciplinerad:

- Appar och communities först. Nätverkslagret ska göra riktiga sociala produkter starkare.
- Praktiska funktioner först. Namn, utmärkelser, dricks och betalningar är lättare att förklara än
  abstrakt finansiell arkitektur.
- Verkligt bidrag före hype. Ekonomiska primitiver ska belöna deltagande, byggande och stöd till
  communities.
- Kurering är tillåten. Appar kan forma rankningar, standardval och discovery så att hållbara
  communities gynnas.
- De exakta mekanismerna är fortfarande öppna. Den här sidan förklarar vilken roll Bitsocial Chain
  har, inte ett låst löfte om den slutliga ekonomin.
