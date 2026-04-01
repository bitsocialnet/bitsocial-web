---
title: React Hooks
description: React hooks-bibliotek til at bygge decentrale sociale applikationer på Bitsocial-protokollen.
sidebar_position: 1
---

# React Hooks

:::warning Legacy Naming
Denne pakke bruger i øjeblikket ældre navngivningskonventioner, der er arvet fra dens opstrøms fork. Referencer til "plebbit" i kode, API'er og konfiguration vil blive migreret til "bitsocial" i en fremtidig udgivelse. Funktionaliteten er upåvirket.
:::

`bitsocial-react-hooks`-pakken giver en velkendt React hooks API til at interagere med Bitsocial-protokollen. Det håndterer at hente feeds, kommentarer og forfatterprofiler, administrere konti, udgive indhold og abonnere på fællesskaber – alt sammen uden at være afhængig af en central server.

Dette bibliotek er den primære grænseflade, der bruges af [5 chan](/apps/5chan/) og andre Bitsocial-klientapplikationer.

:::note
`bitsocial-react-hooks` er en midlertidig gaffel af `plebbit/plebbit-react-hooks`, der vedligeholdes til AI-støttet udvikling. Det forbruges direkte fra GitHub i stedet for at blive offentliggjort til npm.
:::

## Installation

Fordi pakken endnu ikke er på npm, skal du installere den direkte fra GitHub ved at fastgøre til en specifik commit-hash:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Erstat `<commit-hash>` med den commit, du vil målrette mod.

## API-oversigt

Krogene er organiseret i funktionelle kategorier. Nedenfor er en oversigt over de mest brugte kroge i hver kategori. For fuldstændige signaturer, parametre og returtyper, se [fuld API-reference på GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Regnskaber

Administrer lokale brugerkonti, identitet og indstillinger.

- `useAccount(accountName?)` -- returnerer det aktive (eller navngivne) kontoobjekt
- `useAccounts()` -- returnerer alle lokalt lagrede konti
- `useAccountComments(options?)` -- returnerer kommentarer udgivet af den aktive konto

### Kommentarer

Hent og interager med individuelle kommentarer og tråde.

- `useComment(commentCid?)` -- henter en enkelt kommentar ved sit CID
- `useComments(commentCids?)` -- henter flere kommentarer i batch
- `useEditedComment(comment?)` -- returnerer den senest redigerede version af en kommentar

### Fællesskaber

Hent metadata og indstillinger for fællesskabet.

- `useSubplebbit(subplebbitAddress?)` -- henter et fællesskab efter adresse
- `useSubplebbits(subplebbitAddresses?)` -- henter flere fællesskaber
- `useSubplebbitStats(subplebbitAddress?)` -- returnerer antallet af abonnenter og indlæg

### Forfattere

Slå forfatterprofiler og metadata op.

- `useAuthor(authorAddress?)` -- henter en forfatterprofil
- `useAuthorComments(options?)` -- returnerer kommentarer fra en bestemt forfatter
- `useResolvedAuthorAddress(authorAddress?)` -- løser en menneskelig læsbar adresse (f.eks. ENS) til dens protokoladresse

### Feeds

Abonner på og sideindsæt indholdsfeeds.

- `useFeed(options?)` -- returnerer et pagineret feed med indlæg fra et eller flere fællesskaber
- `useBufferedFeeds(feedOptions?)` -- præ-bufferer flere feeds for hurtigere gengivelse
- `useAuthorFeed(authorAddress?)` -- returnerer et feed med indlæg fra en bestemt forfatter

### Handlinger

Udgiv indhold og udfør skrivehandlinger.

- `usePublishComment(options?)` -- udgiv en ny kommentar eller svar
- `usePublishVote(options?)` -- afgiv en op- eller nedstemme
- `useSubscribe(options?)` -- tilmeld eller afmeld et fællesskab

### stater og RPC

Overvåg forbindelsestilstand og interager med en ekstern Bitsocial-dæmon.

- `useClientsStates(options?)` -- returnerer forbindelsestilstanden for IPFS/pubsub-klienter
- `usePlebbitRpcSettings()` -- returnerer den aktuelle RPC-dæmonkonfiguration

## Udvikling

Sådan arbejder du på hooks-biblioteket lokalt:

**Forudsætninger:** Node.js, Corepack aktiveret, Garn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Se repository README for test- og build-kommandoer.

## Links

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licens:** GPL-2.0-kun
