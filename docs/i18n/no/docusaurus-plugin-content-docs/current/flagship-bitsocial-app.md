---
title: Flaggskipet Bitsocial-appen
description: "Den foreslåtte profilbaserte Bitsocial-klienten: kjent som X/Twitter som standard, men med utskiftbare RPC-er, feeder, algoritmer, annonser og fellesskap."
---

# Flaggskipet Bitsocial-appen

Flaggskipet Bitsocial-appen er den foreslåtte første profilbaserte klienten for nettverket. Den enkleste sammenligningen er: kjent som X/Twitter som standard, men med plattformlaget brutt opp.

Det vil legge til profiler, følger, svar, feeder, fellesskap, varsler og offentlig samtale i sanntid samtidig som de underliggende tjenestene kan byttes ut. 5chan beviser at anonyme fellesskap kan fungere. Seedit beveger seg mot vedvarende diskusjon. Flaggskip-appen ville bringe disse nettverkseffektene inn i en vanlig sosial feed uten å gjøre ett selskap til eieren av grafen.

Denne siden beskriver produktretning, ikke en låst utgivelsesspesifikasjon. Det nøyaktige grensesnittet, standardfeeden, annonsemodellen, AI-funksjonene og RPC-markedsplassen kan endres etter hvert som protokollen og tidlige apper modnes.

## Hva det skal bevise

Appen skal bevise at et profilbasert sosialt nettverk kan unngå å bli en forvaringsplattform:

- brukere kan eie identiteter og profiler
- fellesskap og profilnoder kan forbli peer-to-peer
- fellesskap kan bære nettverkseffekter på tvers av Bitsocial-klienter
- RPC-leverandører kan gjøre appen praktisk uten å ta varetekt
- feedalgoritmer kan være valgfrie tjenester i stedet for plattformlov
- andre klienter kan fortsatt konkurrere om det samme nettverket

Poenget er ikke å lage den eneste Bitsocial-klienten. Poenget er å lage den første brede klienten som viser hvor langt protokollen kan strekke seg.

## Kjent som standard, kan erstattes av design

Standardopplevelsen bør være konkurransedyktig med vanlige apper for offentlige samtaler: en rask hjemmefeed, følger, svar, distribusjon i repost-stil, fellesskap, varsler, søk og en rangert For deg-visning som fungerer umiddelbart.

Bitsocial Forge kan kjøre den første standard RPC- og feedtjenesten. Denne standarden kan inkludere en rangert feed og annonser slik at appen føles komplett på dag én i stedet for å be mainstream-brukere om å sette sammen hele stabelen selv.

Forskjellen er at standarden ikke skal bli fengselet. En bruker skal kunne bytte RPCer, feeder, forekomster, rangeringssystemer, annonser og oppdagelsesleverandører, eller fjerne rangeringen helt. Appen kan være meningsfull ved første lansering samtidig som alle større tjenester kan byttes ut.

Det gjør appen mer tilpassbar enn en konvensjonell plattform. Én bruker kan beholde standard rangerte feed med annonser. En annen kan bruke en kronologisk feed uten rangering. En annen kan velge en personvernfokusert RPC, en fellesskapsdrevet oppdagelsestjeneste, en betalt annonsefri feed eller en nisjealgoritme bygget for en spesifikk subkultur.

## Tverrklientsamfunn

Fellesskap burde være mye viktigere enn isolerte grupper i én app.

På X/Twitter er fellesskap begrenset innenfor X. De kan være nyttige, men de arver grensene for én plattform, ett kontosystem, én anbefalingsstabel og én produktoverflate.

Et Bitsocial-fellesskap kan opprettes, hostes, oppdages og brukes gjennom forskjellige klienter. Det betyr at flaggskipappen kan vise fellesskap og innlegg fra det bredere Bitsocial-nettverket, ikke bare fra brukere som startet i flaggskipappen. Et fellesskap kan ha aktivitet fra en imageboard-klient, en diskusjonsklient i Reddit-stil, en nisjeforumklient, en mobilapp og flaggskipappen på samme tid.

Det er fordelen med kjernenettverkseffekten: én klient kan føle seg kjent for vanlige brukere samtidig som den henter verdi fra mange klienter, fellesskapsnoder, RPC-leverandører og uavhengige tjenester.

## Valgfrie feed-algoritmer

Flaggskip-appen skal ikke tvinge et globalt rangeringssystem på alle.

Feedalgoritmer bør være opt-in. En bruker kan velge en algoritme fra en markedsplass, bytte leverandør, bruke en algoritme fra et selskap, bruke en drevet av en anonym operatør, bruke en bygget av et fellesskap, kjøre en personlig eller ikke bruke noen algoritme i det hele tatt.

Offentlige RPC-leverandører er et naturlig sted for disse tjenestene å konkurrere. De kan indeksere, rangere og anbefale innhold, men de skal ikke eie brukeren eller profilen.

Disse tjenestene kan også konkurrere på formen til selve appen. Én RPC kan gi en rangert feed med annonser. En annen kan gi en urangert kronologisk feed. En annen kan spesialisere seg på personvern, oversettelse, moderering, fellesskapsoppdagelse eller en nisje sosial graf.

Hvis økonomien fungerer, kan RPC-støttede feed-tjenester legge til AI-funksjoner som ligner på hva vanlige plattformer prøver å legge inn i feedene sine: automatiske oversettelser, sammendrag, bot-assisterte svar, søkesvar, modereringshjelp eller kontekst for fellesskapsnotater.

Disse funksjonene bør være tjenestevalg, ikke protokollkrav. En standard RPC kan konkurrere ved å tilby en rikere feed, men brukere og konkurrerende kunder bør fortsatt kunne velge enklere, private, kronologiske, annonsefrie eller fellesskapsspesifikke alternativer.

## Ikke-forvarende RPC

Hver bruker skal kunne delta som en fullstendig node-til-node-node gjennom RPC uten å gi RPC-leverandøren eierskap over deres identitet eller profil.

Den vertsbaserte banen er viktig fordi de fleste brukere ikke vil starte med å kjøre en server. Utgangsveien betyr like mye: en bruker skal kunne flytte til sin egen profilnode på lavspesifisert maskinvare, inkludert en Raspberry Pi, når de vil.

Det er forskjellen mellom bekvemmelighet og varetekt.

## Hvorfor det kan bli en alt-app

Hvis Bitsocial Network gir apper varige navn, betalinger, tips, priser og andre økonomiske spor, kan flaggskipappen bli mye mer enn en feedklient.

Den viktige begrensningen er at appen ikke skal bli den nye eieren av nettverket. Det kan være en stor klient, kanskje til og med den mest populære klienten, mens den fortsatt gir plass til konkurrerende apper, konkurrerende RPC-er, konkurrerende feedalgoritmer og selvvertsbaserte profilnoder.
