---
title: A Bitsocial és a Nostr
description: Hogyan viszonyul a Nostr relay-alapú modellje a Bitsocial peer-to-peer közösségeihez, az adatútvonaltól és az identitástól a csoportokon és a spamvédelmen át a moderálásig.
---

# A Bitsocial és a Nostr

A Nostr nem illik tisztán sem a föderált, sem a blokklánc-alapú rendszerek kategóriájába. A
felhasználók nem az egyes példányoktól kapnak fiókot, és nincs lánc, konszenzus, gáz vagy globális
sorrend. A Nostrt pontosabb **relay-alapú közösségi médiaként** leírni: a felhasználók kulcspárokat
birtokolnak, eseményeket írnak alá, és ezeket relayekre teszik közzé, amelyek hagyományos szerverek,
és tárolják, illetve kiszolgálják az eseményeket
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). A Nostr saját
[README-je](https://github.com/nostr-protocol/nostr) szerint nem támaszkodik peer-to-peer
technikákra.

Ez egy fontos szempontból közelebb helyezi a Nostrt a Bitsocialhoz, mint a föderált vagy
blokklánc-alapú rendszereket: az identitás kriptográfiai és hordozható. A különbség az adatrétegben
és abban rejlik, hogy ki őrzi a kaput.

## Hogyan működik a Nostr

- **Események és relayek.** Minden bejegyzés, profil vagy reakció egy aláírt JSON-esemény. A
  kliensek WebSocketen keresztül teszik közzé az eseményeket a relayeken, és szűrőkkel iratkoznak
  fel rájuk; a relayek tárolják az eseményeket, és visszaküldik őket. A relayek nem kommunikálnak
  egymással.
- **Replikáció.** A felhasználók általában több relayre is közzétesznek. Egy 712 relayt vizsgáló
  2023-as tanulmány szerint egy átlagos bejegyzés 34,6 relayen volt meg
  ([Wei és Tyson](https://arxiv.org/abs/2402.05709)).
- **Valaki bejegyzéseinek megtalálása.** A felhasználók közzéteszik azoknak a relayeknek a listáját,
  amelyekre írnak, és amelyekről olvasnak
  ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), a kliensek pedig a
  felhasználó írási relayeiről kérik le a bejegyzéseit.
- **Identitás.** Minden felhasználó egy secp256k1 kulcs, amely Schnorr-aláírásokkal ír alá. A
  specifikációk nem határoznak meg kulcsrotációt vagy -helyreállítást, így az elveszett kulcs
  elveszett fiókot jelent. Az opcionális `name@domain` azonosítókat
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) az adott domain webszerverén
  lévő fájl alapján ellenőrzik.
- **Csoportok.** Az ajánlott közösségi mechanizmus a relay-alapú csoportoké
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): egy relay hosztol egy
  csoportot, egy bejegyzés elfogadása előtt érvényesíti a csoport tagsági és közzétételi szabályait,
  és aláírja a csoport metaadatait. A régebbi, moderátor által jóváhagyott közösségeket
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) ma már nem ajánlottnak
  jelölik a NIP-29 javára.
- **Spamvédelem.** Minden relay maga választja meg a kapuját: proof of work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), hitelesítés és engedélyezési
  listák ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), fizetés vagy
  sebességkorlátok. A kliensek némítási listákkal és bizalmi pontszámokkal egészítik ki ezt.
- **Média.** A képeket és videókat külön HTTP-fájlszerverekre töltik fel.

## Miben különböznek

### Ki tárolja és szolgálja ki a bejegyzéseket

A Nostrban a relayek alkotják a tároló- és kézbesítési réteget: egy szervernek kell online tartania
minden bejegyzést. A Bitsocialban a HTTP-útválasztók csak abban segítenek a klienseknek, hogy
megtalálják a társakat. Nem tárolnak bejegyzéseket, profilokat, közösségi metaadatokat vagy
moderálási állapotot; a kliensek a közösség csomópontjától és a közösséget seedelő társaktól kérik
le a tartalmat. Lásd a [Peer-to-peer protokoll](/peer-to-peer-protocol/) oldalt.

### Ki őrzi a kaput

A Nostrban az írási kapuk a relayek üzemeltetőinél vannak. A NIP-29 csoportokon kívül egy relay
által elutasított kulcs ugyanazt az eseményt bármelyik olyan relayen közzéteheti, amely elfogadja,
és az, hogy az olvasók mit látnak, attól függ, mely relayeket olvassa a kliensük. Egy NIP-29 csoport
közelebb áll egy Bitsocial-közösséghez: a csoportot hosztoló relay fogadja el vagy utasítja el a
bejegyzéseket. Ugyanakkor továbbra is a relay határozza meg, mit tehetnek a csoport szerepkörei, és
a csoport előzményei ehhez a relayhez kötődnek, hacsak egy másik relay nem vállalja az átvételüket.

A Bitsocialban a közösség saját kulcspárral rendelkező kriptográfiai objektum. A közösség
csomópontja azt a kihívást futtatja, amelyet a tulajdonos választ, és az elfogadott állapotot a
peer-to-peer hálózatba teszi közzé. Lásd az
[Egyéni levélszemét-ellenes kihívások](/custom-challenges/) oldalt.

### Az infrastruktúra üzemeltetése

A relay egy domainnel és WebSocket-végponttal rendelkező szerver, és a népszerű relayek viselik az
általuk kiszolgált tartalom tárolási és sávszélesség-költségét. A 2023-as tanulmány becslése szerint
az ingyenes relayek mintegy 95%-a nem tudta adományokból fedezni a költségeit. Egy
Bitsocial-közösségi csomópont fogyasztói hardveren fut, és a közösséget olvasó társak segíthetnek a
megosztásában.

### Böngésző

Egy Nostr-webkliens közvetlenül a relayekhez nyit WebSocket-kapcsolatokat, így nincs szükség
alkalmazásszerverre. Egy Bitsocial-webalkalmazás peer-to-peer csomópontot futtat a böngészőfülben,
és a társaktól kéri le a tartalmat. Lásd a [Böngészős peer-to-peer](/browser-p2p/) oldalt.

### Régi tartalom

A Nostr-bejegyzéseket széles körben replikálják a relayek között, ami segíti a régi bejegyzések
fennmaradását. A Bitsocial a közösség legfrissebb állapotát őrzi meg, és nem garantálja, hogy a régi
tartalom örökre megmarad.

## Összehasonlítás

| Kérdés                   | Nostr                                                                                                     | Bitsocial                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Kategória                | Relay-alapú protokoll                                                                                     | Peer-to-peer közösségi hálózat                                                                      |
| Identitás                | secp256k1 felhasználói kulcs, a specifikációkban kulcsrotáció nélkül                                      | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                             |
| Hol vannak a bejegyzések | A szerző által választott, gyakran nagyszámú relayen                                                      | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                  |
| Ki tartja online         | A relayek üzemeltetői                                                                                     | A közösség tulajdonosának csomópontja és a segítő seederek                                          |
| Közösségek               | Relayen hosztolt csoportok (NIP-29)                                                                       | Elsőrangú objektumok, amelyek csomópontja elfogadja vagy elutasítja a bejegyzéseket                 |
| Spamvédelem              | Az egyes relayek szabályzata: proof of work, hitelesítés, fizetés, engedélyezési listák, sebességkorlátok | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                       |
| Moderálás                | Relay-szabályzatok, kliensoldali némítási listák, címkék és jelentések                                    | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg |
| Nevek                    | HTTPS-en ellenőrzött opcionális `name@domain` azonosítók                                                  | Kulcsokra feloldódó `.bso` és `.eth` nevek                                                          |
| Böngésző                 | A relayek WebSocket-kliense                                                                               | Peer-to-peer csomópont egy hagyományos böngészőfülben                                               |
| Fő kompromisszum         | Hordozható identitás és széles körű replikáció, de relayfüggő elérhetőség és szabályzat                   | Kevesebb relayfüggőség, de a régi tartalom nem marad meg garantáltan örökre                         |
