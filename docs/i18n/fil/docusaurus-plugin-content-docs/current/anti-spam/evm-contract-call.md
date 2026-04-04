---
title: EVM Contract Call Challenge
description: Anti-spam challenge na nagbe-verify ng on-chain na mga kundisyon sa pamamagitan ng pagtawag sa isang EVM smart contract.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Legacy na Pangalan
Ang package na ito ay orihinal na na-publish sa ilalim ng saklaw ng `@plebbit`. Ito ay pinalitan ng pangalan sa `@bitsocial/evm-contract-challenge`. Ang mga sanggunian sa lumang pangalan ay maaari pa ring lumabas sa mas lumang dokumentasyon o codebase.
:::

Ang EVM Contract Call Challenge ay isang anti-spam na mekanismo na nagbe-verify ng on-chain na mga kondisyon bago payagan ang isang publikasyon. Orihinal na kinuha mula sa `plebbit-js` bilang isang standalone na package, hinahayaan nito ang mga may-ari ng komunidad na hilingin sa mga may-akda na matugunan ang pamantayang tinukoy ng matalinong kontrata -- halimbawa, may hawak na minimum na balanse ng token -- upang makapag-post.

**Source code:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Mga kinakailangan

- **Node.js** >= 22
- **ESM-only** -- hindi nagpapadala ang package na ito ng mga CommonJS build.
- **Runtime peer dependency:** `@plebbit/plebbit-js` (lumilipat sa `@pkc/pkc-js`)

## Pag-install

```bash
npm install @bitsocial/evm-contract-challenge
```

## Mga Pagpipilian sa Pag-configure

| Pagpipilian   | Uri      | Paglalarawan                                                                                             |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Ang chain na itatanong (hal., `eth`, `matic`, `avax`).                                                   |
| `address`     | `string` | Ang matalinong address ng kontrata na tatawagan.                                                         |
| `abi`         | `string` | Ang ABI fragment para sa function na tinatawag.                                                          |
| `condition`   | `string` | Isang paghahambing na expression na sinusuri laban sa halaga ng pagbabalik ng kontrata (hal., `> 1000`). |
| `error`       | `string` | Ang mensahe ng error na ipinapakita sa mga may-akda na hindi nakakatugon sa kundisyon.                   |

## Halimbawa

Ang isang may-ari ng komunidad na gustong higpitan ang pag-post sa mga may-akda na may hawak na higit sa 1,000 ng isang partikular na ERC-20 token ay iko-configure ang hamon sa:

- `chainTicker`: `"eth"`
- `address`: ang address ng kontrata ng token
- `abi`: ang ABI para sa `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Kapag sinubukan ng isang may-akda na mag-publish, tatawagan ng hamon ang `balanceOf` kasama ang address ng may-akda at titingnan kung ang ibinalik na halaga ay nakakatugon sa kundisyon. Kung nangyari ito, magpapatuloy ang publikasyon; kung hindi, ibabalik ang na-configure na mensahe ng error.

## Kailan Ito Gamitin

Ang EVM Contract Call Challenge ay mainam para sa:

- **Token-gated na mga komunidad** na naghihigpit sa pag-post sa mga may hawak ng token.
- **NFT-gated access** kung saan kinakailangan ang pagmamay-ari ng isang partikular na NFT.
- **Mga puwang sa pamamahala ng DAO** kung saan ang paglahok ay limitado sa mga may hawak ng token ng pamamahala.

Para sa mga komunidad na hindi umaasa sa on-chain na pagkakakilanlan, isaalang-alang ang [Spam Blocker](./spam-blocker.md) o [Voucher Challenge](./voucher-challenge.md) sa halip.
