---
title: Bitsocial Chain
description: Ika-3 yugto ng master plan, sumasaklaw sa iminungkahing Ethereum L2 appchain bilang layer ng ekonomiya para sa mga app ng Bitsocial.
---

# Bitsocial Chain

Ang Bitsocial Chain ang iminungkahing Ethereum L2 appchain na magsisilbing layer ng ekonomiya para sa
mga app ng Bitsocial. Ang kasalukuyang site na nakatuon sa chain ay
[chain.bitsocial.net](https://chain.bitsocial.net).

Dahil sa peer-to-peer na social layer, nakakalabas ang mga komunidad, pagkakakilanlan, at nilalaman
sa database ng isang sentralisadong platform. Layunin ng Bitsocial Chain na idagdag ang mga
ibinabahaging primitive para sa pagpapangalan, monetisasyon, at pagbabayad na nagpapahirap na
maputulan ng pondo ang mga app na iyon.

## Ano ang dapat nitong paganahin

- mga desentralisadong domain ng Bitsocial tulad ng `.bso`
- mga award at tipping
- matatag na daluyan ng monetisasyon
- ibinabahaging liquidity sa iba't ibang app
- mga estrukturang pampinansyal na mas mahirap sakalin ng mga bangko o platform
- mga network effect na hindi nakadepende sa iisang kumpanyang nagmamay-ari ng buong stack

Hindi mekanika ng token ang dapat maunang ipakita. Ang layunin ay gawing mas matibay, mas madaling
pondohan, at mas hindi umaasa sa mga sentralisadong provider ng pagbabayad o pagpapangalan ang mga
kapaki-pakinabang na social app.

## Kasalukuyang proof of concept

Nakatuon ang unang proof of concept ng Bitsocial Chain sa mga native na pangalang `.bso`.
Pinatutunayan nito na maaaring ihango ang isang name registry mula sa kasaysayan ng Ethereum L1 nang
hindi inilalagay on-chain ang social na nilalaman:

- isinusumite ng mga user ang mga intent na register, update, transfer, at revoke sa pamamagitan ng
  payak na mga transaksyon sa Ethereum L1
- kahit sino ay makakapagpatakbo ng derivation node at makakabuo muli ng parehong estado ng `.bso`
  registry
- may resolver na nagmamapa ng isang pangalang `.bso` sa Bitsocial public key na ginagamit na ng mga
  client sa peer-to-peer na protocol
- nananatiling off-chain at peer-to-peer ang mga post, boto, moderation, feed, at nilalaman ng
  komunidad

Ang proof of concept na iyon ay hindi pa isang production na paglulunsad ng Stage 2. Wala pa itong
proof system, challenge game, in-audit na code, live na deployment, panghuling presyo, o panghuling
governance. Ang pangmatagalang tindig nito ay transparent bilang default at tugma sa privacy mula sa
disenyo: pampubliko ang core chain, samantalang dapat iwasan ng mga susunod na tipping, pagbabayad,
award, at liquidity na pilitin ang permanenteng ugnayan sa pagitan ng social na pagkakakilanlan at
kasaysayan ng wallet.

## Bakit ito mahalaga

Kailangan ang pagdedesentralisa ng mga komunidad at pagkakakilanlan, ngunit hindi iyon sapat upang
maidesentralisa ang buong social media.

Kung nakadepende pa rin ang mga social app sa iilang sentralisadong daluyan ng pera, madali pa rin
silang mapipilitan, matatanggal sa platform, o mapuputulan ng pondo. Ang Bitsocial Chain ang
iminungkahing sagot sa pangalawang layer ng pagdepende na iyon.

## Ugnayan sa mga app

Dapat manatili ang Bitsocial Chain sa ilalim ng mga app ng Bitsocial, hindi bilang kapalit ng mga
ito.

Ang dapat makita ng publiko ay:

- nananatiling peer-to-peer ang mga komunidad
- nananatiling magkakaiba ang mga app
- nakakakuha ang mga user ng praktikal na feature para sa pagpapangalan at monetisasyon
- nakakatanggap ng suporta ang mga creator at komunidad sa iba't ibang client
- nakakagalaw ang halaga sa buong ecosystem nang hindi muling lumilikha ng isang sentralisadong
  may-ari ng platform

## Bakit ito dumarating pagkatapos ng alternatibo sa Twitter/X

Inilalagay ng kasalukuyang master plan ang Bitsocial Chain pagkatapos ng alternatibo sa Twitter/X, dahil hindi kailangan ng app na iyon ang chain. Tumatakbo ang mga profile bilang profile node sa pamamagitan ng non-custodial na RPC, at maaaring magsimula ang mga pangalang `.bso` sa isang pansamantalang registry sa Ethereum mainnet ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) at lumipat sa chain sa kalaunan.

Hindi dapat ipagpalit ng Bitsocial Chain ang desentralisasyon para sa mas maagang paglulunsad. Hindi ito dapat magdagdag ng anumang trust assumption lampas sa Ethereum mismo: walang upgrade key, walang security council, at walang operator na kayang mag-censor o magpahinto rito. Ang nangungunang disenyo para rito, isang native rollup, ay nakadepende sa isang upgrade ng Ethereum na wala pang iskedyul. Hangga't hindi pa naaabot ng chain ang pamantayang iyon, pinalalaki ng alternatibo sa Twitter/X ang base ng mga user na pagsisilbihan ng chain.

## Mga prinsipyo sa disenyo

Dahil iminungkahing imprastraktura pa lamang ang Bitsocial Chain at hindi pa isang inilunsad na
produkto, dapat manatiling disiplinado ang plano:

- Mga app at komunidad muna. Dapat palakasin ng network layer ang mga totoong social na produkto.
- Praktikal na feature muna. Mas madaling ipaliwanag ang mga pangalan, award, tipping, at pagbabayad
  kaysa sa abstraktong arkitekturang pampinansyal.
- Tunay na ambag kaysa sa hype. Dapat gantimpalaan ng mga primitive ng ekonomiya ang paglahok,
  pagbuo, at suporta sa komunidad.
- Pinapayagan ang curation. Maaaring hubugin ng mga app ang ranking, default, at pagtuklas upang
  paboran ang matatatag na komunidad.
- Bukas pa ang eksaktong mekanika. Ipinapaliwanag ng pahinang ito ang papel ng Bitsocial Chain,
  hindi isang nakakandadong pangako tungkol sa panghuling ekonomiya.
