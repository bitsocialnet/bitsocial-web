---
title: Desentraliser Twitter/X
description: "Fase 3 i masterplanen: et fokusert, desentralisert alternativ til Twitter/X for tekstbasert offentlig samtale, med utskiftbar infrastruktur."
---

# Desentraliser Twitter/X

Fase 3 er en plan for å bygge et fokusert, desentralisert alternativ til Twitter/X. Kjernen er tekstbasert offentlig samtale: korte innlegg, svar, delinger, følgere, diskusjoner i sanntid og fellesskap, med et åpent plattformlag.

Twitter/X defineres fortsatt av innlegg, tekst og deling av ideer. Klienten i fase 3 bør konkurrere på denne kjerneopplevelsen og få den til å fungere usedvanlig godt.

Denne siden beskriver produktretningen, ikke en fastlåst lanseringsspesifikasjon. Det nøyaktige grensesnittet, standardfeeden, annonsemodellen, AI-funksjonene og RPC-markedsplassen kan endres etter hvert som protokollen og de tidlige appene modnes.

## Hva det skal bevise

Klienten bør bevise at et profilbasert sosialt nettverk kan unngå å bli en plattform som tar kontroll over brukernes identiteter og profiler:

- brukere kan eie identiteter og profiler
- fellesskap og profilnoder kan forbli peer-to-peer
- fellesskap kan bære nettverkseffekter på tvers av Bitsocial-klienter
- RPC-leverandører kan gjøre appen praktisk uten å ta kontroll over brukerens identitet eller profil
- feedalgoritmer kan være valgfrie tjenester i stedet for plattformlov
- andre klienter kan fortsatt konkurrere om det samme nettverket

Poenget er å bygge den best mulige klienten for offentlig samtale og vise hvor langt protokollen kan strekkes.

## Velkjent i formål, utskiftbar i design

Standardopplevelsen bør kunne konkurrere med kjernen i Twitter/X: en rask startfeed, tekstinnlegg, følgere, svar, deling i repost-stil, fellesskap, varsler, søk og en rangert For You-visning som fungerer med én gang.

Bitsocial Forge kan kjøre den første standard RPC- og feedtjenesten. Denne standarden kan inkludere en rangert feed og annonser slik at appen føles komplett på dag én i stedet for å be mainstream-brukere om å sette sammen hele stabelen selv.

Forskjellen er at standarden ikke må bli et fengsel. En bruker bør kunne bytte RPC-er, feeder, instanser, rangeringssystemer, annonser og oppdagelsestjenester, eller fjerne rangering helt. Klienten kan ha tydelige standardvalg ved første oppstart samtidig som alle viktige tjenester kan byttes ut.

Det gjør klienten mer tilpassbar enn en tradisjonell plattform. Én bruker kan beholde den rangerte standardfeeden med annonser. En annen kan bruke en kronologisk feed uten rangering. En tredje kan velge en personvernfokusert RPC, en fellesskapsdrevet oppdagelsestjeneste, en betalt reklamefri feed eller en nisjealgoritme for en bestemt subkultur.

## Tverrklientsamfunn

Fellesskap burde være mye viktigere enn isolerte grupper i én app.

På X/Twitter er fellesskap begrenset innenfor X. De kan være nyttige, men de arver grensene for én plattform, ett kontosystem, én anbefalingsstabel og én produktoverflate.

Et Bitsocial-fellesskap kan opprettes, driftes, oppdages og brukes gjennom ulike klienter. Det betyr at klienten i fase 3 kan vise fellesskap og innlegg fra det bredere Bitsocial-nettverket, ikke bare fra brukere som startet i den. Et fellesskap kan samtidig ha aktivitet fra en imageboard-klient, en Reddit-lignende diskusjonsklient, en nisjeforumklient, en mobilapp og klienten i fase 3.

Det er fordelen med kjernenettverkseffekten: én klient kan føle seg kjent for vanlige brukere samtidig som den henter verdi fra mange klienter, fellesskapsnoder, RPC-leverandører og uavhengige tjenester.

## Valgfrie feed-algoritmer

Klienten i fase 3 bør ikke tvinge ett globalt rangeringssystem på alle.

Feedalgoritmer bør være opt-in. En bruker kan velge en algoritme fra en markedsplass, bytte leverandør, bruke en algoritme fra et selskap, bruke en drevet av en anonym operatør, bruke en bygget av et fellesskap, kjøre en personlig eller ikke bruke noen algoritme i det hele tatt.

Offentlige RPC-leverandører er et naturlig sted for disse tjenestene å konkurrere. De kan indeksere, rangere og anbefale innhold, men de skal ikke kontrollere brukerens identitet eller profil.

Disse tjenestene kan også konkurrere på formen til selve appen. Én RPC kan gi en rangert feed med annonser. En annen kan gi en urangert kronologisk feed. En annen kan spesialisere seg på personvern, oversettelse, moderering, fellesskapsoppdagelse eller en nisje sosial graf.

Hvis økonomien fungerer, kan RPC-støttede feed-tjenester legge til AI-funksjoner som ligner på hva vanlige plattformer prøver å legge inn i feedene sine: automatiske oversettelser, sammendrag, bot-assisterte svar, søkesvar, modereringshjelp eller kontekst for fellesskapsnotater.

Disse funksjonene bør være tjenestevalg, ikke protokollkrav. En standard RPC kan konkurrere ved å tilby en rikere feed, men brukere og konkurrerende klienter bør fortsatt kunne velge enklere, private, kronologiske, annonsefrie eller fellesskapsspesifikke alternativer.

## RPC uten leverandørkontroll over identitet eller profil

Hver bruker skal kunne delta som en fullverdig peer-to-peer-node gjennom RPC uten å gi RPC-leverandøren eierskap over identiteten eller profilen sin.

Den vertsbaserte banen er viktig fordi de fleste brukere ikke vil starte med å kjøre en server. Utgangsveien betyr like mye: en bruker skal kunne flytte til sin egen profilnode på lavspesifisert maskinvare, inkludert en Raspberry Pi, når de vil.

Det er forskjellen mellom bekvemmelighet og å overlate kontrollen.

## Offentlig samtale, styrket av Bitsocial Chain

Bitsocial Chain kan bringe varig navngivning, betalinger, tips, utmerkelser og andre finansielle funksjoner direkte inn i den offentlige samtalen.

Klienten i fase 3 forblir sentrert rundt innlegg, tekst, deling av ideer og diskusjoner i sanntid, samtidig som den deler fellesskap og nettverkseffekter med andre Bitsocial-klienter.
