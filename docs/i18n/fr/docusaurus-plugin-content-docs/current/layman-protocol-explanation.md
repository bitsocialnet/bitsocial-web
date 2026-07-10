---
title: Une explication profane complète du protocole Bitsocial
description: Une présentation en anglais simple des communautés Bitsocial, de la recherche par les pairs, de la publication, des défis anti-spam, de la modération et des applications.
---

# Une explication profane complète du protocole Bitsocial

Cette page explique Bitsocial sans supposer que vous comprenez déjà les réseaux peer-to-peer, les clés cryptographiques, IPFS ou pubsub.

Certains détails sont volontairement simplifiés. Pour la version plus technique, lisez la page [Protocole peer-to-peer](./peer-to-peer-protocol.md).

## La version courte

Bitsocial est un protocole pour les applications sociales où les communautés appartiennent à des clés plutôt qu'à une base de données d'entreprise.

Une communauté Bitsocial a une adresse. Les applications utilisent cette adresse pour rechercher des pairs qui servent la communauté, récupérer les dernières publications de ces pairs et publier de nouvelles publications via un canal de messagerie peer-to-peer. Avant qu'une publication ne soit acceptée, la communauté peut exiger un défi anti-spam tel qu'un captcha, un code d'invitation, un paiement, une vérification de jeton, une vérification de modération de l'IA, une liste verte ou toute autre règle pouvant être codée.

C'est l'idée centrale :

1. Une communauté est contrôlée par une clé privée.
2. La clé publique donne à la communauté une adresse stable.
3. Les pairs aident les lecteurs à trouver et à récupérer la communauté.
4. Un nœud de communauté accepte ou rejette les nouvelles publications.
5. La politique anti-spam appartient à chaque communauté et non à une seule plateforme mondiale.

## Pourquoi les hachages sont importants

Un hachage est une courte empreinte digitale pour les données.

Si deux personnes hachent exactement le même fichier, elles obtiennent la même empreinte digitale. Si le fichier change, l'empreinte digitale change. Cela rend les hachages utiles pour rechercher et vérifier des données sans faire confiance à une entreprise pour vous dire de quoi il s'agit.

Les systèmes peer-to-peer utilisent constamment cette idée. Au lieu de demander à un site Web « le fichier nommé photo.png », un homologue peut demander au réseau les données avec une empreinte digitale spécifique. Si un autre homologue renvoie les mauvaises données, la vérification du hachage échoue.

Bitsocial utilise des hachages et des identifiants de contenu pour les données de publication et d'autres éléments de l'état de la communauté. Le point important est simple : les données peuvent être traitées par ce qu’elles sont, et pas seulement par l’endroit où l’entreprise les a hébergées.

## Pourquoi les clés publiques sont importantes

Une clé publique et une clé privée forment une paire appariée.

La clé privée est secrète. C'est la chose qui donne le contrôle. La clé publique peut être partagée en toute sécurité. Il permet à tout le monde de vérifier qu'un message, une mise à jour ou une action de modération provient réellement de la clé privée correspondante.

C'est ainsi que Bitsocial évite les comptes de plateforme normaux. Une entreprise n'a pas besoin de délivrer l'identité. Une ligne de base de données n'a pas besoin de définir le propriétaire. La paire de clés est l'autorité.

En termes clairs :

- la clé privée est la poignée de contrôle du propriétaire
- la clé publique est l'identité ou l'adresse publique
- les signatures prouvent qu'une action émane du propriétaire

## Qu'est-ce qu'une communauté Bitsocial

Une communauté Bitsocial n'est pas seulement une page dans une seule application.

Il possède sa propre paire de clés. La clé publique donne à la communauté une adresse réseau stable. La clé privée contrôle les mises à jour de l'état de la communauté, telles que les métadonnées, les règles, la liste des modérateurs, la configuration des défis et les pointeurs vers le dernier contenu accepté.

Cela signifie qu'une communauté peut survivre à une seule interface. Une application peut l'afficher sous forme de tableau. Une autre application peut l'afficher sous forme de forum. Une future application pourra l’afficher dans un flux basé sur un profil. L'application peut changer, mais l'adresse de la communauté pointe toujours vers la même communauté.

## Comment fonctionne la lecture

Lorsqu'un utilisateur ouvre une communauté Bitsocial, l'application ne demande pas la page à une base de données centrale.

Le flux est plus proche de ceci :

1. L'application connaît déjà l'adresse de la communauté ou l'obtient à partir d'une liste, d'un lien, d'une surface de recherche ou
   nom lisible par l'homme.
2. L'application demande aux routeurs légers quels pairs fournissent actuellement cette adresse de communauté.
3. Les routeurs renvoient uniquement des adresses homologues. Ils ne renvoient pas de messages, de règles, de profils ou de communauté
   métadonnées.
4. L'application se connecte à ses pairs et récupère le dernier état de la communauté.
5. Cet état contient des pointeurs pour publier du contenu.
6. L'application récupère le contenu de la publication auprès de ses pairs et le restitue dans une interface sociale normale.

Le routeur n'est qu'une aide à la recherche. C'est plus proche de la question « qui a ça ? » plutôt que de demander « s'il vous plaît, servez-moi tout le site Web ».

Pour plus de détails sur cette répartition, lisez [Découverte de contenu](./content-discovery.md).

## Comment fonctionne la publication

La publication est différente de la lecture car les réseaux peer-to-peer ouverts peuvent être spammés.

Bitsocial gère la publication via un flux défi-réponse :

1. L'utilisateur écrit un message ou une réponse.
2. L'application rejoint le sujet des messages peer-to-peer de la communauté.
3. L'application demande un défi au nœud communautaire.
4. Le nœud communautaire renvoie le défi.
5. L'utilisateur ou l'application termine le défi.
6. L'application envoie le message ainsi que la réponse au défi.
7. Le nœud communautaire vérifie la réponse et le message.
8. S'il réussit, le nœud de communauté accepte la publication dans la prochaine mise à jour de la communauté.
9. D'autres lecteurs récupèrent l'état de la communauté mis à jour auprès de leurs pairs.

Le défi se produit avant que le poste ne fasse partie de l’état communautaire accepté. C'est la différence importante avec les systèmes dans lesquels le spam est d'abord accepté et masqué ensuite.

## Pourquoi les défis anti-spam sont importants

La plupart des plateformes sociales font de la lutte contre le spam une politique de plateforme. Une entreprise décide de ce qui compte comme un compte valide, une publication valide, une portée valide ou un utilisateur valide.

Bitsocial sépare ces choses. Le protocole donne aux communautés la possibilité d'exiger un défi avant d'accepter un poste, mais il n'oblige pas toutes les communautés à utiliser le même défi.

Une communauté pourrait utiliser un captcha. Un autre pourrait utiliser des codes d’invitation. Un autre peut nécessiter une vérification par SMS, un paiement, un NFT, un solde de jetons, un score de modération de l'IA, une preuve de réputation, une liste blanche spécifique à la communauté ou une règle personnalisée.

Cette flexibilité est importante car le spam évolue. Une règle anti-spam au niveau du protocole devient obsolète. Un défi au niveau communautaire peut évoluer sans migrer l’ensemble du réseau.

Pour une explication ciblée, lisez [Défis anti-spam personnalisés](./custom-challenges.md).

## Comment fonctionne la modération

Bitsocial n'est pas sans modération. C'est une modération sans un super-administrateur mondial.

Une communauté peut avoir des propriétaires et des modérateurs. Les adresses des modérateurs font partie de l’état de la communauté. Lorsqu'un modérateur entreprend une action, cette action peut être signée. Le nœud de communauté et les clients peuvent vérifier la signature par rapport à la liste des modérateurs.

Cela donne à la modération une portée locale :

- un propriétaire de communauté contrôle cette communauté
- les modérateurs agissent à travers des clés reconnues par la communauté
- les applications peuvent toujours choisir ce qu'elles indexent, classent, masquent ou mettent en évidence
- aucun compte d'entreprise au niveau du protocole ne peut effacer chaque identité ou s'emparer de chaque communauté

En pratique, cela signifie qu’une communauté peut supprimer le spam ou appliquer des règles au sein de son propre espace sans transformer ses règles en lois pour l’ensemble du réseau.

Pour la vue politique, lisez [Modération locale, pas interdictions mondiales](./local-moderation.md).

## Quelles applications ajoutent

Le protocole ne décide pas à quoi doit ressembler l’ensemble du produit.

Une application ajoute l'expérience humaine autour du protocole :

- listes de communautés par défaut
- recherche et découverte
- flux et classement
- interface de mise en page et de publication
- gestion des médias
- outils de modération
- emballage pour mobile, ordinateur de bureau ou navigateur
- modèle économique et valeurs par défaut

C'est pourquoi Bitsocial peut prendre en charge différents styles d'applications. 5chan peut ressembler à un tableau d'images. Seedit peut ressembler à une discussion de type forum. D'autres clients peuvent créer différentes surfaces de découverte, systèmes de classement, vues de modération ou valeurs par défaut de la communauté tout en utilisant les communautés Bitsocial compatibles en dessous.

Le protocole maintient la propriété et la publication portables. Les applications rivalisent sur la qualité des produits.

## Ce que le RPC public ajoute

L’exécution directe d’un nœud de communauté peer-to-peer est puissante, mais tout le monde ne souhaite pas gérer une machine toujours active.

Public RPC est la couche de service qui peut rendre Bitsocial plus pratique. Un fournisseur RPC public peut aider les utilisateurs à gérer les communautés à partir d'un téléphone ou d'un client léger, tandis que le modèle de propriété à long terme devrait toujours permettre aux utilisateurs de s'éloigner, de s'auto-héberger ou de choisir un fournisseur concurrent.

La distinction compte :

- RPC peut vous aider en termes de disponibilité et de commodité
- Le RPC ne devrait pas devenir une garde permanente
- la relation propriétaire doit rester liée aux clés, et non à la base de données d'un fournisseur

## Ce que Bitsocial n'est pas

Bitsocial n'est pas un réseau social blockchain. Les réseaux sociaux n’ont pas besoin que chaque publication devienne une transaction dans un grand livre mondial.

Bitsocial n'est pas une fédération au sens d'ActivityPub. Une communauté n'a pas besoin d'être un compte sur un serveur avec un domaine, un administrateur et une base de données de serveur.

Bitsocial n’est pas non plus une seule application. Il s'agit d'une couche de protocole partagée pour les applications, les communautés, les nœuds, les routeurs, les fournisseurs RPC, les services de découverte, les modules anti-spam et les outils de modération.

Le fait n’est pas que chaque utilisateur doive comprendre tout cela avant de publier. Le fait est que le produit peut sembler normal alors que le modèle de propriété en dessous est différent.

## Où aller ensuite

- [Protocole peer-to-peer](./peer-to-peer-protocol.md) explique le flux technique.
- [Découverte de contenu](./content-discovery.md) explique la recherche de réseau par rapport à la curation d'applications.
- [Défis anti-spam personnalisés](./custom-challenges.md) explique le système de challenge.
- [Identité et propriété communautaire](./identity-and-ownership.md) explique le contrôle par clé
  propriété.
- [Créez votre propre client](/build-your-own-client/) explique comment les applications indépendantes peuvent s'appuyer sur
  le même réseau.
