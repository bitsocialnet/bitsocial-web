---
title: Bouw je eigen Bitsocial-client
description: Gids voor bouwers die onafhankelijke Bitsocial-clients willen uitbrengen, van imageboards en forums tot social apps voor een niche.
---

# Bouw je eigen Bitsocial-client

Bitsocial wint niet door één officiële app voor elk denkbaar gebruik. Het wint wanneer veel clients
hetzelfde protocol kunnen delen en tegelijk met elkaar concurreren op interface, cultuur, ontdekking,
standaardinstellingen en verdienmodel.

5chan en Seedit zijn vroege bewijsstukken, geen plafond. Een bouwer moet een nieuw imageboard, een
forum, een profielclient, een mobile-first social app, een tool voor een nichecommunity of een
gecentraliseerde client die Bitsocial onder de motorkap gebruikt kunnen uitbrengen zonder een
platformeigenaar om toestemming te vragen.

## Wat bouwers kunnen veranderen

Een Bitsocial-client kan op productkeuzes concurreren zonder het hele netwerk te forken:

- interface en visuele taal
- onboardingtraject
- standaardinstellingen van community's
- moderatie-interfaces
- ontdekkingsmodel
- media-ervaring
- beperkingen van mobiel, desktop of lage bandbreedte
- monetisatie en verdienmodel

De gedeelde laag is het protocol. De productlaag staat open voor concurrentie.

## De snelste manier om het te leren

Begin bij de apps die er al zijn:

- Probeer [5chan](https://5chan.app) voor anonieme imageboardcommunity's.
- Probeer [Seedit](https://seedit.app) voor discussie in Reddit-stijl.
- Lees de documentatie over de [Bitsocial React hooks](https://hooks.bitsocial.net/docs/quickstart/) voor integratie aan clientzijde.
- Lees de documentatie over de [Bitsocial CLI](/developer-tools/cli/) voor het beheren van nodes en community's.

Wil je snel vooruit, draag dan eerst bij aan een bestaande app. Past de interface, de cultuur of het
communitymodel dat je voor ogen hebt daar niet in, bouw dan een aparte client.

## Kies een smalle eerste versie

De beste eerste versie is geen universele social app. Het is een client met één duidelijk publiek en
één sterke reden om te bestaan.

Goede vertrekpunten zijn onder meer:

- een strakkere imageboardclient voor één specifieke cultuur
- een mobile-first forumclient
- een app voor één community met strikte standaardinstellingen
- een client voor een makerscommunity
- een alleen-lezen client om te ontdekken
- een console voor moderatoren of beheerders
- een client die is geoptimaliseerd voor een taal, regio of apparaatklasse

Kleine clients zijn waardevol omdat Bitsocial ze laat doorgroeien binnen hetzelfde netwerk, in plaats
van hun gebruikers op te sluiten in een private database.

## Implementatiepaden

Er zijn drie praktische paden:

1. Fork een bestaande client wanneer je idee dicht bij 5chan of Seedit ligt.
2. Bouw een nieuwe React-client met de [Bitsocial React hooks](https://hooks.bitsocial.net/).
3. Bouw je eigen integratie boven op de node-API's en publieke RPC-infrastructuur.

Publieke RPC zou dat derde pad een stuk praktischer moeten maken. Een gebruiker kan starten via een
gehoste, niet-custodiale RPC-aanbieder en later overstappen naar zelf hosten of naar een concurrent.

## Ontwerpprincipe

Bouw de client die zou moeten bestaan voor jouw community en laat compatibele clients daarna in het
openbaar met elkaar concurreren.
