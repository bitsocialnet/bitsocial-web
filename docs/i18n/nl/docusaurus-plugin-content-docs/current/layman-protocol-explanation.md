---
title: Een volledige uitleg voor leken van het Bitsocial-protocol
description: Een duidelijke Engelse uitleg van Bitsocial-gemeenschappen, peer lookup, publicatie, anti-spam-uitdagingen, moderatie en apps.
---

# Een volledige uitleg voor leken van het Bitsocial-protocol

Op deze pagina wordt Bitsocial uitgelegd zonder aan te nemen dat u peer-to-peer-netwerken, cryptografische sleutels, IPFS of pubsub al begrijpt.

Sommige details zijn met opzet vereenvoudigd. Voor de meer technische versie leest u de pagina [Peer-to-peer-protocol](./peer-to-peer-protocol.md).

## De korte versie

Bitsocial is een protocol voor sociale apps waarbij communities eigendom zijn van sleutels in plaats van van een bedrijfsdatabase.

Een Bitsocial-gemeenschap heeft een adres. Apps gebruiken dat adres om peers te vinden die de community bedienen, de nieuwste berichten van die peers op te halen en nieuwe berichten te publiceren via een peer-to-peer-berichtenkanaal. Voordat een bericht wordt geaccepteerd, kan de community een antispamuitdaging vereisen, zoals een captcha, uitnodigingscode, betaling, tokencontrole, AI-moderatiecontrole, toelatingslijst of een andere regel die kan worden gecodeerd.

Dat is het kernidee:

1. Een community wordt beheerd door een privésleutel.
2. De publieke sleutel geeft de community een stabiel adres.
3. Peers helpen lezers de community te vinden en op te halen.
4. Een communityknooppunt accepteert of weigert nieuwe berichten.
5. Het antispambeleid is eigendom van elke gemeenschap, niet van één mondiaal platform.

## Waarom hashes ertoe doen

Een hash is een korte vingerafdruk voor gegevens.

Als twee mensen exact hetzelfde bestand hashen, krijgen ze dezelfde vingerafdruk. Als het bestand verandert, verandert de vingerafdruk. Dat maakt hashes handig voor het vinden en controleren van gegevens zonder dat u erop hoeft te vertrouwen dat een bedrijf u vertelt wat het bestand is.

Peer-to-peer-systemen maken voortdurend gebruik van dit idee. In plaats van de ene website om "het bestand met de naam photo.png" te vragen, kan een peer het netwerk om de gegevens met een specifieke vingerafdruk vragen. Als een andere peer de verkeerde gegevens retourneert, mislukt de hash-controle.

Bitsocial gebruikt hashes en inhoudsidentificatoren voor postgegevens en andere delen van de gemeenschapsstatus. Het belangrijke punt is simpel: gegevens kunnen worden geadresseerd op basis van wat ze zijn, en niet alleen op basis van de locatie waar een bedrijf ze heeft gehost.

## Waarom publieke sleutels ertoe doen

Een publieke sleutel en een private sleutel vormen een matchend paar.

De privésleutel is geheim. Het is het ding dat controle geeft. De publieke sleutel is veilig om te delen. Hiermee kan iedereen controleren of een bericht, update of moderatieactie echt afkomstig is van de overeenkomende privésleutel.

Zo vermijdt Bitsocial normale platformaccounts. Een bedrijf hoeft de identiteit niet af te geven. Voor een databaserij hoeft de eigenaar niet te worden gedefinieerd. Het sleutelpaar is de autoriteit.

In duidelijke bewoordingen:

- de privésleutel is de bedieningshendel van de eigenaar
- de publieke sleutel is de publieke identiteit of het publieke adres
- handtekeningen bewijzen dat er actie is ondernomen door de eigenaar

## Wat een Bitsocial-gemeenschap is

Een Bitsocial-community is niet zomaar een pagina in één app.

Het heeft een eigen sleutelpaar. De publieke sleutel geeft de community een stabiel netwerkadres. De privésleutel beheert updates van de status van de community, zoals metagegevens, regels, moderatorlijst, uitdagingsconfiguratie en de verwijzingen naar de laatst geaccepteerde inhoud.

Dat betekent dat een community één interface kan overleven. Eén app kan het als een bord weergeven. Een andere app kan het als forum weergeven. Een toekomstige app kan dit weergeven in een op profielen gebaseerde feed. De app kan veranderen, maar het communityadres verwijst nog steeds naar dezelfde community.

## Hoe lezen werkt

Wanneer een gebruiker een Bitsocial-community opent, vraagt de app niet om één centrale database voor de pagina.

De stroom komt hier dichter bij:

1. De app kent het communityadres al, of haalt het uit een lijst, link, zoekoppervlak of
   voor mensen leesbare naam.
2. De app vraagt lichtgewicht routers welke peers momenteel dat community-adres verstrekken.
3. De routers retourneren alleen peer-adressen. Ze retourneren geen berichten, regels, profielen of community
   metagegevens.
4. De app maakt verbinding met peers en haalt de nieuwste communitystatus op.
5. Die status bevat verwijzingen naar het plaatsen van inhoud.
6. De app haalt de berichtinhoud op van collega's en geeft deze weer in een normale sociale interface.

De router is slechts een zoekhulp. Het komt dichter bij de vraag "wie heeft dit?" dan te vragen: "Bedien mij alstublieft de hele website."

Voor meer details over deze splitsing, lees [Inhoud ontdekken](./content-discovery.md).

## Hoe posten werkt

Posten is anders dan lezen, omdat open peer-to-peer-netwerken kunnen worden gespamd.

Bitsocial verzorgt het publiceren via een uitdaging-antwoordstroom:

1. De gebruiker schrijft een bericht of antwoord.
2. De app sluit zich aan bij het peer-to-peer-berichtonderwerp van de community.
3. De app vraagt het communityknooppunt om een uitdaging.
4. Het communityknooppunt stuurt de uitdaging terug.
5. De gebruiker of app voltooit de uitdaging.
6. De app verzendt de post plus het uitdagingsantwoord.
7. Het communityknooppunt controleert het antwoord en het bericht.
8. Als dit lukt, accepteert het communityknooppunt het bericht in de volgende update van de community.
9. Andere lezers halen de bijgewerkte communitystatus op van collega's.

De uitdaging vindt plaats voordat de post onderdeel wordt van de geaccepteerde gemeenschapsstaat. Dat is het belangrijke verschil met systemen waarbij spam eerst wordt geaccepteerd en later wordt verborgen.

## Waarom anti-spam-uitdagingen belangrijk zijn

De meeste sociale platforms zetten antispam om in platformbeleid. Eén bedrijf bepaalt wat telt als een geldig account, geldig bericht, geldig bereik of geldige gebruiker.

Bitsocial scheidt die dingen. Het protocol biedt gemeenschappen de mogelijkheid om een ​​uitdaging te vereisen voordat ze een post accepteren, maar het dwingt niet elke gemeenschap om dezelfde uitdaging te gebruiken.

Eén community kan een captcha gebruiken. Een ander kan uitnodigingscodes gebruiken. Een ander voorbeeld kan een sms-controle, een betaling, een NFT, een tokensaldo, een AI-moderatiescore, een bewijs van reputatie, een communityspecifieke toelatingslijst of een aangepaste regel vereisen.

Die flexibiliteit is van belang omdat spam verandert. Een spamregel op protocolniveau wordt verouderd. Een uitdaging op gemeenschapsniveau kan zich ontwikkelen zonder het hele netwerk te migreren.

Voor de gerichte uitleg, lees [Aangepaste antispamuitdagingen](./custom-challenges.md).

## Hoe moderatie werkt

Bitsocial is niet moderatievrij. Het is gematigdheid zonder één mondiale superbeheerder.

Een community kan eigenaren en moderators hebben. Moderatoradressen maken deel uit van de communitystatus. Wanneer een moderator een actie onderneemt, kan die actie worden ondertekend. Het communityknooppunt en de clients kunnen de handtekening controleren aan de hand van de moderatorlijst.

Dat geeft moderatie een lokale reikwijdte:

- een community-eigenaar beheert die community
- moderators handelen via sleutels die de gemeenschap herkent
- apps kunnen nog steeds kiezen wat ze indexeren, rangschikken, verbergen of markeren
- Geen enkel bedrijfsaccount op protocolniveau kan elke identiteit uitwissen of elke gemeenschap in beslag nemen

In de praktijk betekent dit dat een community spam kan verwijderen of regels kan afdwingen binnen haar eigen ruimte, zonder de regels om te zetten in wetten voor het hele netwerk.

Voor de beleidsweergave leest u [Lokale moderatie, geen wereldwijd verboden](./local-moderation.md).

## Wat apps toevoegen

Het protocol bepaalt niet hoe het hele product eruit moet zien.

Een app voegt de menselijke ervaring rond het protocol toe:

- standaard communitylijsten
- zoeken en ontdekken
- feeds en rangschikking
- lay-out en postinterface
- mediabehandeling
- moderatie-instrumenten
- mobiele, desktop- of browserverpakking
- bedrijfsmodel en standaarden

Daarom kan Bitsocial verschillende app-stijlen ondersteunen. 5chan kan aanvoelen als een imageboard. Seedit kan aanvoelen als een discussie in forumstijl. Andere klanten kunnen verschillende ontdekkingsoppervlakken, rangschikkingssystemen, moderatieweergaven of standaardinstellingen voor de community bouwen, terwijl ze daaronder nog steeds compatibele Bitsocial-community's gebruiken.

Het protocol zorgt ervoor dat eigendom en publicatie draagbaar blijven. Apps concurreren op productkwaliteit.

## Wat openbare RPC toevoegt

Het rechtstreeks runnen van een peer-to-peer-communityknooppunt is krachtig, maar niet iedereen wil een machine beheren die altijd aan staat.

Publieke RPC is de servicelaag die Bitsocial handiger kan maken. Een openbare RPC-provider kan gebruikers helpen gemeenschappen te beheren vanaf een telefoon of een lichtgewicht client, terwijl het langetermijneigendomsmodel gebruikers nog steeds de mogelijkheid moet bieden om weg te gaan, zelf te hosten of een concurrerende provider te kiezen.

Het onderscheid is belangrijk:

- RPC kan helpen met uptime en gemak
- RPC mag geen permanente hechtenis worden
- de eigenaarrelatie moet gebonden blijven aan sleutels, niet aan de database van één provider

## Wat Bitsocial niet is

Bitsocial is geen sociaal blockchain-netwerk. Sociale media hebben niet elke post nodig om een ​​transactie in één wereldwijd grootboek te worden.

Bitsocial is geen federatie in de zin van ActivityPub. Een community hoeft geen account te zijn op één server met één domein, één beheerder en één serverdatabase.

Bitsocial is ook niet één app. Het is een gedeelde protocollaag voor apps, communities, knooppunten, routers, RPC-providers, ontdekkingsdiensten, antispammodules en moderatietools.

Het punt is niet dat elke gebruiker dit allemaal moet begrijpen voordat hij een bericht plaatst. Het punt is dat het product normaal kan aanvoelen, terwijl het onderliggende eigendomsmodel anders is.

## Waar moet je heen?

- [Peer-to-peer-protocol](./peer-to-peer-protocol.md) legt de technische stroom uit.
- [Inhoud ontdekken](./content-discovery.md) legt netwerkzoekopdrachten versus app-beheer uit.
- [Aangepaste antispamuitdagingen](./custom-challenges.md) legt het challenge-systeem uit.
- [Identiteit en gemeenschapseigendom](./identity-and-ownership.md) legt sleutelgestuurd uit
  eigendom.
- [Bouw je eigen klant](/build-your-own-client/) legt uit hoe onafhankelijke apps kunnen voortbouwen op
  hetzelfde netwerk.
