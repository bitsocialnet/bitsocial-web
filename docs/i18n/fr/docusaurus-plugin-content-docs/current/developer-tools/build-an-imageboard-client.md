---
title: Créer un client de tableau d'images
description: Guide de contribution de phase 1 pour les constructeurs qui souhaitent proposer de nouvelles expériences de tableau d'images sur Bitsocial.
sidebar_position: 1
---

# Créer un client de tableau d'images

La phase 1 ne concerne pas une seule application officielle couvrant l’ensemble de la catégorie. 5chan est le premier point de preuve, mais l'objectif réel est un vaste écosystème de tableaux d'images : plusieurs clients Bitsocial avec différents langages visuels, paramètres de modération par défaut, modèles d'annuaire et communautés cibles.

## Ce dont la phase 1 a besoin

- Clients familiers de style 4chan pour une intégration grand public
- Clients inspirés par Altchan avec différentes cultures et offres groupées
- Clients mobiles ou à faible bande passante
- Clients d’une seule communauté ou de niche avec de forts défauts d’opinion
- De meilleurs flux de modération, de médias, d'intégration ou de découverte que ceux fournis avec la première application

## Le moyen le plus rapide d'aider

Si vous souhaitez le chemin le plus court vers l'expédition, contribuez d'abord directement à 5chan :

- Explorez l'application en direct sur [5chan.app](https://5chan.app)
- Consultez la source sur [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Rejoignez le chat du constructeur sur [t.me/fivechandev](https://t.me/fivechandev)

## Créez votre propre client

Si 5chan ne correspond pas à la communauté ou à l'interface souhaitée, créez plutôt un client distinct. Les clients Bitsocial compatibles peuvent partager le même réseau sans partager les mêmes décisions relatives aux produits.

1. Découvrez les outils liés au protocole :
   - [Crochets Bitsocial React](../react-hooks/)
   - [CLI Bitsocial](../cli/)
2. Décidez quel type de tableau d’images vous construisez réellement.
Choisissez d'abord la structure du conseil d'administration, les hypothèses d'identité, le modèle de modération, le flux de découverte et le langage visuel.
3. Choisissez le chemin de mise en œuvre qui correspond au projet.
Fork 5chan si vous souhaitez avancer rapidement avec une base de tableau d'images familière. Repartez à zéro si l’interface utilisateur ou le modèle d’interaction doit être radicalement différent.
4. Expédiez une première version étroite.
Un client qui sert bien une véritable communauté a plus de valeur qu’un vague clone destiné à satisfaire tout le monde.
5. Publiez le résultat et laissez les communautés le tester.
Bitsocial s'améliore lorsque des constructeurs extérieurs expédient des clients avisés qui rivalisent sur la qualité des produits au lieu d'attendre qu'une seule application officielle fasse tout.

## Principe de conception

Bitsocial ne gagne pas en ayant un seul client béni. Elle gagne lorsque de nombreux clients peuvent coexister, se spécialiser et répondre à des besoins que la première application ne répondra jamais.
