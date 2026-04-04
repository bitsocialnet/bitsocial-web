---
title: Voucher Challenge
description: Anti-spam-udfordring, der lukker udgivelsen bag unikke kuponkoder distribueret af fællesskabsejere.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge er en anti-spam-mekanisme, der lukker indholdsudgivelse bag unikke voucher-koder. I stedet for at stole på automatisk registrering, flytter den tillid til fællesskabsejeren, som manuelt distribuerer koder til personer, de har tillid til.

**Kildekode:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Hvordan det virker

1. En fællesskabsejer genererer en eller flere unikke værdikuponkoder.
2. Ejeren distribuerer disse koder til betroede forfattere gennem en kanal efter eget valg (direkte besked, e-mail, personligt osv.).
3. Når en forfatter forsøger at publicere, beder udfordringssystemet dem om en kuponkode.
4. Koden er valideret -- hvis den er ægte og ikke allerede er blevet brugt, accepteres publikationen.

Hver kuponkode er knyttet til en bestemt forfatter, når den er indløst, hvilket forhindrer genbrug af andre.

## Hvornår skal man bruge det

Voucher Challenge er bedst egnet til:

- **Kun for invitationer**, hvor medlemskab er bevidst begrænset.
- **Udvalgte rum** hvor ejeren personligt kontrollerer hver deltager.
- **Miljøer med høj tillid**, hvor automatiseret spam-scoring er unødvendig eller uønsket.

Fordi det kræver manuel kodedistribution, skalerer det ikke til store åbne fællesskaber. For disse scenarier skal du overveje [Spam Blocker](./spam-blocker.md) eller [EVM Contract Call Challenge](./evm-contract-call.md) i stedet.

## Integration

Voucher Challenge tilsluttes den samme udfordringsgrænseflade, som bruges af andre anti-spam-pakker i Bitsocial-økosystemet. Fællesskabsejere aktiverer det gennem deres fællesskabsindstillinger, og udfordringen præsenteres automatisk for forfattere, når de forsøger at skrive.
