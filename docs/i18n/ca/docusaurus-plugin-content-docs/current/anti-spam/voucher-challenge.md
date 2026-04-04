---
title: Voucher Challenge
description: Repte anti-spam que limita la publicació darrere de codis de val únics distribuïts pels propietaris de la comunitat.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge és un mecanisme anti-spam que limita la publicació de contingut darrere de codis de val únics. En lloc de confiar en la detecció automatitzada, canvia la confiança al propietari de la comunitat, que distribueix manualment els codis a les persones en què confien.

**Codi font:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Com funciona

1. El propietari d'una comunitat genera un o més codis de val únics.
2. El propietari distribueix aquests codis als autors de confiança a través d'un canal de la seva elecció (missatge directe, correu electrònic, en persona, etc.).
3. Quan un autor intenta publicar, el sistema de desafiament li demana un codi de val.
4. El codi està validat; si és genuí i encara no s'ha utilitzat, s'accepta la publicació.

Cada codi de val està lligat a un autor específic un cop bescanviat, evitant la reutilització per part d'altres.

## Quan utilitzar-lo

Voucher Challenge és el més adequat per a:

- **Comunitats només amb invitació** on la pertinença està restringida intencionadament.
- **Espais curats** on el propietari supervisa personalment cada participant.
- **Entorns d'alta confiança** on la puntuació automàtica de correu brossa és innecessària o no desitjable.

Com que requereix una distribució manual de codi, no s'escala a grans comunitats obertes. Per a aquests escenaris, considereu [Spam Blocker](./spam-blocker.md) o [EVM Contract Call Challenge](./evm-contract-call.md).

## Integració

Voucher Challenge es connecta a la mateixa interfície de desafiament que utilitzen altres paquets anti-spam de l'ecosistema Bitsocial. Els propietaris de la comunitat ho permeten a través de la configuració de la seva comunitat i el repte es presenta automàticament als autors quan intenten publicar.
