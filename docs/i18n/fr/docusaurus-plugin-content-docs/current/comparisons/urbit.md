---
title: Bitsocial et Urbit
description: Comment Urbit, un réseau de serveurs personnels doté d'Urbit ID adossés à Ethereum et de groupes hébergés par leur hôte dans Tlon Messenger, se compare aux communautés peer-to-peer de Bitsocial.
---

# Bitsocial et Urbit

[Urbit](https://urbit.org/) est un réseau de serveurs personnels. Chaque utilisateur dispose d'un
ordinateur toujours allumé, appelé vaisseau, qui exécute le système d'exploitation propre à Urbit
(Arvo), écrit dans ses propres langages (Nock et Hoon), et qui est identifié par un Urbit ID. Sa
principale application sociale est [Tlon Messenger](https://tlon.io/), conçue par Tlon, l'entreprise
fondée en 2013 pour développer Urbit.

Urbit vise à remplacer toute la pile informatique : c'est donc un projet bien plus vaste que
Bitsocial. Sa couche sociale repose pourtant sur un modèle proche de celui de Bitsocial : une
communauté vit sur le nœud de son propriétaire, et ce nœud décide de ce qui y entre. Les deux
divergent sur la question de savoir qui doit faire tourner un serveur et sur la manière de tenir le
spam à l'écart.

## Fonctionnement d'Urbit

- **Urbit ID.** Chaque vaisseau possède un Urbit ID : un nombre affiché sous la forme d'un nom
  prononçable comme `~sampel-palnet`. Les ID de couche 1 sont des NFT dont la propriété et les clés
  publiques réseau sont inscrites dans les contrats Azimuth sur Ethereum. Les ID de couche 2,
  ajoutés en 2021 pour réduire les frais, utilisent un « rollup naïf » : leurs transactions sont
  publiées sur Ethereum par lots, mais leur propriété n'est pas stockée dans le contrat Azimuth, et
  chaque vaisseau la calcule localement. Tlon exploite un roller dont l'usage public est gratuit,
  d'après la [documentation des Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) et
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Une hiérarchie fixe.** L'espace d'adressage compte 256 galaxies, 65 536 étoiles et environ
  4 milliards de planètes destinées à l'usage courant. Les galaxies émettent des étoiles, les
  étoiles émettent des planètes, et chaque planète peut émettre des lunes pour ses propres
  appareils. Les comètes sont des ID gratuits qu'un vaisseau génère lui-même et qui ne passent
  jamais par la blockchain. Les propriétaires de galaxies forment le Galactic Senate, qui vote les
  mises à niveau des contrats Azimuth et élit le conseil d'administration de l'Urbit Foundation.
- **Réseau.** Les vaisseaux échangent des paquets chiffrés de pair à pair. Depuis juillet 2026, le
  protocole réseau est [Directed Messaging](https://urbit.org/blog/directed-messaging), une
  réécriture centrée sur le contenu de l'ancien protocole Ames. Les galaxies assurent la découverte
  des pairs : chacune garde la trace de l'emplacement des vaisseaux placés sous elle et leur relaie
  les paquets jusqu'à ce que les deux vaisseaux puissent se joindre directement, ou aussi longtemps
  qu'un pare-feu l'empêche, d'après
  l'[article consacré à Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Groupes.** Dans Tlon Messenger, un groupe est hébergé par le vaisseau de son créateur. Les
  membres envoient leurs messages à l'hôte, qui les distribue au vaisseau de chaque membre, et le
  vaisseau de chaque membre conserve sa propre copie, d'après la
  [FAQ de Tlon](https://tlon.io/posts/faq). L'hôte contrôle les rôles, les canaux et les
  admissions. Un groupe peut être public, privé ou secret, et il peut
  [bannir des vaisseaux individuels ou des rangs entiers d'ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Les canaux sont des discussions, des carnets ou des collections d'images et de liens.
- **Hébergement.** En s'inscrivant chez Tlon, un nouvel utilisateur reçoit un vaisseau exploité
  par Tlon, dont les clés restent sous la garde de Tlon. Un utilisateur peut exporter le vaisseau et
  son master ticket et le faire tourner ailleurs : sur un appareil
  [Native Planet](https://www.nativeplanet.io/), ou avec le runtime Vere sous Linux, macOS ou
  Windows. Les vaisseaux ne peuvent pas encore stocker directement de gros fichiers ; Tlon Messenger
  place donc les images et autres médias dans un stockage cloud compatible S3.

## Ce qui les distingue

### Qui doit faire tourner un serveur

Sur Urbit, chaque participant est un serveur. Les applications de Tlon sont des interfaces vers le
propre vaisseau de l'utilisateur, et même la lecture d'un groupe passe par lui. Ceux qui ne font pas
tourner de vaisseau eux-mêmes en louent un, ce qui réintroduit un hébergeur dans l'équation : Tlon
détient les clés des utilisateurs hébergés et conserve un accès limité pour la maintenance, même si
les utilisateurs peuvent partir avec leur vaisseau entier.

Sur Bitsocial, seuls les propriétaires de communautés ont besoin d'un nœud toujours en ligne. Les
lecteurs et les auteurs de publications peuvent faire tourner un nœud peer-to-peer dans un onglet
de navigateur, et leur compte est une paire de clés que l'application conserve. Voir
[Peer-to-peer dans le navigateur](/browser-p2p/). Lorsque quelqu'un utilise malgré tout un nœud
hébergé, la conception de Bitsocial vise à lui permettre de déléguer la disponibilité sans céder la
garde de son identité. Voir [Identité et propriété communautaire](/identity-and-ownership/).

### L'hôte de la communauté

C'est là que les deux se ressemblent le plus. Un groupe Tlon et une communauté Bitsocial vivent
tous deux sur le nœud de leur propriétaire. L'hôte décide qui peut publier, applique la modération
et distribue le résultat, et aucun des deux protocoles ne place de modérateur au-dessus de l'hôte.
Dans les deux cas, l'hôte doit être en ligne. La FAQ de Tlon indique que si l'hôte se déconnecte,
« le groupe tombe avec lui », et une communauté Bitsocial ne peut pas accepter de nouvelles
publications tant que son nœud est hors ligne.

Ils stockent le contenu différemment. Le vaisseau de chaque membre conserve une copie de
l'historique du groupe ; les membres peuvent donc encore lire ce qu'ils ont déjà reçu pendant que
l'hôte est hors service. Un lecteur Bitsocial récupère le dernier état de la communauté auprès du
nœud de la communauté ou des pairs qui la partagent ; une communauté hors ligne reste donc lisible
tant que des pairs la détiennent, mais le réseau ne conserve que le dernier état.

Un groupe Tlon a aussi une liste de membres, et son hôte peut le rendre accessible sur invitation
uniquement. Une communauté Bitsocial n'a pas de notion de membre : n'importe qui peut la lire, et
n'importe qui peut tenter d'y publier, sous réserve de réussir son défi.

### Spam et identité

Urbit combat le spam en rendant l'identité rare. Le nombre de planètes est fixe et chacune est
émise par une étoile. Les comètes gratuites contournent cette rareté ; les groupes qui veulent
qu'elle tienne les refusent donc : la documentation d'Urbit note que certains groupes refusent les
comètes, et un groupe Tlon peut bannir tout le rang des comètes d'un seul réglage. Une fois les
comètes exclues, un utilisateur banni a besoin d'une autre planète, obtenue auprès du propriétaire
d'une étoile, pour revenir. La réputation peut aussi suivre la hiérarchie : Azimuth comprend un
contrat Censures qui permet aux galaxies et aux étoiles de signaler des ID. Comme la rareté est
inscrite dans l'espace d'adressage, elle fonctionne de la même manière dans chaque groupe qui
refuse les comètes.

Les identités Bitsocial sont des paires de clés gratuites. Chaque communauté choisit son propre défi
avant d'accepter une publication, comme un captcha, un paiement, un solde de jetons ou une liste
d'autorisation, et d'autres communautés peuvent faire un choix différent. Voir
[Défis anti-spam personnalisés](/custom-challenges/).

### Blockchain et gouvernance

La couche d'identité d'Urbit dépend d'Ethereum. Les contrats Azimuth enregistrent la propriété des
ID de couche 1 et leurs clés réseau, les transactions de couche 2 sont publiées sur Ethereum par
lots, et le Galactic Senate peut mettre à niveau le contrat qui régit Azimuth. Ces mêmes
256 galaxies assurent aussi la découverte des pairs et le relais ; un ensemble fixe d'identités
porte donc à la fois la gouvernance et une partie du routage du réseau.

Les identités Bitsocial sont des paires de clés qui ne nécessitent aucun enregistrement. Les noms
`.bso` et `.eth` sont des alias facultatifs qui se résolvent vers elles. La découverte des pairs
passe par des routeurs HTTP qui ne renvoient que des adresses de fournisseurs ; n'importe qui peut
en faire tourner un, et les clients peuvent changer de routeur en modifiant leur configuration.

### Périmètre

Urbit est un ordinateur généraliste. Un vaisseau peut héberger un dépôt distant Git, une base de
connaissances personnelle ou des agents d'IA, et Tlon Messenger n'est qu'un programme parmi
d'autres. Développer pour Urbit consiste surtout à écrire des applications Hoon pour Arvo.
Bitsocial est un protocole pour les communautés publiques, avec des applications comme
[5chan](/apps/5chan/) et [Seedit](/apps/seedit/). Il fonctionne sur la pile existante (libp2p,
IPFS et le navigateur) au lieu de la remplacer, et ses clients sont construits avec l'outillage web
habituel. Voir [Créez votre propre client](/build-your-own-client/).

### Messages privés

C'est là qu'Urbit est plus fort. Les messages directs vont d'un vaisseau directement à un autre,
tout le trafic entre vaisseaux est chiffré, et les groupes peuvent être privés ou secrets. Tlon
précise que les messages sont chiffrés en transit, mais stockés en clair sur le vaisseau. Bitsocial
se concentre sur les communautés publiques et ne propose pas encore de messages privés natifs.

## État du projet

Urbit a traversé une période de turbulences. En août 2024, l'Urbit Foundation, l'organisation à
but non lucratif qui oriente le développement du cœur, a renvoyé son directeur exécutif ; le
fondateur Curtis Yarvin est revenu diriger la stratégie sans titre officiel, plusieurs développeurs
du cœur sont partis, et la trésorerie de la fondation ne se comptait plus qu'en mois,
[selon CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin a proposé de migrer Azimuth vers une couche 2 Ethereum existante, Base étant le choix
probable, et d'émettre des jetons fongibles « visa » convertibles en planètes. En octobre 2026, la
[documentation des ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) d'Urbit décrit toujours
Azimuth sur Ethereum avec son rollup naïf. En octobre 2025, le Galactic Senate a remplacé le
conseil d'administration de la fondation, et le nouveau conseil a nommé un nouveau directeur
exécutif ([annonce](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Le développement se poursuit. Directed Messaging a été mis en service avec la version 408k le
14 juillet 2026. En juin 2026, Tlon Messenger
[a ouvert les inscriptions publiques sans liste d'attente](https://urbit.org/blog/this-month-in-urbit-june-2026),
et Tlon se présente désormais comme un lieu où humains et agents d'IA travaillent ensemble.

## Comparaison

| Question                    | Urbit                                                                                                                     | Bitsocial                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Catégorie                   | Réseau de serveurs personnels et système d'exploitation                                                                   | Réseau de communautés peer-to-peer                                                                                    |
| Identité                    | Urbit ID : environ 4 milliards de planètes sur Ethereum ou sur son rollup de couche 2, plus des comètes gratuites         | Paires de clés Ed25519 pour les utilisateurs et les communautés                                                       |
| Qui fait tourner un serveur | Chaque utilisateur, sur son propre vaisseau ou sur un vaisseau hébergé                                                    | Les propriétaires de communautés ; lecteurs et auteurs peuvent utiliser un onglet de navigateur                       |
| Où vivent les publications  | Le vaisseau de l'hôte du groupe, et une copie sur le vaisseau de chaque membre                                            | Le nœud du propriétaire de la communauté et les pairs qui la lisent et la partagent                                   |
| Communautés                 | Groupes hébergés par le vaisseau de leur créateur, avec des listes de membres                                             | Objets de premier ordre dont le nœud accepte ou rejette les publications                                              |
| Lutte contre le spam        | ID rares émis par des étoiles ; les groupes bannissent des vaisseaux ou des rangs entiers                                 | Le défi de chaque communauté, avant qu'une publication soit acceptée                                                  |
| Modération                  | Les rôles et bannissements gérés par l'hôte du groupe                                                                     | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent                       |
| Découverte des pairs        | Les galaxies suivent les vaisseaux placés sous elles et relaient pour eux                                                 | Les routeurs HTTP renvoient des pairs fournisseurs et ne stockent aucun contenu                                       |
| Gouvernance                 | Le Galactic Senate des 256 galaxies vote les mises à niveau d'Azimuth                                                     | Aucune autorité au niveau du protocole sur les identités ou les communautés                                           |
| Messages privés             | Messages directs chiffrés et groupes sur invitation                                                                       | Communautés publiques ; pas encore de messages privés natifs                                                          |
| Compromis principal         | Un ordinateur personnel complet avec des groupes privés, mais chaque utilisateur a besoin d'un vaisseau toujours en ligne | Identités gratuites et accès depuis le navigateur, mais pas de messagerie privée et seul le dernier état est conservé |
