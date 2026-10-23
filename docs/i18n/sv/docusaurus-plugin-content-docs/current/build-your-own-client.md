---
title: Bygg din egen Bitsocial-klient
description: Byggarguide för att lansera oberoende Bitsocial-klienter, från imageboards och forum till nischade sociala appar.
---

# Bygg din egen Bitsocial-klient

Bitsocial vinner inte genom att ha en officiell app för varje användningsfall. Det vinner när många
klienter kan dela samma protokoll samtidigt som de konkurrerar om gränssnitt, kultur,
innehållsupptäckt, standardinställningar och affärsmodell.

5chan och Seedit är tidiga bevispunkter, inte ett tak. En byggare ska kunna lansera en ny imageboard,
ett forum, en profilklient, en mobilfokuserad social app, ett nischat community-verktyg eller en
centraliserad klient som använder Bitsocial under huven, utan att be en plattformsägare om lov.

## Vad byggare kan förändra

En Bitsocial-klient kan konkurrera med produktbeslut utan att forka hela nätverket:

- gränssnitt och visuellt språk
- onboardingflöde
- standardinställningar för communities
- modereringsytor
- modell för innehållsupptäckt
- mediaupplevelse
- begränsningar för mobil, dator eller låg bandbredd
- intäktsgenerering och affärsmodell

Det gemensamma lagret är protokollet. Produktlagret är öppet för konkurrens.

## Snabbaste sättet att lära sig

Börja med apparna som redan finns:

- Testa [5chan](https://5chan.app) för anonyma imageboard-communities.
- Testa [Seedit](https://seedit.app) för diskussioner i Reddit-stil.
- Läs dokumentationen om [Bitsocial React hooks](https://hooks.bitsocial.net/docs/quickstart/) för integration på
  klientsidan.
- Läs dokumentationen om [Bitsocial CLI](/developer-tools/cli/) för nod- och community-drift.

Om du vill komma igång snabbt, bidra först till en app som redan finns. Om det gränssnitt, den kultur
eller den communitymodell du vill ha inte passar in, bygg en separat klient.

## Välj en smal första version

Den bästa första versionen är inte en universell social app. Det är en klient med en tydlig målgrupp
och ett starkt skäl att existera.

Bra utgångspunkter är bland annat:

- en renare imageboard-klient för en specifik kultur
- en mobilfokuserad forumklient
- en app för ett enda community med strikta standardinställningar
- en klient för kreatörscommunities
- en klient enbart för läsning och innehållsupptäckt
- en konsol för moderering eller drift
- en klient optimerad för ett språk, en region eller en enhetsklass

Små klienter är användbara eftersom Bitsocial låter dem växa in i samma nätverk i stället för att
låsa in sina användare i en privat databas.

## Implementationsvägar

Det finns tre praktiska vägar:

1. Forka en befintlig klient när din idé ligger nära 5chan eller Seedit.
2. Bygg en ny React-klient med [Bitsocial React hooks](https://hooks.bitsocial.net/).
3. Bygg din egen integration ovanpå nod-API:er och publik RPC-infrastruktur.

Publik RPC bör göra den tredje vägen betydligt mer praktisk. En användare kan börja hos en hostad,
icke-förvaltande RPC-leverantör och senare gå över till egen drift eller en konkurrerande leverantör.

## Designprincip

Bygg den klient som borde finnas för ditt community, och låt sedan kompatibla klienter konkurrera
öppet.
