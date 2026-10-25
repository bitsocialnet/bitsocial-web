---
title: Pagtuklas ng Nilalaman
description: Paano pinaghihiwalay ng Bitsocial ang pagtuklas ng peer mula sa curation sa antas ng app.
---

# Pagtuklas ng Nilalaman

Ang Bitsocial ay hindi naglalagay ng isang global feed, search index, o ranking algorithm sa protocol. Hinahati nito ang pagtuklas ng nilalaman sa dalawang layer:

1. Nahanap ng **paghahanap sa network** ang mga kapantay na kasalukuyang naglilingkod sa isang kilalang komunidad.
2. **Pag-curate ng app** ang nagpapasya kung aling mga komunidad, board, listahan, o post ang unang ipapakita ng isang produkto.

Pinapanatili nitong maliit ang protocol habang nag-iiwan ng puwang para sa maraming karanasan sa pagtuklas upang makipagkumpitensya.

## Paghahanap sa network

Ang bawat komunidad ay may matatag na address na nagmula sa pampublikong susi nito. Kapag alam na ng isang kliyente ang address na iyon, nagtatanong ito ng mga magaan na HTTP router upang maghanap ng mga kapantay na nag-anunsyo sa kanilang sarili bilang mga provider para dito.

Ang mga router ay nagbabalik lamang ng mga peer address ng provider. Hindi sila nag-iimbak ng mga post, metadata, mga listahan ng user, o isang nababasa ng tao na direktoryo ng mga komunidad. Pagkatapos matanggap ng kliyente ang mga peer address, kumokonekta ito sa mga peer na iyon at kinukuha ang pinakabagong metadata ng komunidad at mga pointer ng nilalaman, pagkatapos ay kinukuha ang aktwal na data ng post sa pamamagitan ng hash.

Sinasagot nito ang tanong sa protocol: "Saan ko makukuha ang pinakabagong estado para sa komunidad na ito?"

## Pag-curate ng app

Ang hiwalay na tanong sa produkto ay: "Aling mga komunidad ang dapat unang makita ng isang user?"

Iniiwan iyon ng bitsocial sa mga app, listahan, at user sa halip na mag-bake ng isang sagot sa network. Kasama sa mga halimbawa ang:

- isang kliyente na nagpapakita ng mga komunidad na sinusundan na ng user
- isang na-curate na default na listahan para sa isang Reddit-style na app
- mga direktoryo, kung saan nagpapaligsahan ang mga komunidad para sa isang pangalan ng paksa tulad ng `/g/` o `/s/funny`
- paghahanap o pagraranggo ng mga index na pinananatili ng isang partikular na app
- mga direktang link na ibinahagi ng mga user

Maaaring i-index, i-rank, i-filter, o i-highlight ng mga app ang iba't ibang bagay nang hindi ginagawang batas ng protocol ang mga pagpipiliang iyon. Kung hindi kapaki-pakinabang ang discovery surface ng isang app, maaaring bumuo ng ibang app ang isa pang app sa parehong pinagbabatayan na komunidad.

## Mga kasalukuyang app

Parehong gumagamit ang 5chan at Seedit ng [mga direktoryo](./directories.md): mga maikling route tulad ng `/g/` o `/s/funny` na pinagpapaligsahan ng mga komunidad. Nakalista ngayon ang mga kandidato sa isang pampublikong repository, at sinusubukan ng 5chan ang mga paligsahan sa botohan upang mapagpasyahan ang mga panalo.

Bukod dito, awtomatikong isinasa-subscribe ng Seedit ang mga bagong account sa isang default na listahan ng mga eksaktong komunidad. Maaari pa ring gawin at ibahagi ang mga komunidad sa labas ng mga listahang ito.

Sa parehong mga kaso, ang listahan sa antas ng app ay tumutulong sa mga user na makahanap ng isang bagay na bubuksan, at pagkatapos ay niresolba ng paghahanap sa antas ng protocol ang napiling komunidad sa mga kapantay.

## Bakit mahalaga ang split na ito

Ang isang solong desentralisadong network ay nangangailangan pa rin ng mahusay na pagtuklas, ngunit ang layer ng pagtuklas ay dapat na mapalitan. Nakatuon ang pangunahing protocol ng Bitsocial sa addressability, peer lookup, publishing, at anti-spam. Nabubuhay ang curation sa itaas ng layer na iyon, kung saan maaaring mag-eksperimento ang mga app sa mga direktoryo, default na listahan, feed, paghahanap, pagboto, at mga patakaran sa pagmo-moderate nang hindi nangangailangan ng paglipat sa buong network.
