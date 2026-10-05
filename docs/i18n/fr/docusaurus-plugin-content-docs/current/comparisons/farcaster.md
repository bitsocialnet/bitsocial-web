---
title: Bitsocial et Farcaster
description: Comment Farcaster, avec ses comptes onchain, sa location de stockage et son réseau de validateurs Snapchain, se compare aux communautés peer-to-peer de Bitsocial.
---

# Bitsocial et Farcaster

[Farcaster](https://docs.farcaster.xyz/) place l'identité sur une blockchain et les données sociales
en dehors. Les comptes, les clés d'application et les paiements de stockage vivent dans des contrats
sur OP Mainnet, une couche 2 d'Ethereum. Les publications, appelées casts, ainsi que les abonnements
et les réactions, sont des messages signés stockés par
[Snapchain](https://snapchain.farcaster.xyz/), un réseau proche d'une blockchain qui a remplacé en
2025 l'ancien réseau de Hubs de Farcaster.

## Fonctionnement de Farcaster

- **Comptes.** Un compte est un identifiant Farcaster numérique détenu par une adresse Ethereum, qui
  peut aussi désigner une adresse de récupération. Les applications publient avec des clés
  d'application déléguées, enregistrées onchain ; une clé d'application ne peut pas prendre le
  contrôle du compte.
- **Location de stockage.** Chaque compte loue des unités de stockage, actuellement au prix de 0,20
  $ par unité et par an. Une unité louée depuis juillet 2025 contient 100 casts ; au-delà, les casts
  les plus anciens sont élagués. Les limites de débit augmentent avec le stockage loué.
- **Snapchain.** Des validateurs ordonnent les messages en blocs selon un consensus de type
  Tendermint, et chaque nœud complet conserve les données de tout le réseau. Les nœuds ont besoin
  d'environ 16 Go de RAM et de 2 To de stockage, d'après le
  [guide des nœuds](https://snapchain.farcaster.xyz/getting-started).
- **Noms.** Les noms d'utilisateur par défaut, appelés fnames, sont gratuits et attribués par le
  serveur de noms de Farcaster, qui
  [peut les révoquer](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Les
  utilisateurs peuvent à la place utiliser un nom `.eth` enregistré sur Ethereum.
- **Canaux.** Les canaux thématiques sont une fonctionnalité expérimentale du client Farcaster. Les
  casts publiés dans un canal sont des données du protocole, mais les métadonnées, les abonnements
  et la modération des canaux sont
  [stockés dans le client](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Lecture.** Les applications lisent via un nœud Snapchain qu'elles exploitent ou via un
  fournisseur géré, généralement Neynar.

## Ce qui les distingue

### Blockchains et validateurs

Farcaster dépend d'OP Mainnet pour les comptes et les paiements, et de Snapchain, un réseau proche
d'une blockchain, pour ordonner toutes les données sociales. L'ensemble des validateurs de Snapchain
est soumis à autorisation. Son livre blanc affirme que la censure devient difficile avec une dizaine
de validateurs répartis dans le monde ; en octobre 2026, sa
[liste de validateurs](https://snapchain.farcaster.xyz/validators) était plus courte, et la plupart
des clés appartenaient à Neynar, qui a
[racheté Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) en janvier 2026.
Bitsocial n'a ni chaîne, ni validateurs, ni consensus.

### Payer pour publier

Chaque compte Farcaster paie une location de stockage, et ce stockage plafonne la part de
l'historique d'un compte que le réseau conserve. Dans Bitsocial, publier ne coûte rien au niveau du
protocole ; chaque communauté décide d'exiger ou non un captcha, un paiement, un jeton ou autre
chose. Voir [Défis anti-spam personnalisés](/custom-challenges/).

### Communautés

Les canaux Farcaster sont une fonctionnalité du client : le client stocke leurs métadonnées et
applique la modération des canaux, si bien qu'un cast bloqué dans un canal peut rester valide sur le
réseau et visible dans d'autres applications. Dans Bitsocial, les communautés sont des objets du
protocole dotés de leur propre paire de clés, et le nœud de la communauté accepte ou rejette les
publications.

### Faire tourner l'infrastructure

Un nœud Farcaster contient l'intégralité du réseau, si bien que son stockage croît avec l'ensemble
de l'activité ; Farcaster prévoit une croissance qui approchera les plus grands disques proposés
dans le cloud. Un nœud de communauté Bitsocial ne contient que ses propres communautés et tourne sur
du matériel grand public.

### Navigateur

Une application Farcaster dans le navigateur est un client HTTP d'un nœud ou d'un fournisseur. Une
application web Bitsocial peut exécuter un nœud peer-to-peer dans l'onglet. Voir
[Peer-to-peer dans le navigateur](/browser-p2p/).

## Comparaison

| Question                   | Farcaster                                                                                                        | Bitsocial                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Catégorie                  | Identité onchain et données sociales ordonnées par des validateurs                                               | Réseau de communautés peer-to-peer                                                                                           |
| Identité                   | Identifiant Farcaster détenu par une adresse Ethereum, avec des clés d'application déléguées                     | Paires de clés Ed25519 pour les utilisateurs et les communautés                                                              |
| Où vivent les publications | Snapchain, répliqué sur chaque nœud complet, dans la limite du stockage payé                                     | Le nœud du propriétaire de la communauté et les pairs qui la lisent et la partagent                                          |
| Qui le maintient en ligne  | Les validateurs Snapchain et les opérateurs de nœuds                                                             | Le nœud du propriétaire de la communauté, plus des seeders auxiliaires                                                       |
| Communautés                | Canaux expérimentaux gérés par le client Farcaster                                                               | Objets de premier ordre dont le nœud accepte ou rejette les publications                                                     |
| Lutte contre le spam       | Location de stockage et limites de débit, plus des étiquettes de spam au niveau des applications                 | Le défi de chaque communauté, avant qu'une publication soit acceptée                                                         |
| Modération                 | Responsables de canal dans le client, filtres des applications, risque de censure au niveau des validateurs      | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent                              |
| Noms                       | fnames gratuits révocables par Farcaster, ou noms `.eth`                                                         | Noms `.bso` et `.eth` qui se résolvent en clés                                                                               |
| Navigateur                 | Client HTTP d'un nœud ou d'un fournisseur                                                                        | Nœud peer-to-peer dans un onglet de navigateur ordinaire                                                                     |
| Compromis principal        | Un jeu de données global et cohérent, mais location de stockage, blockchains et un petit ensemble de validateurs | Ni frais ni blockchains, mais pas de jeu de données global et aucune garantie de conservation indéfinie des anciens contenus |
