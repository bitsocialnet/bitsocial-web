---
title: A Bitsocial és az Urbit
description: Hogyan viszonyul a Bitsocial peer-to-peer közösségeihez az Urbit, a személyes szerverek hálózata, Ethereum-alapú Urbit ID-kkal és a Tlon Messengerben a gazdájuk által hosztolt csoportokkal.
---

# A Bitsocial és az Urbit

Az [Urbit](https://urbit.org/) személyes szerverek hálózata. Minden felhasználónak van egy mindig
bekapcsolt számítógépe, amelyet hajónak neveznek. A hajó az Urbit saját operációs rendszerét (Arvo)
futtatja, amely az Urbit saját nyelvein (Nock és Hoon) íródott, és egy Urbit ID azonosítja. Az Urbit
fő közösségi alkalmazása a [Tlon Messenger](https://tlon.io/), amelyet a Tlon készített, az a cég,
amelyet 2013-ban az Urbit fejlesztésére alapítottak.

Az Urbit a teljes számítástechnikai stack lecserélésére törekszik, ezért jóval tágabb projekt, mint a
Bitsocial. A közösségi rétege azonban a Bitsocialéhoz hasonló modellt követ: egy közösség a
tulajdonosa csomópontján él, és ez a csomópont dönti el, mi kerülhet be. A kettő abban különbözik,
kinek kell szervert futtatnia, és hogyan tartják távol a spamet.

## Hogyan működik az Urbit

- **Urbit ID-k.** Minden hajónak van egy Urbit ID-ja: egy szám, amely kiejthető névként jelenik
  meg, például `~sampel-palnet`. Az 1. rétegbeli ID-k NFT-k, amelyek tulajdonjogát és hálózati
  nyilvános kulcsait az Ethereumon futó Azimuth-szerződések rögzítik. A díjak csökkentésére 2021-ben
  bevezetett 2. rétegbeli ID-k egy „naiv rollupot” használnak: tranzakcióikat kötegekben teszik
  közzé az Ethereumon, a tulajdonjogukat azonban nem tárolja az Azimuth-szerződés, hanem minden hajó
  helyben számítja ki. Az [Urbit ID dokumentációja](https://docs.urbit.org/urbit-id/what-is-urbit-id)
  és a [Get on Urbit](https://docs.urbit.org/get-on-urbit) szerint a Tlon üzemeltet egy rollert,
  amelyet bárki ingyen használhat.
- **Rögzített hierarchia.** A címtérben 256 galaxis, 65 536 csillag és mintegy 4 milliárd bolygó
  van a mindennapi használatra. A galaxisok csillagokat bocsátanak ki, a csillagok bolygókat, és
  minden bolygó holdakat bocsáthat ki a saját eszközei számára. Az üstökösök ingyenes ID-k, amelyeket
  egy hajó saját magának generál, és amelyek soha nem kerülnek a blokkláncra. A galaxisok
  tulajdonosai alkotják a Galactic Senate-et, amely az Azimuth-szerződések frissítéseiről szavaz, és
  megválasztja az Urbit Foundation igazgatóságát.
- **Hálózat.** A hajók titkosított csomagokat cserélnek egymással peer-to-peer módon. A hálózati
  protokoll 2026 júliusa óta a [Directed Messaging](https://urbit.org/blog/directed-messaging), a
  régebbi Ames protokoll tartalomközpontú újraírása. A
  [Directed Messaging-tanulmány](https://urbitsystems.tech/article/v03-i01/directed-messaging)
  szerint a társak megtalálását a galaxisok végzik: mindegyik nyilvántartja, hol vannak az alatta
  lévő hajók, és addig továbbítja nekik a csomagokat, amíg a két hajó közvetlenül el nem éri
  egymást, vagy ameddig egy tűzfal ezt megakadályozza.
- **Csoportok.** A Tlon Messengerben a csoportot a létrehozójának hajója hosztolja. A
  [Tlon GYIK](https://tlon.io/posts/faq) szerint a tagok a gazdának küldik az üzeneteiket, a gazda
  minden tag hajójára eljuttatja őket, és minden tag hajója saját másolatot őriz. A gazda irányítja
  a szerepköröket, a csatornákat és a belépést. Egy csoport lehet nyilvános, privát vagy titkos, és
  [kitilthat egyes hajókat vagy teljes ID-rangokat](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  A csatornák chatek, jegyzetfüzetek vagy kép- és linkgyűjtemények lehetnek.
- **Hosztolás.** A Tlonnál regisztráló új felhasználó egy Tlon által futtatott hajót kap, amelynek
  kulcsait a Tlon őrzi. A felhasználó exportálhatja a hajót és annak master ticketjét, és máshol
  futtathatja: egy [Native Planet](https://www.nativeplanet.io/) eszközön, vagy a Vere
  futtatókörnyezettel Linuxon, macOS-en vagy Windowson. A hajók egyelőre nem tudnak közvetlenül
  nagy fájlokat tárolni, ezért a Tlon Messenger a képeket és más médiát S3-kompatibilis
  felhőtárhelyen helyezi el.

## Miben különböznek

### Kinek kell szervert futtatnia

Az Urbiton minden résztvevő szerver. A Tlon alkalmazásai a felhasználó saját hajójának
felhasználói felületei, és még egy csoport olvasása is a hajón keresztül történik. Akik nem
futtatnak maguk hajót, bérelnek egyet, így egy tárhelyszolgáltató ismét a képbe kerül: a Tlon őrzi
a hosztolt felhasználók kulcsait, és karbantartás céljából korlátozott hozzáférést tart fenn, bár a
felhasználók az egész hajójukkal együtt távozhatnak.

A Bitsocialban csak a közösségek tulajdonosainak van szükségük mindig bekapcsolt csomópontra. Az
olvasók és a közzétevők egy böngészőfülben is futtathatnak peer-to-peer csomópontot, a fiókjuk
pedig egy kulcspár, amelyet az alkalmazás tárol. Lásd a [Böngészős peer-to-peer](/browser-p2p/)
oldalt. Ha valaki mégis hosztolt csomópontot használ, a Bitsocial kialakításának célja, hogy a
rendelkezésre állást úgy delegálhassa, hogy közben nem adja ki a kezéből az identitása feletti
rendelkezést. Lásd az [Identitás és közösségi tulajdon](/identity-and-ownership/) oldalt.

### A közösség gazdája

Ebben áll a kettő a legközelebb egymáshoz. Egy Tlon-csoport és egy Bitsocial-közösség egyaránt a
tulajdonosa csomópontján él. A gazda dönti el, ki tehet közzé, alkalmazza a moderálást és
terjeszti az eredményt, és egyik protokoll sem helyez moderátort a gazda fölé. Mindkettőben online
kell lennie a gazdának. A Tlon GYIK-je szerint ha a gazda offline állapotba kerül, „a csoport is
leáll vele együtt”, egy Bitsocial-közösség pedig nem tud új bejegyzéseket fogadni, amíg a
csomópontja offline.

A tartalmat eltérően tárolják. Minden tag hajója őrzi a csoport előzményeinek egy másolatát, így a
tagok akkor is olvashatják, amit már megkaptak, amikor a gazda nem elérhető. Egy Bitsocial-olvasó
a közösség legfrissebb állapotát a közösség csomópontjától vagy a közösséget seedelő társaktól kéri
le, így egy offline közösség olvasható marad, amíg a társaknál megvan, de a hálózat csak a
legfrissebb állapotot őrzi meg.

Egy Tlon-csoportnak taglistája is van, és a gazdája csak meghívással elérhetővé teheti. Egy
Bitsocial-közösségnek nincs tagsága: bárki olvashatja, és bárki megpróbálhat közzétenni benne, a
kihívásának megfelelően.

### Spam és identitás

Az Urbit úgy küzd a spam ellen, hogy szűkössé teszi az identitást. A bolygók száma rögzített, és
mindegyiket egy csillag bocsátja ki. Az ingyenes üstökösök megkerülik ezt a szűkösséget, ezért azok
a csoportok, amelyek azt akarják, hogy a szűkösség érvényesüljön, kizárják őket: az Urbit
dokumentációja megjegyzi, hogy egyes csoportok nem fogadnak be üstökösöket, egy Tlon-csoport pedig
egyetlen beállítással kitilthatja a teljes üstökösrangot. Ha az üstökösök ki vannak zárva, egy
kitiltott felhasználónak egy másik bolygóra van szüksége egy csillag tulajdonosától ahhoz, hogy
visszatérhessen. A hírnév a hierarchiát is követheti: az Azimuth tartalmaz egy
Censures-szerződést, amellyel a galaxisok és a csillagok megjelölhetnek ID-ket. Mivel a szűkösség a
címtérbe van beépítve, minden olyan csoportban ugyanúgy működik, amely kizárja az üstökösöket.

A Bitsocial-identitások ingyenes kulcspárok. Minden közösség maga választja meg a kihívását egy
bejegyzés elfogadása előtt, például captchát, fizetést, tokenegyenleget vagy engedélyezési listát,
és más közösségek másként dönthetnek. Lásd az
[Egyéni levélszemét-ellenes kihívások](/custom-challenges/) oldalt.

### Blokklánc és irányítás

Az Urbit identitásrétege az Ethereumtól függ. Az Azimuth-szerződések rögzítik az 1. rétegbeli
tulajdonjogot és a hálózati kulcsokat, a 2. rétegbeli tranzakciókat kötegekben teszik közzé az
Ethereumon, a Galactic Senate pedig frissítheti az Azimuthot irányító szerződést. Ugyanaz a 256
galaxis végzi a társak megtalálását és a forgalom továbbítását is, így egy rögzített identitáskör
hordozza egyszerre az irányítást és a hálózati útválasztás egy részét.

A Bitsocial-identitások regisztrációt nem igénylő kulcspárok. A `.bso` és `.eth` nevek opcionális
álnevek, amelyek ezekre oldódnak fel. A társak megtalálása HTTP-útválasztókon keresztül történik,
amelyek csak szolgáltatói címeket adnak vissza; bárki futtathat ilyet, és a kliensek a
konfigurációjuk módosításával válthatnak útválasztót.

### Hatókör

Az Urbit általános célú számítógép. Egy hajó hosztolhat Git-távtárolót, személyes tudásbázist vagy
MI-ügynököket, és a Tlon Messenger csak egy program a sok közül. Az Urbitra való fejlesztés
többnyire Hoon-alkalmazások írását jelenti az Arvóhoz. A Bitsocial a nyilvános közösségek
protokollja, olyan alkalmazásokkal, mint az [5chan](/apps/5chan/) és a [Seedit](/apps/seedit/). A
meglévő stacken (libp2p, IPFS és a böngésző) fut, ahelyett hogy lecserélné, és a kliensei
hagyományos webes eszközökkel készülnek. Lásd az [Építsen saját klienst](/build-your-own-client/)
oldalt.

### Privát üzenetek

Ebben az Urbit az erősebb. A közvetlen üzenetek egyik hajóról egyenesen a másikra jutnak, a hajók
közötti teljes forgalom titkosított, a csoportok pedig lehetnek privátok vagy titkosak. A Tlon
megjegyzi, hogy az üzenetek átvitel közben titkosítottak, de a hajón titkosítatlanul tárolódnak. A
Bitsocial a nyilvános közösségekre összpontosít, és natív közvetlen üzenetküldés még nincs benne.

## A projekt állapota

Az Urbit viharos időszakon ment át. 2024 augusztusában az Urbit Foundation, az alapfejlesztést
irányító nonprofit szervezet, elbocsátotta ügyvezető igazgatóját; az alapító Curtis Yarvin formális
cím nélkül tért vissza, hogy a stratégiát vezesse, több alapfejlesztő távozott, és az alapítvány
pénze már csak hónapokra volt elég – számolt be a
[CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin azt javasolta, hogy az Azimuth költözzön át egy meglévő Ethereum 2. rétegbeli hálózatra,
valószínűleg a Base-re, és bocsássanak ki bolygókra váltható, helyettesíthető „vízum”-tokeneket. Az
Urbit [ID-dokumentációja](https://docs.urbit.org/urbit-id/what-is-urbit-id) 2026 októberében még
mindig az Ethereumon futó, naiv rollupot használó Azimuthot írja le. 2025 októberében a Galactic
Senate leváltotta az alapítvány igazgatóságát, az új igazgatóság pedig új ügyvezető igazgatót
nevezett ki ([bejelentés](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

A fejlesztés folytatódik. A Directed Messaging a 408k kiadással élesedett 2026. július 14-én. A
Tlon Messenger 2026 júniusában
[várólista nélkül megnyitotta a nyilvános regisztrációt](https://urbit.org/blog/this-month-in-urbit-june-2026),
a Tlon pedig ma már olyan helyként mutatja be magát, ahol emberek és MI-ügynökök dolgoznak együtt.

## Összehasonlítás

| Kérdés                   | Urbit                                                                                                           | Bitsocial                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Kategória                | Személyes szerverek hálózata és operációs rendszer                                                              | Peer-to-peer közösségi hálózat                                                                                      |
| Identitás                | Urbit ID-k: mintegy 4 milliárd bolygó az Ethereumon vagy annak 2. rétegbeli rollupján, plusz ingyenes üstökösök | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                                             |
| Ki futtat szervert       | Minden felhasználó, a saját vagy egy hosztolt hajón                                                             | A közösségek tulajdonosai; az olvasók és a közzétevők böngészőfület is használhatnak                                |
| Hol vannak a bejegyzések | A csoport gazdájának hajóján, valamint másolatként minden tag hajóján                                           | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                                  |
| Közösségek               | A létrehozójuk hajója által hosztolt csoportok taglistákkal                                                     | Elsőrangú objektumok, amelyek csomópontja elfogadja vagy elutasítja a bejegyzéseket                                 |
| Spamvédelem              | Csillagok által kibocsátott szűkös ID-k; a csoportok hajókat vagy teljes rangokat tiltanak ki                   | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                                       |
| Moderálás                | A csoport gazdájának szerepkörei és kitiltásai                                                                  | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg                 |
| Társak megtalálása       | A galaxisok nyilvántartják az alattuk lévő hajókat, és továbbítják a forgalmukat                                | A HTTP-útválasztók szolgáltató társakat adnak vissza, és nem tárolnak tartalmat                                     |
| Irányítás                | A 256 galaxisból álló Galactic Senate szavaz az Azimuth frissítéseiről                                          | Nincs protokollszintű hatóság az identitások vagy a közösségek felett                                               |
| Privát üzenetek          | Titkosított közvetlen üzenetek és csak meghívással elérhető csoportok                                           | Nyilvános közösségek; natív közvetlen üzenetküldés még nincs                                                        |
| Fő kompromisszum         | Teljes személyes számítógép privát csoportokkal, de minden felhasználónak mindig bekapcsolt hajó kell           | Ingyenes identitások és böngészős hozzáférés, de nincs privát üzenetküldés, és csak a legfrissebb állapot marad meg |
