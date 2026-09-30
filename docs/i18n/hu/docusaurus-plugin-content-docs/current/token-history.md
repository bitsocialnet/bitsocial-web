---
title: A BSO token története
description: A BSO token teljes generációtörténete a 2021-es Avalanche-eredettől a mai megváltoztathatatlan, adminisztrátor nélküli Ethereum-szerződésig.
---

# A BSO token története

A BSO olyan coin, amelynél az eredet számít. A Bitsocial mögötti protokoll nyílt, a token és a lánc
pedig tervezetten opcionális: bárki leforkolhatja a kódot, futtathat saját klienst, vagy építhet rá
saját gazdaságot. Amit viszont forkolással nem lehet elvenni, az a származás. A BSO az első naptól
kezdve a hivatalos Bitsocial token, és minden azóta lezajlott migráció ellenőrizhető a láncon.

Ez az oldal sorrendben felsorolja a token minden generációját, a teljes szerződéscímekkel együtt,
hogy bárki önállóan ellenőrizhesse a nyilvántartást.

## 1. generáció: az eredet, Avalanche, 2021

- **Lánc**: Avalanche
- **Év**: 2021
- **Cím**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Blokkböngésző**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Itt indult a BSO. A kínálatot három airdroppal és likviditásbányászati jutalmakkal osztották szét:
nem volt előértékesítés, és nem különítettek el a közösség elől csapatnak
szánt részt sem. A szerződés frissíthető proxy volt,
ami akkoriban bevett gyakorlatnak számított, és lehetővé tette a csapatnak, hogy a token korai
szakaszában javításokat adjon ki.

## 2. generáció: átállás Ethereumra, 2024

- **Lánc**: Ethereum
- **Év**: 2024
- **Cím**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Blokkböngésző**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

A 2. generáció az Avalanche hálózatról Ethereumra vitte át a BSO-t, ahol a Bitsocial Chain
útitervének többi része épül. Az 1. generációhoz hasonlóan ez a szerződés is frissíthető proxy volt,
amelyet még egy generáción át megtartottak, amíg a végleges, állandó szerződés elkészült.

## 3. generáció: teljesen megváltoztathatatlan, 2025

- **Lánc**: Ethereum
- **Év**: 2025
- **Cím**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Blokkböngésző**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

A 3. generáció a jelenlegi és egyben végleges BSO-szerződés. Teljesen megváltoztathatatlan és
adminisztrátor nélküli:

- nincs kibocsátó (mint) függvény, így a kínálatot nem lehet felhígítani
- nincs tulajdonosi cím, így senki nem módosíthatja egyoldalúan a szerződés működését
- nincs szüneteltető függvény, így az átutalásokat nem lehet befagyasztani
- nincs proxy minta, így magát a logikát sem lehet később lecserélni

Ez az a végállapot, amely felé az első két generáció épült: olyan token, amelyhez már nem tartoznak
adminisztrátori kulcsok.

## Hogyan zajlottak a migrációk

Mindkét migráció – az 1. generációról a 2.-ra, majd a 2.-ról a 3.-ra – passzív, 1:1 arányú airdrop
volt. A tulajdonosoknak nem kellett igénylést beadniuk, üzenetet aláírniuk, egyáltalán semmit sem
kellett tenniük. A régi szerződésen lévő egyenlegeket közvetlenül kiolvasták, és 1:1 arányban
tükrözték az új szerződésre, így minden tulajdonos pozíciója pontosan megmaradt a migráció során.

Mivel a régi és az új szerződés is nyilvános marad a láncon, a folyamat minden lépése függetlenül
ellenőrizhető. Bárki összevetheti az 1. vagy a 2. generációból származó korábbi tulajdonosi
pillanatfelvételeket a jelenlegi, 3. generációs egyenlegekkel, és meggyőződhet arról, hogy a migráció
valóban azt tette, amit állított magáról. Ennek a történetnek egyetlen része sem azon múlik, hogy
elhiszi-e a Bitsocial szavát.

## Ellenőrizzen mindent

Ne higgyen el ebből semmit puszta bizalomból. Nézze meg közvetlenül a nyilvántartást:

- az 1. generáció a [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9) oldalon
- a 2. generáció az [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f) oldalon
- a 3. generáció az [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A) oldalon
- a lánc jelenlegi weboldala: [chain.bitsocial.net](https://chain.bitsocial.net)

Ha egy cím nem egyezik az itt felsoroltakkal, akkor az nem a hivatalos BSO token.
