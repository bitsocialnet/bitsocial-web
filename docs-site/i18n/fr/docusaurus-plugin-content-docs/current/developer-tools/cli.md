---
title: CLI
description: Interface de ligne de commande pour exécuter un nœud Bitsocial, créer des communautés et gérer les opérations de protocole.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
Ce package utilise actuellement des conventions de dénomination héritées de sa dépendance en amont. Les références à « plebbit » dans les commandes, la sortie et la configuration seront migrées vers « bitsocial » dans une prochaine version. La fonctionnalité n’est pas affectée.
:::

Le `bitsocial-cli` est un outil de ligne de commande permettant d'interagir avec le backend du protocole Bitsocial. Il vous permet d'exécuter un démon P2P local, de créer et de configurer des communautés et de publier du contenu, le tout depuis le terminal.

Il est construit sur `plebbit-js` et est utilisé par [5chan](/apps/5chan/) et [Seedit](/apps/seedit/) pour la création de communauté et la gestion de nœuds.

## Mise en place

Des binaires prédéfinis sont disponibles pour Windows, macOS et Linux. Téléchargez la dernière version pour votre plateforme depuis GitHub :

**[Télécharger à partir des versions GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Après le téléchargement, rendez l'exécutable binaire (macOS/Linux) :

```bash
chmod +x bitsocial-cli
```

## Exécuter le démon

L'utilisation la plus courante de la CLI consiste à exécuter un nœud Bitsocial. Le démon démarre la couche réseau P2P et expose une API locale à laquelle les clients peuvent se connecter.

```bash
bitsocial-cli daemon
```

Au premier lancement, le démon génère des liens vers **WebUI**, une interface graphique basée sur un navigateur pour gérer votre nœud, vos communautés et vos paramètres. Ceci est utile si vous préférez une interface graphique aux commandes du terminal.

## Commandes clés

| Commande            | Descriptif                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| `daemon`            | Démarrez le nœud Bitsocial P2P                                             |
| `create subplebbit` | Créer une nouvelle communauté                                              |
| `subplebbit edit`   | Mettre à jour les paramètres de la communauté (titre, description, règles) |
| `subplebbit list`   | Répertorier les communautés hébergées sur ce nœud                          |
| `subplebbit start`  | Commencez à servir une communauté spécifique                               |
| `subplebbit stop`   | Arrêter de servir une communauté spécifique                                |

Exécutez n'importe quelle commande avec `--help` pour voir les options et les indicateurs disponibles :

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Flux de travail typique

Un flux de configuration courant pour héberger une nouvelle communauté :

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

La communauté est désormais live sur le réseau Bitsocial et accessible depuis n'importe quel client compatible.

## Liens

- **GitHub :** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
