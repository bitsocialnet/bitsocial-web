---
title: 5chan
description: Isang walang server, desentralisadong imageboard na binuo sa Bitsocial protocol kung saan maaaring gumawa at magkaroon ng mga board ang sinuman.
sidebar_position: 1
---

:::warning[Legacy na pagpapangalan]
Ginagamit pa rin ng codebase ng proyektong ito ang legacy na "plebbit" na pagpapangalan bago ang Bitsocial rebrand. Ang mga pangalan ng package, mga sanggunian sa API, at ilang panloob na terminolohiya ay ia-update sa isang release sa hinaharap. Ang pag-andar na inilarawan dito ay kasalukuyang — tanging ang pagpapangalan ay hindi napapanahon.
:::

# 5chan

Ang 5chan ay isang walang server, walang admin, at ganap na desentralisadong imageboard na tumatakbo sa Bitsocial protocol. Sinusunod nito ang pamilyar na istraktura ng direktoryo ng imageboard habang ipinapakilala ang desentralisadong pagmamay-ari — sinuman ay maaaring lumikha ng isang board, at maraming mga board ay maaaring makipagkumpitensya para sa parehong puwang ng direktoryo sa pamamagitan ng isang mekanismo ng pagboto.

## Mga download

| Platform | Link                                     |
| -------- | ---------------------------------------- |
| Web      | [5chan.app](https://5chan.app)           |
| Desktop  | Available para sa Mac, Windows, at Linux |
| Mobile   | Available para sa Android                |

## Paano gumagana ang mga board

Ang 5chan ay nag-aayos ng nilalaman sa mga board gamit ang isang klasikong layout ng direktoryo (hal., `/b/`, `/g/`). Hindi tulad ng mga tradisyonal na imageboard kung saan kinokontrol ng isang sentral na admin ang bawat board, binibigyang-daan ng 5chan ang sinumang user na lumikha at ganap na magmay-ari ng kanilang sariling board. Kapag maraming board ang nagta-target sa parehong puwang ng direktoryo, nakikipagkumpitensya sila para sa posisyong iyon sa pamamagitan ng pagboto.

### Paglikha ng isang board

Para gumawa ng bagong board, kailangan mong patakbuhin ang `bitsocial-cli` bilang peer-to-peer node. Tinitiyak nito na ang iyong board ay naka-host sa isang desentralisadong paraan nang hindi umaasa sa anumang sentral na server.

### Mga takdang-aralin sa direktoryo

Ang mga pagtatalaga ng directory slot (kung aling board ang lilitaw sa kung saan ang path) ay kasalukuyang pinamamahalaan sa pamamagitan ng GitHub pull request sa `5chan-directories.json` file. Ito ay isang pansamantalang proseso — susuportahan ng mga release sa hinaharap ang paggawa ng in-app na board at pagboto na nakabatay sa pubsub upang awtomatikong mahawakan ang mga pagtatalaga ng direktoryo.

## Mga panloob

Sa ilalim ng hood, ginagamit ng 5chan ang plebbit-js API layer para sa mga pakikipag-ugnayan nito sa protocol. Gaya ng binanggit sa babala sa itaas, ang mga panloob na sanggunian na ito ay nagtataglay pa rin ng legacy na pagpapangalan na nauna sa Bitsocial rebrand.

## Mga link

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lisensya**: GPL-2.0-lamang
