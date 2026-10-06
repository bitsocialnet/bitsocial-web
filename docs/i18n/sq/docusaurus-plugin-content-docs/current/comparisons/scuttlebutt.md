---
title: Bitsocial dhe Secure Scuttlebutt
description: Si krahasohen Secure Scuttlebutt (SSB) dhe aplikacioni i tij Manyverse me Bitsocial, nga feed-et append-only dhe replikimi sipas grafit të ndjekjeve te komunitetet, kontrolli i spamit dhe sinkronizimi jashtë linje.
---

# Bitsocial dhe Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) është një protokoll social peer-to-peer i
krijuar nga Dominic Tarr në vitin 2014. [Manyverse](https://www.manyver.se/) është aplikacioni i tij
më i njohur, për Android, iOS dhe desktop; [Patchwork](https://github.com/ssbc/patchwork) ishte
klienti kryesor për desktop përpara se të arkivohej. Nga sistemet që krahasohen në këtë
dokumentacion, SSB është më i afërti me Bitsocial në frymë: asnjë server në rrugën e të dhënave,
asnjë blockchain, asnjë renditje globale dhe çelësa Ed25519 për identitetin. Të dy bënë zgjedhje të
kundërta për atë që ruan secili homolog dhe për vendin ku ndalet spami.

## Si funksionon Scuttlebutt

- **Feed-et.** Çdo identitet është një çift çelësash Ed25519, i shkruar si `@<public key>.ed25519`.
  Gjithçka që publikon një përdorues shkon në feed-in e vet, një regjistër append-only (ku vetëm
  mund të shtohet), në të cilin çdo mesazh i nënshkruar mbart një numër sekuence dhe hash-in e
  mesazhit të mëparshëm. Pasi postohet, një mesazh nuk mund të ndryshohet, sipas
  [udhëzuesit të protokollit](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replikimi.** Homologët kopjojnë feed-e të tëra, jo postime të veçanta, dhe grafi i ndjekjeve
  vendos cilat feed-e mban një homolog. Patchwork, për shembull, shfaqte feed-e deri në dy hapa larg
  dhe replikonte feed-e deri në tre hapa larg. Me pemët e transmetimit epidemik (EBT), homologët
  krahasojnë numrin më të fundit të sekuencës që kanë për çdo feed dhe dërgojnë vetëm atë që mungon.
- **Lidhjet.** Homologët autentikohen me një secret handshake dhe e enkriptojnë trafikun me box
  stream. Handshake-u është i lidhur me një identifikues rrjeti, kështu që homologët në një rrjet
  SSB të veçantë me identifikues tjetër nuk mund të lidhen me rrjetin kryesor.
- **Gjetja e homologëve.** Homologët e shpallin veten në rrjetin lokal përmes transmetimit UDP dhe
  sinkronizohen përmes LAN; Manyverse sinkronizohet edhe përmes Bluetooth. Përmes internetit,
  përdoruesit mbështeten te nyjet **pub**, homologë gjithmonë online që ju ndjekin mbrapsht pasi
  përdorni një kod ftese dhe më pas e ruajnë dhe e shërbejnë feed-in tuaj, dhe te nyjet **room**, të
  cilat nuk ruajnë feed-e, por krijojnë tunele për lidhjet midis anëtarëve të tyre.
- **Blob-et dhe mesazhet private.** Imazhet dhe skedarët e tjerë janë blob-e të adresuara sipas
  përmbajtjes që merren nga homologët, me një kufi të paracaktuar madhësie prej 5 MB në zbatimet
  aktuale. Mesazhet private enkriptohen për deri në shtatë marrës dhe publikohen si tekst i shifruar
  në feed-in e autorit.

## Ku ndryshojnë

### Çfarë ruan një homolog

Një homolog SSB mban një kopje të plotë të çdo feed-i brenda shtrirjes së vet të replikimit, që nga
mesazhi i parë i çdo feed-i, dhe ua shërben këto feed-e të tjerëve. Kjo i lejon SSB të funksionojë
jashtë linje, por hapësira e ruajtjes rritet me çdo mesazh brenda shtrirjes, dhe një instalim i ri
duhet t'i shkarkojë këto feed-e përpara se të shfaqë diçka të vlefshme. Një klient Bitsocial e merr
gjendjen më të fundit të komuniteteve që hap nga nyja e komunitetit dhe nga homologët që e
shpërndajnë, dhe rrjeti mban vetëm këtë gjendje më të fundit. Shihni
[Protokolli Peer-to-Peer](/peer-to-peer-protocol/).

### Fshirja dhe pajisjet

Meqë një feed është një zinxhir hash-esh, SSB nuk ka fshirje në mbarë rrjetin: një homolog mund të
heqë mesazhe nga baza e vet e të dhënave, por nuk mund t'i tërheqë ato nga kopjet e homologëve të
tjerë. Postimi me të njëjtin çelës nga dy pajisje, ose nga një kopje rezervë e rikthyer, e degëzon
feed-in (një fork), prandaj zgjidhja e zakonshme është një identitet për pajisje. PZP, protokolli
pasardhës nga ekipi i Manyverse, përmend fshirjen, disa pajisje për llogari dhe feed-e që e
tolerojnë degëzimin ndër ndryshimet kryesore nga SSB
([postimi i lançimit](https://www.manyver.se/blog/2024-07-03/)). Një nyje komuniteti Bitsocial
publikon një version të ri të gjendjes së komunitetit me çdo përditësim, kështu që përmbajtja që
heqin moderatorët e tij del nga gjendja më e fundit.

### Kë mund të dëgjoni

Shtrirja e replikimit e SSB shërben njëkohësisht si filtër spami. Feed-i i një të panjohuri ju arrin
vetëm nëse dikush brenda hapave tuaj e ndjek, dhe bllokimi i një feed-i bën që nyja juaj të ndalojë
ta replikojë. Spami mbetet jashtë, por po ashtu edhe të ardhurit e rinj, derisa dikush t'i ndjekë.
Bitsocial lejon këdo të publikojë në një komunitet, dhe nyja e komunitetit vendos përmes sfidës së
vet nëse një postim pranohet. Shihni [Sfidat e personalizuara kundër spamit](/custom-challenges/).

### Komunitetet

SSB nuk ka objekt komuniteti. Kanalet dhe hashtag-ët janë etiketa në postime të veçanta, përgjigjet
në një fill ndodhen në feed-et e atyre që i shkruan, dhe sa shihni nga një fill varet nga cilat prej
këtyre feed-eve i ka nyja juaj. Nyjet room mund të kenë moderatorë dhe lista anëtarësh, por këta
kontrollojnë kush mund të lidhet përmes asaj nyjeje, jo çfarë publikohet. Një komunitet Bitsocial
është një objekt i klasit të parë me çiftin e vet të çelësave, rregulla, moderatorë dhe sfidë.

### Infrastruktura

Të dy i mbajnë serverët jashtë rrugës së të dhënave, dhe të dy mbështeten te ndihmës. Nyjet pub janë
gjëja më e afërt që ka SSB me një shërbim të strehuar: ruajnë dhe shërbejnë feed-et e të gjithë
atyre që ndjekin. Nyjet room janë më afër ruterëve HTTP të Bitsocial, sepse asnjëra palë nuk ruan
përmbajtje, por një nyje room e ndërmjetëson lidhjen midis anëtarëve të saj, ndërsa një ruter vetëm
kthen adresat e ofruesve dhe nuk luan asnjë rol në transferim. Ashtu si një homolog SSB, një nyje
komuniteti Bitsocial funksionon në pajisje të zakonshme konsumatori, dhe duhet të jetë online për të
pranuar postime të reja.

### Jashtë linje dhe rrjetet lokale

Këtu SSB është më i fortë. Dy homologë SSB në të njëjtin rrjet Wi-Fi, ose përmes Bluetooth në
Manyverse, mund të sinkronizohen pa lidhje interneti, dhe gjithçka që është replikuar tashmë mbetet
e lexueshme jashtë linje. Qëllimi kryesor i deklaruar i Manyverse është ta bëjë rrjetëzimin social
të pavarur nga lidhja me internetin. Bitsocial ka nevojë për lidhje interneti për të gjetur homologë
dhe për të publikuar.

### Shfletuesi

Aplikacionet kryesore SSB vijnë me një nyje të plotë SSB: Manyverse përfshin një të tillë në
aplikacionet e veta për celular dhe desktop.
[ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) ekzekutonte SSB brenda një shfletuesi
me replikim të pjesshëm dhe lidhje përmes nyjeve room, dhe u arkivua në vitin 2022. Aplikacionet
Bitsocial ekzekutojnë një nyje peer-to-peer në një skedë të zakonshme shfletuesi. Shihni
[Peer-to-Peer në shfletues](/browser-p2p/).

### Mesazhet private

SSB ka të integruara mesazhe private të enkriptuara. Bitsocial përqendrohet te komunitetet publike
dhe ende nuk ka mesazhe direkte native.

## Gjendja e projektit

André Staltz, i cili ndërtoi Manyverse, u largua në prill 2024 nga SSB, Manyverse dhe pasardhësi i
tyre i planifikuar ([përditësimi i tij i fundit](https://www.manyver.se/blog/2024-04-05/)). Në
korrik 2024, Jacob Karlsson e lançoi atë pasardhës si [PZP](https://pzp.wiki/) dhe shkroi se nuk do
të punonte më për Manyverse dhe se nuk dinte për askënd tjetër që planifikonte ta bënte. Në tetor
2026, depot e PZP në [Codeberg](https://codeberg.org/pzp) nuk kishin asnjë përditësim pas
dhjetorit 2024. Depoja e Patchwork është arkivuar me v3.18.1 si versionin e fundit, dhe ekipi pas
Planetary, një aplikacioni SSB për iOS, kaloi te Nostr me aplikacionin e vet Nos në vitin 2023.
Rrjeti SSB ende funksionon mbi homologët dhe nyjet pub që njerëzit i mbajnë online, por aplikacionet
e tij kryesore nuk zhvillohen më.

## Krahasimi

| Pyetja                 | Secure Scuttlebutt                                                                                               | Bitsocial                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Kategoria              | Protokoll gossip peer-to-peer                                                                                    | Rrjet komunitetesh peer-to-peer                                                                           |
| Identiteti             | Një çift çelësash Ed25519 për pajisje                                                                            | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                                    |
| Ku ruhen postimet      | Feed-i append-only i autorit, i kopjuar nga çdo homolog që e replikon                                            | Nyja e pronarit të komunitetit dhe homologët që e lexojnë dhe e shpërndajnë                               |
| Çfarë mban një homolog | Historiku i plotë i çdo feed-i brenda shtrirjes së ndjekjeve                                                     | Gjendja më e fundit e komuniteteve që lexon ose shpërndan                                                 |
| Komunitetet            | Pa objekt komuniteti; kanalet dhe hashtag-ët etiketojnë postimet                                                 | Objekte të klasit të parë, nyja e të cilave i pranon ose i refuzon postimet                               |
| Kontrolli i spamit     | Shtrirja e replikimit sipas grafit të ndjekjeve, plus bllokimet                                                  | Sfida e secilit komunitet përpara se një postim të pranohet                                               |
| Moderimi               | Ndjekjet dhe bllokimet e secilit përdorues                                                                       | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin                 |
| Serverët ndihmës       | Nyjet pub ruajnë dhe shërbejnë feed-e; nyjet room krijojnë tunele për lidhjet                                    | Ruterët HTTP kthejnë homologët ofrues dhe nuk ruajnë përmbajtje                                           |
| Jashtë linje           | Sinkronizim përmes LAN dhe Bluetooth pa internet                                                                 | Ka nevojë për lidhje interneti                                                                            |
| Shfletuesi             | Aplikacionet përfshijnë një nyje të plotë SSB                                                                    | Nyje peer-to-peer brenda një skede të zakonshme shfletuesi                                                |
| Rrjeti                 | Funksionon, por aplikacionet kryesore nuk zhvillohen më                                                          | Rrjet aktiv me aplikacione si [5chan](/apps/5chan/) dhe [Seedit](/apps/seedit/)                           |
| Kompromisi kryesor     | Funksionon jashtë linje dhe nuk kërkon strehim, por feed-et rriten pa fund dhe të panjohurit mbeten të padukshëm | Publikim i hapur dhe mbështetje për shfletuesin, por kërkon internet dhe mban vetëm gjendjen më të fundit |
