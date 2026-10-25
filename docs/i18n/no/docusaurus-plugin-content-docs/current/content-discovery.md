---
title: Oppdagelse av innhold
description: Hvordan Bitsocial skiller fagfelleoppdagelse fra kurering på appnivå.
---

# Oppdagelse av innhold

Bitsocial legger ikke inn én global feed, søkeindeks eller rangeringsalgoritme i protokollen. Den deler innholdsoppdagelse i to lag:

1. **Nettverksoppslag** finner jevnaldrende som for øyeblikket betjener et kjent fellesskap.
2. **Appkurering** bestemmer hvilke fellesskap, tavler, lister eller innlegg et produkt viser først.

Dette holder protokollen liten samtidig som det gir rom for mange oppdagelsesopplevelser å konkurrere.

## Nettverksoppslag

Hvert fellesskap har en stabil adresse hentet fra den offentlige nøkkelen. Når en klient allerede vet den adressen, spør den etter lette HTTP-rutere for å finne jevnaldrende som annonserte seg som leverandører for den.

Ruterne returnerer bare leverandørens peer-adresser. De lagrer ikke innlegg, metadata, brukerlister eller en menneskelig lesbar katalog over fellesskap. Etter at klienten mottar peer-adresser, kobler den seg til disse peerne og henter de siste fellesskapsmetadataene pluss innholdspekere, og henter deretter de faktiske postdataene med hash.

Dette svarer på protokollspørsmålet: "Hvor kan jeg hente den siste tilstanden for dette fellesskapet?"

## Appkurasjon

Det separate produktspørsmålet er: "Hvilke fellesskap bør en bruker se først?"

Bitsocial overlater det til apper, lister og brukere i stedet for å bake ett svar inn i nettverket. Eksempler inkluderer:

- en klient som viser fellesskap brukeren allerede følger
- en kurert standardliste for en app i Reddit-stil
- kataloger, der fellesskap konkurrerer om et emnenavn som `/g/` eller `/s/funny`
- søke- eller rangeringsindekser vedlikeholdt av en bestemt app
- direkte lenker som deles av brukere

Apper kan indeksere, rangere, filtrere eller fremheve forskjellige ting uten å gjøre disse valgene om til protokolllov. Hvis en apps oppdagelsesoverflate ikke er nyttig, kan en annen app bygge en annen på de samme underliggende fellesskapene.

## Nåværende apper

5chan og Seedit bruker begge [kataloger](./directories.md): korte ruter som `/g/` eller `/s/funny` som fellesskap konkurrerer om. Kandidatene står foreløpig i et offentlig depot, og 5chan tester avstemninger for å avgjøre vinnerne.

Seedit abonnerer også nye kontoer på en standardliste med eksakte fellesskap. Fellesskap kan fortsatt opprettes og deles utenfor disse listene.

I begge tilfeller hjelper app-nivå-listen brukere med å finne noe å åpne, og oppslaget på protokollnivå løser deretter det valgte fellesskapet til jevnaldrende.

## Hvorfor denne splittelsen er viktig

Et enkelt desentralisert nettverk trenger fortsatt god oppdagelse, men oppdagelseslaget bør være utskiftbart. Bitsocials kjerneprotokoll fokuserer på adresserbarhet, peer-oppslag, publisering og anti-spam. Kurering lever over det laget, der apper kan eksperimentere med kataloger, standardlister, feeder, søk, stemmegivning og moderering uten å kreve en nettverksomfattende migrering.
