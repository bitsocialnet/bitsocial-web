---
title: Hol élnek a bejegyzések, és meddig maradnak meg
description: Miért vannak a Bitsocial-bejegyzések aláírva és tartalom szerint címezve, miért nem tárolja őket örökké minden csomópont, ki tartja őket online, és hogyan őrzik meg az archiválók a régi tartalmak olvashatóságát.
---

# Hol élnek a bejegyzések, és meddig maradnak meg

A Bitsocial nem tárol minden bejegyzést blokkláncon vagy vállalati adatbázisban. Minden közösség saját
csomópontja őrzi a bejegyzéseit, az olvasók és a seederek segítenek kiszolgálni őket, és aki tartós
nyilvántartást szeretne, megtarthat egyet. A bejegyzések örök megőrzése **választható, nem kötelező**:
a protokoll nem kényszeríti minden résztvevőre, hogy a teljes hálózat történetét tárolja.

Ez az oldal elmagyarázza, hogy ez mit jelent a gyakorlatban, mert a „nem tárolják örökké” kifejezést
könnyű úgy félreérteni, hogy „eltűnik” vagy „bízz bennem”.

## A hitelesség és az elérhetőség külön kérdés

Egy bejegyzéssel kapcsolatban két különböző kérdés van:

1. **Valódi?** Ez a szerző írta, és elfogadta ez a közösség?
2. **Még online van?** Le tudja kérni valaki ma?

A Bitsocial az első kérdésre kriptográfiával, nem bizalommal válaszol. Minden bejegyzést a szerző
kulcspárja ír alá, és miután egy közösség elfogadja, a bejegyzés egy tartalomazonosító (CID) alatt,
pontos bájtjainak hash-eként tárolódik. Bárki, aki lekér egy bejegyzést, maga ellenőrizheti az
aláírást és a hash-t. Egy csomópont, útválasztó, átjáró vagy archívum nem módosíthatja egy bejegyzés
szövegét, és nem hamisíthat bejegyzést valaki más nevében anélkül, hogy az ellenőrzés sikertelen ne
lenne.

A második kérdés arról szól, ki őriz meg egy másolatot, és ez az egyetlen rész, amely nem garantált.

## Ki tartja online a bejegyzéseket

- **A közösség csomópontja.** A tulajdonos csomópontja fogadja a bejegyzéseket, és addig őrzi őket az
  adatbázisában, amíg a közösség megtartja őket. Ez az az egy példány, amely mindig létezik, amíg a
  közösség működik. Lásd: [Peer-to-peer protokoll](/peer-to-peer-protocol/).
- **Olvasók.** Az asztali alkalmazások, például a 5chan Electron alkalmazás futás közben seedelik a
  betöltött közösségeket, így a népszerű közösségeket sok társ szolgálja ki, ugyanúgy, mint a népszerű
  torrenteket. Egy böngészőlap nyitva tartása közben gyorsítótárazhatja és ellenőrizheti a tartalmat,
  de nem hosszú életű gazda.
- **Seedelők.** A [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) lehetővé
  teszi, hogy bárki állandó kapacitást adjon egy VPS-ről vagy egy tartalék gépről. Rögzíti a
  közösségek legfrissebb oldalait és bejegyzésfrissítéseit, ami azt is lehetővé teszi, hogy az otthoni
  útválasztók mögött üzemeltetett közösségek betölthetők legyenek böngészőből.
- **Archiválók.** Bárki feltérképezheti a közösségeket, és megtarthat mindent, amit lát. Az
  archívumok a hálózat tetejére épített közönséges szolgáltatások, nem a protokoll különleges szerepei.

## A közösségek saját megőrzési időt választanak

A közösség tulajdonosa dönt arról, meddig tartja meg a régi bejegyzéseket, nem egy protokollszabály.
Egyes közösségek több éves előzményt szeretnének. Másokat felejtésre terveztek: a 5chan táblák úgy
működnek, mint egy imageboard, ahol a szálak leesnek a tábláról, archívumba kerülnek, majd meghatározott
idő (alapértelmezés szerint 48 óra) után törlődnek a tábla csomópontjáról. Egy közösség az archívumot
is teljesen kihagyhatja.

Ugyanaz a protokoll mindkettőt támogatja, mert a megőrzés minden közösség által beállított szabályzat,
nem költség, amelyet minden csomópontnak meg kell fizetnie.

## Miért nem tárolunk mindent örökre?

Egy hálózatnak, amely minden csomóponttól megköveteli, hogy minden bejegyzést örökre megőrizzen,
valahogyan meg kell fizetnie ezt:

- **A blokkláncok** minden teljes csomóponttal a teljes történetet tároltatják, így a
  csomópontkövetelmények minden tevékenységgel nőnek, a közzétételért pedig általában díjat kell fizetni.
- **A fizetős tárolás**, például a Farcaster tárolási bérlete, megfizetteti a felhasználókkal, hogy
  megtartsák előzményeiket, és eltávolítja a legrégebbi bejegyzéseket azon felül, amiért fizetnek.
  Lásd: [Bitsocial és Farcaster](/comparisons/farcaster/).
- **A központi szerverek** mindent megtartanak, de csak addig, amíg egy vállalat akarja, annak a
  vállalatnak a szabályai szerint.

A közösségi médiának nincs szüksége globális főkönyvre. Nem számít, hogy az A bejegyzést egy
milliszekundummal a B bejegyzés előtt fogadták-e el, és a legtöbb régi bejegyzést ritkán olvassák.
A Bitsocial lehetővé teszi, hogy minden közösségi csomópont csak a saját közösségeit tartsa, ami elég
olcsón tartja az üzemeltetést egy laptophoz, Raspberry Pi-hez vagy kis VPS-hez. Lásd:
[Miért nem blokklánc?](/peer-to-peer-protocol/#why-not-a-blockchain)

## A kompromisszum

Ha senki nem őriz meg egy bejegyzésről másolatot, az elérhetetlenné válhat. Egy bejegyzés CID-je
soha nem változik, de a CID csak cím: a tartalom csak addig marad lekérhető, amíg legalább egy
csomópont kiszolgálja. Ha egy közösség csomópontja végleg leáll, és sem olvasó, sem seeder, sem
archívum nem őrizte meg a bejegyzéseit, azok a bejegyzések elvesznek.

Ez annak az őszinte ára, hogy nem követelünk globális főkönyvet. Ugyanez az ár már minden nagy
platformon is létezik: régi bejegyzések tűnnek el róluk, amikor fiókok, szerverek vagy vállalatok
eltűnnek. A különbség az, hogy a Bitsocialon valami megőrzéséhez senki engedélyére nincs szükség.

## Ami számít, őrizd meg

- **Futtasd a közösségi csomópontot magad.** A közösség tulajdonosa, aki működésben tartja a
  csomópontot, megőrzi a közösség előzményeit addig, ameddig a közösség beállításai megtartják azokat.
- **Seedelj.** Egy asztali alkalmazás nyitva hagyása vagy a `bitsocial-seeder` futtatása elérhetővé
  teszi a közösségeket mások számára.
- **Archiválj.** A független archívumok olvashatóvá és kereshetővé teszik a régi szálakat, miután egy
  közösség elengedi őket. A [5archive.org](https://5archive.org) 5chan táblákat archivál, a
  [seeditarchive.org](https://seeditarchive.org) pedig Seedit közösségeket. Mindkettő nyílt forráskódú,
  így bárki üzemeltethet tükröt vagy versengő archívumot.

Mivel minden archivált bejegyzés továbbra is alá van írva, egy archívum nem írhatja át észrevétlenül,
amit valaki mondott: az olvasó ugyanúgy ellenőrizheti egy archivált bejegyzés aláírását, mint egy élőét.
