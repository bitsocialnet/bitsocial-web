---
title: BSO Resolver
description: Résolvez les noms de domaine .bso en clés publiques à l'aide des enregistrements ENS TXT, avec mise en cache intégrée et prise en charge multiplateforme.
sidebar_position: 1
---

# BSO Resolver

Le résolveur BSO traduit les noms de domaine `.bso` en leurs clés publiques correspondantes en lisant les enregistrements Bitsocial TXT stockés sur ENS. Il fournit un client Viem partagé, une mise en cache persistante et fonctionne à la fois dans les environnements Node.js et de navigateur.

- **GitHub** : [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licence** : GPL-2.0 uniquement

## Mise en place

```bash
npm install @bitsocial/bso-resolver
```

## Création d'un résolveur

Instanciez le résolveur en passant un objet de configuration au constructeur :

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Paramètre  | Obligatoire | Descriptif                                               |
| ---------- | ----------- | -------------------------------------------------------- |
| `key`      | Oui         | Identifiant de l’instance de résolveur.                  |
| `provider` | Oui         | Configuration des transports (voir ci-dessous).          |
| `dataPath` | Non         | Répertoire du fichier cache SQLite (Node.js uniquement). |

### Options du fournisseur

Le paramètre `provider` accepte trois formats :

- **`"viem"`** -- Utilise les transports publics par défaut fournis par viem.
- **URL HTTP(S)** : se connecte via un point de terminaison JSON-RPC (par exemple, `https://mainnet.infura.io/v3/YOUR_KEY`).
- **URL WebSocket** : se connecte via un point de terminaison WebSocket RPC (par exemple, `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Méthodes

### `resolve({ name, abortSignal? })`

Recherche un nom `.bso` et renvoie la clé publique associée. Un `AbortSignal` facultatif peut être transmis pour annuler les demandes de longue durée.

### `canResolve({ name })`

Renvoie un booléen indiquant si le résolveur est capable de gérer le nom donné. Utilisez-le pour vérifier la prise en charge avant de tenter une résolution complète.

### `destroy()`

Détruit le résolveur, ferme les connexions à la base de données et libère les ressources. Appelez ceci lorsque le résolveur n'est plus nécessaire.

## Mise en cache

Les noms résolus sont automatiquement mis en cache pour réduire les recherches réseau redondantes. Le backend de mise en cache est choisi en fonction de l'environnement d'exécution :

| Environnement | Back-end                | Remarques                                                         |
| ------------- | ----------------------- | ----------------------------------------------------------------- |
| Noeud.js      | SQLite                  | Stocké à `dataPath`. Utilise le mode WAL pour un accès simultané. |
| Navigateur    | Base de données indexée | Utilise les transactions IndexedDB natives.                       |
| Repli         | En mémoire `Map`        | Utilisé lorsque ni SQLite ni IndexedDB ne sont disponibles.       |

Toutes les entrées du cache ont une **durée de vie d'une heure** et sont automatiquement supprimées après expiration.

## Intégration avec pkc-js

Le résolveur peut être connecté directement à pkc-js via l'option `nameResolvers`, permettant une résolution transparente du nom `.bso` lors des recherches de clés :

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Concurrence

Le résolveur est conçu pour être sûr en cas d'utilisation simultanée :

- Un seul client Viem partagé évite les connexions redondantes.
- SQLite fonctionne en mode WAL (Write-Ahead Logging), permettant des lectures simultanées sans blocage.
- La mise en cache du navigateur s'appuie sur les transactions IndexedDB natives pour l'isolation.

## Points d'entrée de la plateforme

Le package contient des points d'entrée distincts pour les versions de Node.js et du navigateur. Les bundlers qui prennent en charge le champ `exports` dans `package.json` sélectionneront automatiquement le bon.
