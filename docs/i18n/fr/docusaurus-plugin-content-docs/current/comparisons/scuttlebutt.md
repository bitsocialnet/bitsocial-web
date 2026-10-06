---
title: Bitsocial et Secure Scuttlebutt
description: Comment Secure Scuttlebutt (SSB) et son application Manyverse se comparent à Bitsocial, des flux en ajout seul et de la réplication par graphe d'abonnements aux communautés, à la lutte contre le spam et à la synchronisation hors ligne.
---

# Bitsocial et Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) est un protocole social peer-to-peer créé par
Dominic Tarr en 2014. [Manyverse](https://www.manyver.se/) en est l'application la plus connue, pour
Android, iOS et ordinateur ; [Patchwork](https://github.com/ssbc/patchwork) était le principal
client de bureau avant d'être archivé. Parmi les systèmes comparés dans cette documentation, SSB est
le plus proche de Bitsocial dans l'esprit : pas de serveurs sur le chemin des données, pas de
blockchain, pas d'ordre global, et des clés Ed25519 pour l'identité. Les deux ont fait des choix
opposés quant à ce que stocke chaque pair et à l'endroit où le spam est arrêté.

## Fonctionnement de Scuttlebutt

- **Flux.** Chaque identité est une paire de clés Ed25519, notée `@<public key>.ed25519`. Tout ce
  qu'un utilisateur publie va dans son propre flux, un journal en ajout seul dans lequel chaque
  message signé porte un numéro de séquence et le hachage du message précédent. Une fois publié, un
  message ne peut plus être modifié, d'après le
  [guide du protocole](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Réplication.** Les pairs copient des flux entiers, et non des publications individuelles, et le
  graphe d'abonnements détermine les flux qu'un pair conserve. Patchwork, par exemple, affichait les
  flux situés jusqu'à deux sauts de distance et répliquait ceux situés jusqu'à trois sauts. Avec les
  arbres de diffusion épidémique (epidemic broadcast trees, EBT), les pairs comparent le dernier
  numéro de séquence qu'ils détiennent pour chaque flux et n'envoient que ce qui manque.
- **Connexions.** Les pairs s'authentifient avec le protocole secret handshake et chiffrent le
  trafic avec box stream. La poignée de main utilise un identifiant de réseau comme clé, si bien que
  les pairs d'un réseau SSB distinct doté d'un autre identifiant ne peuvent pas se connecter au
  réseau principal.
- **Trouver des pairs.** Les pairs s'annoncent sur le réseau local par diffusion UDP et se
  synchronisent sur le LAN ; Manyverse se synchronise aussi par Bluetooth. Sur internet, les
  utilisateurs s'appuient sur des **pubs**, des pairs toujours en ligne qui vous suivent en retour
  une fois que vous avez utilisé un code d'invitation, puis stockent et servent votre flux, et sur
  des **rooms**, qui ne stockent aucun flux mais font transiter par tunnel les connexions entre
  leurs membres.
- **Blobs et messages privés.** Les images et autres fichiers sont des blobs adressés par leur
  contenu et récupérés auprès des pairs, avec une limite de taille par défaut de 5 MB dans les
  implémentations actuelles. Les messages privés sont chiffrés pour sept destinataires au maximum et
  publiés sous forme de texte chiffré dans le flux de l'auteur.

## Ce qui les distingue

### Ce que stocke un pair

Un pair SSB conserve une copie complète de chaque flux compris dans sa zone de réplication, depuis
le premier message de chaque flux, et sert ces flux aux autres. C'est ce qui permet à SSB de
fonctionner hors ligne, mais le stockage croît avec chaque message de cette zone, et une nouvelle
installation doit télécharger ces flux avant d'afficher grand-chose. Un client Bitsocial récupère le
dernier état des communautés qu'il ouvre auprès du nœud de la communauté et des pairs qui la
partagent, et le réseau ne conserve que ce dernier état. Voir
[Protocole peer-to-peer](/peer-to-peer-protocol/).

### Suppression et appareils

Comme un flux est une chaîne de hachages, SSB n'offre aucune suppression à l'échelle du réseau : un
pair peut retirer des messages de sa propre base de données, mais il ne peut pas les faire
disparaître des copies détenues par les autres pairs. Publier avec la même clé depuis deux
appareils, ou depuis une sauvegarde restaurée, provoque une bifurcation (fork) du flux ; la réponse
habituelle est donc une identité par appareil. PZP, le protocole successeur conçu par l'équipe de
Manyverse, cite la suppression, plusieurs appareils par compte et des flux tolérants aux
bifurcations parmi ses principaux changements par rapport à SSB
([billet de lancement](https://www.manyver.se/blog/2024-07-03/)). Un nœud de communauté Bitsocial
publie une nouvelle version de l'état de la communauté à chaque mise à jour, de sorte que le contenu
retiré par ses modérateurs disparaît du dernier état.

### Qui peut vous atteindre

La zone de réplication de SSB lui sert aussi de filtre anti-spam. Le flux d'un inconnu ne vous
parvient que si quelqu'un situé dans vos sauts le suit, et bloquer un flux empêche votre nœud de le
répliquer. Le spam reste à l'écart, mais les nouveaux venus aussi, jusqu'à ce que quelqu'un les
suive. Bitsocial permet à n'importe qui de publier dans une communauté, et le nœud de la communauté
décide, au moyen de son défi, si une publication est acceptée. Voir
[Défis anti-spam personnalisés](/custom-challenges/).

### Communautés

SSB n'a pas d'objet de communauté. Les canaux et les hashtags sont des étiquettes posées sur des
publications individuelles, les réponses d'un fil vivent dans les flux de leurs auteurs respectifs,
et la part du fil que vous voyez dépend des flux que possède votre nœud. Les rooms peuvent avoir des
modérateurs et des listes de membres, mais ceux-ci décident de qui peut se connecter via la room, et
non de ce qui est publié. Une communauté Bitsocial est un objet de premier ordre doté de sa propre
paire de clés, de ses règles, de ses modérateurs et de son défi.

### Infrastructure

Les deux tiennent les serveurs à l'écart du chemin des données, et les deux s'appuient sur des
auxiliaires. Les pubs sont ce que SSB a de plus proche d'un service hébergé : ils stockent et
servent les flux de tous ceux qu'ils suivent. Les rooms se rapprochent davantage des routeurs HTTP
de Bitsocial, puisque ni les uns ni les autres ne stockent de contenu, mais une room relaie la
connexion entre ses membres, tandis qu'un routeur se contente de renvoyer des adresses de
fournisseurs et ne joue aucun rôle dans le transfert. Comme un pair SSB, un nœud de communauté
Bitsocial tourne sur du matériel grand public, et il doit être en ligne pour accepter de nouvelles
publications.

### Hors ligne et réseaux locaux

C'est là que SSB est plus fort. Deux pairs SSB sur le même réseau Wi-Fi, ou en Bluetooth dans
Manyverse, peuvent se synchroniser sans connexion internet, et tout ce qui a déjà été répliqué reste
lisible hors ligne. L'objectif principal affiché de Manyverse est de rendre les réseaux sociaux
indépendants de la connectivité internet. Bitsocial a besoin d'une connexion internet pour trouver
des pairs et pour publier.

### Navigateur

Les principales applications SSB embarquent un nœud SSB complet : Manyverse en intègre un dans ses
applications mobiles et de bureau. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo)
faisait tourner SSB dans un navigateur avec une réplication partielle et des connexions via des
rooms ; il a été archivé en 2022. Les applications Bitsocial exécutent un nœud peer-to-peer dans un
onglet de navigateur ordinaire. Voir [Peer-to-peer dans le navigateur](/browser-p2p/).

### Messages privés

SSB intègre des messages privés chiffrés. Bitsocial se concentre sur les communautés publiques et ne
propose pas encore de messages privés natifs.

## État du projet

André Staltz, qui a créé Manyverse, s'est retiré de SSB, de Manyverse et de leur successeur prévu en
avril 2024 ([sa dernière mise à jour](https://www.manyver.se/blog/2024-04-05/)). En juillet 2024,
Jacob Karlsson a lancé ce successeur sous le nom de [PZP](https://pzp.wiki/) et a écrit qu'il ne
travaillerait plus sur Manyverse et ne connaissait personne d'autre qui comptait le faire. En
octobre 2026, les dépôts de PZP sur [Codeberg](https://codeberg.org/pzp) n'avaient reçu aucune mise
à jour depuis décembre 2024. Le dépôt de Patchwork est archivé, avec la v3.18.1 comme dernière
version, et l'équipe derrière Planetary, une application SSB pour iOS, est passée à Nostr avec son
application Nos en 2023. Le réseau SSB fonctionne toujours grâce aux pairs et aux pubs que des
personnes maintiennent en ligne, mais ses principales applications ne sont plus développées.

## Comparaison

| Question                   | Secure Scuttlebutt                                                                                                | Bitsocial                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Catégorie                  | Protocole de gossip peer-to-peer                                                                                  | Réseau de communautés peer-to-peer                                                                                 |
| Identité                   | Une paire de clés Ed25519 par appareil                                                                            | Paires de clés Ed25519 pour les utilisateurs et les communautés                                                    |
| Où vivent les publications | Le flux en ajout seul de l'auteur, copié par chaque pair qui le réplique                                          | Le nœud du propriétaire de la communauté et les pairs qui la lisent et la partagent                                |
| Ce que conserve un pair    | L'historique complet de chaque flux de sa zone d'abonnements                                                      | Le dernier état des communautés qu'il lit ou partage                                                               |
| Communautés                | Aucun objet de communauté ; canaux et hashtags étiquettent les publications                                       | Objets de premier ordre dont le nœud accepte ou rejette les publications                                           |
| Lutte contre le spam       | Zone de réplication définie par le graphe d'abonnements, et blocages                                              | Le défi de chaque communauté, avant qu'une publication soit acceptée                                               |
| Modération                 | Les abonnements et blocages de chaque utilisateur                                                                 | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent                    |
| Serveurs auxiliaires       | Les pubs stockent et servent les flux ; les rooms font transiter les connexions par tunnel                        | Les routeurs HTTP renvoient des pairs fournisseurs et ne stockent aucun contenu                                    |
| Hors ligne                 | Synchronisation par LAN et Bluetooth sans internet                                                                | Nécessite une connexion internet                                                                                   |
| Navigateur                 | Les applications embarquent un nœud SSB complet                                                                   | Nœud peer-to-peer dans un onglet de navigateur ordinaire                                                           |
| Réseau                     | En fonctionnement, mais ses principales applications ne sont plus développées                                     | Réseau en service, avec des applications comme [5chan](/apps/5chan/) et [Seedit](/apps/seedit/)                    |
| Compromis principal        | Fonctionne hors ligne sans hébergement, mais les flux grossissent indéfiniment et les inconnus restent invisibles | Publication ouverte et prise en charge des navigateurs, mais nécessite internet et ne conserve que le dernier état |
