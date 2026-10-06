---
title: A Bitsocial és a Secure Scuttlebutt
description: Hogyan viszonyul a Bitsocialhoz a Secure Scuttlebutt (SSB) és a hozzá tartozó Manyverse alkalmazás, a csak hozzáfűzhető hírfolyamoktól és a követési gráf szerinti replikációtól a közösségekig, a spamvédelemig és az offline szinkronizálásig.
---

# A Bitsocial és a Secure Scuttlebutt

A [Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) egy peer-to-peer közösségi protokoll, amelyet
Dominic Tarr hozott létre 2014-ben. A [Manyverse](https://www.manyver.se/) a legismertebb
alkalmazása Androidra, iOS-re és asztali gépre; a [Patchwork](https://github.com/ssbc/patchwork)
volt a fő asztali kliens, mielőtt archiválták. A dokumentációban összehasonlított rendszerek közül
szellemiségében az SSB áll a legközelebb a Bitsocialhoz: nincsenek szerverek az adatúton, nincs
blokklánc, nincs globális sorrend, az identitást pedig Ed25519 kulcsok adják. A kettő ellentétes
döntéseket hozott abban, mit tárolnak az egyes társak, és hol állítják meg a spamet.

## Hogyan működik a Scuttlebutt

- **Hírfolyamok.** Minden identitás egy Ed25519 kulcspár, amelyet `@<public key>.ed25519` formában
  írnak. Mindaz, amit egy felhasználó közzétesz, a saját hírfolyamába kerül: egy csak hozzáfűzhető
  naplóba, amelyben minden aláírt üzenet tartalmaz egy sorszámot és az előző üzenet hash-ét. A
  [protokoll-útmutató](https://ssbc.github.io/scuttlebutt-protocol-guide/) szerint a közzétett
  üzenet utólag nem módosítható.
- **Replikáció.** A társak teljes hírfolyamokat másolnak, nem egyes bejegyzéseket, és a követési
  gráf dönti el, mely hírfolyamokat őrzi meg egy társ. A Patchwork például legfeljebb két ugrásnyi
  távolságig jelenítette meg a hírfolyamokat, és legfeljebb három ugrásnyi távolságig replikálta
  őket. Az epidemikus szórási fák (epidemic broadcast trees, EBT) segítségével a társak összevetik,
  mi a legutóbbi sorszám, amellyel az egyes hírfolyamokból rendelkeznek, és csak a hiányzó részt
  küldik el.
- **Kapcsolatok.** A társak a secret handshake protokollal hitelesítik egymást, és a box stream
  protokollal titkosítják a forgalmat. A kézfogás kulcsként egy hálózati azonosítót használ, így egy
  eltérő azonosítójú, különálló SSB-hálózat társai nem tudnak csatlakozni a fő hálózathoz.
- **Társak megtalálása.** A társak UDP-szórással jelentik be magukat a helyi hálózaton, és LAN-on
  keresztül szinkronizálnak; a Manyverse Bluetoothon is szinkronizál. Az interneten keresztül a
  felhasználók **pub**-csomópontokra támaszkodnak, vagyis mindig online társakra, amelyek egy
  meghívókód beváltása után visszakövetnek, majd tárolják és kiszolgálják a hírfolyamodat, valamint
  **room**-csomópontokra, amelyek nem tárolnak hírfolyamokat, hanem alagúton továbbítják a tagjaik
  közötti kapcsolatokat.
- **Blobok és privát üzenetek.** A képek és más fájlok tartalomcímzett blobok, amelyeket a társaktól
  töltenek le; a jelenlegi implementációkban az alapértelmezett méretkorlát 5 MB. A privát
  üzeneteket legfeljebb hét címzett számára titkosítják, és titkosított szövegként teszik közzé a
  szerző hírfolyamában.

## Miben különböznek

### Mit tárol egy társ

Egy SSB-társ a replikációs körébe eső minden hírfolyamról teljes másolatot őriz, az egyes
hírfolyamok első üzenetétől kezdve, és ezeket a hírfolyamokat másoknak is kiszolgálja. Ez teszi
lehetővé, hogy az SSB offline is működjön, ám a tárhelyigény a körbe eső minden üzenettel nő, és egy
új telepítésnek le kell töltenie ezeket a hírfolyamokat, mielőtt sok mindent meg tudna jeleníteni.
Egy Bitsocial-kliens az általa megnyitott közösségek legfrissebb állapotát a közösség csomópontjától
és a közösséget seedelő társaktól kéri le, és a hálózat csak ezt a legfrissebb állapotot őrzi meg.
Lásd a [Peer-to-peer protokoll](/peer-to-peer-protocol/) oldalt.

### Törlés és eszközök

Mivel a hírfolyam hash-lánc, az SSB-ben nincs az egész hálózatra kiterjedő törlés: egy társ eldobhat
üzeneteket a saját adatbázisából, de a többi társ másolataiból nem vonhatja vissza őket. Ha valaki
ugyanazzal a kulccsal két eszközről vagy egy visszaállított biztonsági mentésből tesz közzé, a
hírfolyam elágazik (fork), ezért a szokásos megoldás az eszközönként egy identitás. A PZP, a
Manyverse csapatának utódprotokollja, az SSB-hez képest legfontosabb változásai között említi a
törlést, a fiókonként több eszközt és az elágazást tűrő hírfolyamokat
([bejelentő bejegyzés](https://www.manyver.se/blog/2024-07-03/)). Egy Bitsocial-közösségi csomópont
minden frissítéskor a közösség állapotának új változatát teszi közzé, így a moderátorai által
eltávolított tartalom kikerül a legfrissebb állapotból.

### Kit hallhatsz

Az SSB replikációs köre egyben a spamszűrője is. Egy idegen hírfolyama csak akkor jut el hozzád, ha
valaki az ugrásaidon belül követi őt, egy hírfolyam letiltása pedig leállítja a replikálását a
csomópontodon. A spam kívül marad, de ugyanígy az újonnan érkezők is, amíg valaki nem követi őket. A
Bitsocial bárkinek megengedi, hogy közzétegyen egy közösségben, és a közösség csomópontja a
kihívásával dönti el, hogy elfogad-e egy bejegyzést. Lásd az
[Egyéni levélszemét-ellenes kihívások](/custom-challenges/) oldalt.

### Közösségek

Az SSB-ben nincs közösségi objektum. A csatornák és a hashtagek az egyes bejegyzésekre tett címkék,
egy szál válaszai azoknak a hírfolyamában vannak, akik írták őket, és az, hogy egy szálból mennyit
látsz, attól függ, ezek közül a hírfolyamok közül melyek vannak meg a csomópontodon. A
room-csomópontoknak lehetnek moderátorai és taglistái, de ezek azt szabályozzák, ki csatlakozhat a
room-csomóponton keresztül, nem azt, mi kerül közzétételre. Egy Bitsocial-közösség elsőrangú
objektum saját kulcspárral, szabályokkal, moderátorokkal és kihívással.

### Infrastruktúra

Mindkettő távol tartja a szervereket az adatúttól, és mindkettő segítőkre támaszkodik. Az SSB-ben a
pub-csomópontok állnak a legközelebb egy hosztolt szolgáltatáshoz: mindazok hírfolyamát tárolják és
kiszolgálják, akiket követnek. A room-csomópontok közelebb állnak a Bitsocial HTTP-útválasztóihoz,
mert egyikük sem tárol tartalmat, de egy room-csomópont továbbítja a kapcsolatot a tagjai között,
míg egy útválasztó csak szolgáltatói címeket ad vissza, és nem vesz részt az átvitelben. Egy
SSB-társhoz hasonlóan a Bitsocial-közösségi csomópont is fogyasztói hardveren fut, és online kell
lennie ahhoz, hogy új bejegyzéseket fogadhasson el.

### Offline működés és helyi hálózatok

Ebben az SSB az erősebb. Két SSB-társ ugyanazon a Wi-Fi-hálózaton, vagy a Manyverse-ben Bluetoothon
keresztül, internetkapcsolat nélkül is tud szinkronizálni, és minden, ami már replikálódott, offline
is olvasható marad. A Manyverse kinyilvánított elsődleges célja, hogy a közösségi hálózatokat
függetlenné tegye az internetkapcsolattól. A Bitsocialnak internetkapcsolatra van szüksége a társak
megtalálásához és a közzétételhez.

### Böngésző

A fő SSB-alkalmazások teljes SSB-csomópontot tartalmaznak: a Manyverse egyet a mobil- és asztali
alkalmazásaiba is beépít. Az [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo)
böngészőben futtatta az SSB-t részleges replikációval és room-csomópontokon keresztüli
kapcsolatokkal, 2022-ben pedig archiválták. A Bitsocial-alkalmazások peer-to-peer csomópontot
futtatnak egy hagyományos böngészőfülben. Lásd a [Böngészős peer-to-peer](/browser-p2p/) oldalt.

### Privát üzenetek

Az SSB beépített titkosított privát üzeneteket kínál. A Bitsocial a nyilvános közösségekre
összpontosít, és natív közvetlen üzenetküldés még nincs benne.

## A projekt állapota

André Staltz, aki a Manyverse-t építette, 2024 áprilisában visszavonult az SSB-től, a Manyverse-től
és a tervezett utódjuktól ([utolsó frissítése](https://www.manyver.se/blog/2024-04-05/)). 2024
júliusában Jacob Karlsson [PZP](https://pzp.wiki/) néven elindította ezt az utódot, és azt írta,
hogy többé nem dolgozik a Manyverse-en, és nem tud senki másról, aki ezt tervezné. 2026 októberében
a PZP [Codeberg](https://codeberg.org/pzp)-tárolói 2024 decembere óta nem kaptak frissítést. A
Patchwork tárolója archivált, utolsó kiadása a v3.18.1, a Planetary, egy iOS-re készült
SSB-alkalmazás mögött álló csapat pedig 2023-ban a Nos alkalmazásával átállt a Nostrra. Az
SSB-hálózat továbbra is működik azokon a társakon és pub-csomópontokon, amelyeket az emberek online
tartanak, de a fő alkalmazásait már nem fejlesztik.

## Összehasonlítás

| Kérdés                   | Secure Scuttlebutt                                                                                                              | Bitsocial                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Kategória                | Peer-to-peer gossip-protokoll                                                                                                   | Peer-to-peer közösségi hálózat                                                                           |
| Identitás                | Eszközönként egy Ed25519 kulcspár                                                                                               | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                                  |
| Hol vannak a bejegyzések | A szerző csak hozzáfűzhető hírfolyamában, amelyet minden azt replikáló társ lemásol                                             | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                       |
| Mit őriz meg egy társ    | A követési körébe eső minden hírfolyam teljes előzményét                                                                        | Az általa olvasott vagy seedelt közösségek legfrissebb állapotát                                         |
| Közösségek               | Nincs közösségi objektum; a csatornák és a hashtagek a bejegyzéseket címkézik                                                   | Elsőrangú objektumok, amelyek csomópontja elfogadja vagy elutasítja a bejegyzéseket                      |
| Spamvédelem              | A követési gráf szerinti replikációs kör és a letiltások                                                                        | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                            |
| Moderálás                | Az egyes felhasználók követései és letiltásai                                                                                   | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg      |
| Segédszerverek           | A pub-csomópontok tárolják és kiszolgálják a hírfolyamokat; a room-csomópontok alagúton továbbítják a kapcsolatokat             | A HTTP-útválasztók szolgáltató társakat adnak vissza, és nem tárolnak tartalmat                          |
| Offline működés          | LAN- és Bluetooth-szinkronizálás internet nélkül                                                                                | Internetkapcsolatot igényel                                                                              |
| Böngésző                 | Az alkalmazások teljes SSB-csomópontot tartalmaznak                                                                             | Peer-to-peer csomópont egy hagyományos böngészőfülben                                                    |
| Hálózat                  | Működik, de a fő alkalmazásait már nem fejlesztik                                                                               | Működő hálózat olyan alkalmazásokkal, mint az [5chan](/apps/5chan/) és a [Seedit](/apps/seedit/)         |
| Fő kompromisszum         | Offline is működik, és nem igényel hosztolást, de a hírfolyamok a végtelenségig nőnek, az idegenek pedig láthatatlanok maradnak | Nyitott közzététel és böngészőtámogatás, de internetet igényel, és csak a legfrissebb állapotot őrzi meg |
