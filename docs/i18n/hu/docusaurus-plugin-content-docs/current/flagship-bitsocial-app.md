---
title: A Twitter/X decentralizálása
description: "A mesterterv 3. szakasza: fókuszált, decentralizált Twitter/X-alternatíva a szövegközpontú nyilvános beszélgetéshez, cserélhető infrastruktúrával."
---

# A Twitter/X decentralizálása

A 3. szakasz egy fókuszált, decentralizált Twitter/X-alternatíva létrehozásának terve. Középpontjában a szövegközpontú nyilvános beszélgetés áll: rövid bejegyzések, válaszok, újraközlések, követések, valós idejű párbeszéd és közösségek, nyitott platformréteggel.

A Twitter/X-et továbbra is a bejegyzések, a szöveg és az ötletek megosztása határozza meg. A 3. szakasz kliensének ebben az alapélményben kell versenyeznie, és azt kiemelkedően jól kell megvalósítania.

Ez az oldal a termék irányát írja le, nem egy rögzített kiadási specifikációt. A pontos felület, az alapértelmezett hírfolyam, a hirdetési modell, az AI-funkciók és az RPC-piactér a protokoll és a korai alkalmazások érésével változhat.

## Mit kell bizonyítania

A kliensnek bizonyítania kell, hogy egy profilalapú közösségi hálózat elkerülheti a letétkezelő platformmá válást:

- a felhasználók birtokolhatják identitásukat és profiljukat
- a közösségek és a profilcsomópontok peer-to-peer alapon működhetnek
- a közösségek hálózati hatásokat vihetnek át a Bitsocial-kliensek között
- az RPC-szolgáltatók kényelmessé tehetik a klienst anélkül, hogy átvennék a letétkezelést
- a hírfolyam-algoritmusok a platform által előírt szabályok helyett választható szolgáltatások lehetnek
- más kliensek továbbra is versenyezhetnek ugyanazon a hálózaton

A cél a lehető legerősebb nyilvános beszélgetési kliens megépítése és annak bemutatása, milyen messzire terjedhet a protokoll.

## Ismerős cél, cserélhető felépítés

Az alapértelmezett élménynek a Twitter/X alapjaival kell versenyeznie: gyors kezdőlapi hírfolyam, szöveges bejegyzések, követések, válaszok, újraközléses terjesztés, közösségek, értesítések, keresés és azonnal működő, rangsorolt For You nézet.

A Bitsocial Forge üzemeltetheti az első alapértelmezett RPC- és hírfolyam-szolgáltatást. Az alapbeállítás rangsorolt hírfolyamot és hirdetéseket is tartalmazhat, hogy a kliens már az első napon teljesnek hasson, ne pedig a hétköznapi felhasználóknak kelljen összeállítaniuk a teljes rendszert.

A különbség az, hogy az alapértelmezés nem válhat börtönné. A felhasználónak lehetősége kell legyen RPC-t, hírfolyamot, példányt, rangsorolási rendszert, hirdetést és felfedezési szolgáltatót váltani, vagy teljesen kikapcsolni a rangsorolást. A kliens az első indításkor határozott alapbeállításokat kínálhat, miközben minden fontos szolgáltatás cserélhető marad.

Ez a klienst egy hagyományos platformnál jobban testreszabhatóvá teszi. Az egyik felhasználó megtarthatja az alapértelmezett rangsorolt hírfolyamot hirdetésekkel. Egy másik időrendi hírfolyamot használhat rangsorolás nélkül. Egy harmadik adatvédelemre összpontosító RPC-t, közösségi felfedezési szolgáltatást, fizetős hirdetésmentes hírfolyamot vagy egy adott szubkultúrára szabott algoritmust választhat.

## Kliensek közötti közösségek

A közösségeknek sokkal fontosabbnak kell lenniük, mint az egyetlen alkalmazáson belüli elszigetelt csoportoknak.

Az X/Twitter közösségei az X-en belül maradnak. Hasznosak lehetnek, de egyetlen platform, fiókrendszer, ajánlási rendszer és termékfelület korlátait öröklik.

Egy Bitsocial-közösség különböző klienseken keresztül is létrehozható, üzemeltethető, felfedezhető és használható. Ez azt jelenti, hogy a 3. szakasz kliense a tágabb Bitsocial-hálózat közösségeit és bejegyzéseit is megjelenítheti, nem csak azokat a felhasználókat, akik ebben a kliensben kezdték. Egy közösségben egyszerre jelenhet meg aktivitás egy imageboard-kliensből, egy Reddit-szerű beszélgetési kliensből, egy szűk témájú fórumkliensből, egy mobilalkalmazásból és a 3. szakasz klienséből.

Ez a hálózati hatás legfontosabb előnye: egy kliens ismerős lehet a hétköznapi felhasználóknak, miközben számos kliensből, közösségi csomópontból, RPC-szolgáltatótól és független szolgáltatásból merít értéket.

## Választható hírfolyam-algoritmusok

A 3. szakasz kliense nem kényszeríthet mindenkire egyetlen globális rangsorolási rendszert.

A hírfolyam-algoritmusokat a felhasználónak kell választania. Algoritmust választhat egy piactérről, szolgáltatót válthat, használhat vállalati, névtelen üzemeltető által futtatott vagy közösség által készített algoritmust, futtathat sajátot, vagy teljesen elhagyhatja az algoritmust.

A nyilvános RPC-szolgáltatók természetes versenyteret biztosítanak ezeknek a szolgáltatásoknak. Indexelhetik, rangsorolhatják és ajánlhatják a tartalmakat, de nem birtokolhatják a felhasználót vagy a profilt.

Ezek a szolgáltatások magának a kliensnek a kialakításában is versenyezhetnek. Egy RPC rangsorolt, hirdetéseket tartalmazó hírfolyamot kínálhat. Egy másik rangsorolatlan, időrendi hírfolyamot. Egy harmadik az adatvédelemre, fordításra, moderálásra, közösségfelfedezésre vagy egy szűkebb közönség közösségi gráfjára szakosodhat.

Ha a gazdasági modell működik, az RPC-alapú hírfolyam-szolgáltatások a nagy platformok által is fejlesztett AI-funkciókat adhatnak hozzá: automatikus fordításokat, összefoglalókat, botok által segített válaszokat, keresési válaszokat, moderálási segítséget vagy közösségi jegyzetekhez hasonló kontextust.

Ezeknek szolgáltatási választásoknak, nem pedig protokollkövetelményeknek kell lenniük. Az alapértelmezett RPC gazdagabb hírfolyammal versenyezhet, de a felhasználóknak és a versenytárs klienseknek továbbra is lehetőséget kell kapniuk egyszerűbb, privát, időrendi, hirdetésmentes vagy egy adott közösségre szabott alternatívák választására.

## Nem letétkezelő RPC

Minden felhasználónak teljes értékű peer-to-peer csomópontként kell tudnia részt venni RPC-n keresztül anélkül, hogy az RPC-szolgáltatónak adná identitása vagy profilja tulajdonjogát.

Az üzemeltetett út azért fontos, mert a legtöbb felhasználó nem saját szerver futtatásával kezdi. A kilépési út ugyanilyen fontos: a felhasználónak bármikor át kell tudnia állni saját profilcsomópontjára alacsony teljesítményű hardveren, akár egy Raspberry Pi eszközön.

Ez a kényelem és a letétkezelés közötti különbség.

## A Bitsocial Chain által erősített nyilvános beszélgetés

A Bitsocial Chain tartós elnevezést, fizetést, borravalót, díjakat és más pénzügyi lehetőségeket hozhat közvetlenül a nyilvános beszélgetésbe.

A 3. szakasz kliense a bejegyzésekre, a szövegre, az ötletek megosztására és a valós idejű párbeszédre összpontosít, miközben közösségeket és hálózati hatásokat oszt meg más Bitsocial-kliensekkel.
