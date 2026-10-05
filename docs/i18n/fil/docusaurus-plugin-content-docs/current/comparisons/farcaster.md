---
title: Ang Bitsocial at ang Farcaster
description: Kung paano maihahambing ang Farcaster, kasama ang mga onchain na account, storage rent at ang network ng mga validator na Snapchain, sa mga peer-to-peer na komunidad ng Bitsocial.
---

# Ang Bitsocial at ang Farcaster

Inilalagay ng [Farcaster](https://docs.farcaster.xyz/) ang identity sa isang blockchain at ang
social data sa labas nito. Nasa mga contract sa OP Mainnet, isang layer 2 ng Ethereum, ang mga
account, app key at bayad sa imbakan. Ang mga post, na tinatawag na cast, kasama ang mga follow at
reaksyon, ay mga pirmadong mensaheng iniimbak ng [Snapchain](https://snapchain.farcaster.xyz/),
isang network na kahawig ng blockchain na pumalit noong 2025 sa dating Hub network ng Farcaster.

## Paano gumagana ang Farcaster

- **Mga account.** Ang account ay isang numerong Farcaster ID na pag-aari ng isang Ethereum address,
  na maaari ring magtakda ng recovery address. Nagpo-post ang mga app gamit ang mga delegadong app
  key na nakarehistro onchain; hindi maaagaw ng isang app key ang account.
- **Storage rent.** Umuupa ang bawat account ng mga storage unit, sa kasalukuyan ay $0.20 bawat unit
  bawat taon. Ang isang unit na inupahan mula Hulyo 2025 ay naglalaman ng 100 cast; lampas doon,
  tinatanggal ang pinakalumang mga cast. Lumalaki ang mga limitasyon sa rate kasabay ng inupahang
  imbakan.
- **Snapchain.** Isinasaayos ng mga validator ang mga mensahe sa mga block gamit ang consensus na
  estilong Tendermint, at pinananatili ng bawat full node ang data ng buong network. Nangangailangan
  ang mga node ng humigit-kumulang 16 GB na RAM at 2 TB na imbakan, ayon sa
  [gabay sa node](https://snapchain.farcaster.xyz/getting-started).
- **Mga pangalan.** Libre ang mga default na username, na tinatawag na fname, at inilalabas ang mga
  ito ng sariling name server ng Farcaster, na
  [maaaring bawiin ang mga ito](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames).
  Maaari namang gumamit ang mga user ng pangalang `.eth` na nakarehistro sa Ethereum.
- **Mga channel.** Eksperimental na feature ng Farcaster client ang mga channel ayon sa paksa.
  Protocol data ang mga cast sa isang channel, ngunit ang metadata, mga follow at pagmo-moderate ng
  channel ay [nakaimbak sa client](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Pagbabasa.** Nagbabasa ang mga app sa pamamagitan ng isang Snapchain node na sila mismo ang
  nagpapatakbo o ng isang managed provider, karaniwan ang Neynar.

## Saan sila nagkakaiba

### Mga blockchain at validator

Nakadepende ang Farcaster sa OP Mainnet para sa mga account at bayad, at sa Snapchain, isang network
na kahawig ng blockchain, para sa pagsasaayos ng lahat ng social data. Permissioned ang hanay ng mga
validator ng Snapchain. Sinasabi ng whitepaper nito na nagiging mahirap ang censorship kapag may
humigit-kumulang sampung validator na nakakalat sa buong mundo; noong Oktubre 2026, mas maliit doon
ang [listahan ng mga validator](https://snapchain.farcaster.xyz/validators) nito, at karamihan sa
mga key ay pag-aari ng Neynar, na
[bumili sa Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) noong Enero 2026.
Walang chain, validator o consensus ang Bitsocial.

### Pagbabayad para makapag-post

Nagbabayad ng storage rent ang bawat account sa Farcaster, at nililimitahan ng imbakan kung gaano
karami sa kasaysayan ng isang account ang pinananatili ng network. Sa Bitsocial, walang bayad ang
pagpo-post sa antas ng protocol; ang bawat komunidad ang nagpapasya kung hihingi ito ng captcha,
bayad, token o iba pa. Tingnan ang [Mga Pasadyang Anti-Spam na Hamon](/custom-challenges/).

### Mga komunidad

Feature ng client ang mga channel sa Farcaster: iniimbak ng client ang kanilang metadata at
ipinapatupad nito ang pagmo-moderate ng channel, kaya ang isang cast na hinarang sa isang channel ay
maaaring manatiling valid sa network at nakikita sa ibang mga app. Sa Bitsocial, mga bagay sa
protocol ang mga komunidad na may sariling keypair, at ang node ng komunidad ang tumatanggap o
tumatanggi sa mga post.

### Pagpapatakbo ng imprastraktura

Hawak ng isang Farcaster node ang buong network, kaya lumalaki ang imbakan nito kasabay ng lahat ng
aktibidad; tinataya ng Farcaster na lalapit ang paglaki sa pinakamalalaking cloud disk. Hawak lamang
ng isang node ng komunidad sa Bitsocial ang sarili nitong mga komunidad, at tumatakbo ito sa
pangkaraniwang hardware.

### Browser

Ang isang Farcaster app sa browser ay HTTP client ng isang node o provider. Maaaring magpatakbo ang
isang Bitsocial web app ng peer-to-peer na node sa loob ng tab. Tingnan ang
[Peer-to-Peer sa Browser](/browser-p2p/).

## Paghahambing

| Tanong                          | Farcaster                                                                                                 | Bitsocial                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Kategorya                       | Onchain na identity na may social data na isinasaayos ng mga validator                                    | Peer-to-peer na network ng komunidad                                                                                   |
| Identity                        | Farcaster ID na pag-aari ng isang Ethereum address, na may mga delegadong app key                         | Mga Ed25519 keypair para sa mga user at komunidad                                                                      |
| Saan nakalagak ang mga post     | Snapchain, na nire-replicate sa bawat full node, sa loob ng binayarang limitasyon sa imbakan              | Ang node ng may-ari ng komunidad at ang mga peer na nagbabasa at nagse-seed nito                                       |
| Sino ang nagpapanatiling online | Mga validator ng Snapchain at mga operator ng node                                                        | Node ng may-ari ng komunidad kasama ang mga katulong na seeder                                                         |
| Mga komunidad                   | Mga eksperimental na channel na pinamamahalaan ng Farcaster client                                        | First-class na mga bagay na ang node ang tumatanggap o tumatanggi sa mga post                                          |
| Kontrol sa spam                 | Storage rent at mga limitasyon sa rate, dagdag ang mga spam label sa antas ng app                         | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                                             |
| Pagmo-moderate                  | Mga host ng channel sa client, mga filter ng app, panganib ng censorship sa antas ng validator            | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita                        |
| Mga pangalan                    | Mga libreng fname na maaaring bawiin ng Farcaster, o mga pangalang `.eth`                                 | Mga pangalang `.bso` at `.eth` na nireresolba sa mga key                                                               |
| Browser                         | HTTP client ng isang node o provider                                                                      | Peer-to-peer na node sa loob ng karaniwang browser tab                                                                 |
| Pangunahing palitan             | Iisang pare-parehong pandaigdigang dataset, ngunit may upa, mga chain at maliit na hanay ng mga validator | Walang bayarin o chain, ngunit walang pandaigdigang dataset at hindi garantisadong panghabambuhay ang lumang nilalaman |
