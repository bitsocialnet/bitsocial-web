---
title: Peer-to-peer nel browser
description: Come una web app Bitsocial esegue un vero nodo libp2p nella scheda del browser, quali trasporti usa e la correzione upstream del 2026 che ha reso possibile pubblicare da una scheda.
---

# Peer-to-peer nel browser

Una web app Bitsocial non è per forza il client del server di qualcun altro. Può eseguire un nodo
[Helia](https://helia.io/) dentro la scheda del browser, entrare nella stessa rete peer-to-peer dei
nodi desktop e CLI, recuperare i contenuti delle comunità dai peer e pubblicare tramite pubsub.

Questa pagina spiega che cosa significa davvero, quali trasporti vengono usati, che cosa resta fuori
portata e perché pubblicare da una scheda ha iniziato a funzionare solo nel 2026.

Per il disegno complessivo della rete, vedi [Protocollo peer-to-peer](/peer-to-peer-protocol/).

## Che cosa gira nella scheda

Quando il P2P nel browser è attivo, la pagina ospita un vero nodo libp2p:

- apre connessioni verso altri peer su WebSockets sicuri
- recupera e verifica i contenuti delle comunità da quei peer, non da un gateway IPFS
- partecipa a gossipsub, quindi pubblicare un post non richiede un pubsub provider ospitato
- usa lo stesso stack client di protocollo (`pkc-js`) di ogni altra app Bitsocial

La conseguenza pratica è che nessun operatore di gateway si frappone tra un lettore web e una
comunità. Non esiste un unico endpoint HTTPS su cui fare leva per far sparire una comunità a tutti
gli utenti browser in una volta sola.

## Come si connettono i nodi nel browser

`pkc-js` contatta i peer tramite **WebSockets sicuri**. I tentativi di connessione WebRTC e
WebTransport sono negati per impostazione predefinita da un connection gater, perché nel browser
introducono percorsi di apertura della connessione lunghi e spesso fallimentari — negoziazione
STUN/ICE, rotazione del certhash — che rallentano il caricamento della pagina, mentre WebSocket
offre un trasporto diretto e affidabile. Chi ha bisogno specificamente di WebRTC o WebTransport può
scavalcare il gater tramite `libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

La conseguenza pratica è che un peer nel browser si connette a nodi che espongono un endpoint WSS, e
quindi quei nodi hanno bisogno di un dominio e di un certificato firmato da una CA. I peer dietro
connessioni domestiche che non ne dispongono vengono raggiunti in modo indiretto, non contattati
direttamente dalla scheda.

## Perché pubblicare dal browser ha iniziato a funzionare solo nel 2026

Il peer-to-peer nel browser non è un'idea nuova. Ciò che è cambiato nel 2026 è che ora i _post_ di
un nodo nel browser arrivano davvero al resto della rete.

La specifica pubsub di libp2p richiede che il `seqno` di un messaggio sia un intero a 64 bit
big-endian crescente in modo lineare. `js-libp2p-gossipsub` generava invece 8 byte casuali, mentre
go-libp2p-pubsub e rust-libp2p usavano entrambi un contatore. Kubo 0.40+ abilita
`BasicSeqnoValidator` per impostazione predefinita, e questo componente scarta ogni messaggio il cui
seqno non sia maggiore del più alto già visto da quel peer.

L'effetto era che la maggior parte dei messaggi pubblicati da un nodo JavaScript — nodo nel browser
compreso — veniva scartata in silenzio dai peer Kubo. In un caso di riproduzione arrivavano da 2 a 8
messaggi su 30.

Il problema è stato diagnosticato in
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) e risolto in
**`@libp2p/gossipsub` 15.0.21** a maggio 2026. Fino a quel momento un nodo nel browser poteva
connettersi e leggere, ma i suoi post svanivano quasi sempre lungo il percorso verso i peer Go.
`pkc-js` include `@libp2p/gossipsub` 16.0.4, successivo a quella correzione.

## Che cosa un nodo nel browser continua a non poter fare

Un nodo nel browser è un peer vero, non un server. Ha limiti diversi da un nodo desktop o sempre
attivo:

- di norma non può accettare connessioni in ingresso arbitrarie da internet pubblico
- funziona solo finché la scheda resta aperta, quindi non è un host duraturo per i dati di una comunità
- non può entrare in una DHT libp2p, motivo per cui la scoperta passa dai router HTTP
- si presta male al seeding su larga scala

L'hosting completo di una comunità resta compito di un'app desktop, di `bitsocial-cli` o di un altro
nodo sempre attivo. Il P2P nel browser cambia chi può _leggere e pubblicare_ senza un gateway; non
elimina la necessità di peer che restino online.

## I router HTTP non sono gateway

I client nel browser interrogano comunque i
[router HTTP](/peer-to-peer-protocol/#public-key-based-addressing) per scoprire quali peer
forniscono in quel momento l'indirizzo di una comunità. È l'asterisco onesto sul «peer-to-peer puro
nel browser», e vale la pena essere precisi:

- un router conserva soltanto gli indirizzi dei peer associati a un indirizzo di contenuto
- non memorizza, non serve e non conosce nemmeno i contenuti della comunità
- i client interrogano più router in parallelo e uniscono i risultati
- chiunque può gestirne uno, e cambiare router è una modifica di configurazione senza migrazione di dati

Dopo la scoperta, il trasferimento dei contenuti e il traffico pubsub avvengono peer-to-peer. Un
router che sparisce ti costa un percorso di ricerca, non i tuoi dati. Un gateway IPFS, al contrario,
sta sul percorso dei contenuti.

## Dove è già in funzione

- [5chan](/apps/5chan/) usa per impostazione predefinita il P2P puro nel browser nella web app su
  [5chan.app](https://5chan.app).

## Ripiego sul gateway

L'accesso tramite gateway esiste ancora come percorso di compatibilità per browser o reti che non
possono collegarsi direttamente. Vedi [Ripiego sul gateway](/peer-to-peer-protocol/#gateway-fallback).
L'architettura di riferimento mette al primo posto il P2P nel browser, con i gateway come ripiego
opzionale invece che come collo di bottiglia predefinito.
