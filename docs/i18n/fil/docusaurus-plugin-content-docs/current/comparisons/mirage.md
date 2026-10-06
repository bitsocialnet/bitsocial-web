---
title: Ang Bitsocial at ang Mirage
description: Kung paano maihahambing ang Mirage, isang forum na estilong Reddit sa sarili nitong blockchain na Cosmos SDK, sa Bitsocial at sa app nitong estilong Reddit na Seedit.
---

# Ang Bitsocial at ang Mirage

Ang [Mirage](https://mirage.foundation/) ay isang network ng talakayan na estilong Reddit, na may
mga komunidad, mga post na naka-thread at mga boto. Sa halip na database ng isang kumpanya,
tumatakbo ito sa sarili nitong blockchain, isang chain na Cosmos SDK na may consensus na CometBFT.
Ang pinakamalapit na produkto ng Bitsocial ay ang [Seedit](/apps/seedit/), isang app na estilong
Reddit sa network ng Bitsocial, kaya ang paghahambing ay pangunahing tungkol sa kung paano
nagho-host, nagmamay-ari at nagmo-moderate ng mga komunidad ang bawat isa.

## Paano gumagana ang Mirage

- **Mga node.** Ang isang Mirage node ay iisang Docker container na naglalaman ng validator,
  PostgreSQL database, indexer, HTTP API at ng web frontend. Validator din ang bawat node. Ang
  pagpapatakbo nito ay nangangailangan ng Ubuntu server sa amd64 at 10,000,000 MIRAGE token sa
  account ng operator, ayon sa
  [gabay sa deployment](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Pagpo-post.** Pinipirmahan ng browser ang bawat aksyon gamit ang secp256k1 key ng user, at
  nagkukuwenta rin ng maliit na proof of work ang mga libreng user. Ibinabalot ng node ang aksyon sa
  isang transaksyon sa chain at binabayaran nito ang fee.
- **Pagbabasa.** Kinokopya ng indexer ng bawat node ang data ng chain sa sarili nitong database at
  inihahatid ang mga feed sa pamamagitan ng HTTP API. Humigit-kumulang isang linggo ng mga block ang
  itinatago ng mga node, kaya nasa database ng bawat node ang pangmatagalang kasaysayan ng mga post,
  at nagsisimula ang isang bagong node nang wala ang kasaysayan bago ang sync point nito.
- **Mga account.** Ang account ay isang key na hinango mula sa isang 12-salitang seed phrase, at
  gumagana ang parehong seed sa anumang node. Nakatala sa chain ang mga username at natatangi ang
  mga ito sa buong network.
- **Mga komunidad.** Ang bawat valid na pangalan ay isa nang komunidad, at walang nagmamay-ari dito.
  Ang mga bayad na pangkat ng curator na may hanggang sampung user bawat isa ay nagpapanatili ng
  kani-kaniyang moderated na tanaw ng isang komunidad; pumipili ang mga mambabasa ng tanaw ng isang
  pangkat, ng default ng node o ng tanaw na walang censorship. Tingnan ang
  [FAQ ng Mirage](https://mirage.talk/faq).
- **Token.** Ginagamit ang MIRAGE token upang magbayad para sa mga subscription, gantimpalaan ang
  mga may-akda at node, at bigyan ang mga validator ng bigat sa pamamahala. Nilalaktawan ng mga
  subscriber ang proof of work at nakakakuha sila ng mas mataas na limitasyon.

## Saan sila nagkakaiba

### Sino ang nagmamay-ari ng isang komunidad

Sa Seedit, hawak ng lumikha ng isang komunidad ang keypair nito, pinapatakbo o idinedelegate niya
ang node nito, at siya ang nagmo-moderate dito. Sa Mirage, walang nagmamay-ari ng isang komunidad:
nag-aalok ang magkakakumpitensyang pangkat ng curator ng mga moderated na tanaw ng iisang pangalan,
at ang default na tanaw ay ang pangkat na pinili ng pinakamaraming nagbabayad na subscriber.

### Kontrol sa spam

Iisang tuntunin ang inilalapat ng Mirage sa buong network: nagbabayad ang mga libreng user sa
pamamagitan ng proof of work na ang hirap ay umaangkop sa dami ng papasok na trapiko, at
nilalaktawan ito ng mga subscriber. Sa Bitsocial, pinipili ng bawat komunidad ang sarili nitong
hamon, mula sa mga captcha hanggang sa mga allowlist at sa mga bayad. Tingnan ang
[Mga Pasadyang Anti-Spam na Hamon](/custom-challenges/).

### Imprastraktura

Nangangailangan ang Mirage ng blockchain. Nagkakasundo ang mga validator sa bawat aksyon, at
nagpapatakbo ang bawat node ng buong server stack at kailangan nitong humawak ng malaking stake ng
token. Walang chain ang Bitsocial: tumatakbo ang isang node ng komunidad sa pangkaraniwang hardware
mula sa desktop app o sa `bitsocial-cli`, at makatutulong ang mga mambabasa sa pagbabahagi ng
nilalaman.

### Kontrol sa buong network

May onchain na pamamahala ang Mirage na tinitimbang ayon sa stake ng mga validator. Maaari nitong
baguhin ang hirap, mga presyo at paglalabas ng token, mag-mint o mag-burn ng mga token, at magtalaga
ng mga admin na ang mga pagbura ay inilalapat ng reference indexer sa anumang post. Pinapayagan din
ng code ng chain ang pamamahala na
[magbura ng mga account](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
at
[magpadala ng mga token mula sa anumang address](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
Noong Oktubre 2026, apat na validator ang gumagawa ng mga block ng chain, at pinamamahalaan ng
sariling mga runbook ng proyekto ang lahat ng apat.

Walang administrator sa antas ng protocol ang Bitsocial. Mino-moderate ng mga may-ari ng komunidad
ang sarili nilang mga komunidad at pinipili ng mga app kung ano ang ipapakita. Tingnan ang
[Lokal na Pagmo-moderate, Hindi Pandaigdigang Pagbabawal](/local-moderation/).

### Browser

Ang web client ng Mirage ay HTTP client ng isang node: pumipirma ang browser ng mga aksyon ngunit
hindi ito sumasali sa isang peer-to-peer network. Maaaring magpatakbo ang mga Bitsocial app ng
peer-to-peer na node sa loob ng browser tab. Tingnan ang [Peer-to-Peer sa Browser](/browser-p2p/).

## Paghahambing

| Tanong                          | Mirage                                                                                                                                                           | Bitsocial                                                                                                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Kategorya                       | Forum sa sarili nitong blockchain (Cosmos SDK)                                                                                                                   | Peer-to-peer na network ng komunidad                                                                                                        |
| Identity                        | secp256k1 key mula sa 12-salitang seed, na may onchain na username                                                                                               | Mga Ed25519 keypair para sa mga user at komunidad                                                                                           |
| Saan nakalagak ang mga post     | Mga transaksyon sa chain, pagkatapos ay ang PostgreSQL database ng bawat node                                                                                    | Ang node ng may-ari ng komunidad at ang mga peer na nagbabasa at nagse-seed nito                                                            |
| Sino ang nagpapanatiling online | Mga validator node, na may hawak na 10,000,000 MIRAGE bawat isa                                                                                                  | Node ng may-ari ng komunidad kasama ang mga katulong na seeder                                                                              |
| Mga komunidad                   | Mga pangalang walang may-ari na may magkakakumpitensyang bayad na pangkat ng curator                                                                             | Pag-aari ng isang keypair; ang node ng may-ari ang tumatanggap o tumatanggi sa mga post                                                     |
| Kontrol sa spam                 | Proof of work para sa buong network; nilalaktawan ito ng mga subscriber                                                                                          | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                                                                  |
| Pagmo-moderate                  | Mga tanaw ng pangkat ng curator, mga personal na filter, mga admin na itinalaga ng pamamahala                                                                    | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita                                             |
| Ekonomiya                       | MIRAGE token para sa mga subscription, gantimpala at stake ng validator                                                                                          | Wala sa protocol; maaaring humingi ang isang hamon ng bayad o token                                                                         |
| Browser                         | HTTP client ng isang node                                                                                                                                        | Peer-to-peer na node sa loob ng karaniwang browser tab                                                                                      |
| Pangunahing palitan             | Iisang pinagsasaluhan at nakaayos na estado at madaling pag-sign up, ngunit maliit na hanay ng mga validator at mga kapangyarihan sa pamamahala sa buong network | Hindi kailangan ng chain o stake, ngunit walang pandaigdigang pagkakasunod-sunod at hindi garantisadong panghabambuhay ang lumang nilalaman |
