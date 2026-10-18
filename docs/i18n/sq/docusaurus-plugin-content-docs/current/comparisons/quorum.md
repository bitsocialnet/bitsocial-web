---
title: Bitsocial dhe Quorum
description: Si krahasohet Quorum, aplikacioni i Quilibrium për mesazhe në grup me enkriptim skaj më skaj dhe me Space-e në stilin e Discord, me komunitetet publike peer-to-peer të Bitsocial.
---

# Bitsocial dhe Quorum

[Quorum](https://www.quorummessenger.com/) është një aplikacion për mesazhe në grup, i ndërtuar nga
Quilibrium Inc. mbi rrjetin e saj [Quilibrium](https://quilibrium.com/). Ai është i organizuar si
Discord, me Space-e, kanale, role dhe mesazhe direkte, dhe mesazhet e tij janë të enkriptuara skaj
më skaj. Ai përmendet krahas Bitsocial sepse të dy e përshkruajnë veten si peer-to-peer dhe
rezistentë ndaj censurës, me grupe që vendosin vetë rregullat e tyre. Megjithatë, synojnë gjëra të
ndryshme: Quorum bisedat private në grup, Bitsocial komunitetet publike që mund t'i lexojë kushdo.

Quilibrium e përshkruan veten si një alternativë e decentralizuar ndaj platformave cloud: një rrjet
nyjesh që i mbajnë të dhënat në një hipergraf të enkriptuar dhe bien dakord për gjendjen e tij
përmes një konsensusi që e quan Proof of Meaningful Work. Nyjet fitojnë QUIL, tokenin e rrjetit, me
të cilin paguhen tarifat e përdorimit. Quorum nisi në vitin 2018 si Howler, një ide për një
alternativë private ndaj Discord, dhe u bë aplikacioni i parë që doli live në Quilibrium, sipas
[historisë së Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc., e
themeluar nga Cassie Heart, zhvillon protokollin dhe e ofron Quorum si një nga shërbimet e saj të
menaxhuara ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Si funksionon Quorum

Detajet më poshtë vijnë nga kodi burimor i klientëve të Quorum,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) për aplikacionet web dhe
desktop dhe [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), siç ishte në
tetor 2026.

- **Identitetet.** Identiteti kryesor i një përdoruesi është një set çelësash Ed448, dhe çdo pajisje
  merr çelësat e vet X448 dhe Ed448. Në shfletues, çelësat mbrohen nga një çelës kalimi (passkey).
  Adresat janë hash-e që fillojnë me `Qm`, dhe përdoruesit mund të shfaqin një emër përdoruesi nga
  shërbimi i emrave i Quilibrium.
- **Enkriptimi.** Mesazhet direkte përdorin Double Ratchet midis pajisjeve. Një Space ndan një
  sesion të vetëm Triple Ratchet midis anëtarëve të tij, të cilët i nënshkruajnë mesazhet e tyre me
  çelësa specifikë për atë Space. Çdo Space është i enkriptuar, dhe Quorum thotë se ndërmjetësimi i
  tij i mesazheve e pengon shërbimin që i përcjell mesazhet të lidhë dërguesit me marrësit.
- **Bashkimi.** Në Space-e hyhet me lidhje ftese. Një lidhje njëpërdorimshe i mban në URL çelësat
  për t'u bashkuar; një lidhje publike i merr ato nga shërbimi Quorum, dhe Space-et publike mund të
  listohen në një direktori ku mund të kërkohet.
- **Transporti.** Klientët web, desktop dhe celular lidhen të gjithë përmes HTTPS dhe një WebSocket
  me një shërbim të vetëm,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Ai i përcjell mesazhet e enkriptuara në kutinë hyrëse të secilit anëtar dhe ruan regjistrimet e
  përdoruesve, manifestin e enkriptuar të çdo Space-i (kanalet, rolet, emoji-t), materialet e
  ftesave, direktorinë publike dhe sinkronizimin opsional të enkriptuar të cilësimeve. Softueri i
  nyjes së Quilibrium ka një shërbim kutie hyrëse dhe hub-i me të njëjtën formë, por as klientët, as
  dokumentacioni i Quilibrium nuk thonë se si lidhet ky shërbim me rrjetin.
- **Historiku.** Klienti i çdo anëtari mban kopjen e vet të Space-it në ruajtjen lokale. Klienti web
  dhe desktop e plotëson historikun duke i kërkuar një anëtari online të sinkronizojë; klienti
  celular riluan një regjistër që shërbimi e mban për çdo Space, kështu që mund ta arrijë gjendjen e
  fundit edhe kur asnjë anëtar tjetër nuk është online.
- **Moderimi.** Rolet japin të drejtën për fshirje, fiksim, heshtje dhe përmendje `@everyone`.
  Klienti i çdo anëtari kontrollon nënshkrimin e çdo veprimi moderimi dhe e zbaton atë vetëm nëse
  nënshkruesi ka rolin e duhur. Pronari mund të nxjerrë jashtë një anëtar, gjë që i rrotullon
  çelësat e Space-it, kështu që anëtari i nxjerrë jashtë nuk mund të lexojë mesazhet e reja. Një
  Space mund të kërkojë mesazhe të nënshkruara ose t'i lejojë anëtarët të postojnë mesazhe të
  panënshkruara, të mohueshme.
- **Kodi.** Klienti web dhe desktop licencohet sipas AGPL-3.0, ndërsa klienti celular sipas GPL-3.0.
  Klienti celular ka gjithashtu një portofol kriptomonedhash, integrim me Farcaster dhe Apex, një
  abonim me pagesë që përshkruhet më poshtë.

## Ku ndryshojnë

### Grupet private dhe komunitetet publike

Një Space i Quorum është një grup anëtarësh: vetëm ata që mbajnë çelësat e tij mund ta lexojnë, dhe
bashkimi kërkon një lidhje ftese. Një lidhje publike lejon këdo të hyjë, por vetëm pasi të jetë
bashkuar. Një komunitet Bitsocial nuk ka anëtarësi. Kushdo mund ta lexojë, nga çdo aplikacion, pa u
bashkuar, dhe kushdo mund të provojë të postojë, me kusht që të kalojë sfidën e komunitetit.

### Çfarë e mban një grup online

Një Space i Quorum nuk ka nyje strehuese. Anëtarët dërgojnë mesazhe përmes shërbimit Quorum, klienti
i çdo anëtari mban një kopje, dhe pronari nuk ka nevojë të jetë online që të tjerët të bisedojnë.
Një komunitet Bitsocial ndodhet në nyjen e pronarit të tij, e cila pranon ose refuzon çdo postim dhe
publikon gjendjen më të fundit të komunitetit. Komuniteti mbetet i lexueshëm për sa kohë që
homologët e shpërndajnë, por nuk mund të pranojë postime të reja ndërsa nyja e tij është jashtë
linje. Shihni [Protokolli Peer-to-Peer](/peer-to-peer-protocol/).

### Kush i zbaton rregullat

Në Quorum, zbatimi ndodh në skaj. Klienti i çdo anëtari vendos nëse do të zbatojë një fshirje, një
fiksim ose një heshtje, bazuar në rolin e nënshkruesit, dhe nxjerrja jashtë funksionon duke i kaluar
të gjithë të tjerët në çelësa të rinj. Në Bitsocial, zbatimi ndodh në nyjen e komunitetit: një
postim që nuk e kalon sfidën ose rregullat e komunitetit nuk bëhet kurrë pjesë e komunitetit. Shihni
[Moderimi lokal, jo ndalimet globale](/local-moderation/).

### Kontrolli i spamit

Quorum e mban spamin jashtë kryesisht përmes ftesave. Një lidhje njëpërdorimshe pranon një person,
një lidhje publike pranon këdo që e ka, dhe pronari mund të nxjerrë jashtë anëtarë dhe të ndërrojë
çelësat më pas; klienti gjithashtu e kufizon shpejtësinë e dërgimeve të veta. Identitetet e
Bitsocial janë çifte çelësash falas, prandaj çdo komunitet zgjedh një sfidë që e ekzekuton përpara
se të pranojë një postim, si një captcha, një pagesë, një balancë tokenësh ose një listë të
lejuarish. Shihni [Sfidat e personalizuara kundër spamit](/custom-challenges/).

### Klienti dhe rrjeti

Një aplikacion Quorum është klient i shërbimit Quorum, të cilin e drejton Quilibrium Inc. Vetë
aplikacionet nuk bashkohen në një rrjet peer-to-peer, kështu që arritja te një Space varet nga ajo
pikë fundore e vetme. Pas saj, Quilibrium është një rrjet më vete: në tetor 2026,
[eksploruesi](https://dashboard.quilibrium.com/) i tij tregonte 114 homologë të arritshëm dhe 181
provues (provers) të shpërndarë në 99 shard-e.

Një aplikacion web i Bitsocial mund të ekzekutojë një nyje libp2p në skedë, të marrë përmbajtjen e
komuniteteve nga homologët dhe të publikojë përmes gossipsub. Zbulimi i homologëve kalon përmes
ruterëve HTTP që kthejnë vetëm adresat e ofruesve; kushdo mund të mbajë një ruter të tillë, dhe
klientët mund të ndërrojnë ruter duke ndryshuar konfigurimin e tyre. Shihni
[Peer-to-Peer në shfletues](/browser-p2p/).

### Ekonomia

Quilibrium ka një token në thelb. QUIL minohet nga nyjet dhe paguan tarifat e rrjetit, dhe një
version i mbështjellë (wrapped), wQUIL, qarkullon në Ethereum. Vetë Quorum është falas dhe nuk
kërkon pagesë ose numër telefoni. Abonimi i tij opsional Apex kushton
[$5 në muaj](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
paguhet në wQUIL, SNAP ose USDC në Ethereum dhe ndahet midis Quilibrium Inc. dhe katër Space-eve që
zgjedh abonenti. Bitsocial nuk ka shtresë pagesash në protokoll; një komunitet mund të kërkojë një
pagesë ose një token përmes sfidës së tij.

### Mesazhet private

Këtu Quorum është më i fortë. Mesazhet direkte dhe mesazhet në Space-e janë të enkriptuara skaj më
skaj me fshehtësi të përparme (forward secrecy), dhe përmbajtja e mesazheve arrin te shërbimi Quorum
vetëm si tekst i shifruar. Bitsocial përqendrohet te komunitetet publike dhe ende nuk ka mesazhe
direkte native. Një postim i Bitsocial enkriptohet për çelësin e nyjes së komunitetit ndërsa udhëton
përmes pubsub, por pasi pranohet, bëhet publik.

## Gjendja e projektit

Në tetor 2026, depoja e Quorum e quante aplikacionin web version beta, dhe faqja e internetit e
Quorum ende i listonte aplikacionet për Google Play dhe App Store si aplikacione që do të vijnë së
shpejti. Dy klientët gjithashtu ndryshojnë nga njëri-tjetri: aplikacioni celular ka veçoritë e
portofolit, Farcaster dhe Apex, ndërsa klienti web dhe desktop i shfaq faqet e veta Wallet dhe
Farcaster si faqe që do të vijnë së shpejti, dhe të dy e arrijnë historikun e Space-it në mënyra të
ndryshme.

Mainnet-i i Quilibrium arriti versionin 2.1 më 30 shtator 2025, kur rrjeti rifilloi pas një ndalese
([njoftimi](https://x.com/QuilibriumInc/status/1973082817236984270)). Në vitin 2026, nyja u rishkrua
në Rust, me nënshkrime post-kuantike për konsensusin dhe një protokoll komunikimi që nyjet më të
vjetra nuk e flasin. Disa pjesë të dokumentacionit përshkruajnë dizajnin dhe jo kodin që ekzekutohet
realisht: ato përshkruajnë
[rrugëzimin përmes mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/),
por në nyjen 2.1.0.25 shërbimi mixnet është një
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
që i pranon mesazhet pa i përzier.

## Krahasimi

| Pyetja                   | Quorum                                                                                   | Bitsocial                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Kategoria                | Aplikacion për mesazhe në grup me enkriptim skaj më skaj, në rrjetin Quilibrium          | Rrjet komunitetesh peer-to-peer                                                                       |
| Identiteti               | Set kryesor çelësash Ed448 plus çelësa për çdo pajisje, të mbrojtur nga një çelës kalimi | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                                |
| Kush mund të lexojë      | Anëtarët që mbajnë çelësat e një Space-i                                                 | Kushdo, nga çdo aplikacion                                                                            |
| Ku ruhen mesazhet        | Pajisja e çdo anëtari; klienti celular riluan edhe një regjistër që mban shërbimi Quorum | Nyja e pronarit të komunitetit dhe homologët që e lexojnë dhe e shpërndajnë                           |
| Me çfarë lidhen klientët | Shërbimi Quorum në `api.quorummessenger.com`                                             | Homologë përmes libp2p, edhe nga një skedë shfletuesi                                                 |
| Komunitetet              | Space-e me kanale, role dhe lidhje ftese                                                 | Objekte të klasit të parë, nyja e të cilave i pranon ose i refuzon postimet                           |
| Kontrolli i spamit       | Lidhje ftese, nxjerrje jashtë me ndërrim çelësash, kufizim shpejtësie në anën e klientit | Sfida e secilit komunitet përpara se një postim të pranohet                                           |
| Moderimi                 | Role që i zbaton klienti i çdo anëtari; pronari nxjerr jashtë anëtarët                   | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin             |
| Mesazhet private         | Mesazhe direkte të enkriptuara skaj më skaj                                              | Komunitete publike; ende pa mesazhe direkte native                                                    |
| Ekonomia                 | Tokeni i rrjetit QUIL; abonim opsional Apex prej $5 në muaj                              | Asgjë në protokoll; një sfidë mund të kërkojë një pagesë ose token                                    |
| Kompromisi kryesor       | Grupe private, të enkriptuara, por çdo klient varet nga një shërbim i vetëm              | Identitete falas dhe qasje nga shfletuesi, por pa mesazhe private dhe ruhet vetëm gjendja më e fundit |
