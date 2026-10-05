---
title: Bitsocial et Reticulum
description: Comment Reticulum, la pile réseau cryptographique pour LoRa et d'autres liaisons à faible débit, se compare à Bitsocial, et si Bitsocial pourrait fonctionner par-dessus.
---

# Bitsocial et Reticulum

[Reticulum](https://reticulum.network/) est une pile réseau fondée sur la cryptographie, qui permet
de bâtir des réseaux sur tous les supports disponibles : radios LoRa, radio par paquets, liaisons
série, Wi-Fi, Ethernet, TCP, UDP ou I2P. Son nom revient souvent aux côtés de Bitsocial, car l'un
comme l'autre se passent de l'entreprise intermédiaire. Ils le font à des couches différentes : ils
sont donc complémentaires plutôt que concurrents.

## Des couches différentes

Reticulum remplace la couche réseau. Il fournit aux applications des points de terminaison chiffrés
et routables sans recourir à des adresses IP, au DNS, à des autorités de certification ni à des
comptes, et il est conçu pour continuer à fonctionner sur des liaisons dont le débit descend jusqu'à
5 bits par seconde, avec une MTU de 500 octets. Il ne définit ni publications, ni communautés, ni
modération : ce sont les applications construites par-dessus qui les ajoutent.

Bitsocial est un protocole social. Il fonctionne sur la pile IPFS/libp2p, par des connexions
internet ordinaires, y compris depuis un onglet de navigateur, et définit les communautés, les
publications et des défis anti-spam propres à chaque communauté. Voir
[Protocole peer-to-peer](/peer-to-peer-protocol/) et
[Peer-to-peer dans le navigateur](/browser-p2p/).

Dans la pile de Bitsocial, Reticulum se placerait à peu près là où se trouve libp2p, et non là où
se trouve le protocole Bitsocial.

## Fonctionnement de Reticulum

- **Identités.** Une identité Reticulum est un jeu de clés de 512 bits : une clé X25519 pour le
  chiffrement et une clé Ed25519 pour les signatures.
- **Destinations.** Les applications créent des destinations, adressées par un hachage SHA-256
  tronqué à 16 octets. Les paquets ne portent aucune adresse source.
- **Annonces.** Une destination devient joignable lorsqu'elle émet une annonce. Les nœuds de
  transport la relaient et mémorisent le prochain saut du chemin retour, si bien qu'aucun nœud n'a
  besoin d'une carte du réseau entier.
- **Chiffrement.** Le trafic est chiffré par défaut, avec des clés éphémères et une confidentialité
  persistante.
- **LXMF.** La couche de messagerie [LXMF](https://github.com/markqvist/LXMF) ajoute les messages
  signés, la remise directe et, pour les destinataires hors ligne, le stockage et la retransmission
  via des nœuds de propagation.

Parmi les applications construites ainsi figurent [Sideband](https://github.com/markqvist/Sideband)
pour la messagerie et [Nomad Network](https://github.com/markqvist/NomadNet) pour la messagerie et
l'hébergement de pages. Le manuel de Reticulum tient à jour une
[liste de programmes](https://reticulum.network/manual/software.html).

## Comparaison

| Question             | Reticulum                                                                                                                 | Bitsocial                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Nature               | Pile réseau                                                                                                               | Protocole social peer-to-peer et applications                                                              |
| Conçu pour           | Tout support, jusqu'aux liaisons radio lentes                                                                             | Connexions internet, y compris les onglets de navigateur                                                   |
| Identité             | Jeu de clés X25519 et Ed25519                                                                                             | Paires de clés Ed25519 pour les utilisateurs et les communautés                                            |
| Adresses             | Hachage d'une identité et d'un nom d'application                                                                          | Hachage de la clé publique d'une communauté                                                                |
| Trouver un pair      | Annonces propagées par les nœuds de transport                                                                             | Les routeurs HTTP renvoient des pairs fournisseurs                                                         |
| Fonctions sociales   | Ajoutées par des applications comme Nomad Network                                                                         | Communautés, publications, réponses et modération dans le protocole                                        |
| Lutte contre le spam | Limites de débit des annonces par interface ; tampons de preuve de travail LXMF qu'un destinataire ou un nœud peut exiger | Le défi de chaque communauté, avant qu'une publication soit acceptée                                       |
| Remise hors ligne    | Les nœuds de propagation LXMF stockent et retransmettent les messages                                                     | Les pairs continuent de servir le dernier état d'une communauté ; publier exige que son nœud soit en ligne |

## Bitsocial pourrait-il fonctionner sur Reticulum ?

Pas aujourd'hui. Bitsocial n'a pas de transport Reticulum, et son modèle de données suppose la bande
passante d'internet : un client récupère les métadonnées des communautés et le contenu des
publications auprès des pairs et échange des messages pubsub, ce qui s'accommode mal de liaisons
conçues autour de paquets de 500 octets et de débits mesurés en bits ou en kilobits par seconde.

La voie réaliste est plus étroite : un client qui fonctionne sur un réseau maillé local lorsqu'il
est déconnecté, puis se synchronise avec le reste du réseau Bitsocial dès qu'un pair ou une
passerelle disposant d'un accès à internet est joignable. Il s'agirait d'un nouveau client doublé
d'un pont, plutôt que d'une modification du protocole, et ce n'est pas prévu dans la feuille de
route actuelle.

## Pour les développeurs

Reticulum est publié sous la
[licence Reticulum](https://reticulum.network/manual/license.html) : des conditions de type MIT,
assorties de deux restrictions. Le logiciel ne peut pas être utilisé dans des systèmes conçus pour
nuire à des personnes, ni pour créer des jeux de données d'entraînement destinés à l'IA ou à
l'apprentissage automatique. Lisez-la avant d'intégrer du code Reticulum dans une application
Bitsocial.

L'implémentation de référence est [écrite en Python](https://github.com/markqvist/Reticulum). Les
mainteneurs de Reticulum avertissent que plusieurs portages non officiels de Reticulum et de LXMF
sont générés par machine et affichent des mentions de licence qu'ils jugent nulles et non avenues :
privilégiez donc l'implémentation de référence ou les programmes répertoriés dans le manuel.
