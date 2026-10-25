---
title: Kataloger
description: Hvordan Bitsocial-apps lader fællesskaber konkurrere om et emnenavn i stedet for at lade det tilhøre den, der gjorde krav på det først.
---

# Kataloger

På Reddit kan et navn som `r/opensource` kun tilhøre ét fællesskab, og den, der kontrollerer det, beholder det. Hvis moderatorerne træffer beslutninger, som brugerne ikke bryder sig om, er det eneste alternativ at starte `r/opensource2`. Det nye fællesskab starter med nul abonnenter, selvom de fleste, der abonnerede på `r/opensource`, gik op i open source og ikke i netop det moderatorhold.

Bitsocial-apps undgår dette med **kataloger**. Et katalog er et emnenavn, f.eks. `opensource`, som fællesskaber konkurrerer om. Den korte rute for navnet åbner det fællesskab, der aktuelt ligger øverst, så et bedre fællesskab kan overtage navnet uden at skulle have nogens tilladelse.

## Sådan fungerer det

1. **En katalogkode er et emnenavn.** Seedit bruger ruter som `/s/funny`. 5chan bruger imageboard-stier som `/g/`.
2. **Fællesskaber konkurrerer som kandidater.** Hvert katalog har en liste over kandidatfællesskaber, hver med sin egen præcise adresse, f.eks. `funny-posting.bso`.
3. **Den højest rangerede kandidat vinder ruten.** Åbner man `/s/funny`, vises den aktuelle vinder.
4. **At tabe sletter intet.** Et fællesskab, der ikke er vinderen, beholder sin adresse, sine opslag og sine abonnenter, og alle kan stadig åbne det direkte.

## Navnet er en hoveddør, ikke en identitet

En katalogkode er kun en rute til at finde frem. Alt varigt peger på et præcist fællesskab:

- Abonnerer man fra `/s/funny`, abonnerer man på den aktuelle vinders præcise adresse. Selve katalogkoden gemmes aldrig som et abonnement.
- Links til opslag bruger altid fællesskabets præcise adresse, så et gammelt link ikke kan begynde at pege på et andet fællesskab, når vinderen skifter.
- Når vinderen skifter, lader Seedit eksisterende abonnementer være og spørger hver abonnent, om vedkommende vil skifte til den nye vinder, beholde begge eller beholde det nuværende fællesskab. Automatisk skift er en indstilling, man selv slår til for hvert katalog, og et automatisk skift viser en meddelelse med mulighed for at fortryde.

Et konkurrerende fællesskab tager altså ikke nogens abonnementer. Det vinder navnet: Nye besøgende lander på det, og eksisterende abonnenter får et valg med ét klik. De, der foretrak det gamle fællesskab, beholder det.

## Hvorfor ikke først til mølle med navne

- **Ingen squatting.** Det er ikke nok at sidde på et godt navn. Et fællesskab skal blive ved med at være den bedste kandidat til det.
- **Ingen administrator tildeler navne.** Tildeling ved en administrator ville genskabe det centrale veto, som Bitsocial er bygget til at fjerne.
- **Konkurrenter beholder en vej til publikum.** Et rivaliserende fællesskab går efter det samme navn i stedet for at starte forfra under et dårligere.
- **Klienter er enige om vinderen.** Seedit rangerer kandidater deterministisk, så alle klienter, der læser det samme færdiggjorte snapshot af kataloget, viser den samme vinder. Seedit sætter ikke en anden kandidat ind, fordi vinderen midlertidigt ikke kan nås via én brugers forbindelse.

## Sådan vælges vinderne i dag

Kandidaterne offentliggøres som JSON-filer i repositoriet [bitsocialnet/lists](https://github.com/bitsocialnet/lists), én fil pr. katalog, og et fællesskab tilslutter sig et katalog via en pull request til katalogets fil. Det er et midlertidigt opstartstrin. Målet er, at afstemning skal erstatte pull requests som den måde, vinderne afgøres på.

- **Seedit** rangerer et katalogs kandidater efter score, derefter efter hvornår de blev tilføjet og derefter efter adresse. Hver katalogfil har et revisionsnummer, og enhver ændring af dens kandidater eller vinder udgiver en ny revision.
- **5chan** afholder én afstemning pr. katalog med [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Klienter udveksler signerede stemmesedler over libp2p gossipsub og beregner selv optællingen, uden at nogen server tæller stemmer. For at stemme skal man have et 5chan Pass, et token, der ikke kan overdrages, og hver indehaver har én stemme. En stemme på et board, der endnu ikke er på listen, nominerer det. Afstemningerne kører i øjeblikket på testnettet Base Sepolia, og indtil de flytter væk fra testnettet, vises resultaterne, men de ændrer ikke listens rækkefølge.

## Protokol eller app?

Kataloger er ikke en del af PKC, peer-to-peer-laget, der lagrer og flytter fællesskaber. De er en konvention, som klienter anvender oven på det lag, sammen med standardlister og søgning; se [Opdagelse af indhold](./content-discovery.md). En klient kan læse de samme katalogfiler, udgive sine egne eller helt springe kataloger over, og brugerne kan stadig åbne ethvert fællesskab via dets adresse.
