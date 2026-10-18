---
title: Où vivent les publications et combien de temps elles durent
description: Pourquoi les publications Bitsocial sont signées et adressées par contenu, mais ne sont pas conservées indéfiniment par chaque nœud, qui les maintient en ligne et comment les archives gardent les anciens contenus lisibles.
---

# Où vivent les publications et combien de temps elles durent

Bitsocial ne stocke pas chaque publication sur une blockchain ou dans la base de données d'une entreprise. Le
nœud de chaque communauté conserve ses publications, les lecteurs et seeders aident à les servir, et quiconque
veut un enregistrement permanent peut en garder un. Les conserver pour toujours est **facultatif, pas obligatoire** :
le protocole n'impose pas à chaque participant de stocker l'historique de tout le réseau.

Cette page précise ce que cela signifie, car « non stocké indéfiniment » se confond facilement avec « disparu »
ou « faites-moi confiance ».

## L'authenticité et la disponibilité sont deux questions distinctes

Une publication pose deux questions :

1. **Est-elle authentique ?** Cet auteur l'a-t-il écrite et cette communauté l'a-t-elle acceptée ?
2. **Est-elle encore en ligne ?** Quelqu'un peut-il la récupérer aujourd'hui ?

Bitsocial répond à la première par la cryptographie, non par la confiance. Chaque publication est signée par la
paire de clés de son auteur et, une fois acceptée, est stockée sous un identifiant de contenu (CID), le hash de ses
octets exacts. Toute personne qui la récupère peut vérifier elle-même signature et hash. Un nœud, routeur,
passerelle ou archive ne peut modifier son texte ni fabriquer une publication d'autrui sans faire échouer ce contrôle.

La seconde question concerne qui en conserve une copie, et c'est la seule partie non garantie.

## Qui maintient les publications en ligne

- **Le nœud de la communauté.** Le nœud du propriétaire accepte les publications et les garde dans sa base de
  données tant que la communauté les conserve. Cette copie existe toujours tant que la communauté fonctionne.
  Voir [Protocole peer-to-peer](/peer-to-peer-protocol/).
- **Les lecteurs.** Les applications de bureau comme l'application Electron 5chan seedent les communautés qu'elles
  chargent pendant leur exécution ; les communautés populaires sont donc servies par de nombreux pairs, comme les
  torrents populaires. Un onglet peut mettre en cache et valider du contenu lorsqu'il est ouvert, mais n'est pas un
  hôte durable.
- **Les seeders.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) permet à chacun d'apporter
  une capacité permanente depuis un VPS ou une machine disponible. Il épingle les dernières pages et mises à jour,
  et rend chargeables dans un navigateur les communautés derrière un routeur domestique.
- **Les archiveurs.** N'importe qui peut explorer des communautés et conserver tout ce qu'il voit. Les archives sont
  des services ordinaires construits sur le réseau, non un rôle spécial du protocole.

## Les communautés choisissent leur propre rétention

La durée de conservation des anciennes publications relève du propriétaire, pas du protocole. Certaines communautés
veulent des années d'historique ; d'autres sont faites pour oublier : les boards 5chan sont des imageboards où les
fils quittent le board, passent dans une archive, puis sont purgés du nœud après un délai (48 heures par défaut).
Une communauté peut aussi se passer totalement d'archive.

Le même protocole permet ces deux usages parce que la rétention est la règle de chaque communauté, non un coût que
chaque nœud doit payer.

## Pourquoi ne pas tout conserver pour toujours ?

Un réseau qui oblige chaque nœud à conserver chaque publication pour toujours doit le financer :

- **Les blockchains** font stocker tout l'historique à chaque nœud complet ; les besoins augmentent avec l'activité
  et publier coûte généralement des frais.
- **Le stockage payant**, comme le loyer de stockage de Farcaster, fait payer l'utilisateur pour son historique et
  supprime les publications les plus anciennes au-delà de ce qui est payé. Voir [Bitsocial et Farcaster](/comparisons/farcaster/).
- **Les serveurs centraux** gardent tout, mais seulement tant qu'une entreprise le veut, selon ses règles.

Les médias sociaux n'ont pas besoin d'un registre mondial. L'ordre à la milliseconde des publications A et B importe
peu et les vieux messages sont rarement lus. Bitsocial laisse chaque nœud ne garder que ses communautés, ce qui rend
l'hébergement abordable sur un ordinateur portable, un Raspberry Pi ou un petit VPS. Voir [Pourquoi pas une blockchain ?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Le compromis

Si personne ne conserve une copie, une publication peut devenir indisponible. Son CID ne change jamais, mais n'est
qu'une adresse : le contenu reste récupérable seulement tant qu'au moins un nœud le sert. Si le nœud d'une communauté
disparaît définitivement sans qu'un lecteur, seeder ou archive ait gardé ses publications, elles sont perdues.

C'est le coût honnête de l'absence de registre mondial, et celui déjà payé par les grandes plateformes quand comptes,
serveurs ou entreprises disparaissent. Avec Bitsocial, conserver quelque chose ne demande l'autorisation de personne.

## Conserver ce qui compte

- **Faites tourner vous-même le nœud de communauté.** Le propriétaire qui le maintient actif conserve l'historique
  selon les réglages de rétention de la communauté.
- **Seedez.** Laisser une application de bureau ouverte ou faire tourner `bitsocial-seeder` maintient les communautés
  accessibles aux autres.
- **Archivez.** Les archives indépendantes gardent les vieux fils lisibles et recherchables lorsqu'une communauté les
  abandonne. [5archive.org](https://5archive.org) archive les boards 5chan et
  [seeditarchive.org](https://seeditarchive.org) les communautés Seedit. Tous deux sont open source : chacun peut
  lancer un miroir ou une archive concurrente.

Chaque publication archivée restant signée, une archive ne peut réécrire discrètement les propos de quelqu'un : le
lecteur vérifie sa signature comme pour une publication en ligne.
