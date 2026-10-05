---
title: Bitsocial et Nostr
description: Comment le modèle de Nostr, fondé sur des relais, se compare aux communautés peer-to-peer de Bitsocial, du chemin des données et de l'identité aux groupes, à la lutte contre le spam et à la modération.
---

# Bitsocial et Nostr

Nostr n'entre proprement ni dans la catégorie des réseaux fédérés ni dans celle des blockchains. Les
instances ne délivrent pas de comptes aux utilisateurs, et il n'y a ni chaîne, ni consensus, ni gas,
ni ordre global. On décrit mieux Nostr comme un **réseau social fondé sur des relais** : les
utilisateurs détiennent des paires de clés, signent des événements et les publient vers des relais,
qui sont des serveurs ordinaires chargés de les stocker et de les servir
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Le
[README](https://github.com/nostr-protocol/nostr) de Nostr indique lui-même qu'il ne repose pas sur
des techniques peer-to-peer.

Cela rapproche Nostr de Bitsocial, davantage que les systèmes fédérés ou blockchain, sur un point
important : l'identité y est cryptographique et portable. Les différences tiennent à la couche de
données et à la question de savoir qui contrôle l'accès.

## Fonctionnement de Nostr

- **Événements et relais.** Chaque publication, profil ou réaction est un événement JSON signé. Les
  clients publient des événements vers des relais via WebSocket et s'y abonnent avec des filtres ;
  les relais stockent les événements et les renvoient. Les relais ne communiquent pas entre eux.
- **Réplication.** Les utilisateurs publient généralement vers plusieurs relais. Une étude portant
  sur 712 relais en 2023 a constaté qu'une publication se trouvait en moyenne sur 34,6 d'entre eux
  ([Wei et Tyson](https://arxiv.org/abs/2402.05709)).
- **Trouver les publications de quelqu'un.** Les utilisateurs publient la liste des relais vers
  lesquels ils écrivent et depuis lesquels ils lisent
  ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), et les clients récupèrent
  les publications d'un utilisateur auprès de ses relais d'écriture.
- **Identité.** Chaque utilisateur est une clé secp256k1 qui signe avec des signatures de Schnorr.
  Les spécifications ne prévoient ni rotation ni récupération des clés : une clé perdue est un
  compte perdu. Des identifiants facultatifs `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) sont vérifiés à l'aide d'un
  fichier hébergé sur le serveur web de ce domaine.
- **Groupes.** Le mécanisme communautaire recommandé est celui des groupes fondés sur des relais
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)) : un relais héberge un
  groupe, applique ses règles d'adhésion et de publication avant d'accepter une publication, et
  signe ses métadonnées. Les anciennes communautés approuvées par des modérateurs
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) sont désormais marquées comme
  non recommandées au profit de NIP-29.
- **Lutte contre le spam.** Chaque relais choisit son filtre d'accès : preuve de travail
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), authentification et listes
  d'autorisation ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), paiement ou
  limites de débit. Les clients y ajoutent des listes de comptes masqués et des scores de confiance.
- **Médias.** Les images et les vidéos sont téléversées vers des serveurs de fichiers HTTP
  distincts.

## Ce qui les distingue

### Qui stocke et sert les publications

Dans Nostr, les relais constituent la couche de stockage et de diffusion : un serveur doit maintenir
chaque publication en ligne. Dans Bitsocial, les routeurs HTTP aident seulement les clients à
trouver des pairs. Ils ne stockent ni publications, ni profils, ni métadonnées de communauté, ni
état de modération ; les clients récupèrent le contenu auprès du nœud de la communauté et des pairs
qui la partagent. Voir [Protocole peer-to-peer](/peer-to-peer-protocol/).

### Qui contrôle l'accès

Dans Nostr, le contrôle de l'écriture appartient aux opérateurs de relais. En dehors des groupes
NIP-29, une clé refusée par un relais peut publier le même événement vers n'importe quel relais qui
l'accepte, et ce que voient les lecteurs dépend des relais que lit leur client. Un groupe NIP-29 se
rapproche davantage d'une communauté Bitsocial : son relais hôte accepte ou rejette les
publications. Le relais définit toutefois ce que peuvent faire les rôles du groupe, et l'historique
du groupe reste lié à ce relais, à moins qu'un autre relais n'accepte de le reprendre.

Dans Bitsocial, une communauté est un objet cryptographique doté de sa propre paire de clés. Le nœud
de la communauté exécute le défi choisi par le propriétaire et publie l'état accepté sur le réseau
peer-to-peer. Voir [Défis anti-spam personnalisés](/custom-challenges/).

### Faire tourner l'infrastructure

Un relais est un serveur doté d'un domaine et d'un point de terminaison WebSocket, et les relais
populaires supportent le coût de stockage et de bande passante de ce qu'ils servent. L'étude de 2023
estimait qu'environ 95 % des relais gratuits ne parvenaient pas à couvrir leurs coûts grâce aux
dons. Un nœud de communauté Bitsocial tourne sur du matériel grand public, et les pairs qui lisent
une communauté peuvent aider à la partager.

### Navigateur

Un client web Nostr ouvre des connexions WebSocket directement vers les relais, sans serveur
d'application. Une application web Bitsocial exécute un nœud peer-to-peer dans l'onglet et récupère
le contenu auprès des pairs. Voir [Peer-to-peer dans le navigateur](/browser-p2p/).

### Anciens contenus

Les publications Nostr sont largement répliquées entre relais, ce qui aide les anciennes
publications à survivre. Bitsocial conserve le dernier état de chaque communauté et ne garantit pas
la conservation indéfinie des anciens contenus.

## Comparaison

| Question                   | Nostr                                                                                                                  | Bitsocial                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Catégorie                  | Protocole fondé sur des relais                                                                                         | Réseau de communautés peer-to-peer                                                                  |
| Identité                   | Clé utilisateur secp256k1, sans rotation dans les spécifications                                                       | Paires de clés Ed25519 pour les utilisateurs et les communautés                                     |
| Où vivent les publications | Des relais choisis par l'auteur, souvent nombreux                                                                      | Le nœud du propriétaire de la communauté et les pairs qui la lisent et la partagent                 |
| Qui le maintient en ligne  | Les opérateurs de relais                                                                                               | Le nœud du propriétaire de la communauté, plus des seeders auxiliaires                              |
| Communautés                | Groupes hébergés par des relais (NIP-29)                                                                               | Objets de premier ordre dont le nœud accepte ou rejette les publications                            |
| Lutte contre le spam       | La politique de chaque relais : preuve de travail, authentification, paiement, listes d'autorisation, limites de débit | Le défi de chaque communauté, avant qu'une publication soit acceptée                                |
| Modération                 | Politiques des relais, listes de comptes masqués côté client, étiquettes et signalements                               | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent     |
| Noms                       | Identifiants facultatifs `name@domain` vérifiés via HTTPS                                                              | Noms `.bso` et `.eth` qui se résolvent en clés                                                      |
| Navigateur                 | Client WebSocket des relais                                                                                            | Nœud peer-to-peer dans un onglet de navigateur ordinaire                                            |
| Compromis principal        | Identité portable et large réplication, mais disponibilité et politique dépendantes des relais                         | Moins de dépendance aux relais, mais aucune garantie de conservation indéfinie des anciens contenus |
