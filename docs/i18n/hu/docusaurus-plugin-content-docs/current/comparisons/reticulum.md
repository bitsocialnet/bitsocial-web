---
title: A Bitsocial és a Reticulum
description: Hogyan viszonyul a Bitsocialhoz a Reticulum, a LoRa és más kis sávszélességű kapcsolatokra készült kriptográfiai hálózati protokollkészlet, és futhatna-e rajta a Bitsocial.
---

# A Bitsocial és a Reticulum

A [Reticulum](https://reticulum.network/) kriptográfiára épülő hálózati protokollkészlet, amellyel
bármilyen rendelkezésre álló átviteli közegen lehet hálózatot építeni: LoRa rádión, csomagrádión,
soros kapcsolaton, Wi-Fi-n, Etherneten, TCP-n, UDP-n vagy I2P-n. Azért kerül szóba a Bitsocial
mellett, mert mindkettő kiiktatja a középen álló céget. Ezt azonban különböző rétegekben teszik,
ezért nem versenytársai, hanem kiegészítői egymásnak.

## Különböző rétegek

A Reticulum a hálózati réteget váltja ki. Titkosított, útválasztható végpontokat ad az
alkalmazásoknak IP-címek, DNS, hitelesítésszolgáltatók és fiókok nélkül, és úgy tervezték, hogy
akár másodpercenként 5 bites sebességű, 500 bájtos MTU-jú kapcsolatokon is működőképes maradjon.
Bejegyzéseket, közösségeket vagy moderálást nem határoz meg; ezeket a ráépülő alkalmazások adják
hozzá.

A Bitsocial közösségi protokoll. Az IPFS/libp2p készleten fut hagyományos internetkapcsolatokon,
akár egy böngészőfülből is, és meghatározza a közösségeket, a közzétételeket és a közösségenkénti
spamellenes kihívásokat. Lásd a [Peer-to-peer protokoll](/peer-to-peer-protocol/) és a
[Böngészős peer-to-peer](/browser-p2p/) oldalt.

A Bitsocial protokollkészletében a Reticulum nagyjából ott kapna helyet, ahol a libp2p, nem pedig
ott, ahol maga a Bitsocial protokoll.

## Hogyan működik a Reticulum

- **Identitások.** Egy Reticulum-identitás 512 bites kulcskészlet: egy X25519 kulcs a titkosításhoz
  és egy Ed25519 kulcs az aláírásokhoz.
- **Célállomások.** Az alkalmazások célállomásokat hoznak létre, amelyek címe egy 16 bájtra
  csonkolt SHA-256 hash. A csomagok nem hordoznak forráscímet.
- **Bejelentések.** Egy célállomás egy bejelentés kiküldésével válik elérhetővé. A
  transzportcsomópontok továbbítják, és megjegyzik a visszafelé vezető következő ugrást, így
  egyetlen csomópontnak sem kell ismernie a teljes hálózat térképét.
- **Titkosítás.** A forgalom alapértelmezés szerint titkosított, efemer kulcsokkal és forward
  secrecy mellett.
- **LXMF.** Az [LXMF](https://github.com/markqvist/LXMF) üzenetküldési réteg aláírt üzeneteket,
  közvetlen kézbesítést, valamint az offline címzettek számára propagációs csomópontokon keresztüli
  tárolást és továbbítást ad hozzá.

Az így épülő alkalmazások közé tartozik az üzenetküldésre szolgáló
[Sideband](https://github.com/markqvist/Sideband), valamint az üzenetküldést és hosztolt oldalakat
kínáló [Nomad Network](https://github.com/markqvist/NomadNet). A Reticulum kézikönyve
[programlistát](https://reticulum.network/manual/software.html) is vezet.

## Összehasonlítás

| Kérdés             | Reticulum                                                                                                                      | Bitsocial                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Mi ez              | Hálózati protokollkészlet                                                                                                      | Peer-to-peer közösségi protokoll és alkalmazások                                                                                 |
| Mire tervezték     | Bármilyen átviteli közegre, egészen a lassú rádiókapcsolatokig                                                                 | Internetkapcsolatokra, a böngészőfüleket is beleértve                                                                            |
| Identitás          | X25519 és Ed25519 kulcskészlet                                                                                                 | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                                                          |
| Címek              | Egy identitás és egy alkalmazásnév hash-e                                                                                      | A közösség nyilvános kulcsának hash-e                                                                                            |
| Társ megtalálása   | A transzportcsomópontok által terjesztett bejelentések                                                                         | A HTTP-útválasztók szolgáltató társakat adnak vissza                                                                             |
| Közösségi funkciók | Az alkalmazások adják hozzá, például a Nomad Network                                                                           | Közösségek, bejegyzések, válaszok és moderálás a protokollban                                                                    |
| Spamvédelem        | Interfészenkénti bejelentési sebességkorlátok; LXMF proof-of-work bélyegek, amelyeket egy címzett vagy csomópont megkövetelhet | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                                                    |
| Offline kézbesítés | Az LXMF propagációs csomópontjai tárolják és továbbítják az üzeneteket                                                         | A társak továbbra is kiszolgálják a közösség legfrissebb állapotát; a közzétételhez a közösség csomópontjának online kell lennie |

## Futhatna-e a Bitsocial a Reticulumon?

Ma még nem. A Bitsocialnak nincs Reticulum-transzportja, és az adatmodellje internetes
sávszélességet feltételez: a kliens a társaktól tölti le a közösség metaadatait és a bejegyzések
tartalmát, és pubsub-üzeneteket vált velük, ami rosszul illik az 500 bájtos csomagokra épülő,
másodpercenként bitekben vagy kilobitekben mért átviteli sebességű kapcsolatokhoz.

A reális út szűkebb: egy olyan kliens, amely internetkapcsolat nélkül helyi mesh-hálózaton működik,
majd szinkronizál a tágabb Bitsocial-hálózattal, amikor elérhetővé válik egy internet-hozzáféréssel
rendelkező társ vagy átjáró. Ez nem a protokoll módosítása lenne, hanem egy új kliens és egy új híd,
és jelenleg nem szerepel az ütemtervben.

## Fejlesztőknek

A Reticulum a [Reticulum-licenc](https://reticulum.network/manual/license.html) alatt jelenik meg:
ez MIT-stílusú feltételekből és két korlátozásból áll. A szoftver nem használható emberek
ártására tervezett rendszerekben, sem MI- vagy gépi tanulási tanító-adathalmazok létrehozására.
Olvassa el, mielőtt Reticulum-kódot csomagol egy Bitsocial-alkalmazásba.

A referencia-implementáció [Pythonban készült](https://github.com/markqvist/Reticulum). A
Reticulum karbantartói arra figyelmeztetnek, hogy a Reticulum és az LXMF több nem hivatalos portja
gépi generálású, és olyan licencállításokat tartalmaz, amelyeket ők semmisnek tekintenek, ezért
részesítse előnyben a referencia-implementációt vagy a kézikönyvben felsorolt programokat.
