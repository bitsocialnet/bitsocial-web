---
title: Bitsocial dhe Mirage
description: Si krahasohet Mirage, një forum në stilin e Reddit mbi blockchain-in e vet Cosmos SDK, me Bitsocial dhe aplikacionin e tij në stilin e Reddit, Seedit.
---

# Bitsocial dhe Mirage

[Mirage](https://mirage.foundation/) është një rrjet diskutimesh në stilin e Reddit, me komunitete,
postime në fije dhe vota. Në vend të një baze të dhënash të një kompanie, ai funksionon mbi
blockchain-in e vet, një zinxhir Cosmos SDK me konsensus CometBFT. Produkti më i afërt i Bitsocial
është [Seedit](/apps/seedit/), një aplikacion në stilin e Reddit në rrjetin Bitsocial, prandaj
krahasimi ka të bëjë kryesisht me mënyrën si secili i strehon, i zotëron dhe i moderon komunitetet.

## Si funksionon Mirage

- **Nyjet.** Një nyje Mirage është një kontejner i vetëm Docker që përmban një validator, një bazë
  të dhënash PostgreSQL, një indeksues, një HTTP API dhe frontend-in web. Çdo nyje është gjithashtu
  validator. Sipas
  [udhëzuesit të vendosjes](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md),
  për ta mbajtur në punë nevojiten një server Ubuntu në amd64 dhe 10 000 000 token-ë MIRAGE në
  llogarinë e operatorit.
- **Postimi.** Shfletuesi e nënshkruan çdo veprim me çelësin secp256k1 të përdoruesit, dhe
  përdoruesit falas llogaritin gjithashtu një provë pune të vogël. Nyja e mbështjell veprimin në një
  transaksion zinxhiri dhe paguan tarifën.
- **Leximi.** Indeksuesi i çdo nyjeje i kopjon të dhënat e zinxhirit në bazën e vet të të dhënave
  dhe shërben rrjedha përmes një HTTP API. Nyjet mbajnë blloqet e rreth një jave, kështu që
  historiku afatgjatë i postimeve ndodhet në bazën e të dhënave të secilës nyje, dhe një nyje e re
  nis pa historikun që i paraprin pikës së saj të sinkronizimit.
- **Llogaritë.** Një llogari është një çelës i nxjerrë nga një frazë seed me 12 fjalë, dhe e njëjta
  frazë seed funksionon në çdo nyje. Emrat e përdoruesve regjistrohen në zinxhir dhe janë unikë në
  të gjithë rrjetin.
- **Komunitetet.** Çdo emër i vlefshëm është tashmë një komunitet, dhe askush nuk e zotëron. Ekipe
  kuratorësh me pagesë, secili me deri në dhjetë përdorues, mbajnë një pamje të moderuar të një
  komuniteti; lexuesit zgjedhin pamjen e një ekipi, pamjen e parazgjedhur të nyjes ose një pamje të
  pacensuruar. Shihni [FAQ-në e Mirage](https://mirage.talk/faq).
- **Token-i.** Token-i MIRAGE paguan abonimet, shpërblen autorët dhe nyjet, dhe u jep validatorëve
  peshë në qeverisje. Abonentët e anashkalojnë provën e punës dhe marrin kufij më të lartë.

## Ku ndryshojnë

### Kush e zotëron një komunitet

Në Seedit, krijuesi i një komuniteti mban çiftin e tij të çelësave, e ekzekuton ose e delegon nyjen
e tij dhe e moderon atë. Në Mirage, askush nuk e zotëron një komunitet: ekipe kuratorësh në
konkurrencë ofrojnë pamje të moderuara të të njëjtit emër, dhe pamja e parazgjedhur është ajo e
ekipit që zgjidhet nga numri më i madh i abonentëve që paguajnë.

### Kontrolli i spamit

Mirage zbaton një rregull të vetëm për të gjithë rrjetin: përdoruesit falas paguajnë me provë pune,
vështirësia e së cilës përshtatet me vëllimin e veprimeve që vijnë, dhe abonentët e anashkalojnë
atë. Te Bitsocial, çdo komunitet zgjedh sfidën e vet, nga captcha te listat e lejuarish dhe pagesat.
Shihni [Sfidat e personalizuara kundër spamit](/custom-challenges/).

### Infrastruktura

Mirage ka nevojë për një blockchain. Validatorët arrijnë konsensus për çdo veprim, dhe çdo nyje
ekzekuton një grumbull të plotë serveri dhe duhet të mbajë një staking të madh token-ësh. Bitsocial
nuk ka zinxhir: një nyje komuniteti funksionon në pajisje të zakonshme konsumatori nga aplikacioni
desktop ose nga `bitsocial-cli`, dhe lexuesit mund të ndihmojnë në shpërndarjen e përmbajtjes.

### Kontrolli mbi të gjithë rrjetin

Mirage ka qeverisje on-chain të peshuar sipas staking-ut të validatorëve. Ajo mund të ndryshojë
vështirësinë, çmimet dhe emetimin e token-ëve, të krijojë ose të djegë token-ë, dhe të emërojë
administratorë fshirjet e të cilëve indeksuesi referencë i zbaton për çdo postim. Kodi i zinxhirit i
lejon gjithashtu qeverisjes të
[fshijë llogari](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
dhe të
[dërgojë token-ë nga çdo adresë](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
Në tetor 2026, blloqet e zinxhirit i prodhonin katër validatorë, dhe që të katër menaxhoheshin sipas
udhëzimeve operative të vetë projektit.

Bitsocial nuk ka administrator në nivel protokolli. Pronarët e komuniteteve moderojnë komunitetet e
tyre, dhe aplikacionet zgjedhin çfarë shfaqin. Shihni
[Moderimi lokal, jo ndalimet globale](/local-moderation/).

### Shfletuesi

Klienti web i Mirage është klient HTTP i një nyjeje: shfletuesi i nënshkruan veprimet, por nuk hyn
në një rrjet peer-to-peer. Aplikacionet Bitsocial mund të ekzekutojnë një nyje peer-to-peer brenda
skedës së shfletuesit. Shihni [Peer-to-Peer në shfletues](/browser-p2p/).

## Krahasimi

| Pyetja               | Mirage                                                                                                                                            | Bitsocial                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Kategoria            | Forum mbi blockchain-in e vet (Cosmos SDK)                                                                                                        | Rrjet komunitetesh peer-to-peer                                                                                 |
| Identiteti           | Çelës secp256k1 nga një frazë seed me 12 fjalë, me emër përdoruesi on-chain                                                                       | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                                          |
| Ku ruhen postimet    | Transaksione zinxhiri, pastaj baza e të dhënave PostgreSQL e secilës nyje                                                                         | Nyja e pronarit të komunitetit dhe homologët që e lexojnë dhe e shpërndajnë                                     |
| Kush e mban në linjë | Nyje validatore, secila me 10 000 000 MIRAGE                                                                                                      | Nyja e pronarit të komunitetit plus seeder-a ndihmës                                                            |
| Komunitetet          | Emra pa pronar me ekipe kuratorësh me pagesë në konkurrencë                                                                                       | Në pronësi të një çifti çelësash; nyja e pronarit i pranon ose i refuzon postimet                               |
| Kontrolli i spamit   | Provë pune për të gjithë rrjetin; abonentët e anashkalojnë                                                                                        | Sfida e secilit komunitet përpara se një postim të pranohet                                                     |
| Moderimi             | Pamjet e ekipeve të kuratorëve, filtra personalë, administratorë të emëruar nga qeverisja                                                         | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin                       |
| Ekonomia             | Token-i MIRAGE për abonime, shpërblime dhe staking-un e validatorëve                                                                              | Asnjë në protokoll; një sfidë mund të kërkojë një pagesë ose token                                              |
| Shfletuesi           | Klient HTTP i një nyjeje                                                                                                                          | Nyje peer-to-peer brenda një skede të zakonshme shfletuesi                                                      |
| Kompromisi kryesor   | Një gjendje e përbashkët dhe e renditur, dhe regjistrim i lehtë, por një grup i vogël validatorësh dhe pushtete qeverisjeje mbi të gjithë rrjetin | Nuk nevojiten zinxhir apo staking, por pa renditje globale, dhe përmbajtja e vjetër nuk garantohet përgjithmonë |
