---
title: Hozzon létre egy imageboard klienst
description: 1. fázisú hozzájárulási útmutató azoknak az építőknek, akik új imageboard-élményeket szeretnének átadni a Bitsocialnak.
sidebar_position: 1
---

# Hozzon létre egy imageboard klienst

Az 1. fázis nem egyetlen hivatalos alkalmazásról szól, amely lefedi az egész kategóriát. Az 5chan az első bizonyíték, de a tényleges cél egy széles képtábla-ökoszisztéma: több Bitsocial kliens különböző vizuális nyelvekkel, moderálási alapértékekkel, címtármodellekkel és célközösségekkel.

## Amire az 1. fázisnak szüksége van

- Ismerős 4chan-stílusú kliensek a mainstream beépítéshez
- Altchan által ihletett ügyfelek különböző kultúrákkal és táblacsomagokkal
- Mobil-első vagy alacsony sávszélességű ügyfelek
- Egyközösségi vagy niche-kliensek erős véleménynyilvánítással
- Jobb moderálás, média, beépítés vagy felfedezés, mint az első alkalmazás

## A segítség leggyorsabb módja

Ha a legrövidebb szállítási utat szeretné elérni, először járuljon hozzá közvetlenül az 5chanhoz:

- Fedezze fel az élő alkalmazást a [5chan.app] oldalon (https://5chan.app)
- Tekintse át a forrást a [github.com/bitsocialnet/5chan] oldalon (https://github.com/bitsocialnet/5chan)
- Csatlakozzon az építői csevegéshez a [t.me/fivechandev] címen (https://t.me/fivechandev)

## Készítse el saját ügyfelét

Ha az 5chan nem egyezik a kívánt közösséggel vagy felülettel, hozzon létre egy külön klienst. A kompatibilis Bitsocial kliensek megoszthatják ugyanazt a hálózatot anélkül, hogy ugyanazokat a termékekkel kapcsolatos döntéseket osztanák meg.

1. Ismerje meg a protokoll-kapcsolatos eszközöket:
   - [Bitsocial React horgok](../react-hooks/)
   - [Bitsocial CLI](../cli/)
2. Döntse el, hogy valójában milyen imageboardot készít.
Először válassza ki a tábla szerkezetét, az identitásfeltevéseket, a moderációs modellt, a felfedezési folyamatot és a vizuális nyelvet.
3. Válassza ki a projektnek megfelelő megvalósítási utat.
Fork 5chan, ha gyorsan szeretne mozogni egy ismerős imageboard alappal. Kezdje újra, ha a felhasználói felületnek vagy az interakciós modellnek gyökeresen eltérőnek kell lennie.
4. Szállítson egy keskeny első verziót.
Egyetlen ügyfél, aki jól szolgál egy valódi közösséget, értékesebb, mint egy homályos klón, amelynek célja, hogy mindenki elégedett legyen.
5. Tegye közzé az eredményt, és hagyja, hogy a közösségek teszteljék.
A Bitsocial javul, amikor a külső építők véleményes ügyfeleket szállítanak, akik versenyeznek a termékminőségben, ahelyett, hogy egy hivatalos alkalmazásra várnának, hogy mindent megtegyen.

## Tervezési elv

A Bitsocial nem nyer egy áldott ügyféllel. Akkor nyer, ha sok ügyfél képes egymás mellett élni, elágazni, specializálódni és kiszolgálni az első alkalmazás igényeit.
