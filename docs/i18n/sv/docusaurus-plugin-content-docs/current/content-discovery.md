---
title: Innehållsupptäckt
description: Hur Bitsocial skiljer peer discovery från curation på appnivå.
---

# Innehållsupptäckt

Bitsocial lägger inte in ett globalt flöde, sökindex eller rankningsalgoritm i protokollet. Det separerar innehållsupptäckt i två lager:

1. **Nätverkssökning** hittar de kamrater som för närvarande betjänar en känd community.
2. **Appkurator** avgör vilka grupper, anslagstavlor, listor eller inlägg en produkt visar först.

Detta håller protokollet litet samtidigt som det lämnar utrymme för många upptäcktsupplevelser att tävla.

## Nätverkssökning

Varje gemenskap har en stabil adress som kommer från dess publika nyckel. När en klient redan känner till den adressen, frågar den lättviktiga HTTP-routrar för att hitta kamrater som tillkännagav sig själva som leverantörer för den.

Routrarna returnerar endast leverantörs peer-adresser. De lagrar inte inlägg, metadata, användarlistor eller en läsbar katalog över gemenskaper. Efter att klienten tagit emot peer-adresser ansluter den till dessa peers och hämtar den senaste community-metadatan plus innehållspekare, och hämtar sedan den faktiska postdatan med hash.

Detta svarar på protokollfrågan: "Var kan jag hämta det senaste tillståndet för denna grupp?"

## Appkuration

Den separata produktfrågan är: "Vilka gemenskaper ska en användare se först?"

Bitsocial överlåter det till appar, listor och användare istället för att baka in ett svar i nätverket. Exempel inkluderar:

- en klient som visar gemenskaper som användaren redan följer
- en kurerad standardlista för en Reddit-liknande app
- katalogplatser för en app i imageboard-stil
- sök- eller rankningsindex som underhålls av en specifik app
- direktlänkar som delas av användare

Appar kan indexera, rangordna, filtrera eller markera olika saker utan att göra dessa val till protokolllag. Om en apps upptäcktsyta inte är användbar kan en annan app bygga en annan på samma underliggande gemenskaper.

## Aktuella appar

5chan använder för närvarande välbekanta katalogsökvägar som `/b/` eller `/g/`. Kataloguppdrag hanteras via en offentlig lista idag, med framtida versioner som förväntas stödja skapandet av tavlor i appen och rösta för katalogplatser.

Seedit använder standardgrupplistor för sin förstasida. Grupper kan fortfarande skapas och delas utanför den standardlistan.

I båda fallen hjälper listan på appnivå användare att hitta något att öppna, och uppslagningen på protokollnivå löser sedan den valda communityn till kamrater.

## Varför denna splittring spelar roll

Ett enda decentraliserat nätverk behöver fortfarande bra upptäckt, men upptäcktslagret bör vara utbytbart. Bitsocials kärnprotokoll fokuserar på adresserbarhet, peer lookup, publicering och anti-spam. Kuration lever ovanför det lagret, där appar kan experimentera med kataloger, standardlistor, flöden, sökningar, röstnings- och modereringspolicyer utan att kräva en nätverksomfattande migrering.
