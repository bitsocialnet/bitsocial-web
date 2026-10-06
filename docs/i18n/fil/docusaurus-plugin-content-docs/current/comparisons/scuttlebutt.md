---
title: Ang Bitsocial at ang Secure Scuttlebutt
description: Kung paano maihahambing sa Bitsocial ang Secure Scuttlebutt (SSB) at ang app nitong Manyverse, mula sa mga append-only na feed at replication batay sa follow graph hanggang sa mga komunidad, kontrol sa spam at offline na pag-sync.
---

# Ang Bitsocial at ang Secure Scuttlebutt

Ang [Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) ay isang peer-to-peer na social protocol na
nilikha ni Dominic Tarr noong 2014. Ang [Manyverse](https://www.manyver.se/) ang pinakakilala nitong
app, para sa Android, iOS at desktop; ang [Patchwork](https://github.com/ssbc/patchwork) ang
pangunahing desktop client bago ito na-archive. Sa mga sistemang inihahambing sa dokumentasyong ito,
ang SSB ang pinakamalapit sa Bitsocial sa diwa: walang server sa daanan ng data, walang blockchain,
walang pandaigdigang pagkakasunod-sunod, at mga Ed25519 key para sa identity. Magkasalungat ang
naging pasya ng dalawa tungkol sa kung ano ang iniimbak ng bawat peer at kung saan pinahihinto ang
spam.

## Paano gumagana ang Scuttlebutt

- **Mga feed.** Ang bawat identity ay isang Ed25519 keypair, na isinusulat bilang
  `@<public key>.ed25519`. Napupunta ang lahat ng inilalathala ng isang user sa sarili niyang feed,
  isang append-only na log kung saan ang bawat pirmadong mensahe ay may sequence number at hash ng
  naunang mensahe. Kapag nailathala na, hindi na mababago ang isang mensahe, ayon sa
  [gabay sa protocol](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replication.** Buong feed ang kinokopya ng mga peer, hindi mga indibidwal na post, at ang follow
  graph ang nagpapasya kung aling mga feed ang iniingatan ng isang peer. Halimbawa, ipinapakita noon
  ng Patchwork ang mga feed hanggang dalawang hop ang layo at nire-replicate nito ang mga feed
  hanggang tatlong hop ang layo. Gamit ang epidemic broadcast trees (EBT), pinaghahambing ng mga
  peer ang pinakahuling sequence number na hawak nila para sa bawat feed at ipinapadala lamang ang
  kulang.
- **Mga koneksyon.** Nag-a-authenticate ang mga peer gamit ang secret handshake at ine-encrypt nila
  ang trapiko gamit ang box stream. Nakasusi ang handshake sa isang network identifier, kaya hindi
  makakakonekta sa pangunahing network ang mga peer sa isang hiwalay na SSB network na may ibang
  identifier.
- **Paghahanap ng mga peer.** Ipinapaalam ng mga peer ang kanilang presensya sa lokal na network sa
  pamamagitan ng UDP broadcast at nagsi-sync sila sa LAN; nagsi-sync din ang Manyverse sa Bluetooth.
  Sa internet, umaasa ang mga user sa mga **pub**, mga peer na laging online na nagfo-follow pabalik
  sa iyo matapos mong gamitin ang isang invite code at pagkatapos ay nag-iimbak at naghahatid ng
  iyong feed, at sa mga **room**, na hindi nag-iimbak ng mga feed ngunit nagta-tunnel ng mga
  koneksyon sa pagitan ng kanilang mga miyembro.
- **Mga blob at pribadong mensahe.** Ang mga larawan at iba pang file ay mga content-addressed na
  blob na kinukuha mula sa mga peer, na may default na limitasyon sa laki na 5 MB sa kasalukuyang
  mga implementasyon. Ine-encrypt ang mga pribadong mensahe para sa hanggang pitong tatanggap at
  inilalathala bilang ciphertext sa feed ng may-akda.

## Saan sila nagkakaiba

### Ano ang iniimbak ng isang peer

Nag-iingat ang isang SSB peer ng buong kopya ng bawat feed sa saklaw ng replication nito, mula sa
unang mensahe ng bawat feed, at inihahatid nito ang mga feed na iyon sa iba. Iyon ang
nagbibigay-daan sa SSB na gumana nang offline, ngunit lumalaki ang imbakan sa bawat mensaheng nasa
saklaw, at kailangang i-download ng isang bagong install ang mga feed na iyon bago ito makapagpakita
ng anumang makabuluhan. Kinukuha ng isang kliyente ng Bitsocial ang pinakabagong estado ng mga
komunidad na binubuksan nito mula sa node ng komunidad at sa mga peer na nagse-seed nito, at ang
pinakabagong estadong iyon lamang ang iniingatan ng network. Tingnan ang
[Protokol ng Peer-to-Peer](/peer-to-peer-protocol/).

### Pagbura at mga device

Dahil isang hash chain ang feed, walang pagbura sa buong network ang SSB: maaaring magtanggal ang
isang peer ng mga mensahe mula sa sarili nitong database ngunit hindi nito mababawi ang mga iyon
mula sa mga kopya ng ibang peer. Ang pagpo-post gamit ang iisang key mula sa dalawang device, o mula
sa isang naibalik na backup, ay nagdudulot ng fork sa feed, kaya ang karaniwang solusyon ay isang
identity bawat device. Inililista ng PZP, ang kahaliling protocol mula sa koponan ng Manyverse, ang
pagbura, maraming device bawat account at mga feed na kayang tiisin ang fork bilang ilan sa mga
pangunahing pagbabago nito mula sa SSB
([post ng paglulunsad](https://www.manyver.se/blog/2024-07-03/)). Naglalathala ang isang node ng
komunidad ng Bitsocial ng bagong bersyon ng estado ng komunidad sa bawat update, kaya nawawala sa
pinakabagong estado ang nilalamang tinatanggal ng mga moderator nito.

### Sino ang maririnig mo

Ang saklaw ng replication ng SSB ay nagsisilbi ring spam filter nito. Umaabot lamang sa iyo ang feed
ng isang estranghero kung may nagfo-follow sa kanya sa loob ng iyong mga hop, at kapag na-block mo
ang isang feed, titigil ang iyong node sa pag-replicate nito. Nananatiling nasa labas ang spam,
ngunit gayundin ang mga bagong dating hangga't walang nagfo-follow sa kanila. Hinahayaan ng
Bitsocial ang sinuman na mag-post sa isang komunidad, at ang node ng komunidad ang nagpapasya sa
pamamagitan ng hamon nito kung tatanggapin ang isang post. Tingnan ang
[Mga Pasadyang Anti-Spam na Hamon](/custom-challenges/).

### Mga komunidad

Walang bagay na komunidad ang SSB. Ang mga channel at hashtag ay mga label sa mga indibidwal na
post, ang mga sagot sa isang thread ay nasa mga feed ng kung sinumang sumulat ng mga ito, at ang
dami ng nakikita mo sa isang thread ay nakadepende sa kung alin sa mga feed na iyon ang nasa iyong
node. Maaaring magkaroon ng mga moderator at listahan ng miyembro ang mga room, ngunit kinokontrol
nila kung sino ang maaaring kumonekta sa pamamagitan ng room, hindi kung ano ang inilalathala. Ang
isang komunidad ng Bitsocial ay isang first-class na bagay na may sarili nitong keypair, mga
tuntunin, mga moderator at hamon.

### Imprastraktura

Kapwa nilang inilalayo ang mga server sa daanan ng data, at kapwa silang umaasa sa mga katulong. Ang
mga pub ang pinakamalapit na mayroon ang SSB sa isang naka-host na serbisyo: iniimbak at inihahatid
nila ang mga feed ng lahat ng kanilang fino-follow. Mas malapit ang mga room sa mga HTTP router ng
Bitsocial dahil wala sa kanila ang nag-iimbak ng nilalaman, ngunit nire-relay ng isang room ang
koneksyon sa pagitan ng mga miyembro nito, samantalang nagbabalik lamang ang isang router ng mga
address ng provider at walang bahagi sa paglilipat. Tulad ng isang SSB peer, tumatakbo ang isang
node ng komunidad ng Bitsocial sa pangkaraniwang hardware, at kailangan itong naka-online upang
makatanggap ng mga bagong post.

### Offline at mga lokal na network

Dito mas malakas ang SSB. Ang dalawang SSB peer sa iisang Wi-Fi network, o sa Bluetooth sa
Manyverse, ay maaaring mag-sync nang walang koneksyon sa internet, at nananatiling nababasa nang
offline ang lahat ng na-replicate na. Ang nakasaad na pangunahing layunin ng Manyverse ay gawing
hindi nakadepende sa koneksyon sa internet ang social networking. Kailangan ng Bitsocial ng
koneksyon sa internet upang makahanap ng mga peer at upang makapaglathala.

### Browser

May kasamang buong SSB node ang mga pangunahing SSB app: may nakapaloob na isa ang Manyverse sa mga
mobile at desktop app nito. Pinatakbo ng
[ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) ang SSB sa loob ng browser gamit ang
bahagyang replication at mga koneksyon sa pamamagitan ng mga room, at na-archive ito noong 2022.
Nagpapatakbo ang mga Bitsocial app ng peer-to-peer na node sa loob ng karaniwang browser tab.
Tingnan ang [Peer-to-Peer sa Browser](/browser-p2p/).

### Mga pribadong mensahe

May built-in na naka-encrypt na pribadong mensahe ang SSB. Nakatuon ang Bitsocial sa mga
pampublikong komunidad at wala pa itong native na direktang mensahe.

## Kalagayan ng proyekto

Si André Staltz, na bumuo ng Manyverse, ay lumayo sa SSB, sa Manyverse at sa planong kahalili ng mga
ito noong Abril 2024 ([ang huli niyang update](https://www.manyver.se/blog/2024-04-05/)). Noong
Hulyo 2024, inilunsad ni Jacob Karlsson ang kahaliling iyon bilang [PZP](https://pzp.wiki/) at
isinulat niyang hindi na siya gagawa ng anumang trabaho sa Manyverse at wala siyang alam na iba pang
nagbabalak gawin iyon. Noong Oktubre 2026, walang update ang mga repository ng PZP sa
[Codeberg](https://codeberg.org/pzp) pagkatapos ng Disyembre 2024. Naka-archive ang repository ng
Patchwork na v3.18.1 ang huling release, at lumipat sa Nostr gamit ang Nos app nila noong 2023 ang
koponan sa likod ng Planetary, isang SSB app para sa iOS. Tumatakbo pa rin ang SSB network sa mga
peer at pub na pinananatiling online ng mga tao, ngunit hindi na dine-develop ang mga pangunahing
app nito.

## Paghahambing

| Tanong                           | Secure Scuttlebutt                                                                                                                                     | Bitsocial                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Kategorya                        | Peer-to-peer na gossip protocol                                                                                                                        | Peer-to-peer na network ng komunidad                                                                                       |
| Identity                         | Isang Ed25519 keypair bawat device                                                                                                                     | Mga Ed25519 keypair para sa mga user at komunidad                                                                          |
| Saan nakalagak ang mga post      | Ang append-only na feed ng may-akda, na kinokopya ng bawat peer na nagre-replicate nito                                                                | Ang node ng may-ari ng komunidad at ang mga peer na nagbabasa at nagse-seed nito                                           |
| Ano ang iniingatan ng isang peer | Buong kasaysayan ng bawat feed sa saklaw ng follow nito                                                                                                | Ang pinakabagong estado ng mga komunidad na binabasa o sine-seed nito                                                      |
| Mga komunidad                    | Walang bagay na komunidad; nilalagyan ng label ng mga channel at hashtag ang mga post                                                                  | First-class na mga bagay na ang node ang tumatanggap o tumatanggi sa mga post                                              |
| Kontrol sa spam                  | Saklaw ng replication batay sa follow graph, at mga block                                                                                              | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                                                 |
| Pagmo-moderate                   | Ang mga follow at block ng bawat user                                                                                                                  | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita                            |
| Mga katulong na server           | Nag-iimbak at naghahatid ng mga feed ang mga pub; nagta-tunnel ng mga koneksyon ang mga room                                                           | Nagbabalik ang mga HTTP router ng mga provider peer at hindi nag-iimbak ng nilalaman                                       |
| Offline                          | Pag-sync sa LAN at Bluetooth nang walang internet                                                                                                      | Kailangan ng koneksyon sa internet                                                                                         |
| Browser                          | May kasamang buong SSB node ang mga app                                                                                                                | Peer-to-peer na node sa loob ng karaniwang browser tab                                                                     |
| Network                          | Tumatakbo, ngunit hindi na dine-develop ang mga pangunahing app nito                                                                                   | Gumaganang network na may mga app gaya ng [5chan](/apps/5chan/) at [Seedit](/apps/seedit/)                                 |
| Pangunahing palitan              | Gumagana nang offline at hindi kailangan ng hosting, ngunit walang katapusang lumalaki ang mga feed at nananatiling hindi nakikita ang mga estranghero | Bukas na paglalathala at suporta sa browser, ngunit kailangan ng internet at ang pinakabagong estado lamang ang iniingatan |
