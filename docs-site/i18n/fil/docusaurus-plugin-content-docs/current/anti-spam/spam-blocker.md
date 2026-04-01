---
title: Spam Blocker
description: Sentralisadong serbisyo sa pag-detect ng spam na may panganib na pagmamarka, mga hamon sa OAuth, at mga na-configure na antas ng threshold.
sidebar_position: 1
---

# Spam Blocker

:::warning Legacy Naming
Ang package na ito ay orihinal na na-publish sa ilalim ng saklaw ng `@plebbit`. Ito ay pinalitan ng pangalan sa `@bitsocial/spam-blocker-server` at `@bitsocial/spam-blocker-challenge`. Ang mga sanggunian sa mga lumang pangalan ay maaari pa ring lumabas sa mas lumang dokumentasyon o codebase.
:::

Ang Spam Blocker ay isang sentralisadong serbisyo sa pagtuklas ng spam na sinusuri ang mga papasok na publikasyon at nagtatalaga ng mga marka ng panganib. Binubuo ito ng dalawang pakete:

- **`@bitsocial/spam-blocker-server`** -- ang HTTP server na nagho-host ng pagsusuri at paghamon ng mga API.
- **`@bitsocial/spam-blocker-challenge`** -- isang magaan na pakete ng kliyente na isinasama ng mga komunidad upang magpadala ng mga publikasyon para sa pagsusuri.

**Source code:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Paano Gumagana ang Pagmamarka ng Panganib

Ang bawat publikasyong isinumite sa `/evaluate` endpoint ay nakakatanggap ng numeric na marka ng panganib. Ang marka ay isang tinimbang na kumbinasyon ng ilang mga signal:

| Signal                 | Paglalarawan                                                                                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edad ng account        | Ang mga bagong account ay tumatanggap ng mas mataas na marka ng panganib.                                                                                                              |
| Karma                  | Ang naipon na karma ng komunidad ay binabawasan ang panganib.                                                                                                                          |
| Reputasyon ng may-akda | Data ng reputasyon na nakalap ng background network indexer.                                                                                                                           |
| Pagsusuri ng nilalaman | Mga heuristic sa antas ng teksto (densidad ng link, kilalang mga pattern ng spam, atbp.).                                                                                              |
| Bilis                  | Ang mabilis na sunud-sunod na mga post mula sa parehong may-akda ay nagpapataas ng panganib.                                                                                           |
| IP intelligence        | Geolocation sa antas ng bansa at mga lookup ng threat-feed. Ang mga code ng bansa lamang ang nakaimbak -- ang mga hilaw na IP address ay hindi kailanman ibinabahagi sa mga komunidad. |

## Mga Tier Threshold

Ang marka ng panganib ay nagmamapa sa isa sa apat na maaaring i-configure na mga tier na tumutukoy kung ano ang susunod na mangyayari:

1. **Awtomatikong tanggapin** -- sapat na mababa ang marka para maaprubahan ang publikasyon nang walang anumang hamon.
2. **OAuth-sapat** -- dapat kumpletuhin ng may-akda ang isang pag-verify ng OAuth upang magpatuloy.
3. **OAuth-plus-more** -- Hindi sapat ang OAuth lamang; karagdagang pag-verify (hal., CAPTCHA) ay kinakailangan.
4. **Auto-reject** -- masyadong mataas ang marka; tahasan na tinatanggihan ang publikasyon.

Ang lahat ng mga halaga ng threshold ay maaaring i-configure sa bawat komunidad.

## Daloy ng Hamon

Kapag nahulog ang isang publikasyon sa isang antas na nangangailangan ng pag-verify, magsisimula ang daloy ng hamon:

1. Ang may-akda ay unang sinenyasan na magpatotoo sa pamamagitan ng **OAuth** (GitHub, Google, Twitter, at iba pang sinusuportahang provider).
2. Kung ang OAuth lamang ay hindi sapat (tier 3), isang **CAPTCHA fallback** na pinapagana ng Cloudflare Turnstile ay ipapakita.
3. Ang pagkakakilanlan ng OAuth ay ginagamit lamang para sa pag-verify -- ito ay **hindi kailanman ibinahagi** sa komunidad o iba pang mga user.

## Mga Endpoint ng API

### `POST /evaluate`

Magsumite ng publikasyon para sa pagsusuri sa panganib. Ibinabalik ang nakalkulang marka ng panganib at ang kinakailangang antas ng hamon.

### `POST /challenge/verify`

Isumite ang resulta ng isang nakumpletong hamon (OAuth token, CAPTCHA solution, o pareho) para sa pag-verify.

### `GET /iframe/:sessionId`

Nagbabalik ng naka-embed na HTML page na nagre-render ng naaangkop na challenge UI para sa ibinigay na session.

## Paglilimita sa Rate

Ang mga limitasyon sa rate ay dynamic na inilalapat batay sa edad at reputasyon ng may-akda. Ang mga may-akda na mas bago o mas mababa ang reputasyon ay nahaharap sa mas mahigpit na mga limitasyon, habang ang mga naitatag na may-akda ay nagtatamasa ng mas mapagbigay na mga limitasyon. Pinipigilan nito ang pagbaha ng spam nang hindi pinaparusahan ang mga pinagkakatiwalaang kalahok.

## Background Network Indexer

Ang server ay nagpapatakbo ng isang background indexer na patuloy na nagko-crawl sa network upang bumuo at mapanatili ang data ng reputasyon ng may-akda. Direktang ipinapasok ang data na ito sa pipeline ng risk scoring, na nagbibigay-daan sa system na makilala ang mga umuulit na kalahok na may mabuting pananampalataya sa mga komunidad.

## Pagkapribado

Ang Spam Blocker ay idinisenyo na nasa isip ang privacy:

- Ginagamit lang ang mga pagkakakilanlan ng OAuth para sa pag-verify ng hamon at **hindi ibinubunyag** sa mga komunidad.
- Ang mga IP address ay niresolba sa **mga code ng bansa lamang**; hindi nakaimbak o nakabahagi ang mga hilaw na IP.

## Database

Gumagamit ang server ng **SQLite** (sa pamamagitan ng `better-sqlite3`) para sa lokal na pananatili ng data ng reputasyon, estado ng session, at configuration.
