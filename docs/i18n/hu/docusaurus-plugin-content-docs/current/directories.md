---
title: Címtárak
description: Hogyan teszik lehetővé a Bitsocial-alkalmazások, hogy a közösségek versenyezzenek egy témanévért, ahelyett hogy a név azé maradna, aki elsőként lefoglalta.
---

# Címtárak

A Redditen egy olyan név, mint az `r/opensource`, csak egyetlen közösséghez tartozhat, és aki irányítja, az meg is tartja. Ha a moderátorai olyan döntéseket hoznak, amelyek nem tetszenek a felhasználóknak, az egyetlen alternatíva az `r/opensource2` elindítása. Az új közösség nulla feliratkozóval indul, pedig az `r/opensource` feliratkozóinak többségét a nyílt forráskód érdekelte, nem az adott moderátori csapat.

A Bitsocial-alkalmazások ezt **címtárakkal** kerülik el. A címtár egy témanév, például `opensource`, amelyért a közösségek versenyeznek. A név rövid útvonala azt a közösséget nyitja meg, amelyik éppen az első helyen áll a rangsorban, így egy jobb közösség bárki engedélye nélkül átveheti a nevet.

## Hogyan működik

1. **A címtárkód egy témanév.** A Seedit olyan útvonalakat használ, mint a `/s/funny`. Az 5chan olyan imageboard-útvonalakat használ, mint a `/g/`.
2. **A közösségek jelöltként versenyeznek.** Minden címtárhoz tartozik a jelölt közösségek listája, mindegyik saját pontos címmel, például `funny-posting.bso`.
3. **A legmagasabbra rangsorolt jelölt nyeri az útvonalat.** A `/s/funny` megnyitása az aktuális győztest mutatja.
4. **A vereség semmit sem töröl.** Az a közösség, amelyik nem győztes, megtartja a címét, a bejegyzéseit és a feliratkozóit, és bárki továbbra is közvetlenül megnyithatja.

## A név bejárati ajtó, nem identitás

A címtárkód csupán felfedezési útvonal. Minden tartós dolog egy pontosan meghatározott közösségre mutat:

- A `/s/funny` útvonalon keresztül indított feliratkozás az aktuális győztes pontos címére szól. Magát a címtárkódot a rendszer soha nem tárolja feliratkozásként.
- A bejegyzéslinkek mindig a közösség pontos címét használják, így egy régi link nem kezdhet el egy másik közösségre mutatni, miután a győztes megváltozott.
- Amikor a győztes megváltozik, a Seedit érintetlenül hagyja a meglévő feliratkozásokat, és minden feliratkozót megkérdez, hogy átváltson-e az új győztesre, megtartsa-e mindkettőt, vagy maradjon-e a jelenlegi közösségnél. Az automatikus váltás címtáranként külön bekapcsolható beállítás, és minden automatikus váltáskor visszavonási lehetőséget kínáló értesítés jelenik meg.

Egy versengő közösség tehát senkitől sem veszi el a feliratkozásait. A nevet nyeri meg: az új látogatók hozzá érkeznek, a meglévő feliratkozók pedig egyetlen kattintással dönthetnek. Akik a régi közösséget kedvelték jobban, megtarthatják azt.

## Miért nem az kapja a nevet, aki előbb jön

- **Nincs névfoglalás.** Nem elég birtokolni egy jó nevet. A közösségnek továbbra is a legjobb jelöltnek kell maradnia rá.
- **Nincs adminisztrátor, aki neveket osztana ki.** Az adminisztrátori kiosztás újrateremtené azt a központi vétójogot, amelynek megszüntetésére a Bitsocial épült.
- **A versenytársaknak megmarad az út a közönséghez.** Egy rivális közösség ugyanazt a nevet célozza meg, ahelyett hogy egy rosszabb név alatt kezdené újra.
- **A kliensek egyetértenek abban, ki a győztes.** A Seedit determinisztikusan rangsorolja a jelölteket, így minden kliens, amely ugyanazt a véglegesített címtár-pillanatképet olvassa, ugyanazt a győztest mutatja. A Seedit nem cseréli le a győztest egy másik jelöltre csak azért, mert az egy felhasználó kapcsolatán átmenetileg nem érhető el.

## Hogyan választják ki ma a győzteseket

A jelölteket JSON-fájlokként teszik közzé a [bitsocialnet/lists](https://github.com/bitsocialnet/lists) tárolóban, címtáranként egy fájlban, és egy közösség a fájljához beküldött pull requesttel csatlakozik egy címtárhoz. Ez csak a kezdeti lépés. A cél az, hogy a győztesekről a pull requestek helyett szavazás döntsön.

- A **Seedit** egy címtár jelöltjeit először pontszám, majd a hozzáadásuk időpontja, végül cím szerint rangsorolja. Minden címtárfájl tartalmaz egy revíziószámot, és a jelöltjeit vagy a győztesét érintő bármilyen változás új revíziót tesz közzé.
- Az **5chan** címtáranként egy szavazási versenyt futtat a [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting) segítségével. A kliensek aláírt szavazólapokat cserélnek a libp2p gossipsub protokollon keresztül, és maguk számolják össze az eredményt, a szavazatokat egyetlen szerver sem számlálja. A szavazáshoz 5chan Pass szükséges, amely egy át nem ruházható token, és minden birtokosa egy szavazattal rendelkezik. Aki egy még nem listázott táblára szavaz, azzal jelöli azt. A versenyek jelenleg a Base Sepolia tesztneten futnak, és amíg nem kerülnek le a tesztnetről, az eredmények megjelennek, de nem változtatják meg a lista sorrendjét.

## Protokoll vagy alkalmazás?

A címtárak nem részei a PKC-nek, annak a peer-to-peer rétegnek, amely a közösségeket tárolja és továbbítja. A címtárak olyan konvenciót jelentenek, amelyet a kliensek e réteg felett alkalmaznak, az alapértelmezett listák és a keresés mellett; lásd: [Tartalom felfedezése](./content-discovery.md). Egy kliens olvashatja ugyanazokat a címtárfájlokat, közzéteheti a sajátjait, vagy teljesen kihagyhatja a címtárakat, a felhasználók pedig továbbra is bármelyik közösséget megnyithatják a címe alapján.
