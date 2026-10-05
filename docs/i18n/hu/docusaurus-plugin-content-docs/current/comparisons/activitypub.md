---
title: A Bitsocial és az ActivityPub
description: Hogyan viszonyul a Fediverse, a mikroblogolásra szolgáló Mastodonnal és a Reddit-stílusú közösségeket kínáló Lemmyvel, a Bitsocial peer-to-peer közösségeihez.
---

# A Bitsocial és az ActivityPub

Az [ActivityPub](https://www.w3.org/TR/activitypub/) a Fediverse alapjául szolgáló W3C-szabvány. A
felhasználók kiválasztanak egy szervert, úgynevezett példányt, amely a fiókjukat hosztolja, a
szerverek pedig bejegyzéseket cserélnek egymással. A legismertebb mikroblog-szoftvere a
[Mastodon](https://joinmastodon.org/); a [Lemmy](https://join-lemmy.org/) tematikus közösségekből
felépülő, Reddit-stílusú linkgyűjtő és fórum, ezért ez áll a Fediverse-ben a legközelebb az olyan
Bitsocial-alkalmazásokhoz, mint a [Seedit](/apps/seedit/).

## Hogyan működik az ActivityPub

- **Bejövő és kimenő postafiókok.** Minden fióknak van egy bejövő (inbox) és egy kimenő (outbox)
  postafiókja. A szerverek más szerverek bejövő postafiókjaiba kézbesítik a tevékenységeket, és
  minden fogadó szerver saját másolatot tárol arról, amit a felhasználói követnek.
- **Szerverhez tartozó identitás.** A fiókok és bejegyzések azonosítói HTTPS-címek a kiinduló
  szerver domainjén. A Mastodon-felhasználónév formája `@user@domain`, amelyet WebFingerrel oldanak
  fel, és a föderációs üzeneteket a szerver írja alá a felhasználó nevében.
- **Kliensek.** Az alkalmazások és a böngészők csak a felhasználó saját szerverével kommunikálnak,
  annak API-ján keresztül.
- **Lemmy-közösségek.** A közösség egy példányon hosztolt csoportszereplő. A felhasználók a
  közösségnek küldik a bejegyzéseiket, amely továbbsugározza őket a követőinek; a közös
  fórumszabvány
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) szerint a
  közösség előbb ellenőrizheti a bejegyzéseket, akár a moderátorok kézi jóváhagyásáig menően.
- **Moderálás.** A moderálás minden szerveren helyi. Az adminisztrátorok felfüggeszthetnek fiókokat,
  egész szervereket tilthatnak le, vagy csak egy engedélyezési lista szerint föderálhatnak; a
  Lemmyben ezenfelül minden közösségnek vannak moderátorai.
- **Spamvédelem.** Az ActivityPub nem határoz meg spamvédelmi mechanizmust. A Mastodon és a Lemmy
  jóváhagyással, meghívókkal, jelentkezési kérdésekkel, captchákkal és e-mail-ellenőrzéssel szűri a
  regisztrációkat, utána pedig sebességkorlátokra, jelentésekre és moderálásra támaszkodik.

## Miben különböznek

### Az identitás egy domainhez tartozik

Egy Fediverse-fiók a szervere domainjéhez tartozik. A Mastodon átirányíthatja a követőket egy új
fiókra, de [a bejegyzések nem költöznek](https://docs.joinmastodon.org/user/moving/), a költözést a
régi szerverről kell indítani, és 30 napos várakozási idő vonatkozik rá. A Bitsocialban a profilok
és a közösségek kulcspárok, így a hoszt vagy az alkalmazás cseréje nem változtatja meg az
identitást. Lásd az [Identitás és közösségi tulajdon](/identity-and-ownership/) oldalt.

### Hol él egy közösség

Egy Lemmy-közösség szerkezetileg közel áll egy Bitsocial-közösséghez: a bejegyzések a közösséghez
érkeznek, amely a továbbsugárzás előtt ellenőrizheti őket. A különbség az, hogy hol él.
Lemmy-közösséget csak a létrehozója saját példányán lehet létrehozni, a példány adminisztrátora
[teljes ellenőrzést](https://join-lemmy.org/docs/users/05-censorship-resistance.html) gyakorol
felette, és nincs dokumentált módja annak, hogy egy másik példányra költöztessék. A
Bitsocial-közösség saját kulcspár: a tulajdonos bárhol futtathatja a csomópontját, és nincs fölötte
szerveradminisztrátor.

### Spamvédelem

A Fediverse szerverei a spamet többnyire a regisztrációnál állítják meg, utána pedig moderálnak. Egy
Bitsocial-közösség minden bejegyzésre lefuttat egy kihívást, mielőtt elfogadná, és minden közösség
maga választja meg a sajátját: captcha, engedélyezési lista, fizetés vagy bármilyen más kód. Lásd az
[Egyéni levélszemét-ellenes kihívások](/custom-challenges/) oldalt.

### Az infrastruktúra üzemeltetése

Egy példány üzemeltetéséhez folyamatosan működő szerver kell domainnel, TLS-sel és e-maillel. A
Mastodonnak ezenfelül PostgreSQL, Redis és háttérfolyamatok is kellenek; a Lemmy könnyebb, saját
adatai szerint nagyjából 150 MB RAM-mal beéri. Minden példány másolatot tárol azokról a távoli
tartalmakról, amelyeket a felhasználói követnek. Egy Bitsocial-közösségi csomópontnak nincs szüksége
domainre vagy tanúsítványra, és az asztali alkalmazásból vagy a `bitsocial-cli` segítségével fut.

### Amit a szerverek cserébe adnak

A Fediverse szerverei a teljes előzményt megőrzik és megbízhatóan kiszolgálják, a Mastodon pedig
évek alatt kiforrott moderálási eszközökkel rendelkezik. A Bitsocial nem garantálja, hogy a régi
tartalom örökre megmarad, és a moderálási eszközei az egyes alkalmazásokban találhatók.

## Összehasonlítás

| Kérdés                   | ActivityPub (Mastodon, Lemmy)                                                                          | Bitsocial                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Kategória                | Föderált szerverek                                                                                     | Peer-to-peer közösségi hálózat                                                                      |
| Identitás                | Fiók egy szerver domainjén, a szerver aláírásával                                                      | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                             |
| Hol vannak a bejegyzések | A kiinduló szerveren, valamint másolatban minden követő szerveren                                      | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                  |
| Ki tartja online         | A példányok adminisztrátorai                                                                           | A közösség tulajdonosának csomópontja és a segítő seederek                                          |
| Közösségek               | Egy-egy példányon hosztolt Lemmy-közösségek                                                            | Elsőrangú objektumok, amelyek csomópontja elfogadja vagy elutasítja a bejegyzéseket                 |
| Spamvédelem              | Regisztrációs szűrés, sebességkorlátok, jelentések és moderálás                                        | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                       |
| Moderálás                | Szerveradminisztrátorok és közösségi moderátorok, szerverenként helyben                                | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg |
| Nevek                    | `@user@domain` és `!community@domain` azonosítók                                                       | Kulcsokra feloldódó `.bso` és `.eth` nevek                                                          |
| Böngésző                 | A felhasználó saját szerverének kliense                                                                | Peer-to-peer csomópont egy hagyományos böngészőfülben                                               |
| Fő kompromisszum         | Megbízható előzmények és kiforrott moderálás, de az identitás és a közösségek egy szerverhez tartoznak | Nem kell hozzá szerver vagy domain, de a régi tartalom nem marad meg garantáltan örökre             |
