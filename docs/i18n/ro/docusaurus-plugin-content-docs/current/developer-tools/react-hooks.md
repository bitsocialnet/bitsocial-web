---
title: React Hooks
description: Biblioteca React hooks pentru construirea de aplicații sociale descentralizate pe protocolul Bitsocial.
sidebar_position: 1
---

# React Hooks

:::warning Denumire moștenită
Acest pachet utilizează în prezent convențiile de denumire moștenite de la fork-ul său din amonte. Referințele la „plebbit” în cod, API-uri și configurație vor fi migrate la „bitsocial” într-o versiune viitoare. Funcționalitatea este neafectată.
:::

Pachetul `bitsocial-react-hooks` oferă un API familiar React hooks pentru interacțiunea cu protocolul Bitsocial. Se ocupă de preluarea feedurilor, comentarii și profiluri de autor, gestionarea conturilor, publicarea conținutului și abonarea la comunități - toate fără a se baza pe un server central.

Această bibliotecă este interfața principală folosită de [5chan](/apps/5chan/) și alte aplicații client Bitsocial.

:::note
`bitsocial-react-hooks` este o furcă temporară a lui `plebbit/plebbit-react-hooks` întreținută pentru dezvoltarea asistată de AI. Este consumat direct din GitHub, mai degrabă decât publicat în npm.
:::

## Instalare

Deoarece pachetul nu este încă pe npm, instalați-l direct din GitHub, fixându-l pe un anume commit hash:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Înlocuiți `<commit-hash>` cu commit-ul pe care doriți să îl vizați.

## Prezentare generală API

Cârligele sunt organizate pe categorii funcționale. Mai jos este un rezumat al cârligelor cele mai frecvent utilizate din fiecare categorie. Pentru semnături complete, parametri și tipuri de returnări, consultați [referința API completă pe GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Conturi

Gestionați conturile de utilizator locale, identitatea și setările.

- `useAccount(accountName?)` -- returnează obiectul cont activ (sau numit).
- `useAccounts()` -- returnează toate conturile stocate local
- `useAccountComments(options?)` -- returnează comentariile publicate de contul activ

### Comentarii

Preluați și interacționați cu comentarii și fire individuale.

- `useComment(commentCid?)` -- preia un singur comentariu după CID-ul său
- `useComments(commentCids?)` - preia mai multe comentarii în lot
- `useEditedComment(comment?)` -- returnează cea mai recentă versiune editată a unui comentariu

### Comunități

Preluați metadatele și setările comunității.

- `useSubplebbit(subplebbitAddress?)` -- preia o comunitate după adresă
- `useSubplebbits(subplebbitAddresses?)` -- preia mai multe comunități
- `useSubplebbitStats(subplebbitAddress?)` -- returnează numărul de abonați și postări

### Autorii

Căutați profiluri și metadate de autor.

- `useAuthor(authorAddress?)` -- preia un profil de autor
- `useAuthorComments(options?)` -- returnează comentariile unui anumit autor
- `useResolvedAuthorAddress(authorAddress?)` -- rezolvă o adresă care poate fi citită de om (de exemplu, ENS) la adresa sa de protocol

### Furaje

Abonați-vă și paginați fluxurile de conținut.

- `useFeed(options?)` -- returnează un flux paginat de postări de la una sau mai multe comunități
- `useBufferedFeeds(feedOptions?)` -- pre-bufferează fluxuri multiple pentru o randare mai rapidă
- `useAuthorFeed(authorAddress?)` -- returnează un flux de postări ale unui anumit autor

### Acțiuni

Publicați conținut și efectuați operațiuni de scriere.

- `usePublishComment(options?)` -- publicați un comentariu sau un răspuns nou
- `usePublishVote(options?)` -- votează pozitiv sau negativ
- `useSubscribe(options?)` -- abonați-vă sau dezabonați-vă de la o comunitate

### State și RPC

Monitorizați starea conexiunii și interacționați cu un demon Bitsocial la distanță.

- `useClientsStates(options?)` -- returnează starea conexiunii clienților IPFS/pubsub
- `usePlebbitRpcSettings()` -- returnează configurația curentă a demonului RPC

## Dezvoltare

Pentru a lucra local la biblioteca hooks:

**Precondiții:** Node.js, Corepack activat, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Consultați depozitul README pentru comenzile de testare și compilare.

## Legături

- **GitHub:** [referința API completă pe GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licență:** numai GPL-2.0
