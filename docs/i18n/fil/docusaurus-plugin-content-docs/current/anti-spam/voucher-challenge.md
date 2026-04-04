---
title: Voucher Challenge
description: Anti-spam na hamon na pinipigilan ang pag-publish sa likod ng mga natatanging voucher code na ibinahagi ng mga may-ari ng komunidad.
sidebar_position: 3
---

# Voucher Challenge

Ang Voucher Challenge ay isang anti-spam na mekanismo na naghahatid ng paglalathala ng nilalaman sa likod ng mga natatanging voucher code. Sa halip na umasa sa awtomatikong pag-detect, inililipat nito ang tiwala sa may-ari ng komunidad, na manu-manong namamahagi ng mga code sa mga taong pinagkakatiwalaan nila.

**Source code:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Paano Ito Gumagana

1. Ang isang may-ari ng komunidad ay bumubuo ng isa o higit pang natatanging voucher code.
2. Ibinabahagi ng may-ari ang mga code na iyon sa mga pinagkakatiwalaang may-akda sa pamamagitan ng channel na kanilang pinili (direktang mensahe, email, personal, atbp.).
3. Kapag sinubukan ng isang may-akda na mag-publish, ipo-prompt sila ng system ng hamon para sa isang voucher code.
4. Ang code ay napatunayan -- kung ito ay tunay at hindi pa nagagamit, ang publikasyon ay tinatanggap.

Ang bawat voucher code ay nakatali sa isang partikular na may-akda kapag na-redeem, na pumipigil sa muling paggamit ng iba.

## Kailan Ito Gamitin

Ang Voucher Challenge ay pinakaangkop para sa:

- **Mga komunidad na nag-imbita lamang** kung saan sadyang pinaghihigpitan ang membership.
- **Mga na-curate na espasyo** kung saan personal na binibigyang-pansin ng may-ari ang bawat kalahok.
- **Mataas na pinagkakatiwalaang kapaligiran** kung saan ang awtomatikong pagmamarka ng spam ay hindi kailangan o hindi kanais-nais.

Dahil nangangailangan ito ng manu-manong pamamahagi ng code, hindi ito lumalawak sa malalaking bukas na komunidad. Para sa mga sitwasyong iyon, isaalang-alang ang [Spam Blocker](./spam-blocker.md) o [EVM Contract Call Challenge](./evm-contract-call.md) sa halip.

## Pagsasama

Ang Voucher Challenge ay sumasaklaw sa parehong interface ng hamon na ginagamit ng iba pang mga anti-spam na pakete sa Bitsocial ecosystem. Pinapagana ito ng mga may-ari ng komunidad sa pamamagitan ng kanilang mga setting ng komunidad, at ang hamon ay awtomatikong iniharap sa mga may-akda kapag sinubukan nilang mag-post.
