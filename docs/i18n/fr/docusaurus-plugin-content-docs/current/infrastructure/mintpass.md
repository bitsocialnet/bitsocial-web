---
title: Mintpass
description: Système d'authentification basé sur NFT qui aide les communautés Bitsocial à vérifier les utilisateurs et à réduire les attaques Sybil.
sidebar_position: 2
---

# Mintpass

Mintpass est un système d'authentification basé sur NFT pour les communautés Bitsocial. Les utilisateurs créent un NFT de vérification non transférable après avoir relevé un défi (tel que SMS OTP), et les communautés peuvent vérifier la propriété du NFT pour se prémunir contre les attaques sybil telles que les faux votes, l'évasion d'interdiction et le spam.

- **GitHub** : [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licence** : MIT

## Comment ça marche

Le flux de vérification comporte quatre étapes :

1. **Demande** -- L'utilisateur visite `mintpass.org/request` pour commencer le processus.
2. **Défi** : l'utilisateur effectue une vérification de mot de passe à usage unique par SMS.
3. **Mint** – Une fois la vérification réussie, un NFT non transférable est créé dans le portefeuille de l'utilisateur.
4. **Vérifier** -- Les communautés interrogent la propriété NFT pour confirmer que l'utilisateur a été vérifié.

Étant donné que le NFT n'est pas transférable, il reste lié au portefeuille qui a effectué la vérification, empêchant les utilisateurs d'échanger ou de vendre leur statut vérifié.

## Structure du projet

Le référentiel est organisé en trois zones principales :

| Annuaire     | Objectif                                                    |
| ------------ | ----------------------------------------------------------- |
| `contracts/` | Contrats intelligents de solidité pour la vérification NFT. |
| `challenge/` | Couche d'intégration pour le système de défi Bitsocial.     |
| `web/`       | Frontend Next.js et React pour le flux de frappe.           |

## Confidentialité et traitement des données

Mintpass adopte une approche de données minimales :

- **Les données opérationnelles** (codes OTP, jetons de session) sont stockées dans Redis avec des durées de vie courtes et expirent automatiquement.
- **L'association Mint** (le lien entre une identité vérifiée et un portefeuille) est le seul enregistrement persistant.

Aucun numéro de téléphone ni aucune donnée personnelle ne sont conservés après la fermeture de la fenêtre de vérification.

## Couches de sécurité facultatives

Les opérateurs communautaires peuvent activer des protections supplémentaires en fonction de leur modèle de menace :

- **Contrôles de réputation IP** – Évaluez les requêtes entrantes par rapport aux bases de données d'abus connus.
- **Évaluation des risques téléphoniques** -- Signalez les numéros jetables ou VoIP avant de lancer un défi.
- **Géoblocage** – Restreindre la vérification à des régions spécifiques.
- ** Cooldowns par IP ** – Limite de taux de tentatives de vérification répétées à partir de la même adresse.

## Pile technologique

| Couche    | Technologie                               |
| --------- | ----------------------------------------- |
| Contrats  | Solidity, déployé avec Hardhat et Foundry |
| Front-end | Suivant.js + Réagir                       |
| Réseau    | Base (Ethereum L2)                        |

Le déploiement sur la base permet de maintenir les coûts du gaz à un niveau bas tout en héritant des garanties de sécurité d'Ethereum.

## Feuille de route

Les améliorations prévues comprennent :

- **Option de paiement à la monnaie** -- Permettre aux communautés d'exiger des frais minimes pour la frappe, ajoutant ainsi une barrière économique sybil.
- **Signaux de vérification supplémentaires** – Étendez-vous au-delà des SMS pour inclure d'autres signaux d'identité.
- **Outils d'administration étendus** – Des tableaux de bord et des contrôles plus riches pour les opérateurs de communauté.
