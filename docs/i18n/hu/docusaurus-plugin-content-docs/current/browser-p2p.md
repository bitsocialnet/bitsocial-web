---
title: Böngészős peer-to-peer
description: Hogyan futtat egy Bitsocial webalkalmazás valódi libp2p csomópontot a böngészőfülön, milyen transzportokat használ, és milyen 2026-os upstream javítás tette működőképessé a fülből való közzétételt.
---

# Böngészős peer-to-peer

Egy Bitsocial webalkalmazásnak nem kell valaki más kiszolgálójának klienseként működnie. Futtathat egy
[Helia](https://helia.io/) csomópontot magában a böngészőfülben, csatlakozhat ugyanahhoz a
peer-to-peer hálózathoz, mint az asztali és a CLI csomópontok, letöltheti a közösségi tartalmat a
peerektől, és közzétehet pubsubon keresztül.

Ez az oldal elmagyarázza, hogy ez a gyakorlatban mit jelent, milyen transzportokat használ, mire
továbbra sem képes, és miért csak 2026-ban kezdett működni a fülből való közzététel.

A tágabb hálózati felépítésről lásd a [Peer-to-Peer protokoll](/peer-to-peer-protocol/) oldalt.

## Mi fut a fülön

Amikor a böngészős P2P aktív, az oldal egy valódi libp2p csomópontot tart életben:

- biztonságos WebSocketeken keresztül épít ki kapcsolatot a többi peerrel
- a közösségi tartalmat ezektől a peerektől tölti le és ellenőrzi, nem egy IPFS átjárótól
- részt vesz a gossipsubban, így egy bejegyzés közzétételéhez nem kell üzemeltetett pubsub szolgáltató
- ugyanazt a protokoll-kliensréteget (`pkc-js`) használja, mint minden más Bitsocial alkalmazás

Ennek gyakorlati következménye, hogy egyetlen átjáró-üzemeltető sem áll a webes olvasó és a közösség
között. Nincs olyan egyetlen HTTPS végpont, amelyre nyomást lehetne gyakorolni, hogy egy közösséget
egyszerre minden böngészős felhasználó elől ejtsen el.

## Hogyan kapcsolódnak a böngészős csomópontok

A `pkc-js` **biztonságos WebSocketeken** keresztül kapcsolódik a peerekhez. A WebRTC és a
WebTransport irányú kapcsolatépítést egy connection gater alapértelmezés szerint letiltja, mert a
böngészőben ezek hosszú, gyakran sikertelen kapcsolatfelépítési útvonalakat jelentenek — STUN/ICE
egyeztetés, certhash-forgatás —, amelyek lassítják az oldalbetöltést, míg a WebSocket közvetlen és
megbízható transzportot ad. Ha egy hívónak kifejezetten WebRTC-re vagy WebTransportra van szüksége,
a gatert felülbírálhatja a `libp2pJsClientsOptions[].libp2pOptions.connectionGater` beállításon
keresztül.

Ennek gyakorlati következménye, hogy egy böngészős peer olyan csomópontokhoz kapcsolódik, amelyek WSS
végpontot tesznek közzé, vagyis ezeknek a csomópontoknak domainre és hitelesítésszolgáltató által
aláírt tanúsítványra van szükségük. Az ilyennel nem rendelkező, lakossági kapcsolat mögötti peereket
nem a fülről érik el közvetlenül, hanem közvetve.

## Miért csak 2026-ban kezdett működni a böngészőből való közzététel

A böngészős peer-to-peer nem új gondolat. 2026-ban az változott meg, hogy egy böngészős csomópont
_bejegyzései_ mostantól el is jutnak a hálózat többi részéhez.

A libp2p pubsub specifikáció megköveteli, hogy egy üzenet `seqno` mezője lineárisan növekvő, 64 bites
big-endian egész szám legyen. A `js-libp2p-gossipsub` ehelyett 8 véletlenszerű bájtot generált,
miközben a go-libp2p-pubsub és a rust-libp2p is számlálót használt. A Kubo 0.40+ alapértelmezés
szerint bekapcsolja a `BasicSeqnoValidator` ellenőrzést, amely minden olyan üzenetet elutasít, amelynek
seqno értéke nem nagyobb az adott peertől már látott legmagasabbnál.

Ennek az volt a hatása, hogy egy JavaScript csomópont — köztük egy böngészős csomópont — által
közzétett üzenetek nagy részét a Kubo peerek csendben eldobták. Egy reprodukciós mérés szerint 30
üzenetből 2–8 érkezett meg.

Ezt a [js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545)
hibajegyben tárták fel, és a **`@libp2p/gossipsub` 15.0.21** verziójában javították 2026 májusában.
Amíg ez nem került be, egy böngészős csomópont tudott kapcsolódni és olvasni, de a bejegyzései
többnyire elvesztek a Go peerek felé vezető úton. A `pkc-js` a `@libp2p/gossipsub` 16.0.4 verzióját
szállítja, amely már túl van ezen a javításon.

## Mire nem képes továbbra sem egy böngészős csomópont

A böngészős csomópont valódi peer, nem kiszolgáló. Más korlátai vannak, mint egy asztali vagy
folyamatosan online csomópontnak:

- általában nem tud tetszőleges bejövő kapcsolatokat fogadni a nyilvános internetről
- csak addig működik, amíg a fül nyitva van, így nem hosszú életű tárhely egy közösség adatai számára
- nem tud csatlakozni a libp2p DHT-hez, ezért a felfedezés HTTP routereken keresztül zajlik
- nagy léptékű seedelésre rosszul alkalmas

A teljes közösségi hosztolást továbbra is egy asztali alkalmazás, a `bitsocial-cli` vagy más,
folyamatosan online csomópont kezeli a legjobban. A böngészős P2P azon változtat, hogy ki tud
_olvasni és posztolni_ átjáró nélkül; nem szünteti meg az online maradó peerek szükségességét.

## A HTTP routerek nem átjárók

A böngészős kliensek továbbra is lekérdezik a [HTTP routereket](/peer-to-peer-protocol/#public-key-based-addressing),
hogy megtudják, jelenleg mely peerek szolgáltatják egy közösség címét. Ez az őszinte lábjegyzet a
„tiszta peer-to-peer a böngészőben” állítás mellett, és érdemes pontosan fogalmazni róla:

- egy router kizárólag peer-címeket tárol egy tartalomcímhez
- nem tárolja, nem szolgálja ki, sőt nem is ismeri a közösség tartalmát
- a kliensek több routert kérdeznek le párhuzamosan, és összefésülik az eredményeket
- bárki üzemeltethet ilyet, és a routerek cseréje konfigurációs módosítás, adatmigráció nélkül

A felfedezés után a tartalomátvitel és a pubsub forgalom peer-to-peer zajlik. Ha egy router eltűnik,
egy keresési útvonalat veszít, nem az adatait. Egy IPFS átjáró ezzel szemben a tartalom útvonalán
helyezkedik el.

## Hol fut ez ma

- Az [5chan](/apps/5chan/) alapértelmezés szerint tiszta böngészős P2P-vel fut az
  [5chan.app](https://5chan.app) webalkalmazásban.

## Átjáró-tartalék

Az átjárón keresztüli hozzáférés továbbra is létezik kompatibilitási útvonalként azoknak a
böngészőknek vagy hálózatoknak, amelyek nem tudnak közvetlenül csatlakozni. Lásd az
[Átjáró-tartalék](/peer-to-peer-protocol/#gateway-fallback) szakaszt. A célarchitektúrában elsődleges
a böngészős P2P, az átjárók pedig opcionális tartalékként szolgálnak, nem alapértelmezett szűk
keresztmetszetként.
