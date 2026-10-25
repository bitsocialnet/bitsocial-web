---
title: Répertoires
description: Comment les applications Bitsocial permettent aux communautés de se disputer un nom de sujet au lieu de le réserver à celui qui l'a revendiqué en premier.
---

# Répertoires

Sur Reddit, un nom comme `r/opensource` ne peut appartenir qu'à une seule communauté, et celui qui la contrôle le garde. Si ses modérateurs font des choix que les utilisateurs désapprouvent, la seule alternative est de lancer `r/opensource2`. La nouvelle communauté démarre avec zéro abonné, alors que la plupart des personnes abonnées à `r/opensource` s'intéressaient à l'open source, pas à cette équipe de modération en particulier.

Les applications Bitsocial évitent ce problème grâce aux **répertoires**. Un répertoire est un nom de sujet, comme `opensource`, que les communautés se disputent. La route courte associée à ce nom ouvre la communauté qui se classe actuellement en tête, si bien qu'une meilleure communauté peut reprendre le nom sans demander la permission à quiconque.

## Fonctionnement

1. **Un code de répertoire est un nom de sujet.** Seedit utilise des routes comme `/s/funny`. 5chan utilise des chemins d'imageboard comme `/g/`.
2. **Les communautés concourent en tant que candidates.** Chaque répertoire possède une liste de communautés candidates, chacune avec sa propre adresse exacte, par exemple `funny-posting.bso`.
3. **La candidate la mieux classée remporte la route.** Ouvrir `/s/funny` affiche la gagnante actuelle.
4. **Perdre ne supprime rien.** Une communauté qui n'est pas gagnante conserve son adresse, ses publications et ses abonnés, et chacun peut toujours l'ouvrir directement.

## Le nom est une porte d'entrée, pas une identité

Un code de répertoire n'est qu'une route de découverte. Tout ce qui est durable pointe vers une communauté précise :

- S'abonner depuis `/s/funny` revient à s'abonner à l'adresse exacte de la gagnante actuelle. Le code de répertoire lui-même n'est jamais enregistré comme abonnement.
- Les liens vers les publications utilisent toujours l'adresse exacte de la communauté, de sorte qu'un ancien lien ne peut pas se mettre à pointer vers une autre communauté quand la gagnante change.
- Quand la gagnante change, Seedit ne touche pas aux abonnements existants et demande à chaque abonné s'il veut passer à la nouvelle gagnante, garder les deux ou conserver la communauté actuelle. Le basculement automatique est un réglage facultatif, à activer répertoire par répertoire, et chaque basculement automatique affiche une notification permettant de l'annuler.

Une communauté concurrente ne prend donc les abonnements de personne. Elle remporte le nom : les nouveaux visiteurs arrivent chez elle, et les abonnés existants se voient proposer un choix en un clic. Ceux qui préféraient l'ancienne communauté la gardent.

## Pourquoi pas le principe du premier arrivé

- **Pas de squat.** Détenir un bon nom ne suffit pas. Une communauté doit rester la meilleure candidate pour ce nom.
- **Aucun administrateur n'attribue les noms.** Une attribution par un administrateur recréerait le veto central que Bitsocial est conçu pour supprimer.
- **Les concurrents gardent un accès au public.** Une communauté rivale vise le même nom au lieu de repartir de zéro sous un nom moins bon.
- **Les clients s'accordent sur la gagnante.** Seedit classe les candidates de manière déterministe, si bien que chaque client qui lit le même instantané finalisé du répertoire affiche la même gagnante. Seedit ne remplace pas la gagnante par une autre candidate simplement parce qu'elle est temporairement injoignable depuis la connexion d'un utilisateur.

## Comment les gagnantes sont désignées aujourd'hui

Les candidates sont publiées sous forme de fichiers JSON dans le dépôt [bitsocialnet/lists](https://github.com/bitsocialnet/lists), un fichier par répertoire, et une communauté rejoint un répertoire via une pull request sur son fichier. Il s'agit d'une étape d'amorçage. L'objectif est que le vote remplace les pull requests pour désigner les gagnantes.

- **Seedit** classe les candidates d'un répertoire par score, puis par date d'ajout, puis par adresse. Chaque fichier de répertoire porte un numéro de révision, et toute modification de ses candidates ou de sa gagnante publie une nouvelle révision.
- **5chan** organise un scrutin par répertoire avec [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Les clients échangent des bulletins signés via libp2p gossipsub et calculent eux-mêmes le décompte, sans aucun serveur chargé de compter les votes. Pour voter, il faut détenir un 5chan Pass, un jeton non transférable, et chaque détenteur dispose d'une voix. Voter pour un board qui n'est pas encore listé revient à le proposer comme candidat. Les scrutins se déroulent actuellement sur le testnet Base Sepolia, et tant qu'ils n'en sont pas sortis, les décomptes sont affichés mais ne modifient pas l'ordre de la liste.

## Protocole ou application ?

Les répertoires ne font pas partie de PKC, la couche peer-to-peer qui stocke et transporte les communautés. Ils relèvent d'une convention que les clients appliquent au-dessus de cette couche, aux côtés des listes par défaut et de la recherche ; voir [Découverte de contenu](./content-discovery.md). Un client peut lire les mêmes fichiers de répertoire, publier les siens ou se passer complètement des répertoires, et les utilisateurs peuvent toujours ouvrir n'importe quelle communauté par son adresse.
