---
title: Flagskib Bitsocial App
description: "Den foreslåede profilbaserede Bitsocial-klient: kendt som X/Twitter som standard, men med udskiftelige RPC'er, feeds, algoritmer, annoncer og fællesskaber."
---

# Flagskib Bitsocial App

Flagskibet Bitsocial-appen er den foreslåede første profilbaserede klient til netværket. Den enkleste sammenligning er: kendt som X/Twitter som standard, men med platformslaget brudt op.

Det ville tilføje profiler, følger, svar, feeds, fællesskaber, meddelelser og offentlig samtale i realtid, mens de underliggende tjenester kunne udskiftes. 5chan beviser, at anonyme fællesskaber kan fungere. Seedit bevæger sig mod vedvarende diskussion. Flagskibsappen ville bringe disse netværkseffekter ind i et almindeligt socialt feed uden at gøre en virksomhed til ejeren af ​​grafen.

Denne side beskriver produktretning, ikke en låst udgivelsesspecifikation. Den nøjagtige grænseflade, standardfeed, annoncemodel, AI-funktioner og RPC-markedsplads kan ændre sig, efterhånden som protokollen og de tidlige apps modnes.

## Hvad det skal bevise

Appen skulle bevise, at et profilbaseret socialt netværk kan undgå at blive en frihedsberøvende platform:

- brugere kan eje identiteter og profiler
- fællesskaber og profilknudepunkter kan forblive peer-to-peer
- fællesskaber kan bære netværkseffekter på tværs af Bitsocial-klienter
- RPC-udbydere kan gøre appen praktisk uden at tage forældremyndigheden
- feed-algoritmer kan være valgfrie tjenester i stedet for platformslovgivning
- andre klienter kan stadig konkurrere om det samme netværk

Pointen er ikke at være den eneste Bitsocial-klient. Pointen er at lave den første brede klient, der viser, hvor langt protokollen kan strække sig.

## Velkendt som standard, kan udskiftes efter design

Standardoplevelsen bør være konkurrencedygtig med almindelige offentlige samtaleapps: et hurtigt hjemmefeed, følger, svar, distribution i repost-stil, fællesskaber, notifikationer, søgning og en rangeret Til dig-visning, der virker med det samme.

Bitsocial Forge kan køre den første standard RPC og feed-tjeneste. Denne standard kan omfatte et rangeret feed og annoncer, så appen føles komplet på dag ét i stedet for at bede almindelige brugere om selv at samle hele stakken.

Forskellen er, at standarden ikke skal blive fængslet. En bruger skal være i stand til at skifte RPC'er, feeds, forekomster, rangordningssystemer, annoncer og opdagelsesudbydere eller helt fjerne rangeringen. Appen kan være meningsfuld ved første lancering, mens alle større tjenester kan udskiftes.

Det gør appen mere tilpasselig end en konventionel platform. Én bruger beholder muligvis standardfeedet med annoncer. En anden bruger muligvis et kronologisk feed uden rangering. En anden kan vælge en privatlivsfokuseret RPC, en samfundsdrevet opdagelsestjeneste, et betalt annoncefrit feed eller en nichealgoritme bygget til en specifik subkultur.

## Tværklientfællesskaber

Fællesskaber burde være meget vigtigere end isolerede grupper i én app.

På X/Twitter er fællesskaber begrænset inde i X. De kan være nyttige, men de arver grænserne for én platform, ét kontosystem, én anbefalingsstak og én produktoverflade.

Et Bitsocial-fællesskab kan oprettes, hostes, opdages og bruges gennem forskellige klienter. Det betyder, at flagskibsappen kan vise fællesskaber og indlæg fra det bredere Bitsocial-netværk, ikke kun fra brugere, der startede inde i flagskibsappen. Et fællesskab kunne have aktivitet fra en imageboard-klient, en Reddit-lignende diskussionsklient, en nicheforumklient, en mobilapp og flagskibsappen på samme tid.

Det er kernefordelen med netværkseffekt: én klient kan føle sig bekendt for almindelige brugere, mens den stadig trækker værdi fra mange klienter, community-noder, RPC-udbydere og uafhængige tjenester.

## Valgfri feed-algoritmer

Flagskibsappen bør ikke tvinge et globalt rangeringssystem på alle.

Feedalgoritmer bør være opt-in. En bruger kan vælge en algoritme fra en markedsplads, skifte udbyder, bruge en algoritme fra en virksomhed, bruge en drevet af en anonym operatør, bruge en bygget af et fællesskab, køre en personlig eller slet ikke bruge nogen algoritme.

Offentlige RPC-udbydere er et naturligt sted for disse tjenester at konkurrere. De kan indeksere, rangere og anbefale indhold, men de bør ikke eje brugeren eller profilen.

Disse tjenester kan også konkurrere på formen af ​​selve appen. Én RPC kan give et rangeret feed med annoncer. En anden kan give et ikke-rangeret kronologisk feed. En anden kan specialisere sig i privatliv, oversættelse, moderation, samfundsopdagelse eller en niche social graf.

Hvis økonomien virker, kan RPC-støttede feed-tjenester tilføje AI-funktioner, der svarer til, hvad almindelige platforme forsøger at indsætte i deres feeds: automatiske oversættelser, resuméer, bot-assisterede svar, søgesvar, hjælp til moderation eller kontekst i stil med community-noter.

Disse funktioner bør være servicevalg, ikke protokolkrav. En standard RPC kan konkurrere ved at tilbyde et rigere feed, men brugere og konkurrerende kunder bør stadig være i stand til at vælge enklere, private, kronologiske, annoncefrie eller fællesskabsspecifikke alternativer.

## Ikke-frihedsberøvende RPC

Hver bruger bør være i stand til at deltage som en fuld peer-to-peer-node gennem RPC uden at give RPC-udbyderen ejerskab over deres identitet eller profil.

Den hostede sti er vigtig, fordi de fleste brugere ikke starter med at køre en server. Udgangsstien betyder lige så meget: en bruger skal kunne flytte til deres egen profilknude på hardware med lav specifikation, inklusive en Raspberry Pi, når som helst de vil.

Det er forskellen mellem bekvemmelighed og forældremyndighed.

## Hvorfor det kan blive en alt-app

Hvis Bitsocial Network giver apps holdbare navngivning, betalinger, drikkepenge, priser og andre økonomiske spor, kan flagskibsappen blive meget mere end en feed-klient.

Den vigtige begrænsning er, at appen ikke skal blive den nye ejer af netværket. Det kan være en stor klient, måske endda den mest populære klient, mens den stadig efterlader plads til konkurrerende apps, konkurrerende RPC'er, konkurrerende feedalgoritmer og selvhostede profilknuder.
