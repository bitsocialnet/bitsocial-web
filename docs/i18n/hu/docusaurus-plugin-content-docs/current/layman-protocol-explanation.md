---
title: A Bitsocial protokoll teljes laikus magyarázata
description: Egyszerű angol áttekintés a Bitsocial közösségekről, a társkeresésről, a közzétételről, a spam elleni kihívásokról, a moderálásról és az alkalmazásokról.
---

# A Bitsocial protokoll teljes laikus magyarázata

Ez az oldal anélkül magyarázza el a Bitsocialt, hogy feltételezné, hogy már érti a peer-to-peer hálózatokat, a kriptográfiai kulcsokat, az IPFS-t vagy a pubsub-ot.

Néhány részlet szándékosan egyszerűsített. A technikaibb verzióért olvassa el a [Peer-to-Peer Protokoll](./peer-to-peer-protocol.md) oldalt.

## A rövid változat

A Bitsocial egy olyan közösségi alkalmazások protokollja, ahol a közösségek kulcsok birtokában vannak, nem pedig egy vállalati adatbázisé.

Egy Bitsocial közösségnek van címe. Az alkalmazások ezt a címet használják arra, hogy megtalálják a közösséget kiszolgáló társakat, lekérjék a legfrissebb bejegyzéseket ezektől a társaiktól, és új bejegyzéseket tegyenek közzé egy peer-to-peer üzenetcsatornán keresztül. A bejegyzés elfogadása előtt a közösség kérhet egy spamellenes kihívást, például captcha-t, meghívókódot, fizetést, token-ellenőrzést, AI-moderálási ellenőrzést, engedélyezési listát vagy bármilyen más kódolható szabályt.

Ez az alapgondolat:

1. A közösséget privát kulcs vezérli.
2. A nyilvános kulcs stabil címet ad a közösségnek.
3. A társak segítenek az olvasóknak megtalálni és lekérni a közösséget.
4. A közösségi csomópontok elfogadják vagy elutasítják az új bejegyzéseket.
5. A levélszemét-ellenes szabályzat minden közösséghez tartozik, nem pedig egyetlen globális platformhoz.

## Miért számítanak a hash-ek?

A hash egy rövid ujjlenyomat az adatok számára.

Ha két személy pontosan ugyanazt a fájlt hasítja ki, ugyanazt az ujjlenyomatot kapják. Ha a fájl megváltozik, az ujjlenyomat is megváltozik. Ez hasznossá teszi a kivonatokat az adatok megkereséséhez és ellenőrzéséhez anélkül, hogy megbízna egy cégben, hogy megmondja, mi a fájl.

A peer-to-peer rendszerek folyamatosan használják ezt az ötletet. Ahelyett, hogy az egyik webhelyen „a photo.png nevű fájlt” kérné, egy partner egy adott ujjlenyomattal kérheti a hálózattól az adatokat. Ha egy másik partner rossz adatokat ad vissza, a hash-ellenőrzés sikertelen.

A Bitsocial hash-eket és tartalomazonosítókat használ a bejegyzési adatokhoz és a közösségi állapot egyéb részeihez. A lényeg egyszerű: az adatok megszólíthatók az alapján, amiről van szó, nem csak az alapján, hogy egy vállalat hol tárolta azokat.

## Miért számítanak a nyilvános kulcsok?

A nyilvános kulcs és a privát kulcs egy páros.

A privát kulcs titkos. Ez az, ami az irányítást adja. A nyilvános kulcs biztonságosan megosztható. Lehetővé teszi, hogy mindenki más ellenőrizze, hogy egy üzenet, frissítés vagy moderálási művelet valóban a megfelelő privát kulcstól származik-e.

Így kerüli el a Bitsocial a normál platformfiókokat. A cégnek nem kell kiadnia a személyazonosságot. Az adatbázis-sornak nem kell megadnia a tulajdonost. A kulcspár a jogosultság.

Egyszerűen fogalmazva:

- a privát kulcs a tulajdonos vezérlőkarja
- a nyilvános kulcs a nyilvános identitás vagy cím
- aláírások igazolják, hogy a tulajdonostól érkezett intézkedés

## Mi az a Bitsocial közösség

A Bitsocial közösség nem csak egy oldal egy alkalmazásban.

Saját kulcspárral rendelkezik. A nyilvános kulcs stabil hálózati címet ad a közösségnek. A privát kulcs vezérli a közösség állapotának frissítéseit, például a metaadatokat, a szabályokat, a moderátorlistát, a kihíváskonfigurációt és a legutóbbi elfogadott tartalomra mutató mutatókat.

Ez azt jelenti, hogy egy közösség túlélhet egyetlen felületen. Egy alkalmazás megjelenítheti táblaként. Egy másik alkalmazás fórumként jelenítheti meg. Egy jövőbeli alkalmazás megjelenítheti ezt egy profilalapú hírfolyamban. Az alkalmazás változhat, de a közösségi cím továbbra is ugyanarra a tulajdonú közösségre mutat.

## Hogyan működik az olvasás

Amikor a felhasználó megnyit egy Bitsocial közösséget, az alkalmazás nem kér egy központi adatbázist az oldalhoz.

Az áramlás közelebb áll ehhez:

1. Az alkalmazás már ismeri a közösségi címet, vagy lekéri egy listáról, linkről, keresési felületről, ill
   ember által olvasható név.
2. Az alkalmazás megkérdezi a könnyű útválasztókat, hogy jelenleg mely társak biztosítják az adott közösségi címet.
3. Az útválasztók csak peer címeket adnak vissza. Nem adnak vissza bejegyzéseket, szabályokat, profilokat vagy közösségeket
   metaadatokat.
4. Az alkalmazás csatlakozik a társakhoz, és lekéri a legújabb közösségi állapotot.
5. Ez az állapot mutatókat tartalmaz a tartalom közzétételére.
6. Az alkalmazás lekéri a bejegyzés tartalmát a társaktól, és egy normál közösségi felületen jeleníti meg.

A router csak keresési segéd. Ez közelebb áll ahhoz a kérdéshez, hogy "kinek van ez?" mint azt kérdezni, hogy "kérem, szolgálja ki nekem az egész webhelyet."

Erről a felosztásról további részletekért olvassa el a [Tartalom felfedezése](./content-discovery.md) részt.

## Hogyan működik a posztolás

A közzététel különbözik az olvasástól, mivel a nyílt peer-to-peer hálózatok kéretlen leveleket küldhetnek.

A Bitsocial kihívás-válasz folyamaton keresztül kezeli a közzétételt:

1. A felhasználó hozzászólást vagy választ ír.
2. Az alkalmazás csatlakozik a közösség peer-to-peer üzenettémájához.
3. Az alkalmazás kihívást kér a közösségi csomóponttól.
4. A közösségi csomópont visszaküldi a kihívást.
5. A felhasználó vagy az alkalmazás teljesíti a kihívást.
6. Az alkalmazás elküldi a bejegyzést és a kihívásra adott választ.
7. A közösségi csomópont ellenőrzi a választ és a bejegyzést.
8. Ha ez sikeres, a közösségi csomópont elfogadja a bejegyzést a közösség következő frissítésében.
9. Más olvasók lekérik a frissített közösségi állapotot a társaiktól.

A kihívás azelőtt történik, hogy a poszt az elfogadott közösségi állapot részévé válna. Ez a lényeges különbség azoktól a rendszerektől, ahol a spameket először elfogadják, majd később rejtik el.

## Miért fontosak a spamellenes kihívások?

A legtöbb közösségi platform a levélszemét-ellenességet platformszabályzattá változtatja. Egy cég dönti el, hogy mi számít érvényes fióknak, érvényes bejegyzésnek, érvényes elérésnek vagy érvényes felhasználónak.

A Bitsocial elválasztja ezeket a dolgokat. A protokoll lehetőséget ad a közösségeknek, hogy kihívást kérjenek a bejegyzés elfogadása előtt, de nem kényszerít minden közösséget arra, hogy ugyanazt a kihívást használja.

Egy közösség használhat captcha-t. Egy másik használhat meghívókódokat. Egy másikhoz szükség lehet egy SMS csekkre, fizetésre, NFT-re, token egyenlegre, mesterséges intelligencia-moderálási pontszámra, jó hírnév igazolására, közösségspecifikus engedélyezési listára vagy egyéni szabályra.

Ez a rugalmasság számít, mert a spam változik. A protokoll szintű spamszabály elavulttá válik. A közösségi szintű kihívás a teljes hálózat áttelepítése nélkül is kialakulhat.

A fókuszált magyarázatért olvassa el az [Egyéni levélszemét-ellenes kihívások](./custom-challenges.md) című részt.

## Hogyan működik a moderálás

A Bitsocial nem moderálásmentes. Ez moderálás egyetlen globális szuperadminisztrátor nélkül.

Egy közösségnek lehetnek tulajdonosai és moderátorai. A moderátorok címei a közösségi állapot részét képezik. Amikor egy moderátor végrehajt egy műveletet, azt alá lehet írni. A közösségi csomópont és az ügyfelek ellenőrizhetik az aláírást a moderátorlistában.

Ez helyi hatókört ad a moderálásnak:

- a közösség tulajdonosa irányítja a közösséget
- A moderátorok a közösség által felismert kulcsokon keresztül cselekszenek
- az alkalmazások továbbra is kiválaszthatják, hogy mit indexelnek, rangsorolnak, elrejtenek vagy kiemelnek
- egyetlen protokollszintű vállalati fiók sem tud minden identitást törölni vagy minden közösséget lefoglalni

A gyakorlatban ez azt jelenti, hogy egy közösség eltávolíthatja a kéretlen leveleket, vagy szabályokat érvényesíthet saját területén belül anélkül, hogy a szabályokat az egész hálózatra vonatkozó törvényekké alakítaná.

Az irányelvek megtekintéséhez olvassa el a [Helyi moderálás, nem globális tiltások](./local-moderation.md) című részt.

## Milyen alkalmazások adnak hozzá

A protokoll nem dönti el, hogy az egész terméknek milyennek kell lennie.

Egy alkalmazás hozzáadja az emberi tapasztalatot a protokollhoz:

- alapértelmezett közösségi listák
- keresés és felfedezés
- hírcsatornák és rangsorolás
- elrendezési és közzétételi felület
- médiakezelés
- moderációs eszközök
- mobil, asztali vagy böngésző csomagolásban
- üzleti modellt és alapértelmezéseket

Ez az oka annak, hogy a Bitsocial támogatja a különböző alkalmazásstílusokat. Az 5chan úgy érezheti magát, mint egy imageboard. A Seedit fórum-jellegű vita lehet. Más ügyfelek különböző felfedezési felületeket, rangsorolási rendszereket, moderálási nézeteket vagy közösségi alapértelmezéseket építhetnek fel, miközben továbbra is kompatibilis Bitsocial közösségeket használnak alatta.

A protokoll a tulajdonjogot és a közzétételt hordozhatóvá teszi. Az alkalmazások a termékminőségben versenyeznek.

## Amit a nyilvános RPC ad hozzá

Egy peer-to-peer közösségi csomópont közvetlen futtatása hatékony, de nem mindenki akarja a mindig bekapcsolt gépet kezelni.

A nyilvános RPC az a szolgáltatási réteg, amely kényelmesebbé teheti a Bitsocialt. A nyilvános RPC-szolgáltató segíthet a felhasználóknak a közösségek telefonos vagy könnyű kliensről történő kezelésében, míg a hosszú távú tulajdonosi modellnek továbbra is lehetővé kell tennie a felhasználók számára, hogy elköltözzenek, önállóan működjenek, vagy válasszanak egy versengő szolgáltatót.

A megkülönböztetés számít:

- Az RPC segíthet az üzemidőben és a kényelemben
- Az RPC nem válhat állandó őrizetbe
- a tulajdonosi viszonynak kulcsokhoz kell kötődnie, nem pedig egyetlen szolgáltató adatbázisához

## Ami a Bitsocial nem az

A Bitsocial nem egy blockchain közösségi hálózat. A közösségi médiának nincs szüksége minden bejegyzésre ahhoz, hogy tranzakcióvá váljon egy globális főkönyvben.

A Bitsocial nem föderáció az ActivityPub értelmében. A közösségnek nem kell fióknak lennie egy kiszolgálón egy tartományban, egy adminisztrátorral és egy szerver adatbázissal.

A Bitsocial szintén nem egy alkalmazás. Ez egy megosztott protokollréteg alkalmazásokhoz, közösségekhez, csomópontokhoz, útválasztókhoz, RPC-szolgáltatókhoz, felfedezési szolgáltatásokhoz, levélszemét-szűrő modulokhoz és moderációs eszközökhöz.

A lényeg nem az, hogy minden felhasználónak meg kell értenie mindezt a közzététel előtt. A lényeg az, hogy a termék normálisnak érezhető, míg az alatta lévő tulajdonosi modell más.

## Merre tovább

- A [Peer-to-Peer Protokoll](./peer-to-peer-protocol.md) elmagyarázza a technikai folyamatot.
- A [Tartalom felfedezése](./content-discovery.md) a hálózati keresést magyarázza az alkalmazások gondozásával szemben.
- [Egyéni levélszemét-ellenes kihívások](./custom-challenges.md) magyarázza a kihívásrendszert.
- Az [Identitás és közösségi tulajdon](./identity-and-ownership.md) magyarázata a kulcsvezérelt
  tulajdonjog.
- [Készítse el saját ügyfelét](/build-your-own-client/) elmagyarázza, hogyan építhetnek a független alkalmazások
  ugyanaz a hálózat.
