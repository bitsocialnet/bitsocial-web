---
title: Créez votre propre client Bitsocial
description: Guide destiné aux développeurs qui veulent publier des clients Bitsocial indépendants, des imageboards aux forums en passant par les applications sociales de niche.
---

# Créez votre propre client Bitsocial

Bitsocial ne l'emporte pas en proposant une application officielle unique pour chaque usage. Il
l'emporte lorsque de nombreux clients peuvent partager le même protocole tout en se faisant
concurrence sur l'interface, la culture, la découverte, les réglages par défaut et le modèle
économique.

5chan et Seedit sont de premières démonstrations, pas un plafond. Un développeur doit pouvoir
publier un nouvel imageboard, un forum, un client à base de profils, une application sociale pensée
d'abord pour le mobile, un outil communautaire de niche ou un client centralisé qui s'appuie sur
Bitsocial, sans demander l'autorisation au propriétaire d'une plateforme.

## Ce que les développeurs peuvent changer

Un client Bitsocial peut se différencier sur les choix produit sans forker tout le réseau :

- l'interface et le langage visuel
- le parcours de première utilisation
- les réglages par défaut des communautés
- les surfaces de modération
- le modèle de découverte
- l'expérience des médias
- les contraintes mobiles, bureau ou faible bande passante
- la monétisation et le modèle économique

La couche commune, c'est le protocole. La couche produit, elle, est ouverte à la concurrence.

## Le moyen le plus rapide d'apprendre

Commencez par les applications qui existent déjà :

- Essayez [5chan](https://5chan.app) pour les communautés d'imageboard anonymes.
- Essayez [Seedit](https://seedit.app) pour les discussions de style Reddit.
- Lisez la documentation des [hooks React Bitsocial](https://hooks.bitsocial.net/docs/quickstart/) pour l'intégration côté client.
- Lisez la documentation de la [CLI Bitsocial](/developer-tools/cli/) pour les opérations sur les nœuds et les communautés.

Si vous voulez avancer vite, contribuez d'abord à une application existante. Si l'interface, la
culture ou le modèle de communauté que vous visez n'y trouve pas sa place, construisez un client
séparé.

## Visez une première version étroite

La meilleure première version n'est pas une application sociale universelle. C'est un client avec un
public clair et une raison d'exister solide.

Parmi les bons points de départ :

- un client d'imageboard plus soigné, dédié à une culture précise
- un client de forum pensé d'abord pour le mobile
- une application dédiée à une seule communauté, avec des réglages par défaut stricts
- un client pour communautés de créateurs
- un client de découverte en lecture seule
- une console de modération ou d'exploitation
- un client optimisé pour une langue, une région ou une classe d'appareils

Les petits clients sont utiles parce que Bitsocial leur permet de grandir au sein du même réseau au
lieu d'enfermer leurs utilisateurs dans une base de données privée.

## Chemins de mise en œuvre

Il existe trois chemins praticables :

1. Forker un client existant lorsque votre idée est proche de 5chan ou de Seedit.
2. Construire un nouveau client React avec les [hooks React Bitsocial](https://hooks.bitsocial.net/).
3. Construire votre propre intégration au-dessus des API de nœud et de l'infrastructure RPC publique.

Le RPC public devrait rendre le troisième chemin bien plus praticable. Un utilisateur peut démarrer
chez un fournisseur RPC hébergé et non dépositaire, puis passer plus tard à l'auto-hébergement ou à
un fournisseur concurrent.

## Principe de conception

Construisez le client qui devrait exister pour votre communauté, puis laissez les clients
compatibles se faire concurrence en public.
