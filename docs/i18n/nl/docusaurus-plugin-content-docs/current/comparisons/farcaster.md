---
title: Bitsocial en Farcaster
description: Hoe Farcaster, met onchain accounts, opslaghuur en het validatornetwerk Snapchain, zich verhoudt tot de peer-to-peer-communities van Bitsocial.
---

# Bitsocial en Farcaster

[Farcaster](https://docs.farcaster.xyz/) houdt identiteit op een blockchain en sociale data erbuiten.
Accounts, app-sleutels en opslagbetalingen staan in contracten op OP Mainnet, een layer 2 van
Ethereum. Posts, casts genoemd, en ook follows en reacties zijn ondertekende berichten die worden
opgeslagen door [Snapchain](https://snapchain.farcaster.xyz/), een blockchainachtig netwerk dat in
2025 het eerdere Hub-netwerk van Farcaster verving.

## Hoe Farcaster werkt

- **Accounts.** Een account is een numerieke Farcaster-ID die eigendom is van een Ethereum-adres, dat
  ook een hersteladres kan instellen. Apps posten met gedelegeerde app-sleutels die onchain zijn
  geregistreerd; een app-sleutel kan het account niet overnemen.
- **Opslaghuur.** Elk account huurt opslageenheden, momenteel $ 0,20 per eenheid per jaar. Een eenheid
  die sinds juli 2025 is gehuurd, bevat 100 casts; daarboven worden de oudste casts verwijderd. Rate
  limits schalen mee met de gehuurde opslag.
- **Snapchain.** Validators ordenen berichten in blokken met consensus in Tendermint-stijl, en elke
  volledige node bewaart de data van het hele netwerk. Nodes hebben ongeveer 16 GB RAM en 2 TB opslag
  nodig, volgens de [nodehandleiding](https://snapchain.farcaster.xyz/getting-started).
- **Namen.** Standaardgebruikersnamen, fnames genoemd, zijn gratis en worden uitgegeven door de eigen
  naamserver van Farcaster, die
  [ze kan intrekken](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Gebruikers kunnen
  in plaats daarvan een `.eth`-naam gebruiken die op Ethereum is geregistreerd.
- **Kanalen.** Onderwerpkanalen zijn een experimentele functie van de Farcaster-client. Casts in een
  kanaal zijn protocoldata, maar kanaalmetadata, follows en moderatie worden
  [in de client opgeslagen](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Lezen.** Apps lezen via een Snapchain-node die ze zelf draaien of via een beheerde provider,
  meestal Neynar.

## Waar ze verschillen

### Blockchains en validators

Farcaster is afhankelijk van OP Mainnet voor accounts en betalingen, en van Snapchain, een
blockchainachtig netwerk, voor het ordenen van alle sociale data. De validatorset van Snapchain is
besloten (permissioned). Volgens de whitepaper wordt censuur moeilijk bij ongeveer tien wereldwijd
verspreide validators; in oktober 2026 was de
[validatorlijst](https://snapchain.farcaster.xyz/validators) kleiner, en de meeste sleutels waren van
Neynar, dat Farcaster in januari 2026
[overnam](https://neynar.com/blog/neynar-is-acquiring-farcaster). Bitsocial heeft geen chain,
validators of consensus.

### Betalen om te posten

Elk Farcaster-account betaalt opslaghuur, en de opslag bepaalt hoeveel van de geschiedenis van een
account het netwerk bewaart. Bij Bitsocial kost posten op protocolniveau niets; elke community
beslist of ze een captcha, een betaling, een token of iets anders vereist. Zie
[Aangepaste antispamuitdagingen](/custom-challenges/).

### Communities

Farcaster-kanalen zijn een clientfunctie: de client slaat hun metadata op en handhaaft de
kanaalmoderatie, dus een cast die in een kanaal wordt geblokkeerd, kan op het netwerk geldig blijven
en zichtbaar zijn in andere apps. Bij Bitsocial zijn communities protocolobjecten met een eigen
sleutelpaar, en de node van de community accepteert of weigert posts.

### De infrastructuur draaien

Een Farcaster-node bevat het hele netwerk, dus de opslag groeit mee met alle activiteit; Farcaster
verwacht dat die groei richting de grootste clouddisks gaat. Een Bitsocial-communitynode bevat
alleen de eigen communities en draait op consumentenhardware.

### Browser

Een Farcaster-browserapp is een HTTP-client van een node of provider. Een Bitsocial-webapp kan een
peer-to-peer-node in het tabblad draaien. Zie [Peer-to-peer in de browser](/browser-p2p/).

## Vergelijking

| Vraag                  | Farcaster                                                                      | Bitsocial                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Categorie              | Onchain identiteit met sociale data die door validators wordt geordend         | Peer-to-peer-netwerk van communities                                                          |
| Identiteit             | Farcaster-ID in handen van een Ethereum-adres, met gedelegeerde app-sleutels   | Ed25519-sleutelparen voor gebruikers en communities                                           |
| Waar posts staan       | Snapchain, gerepliceerd op elke volledige node, binnen betaalde opslaglimieten | De node van de community-eigenaar en de peers die de community lezen en seeden                |
| Wie houdt het online   | Snapchain-validators en nodebeheerders                                         | Node van de community-eigenaar plus helpende seeders                                          |
| Communities            | Experimentele kanalen die door de Farcaster-client worden beheerd              | Volwaardige objecten waarvan de node posts accepteert of weigert                              |
| Spambestrijding        | Opslaghuur en rate limits, plus spamlabels op appniveau                        | De challenge van elke community voordat een post wordt geaccepteerd                           |
| Moderatie              | Kanaalhosts in de client, appfilters, risico op censuur op validatorniveau     | Community-eigenaren modereren hun community; apps kiezen wat ze tonen                         |
| Namen                  | Gratis fnames die Farcaster kan intrekken, of `.eth`-namen                     | `.bso`- en `.eth`-namen die naar sleutels verwijzen                                           |
| Browser                | HTTP-client van een node of provider                                           | Peer-to-peer-node in een gewoon browsertabblad                                                |
| Belangrijkste afweging | Eén consistente globale dataset, maar huur, chains en een kleine validatorset  | Geen kosten of chains, maar geen globale dataset en oude inhoud is niet voor altijd verzekerd |
