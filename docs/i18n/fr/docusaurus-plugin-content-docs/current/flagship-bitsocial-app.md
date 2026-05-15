---
title: Application Bitsocial phare
description: "Le client Bitsocial proposé basé sur le profil : familier comme X/Twitter par défaut, mais avec des RPC, des flux, des algorithmes, des publicités et des communautés remplaçables."
---

# Application Bitsocial phare

L'application phare Bitsocial est le premier client proposé basé sur le profil pour le réseau. La comparaison la plus simple est la suivante : familier comme X/Twitter par défaut, mais avec la couche plate-forme ouverte.

Il ajouterait des profils, des suivis, des réponses, des flux, des communautés, des notifications et des conversations publiques en temps réel tout en gardant les services sous-jacents remplaçables. 5chan prouve que les communautés anonymes peuvent fonctionner. Seedit s’oriente vers une discussion persistante. L'application phare intégrerait ces effets de réseau dans un flux social grand public sans qu'une seule entreprise soit propriétaire du graphique.

Cette page décrit l'orientation du produit, et non une spécification de version verrouillée. L'interface exacte, le flux par défaut, le modèle publicitaire, les fonctionnalités d'IA et le marché RPC peuvent changer à mesure que le protocole et les premières applications évoluent.

## Ce que cela devrait prouver

L’application devrait prouver qu’un réseau social basé sur un profil peut éviter de devenir une plateforme dépositaire :

- les utilisateurs peuvent posséder des identités et des profils
- les communautés et les nœuds de profil peuvent rester peer-to-peer
- les communautés peuvent avoir des effets de réseau sur les clients Bitsocial
- Les fournisseurs RPC peuvent rendre l'application pratique sans en prendre la garde
- les algorithmes de flux peuvent être des services facultatifs au lieu de la loi sur les plateformes
- d'autres clients peuvent toujours rivaliser pour le même réseau

Il ne s’agit pas de créer le seul client Bitsocial. Le but est de créer le premier client large qui montre jusqu'où le protocole peut s'étendre.

## Familier par défaut, remplaçable par conception

L'expérience par défaut doit être compétitive par rapport aux applications de conversation publique grand public : un flux d'accueil rapide, des suivis, des réponses, une distribution de type republication, des communautés, des notifications, une recherche et une vue classée Pour vous qui fonctionne immédiatement.

Bitsocial Forge peut exécuter le premier service RPC et flux par défaut. Cette valeur par défaut peut inclure un flux classé et des publicités afin que l'application semble complète dès le premier jour au lieu de demander aux utilisateurs grand public d'assembler eux-mêmes l'ensemble de la pile.

La différence est que le défaut ne doit pas devenir la prison. Un utilisateur doit pouvoir changer de RPC, de flux, d'instances, de systèmes de classement, d'annonces et de fournisseurs de découverte, ou supprimer complètement le classement. L'application peut faire l'objet d'une opinion dès le premier lancement tout en gardant tous les services majeurs remplaçables.

Cela rend l'application plus personnalisable qu'une plateforme conventionnelle. Un utilisateur peut conserver le flux classé par défaut avec des annonces. Un autre pourrait utiliser un flux chronologique sans classement. Un autre pourrait choisir un RPC axé sur la confidentialité, un service de découverte géré par la communauté, un flux payant sans publicité ou un algorithme de niche conçu pour une sous-culture spécifique.

## Communautés inter-clients

Les communautés devraient être bien plus importantes que les groupes isolés au sein d’une seule application.

Sur X/Twitter, les communautés sont confinées à l'intérieur de X. Elles peuvent être utiles, mais elles héritent des limites d'une seule plateforme, d'un seul système de compte, d'une seule pile de recommandations et d'une seule surface de produit.

Une communauté Bitsocial peut être créée, hébergée, découverte et utilisée via différents clients. Cela signifie que l'application phare peut afficher les communautés et les publications du réseau Bitsocial plus large, et pas seulement celles des utilisateurs qui ont commencé dans l'application phare. Une communauté peut avoir à la fois l'activité d'un client imageboard, d'un client de discussion de style Reddit, d'un client de forum de niche, d'une application mobile et de l'application phare.

C'est là le principal avantage de l'effet réseau : un client peut se sentir familier aux utilisateurs grand public tout en tirant de la valeur de nombreux clients, nœuds communautaires, fournisseurs RPC et services indépendants.

## Algorithmes de flux facultatifs

L’application phare ne devrait pas imposer un système de classement mondial à tout le monde.

Les algorithmes de flux doivent être opt-in. Un utilisateur peut choisir un algorithme sur un marché, changer de fournisseur, utiliser un algorithme d'une entreprise, en utiliser un géré par un opérateur anonyme, en utiliser un créé par une communauté, en exécuter un personnel ou n'utiliser aucun algorithme du tout.

Les fournisseurs publics de RPC constituent un lieu naturel de concurrence pour ces services. Ils peuvent indexer, classer et recommander du contenu, mais ils ne doivent pas être propriétaires de l’utilisateur ou du profil.

Ces services peuvent également rivaliser sur la forme de l’application elle-même. Un RPC peut fournir un flux classé avec des publicités. Un autre pourrait fournir un flux chronologique non classé. Un autre pourrait se spécialiser dans la confidentialité, la traduction, la modération, la découverte de communauté ou un graphe social de niche.

Si les conditions économiques fonctionnent, les services de flux soutenus par RPC pourraient ajouter des fonctionnalités d'IA similaires à celles que les plateformes grand public tentent d'intégrer dans leurs flux : traductions automatiques, résumés, réponses assistées par des robots, réponses à la recherche, aide à la modération ou contexte de style note de la communauté.

Ces fonctionnalités doivent être des choix de service et non des exigences de protocole. Un RPC par défaut peut rivaliser en offrant un flux plus riche, mais les utilisateurs et les clients concurrents devraient toujours pouvoir choisir des alternatives plus simples, privées, chronologiques, sans publicité ou spécifiques à la communauté.

## RPC non dépositaire

Chaque utilisateur doit pouvoir participer en tant que nœud peer-to-peer complet via RPC sans donner au fournisseur RPC la propriété de son identité ou de son profil.

Le chemin hébergé est important car la plupart des utilisateurs ne commenceront pas par exécuter un serveur. Le chemin de sortie est tout aussi important : un utilisateur doit pouvoir accéder à son propre nœud de profil sur du matériel peu performant, y compris un Raspberry Pi, quand il le souhaite.

C'est la différence entre la commodité et la garde.

## Pourquoi cela peut devenir une application polyvalente

Si Bitsocial Network donne aux applications des noms durables, des paiements, des pourboires, des récompenses et d'autres rails financiers, l'application phare pourrait devenir bien plus qu'un client de flux.

La contrainte importante est que l’application ne devienne pas le nouveau propriétaire du réseau. Il peut s'agir d'un gros client, peut-être même du client le plus populaire, tout en laissant de la place aux applications concurrentes, aux RPC concurrents, aux algorithmes de flux concurrents et aux nœuds de profil auto-hébergés.
