---
title: Bitsocial et Bluesky
description: Comment Bluesky et l'AT Protocol, avec leurs serveurs de données personnelles, leurs relais et leurs AppViews, se comparent aux communautés peer-to-peer de Bitsocial.
---

# Bitsocial et Bluesky

[Bluesky](https://bsky.app/) est une application de microblogging construite sur
l'[AT Protocol](https://atproto.com/), conçu par Bluesky Social PBC. Le protocole découpe un réseau
social en services distincts : les serveurs de données personnelles hébergent les comptes, les
relais les agrègent en un flux unique, et les AppViews indexent ce flux pour en tirer les fils
d'actualité et les discussions que les gens voient. Sa documentation décrit les données des comptes
comme stockées sur des serveurs hôtes, « par opposition à un modèle peer-to-peer »
([présentation](https://atproto.com/guides/overview)).

## Fonctionnement de l'AT Protocol

- **Des dépôts sur des serveurs.** Chaque publication, mention « J'aime » ou abonnement est un
  enregistrement dans le dépôt signé de son auteur, hébergé sur un serveur de données personnelles
  (PDS). Bluesky exploite les serveurs par défaut, et chacun peut héberger le sien.
- **Relais.** Les relais s'abonnent à chaque PDS et rediffusent les modifications sous la forme d'un
  flux unique, le firehose. Depuis une mise à jour du protocole en 2025, ils n'archivent plus chaque
  dépôt, ce qui les a rendus bien moins coûteux à exploiter
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** Une AppView indexe l'ensemble du firehose et sert les fils d'actualité, les
  discussions complètes, les compteurs et la recherche. C'est la partie du réseau la plus gourmande
  en ressources.
- **Identité.** Un compte est un DID : généralement `did:plc`, enregistré dans un annuaire mondial
  unique, ou `did:web`, lié à un domaine. Le document DID indique l'identifiant du compte, sa clé de
  signature et son serveur actuel. Le PDS détient la clé de signature ; `did:plc` permet aussi aux
  utilisateurs de détenir des clés de rotation afin de déménager sans l'aide de l'ancien hébergeur
  ([guide de l'identité](https://atproto.com/guides/identity)).
- **Identifiants.** Les identifiants sont des noms DNS, comme `alice.bsky.social` ou un domaine que
  possède l'utilisateur, vérifiés par rapport au DID.
- **Modération.** L'hébergement et la portée sont des couches séparées. N'importe qui peut exploiter
  un service d'étiquetage, et les utilisateurs peuvent en cumuler plusieurs
  ([guide de la modération](https://atproto.com/guides/moderation)), mais l'application Bluesky
  applique toujours la modération de Bluesky. Les auteurs peuvent limiter qui a le droit de répondre
  à leurs publications et masquer des réponses.

## Ce qui les distingue

### Serveurs ou pairs

Les données de Bluesky vivent sur des serveurs : un PDS héberge chaque compte, les relais
transportent le firehose et les AppViews servent ce qu'affichent les clients. Un navigateur est un
client HTTP de ces services, jamais un pair. Dans Bitsocial, ce sont le nœud de la communauté et les
pairs qui la lisent qui servent le contenu, et une application web peut exécuter son propre nœud
peer-to-peer. Voir [Peer-to-peer dans le navigateur](/browser-p2p/).

### Une vue globale ou des communautés

L'AT Protocol est conçu pour une vue globale unique : une AppView voit chaque réponse, si bien que
les discussions et la recherche sont complètes. Bitsocial n'a pas d'index global ; chaque communauté
publie son propre état, et les applications construisent la découverte par-dessus. Voir
[Découverte de contenu](/content-discovery/).

Bluesky n'a aujourd'hui aucun objet de communauté pour les publications publiques. En juin 2026, il
a [annoncé des communautés natives](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k),
avec une publication soumise à approbation pour certains niveaux de confidentialité ; elles
n'avaient pas été lancées en octobre 2026. Dans Bitsocial, les communautés sont l'objet central, et
le nœud d'une communauté accepte ou rejette les publications.

### Lutte contre le spam

Bluesky traite le spam au moyen de limites de débit sur ses serveurs, de limites imposées aux
nouveaux hébergeurs au niveau du relais, de détection automatisée, de vérification humaine et
d'étiquettes, et les auteurs peuvent restreindre les réponses. Aucun filtre au niveau d'une
communauté ne détermine ce qu'une publication doit franchir avant d'être acceptée. Dans Bitsocial,
chaque communauté choisit son propre défi. Voir
[Défis anti-spam personnalisés](/custom-challenges/).

### Qui détient les clés

Les comptes hébergés sur les serveurs de Bluesky se connectent avec un mot de passe, et ces serveurs
conservent leurs clés de signature en dépôt ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)).
Selon un ingénieur protocole de Bluesky,
[la plupart des comptes n'ont pas de clés de rotation contrôlées de façon indépendante](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Une identité Bitsocial est une paire de clés générée et détenue par l'application de l'utilisateur.

### Faire tourner l'infrastructure

Un serveur personnel coûte peu : le [PDS de référence](https://github.com/bluesky-social/pds)
recommande 1 Go de RAM pour 20 utilisateurs au maximum. Une AppView indépendante couvrant tout le
réseau est un projet d'envergure ; l'une d'elles, construite en 2025,
[coûtait environ 200 $ par mois](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), principalement pour
16 To de stockage. Bitsocial n'a pas d'index global à répliquer, et un nœud de communauté tourne sur
du matériel grand public.

## Comparaison

| Question                   | Bluesky (AT Protocol)                                                                               | Bitsocial                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Catégorie                  | Serveurs fédérés avec un index global                                                               | Réseau de communautés peer-to-peer                                                              |
| Identité                   | DID, dont les clés de signature sont généralement détenues par le serveur                           | Paires de clés Ed25519 pour les utilisateurs et les communautés                                 |
| Où vivent les publications | Le dépôt de l'auteur sur un serveur de données personnelles                                         | Le nœud du propriétaire de la communauté et les pairs qui la lisent et la partagent             |
| Qui le maintient en ligne  | Hébergeurs de PDS, relais et AppViews, exploités par défaut par Bluesky                             | Le nœud du propriétaire de la communauté, plus des seeders auxiliaires                          |
| Communautés                | Aucune pour les publications publiques à ce jour (annoncées en 2026)                                | Objets de premier ordre dont le nœud accepte ou rejette les publications                        |
| Lutte contre le spam       | Limites de débit des serveurs, détection automatisée, étiquettes, contrôle des réponses             | Le défi de chaque communauté, avant qu'une publication soit acceptée                            |
| Modération                 | Services d'étiquetage cumulables ; l'application Bluesky applique toujours la modération de Bluesky | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent |
| Noms                       | Identifiants DNS vérifiés par rapport au DID                                                        | Noms `.bso` et `.eth` qui se résolvent en clés                                                  |
| Navigateur                 | Client HTTP d'un PDS et d'une AppView                                                               | Nœud peer-to-peer dans un onglet de navigateur ordinaire                                        |
| Compromis principal        | Discussions et recherche globales complètes, mais l'agrégation exige des serveurs lourds            | Pas d'index global lourd, mais pas de vue complète de tout le réseau                            |
