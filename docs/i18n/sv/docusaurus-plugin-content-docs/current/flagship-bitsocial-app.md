---
title: Flaggskepp Bitsocial App
description: "Den föreslagna profilbaserade Bitsocial-klienten: bekant som X/Twitter som standard, men med utbytbara RPC:er, flöden, algoritmer, annonser och gemenskaper."
---

# Flaggskepp Bitsocial App

Flaggskeppet Bitsocial-appen är den föreslagna första profilbaserade klienten för nätverket. Den enklaste jämförelsen är: bekant som X/Twitter som standard, men med plattformslagret brutet upp.

Det skulle lägga till profiler, följer, svar, flöden, gemenskaper, meddelanden och offentliga samtal i realtid samtidigt som de underliggande tjänsterna hålls utbytbara. 5chan bevisar att anonyma gemenskaper kan fungera. Seedit går mot en ihållande diskussion. Flaggskeppsappen skulle föra in dessa nätverkseffekter i ett mainstream socialt flöde utan att göra ett företag till ägaren av grafen.

Den här sidan beskriver produktriktningen, inte en låst utlösningsspecifikation. Det exakta gränssnittet, standardflödet, annonsmodellen, AI-funktionerna och RPC-marknaden kan ändras när protokollet och tidiga appar mognar.

## Vad det borde bevisa

Appen ska bevisa att ett profilbaserat socialt nätverk kan undvika att bli en vårdnadsplattform:

- användare kan äga identiteter och profiler
- gemenskaper och profilnoder kan vara peer-to-peer
- gemenskaper kan bära nätverkseffekter över Bitsocial-klienter
- RPC-leverantörer kan göra appen bekväm utan att ta vårdnad
- flödesalgoritmer kan vara valfria tjänster istället för plattformslagstiftning
- andra klienter kan fortfarande konkurrera om samma nätverk

Poängen är inte att göra den enda Bitsocial-klienten. Poängen är att göra den första breda klienten som visar hur långt protokollet kan sträcka sig.

## Bekant som standard, utbytbar genom design

Standardupplevelsen bör vara konkurrenskraftig med vanliga appar för offentliga konversationer: ett snabbt hemflöde, uppföljningar, svar, distribution i repost-stil, gemenskaper, aviseringar, sökning och en rankad För dig-vy som fungerar direkt.

Bitsocial Forge kan köra den första standard-RPC- och flödestjänsten. Den standarden kan inkludera ett rankat flöde och annonser så att appen känns komplett på dag ett istället för att be vanliga användare att montera hela stacken själva.

Skillnaden är att standarden inte ska bli fängelset. En användare bör kunna byta RPC:er, flöden, instanser, rankningssystem, annonser och upptäcktsleverantörer, eller ta bort rankningen helt. Appen kan vara pålitlig vid första lanseringen samtidigt som alla större tjänster är utbytbara.

Det gör appen mer anpassningsbar än en konventionell plattform. En användare kan behålla standardflödet med annonser. En annan kan använda ett kronologiskt flöde utan rankning. En annan kan välja en integritetsfokuserad RPC, en communitydriven upptäcktstjänst, ett betald annonsfritt flöde eller en nischalgoritm byggd för en specifik subkultur.

## Tvärklientgemenskaper

Gemenskaper borde vara mycket viktigare än isolerade grupper i en app.

På X/Twitter är gemenskaper begränsade inom X. De kan vara användbara, men de ärver gränserna för en plattform, ett kontosystem, en rekommendationsstack och en produktyta.

En Bitsocial-gemenskap kan skapas, lagras, upptäckas och användas genom olika klienter. Det betyder att flaggskeppsappen kan visa gemenskaper och inlägg från det bredare Bitsocial-nätverket, inte bara från användare som startade i flaggskeppsappen. En community kan ha aktivitet från en imageboard-klient, en Reddit-liknande diskussionsklient, en nischforumklient, en mobilapp och flaggskeppsappen på samma gång.

Det är den centrala fördelen med nätverkseffekt: en klient kan känna sig bekant för vanliga användare samtidigt som den drar värde från många klienter, communitynoder, RPC-leverantörer och oberoende tjänster.

## Valfria matningsalgoritmer

Flaggskeppsappen ska inte tvinga på alla ett globalt rankningssystem.

Flödesalgoritmer bör vara opt-in. En användare kan välja en algoritm från en marknadsplats, byta leverantör, använda en algoritm från ett företag, använda en som drivs av en anonym operatör, använda en byggd av en gemenskap, köra en personlig eller inte använda någon algoritm alls.

Offentliga RPC-leverantörer är en naturlig plats för dessa tjänster att konkurrera. De kan indexera, rangordna och rekommendera innehåll, men de ska inte äga användaren eller profilen.

Dessa tjänster kan också konkurrera om formen på själva appen. En RPC kan ge ett rankat flöde med annonser. En annan kan tillhandahålla en orangad kronologisk feed. En annan kan specialisera sig på integritet, översättning, moderering, community discovery eller en nischad social graf.

Om ekonomin fungerar kan RPC-stödda flödestjänster lägga till AI-funktioner som liknar vad vanliga plattformar försöker lägga till i sina flöden: automatiska översättningar, sammanfattningar, bot-assisterade svar, söksvar, modereringshjälp eller community-note-stilsammanhang.

Dessa funktioner bör vara tjänsteval, inte protokollkrav. En standard-RPC kan konkurrera genom att erbjuda ett rikare flöde, men användare och konkurrerande kunder bör fortfarande kunna välja enklare, privata, kronologiska, annonsfria eller gemenskapsspecifika alternativ.

## RPC utan frihetsberövande

Varje användare bör kunna delta som en fullständig peer-to-peer-nod genom RPC utan att ge RPC-leverantören äganderätt över sin identitet eller profil.

Den värdbaserade sökvägen spelar roll eftersom de flesta användare inte kommer att börja med att köra en server. Utgångsvägen spelar lika stor roll: en användare ska kunna flytta till sin egen profilnod på hårdvara med låg specifikation, inklusive en Raspberry Pi, när de vill.

Det är skillnaden mellan bekvämlighet och vårdnad.

## Varför det kan bli en allt-app

Om Bitsocial Network ger appar varaktiga namn, betalningar, dricks, utmärkelser och andra finansiella skenor, kan flaggskeppsappen bli mycket mer än en flödesklient.

Den viktiga begränsningen är att appen inte ska bli den nya ägaren av nätverket. Det kan vara en stor klient, kanske till och med den mest populära klienten, samtidigt som den lämnar utrymme för konkurrerande appar, konkurrerande RPC:er, konkurrerande flödesalgoritmer och egenvärdiga profilnoder.
