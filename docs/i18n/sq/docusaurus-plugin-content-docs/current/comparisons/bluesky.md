---
title: Bitsocial dhe Bluesky
description: Si krahasohen Bluesky dhe AT Protocol, me serverët personalë të të dhënave, relet dhe AppView-t, me komunitetet peer-to-peer të Bitsocial.
---

# Bitsocial dhe Bluesky

[Bluesky](https://bsky.app/) është një aplikacion mikrobloggimi i ndërtuar mbi
[AT Protocol](https://atproto.com/), të cilin e projektoi Bluesky Social PBC. Protokolli e ndan një
rrjet social në shërbime të veçanta: serverët personalë të të dhënave strehojnë llogaritë, relet i
bashkojnë ato në një rrjedhë të vetme, dhe AppView-t e indeksojnë atë rrjedhë për të ndërtuar
kronologjitë dhe fijet që shohin njerëzit. Dokumentacioni i tij i përshkruan të dhënat e llogarive
si të ruajtura në serverë strehues, "në kundërshtim me një model peer-to-peer"
([përmbledhje](https://atproto.com/guides/overview)).

## Si funksionon AT Protocol

- **Depo në serverë.** Çdo postim, pëlqim ose ndjekje është një regjistrim në depon e nënshkruar të
  autorit, e strehuar në një server personal të dhënash (PDS). Bluesky drejton serverët e
  parazgjedhur, dhe kushdo mund të strehojë serverin e vet.
- **Relet.** Relet abonohen te çdo PDS dhe i ritransmetojnë ndryshimet si një rrjedhë e vetme,
  firehose. Që nga një përditësim i protokollit në vitin 2025 ato nuk e arkivojnë më çdo depo, gjë
  që e bëri shumë më të lirë mbajtjen e tyre në punë
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView-t.** Një AppView indekson të gjithë firehose-in dhe shërben kronologji, fije të plota
  përgjigjesh, numërime dhe kërkim. Është pjesa e rrjetit që kërkon më shumë burime.
- **Identiteti.** Një llogari është një DID: zakonisht `did:plc`, i regjistruar në një direktori të
  vetme globale, ose `did:web`, i lidhur me një domen. Dokumenti DID liston emrin e përdoruesit
  (handle), çelësin e nënshkrimit dhe serverin aktual të llogarisë. Çelësin e nënshkrimit e mban
  PDS-ja; `did:plc` u lejon gjithashtu përdoruesve të mbajnë çelësa rrotullimi, që të mund të
  zhvendosen pa ndihmën e strehuesit të vjetër
  ([udhëzuesi i identitetit](https://atproto.com/guides/identity)).
- **Emrat e përdoruesve.** Emrat e përdoruesve janë emra DNS, si `alice.bsky.social` ose një domen
  që zotëron përdoruesi, të verifikuar kundrejt DID-it.
- **Moderimi.** Strehimi dhe shtrirja janë shtresa të veçanta. Kushdo mund të drejtojë një shërbim
  etiketimi (labeler) dhe përdoruesit mund të kombinojnë disa prej tyre
  ([udhëzuesi i moderimit](https://atproto.com/guides/moderation)), por aplikacioni Bluesky zbaton
  gjithmonë moderimin e vetë Bluesky. Autorët mund të kufizojnë se kush mund t'u përgjigjet
  postimeve të tyre dhe mund t'i fshehin përgjigjet.

## Ku ndryshojnë

### Serverë apo homologë

Të dhënat e Bluesky ndodhen në serverë: një PDS strehon çdo llogari, relet bartin firehose-in dhe
AppView-t shërbejnë atë që shfaqin klientët. Një shfletues është klient HTTP i këtyre shërbimeve,
kurrë homolog. Te Bitsocial, përmbajtjen e shërbejnë nyja e komunitetit dhe homologët që e lexojnë,
dhe një aplikacion web mund të ekzekutojë nyjen e vet peer-to-peer. Shihni
[Peer-to-Peer në shfletues](/browser-p2p/).

### Një pamje globale apo komunitete

AT Protocol është projektuar për një pamje të vetme globale: një AppView sheh çdo përgjigje, prandaj
fijet dhe kërkimi janë të plota. Bitsocial nuk ka indeks global; çdo komunitet publikon gjendjen e
vet, dhe aplikacionet ndërtojnë zbulimin mbi të. Shihni
[Zbulimi i përmbajtjes](/content-discovery/).

Bluesky sot nuk ka objekt komuniteti për postimet publike. Në qershor 2026 ai
[njoftoi komunitete native](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k) me postim që
kërkon miratim në disa nivele privatësie; deri në tetor 2026 ato ende nuk ishin lançuar. Te
Bitsocial, komunitetet janë objekti qendror, dhe nyja e një komuniteti i pranon ose i refuzon
postimet.

### Kontrolli i spamit

Bluesky e trajton spamin me kufizime shpejtësie në serverët e vet, kufizime për strehuesit e rinj te
releja, zbulim të automatizuar, rishikim njerëzor dhe etiketa, ndërsa autorët mund t'i kufizojnë
përgjigjet. Nuk ka portë në nivel komuniteti që të vendosë çfarë duhet të kalojë një postim përpara
se të pranohet. Te Bitsocial, çdo komunitet zgjedh sfidën e vet. Shihni
[Sfidat e personalizuara kundër spamit](/custom-challenges/).

### Kush i mban çelësat

Llogaritë në serverët e vetë Bluesky hyjnë me fjalëkalim, dhe ata serverë i mbajnë çelësat e tyre të
nënshkrimit në kujdestari ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)). Sipas një
inxhinieri të protokollit të Bluesky,
[shumica e llogarive nuk kanë çelësa rrotullimi të kontrolluar në mënyrë të pavarur](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Një identitet Bitsocial është një çift çelësash që e gjeneron dhe e mban aplikacioni i përdoruesit.

### Operimi i infrastrukturës

Një server personal është i lirë: [PDS-ja referencë](https://github.com/bluesky-social/pds)
rekomandon 1 GB RAM për deri në 20 përdorues. Një AppView i pavarur për të gjithë rrjetin është
projekt i madh; njëri i ndërtuar në vitin 2025
[kushtonte rreth 200 dollarë në muaj](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), kryesisht për 16
TB hapësirë ruajtjeje. Bitsocial nuk ka indeks global për t'u replikuar, dhe një nyje komuniteti
funksionon në pajisje të zakonshme konsumatori.

## Krahasimi

| Pyetja               | Bluesky (AT Protocol)                                                                        | Bitsocial                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Kategoria            | Serverë të federuar me një indeks global                                                     | Rrjet komunitetesh peer-to-peer                                                           |
| Identiteti           | DID, me çelësa nënshkrimi që zakonisht i mban serveri                                        | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                    |
| Ku ruhen postimet    | Depoja e autorit në një server personal të dhënash                                           | Nyja e pronarit të komunitetit dhe homologët që e lexojnë dhe e shpërndajnë               |
| Kush e mban në linjë | Strehuesit e PDS-ve, relet dhe AppView-t, si parazgjedhje të drejtuara nga Bluesky           | Nyja e pronarit të komunitetit plus seeder-a ndihmës                                      |
| Komunitetet          | Ende asnjë për postimet publike (të njoftuara në 2026)                                       | Objekte të klasit të parë, nyja e të cilave i pranon ose i refuzon postimet               |
| Kontrolli i spamit   | Kufizime shpejtësie në serverë, zbulim i automatizuar, etiketa, kontroll i përgjigjeve       | Sfida e secilit komunitet përpara se një postim të pranohet                               |
| Moderimi             | Shërbime etiketimi të kombinueshme; aplikacioni Bluesky zbaton gjithmonë moderimin e Bluesky | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin |
| Emrat                | Emra përdoruesish DNS të verifikuar kundrejt DID-it                                          | Emra `.bso` dhe `.eth` që zgjidhen në çelësa                                              |
| Shfletuesi           | Klient HTTP i një PDS-je dhe i një AppView-i                                                 | Nyje peer-to-peer brenda një skede të zakonshme shfletuesi                                |
| Kompromisi kryesor   | Fije dhe kërkim globalë të plotë, por grumbullimi kërkon serverë të rëndë                    | Pa indeks global të rëndë, por edhe pa pamje të plotë të të gjithë rrjetit                |
