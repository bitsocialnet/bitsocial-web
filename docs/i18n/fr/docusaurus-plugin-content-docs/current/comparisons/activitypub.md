---
title: Bitsocial et ActivityPub
description: Comment le Fediverse, avec Mastodon pour le microblogging et Lemmy pour les communautés à la Reddit, se compare aux communautés peer-to-peer de Bitsocial.
---

# Bitsocial et ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) est le standard du W3C sur lequel repose le
Fediverse. Les utilisateurs choisissent un serveur, appelé instance, qui héberge leur compte, et les
serveurs échangent des publications entre eux. [Mastodon](https://joinmastodon.org/) en est le
logiciel de microblogging le plus connu ; [Lemmy](https://join-lemmy.org/) est un agrégateur de
liens et un forum à la Reddit, organisé en communautés thématiques, ce qui en fait l'équivalent le
plus proche, dans le Fediverse, d'applications Bitsocial comme [Seedit](/apps/seedit/).

## Fonctionnement d'ActivityPub

- **Boîtes de réception et d'envoi.** Chaque compte dispose d'une boîte de réception et d'une boîte
  d'envoi. Les serveurs livrent des activités dans les boîtes de réception d'autres serveurs, et
  chaque serveur destinataire stocke sa propre copie de ce que suivent ses utilisateurs.
- **Une identité qui appartient au serveur.** Les identifiants des comptes et des publications sont
  des adresses HTTPS sur le domaine du serveur d'origine. Un identifiant Mastodon prend la forme
  `@user@domain`, résolue via WebFinger, et le serveur signe les messages de fédération au nom de
  l'utilisateur.
- **Clients.** Les applications et les navigateurs ne communiquent qu'avec le serveur de
  l'utilisateur, via l'API de ce serveur.
- **Communautés Lemmy.** Une communauté est un acteur de groupe hébergé sur une instance. Les
  utilisateurs envoient leurs publications à la communauté, qui les rediffuse à ses abonnés ; selon
  le standard commun aux forums
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)), une
  communauté peut d'abord valider les publications, jusqu'à une approbation manuelle par les
  modérateurs.
- **Modération.** La modération est propre à chaque serveur. Les administrateurs peuvent suspendre
  des comptes, bloquer des serveurs entiers ou ne fédérer qu'avec une liste d'autorisation ; Lemmy
  dispose en outre de modérateurs pour chaque communauté.
- **Lutte contre le spam.** ActivityPub ne définit aucun mécanisme anti-spam. Mastodon et Lemmy
  filtrent les inscriptions par approbation, invitations, questions de candidature, captchas et
  vérification de l'e-mail, puis s'appuient sur des limites de débit, des signalements et la
  modération.

## Ce qui les distingue

### L'identité appartient à un domaine

Un compte du Fediverse appartient au domaine de son serveur. Mastodon peut rediriger les abonnés
vers un nouveau compte, mais
[les publications ne suivent pas](https://docs.joinmastodon.org/user/moving/), le déménagement doit
être lancé depuis l'ancien serveur, et un délai de 30 jours s'applique ensuite. Dans Bitsocial, les
profils et les communautés sont des paires de clés : changer d'hébergeur ou d'application ne change
pas l'identité. Voir [Identité et propriété communautaire](/identity-and-ownership/).

### Où vit une communauté

Une communauté Lemmy est structurellement proche d'une communauté Bitsocial : les publications sont
envoyées à la communauté, qui peut les vérifier avant de les rediffuser. La différence tient à
l'endroit où elle vit. Une communauté Lemmy ne peut être créée que sur l'instance d'origine de son
créateur, l'administrateur de l'instance a sur elle un
[contrôle total](https://join-lemmy.org/docs/users/05-censorship-resistance.html), et aucune méthode
documentée ne permet de la transférer vers une autre instance. Une communauté Bitsocial est sa
propre paire de clés : le propriétaire peut faire tourner son nœud n'importe où, et aucun
administrateur de serveur ne la surplombe.

### Lutte contre le spam

Les serveurs du Fediverse arrêtent surtout le spam à l'inscription, puis modèrent après coup. Une
communauté Bitsocial soumet chaque publication à un défi avant de l'accepter, et chaque communauté
choisit le sien : captcha, liste d'autorisation, paiement ou tout autre code. Voir
[Défis anti-spam personnalisés](/custom-challenges/).

### Faire tourner l'infrastructure

Exploiter une instance suppose un serveur allumé en permanence, avec un domaine, du TLS et un
service d'e-mail. Mastodon a aussi besoin de PostgreSQL, de Redis et de processus d'arrière-plan ;
Lemmy est plus léger, avec environ 150 Mo de RAM selon ses propres chiffres. Chaque instance stocke
des copies du contenu distant que suivent ses utilisateurs. Un nœud de communauté Bitsocial n'a
besoin ni de domaine ni de certificat, et tourne depuis l'application de bureau ou `bitsocial-cli`.

### Ce que les serveurs apportent en retour

Les serveurs du Fediverse conservent l'historique complet et le servent de façon fiable, et Mastodon
dispose d'outils de modération matures, développés au fil des années. Bitsocial ne garantit pas la
conservation indéfinie des anciens contenus, et ses outils de modération relèvent de chaque
application.

## Comparaison

| Question                   | ActivityPub (Mastodon, Lemmy)                                                                         | Bitsocial                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Catégorie                  | Serveurs fédérés                                                                                      | Réseau de communautés peer-to-peer                                                                     |
| Identité                   | Compte sur le domaine d'un serveur, signé par le serveur                                              | Paires de clés Ed25519 pour les utilisateurs et les communautés                                        |
| Où vivent les publications | Le serveur d'origine, plus des copies sur chaque serveur abonné                                       | Le nœud du propriétaire de la communauté et les pairs qui la lisent et la partagent                    |
| Qui le maintient en ligne  | Les administrateurs d'instance                                                                        | Le nœud du propriétaire de la communauté, plus des seeders auxiliaires                                 |
| Communautés                | Communautés Lemmy hébergées sur une instance                                                          | Objets de premier ordre dont le nœud accepte ou rejette les publications                               |
| Lutte contre le spam       | Filtrage des inscriptions, limites de débit, signalements et modération                               | Le défi de chaque communauté, avant qu'une publication soit acceptée                                   |
| Modération                 | Administrateurs de serveur et modérateurs de communauté, propres à chaque serveur                     | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent        |
| Noms                       | Identifiants `@user@domain` et `!community@domain`                                                    | Noms `.bso` et `.eth` qui se résolvent en clés                                                         |
| Navigateur                 | Client du serveur de l'utilisateur                                                                    | Nœud peer-to-peer dans un onglet de navigateur ordinaire                                               |
| Compromis principal        | Historique fiable et modération mature, mais l'identité et les communautés appartiennent à un serveur | Ni serveur ni domaine nécessaires, mais aucune garantie de conservation indéfinie des anciens contenus |
