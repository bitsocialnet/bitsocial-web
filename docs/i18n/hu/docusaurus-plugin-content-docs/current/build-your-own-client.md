---
title: Építsen saját Bitsocial klienst
description: Fejlesztői útmutató önálló Bitsocial kliensek elkészítéséhez, az imageboardoktól és fórumoktól a réspiaci közösségi alkalmazásokig.
---

# Építsen saját Bitsocial klienst

A Bitsocial nem attól lesz sikeres, hogy minden felhasználási esethez van egy hivatalos alkalmazása.
Akkor válik erőssé, ha sok kliens osztozik ugyanazon a protokollon, miközben felületben, kultúrában,
felfedezésben, alapértelmezésekben és üzleti modellben verseng egymással.

Az 5chan és a Seedit korai bizonyíték, nem pedig felső határ. Bárkinek módjában kell álljon új
imageboardot, fórumot, profilklienst, elsősorban mobilra tervezett közösségi alkalmazást, réspiaci
közösségi eszközt vagy akár olyan központosított klienst is kiadni, amely a háttérben a Bitsocialt
használja – anélkül, hogy ehhez egy platform tulajdonosának engedélyét kellene kérnie.

## Min változtathatnak a fejlesztők

Egy Bitsocial kliens úgy versenyezhet termékdöntésekkel, hogy közben nem kell leforkolnia az egész
hálózatot:

- felület és vizuális nyelv
- beléptetési folyamat
- közösségi alapértelmezések
- moderációs felületek
- felfedezési modell
- médiaélmény
- mobil, asztali vagy alacsony sávszélességű korlátok
- bevételszerzés és üzleti modell

A közös réteg a protokoll. A termékréteg nyitva áll a verseny előtt.

## A leggyorsabb út a tanuláshoz

Kezdje a már létező alkalmazásokkal:

- Próbálja ki az [5chan](https://5chan.app) alkalmazást névtelen imageboard-közösségekhez.
- Próbálja ki a [Seedit](https://seedit.app) alkalmazást Reddit-stílusú beszélgetésekhez.
- Olvassa el a [Bitsocial React hookok](https://hooks.bitsocial.net/docs/quickstart/) dokumentációját a
  kliensoldali integrációhoz.
- Olvassa el a [Bitsocial CLI](/developer-tools/cli/) dokumentációját a csomópontok és közösségek
  üzemeltetéséhez.

Ha gyorsan szeretne haladni, először egy meglévő alkalmazáshoz járuljon hozzá. Ha az elképzelt
felület, kultúra vagy közösségi modell nem fér bele, építsen külön klienst.

## Válasszon szűk fókuszú első verziót

A legjobb első verzió nem univerzális közösségi alkalmazás, hanem olyan kliens, amelynek egyetlen
világos célközönsége és egyetlen erős létjogosultsága van.

Jó kiindulópontok:

- letisztultabb imageboard-kliens egyetlen konkrét kultúrához
- elsősorban mobilra tervezett fórumkliens
- egyetlen közösséget kiszolgáló alkalmazás szigorú alapértelmezésekkel
- alkotói közösségeknek szánt kliens
- csak olvasható felfedezőkliens
- moderációs vagy üzemeltetői konzol
- egy adott nyelvre, régióra vagy eszközosztályra optimalizált kliens

A kis kliensek azért hasznosak, mert a Bitsocialon ugyanabba a hálózatba nőhetnek bele, ahelyett hogy
a felhasználóikat egy privát adatbázisba zárnák.

## Megvalósítási utak

Három gyakorlati út létezik:

1. Forkoljon egy meglévő klienst, ha az ötlete közel áll az 5chan vagy a Seedit koncepciójához.
2. Építsen új React klienst a [Bitsocial React hookokkal](https://hooks.bitsocial.net/).
3. Építse meg a saját integrációját a csomópont-API-kra és a nyilvános RPC-infrastruktúrára.

A nyilvános RPC a harmadik utat teszi majd sokkal gyakorlatiasabbá. A felhasználó elindulhat egy
üzemeltetett, nem letétkezelő RPC-szolgáltatónál, majd később átállhat saját üzemeltetésre vagy egy
versenytárs szolgáltatóra.

## Tervezési elv

Építse meg azt a klienst, amelynek a közössége számára léteznie kellene, aztán hagyja, hogy a
kompatibilis kliensek nyilvánosan versenyezzenek egymással.
