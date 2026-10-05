---
title: Bitsocial en Mirage
description: Hoe Mirage, een forum in Reddit-stijl op een eigen Cosmos SDK-blockchain, zich verhoudt tot Bitsocial en de Reddit-achtige app Seedit.
---

# Bitsocial en Mirage

[Mirage](https://mirage.foundation/) is een discussienetwerk in Reddit-stijl met communities, posts in
threads en stemmen. In plaats van op een bedrijfsdatabase draait het op een eigen blockchain, een
Cosmos SDK-chain met CometBFT-consensus. Het product van Bitsocial dat er het dichtst bij komt is
[Seedit](/apps/seedit/), een app in Reddit-stijl op het Bitsocial-netwerk, dus de vergelijking gaat
vooral over hoe elk van beide communities host, bezit en modereert.

## Hoe Mirage werkt

- **Nodes.** Een Mirage-node is één Docker-container met een validator, een PostgreSQL-database, een
  indexer, een HTTP-API en de webfrontend. Elke node is ook een validator. Om er een te draaien zijn
  een Ubuntu-server op amd64 en 10.000.000 MIRAGE-tokens op het account van de beheerder nodig,
  volgens de
  [deploymenthandleiding](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Posten.** De browser ondertekent elke actie met de secp256k1-sleutel van de gebruiker, en gratis
  gebruikers berekenen ook een kleine proof-of-work. De node verpakt de actie in een chaintransactie
  en betaalt de vergoeding.
- **Lezen.** De indexer van elke node kopieert chaindata naar een eigen database en levert feeds via
  een HTTP-API. Nodes bewaren ongeveer een week aan blokken, dus de postgeschiedenis op lange termijn
  staat in de database van elke node, en een nieuwe node begint zonder de geschiedenis van vóór zijn
  synchronisatiepunt.
- **Accounts.** Een account is een sleutel die is afgeleid van een seedphrase van 12 woorden, en
  dezelfde seed werkt op elke node. Gebruikersnamen worden op de chain vastgelegd en zijn uniek in het
  hele netwerk.
- **Communities.** Elke geldige naam is al een community, en niemand is er eigenaar van. Betaalde
  curatorteams van maximaal tien gebruikers onderhouden elk een gemodereerde weergave van een
  community; lezers kiezen de weergave van een team, de standaardweergave van de node of een
  ongecensureerde weergave. Zie de [Mirage-FAQ](https://mirage.talk/faq).
- **Token.** De MIRAGE-token betaalt voor abonnementen, beloont auteurs en nodes, en geeft validators
  stemgewicht in de governance. Abonnees slaan de proof-of-work over en krijgen hogere limieten.

## Waar ze verschillen

### Wie een community bezit

In Seedit houdt de maker van een community het sleutelpaar ervan, draait of delegeert de node ervan,
en modereert die community. In Mirage is niemand eigenaar van een community: concurrerende
curatorteams bieden gemodereerde weergaven van dezelfde naam aan, en de standaardweergave is die van
het team dat door de meeste betalende abonnees is gekozen.

### Spambestrijding

Mirage past één regel toe op het hele netwerk: gratis gebruikers betalen met proof-of-work waarvan de
moeilijkheid zich aanpast aan het binnenkomende volume, en abonnees slaan die over. Bij Bitsocial
kiest elke community haar eigen challenge, van captcha's tot allowlists tot betalingen. Zie
[Aangepaste antispamuitdagingen](/custom-challenges/).

### Infrastructuur

Mirage heeft een blockchain nodig. Validators bereiken consensus over elke actie, en elke node draait
een volledige serverstack en moet een grote tokenstake aanhouden. Bitsocial heeft geen chain: een
communitynode draait op consumentenhardware vanuit de desktopapp of `bitsocial-cli`, en lezers kunnen
helpen inhoud te delen.

### Controle over het hele netwerk

Mirage heeft on-chain governance die naar validatorstake wordt gewogen. Die governance kan
moeilijkheid, prijzen en tokenuitgifte wijzigen, tokens aanmaken of verbranden, en beheerders
aanstellen wier verwijderingen de referentie-indexer op elke post toepast. De chaincode laat
governance ook
[accounts verwijderen](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
en
[tokens van elk adres versturen](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
In oktober 2026 produceerden vier validators de blokken van de chain, en de eigen runbooks van het
project beheerden alle vier.

Bitsocial heeft geen beheerder op protocolniveau. Community-eigenaren modereren hun eigen communities
en apps kiezen wat ze tonen. Zie [Lokale moderatie, geen mondiale verboden](/local-moderation/).

### Browser

De webclient van Mirage is een HTTP-client van een node: de browser ondertekent acties, maar neemt
niet deel aan een peer-to-peer-netwerk. Bitsocial-apps kunnen een peer-to-peer-node in het
browsertabblad draaien. Zie [Peer-to-peer in de browser](/browser-p2p/).

## Vergelijking

| Vraag                  | Mirage                                                                                                                             | Bitsocial                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Categorie              | Forum op een eigen blockchain (Cosmos SDK)                                                                                         | Peer-to-peer-netwerk van communities                                                               |
| Identiteit             | secp256k1-sleutel uit een seed van 12 woorden, met een on-chain gebruikersnaam                                                     | Ed25519-sleutelparen voor gebruikers en communities                                                |
| Waar posts staan       | Chaintransacties, daarna de PostgreSQL-database van elke node                                                                      | De node van de community-eigenaar en de peers die de community lezen en seeden                     |
| Wie houdt het online   | Validatornodes die elk 10.000.000 MIRAGE aanhouden                                                                                 | Node van de community-eigenaar plus helpende seeders                                               |
| Communities            | Namen zonder eigenaar met concurrerende betaalde curatorteams                                                                      | Eigendom van een sleutelpaar; de node van de eigenaar accepteert of weigert posts                  |
| Spambestrijding        | Proof-of-work voor het hele netwerk; abonnees slaan die over                                                                       | De challenge van elke community voordat een post wordt geaccepteerd                                |
| Moderatie              | Weergaven van curatorteams, persoonlijke filters, door governance aangestelde beheerders                                           | Community-eigenaren modereren hun community; apps kiezen wat ze tonen                              |
| Economie               | MIRAGE-token voor abonnementen, beloningen en validatorstake                                                                       | Geen in het protocol; een challenge kan een betaling of token vereisen                             |
| Browser                | HTTP-client van een node                                                                                                           | Peer-to-peer-node in een gewoon browsertabblad                                                     |
| Belangrijkste afweging | Eén gedeelde, geordende staat en eenvoudig aanmelden, maar een kleine validatorset en governancebevoegdheden over het hele netwerk | Geen chain of stake nodig, maar geen globale volgorde en oude inhoud is niet voor altijd verzekerd |
