---
title: Bitsocial Chain
description: Phase 3 du plan directeur, consacrée à la couche économique proposée pour les applications Bitsocial, sous la forme d'une appchain L2 Ethereum.
---

# Bitsocial Chain

Bitsocial Chain est la couche économique proposée pour les applications Bitsocial, sous la forme
d'une appchain L2 Ethereum. Le site actuellement dédié à la chaîne est
[chain.bitsocial.net](https://chain.bitsocial.net).

La couche sociale peer-to-peer permet aux communautés, aux identités et aux contenus d'exister en
dehors de la base de données d'une plateforme centrale. Bitsocial Chain doit y ajouter les
primitives partagées de nommage, de monétisation et de paiement qui rendent ces applications plus
difficiles à asphyxier financièrement.

## Ce qu'elle doit alimenter

- des domaines Bitsocial décentralisés comme `.bso`
- les récompenses et les pourboires
- des rails de monétisation durables
- une liquidité partagée entre les applications
- des structures financières plus difficiles à couper pour les banques ou les plateformes
- des effets de réseau qui ne reposent pas sur une entreprise unique propriétaire de toute la pile

L'objectif n'est pas de mettre en avant les mécanismes de token. L'objectif est de rendre les
applications sociales utiles plus durables, plus faciles à financer et moins dépendantes de
fournisseurs centralisés de paiement ou de nommage.

## Preuve de concept actuelle

La première preuve de concept de Bitsocial Chain porte sur les noms natifs `.bso`. Elle démontre
qu'un registre de noms peut être dérivé de l'historique de la L1 Ethereum sans placer le contenu
social sur la chaîne :

- les utilisateurs soumettent leurs intentions d'enregistrement, de mise à jour, de transfert et de
  révocation par de simples transactions sur la L1 Ethereum
- n'importe qui peut faire tourner le nœud de dérivation et reconstituer le même état du registre
  `.bso`
- un résolveur associe un nom `.bso` à la clé publique Bitsocial que les clients utilisent déjà sur
  le protocole peer-to-peer
- les publications, les votes, la modération, les fils et les contenus des communautés restent hors
  chaîne et peer-to-peer

Cette preuve de concept n'est pas un lancement Stage 2 en production. Elle n'a encore ni système de
preuves, ni jeu de contestation, ni code audité, ni déploiement en service, ni tarification
définitive, ni gouvernance définitive. Sa posture de long terme est la transparence par défaut et la
compatibilité avec la vie privée dès la conception : la chaîne principale est publique, tandis que
les futurs pourboires, paiements, récompenses et mécanismes de liquidité devraient éviter d'imposer
des liens permanents entre identité sociale et historique de portefeuille.

## Pourquoi c'est important

Décentraliser les communautés et les identités est nécessaire, mais cela ne suffit pas à
décentraliser l'ensemble des médias sociaux.

Si les applications sociales continuent de dépendre de quelques rails économiques centralisés, elles
restent faciles à faire plier, à écarter ou à priver de ressources financières. Bitsocial Chain est
la réponse proposée à cette seconde couche de dépendance.

## Relation avec les applications

Bitsocial Chain doit se placer sous les applications Bitsocial, pas les remplacer.

Le résultat visible côté public devrait être :

- les communautés restent peer-to-peer
- les applications restent différenciées
- les utilisateurs disposent de fonctions concrètes de nommage et de monétisation
- les créateurs et les communautés peuvent recevoir du soutien depuis n'importe quel client
- la valeur peut circuler dans l'écosystème sans recréer un propriétaire de plateforme centralisé

## Pourquoi elle arrive après l'alternative à Twitter/X

Le plan directeur actuel place Bitsocial Chain après l'alternative à Twitter/X, car cette application n'a pas besoin de la chaîne. Les profils fonctionnent comme des nœuds de profil via un RPC non custodial, et les noms `.bso` peuvent démarrer sur un registre provisoire sur le mainnet d'Ethereum ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) puis migrer vers la chaîne plus tard.

Bitsocial Chain ne devrait pas sacrifier la décentralisation pour un lancement plus précoce. Elle ne devrait ajouter aucune hypothèse de confiance au-delà d'Ethereum lui-même : aucune clé de mise à niveau, aucun conseil de sécurité et aucun opérateur capable de la censurer ou de l'arrêter. La conception la plus prometteuse pour y parvenir, un rollup natif, dépend d'une mise à niveau d'Ethereum qui n'est pas encore programmée. Tant que la chaîne ne peut pas atteindre ce niveau d'exigence, l'alternative à Twitter/X fait grandir la base d'utilisateurs que la chaîne servira.

## Principes de conception

Comme Bitsocial Chain reste une infrastructure proposée plutôt qu'un produit lancé, le plan doit
rester discipliné :

- Les applications et les communautés d'abord. La couche réseau doit renforcer de vrais produits
  sociaux.
- Les fonctions concrètes d'abord. Les noms, les récompenses, les pourboires et les paiements sont
  plus faciles à expliquer qu'une architecture financière abstraite.
- La contribution réelle plutôt que le battage. Les primitives économiques doivent récompenser la
  participation, la construction et le soutien aux communautés.
- La curation est légitime. Les applications peuvent façonner les classements, les paramètres par
  défaut et la découverte pour favoriser les communautés durables.
- Les mécanismes exacts restent ouverts. Cette page explique le rôle de Bitsocial Chain, et non une
  promesse figée sur l'économie finale.
