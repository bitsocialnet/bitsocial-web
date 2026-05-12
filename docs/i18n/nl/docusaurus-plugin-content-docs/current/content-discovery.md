---
title: Inhoud ontdekken
description: Hoe Bitsocial peer-discovery scheidt van curatie op app-niveau.
---

# Inhoud ontdekken

Bitsocial stopt niet één globale feed, zoekindex of ranking-algoritme in het protocol. Het verdeelt de ontdekking van inhoud in twee lagen:

1. **Netwerk opzoeken** vindt de peers die momenteel een bekende community bedienen.
2. **App-beheer** bepaalt welke communities, borden, lijsten of berichten een product als eerste toont.

Hierdoor blijft het protocol klein, terwijl er ruimte overblijft voor veel ontdekkingservaringen om te concurreren.

## Netwerk opzoeken

Elke community heeft een stabiel adres dat is afgeleid van de publieke sleutel. Wanneer een client dat adres al kent, ondervraagt ​​hij lichtgewicht HTTP-routers om peers te vinden die zichzelf hebben aangekondigd als providers ervoor.

De routers retourneren alleen peer-adressen van providers. Ze slaan geen berichten, metagegevens, gebruikerslijsten of een voor mensen leesbare directory met communities op. Nadat de client peer-adressen heeft ontvangen, maakt deze verbinding met die peers en haalt de nieuwste community-metagegevens plus inhoudsaanwijzers op, en haalt vervolgens de daadwerkelijke berichtgegevens op via hash.

Dit beantwoordt de protocolvraag: "Waar kan ik de laatste status voor deze community ophalen?"

## App-beheer

De afzonderlijke productvraag is: "Welke community's moet een gebruiker als eerste zien?"

Bitsocial laat dat over aan apps, lijsten en gebruikers in plaats van één antwoord in het netwerk te bakken. Voorbeelden zijn onder meer:

- een klant die communities toont die de gebruiker al volgt
- een samengestelde standaardlijst voor een app in Reddit-stijl
- directoryslots voor een app in imageboard-stijl
- zoek- of rangschikkingsindexen die door een specifieke app worden bijgehouden
- directe links gedeeld door gebruikers

Apps kunnen verschillende dingen indexeren, rangschikken, filteren of benadrukken zonder die keuzes om te zetten in protocolwetten. Als het ontdekkingsoppervlak van de ene app niet nuttig is, kan een andere app een andere bouwen op dezelfde onderliggende community's.

## Huidige apps

5chan gebruikt momenteel bekende mappaden zoals `/b/` of `/g/`. Directory-toewijzingen worden tegenwoordig beheerd via een openbare lijst, en toekomstige versies zullen naar verwachting het maken van in-app-borden en het stemmen op directory-slots ondersteunen.

Seedit gebruikt standaard communitylijsten voor de voorpagina. Community's kunnen nog steeds buiten die standaardlijst worden gemaakt en gedeeld.

In beide gevallen helpt de lijst op app-niveau gebruikers iets te vinden om te openen, en de opzoekopdracht op protocolniveau vertaalt vervolgens de gekozen community naar peers.

## Waarom deze splitsing ertoe doet

Eén enkel gedecentraliseerd netwerk heeft nog steeds goede detectie nodig, maar de ontdekkingslaag moet vervangbaar zijn. Het kernprotocol van Bitsocial richt zich op adresseerbaarheid, peer lookup, publicatie en antispam. Curatie bevindt zich boven die laag, waar apps kunnen experimenteren met mappen, standaardlijsten, feeds, zoek-, stem- en moderatiebeleid zonder dat een netwerkbrede migratie nodig is.
