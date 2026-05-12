---
title: 5chan
description: Isang walang server, desentralisadong imageboard na binuo sa Bitsocial protocol kung saan maaaring gumawa at magkaroon ng mga board ang sinuman.
sidebar_position: 1
---

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

Ang mga pagtatalaga ng slot ng direktoryo (kung aling board ang lalabas kung saang path) ay kasalukuyang pinamamahalaan sa pamamagitan ng mga kahilingan sa pull ng GitHub sa `5chan-directories.json` file. Ito ay pansamantalang proseso — susuportahan ng mga release sa hinaharap ang paggawa ng in-app na board at pagboto na nakabatay sa pubsub upang awtomatikong mahawakan ang mga pagtatalaga ng direktoryo.

## Mga panloob

Sa ilalim ng hood, ginagamit ng 5chan ang nakabahaging Bitsocial protocol client layer para sa mga pakikipag-ugnayan sa network nito. Ang web app sa 5chan.app ay maaari ding magpatakbo ng isang Helia node sa browser kapag ang browser P2P ay pinagana mula sa Advanced na Mga Setting, upang ang mga mambabasa ay makakapag-load mula sa mga kapantay na walang sentralisadong IPFS gateway. Tingnan ang seksyong P2P ng browser sa mga tala ng peer-to-peer na protocol.

## Mga link

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Lisensya**: GPL-2.0-lamang
