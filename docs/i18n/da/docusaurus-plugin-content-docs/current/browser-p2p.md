---
title: Peer-to-peer i browseren
description: Hvordan en Bitsocial-webapp kører en rigtig libp2p-node i browserfanen, hvilke transporter den bruger, og den opstrømsrettelse fra 2026, der fik publicering fra en fane til at virke.
---

# Peer-to-peer i browseren

En Bitsocial-webapp behøver ikke at være klient på en andens server. Den kan køre en
[Helia](https://helia.io/)-node inde i browserfanen, koble sig på det samme peer-to-peer-netværk som
desktop- og CLI-noder, hente fællesskabsindhold fra peers og publicere via pubsub.

Denne side forklarer, hvad det reelt betyder, hvilke transporter der bruges, hvad den stadig ikke
kan, og hvorfor publicering fra en fane først begyndte at virke i 2026.

Se [Peer-to-Peer protokol](/peer-to-peer-protocol/) for det bredere netværksdesign.

## Hvad der kører i fanen

Når browser-P2P er aktiv, rummer siden en rigtig libp2p-node:

- den opretter forbindelse til andre peers over sikre WebSockets
- den henter og verificerer fællesskabsindhold fra de peers, ikke fra en IPFS-gateway
- den deltager i gossipsub, så publicering af et indlæg ikke kræver en hostet pubsub-udbyder
- den bruger den samme protokolklient-stak (`pkc-js`) som alle andre Bitsocial-apps

Den praktiske konsekvens er, at ingen gateway-operatør sidder mellem en weblæser og et fællesskab.
Der findes ikke ét enkelt HTTPS-endpoint, som kan presses til at fjerne et fællesskab for alle
browserbrugere på én gang.

## Sådan forbinder browsernoder

`pkc-js` forbinder til peers over **sikre WebSockets**. Opkald via WebRTC og WebTransport afvises som
standard af en connection gater, fordi de i browseren tilføjer lange forbindelsesopbygninger, der
ofte slår fejl — STUN/ICE-forhandling, certhash-rotation — og dermed gør sideindlæsningen
langsommere, mens WebSocket giver en direkte og pålidelig transport. Kaldere, der specifikt ønsker
WebRTC eller WebTransport, kan tilsidesætte denne gater via
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Den praktiske konsekvens er, at en browser-peer forbinder til noder, der eksponerer et WSS-endpoint,
og de noder skal derfor have et domæne og et CA-signeret certifikat. Peers bag forbrugerforbindelser
uden et sådant nås indirekte i stedet for at blive kontaktet direkte fra fanen.

## Hvorfor publicering fra browseren først begyndte at virke i 2026

Peer-to-peer i browseren er ikke en ny idé. Det, der ændrede sig i 2026, er, at en browsernodes
_indlæg_ nu når ud til resten af netværket.

libp2p's pubsub-specifikation kræver, at en beskeds `seqno` er et lineært stigende
64-bit big-endian-heltal. `js-libp2p-gossipsub` genererede i stedet 8 tilfældige bytes, mens
go-libp2p-pubsub og rust-libp2p begge brugte en tæller. Kubo 0.40+ aktiverer `BasicSeqnoValidator`
som standard, og den afviser enhver besked, hvis seqno ikke er højere end den højeste, der allerede
er set fra den pågældende peer.

Effekten var, at de fleste beskeder publiceret af en JavaScript-node — inklusive en browsernode —
blev kasseret uden varsel af Kubo-peers. En reproduktion målte, at 2 til 8 ud af 30 beskeder nåede
frem.

Det blev diagnosticeret i
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) og rettet i
**`@libp2p/gossipsub` 15.0.21** i maj 2026. Indtil den rettelse landede, kunne en browsernode
forbinde og læse, men dens indlæg forsvandt for det meste på vejen til Go-peers. `pkc-js` leveres med
`@libp2p/gossipsub` 16.0.4, altså efter rettelsen.

## Hvad en browsernode stadig ikke kan

En browsernode er en rigtig peer, ikke en server. Den har andre begrænsninger end en desktop-node
eller en node, der altid er tændt:

- den kan normalt ikke tage imod vilkårlige indgående forbindelser fra det offentlige internet
- den virker kun, mens fanen er åben, så den er ikke en langtidsholdbar vært for et fællesskabs data
- den kan ikke deltage i en libp2p-DHT, og derfor foregår opdagelse gennem HTTP-routere
- den egner sig dårligt til seeding i stor skala

Fuld hosting af et fællesskab håndteres stadig bedst af en desktop-app, `bitsocial-cli` eller en anden
node, der altid er tændt. Browser-P2P ændrer, hvem der kan _læse og poste_ uden en gateway; det
fjerner ikke behovet for peers, der forbliver online.

## HTTP-routere er ikke gateways

Browserklienter forespørger fortsat [HTTP-routere](/peer-to-peer-protocol/#public-key-based-addressing)
for at finde ud af, hvilke peers der i øjeblikket leverer et fællesskabs adresse. Det er det ærlige
forbehold ved »ren peer-to-peer i browseren«, og det er værd at være præcis omkring:

- en router gemmer kun peer-adresser for en indholdsadresse
- den gemmer, serverer eller kender ikke fællesskabets indhold
- klienter forespørger flere routere parallelt og fletter resultaterne
- enhver kan køre en, og at skifte router er en konfigurationsændring uden datamigrering

Efter opdagelsen bevæger indholdsoverførsel og pubsub-trafik sig peer-to-peer. En router, der
forsvinder, koster dig en opslagsvej, ikke dine data. En IPFS-gateway ligger derimod midt i
indholdsstien.

## Hvor det kører i dag

- [5chan](/apps/5chan/) kører som standard ren browser-P2P i webappen på
  [5chan.app](https://5chan.app).

## Gateway-fallback

Gateway-baseret adgang findes fortsat som en kompatibilitetsvej for browsere eller netværk, der ikke
kan koble sig direkte på. Se [Gateway-fallback](/peer-to-peer-protocol/#gateway-fallback).
Målarkitekturen er browser-P2P først, med gateways som en valgfri fallback i stedet for den
forvalgte flaskehals.
