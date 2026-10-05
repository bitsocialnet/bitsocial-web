---
title: Bitsocial en Lapis Net
description: Hoe Lapis Net, een peer-to-peer sociaal protocol in Kotlin met vertrouwensscores per kijker en zichtbaarheid op basis van Bitcoin, zich verhoudt tot Bitsocial.
---

# Bitsocial en Lapis Net

[Lapis Net](https://net.lapisproject.dev/) is een peer-to-peer-protocol voor sociale netwerken,
geschreven in Kotlin voor de JVM. Het kwam onafhankelijk uit bij fundamenten die dicht bij die van
Bitsocial liggen: identiteiten op basis van sleutelparen, contentopslag in IPFS-stijl en
libp2p-gossipsub. De twee verschillen in waar ze spamfiltering en curatie leggen. Lapis geeft elke
kijker een persoonlijke vertrouwensgraaf en laat Bitcoin- en Lightning-betalingen de zichtbaarheid
verhogen; Bitsocial laat elke community beslissen wat er gepubliceerd mag worden.

Lapis is een werkend prototype. In oktober 2026 had het nog geen openbaar netwerk, en het verbinden
van twee nodes was een handmatige stap, volgens de
[repository](https://github.com/lapisproject-dev/Lapis-Net).

## Hoe Lapis werkt

- **Identiteiten.** Elke identiteit is een secp256k1-sleutelpaar, compatibel met Bitcoin-sleutels,
  met een daaraan gekoppelde Ed25519-sleutel voor de libp2p-peer-ID.
- **Opslag en verspreiding.** Inhoud wordt opgeslagen met Nabu, een IPFS-implementatie op libp2p
  (DHT en Bitswap), en verspreid met libp2p-gossipsub.
- **Scores.** Vier optionele scores liggen bovenop een kern die neutraal blijft over curatie:
  - Veritas, een web of trust dat wordt berekend uit de eigen vertrouwensgraaf van elke kijker
  - Virtus, zichtbaarheid gedekt door on-chain- of Lightning-betalingsbewijzen die met de tijd
    afzwakken
  - Karma, gratis likes die naar Veritas worden gewogen
  - Madli, een reputatiescore die nodes over elkaars gedrag bijhouden
- **Berichten.** End-to-end versleutelde privéberichten, één-op-één spraakoproepen en een asynchroon
  berichtensysteem dat op e-mail lijkt, maken deel uit van het project.
- **Clients.** Elke gebruiker draait een JVM-node. De referentieclient is een webinterface die door
  die lokale node wordt geserveerd.

## Waar ze verschillen

### Wie spam filtert

Lapis filtert bij de kijker. Inhoud verspreidt zich, en daarna bepalen de vertrouwensgraaf van elke
kijker en de betalingsregels van de app die die kijker gebruikt wat er bovenkomt. Bitsocial filtert
bij de community: een post moet de challenge van de community doorstaan voordat de communitynode hem
accepteert, dus geweigerde spam wordt nooit deel van de community. Zie
[Aangepaste antispamuitdagingen](/custom-challenges/).

### Wie de macht heeft

Bij Lapis beslist elke kijker wie hij vertrouwt, en de beheerder van elke app beslist hoe betaalde
zichtbaarheid daar werkt. Bij Bitsocial stelt een community-eigenaar de regels voor die ene community
vast, en apps kiezen wat ze tonen. Geen van beide heeft een beheerder op protocolniveau.

### Economie

Lapis bouwt Bitcoin- en Lightning-betalingsbewijzen in zijn zichtbaarheidsscore in. Bitsocial heeft
geen betaallaag in het protocol; een community kan via haar challenge een betaling of token vereisen.

### Browser

Bitsocial-apps kunnen een peer-to-peer-node in een gewoon browsertabblad draaien. Zie
[Peer-to-peer in de browser](/browser-p2p/). De browserinterface van Lapis is een lokale pagina die
door de JVM-node van de gebruiker wordt geserveerd.

### Reikwijdte

Lapis bundelt privéberichten, spraakoproepen en mail. Bitsocial richt zich op openbare communities en
heeft nog geen ingebouwde privéberichten.

## Vergelijking

| Vraag                  | Lapis Net                                                                                          | Bitsocial                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Categorie              | Peer-to-peer sociaal protocol (prototype)                                                          | Peer-to-peer-netwerk van communities                                                   |
| Identiteit             | secp256k1-sleutelpaar met een gekoppelde Ed25519-peer-ID                                           | Ed25519-sleutelparen voor gebruikers en communities                                    |
| Waar posts staan       | Nabu-opslag (IPFS op libp2p) op deelnemende nodes                                                  | De node van de community-eigenaar en de peers die de community lezen en seeden         |
| Communities            | Geen communityobject; curatie gebeurt per kijker en per app                                        | Volwaardige objecten waarvan de node posts accepteert of weigert                       |
| Spambestrijding        | Vertrouwensgraaf van de kijker, betaalde zichtbaarheid, Lightning-stortingen voor eerste berichten | De challenge van elke community voordat een post wordt geaccepteerd                    |
| Moderatie              | De vertrouwensgraaf van elke kijker; appbeheerders bepalen de regels voor betaalde zichtbaarheid   | Community-eigenaren modereren hun community; apps kiezen wat ze tonen                  |
| Economie               | Bitcoin- en Lightning-betalingsbewijzen in de scores                                               | Geen in het protocol; een challenge kan een betaling of token vereisen                 |
| Browser                | Lokale webinterface die door een JVM-node wordt geserveerd                                         | Peer-to-peer-node in een gewoon browsertabblad                                         |
| Netwerk                | Prototype zonder openbaar netwerk                                                                  | Live netwerk met apps zoals [5chan](/apps/5chan/) en [Seedit](/apps/seedit/)           |
| Belangrijkste afweging | Uitgebreide ingebouwde reputatie en berichten, maar nog geen openbaar netwerk                      | Kleinere kern die in browsers draait, maar geen ingebouwde reputatie of privéberichten |

## Kunnen ze samenwerken?

Bitsocial-challenges zijn willekeurige code, dus een vertrouwensscore in Lapis-stijl zou er een kunnen
worden. De ingebouwde `whitelist`-challenge kan al lijsten met toegestane adressen van URL's lezen.
Een dienst die de Bitsocial-adressen publiceert die een Veritas-graaf vertrouwt, zou die auteurs in
een community een CAPTCHA kunnen laten overslaan. Daarvoor is een manier nodig om een
Lapis-identiteit aan een Bitsocial-adres te koppelen, en zoiets bestaat vandaag niet.
