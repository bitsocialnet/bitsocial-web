---
title: Découverte de contenu
description: Comment Bitsocial sépare la découverte par les pairs de la curation au niveau de l'application.
---

# Découverte de contenu

Bitsocial ne met pas de flux global, d'index de recherche ou d'algorithme de classement dans le protocole. Il sépare la découverte de contenu en deux couches :

1. **Recherche de réseau** trouve les pairs desservant actuellement une communauté connue.
2. **Curation d'application** décide quelles communautés, tableaux, listes ou publications un produit s'affiche en premier.

Cela permet de garder le protocole petit tout en laissant la place à de nombreuses expériences de découverte en compétition.

## Recherche de réseau

Chaque communauté possède une adresse stable dérivée de sa clé publique. Lorsqu'un client connaît déjà cette adresse, il interroge les routeurs HTTP légers pour trouver des homologues qui se sont annoncés comme fournisseurs de cette adresse.

Les routeurs renvoient uniquement les adresses homologues du fournisseur. Ils ne stockent pas les publications, les métadonnées, les listes d’utilisateurs ou un répertoire de communautés lisible par l’homme. Une fois que le client a reçu les adresses des homologues, il se connecte à ces homologues et récupère les dernières métadonnées de la communauté ainsi que les pointeurs de contenu, puis récupère les données de publication réelles par hachage.

Cela répond à la question protocolaire : « Où puis-je récupérer le dernier état de cette communauté ? »

## Curation d'applications

La question distincte du produit est la suivante : « Quelles communautés un utilisateur doit-il voir en premier ? »

Bitsocial laisse cela aux applications, aux listes et aux utilisateurs au lieu d'intégrer une seule réponse dans le réseau. Les exemples incluent :

- un client montrant les communautés que l'utilisateur suit déjà
- une liste par défaut organisée pour une application de style Reddit
- emplacements de répertoire pour une application de style tableau d'images
- index de recherche ou de classement gérés par une application spécifique
- liens directs partagés par les utilisateurs

Les applications peuvent indexer, classer, filtrer ou mettre en évidence différentes choses sans transformer ces choix en loi protocolaire. Si la surface de découverte d’une application n’est pas utile, une autre application peut en créer une différente sur les mêmes communautés sous-jacentes.

## Applications actuelles

5chan utilise actuellement des chemins de répertoire familiers tels que `/b/` ou `/g/`. Les attributions d'annuaire sont aujourd'hui gérées via une liste publique, les futures versions devant prendre en charge la création de forums dans l'application et le vote pour les emplacements d'annuaire.

Seedit utilise des listes de communautés par défaut pour sa page d'accueil. Les communautés peuvent toujours être créées et partagées en dehors de cette liste par défaut.

Dans les deux cas, la liste au niveau de l'application aide les utilisateurs à trouver quelque chose à ouvrir, et la recherche au niveau du protocole résout ensuite la communauté choisie en pairs.

## Pourquoi cette scission est importante

Un seul réseau décentralisé nécessite toujours une bonne découverte, mais la couche de découverte doit être remplaçable. Le protocole principal de Bitsocial se concentre sur l'adressabilité, la recherche par les pairs, la publication et l'anti-spam. La curation se situe au-dessus de cette couche, où les applications peuvent expérimenter des répertoires, des listes par défaut, des flux, des politiques de recherche, de vote et de modération sans nécessiter une migration à l'échelle du réseau.
