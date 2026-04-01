---
title: Reagojnë Hooks
description: Biblioteka e grepave React për ndërtimin e aplikacioneve sociale të decentralizuara në protokollin Bitsocial.
sidebar_position: 1
---

# Reagojnë Hooks

:::warning Legacy Naming
Kjo paketë përdor aktualisht konventat e emërtimit të trashëguara nga forku i saj në rrjedhën e sipërme. Referencat për "plebbit" në kod, API dhe konfigurim do të migrohen në "bitsocial" në një version të ardhshëm. Funksionaliteti është i paprekur.
:::

Paketa `bitsocial-react-hooks` ofron një API të njohur të React hooks për ndërveprim me protokollin Bitsocial. Ai trajton marrjen e burimeve, komenteve dhe profileve të autorëve, menaxhimin e llogarive, publikimin e përmbajtjes dhe abonimin në komunitete -- të gjitha pa u mbështetur në një server qendror.

Kjo bibliotekë është ndërfaqja kryesore e përdorur nga [5 kan](/apps/5chan/) dhe aplikacionet e tjera të klientit Bitsocial.

:::note
`bitsocial-react-hooks` është një pirun i përkohshëm i `plebbit/plebbit-react-hooks` i mirëmbajtur për zhvillim të ndihmuar nga AI. Ai konsumohet drejtpërdrejt nga GitHub në vend që të publikohet në npm.
:::

## Instalimi

Për shkak se paketa nuk është ende në npm, instaloni atë direkt nga GitHub, duke e vendosur në një hash specifik të kryerjes:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Zëvendësoni `<commit-hash>` me angazhimin që dëshironi të synoni.

## Përmbledhje e API

Gurpat janë të organizuara në kategori funksionale. Më poshtë është një përmbledhje e grepave më të përdorura në secilën kategori. Për nënshkrimet e plota, parametrat dhe llojet e kthimit, shihni [referencën e plotë e API-së në GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Llogaritë

Menaxho llogaritë lokale të përdoruesve, identitetin dhe cilësimet.

- `useAccount(accountName?)` -- kthen objektin aktiv (ose të emërtuar) të llogarisë
- `useAccounts()` -- kthen të gjitha llogaritë e ruajtura në vend
- `useAccountComments(options?)` -- kthen komentet e publikuara nga llogaria aktive

### Komentet

Merr dhe ndërvepro me komentet dhe temat individuale.

- `useComment(commentCid?)` -- merr një koment të vetëm nga CID e tij
- `useComments(commentCids?)` -- merr komente të shumta në grup
- `useEditedComment(comment?)` -- kthen versionin më të fundit të redaktuar të një komenti

### Komunitetet

Merr të dhënat dhe cilësimet e komunitetit.

- `useSubplebbit(subplebbitAddress?)` -- merr një komunitet sipas adresës
- `useSubplebbits(subplebbitAddresses?)` -- merr shumë bashkësi
- `useSubplebbitStats(subplebbitAddress?)` -- kthen numrin e abonentëve dhe postimeve

### Autorët

Kërkoni profilet dhe meta të dhënat e autorit.

- `useAuthor(authorAddress?)` -- merr një profil autori
- `useAuthorComments(options?)` -- kthen komentet nga një autor specifik
- `useResolvedAuthorAddress(authorAddress?)` - zgjidh një adresë të lexueshme nga njeriu (p.sh., ENS) në adresën e tij të protokollit

### Feeds

Abonohuni dhe faqerojini burimet e përmbajtjes.

- `useFeed(options?)` -- kthen një furnizim me faqe të postimeve nga një ose më shumë komunitete
- `useBufferedFeeds(feedOptions?)` -- para-buferon furnizime të shumta për paraqitje më të shpejtë
- `useAuthorFeed(authorAddress?)` -- kthen një burim postimesh nga një autor specifik

### Veprimet

Publikoni përmbajtjen dhe kryeni operacionet e shkrimit.

- `usePublishComment(options?)` -- publikoni një koment ose përgjigje të re
- `usePublishVote(options?)` -- jepni një votë pro ose kundër
- `useSubscribe(options?)` -- abonohuni ose çregjistrohuni nga një komunitet

### Shtetet dhe RPC

Monitoroni gjendjen e lidhjes dhe ndërveproni me një demon të largët Bitsocial.

- `useClientsStates(options?)` -- kthen gjendjen e lidhjes së klientëve IPFS/pubsub
- `usePlebbitRpcSettings()` -- kthen konfigurimin aktual të demonit RPC

## Zhvillimi

Për të punuar në bibliotekën e grepave në nivel lokal:

**Kushtet paraprake:** Node.js, Corepack i aktivizuar, Fije 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Referojuni depove README për komandat e testimit dhe ndërtimit.

## Lidhjet

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licenca:** GPL-2.0-vetëm
