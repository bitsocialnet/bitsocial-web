---
title: Seedit
description: Un forum sans serveur et décentralisé de style Reddit, construit sur le protocole Bitsocial, où n'importe qui peut créer et posséder des communautés.
sidebar_position: 2
---

# Seedit

Seedit est une alternative sans serveur, sans administrateur et entièrement décentralisée à l'ancien Reddit, construite sur le protocole Bitsocial. Il donne aux utilisateurs la propriété totale de leurs communautés : n'importe qui peut en créer une et plusieurs communautés peuvent se disputer la même route courte, comme `/s/funny`.

## Téléchargements

| Plateforme | Lien                                                   |
| ---------- | ------------------------------------------------------ |
| Internet   | [seedit.app](https://seedit.app)                       |
| Web (ENS)  | `seedit.eth` via le navigateur Brave ou IPFS Companion |
| Bureau     | Disponible pour Mac, Windows et Linux                  |
| Mobile     | Disponible pour Android                                |

## Comment fonctionnent les communautés

Seedit organise le contenu en communautés similaires aux subreddits. Chaque communauté appartient à son créateur et fonctionne sans administration centralisée. Plusieurs communautés peuvent se disputer la même route de [répertoire](/directories/), comme `/s/funny`, qui ouvre la gagnante actuelle. Les abonnements et les liens vers les publications pointent toujours vers la communauté exacte.

### Créer une communauté

Il existe deux manières de créer une nouvelle communauté :

1. **Client de bureau** : utilisez l'interface graphique intégrée dans l'application de bureau pour installer et configurer votre communauté.
2. **bitsocial-cli** — Exécutez l'outil CLI pour créer et gérer des communautés à partir de la ligne de commande.

### Liste de communauté par défaut

Les nouveaux comptes sont abonnés à une liste par défaut de communautés identifiées par leur adresse exacte, définie dans `seedit-default-subscriptions.json` dans le dépôt [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Les candidates des répertoires sont listées dans des fichiers `seedit-directories/seedit-<code>-directory.json` du même dépôt. Pour ajouter votre communauté à l'une ou l'autre liste, soumettez une pull request avec les détails de votre communauté.

## Liens

- **GitHub** : [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Télégramme** : [t.me/seeditreact](https://t.me/seeditreact)
- **Licence** : GPL-2.0 uniquement
