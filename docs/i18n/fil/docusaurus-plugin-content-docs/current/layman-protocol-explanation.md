---
title: Isang kumpletong paliwanag ng karaniwang tao sa Bitsocial protocol
description: Isang simpleng walkthrough na Ingles ng mga komunidad ng Bitsocial, paghahanap ng peer, pag-publish, mga hamon laban sa spam, pag-moderate, at mga app.
---

# Isang kumpletong paliwanag ng karaniwang tao sa Bitsocial protocol

Ipinapaliwanag ng page na ito ang Bitsocial nang hindi ipinapalagay na naiintindihan mo na ang peer-to-peer networking, cryptographic key, IPFS, o pubsub.

Ang ilang mga detalye ay sadyang pinasimple. Para sa mas teknikal na bersyon, basahin ang pahina ng [Protokol ng Peer-to-Peer](./peer-to-peer-protocol.md).

## Ang maikling bersyon

Ang Bitsocial ay isang protocol para sa mga social app kung saan ang mga komunidad ay pagmamay-ari ng mga susi sa halip ng isang database ng kumpanya.

May address ang isang Bitsocial na komunidad. Ginagamit ng mga app ang address na iyon upang maghanap ng mga kapantay na naglilingkod sa komunidad, kumuha ng mga pinakabagong post mula sa mga kapantay na iyon, at mag-publish ng mga bagong post sa pamamagitan ng channel ng mensahe ng peer-to-peer. Bago tanggapin ang isang post, maaaring humiling ang komunidad ng laban sa spam na hamon gaya ng captcha, code ng imbitasyon, pagbabayad, tseke ng token, tseke sa moderation ng AI, allowlist, o anumang iba pang panuntunang maaaring i-code.

Iyon ang pangunahing ideya:

1. Ang isang komunidad ay kinokontrol ng isang pribadong susi.
2. Ang pampublikong susi ay nagbibigay sa komunidad ng isang matatag na address.
3. Tinutulungan ng mga kapantay ang mga mambabasa na mahanap at makuha ang komunidad.
4. Ang isang community node ay tumatanggap o tumatanggi sa mga bagong post.
5. Ang patakaran sa anti-spam ay kabilang sa bawat komunidad, hindi sa isang pandaigdigang platform.

## Bakit mahalaga ang mga hash

Ang hash ay isang maikling fingerprint para sa data.

Kung ang dalawang tao ay nagha-hash ng eksaktong parehong file, makakakuha sila ng parehong fingerprint. Kung magbabago ang file, magbabago ang fingerprint. Ginagawa nitong kapaki-pakinabang ang mga hash para sa paghahanap at pagsuri ng data nang hindi nagtitiwala sa isang kumpanya na sasabihin sa iyo kung ano ang file.

Ang mga peer-to-peer system ay patuloy na gumagamit ng ideyang ito. Sa halip na tanungin ang isang website para sa "ang file na pinangalanang photo.png", maaaring hilingin ng isang peer sa network ang data na may partikular na fingerprint. Kung ibinalik ng isa pang peer ang maling data, mabibigo ang hash check.

Gumagamit ang Bitsocial ng mga hash at content identifier para sa data ng post at iba pang bahagi ng estado ng komunidad. Ang mahalagang punto ay simple: ang data ay maaaring matugunan ng kung ano ito, hindi lamang sa kung saan ang isang kumpanya ay nagho-host nito.

## Bakit mahalaga ang mga pampublikong susi

Ang pampublikong susi at pribadong susi ay magkatugmang pares.

Ang pribadong susi ay sikreto. Ito ang bagay na nagbibigay ng kontrol. Ang pampublikong susi ay ligtas na ibahagi. Hinahayaan nito ang lahat na suriin kung ang isang mensahe, pag-update, o pag-moderate na pagkilos ay talagang nagmula sa katugmang pribadong key.

Ito ay kung paano iniiwasan ng Bitsocial ang mga normal na platform account. Ang isang kumpanya ay hindi kailangang magbigay ng pagkakakilanlan. Ang isang hilera ng database ay hindi kailangang tukuyin ang may-ari. Ang keypair ay ang awtoridad.

Sa madaling salita:

- ang pribadong key ay ang control handle ng may-ari
- ang pampublikong susi ay ang pampublikong pagkakakilanlan o address
- ang mga lagda ay nagpapatunay na ang isang aksyon ay nagmula sa may-ari

## Ano ang isang Bitsocial na komunidad

Ang isang Bitsocial na komunidad ay hindi lamang isang pahina sa isang app.

Mayroon itong sariling keypair. Ang pampublikong susi ay nagbibigay sa komunidad ng isang matatag na address ng network. Kinokontrol ng pribadong key ang mga update sa estado ng komunidad, tulad ng metadata, mga panuntunan, listahan ng moderator, configuration ng hamon, at mga pointer sa pinakabagong tinatanggap na nilalaman.

Nangangahulugan iyon na ang isang komunidad ay maaaring lumampas sa isang interface. Maaaring ipakita ito ng isang app bilang isang board. Maaaring ipakita ito ng isa pang app bilang isang forum. Maipapakita ito ng isang app sa hinaharap sa isang feed na nakabatay sa profile. Maaaring magbago ang app, ngunit ang address ng komunidad ay tumuturo pa rin sa parehong komunidad na pagmamay-ari.

## Paano gumagana ang pagbabasa

Kapag ang isang user ay nagbukas ng isang Bitsocial na komunidad, ang app ay hindi humihingi ng isang sentral na database para sa pahina.

Ang daloy ay mas malapit dito:

1. Alam na ng app ang address ng komunidad, o nakukuha ito mula sa isang listahan, link, surface ng paghahanap, o
   pangalan na nababasa ng tao.
2. Nagtatanong ang app sa mga magaan na router kung aling mga kapantay ang kasalukuyang nagbibigay ng address ng komunidad na iyon.
3. Ang mga router ay nagbabalik ng mga peer address lamang. Hindi sila nagbabalik ng mga post, panuntunan, profile, o komunidad
   metadata.
4. Kumokonekta ang app sa mga kapantay at kinukuha ang pinakabagong estado ng komunidad.
5. Ang estado na iyon ay naglalaman ng mga payo para mag-post ng nilalaman.
6. Kinukuha ng app ang nilalaman ng post mula sa mga kapantay at ginagawa ito sa isang normal na interface sa lipunan.

Ang router ay isang lookup helper lamang. Ito ay mas malapit sa pagtatanong "sino ang mayroon nito?" kaysa sa pagtatanong ng "pakihatid sa akin ang buong website."

Para sa karagdagang detalye sa split na ito, basahin ang [Pagtuklas ng Nilalaman](./content-discovery.md).

## Paano gumagana ang pag-post

Ang pag-post ay iba sa pagbabasa dahil maaaring ma-spam ang mga bukas na peer-to-peer network.

Pinangangasiwaan ng Bitsocial ang pag-publish sa pamamagitan ng daloy ng pagtugon sa hamon:

1. Ang gumagamit ay nagsusulat ng isang post o tugon.
2. Sumasali ang app sa paksa ng peer-to-peer na mensahe ng komunidad.
3. Humihingi ng hamon ang app sa node ng komunidad.
4. Ibinabalik ng community node ang hamon.
5. Kinukumpleto ng user o app ang hamon.
6. Ipinapadala ng app ang post kasama ang sagot sa hamon.
7. Sinusuri ng node ng komunidad ang sagot at ang post.
8. Kung pumasa ito, tatanggapin ng community node ang post sa susunod na update ng komunidad.
9. Kinukuha ng ibang mga mambabasa ang na-update na estado ng komunidad mula sa mga kapantay.

Nangyayari ang hamon bago maging bahagi ng tinatanggap na estado ng komunidad ang post. Iyon ang mahalagang pagkakaiba sa mga system kung saan unang tinatanggap ang spam at nakatago sa ibang pagkakataon.

## Bakit mahalaga ang mga hamon sa anti-spam

Karamihan sa mga social platform ay ginagawang patakaran sa platform ang anti-spam. Isang kumpanya ang nagpapasya kung ano ang maituturing na isang wastong account, wastong post, wastong abot, o wastong user.

Pinaghihiwalay ng bitsocial ang mga bagay na iyon. Ang protocol ay nagbibigay sa mga komunidad ng paraan upang mangailangan ng hamon bago tumanggap ng post, ngunit hindi nito pinipilit ang bawat komunidad na gamitin ang parehong hamon.

Maaaring gumamit ng captcha ang isang komunidad. Maaaring gumamit ang iba ng mga code ng imbitasyon. Ang isa pa ay maaaring mangailangan ng tseke sa SMS, isang pagbabayad, isang NFT, isang balanse ng token, isang marka ng moderation ng AI, isang patunay ng reputasyon, isang allowlist na partikular sa komunidad, o isang custom na panuntunan.

Mahalaga ang flexibility na iyon dahil nagbabago ang spam. Nagiging lipas na ang isang panuntunan sa spam sa antas ng protocol. Ang isang hamon sa antas ng komunidad ay maaaring umunlad nang hindi lumilipat sa buong network.

Para sa nakatutok na paliwanag, basahin ang [Mga Pasadyang Anti-Spam na Hamon](./custom-challenges.md).

## Paano gumagana ang moderation

Ang bitsocial ay hindi moderation-free. Ito ay moderation na walang isang pandaigdigang super-admin.

Ang isang komunidad ay maaaring magkaroon ng mga may-ari at moderator. Ang mga address ng moderator ay bahagi ng estado ng komunidad. Kapag gumawa ng aksyon ang isang moderator, maaaring lagdaan ang pagkilos na iyon. Maaaring suriin ng node ng komunidad at mga kliyente ang lagda laban sa listahan ng moderator.

Nagbibigay iyon ng pagmo-moderate ng isang lokal na saklaw:

- isang may-ari ng komunidad ang kumokontrol sa komunidad na iyon
- kumikilos ang mga moderator sa pamamagitan ng mga susi na kinikilala ng komunidad
- Maaari pa ring piliin ng mga app kung ano ang kanilang ini-index, niraranggo, itatago, o iha-highlight
- walang protocol-level na account ng kumpanya ang maaaring magbura ng bawat pagkakakilanlan o sakupin ang bawat komunidad

Sa pagsasagawa, nangangahulugan ito na ang isang komunidad ay maaaring mag-alis ng spam o magpatupad ng mga panuntunan sa loob ng sarili nitong espasyo nang hindi ginagawang batas ang mga panuntunan nito para sa buong network.

Para sa view ng patakaran, basahin ang [Lokal na Moderation, Hindi Global Bans](./local-moderation.md).

## Anong mga app ang idinagdag

Ang protocol ay hindi nagpapasya kung ano ang magiging hitsura ng buong produkto.

Ang isang app ay nagdaragdag ng karanasan ng tao sa paligid ng protocol:

- mga default na listahan ng komunidad
- paghahanap at pagtuklas
- mga feed at ranggo
- layout at interface ng pag-post
- paghawak ng media
- mga tool sa pagmo-moderate
- mobile, desktop, o browser packaging
- modelo ng negosyo at mga default

Kaya naman kayang suportahan ng Bitsocial ang iba't ibang istilo ng app. Ang 5chan ay maaaring parang isang imageboard. Ang Seedit ay maaaring parang forum-style na talakayan. Ang ibang mga kliyente ay maaaring bumuo ng iba't ibang discovery surface, ranking system, moderation view, o community default habang gumagamit pa rin ng mga katugmang Bitsocial na komunidad sa ilalim.

Pinapanatili ng protocol ang pagmamay-ari at pag-publish na portable. Ang mga app ay nakikipagkumpitensya sa kalidad ng produkto.

## Ano ang idinaragdag ng pampublikong RPC

Ang direktang pagpapatakbo ng isang peer-to-peer na node ng komunidad ay makapangyarihan, ngunit hindi lahat ay gustong mamahala ng palaging naka-on na makina.

Ang Public RPC ay ang layer ng serbisyo na maaaring gawing mas maginhawa ang Bitsocial. Ang isang pampublikong provider ng RPC ay maaaring makatulong sa mga user na pamahalaan ang mga komunidad mula sa isang telepono o magaan na kliyente, habang ang pangmatagalang modelo ng pagmamay-ari ay dapat pa ring hayaan ang mga user na lumayo, mag-host ng sarili, o pumili ng isang nakikipagkumpitensyang provider.

Mahalaga ang pagkakaiba:

- Makakatulong ang RPC sa uptime at kaginhawahan
- Ang RPC ay hindi dapat maging permanenteng kustodiya
- ang relasyon ng may-ari ay dapat manatiling nakatali sa mga susi, hindi sa database ng isang provider

## Ano ang hindi Bitsocial

Ang Bitsocial ay hindi isang blockchain social network. Hindi kailangan ng social media ang bawat post para maging isang transaksyon sa isang global ledger.

Ang Bitsocial ay hindi federation sa kahulugan ng ActivityPub. Ang isang komunidad ay hindi kailangang maging isang account sa isang server na may isang domain, isang admin, at isang database ng server.

Ang Bitsocial ay hindi rin isang app. Isa itong shared protocol layer para sa mga app, komunidad, node, router, RPC provider, discovery services, anti-spam modules, at moderation tool.

Ang punto ay hindi kailangang maunawaan ng bawat gumagamit ang lahat ng ito bago mag-post. Ang punto ay maaaring maging normal ang pakiramdam ng produkto habang iba ang modelo ng pagmamay-ari sa ibaba.

## Kung saan ang susunod na pupuntahan

- Ipinapaliwanag ng [Protokol ng Peer-to-Peer](./peer-to-peer-protocol.md) ang teknikal na daloy.
- [Pagtuklas ng Nilalaman](./content-discovery.md) explains network lookup versus app curation.
- [Mga Pasadyang Anti-Spam na Hamon](./custom-challenges.md) explains the challenge system.
- [Pagkakakilanlan at Pagmamay-ari ng Komunidad](./identity-and-ownership.md) explains key-controlled
  pagmamay-ari.
- Ipinapaliwanag ng [Bumuo ng sarili mong kliyente](/build-your-own-client/) kung paano makakabuo ang mga independent app
  ang parehong network.
