---
title: Historique du token BSO
description: L'historique complet des générations du token BSO, de son origine sur Avalanche en 2021 au contrat Ethereum actuel, immuable et sans administrateur.
---

# Historique du token BSO

BSO est une monnaie de provenance. Le protocole qui fait tourner Bitsocial est ouvert, et le token
comme la chaîne sont optionnels par conception : n'importe qui peut forker le code, faire tourner
son propre client ou bâtir sa propre économie par-dessus. Ce que l'on ne peut pas forker, c'est la
provenance. BSO est le token officiel de Bitsocial depuis le premier jour, et chaque migration
survenue depuis est vérifiable on-chain.

Cette page liste chaque génération du token, dans l'ordre, avec les adresses de contrat complètes,
afin que chacun puisse contrôler ces informations de façon indépendante.

## Gen 1 : l'origine, Avalanche, 2021

- **Chaîne** : Avalanche
- **Année** : 2021
- **Adresse** : `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorateur** : [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

C'est là que BSO a commencé. L'offre a été distribuée au moyen de trois airdrops et de récompenses
de minage de liquidité, sans prévente ni allocation réservée à l'équipe avant la
communauté. Le contrat était un proxy évolutif, ce qui
correspondait à la pratique courante de l'époque et permettait à l'équipe de livrer des correctifs
pendant les premiers temps du token.

## Gen 2 : le passage à Ethereum, 2024

- **Chaîne** : Ethereum
- **Année** : 2024
- **Adresse** : `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorateur** : [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

La Gen 2 a fait passer BSO d'Avalanche à Ethereum, où se construit le reste de la feuille de route
de Bitsocial Chain. Comme la Gen 1, ce contrat restait un proxy évolutif, conservé une génération de
plus pendant que le contrat définitif et permanent était préparé.

## Gen 3 : entièrement immuable, 2025

- **Chaîne** : Ethereum
- **Année** : 2025
- **Adresse** : `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorateur** : [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

La Gen 3 est le contrat BSO actuel et définitif. Il est entièrement immuable et sans administrateur :

- aucune fonction d'émission, donc l'offre ne peut pas être gonflée
- aucune adresse propriétaire, donc personne ne peut modifier unilatéralement le comportement du contrat
- aucune fonction de pause, donc les transferts ne peuvent pas être gelés
- aucun schéma de proxy, donc la logique elle-même ne peut pas être remplacée plus tard

C'est l'état final vers lequel tendaient les deux premières générations : un token dont il ne reste
plus aucune clé d'administration à détenir.

## Comment les migrations se sont déroulées

Chaque migration, de la Gen 1 vers la Gen 2 puis de la Gen 2 vers la Gen 3, a pris la forme d'un
airdrop passif au taux de 1:1. Les détenteurs n'avaient aucune demande à déposer, aucun message à
signer, aucune action à effectuer. Les soldes de l'ancien contrat ont été lus directement et
recopiés à l'identique sur le nouveau contrat, de sorte que la position de chaque détenteur a été
préservée exactement au fil de la migration.

Comme l'ancien et le nouveau contrat restent publics et on-chain, chaque étape de ce processus est
vérifiable de façon indépendante. N'importe qui peut comparer les instantanés historiques de
détenteurs de la Gen 1 ou de la Gen 2 aux soldes actuels de la Gen 3 et confirmer que la migration a
bien fait ce qu'elle annonçait. Aucune partie de cet historique ne repose sur la parole de
Bitsocial.

## Vérifiez tout

Ne prenez rien de tout cela pour argent comptant. Consultez directement les registres :

- la Gen 1 sur [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- la Gen 2 sur [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- la Gen 3 sur [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- le site actuel de la chaîne, [chain.bitsocial.net](https://chain.bitsocial.net)

Si une adresse ne correspond pas à celles listées ici, il ne s'agit pas du token BSO officiel.
