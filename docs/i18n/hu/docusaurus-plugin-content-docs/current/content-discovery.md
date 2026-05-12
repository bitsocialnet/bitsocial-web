---
title: Tartalom felfedezése
description: Hogyan választja el a Bitsocial a társfelderítést az alkalmazásszintű kezeléstől.
---

# Tartalom felfedezése

A Bitsocial nem helyez egyetlen globális hírfolyamot, keresési indexet vagy rangsoroló algoritmust a protokollba. A tartalomfelderítést két rétegre osztja:

1. A **Hálózatkeresés** megkeresi azokat a társakat, amelyek jelenleg egy ismert közösséget szolgálnak ki.
2. Az **Alkalmazások kezelése** dönti el, hogy egy termék mely közösségeket, táblákat, listákat vagy bejegyzéseket jelenítse meg először.

Ez kicsiben tartja a protokollt, miközben teret hagy számos felfedezési élmény számára, hogy versenghessenek.

## Hálózati keresés

Minden közösség rendelkezik egy stabil címmel, amely a nyilvános kulcsából származik. Ha egy ügyfél már ismeri ezt a címet, lekérdezi a könnyű HTTP-útválasztókat, hogy megtalálja azokat a társakat, amelyek szolgáltatóként jelentették be magukat.

Az útválasztók csak szolgáltatói társcímeket adnak vissza. Nem tárolnak bejegyzéseket, metaadatokat, felhasználói listákat vagy a közösségek ember által olvasható könyvtárát. Miután az ügyfél megkapta a társcímeket, csatlakozik azokhoz, és lekéri a legújabb közösségi metaadatokat, valamint a tartalommutatókat, majd lekéri a tényleges bejegyzési adatokat hash segítségével.

Ez megválaszolja a protokoll kérdését: "Hol szerezhetem le a közösség legfrissebb állapotát?"

## Alkalmazások kezelése

A külön termékkérdés a következő: "Mely közösségeket kell először látnia a felhasználónak?"

A Bitsocial ezt az alkalmazásokra, listákra és felhasználókra hagyja, ahelyett, hogy egyetlen választ adna be a hálózatba. Példák:

- egy kliens, amely a felhasználó által már követett közösségeket mutatja
- egy válogatott alapértelmezett lista egy Reddit-stílusú alkalmazáshoz
- könyvtárhelyek egy imageboard stílusú alkalmazáshoz
- egy adott alkalmazás által karbantartott keresési vagy rangsorolási indexek
- a felhasználók által megosztott közvetlen linkek

Az alkalmazások indexelhetnek, rangsorolhatnak, szűrhetnek vagy kiemelhetnek különböző dolgokat anélkül, hogy azokat protokolltörvényekké alakítanák. Ha az egyik alkalmazás felfedezési felülete nem hasznos, egy másik alkalmazás létrehozhat egy másikat ugyanazon mögöttes közösségeken.

## Jelenlegi alkalmazások

Az 5chan jelenleg ismert könyvtárútvonalakat használ, például a `/b/` vagy a `/g/`. A címtár-hozzárendeléseket ma nyilvános listán keresztül kezelik, a jövőbeli verziók pedig várhatóan támogatják az alkalmazáson belüli táblák létrehozását és a címtárhelyekre való szavazást.

A Seedit az alapértelmezett közösségi listákat használja a címlapon. A közösségek továbbra is létrehozhatók és megoszthatók az alapértelmezett listán kívül.

Mindkét esetben az alkalmazásszintű lista segít a felhasználóknak megtalálni a megnyitandó tartalmakat, a protokollszintű keresés pedig feloldja a kiválasztott közösséget a társaknak.

## Miért számít ez a felosztás

Egyetlen decentralizált hálózatnak még jó felderítésre van szüksége, de a felfedezési rétegnek cserélhetőnek kell lennie. A Bitsocial alapprotokollja a címezhetőségre, a társkeresésre, a közzétételre és a levélszemét elleni küzdelemre összpontosít. A kurátorság e réteg felett található, ahol az alkalmazások kísérletezhetnek könyvtárakkal, alapértelmezett listákkal, hírcsatornákkal, keresési, szavazási és moderálási házirendekkel anélkül, hogy a hálózatra kiterjedő migrációt igényelnének.
