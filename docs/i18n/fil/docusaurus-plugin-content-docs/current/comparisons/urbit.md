---
title: Ang Bitsocial at ang Urbit
description: Kung paano maihahambing ang Urbit, isang network ng mga personal na server na may mga Urbit ID na nakabatay sa Ethereum at mga grupong pinatatakbo ng host sa Tlon Messenger, sa mga peer-to-peer na komunidad ng Bitsocial.
---

# Ang Bitsocial at ang Urbit

Ang [Urbit](https://urbit.org/) ay isang network ng mga personal na server. Ang bawat user ay may
laging-nakabukas na computer na tinatawag na barko, na nagpapatakbo ng sariling operating system ng
Urbit (Arvo), na isinulat sa sarili nitong mga wika (Nock at Hoon), at kinikilala sa pamamagitan ng
isang Urbit ID. Ang pangunahing social app nito ay ang [Tlon Messenger](https://tlon.io/), na binuo
ng Tlon, ang kumpanyang itinatag noong 2013 upang i-develop ang Urbit.

Layunin ng Urbit na palitan ang buong computing stack, kaya mas malawak na proyekto ito kaysa sa
Bitsocial. Gayunman, gumagamit ang social layer nito ng modelong malapit sa Bitsocial: nakatira ang
isang komunidad sa node ng may-ari nito, at ang node na iyon ang nagpapasya kung ano ang
makakapasok. Nagkakaiba ang dalawa sa kung sino ang kailangang magpatakbo ng server at sa kung paano
inilalayo ang spam.

## Paano gumagana ang Urbit

- **Mga Urbit ID.** Ang bawat barko ay may Urbit ID: isang numerong ipinapakita bilang pangalang
  nabibigkas, gaya ng `~sampel-palnet`. Ang mga Layer 1 ID ay mga NFT na ang pagmamay-ari at mga
  public key para sa networking ay nakatala sa mga Azimuth contract sa Ethereum. Ang mga Layer 2 ID,
  na idinagdag noong 2021 upang bawasan ang mga bayarin, ay gumagamit ng "naive rollup": ipinapadala
  ang kanilang mga transaksyon sa Ethereum nang naka-batch, ngunit hindi iniimbak ang kanilang
  pagmamay-ari sa Azimuth contract, at kinakalkula ito ng bawat barko nang lokal. Nagpapatakbo ang
  Tlon ng roller na libreng magagamit ng publiko, ayon sa
  [dokumentasyon ng Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) at sa
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Isang nakapirming hierarchy.** Ang address space ay may 256 na galaksi, 65,536 na bituin at
  humigit-kumulang 4 na bilyong planeta para sa pang-araw-araw na paggamit. Naglalabas ang mga
  galaksi ng mga bituin, naglalabas ang mga bituin ng mga planeta, at ang bawat planeta ay maaaring
  maglabas ng mga buwan para sa sarili nitong mga device. Ang mga kometa ay mga libreng ID na
  binubuo ng isang barko para sa sarili nito at hindi kailanman napupunta sa blockchain. Binubuo ng
  mga may-ari ng galaksi ang Galactic Senate, na bumoboto sa mga upgrade sa mga Azimuth contract at
  naghahalal ng board ng Urbit Foundation.
- **Networking.** Nagpapalitan ang mga barko ng mga naka-encrypt na packet nang peer-to-peer. Mula
  Hulyo 2026, ang protocol ng network ay ang
  [Directed Messaging](https://urbit.org/blog/directed-messaging), isang content-centric na muling
  pagsulat ng mas lumang Ames protocol. Ang mga galaksi ang humahawak sa paghahanap ng mga peer:
  sinusubaybayan ng bawat isa kung nasaan ang mga barkong nasa ilalim nito, at nire-relay nito ang
  mga packet sa kanila hanggang sa direktang magkaabot ang dalawang barko, o hangga't may firewall
  na pumipigil doon, ayon sa
  [papel tungkol sa Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Mga grupo.** Sa Tlon Messenger, ang isang grupo ay hino-host ng barko ng lumikha nito.
  Nagpapadala ang mga miyembro ng mga mensahe sa host, na nagpapamahagi ng mga ito sa barko ng
  bawat miyembro, at nag-iingat ang barko ng bawat miyembro ng sarili nitong kopya, ayon sa
  [FAQ ng Tlon](https://tlon.io/posts/faq). Kontrolado ng host ang mga tungkulin, channel at
  pagpasok. Maaaring pampubliko, pribado o lihim ang isang grupo, at maaari itong
  [mag-ban ng mga indibidwal na barko o ng buong ranggo ng ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Ang mga channel ay mga chat, notebook o koleksyon ng mga larawan at link.
- **Hosting.** Kapag nag-sign up sa Tlon, binibigyan ang isang bagong user ng barkong pinatatakbo
  ng Tlon, na ang mga key ay nasa pag-iingat ng Tlon. Maaaring i-export ng user ang barko at ang
  master ticket nito at patakbuhin ito sa ibang lugar: sa isang
  [Native Planet](https://www.nativeplanet.io/) na device, o gamit ang Vere runtime sa Linux, macOS
  o Windows. Hindi pa kayang direktang mag-imbak ng malalaking file ang mga barko, kaya inilalagay
  ng Tlon Messenger ang mga larawan at iba pang media sa cloud storage na compatible sa S3.

## Saan sila nagkakaiba

### Sino ang kailangang magpatakbo ng server

Sa Urbit, server ang bawat kalahok. Ang mga app ng Tlon ay mga front end para sa sariling barko ng
user, at kahit ang pagbabasa ng isang grupo ay dumadaan dito. Ang mga taong hindi mismo
nagpapatakbo ng barko ay umuupa ng isa, na nagbabalik ng hosting provider sa larawan: hawak ng Tlon
ang mga key ng mga naka-host na user at nagpapanatili ito ng limitadong access para sa maintenance,
bagaman maaaring umalis ang mga user dala ang kanilang buong barko.

Sa Bitsocial, mga may-ari lamang ng komunidad ang nangangailangan ng laging-nakabukas na node.
Maaaring magpatakbo ang mga mambabasa at nagpo-post ng peer-to-peer na node sa loob ng browser tab,
at ang kanilang account ay isang keypair na iniingatan ng app. Tingnan ang
[Peer-to-Peer sa Browser](/browser-p2p/). Kapag gumamit naman ang isang tao ng naka-host na node,
layunin ng disenyo ng Bitsocial na hayaan siyang ipaubaya ang uptime nang hindi isinusuko ang
pag-iingat sa kanyang identity. Tingnan ang
[Pagkakakilanlan at Pagmamay-ari ng Komunidad](/identity-and-ownership/).

### Ang host ng komunidad

Dito pinakamalapit ang dalawa. Kapwa nakatira ang isang grupo ng Tlon at isang komunidad ng
Bitsocial sa node ng may-ari nito. Ang host ang nagpapasya kung sino ang maaaring mag-post,
nagpapatupad ng pagmo-moderate at nagpapamahagi ng resulta, at walang protocol sa dalawa ang
naglalagay ng moderator sa itaas ng host. Sa pareho, kailangang online ang host. Sinasabi ng FAQ ng
Tlon na kapag nag-offline ang host, "babagsak ang grupo kasama nila", at hindi makatatanggap ng mga
bagong post ang isang komunidad ng Bitsocial habang offline ang node nito.

Magkaiba ang paraan nila ng pag-iimbak ng nilalaman. Nag-iingat ang barko ng bawat miyembro ng
kopya ng kasaysayan ng grupo, kaya nababasa pa rin ng mga miyembro ang natanggap na nila habang
down ang host. Kinukuha ng isang mambabasa ng Bitsocial ang pinakabagong estado ng komunidad mula
sa node ng komunidad o mula sa mga peer na nagse-seed nito, kaya nananatiling nababasa ang isang
offline na komunidad hangga't hawak ito ng mga peer, ngunit ang pinakabagong estado lamang ang
iniingatan ng network.

May listahan din ng miyembro ang isang grupo ng Tlon, at maaari itong gawing para lamang sa mga
inimbitahan ng host nito. Walang pagiging miyembro sa isang komunidad ng Bitsocial: maaaring
basahin ito ng sinuman, at maaaring subukan ng sinuman na mag-post, alinsunod sa hamon nito.

### Spam at identity

Nilalabanan ng Urbit ang spam sa pamamagitan ng paggawang mahirap makuha ang identity. Nakapirmi
ang bilang ng mga planeta at bawat isa ay inilalabas ng isang bituin. Nalulusutan ng mga libreng
kometa ang kakapusang iyon, kaya tinatanggihan ang mga ito ng mga grupong nais itong manatili:
binabanggit ng dokumentasyon ng Urbit na may mga grupong tumatanggi sa mga kometa, at maaaring
i-ban ng isang grupo ng Tlon ang buong ranggo ng kometa sa iisang setting. Kapag naharangan na ang
mga kometa, kailangan ng isang na-ban na user ng panibagong planeta mula sa may-ari ng isang bituin
upang makabalik. Maaari ring sumunod ang reputasyon sa hierarchy: may Censures contract ang Azimuth
na nagbibigay-daan sa mga galaksi at bituin na mag-flag ng mga ID. Dahil nakapaloob ang kakapusan
sa address space, pareho ang paggana nito sa bawat grupong tumatanggi sa mga kometa.

Mga libreng keypair ang mga identity sa Bitsocial. Pinipili ng bawat komunidad ang sarili nitong
hamon bago tumanggap ng post, gaya ng captcha, bayad, balanse ng token o allowlist, at maaaring
pumili nang iba ang ibang mga komunidad. Tingnan ang
[Mga Pasadyang Anti-Spam na Hamon](/custom-challenges/).

### Blockchain at pamamahala

Nakadepende sa Ethereum ang identity layer ng Urbit. Itinatala ng mga Azimuth contract ang
pagmamay-ari sa Layer 1 at ang mga key para sa networking, ipinapadala sa Ethereum nang naka-batch
ang mga transaksyon sa Layer 2, at maaaring i-upgrade ng Galactic Senate ang contract na
namamahala sa Azimuth. Ang parehong 256 na galaksi ang humahawak din sa paghahanap ng mga peer at
sa pag-relay, kaya iisang nakapirming hanay ng mga identity ang nagdadala kapwa ng pamamahala at ng
bahagi ng routing ng network.

Mga keypair na hindi kailangang irehistro ang mga identity sa Bitsocial. Ang mga pangalang `.bso`
at `.eth` ay mga opsyonal na alias na nireresolba sa mga ito. Dumadaan ang paghahanap ng mga peer
sa mga HTTP router na nagbabalik lamang ng mga address ng provider; maaaring magpatakbo ng isa ang
sinuman, at maaaring magpalit ng router ang mga kliyente sa pamamagitan ng pagbabago ng kanilang
configuration.

### Saklaw

Isang pangkalahatang-gamit na computer ang Urbit. Maaaring mag-host ang isang barko ng Git remote,
isang personal na knowledge base o mga AI agent, at isa lamang ang Tlon Messenger sa maraming
programa. Ang pagbuo para sa Urbit ay kadalasang nangangahulugan ng pagsulat ng mga Hoon app para
sa Arvo. Ang Bitsocial ay isang protocol para sa mga pampublikong komunidad, na may mga app gaya ng
[5chan](/apps/5chan/) at [Seedit](/apps/seedit/). Tumatakbo ito sa umiiral na stack (libp2p, IPFS
at ang browser) sa halip na palitan ito, at binubuo ang mga kliyente nito gamit ang karaniwang web
tooling. Tingnan ang [Bumuo ng sarili mong kliyente](/build-your-own-client/).

### Mga pribadong mensahe

Dito mas malakas ang Urbit. Direktang napupunta ang mga direktang mensahe mula sa isang barko
patungo sa isa pa, naka-encrypt ang lahat ng trapiko sa pagitan ng mga barko, at maaaring pribado
o lihim ang mga grupo. Binabanggit ng Tlon na naka-encrypt ang mga mensahe habang ipinapadala
ngunit iniimbak nang hindi naka-encrypt sa barko. Nakatuon ang Bitsocial sa mga pampublikong
komunidad at wala pa itong native na direktang mensahe.

## Kalagayan ng proyekto

Dumaan ang Urbit sa matinding kaguluhan. Noong Agosto 2024, sinibak ng Urbit Foundation, ang
nonprofit na gumagabay sa core development, ang executive director nito; bumalik ang tagapagtatag
na si Curtis Yarvin upang pamunuan ang estratehiya nang walang pormal na titulo, umalis ang ilang
core developer, at ilang buwan na lamang ang itatagal ng pondo ng Foundation,
[ayon sa ulat ng CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Iminungkahi ni Yarvin na ilipat ang Azimuth sa isang umiiral na layer 2 ng Ethereum, na malamang
ay Base, at maglabas ng mga fungible na "visa" token na maaaring i-convert sa mga planeta. Hanggang
Oktubre 2026, inilalarawan pa rin ng
[dokumentasyon ng ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) ng Urbit ang Azimuth sa
Ethereum kasama ang naive rollup nito. Noong Oktubre 2025, pinalitan ng Galactic Senate ang board
ng Foundation, at nagtalaga ang bagong board ng bagong executive director
([anunsyo](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Nagpapatuloy ang development. Naging live ang Directed Messaging sa release na 408k noong
Hulyo 14, 2026. Noong Hunyo 2026,
[binuksan ng Tlon Messenger ang pampublikong pag-sign up nang walang waitlist](https://urbit.org/blog/this-month-in-urbit-june-2026),
at ipinapakilala na ngayon ng Tlon ang sarili nito bilang lugar kung saan nagtutulungan ang mga tao
at mga AI agent.

## Paghahambing

| Tanong                          | Urbit                                                                                                                    | Bitsocial                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Kategorya                       | Network ng mga personal na server at operating system                                                                    | Peer-to-peer na network ng komunidad                                                                                         |
| Identity                        | Mga Urbit ID: humigit-kumulang 4 na bilyong planeta sa Ethereum o sa Layer 2 rollup nito, dagdag ang mga libreng kometa  | Mga Ed25519 keypair para sa mga user at komunidad                                                                            |
| Sino ang nagpapatakbo ng server | Bawat user, sa sarili nilang barko o sa isang naka-host                                                                  | Mga may-ari ng komunidad; maaaring gumamit ng browser tab ang mga mambabasa at nagpo-post                                    |
| Saan nakalagak ang mga post     | Ang barko ng host ng grupo at isang kopya sa barko ng bawat miyembro                                                     | Ang node ng may-ari ng komunidad at ang mga peer na nagbabasa at nagse-seed nito                                             |
| Mga komunidad                   | Mga grupong hino-host ng barko ng lumikha nito, na may listahan ng miyembro                                              | First-class na mga bagay na ang node ang tumatanggap o tumatanggi sa mga post                                                |
| Kontrol sa spam                 | Mahirap makuhang mga ID na inilalabas ng mga bituin; nagba-ban ang mga grupo ng mga barko o buong ranggo                 | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                                                   |
| Pagmo-moderate                  | Ang mga tungkulin at ban ng host ng grupo                                                                                | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita                              |
| Paghahanap ng mga peer          | Sinusubaybayan ng mga galaksi ang mga barkong nasa ilalim nila at nagre-relay para sa mga ito                            | Nagbabalik ang mga HTTP router ng mga provider peer at hindi nag-iimbak ng nilalaman                                         |
| Pamamahala                      | Bumoboto sa mga upgrade sa Azimuth ang Galactic Senate ng 256 na galaksi                                                 | Walang awtoridad sa antas ng protocol sa mga identity o komunidad                                                            |
| Mga pribadong mensahe           | Mga naka-encrypt na direktang mensahe at mga grupong para lamang sa mga inimbitahan                                      | Mga pampublikong komunidad; wala pang native na direktang mensahe                                                            |
| Pangunahing palitan             | Isang buong personal na computer na may mga pribadong grupo, ngunit kailangan ng bawat user ng laging-nakabukas na barko | Libreng identity at access sa browser, ngunit walang pribadong pagmemensahe at ang pinakabagong estado lamang ang iniingatan |
