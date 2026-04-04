---
title: Voucher Challenge
description: Provocare anti-spam care împiedică publicarea în spatele codurilor de voucher unice distribuite de proprietarii comunității.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge este un mecanism anti-spam care blochează publicarea conținutului în spatele codurilor voucher unice. În loc să se bazeze pe detectarea automată, transferă încrederea către proprietarul comunității, care distribuie manual coduri persoanelor în care au încredere.

**Cod sursă:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Cum funcționează

1. Un proprietar de comunitate generează unul sau mai multe coduri unice de voucher.
2. Proprietarul distribuie acele coduri către autorii de încredere printr-un canal la alegerea lor (mesaj direct, e-mail, în persoană etc.).
3. Când un autor încearcă să publice, sistemul de provocare îi solicită un cod voucher.
4. Codul este validat -- dacă este autentic și nu a fost deja folosit, publicația este acceptată.

Fiecare cod voucher este legat de un anumit autor odată valorificat, prevenind reutilizarea de către alții.

## Când să-l utilizați

Voucher Challenge este cel mai potrivit pentru:

- **Comunități numai cu invitații** la care calitatea de membru este restricționată intenționat.
- **Spații amenajate** în care proprietarul verifică personal fiecare participant.
- **Medii de mare încredere** în care scorarea automată a spamului este inutilă sau nedorită.

Deoarece necesită distribuirea manuală a codului, nu se extinde la comunități mari deschise. Pentru aceste scenarii, luați în considerare [Spam Blocker](./spam-blocker.md) sau [EVM Contract Call Challenge](./evm-contract-call.md).

## Integrare

Voucher Challenge se conectează la aceeași interfață de provocare folosită de alte pachete anti-spam din ecosistemul Bitsocial. Proprietarii comunității îl activează prin setările comunității lor, iar provocarea este prezentată automat autorilor atunci când încearcă să posteze.
