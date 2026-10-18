---
title: Ang Bitsocial at ang Quorum
description: Kung paano maihahambing ang Quorum, ang end-to-end encrypted na group messenger ng Quilibrium na may mga Space na istilong Discord, sa mga pampubliko at peer-to-peer na komunidad ng Bitsocial.
---

# Ang Bitsocial at ang Quorum

Ang [Quorum](https://www.quorummessenger.com/) ay isang group messenger na binuo ng Quilibrium Inc.
sa sarili nitong network na [Quilibrium](https://quilibrium.com/). Nakaayos ito tulad ng Discord, na
may mga Space, channel, tungkulin at direktang mensahe, at naka-encrypt nang end-to-end ang mga
mensahe nito. Nababanggit ito kasama ng Bitsocial dahil kapwa nila inilalarawan ang sarili bilang
peer-to-peer at lumalaban sa censorship, na may mga grupong nagtatakda ng sarili nilang mga
patakaran. Magkaiba ang kanilang tinutumbok: pribadong group chat ang sa Quorum, at mga
pampublikong komunidad na mababasa ng sinuman ang sa Bitsocial.

Inilalarawan ng Quilibrium ang sarili nito bilang desentralisadong alternatibo sa mga cloud
platform: isang network ng mga node na nag-iingat ng data sa isang naka-encrypt na hypergraph at
nagkakasundo sa estado nito sa pamamagitan ng consensus na tinatawag nitong Proof of Meaningful
Work. Kumikita ang mga node ng QUIL, ang token ng network, na ipinambabayad sa mga bayarin sa
paggamit. Nagsimula ang Quorum noong 2018 bilang Howler, isang ideya para sa pribadong alternatibo
sa Discord, at ito ang naging unang app na naging live sa Quilibrium, ayon sa
[kuwento ng Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). Ang Quilibrium Inc.,
na itinatag ni Cassie Heart, ang nagde-develop ng protocol at nag-aalok ng Quorum bilang isa sa mga
managed service nito ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Paano gumagana ang Quorum

Ang mga detalye sa ibaba ay mula sa source code ng mga kliyente ng Quorum, ang
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) para sa mga web at desktop
app at ang [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), hanggang Oktubre 2026.

- **Mga identity.** Ang master identity ng isang user ay isang Ed448 keyset, at may sariling X448 at
  Ed448 key ang bawat device. Sa browser, pinoprotektahan ng passkey ang mga key. Ang mga address ay
  mga hash na nagsisimula sa `Qm`, at maaaring magpakita ang mga user ng username mula sa name
  service ng Quilibrium.
- **Encryption.** Gumagamit ang mga direktang mensahe ng Double Ratchet sa pagitan ng mga device.
  Nagbabahagi ang isang Space ng iisang Triple Ratchet session sa mga miyembro nito, na pumipirma sa
  kanilang mga mensahe gamit ang mga key na partikular sa Space. Naka-encrypt ang bawat Space, at
  sinasabi ng Quorum na pinipigilan ng message brokering nito ang serbisyong nagre-relay ng mga
  mensahe na iugnay ang mga nagpadala at tatanggap.
- **Pagsali.** Pinapasok ang mga Space gamit ang mga invite link. Dala ng isang one-time link sa URL
  ang mga key para makasali; kinukuha naman ng isang pampublikong link ang mga ito mula sa serbisyo
  ng Quorum, at maaaring ilista ang mga pampublikong Space sa isang directory na nahahanap.
- **Transport.** Kumokonekta ang mga web, desktop at mobile na kliyente sa iisang serbisyo sa
  pamamagitan ng HTTPS at isang WebSocket,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Nire-relay nito ang mga naka-encrypt na mensahe sa inbox ng bawat miyembro, at iniimbak nito ang
  mga rehistrasyon ng user, ang naka-encrypt na manifest ng bawat Space (mga channel, tungkulin,
  emoji), ang mga materyales ng imbitasyon, ang pampublikong directory at ang opsyonal na
  naka-encrypt na pag-sync ng settings. May inbox at hub service na kapareho ang hugis sa node
  software ng Quilibrium, ngunit hindi sinasabi ng mga kliyente o ng dokumentasyon ng Quilibrium kung
  paano tumutugma ang serbisyong ito sa network.
- **Kasaysayan.** Nag-iingat ang kliyente ng bawat miyembro ng sarili nitong kopya ng Space sa local
  storage. Pinupunan ng web at desktop na kliyente ang kasaysayan sa pamamagitan ng paghiling sa
  isang online na miyembro na mag-sync; nire-replay naman ng mobile na kliyente ang isang log na
  iniingatan ng serbisyo para sa bawat Space, kaya nakakahabol ito kahit walang ibang miyembrong
  online.
- **Pagmo-moderate.** Nagbibigay ang mga tungkulin ng kakayahang magbura, mag-pin, mag-mute at
  gumamit ng mga `@everyone` mention. Sinusuri ng kliyente ng bawat miyembro ang pirma sa bawat
  aksyon ng pagmo-moderate at ipinapatupad lamang ito kung hawak ng pumirma ang tamang tungkulin.
  Maaaring mag-kick ng miyembro ang may-ari, na nagpapalit sa mga key ng Space upang hindi na mabasa
  ng na-kick na miyembro ang mga bagong mensahe. Maaaring hingin ng isang Space ang mga pirmadong
  mensahe o hayaan ang mga miyembro na mag-post ng mga hindi pirmado at deniable na mensahe.
- **Code.** Lisensyado sa ilalim ng AGPL-3.0 ang web at desktop na kliyente, at sa ilalim ng GPL-3.0
  ang mobile na kliyente. Mayroon din ang mobile na kliyente ng crypto wallet, integrasyon sa
  Farcaster at Apex, isang bayad na subscription na inilalarawan sa ibaba.

## Saan sila nagkakaiba

### Mga pribadong grupo at mga pampublikong komunidad

Ang isang Space ng Quorum ay isang grupo ng mga miyembro: ang mga may hawak lamang ng mga key nito
ang makababasa nito, at kailangan ng invite link para makasali. Pinapapasok ng isang pampublikong
link ang sinuman, ngunit pagkatapos lamang sumali. Walang pagiging miyembro sa isang komunidad ng
Bitsocial. Maaaring basahin ito ng sinuman, mula sa anumang app, nang hindi sumasali, at maaaring
subukan ng sinuman na mag-post, alinsunod sa hamon ng komunidad.

### Ano ang nagpapanatiling online sa isang grupo

Walang host node ang isang Space ng Quorum. Nagpapadala ang mga miyembro ng mga mensahe sa
pamamagitan ng serbisyo ng Quorum, nag-iingat ng kopya ang kliyente ng bawat miyembro, at hindi
kailangang online ang may-ari para makapag-usap ang iba. Nakatira ang isang komunidad ng Bitsocial
sa node ng may-ari nito, na tumatanggap o tumatanggi sa bawat post at naglalathala ng pinakabagong
estado ng komunidad. Nananatiling nababasa ang komunidad habang sine-seed ito ng mga peer, ngunit
hindi ito makatatanggap ng mga bagong post habang offline ang node nito. Tingnan ang
[Protokol ng Peer-to-Peer](/peer-to-peer-protocol/).

### Sino ang nagpapatupad ng mga patakaran

Sa Quorum, nangyayari ang pagpapatupad sa edge. Ang kliyente ng bawat miyembro ang nagpapasya kung
ipapatupad ang isang pagbura, pag-pin o pag-mute, batay sa tungkulin ng pumirma, at gumagana ang
isang kick sa pamamagitan ng paglipat sa lahat ng iba pa sa mga bagong key. Sa Bitsocial, nangyayari
ang pagpapatupad sa node ng komunidad: hindi kailanman nagiging bahagi ng komunidad ang isang post
na hindi pumasa sa hamon o mga patakaran ng komunidad. Tingnan ang
[Lokal na Pagmo-moderate, Hindi Pandaigdigang Pagbabawal](/local-moderation/).

### Kontrol sa spam

Pangunahing inilalayo ng Quorum ang spam sa pamamagitan ng mga imbitasyon. Isang tao lamang ang
pinapapasok ng one-time link, sinumang may hawak nito ang pinapapasok ng pampublikong link, at
maaaring mag-kick at mag-rekey ang may-ari pagkatapos; nililimitahan din ng kliyente ang bilis ng
sarili nitong pagpapadala. Mga libreng keypair ang mga identity sa Bitsocial, kaya pinipili ng bawat
komunidad ang isang hamon na patatakbuhin bago tumanggap ng post, gaya ng captcha, bayad, balanse ng
token o allowlist. Tingnan ang [Mga Pasadyang Anti-Spam na Hamon](/custom-challenges/).

### Ang kliyente at ang network

Ang isang app ng Quorum ay kliyente ng serbisyo ng Quorum, na pinatatakbo ng Quilibrium Inc. Hindi
mismo sumasali ang mga app sa isang peer-to-peer na network, kaya nakadepende sa iisang endpoint na
iyon ang pag-abot sa isang Space. Sa likod nito, may sariling network ang Quilibrium: noong Oktubre
2026, nagpakita ang [explorer](https://dashboard.quilibrium.com/) nito ng 114 na naaabot na peer at
181 prover sa 99 na shard.

Maaaring magpatakbo ang isang web app ng Bitsocial ng libp2p node sa tab, kumuha ng nilalaman ng
komunidad mula sa mga peer at maglathala sa pamamagitan ng gossipsub. Dumadaan ang paghahanap ng mga
peer sa mga HTTP router na nagbabalik lamang ng mga address ng provider; maaaring magpatakbo ng isa
ang sinuman, at maaaring magpalit ng router ang mga kliyente sa pamamagitan ng pagbabago ng kanilang
configuration. Tingnan ang [Peer-to-Peer sa Browser](/browser-p2p/).

### Ekonomiya

Nasa ubod ng Quilibrium ang isang token. Mina-mine ng mga node ang QUIL at ipinambabayad ito sa mga
bayarin ng network, at umiikot sa Ethereum ang isang wrapped na bersyon nito, ang wQUIL. Libre ang
Quorum mismo at hindi ito nangangailangan ng bayad o numero ng telepono. Ang opsyonal nitong Apex
subscription ay nagkakahalaga ng
[$5 kada buwan](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
na binabayaran sa wQUIL, SNAP o USDC sa Ethereum at hinahati sa pagitan ng Quilibrium Inc. at ng
apat na Space na pinili ng subscriber. Walang payment layer ang Bitsocial sa protocol; maaaring
humingi ang isang komunidad ng bayad o token sa pamamagitan ng hamon nito.

### Mga pribadong mensahe

Dito mas malakas ang Quorum. Naka-encrypt nang end-to-end at may forward secrecy ang mga direktang
mensahe at ang mga mensahe sa Space, at umaabot lamang sa serbisyo ng Quorum ang nilalaman ng
mensahe bilang ciphertext. Nakatuon ang Bitsocial sa mga pampublikong komunidad at wala pa itong
native na direktang mensahe. Naka-encrypt sa key ng node ng komunidad ang isang post sa Bitsocial
habang naglalakbay ito sa pubsub, ngunit kapag natanggap na, pampubliko na ito.

## Kalagayan ng proyekto

Noong Oktubre 2026, tinawag ng repository ng Quorum na beta ang web app, at nakalista pa rin sa
website ng Quorum ang mga app sa Google Play at App Store bilang paparating pa lamang. Nagkakaiba rin
ang dalawang kliyente: nasa mobile app ang mga feature na wallet, Farcaster at Apex, samantalang
ipinapakita ng web at desktop na kliyente ang mga pahina nitong Wallet at Farcaster bilang
paparating pa lamang, at magkaiba ang paraan ng dalawa sa paghabol sa kasaysayan ng Space.

Naabot ng mainnet ng Quilibrium ang bersyon 2.1 noong Setyembre 30, 2025, nang muling tumakbo ang
network matapos ang isang pagtigil
([anunsyo](https://x.com/QuilibriumInc/status/1973082817236984270)). Noong 2026, muling isinulat
ang node sa Rust, na may mga post-quantum na pirma para sa consensus at isang wire protocol na hindi
kayang gamitin ng mas lumang mga node. May mga bahagi ng dokumentasyon na naglalarawan sa disenyo sa
halip na sa tumatakbong code: inilalarawan nila ang
[mixnet routing](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), ngunit sa
node 2.1.0.25, ang mixnet service ay isang
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
na tumatanggap ng mga mensahe nang hindi hinahalo ang mga ito.

## Paghahambing

| Tanong                            | Quorum                                                                                                                | Bitsocial                                                                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Kategorya                         | End-to-end encrypted na group messenger sa network ng Quilibrium                                                      | Peer-to-peer na network ng komunidad                                                                                         |
| Identity                          | Ed448 master keyset dagdag ang mga key para sa bawat device, na pinoprotektahan ng passkey                            | Mga Ed25519 keypair para sa mga user at komunidad                                                                            |
| Sino ang makababasa               | Mga miyembrong may hawak ng mga key ng isang Space                                                                    | Sinuman, mula sa anumang app                                                                                                 |
| Saan nakalagak ang mga mensahe    | Ang device ng bawat miyembro; nire-replay din ng mobile na kliyente ang isang log na iniingatan ng serbisyo ng Quorum | Ang node ng may-ari ng komunidad at ang mga peer na nagbabasa at nagse-seed nito                                             |
| Saan kumokonekta ang mga kliyente | Ang serbisyo ng Quorum sa `api.quorummessenger.com`                                                                   | Mga peer sa pamamagitan ng libp2p, kabilang mula sa isang browser tab                                                        |
| Mga komunidad                     | Mga Space na may mga channel, tungkulin at invite link                                                                | First-class na mga bagay na ang node ang tumatanggap o tumatanggi sa mga post                                                |
| Kontrol sa spam                   | Mga invite link, mga kick na may rekeying, mga rate limit sa panig ng kliyente                                        | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                                                   |
| Pagmo-moderate                    | Mga tungkuling ipinapatupad ng kliyente ng bawat miyembro; ang may-ari ang nagki-kick                                 | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita                              |
| Mga pribadong mensahe             | Mga end-to-end encrypted na direktang mensahe                                                                         | Mga pampublikong komunidad; wala pang native na direktang mensahe                                                            |
| Ekonomiya                         | Network token na QUIL; opsyonal na $5 buwanang Apex subscription                                                      | Wala sa protocol; maaaring humingi ang isang hamon ng bayad o token                                                          |
| Pangunahing palitan               | Pribado at naka-encrypt na mga grupo, ngunit nakadepende ang bawat kliyente sa iisang serbisyo                        | Libreng identity at access sa browser, ngunit walang pribadong pagmemensahe at ang pinakabagong estado lamang ang iniingatan |
