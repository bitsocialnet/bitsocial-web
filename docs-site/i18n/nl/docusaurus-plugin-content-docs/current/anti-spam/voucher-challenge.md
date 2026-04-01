---
title: Voucher-uitdaging
description: Anti-spam-uitdaging die publicatie achter de unieke vouchercodes houdt die worden verspreid door community-eigenaren.
sidebar_position: 3
---

# Voucher-uitdaging

Voucher Challenge is een antispammechanisme dat de publicatie van inhoud achter unieke vouchercodes achterlaat. In plaats van te vertrouwen op geautomatiseerde detectie, verschuift het vertrouwen naar de community-eigenaar, die handmatig codes distribueert naar mensen die zij vertrouwen.

**Broncode:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Hoe het werkt

1. Een community-eigenaar genereert een of meer unieke vouchercodes.
2. De eigenaar distribueert deze codes naar vertrouwde auteurs via een kanaal naar keuze (direct bericht, e-mail, persoonlijk, enz.).
3. Wanneer een auteur probeert te publiceren, vraagt het uitdagingssysteem hem om een vouchercode.
4. De code wordt gevalideerd - als deze echt is en nog niet is gebruikt, wordt de publicatie geaccepteerd.

Elke vouchercode is gekoppeld aan een specifieke auteur zodra deze is ingewisseld, waardoor hergebruik door anderen wordt voorkomen.

## Wanneer moet u het gebruiken

Voucher Challenge is het meest geschikt voor:

- **Community's die alleen op uitnodiging toegankelijk zijn** waar het lidmaatschap opzettelijk is beperkt.
- **Gecontroleerde ruimtes** waar de eigenaar elke deelnemer persoonlijk controleert.
- **Omgevingen met een hoog vertrouwensgehalte** waar geautomatiseerde spamscores niet nodig of onwenselijk zijn.

Omdat het handmatige distributie van code vereist, is het niet schaalbaar naar grote open communities [Spam blokkeren](./spam-blocker.md) of [EVM Contract Call Challenge](./evm-contract-call.md) in plaats daarvan.

## Integratie

Voucher Challenge sluit aan op dezelfde uitdagingsinterface die wordt gebruikt door andere anti-spampakketten in het Bitsocial Community-eigenaren, schakelt deze in via hun community-instellingen, en de uitdaging wordt automatisch aan auteurs gepresenteerd wanneer ze proberen te posten.
