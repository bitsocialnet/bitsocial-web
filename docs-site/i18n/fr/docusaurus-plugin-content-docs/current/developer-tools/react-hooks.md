---
title: Réagir aux crochets
description: Bibliothèque de hooks React pour créer des applications sociales décentralisées sur le protocole Bitsocial.
sidebar_position: 1
---

# Réagir aux crochets

:::warning Legacy Naming
Ce package utilise actuellement des conventions de dénomination héritées de son fork en amont. Les références à « plebbit » dans le code, les API et la configuration seront migrées vers « bitsocial » dans une prochaine version. La fonctionnalité n’est pas affectée.
:::

Le package `bitsocial-react-hooks` fournit une API de hooks React familière pour interagir avec le protocole Bitsocial. Il gère la récupération des flux, des commentaires et des profils d'auteur, la gestion des comptes, la publication de contenu et l'abonnement à des communautés, le tout sans dépendre d'un serveur central.

Cette bibliothèque est l'interface principale utilisée par [5chan](/apps/5chan/) et d'autres applications client Bitsocial.

:::note
`bitsocial-react-hooks` est un fork temporaire de `plebbit/plebbit-react-hooks` maintenu pour le développement assisté par l'IA. Il est consommé directement depuis GitHub plutôt que publié sur npm.
:::

## Mise en place

Étant donné que le package n'est pas encore sur npm, installez-le directement depuis GitHub, en l'épinglant sur un hachage de validation spécifique :

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Remplacez `<commit-hash>` par le commit que vous souhaitez cibler.

## Présentation de l'API

Les hooks sont organisés en catégories fonctionnelles. Vous trouverez ci-dessous un résumé des crochets les plus couramment utilisés dans chaque catégorie. Pour les signatures complètes, les paramètres et les types de retour, consultez la [référence complète de l'API sur GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Comptes

Gérez les comptes d'utilisateurs locaux, l'identité et les paramètres.

- `useAccount(accountName?)` -- renvoie l'objet compte actif (ou nommé)
- `useAccounts()` -- renvoie tous les comptes stockés localement
- `useAccountComments(options?)` -- renvoie les commentaires publiés par le compte actif

### Commentaires

Récupérez et interagissez avec les commentaires et les fils de discussion individuels.

- `useComment(commentCid?)` -- récupère un seul commentaire par son CID
- `useComments(commentCids?)` -- récupère plusieurs commentaires par lots
- `useEditedComment(comment?)` -- renvoie la dernière version modifiée d'un commentaire

### Communautés

Récupérez les métadonnées et les paramètres de la communauté.

- `useSubplebbit(subplebbitAddress?)` -- récupère une communauté par adresse
- `useSubplebbits(subplebbitAddresses?)` -- récupère plusieurs communautés
- `useSubplebbitStats(subplebbitAddress?)` -- renvoie le nombre d'abonnés et de publications

### Auteurs

Recherchez les profils d’auteur et les métadonnées.

- `useAuthor(authorAddress?)` -- récupère un profil d'auteur
- `useAuthorComments(options?)` -- renvoie les commentaires d'un auteur spécifique
- `useResolvedAuthorAddress(authorAddress?)` -- résout une adresse lisible par l'homme (par exemple, ENS) en son adresse de protocole

### Flux

Abonnez-vous et pagination des flux de contenu.

- `useFeed(options?)` -- renvoie un flux paginé de publications d'une ou plusieurs communautés
- `useBufferedFeeds(feedOptions?)` -- pré-tamponne plusieurs flux pour un rendu plus rapide
- `useAuthorFeed(authorAddress?)` -- renvoie un flux de publications d'un auteur spécifique

### Actions

Publiez du contenu et effectuez des opérations d’écriture.

- `usePublishComment(options?)` -- publier un nouveau commentaire ou répondre
- `usePublishVote(options?)` -- émettre un vote positif ou négatif
- `useSubscribe(options?)` -- s'abonner ou se désabonner d'une communauté

### États et RPC

Surveillez l’état de la connexion et interagissez avec un démon Bitsocial distant.

- `useClientsStates(options?)` -- renvoie l'état de connexion des clients IPFS/pubsub
- `usePlebbitRpcSettings()` -- renvoie la configuration actuelle du démon RPC

## Développement

Pour travailler localement sur la bibliothèque hooks :

**Prérequis :** Node.js, Corepack activé, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Reportez-vous au README du référentiel pour les commandes de test et de génération.

## Liens

- **GitHub :** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licence :** GPL-2.0 uniquement
