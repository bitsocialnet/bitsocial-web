---
title: Decentralisera Twitter/X
description: "Fas 3 i huvudplanen: ett fokuserat, decentraliserat alternativ till Twitter/X för textcentrerade offentliga samtal, med utbytbar infrastruktur."
---

# Decentralisera Twitter/X

Fas 3 är en plan för att bygga ett fokuserat, decentraliserat alternativ till Twitter/X. Kärnan är textcentrerade offentliga samtal: korta inlägg, svar, återpubliceringar, följningar, diskussioner i realtid och gemenskaper, med ett öppet plattformslager.

Twitter/X definieras fortfarande av inlägg, text och delning av idéer. Klienten i fas 3 bör konkurrera med den kärnupplevelsen och få den att fungera exceptionellt väl.

Den här sidan beskriver produktens riktning, inte en låst lanseringsspecifikation. Det exakta gränssnittet, standardflödet, annonsmodellen, AI-funktionerna och RPC-marknadsplatsen kan förändras när protokollet och de första apparna mognar.

## Vad det borde bevisa

Klienten bör visa att ett profilbaserat socialt nätverk kan undvika att bli en plattform som tar kontroll över användarnas identiteter och profiler:

- användare kan äga identiteter och profiler
- gemenskaper och profilnoder kan vara peer-to-peer
- gemenskaper kan bära nätverkseffekter över Bitsocial-klienter
- RPC-leverantörer kan göra appen bekväm utan att ta kontroll över användarens identitet eller profil
- flödesalgoritmer kan vara valfria tjänster istället för plattformslagstiftning
- andra klienter kan fortfarande konkurrera om samma nätverk

Poängen är att bygga den bästa möjliga klienten för offentliga samtal och visa hur långt protokollet kan sträcka sig.

## Bekant i syfte, utbytbar genom design

Standardupplevelsen bör kunna konkurrera med kärnan i Twitter/X: ett snabbt hemflöde, textinlägg, följningar, svar, spridning genom återpubliceringar, gemenskaper, aviseringar, sökning och en rangordnad For You-vy som fungerar direkt.

Bitsocial Forge kan köra den första standard-RPC- och flödestjänsten. Den standarden kan inkludera ett rankat flöde och annonser så att appen känns komplett på dag ett istället för att be vanliga användare att montera hela stacken själva.

Skillnaden är att standardvalet inte får bli ett fängelse. En användare bör kunna byta RPC:er, flöden, instanser, rangordningssystem, annonser och upptäcktstjänster eller ta bort rangordningen helt. Klienten kan ha tydliga standardval vid första starten och samtidigt hålla alla viktiga tjänster utbytbara.

Det gör klienten mer anpassningsbar än en traditionell plattform. En användare kan behålla det rangordnade standardflödet med annonser. En annan kan använda ett kronologiskt flöde utan rangordning. En tredje kan välja en integritetsinriktad RPC, en gemenskapsdriven upptäcktstjänst, ett betalt annonsfritt flöde eller en nischalgoritm för en viss subkultur.

## Tvärklientgemenskaper

Gemenskaper borde vara mycket viktigare än isolerade grupper i en app.

På X/Twitter är gemenskaper begränsade inom X. De kan vara användbara, men de ärver gränserna för en plattform, ett kontosystem, en rekommendationsstack och en produktyta.

En Bitsocial-gemenskap kan skapas, driftas, upptäckas och användas genom olika klienter. Det innebär att klienten i fas 3 kan visa gemenskaper och inlägg från det bredare Bitsocial-nätverket, inte bara från användare som började i den. En gemenskap kan samtidigt ha aktivitet från en imageboard-klient, en diskussionsklient i Reddit-stil, en nischforumklient, en mobilapp och klienten i fas 3.

Det är den centrala fördelen med nätverkseffekt: en klient kan känna sig bekant för vanliga användare samtidigt som den drar värde från många klienter, communitynoder, RPC-leverantörer och oberoende tjänster.

## Valfria matningsalgoritmer

Klienten i fas 3 bör inte tvinga på alla ett enda globalt rangordningssystem.

Flödesalgoritmer bör vara opt-in. En användare kan välja en algoritm från en marknadsplats, byta leverantör, använda en algoritm från ett företag, använda en som drivs av en anonym operatör, använda en byggd av en gemenskap, köra en personlig eller inte använda någon algoritm alls.

Offentliga RPC-leverantörer är en naturlig plats för dessa tjänster att konkurrera. De kan indexera, rangordna och rekommendera innehåll, men de ska inte kontrollera användarens identitet eller profil.

Dessa tjänster kan också konkurrera om formen på själva appen. En RPC kan ge ett rankat flöde med annonser. En annan kan tillhandahålla en orangad kronologisk feed. En annan kan specialisera sig på integritet, översättning, moderering, community discovery eller en nischad social graf.

Om ekonomin fungerar kan RPC-stödda flödestjänster lägga till AI-funktioner som liknar vad vanliga plattformar försöker lägga till i sina flöden: automatiska översättningar, sammanfattningar, bot-assisterade svar, söksvar, modereringshjälp eller community-note-stilsammanhang.

Dessa funktioner bör vara tjänsteval, inte protokollkrav. En standard-RPC kan konkurrera genom att erbjuda ett rikare flöde, men användare och konkurrerande klienter bör fortfarande kunna välja enklare, privata, kronologiska, annonsfria eller gemenskapsspecifika alternativ.

## RPC utan leverantörskontroll över identitet eller profil

Varje användare bör kunna delta som en fullständig peer-to-peer-nod genom RPC utan att ge RPC-leverantören äganderätt över sin identitet eller profil.

Den värdbaserade sökvägen spelar roll eftersom de flesta användare inte kommer att börja med att köra en server. Utgångsvägen spelar lika stor roll: en användare ska kunna flytta till sin egen profilnod på hårdvara med låg specifikation, inklusive en Raspberry Pi, när de vill.

Det är skillnaden mellan bekvämlighet och att lämna över kontrollen.

## Offentliga samtal, stärkta av Bitsocial Chain

Bitsocial Chain kan föra in beständig namngivning, betalningar, dricks, utmärkelser och andra finansiella funktioner direkt i det offentliga samtalet.

Klienten i fas 3 förblir inriktad på inlägg, text, delning av idéer och diskussioner i realtid, samtidigt som den delar gemenskaper och nätverkseffekter med andra Bitsocial-klienter.
