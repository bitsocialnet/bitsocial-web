---
title: Bitsocial et Mirage
description: Comment Mirage, un forum à la Reddit fonctionnant sur sa propre blockchain Cosmos SDK, se compare à Bitsocial et à son application à la Reddit, Seedit.
---

# Bitsocial et Mirage

[Mirage](https://mirage.foundation/) est un réseau de discussion à la Reddit, avec des communautés,
des publications organisées en fils et des votes. Au lieu d'une base de données d'entreprise, il
fonctionne sur sa propre blockchain, une chaîne Cosmos SDK dotée du consensus CometBFT. Le produit
le plus proche chez Bitsocial est [Seedit](/apps/seedit/), une application à la Reddit sur le réseau
Bitsocial ; la comparaison porte donc surtout sur la manière dont chacun héberge, possède et modère
les communautés.

## Fonctionnement de Mirage

- **Nœuds.** Un nœud Mirage est un conteneur Docker unique qui regroupe un validateur, une base de
  données PostgreSQL, un indexeur, une API HTTP et l'interface web. Chaque nœud est aussi un
  validateur. En exploiter un exige un serveur Ubuntu sur amd64 et 10 000 000 de jetons MIRAGE sur
  le compte de l'opérateur, selon le
  [guide de déploiement](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Publication.** Le navigateur signe chaque action avec la clé secp256k1 de l'utilisateur, et les
  utilisateurs gratuits calculent aussi une petite preuve de travail. Le nœud encapsule l'action
  dans une transaction de la chaîne et paie les frais.
- **Lecture.** L'indexeur de chaque nœud copie les données de la chaîne dans sa propre base de
  données et sert les fils via une API HTTP. Les nœuds conservent environ une semaine de blocs :
  l'historique à long terme des publications vit donc dans la base de données de chaque nœud, et un
  nouveau nœud démarre sans l'historique antérieur à son point de synchronisation.
- **Comptes.** Un compte est une clé dérivée d'une phrase de récupération de 12 mots, et la même
  phrase fonctionne sur n'importe quel nœud. Les noms d'utilisateur sont inscrits sur la chaîne et
  sont uniques sur tout le réseau.
- **Communautés.** Chaque nom valide est déjà une communauté, et personne ne la possède. Des équipes
  de curateurs rémunérées, comptant jusqu'à dix utilisateurs chacune, entretiennent chacune une vue
  modérée d'une communauté ; les lecteurs choisissent la vue d'une équipe, la vue par défaut du nœud
  ou une vue non censurée. Voir la [FAQ de Mirage](https://mirage.talk/faq).
- **Jeton.** Le jeton MIRAGE sert à payer les abonnements, rémunère les auteurs et les nœuds, et
  donne aux validateurs un poids dans la gouvernance. Les abonnés sont dispensés de la preuve de
  travail et bénéficient de limites plus élevées.

## Ce qui les distingue

### À qui appartient une communauté

Dans Seedit, le créateur d'une communauté détient sa paire de clés, exploite ou délègue son nœud, et
la modère. Dans Mirage, une communauté n'appartient à personne : des équipes de curateurs
concurrentes proposent des vues modérées du même nom, et la vue par défaut est celle de l'équipe
choisie par le plus grand nombre d'abonnés payants.

### Lutte contre le spam

Mirage applique une règle unique à tout le réseau : les utilisateurs gratuits paient au moyen d'une
preuve de travail dont la difficulté s'ajuste au volume entrant, et les abonnés en sont dispensés.
Dans Bitsocial, chaque communauté choisit son propre défi, du captcha au paiement en passant par la
liste d'autorisation. Voir [Défis anti-spam personnalisés](/custom-challenges/).

### Infrastructure

Mirage a besoin d'une blockchain. Les validateurs parviennent à un consensus sur chaque action, et
chaque nœud fait tourner une pile serveur complète et doit détenir un stake important en jetons.
Bitsocial n'a pas de chaîne : un nœud de communauté tourne sur du matériel grand public depuis
l'application de bureau ou `bitsocial-cli`, et les lecteurs peuvent aider à partager le contenu.

### Contrôle à l'échelle du réseau

Mirage dispose d'une gouvernance onchain pondérée par le stake des validateurs. Elle peut modifier
la difficulté, les prix et l'émission de jetons, créer ou détruire des jetons, et nommer des
administrateurs dont les suppressions sont appliquées par l'indexeur de référence à n'importe quelle
publication. Le code de la chaîne permet aussi à la gouvernance de
[supprimer des comptes](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
et
d'[envoyer des jetons depuis n'importe quelle adresse](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
En octobre 2026, quatre validateurs produisaient les blocs de la chaîne, et les procédures
d'exploitation du projet géraient les quatre.

Bitsocial n'a pas d'administrateur au niveau du protocole. Les propriétaires de communautés modèrent
leurs propres communautés et les applications choisissent ce qu'elles affichent. Voir
[Modération locale, pas interdictions mondiales](/local-moderation/).

### Navigateur

Le client web de Mirage est un client HTTP d'un nœud : le navigateur signe les actions mais ne
rejoint pas de réseau peer-to-peer. Les applications Bitsocial peuvent exécuter un nœud peer-to-peer
dans l'onglet du navigateur. Voir [Peer-to-peer dans le navigateur](/browser-p2p/).

## Comparaison

| Question                   | Mirage                                                                                                                                           | Bitsocial                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Catégorie                  | Forum sur sa propre blockchain (Cosmos SDK)                                                                                                      | Réseau de communautés peer-to-peer                                                                                        |
| Identité                   | Clé secp256k1 issue d'une phrase de 12 mots, avec un nom d'utilisateur onchain                                                                   | Paires de clés Ed25519 pour les utilisateurs et les communautés                                                           |
| Où vivent les publications | Transactions de la chaîne, puis la base de données PostgreSQL de chaque nœud                                                                     | Le nœud du propriétaire de la communauté et les pairs qui la lisent et la partagent                                       |
| Qui le maintient en ligne  | Des nœuds validateurs, détenant chacun 10 000 000 MIRAGE                                                                                         | Le nœud du propriétaire de la communauté, plus des seeders auxiliaires                                                    |
| Communautés                | Noms sans propriétaire, avec des équipes de curateurs rémunérées en concurrence                                                                  | Détenues par une paire de clés ; le nœud du propriétaire accepte ou rejette les publications                              |
| Lutte contre le spam       | Preuve de travail à l'échelle du réseau ; les abonnés en sont dispensés                                                                          | Le défi de chaque communauté, avant qu'une publication soit acceptée                                                      |
| Modération                 | Vues des équipes de curateurs, filtres personnels, administrateurs nommés par la gouvernance                                                     | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent                           |
| Économie                   | Jeton MIRAGE pour les abonnements, les récompenses et le stake des validateurs                                                                   | Aucune dans le protocole ; un défi peut exiger un paiement ou un jeton                                                    |
| Navigateur                 | Client HTTP d'un nœud                                                                                                                            | Nœud peer-to-peer dans un onglet de navigateur ordinaire                                                                  |
| Compromis principal        | Un état partagé et ordonné et une inscription facile, mais un petit ensemble de validateurs et des pouvoirs de gouvernance à l'échelle du réseau | Ni chaîne ni stake nécessaires, mais pas d'ordre global et aucune garantie de conservation indéfinie des anciens contenus |
