---
title: React Hooks
description: React hooks-bibliotek for å bygge desentraliserte sosiale applikasjoner på Bitsocial-protokollen.
sidebar_position: 1
---

# React Hooks

:::warning Legacy navngivning
Denne pakken bruker for tiden eldre navnekonvensjoner som er arvet fra oppstrømsgaffelen. Referanser til "plebbit" i kode, APIer og konfigurasjon vil bli migrert til "bitsocial" i en fremtidig utgivelse. Funksjonaliteten er upåvirket.
:::

`bitsocial-react-hooks`-pakken gir en kjent React hooks API for samhandling med Bitsocial-protokollen. Den håndterer henting av feeder, kommentarer og forfatterprofiler, administrerer kontoer, publiserer innhold og abonnerer på fellesskap – alt uten å stole på en sentral server.

Dette biblioteket er det primære grensesnittet som brukes av [5chan](/apps/5chan/) og andre Bitsocial-klientapplikasjoner.

:::note
`bitsocial-react-hooks` er en midlertidig gaffel av `plebbit/plebbit-react-hooks` vedlikeholdt for AI-støttet utvikling. Den konsumeres direkte fra GitHub i stedet for publisert til npm.
:::

## Installasjon

Fordi pakken ennå ikke er på npm, installer den direkte fra GitHub, fest til en spesifikk commit-hash:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Erstatt `<commit-hash>` med forpliktelsen du vil målrette mot.

## API-oversikt

Krokene er organisert i funksjonelle kategorier. Nedenfor er en oppsummering av de mest brukte krokene i hver kategori. For fullstendige signaturer, parametere og returtyper, se [full API-referanse på GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Kontoer

Administrer lokale brukerkontoer, identitet og innstillinger.

- `useAccount(accountName?)` -- returnerer det aktive (eller navngitte) kontoobjektet
- `useAccounts()` -- returnerer alle lokalt lagrede kontoer
- `useAccountComments(options?)` -- returnerer kommentarer publisert av den aktive kontoen

### Kommentarer

Hent og samhandle med individuelle kommentarer og tråder.

- `useComment(commentCid?)` -- henter en enkelt kommentar ved sin kunde-ID
- `useComments(commentCids?)` -- henter flere kommentarer i batch
- `useEditedComment(comment?)` -- returnerer den siste redigerte versjonen av en kommentar

### Fellesskap

Hent fellesskapsmetadata og -innstillinger.

- `useSubplebbit(subplebbitAddress?)` -- henter et fellesskap etter adresse
- `useSubplebbits(subplebbitAddresses?)` -- henter flere fellesskap
- `useSubplebbitStats(subplebbitAddress?)` -- returnerer antall abonnenter og innlegg

### Forfattere

Slå opp forfatterprofiler og metadata.

- `useAuthor(authorAddress?)` -- henter en forfatterprofil
- `useAuthorComments(options?)` -- returnerer kommentarer fra en spesifikk forfatter
- `useResolvedAuthorAddress(authorAddress?)` -- løser en menneskelesbar adresse (f.eks. ENS) til dens protokolladresse

### Innmatinger

Abonner på og paginer innholdsfeeder.

- `useFeed(options?)` -- returnerer en paginert feed med innlegg fra ett eller flere fellesskap
- `useBufferedFeeds(feedOptions?)` -- forhåndsbufferer flere feeder for raskere gjengivelse
- `useAuthorFeed(authorAddress?)` -- returnerer en feed med innlegg av en bestemt forfatter

### Handlinger

Publiser innhold og utfør skriveoperasjoner.

- `usePublishComment(options?)` -- publiser en ny kommentar eller svar
- `usePublishVote(options?)` -- avgi en opp- eller nedstemme
- `useSubscribe(options?)` -- abonner eller avregistrer et fellesskap

### stater og RPC

Overvåk tilkoblingstilstand og samhandle med en ekstern Bitsocial-demon.

- `useClientsStates(options?)` -- returnerer tilkoblingstilstanden til IPFS/pubsub-klienter
- `usePlebbitRpcSettings()` -- returnerer gjeldende RPC-demonkonfigurasjon

## Utvikling

Slik jobber du med hooks-biblioteket lokalt:

**Forutsetninger:** Node.js, Corepack aktivert, Garn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Se README i depotet for test- og byggekommandoer.

## Lenker

- **GitHub:** [full API-referanse på GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Lisens:** GPL-2.0-bare
