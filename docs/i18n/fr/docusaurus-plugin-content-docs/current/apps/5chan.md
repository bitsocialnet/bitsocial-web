---
title: 5chan
description: Un tableau d'images décentralisé et sans serveur construit sur le protocole Bitsocial où n'importe qui peut créer et posséder des tableaux.
sidebar_position: 1
---

# 5chan

5chan est un tableau d'images sans serveur, sans administrateur et entièrement décentralisé qui fonctionne sur le protocole Bitsocial. Il suit la structure familière du répertoire Imageboard tout en introduisant une propriété décentralisée : n'importe qui peut créer un tableau, et plusieurs tableaux peuvent concourir pour le même emplacement de répertoire via un mécanisme de vote.

## Téléchargements

| Plateforme | Lien                                  |
| ---------- | ------------------------------------- |
| Internet   | [5chan.app](https://5chan.app)        |
| Bureau     | Disponible pour Mac, Windows et Linux |
| Mobile     | Disponible pour Android               |

## Comment fonctionnent les tableaux

5chan organise le contenu en tableaux en utilisant une disposition de répertoire classique (par exemple, `/b/`, `/g/`). Contrairement aux tableaux d'images traditionnels où un administrateur central contrôle chaque tableau, 5chan permet à tout utilisateur de créer et de posséder entièrement son propre tableau. Lorsque plusieurs conseils d'administration ciblent le même emplacement dans l'annuaire, ils se disputent ce poste par le biais d'un vote.

### Création d'un tableau

Pour créer un nouveau tableau, vous devez exécuter `bitsocial-cli` en tant que nœud peer-to-peer. Cela garantit que votre tableau est hébergé de manière décentralisée sans dépendre d'un serveur central.

### Affectations d'annuaire

Les attributions d'emplacements de répertoire (quelle carte apparaît sur quel chemin) sont actuellement gérées via des requêtes pull GitHub vers le fichier `5chan-directories.json`. Il s'agit d'un processus temporaire : les versions futures prendront en charge la création de forums dans l'application et le vote basé sur les pubsub pour gérer automatiquement les attributions de répertoires.

## Internes

Sous le capot, 5chan utilise la couche client du protocole Bitsocial partagé pour ses interactions réseau. L'application Web sur 5chan.app peut également exécuter un nœud Helia dans le navigateur lorsque le P2P du navigateur est activé à partir des paramètres avancés, afin que les lecteurs puissent charger à partir de pairs sans passerelle IPFS centralisée. Consultez la section P2P du navigateur dans les notes sur le protocole peer-to-peer.

## Liens

- **GitHub** : [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Télégramme** : [t.me/fivechandev](https://t.me/fivechandev)
- **Licence** : GPL-2.0 uniquement
