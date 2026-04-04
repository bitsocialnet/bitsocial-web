---
title: Voucher Challenge
description: Anti-spam kihívás, amely a közösségi tulajdonosok által terjesztett egyedi kuponkódok mögé zárja a közzétételt.
sidebar_position: 3
---

# Voucher Challenge

A Voucher Challenge egy spamellenes mechanizmus, amely egyedi utalványkódok mögé zárja a tartalom közzétételét. Ahelyett, hogy az automatizált észlelésre hagyatkozna, a közösség tulajdonosára helyezi a bizalmat, aki manuálisan osztja ki a kódokat azoknak, akikben megbíznak.

**Forráskód:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Hogyan működik

1. A közösség tulajdonosa egy vagy több egyedi utalványkódot generál.
2. A tulajdonos ezeket a kódokat egy általuk választott csatornán (közvetlen üzenet, e-mail, személyes stb.) továbbítja a megbízható szerzőknek.
3. Amikor egy szerző megpróbálja közzétenni, a kihívásrendszer egy utalványkódot kér tőle.
4. A kód érvényesítése megtörténik -- ha eredeti és még nem használták, a közzétételt elfogadjuk.

Minden utalványkód egy adott szerzőhöz van kötve, miután beváltották, így megakadályozza, hogy mások újra felhasználják.

## Mikor kell használni

A Voucher Challenge a legalkalmasabb:

- **Meghívásos közösségek**, ahol a tagságot szándékosan korlátozzák.
- **Kurált terek**, ahol a tulajdonos minden résztvevőt személyesen vet meg.
- **Magas megbízhatóságú környezetek**, ahol szükségtelen vagy nem kívánatos az automatikus spamértékelés.

Mivel kézi kódelosztást igényel, nem skálázódik nagy nyílt közösségekre. Ezekben a forgatókönyvekben vegye fontolóra a [Spam Blocker](./spam-blocker.md) vagy az [EVM Contract Call Challenge](./evm-contract-call.md) lehetőséget.

## Integráció

A Voucher Challenge ugyanahhoz a kihívás-interfészhez csatlakozik, amelyet a Bitsocial ökoszisztéma többi anti-spam csomagja is használ. A közösségtulajdonosok engedélyezik ezt a közösségi beállításaikon keresztül, és a kihívás automatikusan megjelenik a szerzők számára, amikor megpróbálnak közzétenni.
