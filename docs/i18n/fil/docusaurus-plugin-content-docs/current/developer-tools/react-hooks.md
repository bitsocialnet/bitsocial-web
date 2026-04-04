---
title: React Hooks
description: React hooks library para sa pagbuo ng mga desentralisadong social application sa Bitsocial protocol.
sidebar_position: 1
---

# React Hooks

:::warning Legacy na Pangalan
Ang package na ito ay kasalukuyang gumagamit ng legacy na mga convention sa pagbibigay ng pangalan na minana mula sa upstream fork nito. Ang mga sanggunian sa "plebbit" sa code, mga API, at configuration ay ililipat sa "bitsocial" sa isang release sa hinaharap. Ang pag-andar ay hindi naaapektuhan.
:::

Ang `bitsocial-react-hooks` package ay nagbibigay ng pamilyar na React hooks API para sa pakikipag-ugnayan sa Bitsocial protocol. Pinangangasiwaan nito ang pagkuha ng mga feed, komento, at profile ng may-akda, pamamahala ng mga account, pag-publish ng nilalaman, at pag-subscribe sa mga komunidad -- lahat nang hindi umaasa sa isang sentral na server.

Ang library na ito ay ang pangunahing interface na ginagamit ng [5chan](/apps/5chan/) at iba pang mga application ng Bitsocial client.

:::note
Ang `bitsocial-react-hooks` ay isang pansamantalang tinidor ng `plebbit/plebbit-react-hooks` na pinananatili para sa AI-aided development. Direktang ginagamit ito mula sa GitHub sa halip na na-publish sa npm.
:::

## Pag-install

Dahil ang package ay wala pa sa npm, i-install ito nang direkta mula sa GitHub, pag-pin sa isang partikular na commit hash:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Palitan ang `<commit-hash>` ng commit na gusto mong i-target.

## Pangkalahatang-ideya ng API

Ang mga kawit ay isinaayos sa mga functional na kategorya. Nasa ibaba ang isang buod ng pinakakaraniwang ginagamit na mga kawit sa bawat kategorya. Para sa kumpletong mga lagda, parameter, at uri ng pagbabalik, tingnan ang [buong API reference sa GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Mga account

Pamahalaan ang mga lokal na user account, pagkakakilanlan, at mga setting.

- `useAccount(accountName?)` -- ibinabalik ang aktibo (o pinangalanang) account object
- `useAccounts()` -- ibinabalik ang lahat ng lokal na nakaimbak na account
- `useAccountComments(options?)` -- nagbabalik ng mga komentong nai-publish ng aktibong account

### Mga komento

Kunin at makipag-ugnayan sa mga indibidwal na komento at thread.

- `useComment(commentCid?)` -- kinukuha ang isang komento ng CID nito
- `useComments(commentCids?)` -- kumukuha ng maraming komento sa batch
- `useEditedComment(comment?)` -- ibinabalik ang pinakabagong na-edit na bersyon ng isang komento

### Mga komunidad

Kunin ang metadata at mga setting ng komunidad.

- `useSubplebbit(subplebbitAddress?)` -- kinukuha ang isang komunidad ayon sa address
- `useSubplebbits(subplebbitAddresses?)` -- kumukuha ng maraming komunidad
- `useSubplebbitStats(subplebbitAddress?)` -- ibinabalik ang bilang ng subscriber at post

### Mga may-akda

Hanapin ang mga profile ng may-akda at metadata.

- `useAuthor(authorAddress?)` -- kumukuha ng profile ng may-akda
- `useAuthorComments(options?)` -- nagbabalik ng mga komento ng isang partikular na may-akda
- `useResolvedAuthorAddress(authorAddress?)` -- niresolba ang isang address na nababasa ng tao (hal., ENS) sa protocol address nito

### Mga feed

Mag-subscribe sa at pahinate ng mga feed ng nilalaman.

- `useFeed(options?)` -- nagbabalik ng paginated feed ng mga post mula sa isa o higit pang mga komunidad
- `useBufferedFeeds(feedOptions?)` -- nag-pre-buffer ng maraming feed para sa mas mabilis na pag-render
- `useAuthorFeed(authorAddress?)` -- nagbabalik ng feed ng mga post ng isang partikular na may-akda

### Mga aksyon

Mag-publish ng nilalaman at magsagawa ng mga operasyon sa pagsulat.

- `usePublishComment(options?)` -- mag-publish ng bagong komento o tugon
- `usePublishVote(options?)` -- magsumite ng upvote o downvote
- `useSubscribe(options?)` -- mag-subscribe o mag-unsubscribe mula sa isang komunidad

### Estado at RPC

Subaybayan ang estado ng koneksyon at makipag-ugnayan sa isang malayuang Bitsocial daemon.

- `useClientsStates(options?)` -- ibinabalik ang estado ng koneksyon ng mga IPFS/pubsub client
- `usePlebbitRpcSettings()` -- nagbabalik ng kasalukuyang RPC na configuration ng daemon

## Pag-unlad

Upang magtrabaho sa library ng hooks nang lokal:

**Mga Kinakailangan:** Node.js, pinagana ang Corepack, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Sumangguni sa repositoryong README para sa pagsubok at pagbuo ng mga utos.

## Mga link

- **GitHub:** [buong API reference sa GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Lisensya:** GPL-2.0-lamang
