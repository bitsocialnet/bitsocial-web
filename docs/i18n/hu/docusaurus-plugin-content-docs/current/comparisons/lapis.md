---
title: A Bitsocial és a Lapis Net
description: Hogyan viszonyul a Bitsocialhoz a Lapis Net, egy Kotlinban írt peer-to-peer közösségi protokoll olvasónkénti bizalmi pontszámokkal és Bitcoinnal támogatott láthatósággal.
---

# A Bitsocial és a Lapis Net

A [Lapis Net](https://net.lapisproject.dev/) Kotlinban, a JVM-re írt peer-to-peer
közösségihálózat-protokoll. Egymástól függetlenül jutott a Bitsocialéhoz közeli alapokra:
kulcspáralapú identitások, IPFS-stílusú tartalomtárolás és libp2p gossipsub. A kettő abban
különbözik, hová helyezi a spamszűrést és a tartalomválogatást. A Lapis minden olvasónak személyes
bizalmi gráfot ad, és engedi, hogy a Bitcoin- és Lightning-fizetések növeljék a láthatóságot; a
Bitsocial minden közösségre rábízza, mit lehet közzétenni.

A Lapis működő prototípus. A [tárolója](https://github.com/lapisproject-dev/Lapis-Net) szerint 2026
októberében még nem volt nyilvános hálózata, és két csomópont összekapcsolása kézi lépést igényelt.

## Hogyan működik a Lapis

- **Identitások.** Minden identitás egy secp256k1 kulcspár, amely kompatibilis a Bitcoin-kulcsokkal,
  és amelyhez a libp2p-társazonosítóhoz egy Ed25519 kulcs van kötve.
- **Tárolás és terjesztés.** A tartalmat a Nabu, egy libp2p-re épülő IPFS-implementáció (DHT és
  Bitswap) tárolja, terjesztése pedig libp2p gossipsubbal történik.
- **Pontozás.** Négy opcionális pontszám épül egy olyan magra, amely semleges marad a
  tartalomválogatás kérdésében:
  - Veritas, az egyes olvasók saját bizalmi gráfjából számított bizalmi háló
  - Virtus, idővel csökkenő láncon belüli vagy Lightning-fizetési igazolásokkal támogatott
    láthatóság
  - Karma, a Veritas alapján súlyozott ingyenes kedvelések
  - Madli, hírnévpontszám, amelyet a csomópontok egymás viselkedéséről vezetnek
- **Üzenetküldés.** A projekt része a végponttól végpontig titkosított közvetlen üzenetküldés, az
  egy-az-egyben hanghívás és egy e-mailhez hasonló aszinkron üzenetrendszer.
- **Kliensek.** Minden felhasználó JVM-csomópontot futtat. A referenciakliens egy webes felület,
  amelyet ez a helyi csomópont szolgál ki.

## Miben különböznek

### Ki szűri a spamet

A Lapis az olvasónál szűr. A tartalom terjed, majd az egyes olvasók bizalmi gráfja és az általuk
használt alkalmazás fizetési szabályai döntik el, mi kerül a felszínre. A Bitsocial a közösség
szintjén szűr: egy bejegyzésnek teljesítenie kell a közösség kihívását, mielőtt a közösségi
csomópont elfogadja, így az elutasított spam soha nem válik a közösség részévé. Lásd az
[Egyéni levélszemét-ellenes kihívások](/custom-challenges/) oldalt.

### Kié a hatalom

A Lapisban minden olvasó maga dönti el, kiben bízik, és az egyes alkalmazások üzemeltetője dönti el,
hogyan működik náluk a fizetett láthatóság. A Bitsocialban egy közösség tulajdonosa csak az adott
közösség szabályait határozza meg, és az alkalmazások döntik el, mit jelenítenek meg. Egyiküknek
sincs protokollszintű adminisztrátora.

### Gazdasági modell

A Lapis a láthatósági pontszámába beépíti a Bitcoin- és Lightning-fizetési igazolásokat. A Bitsocial
protokolljában nincs fizetési réteg; egy közösség a kihívásán keresztül követelhet meg fizetést vagy
tokent.

### Böngésző

A Bitsocial-alkalmazások peer-to-peer csomópontot futtathatnak egy hagyományos böngészőfülben. Lásd
a [Böngészős peer-to-peer](/browser-p2p/) oldalt. A Lapis böngészős felülete egy helyi oldal,
amelyet a felhasználó JVM-csomópontja szolgál ki.

### Hatókör

A Lapis egyben kínál közvetlen üzeneteket, hanghívásokat és levelezést. A Bitsocial a nyilvános
közösségekre összpontosít, és natív közvetlen üzenetküldés még nincs benne.

## Összehasonlítás

| Kérdés                   | Lapis Net                                                                                                    | Bitsocial                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Kategória                | Peer-to-peer közösségi protokoll (prototípus)                                                                | Peer-to-peer közösségi hálózat                                                                      |
| Identitás                | secp256k1 kulcspár hozzákötött Ed25519 társazonosítóval                                                      | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                             |
| Hol vannak a bejegyzések | Nabu-tárolás (IPFS libp2p-n) a részt vevő csomópontokon                                                      | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                  |
| Közösségek               | Nincs közösségi objektum; a tartalomválogatás olvasónként és alkalmazásonként történik                       | Elsőrangú objektumok, amelyek csomópontja elfogadja vagy elutasítja a bejegyzéseket                 |
| Spamvédelem              | Az olvasó bizalmi gráfja, fizetett láthatóság, Lightning-letét az első üzenetekhez                           | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                       |
| Moderálás                | Az egyes olvasók bizalmi gráfja; az alkalmazások üzemeltetői határozzák meg a fizetett láthatóság szabályait | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg |
| Gazdasági modell         | Bitcoin- és Lightning-fizetési igazolások a pontozásban                                                      | A protokollban nincs; egy kihívás megkövetelhet fizetést vagy tokent                                |
| Böngésző                 | JVM-csomópont által kiszolgált helyi webes felület                                                           | Peer-to-peer csomópont egy hagyományos böngészőfülben                                               |
| Hálózat                  | Prototípus nyilvános hálózat nélkül                                                                          | Működő hálózat olyan alkalmazásokkal, mint az [5chan](/apps/5chan/) és a [Seedit](/apps/seedit/)    |
| Fő kompromisszum         | Gazdag beépített hírnévrendszer és üzenetküldés, de még nincs nyilvános hálózat                              | Kisebb, böngészőben is futó mag, de nincs beépített hírnévrendszer vagy közvetlen üzenetküldés      |

## Működhetnének együtt?

A Bitsocial kihívásai tetszőleges kódok, így egy Lapis-stílusú bizalmi pontszámból is lehetne
kihívás. A beépített `whitelist` kihívás már most is képes URL-ekről beolvasni az engedélyezett
címek listáit. Egy szolgáltatás, amely közzétenné azokat a Bitsocial-címeket, amelyekben egy
Veritas-gráf megbízik, lehetővé tehetné, hogy ezek a szerzők egy közösségben kihagyják a CAPTCHA-t.
Ehhez szükség lenne egy módszerre, amely összekapcsol egy Lapis-identitást egy Bitsocial-címmel,
ilyen azonban ma nem létezik.
