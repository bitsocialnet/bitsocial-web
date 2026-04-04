---
title: Voucher Challenge
description: Défi anti-spam qui bloque la publication derrière des codes de réduction uniques distribués par les propriétaires de la communauté.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge est un mécanisme anti-spam qui bloque la publication de contenu derrière des codes de réduction uniques. Plutôt que de s'appuyer sur une détection automatisée, la confiance est transférée au propriétaire de la communauté, qui distribue manuellement les codes aux personnes en qui ils ont confiance.

**Code source :** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Comment ça marche

1. Un propriétaire de communauté génère un ou plusieurs codes de réduction uniques.
2. Le propriétaire distribue ces codes aux auteurs de confiance via le canal de leur choix (message direct, e-mail, en personne, etc.).
3. Lorsqu'un auteur tente de publier, le système de défi lui demande un code de bon d'achat.
4. Le code est validé : s'il est authentique et n'a pas déjà été utilisé, la publication est acceptée.

Chaque code promotionnel est lié à un auteur spécifique une fois utilisé, empêchant ainsi sa réutilisation par d'autres.

## Quand l'utiliser

Voucher Challenge est le mieux adapté pour :

- **Communautés sur invitation uniquement** où l'adhésion est intentionnellement restreinte.
- **Espaces organisés** où le propriétaire examine personnellement chaque participant.
- **Environnements à haut niveau de confiance** dans lesquels la notation automatisée du spam est inutile ou indésirable.

Parce qu’il nécessite une distribution manuelle du code, il ne s’adapte pas aux grandes communautés ouvertes. Pour ces scénarios, envisagez plutôt [Spam Blocker](./spam-blocker.md) ou [EVM Contract Call Challenge](./evm-contract-call.md).

## Intégration

Voucher Challenge se connecte à la même interface de défi utilisée par d'autres packages anti-spam de l'écosystème Bitsocial. Les propriétaires de communauté l'activent via leurs paramètres de communauté, et le défi est automatiquement présenté aux auteurs lorsqu'ils tentent de publier.
