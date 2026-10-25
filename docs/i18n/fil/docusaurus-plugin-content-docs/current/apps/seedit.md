---
title: Seedit
description: Isang walang server, desentralisadong Reddit-style na forum na binuo sa Bitsocial protocol kung saan sinuman ay maaaring lumikha at magmay-ari ng mga komunidad.
sidebar_position: 2
---

# Seedit

Ang Seedit ay isang walang server, walang admin, at ganap na desentralisadong alternatibo sa lumang istilong Reddit, na binuo sa Bitsocial protocol. Binibigyan nito ang mga user ng kumpletong pagmamay-ari sa kanilang mga komunidad — kahit sino ay maaaring gumawa ng isa, at maraming komunidad ang maaaring makipagkumpitensya para sa iisang maikling route, tulad ng `/s/funny`.

## Mga download

| Platform  | Link                                                          |
| --------- | ------------------------------------------------------------- |
| Web       | [seedit.app](https://seedit.app)                              |
| Web (ENS) | `seedit.eth` sa pamamagitan ng Brave browser o IPFS Companion |
| Desktop   | Available para sa Mac, Windows, at Linux                      |
| Mobile    | Available para sa Android                                     |

## Paano gumagana ang mga komunidad

Ang Seedit ay nag-aayos ng nilalaman sa mga komunidad na katulad ng mga subreddits. Ang bawat komunidad ay pagmamay-ari ng lumikha nito at nagpapatakbo nang walang sentralisadong pangangasiwa. Maaaring makipagkumpitensya ang maraming komunidad para sa iisang route ng [direktoryo](/directories/), tulad ng `/s/funny`, na nagbubukas ng kasalukuyang panalo. Laging tumuturo sa eksaktong komunidad ang mga subscription at link ng post.

### Paglikha ng isang komunidad

Mayroong dalawang paraan upang lumikha ng bagong komunidad:

1. **Desktop client** — Gamitin ang built-in na GUI sa desktop application para i-set up at i-configure ang iyong komunidad.
2. **bitsocial-cli** — Patakbuhin ang CLI tool upang lumikha at pamahalaan ang mga komunidad mula sa command line.

### Default na listahan ng komunidad

Awtomatikong naka-subscribe ang mga bagong account sa isang default na listahan ng mga eksaktong komunidad na tinukoy sa `seedit-default-subscriptions.json` sa repository na [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Nakalista ang mga kandidato ng direktoryo sa mga file na `seedit-directories/seedit-<code>-directory.json` sa parehong repository. Upang idagdag ang iyong komunidad sa alinmang listahan, magsumite ng pull request kasama ang mga detalye ng iyong komunidad.

## Mga link

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Lisensya**: GPL-2.0-lamang
