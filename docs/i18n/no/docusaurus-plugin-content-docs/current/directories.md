---
title: Kataloger
description: Hvordan Bitsocial-apper lar fellesskap konkurrere om et emnenavn i stedet for at navnet blir værende hos den som tok det først.
---

# Kataloger

På Reddit kan et navn som `r/opensource` bare tilhøre ett fellesskap, og den som kontrollerer det, beholder det. Hvis moderatorene tar valg brukerne misliker, er det eneste alternativet å starte `r/opensource2`. Det nye fellesskapet starter med null abonnenter, selv om de fleste som abonnerte på `r/opensource`, brydde seg om åpen kildekode og ikke om akkurat det moderatorteamet.

Bitsocial-apper unngår dette med **kataloger**. En katalog er et emnenavn, for eksempel `opensource`, som fellesskap konkurrerer om. Den korte ruten for navnet åpner det fellesskapet som for øyeblikket er rangert øverst, slik at et bedre fellesskap kan ta over navnet uten at noen må gi tillatelse.

## Slik fungerer det

1. **En katalogkode er et emnenavn.** Seedit bruker ruter som `/s/funny`. 5chan bruker bildetavlestier som `/g/`.
2. **Fellesskap konkurrerer som kandidater.** Hver katalog har en liste over kandidatfellesskap, hvert med sin egen eksakte adresse, for eksempel `funny-posting.bso`.
3. **Kandidaten med høyest rangering vinner ruten.** Når du åpner `/s/funny`, ser du den nåværende vinneren.
4. **Å tape sletter ingenting.** Et fellesskap som ikke er vinneren, beholder adressen, innleggene og abonnentene sine, og hvem som helst kan fortsatt åpne det direkte.

## Navnet er en inngangsdør, ikke en identitet

En katalogkode er bare en rute for å oppdage innhold. Alt som skal vare, peker på et eksakt fellesskap:

- Å abonnere fra `/s/funny` gir et abonnement på den nåværende vinnerens eksakte adresse. Selve katalogkoden lagres aldri som et abonnement.
- Lenker til innlegg bruker alltid fellesskapets eksakte adresse, så en gammel lenke kan ikke begynne å peke på et annet fellesskap etter at vinneren har endret seg.
- Når vinneren endrer seg, lar Seedit eksisterende abonnementer være i fred og spør hver abonnent om de vil bytte til den nye vinneren, beholde begge eller beholde det nåværende fellesskapet. Automatisk bytte er en innstilling per katalog som må slås på aktivt, og et automatisk bytte viser et varsel med mulighet for å angre.

Et konkurrerende fellesskap tar dermed ikke noens abonnementer. Det vinner navnet: nye besøkende havner der, og eksisterende abonnenter får et valg med ett klikk. De som foretrakk det gamle fellesskapet, beholder det.

## Hvorfor ikke førstemann-til-mølla-navn

- **Ingen navnehamstring.** Å sitte på et godt navn er ikke nok. Et fellesskap må fortsatt være den beste kandidaten for det.
- **Ingen administrator tildeler navn.** Tildeling fra en administrator ville gjenskapt det sentrale vetoet Bitsocial er bygget for å fjerne.
- **Konkurrenter beholder en vei til publikum.** Et rivaliserende fellesskap sikter mot det samme navnet i stedet for å begynne på nytt under et dårligere navn.
- **Klientene er enige om vinneren.** Seedit rangerer kandidater deterministisk, så alle klienter som leser det samme ferdigstilte øyeblikksbildet av katalogen, viser samme vinner. Seedit bytter ikke inn en annen kandidat fordi vinneren midlertidig er utilgjengelig på én brukers tilkobling.

## Slik velges vinnere i dag

Kandidatene publiseres som JSON-filer i depotet [bitsocialnet/lists](https://github.com/bitsocialnet/lists), én fil per katalog, og et fellesskap blir med i en katalog gjennom en pull request til katalogens fil. Dette er en midlertidig oppstartsløsning. Målet er at avstemning skal erstatte pull requests som måten vinnere avgjøres på.

- **Seedit** rangerer kandidatene i en katalog etter poengsum, deretter etter når de ble lagt til, og deretter etter adresse. Hver katalogfil har et revisjonsnummer, og enhver endring i kandidatene eller vinneren publiserer en ny revisjon.
- **5chan** kjører én avstemning per katalog med [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Klientene utveksler signerte stemmesedler over libp2p gossipsub og regner ut opptellingen selv, uten noen server som teller stemmer. For å stemme må du ha et 5chan Pass, et token som ikke kan overføres, og hver innehaver får én stemme. Å stemme på en tavle som ikke står på listen ennå, nominerer den. Avstemningene kjører foreløpig på testnettet Base Sepolia, og inntil de flyttes bort fra testnettet, vises opptellingene, men de endrer ikke rekkefølgen på listen.

## Protokoll eller app?

Kataloger er ikke en del av PKC, peer-to-peer-laget som lagrer og flytter fellesskap. De er en konvensjon som klienter bruker over dette laget, sammen med standardlister og søk; se [Oppdagelse av innhold](./content-discovery.md). En klient kan lese de samme katalogfilene, publisere sine egne eller droppe kataloger helt, og brukere kan fortsatt åpne ethvert fellesskap via adressen.
