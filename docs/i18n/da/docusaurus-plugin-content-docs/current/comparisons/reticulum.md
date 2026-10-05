---
title: Bitsocial og Reticulum
description: Hvordan Reticulum, den kryptografiske netværksstak til LoRa og andre forbindelser med lav båndbredde, adskiller sig fra Bitsocial, og om Bitsocial ville kunne køre oven på den.
---

# Bitsocial og Reticulum

[Reticulum](https://reticulum.network/) er en kryptografibaseret netværksstak til at bygge netværk
over de transportmedier, der nu engang er til rådighed: LoRa-radioer, pakkeradio, serielle
forbindelser, Wi-Fi, Ethernet, TCP, UDP eller I2P. Den bliver ofte nævnt sammen med Bitsocial, fordi
begge fjerner virksomheden i midten. De gør det på forskellige lag, så de supplerer hinanden i
stedet for at konkurrere.

## Forskellige lag

Reticulum erstatter netværkslaget. Den giver applikationer krypterede, routbare endpoints uden
IP-adresser, DNS, certifikatudstedere eller konti, og den er designet til at blive ved med at virke
på forbindelser helt ned til 5 bit i sekundet med en MTU på 500 byte. Den definerer ikke indlæg,
fællesskaber eller moderering; det står de applikationer, der bygges ovenpå, for.

Bitsocial er en social protokol. Den kører på IPFS/libp2p-stakken over almindelige
internetforbindelser, også fra en browserfane, og definerer fællesskaber, publikationer og
anti-spam-udfordringer pr. fællesskab. Se [Peer-to-peer-protokol](/peer-to-peer-protocol/) og
[Peer-to-peer i browseren](/browser-p2p/).

I Bitsocials stak ville Reticulum ligge omtrent der, hvor libp2p ligger, og ikke der, hvor
Bitsocial-protokollen ligger.

## Sådan fungerer Reticulum

- **Identiteter.** En Reticulum-identitet er et nøglesæt på 512 bit: en X25519-nøgle til
  kryptering og en Ed25519-nøgle til signaturer.
- **Destinationer.** Applikationer opretter destinationer, der adresseres med en SHA-256-hash
  afkortet til 16 bytes. Pakker indeholder ingen afsenderadresse.
- **Annonceringer.** En destination bliver nåbar ved at udsende en annoncering. Transportnoder
  videresender den og husker næste hop tilbage, så ingen node behøver et kort over hele netværket.
- **Kryptering.** Trafikken er krypteret som standard med efemere nøgler og forward secrecy.
- **LXMF.** Beskedlaget [LXMF](https://github.com/markqvist/LXMF) tilføjer signerede beskeder,
  direkte levering samt lagring og videresendelse via propageringsnoder til modtagere, der er
  offline.

Applikationer bygget på den måde omfatter [Sideband](https://github.com/markqvist/Sideband) til
beskeder og [Nomad Network](https://github.com/markqvist/NomadNet) til beskeder og hostede sider.
Reticulum-manualen fører en [liste over programmer](https://reticulum.network/manual/software.html).

## Sammenligning

| Spørgsmål          | Reticulum                                                                                                                | Bitsocial                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Hvad det er        | Netværksstak                                                                                                             | Social peer-to-peer-protokol og apps                                                                       |
| Designet til       | Ethvert transportmedie, helt ned til langsomme radioforbindelser                                                         | Internetforbindelser, også browserfaner                                                                    |
| Identitet          | Nøglesæt med X25519 og Ed25519                                                                                           | Ed25519-nøglepar til brugere og fællesskaber                                                               |
| Adresser           | Hash af en identitet og et applikationsnavn                                                                              | Hash af et fællesskabs offentlige nøgle                                                                    |
| At finde en peer   | Annonceringer, som transportnoder spreder                                                                                | HTTP-routere returnerer udbyder-peers                                                                      |
| Sociale funktioner | Tilføjes af applikationer som Nomad Network                                                                              | Fællesskaber, indlæg, svar og moderering i selve protokollen                                               |
| Spamkontrol        | Hastighedsgrænser for annonceringer pr. interface; LXMF-stempler med proof-of-work, som en modtager eller node kan kræve | Hvert fællesskabs udfordring, før et indlæg accepteres                                                     |
| Offline-levering   | LXMF-propageringsnoder lagrer og videresender beskeder                                                                   | Peers bliver ved med at levere et fællesskabs seneste tilstand; publicering kræver, at dets node er online |

## Kunne Bitsocial køre over Reticulum?

Ikke i dag. Bitsocial har ingen Reticulum-transport, og datamodellen forudsætter internetbåndbredde:
en klient henter fællesskabsmetadata og indlægsindhold fra peers og udveksler pubsub-beskeder,
hvilket passer dårligt til forbindelser, der er bygget op omkring pakker på 500 byte og en
gennemstrømning målt i bit eller kilobit i sekundet.

Den realistiske vej er smallere: en klient, der fungerer over et lokalt mesh-netværk, mens den er
afkoblet, og som derefter synkroniserer med det bredere Bitsocial-netværk, når en peer eller gateway
med internetadgang kan nås. Det ville være en ny klient og en ny bro snarere end en ændring af
protokollen, og det står ikke på den nuværende køreplan.

## Til udviklere

Reticulum udgives under [Reticulum License](https://reticulum.network/manual/license.html):
MIT-lignende vilkår plus to begrænsninger. Softwaren må ikke bruges i systemer, der er designet til
at skade mennesker, eller til at skabe træningsdatasæt til AI eller maskinlæring. Læs licensen, før
du indbygger Reticulum-kode i en Bitsocial-app.

Referenceimplementeringen er [skrevet i Python](https://github.com/markqvist/Reticulum).
Reticulums vedligeholdere advarer om, at flere uofficielle porteringer af Reticulum og LXMF er
maskingenererede og bærer licenspåstande, som de anser for ugyldige, så foretræk
referenceimplementeringen eller de programmer, der står opført i manualen.
