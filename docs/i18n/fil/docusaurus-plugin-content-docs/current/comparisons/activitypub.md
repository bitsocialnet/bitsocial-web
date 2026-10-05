---
title: Ang Bitsocial at ang ActivityPub
description: Kung paano maihahambing ang Fediverse, kasama ang Mastodon para sa microblogging at ang Lemmy para sa mga komunidad na estilong Reddit, sa mga peer-to-peer na komunidad ng Bitsocial.
---

# Ang Bitsocial at ang ActivityPub

Ang [ActivityPub](https://www.w3.org/TR/activitypub/) ang pamantayan ng W3C sa likod ng Fediverse.
Pumipili ang mga user ng server, na tinatawag na instance, na nagho-host ng kanilang account, at
nagpapalitan ng mga post ang mga server. Ang [Mastodon](https://joinmastodon.org/) ang
pinakakilalang microblogging software nito; ang [Lemmy](https://join-lemmy.org/) naman ay isang link
aggregator at forum na estilong Reddit na binubuo ng mga komunidad ayon sa paksa, kaya ito ang
pinakamalapit na katapat sa Fediverse ng mga Bitsocial app gaya ng [Seedit](/apps/seedit/).

## Paano gumagana ang ActivityPub

- **Mga inbox at outbox.** May inbox at outbox ang bawat account. Inihahatid ng mga server ang mga
  activity sa mga inbox sa ibang mga server, at nag-iimbak ang bawat tumatanggap na server ng sarili
  nitong kopya ng mga sinusundan ng mga user nito.
- **Identity na pag-aari ng server.** Ang mga ID ng account at ng post ay mga HTTPS address sa
  domain ng pinagmulang server. Ang handle sa Mastodon ay `@user@domain`, na nireresolba gamit ang
  WebFinger, at ang server ang pumipirma sa mga mensahe ng federation para sa user.
- **Mga kliyente.** Nakikipag-ugnayan lamang ang mga app at browser sa sariling server ng user, sa
  pamamagitan ng API ng server na iyon.
- **Mga komunidad sa Lemmy.** Ang komunidad ay isang group actor na naka-host sa isang instance.
  Nagpapadala ang mga user ng mga post sa komunidad, na muling isinasahimpapawid ang mga ito sa mga
  tagasunod nito; sa ilalim ng pinagsasaluhang pamantayan para sa mga forum
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)), maaaring
  suriin muna ng komunidad ang mga post, hanggang sa manwal na pag-apruba ng mga moderator.
- **Pagmo-moderate.** Lokal sa bawat server ang pagmo-moderate. Maaaring mag-suspend ng mga account
  ang mga admin, mag-block ng buong mga server o makipag-federate lamang sa mga nasa allowlist; may
  mga moderator din ang Lemmy para sa bawat komunidad.
- **Kontrol sa spam.** Walang itinatakdang mekanismong anti-spam ang ActivityPub. Sinasala ng
  Mastodon at Lemmy ang mga pag-sign up sa pamamagitan ng pag-apruba, mga imbitasyon, mga tanong sa
  aplikasyon, mga captcha at pagsusuri ng email, at pagkatapos ay umaasa sa mga limitasyon sa rate,
  mga ulat at pagmo-moderate.

## Saan sila nagkakaiba

### Pag-aari ng isang domain ang identity

Pag-aari ng domain ng server nito ang isang account sa Fediverse. Maaaring i-redirect ng Mastodon
ang mga tagasunod sa isang bagong account, ngunit
[hindi lumilipat ang mga post](https://docs.joinmastodon.org/user/moving/), kailangang simulan ang
paglipat mula sa lumang server, at may 30-araw na cooldown. Sa Bitsocial, mga keypair ang mga
profile at komunidad, kaya hindi nagbabago ang identity kapag nagpalit ng host o app. Tingnan ang
[Pagkakakilanlan at Pagmamay-ari ng Komunidad](/identity-and-ownership/).

### Kung saan nakatira ang isang komunidad

Sa istruktura, malapit ang isang komunidad sa Lemmy sa isang komunidad sa Bitsocial: napupunta ang
mga post sa komunidad, na maaaring sumuri sa mga ito bago muling isahimpapawid. Ang pagkakaiba ay
kung saan ito nakatira. Sa sariling home instance lamang ng lumikha maaaring likhain ang isang
komunidad sa Lemmy, may
[ganap na kontrol](https://join-lemmy.org/docs/users/05-censorship-resistance.html) dito ang admin
ng instance, at walang nakadokumentong paraan upang ilipat ito sa ibang instance. Ang komunidad sa
Bitsocial ay sarili nitong keypair: maaaring patakbuhin ng may-ari ang node nito kahit saan, at
walang admin ng server na nakapangibabaw dito.

### Kontrol sa spam

Kadalasang pinipigilan ng mga server sa Fediverse ang spam sa pag-sign up at nagmo-moderate
pagkatapos. Nagpapatakbo ang isang komunidad sa Bitsocial ng hamon sa bawat post bago ito tanggapin,
at pinipili ng bawat komunidad ang sarili nito: captcha, allowlist, bayad o anumang ibang code.
Tingnan ang [Mga Pasadyang Anti-Spam na Hamon](/custom-challenges/).

### Pagpapatakbo ng imprastraktura

Ang pagpapatakbo ng isang instance ay nangangahulugan ng server na laging bukas, na may domain, TLS
at email. Kailangan din ng Mastodon ang PostgreSQL, Redis at mga background worker; mas magaan ang
Lemmy, sa humigit-kumulang 150 MB na RAM ayon sa sarili nitong tantiya. Nag-iimbak ang bawat
instance ng mga kopya ng remote na nilalamang sinusundan ng mga user nito. Hindi kailangan ng domain
o certificate ang isang node ng komunidad sa Bitsocial, at tumatakbo ito mula sa desktop app o sa
`bitsocial-cli`.

### Ang ibinibigay ng mga server bilang kapalit

Pinapanatili ng mga server sa Fediverse ang buong kasaysayan at maaasahan nilang inihahatid ito, at
may mga hinog nang kasangkapan sa pagmo-moderate ang Mastodon na binuo sa loob ng maraming taon.
Hindi ginagarantiya ng Bitsocial na mananatili magpakailanman ang lumang nilalaman, at nasa bawat
app ang mga kasangkapan nito sa pagmo-moderate.

## Paghahambing

| Tanong                          | ActivityPub (Mastodon, Lemmy)                                                                                   | Bitsocial                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Kategorya                       | Mga federated na server                                                                                         | Peer-to-peer na network ng komunidad                                                               |
| Identity                        | Account sa domain ng isang server, na pinipirmahan ng server                                                    | Mga Ed25519 keypair para sa mga user at komunidad                                                  |
| Saan nakalagak ang mga post     | Ang pinagmulang server, kasama ang mga kopya sa bawat server na sumusunod                                       | Ang node ng may-ari ng komunidad at ang mga peer na nagbabasa at nagse-seed nito                   |
| Sino ang nagpapanatiling online | Mga admin ng instance                                                                                           | Node ng may-ari ng komunidad kasama ang mga katulong na seeder                                     |
| Mga komunidad                   | Mga komunidad sa Lemmy na naka-host sa iisang instance                                                          | First-class na mga bagay na ang node ang tumatanggap o tumatanggi sa mga post                      |
| Kontrol sa spam                 | Mga tarangkahan sa pag-sign up, mga limitasyon sa rate, mga ulat at pagmo-moderate                              | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                         |
| Pagmo-moderate                  | Mga admin ng server at mga moderator ng komunidad, lokal sa bawat server                                        | Mino-moderate ng mga may-ari ang kanilang komunidad; pinipili ng mga app kung ano ang ipapakita    |
| Mga pangalan                    | Mga handle na `@user@domain` at `!community@domain`                                                             | Mga pangalang `.bso` at `.eth` na nireresolba sa mga key                                           |
| Browser                         | Kliyente ng sariling server ng user                                                                             | Peer-to-peer na node sa loob ng karaniwang browser tab                                             |
| Pangunahing palitan             | Maaasahang kasaysayan at hinog na pagmo-moderate, ngunit pag-aari ng isang server ang identity at mga komunidad | Hindi kailangan ng server o domain, ngunit hindi garantisadong panghabambuhay ang lumang nilalaman |
