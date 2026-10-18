---
title: Saan nakatira ang mga post at gaano katagal ang mga ito
description: Bakit signed at content-addressed ang mga post sa Bitsocial ngunit hindi iniimbak magpakailanman ng bawat node, sino ang nagpapanatili ng mga ito online, at paano pinananatiling nababasa ng mga archive ang lumang nilalaman.
---

# Saan nakatira ang mga post at gaano katagal ang mga ito

Hindi iniimbak ng Bitsocial ang bawat post sa blockchain o database ng kumpanya. Iniingatan ng sariling node ng
bawat komunidad ang mga post nito, tumutulong ang mga mambabasa at seeder sa paghahatid, at maaaring magtago ng
permanenteng rekord ang sinumang nais. Ang pag-iingat ng post magpakailanman ay **opsyonal, hindi sapilitan**:
hindi pinipilit ng protocol ang bawat kalahok na itago ang buong kasaysayan ng network.

Ipinapaliwanag ng pahinang ito ang kahulugan nito sa praktika, dahil madaling mapagkamalang "hindi iniimbak
magpakailanman" ang "nawala" o "magtiwala ka sa akin".

## Magkaibang tanong ang pagiging tunay at availability

May dalawang magkaibang tanong tungkol sa post:

1. **Totoo ba ito?** Isinulat ba ito ng may-akdang ito at tinanggap ba ito ng komunidad?
2. **Online pa ba ito?** Maaari ba itong kunin ng isang tao ngayon?

Cryptography ang sagot ng Bitsocial sa una, hindi tiwala. Nilalagdaan ang bawat post ng keypair ng may-akda at,
kapag tinanggap ng komunidad, iniimbak ito sa ilalim ng content identifier (CID): hash ng eksaktong bytes nito.
Maaaring suriin mismo ng kukuha ng post ang signature at hash. Hindi mababago ng node, router, gateway o archive
ang teksto o makagagawa ng post para sa ibang tao nang hindi nabibigo ang pagsusuri.

Ang ikalawang tanong ay kung sino ang may kopya, at iyon lamang ang hindi garantisado.

## Sino ang nagpapanatiling online sa mga post

- **Node ng komunidad.** Tumatanggap ang node ng may-ari ng mga post at itinatago ang mga ito sa database habang
  pinananatili ng komunidad ang mga ito. Ito ang kopyang laging umiiral habang tumatakbo ang komunidad. Tingnan ang
  [Peer-to-peer na Protocol](/peer-to-peer-protocol/).
- **Mga mambabasa.** Sine-seed ng mga desktop app gaya ng 5chan Electron app ang mga komunidad na nilo-load nila
  habang tumatakbo, kaya maraming peer ang naghahatid ng sikat na komunidad tulad ng sikat na torrent. Maaaring
  mag-cache at mag-validate ang browser tab habang bukas ito, ngunit hindi ito pangmatagalang host.
- **Mga seeder.** Hinahayaan ng [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) ang sinuman
  na magbigay ng laging-on na kapasidad mula sa VPS o ekstrang makina. Pini-pin nito ang pinakabagong mga pahina at
  update ng post, at nagiging loadable sa browser ang mga komunidad sa likod ng home router.
- **Mga tagapag-archive.** Maaaring i-crawl ng sinuman ang mga komunidad at itago ang lahat ng nakikita nila. Ang
  mga archive ay karaniwang serbisyong nakapatong sa network, hindi espesyal na tungkulin sa protocol.

## Pinipili ng mga komunidad ang sarili nilang retention

Desisyon ng may-ari kung gaano katagal itinatago ng komunidad ang lumang post, hindi tuntunin ng protocol. May nais
ng maraming taon ng history; ang iba ay ginawa upang makalimot: tulad ng imageboard ang 5chan boards, kung saan
nahuhulog ang mga thread, lumilipat sa archive, at nililinis mula sa node matapos ang nakatakdang panahon (48 oras
bilang default). Maaari ring walang archive ang komunidad.

Parehong sinusuportahan ng protocol ang dalawa dahil patakaran ito ng bawat komunidad, hindi gastos na kailangang
bayaran ng lahat ng node.

## Bakit hindi iimbak ang lahat magpakailanman?

Ang network na humihingi sa bawat node na itago ang bawat post magpakailanman ay kailangang bayaran ito:

- **Blockchain**: iniimbak ng bawat full node ang buong history, kaya lumalaki ang requirements sa lahat ng aktibidad
  at karaniwang may bayad ang pag-post.
- **Bayad na storage**, gaya ng storage rent ng Farcaster, ay nagpapabayad sa user para sa history at nagpu-prune ng
  pinakalumang post na lampas sa binayaran. Tingnan ang [Bitsocial at Farcaster](/comparisons/farcaster/).
- **Central server** ang nagtatago ng lahat, ngunit habang gusto lamang ng isang kumpanya at ayon sa tuntunin nito.

Hindi kailangan ng social media ang pandaigdigang ledger. Hindi mahalaga kung nauna nang isang millisecond ang post A
sa B, at bihirang basahin ang karamihan sa lumang post. Hinahayaan ng Bitsocial ang node na hawakan lamang ang sarili
nitong komunidad, kaya abot-kaya ang hosting sa laptop, Raspberry Pi o maliit na VPS. Tingnan ang [Bakit hindi blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Ang kapalit

Kapag walang nagtatago ng kopya, maaaring hindi na makuha ang post. Hindi nagbabago ang CID, ngunit address lamang
ito: makukuha ang nilalaman habang may kahit isang node na naghahatid nito. Kapag tuluyang nawala ang node ng
komunidad at walang mambabasa, seeder o archive na nag-iingat ng posts nito, wala na ang mga iyon.

Ito ang tapat na halaga ng hindi pag-atas ng global ledger. Nangyayari rin ito sa malalaking platform kapag nawawala
ang account, server o kumpanya. Sa Bitsocial, walang pahintulot na kailangan upang mag-ingat ng isang bagay.

## Panatilihin ang mahalaga

- **Patakbuhin mismo ang node ng komunidad.** Pinananatili ng may-aring nagpapatakbo ng node ang history nito hangga't
  itinatago ito ng mga setting ng komunidad.
- **Mag-seed.** Ang pag-iwang bukas sa desktop app o pagpapatakbo ng `bitsocial-seeder` ay nagpapanatiling available
  ang komunidad para sa iba.
- **Mag-archive.** Pinapanatiling mababasa at searchable ng independent archive ang lumang thread pagkatapos itong
  alisin ng komunidad. Ini-archive ng [5archive.org](https://5archive.org) ang 5chan boards at ng
  [seeditarchive.org](https://seeditarchive.org) ang Seedit communities. Open source ang dalawa, kaya maaaring
  magpatakbo ang sinuman ng mirror o katunggaling archive.

Dahil signed pa rin ang bawat naka-archive na post, hindi tahimik na maisusulat muli ng archive ang sinabi ng tao:
maaaring i-verify ng mambabasa ang signature nito tulad ng sa live na post.
