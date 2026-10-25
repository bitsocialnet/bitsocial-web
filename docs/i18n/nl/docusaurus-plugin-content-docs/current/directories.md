---
title: Directory's
description: Hoe Bitsocial-apps community's laten strijden om een onderwerpnaam, in plaats van die te laten aan wie hem als eerste claimde.
---

# Directory's

Op Reddit kan een naam als `r/opensource` maar bij één community horen, en wie die naam beheert, houdt hem. Als de moderators keuzes maken die gebruikers niet bevallen, is het enige alternatief om `r/opensource2` te beginnen. Die nieuwe community start met nul abonnees, ook al gaven de meeste mensen die zich op `r/opensource` hadden geabonneerd om open source, niet om dat specifieke moderatieteam.

Bitsocial-apps voorkomen dit met **directory's**. Een directory is een onderwerpnaam, zoals `opensource`, waar community's om strijden. De korte route voor die naam opent de community die op dat moment bovenaan staat, zodat een betere community de naam kan overnemen zonder dat iemand daar toestemming voor hoeft te geven.

## Hoe het werkt

1. **Een directorycode is een onderwerpnaam.** Seedit gebruikt routes als `/s/funny`. 5chan gebruikt imageboardpaden als `/g/`.
2. **Community's strijden als kandidaten.** Elke directory heeft een lijst met kandidaat-community's, elk met een eigen exact adres, zoals `funny-posting.bso`.
3. **De hoogst gerangschikte kandidaat wint de route.** Wie `/s/funny` opent, ziet de huidige winnaar.
4. **Verliezen verwijdert niets.** Een community die niet wint, behoudt haar adres, berichten en abonnees, en iedereen kan haar nog steeds rechtstreeks openen.

## De naam is een voordeur, geen identiteit

Een directorycode is alleen een route om iets te ontdekken. Alles wat blijvend is, verwijst naar een exacte community:

- Wie zich vanaf `/s/funny` abonneert, abonneert zich op het exacte adres van de huidige winnaar. De directorycode zelf wordt nooit als abonnement opgeslagen.
- Links naar berichten gebruiken altijd het exacte adres van de community, zodat een oude link niet naar een andere community kan gaan verwijzen nadat de winnaar is veranderd.
- Als de winnaar verandert, laat Seedit bestaande abonnementen ongemoeid en vraagt het elke abonnee of die wil overstappen naar de nieuwe winnaar, beide wil houden of de huidige community wil houden. Automatisch overstappen is een instelling per directory die je zelf moet inschakelen, en een automatische overstap toont een melding waarmee je die ongedaan kunt maken.

Een concurrerende community neemt dus niemands abonnementen af. Ze wint de naam: nieuwe bezoekers komen bij haar terecht en bestaande abonnees krijgen een keuze met één klik. Wie de oude community verkoos, houdt die.

## Waarom geen namen voor wie het eerst komt

- **Geen naamkraak.** Een goede naam bezitten is niet genoeg. Een community moet er de beste kandidaat voor blijven.
- **Geen beheerder die namen toewijst.** Toewijzing door een beheerder zou het centrale veto terugbrengen dat Bitsocial juist moet wegnemen.
- **Concurrenten houden een weg naar het publiek.** Een rivaliserende community richt zich op dezelfde naam in plaats van opnieuw te beginnen onder een slechtere.
- **Clients zijn het eens over de winnaar.** Seedit rangschikt kandidaten deterministisch, zodat elke client die dezelfde definitieve snapshot van de directory leest, dezelfde winnaar toont. Seedit schakelt niet over op een andere kandidaat omdat de winnaar via de verbinding van één gebruiker tijdelijk onbereikbaar is.

## Hoe winnaars nu worden gekozen

Kandidaten worden gepubliceerd als JSON-bestanden in de repository [bitsocialnet/lists](https://github.com/bitsocialnet/lists), één bestand per directory, en een community sluit zich bij een directory aan via een pull request op dat bestand. Dit is een tijdelijke opstartfase. Het doel is dat stemmen pull requests vervangt als manier om winnaars te bepalen.

- **Seedit** rangschikt de kandidaten van een directory op score, vervolgens op het moment waarop ze zijn toegevoegd en daarna op adres. Elk directorybestand heeft een revisienummer, en elke wijziging in de kandidaten of de winnaar publiceert een nieuwe revisie.
- **5chan** houdt per directory één stemronde met [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Clients wisselen ondertekende stembiljetten uit via libp2p gossipsub en berekenen de telling zelf, zonder server die stemmen telt. Om te stemmen heb je een 5chan Pass nodig, een niet-overdraagbare token, en elke houder krijgt één stem. Een stem op een board dat nog niet op de lijst staat, nomineert dat board. De stemrondes draaien momenteel op het Base Sepolia-testnet, en zolang ze daar niet vanaf zijn, worden de tellingen wel getoond maar veranderen ze de volgorde van de lijst niet.

## Protocol of app?

Directory's maken geen deel uit van PKC, de peer-to-peerlaag die community's opslaat en verplaatst. Ze zijn een conventie die clients daarbovenop toepassen, naast standaardlijsten en zoeken; zie [Inhoud ontdekken](./content-discovery.md). Een client kan dezelfde directorybestanden lezen, eigen bestanden publiceren of directory's helemaal overslaan, en gebruikers kunnen elke community nog steeds via haar adres openen.
