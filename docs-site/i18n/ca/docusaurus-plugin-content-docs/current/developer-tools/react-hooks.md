---
title: React Hooks
description: Biblioteca de ganxos de React per crear aplicacions socials descentralitzades al protocol Bitsocial.
sidebar_position: 1
---

# React Hooks

:::warning Legacy Naming
Aquest paquet actualment utilitza convencions de nomenclatura heretades de la seva bifurcació amunt. Les referències a "plebbit" al codi, a les API i a la configuració es migraran a "bitsocial" en una versió futura. La funcionalitat no es veu afectada.
:::

El paquet `bitsocial-react-hooks` proporciona una API React hooks familiar per interactuar amb el protocol Bitsocial. Gestiona l'obtenció de fonts, comentaris i perfils d'autor, la gestió de comptes, la publicació de contingut i la subscripció a comunitats, tot sense dependre d'un servidor central.

Aquesta biblioteca és la interfície principal utilitzada per [5canal](/apps/5chan/) i altres aplicacions de client Bitsocial.

:::note
`bitsocial-react-hooks` és una bifurcació temporal de `plebbit/plebbit-react-hooks` que es manté per al desenvolupament assistit per IA. Es consumeix directament des de GitHub en lloc de publicar-se a npm.
:::

## Instal·lació

Com que el paquet encara no està a npm, instal·leu-lo directament des de GitHub, fixant-lo a un hash de commit específic:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Substituïu `<commit-hash>` per la confirmació que voleu orientar.

## Visió general de l'API

Els ganxos s'organitzen en categories funcionals. A continuació es mostra un resum dels ganxos més utilitzats en cada categoria. Per obtenir signatures completes, paràmetres i tipus de retorn, consulteu la [referència completa de l'API a GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Comptes

Gestioneu els comptes d'usuari locals, la identitat i la configuració.

- `useAccount(accountName?)`: retorna l'objecte del compte actiu (o amb nom).
- `useAccounts()`: retorna tots els comptes emmagatzemats localment
- `useAccountComments(options?)`: retorna els comentaris publicats pel compte actiu

### Comentaris

Obteniu i interactueu amb comentaris i fils individuals.

- `useComment(commentCid?)` -- obté un únic comentari pel seu CID
- `useComments(commentCids?)`: obté diversos comentaris per lots
- `useEditedComment(comment?)`: retorna la darrera versió editada d'un comentari

### Comunitats

Recuperar les metadades i la configuració de la comunitat.

- `useSubplebbit(subplebbitAddress?)` -- obté una comunitat per adreça
- `useSubplebbits(subplebbitAddresses?)`: obté diverses comunitats
- `useSubplebbitStats(subplebbitAddress?)`: retorna el recompte de subscriptors i publicacions

### Autors

Consulta els perfils i metadades dels autors.

- `useAuthor(authorAddress?)` -- obté un perfil d'autor
- `useAuthorComments(options?)`: retorna els comentaris d'un autor específic
- `useResolvedAuthorAddress(authorAddress?)`: resol una adreça llegible pels humans (per exemple, ENS) a la seva adreça de protocol

### Feeds

Subscriu-te i pagina els canals de contingut.

- `useFeed(options?)`: retorna un feed paginat de publicacions d'una o més comunitats
- `useBufferedFeeds(feedOptions?)`: pre-buffers múltiples fonts per a una renderització més ràpida
- `useAuthorFeed(authorAddress?)`: retorna un feed de publicacions d'un autor específic

### Accions

Publicar contingut i realitzar operacions d'escriptura.

- `usePublishComment(options?)`: publica un comentari o una resposta nous
- `usePublishVote(options?)` -- cast an upvote or downvote
- `useSubscribe(options?)`: subscriu-te o cancel·la la subscripció d'una comunitat

### Estats i RPC

Superviseu l'estat de connexió i interactueu amb un dimoni Bitsocial remot.

- `useClientsStates(options?)`: retorna l'estat de connexió dels clients IPFS/pubsub
- `usePlebbitRpcSettings()`: retorna la configuració actual del dimoni RPC

## Desenvolupament

Per treballar a la biblioteca de ganxos localment:

**Requisits previs:** Node.js, Corepack habilitat, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Consulteu el repositori README per a proves i ordres de compilació.

## Enllaços

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Llicència:** només GPL-2.0
