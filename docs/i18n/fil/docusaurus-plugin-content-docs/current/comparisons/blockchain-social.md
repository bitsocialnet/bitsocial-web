---
title: Ang Bitsocial at ang mga Social Network sa Blockchain
description: Kung paano inilalagay ng Lens, DeSo at Steem ang social data o mga tuntunin sa isang blockchain, at kung bakit hindi gumagamit nito ang Bitsocial.
---

# Ang Bitsocial at ang mga Social Network sa Blockchain

Inilalagay ng Lens, DeSo at Steem ang social na aktibidad sa isang blockchain. Nagiging mga
transaksyon ang mga account, follow, post o ang mga tuntuning nakapalibot sa mga ito, na isinasaayos
at iniimbak ng mga validator. Walang ginagamit na blockchain ang Bitsocial: hindi kailangan ng
social media ng pandaigdigang pagkakasunod-sunod para sa bawat post, kaya nilalaktawan ng Bitsocial
ang consensus, gas at staking. Tingnan ang [Protokol ng Peer-to-Peer](/peer-to-peer-protocol/) para
sa pangangatwirang iyon.

## Ang pagkakapareho nila

- **May nagbabayad para sa bawat pagsulat.** Naniningil ng gas ang Lens, na maaaring sagutin ng mga
  app; naniningil ang DeSo ng bayad sa bawat aksyon; nirarasyon ng Steem ang mga aksyon ayon sa mga
  naka-stake na token.
- **Iisang patakaran sa spam ang itinatakda ng chain para sa lahat.** Umiiral sa buong network ang
  mga bayarin, stake at gastos sa account sa halip na piliin ng bawat komunidad.
- **Permanente ang mga onchain na record.** Maaaring itago ng mga app ang nilalaman, ngunit hindi
  nila ito maaalis sa chain.
- **Mga API client ang mga browser.** Pumipirma ng mga transaksyon ang mga web app at nagbabasa sila
  sa pamamagitan ng node, indexer o API na pinapatakbo ng iba.

## Lens

Tumatakbo ang [Lens](https://lens.xyz/) sa Lens Chain, isang layer 2 ng Ethereum na binuo gamit ang
ZK Stack ng ZKsync at gumagamit ng Avail para sa data availability. Ang Mask Network ang
[nangangasiwa sa Lens mula noong Enero 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Nasa chain:** mga smart contract ang mga account, mga NFT sa loob ng mga namespace ang mga
  username, at mga contract din ang mga graph, grupo, feed at ang mga tuntunin ng mga ito.
- **Nasa labas ng chain:** nasa isang JSON file sa isang URI ang teksto at media ng isang post,
  karaniwang sa Grove, ang serbisyo ng imbakan ng Lens na nasa harap ng IPFS. Hawak ng Lens API ang
  mga reaksyon at bookmark, at nagbabasa ang mga app sa pamamagitan ng API na iyon.
- **Spam at mga tarangkahan:** nangangailangan ang mga transaksyon ng gas sa GHO, na maaaring
  sagutin ng mga app nang may mga limitasyon sa rate. Maaaring humingi ang mga tuntunin ng feed at
  grupo ng paghawak ng token o ng bayad.
- **Pagpapatakbo ng chain:** inuuri ng [L2BEAT](https://l2beat.com/scaling/projects/lens) ang Lens
  Chain bilang isang Stage 0 na validium na may sentralisadong operator na maaaring tumangging isama
  ang mga transaksyon.

## DeSo

Ang [DeSo](https://docs.deso.org/) ay isang layer-1 na blockchain na binuo para sa mga social app.
Lumipat ito mula proof of work patungong proof of stake noong Hulyo 2024.

- **Nasa chain:** ang mga profile, post, like, follow at direktang mensahe ay pawang mga
  transaksyong iniimbak ng bawat full node. Naka-host sa labas ng chain ang mga larawan at video;
  gumagamit ang reference node ng Google Cloud Storage at Cloudflare Stream.
- **Spam:** nagbabayad ng bayad sa DESO ang bawat aksyon. Karaniwang tumatanggap ang mga bagong user
  ng panimulang DESO mula sa isang node matapos ang pag-verify sa telepono.
- **Pagmo-moderate:** ang bawat node ang nagpapasya kung ano ang ipapakita nito sa pamamagitan ng
  blacklisting o graylisting, ngunit
  [nananatili onchain ang nilalaman](https://docs.deso.org/deso-blockchain/content-moderation).
- **Mga komunidad:** walang inilalarawang primitive para sa komunidad o forum ang dokumentasyon; ang
  isang "komunidad" ay isang feed na kinukurasyon ng isang app.
- **Pagpapatakbo ng node:** nangangailangan ang mga validator ng hindi bababa sa 32 GB na RAM at 200
  GB na disk, ayon sa
  [gabay para sa validator](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

Ang [Steem](https://steem.com/) ay isang social blockchain na nagbabayad ng mga token sa mga
may-akda at curator, at ang [Steemit](https://steemit.com/) ang pangunahing blogging app nito.
Humiwalay ang Hive sa Steem noong 2020; ayon sa
[whitepaper ng Hive](https://hive.io/whitepaper.pdf), sumunod ang fork sa pagbebenta ng Steemit Inc.
kay Justin Sun.

- **Nasa chain:** mga post na teksto, mga komento, mga boto at ang kasaysayan ng pag-edit sa mga
  ito, na isinasaayos ng 21 nahalal na witness na gumagawa ng isang block bawat tatlong segundo.
  Naka-host sa labas ng chain ang mga larawan.
- **Spam:** kumokonsumo ang mga aksyon ng Resource Credits, na lumalaki kasabay ng naka-stake na
  STEEM. Nagkakahalaga ng STEEM ang paglikha ng account; binabayaran ito ng Steemit para sa mga user
  na nagve-verify ng email address at numero ng telepono.
- **Mga komunidad:** ang mga ito ay
  [mga custom na operasyong binibigyang-kahulugan ng isang indexer](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  sa labas ng consensus. Maaaring i-mute ng mga moderator ang mga post, na nagtatago sa mga ito sa
  mga app ngunit nag-iiwan sa mga ito onchain.
- **Mga gantimpala:** pinopondohan ng inflation ang mga gantimpala, at mga botong tinitimbang ayon
  sa stake ang nagpapasya kung paano hahatiin ang mga ito, kaya ang malalaking may-hawak ang
  humuhubog sa kung ano ang nakakakuha ng atensyon.

## Paghahambing

| Tanong              | Lens                                                                                                         | DeSo                                                                                      | Steem                                                                               | Bitsocial                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Chain               | Layer 2 ng Ethereum (ZK Stack validium)                                                                      | Sariling layer 1, proof of stake                                                          | Sariling chain, delegated proof of stake                                            | Wala                                                                                                                              |
| Nilalaman ng post   | JSON sa labas ng chain, karaniwang sa Grove                                                                  | Teksto onchain; media sa labas ng chain                                                   | Teksto onchain; mga larawan sa labas ng chain                                       | Nasa node ng may-ari ng komunidad at sa mga peer na nagbabasa at nagse-seed nito                                                  |
| Identity            | Smart-contract na account; mga username na NFT                                                               | Keypair na may onchain na profile                                                         | May-pangalang account sa chain na may mga key na magkakaiba ang antas               | Mga Ed25519 keypair para sa mga user at komunidad                                                                                 |
| Mga komunidad       | Mga grupo at feed bilang mga contract na may mga tuntunin                                                    | Walang primitive para sa komunidad                                                        | Mga komunidad na binibigyang-kahulugan ng indexer sa labas ng consensus             | First-class na mga bagay na ang node ang tumatanggap o tumatanggi sa mga post                                                     |
| Kontrol sa spam     | Gas (kadalasang sinasagot ng app), mga tuntunin sa token o bayad                                             | Bayad sa bawat aksyon; panimulang pondo matapos ang pagsusuri sa telepono                 | Resource Credits mula sa stake; may bayad na paglikha ng account                    | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                                                        |
| Pagmo-moderate      | Mga admin ng grupo, mga onchain na tuntunin, pagtatago sa antas ng API                                       | Sinasala ng bawat node ang ipinapakita nito                                               | Mga mute ng komunidad, mga downvote na tinitimbang ayon sa stake, mga filter ng app | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita                                   |
| Pagpapatakbo        | Operator ng chain, dagdag ang Lens API at Grove                                                              | Mga validator na may hindi bababa sa 32 GB na RAM                                         | Mga nahalal na witness, dagdag ang mga API at indexer node                          | Isang node ng komunidad sa pangkaraniwang hardware, kasama ang mga katulong na seeder                                             |
| Pangunahing palitan | Mga onchain na tuntuning napo-program, ngunit nakadepende sa mga serbisyo ng Lens ang nilalaman at pagbabasa | Bukas na pool ng data, ngunit may bayad ang bawat aksyon at mananatili ito magpakailanman | Built-in na mga gantimpala, ngunit hinuhubog ng stake ang visibility at pamamahala  | Walang bayarin o stake, ngunit walang pandaigdigang pagkakasunod-sunod at hindi garantisadong panghabambuhay ang lumang nilalaman |
