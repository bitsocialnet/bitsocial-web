---
title: Ang Bitsocial at ang Bluesky
description: Kung paano maihahambing ang Bluesky at ang AT Protocol, kasama ang mga personal data server, relay at AppView nito, sa mga peer-to-peer na komunidad ng Bitsocial.
---

# Ang Bitsocial at ang Bluesky

Ang [Bluesky](https://bsky.app/) ay isang microblogging app na itinayo sa
[AT Protocol](https://atproto.com/), na dinisenyo ng Bluesky Social PBC. Hinahati ng protocol ang
isang social network sa magkakahiwalay na serbisyo: nagho-host ng mga account ang mga personal data
server, pinagsasama-sama ng mga relay ang mga ito sa iisang stream, at ini-index ng mga AppView ang
stream na iyon upang mabuo ang mga timeline at thread na nakikita ng mga tao. Inilalarawan ng
dokumentasyon nito ang data ng account bilang nakaimbak sa mga host server, "taliwas sa isang
peer-to-peer na modelo" ([overview](https://atproto.com/guides/overview)).

## Paano gumagana ang AT Protocol

- **Mga repository sa mga server.** Ang bawat post, like o follow ay isang record sa pirmadong
  repository ng may-akda, na naka-host sa isang personal data server (PDS). Ang Bluesky ang
  nagpapatakbo ng mga default na server, at maaaring mag-host ng sarili niyang server ang kahit
  sino.
- **Mga relay.** Nagsa-subscribe ang mga relay sa bawat PDS at muling isinasahimpapawid ang mga
  pagbabago bilang iisang stream, ang firehose. Mula nang magkaroon ng update sa protocol noong
  2025, hindi na nila ina-archive ang bawat repository, kaya naging mas mura ang pagpapatakbo sa
  kanila ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **Mga AppView.** Ini-index ng isang AppView ang buong firehose at naghahatid ito ng mga timeline,
  kumpletong thread ng mga sagot, mga bilang at paghahanap. Ito ang bahagi ng network na
  pinakamalakas kumonsumo ng resources.
- **Identity.** Ang account ay isang DID: kadalasan ay `did:plc`, na nakarehistro sa iisang
  pandaigdigang direktoryo, o `did:web`, na nakatali sa isang domain. Nakalista sa DID document ang
  handle, signing key at kasalukuyang server ng account. Ang PDS ang may hawak ng signing key;
  pinapayagan din ng `did:plc` ang mga user na humawak ng mga rotation key upang makalipat sila nang
  walang tulong ng dating host ([gabay sa identity](https://atproto.com/guides/identity)).
- **Mga handle.** Ang mga handle ay mga DNS name, gaya ng `alice.bsky.social` o isang domain na
  pagmamay-ari ng user, na bine-verify laban sa DID.
- **Pagmo-moderate.** Magkahiwalay na layer ang pagho-host at ang abot. Maaaring magpatakbo ng
  labeler ang kahit sino at maaaring pagpatung-patungin ng mga user ang mga ito
  ([gabay sa pagmo-moderate](https://atproto.com/guides/moderation)), ngunit palaging inilalapat ng
  Bluesky app ang sariling pagmo-moderate ng Bluesky. Maaaring limitahan ng mga may-akda kung sino
  ang puwedeng sumagot sa kanilang mga post at itago ang mga sagot.

## Saan sila nagkakaiba

### Mga server o mga peer

Nasa mga server ang data ng Bluesky: nagho-host ng bawat account ang isang PDS, dinadala ng mga
relay ang firehose, at inihahatid ng mga AppView ang ipinapakita ng mga kliyente. Ang browser ay
isang HTTP client ng mga serbisyong iyon, hindi kailanman isang peer. Sa Bitsocial, ang node ng
komunidad at ang mga peer na nagbabasa nito ang naghahatid ng nilalaman, at maaaring magpatakbo ang
isang web app ng sarili nitong peer-to-peer na node. Tingnan ang
[Peer-to-Peer sa Browser](/browser-p2p/).

### Pandaigdigang tanaw o mga komunidad

Dinisenyo ang AT Protocol para sa iisang pandaigdigang tanaw: nakikita ng isang AppView ang bawat
sagot, kaya kumpleto ang mga thread at paghahanap. Walang pandaigdigang index ang Bitsocial;
inilalathala ng bawat komunidad ang sarili nitong estado, at itinatayo ng mga app ang pagtuklas sa
ibabaw nito. Tingnan ang [Pagtuklas ng Nilalaman](/content-discovery/).

Sa ngayon, walang bagay na komunidad ang Bluesky para sa mga pampublikong post. Noong Hunyo 2026,
[inanunsyo nito ang mga native na komunidad](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k)
na may pagpo-post na nangangailangan ng pag-apruba sa ilang antas ng privacy; hindi pa nailulunsad
ang mga ito pagsapit ng Oktubre 2026. Sa Bitsocial, ang mga komunidad ang pangunahing bagay, at ang
node ng isang komunidad ang tumatanggap o tumatanggi sa mga post.

### Kontrol sa spam

Hinaharap ng Bluesky ang spam sa pamamagitan ng mga limitasyon sa rate sa mga server nito, mga
limitasyon sa mga bagong host sa relay, awtomatikong pagtukoy, pagsusuri ng tao at mga label, at
maaaring higpitan ng mga may-akda ang mga sagot. Walang tarangkahan sa antas ng komunidad na
nagpapasya kung ano ang kailangang malampasan ng isang post bago ito tanggapin. Sa Bitsocial,
pinipili ng bawat komunidad ang sarili nitong hamon. Tingnan ang
[Mga Pasadyang Anti-Spam na Hamon](/custom-challenges/).

### Sino ang may hawak ng mga key

Nagla-log in gamit ang password ang mga account sa sariling mga server ng Bluesky, at hawak ng mga
server na iyon ang kanilang mga signing key bilang tagapag-ingat
([Kleppmann et al.](https://arxiv.org/abs/2402.03239)). Ayon sa isang protocol engineer ng Bluesky,
[walang hiwalay na kontroladong rotation key ang karamihan sa mga account](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Ang identity sa Bitsocial ay isang keypair na nililikha at hinahawakan ng app ng user.

### Pagpapatakbo ng imprastraktura

Mura ang isang personal na server: inirerekomenda ng
[reference PDS](https://github.com/bluesky-social/pds) ang 1 GB na RAM para sa hanggang 20 user.
Malaking proyekto ang isang independiyenteng AppView para sa buong network; ang isang itinayo noong
2025 ay
[nagkakahalaga ng humigit-kumulang $200 bawat buwan](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w),
karamihan para sa 16 TB na imbakan. Walang pandaigdigang index na kailangang i-replicate ang
Bitsocial, at tumatakbo ang isang node ng komunidad sa pangkaraniwang hardware.

## Paghahambing

| Tanong                          | Bluesky (AT Protocol)                                                                                           | Bitsocial                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Kategorya                       | Mga federated na server na may pandaigdigang index                                                              | Peer-to-peer na network ng komunidad                                                            |
| Identity                        | DID, na kadalasang hawak ng server ang mga signing key                                                          | Mga Ed25519 keypair para sa mga user at komunidad                                               |
| Saan nakalagak ang mga post     | Ang repository ng may-akda sa isang personal data server                                                        | Ang node ng may-ari ng komunidad at ang mga peer na nagbabasa at nagse-seed nito                |
| Sino ang nagpapanatiling online | Mga PDS host, relay at AppView, na ang Bluesky ang nagpapatakbo bilang default                                  | Node ng may-ari ng komunidad kasama ang mga katulong na seeder                                  |
| Mga komunidad                   | Wala pa para sa mga pampublikong post (inanunsyo noong 2026)                                                    | First-class na mga bagay na ang node ang tumatanggap o tumatanggi sa mga post                   |
| Kontrol sa spam                 | Mga limitasyon sa rate ng server, awtomatikong pagtukoy, mga label, kontrol sa mga sagot                        | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                      |
| Pagmo-moderate                  | Mga labeler na maaaring pagpatung-patungin; palaging inilalapat ng Bluesky app ang pagmo-moderate ng Bluesky    | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita |
| Mga pangalan                    | Mga DNS handle na bine-verify laban sa DID                                                                      | Mga pangalang `.bso` at `.eth` na nireresolba sa mga key                                        |
| Browser                         | HTTP client ng isang PDS at ng isang AppView                                                                    | Peer-to-peer na node sa loob ng karaniwang browser tab                                          |
| Pangunahing palitan             | Kumpletong pandaigdigang thread at paghahanap, ngunit nangangailangan ng mabibigat na server ang pagsasama-sama | Walang mabigat na pandaigdigang index, ngunit walang kumpletong tanaw sa buong network          |
