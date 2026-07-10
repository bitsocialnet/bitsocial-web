---
title: Decentralisér Twitter/X
description: "Fase 3 i masterplanen: et fokuseret, decentraliseret alternativ til Twitter/X til tekstbaseret offentlig samtale, med udskiftelig infrastruktur."
---

# Decentralisér Twitter/X

Fase 3 er en plan om at bygge et fokuseret, decentraliseret alternativ til Twitter/X. Kernen er tekstbaseret offentlig samtale: korte opslag, svar, genopslag, følgere, diskussion i realtid og fællesskaber, mens platformslaget brydes åbent.

Twitter/X er stadig defineret af opslag, tekst og deling af idéer. Fase 3-klienten bør konkurrere på den kerneoplevelse og få den til at fungere usædvanligt godt.

Denne side beskriver produktretningen, ikke en fastlåst udgivelsesspecifikation. Den præcise brugerflade, standardfeedet, annoncemodellen, AI-funktionerne og RPC-markedspladsen kan ændre sig, efterhånden som protokollen og de tidlige apps modnes.

## Hvad den bør bevise

Klienten bør bevise, at et profilbaseret socialt netværk kan undgå at blive en platform, der tager brugernes identitet i forvaring:

- brugerne kan eje deres identiteter og profiler
- fællesskaber og profilnoder kan forblive peer-to-peer
- fællesskaber kan bære netværkseffekter på tværs af Bitsocial-klienter
- RPC-udbydere kan gøre klienten bekvem uden at tage kontrollen
- feedalgoritmer kan være valgfrie tjenester i stedet for regler dikteret af platformen
- andre klienter kan fortsat konkurrere om det samme netværk

Målet er at bygge den stærkeste mulige klient til offentlig samtale og vise, hvor langt protokollen kan række.

## Velkendt i formålet, udskiftelig i designet

Standardoplevelsen bør konkurrere med kernen i Twitter/X: et hurtigt startfeed, tekstopslag, følgere, svar, distribution via genopslag, fællesskaber, notifikationer, søgning og en rangeret For You-visning, der virker med det samme.

Bitsocial Forge kan drive den første standard-RPC og feedtjeneste. Standarden kan indeholde et rangeret feed og annoncer, så klienten føles komplet fra første dag i stedet for at bede almindelige brugere om selv at samle hele stakken.

Forskellen er, at standarden ikke må blive et fængsel. En bruger bør kunne skifte RPC'er, feeds, instanser, rangeringssystemer, annoncer og udbydere af indholdsopdagelse eller helt fjerne rangering. Klienten kan træffe klare standardvalg ved første start, samtidig med at alle væsentlige tjenester kan udskiftes.

Det gør klienten mere tilpasselig end en traditionel platform. Én bruger kan beholde det rangerede standardfeed med annoncer. En anden kan bruge et kronologisk feed uden rangering. En tredje kan vælge en privatlivsfokuseret RPC, en fællesskabsdrevet opdagelsestjeneste, et betalt annoncefrit feed eller en nichealgoritme bygget til en bestemt subkultur.

## Fællesskaber på tværs af klienter

Fællesskaber bør være langt vigtigere end isolerede grupper i én app.

På X/Twitter er fællesskaber afgrænset til X. De kan være nyttige, men de arver begrænsningerne fra én platform, ét kontosystem, én anbefalingsstak og én produktoverflade.

Et Bitsocial-fællesskab kan oprettes, hostes, opdages og bruges gennem forskellige klienter. Det betyder, at Fase 3-klienten kan vise fællesskaber og opslag fra hele Bitsocial-netværket, ikke kun fra brugere, der begyndte i klienten. Et fællesskab kan samtidig have aktivitet fra en imageboard-klient, en Reddit-lignende diskussionsklient, en specialiseret forumklient, en mobilapp og Fase 3-klienten.

Det er den centrale netværkseffekt: Én klient kan føles velkendt for almindelige brugere og samtidig hente værdi fra mange klienter, fællesskabsnoder, RPC-udbydere og uafhængige tjenester.

## Valgfrie feedalgoritmer

Fase 3-klienten bør ikke tvinge ét globalt rangeringssystem ned over alle.

Feedalgoritmer bør være et aktivt tilvalg. En bruger kan vælge en algoritme fra en markedsplads, skifte udbyder, bruge en algoritme fra en virksomhed, en drevet af en anonym operatør, en bygget af et fællesskab, køre sin egen eller helt undlade at bruge en algoritme.

Offentlige RPC-udbydere er et naturligt sted for disse tjenester at konkurrere. De kan indeksere, rangere og anbefale indhold, men de bør ikke eje brugeren eller profilen.

Tjenesterne kan også konkurrere om selve klientens udformning. Én RPC kan levere et rangeret feed med annoncer. En anden kan levere et urangeret kronologisk feed. En tredje kan specialisere sig i privatliv, oversættelse, moderation, opdagelse af fællesskaber eller en social nichegraf.

Hvis økonomien hænger sammen, kan RPC-baserede feedtjenester tilføje AI-funktioner som dem, de etablerede platforme forsøger at føre ind i deres feeds: automatiske oversættelser, resuméer, botassisterede svar, søgeresultater, hjælp til moderation eller kontekst i stil med fællesskabsnoter.

Funktionerne bør være servicevalg, ikke protokolkrav. En standard-RPC kan konkurrere ved at tilbyde et rigere feed, men brugere og konkurrerende klienter bør stadig kunne vælge enklere, private, kronologiske, annoncefrie eller fællesskabsspecifikke alternativer.

## RPC uden forvaring

Hver bruger bør kunne deltage som en fuld peer-to-peer-node via RPC uden at give RPC-udbyderen ejerskab over sin identitet eller profil.

Den hostede vej er vigtig, fordi de fleste brugere ikke begynder med at køre en server. Udvejen er lige så vigtig: En bruger bør kunne flytte til sin egen profilnode på beskedent hardware, herunder en Raspberry Pi, når som helst.

Det er forskellen mellem bekvemmelighed og forvaring.

## Offentlig samtale, styrket af Bitsocial Chain

Bitsocial Chain kan bringe varige navne, betalinger, drikkepenge, belønninger og andre finansielle muligheder direkte ind i den offentlige samtale.

Fase 3-klienten forbliver centreret om opslag, tekst, deling af idéer og diskussion i realtid, samtidig med at den deler fællesskaber og netværkseffekter med andre Bitsocial-klienter.
