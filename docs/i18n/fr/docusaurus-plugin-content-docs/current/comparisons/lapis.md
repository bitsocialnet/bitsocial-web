---
title: Bitsocial et Lapis Net
description: Comment Lapis Net, un protocole social peer-to-peer en Kotlin doté de scores de confiance propres à chaque lecteur et d'une visibilité adossée à Bitcoin, se compare à Bitsocial.
---

# Bitsocial et Lapis Net

[Lapis Net](https://net.lapisproject.dev/) est un protocole de réseau social peer-to-peer écrit en
Kotlin pour la JVM. Il est parvenu de manière indépendante à des fondations proches de celles de
Bitsocial : des identités fondées sur des paires de clés, un stockage de contenu de type IPFS et le
gossipsub de libp2p. Les deux projets diffèrent quant à l'endroit où ils placent le filtrage du spam
et la curation. Lapis donne à chaque lecteur un graphe de confiance personnel et laisse les
paiements Bitcoin et Lightning accroître la visibilité ; Bitsocial laisse chaque communauté décider
de ce qui peut être publié.

Lapis est un prototype fonctionnel. En octobre 2026, il n'avait pas encore de réseau public, et la
connexion de deux nœuds était une opération manuelle, d'après son
[dépôt](https://github.com/lapisproject-dev/Lapis-Net).

## Fonctionnement de Lapis

- **Identités.** Chaque identité est une paire de clés secp256k1, compatible avec les clés Bitcoin,
  à laquelle est liée une clé Ed25519 pour l'identifiant de pair libp2p.
- **Stockage et propagation.** Le contenu est stocké avec Nabu, une implémentation d'IPFS sur libp2p
  (DHT et Bitswap), et diffusé avec le gossipsub de libp2p.
- **Scores.** Quatre scores facultatifs se superposent à un cœur qui reste neutre en matière de
  curation :
  - Veritas, une toile de confiance calculée à partir du graphe de confiance propre à chaque lecteur
  - Virtus, une visibilité adossée à des preuves de paiement onchain ou Lightning qui s'atténuent
    avec le temps
  - Karma, des « J'aime » gratuits pondérés par Veritas
  - Madli, un score de réputation que les nœuds tiennent sur le comportement les uns des autres
- **Messagerie.** Des messages privés chiffrés de bout en bout, des appels vocaux en tête-à-tête et
  un système de messagerie asynchrone semblable à l'e-mail font partie du projet.
- **Clients.** Chaque utilisateur exécute un nœud JVM. Le client de référence est une interface web
  servie par ce nœud local.

## Ce qui les distingue

### Qui filtre le spam

Lapis filtre au niveau du lecteur. Le contenu se propage, puis le graphe de confiance de chaque
lecteur et les règles de paiement de l'application qu'il utilise décident de ce qui remonte.
Bitsocial filtre au niveau de la communauté : une publication doit réussir le défi de la communauté
avant que le nœud de celle-ci ne l'accepte, si bien que le spam rejeté n'entre jamais dans la
communauté. Voir [Défis anti-spam personnalisés](/custom-challenges/).

### Qui détient le pouvoir

Dans Lapis, chaque lecteur décide à qui il fait confiance, et l'opérateur de chaque application
décide du fonctionnement de la visibilité payante sur celle-ci. Dans Bitsocial, le propriétaire
d'une communauté fixe les règles de cette seule communauté, et les applications choisissent ce
qu'elles affichent. Aucun des deux n'a d'administrateur au niveau du protocole.

### Économie

Lapis intègre des preuves de paiement Bitcoin et Lightning dans son score de visibilité. Bitsocial
n'a pas de couche de paiement dans le protocole ; une communauté peut exiger un paiement ou un jeton
par le biais de son défi.

### Navigateur

Les applications Bitsocial peuvent exécuter un nœud peer-to-peer dans un onglet de navigateur
ordinaire. Voir [Peer-to-peer dans le navigateur](/browser-p2p/). L'interface navigateur de Lapis
est une page locale servie par le nœud JVM de l'utilisateur.

### Périmètre

Lapis regroupe messages privés, appels vocaux et messagerie. Bitsocial se concentre sur les
communautés publiques et ne propose pas encore de messages privés natifs.

## Comparaison

| Question                   | Lapis Net                                                                                                        | Bitsocial                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Catégorie                  | Protocole social peer-to-peer (prototype)                                                                        | Réseau de communautés peer-to-peer                                                                    |
| Identité                   | Paire de clés secp256k1 liée à un identifiant de pair Ed25519                                                    | Paires de clés Ed25519 pour les utilisateurs et les communautés                                       |
| Où vivent les publications | Stockage Nabu (IPFS sur libp2p) sur les nœuds participants                                                       | Le nœud du propriétaire de la communauté et les pairs qui la lisent et la partagent                   |
| Communautés                | Aucun objet de communauté ; la curation se fait par lecteur et par application                                   | Objets de premier ordre dont le nœud accepte ou rejette les publications                              |
| Lutte contre le spam       | Graphe de confiance du lecteur, visibilité payante, dépôts Lightning pour les premiers messages                  | Le défi de chaque communauté, avant qu'une publication soit acceptée                                  |
| Modération                 | Le graphe de confiance de chaque lecteur ; les opérateurs d'applications fixent les règles de visibilité payante | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent       |
| Économie                   | Preuves de paiement Bitcoin et Lightning dans le calcul des scores                                               | Aucune dans le protocole ; un défi peut exiger un paiement ou un jeton                                |
| Navigateur                 | Interface web locale servie par un nœud JVM                                                                      | Nœud peer-to-peer dans un onglet de navigateur ordinaire                                              |
| Réseau                     | Prototype sans réseau public                                                                                     | Réseau en service, avec des applications comme [5chan](/apps/5chan/) et [Seedit](/apps/seedit/)       |
| Compromis principal        | Réputation et messagerie intégrées riches, mais pas encore de réseau public                                      | Un cœur plus réduit qui tourne dans les navigateurs, mais sans réputation ni messages privés intégrés |

## Pourraient-ils fonctionner ensemble ?

Les défis Bitsocial sont du code arbitraire : un score de confiance à la manière de Lapis pourrait
donc en devenir un. Le défi intégré `whitelist` sait déjà lire des listes d'adresses autorisées
depuis des URL. Un service qui publierait les adresses Bitsocial auxquelles un graphe Veritas fait
confiance pourrait permettre à ces auteurs d'éviter un CAPTCHA dans une communauté. Il faudrait pour
cela un moyen de relier une identité Lapis à une adresse Bitsocial, et rien de tel n'existe
aujourd'hui.
