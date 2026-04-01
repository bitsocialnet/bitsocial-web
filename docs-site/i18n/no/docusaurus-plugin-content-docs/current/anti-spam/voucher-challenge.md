---
title: Voucher Challenge
description: Antispam-utfordring som blokkerer publisering bak unike kupongkoder distribuert av fellesskapseiere.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge er en anti-spam-mekanisme som blokkerer innholdspublisering bak unike kupongkoder. I stedet for å stole på automatisk gjenkjenning, flytter den tilliten til fellesskapseieren, som manuelt distribuerer koder til folk de stoler på.

**Kildekode:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Hvordan det fungerer

1. En fellesskapseier genererer en eller flere unike kupongkoder.
2. Eieren distribuerer disse kodene til pålitelige forfattere gjennom en kanal etter eget valg (direktemelding, e-post, personlig, osv.).
3. Når en forfatter prøver å publisere, ber utfordringssystemet dem om en kupongkode.
4. Koden er validert -- hvis den er ekte og ikke allerede er brukt, aksepteres publikasjonen.

Hver kupongkode er knyttet til en spesifikk forfatter når den er innløst, og forhindrer gjenbruk av andre.

## Når du skal bruke den

Voucher Challenge er best egnet for:

- **Grupper kun for invitasjoner** der medlemskap er med vilje begrenset.
- **Kuraterte rom** hvor eieren personlig veterinærer hver deltaker.
- **Høy-tillit miljøer** der automatisert spam scoring er unødvendig eller uønsket.

Fordi det krever manuell kodedistribusjon, skalerer det ikke til store åpne fellesskap. For disse scenariene bør du vurdere [Spamblokkering](./spam-blocker.md) eller [EVM Contract Call Challenge](./evm-contract-call.md) i stedet.

## Integrering

Voucher Challenge kobles til det samme utfordringsgrensesnittet som brukes av andre anti-spam-pakker i Bitsocial-økosystemet. Fellesskapseiere aktiverer det gjennom fellesskapsinnstillingene sine, og utfordringen blir presentert for forfattere automatisk når de prøver å legge ut innlegg.
