---
title: Défi d'appel de contrat EVM
description: Défi anti-spam qui vérifie les conditions en chaîne en appelant un contrat intelligent EVM.
sidebar_position: 4
---

# Défi d'appel de contrat EVM

:::warning Legacy Naming
Ce package a été initialement publié sous la portée `@plebbit`. Il a été renommé `@bitsocial/evm-contract-challenge`. Les références à l’ancien nom peuvent encore apparaître dans d’anciennes documentations ou bases de code.
:::

EVM Contract Call Challenge est un mécanisme anti-spam qui vérifie les conditions en chaîne avant d'autoriser une publication. Extrait à l'origine de `plebbit-js` en tant que package autonome, il permet aux propriétaires de communauté d'exiger que les auteurs répondent aux critères définis par les contrats intelligents (par exemple, détenir un solde de jetons minimum) afin de publier.

**Code source :** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Exigences

- **Node.js** >= 22
- **ESM uniquement** : ce package ne fournit pas de versions CommonJS.
- **Dépendance des homologues d'exécution :** `@plebbit/plebbit-js` (migration vers `@pkc/pkc-js`)

## Mise en place

```bash
npm install @bitsocial/evm-contract-challenge
```

## Options de configuration

| Options       | Tapez    | Descriptif                                                                                                  |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | Chaîne à interroger (par exemple, `eth`, `matic`, `avax`).                                                  |
| `address`     | `string` | L’adresse du contrat intelligent à appeler.                                                                 |
| `abi`         | `string` | Le fragment ABI de la fonction appelée.                                                                     |
| `condition`   | `string` | Une expression de comparaison évaluée par rapport à la valeur de retour du contrat (par exemple, `> 1000`). |
| `error`       | `string` | Le message d'erreur affiché aux auteurs qui ne remplissent pas la condition.                                |

## Exemple

Un propriétaire de communauté qui souhaite limiter la publication aux auteurs détenant plus de 1 000 jetons ERC-20 particuliers configurerait le défi avec :

- `chainTicker` : `"eth"`
- `address` : l'adresse du contrat de token
- `abi` : l'ABI pour `balanceOf(address)`
- `condition` : `"> 1000"`
- `error` : `"You must hold more than 1,000 tokens to post in this community."`

Lorsqu'un auteur tente de publier, le défi appelle `balanceOf` avec l'adresse de l'auteur et vérifie si la valeur renvoyée satisfait à la condition. Si tel est le cas, la publication se poursuit ; sinon, le message d'erreur configuré est renvoyé.

## Quand l'utiliser

EVM Contract Call Challenge est idéal pour :

- **Communautés fermées à jetons** qui limitent la publication aux détenteurs de jetons.
- **Accès sécurisé NFT** où la propriété d'un NFT spécifique est requise.
- **Espaces de gouvernance DAO** où la participation est limitée aux détenteurs de jetons de gouvernance.

Pour les communautés qui ne s'appuient pas sur l'identité en chaîne, envisagez plutôt [Bloqueur de spam](./spam-blocker.md) ou [Défi des bons d'achat](./voucher-challenge.md).
