---
title: A Bitsocial és a Quorum
description: Hogyan viszonyul a Bitsocial nyilvános peer-to-peer közösségeihez a Quorum, a Quilibrium végpontok között titkosított csoportos üzenetküldője, Discord-stílusú Space-ekkel.
---

# A Bitsocial és a Quorum

A [Quorum](https://www.quorummessenger.com/) egy csoportos üzenetküldő, amelyet a Quilibrium Inc.
épített a saját [Quilibrium](https://quilibrium.com/) hálózatára. A Discordhoz hasonlóan épül fel:
vannak benne Space-ek, csatornák, szerepkörök és közvetlen üzenetek, az üzenetei pedig végpontok
között titkosítottak. Azért kerül szóba a Bitsocial mellett, mert mindkettő peer-to-peer és
cenzúraálló rendszerként írja le magát, olyan csoportokkal, amelyek maguk határozzák meg a
szabályaikat. A céljuk azonban eltér: a Quorum a privát csoportos csevegést célozza, a Bitsocial
pedig a nyilvános közösségeket, amelyeket bárki olvashat.

A Quilibrium a felhőplatformok decentralizált alternatívájaként írja le magát: csomópontok
hálózataként, amelyek egy titkosított hipergráfban tárolják az adatokat, és egy általa Proof of
Meaningful Work néven emlegetett konszenzus révén egyeznek meg annak állapotáról. A csomópontok
QUIL-t szereznek; ez a hálózat tokenje, amellyel a használati díjakat fizetik. A
[Quilibrium története](https://docs.quilibrium.com/docs/discover/q-story/) szerint a Quorum
2018-ban Howler néven indult, egy privát Discord-alternatíva ötleteként, és ez lett az első
alkalmazás, amely élesben elindult a Quilibriumon. A Cassie Heart által alapított Quilibrium Inc.
fejleszti a protokollt, és a Quorumot az egyik menedzselt szolgáltatásaként kínálja
([GYIK](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Hogyan működik a Quorum

Az alábbi részletek a Quorum klienseinek 2026 októberi állapotú forráskódjából származnak: a webes
és asztali alkalmazásoké a [quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop), a
mobilé a [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile) tárolóban található.

- **Identitások.** A felhasználó fő identitása egy Ed448 kulcskészlet, és minden eszköz saját X448
  és Ed448 kulcsokat kap. A böngészőben a kulcsokat azonosítókulcs (passkey) védi. A címek `Qm`
  kezdetű hash-ek, és a felhasználók a Quilibrium névszolgáltatásából származó felhasználónevet is
  megjeleníthetnek.
- **Titkosítás.** A közvetlen üzenetek az eszközök között Double Ratchetet használnak. Egy Space
  egyetlen Triple Ratchet munkamenetet oszt meg a tagjai között, akik Space-specifikus kulcsokkal
  írják alá az üzeneteiket. Minden Space titkosított, és a Quorum szerint az üzenetközvetítési
  megoldása megakadályozza, hogy az üzeneteket továbbító szolgáltatás összekapcsolja a feladókat és a
  címzetteket.
- **Csatlakozás.** A Space-ekbe meghívólinkekkel lehet belépni. Az egyszer használatos link az
  URL-ben hordozza a csatlakozáshoz szükséges kulcsokat; a nyilvános link a Quorum szolgáltatástól
  kéri le őket, a nyilvános Space-ek pedig egy kereshető jegyzékben is szerepelhetnek.
- **Adatátvitel.** A webes, az asztali és a mobilkliens egyaránt HTTPS-en és egy WebSocketen
  keresztül kapcsolódik egyetlen szolgáltatáshoz, az
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7)
  címhez. Ez továbbítja a titkosított üzeneteket minden tag postafiókjába, és tárolja a felhasználói
  regisztrációkat, az egyes Space-ek titkosított manifesztjét (csatornák, szerepkörök, emojik), a
  meghívókhoz tartozó adatokat, a nyilvános jegyzéket és az opcionális, titkosított
  beállítás-szinkronizálást. A Quilibrium csomópontszoftverében van egy ugyanilyen felépítésű
  postafiók- és hubszolgáltatás, de sem a kliensek, sem a Quilibrium dokumentációja nem árulja el,
  hogyan illeszkedik ez a szolgáltatás a hálózatba.
- **Előzmények.** Minden tag kliense saját másolatot őriz a Space-ről a helyi tárhelyen. A webes és
  asztali kliens úgy pótolja az előzményeket, hogy egy online tagot kér meg a szinkronizálásra; a
  mobilkliens egy naplót játszik vissza, amelyet a szolgáltatás minden Space-hez vezet, így akkor is
  be tudja hozni a lemaradását, ha egyetlen másik tag sincs online.
- **Moderálás.** A szerepkörök törlésre, kitűzésre, némításra és `@everyone` említésekre adnak
  jogot. Minden tag kliense ellenőrzi minden moderálási művelet aláírását, és csak akkor alkalmazza,
  ha az aláírónak megvan a megfelelő szerepköre. A tulajdonos kirúghat egy tagot, ami lecseréli a
  Space kulcsait, így a kirúgott tag nem tudja olvasni az új üzeneteket. Egy Space megkövetelheti az
  aláírt üzeneteket, vagy engedheti, hogy a tagok aláíratlan, letagadható üzeneteket küldjenek.
- **Kód.** A webes és asztali kliens az AGPL-3.0, a mobilkliens a GPL-3.0 licenc alatt érhető el. A
  mobilkliensben kriptotárca, Farcaster-integráció és Apex is van; ez utóbbi egy fizetős előfizetés,
  amelyet lentebb ismertetünk.

## Miben különböznek

### Privát csoportok és nyilvános közösségek

Egy Quorum-Space tagok csoportja: csak azok olvashatják, akiknél megvannak a kulcsai, és a
csatlakozáshoz meghívólink kell. A nyilvános link bárkit beenged, de csak csatlakozás után. Egy
Bitsocial-közösségnek nincs tagsága. Bárki olvashatja, bármelyik alkalmazásból, csatlakozás nélkül,
és bárki megpróbálhat közzétenni benne, a közösség kihívásának megfelelően.

### Mi tartja online a csoportot

Egy Quorum-Space-nek nincs gazdacsomópontja. A tagok a Quorum szolgáltatáson keresztül küldik az
üzeneteket, minden tag kliense megőriz egy másolatot, és a tulajdonosnak nem kell online lennie
ahhoz, hogy a többiek beszélgethessenek. Egy Bitsocial-közösség a tulajdonosa csomópontján él, amely
minden bejegyzést elfogad vagy elutasít, és közzéteszi a közösség legfrissebb állapotát. A közösség
olvasható marad, amíg társak seedelik, de nem tud új bejegyzéseket fogadni, amíg a csomópontja
offline. Lásd a [Peer-to-peer protokoll](/peer-to-peer-protocol/) oldalt.

### Ki érvényesíti a szabályokat

A Quorumban a szabályok érvényesítése a peremen történik. Minden tag kliense maga dönti el az aláíró
szerepköre alapján, hogy alkalmaz-e egy törlést, kitűzést vagy némítást, a kirúgás pedig úgy
működik, hogy mindenki más új kulcsokra áll át. A Bitsocialban a szabályok érvényesítése a közösség
csomópontján történik: az a bejegyzés, amely nem felel meg a közösség kihívásának vagy szabályainak,
soha nem válik a közösség részévé. Lásd a
[Helyi moderálás, nem globális tiltások](/local-moderation/) oldalt.

### Spamvédelem

A Quorum főként meghívásokkal tartja távol a spamet. Az egyszer használatos link egy embert enged
be, a nyilvános link bárkit, akinél megvan, a tulajdonos pedig utólag kirúghat tagokat és
lecserélheti a kulcsokat; a kliens emellett a saját küldési sebességét is korlátozza. A
Bitsocial-identitások ingyenes kulcspárok, ezért minden közösség maga választja meg, milyen kihívást
futtat egy bejegyzés elfogadása előtt, például captchát, fizetést, tokenegyenleget vagy
engedélyezési listát. Lásd az [Egyéni levélszemét-ellenes kihívások](/custom-challenges/) oldalt.

### A kliens és a hálózat

Egy Quorum-alkalmazás a Quorum szolgáltatás kliense, amelyet a Quilibrium Inc. üzemeltet. Az
alkalmazások maguk nem csatlakoznak peer-to-peer hálózathoz, így egy Space elérése ettől az egyetlen
végponttól függ. Mögötte a Quilibrium önálló hálózat: 2026 októberében az
[explorer felülete](https://dashboard.quilibrium.com/) 114 elérhető társat és 181 provert mutatott 99
shardon.

Egy Bitsocial webalkalmazás libp2p-csomópontot futtathat a böngészőfülben, a közösségek tartalmát
társaktól kérheti le, és gossipsubon keresztül tehet közzé. A társak megtalálása HTTP-útválasztókon
keresztül történik, amelyek csak szolgáltatói címeket adnak vissza; bárki futtathat ilyet, és a
kliensek a konfigurációjuk módosításával válthatnak útválasztót. Lásd a
[Böngészős peer-to-peer](/browser-p2p/) oldalt.

### Gazdaság

A Quilibrium középpontjában egy token áll. A QUIL-t a csomópontok bányásszák, ezzel fizetik a
hálózati díjakat, és egy becsomagolt változata, a wQUIL, az Ethereumon forog. Maga a Quorum ingyenes,
és nem kér fizetést vagy telefonszámot. Az opcionális Apex-előfizetése
[havi 5 dollárba kerül](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
amelyet wQUIL-ben, SNAP-ben vagy USDC-ben kell fizetni az Ethereumon, és amely a Quilibrium Inc. és
az előfizető által kiválasztott négy Space között oszlik meg. A Bitsocial protokolljában nincs
fizetési réteg; egy közösség a kihívásán keresztül fizetést vagy tokent követelhet meg.

### Privát üzenetek

Ebben a Quorum az erősebb. A közvetlen üzenetek és a Space-ek üzenetei végpontok között
titkosítottak, forward secrecy mellett, és az üzenetek tartalma csak titkosított szövegként jut el a
Quorum szolgáltatáshoz. A Bitsocial a nyilvános közösségekre összpontosít, és natív közvetlen
üzenetküldés még nincs benne. Egy Bitsocial-bejegyzés a közösség csomópontjának kulcsára titkosítva
halad át a pubsubon, de az elfogadása után nyilvános.

## A projekt állapota

2026 októberében a Quorum tárolója bétának nevezte a webalkalmazást, a Quorum weboldala pedig még
mindig „hamarosan” jelzéssel tüntette fel a Google Play- és App Store-alkalmazásokat. A két kliens is
eltér egymástól: a mobilalkalmazásban megvannak a tárca-, Farcaster- és Apex-funkciók, míg a webes és
asztali kliens a Wallet és Farcaster oldalait „hamarosan” jelzéssel mutatja, és a kettő eltérő módon
pótolja a Space előzményeiben lévő lemaradást.

A Quilibrium mainnetje 2025. szeptember 30-án érte el a 2.1-es verziót, amikor a hálózat egy leállás
után újraindult ([bejelentés](https://x.com/QuilibriumInc/status/1973082817236984270)). 2026-ban a
csomópontot újraírták Rustban, posztkvantum aláírásokkal a konszenzushoz és egy olyan átviteli
protokollal, amelyet a régebbi csomópontok nem beszélnek. A dokumentáció egyes részei a tervet írják
le, nem a futó kódot: leírják a
[mixnet-útválasztást](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/),
de a 2.1.0.25-ös csomópontban a mixnet-szolgáltatás egy
[csonk](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31),
amely keverés nélkül fogadja el az üzeneteket.

## Összehasonlítás

| Kérdés                        | Quorum                                                                                          | Bitsocial                                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Kategória                     | Végpontok között titkosított csoportos üzenetküldő a Quilibrium hálózaton                       | Peer-to-peer közösségi hálózat                                                                                      |
| Identitás                     | Ed448 fő kulcskészlet és eszközönkénti kulcsok, azonosítókulccsal védve                         | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                                             |
| Ki olvashatja                 | A Space kulcsaival rendelkező tagok                                                             | Bárki, bármelyik alkalmazásból                                                                                      |
| Hol vannak az üzenetek        | Minden tag eszközén; a mobilkliens a Quorum szolgáltatás által vezetett naplót is visszajátssza | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                                  |
| Mihez kapcsolódnak a kliensek | A Quorum szolgáltatáshoz az `api.quorummessenger.com` címen                                     | Társakhoz libp2p-n keresztül, akár böngészőfülből is                                                                |
| Közösségek                    | Space-ek csatornákkal, szerepkörökkel és meghívólinkekkel                                       | Elsőrangú objektumok, amelyek csomópontja elfogadja vagy elutasítja a bejegyzéseket                                 |
| Spamvédelem                   | Meghívólinkek, kirúgás kulcscserével, kliensoldali sebességkorlátok                             | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                                       |
| Moderálás                     | Minden tag kliense által érvényesített szerepkörök; a tulajdonos rúg ki                         | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg                 |
| Privát üzenetek               | Végpontok között titkosított közvetlen üzenetek                                                 | Nyilvános közösségek; natív közvetlen üzenetküldés még nincs                                                        |
| Gazdaság                      | QUIL hálózati token; opcionális, havi 5 dolláros Apex-előfizetés                                | Nincs a protokollban; egy kihívás megkövetelhet fizetést vagy tokent                                                |
| Fő kompromisszum              | Privát, titkosított csoportok, de minden kliens egyetlen szolgáltatástól függ                   | Ingyenes identitások és böngészős hozzáférés, de nincs privát üzenetküldés, és csak a legfrissebb állapot marad meg |
