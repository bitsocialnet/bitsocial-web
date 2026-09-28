---
title: Peer-to-peer dans le navigateur
description: Comment une application web Bitsocial exécute un véritable nœud libp2p dans l'onglet du navigateur, quels transports elle utilise, et le correctif amont de 2026 qui a rendu possible la publication depuis un onglet.
---

# Peer-to-peer dans le navigateur

Une application web Bitsocial n'est pas condamnée à être le client du serveur de quelqu'un d'autre.
Elle peut exécuter un nœud [Helia](https://helia.io/) directement dans l'onglet du navigateur,
rejoindre le même réseau peer-to-peer que les nœuds de bureau et les nœuds CLI, récupérer le contenu
des communautés auprès des pairs et publier via pubsub.

Cette page explique ce que cela signifie concrètement, quels transports sont utilisés, ce qui reste
hors de portée, et pourquoi la publication depuis un onglet n'a commencé à fonctionner qu'en 2026.

Pour la conception d'ensemble du réseau, voir [Protocole peer-to-peer](/peer-to-peer-protocol/).

## Ce qui s'exécute dans l'onglet

Lorsque le P2P navigateur est actif, la page héberge un véritable nœud libp2p :

- il se connecte à d'autres pairs via des WebSockets sécurisés
- il récupère et vérifie le contenu des communautés auprès de ces pairs, et non depuis une passerelle IPFS
- il participe à gossipsub, si bien que publier un message ne nécessite pas de fournisseur pubsub hébergé
- il utilise la même pile cliente de protocole (`pkc-js`) que toutes les autres applications Bitsocial

La conséquence pratique est qu'aucun opérateur de passerelle ne s'interpose entre un lecteur web et
une communauté. Il n'existe aucun point d'accès HTTPS unique sur lequel faire pression pour retirer
une communauté à tous les utilisateurs de navigateur d'un seul coup.

## Comment les nœuds de navigateur se connectent

`pkc-js` se connecte aux pairs via des **WebSockets sécurisés**. Les connexions WebRTC et
WebTransport sont refusées par défaut par un connection gater, parce que dans le navigateur elles
ajoutent des chemins d'établissement de connexion longs et souvent voués à l'échec — négociation
STUN/ICE, rotation de certhash — qui ralentissent le chargement des pages, alors que WebSocket offre
un transport direct et fiable. Les appelants qui veulent spécifiquement WebRTC ou WebTransport
peuvent surcharger le gater via
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

La conséquence pratique est qu'un pair navigateur se connecte à des nœuds exposant un point d'accès
WSS, ce qui suppose que ces nœuds disposent d'un domaine et d'un certificat signé par une autorité de
certification. Les pairs derrière des connexions grand public qui n'en ont pas sont joints
indirectement plutôt que contactés depuis l'onglet.

## Pourquoi la publication depuis le navigateur n'a commencé à fonctionner qu'en 2026

Le peer-to-peer dans le navigateur n'est pas une idée neuve. Ce qui a changé en 2026, c'est que les
_publications_ d'un nœud de navigateur atteignent désormais le reste du réseau.

La spécification pubsub de libp2p exige que le `seqno` d'un message soit un entier 64 bits
big-endian croissant de façon linéaire. `js-libp2p-gossipsub` générait à la place 8 octets
aléatoires, alors que go-libp2p-pubsub et rust-libp2p utilisaient tous deux un compteur. Kubo 0.40+
active `BasicSeqnoValidator` par défaut, ce qui rejette tout message dont le seqno n'est pas
supérieur au plus élevé déjà observé pour ce pair.

En pratique, la plupart des messages publiés par un nœud JavaScript — y compris un nœud de
navigateur — étaient silencieusement écartés par les pairs Kubo. Un cas de reproduction a mesuré
entre 2 et 8 messages reçus sur 30.

Le problème a été diagnostiqué dans
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) et corrigé
dans **`@libp2p/gossipsub` 15.0.21** en mai 2026. Jusqu'à l'arrivée de ce correctif, un nœud de
navigateur pouvait se connecter et lire, mais ses publications disparaissaient le plus souvent en
chemin vers les pairs Go. `pkc-js` embarque `@libp2p/gossipsub` 16.0.4, postérieur à ce correctif.

## Ce qu'un nœud de navigateur ne peut toujours pas faire

Un nœud de navigateur est un pair à part entière, pas un serveur. Ses limites diffèrent de celles
d'un nœud de bureau ou d'un nœud toujours actif :

- il ne peut généralement pas accepter de connexions entrantes arbitraires depuis l'internet public
- il ne fonctionne que tant que l'onglet est ouvert : ce n'est donc pas un hébergeur durable pour les données d'une communauté
- il ne peut pas rejoindre une DHT libp2p, raison pour laquelle la découverte passe par des routeurs HTTP
- il se prête mal au seeding à grande échelle

L'hébergement complet d'une communauté reste mieux assuré par une application de bureau,
`bitsocial-cli` ou un autre nœud toujours actif. Le P2P navigateur change qui peut _lire et publier_
sans passerelle ; il ne supprime pas le besoin de pairs qui restent en ligne.

## Les routeurs HTTP ne sont pas des passerelles

Les clients navigateur interrogent toujours des [routeurs HTTP](/peer-to-peer-protocol/#public-key-based-addressing)
pour savoir quels pairs fournissent actuellement l'adresse d'une communauté. C'est l'astérisque
honnête du « peer-to-peer pur dans le navigateur », et il vaut la peine d'être précis à ce sujet :

- un routeur ne stocke que des adresses de pairs pour une adresse de contenu
- il ne stocke pas, ne sert pas et ne connaît même pas le contenu de la communauté
- les clients interrogent plusieurs routeurs en parallèle et fusionnent les résultats
- n'importe qui peut en faire tourner un, et changer de routeur est une modification de configuration sans migration de données

Une fois la découverte effectuée, le transfert de contenu et le trafic pubsub circulent en
peer-to-peer. Un routeur qui disparaît vous coûte un chemin de recherche, pas vos données. Une
passerelle IPFS, à l'inverse, se trouve sur le chemin du contenu.

## Où cela fonctionne aujourd'hui

- [5chan](/apps/5chan/) fonctionne par défaut en P2P navigateur pur dans l'application web sur
  [5chan.app](https://5chan.app).

## Repli sur passerelle

L'accès par passerelle existe toujours comme voie de compatibilité pour les navigateurs ou les
réseaux qui ne peuvent pas se connecter directement. Voir
[Repli sur passerelle](/peer-to-peer-protocol/#gateway-fallback). L'architecture cible privilégie le
P2P navigateur, avec les passerelles comme repli optionnel plutôt que comme goulot d'étranglement par
défaut.
