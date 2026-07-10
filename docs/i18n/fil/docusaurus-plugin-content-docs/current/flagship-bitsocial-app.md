---
title: I-desentralisa ang Twitter/X
description: "Ikatlong yugto ng master plan: isang nakatuon at desentralisadong alternatibo sa Twitter/X para sa pampublikong usapang nakasentro sa teksto, na may napapalitang imprastraktura."
---

# I-desentralisa ang Twitter/X

Ang Yugto 3 ay isang plano para bumuo ng nakatuon at desentralisadong alternatibo sa Twitter/X. Nasa sentro nito ang pampublikong usapang nakasentro sa teksto: maiikling post, reply, repost, follow, real-time na talakayan, at mga komunidad, habang binubuksan ang platform layer.

Ang Twitter/X ay nananatiling nakabatay sa mga post, teksto, at pagbabahagi ng mga ideya. Dapat makipagkumpitensya ang client ng Yugto 3 sa pangunahing karanasang iyon at gawin itong mahusay sa pambihirang paraan.

Inilalarawan ng pahinang ito ang direksyon ng produkto, hindi ang isang nakapirming release specification. Maaaring magbago ang eksaktong interface, default feed, modelo ng ads, mga AI feature, at RPC marketplace habang umuunlad ang protocol at mga unang app.

## Ano ang dapat nitong patunayan

Dapat patunayan ng client na maaaring maiwasan ng profile-based na social network ang pagiging custodial platform:

- maaaring pagmamay-ari ng mga user ang kanilang mga identity at profile
- maaaring manatiling peer-to-peer ang mga komunidad at profile node
- maaaring dalhin ng mga komunidad ang network effects sa iba't ibang Bitsocial client
- maaaring gawing maginhawa ng mga RPC provider ang client nang hindi inaangkin ang custody
- maaaring maging opsyonal na serbisyo ang mga feed algorithm sa halip na tuntuning ipinapataw ng platform
- maaari pa ring makipagkumpitensya ang ibang client para sa parehong network

Ang layunin ay buuin ang pinakamalakas na client para sa pampublikong usapan at ipakita kung hanggang saan kayang umabot ng protocol.

## Pamilyar ang layunin, napapalitan ang disenyo

Dapat makipagkumpitensya ang default na karanasan sa pinakapuso ng Twitter/X: mabilis na home feed, mga text post, follow, reply, pamamahagi sa pamamagitan ng repost, mga komunidad, notification, search, at isang ranked na For You view na gumagana agad.

Maaaring patakbuhin ng Bitsocial Forge ang unang default na RPC at feed service. Maaaring may ranked feed at ads ang default na iyon para maging kumpleto ang client mula pa sa unang araw, sa halip na hilingin sa karaniwang user na sila mismo ang bumuo ng buong stack.

Ang kaibahan ay hindi dapat maging kulungan ang default. Dapat makapagpalit ang user ng mga RPC, feed, instance, ranking system, ads, at discovery provider, o tuluyang alisin ang ranking. Maaaring magtakda ang client ng malinaw na default sa unang paglunsad habang nananatiling napapalitan ang bawat pangunahing serbisyo.

Ginagawa nitong mas nako-customize ang client kaysa sa karaniwang platform. Maaaring panatilihin ng isang user ang default na ranked feed na may ads. Maaaring gumamit ang iba ng chronological feed na walang ranking. Maaari namang pumili ang isa pa ng RPC na nakatuon sa privacy, community-run na discovery service, bayad na ad-free feed, o niche algorithm na ginawa para sa isang partikular na subculture.

## Mga komunidad sa iba't ibang client

Dapat maging mas mahalaga ang mga komunidad kaysa sa mga nakahiwalay na grupo sa loob ng iisang app.

Sa X/Twitter, nakakulong ang mga komunidad sa loob ng X. Maaari silang maging kapaki-pakinabang, pero minamana nila ang mga limitasyon ng iisang platform, account system, recommendation stack, at product surface.

Maaaring gumawa, mag-host, tumuklas, at gumamit ng isang Bitsocial community sa pamamagitan ng iba't ibang client. Ibig sabihin, maipapakita ng client ng Yugto 3 ang mga komunidad at post mula sa mas malawak na Bitsocial network, hindi lamang mula sa mga user na nagsimula roon. Maaaring sabay-sabay na magkaroon ng aktibidad ang isang komunidad mula sa imageboard client, Reddit-style na discussion client, niche forum client, mobile app, at client ng Yugto 3.

Iyan ang pangunahing bentahe ng network effect: maaaring maging pamilyar ang isang client sa karaniwang user habang kumukuha pa rin ng halaga mula sa maraming client, community node, RPC provider, at independiyenteng serbisyo.

## Mga opsyonal na feed algorithm

Hindi dapat ipilit ng client ng Yugto 3 ang iisang pandaigdigang ranking system sa lahat.

Dapat piliing i-on ang mga feed algorithm. Maaaring pumili ang user ng algorithm mula sa marketplace, magpalit ng provider, gumamit ng algorithm mula sa isang kumpanya, anonymous operator, o komunidad, magpatakbo ng sarili, o huwag gumamit ng anumang algorithm.

Natural na lugar ang mga pampublikong RPC provider para magpaligsahan ang mga serbisyong ito. Maaari silang mag-index, mag-rank, at magrekomenda ng content, pero hindi nila dapat pagmamay-ari ang user o profile.

Maaari ring makipagkumpitensya ang mga serbisyong ito sa mismong anyo ng client. Maaaring magbigay ang isang RPC ng ranked feed na may ads. Maaaring magbigay ang iba ng unranked na chronological feed. Maaari namang magpakadalubhasa ang isa pa sa privacy, pagsasalin, moderation, community discovery, o isang niche social graph.

Kung magiging maayos ang ekonomiya, maaaring magdagdag ang mga RPC-backed feed service ng mga AI feature na katulad ng sinusubukang ilagay ng mga mainstream platform sa kanilang mga feed: awtomatikong pagsasalin, buod, bot-assisted na reply, sagot sa search, tulong sa moderation, o context na katulad ng community notes.

Dapat maging pagpipilian sa serbisyo ang mga feature na ito, hindi requirement ng protocol. Maaaring makipagkumpitensya ang default na RPC sa pamamagitan ng mas mayamang feed, pero dapat makapili pa rin ang mga user at nakikipagkumpitensyang client ng mas simple, pribado, chronological, ad-free, o community-specific na alternatibo.

## Non-custodial na RPC

Dapat makalahok ang bawat user bilang ganap na peer-to-peer node sa pamamagitan ng RPC nang hindi ibinibigay sa RPC provider ang pagmamay-ari ng kanilang identity o profile.

Mahalaga ang hosted na paraan dahil hindi magsisimula ang karamihan ng user sa pagpapatakbo ng server. Mahalaga rin ang paraan para makaalis: dapat makalipat ang user sa sarili nilang profile node sa low-spec na hardware, kabilang ang Raspberry Pi, anumang oras.

Iyan ang pagkakaiba ng kaginhawaan at custody.

## Pampublikong usapan na pinalalakas ng Bitsocial Chain

Maaaring direktang dalhin ng Bitsocial Chain sa pampublikong usapan ang matatag na pagpapangalan, mga bayad, tip, gantimpala, at iba pang mekanismong pinansyal.

Nananatiling nakasentro ang client ng Yugto 3 sa mga post, teksto, pagbabahagi ng ideya, at real-time na talakayan habang nagbabahagi ng mga komunidad at network effect sa ibang Bitsocial client.
