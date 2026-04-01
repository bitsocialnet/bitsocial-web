---
title: Walang pahintulot na Pampublikong RPC
description: Iminungkahing disenyo para sa isang pampublikong serbisyo ng Bitsocial RPC na may mga nakahiwalay na user, mga saklaw na pahintulot, at pagmamay-ari ng komunidad.
---

# Walang pahintulot na Pampublikong RPC

Ang orihinal na panukala ng pampublikong RPC ay nabuhay bilang isang isyu sa GitHub na nakasulat sa lumang terminolohiya ng plebbit. Isinulat muli ng page na ito ang ideyang iyon sa wikang Bitsocial at binabalangkas ito bilang panukala sa antas ng produkto sa halip na isang pader ng detalye ng pagpapatupad.

## Layunin sa simpleng wika

Maaaring magpatakbo ang Bitsocial Forge ng pampublikong serbisyo ng RPC na nagbibigay-daan sa maraming user na pamahalaan ang kanilang sariling mga komunidad ng Bitsocial nang malayuan, nang hindi ginagawang tagapag-ingat ang operator ng mga komunidad na iyon.

Dapat gawing praktikal ng serbisyo ang mga mobile at magaan na kliyente habang pinapanatili ang tatlong hadlang:

1. Ang mga user ay mananatiling nakahiwalay sa isa't isa bilang default.
2. Ang mga pahintulot ay nananatiling tahasan at butil-butil.
3. Ang pagiging tugma sa kasalukuyang kahilingan ng RPC at hugis ng tugon ay maaaring mapanatili sa panahon ng paglulunsad.

## Anong problema ang nilulutas nito

Sa ngayon, ang pinakasimpleng modelo ng RPC ay karaniwang all-or-nothing: isang auth key, isang domain ng awtoridad, ganap na access. Gumagana iyon para sa isang operator ngunit hindi para sa isang pampublikong serbisyo ng maraming gumagamit.

Ang isang walang pahintulot na pampublikong RPC ay nangangailangan ng mas malakas na modelo:

- ang isang serbisyo ay maaaring mag-host ng maraming user
- bawat user ay nakakakuha ng sarili nilang mga komunidad at limitasyon
- Ang mga patakarang tinukoy ng operator ay maaaring maiwasan ang pang-aabuso
- ang gumagamit ay maaari pa ring lumayo o mag-self-host sa ibang pagkakataon

## Pangunahing modelo

### Mga gumagamit

Ang bawat user ay nakakakuha ng kredensyal ng pagpapatotoo at isang bundle ng pahintulot.

### Mga komunidad

Ang mga komunidad na nilikha sa pamamagitan ng serbisyo ay itinalaga sa isang talaan ng may-ari. Ang pagmamay-ari ay tahasang sinusubaybayan upang ang mga pamamaraan ng pamamahala ay maaaring saklaw sa tamang user.

### Mga Pahintulot

Ang mga pahintulot ay nakabatay sa kakayahan. Sa halip na isang boolean para sa "maaaring gumamit ng RPC," makokontrol ng server ang:

- kung gaano karaming mga komunidad ang maaaring gawin ng isang user
- aling mga paraan ng pamamahala ang magagamit
- kung anong mga operasyon sa pag-publish ang pinapayagan
- anong mga limitasyon sa rate ang nalalapat
- kung anong mga surface ng admin ang nakikita

### Admin surface

Ang pampublikong RPC mismo ay dapat manatiling nakatutok sa gawi ng RPC na nakaharap sa gumagamit. Ang mga gawaing pang-administratibo tulad ng paggawa ng user, paglilipat ng pagmamay-ari, at pagsusuri sa pag-audit ay nabibilang sa isang hiwalay na operator API at dashboard.

## Paninindigan sa pagiging tugma

Ang dokumentasyong nakaharap sa user ay dapat gumamit ng mga Bitsocial na termino gaya ng **komunidad** at **profile**.

Sa antas ng wire, mapapanatili pa rin ng unang rollout ang kasalukuyang JSON-RPC na transport at payload na hugis kung saan ito ay kapaki-pakinabang para sa compatibility. Sa madaling salita: ang mga doc ay hindi na kailangang magsalita tulad ng mga lumang plebbit doc, kahit na ang panahon ng paglipat ay nagpapanatili ng ilang pangalan ng legacy na pamamaraan o humiling ng mga hugis sa likod ng mga eksena.

## Iminungkahing bundle ng pahintulot

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

Ang eksaktong mga pangalan ng pamamaraan ay naglalarawan. Ang mahalagang bahagi ay ang hugis ng patakaran: ang mga indibidwal na kakayahan ay hiwalay na kinokontrol sa halip na i-bundle sa isang superuser token.

## Daloy ng koneksyon

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Dapat manatiling opsyonal ang kaalaman sa pahintulot. Ang isang kliyente na binabalewala ang abiso ay maaari pa ring kumilos nang tama sa pamamagitan ng paghawak ng mga karaniwang pagpalya ng awtorisasyon mula sa server.

## Pagpapatupad ng pagmamay-ari

Kapag lumikha ang serbisyo ng isang komunidad, dapat itong awtomatikong magtalaga ng pagmamay-ari sa tumatawag na user. Mula doon:

- Ang mga pagkilos ng pagsisimula, paghinto, pag-edit, at pagtanggal ng komunidad ay saklaw ng may-ari
- listahan at mga tugon sa subscription ay default sa sariling mga komunidad ng tumatawag
- Ang mas malawak na visibility ay isang tahasang pahintulot ng admin, hindi isang default

Napakahalaga ng isang edge case: kung ang isang user ay nag-subscribe sa isang komunidad na hindi niya \*\* pagmamay-ari, dapat lang ilantad ng server ang pampublikong estado na dapat makita ng sinumang tagamasid sa labas. Ang configuration ng may-ari lamang o internal na runtime na data ay hindi dapat tumagas sa pamamagitan ng isang subscription API.

## Iminungkahing ibabaw ng operator

Maaaring manatiling boring at tahasang ang admin API:

- listahan ng mga gumagamit
- suriin ang isang gumagamit
- lumikha o mag-update ng mga user
- tanggalin ang mga gumagamit
- ilipat ang pagmamay-ari ng komunidad
- suriin ang mga log ng pag-audit

Ang pagpapatotoo para sa operator API na ito ay dapat na ganap na hiwalay sa end-user RPC auth.

## Mga yugto ng paglulunsad

### Phase 1

- itatag ang pampublikong istruktura ng proyekto ng RPC
- magdagdag ng mga tala ng user at pagsubaybay sa pagmamay-ari
- tinidor o pahabain ang kasalukuyang RPC server

### Phase 2

- ipatupad ang mga bundle ng pahintulot
- ipatupad ang mga ito sa layer ng RPC method
- ibalik ang metadata ng mga pahintulot sa pagkonekta

### Phase 3

- idagdag ang operator API
- magdagdag ng audit logging
- magdagdag ng pagpapatunay ng admin

### Phase 4

- ipadala ang admin dashboard
- pagsubok ng mga kontrol sa pang-aabuso
- higpitan ang paglilimita sa rate at mga quota sa imbakan

## Bukas na mga tanong

### Spam ng kredensyal ng pagpapatotoo

Kung mura ang paggawa ng auth, maaaring kailanganin ng mga pampublikong serbisyo ang isang layer ng hamon bago mag-isyu ng mga kredensyal. Ang isang posibleng ruta ay ang muling paggamit ng mismong modelo ng hamon ng komunidad upang ang pagpapalabas ng kredensyal ay magmana ng parehong pilosopiya laban sa pang-aabuso gaya ng iba pang bahagi ng network.

### Legacy na pagpapangalan

Ang ilang mga maagang pagpapatupad ay maaari pa ring ilantad ang mga pangalan ng legacy na pamamaraan sa loob para sa pagiging tugma. Iyon ay dapat ituring bilang isang detalye ng paglilipat, hindi bilang permanenteng pampublikong bokabularyo ng Bitsocial docs.

## Buod

Ang panukalang ito ay talagang tungkol sa isang bagay: gawing kapaki-pakinabang ang pampublikong imprastraktura ng RPC nang hindi ito ginagawang custodial. Ang isang magandang pampublikong Bitsocial RPC ay dapat pakiramdam na tulad ng opsyonal na tulong para sa pagpapatakbo ng mga komunidad, hindi tulad ng isang bagong sentral na platform na nagre-reclaim ng pagmamay-ari sa likod ng pinto.
