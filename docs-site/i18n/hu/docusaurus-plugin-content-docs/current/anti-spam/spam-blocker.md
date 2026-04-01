---
title: Spam Blocker
description: Központosított spamészlelési szolgáltatás kockázatpontozással, OAuth-kihívásokkal és konfigurálható szintű küszöbértékekkel.
sidebar_position: 1
---

# Spam Blocker

:::warning Legacy Naming
Ezt a csomagot eredetileg a `@plebbit` hatókörben tették közzé. A neve `@bitsocial/spam-blocker-server` és `@bitsocial/spam-blocker-challenge` lett. A régi nevekre való hivatkozások továbbra is megjelenhetnek a régebbi dokumentációkban vagy kódbázisokban.
:::

A Spam Blocker egy központosított spamészlelő szolgáltatás, amely kiértékeli a beérkező kiadványokat, és kockázati pontszámokat rendel hozzá. Két csomagból áll:

- **`@bitsocial/spam-blocker-server`** – a kiértékelő és kihívást jelentő API-kat kiszolgáló HTTP-kiszolgáló.
- **`@bitsocial/spam-blocker-challenge`** – egy könnyű klienscsomag, amelyet a közösségek integrálva küldhetnek ki értékelésre.

**Forráskód:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Hogyan működik a kockázati pontozás

Minden, a `/evaluate` végponthoz benyújtott kiadvány numerikus kockázati pontszámot kap. A pontszám több jel súlyozott kombinációja:

| Jel              | Leírás                                                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Számla kora      | Az újabb fiókok magasabb kockázati pontszámot kapnak.                                                                                                                            |
| Karma            | A felhalmozott közösségi karma csökkenti a kockázatot.                                                                                                                           |
| A szerző hírneve | A háttérhálózati indexelő által gyűjtött hírnévadatok.                                                                                                                           |
| Tartalomelemzés  | Szövegszintű heurisztika (linksűrűség, ismert spam-minták stb.).                                                                                                                 |
| Sebesség         | Ugyanattól a szerzőtől származó gyors, egymást követő bejegyzések növelik a kockázatot.                                                                                          |
| IP intelligencia | Országszintű földrajzi helymeghatározás és fenyegetés-hírcsatorna keresések. A rendszer csak az országkódokat tárolja – a nyers IP-címeket soha nem osztják meg a közösségekkel. |

## Szintküszöbök

A kockázati pontszám a négy konfigurálható szint egyikére vonatkozik, amelyek meghatározzák, hogy mi történik ezután:

1. **Automatikus elfogadás** -- a pontszám elég alacsony ahhoz, hogy a kiadványt minden kihívás nélkül jóváhagyják.
2. **OAuth-megfelelő** – a folytatáshoz a szerzőnek OAuth-ellenőrzést kell végeznie.
3. **OAuth-plus-more** -- Az OAuth önmagában nem elegendő; további ellenőrzés (pl. CAPTCHA) szükséges.
4. **Automatikus elutasítás** -- a pontszám túl magas; a kiadványt végleg elutasítják.

Az összes küszöbérték közösségenként konfigurálható.

## Challenge Flow

Amikor egy kiadvány olyan szintre esik, amely ellenőrzést igényel, a kihívás folyamata megkezdődik:

1. A szerzőt először az **OAuth** (GitHub, Google, Twitter és más támogatott szolgáltatók) keresztül kell hitelesíteni.
2. Ha az OAuth önmagában nem elegendő (3. szint), megjelenik egy **CAPTCHA tartalék**, amelyet a Cloudflare Turnstile hajt.
3. Az OAuth-identitás kizárólag ellenőrzésre szolgál – **soha nem osztják meg** a közösséggel vagy más felhasználókkal.

## API-végpontok

### `POST /evaluate`

Kiadvány benyújtása kockázatértékeléshez. A kiszámított kockázati pontszámot és a szükséges kihívási szintet adja vissza.

### `POST /challenge/verify`

Küldje be a befejezett kihívás eredményét (OAuth-token, CAPTCHA-megoldás vagy mindkettő) ellenőrzésre.

### `GET /iframe/:sessionId`

Egy beágyazható HTML-oldalt ad vissza, amely az adott munkamenethez megfelelő kihívás-kezelőfelületet jelenít meg.

## Rate Limiting

A díjkorlátokat dinamikusan alkalmazzák a szerző életkora és hírneve alapján. Az újabb vagy gyengébb hírnévvel rendelkező szerzők szigorúbb korlátokkal szembesülnek, míg a bevett szerzők bőkezűbb küszöböt élveznek. Ez megakadályozza a kéretlen levelek özönét anélkül, hogy a megbízható résztvevőket büntetné.

## Háttér hálózati indexelő

A kiszolgáló egy háttérindexelőt futtat, amely folyamatosan feltérképezi a hálózatot a szerző hírnevének összeállítása és karbantartása érdekében. Ezek az adatok közvetlenül bekerülnek a kockázatpontozási folyamatba, lehetővé téve a rendszer számára, hogy felismerje az ismétlődő jóhiszemű résztvevőket a közösségekben.

## Adatvédelem

A Spam Blocker az adatvédelmet szem előtt tartva készült:

- Az OAuth-identitásokat csak kihívás-ellenőrzésre használják, és **soha nem hozzák nyilvánosságra** a közösségek számára.
- Az IP-címek feloldása **csak országkódra**; A nyers IP-címeket nem tárolják és nem osztják meg.

## Adatbázis

A kiszolgáló az **SQLite-ot** használja (a `better-sqlite3`-n keresztül) a hírnévadatok, a munkamenet állapota és a konfiguráció helyi megőrzésére.
