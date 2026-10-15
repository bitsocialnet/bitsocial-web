---
title: Bitsocial dhe Urbit
description: Si krahasohet Urbit, një rrjet serverësh personalë me Urbit ID të bazuara në Ethereum dhe grupe në Tlon Messenger të drejtuara nga strehuesi i tyre, me komunitetet peer-to-peer të Bitsocial.
---

# Bitsocial dhe Urbit

[Urbit](https://urbit.org/) është një rrjet serverësh personalë. Çdo përdorues ka një kompjuter
gjithmonë të ndezur, të quajtur anije (ship), i cili ekzekuton sistemin operativ të vetë Urbit
(Arvo), të shkruar në gjuhët e veta të Urbit (Nock dhe Hoon), dhe identifikohet nga një Urbit ID.
Aplikacioni i tij kryesor social është [Tlon Messenger](https://tlon.io/), i ndërtuar nga Tlon,
kompania e themeluar në vitin 2013 për të zhvilluar Urbit.

Urbit synon të zëvendësojë të gjithë grumbullin kompjuterik, prandaj është një projekt shumë më i
gjerë se Bitsocial. Megjithatë, shtresa e tij sociale përdor një model të afërt me atë të Bitsocial:
një komunitet ndodhet në nyjen e pronarit të tij, dhe ajo nyje vendos se çfarë hyn. Të dy ndryshojnë
në atë se kush duhet të mbajë një server dhe si mbahet spami jashtë.

## Si funksionon Urbit

- **Urbit ID.** Çdo anije ka një Urbit ID: një numër që shfaqet si emër i shqiptueshëm, si
  `~sampel-palnet`. ID-të e Layer 1 janë NFT, pronësia dhe çelësat publikë të rrjetit të të cilave
  regjistrohen në kontratat Azimuth në Ethereum. ID-të e Layer 2, të shtuara në vitin 2021 për të
  ulur tarifat, përdorin një "naive rollup": transaksionet e tyre postohen në Ethereum në paketa,
  por pronësia e tyre nuk ruhet në kontratën Azimuth, dhe secila anije e llogarit atë lokalisht.
  Tlon mban një roller që është falas për përdorim publik, sipas
  [dokumentacionit të Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) dhe faqes
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Një hierarki e fiksuar.** Hapësira e adresave ka 256 galaktika, 65 536 yje dhe rreth 4 miliardë
  planetë për përdorim të përditshëm. Galaktikat lëshojnë yje, yjet lëshojnë planetë, dhe çdo planet
  mund të lëshojë hëna për pajisjet e veta. Kometat janë ID falas që një anije i gjeneron vetë për
  vete dhe që nuk e prekin kurrë blockchain-in. Pronarët e galaktikave formojnë Galactic Senate, i
  cili voton për përmirësimet e kontratave Azimuth dhe zgjedh bordin e Urbit Foundation.
- **Rrjetëzimi.** Anijet shkëmbejnë pakete të enkriptuara peer-to-peer. Që nga korriku 2026,
  protokolli i rrjetit është [Directed Messaging](https://urbit.org/blog/directed-messaging), një
  rishkrim i përqendruar te përmbajtja i protokollit më të vjetër Ames. Galaktikat merren me
  zbulimin e homologëve: secila mban shënim se ku ndodhen anijet nën të dhe u përcjell atyre pakete
  derisa dy anijet të mund të arrijnë drejtpërdrejt njëra-tjetrën, ose për sa kohë që një firewall e
  pengon këtë, sipas
  [punimit për Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Grupet.** Në Tlon Messenger, një grup strehohet nga anija e krijuesit të tij. Anëtarët i
  dërgojnë mesazhet te strehuesi, i cili ua shpërndan ato anijeve të të gjithë anëtarëve, dhe anija
  e çdo anëtari mban kopjen e vet, sipas [FAQ-së së Tlon](https://tlon.io/posts/faq). Strehuesi
  kontrollon rolet, kanalet dhe pranimin e anëtarëve. Një grup mund të jetë publik, privat ose
  sekret, dhe mund të
  [përjashtojë anije të veçanta ose rangje të tëra ID-sh](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanalet janë biseda, fletore ose koleksione imazhesh dhe lidhjesh.
- **Strehimi.** Kur regjistrohet në Tlon, një përdorues i ri merr një anije që e ekzekuton Tlon, me
  çelësa që Tlon i mban në kujdestari. Një përdorues mund ta eksportojë anijen dhe master ticket-in
  e saj dhe ta ekzekutojë diku tjetër: në një pajisje [Native Planet](https://www.nativeplanet.io/),
  ose me runtime-in Vere në Linux, macOS ose Windows. Anijet ende nuk mund të ruajnë drejtpërdrejt
  skedarë të mëdhenj, prandaj Tlon Messenger i vendos imazhet dhe mediat e tjera në hapësirë
  ruajtjeje në re, të përputhshme me S3.

## Ku ndryshojnë

### Kush duhet të mbajë një server

Në Urbit, çdo pjesëmarrës është një server. Aplikacionet e Tlon janë ndërfaqe për anijen e vetë
përdoruesit, dhe madje edhe leximi i një grupi kalon përmes saj. Ata që nuk mbajnë vetë një anije,
marrin një me qira, gjë që e rikthen në skenë një ofrues strehimi: Tlon mban çelësat e përdoruesve
të strehuar dhe ruan qasje të kufizuar për mirëmbajtje, megjithëse përdoruesit mund të largohen me
gjithë anijen e tyre.

Në Bitsocial, vetëm pronarët e komuniteteve kanë nevojë për një nyje gjithmonë të ndezur. Lexuesit
dhe ata që postojnë mund të ekzekutojnë një nyje peer-to-peer brenda një skede shfletuesi, dhe
llogaria e tyre është një çift çelësash që e ruan aplikacioni. Shihni
[Peer-to-Peer në shfletues](/browser-p2p/). Kur dikush përdor megjithatë një nyje të strehuar,
dizajni i Bitsocial synon t'i lejojë të delegojë kohën e funksionimit pa ia dorëzuar dikujt tjetër
kujdestarinë e identitetit. Shihni
[Identiteti dhe Pronësia e Komunitetit](/identity-and-ownership/).

### Strehuesi i komunitetit

Këtu të dy janë më afër njëri-tjetrit. Një grup Tlon dhe një komunitet Bitsocial ndodhen të dy në
nyjen e pronarit të tyre. Strehuesi vendos kush mund të postojë, zbaton moderimin dhe shpërndan
rezultatin, dhe asnjëri protokoll nuk vendos një moderator mbi strehuesin. Në të dy rastet,
strehuesi duhet të jetë online. FAQ-ja e Tlon thotë se nëse strehuesi del jashtë linje, "grupi bie
bashkë me të", dhe një komunitet Bitsocial nuk mund të pranojë postime të reja ndërsa nyja e tij
është jashtë linje.

Ata e ruajnë përmbajtjen ndryshe. Anija e çdo anëtari mban një kopje të historikut të grupit, kështu
që anëtarët mund të lexojnë ende atë që kanë marrë tashmë ndërsa strehuesi nuk funksionon. Një
lexues i Bitsocial e merr gjendjen më të fundit të komunitetit nga nyja e komunitetit ose nga
homologët që e shpërndajnë, kështu që një komunitet jashtë linje mbetet i lexueshëm për sa kohë që
homologët e kanë, por rrjeti mban vetëm gjendjen më të fundit.

Një grup Tlon ka gjithashtu një listë anëtarësh, dhe strehuesi i tij mund ta bëjë atë vetëm me
ftesë. Një komunitet Bitsocial nuk ka anëtarësi: kushdo mund ta lexojë dhe kushdo mund të provojë të
postojë, me kusht që të kalojë sfidën e tij.

### Spami dhe identiteti

Urbit e lufton spamin duke e bërë identitetin të rrallë. Numri i planetëve është i fiksuar dhe
secili prej tyre lëshohet nga një yll. Kometat falas e anashkalojnë këtë rrallësi, prandaj grupet që
duan ta ruajnë atë i mbajnë larg: dokumentacioni i Urbit vëren se disa grupe i refuzojnë kometat,
dhe një grup Tlon mund të përjashtojë gjithë rangun e kometave me një cilësim të vetëm. Pasi kometat
mbahen jashtë, një përdorues i përjashtuar ka nevojë për një planet tjetër nga pronari i një ylli
për t'u rikthyer. Reputacioni mund të ndjekë gjithashtu hierarkinë: Azimuth përfshin një kontratë
Censures që u lejon galaktikave dhe yjeve t'u vënë shenjë ID-ve. Meqë rrallësia është e ndërtuar në
hapësirën e adresave, ajo funksionon njësoj në çdo grup që i mban larg kometat.

Identitetet e Bitsocial janë çifte çelësash falas. Çdo komunitet zgjedh sfidën e vet përpara se të
pranojë një postim, si një captcha, një pagesë, një balancë tokenësh ose një listë të lejuarish, dhe
komunitete të tjera mund të zgjedhin ndryshe. Shihni
[Sfidat e personalizuara kundër spamit](/custom-challenges/).

### Blockchain-i dhe qeverisja

Shtresa e identitetit të Urbit varet nga Ethereum. Kontratat Azimuth regjistrojnë pronësinë dhe
çelësat e rrjetit të Layer 1, transaksionet e Layer 2 postohen në Ethereum në paketa, dhe Galactic
Senate mund ta përmirësojë kontratën që qeveris Azimuth-in. Të njëjtat 256 galaktika merren
gjithashtu me zbulimin e homologëve dhe përcjelljen e paketave, kështu që një grup i fiksuar
identitetesh mbart si qeverisjen, ashtu edhe një pjesë të rrugëzimit të rrjetit.

Identitetet e Bitsocial janë çifte çelësash që nuk kërkojnë regjistrim. Emrat `.bso` dhe `.eth` janë
pseudonime opsionale që zgjidhen në to. Zbulimi i homologëve kalon përmes ruterëve HTTP që kthejnë
vetëm adresat e ofruesve; kushdo mund të mbajë një ruter të tillë, dhe klientët mund të ndërrojnë
ruter duke ndryshuar konfigurimin e tyre.

### Fusha e veprimit

Urbit është një kompjuter për qëllime të përgjithshme. Një anije mund të strehojë një remote Git,
një bazë njohurish personale ose agjentë AI, dhe Tlon Messenger është një program ndër shumë të
tjerë. Ndërtimi për Urbit do të thotë kryesisht shkrim aplikacionesh Hoon për Arvo. Bitsocial është
një protokoll për komunitete publike, me aplikacione si [5chan](/apps/5chan/) dhe
[Seedit](/apps/seedit/). Ai funksionon mbi grumbullin ekzistues (libp2p, IPFS dhe shfletuesin) në
vend që ta zëvendësojë, dhe klientët e tij ndërtohen me mjete të zakonshme web. Shihni
[Ndërtoni klientin tuaj](/build-your-own-client/).

### Mesazhet private

Këtu Urbit është më i fortë. Mesazhet direkte shkojnë nga një anije drejt e te një tjetër, i gjithë
trafiku midis anijeve është i enkriptuar, dhe grupet mund të jenë private ose sekrete. Tlon vëren se
mesazhet janë të enkriptuara gjatë transmetimit, por ruhen të paenkriptuara në anije. Bitsocial
përqendrohet te komunitetet publike dhe ende nuk ka mesazhe direkte native.

## Gjendja e projektit

Urbit ka kaluar trazira të mëdha. Në gusht 2024, Urbit Foundation, organizata jofitimprurëse që
drejton zhvillimin bazë, shkarkoi drejtorin e saj ekzekutiv; themeluesi Curtis Yarvin u rikthye për
të udhëhequr strategjinë pa ndonjë titull formal, disa zhvillues kryesorë u larguan, dhe fondet e
Foundation mjaftonin vetëm për pak muaj,
[raportoi CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin propozoi zhvendosjen e Azimuth në një layer 2 ekzistues të Ethereum, me Base si zgjedhjen më
të mundshme, dhe lëshimin e tokenëve të këmbyeshëm "vizë" që shndërrohen në planetë. Në tetor 2026,
[dokumentacioni i ID-ve](https://docs.urbit.org/urbit-id/what-is-urbit-id) i Urbit ende e përshkruan
Azimuth në Ethereum me naive rollup-in e tij. Në tetor 2025, Galactic Senate zëvendësoi bordin e
Foundation, dhe bordi i ri emëroi një drejtor të ri ekzekutiv
([njoftimi](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Zhvillimi vazhdon. Directed Messaging hyri në funksion me versionin 408k më 14 korrik 2026. Në
qershor 2026, Tlon Messenger
[hapi regjistrimet publike pa listë pritjeje](https://urbit.org/blog/this-month-in-urbit-june-2026),
dhe Tlon tani e paraqet veten si një vend ku njerëzit dhe agjentët AI punojnë së bashku.

## Krahasimi

| Pyetja               | Urbit                                                                                                          | Bitsocial                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Kategoria            | Rrjet serverësh personalë dhe sistem operativ                                                                  | Rrjet komunitetesh peer-to-peer                                                                       |
| Identiteti           | Urbit ID: rreth 4 miliardë planetë në Ethereum ose në rollup-in e Layer 2, plus kometa falas                   | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                                |
| Kush mban një server | Çdo përdorues, në anijen e vet ose në një anije të strehuar                                                    | Pronarët e komuniteteve; lexuesit dhe ata që postojnë mund të përdorin një skedë shfletuesi           |
| Ku ruhen postimet    | Anija e strehuesit të grupit dhe një kopje në anijen e çdo anëtari                                             | Nyja e pronarit të komunitetit dhe homologët që e lexojnë dhe e shpërndajnë                           |
| Komunitetet          | Grupe të strehuara nga anija e krijuesit, me lista anëtarësh                                                   | Objekte të klasit të parë, nyja e të cilave i pranon ose i refuzon postimet                           |
| Kontrolli i spamit   | ID të rralla të lëshuara nga yjet; grupet përjashtojnë anije ose rangje të tëra                                | Sfida e secilit komunitet përpara se një postim të pranohet                                           |
| Moderimi             | Rolet dhe përjashtimet e vendosura nga strehuesi i grupit                                                      | Pronarët e komuniteteve moderojnë komunitetin e tyre; aplikacionet zgjedhin çfarë shfaqin             |
| Zbulimi i homologëve | Galaktikat ndjekin anijet nën to dhe përcjellin paketa për to                                                  | Ruterët HTTP kthejnë homologët ofrues dhe nuk ruajnë përmbajtje                                       |
| Qeverisja            | Galactic Senate prej 256 galaktikash voton për përmirësimet e Azimuth                                          | Asnjë autoritet në nivel protokolli mbi identitetet ose komunitetet                                   |
| Mesazhet private     | Mesazhe direkte të enkriptuara dhe grupe vetëm me ftesë                                                        | Komunitete publike; ende pa mesazhe direkte native                                                    |
| Kompromisi kryesor   | Një kompjuter i plotë personal me grupe private, por çdo përdorues ka nevojë për një anije gjithmonë të ndezur | Identitete falas dhe qasje nga shfletuesi, por pa mesazhe private dhe ruhet vetëm gjendja më e fundit |
