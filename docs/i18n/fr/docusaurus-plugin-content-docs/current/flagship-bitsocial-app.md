---
title: Décentraliser Twitter/X
description: "Phase 3 du plan directeur : une alternative ciblée et décentralisée à Twitter/X pour la conversation publique centrée sur le texte, avec une infrastructure remplaçable."
---

# Décentraliser Twitter/X

La phase 3 prévoit de construire une alternative ciblée et décentralisée à Twitter/X. Elle est centrée sur la conversation publique textuelle : publications courtes, réponses, republications, abonnements, échanges en temps réel et communautés, avec une couche de plateforme ouverte.

Twitter/X reste défini par les publications, le texte et le partage d'idées. Le client de la phase 3 devrait rivaliser sur cette expérience essentielle et la rendre exceptionnellement efficace.

Cette page décrit l'orientation du produit, pas une spécification de lancement figée. L'interface exacte, le flux par défaut, le modèle publicitaire, les fonctionnalités AI et le marché des RPC peuvent évoluer à mesure que le protocole et les premières applications mûrissent.

## Ce qu'il devrait démontrer

Le client devrait démontrer qu'un réseau social fondé sur des profils peut éviter de devenir une plateforme dépositaire :

- les utilisateurs peuvent posséder leurs identités et leurs profils
- les communautés et les nœuds de profil peuvent rester peer-to-peer
- les communautés peuvent transmettre les effets de réseau entre les clients Bitsocial
- les fournisseurs RPC peuvent rendre le client pratique sans en prendre la garde
- les algorithmes de flux peuvent être des services facultatifs plutôt qu'une règle imposée par la plateforme
- d'autres clients peuvent continuer à rivaliser sur le même réseau

L'objectif est de construire le client le plus solide possible pour la conversation publique et de montrer jusqu'où le protocole peut aller.

## Familier dans sa vocation, remplaçable par conception

L'expérience par défaut devrait rivaliser avec le cœur de Twitter/X : un flux d'accueil rapide, des publications textuelles, des abonnements, des réponses, une diffusion par republication, des communautés, des notifications, une recherche et une vue classée For You qui fonctionne immédiatement.

Bitsocial Forge peut exploiter le premier service RPC et de flux par défaut. Cette configuration peut inclure un flux classé et des publicités afin que le client paraisse complet dès le premier jour, plutôt que de demander au grand public d'assembler lui-même toute la pile.

La différence est que la configuration par défaut ne doit pas devenir une prison. Un utilisateur devrait pouvoir changer de RPC, de flux, d'instance, de système de classement, de publicités et de fournisseur de découverte, ou supprimer entièrement le classement. Le client peut proposer des choix affirmés au premier lancement tout en gardant chaque service majeur remplaçable.

Le client est ainsi plus personnalisable qu'une plateforme conventionnelle. Un utilisateur peut conserver le flux classé par défaut avec des publicités. Un autre peut utiliser un flux chronologique sans classement. Un autre encore peut choisir un RPC axé sur la confidentialité, un service de découverte géré par une communauté, un flux payant sans publicité ou un algorithme de niche conçu pour une sous-culture précise.

## Communautés interclients

Les communautés devraient être bien plus importantes que des groupes isolés au sein d'une seule application.

Sur X/Twitter, les communautés sont confinées dans X. Elles peuvent être utiles, mais elles héritent des limites d'une seule plateforme, d'un seul système de comptes, d'une seule pile de recommandations et d'une seule surface produit.

Une communauté Bitsocial peut être créée, hébergée, découverte et utilisée depuis différents clients. Le client de la phase 3 peut donc afficher des communautés et des publications issues de l'ensemble du réseau Bitsocial, et pas seulement des utilisateurs qui ont commencé sur ce client. Une communauté pourrait recevoir simultanément l'activité d'un client d'imageboard, d'un client de discussion de type Reddit, d'un client de forum spécialisé, d'une application mobile et du client de la phase 3.

C'est le principal avantage de l'effet de réseau : un client peut sembler familier au grand public tout en tirant parti de nombreux clients, nœuds communautaires, fournisseurs RPC et services indépendants.

## Algorithmes de flux facultatifs

Le client de la phase 3 ne devrait pas imposer un seul système de classement mondial à tout le monde.

Les algorithmes de flux devraient être activés au choix. Un utilisateur pourrait sélectionner un algorithme sur une place de marché, changer de fournisseur, utiliser l'algorithme d'une entreprise, celui d'un opérateur anonyme, celui créé par une communauté, exécuter son propre algorithme ou n'en utiliser aucun.

Les fournisseurs RPC publics sont un espace naturel de concurrence pour ces services. Ils peuvent indexer, classer et recommander du contenu, mais ne devraient posséder ni l'utilisateur ni son profil.

Ces services peuvent aussi rivaliser sur la forme même du client. Un RPC pourrait fournir un flux classé avec des publicités. Un autre pourrait fournir un flux chronologique non classé. Un autre encore pourrait se spécialiser dans la confidentialité, la traduction, la modération, la découverte de communautés ou un graphe social de niche.

Si le modèle économique fonctionne, les services de flux adossés à des RPC pourraient ajouter des fonctionnalités AI semblables à celles que les plateformes grand public essaient d'intégrer à leurs flux : traductions automatiques, résumés, réponses assistées par des robots, réponses de recherche, aide à la modération ou contexte de type notes de la communauté.

Ces fonctionnalités devraient relever du choix des services, et non des exigences du protocole. Un RPC par défaut peut rivaliser en proposant un flux plus riche, mais les utilisateurs et les clients concurrents devraient toujours pouvoir choisir des solutions plus simples, privées, chronologiques, sans publicité ou propres à une communauté.

## RPC non dépositaire

Chaque utilisateur devrait pouvoir participer en tant que nœud peer-to-peer complet par l'intermédiaire d'un RPC sans donner au fournisseur RPC la propriété de son identité ou de son profil.

La voie hébergée est importante, car la plupart des utilisateurs ne commenceront pas par exploiter un serveur. La voie de sortie l'est tout autant : un utilisateur devrait pouvoir migrer vers son propre nœud de profil sur du matériel modeste, y compris un Raspberry Pi, quand il le souhaite.

C'est la différence entre commodité et garde.

## La conversation publique, renforcée par Bitsocial Chain

Bitsocial Chain peut intégrer des noms durables, des paiements, des pourboires, des récompenses et d'autres services financiers directement dans la conversation publique.

Le client de la phase 3 reste centré sur les publications, le texte, le partage d'idées et les échanges en temps réel, tout en partageant des communautés et des effets de réseau avec les autres clients Bitsocial.
