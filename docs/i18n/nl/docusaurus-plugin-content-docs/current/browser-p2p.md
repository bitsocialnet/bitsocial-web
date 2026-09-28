---
title: Peer-to-peer in de browser
description: Hoe een Bitsocial-webapp een echte libp2p-node in het browsertabblad draait, welke transports die gebruikt, en de upstream-fix uit 2026 waardoor publiceren vanuit een tabblad ging werken.
---

# Peer-to-peer in de browser

Een Bitsocial-webapp hoeft geen client van andermans server te zijn. De app kan een
[Helia](https://helia.io/)-node in het browsertabblad draaien, meedoen aan hetzelfde
peer-to-peer-netwerk als desktop- en CLI-nodes, community-inhoud bij peers ophalen en publiceren
via pubsub.

Deze pagina legt uit wat dat concreet betekent, welke transports daarbij worden gebruikt, wat er
nog steeds niet kan, en waarom publiceren vanuit een tabblad pas in 2026 ging werken.

Zie [Peer-to-peer-protocol](/peer-to-peer-protocol/) voor het bredere netwerkontwerp.

## Wat er in het tabblad draait

Wanneer browser-P2P actief is, houdt de pagina een echte libp2p-node draaiende:

- de node zet verbindingen op naar andere peers via beveiligde WebSockets
- de node haalt community-inhoud op bij die peers en verifieert die, in plaats van bij een IPFS-gateway
- de node doet mee aan gossipsub, waardoor een bericht publiceren geen gehoste pubsub-provider vereist
- de node gebruikt dezelfde protocol-clientstack (`pkc-js`) als elke andere Bitsocial-app

Het praktische gevolg is dat er geen gatewaybeheerder tussen een lezer op het web en een community
in staat. Er is geen enkel HTTPS-eindpunt dat onder druk kan worden gezet om een community in één
keer voor alle browsergebruikers te laten vallen.

## Hoe browser-nodes verbinding maken

`pkc-js` zet verbindingen naar peers op via **beveiligde WebSockets**. Verbindingen via WebRTC en
WebTransport worden standaard geweigerd door een connection gater, omdat ze in de browser lange en
vaak mislukkende paden voor verbindingsopbouw toevoegen — STUN/ICE-onderhandeling,
certhash-rotatie — die het laden van pagina's vertragen, terwijl WebSocket een direct en
betrouwbaar transport biedt. Aanroepers die uitdrukkelijk WebRTC of WebTransport willen, kunnen de
gater overschrijven via `libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Het praktische gevolg is dat een browser-peer verbinding maakt met nodes die een WSS-eindpunt
aanbieden, wat betekent dat die nodes een domein en een door een CA ondertekend certificaat nodig
hebben. Peers achter consumentenverbindingen zonder die twee dingen worden indirect bereikt in
plaats van rechtstreeks vanuit het tabblad benaderd.

## Waarom publiceren vanuit de browser pas in 2026 ging werken

Peer-to-peer in de browser is geen nieuw idee. Wat er in 2026 veranderde, is dat de _berichten_ van
een browser-node nu de rest van het netwerk bereiken.

De libp2p-pubsub-specificatie vereist dat de `seqno` van een bericht een lineair oplopend 64-bits
big-endian geheel getal is. `js-libp2p-gossipsub` genereerde in plaats daarvan 8 willekeurige bytes,
terwijl go-libp2p-pubsub en rust-libp2p allebei een teller gebruikten. Kubo 0.40+ schakelt
`BasicSeqnoValidator` standaard in, en die verwerpt elk bericht waarvan de seqno niet hoger is dan
de hoogste die al van die peer is gezien.

Het effect was dat de meeste berichten die een JavaScript-node publiceerde — een browser-node
inbegrepen — stilzwijgend werden weggegooid door Kubo-peers. Een reproductie mat dat er 2 tot 8 van
de 30 berichten aankwamen.

Dit werd gediagnosticeerd in
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) en opgelost
in **`@libp2p/gossipsub` 15.0.21** in mei 2026. Tot dat moment kon een browser-node wel verbinden en
lezen, maar verdwenen zijn berichten meestal onderweg naar Go-peers. `pkc-js` levert
`@libp2p/gossipsub` 16.0.4 mee, dus voorbij die fix.

## Wat een browser-node nog steeds niet kan

Een browser-node is een echte peer, geen server. Hij heeft andere beperkingen dan een desktop-node
of een altijd-actieve node:

- hij kan meestal geen willekeurige inkomende verbindingen vanaf het publieke internet accepteren
- hij werkt alleen zolang het tabblad open is en is dus geen langdurige host voor de gegevens van een community
- hij kan niet meedoen aan een libp2p-DHT, en daarom loopt discovery via HTTP-routers
- hij is slecht geschikt om op schaal te seeden

Volledige community-hosting kun je nog steeds het beste overlaten aan een desktop-app,
`bitsocial-cli` of een andere altijd-actieve node. Browser-P2P verandert wie er zonder gateway kan
_lezen en posten_; het neemt de behoefte aan peers die online blijven niet weg.

## HTTP-routers zijn geen gateways

Browserclients bevragen nog steeds [HTTP-routers](/peer-to-peer-protocol/#public-key-based-addressing)
om te achterhalen welke peers het adres van een community op dit moment aanbieden. Dat is het
eerlijke sterretje bij "pure peer-to-peer in de browser", en het is de moeite waard om daar precies
over te zijn:

- een router bewaart alleen peer-adressen voor een inhoudsadres
- een router slaat de inhoud van de community niet op, bedient die niet en kent die zelfs niet
- clients bevragen meerdere routers tegelijk en voegen de resultaten samen
- iedereen kan er een draaien, en van router wisselen is een configuratiewijziging zonder datamigratie

Na discovery verlopen inhoudsoverdracht en pubsub-verkeer peer-to-peer. Een router die verdwijnt
kost je een opzoekpad, niet je gegevens. Een IPFS-gateway zit daarentegen wel in het pad van de
inhoud zelf.

## Waar dit vandaag draait

- [5chan](/apps/5chan/) draait standaard pure browser-P2P in de webapp op
  [5chan.app](https://5chan.app).

## Gatewayfallback

Toegang via een gateway bestaat nog steeds als compatibiliteitspad voor browsers of netwerken die
niet rechtstreeks kunnen meedoen. Zie [Gatewayfallback](/peer-to-peer-protocol/#gateway-fallback).
De doelarchitectuur is browser-P2P eerst, met gateways als optionele fallback in plaats van als
standaardknelpunt.
