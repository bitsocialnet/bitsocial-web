---
title: Ang Bitsocial at ang Lapis Net
description: Kung paano maihahambing sa Bitsocial ang Lapis Net, isang peer-to-peer na social protocol sa Kotlin na may trust score para sa bawat tumitingin at visibility na sinusuportahan ng Bitcoin.
---

# Ang Bitsocial at ang Lapis Net

Ang [Lapis Net](https://net.lapisproject.dev/) ay isang peer-to-peer na protocol para sa social
network na nakasulat sa Kotlin para sa JVM. Nang nakapag-iisa, narating nito ang mga pundasyong
malapit sa Bitsocial: mga identity na nakabatay sa keypair, imbakan ng nilalaman na estilong IPFS at
libp2p gossipsub. Nagkakaiba ang dalawa sa kung saan nila inilalagay ang pagsasala ng spam at ang
curation. Binibigyan ng Lapis ang bawat tumitingin ng personal na trust graph at hinahayaan nitong
pataasin ng mga bayad sa Bitcoin at Lightning ang visibility; hinahayaan ng Bitsocial ang bawat
komunidad na magpasya kung ano ang maaaring ilathala.

Ang Lapis ay isang gumaganang prototype. Noong Oktubre 2026, wala pa itong pampublikong network, at
manwal na hakbang ang pagkonekta ng dalawang node, ayon sa
[repository](https://github.com/lapisproject-dev/Lapis-Net) nito.

## Paano gumagana ang Lapis

- **Mga identity.** Ang bawat identity ay isang secp256k1 keypair, na tugma sa mga Bitcoin key, na
  may nakatali ritong Ed25519 key para sa libp2p peer ID.
- **Imbakan at pagpapalaganap.** Iniimbak ang nilalaman gamit ang Nabu, isang implementasyon ng IPFS
  sa libp2p (DHT at Bitswap), at ikinakalat ito gamit ang libp2p gossipsub.
- **Pag-iskor.** Apat na opsyonal na iskor ang nakapatong sa isang core na nananatiling neutral
  pagdating sa curation:
  - Veritas, isang web of trust na kinukuwenta mula sa sariling trust graph ng bawat tumitingin
  - Virtus, visibility na sinusuportahan ng mga onchain o Lightning na patunay ng bayad na kumukupas
    sa paglipas ng panahon
  - Karma, mga libreng like na tinitimbang ng Veritas
  - Madli, isang iskor ng reputasyon na itinatala ng mga node tungkol sa asal ng isa't isa
- **Pagmemensahe.** Bahagi ng proyekto ang mga direktang mensaheng end-to-end encrypted, mga
  one-to-one na voice call at isang asynchronous na sistema ng mensahe na kahawig ng e-mail.
- **Mga kliyente.** Nagpapatakbo ang bawat user ng JVM node. Ang reference client ay isang web
  interface na inihahatid ng lokal na node na iyon.

## Saan sila nagkakaiba

### Sino ang nagsasala ng spam

Nagsasala ang Lapis sa panig ng tumitingin. Kumakalat ang nilalaman, at pagkatapos ay ang trust
graph ng bawat tumitingin at ang mga tuntunin sa bayad ng app na ginagamit nila ang nagpapasya kung
ano ang lilitaw. Nagsasala ang Bitsocial sa antas ng komunidad: kailangang pumasa ang isang post sa
hamon ng komunidad bago ito tanggapin ng node ng komunidad, kaya hindi kailanman nagiging bahagi ng
komunidad ang tinanggihang spam. Tingnan ang
[Mga Pasadyang Anti-Spam na Hamon](/custom-challenges/).

### Sino ang may hawak ng kapangyarihan

Sa Lapis, ang bawat tumitingin ang nagpapasya kung sino ang pagkakatiwalaan niya, at ang operator ng
bawat app ang nagpapasya kung paano gumagana roon ang bayad na visibility. Sa Bitsocial, itinatakda
ng may-ari ng isang komunidad ang mga tuntunin para sa iisang komunidad na iyon, at pinipili ng mga
app kung ano ang ipapakita. Walang administrator sa antas ng protocol ang alinman sa dalawa.

### Ekonomiya

Isinasama ng Lapis ang mga patunay ng bayad sa Bitcoin at Lightning sa iskor nito sa visibility.
Walang payment layer ang Bitsocial sa protocol; maaaring humingi ang isang komunidad ng bayad o
token sa pamamagitan ng hamon nito.

### Browser

Maaaring magpatakbo ang mga Bitsocial app ng peer-to-peer na node sa loob ng karaniwang browser tab.
Tingnan ang [Peer-to-Peer sa Browser](/browser-p2p/). Ang browser interface ng Lapis ay isang lokal
na pahinang inihahatid ng JVM node ng user.

### Saklaw

Kasama na sa Lapis ang mga direktang mensahe, voice call at mail. Nakatuon ang Bitsocial sa mga
pampublikong komunidad at wala pa itong native na direktang mensahe.

## Paghahambing

| Tanong                      | Lapis Net                                                                                                      | Bitsocial                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Kategorya                   | Peer-to-peer na social protocol (prototype)                                                                    | Peer-to-peer na network ng komunidad                                                            |
| Identity                    | secp256k1 keypair na may nakataling Ed25519 peer ID                                                            | Mga Ed25519 keypair para sa mga user at komunidad                                               |
| Saan nakalagak ang mga post | Imbakan sa Nabu (IPFS sa libp2p) sa mga kalahok na node                                                        | Ang node ng may-ari ng komunidad at ang mga peer na nagbabasa at nagse-seed nito                |
| Mga komunidad               | Walang bagay na komunidad; nangyayari ang curation para sa bawat tumitingin at bawat app                       | First-class na mga bagay na ang node ang tumatanggap o tumatanggi sa mga post                   |
| Kontrol sa spam             | Trust graph ng tumitingin, bayad na visibility, mga deposito sa Lightning para sa mga unang mensahe            | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                      |
| Pagmo-moderate              | Ang trust graph ng bawat tumitingin; itinatakda ng mga operator ng app ang mga tuntunin sa bayad na visibility | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita |
| Ekonomiya                   | Mga patunay ng bayad sa Bitcoin at Lightning sa pag-iskor                                                      | Wala sa protocol; maaaring humingi ang isang hamon ng bayad o token                             |
| Browser                     | Lokal na web interface na inihahatid ng isang JVM node                                                         | Peer-to-peer na node sa loob ng karaniwang browser tab                                          |
| Network                     | Prototype na walang pampublikong network                                                                       | Gumaganang network na may mga app gaya ng [5chan](/apps/5chan/) at [Seedit](/apps/seedit/)      |
| Pangunahing palitan         | Mayamang built-in na reputasyon at pagmemensahe, ngunit wala pang pampublikong network                         | Mas maliit na core na tumatakbo sa mga browser, ngunit walang built-in na reputasyon o DM       |

## Maaari ba silang magtulungan?

Arbitraryong code ang mga hamon sa Bitsocial, kaya maaaring maging isang hamon ang isang trust score
na estilong Lapis. Kaya na ng built-in na hamong `whitelist` na magbasa ng mga listahan ng
pinapayagang address mula sa mga URL. Ang isang serbisyong maglalathala ng mga Bitsocial address na
pinagkakatiwalaan ng isang Veritas graph ay maaaring magpahintulot sa mga may-akdang iyon na
lumaktaw sa CAPTCHA sa isang komunidad. Mangangailangan iyon ng paraan upang iugnay ang isang Lapis
identity sa isang Bitsocial address, at wala pang ganoon sa ngayon.
