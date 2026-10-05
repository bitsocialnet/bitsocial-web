---
title: A Bitsocial és a Bluesky
description: Hogyan viszonyul a Bluesky és az AT Protocol a személyes adatszervereivel, relayeivel és AppView-ival a Bitsocial peer-to-peer közösségeihez.
---

# A Bitsocial és a Bluesky

A [Bluesky](https://bsky.app/) egy mikroblog-alkalmazás, amely az
[AT Protocolra](https://atproto.com/) épül; a protokollt a Bluesky Social PBC tervezte. A protokoll
külön szolgáltatásokra bontja a közösségi hálózatot: a személyes adatszerverek hosztolják a
fiókokat, a relayek egyetlen adatfolyammá gyűjtik össze őket, az AppView-k pedig ezt az adatfolyamot
indexelve állítják elő az idővonalakat és a beszélgetésszálakat, amelyeket az emberek látnak. A
dokumentáció szerint a fiókadatokat hosztszervereken tárolják, „szemben a peer-to-peer modellel”
([áttekintés](https://atproto.com/guides/overview)).

## Hogyan működik az AT Protocol

- **Tárolók szervereken.** Minden bejegyzés, kedvelés vagy követés egy rekord a szerző aláírt
  tárolójában, amelyet egy személyes adatszerver (PDS) hosztol. Az alapértelmezett szervereket a
  Bluesky üzemelteti, de bárki hosztolhatja a sajátját.
- **Relayek.** A relayek minden PDS-re feliratkoznak, és a változásokat egyetlen adatfolyamként, az
  úgynevezett firehose-ként sugározzák tovább. Egy 2025-ös protokollfrissítés óta már nem
  archiválnak minden tárolót, így üzemeltetésük sokkal olcsóbb lett
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView-k.** Egy AppView a teljes firehose-t indexeli, és idővonalakat, teljes válaszszálakat,
  számlálókat és keresést szolgál ki. Ez a hálózat legerőforrás-igényesebb része.
- **Identitás.** A fiók egy DID: általában `did:plc`, amelyet egyetlen globális címtárban
  regisztrálnak, vagy `did:web`, amely egy domainhez kötődik. A DID-dokumentum tartalmazza a fiók
  felhasználónevét, aláírókulcsát és jelenlegi szerverét. Az aláírókulcsot a PDS tárolja; a
  `did:plc` azt is lehetővé teszi, hogy a felhasználók rotációs kulcsokat tartsanak maguknál, így a
  korábbi hoszt segítsége nélkül is költözhetnek
  ([identitásútmutató](https://atproto.com/guides/identity)).
- **Felhasználónevek.** A felhasználónevek DNS-nevek, például `alice.bsky.social` vagy egy, a
  felhasználó tulajdonában lévő domain, amelyeket a DID alapján ellenőriznek.
- **Moderálás.** A hosztolás és az elérés külön rétegek. Bárki üzemeltethet címkézőt, és a
  felhasználók többet is egymásra rétegezhetnek
  ([moderálási útmutató](https://atproto.com/guides/moderation)), a Bluesky alkalmazás azonban
  mindig a Bluesky saját moderálását alkalmazza. A szerzők korlátozhatják, ki válaszolhat a
  bejegyzéseikre, és elrejthetnek válaszokat.

## Miben különböznek

### Szerverek vagy társak

A Bluesky adatai szervereken vannak: minden fiókot egy PDS hosztol, a relayek továbbítják a
firehose-t, az AppView-k pedig kiszolgálják azt, amit a kliensek megjelenítenek. A böngésző ezeknek
a szolgáltatásoknak a HTTP-kliense, sosem társ. A Bitsocialban a közösség csomópontja és a
közösséget olvasó társak szolgálják ki a tartalmat, és egy webalkalmazás saját peer-to-peer
csomópontot futtathat. Lásd a [Böngészős peer-to-peer](/browser-p2p/) oldalt.

### Globális nézet vagy közösségek

Az AT Protocolt egyetlen globális nézetre tervezték: egy AppView minden választ lát, így a
beszélgetésszálak és a keresés teljesek. A Bitsocialnak nincs globális indexe; minden közösség a
saját állapotát teszi közzé, a felfedezést pedig az alkalmazások építik rá. Lásd a
[Tartalom felfedezése](/content-discovery/) oldalt.

A Blueskyban ma nincs közösségi objektum a nyilvános bejegyzésekhez. 2026 júniusában
[bejelentette a natív közösségeket](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k),
egyes adatvédelmi szinteken jóváhagyáshoz kötött közzététellel; 2026 októberéig ezek nem indultak
el. A Bitsocialban a közösségek jelentik a központi objektumot, és egy közösség csomópontja fogadja
el vagy utasítja el a bejegyzéseket.

### Spamvédelem

A Bluesky a spamet a szerverein alkalmazott sebességkorlátokkal, az új hosztokra a relay szintjén
érvényes korlátokkal, automatikus észleléssel, emberi felülvizsgálattal és címkékkel kezeli, a
szerzők pedig korlátozhatják a válaszokat. Nincs olyan közösségi szintű kapu, amely meghatározná,
minek kell egy bejegyzésnek megfelelnie ahhoz, hogy elfogadják. A Bitsocialban minden közösség maga
választja meg a kihívását. Lásd az [Egyéni levélszemét-ellenes kihívások](/custom-challenges/)
oldalt.

### Kinél vannak a kulcsok

A Bluesky saját szerverein lévő fiókok jelszóval jelentkeznek be, és ezek a szerverek
letétkezelőként őrzik az aláírókulcsaikat ([Kleppmann és mtsai.](https://arxiv.org/abs/2402.03239)).
A Bluesky egyik protokollmérnöke szerint
[a legtöbb fióknak nincsenek függetlenül kezelt rotációs kulcsai](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
A Bitsocial-identitás egy kulcspár, amelyet a felhasználó alkalmazása hoz létre és tárol.

### Az infrastruktúra üzemeltetése

Egy személyes szerver olcsó: a [referencia-PDS](https://github.com/bluesky-social/pds) legfeljebb 20
felhasználóhoz 1 GB RAM-ot javasol. Egy független, a teljes hálózatot lefedő AppView nagy
vállalkozás; egy 2025-ben épített példány
[havonta nagyjából 200 dollárba került](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), főként 16 TB
tárhely miatt. A Bitsocialnak nincs replikálandó globális indexe, és egy közösségi csomópont
fogyasztói hardveren fut.

## Összehasonlítás

| Kérdés                   | Bluesky (AT Protocol)                                                                                   | Bitsocial                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Kategória                | Föderált szerverek globális indexszel                                                                   | Peer-to-peer közösségi hálózat                                                                      |
| Identitás                | DID, amelynek aláírókulcsait általában a szerver tárolja                                                | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                             |
| Hol vannak a bejegyzések | A szerző tárolójában egy személyes adatszerveren                                                        | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                  |
| Ki tartja online         | PDS-hosztok, relayek és AppView-k, alapértelmezés szerint a Bluesky üzemeltetésében                     | A közösség tulajdonosának csomópontja és a segítő seederek                                          |
| Közösségek               | Nyilvános bejegyzésekhez még nincsenek (2026-ban jelentették be)                                        | Elsőrangú objektumok, amelyek csomópontja elfogadja vagy elutasítja a bejegyzéseket                 |
| Spamvédelem              | Szerveroldali sebességkorlátok, automatikus észlelés, címkék, válaszkorlátozás                          | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                       |
| Moderálás                | Egymásra rétegezhető címkézők; a Bluesky alkalmazás mindig a Bluesky moderálását alkalmazza             | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg |
| Nevek                    | A DID alapján ellenőrzött DNS-felhasználónevek                                                          | Kulcsokra feloldódó `.bso` és `.eth` nevek                                                          |
| Böngésző                 | Egy PDS és egy AppView HTTP-kliense                                                                     | Peer-to-peer csomópont egy hagyományos böngészőfülben                                               |
| Fő kompromisszum         | Teljes globális beszélgetésszálak és keresés, de az összesítéshez nagy teljesítményű szerverek kellenek | Nincs nehézkes globális index, de nincs teljes, hálózatszintű nézet sem                             |
