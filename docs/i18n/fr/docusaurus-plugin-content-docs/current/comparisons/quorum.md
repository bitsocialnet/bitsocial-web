---
title: Bitsocial et Quorum
description: Comment Quorum, la messagerie de groupe chiffrée de bout en bout de Quilibrium, organisée en Spaces à la manière de Discord, se compare aux communautés publiques peer-to-peer de Bitsocial.
---

# Bitsocial et Quorum

[Quorum](https://www.quorummessenger.com/) est une messagerie de groupe de Quilibrium Inc.,
l'entreprise à l'origine du réseau [Quilibrium](https://quilibrium.com/). Quorum est organisé comme
Discord, avec des Spaces, des canaux, des rôles et des messages directs, et ses messages sont
chiffrés de bout en bout. On le cite aux côtés de Bitsocial, car les deux se présentent comme
peer-to-peer et résistants à la censure, avec des groupes qui fixent leurs propres règles. Leurs
objectifs diffèrent pourtant : Quorum vise la discussion de groupe privée, Bitsocial les communautés
publiques que n'importe qui peut lire.

Quilibrium se présente comme une alternative décentralisée aux plateformes cloud : un réseau de
nœuds qui conservent les données dans un hypergraphe chiffré et s'accordent sur son état grâce à un
consensus qu'il appelle Proof of Meaningful Work. Les nœuds gagnent des QUIL, le jeton du réseau,
qui sert à payer les frais d'utilisation. Quorum est né en 2018 sous le nom de Howler, l'idée d'une
alternative privée à Discord, et est devenu la première application mise en service sur Quilibrium,
d'après l'[histoire de Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/).
Quilibrium Inc., fondée par Cassie Heart, développe le protocole et propose Quorum comme l'un de ses
services gérés ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Fonctionnement de Quorum

Les détails ci-dessous proviennent du code source des clients de Quorum, tel qu'il se présentait en
octobre 2026 : [quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) pour les
applications web et de bureau, et [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile).

- **Identités.** L'identité maîtresse d'un utilisateur est un jeu de clés Ed448, et chaque appareil
  reçoit ses propres clés X448 et Ed448. Dans le navigateur, les clés sont normalement protégées par
  une clé d'accès (passkey) ; l'application mobile les dérive d'une phrase de récupération. Les
  adresses sont des hachages qui commencent par `Qm`, et les utilisateurs peuvent afficher un nom
  d'utilisateur issu du service de noms de Quilibrium.
- **Chiffrement.** Les messages directs utilisent le Double Ratchet entre appareils. Un Space
  partage une seule session Triple Ratchet entre ses membres, qui signent leurs messages avec des
  clés propres au Space. Chaque Space est chiffré. Quorum affirme que son intermédiation des
  messages empêche de relier expéditeurs et destinataires, mais le client web et de bureau s'abonne
  à toutes les boîtes de réception d'un appareil, y compris celle qui figure dans l'inscription
  publique de l'utilisateur, en
  [une seule requête](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/components/context/MessageDB.tsx#L616-L623)
  adressée au service, qui peut donc les rattacher à l'adresse de l'utilisateur.
- **Adhésion.** On entre dans un Space au moyen d'un lien d'invitation. Un lien à usage unique porte
  dans l'URL les clés nécessaires pour rejoindre le Space ; un lien public les récupère auprès du
  service Quorum, et les Spaces publics peuvent figurer dans un annuaire où l'on peut faire des
  recherches.
- **Transport.** Pour la messagerie, les clients web, de bureau et mobile se connectent tous, en
  HTTPS et par un WebSocket, à un seul service,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Celui-ci relaie les messages chiffrés vers la boîte de réception de chaque membre et les conserve
  jusqu'à ce que le client en accuse réception. Il stocke aussi les inscriptions des utilisateurs,
  les profils publics activés volontairement, le manifeste chiffré de chaque Space (canaux, rôles,
  emoji), les éléments d'invitation, l'annuaire public et une synchronisation facultative et
  chiffrée des réglages. Le logiciel de nœud de Quilibrium comporte un service de boîte de réception
  et de hub de même forme, mais ni les clients ni la documentation de Quilibrium n'indiquent comment
  ce service s'articule avec le réseau.
- **Historique.** Le client de chaque membre conserve sa propre copie du Space dans le stockage
  local, et les deux clients récupèrent dans leurs boîtes de réception sur le service les messages
  envoyés pendant qu'ils étaient hors ligne. Pour l'historique plus ancien, le client web et de
  bureau demande à un membre en ligne de se synchroniser, tandis que le client mobile rejoue un
  journal durable que le service conserve pour chaque Space.
- **Modération.** Les rôles accordent la suppression, l'épinglage, la mise en sourdine et les
  mentions `@everyone`. Le client de chaque membre vérifie la signature de chaque action de
  modération et ne l'applique que si le signataire détient le bon rôle. Le propriétaire peut
  expulser un membre, ce qui renouvelle les clés du Space afin que le membre expulsé ne puisse pas
  lire les nouveaux messages. Un Space peut exiger des messages signés ou laisser les membres publier
  des messages non signés et niables. Les fiches de l'annuaire public portent un statut d'examen, et
  les utilisateurs peuvent signaler au service Quorum des Spaces et, depuis l'application mobile,
  des messages individuels.
- **Code.** Le client web et de bureau est sous licence AGPL-3.0, et le client mobile sous GPL-3.0.
  Le client mobile comprend aussi un portefeuille crypto, une intégration Farcaster et Apex, un
  abonnement payant décrit plus bas.

## Ce qui les distingue

### Groupes privés et communautés publiques

Un Space Quorum est un groupe de membres : seules les personnes qui détiennent ses clés peuvent le
lire, et il faut un lien d'invitation pour le rejoindre. Un lien public laisse entrer n'importe qui,
mais seulement une fois le Space rejoint. Une communauté Bitsocial n'a pas de notion de membre.
N'importe qui peut la lire, depuis n'importe quelle application, sans la rejoindre, et n'importe qui
peut tenter d'y publier, sous réserve de réussir le défi de la communauté.

### Ce qui maintient un groupe en ligne

Un Space Quorum n'a pas de nœud hôte. Les membres envoient leurs messages par le service Quorum, qui
en conserve une copie pour chaque membre jusqu'à ce que son client la récupère, et le propriétaire
n'a pas besoin d'être en ligne pour que les autres discutent. Une communauté Bitsocial vit sur le
nœud de son propriétaire, qui accepte ou rejette chaque publication et publie le dernier état de la
communauté. La communauté reste lisible tant que des pairs la partagent, mais ne peut pas accepter
de nouvelles publications tant que son nœud est hors ligne. Voir
[Protocole peer-to-peer](/peer-to-peer-protocol/).

### Qui fait respecter les règles

Dans Quorum, l'application des règles se fait en périphérie. Le client de chaque membre décide s'il
applique une suppression, un épinglage ou une mise en sourdine, en fonction du rôle du signataire,
et une expulsion fonctionne en faisant passer tous les autres à de nouvelles clés. En parallèle,
l'opérateur du service reçoit les signalements et examine l'annuaire public. Dans Bitsocial,
l'application des règles se fait au niveau du nœud de la communauté : une publication qui échoue au
défi de la communauté n'est jamais acceptée, et le nœud applique les suppressions décidées par ses
modérateurs. Voir
[Modération locale, pas interdictions mondiales](/local-moderation/).

### Lutte contre le spam

Quorum tient le spam à l'écart principalement par les invitations. Un lien à usage unique admet une
personne, un lien public admet quiconque le détient, et le propriétaire peut ensuite expulser et
renouveler les clés. Les clients limitent aussi la vitesse à laquelle un membre peut envoyer des
messages, et le client web et de bureau rejette les messages de Space de tout expéditeur au-delà de
10 en 10 secondes. Les identités Bitsocial
sont des paires de clés gratuites, si bien que chaque communauté choisit un défi à exécuter avant
d'accepter une publication, comme un captcha, un paiement, un solde de jetons ou une liste
d'autorisation. Voir [Défis anti-spam personnalisés](/custom-challenges/).

### Le client et le réseau

Une application Quorum est un client du service Quorum, qu'exploite Quilibrium Inc. Les
applications ne rejoignent pas elles-mêmes de réseau peer-to-peer ; l'accès à un Space dépend donc
de ce point de terminaison unique. Par ailleurs, Quilibrium est un réseau à part entière : en
octobre 2026, son [explorateur](https://dashboard.quilibrium.com/) affichait 114 pairs joignables et
181 prouveurs répartis sur 99 shards.

Une application web Bitsocial peut faire tourner un nœud libp2p dans l'onglet, récupérer le contenu
des communautés auprès des pairs et publier via gossipsub. La découverte des pairs passe par des
routeurs HTTP qui ne renvoient que des adresses de fournisseurs ; n'importe qui peut en faire tourner
un, et les clients peuvent changer de routeur en modifiant leur configuration. Voir
[Peer-to-peer dans le navigateur](/browser-p2p/).

### Économie

Un jeton est au cœur de Quilibrium. Le QUIL est miné par les nœuds et sert à payer les frais du
réseau, et une version enveloppée, le wQUIL, circule sur Ethereum. Quorum lui-même est gratuit et ne
demande ni paiement ni numéro de téléphone. Son abonnement facultatif Apex coûte
[5 $ par mois](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
payés en wQUIL, SNAP ou USDC sur Ethereum et répartis entre Quilibrium Inc. et quatre Spaces choisis
par l'abonné. Bitsocial n'a pas de couche de paiement dans le protocole ; une communauté peut exiger
un paiement ou un jeton au moyen de son défi.

### Messages privés

C'est là que Quorum est plus fort. Les messages directs et les messages des Spaces sont chiffrés de
bout en bout avec confidentialité persistante, et le contenu des messages n'atteint le service Quorum
que sous forme de texte chiffré, sauf lorsqu'un membre signale un message depuis l'application
mobile, qui en envoie le contenu aux modérateurs de Quorum. Bitsocial se concentre sur les
communautés publiques et ne propose pas encore de messages privés natifs. Une publication Bitsocial
est chiffrée pour la clé du nœud de la communauté pendant qu'elle transite par pubsub, mais une fois
acceptée, elle est publique.

## État du projet

En octobre 2026, le dépôt de Quorum qualifiait l'application web de bêta, et le site de Quorum
présentait toujours les applications Google Play et App Store comme « bientôt disponibles ». Les
deux clients divergent aussi : l'application mobile dispose des fonctions portefeuille, Farcaster et
Apex, tandis que le client web et de bureau affiche ses pages Wallet et Farcaster comme « bientôt
disponibles », et les deux rattrapent l'historique des Spaces de manière différente.

Le mainnet de Quilibrium est passé à la version 2.1 le 30 septembre 2025, lorsque le réseau a
redémarré après un arrêt ([annonce](https://x.com/QuilibriumInc/status/1973082817236984270)). En
2026, le nœud a été réécrit en Rust, avec des signatures post-quantiques pour le consensus et un
protocole réseau que les nœuds plus anciens ne savent pas parler. Certaines parties de la
documentation décrivent la conception plutôt que le code en service : elles décrivent le
[routage mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/). Les nœuds
relaient bien le trafic entre eux par des circuits à routage en oignon, mais dans le nœud 2.1.0.25,
le service mixnet est un
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
qui accepte les messages sans les mélanger.

## Comparaison

| Question                         | Quorum                                                                                                                      | Bitsocial                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Catégorie                        | Messagerie de groupe chiffrée de bout en bout de Quilibrium Inc.                                                            | Réseau de communautés peer-to-peer                                                                                    |
| Identité                         | Jeu de clés maître Ed448 plus des clés par appareil, protégées par une clé d'accès ou une phrase de récupération            | Paires de clés Ed25519 pour les utilisateurs et les communautés                                                       |
| Qui peut lire                    | Les membres qui détiennent les clés d'un Space                                                                              | N'importe qui, depuis n'importe quelle application                                                                    |
| Où vivent les messages           | L'appareil de chaque membre ; le service Quorum conserve les copies non distribuées, et un journal par Space pour le mobile | Le nœud du propriétaire de la communauté et les pairs qui la lisent et la partagent                                   |
| À quoi se connectent les clients | Le service Quorum à `api.quorummessenger.com`                                                                               | Des pairs via libp2p, trouvés par des routeurs HTTP, y compris depuis un onglet de navigateur                         |
| Communautés                      | Spaces avec canaux, rôles et liens d'invitation                                                                             | Objets de premier ordre dont le nœud accepte ou rejette les publications                                              |
| Lutte contre le spam             | Liens d'invitation, expulsions avec renouvellement des clés, limites de débit côté client                                   | Le défi de chaque communauté, avant qu'une publication soit acceptée                                                  |
| Modération                       | Rôles appliqués par le client de chaque membre ; le propriétaire expulse ; les signalements vont à l'opérateur du service   | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent                       |
| Messages privés                  | Messages directs chiffrés de bout en bout                                                                                   | Communautés publiques ; pas encore de messages privés natifs                                                          |
| Économie                         | Jeton réseau QUIL ; abonnement Apex facultatif à 5 $ par mois                                                               | Rien dans le protocole ; un défi peut exiger un paiement ou un jeton                                                  |
| Compromis principal              | Groupes privés et chiffrés, mais chaque client dépend d'un seul service                                                     | Identités gratuites et accès depuis le navigateur, mais pas de messagerie privée et seul le dernier état est conservé |
