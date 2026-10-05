---
title: Bitsocial och Reticulum
description: Hur Reticulum, den kryptografiska nätverksstacken för LoRa och andra länkar med låg bandbredd, står sig mot Bitsocial, och om Bitsocial skulle kunna köras över den.
---

# Bitsocial och Reticulum

[Reticulum](https://reticulum.network/) är en kryptografibaserad nätverksstack för att bygga nätverk
över de överföringsmedier som finns till hands: LoRa-radio, paketradio, seriella länkar, Wi-Fi,
Ethernet, TCP, UDP eller I2P. Den nämns i samma andetag som Bitsocial eftersom båda tar bort
företaget som mellanhand. De gör det på olika lager, så de kompletterar varandra snarare än
konkurrerar.

## Olika lager

Reticulum ersätter nätverkslagret. Den ger applikationer krypterade, routbara slutpunkter utan
IP-adresser, DNS, certifikatutfärdare eller konton, och den är utformad för att fortsätta fungera på
länkar så långsamma som 5 bitar per sekund med en MTU på 500 byte. Den definierar inte inlägg,
communityer eller moderering; det står de applikationer som byggs ovanpå för.

Bitsocial är ett socialt protokoll. Det körs på IPFS/libp2p-stacken över vanliga
internetanslutningar, även från en webbläsarflik, och definierar communityer, publikationer och
anti-spam-utmaningar per community. Se [Peer-to-peer-protokoll](/peer-to-peer-protocol/) och
[Peer-to-peer i webbläsaren](/browser-p2p/).

I Bitsocials stack skulle Reticulum hamna ungefär där libp2p ligger, inte där Bitsocial-protokollet
ligger.

## Hur Reticulum fungerar

- **Identiteter.** En Reticulum-identitet är en nyckeluppsättning på 512 bitar: en X25519-nyckel för
  kryptering och en Ed25519-nyckel för signaturer.
- **Destinationer.** Applikationer skapar destinationer, som adresseras med en SHA-256-hash som
  trunkerats till 16 byte. Paketen innehåller ingen avsändaradress.
- **Annonseringar.** En destination blir nåbar genom att skicka en annonsering. Transportnoder
  vidarebefordrar den och kommer ihåg nästa hopp tillbaka, så ingen nod behöver en karta över hela
  nätverket.
- **Kryptering.** Trafiken är krypterad som standard, med efemära nycklar och framåtsekretess.
- **LXMF.** Meddelandelagret [LXMF](https://github.com/markqvist/LXMF) lägger till signerade
  meddelanden, direktleverans samt mellanlagring och vidarebefordran via propageringsnoder för
  mottagare som är offline.

Applikationer som byggts på det här sättet är bland annat
[Sideband](https://github.com/markqvist/Sideband) för meddelanden och
[Nomad Network](https://github.com/markqvist/NomadNet) för meddelanden och för att tillhandahålla
sidor. Reticulums manual för en
[lista över program](https://reticulum.network/manual/software.html).

## Jämförelse

| Fråga              | Reticulum                                                                                                                 | Bitsocial                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Vad det är         | Nätverksstack                                                                                                             | Socialt peer-to-peer-protokoll och appar                                                                 |
| Utformat för       | Vilket överföringsmedium som helst, ända ner till långsamma radiolänkar                                                   | Internetanslutningar, även webbläsarflikar                                                               |
| Identitet          | Nyckeluppsättning med X25519 och Ed25519                                                                                  | Ed25519-nyckelpar för användare och communityer                                                          |
| Adresser           | Hash av en identitet och ett applikationsnamn                                                                             | Hash av en communitys publika nyckel                                                                     |
| Hitta en peer      | Annonseringar som sprids av transportnoder                                                                                | HTTP-routrar returnerar peers som är leverantörer                                                        |
| Sociala funktioner | Läggs till av applikationer som Nomad Network                                                                             | Communityer, inlägg, svar och moderering i protokollet                                                   |
| Spamskydd          | Frekvensbegränsning av annonseringar per gränssnitt; LXMF-stämplar med proof-of-work som en mottagare eller nod kan kräva | Varje communitys utmaning innan ett inlägg accepteras                                                    |
| Leverans offline   | LXMF-propageringsnoder lagrar meddelanden och vidarebefordrar dem                                                         | Peers fortsätter att leverera en communitys senaste tillstånd; publicering kräver att dess nod är online |

## Kan Bitsocial köras över Reticulum?

Inte i dag. Bitsocial har ingen Reticulum-transport, och dess datamodell förutsätter
internetbandbredd: en klient hämtar community-metadata och inläggsinnehåll från peers och utbyter
pubsub-meddelanden, vilket passar dåligt på länkar som är byggda kring paket på 500 byte och en
genomströmning som mäts i bitar eller kilobit per sekund.

Den realistiska vägen är smalare: en klient som fungerar över ett lokalt mesh-nät medan den är
frånkopplad och sedan synkroniserar med det bredare Bitsocial-nätverket när en peer eller gateway
med internetåtkomst går att nå. Det skulle vara en ny klient och en ny brygga snarare än en ändring
av protokollet, och det finns inte med på den nuvarande färdplanen.

## För byggare

Reticulum publiceras under [Reticulum-licensen](https://reticulum.network/manual/license.html):
MIT-liknande villkor plus två begränsningar. Programvaran får inte användas i system som är
utformade för att skada människor, eller för att skapa träningsdatamängder för AI eller
maskininlärning. Läs licensen innan du bygger in Reticulum-kod i en Bitsocial-app.

Referensimplementationen är [skriven i Python](https://github.com/markqvist/Reticulum). Utvecklarna
bakom Reticulum varnar för att flera inofficiella portningar av Reticulum och LXMF är
maskingenererade och innehåller licensanspråk som de anser vara ogiltiga, så välj hellre
referensimplementationen eller program som listas i manualen.
