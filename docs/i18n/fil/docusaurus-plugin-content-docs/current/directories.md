---
title: Mga Direktoryo
description: Paano hinahayaan ng mga Bitsocial app na magpaligsahan ang mga komunidad para sa isang pangalan ng paksa, sa halip na manatili ito sa kung sino ang unang umangkin dito.
---

# Mga Direktoryo

Sa Reddit, ang isang pangalan tulad ng `r/opensource` ay maaaring mapabilang sa iisang komunidad lamang, at kung sino ang may kontrol dito ang siyang humahawak nito. Kung gumawa ang mga moderator nito ng mga desisyong ayaw ng mga user, ang tanging alternatibo ay magsimula ng `r/opensource2`. Nagsisimula ang bagong komunidad nang walang kahit isang subscriber, kahit na karamihan sa mga nag-subscribe sa `r/opensource` ay may malasakit sa open source, hindi sa partikular na moderation team na iyon.

Iniiwasan ito ng mga Bitsocial app sa pamamagitan ng **mga direktoryo**. Ang direktoryo ay isang pangalan ng paksa, tulad ng `opensource`, na pinagpapaligsahan ng mga komunidad. Binubuksan ng maikling route para sa pangalang iyon ang komunidad na kasalukuyang nangunguna sa ranggo, kaya maaaring makuha ng mas mahusay na komunidad ang pangalan nang hindi humihingi ng pahintulot kaninuman.

## Paano ito gumagana

1. **Ang code ng direktoryo ay isang pangalan ng paksa.** Gumagamit ang Seedit ng mga route tulad ng `/s/funny`. Gumagamit ang 5chan ng mga path ng imageboard tulad ng `/g/`.
2. **Naglalaban ang mga komunidad bilang mga kandidato.** Ang bawat direktoryo ay may listahan ng mga kandidatong komunidad, na bawat isa ay may sariling eksaktong address, tulad ng `funny-posting.bso`.
3. **Ang kandidatong may pinakamataas na ranggo ang nananalo sa route.** Ipinapakita ng pagbubukas ng `/s/funny` ang kasalukuyang panalo.
4. **Walang nabubura kapag natalo.** Napapanatili ng komunidad na hindi nanalo ang address, mga post, at mga subscriber nito, at maaari pa rin itong buksan nang direkta ng sinuman.

## Ang pangalan ay pintuan sa harap, hindi pagkakakilanlan

Ang code ng direktoryo ay isang route lamang para sa pagtuklas. Lahat ng pangmatagalan ay tumuturo sa isang eksaktong komunidad:

- Ang pag-subscribe mula sa `/s/funny` ay pag-subscribe sa eksaktong address ng kasalukuyang panalo. Hindi kailanman iniimbak bilang subscription ang mismong code ng direktoryo.
- Laging ginagamit ng mga link ng post ang eksaktong address ng komunidad, kaya hindi maaaring biglang tumuro sa ibang komunidad ang isang lumang link pagkatapos magbago ang panalo.
- Kapag nagbago ang panalo, hindi ginagalaw ng Seedit ang mga umiiral na subscription at tinatanong nito ang bawat subscriber kung lilipat sa bagong panalo, pananatilihin ang dalawa, o pananatilihin ang kasalukuyang komunidad. Ang awtomatikong paglipat ay isang opt-in na setting para sa bawat direktoryo, at bawat awtomatikong paglipat ay nagpapakita ng abiso na may opsyong i-undo.

Kaya hindi inaagaw ng isang naglalabang komunidad ang mga subscription ninuman. Ang napapanalunan nito ay ang pangalan: dito napupunta ang mga bagong bisita, at binibigyan ang mga kasalukuyang subscriber ng pagpipiliang isang click lang. Ang mga mas gusto ang lumang komunidad ay mananatili rito.

## Bakit hindi sa nauna ang pangalan

- **Walang squatting.** Hindi sapat ang paghawak sa magandang pangalan. Kailangang manatiling pinakamahusay na kandidato para rito ang komunidad.
- **Walang admin na nagtatalaga ng mga pangalan.** Ang paglalaan ng isang administrator ay muling lilikha ng sentral na veto na idinisenyong alisin ng Bitsocial.
- **Nananatili sa mga kakumpitensya ang daan patungo sa audience.** Tinatarget ng isang karibal na komunidad ang parehong pangalan sa halip na magsimulang muli sa ilalim ng mas mababang uri ng pangalan.
- **Nagkakasundo ang mga kliyente sa panalo.** Niraranggo ng Seedit ang mga kandidato nang deterministiko, kaya ang bawat kliyenteng nagbabasa ng parehong pinal na snapshot ng direktoryo ay nagpapakita ng parehong panalo. Hindi nagpapalit ang Seedit ng ibang kandidato dahil lang pansamantalang hindi maabot ang panalo sa koneksyon ng isang user.

## Paano pinipili ang mga panalo ngayon

Inilalathala ang mga kandidato bilang mga JSON file sa repository na [bitsocialnet/lists](https://github.com/bitsocialnet/lists), isang file bawat direktoryo, at sumasali ang isang komunidad sa isang direktoryo sa pamamagitan ng pull request sa file nito. Isa itong pansamantalang hakbang sa pagsisimula. Ang layunin ay mapalitan ng botohan ang mga pull request bilang paraan ng pagpapasya sa mga panalo.

- Niraranggo ng **Seedit** ang mga kandidato ng isang direktoryo ayon sa score, pagkatapos ay ayon sa oras ng pagkakadagdag sa kanila, at pagkatapos ay ayon sa address. May revision number ang bawat file ng direktoryo, at anumang pagbabago sa mga kandidato o sa panalo nito ay naglalathala ng bagong revision.
- Nagpapatakbo ang **5chan** ng isang paligsahan sa botohan bawat direktoryo gamit ang [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Nagpapalitan ang mga kliyente ng mga pinirmahang balota sa libp2p gossipsub at sila mismo ang nagkukuwenta ng tally, nang walang server na nagbibilang ng mga boto. Kailangang may hawak na 5chan Pass, isang token na hindi maililipat, upang makaboto, at bawat may-hawak ay may isang boto. Ang pagboto para sa isang board na wala pa sa listahan ay nagnonomina rito. Kasalukuyang tumatakbo ang mga paligsahan sa Base Sepolia testnet, at hangga't hindi pa sila lumilipat mula sa testnet, ipinapakita ang mga tally ngunit hindi nito binabago ang pagkakasunod-sunod ng listahan.

## Protocol o app?

Hindi bahagi ng PKC, ang peer-to-peer na layer na nag-iimbak at naglilipat ng mga komunidad, ang mga direktoryo. Isa itong kumbensyon na inilalapat ng mga kliyente sa ibabaw nito, kasama ng mga default na listahan at paghahanap; tingnan ang [Pagtuklas ng Nilalaman](./content-discovery.md). Maaaring basahin ng isang kliyente ang parehong mga file ng direktoryo, maglathala ng sarili nito, o tuluyang laktawan ang mga direktoryo, at maaari pa ring buksan ng mga user ang anumang komunidad gamit ang address nito.
