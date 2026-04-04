---
title: Spam Blocker
description: Service centralisé de détection du spam avec évaluation des risques, défis OAuth et seuils de niveau configurables.
sidebar_position: 1
---

# Spam Blocker

:::warning Dénomination héritée
Ce package a été initialement publié sous la portée `@plebbit`. Il a été renommé `@bitsocial/spam-blocker-server` et `@bitsocial/spam-blocker-challenge`. Les références aux anciens noms peuvent encore apparaître dans d’anciennes documentations ou bases de code.
:::

Spam Blocker est un service centralisé de détection de spam qui évalue les publications entrantes et attribue des scores de risque. Il se compose de deux forfaits :

- **`@bitsocial/spam-blocker-server`** : le serveur HTTP qui héberge les API d'évaluation et de challenge.
- **`@bitsocial/spam-blocker-challenge`** -- un package client léger que les communautés intègrent pour envoyer des publications pour évaluation.

**Code source :** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Comment fonctionne la notation des risques

Chaque publication soumise au point de terminaison `/evaluate` reçoit un score de risque numérique. Le score est une combinaison pondérée de plusieurs signaux :

| Signalisation          | Descriptif                                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Âge du compte          | Les comptes les plus récents reçoivent des scores de risque plus élevés.                                                                                                        |
| Karma                  | Le karma communautaire accumulé réduit le risque.                                                                                                                               |
| Réputation de l'auteur | Données de réputation collectées par l’indexeur de réseau en arrière-plan.                                                                                                      |
| Analyse de contenu     | Heuristiques au niveau du texte (densité des liens, modèles de spam connus, etc.).                                                                                              |
| Vitesse                | Les publications successives rapides du même auteur augmentent le risque.                                                                                                       |
| Intelligence IP        | Géolocalisation au niveau du pays et recherche de flux de menaces. Seuls les codes de pays sont stockés : les adresses IP brutes ne sont jamais partagées avec les communautés. |

## Seuils de niveau

Le score de risque correspond à l'un des quatre niveaux configurables qui déterminent ce qui se passe ensuite :

1. **Acceptation automatique** : le score est suffisamment bas pour que la publication soit approuvée sans aucune contestation.
2. **OAuth-suffisant** : l'auteur doit effectuer une vérification OAuth pour continuer.
3. **OAuth-plus-more** -- OAuth seul ne suffit pas ; une vérification supplémentaire (par exemple, CAPTCHA) est requise.
4. **Rejet automatique** -- le score est trop élevé ; la publication est catégoriquement rejetée.

Toutes les valeurs de seuil sont configurables par communauté.

## Flux de défi

Lorsqu'une publication entre dans un niveau qui nécessite une vérification, le flux de contestation commence :

1. L'auteur est d'abord invité à s'authentifier via **OAuth** (GitHub, Google, Twitter et autres fournisseurs pris en charge).
2. Si OAuth seul est insuffisant (niveau 3), un **CAPTCHA de secours** optimisé par Cloudflare Turnstile est présenté.
3. L'identité OAuth est utilisée uniquement à des fins de vérification : elle n'est **jamais partagée** avec la communauté ou d'autres utilisateurs.

## Points de terminaison de l'API

### `POST /evaluate`

Soumettre une publication pour évaluation des risques. Renvoie le score de risque calculé et le niveau de défi requis.

### `POST /challenge/verify`

Soumettez le résultat d'un défi terminé (jeton OAuth, solution CAPTCHA ou les deux) pour vérification.

### `GET /iframe/:sessionId`

Renvoie une page HTML intégrable qui affiche l'interface utilisateur de défi appropriée pour la session donnée.

## Limitation du débit

Les limites de débit sont appliquées de manière dynamique en fonction de l'âge et de la réputation de l'auteur. Les auteurs plus récents ou de moindre réputation sont confrontés à des limites plus strictes, tandis que les auteurs établis bénéficient de seuils plus généreux. Cela évite les inondations de spam sans pénaliser les participants de confiance.

## Indexeur de réseau d'arrière-plan

Le serveur exécute un indexeur en arrière-plan qui analyse en permanence le réseau pour créer et conserver les données de réputation des auteurs. Ces données alimentent directement le pipeline de notation des risques, permettant au système de reconnaître les participants répétés de bonne foi dans toutes les communautés.

## Confidentialité

Spam Blocker est conçu dans un souci de confidentialité :

- Les identités OAuth sont utilisées uniquement pour la vérification des défis et ne sont **jamais divulguées** aux communautés.
- Les adresses IP sont résolues en **codes de pays uniquement** ; les adresses IP brutes ne sont ni stockées ni partagées.

## Base de données

Le serveur utilise **SQLite** (via `better-sqlite3`) pour la persistance locale des données de réputation, de l'état de session et de la configuration.
