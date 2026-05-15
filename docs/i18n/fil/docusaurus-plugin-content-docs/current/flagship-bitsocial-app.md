---
title: Flagship Bitsocial App
description: "Ang iminungkahing kliyenteng Bitsocial na nakabatay sa profile: pamilyar tulad ng X/Twitter bilang default, ngunit may mga mapapalitang RPC, feed, algorithm, ad, at komunidad."
---

# Flagship Bitsocial App

Ang punong barko na Bitsocial app ay ang iminungkahing unang kliyente na nakabatay sa profile para sa network. Ang pinakasimpleng paghahambing ay: pamilyar tulad ng X/Twitter bilang default, ngunit nabuksan ang layer ng platform.

Magdaragdag ito ng mga profile, mga sumusunod, mga tugon, mga feed, mga komunidad, mga notification, at real-time na pampublikong pag-uusap habang pinananatiling napapalitan ang mga pinagbabatayan na serbisyo. Pinatunayan ng 5chan na maaaring gumana ang mga hindi kilalang komunidad. Gumagalaw ang Seedit patungo sa patuloy na talakayan. Dadalhin ng flagship app ang mga epekto ng network na iyon sa isang pangunahing social feed nang hindi ginagawang may-ari ng graph ang isang kumpanya.

Inilalarawan ng page na ito ang direksyon ng produkto, hindi isang naka-lock na spec ng release. Ang eksaktong interface, default na feed, modelo ng ad, mga feature ng AI, at marketplace ng RPC ay maaaring magbago habang tumatanda ang protocol at mga maagang app.

## Ano ang dapat nitong patunayan

Dapat patunayan ng app na maiiwasan ng isang social network na nakabatay sa profile ang pagiging custodial platform:

- ang mga gumagamit ay maaaring magkaroon ng mga pagkakakilanlan at profile
- maaaring manatiling peer-to-peer ang mga komunidad at profile node
- ang mga komunidad ay maaaring magdala ng mga epekto sa network sa mga kliyenteng Bitsocial
- Maaaring gawing maginhawa ng mga provider ng RPC ang app nang hindi kumukusto
- Ang mga feed algorithm ay maaaring mga opsyonal na serbisyo sa halip na batas ng platform
- ang ibang mga kliyente ay maaari pa ring makipagkumpitensya para sa parehong network

Ang punto ay hindi gawin ang tanging Bitsocial na kliyente. Ang punto ay gawin ang unang malawak na kliyente na nagpapakita kung gaano kalayo ang protocol ay maaaring maabot.

## Pamilyar bilang default, mapapalitan ng disenyo

Ang default na karanasan ay dapat na mapagkumpitensya sa mga pangunahing app ng pampublikong pag-uusap: isang mabilis na home feed, mga sumusunod, mga tugon, repost-style na pamamahagi, mga komunidad, mga notification, paghahanap, at isang ranggo na Para sa Iyo na view na gumagana kaagad.

Maaaring patakbuhin ng Bitsocial Forge ang unang default na RPC at serbisyo ng feed. Ang default na iyon ay maaaring magsama ng isang ranggo na feed at mga ad upang ang app ay pakiramdam na kumpleto sa unang araw sa halip na hilingin sa mga pangunahing user na buuin ang buong stack sa kanilang sarili.

Ang pagkakaiba ay hindi dapat maging kulungan ang default. Ang isang user ay dapat na makapagpalit ng mga RPC, feed, instance, ranking system, ad, at discovery provider, o ganap na alisin ang ranking. Ang app ay maaaring opinyon sa unang paglulunsad habang pinapanatili ang bawat pangunahing serbisyo na maaaring palitan.

Ginagawa nitong mas napapasadya ang app kaysa sa isang kumbensyonal na platform. Maaaring panatilihin ng isang user ang default na ranggo na feed na may mga ad. Ang isa pa ay maaaring gumamit ng chronological feed na walang ranking. Ang isa pa ay maaaring pumili ng isang RPC na nakatuon sa privacy, isang serbisyo sa pagtuklas na pinapatakbo ng komunidad, isang bayad na feed na walang ad, o isang niche algorithm na binuo para sa isang partikular na subculture.

## Mga komunidad ng cross-client

Ang mga komunidad ay dapat na mas mahalaga kaysa sa mga nakahiwalay na grupo sa loob ng isang app.

Sa X/Twitter, ang mga komunidad ay nakakulong sa loob ng X. Maaari silang maging kapaki-pakinabang, ngunit minana nila ang mga limitasyon ng isang platform, isang account system, isang stack ng rekomendasyon, at isang surface ng produkto.

Ang isang Bitsocial na komunidad ay maaaring gawin, i-host, matuklasan, at magamit sa pamamagitan ng iba't ibang kliyente. Ibig sabihin, maaaring magpakita ang flagship app ng mga komunidad at post mula sa mas malawak na network ng Bitsocial, hindi lamang mula sa mga user na nagsimula sa loob ng flagship app. Ang isang komunidad ay maaaring magkaroon ng aktibidad mula sa isang imageboard client, isang Reddit-style na discussion client, isang niche forum client, isang mobile app, at ang flagship app sa parehong oras.

Iyon ang pangunahing bentahe sa epekto ng network: ang isang kliyente ay maaaring maging pamilyar sa mga pangunahing gumagamit habang kumukuha pa rin ng halaga mula sa maraming kliyente, mga node ng komunidad, mga tagapagbigay ng RPC, at mga independiyenteng serbisyo.

## Opsyonal na mga algorithm ng feed

Hindi dapat pilitin ng flagship app ang isang global ranking system sa lahat.

Dapat na opt-in ang mga algorithm ng feed. Ang isang user ay maaaring pumili ng isang algorithm mula sa isang marketplace, lumipat ng mga provider, gumamit ng isang algorithm mula sa isang kumpanya, gumamit ng isa na pinapatakbo ng isang hindi kilalang operator, gumamit ng isa na binuo ng isang komunidad, magpatakbo ng isang personal, o hindi gumamit ng anumang algorithm.

Ang mga pampublikong tagapagbigay ng RPC ay isang natural na lugar para sa mga serbisyong ito upang makipagkumpitensya. Maaari silang mag-index, mag-rank, at magrekomenda ng nilalaman, ngunit hindi nila dapat pagmamay-ari ang user o ang profile.

Ang mga serbisyong iyon ay maaari ding makipagkumpitensya sa hugis ng app mismo. Maaaring magbigay ang isang RPC ng ranggo na feed na may mga ad. Ang isa pa ay maaaring magbigay ng walang ranggo na kronolohikal na feed. Ang isa pa ay maaaring magpakadalubhasa sa privacy, pagsasalin, pagmo-moderate, pagtuklas ng komunidad, o isang angkop na social graph.

Kung gagana ang ekonomiya, ang mga serbisyo ng feed na sinusuportahan ng RPC ay maaaring magdagdag ng mga feature ng AI na katulad ng kung anong mga pangunahing platform ang sinusubukang ilagay sa kanilang mga feed: mga awtomatikong pagsasalin, mga buod, mga tugon na tinulungan ng bot, mga sagot sa paghahanap, tulong sa pagmo-moderate, o konteksto ng istilo ng community-note.

Ang mga tampok na iyon ay dapat na mga pagpipilian sa serbisyo, hindi mga kinakailangan sa protocol. Ang isang default na RPC ay maaaring makipagkumpitensya sa pamamagitan ng pag-aalok ng mas mahusay na feed, ngunit ang mga user at kakumpitensyang kliyente ay dapat pa ring makapili ng mas simple, pribado, magkakasunod, walang ad, o mga alternatibong partikular sa komunidad.

## Non-custodial RPC

Ang bawat user ay dapat na makalahok bilang isang buong peer-to-peer node sa pamamagitan ng RPC nang hindi binibigyan ang RPC provider ng pagmamay-ari sa kanilang pagkakakilanlan o profile.

Ang naka-host na landas ay mahalaga dahil karamihan sa mga user ay hindi magsisimula sa pamamagitan ng pagpapatakbo ng isang server. Ang exit path ay kasing mahalaga: ang isang user ay dapat na makalipat sa kanilang sariling profile node sa low-spec na hardware, kabilang ang isang Raspberry Pi, kahit kailan nila gusto.

Iyan ang pagkakaiba sa pagitan ng kaginhawahan at pag-iingat.

## Bakit maaari itong maging isang everything-app

Kung ang Bitsocial Network ay nagbibigay sa mga app ng matibay na pagpapangalan, mga pagbabayad, tipping, mga parangal, at iba pang financial rail, ang flagship app ay maaaring maging higit pa sa isang feed client.

Ang mahalagang hadlang ay ang app ay hindi dapat maging bagong may-ari ng network. Maaari itong maging isang malaking kliyente, marahil kahit na ang pinakasikat na kliyente, habang nag-iiwan pa rin ng puwang para sa mga nakikipagkumpitensyang app, mga nakikipagkumpitensyang RPC, nakikipagkumpitensyang feed algorithm, at mga node ng profile na naka-host sa sarili.
