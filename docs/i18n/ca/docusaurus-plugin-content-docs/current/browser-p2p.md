---
title: Peer-to-peer al navegador
description: Com una aplicació web de Bitsocial executa un node libp2p real dins la pestanya del navegador, quins transports fa servir i la correcció de 2026 que va fer possible publicar des d'una pestanya.
---

# Peer-to-peer al navegador

Una aplicació web de Bitsocial no ha de ser per força el client del servidor d'algú altre. Pot
executar un node [Helia](https://helia.io/) dins de la pestanya del navegador, unir-se a la mateixa
xarxa peer-to-peer que els nodes d'escriptori i de CLI, obtenir contingut de les comunitats dels
parells i publicar per pubsub.

Aquesta pàgina explica què vol dir això realment, quins transports fa servir, què encara no pot fer i
per què publicar des d'una pestanya no va començar a funcionar fins al 2026.

Per al disseny general de la xarxa, vegeu el [Protocol peer-to-peer](/peer-to-peer-protocol/).

## Què s'executa a la pestanya

Quan el P2P del navegador està actiu, la pàgina manté un node libp2p real:

- estableix connexions amb altres parells mitjançant WebSockets segurs
- obté i verifica el contingut de les comunitats a partir d'aquests parells, no d'una passarel·la IPFS
- participa en gossipsub, de manera que publicar una entrada no requereix cap proveïdor de pubsub allotjat
- fa servir la mateixa pila de client de protocol (`pkc-js`) que la resta d'aplicacions de Bitsocial

La conseqüència pràctica és que cap operador de passarel·la no s'interposa entre un lector web i una
comunitat. No hi ha cap punt d'accés HTTPS únic al qual es pugui pressionar perquè deixi de servir
una comunitat a tots els usuaris de navegador alhora.

## Com es connecten els nodes de navegador

`pkc-js` es connecta als parells mitjançant **WebSockets segurs**. Les connexions per WebRTC i
WebTransport es deneguen per defecte a través d'un filtre de connexions, perquè al navegador afegeixen
camins d'establiment de connexió llargs i que sovint fallen —negociació STUN/ICE, rotació de
certhash— que alenteixen la càrrega de la pàgina, mentre que WebSocket ofereix un transport directe i
fiable. Qui vulgui específicament WebRTC o WebTransport pot substituir aquest filtre mitjançant
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

La conseqüència pràctica és que un parell de navegador es connecta a nodes que exposen un punt
d'accés WSS, cosa que vol dir que aquests nodes necessiten un domini i un certificat signat per una
CA. Els parells que hi ha darrere de connexions domèstiques sense aquests requisits s'assoleixen de
manera indirecta en lloc de connectar-s'hi des de la pestanya.

## Per què publicar des del navegador no va començar a funcionar fins al 2026

El peer-to-peer al navegador no és una idea nova. El que va canviar el 2026 és que les _publicacions_
d'un node de navegador ara arriben a la resta de la xarxa.

L'especificació de pubsub de libp2p exigeix que el `seqno` d'un missatge sigui un enter de 64 bits
big-endian que creixi linealment. `js-libp2p-gossipsub` generava 8 bytes aleatoris, mentre que
go-libp2p-pubsub i rust-libp2p feien servir tots dos un comptador. Kubo 0.40+ activa
`BasicSeqnoValidator` per defecte, que rebutja qualsevol missatge el seqno del qual no sigui superior
al més alt que ja s'ha vist d'aquell parell.

L'efecte era que la majoria dels missatges publicats per un node de JavaScript —inclòs un node de
navegador— els descartaven silenciosament els parells amb Kubo. Un cas de reproducció va mesurar que
n'arribaven entre 2 i 8 de cada 30.

Això es va diagnosticar a
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) i es va
corregir a **`@libp2p/gossipsub` 15.0.21** el maig de 2026. Fins que aquesta correcció no va arribar,
un node de navegador es podia connectar i llegir, però les seves publicacions es perdien gairebé
sempre pel camí cap als parells de Go. `pkc-js` inclou `@libp2p/gossipsub` 16.0.4, posterior a aquella
correcció.

## Què encara no pot fer un node de navegador

Un node de navegador és un parell real, no un servidor. Té límits diferents dels d'un node
d'escriptori o sempre actiu:

- normalment no pot acceptar connexions entrants arbitràries des d'internet pública
- només funciona mentre la pestanya és oberta, així que no és un allotjament durador per a les dades d'una comunitat
- no es pot unir a una DHT de libp2p, i per això el descobriment passa per encaminadors HTTP
- és poc adequat per fer de llavor a gran escala

L'allotjament complet d'una comunitat continua estant més ben resolt amb una aplicació d'escriptori,
`bitsocial-cli` o un altre node sempre actiu. El P2P del navegador canvia qui pot _llegir i publicar_
sense passarel·la; no elimina la necessitat de parells que es mantinguin en línia.

## Els encaminadors HTTP no són passarel·les

Els clients de navegador continuen consultant
[encaminadors HTTP](/peer-to-peer-protocol/#public-key-based-addressing) per saber quins parells
proporcionen actualment l'adreça d'una comunitat. Aquest és l'asterisc honest de «peer-to-peer pur al
navegador», i val la pena ser-hi precís:

- un encaminador només desa adreces de parells per a una adreça de contingut
- no desa, no serveix ni tan sols coneix el contingut de la comunitat
- els clients consulten diversos encaminadors en paral·lel i combinen els resultats
- qualsevol persona en pot executar un, i canviar d'encaminador és un canvi de configuració sense migració de dades

Després del descobriment, la transferència de contingut i el trànsit de pubsub circulen
peer-to-peer. Un encaminador que desapareix us costa un camí de cerca, no les vostres dades. Una
passarel·la IPFS, en canvi, forma part del camí del contingut.

## On s'executa avui

- [5chan](/apps/5chan/) funciona per defecte amb P2P de navegador pur a l'aplicació web de
  [5chan.app](https://5chan.app).

## Alternativa amb passarel·la

L'accés a través de passarel·la continua existint com a camí de compatibilitat per als navegadors o
les xarxes que no es poden unir directament a la xarxa. Vegeu
[Alternativa amb passarel·la](/peer-to-peer-protocol/#gateway-fallback). L'arquitectura objectiu és
el P2P de navegador primer, amb les passarel·les com a alternativa opcional en lloc de coll d'ampolla
per defecte.
