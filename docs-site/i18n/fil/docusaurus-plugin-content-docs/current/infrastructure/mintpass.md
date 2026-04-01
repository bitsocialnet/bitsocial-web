---
title: Mintpass
description: NFT-based authentication system na tumutulong sa mga komunidad ng Bitsocial na i-verify ang mga user at bawasan ang mga pag-atake ng sybil.
sidebar_position: 2
---

# Mintpass

Ang Mintpass ay isang NFT-based na authentication system para sa mga komunidad ng Bitsocial. Gumagawa ang mga user ng hindi naililipat na pag-verify na NFT pagkatapos makumpleto ang isang hamon (gaya ng SMS OTP), at maaaring suriin ng mga komunidad ang pagmamay-ari ng NFT upang mabantayan ang mga pag-atake ng sybil tulad ng mga pekeng boto, pag-ban sa pag-iwas, at spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Lisensya**: MIT

## Paano Ito Gumagana

Ang daloy ng pag-verify ay may apat na hakbang:

1. **Kahilingan** -- Ang user ay bumisita sa `mintpass.org/request` upang simulan ang proseso.
2. **Challenge** -- Kinukumpleto ng user ang isang SMS na isang beses na pag-verify ng password.
3. **Mint** -- Sa matagumpay na pag-verify, isang hindi naililipat na NFT ang na-minted sa wallet ng user.
4. **I-verify** -- Ang mga komunidad ay nagtatanong ng pagmamay-ari ng NFT upang kumpirmahin na ang user ay na-verify na.

Dahil hindi naililipat ang NFT, nananatili itong nakatali sa wallet na nakakumpleto ng pag-verify, na pumipigil sa mga user na i-trade o ibenta ang kanilang na-verify na status.

## Istruktura ng Proyekto

Ang imbakan ay nakaayos sa tatlong pangunahing mga lugar:

| Direktoryo   | Layunin                                               |
| ------------ | ----------------------------------------------------- |
| `contracts/` | Solidity smart contract para sa pag-verify ng NFT.    |
| `challenge/` | Integration layer para sa Bitsocial challenge system. |
| `web/`       | Next.js at React frontend para sa minting flow.       |

## Privacy at Pangangasiwa ng Data

Ang Mintpass ay tumatagal ng minimal na data na diskarte:

- **Ang data ng pagpapatakbo** (mga OTP code, mga token ng session) ay iniimbak sa Redis na may maiikling TTL at awtomatikong mag-e-expire.
- **Mint association** (ang link sa pagitan ng isang na-verify na pagkakakilanlan at isang wallet) ang tanging patuloy na talaan.

Walang mga numero ng telepono o mga personal na detalye ang nananatili pagkatapos magsara ang window ng pag-verify.

## Opsyonal na Mga Layer ng Seguridad

Maaaring paganahin ng mga operator ng komunidad ang mga karagdagang proteksyon depende sa kanilang modelo ng pagbabanta:

- **Pagsusuri ng reputasyon ng IP** -- Markahan ang mga papasok na kahilingan laban sa mga kilalang database ng pang-aabuso.
- **Pagsusuri sa peligro sa telepono** -- I-flag ang mga disposable o VoIP na numero bago mag-isyu ng hamon.
- **Geoblocking** -- Paghigpitan ang pag-verify sa mga partikular na rehiyon.
- **Per-IP cooldowns** -- Rate-limit repeated verification attempts from the same address.

## Technology Stack

| Layer        | Teknolohiya                                      |
| ------------ | ------------------------------------------------ |
| Mga Kontrata | Solidity, na-deploy kasama ng Hardhat at Foundry |
| Frontend     | Next.js + React                                  |
| Network      | Base (Ethereum L2)                               |

Ang pag-deploy sa Base ay nagpapanatili ng mababang gastos sa gas habang namamana ang mga garantiya sa seguridad ng Ethereum.

## Roadmap

Ang mga nakaplanong pagpapabuti ay kinabibilangan ng:

- **Pay-to-mint option** -- Pahintulutan ang mga komunidad na humiling ng maliit na bayad para sa pagmimina, pagdaragdag ng economic sybil barrier.
- **Mga karagdagang signal ng pag-verify** -- Palawakin nang higit pa sa SMS sa iba pang mga signal ng pagkakakilanlan.
- **Expanded admin tooling** -- Mas mayayamang dashboard at kontrol para sa mga operator ng komunidad.
