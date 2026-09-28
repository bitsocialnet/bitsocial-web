---
title: Peer-to-peer i nettleseren
description: Hvordan en Bitsocial-nettapp kjører en ekte libp2p-node i nettleserfanen, hvilke transporter den bruker, og oppstrømsfiksen fra 2026 som gjorde det mulig å publisere fra en fane.
---

# Peer-to-peer i nettleseren

En Bitsocial-nettapp trenger ikke å være klient hos noen andres server. Den kan kjøre en
[Helia](https://helia.io/)-node inne i nettleserfanen, koble seg til det samme peer-to-peer-nettverket som
skrivebords- og CLI-noder, hente fellesskapsinnhold fra peers og publisere over pubsub.

Denne siden forklarer hva det faktisk innebærer, hvilke transporter som brukes, hva den fortsatt ikke får til, og
hvorfor publisering fra en fane først begynte å virke i 2026.

For den bredere nettverksarkitekturen, se [Peer-to-Peer-protokoll](/peer-to-peer-protocol/).

## Hva som kjører i fanen

Når nettleser-P2P er aktivt, holder siden en ekte libp2p-node:

- den kobler seg til andre peers over sikre WebSockets
- den henter og verifiserer fellesskapsinnhold fra disse peerne, ikke fra en IPFS-gateway
- den deltar i gossipsub, slik at publisering av et innlegg ikke krever en driftet pubsub-leverandør
- den bruker den samme protokollklientstakken (`pkc-js`) som alle andre Bitsocial-apper

Den praktiske konsekvensen er at ingen gateway-operatør står mellom en leser på nettet og et fellesskap.
Det finnes ikke ett HTTPS-endepunkt som kan presses til å droppe et fellesskap for alle nettleserbrukere
samtidig.

## Hvordan nettlesernoder kobler seg til

`pkc-js` kobler seg til peers over **sikre WebSockets**. Oppkobling via WebRTC og WebTransport avvises som
standard av en connection gater, fordi de i nettleseren gir lange og ofte mislykkede oppkoblingsforløp –
STUN/ICE-forhandling, rotasjon av certhash – som gjør sideinnlastingen tregere, mens WebSocket gir en direkte
og pålitelig transport. Kallere som spesifikt ønsker WebRTC eller WebTransport, kan overstyre gateren gjennom
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Den praktiske konsekvensen er at en nettleser-peer kobler seg til noder som eksponerer et WSS-endepunkt, og
slike noder trenger dermed et domene og et CA-signert sertifikat. Peers bak vanlige forbrukertilkoblinger uten
dette nås indirekte i stedet for å kobles til direkte fra fanen.

## Hvorfor publisering fra nettleseren først begynte å virke i 2026

Peer-to-peer i nettleseren er ingen ny idé. Det som endret seg i 2026, er at _innleggene_ fra en nettlesernode
nå når resten av nettverket.

Spesifikasjonen for libp2p-pubsub krever at en meldings `seqno` er et lineært økende 64-bits
big-endian-heltall. `js-libp2p-gossipsub` genererte i stedet 8 tilfeldige byte, mens go-libp2p-pubsub og
rust-libp2p begge brukte en teller. Kubo 0.40+ aktiverer `BasicSeqnoValidator` som standard, og den avviser
enhver melding der seqno ikke er høyere enn den høyeste som allerede er sett fra den peeren.

Effekten var at de fleste meldinger publisert av en JavaScript-node – inkludert en nettlesernode – ble forkastet
i stillhet av Kubo-peers. En reproduksjon målte at 2 til 8 av 30 meldinger kom fram.

Dette ble diagnostisert i
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) og rettet i
**`@libp2p/gossipsub` 15.0.21** i mai 2026. Fram til det landet, kunne en nettlesernode koble seg til og lese,
men innleggene forsvant stort sett på vei til Go-peers. `pkc-js` leveres med `@libp2p/gossipsub` 16.0.4, altså
nyere enn den rettelsen.

## Hva en nettlesernode fortsatt ikke får til

En nettlesernode er en ekte peer, ikke en server. Den har andre begrensninger enn en skrivebordsnode eller en
node som alltid er på:

- den kan vanligvis ikke ta imot vilkårlige innkommende tilkoblinger fra det åpne internettet
- den virker bare mens fanen er åpen, så den er ingen langlivet vert for et fellesskaps data
- den kan ikke delta i en libp2p-DHT, og derfor går oppdagelse gjennom HTTP-rutere
- den egner seg dårlig for seeding i stor skala

Full drift av et fellesskap håndteres fortsatt best av en skrivebordsapp, `bitsocial-cli` eller en annen node
som alltid er på. Nettleser-P2P endrer hvem som kan _lese og publisere_ uten en gateway; det fjerner ikke
behovet for peers som holder seg tilkoblet.

## HTTP-rutere er ikke gatewayer

Nettleserklienter spør fortsatt [HTTP-rutere](/peer-to-peer-protocol/#public-key-based-addressing) for å finne
ut hvilke peers som akkurat nå tilbyr et fellesskaps adresse. Dette er den ærlige asterisken ved «ren
peer-to-peer i nettleseren», og det er verdt å være presis om den:

- en ruter lagrer bare peer-adresser for en innholdsadresse
- den lagrer, serverer eller kjenner ikke fellesskapets innhold
- klienter spør flere rutere parallelt og slår sammen resultatene
- hvem som helst kan drive en, og å bytte ruter er en konfigurasjonsendring uten datamigrering

Etter oppdagelsen går innholdsoverføring og pubsub-trafikk peer-to-peer. En ruter som forsvinner koster deg en
oppslagsvei, ikke dataene dine. En IPFS-gateway ligger derimot midt i innholdsstien.

## Hvor dette kjører i dag

- [5chan](/apps/5chan/) kjører ren nettleser-P2P som standard i nettappen på
  [5chan.app](https://5chan.app).

## Gateway som reserve

Gateway-basert tilgang finnes fortsatt som en kompatibilitetsvei for nettlesere eller nettverk som ikke kan
koble seg til direkte. Se [Gateway som reserve](/peer-to-peer-protocol/#gateway-fallback). Målarkitekturen er
nettleser-P2P først, med gatewayer som en valgfri reserve i stedet for standard flaskehals.
