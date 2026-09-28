---
title: Peer-to-Peer në shfletues
description: Si e ekzekuton një aplikacion ueb Bitsocial një nyje reale libp2p brenda skedës së shfletuesit, cilat transporte përdor dhe cili rregullim i vitit 2026 në rrjedhën e sipërme e bëri të mundur publikimin nga një skedë.
---

# Peer-to-Peer në shfletues

Një aplikacion ueb Bitsocial nuk është i detyruar të jetë klient i serverit të dikujt tjetër. Ai mund të
ekzekutojë një nyje [Helia](https://helia.io/) brenda skedës së shfletuesit, të bashkohet me të njëjtin rrjet
peer-to-peer ku ndodhen nyjet desktop dhe ato të CLI-së, të marrë përmbajtjen e komunitetit nga homologët dhe
të publikojë përmes pubsub.

Kjo faqe shpjegon çfarë do të thotë kjo në praktikë, cilat transporte përdoren, çfarë nuk arrin ende të bëjë dhe
pse publikimi nga një skedë filloi të funksionojë vetëm në 2026.

Për dizajnin më të gjerë të rrjetit, shihni [Protokolli Peer-to-Peer](/peer-to-peer-protocol/).

## Çfarë ekzekutohet brenda skedës

Kur P2P-ja në shfletues është aktive, faqja mban një nyje reale libp2p:

- ajo hap lidhje drejt homologëve të tjerë përmes WebSockets të sigurt
- ajo merr dhe verifikon përmbajtjen e komunitetit nga ata homologë, jo nga një portë IPFS
- ajo merr pjesë në gossipsub, prandaj publikimi i një postimi nuk ka nevojë për një ofrues pubsub të strehuar
- ajo përdor të njëjtën stivë klienti të protokollit (`pkc-js`) si çdo aplikacion tjetër Bitsocial

Pasoja praktike është se asnjë operator porte nuk qëndron mes një lexuesi në ueb dhe një komuniteti. Nuk
ekziston asnjë pikë e vetme HTTPS që mund të vihet nën presion për të hequr një komunitet për të gjithë
përdoruesit e shfletuesit njëherësh.

## Si lidhen nyjet e shfletuesit

`pkc-js` u lidhet homologëve përmes **WebSockets të sigurt**. Lidhjet WebRTC dhe WebTransport refuzohen si
parazgjedhje nga një filtër lidhjesh, sepse në shfletues ato shtojnë rrugë të gjata dhe shpesh të dështuara për
vendosjen e lidhjes — negocim STUN/ICE, rrotullim të certhash-it — që ngadalësojnë ngarkimin e faqes, ndërsa
WebSocket jep një transport të drejtpërdrejtë dhe të besueshëm. Thirrësit që duan posaçërisht WebRTC ose
WebTransport mund ta anashkalojnë filtrin përmes
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Pasoja praktike është se një homolog në shfletues lidhet me nyje që ekspozojnë një pikë WSS, çka do të thotë se
ato nyje kanë nevojë për një domen dhe për një certifikatë të nënshkruar nga një CA. Homologët që rrinë pas
lidhjesh konsumatore pa një të tillë arrihen tërthorazi, në vend që të kontaktohen drejtpërdrejt nga skeda.

## Pse publikimi nga shfletuesi filloi të funksionojë vetëm në 2026

Peer-to-peer në shfletues nuk është ide e re. Ajo që ndryshoi në 2026 është se _postimet_ e një nyjeje
shfletuesi tani arrijnë te pjesa tjetër e rrjetit.

Specifikimi pubsub i libp2p kërkon që `seqno` i një mesazhi të jetë një numër i plotë 64-bitësh big-endian që
rritet në mënyrë lineare. `js-libp2p-gossipsub` gjeneronte 8 bajt të rastësishëm në vend të kësaj, ndërsa
go-libp2p-pubsub dhe rust-libp2p përdornin të dy një numërues. Kubo 0.40+ e aktivizon `BasicSeqnoValidator` si
parazgjedhje, i cili refuzon çdo mesazh seqno-ja e të cilit nuk është më e madhe se më e larta e parë deri atëherë
nga ai homolog.

Efekti ishte që shumica e mesazheve të publikuara nga një nyje JavaScript — përfshirë një nyje shfletuesi —
hidheshin poshtë në heshtje nga homologët Kubo. Një riprodhues mati mbërritjen e 2 deri në 8 mesazheve nga 30.

Kjo u diagnostikua te
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) dhe u rregullua te
**`@libp2p/gossipsub` 15.0.21** në maj të 2026-ës. Derisa ai rregullim mbërriti, një nyje shfletuesi mund të
lidhej dhe të lexonte, por postimet e saj kryesisht zhdukeshin rrugës drejt homologëve Go. `pkc-js` shpërndan
`@libp2p/gossipsub` 16.0.4, pas atij rregullimi.

## Çfarë nuk mund të bëjë ende një nyje shfletuesi

Një nyje shfletuesi është homolog i vërtetë, jo server. Ajo ka kufij të ndryshëm nga një nyje desktop ose një
nyje gjithnjë e ndezur:

- zakonisht nuk mund të pranojë lidhje hyrëse arbitrare nga interneti publik
- funksionon vetëm sa kohë skeda është e hapur, prandaj nuk është strehë jetëgjatë për të dhënat e një komuniteti
- nuk mund të bashkohet me një DHT të libp2p, prandaj zbulimi kalon nëpër ruterë HTTP
- është zgjidhje e dobët për shpërndarjen e përmbajtjes në shkallë të gjerë

Strehimi i plotë i një komuniteti trajtohet ende më mirë nga një aplikacion desktop, nga `bitsocial-cli` ose nga
një nyje tjetër gjithnjë e ndezur. P2P-ja në shfletues ndryshon se kush mund të _lexojë dhe të postojë_ pa një
portë; ajo nuk e heq nevojën për homologë që rrinë online.

## Ruterët HTTP nuk janë porta

Klientët e shfletuesit vazhdojnë t'u drejtojnë pyetje [ruterëve HTTP](/peer-to-peer-protocol/#public-key-based-addressing)
për të mësuar cilët homologë e ofrojnë aktualisht adresën e një komuniteti. Ky është ylli i ndershëm pranë
shprehjes "peer-to-peer i pastër në shfletues", dhe ia vlen të jemi të saktë për të:

- një ruter ruan vetëm adresat e homologëve për një adresë përmbajtjeje
- ai nuk e ruan, nuk e shërben dhe as nuk e njeh përmbajtjen e komunitetit
- klientët u drejtohen paralelisht disa ruterëve dhe i bashkojnë rezultatet
- kushdo mund të drejtojë një të tillë, dhe ndërrimi i ruterëve është thjesht ndryshim konfigurimi, pa migrim të dhënash

Pas zbulimit, transferimi i përmbajtjes dhe trafiku i pubsub-it lëvizin peer-to-peer. Një ruter që zhduket ju
kushton një rrugë kërkimi, jo të dhënat tuaja. Një portë IPFS, përkundrazi, ndodhet brenda rrugës së përmbajtjes.

## Ku funksionon kjo sot

- [5chan](/apps/5chan/) funksionon si parazgjedhje me P2P të pastër në shfletues te aplikacioni ueb në
  [5chan.app](https://5chan.app).

## Rikthimi te porta

Qasja e mbështetur nga porta ekziston ende si rrugë përputhshmërie për shfletuesit ose rrjetet që nuk mund të
bashkohen drejtpërdrejt. Shihni [Rikthimi te porta](/peer-to-peer-protocol/#gateway-fallback). Arkitektura e
synuar është P2P në shfletues në radhë të parë, me portat si rikthim opsional dhe jo si pengesa e parazgjedhur.
