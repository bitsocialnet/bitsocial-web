---
title: Bitsocial et les réseaux sociaux sur blockchain
description: Comment Lens, DeSo et Steem placent des données ou des règles sociales sur une blockchain, et pourquoi Bitsocial n'en utilise pas.
---

# Bitsocial et les réseaux sociaux sur blockchain

Lens, DeSo et Steem placent chacun l'activité sociale sur une blockchain. Les comptes, les
abonnements, les publications ou les règles qui les encadrent deviennent des transactions que des
validateurs ordonnent et stockent. Bitsocial n'utilise aucune blockchain : les médias sociaux n'ont
pas besoin d'un ordre global pour chaque publication, si bien que Bitsocial se passe de consensus,
de gas et de staking. Voir [Protocole peer-to-peer](/peer-to-peer-protocol/) pour ce raisonnement.

## Ce qu'ils ont en commun

- **Quelqu'un paie pour chaque écriture.** Lens facture du gas, que les applications peuvent prendre
  en charge ; DeSo prélève des frais sur chaque action ; Steem rationne les actions en fonction des
  jetons mis en staking.
- **La chaîne impose la même politique anti-spam à tous.** Les frais, le stake et le coût des
  comptes s'appliquent à tout le réseau au lieu d'être choisis par chaque communauté.
- **Les enregistrements onchain sont permanents.** Les applications peuvent masquer du contenu, mais
  pas le retirer de la chaîne.
- **Les navigateurs sont des clients d'API.** Les applications web signent des transactions et
  lisent les données via un nœud, un indexeur ou une API exploités par quelqu'un d'autre.

## Lens

[Lens](https://lens.xyz/) fonctionne sur Lens Chain, une couche 2 d'Ethereum construite avec la ZK
Stack de ZKsync, qui utilise Avail pour la disponibilité des données. Mask Network
[assure l'intendance de Lens depuis janvier 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Sur la chaîne :** les comptes sont des smart contracts, les noms d'utilisateur sont des NFT au
  sein d'espaces de noms, et les graphes, les groupes, les fils et leurs règles sont eux aussi des
  contrats.
- **Hors chaîne :** le texte et les médias d'une publication se trouvent dans un fichier JSON
  accessible par une URI, généralement sur Grove, le service de stockage de Lens placé devant IPFS.
  Les réactions et les favoris sont conservés par l'API Lens, et les applications lisent les données
  via cette API.
- **Spam et filtres d'accès :** les transactions exigent du gas en GHO, que les applications peuvent
  prendre en charge en appliquant des limites de débit. Les règles des fils et des groupes peuvent
  exiger la détention de jetons ou des paiements.
- **Fonctionnement de la chaîne :** [L2BEAT](https://l2beat.com/scaling/projects/lens) classe Lens
  Chain comme un validium de Stage 0 doté d'un opérateur centralisé qui peut refuser d'inclure des
  transactions.

## DeSo

[DeSo](https://docs.deso.org/) est une blockchain de couche 1 conçue pour les applications sociales.
Elle est passée de la preuve de travail à la preuve d'enjeu en juillet 2024.

- **Sur la chaîne :** les profils, les publications, les mentions « J'aime », les abonnements et les
  messages privés sont tous des transactions stockées par chaque nœud complet. Les images et les
  vidéos sont hébergées hors chaîne ; le nœud de référence utilise Google Cloud Storage et
  Cloudflare Stream.
- **Spam :** chaque action est soumise à des frais en DESO. Les nouveaux utilisateurs reçoivent
  généralement des DESO de départ de la part d'un nœud après une vérification par téléphone.
- **Modération :** chaque nœud décide de ce qu'il affiche en plaçant des contenus sur liste noire ou
  sur liste grise, mais
  [le contenu reste onchain](https://docs.deso.org/deso-blockchain/content-moderation).
- **Communautés :** la documentation ne décrit aucune primitive de communauté ou de forum ; une « communauté »
  est un fil qu'une application organise.
- **Faire tourner un nœud :** les validateurs ont besoin d'au moins 32 Go de RAM et de 200 Go de
  disque, selon le [guide des validateurs](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) est une blockchain sociale qui rémunère les auteurs et les curateurs en
jetons, avec [Steemit](https://steemit.com/) comme principale application de blog. Hive s'est séparé
de Steem en 2020 ; selon le [livre blanc de Hive](https://hive.io/whitepaper.pdf), ce fork a suivi
la vente de Steemit Inc. à Justin Sun.

- **Sur la chaîne :** les publications textuelles, les commentaires, les votes et leur historique de
  modifications, ordonnés par 21 témoins élus qui produisent un bloc toutes les trois secondes. Les
  images sont hébergées hors chaîne.
- **Spam :** les actions consomment des Resource Credits, qui augmentent avec le STEEM mis en
  staking. La création d'un compte coûte du STEEM ; Steemit la paie pour les utilisateurs qui
  vérifient une adresse e-mail et un numéro de téléphone.
- **Communautés :** ce sont des
  [opérations personnalisées interprétées par un indexeur](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  en dehors du consensus. Les modérateurs peuvent masquer des publications, ce qui les cache dans
  les applications mais les laisse onchain.
- **Récompenses :** l'inflation finance les récompenses, et des votes pondérés par le stake décident
  de leur répartition, si bien que les gros détenteurs déterminent ce qui attire l'attention.

## Comparaison

| Question                 | Lens                                                                                    | DeSo                                                                              | Steem                                                                                       | Bitsocial                                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Chaîne                   | Couche 2 d'Ethereum (validium ZK Stack)                                                 | Couche 1 propre, preuve d'enjeu                                                   | Chaîne propre, preuve d'enjeu déléguée                                                      | Aucune                                                                                                       |
| Contenu des publications | JSON hors chaîne, généralement sur Grove                                                | Texte onchain ; médias hors chaîne                                                | Texte onchain ; images hors chaîne                                                          | Sur le nœud du propriétaire de la communauté et chez les pairs qui la lisent et la partagent                 |
| Identité                 | Compte smart contract ; noms d'utilisateur en NFT                                       | Paire de clés avec un profil onchain                                              | Compte nommé sur la chaîne, avec des clés hiérarchisées                                     | Paires de clés Ed25519 pour les utilisateurs et les communautés                                              |
| Communautés              | Groupes et fils sous forme de contrats dotés de règles                                  | Aucune primitive de communauté                                                    | Communautés interprétées par un indexeur, hors consensus                                    | Objets de premier ordre dont le nœud accepte ou rejette les publications                                     |
| Lutte contre le spam     | Gas (souvent pris en charge), règles de jetons ou de paiement                           | Frais sur chaque action ; fonds de départ après vérification par téléphone        | Resource Credits issus du stake ; création de compte payante                                | Le défi de chaque communauté, avant qu'une publication soit acceptée                                         |
| Modération               | Administrateurs de groupe, règles onchain, masquage au niveau de l'API                  | Chaque nœud filtre ce qu'il affiche                                               | Masquages par la communauté, votes négatifs pondérés par le stake, filtres des applications | Les propriétaires modèrent leur communauté ; les applications choisissent ce qu'elles affichent              |
| Exploitation             | Opérateur de la chaîne, plus l'API Lens et Grove                                        | Validateurs dotés d'au moins 32 Go de RAM                                         | Témoins élus, plus des nœuds d'API et d'indexation                                          | Un nœud de communauté sur du matériel grand public, plus des seeders auxiliaires                             |
| Compromis principal      | Règles onchain programmables, mais le contenu et la lecture dépendent des services Lens | Réservoir de données ouvert, mais chaque action coûte des frais et reste à jamais | Récompenses intégrées, mais le stake façonne la visibilité et la gouvernance                | Ni frais ni stake, mais pas d'ordre global et aucune garantie de conservation indéfinie des anciens contenus |
