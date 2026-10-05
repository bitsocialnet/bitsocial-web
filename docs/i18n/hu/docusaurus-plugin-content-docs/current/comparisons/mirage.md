---
title: A Bitsocial és a Mirage
description: Hogyan viszonyul a Mirage, egy saját Cosmos SDK-blokkláncon futó Reddit-stílusú fórum, a Bitsocialhoz és annak Reddit-stílusú alkalmazásához, a Seedithez.
---

# A Bitsocial és a Mirage

A [Mirage](https://mirage.foundation/) Reddit-stílusú vitahálózat közösségekkel, szálakba rendezett
bejegyzésekkel és szavazatokkal. Vállalati adatbázis helyett saját blokkláncon fut, egy
CometBFT-konszenzust használó Cosmos SDK-láncon. A Bitsocial legközelebbi terméke a
[Seedit](/apps/seedit/), egy Reddit-stílusú alkalmazás a Bitsocial-hálózaton, így az összehasonlítás
főként arról szól, hogyan hosztolják, birtokolják és moderálják a közösségeket.

## Hogyan működik a Mirage

- **Csomópontok.** Egy Mirage-csomópont egyetlen Docker-konténer, amely validátort,
  PostgreSQL-adatbázist, indexelőt, HTTP API-t és webes felületet tartalmaz. Minden csomópont egyben
  validátor is. A
  [telepítési útmutató](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md)
  szerint egy csomópont üzemeltetéséhez amd64-es Ubuntu-szerver és az üzemeltető fiókjában 10 000
  000 MIRAGE token szükséges.
- **Közzététel.** A böngésző minden műveletet a felhasználó secp256k1 kulcsával ír alá, az ingyenes
  felhasználók pedig egy kisebb proof of workot is kiszámítanak. A csomópont a műveletet egy
  lánctranzakcióba csomagolja, és kifizeti a díjat.
- **Olvasás.** Minden csomópont indexelője a saját adatbázisába másolja a lánc adatait, és HTTP
  API-n keresztül szolgálja ki a hírfolyamokat. A csomópontok nagyjából egyheti blokkot őriznek meg,
  így a bejegyzések hosszú távú előzményei az egyes csomópontok adatbázisában vannak, egy új
  csomópont pedig a szinkronizálási pontja előtti előzmények nélkül indul.
- **Fiókok.** A fiók egy 12 szavas seed-kifejezésből származtatott kulcs, és ugyanaz a seed
  bármelyik csomóponton működik. A felhasználóneveket a lánc rögzíti, és az egész hálózaton
  egyediek.
- **Közösségek.** Minden érvényes név eleve közösség, és senki sem birtokolja. Legfeljebb tízfős,
  fizetett kurátorcsapatok tartanak fenn egy-egy moderált nézetet egy közösségről; az olvasók
  választhatnak egy csapat nézete, a csomópont alapértelmezett nézete vagy egy cenzúrázatlan nézet
  között. Lásd a [Mirage GYIK-et](https://mirage.talk/faq).
- **Token.** A MIRAGE tokennel lehet előfizetéseket fizetni, ebből jutalmazzák a szerzőket és a
  csomópontokat, és ez ad a validátoroknak súlyt az irányításban. Az előfizetőknek nem kell proof of
  workot végezniük, és magasabb korlátokat kapnak.

## Miben különböznek

### Ki birtokol egy közösséget

A Seeditben a közösség létrehozója birtokolja annak kulcspárját, futtatja vagy delegálja a
csomópontját, és moderálja. A Mirage-ban egy közösséget senki sem birtokol: egymással versengő
kurátorcsapatok kínálnak moderált nézeteket ugyanahhoz a névhez, az alapértelmezett nézet pedig
annak a csapatnak a nézete, amelyet a legtöbb fizető előfizető választott.

### Spamvédelem

A Mirage egyetlen szabályt alkalmaz az egész hálózatra: az ingyenes felhasználók proof of workkal
fizetnek, amelynek nehézsége a beérkező forgalomhoz igazodik, az előfizetők pedig mentesülnek alóla.
A Bitsocialban minden közösség maga választja meg a kihívását, a captchától az engedélyezési
listákon át a fizetésig. Lásd az [Egyéni levélszemét-ellenes kihívások](/custom-challenges/) oldalt.

### Infrastruktúra

A Mirage-nak blokkláncra van szüksége. A validátorok minden műveletről konszenzusra jutnak, és
minden csomópont teljes szerverkészletet futtat, valamint nagy tokenletétet kell tartania. A
Bitsocialban nincs lánc: egy közösségi csomópont fogyasztói hardveren fut az asztali alkalmazásból
vagy a `bitsocial-cli` segítségével, és az olvasók segíthetnek a tartalom megosztásában.

### Hálózatszintű irányítás

A Mirage-ban láncon belüli, a validátorok letétje szerint súlyozott irányítás működik. Ez
módosíthatja a nehézséget, az árakat és a tokenkibocsátást, tokeneket hozhat létre vagy semmisíthet
meg, és adminisztrátorokat nevezhet ki, akiknek a törléseit a referencia-indexelő bármely
bejegyzésre alkalmazza. A lánc kódja azt is lehetővé teszi az irányítás számára, hogy
[fiókokat töröljön](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573),
és hogy
[bármely címről tokeneket küldjön](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
2026 októberében négy validátor állította elő a lánc blokkjait, és mind a négyet a projekt saját
üzemeltetési forgatókönyvei kezelték.

A Bitsocialnak nincs protokollszintű adminisztrátora. A közösségek tulajdonosai a saját
közösségeiket moderálják, és az alkalmazások döntik el, mit jelenítenek meg. Lásd a
[Helyi moderálás, nem globális tiltások](/local-moderation/) oldalt.

### Böngésző

A Mirage webkliense egy csomópont HTTP-kliense: a böngésző aláírja a műveleteket, de nem csatlakozik
peer-to-peer hálózathoz. A Bitsocial-alkalmazások peer-to-peer csomópontot futtathatnak a
böngészőfülben. Lásd a [Böngészős peer-to-peer](/browser-p2p/) oldalt.

## Összehasonlítás

| Kérdés                   | Mirage                                                                                                                     | Bitsocial                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Kategória                | Fórum saját blokkláncon (Cosmos SDK)                                                                                       | Peer-to-peer közösségi hálózat                                                                                 |
| Identitás                | 12 szavas seedből származó secp256k1 kulcs, láncon tárolt felhasználónévvel                                                | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                                        |
| Hol vannak a bejegyzések | Lánctranzakciókban, majd az egyes csomópontok PostgreSQL-adatbázisában                                                     | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                             |
| Ki tartja online         | Validátorcsomópontok, mindegyik 10 000 000 MIRAGE tokennel                                                                 | A közösség tulajdonosának csomópontja és a segítő seederek                                                     |
| Közösségek               | Tulajdonos nélküli nevek, egymással versengő fizetett kurátorcsapatokkal                                                   | Egy kulcspár birtokolja; a tulajdonos csomópontja fogadja el vagy utasítja el a bejegyzéseket                  |
| Spamvédelem              | Hálózatszintű proof of work; az előfizetők mentesülnek alóla                                                               | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                                  |
| Moderálás                | Kurátorcsapatok nézetei, személyes szűrők, az irányítás által kinevezett adminisztrátorok                                  | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg            |
| Gazdasági modell         | MIRAGE token az előfizetésekhez, a jutalmakhoz és a validátori letéthez                                                    | A protokollban nincs; egy kihívás megkövetelhet fizetést vagy tokent                                           |
| Böngésző                 | Egy csomópont HTTP-kliense                                                                                                 | Peer-to-peer csomópont egy hagyományos böngészőfülben                                                          |
| Fő kompromisszum         | Egyetlen közös, sorba rendezett állapot és egyszerű regisztráció, de kis validátorkör és hálózatszintű irányítási jogkörök | Nem kell hozzá lánc vagy letét, de nincs globális sorrend, és a régi tartalom nem marad meg garantáltan örökre |
