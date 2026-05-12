---
title: Opdagelse af indhold
description: Hvordan Bitsocial adskiller peer-opdagelse fra kuration på app-niveau.
---

# Opdagelse af indhold

Bitsocial sætter ikke ét globalt feed, søgeindeks eller rangeringsalgoritme i protokollen. Det adskiller indholdsopdagelse i to lag:

1. **Netværksopslag** finder de jævnaldrende, der i øjeblikket betjener et kendt fællesskab.
2. **App-kuration** bestemmer, hvilke fællesskaber, tavler, lister eller opslag et produkt viser først.

Dette holder protokollen lille, samtidig med at der er plads til mange opdagelsesoplevelser at konkurrere.

## Netværksopslag

Ethvert fællesskab har en stabil adresse, der stammer fra dens offentlige nøgle. Når en klient allerede kender denne adresse, forespørger den letvægts HTTP-routere for at finde peers, der annoncerede sig selv som udbydere af den.

Routerne returnerer kun udbyderens peer-adresser. De gemmer ikke indlæg, metadata, brugerlister eller en menneskelig læselig mappe over fællesskaber. Efter at klienten har modtaget peer-adresser, opretter den forbindelse til disse peers og henter de seneste fællesskabsmetadata plus indholdspointere, hvorefter de faktiske postdata hentes med hash.

Dette besvarer protokolspørgsmålet: "Hvor kan jeg hente den seneste tilstand for dette fællesskab?"

## App-kuration

Det separate produktspørgsmål er: "Hvilke fællesskaber skal en bruger se først?"

Bitsocial overlader det til apps, lister og brugere i stedet for at bage ét svar ind i netværket. Eksempler omfatter:

- en klient, der viser fællesskaber, som brugeren allerede følger
- en kureret standardliste for en app i Reddit-stil
- mappepladser til en app i imageboard-stil
- søge- eller rangeringsindekser, der vedligeholdes af en bestemt app
- direkte links delt af brugere

Apps kan indeksere, rangere, filtrere eller fremhæve forskellige ting uden at omdanne disse valg til protokollovgivning. Hvis en apps opdagelsesflade ikke er nyttig, kan en anden app bygge en anden på de samme underliggende fællesskaber.

## Aktuelle apps

5chan bruger i øjeblikket velkendte mappestier såsom `/b/` eller `/g/`. Directory-tildelinger administreres gennem en offentlig liste i dag, med fremtidige versioner, der forventes at understøtte oprettelse af tavler i appen og stemme for katalogpladser.

Seedit bruger standard fællesskabslister til sin forside. Fællesskaber kan stadig oprettes og deles uden for denne standardliste.

I begge tilfælde hjælper app-niveau-listen brugere med at finde noget at åbne, og protokol-niveau-opslaget løser derefter det valgte fællesskab til peers.

## Hvorfor denne opdeling betyder noget

Et enkelt decentraliseret netværk har stadig brug for god opdagelse, men opdagelseslaget bør kunne udskiftes. Bitsocials kerneprotokol fokuserer på adresserbarhed, peer-opslag, publicering og anti-spam. Kuration lever over det lag, hvor apps kan eksperimentere med mapper, standardlister, feeds, politikker for søgning, afstemning og moderering uden at kræve en netværksdækkende migrering.
