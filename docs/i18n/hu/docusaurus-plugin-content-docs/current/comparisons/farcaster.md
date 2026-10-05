---
title: A Bitsocial és a Farcaster
description: Hogyan viszonyul a Farcaster a láncon tárolt fiókjaival, a tárhelybérlettel és a Snapchain validátorhálózattal a Bitsocial peer-to-peer közösségeihez.
---

# A Bitsocial és a Farcaster

A [Farcaster](https://docs.farcaster.xyz/) az identitást blokkláncon, a közösségi adatokat pedig
azon kívül tárolja. A fiókok, az alkalmazáskulcsok és a tárhelyért járó fizetések szerződésekben
élnek az OP Mainneten, amely egy Ethereum 2. rétegbeli hálózat. A castoknak nevezett bejegyzéseket,
valamint a követéseket és a reakciókat aláírt üzenetekként a
[Snapchain](https://snapchain.farcaster.xyz/) tárolja; ez egy blokkláncszerű hálózat, amely 2025-ben
váltotta fel a Farcaster korábbi Hub-hálózatát.

## Hogyan működik a Farcaster

- **Fiókok.** A fiók egy numerikus Farcaster-azonosító, amely egy Ethereum-cím tulajdonában van; ez
  a cím helyreállítási címet is beállíthat. Az alkalmazások delegált, a láncon regisztrált
  alkalmazáskulcsokkal tesznek közzé; egy alkalmazáskulcs nem veheti át a fiók irányítását.
- **Tárhelybérlet.** Minden fiók tárhelyegységeket bérel, jelenleg egységenként évi 0,20 dollárért.
  Egy 2025 júliusa óta bérelt egység 100 castot tárol; ezen felül a legrégebbi castokat törlik. A
  sebességkorlátok a bérelt tárhellyel arányosan nőnek.
- **Snapchain.** A validátorok Tendermint-stílusú konszenzussal rendezik blokkokba az üzeneteket, és
  minden teljes csomópont a teljes hálózat adatait tárolja. A
  [csomóponti útmutató](https://snapchain.farcaster.xyz/getting-started) szerint a csomópontoknak
  nagyjából 16 GB RAM-ra és 2 TB tárhelyre van szükségük.
- **Nevek.** Az alapértelmezett felhasználónevek, az úgynevezett fname-ek, ingyenesek, és a
  Farcaster saját névszervere adja ki őket, amely
  [vissza is vonhatja azokat](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). A
  felhasználók helyettük Ethereumon regisztrált `.eth` nevet is használhatnak.
- **Csatornák.** A tematikus csatornák a Farcaster-kliens kísérleti funkciói. A csatornákban
  közzétett castok protokolladatok, a csatornák metaadatait, követéseit és moderálását azonban
  [a kliens tárolja](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Olvasás.** Az alkalmazások egy saját üzemeltetésű Snapchain-csomóponton vagy egy menedzselt
  szolgáltatón, általában a Neynaron keresztül olvasnak.

## Miben különböznek

### Blokkláncok és validátorok

A Farcaster a fiókok és a fizetések tekintetében az OP Mainnettől, az összes közösségi adat sorba
rendezése tekintetében pedig a Snapchaintől, egy blokkláncszerű hálózattól függ. A Snapchain
validátorköre engedélyhez kötött. A fehér könyve szerint a cenzúra nagyjából tíz, földrajzilag
elosztott validátorral válik nehézzé; 2026 októberében a
[validátorlistája](https://snapchain.farcaster.xyz/validators) ennél rövidebb volt, és a kulcsok
többsége a Neynaré volt, amely 2026 januárjában
[felvásárolta a Farcastert](https://neynar.com/blog/neynar-is-acquiring-farcaster). A Bitsocialban
nincs lánc, nincsenek validátorok, és nincs konszenzus.

### Fizetés a közzétételért

Minden Farcaster-fiók tárhelybérletet fizet, és a tárhely korlátozza, hogy a hálózat mennyit őriz
meg egy fiók előzményeiből. A Bitsocialban a közzététel protokollszinten semmibe sem kerül; minden
közösség maga dönti el, hogy captchát, fizetést, tokent vagy valami mást követel-e meg. Lásd az
[Egyéni levélszemét-ellenes kihívások](/custom-challenges/) oldalt.

### Közösségek

A Farcaster csatornái kliensfunkciók: a kliens tárolja a metaadataikat és érvényesíti a csatornák
moderálását, így egy csatornában letiltott cast a hálózaton érvényes maradhat, és más
alkalmazásokban látható lehet. A Bitsocialban a közösségek saját kulcspárral rendelkező
protokollobjektumok, és a közösség csomópontja fogadja el vagy utasítja el a bejegyzéseket.

### Az infrastruktúra üzemeltetése

Egy Farcaster-csomópont a teljes hálózatot tárolja, így a tárhelyigénye az összes tevékenységgel
együtt nő; a Farcaster előrejelzése szerint a növekedés a legnagyobb felhős lemezek méretéhez
közelít. Egy Bitsocial-közösségi csomópont csak a saját közösségeit tárolja, és fogyasztói hardveren
fut.

### Böngésző

Egy böngészőben futó Farcaster-alkalmazás egy csomópont vagy szolgáltató HTTP-kliense. Egy
Bitsocial-webalkalmazás peer-to-peer csomópontot futtathat a böngészőfülben. Lásd a
[Böngészős peer-to-peer](/browser-p2p/) oldalt.

## Összehasonlítás

| Kérdés                   | Farcaster                                                                                 | Bitsocial                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Kategória                | Láncon tárolt identitás, validátorok által sorba rendezett közösségi adatokkal            | Peer-to-peer közösségi hálózat                                                                               |
| Identitás                | Ethereum-cím tulajdonában lévő Farcaster-azonosító, delegált alkalmazáskulcsokkal         | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                                      |
| Hol vannak a bejegyzések | A Snapchainen, minden teljes csomóponton replikálva, a fizetett tárhely keretein belül    | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                           |
| Ki tartja online         | A Snapchain validátorai és a csomópontok üzemeltetői                                      | A közösség tulajdonosának csomópontja és a segítő seederek                                                   |
| Közösségek               | A Farcaster-kliens által kezelt kísérleti csatornák                                       | Elsőrangú objektumok, amelyek csomópontja elfogadja vagy elutasítja a bejegyzéseket                          |
| Spamvédelem              | Tárhelybérlet és sebességkorlátok, valamint alkalmazásszintű spamcímkék                   | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                                |
| Moderálás                | Csatornagazdák a kliensben, alkalmazásszűrők, validátorszintű cenzúrakockázat             | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg          |
| Nevek                    | A Farcaster által visszavonható ingyenes fname-ek vagy `.eth` nevek                       | Kulcsokra feloldódó `.bso` és `.eth` nevek                                                                   |
| Böngésző                 | Egy csomópont vagy szolgáltató HTTP-kliense                                               | Peer-to-peer csomópont egy hagyományos böngészőfülben                                                        |
| Fő kompromisszum         | Egyetlen konzisztens globális adathalmaz, de bérleti díj, blokkláncok és kis validátorkör | Nincsenek díjak és láncok, de nincs globális adathalmaz, és a régi tartalom nem marad meg garantáltan örökre |
