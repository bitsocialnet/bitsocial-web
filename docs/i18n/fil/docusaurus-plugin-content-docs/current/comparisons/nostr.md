---
title: Ang Bitsocial at ang Nostr
description: Kung paano maihahambing ang modelong nakabatay sa relay ng Nostr sa mga peer-to-peer na komunidad ng Bitsocial, mula sa daanan ng data at identity hanggang sa mga grupo, kontrol sa spam at pagmo-moderate.
---

# Ang Bitsocial at ang Nostr

Hindi maayos na kasya ang Nostr sa kategorya ng federated o ng blockchain. Hindi binibigyan ng
account ang mga user ng mga instance, at walang chain, consensus, gas o pandaigdigang
pagkakasunod-sunod. Mas mainam ilarawan ang Nostr bilang **social media na nakabatay sa relay**:
hawak ng mga user ang kanilang keypair, pinipirmahan nila ang mga event, at inilalathala nila ang
mga ito sa mga relay, na mga ordinaryong server na nag-iimbak at naghahatid ng mga ito
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Sinasabi mismo ng
[README](https://github.com/nostr-protocol/nostr) ng Nostr na hindi ito umaasa sa mga peer-to-peer
na teknik.

Dahil dito, mas malapit ang Nostr sa Bitsocial kaysa sa mga federated o blockchain na sistema sa
isang mahalagang aspeto: kriptograpiko at portable ang identity. Ang mga pagkakaiba ay nasa layer ng
data at kung sino ang may hawak ng tarangkahan.

## Paano gumagana ang Nostr

- **Mga event at relay.** Ang bawat post, profile o reaksyon ay isang pirmadong JSON event.
  Inilalathala ng mga kliyente ang mga event sa mga relay sa pamamagitan ng WebSocket at
  nagsa-subscribe sila gamit ang mga filter; iniimbak ng mga relay ang mga event at ibinabalik ang
  mga ito. Hindi nag-uusap ang mga relay sa isa't isa.
- **Replication.** Karaniwang naglalathala ang mga user sa ilang relay. Natuklasan ng isang
  pag-aaral sa 712 relay noong 2023 na ang karaniwang post ay nasa 34.6 sa mga ito
  ([Wei at Tyson](https://arxiv.org/abs/2402.05709)).
- **Paghahanap sa mga post ng isang tao.** Naglalathala ang mga user ng listahan ng mga relay na
  sinusulatan at binabasa nila ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)),
  at kinukuha ng mga kliyente ang mga post ng isang user mula sa mga write relay ng user na iyon.
- **Identity.** Ang bawat user ay isang secp256k1 key na pumipirma gamit ang mga Schnorr signature.
  Walang itinatakdang key rotation o recovery ang mga spec, kaya ang nawalang key ay nawalang
  account. Ang mga opsyonal na identifier na `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) ay sinusuri laban sa isang
  file sa web server ng domain na iyon.
- **Mga grupo.** Ang inirerekomendang mekanismo para sa komunidad ay ang mga grupong nakabatay sa
  relay ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): nagho-host ng grupo
  ang isang relay, ipinapatupad nito ang mga tuntunin ng grupo sa pagiging miyembro at pagpo-post
  bago tanggapin ang isang post, at pinipirmahan nito ang metadata ng grupo. Ang mas lumang mga
  komunidad na inaaprubahan ng moderator
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) ay minarkahan na ngayong
  hindi inirerekomenda pabor sa NIP-29.
- **Kontrol sa spam.** Pinipili ng bawat relay ang sarili nitong tarangkahan: proof of work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), authentication at mga
  allowlist ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), bayad o mga
  limitasyon sa rate. Nagdaragdag ang mga kliyente ng mga mute list at trust score.
- **Media.** Ina-upload ang mga larawan at video sa hiwalay na mga HTTP file server.

## Saan sila nagkakaiba

### Sino ang nag-iimbak at naghahatid ng mga post

Sa Nostr, ang mga relay ang layer ng imbakan at paghahatid: kailangang panatilihing online ng isang
server ang bawat post. Sa Bitsocial, tinutulungan lang ng mga HTTP router ang mga kliyente na
makahanap ng mga peer. Hindi sila nag-iimbak ng mga post, profile, metadata ng komunidad o estado ng
pagmo-moderate; kinukuha ng mga kliyente ang nilalaman mula sa node ng komunidad at sa mga peer na
nagse-seed nito. Tingnan ang [Protokol ng Peer-to-Peer](/peer-to-peer-protocol/).

### Sino ang may hawak ng tarangkahan

Nasa mga operator ng relay ang mga tarangkahan sa pagsulat sa Nostr. Sa labas ng mga grupong NIP-29,
ang isang key na tinanggihan ng isang relay ay maaaring maglathala ng parehong event sa alinmang
relay na tatanggap dito, at ang nakikita ng mga mambabasa ay nakadepende sa kung aling mga relay ang
binabasa ng kanilang kliyente. Mas malapit sa isang komunidad ng Bitsocial ang isang grupong NIP-29:
ang host relay nito ang tumatanggap o tumatanggi sa mga post. Gayunman, ang relay pa rin ang
nagtatakda kung ano ang magagawa ng mga tungkulin sa grupo, at nananatiling nakatali sa relay na
iyon ang kasaysayan ng grupo maliban kung pumayag ang ibang relay na akuin ito.

Sa Bitsocial, ang komunidad ay isang kriptograpikong bagay na may sariling keypair. Pinapatakbo ng
node ng komunidad ang anumang hamong piliin ng may-ari at inilalathala nito ang tinanggap na estado
sa peer-to-peer network. Tingnan ang [Mga Pasadyang Anti-Spam na Hamon](/custom-challenges/).

### Pagpapatakbo ng imprastraktura

Ang relay ay isang server na may domain at WebSocket endpoint, at pasan ng mga sikat na relay ang
gastos sa imbakan at bandwidth ng mga inihahatid nila. Tinantiya ng pag-aaral noong 2023 na
humigit-kumulang 95% ng mga libreng relay ang hindi kayang tustusan ang kanilang gastos mula sa mga
donasyon. Tumatakbo ang isang node ng komunidad ng Bitsocial sa pangkaraniwang hardware, at
makatutulong sa pagbabahagi nito ang mga peer na nagbabasa ng komunidad.

### Browser

Direktang nagbubukas ang isang Nostr web client ng mga koneksyong WebSocket sa mga relay, kaya hindi
kailangan ng app server. Nagpapatakbo ang isang Bitsocial web app ng peer-to-peer na node sa loob ng
tab at kumukuha ito ng nilalaman mula sa mga peer. Tingnan ang
[Peer-to-Peer sa Browser](/browser-p2p/).

### Lumang nilalaman

Malawakang nire-replicate sa mga relay ang mga post sa Nostr, na tumutulong upang manatili ang mga
lumang post. Pinapanatili ng Bitsocial ang pinakabagong estado ng komunidad at hindi nito
ginagarantiyang mananatili magpakailanman ang lumang nilalaman.

## Paghahambing

| Tanong                          | Nostr                                                                                                     | Bitsocial                                                                                         |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Kategorya                       | Protocol na nakabatay sa relay                                                                            | Peer-to-peer na network ng komunidad                                                              |
| Identity                        | secp256k1 na key ng user, walang rotation sa mga spec                                                     | Mga Ed25519 keypair para sa mga user at komunidad                                                 |
| Saan nakalagak ang mga post     | Mga relay na pinili ng may-akda, kadalasang marami                                                        | Ang node ng may-ari ng komunidad at ang mga peer na nagbabasa at nagse-seed nito                  |
| Sino ang nagpapanatiling online | Mga operator ng relay                                                                                     | Node ng may-ari ng komunidad kasama ang mga katulong na seeder                                    |
| Mga komunidad                   | Mga grupong naka-host sa relay (NIP-29)                                                                   | First-class na mga bagay na ang node ang tumatanggap o tumatanggi sa mga post                     |
| Kontrol sa spam                 | Patakaran ng bawat relay: proof of work, authentication, bayad, mga allowlist, mga limitasyon sa rate     | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                        |
| Pagmo-moderate                  | Mga patakaran ng relay, mga mute list ng kliyente, mga label at ulat                                      | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita   |
| Mga pangalan                    | Mga opsyonal na identifier na `name@domain` na sinusuri sa HTTPS                                          | Mga pangalang `.bso` at `.eth` na nireresolba sa mga key                                          |
| Browser                         | WebSocket client ng mga relay                                                                             | Peer-to-peer na node sa loob ng karaniwang browser tab                                            |
| Pangunahing palitan             | Portable na identity at malawak na replication, ngunit nakadepende sa relay ang availability at patakaran | Mas maliit na pagdepende sa relay, ngunit hindi garantisadong panghabambuhay ang lumang nilalaman |
