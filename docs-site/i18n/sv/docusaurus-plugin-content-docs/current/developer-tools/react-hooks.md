---
title: React Hooks
description: React hooks-bibliotek för att bygga decentraliserade sociala applikationer på Bitsocial-protokollet.
sidebar_position: 1
---

# React Hooks

:::warning Legacy Naming
Detta paket använder för närvarande äldre namnkonventioner som ärvts från dess uppströmsgaffel. Referenser till "plebbit" i kod, API:er och konfiguration kommer att migreras till "bitsocial" i en framtida version. Funktionaliteten påverkas inte.
:::

`bitsocial-react-hooks`-paketet tillhandahåller ett välbekant React hooks API för interaktion med Bitsocial-protokollet. Den hanterar att hämta flöden, kommentarer och författarprofiler, hantera konton, publicera innehåll och prenumerera på gemenskaper – allt utan att förlita sig på en central server.

Detta bibliotek är det primära gränssnittet som används av [5chan](/apps/5chan/) och andra Bitsocial-klientapplikationer.

:::note
`bitsocial-react-hooks` är en tillfällig gaffel av `plebbit/plebbit-react-hooks` som underhålls för AI-stödd utveckling. Den konsumeras direkt från GitHub snarare än publicerad till npm.
:::

## Installation

Eftersom paketet ännu inte är på npm, installera det direkt från GitHub, fästa till en specifik commit-hash:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Ersätt `<commit-hash>` med den commit du vill rikta in dig på.

## API-översikt

Krokarna är organiserade i funktionskategorier. Nedan följer en sammanfattning av de mest använda krokarna i varje kategori. För fullständiga signaturer, parametrar och returtyper, se [fullständig API-referens på GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### konton

Hantera lokala användarkonton, identitet och inställningar.

- `useAccount(accountName?)` -- returnerar det aktiva (eller namngivna) kontoobjektet
- `useAccounts()` -- returnerar alla lokalt lagrade konton
- `useAccountComments(options?)` -- returnerar kommentarer publicerade av det aktiva kontot

### Kommentarer

Hämta och interagera med enskilda kommentarer och trådar.

- `useComment(commentCid?)` -- hämtar en enstaka kommentar av sitt kund-ID
- `useComments(commentCids?)` -- hämtar flera kommentarer i batch
- `useEditedComment(comment?)` -- returnerar den senast redigerade versionen av en kommentar

### gemenskaper

Hämta community-metadata och inställningar.

- `useSubplebbit(subplebbitAddress?)` -- hämtar en gemenskap efter adress
- `useSubplebbits(subplebbitAddresses?)` -- hämtar flera gemenskaper
- `useSubplebbitStats(subplebbitAddress?)` -- returnerar antalet prenumeranter och inlägg

### Författare

Slå upp författarprofiler och metadata.

- `useAuthor(authorAddress?)` -- hämtar en författarprofil
- `useAuthorComments(options?)` -- returnerar kommentarer av en specifik författare
- `useResolvedAuthorAddress(authorAddress?)` -- löser en mänsklig läsbar adress (t.ex. ENS) till dess protokolladress

### Matar

Prenumerera på och sidnumrera innehållsflöden.

- `useFeed(options?)` -- returnerar ett sidnumrerat flöde med inlägg från en eller flera grupper
- `useBufferedFeeds(feedOptions?)` -- förbuffrar flera flöden för snabbare rendering
- `useAuthorFeed(authorAddress?)` -- returnerar ett flöde med inlägg av en specifik författare

### Åtgärder

Publicera innehåll och utför skrivoperationer.

- `usePublishComment(options?)` -- publicera en ny kommentar eller svar
- `usePublishVote(options?)` -- rösta upp eller ned
- `useSubscribe(options?)` -- prenumerera eller avsluta prenumerationen på en gemenskap

### stater och RPC

Övervaka anslutningstillståndet och interagera med en fjärransluten Bitsocial-demon.

- `useClientsStates(options?)` -- returnerar anslutningstillståndet för IPFS/pubsub-klienter
- `usePlebbitRpcSettings()` -- returnerar aktuell RPC-demonkonfiguration

## Utveckling

Så här arbetar du med hooks-biblioteket lokalt:

**Förutsättningar:** Node.js, Corepack aktiverat, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Se arkivet README för test- och byggkommandon.

## Länkar

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licens:** Endast GPL-2.0
