---
title: Browser-Peer-to-Peer
description: Wie eine Bitsocial-Web-App einen echten libp2p-Knoten im Browser-Tab betreibt, welche Transporte sie verwendet und welcher Upstream-Fix von 2026 das Veröffentlichen aus einem Tab möglich gemacht hat.
---

# Browser-Peer-to-Peer

Eine Bitsocial-Web-App muss nicht der Client eines fremden Servers sein. Sie kann einen
[Helia](https://helia.io/)-Knoten direkt im Browser-Tab ausführen, demselben Peer-to-Peer-Netzwerk
beitreten wie Desktop- und CLI-Knoten, Community-Inhalte von Peers abrufen und über Pubsub
veröffentlichen.

Diese Seite erklärt, was das konkret bedeutet, welche Transporte dabei zum Einsatz kommen, was
weiterhin nicht möglich ist und warum das Veröffentlichen aus einem Tab erst 2026 funktioniert hat.

Zum übergreifenden Netzwerkentwurf siehe [Peer-to-Peer-Protokoll](/peer-to-peer-protocol/).

## Was im Tab läuft

Wenn Browser-P2P aktiv ist, hält die Seite einen echten libp2p-Knoten:

- Sie wählt andere Peers über sichere WebSockets an
- Sie ruft Community-Inhalte von diesen Peers ab und prüft sie, statt sie von einem IPFS-Gateway zu beziehen
- Sie nimmt an Gossipsub teil, sodass zum Veröffentlichen eines Beitrags kein gehosteter Pubsub-Anbieter nötig ist
- Sie nutzt denselben Protokoll-Client-Stack (`pkc-js`) wie jede andere Bitsocial-App

Die praktische Folge: Zwischen einem Leser im Web und einer Community sitzt kein Gateway-Betreiber
mehr. Es gibt keinen einzelnen HTTPS-Endpunkt, den man unter Druck setzen könnte, damit er eine
Community für sämtliche Browser-Nutzer auf einmal fallen lässt.

## Wie sich Browser-Knoten verbinden

`pkc-js` wählt Peers über **sichere WebSockets** an. WebRTC- und WebTransport-Verbindungen werden
standardmäßig durch einen Connection Gater abgelehnt, weil sie im Browser lange und häufig
scheiternde Wege zum Verbindungsaufbau mitbringen – STUN/ICE-Aushandlung, Certhash-Rotation –, die
den Seitenaufbau verlangsamen, während WebSockets einen direkten und zuverlässigen Transport liefern.
Wer gezielt WebRTC oder WebTransport nutzen möchte, kann den Gater über
`libp2pJsClientsOptions[].libp2pOptions.connectionGater` überschreiben.

Die praktische Folge ist, dass ein Browser-Peer sich mit Knoten verbindet, die einen WSS-Endpunkt
bereitstellen; diese Knoten brauchen also eine Domain und ein CA-signiertes Zertifikat. Peers hinter
gewöhnlichen Privatanschlüssen ohne beides werden indirekt erreicht, statt aus dem Tab heraus direkt
angewählt zu werden.

## Warum das Veröffentlichen aus dem Browser erst 2026 funktioniert hat

Browser-Peer-to-Peer ist keine neue Idee. Neu ist seit 2026, dass die _Beiträge_ eines
Browser-Knotens auch tatsächlich im restlichen Netzwerk ankommen.

Die libp2p-Pubsub-Spezifikation verlangt, dass die `seqno` einer Nachricht eine linear steigende
64-Bit-Ganzzahl in Big-Endian-Darstellung ist. `js-libp2p-gossipsub` erzeugte stattdessen 8
Zufallsbytes, während go-libp2p-pubsub und rust-libp2p beide einen Zähler verwendeten. Kubo 0.40+
aktiviert `BasicSeqnoValidator` standardmäßig, und der verwirft jede Nachricht, deren seqno nicht
größer ist als die höchste bereits von diesem Peer gesehene.

Die Folge: Die meisten von einem JavaScript-Knoten veröffentlichten Nachrichten – auch die eines
Browser-Knotens – wurden von Kubo-Peers stillschweigend verworfen. Ein Reproduktionsfall maß, dass 2
bis 8 von 30 Nachrichten ankamen.

Diagnostiziert wurde das in
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545), behoben in
**`@libp2p/gossipsub` 15.0.21** im Mai 2026. Bis dahin konnte ein Browser-Knoten zwar Verbindungen
aufbauen und lesen, seine Beiträge verschwanden auf dem Weg zu Go-Peers aber meist spurlos. `pkc-js`
liefert `@libp2p/gossipsub` 16.0.4 aus und enthält diesen Fix damit bereits.

## Was ein Browser-Knoten weiterhin nicht kann

Ein Browser-Knoten ist ein echter Peer, aber kein Server. Er hat andere Grenzen als ein Desktop- oder
ein dauerhaft laufender Knoten:

- Er kann in der Regel keine beliebigen eingehenden Verbindungen aus dem öffentlichen Internet annehmen
- Er arbeitet nur, solange der Tab offen ist, und taugt deshalb nicht als langlebiger Host für die Daten einer Community
- Er kann keinem libp2p-DHT beitreten, weshalb die Erkennung über HTTP-Router läuft
- Er eignet sich schlecht zum Seeding in größerem Umfang

Vollständiges Community-Hosting übernimmt weiterhin am besten eine Desktop-App, `bitsocial-cli` oder
ein anderer dauerhaft laufender Knoten. Browser-P2P ändert, wer ohne Gateway _lesen und posten_ kann;
es macht Peers, die dauerhaft online bleiben, nicht überflüssig.

## HTTP-Router sind keine Gateways

Browser-Clients fragen weiterhin [HTTP-Router](/peer-to-peer-protocol/#public-key-based-addressing)
ab, um herauszufinden, welche Peers die Adresse einer Community gerade bereitstellen. Das ist das
ehrliche Sternchen hinter „reinem Peer-to-Peer im Browser“, und es lohnt sich, dabei genau zu sein:

- Ein Router speichert ausschließlich Peer-Adressen zu einer Inhaltsadresse
- Er speichert die Inhalte der Community nicht, liefert sie nicht aus und kennt sie nicht einmal
- Clients fragen mehrere Router parallel ab und führen die Ergebnisse zusammen
- Jeder kann einen betreiben, und ein Router-Wechsel ist eine Konfigurationsänderung ohne Datenmigration

Nach der Erkennung laufen Inhaltsübertragung und Pubsub-Verkehr peer-to-peer. Ein Router, der
verschwindet, kostet einen Suchpfad, nicht die Daten. Ein IPFS-Gateway liegt dagegen im Inhaltspfad
selbst.

## Wo das heute läuft

- [5chan](/apps/5chan/) läuft in der Web-App unter [5chan.app](https://5chan.app) standardmäßig als
  reines Browser-P2P.

## Gateway-Fallback

Der Gateway-gestützte Zugang existiert weiterhin als Kompatibilitätspfad für Browser oder Netzwerke,
die dem Netzwerk nicht direkt beitreten können. Siehe
[Gateway-Fallback](/peer-to-peer-protocol/#gateway-fallback). Die Zielarchitektur ist Browser-P2P
zuerst, mit Gateways als optionalem Fallback statt als standardmäßigem Nadelöhr.
