---
title: Bitsocial en Reticulum
description: Hoe Reticulum, de cryptografische netwerkstack voor LoRa en andere verbindingen met weinig bandbreedte, zich verhoudt tot Bitsocial, en of Bitsocial erover zou kunnen draaien.
---

# Bitsocial en Reticulum

[Reticulum](https://reticulum.network/) is een op cryptografie gebaseerde netwerkstack voor het
bouwen van netwerken over welke dragers er ook maar beschikbaar zijn: LoRa-radio's, packet radio,
seriële verbindingen, wifi, Ethernet, TCP, UDP of I2P. Het wordt vaak naast Bitsocial genoemd, omdat
beide het bedrijf in het midden weghalen. Ze doen dat op verschillende lagen, dus ze vullen elkaar
aan in plaats van met elkaar te concurreren.

## Verschillende lagen

Reticulum vervangt de netwerklaag. Het geeft applicaties versleutelde, routeerbare eindpunten zonder
IP-adressen, DNS, certificaatautoriteiten of accounts, en is ontworpen om te blijven werken op
verbindingen van amper 5 bits per seconde met een MTU van 500 bytes. Het definieert geen posts,
communities of moderatie; applicaties die erop voortbouwen voegen die toe.

Bitsocial is een sociaal protocol. Het draait op de IPFS/libp2p-stack over gewone
internetverbindingen, ook vanuit een browsertabblad, en definieert communities, publicaties en
anti-spam-challenges per community. Zie [Peer-to-peer-protocol](/peer-to-peer-protocol/) en
[Peer-to-peer in de browser](/browser-p2p/).

In de stack van Bitsocial zou Reticulum ongeveer op de plek van libp2p zitten, niet op die van het
Bitsocial-protocol.

## Hoe Reticulum werkt

- **Identiteiten.** Een Reticulum-identiteit is een sleutelset van 512 bits: een X25519-sleutel voor
  versleuteling en een Ed25519-sleutel voor handtekeningen.
- **Bestemmingen.** Applicaties maken bestemmingen (destinations) aan, geadresseerd met een
  SHA-256-hash die is ingekort tot 16 bytes. Pakketten bevatten geen bronadres.
- **Announces.** Een bestemming wordt bereikbaar door een announce te versturen. Transportnodes sturen
  die door en onthouden de volgende hop terug, zodat geen enkele node een kaart van het hele netwerk
  nodig heeft.
- **Versleuteling.** Verkeer is standaard versleuteld, met tijdelijke sleutels en forward secrecy.
- **LXMF.** De berichtenlaag [LXMF](https://github.com/markqvist/LXMF) voegt ondertekende berichten,
  directe aflevering en store-and-forward via propagatienodes toe voor ontvangers die offline zijn.

Applicaties die zo zijn gebouwd, zijn onder meer [Sideband](https://github.com/markqvist/Sideband)
voor berichten en [Nomad Network](https://github.com/markqvist/NomadNet) voor berichten en gehoste
pagina's. De Reticulum-handleiding houdt een
[lijst met programma's](https://reticulum.network/manual/software.html) bij.

## Vergelijking

| Vraag              | Reticulum                                                                                                 | Bitsocial                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Wat het is         | Netwerkstack                                                                                              | Peer-to-peer sociaal protocol en apps                                                                                |
| Ontworpen voor     | Elke drager, tot en met trage radioverbindingen                                                           | Internetverbindingen, inclusief browsertabbladen                                                                     |
| Identiteit         | Sleutelset van X25519 en Ed25519                                                                          | Ed25519-sleutelparen voor gebruikers en communities                                                                  |
| Adressen           | Hash van een identiteit en een applicatienaam                                                             | Hash van de publieke sleutel van een community                                                                       |
| Een peer vinden    | Announces die door transportnodes worden verspreid                                                        | HTTP-routers geven aanbiedende peers terug                                                                           |
| Sociale functies   | Toegevoegd door applicaties zoals Nomad Network                                                           | Communities, posts, reacties en moderatie in het protocol                                                            |
| Spambestrijding    | Rate limits voor announces per interface; LXMF-proof-of-work-stempels die een ontvanger of node kan eisen | De challenge van elke community voordat een post wordt geaccepteerd                                                  |
| Offline aflevering | LXMF-propagatienodes slaan berichten op en sturen ze door                                                 | Peers blijven de laatste staat van een community serveren; voor publiceren moet de node van de community online zijn |

## Kan Bitsocial over Reticulum draaien?

Op dit moment niet. Bitsocial heeft geen Reticulum-transport, en het datamodel gaat uit van
internetbandbreedte: een client haalt communitymetadata en postinhoud op bij peers en wisselt
pubsub-berichten uit. Dat past slecht op verbindingen die zijn opgebouwd rond pakketten van 500 bytes
en een doorvoer die in bits of kilobits per seconde wordt gemeten.

De realistische route is smaller: een client die via een lokaal mesh werkt zolang er geen verbinding
is, en daarna synchroniseert met het bredere Bitsocial-netwerk zodra een peer of gateway met
internettoegang bereikbaar is. Dat zou een nieuwe client met een bridge zijn in plaats van een
wijziging aan het protocol, en het staat niet op de huidige roadmap.

## Voor bouwers

Reticulum wordt gepubliceerd onder de
[Reticulum License](https://reticulum.network/manual/license.html): voorwaarden in MIT-stijl plus
twee beperkingen. De software mag niet worden gebruikt in systemen die zijn ontworpen om mensen
schade toe te brengen, of bij het maken van trainingsdatasets voor AI of machine learning. Lees de
licentie voordat je Reticulum-code in een Bitsocial-app bundelt.

De referentie-implementatie is [geschreven in Python](https://github.com/markqvist/Reticulum). De
beheerders van Reticulum waarschuwen dat verschillende onofficiële ports van Reticulum en LXMF
machinaal gegenereerd zijn en licentieclaims bevatten die zij ongeldig achten. Geef daarom de
voorkeur aan de referentie-implementatie of aan programma's die in de handleiding worden vermeld.
