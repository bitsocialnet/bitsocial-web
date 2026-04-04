---
title: RPC public sans autorisation
description: Conception proposée pour un service public Bitsocial RPC avec des utilisateurs isolés, des autorisations limitées et une propriété communautaire.
---

# RPC public sans autorisation

La proposition publique initiale du RPC était un problème GitHub écrit dans l'ancienne terminologie plebbit. Cette page réécrit cette idée dans le langage Bitsocial et la présente comme une proposition au niveau du produit plutôt que comme un mur de détails de mise en œuvre.

## Objectif en langage simple

Bitsocial Forge peut gérer un service RPC public qui permet à de nombreux utilisateurs de gérer leurs propres communautés Bitsocial à distance, sans transformer l'opérateur en gardien de ces communautés.

Le service doit rendre les clients mobiles et légers pratiques tout en préservant trois contraintes :

1. Les utilisateurs restent isolés les uns des autres par défaut.
2. Les autorisations restent explicites et granulaires.
3. La compatibilité avec la forme actuelle des requêtes et des réponses RPC peut être préservée lors du déploiement.

## Quel problème cela résout

Aujourd’hui, le modèle RPC le plus simple est généralement tout ou rien : une clé d’authentification, un domaine d’autorité et un accès complet. Cela fonctionne pour un seul opérateur mais pas pour un service public multi-utilisateurs.

Un RPC public sans autorisation a besoin d'un modèle plus fort :

- un service peut héberger plusieurs utilisateurs
- chaque utilisateur a ses propres communautés et limites
- les politiques définies par l'opérateur peuvent empêcher les abus
- l'utilisateur peut toujours s'éloigner ou s'auto-héberger plus tard

## Modèle de base

### Utilisateurs

Chaque utilisateur obtient un identifiant d'authentification ainsi qu'un ensemble d'autorisations.

### Communautés

Les communautés créées via le service sont affectées à un enregistrement de propriétaire. La propriété est suivie explicitement afin que les méthodes de gestion puissent être étendues au bon utilisateur.

### Autorisations

Les autorisations sont basées sur les capacités. Au lieu d'un booléen pour « peut utiliser le RPC », le serveur peut contrôler :

- combien de communautés un utilisateur peut créer
- quelles méthodes de gestion sont disponibles
- quelles opérations de publication sont autorisées
- quelles limites de taux s'appliquent
- quelles surfaces d'administration sont visibles

### Surface d'administration

Le RPC public lui-même doit rester concentré sur le comportement du RPC face à l'utilisateur. Les tâches administratives telles que la création d'utilisateurs, le transfert de propriété et la révision d'audit appartiennent à une API et un tableau de bord d'opérateur distincts.

## Position de compatibilité

La documentation destinée aux utilisateurs doit utiliser des termes Bitsocial tels que **communauté** et **profil**.

Au niveau filaire, le premier déploiement peut toujours conserver la forme actuelle du transport et de la charge utile JSON-RPC lorsque cela est utile pour la compatibilité. En d’autres termes : les documents n’ont plus besoin de parler comme les anciens documents plebbit, même si la période de transition conserve certains noms de méthodes ou formes de requêtes hérités en coulisses.

## Ensemble d'autorisations proposé

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

Les noms exacts des méthodes sont indicatifs. L'élément important est la forme de la politique : les capacités individuelles sont contrôlées indépendamment au lieu d'être regroupées dans un seul jeton de superutilisateur.

## Flux de connexion

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

La connaissance des autorisations doit rester facultative. Un client qui ignore la notification peut toujours se comporter correctement en gérant les échecs d'autorisation standard du serveur.

## Application de la propriété

Lorsque le service crée une communauté, il doit automatiquement attribuer la propriété à l'utilisateur appelant. A partir de là :

- Les actions de démarrage, d'arrêt, de modification et de suppression de la communauté sont limitées au propriétaire.
- les réponses aux listes et aux abonnements sont envoyées par défaut aux propres communautés de l'appelant
- une visibilité plus large est une autorisation d'administrateur explicite, pas une autorisation par défaut

Un cas limite est très important : si un utilisateur s'abonne à une communauté qu'il ne possède **pas**, le serveur doit uniquement exposer l'état public que tout observateur extérieur devrait voir. La configuration réservée au propriétaire ou les données d'exécution internes ne doivent jamais fuir via une API d'abonnement.

## Surface de commande suggérée

L'API d'administration peut rester ennuyeuse et explicite :

- lister les utilisateurs
- inspecter un utilisateur
- créer ou mettre à jour des utilisateurs
- supprimer des utilisateurs
- transférer la propriété communautaire
- inspecter les journaux d'audit

L'authentification pour cette API d'opérateur doit être complètement distincte de l'authentification RPC de l'utilisateur final.

## Phases de déploiement

### Phase 1

- établir la structure publique du projet RPC
- ajouter des enregistrements d'utilisateurs et un suivi de propriété
- bifurquer ou étendre le serveur RPC actuel

### Phase 2

- implémenter des ensembles d'autorisations
- appliquez-les au niveau de la couche de méthode RPC
- renvoyer les métadonnées des autorisations lors de la connexion

### Phase 3

- ajouter l'API de l'opérateur
- ajouter un journal d'audit
- ajouter l'authentification de l'administrateur

### Phase 4

- expédier le tableau de bord d'administration
- tester les contrôles d'abus
- resserrer les limitations de débit et les quotas de stockage

## Questions ouvertes

### Spam d'informations d'authentification

Si la création d'authentification est bon marché, les services publics peuvent avoir besoin d'une couche de vérification avant de délivrer des informations d'identification. Une voie possible consiste à réutiliser le modèle de défi communautaire lui-même afin que la délivrance des informations d'identification hérite de la même philosophie anti-abus que le reste du réseau.

### Dénomination héritée

Certaines premières implémentations peuvent encore exposer les noms de méthodes héritées en interne pour des raisons de compatibilité. Cela doit être traité comme un détail de migration, et non comme le vocabulaire public permanent des documents Bitsocial.

## Résumé

Cette proposition vise en réalité une seule chose : rendre l’infrastructure RPC publique utile sans la rendre dépositaire. Un bon RPC Bitsocial public devrait ressembler à une assistance facultative pour gérer les communautés, et non à une nouvelle plate-forme centrale qui récupère la propriété par la porte dérobée.
