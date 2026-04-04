---
title: 5chan
description: Un tableau d'images décentralisé et sans serveur construit sur le protocole Bitsocial où n'importe qui peut créer et posséder des tableaux.
sidebar_position: 1
---

:::warning[Dénomination héritée]
La base de code de ce projet utilise toujours l'ancienne dénomination « plebbit » d'avant le changement de nom de Bitsocial. Les noms des packages, les références API et certaines terminologies internes seront mis à jour dans une prochaine version. La fonctionnalité décrite ici est actuelle — seule la dénomination est obsolète.
:::

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

Sous le capot, 5chan utilise la couche API plebbit-js pour ses interactions protocolaires. Comme indiqué dans l'avertissement ci-dessus, ces références internes portent toujours une dénomination héritée antérieure au changement de marque Bitsocial.

## Liens

- **GitHub** : [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Télégramme** : [t.me/fivechandev](https://t.me/fivechandev)
- **Licence** : GPL-2.0 uniquement
